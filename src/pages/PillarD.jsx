import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ThoughtBubble from '../components/ThoughtBubble';

const PURPLE = '#a855f7';
const PURPLE_RGB = '168,85,247';
const ORBIT_ID = 'pd-orbit-kf';

const TABS = [
  { id: 'd0', label: 'Nhập Môn', icon: '🧭', color: '#a855f7', rgb: '168,85,247', frame: 'pd-frame-0' },
  { id: 'd1', label: 'Stress', icon: '🌪️', color: '#8b5cf6', rgb: '139,92,246', frame: 'pd-frame-1' },
  { id: 'd2', label: 'Thở', icon: '🫁', color: '#6366f1', rgb: '99,102,241', frame: 'pd-frame-2' },
  { id: 'd3', label: 'Thiền', icon: '🧘', color: '#d946ef', rgb: '217,70,239', frame: 'pd-frame-3' },
  { id: 'd4', label: 'Journaling', icon: '📓', color: '#ec4899', rgb: '236,72,153', frame: 'pd-frame-4' },
  { id: 'd5', label: 'Digital Detox', icon: '📵', color: '#0ea5e9', rgb: '14,165,233', frame: 'pd-frame-5' },
  { id: 'd6', label: 'Kỷ Luật Mềm', icon: '🌱', color: '#10b981', rgb: '16,185,129', frame: 'pd-frame-6' },
  { id: 'd7', label: 'Theo Dõi', icon: '📊', color: '#f59e0b', rgb: '245,158,11', frame: 'pd-frame-7' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [vis, setVis] = useState(false);
  const [ref, setRef] = useState(null);
  useEffect(() => {
    if (!ref) return;
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); } }, { threshold: 0.07 });
    ob.observe(ref);
    return () => ob.disconnect();
  }, [ref]);
  return (
    <div ref={setRef} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(26px)', transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── Box Breathing Timer (D2 tab) ───────────────────────────────────────────
function BoxBreathTimer({ color }) {
  const [phase, setPhase] = useState('idle');
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const iRef = useRef(null);
  const phaseIdxRef = useRef(0);
  const countRef = useRef(0);
  const PHASES = [
    { key: 'inhale', label: 'Hít vào', dur: 4 },
    { key: 'hold1',  label: 'Giữ',     dur: 4 },
    { key: 'exhale', label: 'Thở ra',  dur: 4 },
    { key: 'hold2',  label: 'Giữ',     dur: 4 },
  ];
  const startStop = () => {
    if (running) {
      clearInterval(iRef.current);
      setRunning(false); setPhase('idle'); setCount(0); phaseIdxRef.current = 0;
    } else {
      setRunning(true); phaseIdxRef.current = 0;
      setPhase(PHASES[0].key); countRef.current = PHASES[0].dur; setCount(PHASES[0].dur);
      iRef.current = setInterval(() => {
        countRef.current -= 1;
        if (countRef.current <= 0) {
          phaseIdxRef.current = (phaseIdxRef.current + 1) % 4;
          const p = PHASES[phaseIdxRef.current];
          setPhase(p.key); countRef.current = p.dur; setCount(p.dur);
        } else { setCount(countRef.current); }
      }, 1000);
    }
  };
  useEffect(() => () => clearInterval(iRef.current), []);
  const curPhase = PHASES.find(p => p.key === phase) || PHASES[0];
  const pct = phase !== 'idle' ? ((curPhase.dur - count) / curPhase.dur) * 100 : 0;
  return (
    <div className="rounded-2xl border border-border bg-bg p-5 flex flex-col items-center gap-3 max-w-xs mx-auto">
      <div className="text-base font-bold uppercase tracking-widest text-muted">Box Breathing · 4-4-4-4</div>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="64" cy="64" r="56" fill="none" stroke={color} strokeWidth="3" opacity="0.2" />
          <circle cx="64" cy="64" r="56" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${2 * Math.PI * 56}`} strokeDashoffset={`${2 * Math.PI * 56 * (1 - pct / 100)}`} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="text-center">
          <div className="text-4xl font-bold text-text">{running ? count : '▶'}</div>
          <div className="text-base text-muted">{running ? curPhase.label : 'Bắt đầu'}</div>
        </div>
      </div>
      <button onClick={startStop} className="px-5 py-2 rounded-full text-lg font-bold transition-all" style={{ background: running ? 'rgba(239,68,68,0.15)' : `rgba(${PURPLE_RGB},0.15)`, color: running ? '#ef4444' : color, border: `1px solid ${running ? 'rgba(239,68,68,0.3)' : `rgba(${PURPLE_RGB},0.3)`}` }}>
        {running ? 'Dừng' : 'Bắt đầu'}
      </button>
    </div>
  );
}

// ─── Journal Prompt (D4 tab) ─────────────────────────────────────────────────
function JournalPrompt({ color, onPromptClick }) {
  const [answers, setAnswers] = useState({});
  const PROMPTS = [
    { id: 'p1', q: 'Hôm nay mình đang cảm thấy gì?' },
    { id: 'p2', q: 'Điều gì làm mình căng nhất?' },
    { id: 'p3', q: 'Hôm nay mình làm tốt điều gì, dù nhỏ?' },
    { id: 'p4', q: 'Ngày mai chỉ cần làm 1 việc quan trọng nào?' },
    { id: 'p5', q: 'Một câu tử tế mình muốn nói với bản thân?' },
  ];
  return (
    <div className="space-y-3">
      {PROMPTS.map((p, i) => (
        <div key={p.id} className="group/prompt rounded-xl border border-border bg-bg p-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="text-base font-bold" style={{ color }}>{i + 1}. {p.q}</div>
            {onPromptClick && (
              <button
                onClick={() => onPromptClick(i)}
                className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/prompt:opacity-100 transition-opacity"
                style={{ color, borderColor: 'rgba(236,72,153,0.35)', background: 'rgba(236,72,153,0.08)' }}
              >chi tiết →</button>
            )}
          </div>
          <textarea value={answers[p.id] || ''} onChange={e => setAnswers(prev => ({ ...prev, [p.id]: e.target.value }))} rows={2} placeholder="Viết tự do, không cần hay..." className="w-full text-lg bg-transparent text-text placeholder:text-muted/40 resize-none outline-none" />
        </div>
      ))}
    </div>
  );
}

// ─── Calm Score (D7 tab) ─────────────────────────────────────────────────────
const D7_ITEM_MODALS = [
  {
    icon: '🫁', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Thở/Thiền ≥ 3 Phút · +25 điểm',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Chỉ 3 phút thở cơ hoành là liều tối thiểu có hiệu quả — đủ để kích hoạt dây thần kinh phế vị và hạ cortisol đo được.',
    detail: '3 phút là ngưỡng tối thiểu mà nghiên cứu ghi nhận sự thay đổi sinh lý rõ ràng: nhịp tim giảm, HRV tăng, vỏ não trước trán (PFC) được kích hoạt trở lại. Không cần dụng cụ, không cần không gian đặc biệt.',
    details: [
      'Vagus nerve (dây thần kinh X) kết nối não với tim, phổi, ruột. Thở chậm sâu kích thích vagus → bật phó giao cảm → hạ nhịp tim + cortisol trong vòng 60–90 giây.',
      'HRV (Heart Rate Variability) tăng sau 3 phút thở nhịp 6 lần/phút — đây là chỉ số sức khỏe thần kinh tự chủ quan trọng, tương quan với khả năng điều tiết cảm xúc.',
      'PFC (vỏ não trước trán) — trung tâm ra quyết định — bị "offline" khi stress cao. Thở cơ hoành đưa PFC trở lại online, cải thiện khả năng phán đoán và kiểm soát xung động.',
      'Sara Lazar (Harvard) ghi nhận người thiền đều đặn có lớp vỏ não dày hơn ở vùng liên quan đến chú ý và tự nhận thức — thay đổi cấu trúc não bắt đầu từ 8 tuần.',
      'Không cần ngồi kiết già hay hết tiếng ồn — thở 4-7-8 hoặc box 4-4-4-4 trong nhà vệ sinh, xe hơi, hay trước màn hình đều đạt hiệu quả tương đương.',
      '"Minimal viable dose" là khái niệm quan trọng: 3 phút mỗi ngày đều đặn > 30 phút mỗi cuối tuần về tổng tác động lên hệ thần kinh và thói quen não bộ.',
    ],
    points: [
      { icon: '🧠', label: 'Vagus Nerve', note: 'Kích hoạt phó giao cảm tức thì' },
      { icon: '📈', label: 'Tăng HRV', note: 'Chỉ số sức khỏe thần kinh tự chủ' },
      { icon: '🎯', label: 'PFC Training', note: 'Đưa não ra quyết định trở lại online' },
      { icon: '📅', label: 'Nhất Quán', note: '3 phút/ngày > 30 phút/tuần' },
    ],
  },
  {
    icon: '📓', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Journal 1–5 Dòng · +20 điểm',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Viết ra giải phóng "open loops" — những suy nghĩ bỏ ngỏ chiếm dung lượng não bộ và gây lo âu nền cả ngày.',
    detail: 'Não bộ không thể "quên" việc chưa làm xong (Hiệu ứng Zeigarnik). Journal không cần đẹp hay dài — 1–5 dòng đủ để đóng open loops và giải phóng bandwidth cho các việc thực sự quan trọng.',
    details: [
      'James Pennebaker (UT Austin) chứng minh viết cảm xúc 15–20 phút trong 3–4 ngày liên tiếp cải thiện hệ miễn dịch, giảm trầm cảm và tăng cảm giác hạnh phúc chủ quan.',
      'Hiệu ứng Zeigarnik: não ghi nhớ việc chưa hoàn thành mạnh hơn việc đã xong — journal tạo "closure" giả lập đủ để não thả ra và ngừng loop những suy nghĩ đó.',
      'Affect labeling (đặt tên cảm xúc bằng ngôn ngữ) kích hoạt vỏ não trước trán, làm giảm hoạt động amygdala — hiệu ứng tương tự liệu pháp nhận thức hành vi CBT.',
      'Growth mindset journaling: ghi nhận 1 điều học được hôm nay (dù nhỏ) tái định hướng não từ tư duy fixed (tôi thất bại) sang growth (tôi đang học).',
      '1–5 dòng là thiết kế có chủ ý: đủ để xả áp mà không tạo thêm gánh nặng "phải viết đủ dài". Mục tiêu là nhất quán, không phải chất lượng từng entry.',
      'Journal trước ngủ hiệu quả nhất vì não đang tổng hợp ký ức ngày (memory consolidation) — ghi lại giúp quá trình này hoàn chỉnh hơn và giảm overthinking ban đêm.',
    ],
    points: [
      { icon: '🔓', label: 'Cognitive Offload', note: 'Giải phóng open loops não bộ' },
      { icon: '🏷️', label: 'Affect Labeling', note: 'Đặt tên cảm xúc → amygdala dịu' },
      { icon: '🌱', label: 'Growth Mindset', note: '1 điều học được mỗi ngày' },
      { icon: '✏️', label: '1–5 Dòng', note: 'Đủ để tạo closure, không quá tải' },
    ],
  },
  {
    icon: '📵', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Digital Detox ≥ 10 Phút · +15 điểm',
    img: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Default Mode Network (DMN) cần idle time để tổng hợp ký ức, tạo kết nối sáng tạo và xử lý cảm xúc — màn hình liên tục chặn toàn bộ quá trình này.',
    detail: 'Mỗi khi không có kích thích bên ngoài, não kích hoạt DMN — mạng lưới "chạy nền" xử lý ký ức, hình thành bản sắc và tạo ra những insight bất ngờ. 10 phút không màn hình là khoảng tối thiểu để DMN khởi động.',
    details: [
      'Default Mode Network (DMN) là mạng nơ-ron kích hoạt khi não "nhàn rỗi" — thực ra đang làm việc tích cực: tổng hợp ký ức, xử lý cảm xúc, lập kế hoạch tương lai, tạo sự đồng cảm.',
      'Gloria Mark (UC Irvine) đo được: mỗi lần bị ngắt quãng cần trung bình 23 phút để đạt lại trạng thái tập trung sâu — điện thoại thông báo mỗi vài phút là vòng lặp phá hủy liên tục.',
      'Dopamine loop của MXH: mỗi lần kéo feed hoặc kiểm tra thông báo là một "variable reward" — cùng cơ chế với máy đánh bạc — làm tăng rưỡng dopamine cần thiết cho niềm vui tự nhiên.',
      'Adrian Ward (UT Austin): chỉ cần điện thoại nằm trên bàn (dù úp mặt và tắt) cũng làm giảm cognitive capacity — não dùng một phần tài nguyên để kháng cự không nhìn điện thoại.',
      '10 phút không màn hình trước ngủ cải thiện chất lượng giấc ngủ rõ rệt: ánh sáng xanh (420–480nm) ức chế melatonin, nhưng tác hại không chỉ là ánh sáng — kích thích tâm lý mới là vấn đề lớn hơn.',
      'Detox không cần vào rừng — đi bộ 10 phút không tai nghe, ăn sáng không màn hình, hoặc nằm im trên giường 10 phút sau thức dậy là đủ để DMN khởi động.',
    ],
    points: [
      { icon: '🌐', label: 'DMN Activation', note: 'Não cần idle để xử lý & sáng tạo' },
      { icon: '🎰', label: 'Dopamine Reset', note: 'Phá vòng lặp variable reward' },
      { icon: '🧠', label: 'Cognitive Reset', note: 'Giải phóng tài nguyên não bộ' },
      { icon: '😴', label: 'Không Tầm Nhìn', note: '10 phút trước ngủ = melatonin tăng' },
    ],
  },
  {
    icon: '🌪️', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Ghi Nhận Stress Trong Ngày · +10 điểm',
    img: 'https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Meta-awareness — khả năng quan sát trạng thái của mình — là kỹ năng can thiệp sớm quan trọng nhất: nhận ra stress ở tầng cơ thể trước khi leo thang thành cảm xúc rồi hành vi.',
    detail: 'Phần lớn stress bùng phát không phải vì sự kiện quá lớn mà vì không được nhận diện sớm. Ghi nhận stress trong ngày không cần phải phân tích sâu — chỉ cần đặt tên và định vị nó ở đâu.',
    details: [
      'Meta-awareness là khả năng quan sát trạng thái nội tâm của mình như một người ngoài cuộc — "Mình đang stress" thay vì "Mình là người bị stress". Tách biệt này giảm đáng kể cường độ cảm giác.',
      'Affect labeling: đặt tên cụ thể cho cảm xúc (frustrated / overwhelmed / disappointed) hiệu quả hơn nhiều so với chỉ nói "stress" hay "mệt" — nghiên cứu fMRI cho thấy amygdala giảm hoạt động ngay lập tức.',
      '3 tầng stress giúp định vị: Cơ thể (vai cứng, thở nông, tim đập) → Cảm xúc (bực, lo, chán) → Hành vi (trì hoãn, ăn vặt, lướt điện thoại). Nhận diện được tầng nào → chọn đúng công cụ.',
      'Self-check 3 lần/ngày (sáng/trưa/tối): "Mình đang ở tầng nào?" mất < 30 giây nhưng ngăn stress tích lũy âm thầm — giống như đọc đồng hồ xăng thay vì chờ xe hết xăng giữa đường.',
      'Stress inoculation: nhận biết stress sớm và xử lý nhỏ hằng ngày thực ra tăng khả năng chịu đựng stress lớn — não học được rằng stress có thể xử lý được, không phải điều cần né tránh.',
      'Ghi nhận không có nghĩa là giải quyết ngay — đôi khi chỉ cần viết "3h chiều hôm nay tôi cảm thấy frustrated vì cuộc họp kéo dài" là đủ để não ngừng loop và tìm cách giải quyết sau.',
    ],
    points: [
      { icon: '👁️', label: 'Meta-Awareness', note: 'Quan sát trạng thái như người ngoài' },
      { icon: '🏷️', label: 'Affect Labeling', note: 'Đặt tên chính xác → amygdala giảm' },
      { icon: '⏰', label: 'Can Thiệp Sớm', note: 'Nhận diện ở tầng cơ thể trước' },
      { icon: '📊', label: 'Calibrate', note: 'Đọc "đồng hồ xăng" stress hằng ngày' },
    ],
  },
  {
    icon: '🌙', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Routine Tối · +15 điểm',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Routine tối là "conditioned sleep cue" — não học được rằng chuỗi hành động nhất định = đến giờ ngủ, giảm latency (thời gian từ nằm xuống đến ngủ được) đáng kể.',
    detail: 'Không cần routine phức tạp — 3 bước nhất quán (ví dụ: tắt đèn sáng → tắm nước ấm → đọc sách giấy) đã đủ tạo phản xạ Pavlov giúp não chuyển trạng thái từ active sang ready-for-sleep.',
    details: [
      'Pavlovian conditioning áp dụng cho giấc ngủ: não liên kết chuỗi hành động với trạng thái ngủ — sau 2–3 tuần lặp lại, chỉ cần bắt đầu bước 1, não đã tự chuẩn bị ngủ trước khi bước cuối kết thúc.',
      'Nghiên cứu Sleep Hygiene RCT (2022): routine ngủ nhất quán ≥ 5 ngày/tuần giảm sleep onset latency trung bình 18 phút và tăng hiệu suất giấc ngủ (sleep efficiency) lên 7–12%.',
      'CAR (Cortisol Awakening Response) và cortisol buổi tối là nghịch nhau: routine tối giảm cortisol cuối ngày, giúp melatonin tăng tự nhiên mà không cần supplement.',
      '"Reset 5 phút" trước ngủ — ngồi im, thở chậm, không màn hình — đủ để hạ norepinephrine (chất dẫn truyền kích thích) và chuyển sang trạng thái phó giao cảm dominant.',
      'Glymphatic system (hệ thống "dọn rác não") hoạt động mạnh nhất trong giấc ngủ sâu (NREM) — routine tốt giúp vào NREM nhanh hơn, tăng thời gian glymphatic hoạt động mỗi đêm.',
      '2–3 bước đơn giản nhất quán > 10 bước routine "hoàn hảo" thỉnh thoảng — não cần sự lặp lại, không cần sự hoàn hảo. Bỏ 1 đêm không làm hỏng habit nếu 6/7 ngày còn lại vẫn giữ.',
    ],
    points: [
      { icon: '🔔', label: 'Conditioned Cue', note: 'Pavlovian reflex — não tự chuẩn bị ngủ' },
      { icon: '⏱️', label: 'Sleep Onset', note: 'Giảm latency 18 phút (RCT 2022)' },
      { icon: '🧹', label: 'Glymphatic', note: 'Vào NREM nhanh → não dọn rác hiệu quả' },
      { icon: '✅', label: '2–3 Phút Đủ', note: 'Nhất quán > phức tạp' },
    ],
  },
  {
    icon: '🌱', color: '#f59e0b', rgb: '245,158,11',
    modalTitle: 'Kỷ Luật Mềm: Không Tự Trách · +15 điểm',
    img: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Self-compassion không phải nhân nhượng — người tự trắc ẩn cao hơn thực ra có trách nhiệm với bản thân cao hơn vì không sợ thất bại làm tê liệt hành động.',
    detail: 'Kỷ luật mềm nghĩa là: không bỏ qua trách nhiệm (không làm → ghi nhận → thử lại) nhưng cũng không punish bản thân (không làm → tự hành → không thử lại). Sự khác biệt nhỏ trong ngôn ngữ tự nói chuyện tạo ra kết quả dài hạn rất khác nhau.',
    details: [
      'Kristen Neff (UT Austin) — người tiên phong nghiên cứu self-compassion: người có self-compassion cao không ít trách nhiệm hơn mà ngược lại — họ sẵn sàng nhìn nhận thất bại vì biết nó không định nghĩa giá trị của họ.',
      'Self-criticism kích hoạt cortisol và threat response — não ở trạng thái này ưu tiên tự bảo vệ, không phải học hỏi hay thay đổi. Tự trách kéo dài là vòng lặp đóng băng hành động.',
      'Self-compassion ≠ self-pity: tự trắc ẩn nhìn nhận khó khăn như một phần của trải nghiệm con người ("nhiều người cũng gặp điều này"), không cô lập mình trong đau khổ.',
      'Oxytocin — hormone kết nối và an toàn — được giải phóng khi tự nói chuyện với bản thân như với một người bạn tốt. Oxytocin đối kháng cortisol và tạo trạng thái bình an, khuyến khích hành động.',
      'Câu thực hành: "Mình đã bỏ qua [việc X] hôm nay. Đó là điều bình thường — nhiều người cũng gặp. Mình sẽ thử lại ngày mai với một cách nhỏ hơn." — đơn giản nhưng đủ để phá vòng lặp tự trách.',
      'Thiết kế checklist này (điểm nhỏ, nhiều hạng mục) là ví dụ kỷ luật mềm trong hành động: ngay cả ngày chỉ được 25/100 điểm cũng là ngày bạn đã làm được điều gì đó, không phải ngày thất bại.',
    ],
    points: [
      { icon: '💚', label: 'Self-Compassion', note: 'Trắc ẩn → trách nhiệm cao hơn' },
      { icon: '🧬', label: 'Oxytocin', note: 'Tự nói chuyện tốt → giải phóng oxytocin' },
      { icon: '🪞', label: 'Identity', note: 'Thất bại ≠ định nghĩa bản thân' },
      { icon: '🔁', label: 'Kỹ Năng', note: 'Không tự trách là kỹ năng học được' },
    ],
  },
];

function CalmScore({ color, onItemClick }) {
  const [checks, setChecks] = useState({});
  const ITEMS = [
    { id: 'breath', label: 'Thở/thiền ≥ 3 phút', pts: 25 },
    { id: 'journal', label: 'Journal 1–5 dòng', pts: 20 },
    { id: 'detox', label: 'Digital detox ≥ 10 phút', pts: 15 },
    { id: 'stress', label: 'Ghi nhận stress trong ngày', pts: 10 },
    { id: 'routine', label: 'Routine tối hoặc reset trước ngủ', pts: 15 },
    { id: 'soft', label: 'Kỷ luật mềm: không tự trách', pts: 15 },
  ];
  const score = ITEMS.reduce((s, i) => s + (checks[i.id] ? i.pts : 0), 0);
  const level = score >= 80 ? { label: 'Xuất sắc', color: '#10b981' } : score >= 60 ? { label: 'Tốt', color: color } : score >= 40 ? { label: 'Đạt', color: '#f59e0b' } : { label: 'Cần cố', color: '#f97316' };
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl font-bold" style={{ color: level.color }}>{score}</div>
        <div>
          <div className="text-base text-muted">/ 100 điểm</div>
          <div className="text-lg font-bold" style={{ color: level.color }}>{level.label}</div>
        </div>
        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden ml-2">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, background: level.color }} />
        </div>
      </div>
      <div className="space-y-2">
        {ITEMS.map((item, i) => (
          <button key={item.id} onClick={() => setChecks(p => ({ ...p, [item.id]: !p[item.id] }))} className={`group/item w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${checks[item.id] ? '' : 'border-border hover:border-purple-500/20'}`} style={{ background: checks[item.id] ? `rgba(${PURPLE_RGB},0.08)` : 'var(--color-surface)', borderColor: checks[item.id] ? `rgba(${PURPLE_RGB},0.3)` : undefined }}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all`} style={{ borderColor: checks[item.id] ? color : '#4b5563', background: checks[item.id] ? color : 'transparent' }}>
              {checks[item.id] && <span className="text-white text-base font-bold">✓</span>}
            </div>
            <span className="flex-1 text-lg text-text">{item.label}</span>
            <span className="text-base font-bold" style={{ color: checks[item.id] ? color : '#6b7280' }}>+{item.pts}</span>
            {onItemClick && (
              <span
                onClick={e => { e.stopPropagation(); onItemClick(i); }}
                className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/item:opacity-100 transition-opacity cursor-pointer"
                style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.08)' }}
              >
                chi tiết →
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Tab panels ──────────────────────────────────────────────────────────────
const D0_CARD_MODALS = [
  {
    icon: '🌪️', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'D1 – Hiểu Stress',
    img: 'https://images.unsplash.com/photo-1505455184862-554165e5f6ba?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Stress không phải kẻ thù — đó là tín hiệu cơ thể cần hành động khôn ngoan hơn.',
    detail: 'Stress xảy ra ở 3 tầng: cơ thể (tim đập, vai căng), cảm xúc (lo, bực), hành vi (lướt điện thoại, ăn vặt). Nhận diện được tầng nào đang kích hoạt giúp chọn đúng công cụ ứng phó.',
    details: [
      'Stress cấp tính (ngắn hạn) thực ra có lợi: tăng tập trung, phản ứng nhanh và hiệu suất tạm thời — đây là phản xạ sinh tồn hàng triệu năm tiến hóa.',
      'Stress mãn tính (kéo dài nhiều tuần) mới gây hại: tăng cortisol liên tục làm suy hệ miễn dịch, gây mất ngủ và tăng nguy cơ bệnh tim mạch.',
      'Vòng lặp lo âu–thói quen: Trigger → suy nghĩ tự động → cảm xúc → hành vi bù đắp (lướt MXH, ăn vặt) → Trigger không được giải quyết, cứ quay lại.',
      'Nhận diện sớm ở tầng cơ thể (vai cứng, thở nông) giúp chèn "điểm dừng" trước khi stress leo thang lên tầng cảm xúc rồi hành vi.',
      'Đặt tên cho cảm xúc (affect labeling) giảm cường độ lo âu — vùng frontal lobe được kích hoạt, amygdala (trung tâm sợ hãi) tự dịu lại theo cơ chế thần kinh.',
      'Mục tiêu không phải "loại bỏ stress" mà là "nhận diện sớm và chọn phản ứng khôn ngoan hơn thay vì phản xạ tự động bù đắp".',
    ],
    points: [
      { icon: '💪', label: 'Tầng Cơ Thể', note: 'Tim đập, thở nông, vai căng' },
      { icon: '😤', label: 'Tầng Cảm Xúc', note: 'Dễ cáu, lo âu, buồn bực' },
      { icon: '🔄', label: 'Tầng Hành Vi', note: 'Ăn vặt, lướt MXH, trì hoãn' },
      { icon: '🔧', label: 'Điểm Dừng', note: 'Thở → đặt tên → việc nhỏ tiếp' },
    ],
  },
  {
    icon: '🫁', color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'D2 – Thở & Hạ Nhịp',
    img: 'https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở có chủ ý là cách duy nhất kiểm soát hệ thần kinh tự chủ bằng ý thức — không cần dụng cụ, không cần thời gian.',
    detail: 'Hệ thần kinh phó giao cảm (rest & digest) được kích hoạt khi thở chậm, sâu. Chỉ 4–5 nhịp thở cơ hoành đã đủ hạ nhịp tim và giảm cortisol đo được trên máy.',
    details: [
      'Hệ thần kinh tự chủ có 2 nhánh: giao cảm (fight-or-flight — tăng nhịp tim, cortisol) và phó giao cảm (rest & digest — hạ nhịp, phục hồi). Thở chậm kích hoạt nhánh phó giao cảm.',
      'Thở cơ hoành tăng biên độ trao đổi O₂/CO₂, kích thích dây thần kinh phế vị (vagus nerve), giúp hạ huyết áp và nhịp tim trong 1–3 phút.',
      'Box breathing (4-4-4-4) được Navy SEALs dùng để kiểm soát trạng thái tinh thần trong tình huống cực kỳ căng thẳng — áp dụng hoàn toàn được cho cuộc sống thường ngày.',
      'Thở 4-7-8 kéo dài thời gian giữ hơi (7 giây) làm tăng CO₂ máu tạm thời, kích thích phản xạ thư giãn sâu — đặc biệt hiệu quả 20 phút trước khi ngủ.',
      'Reset 2 phút (5 nhịp thở + thả lỏng vai–hàm–bàn tay) đủ để chuyển trạng thái từ reactive (phản ứng bốc đồng) sang responsive (phản ứng có chủ ý).',
      'Thực hành thở cơ hoành đều đặn 10 phút/ngày có thể giảm huyết áp tâm thu 5–10 mmHg sau 4 tuần — tương đương tác động của vận động aerobic nhẹ.',
    ],
    points: [
      { icon: '🫁', label: 'Cơ Hoành', note: 'Nền tảng — dùng mọi lúc' },
      { icon: '⬜', label: 'Box 4-4-4-4', note: 'Tập trung & bình tĩnh nhanh' },
      { icon: '🌊', label: 'Thở 4-7-8', note: 'Chuẩn bị cho giấc ngủ' },
      { icon: '⚡', label: 'Reset 2 Phút', note: 'Dùng ngay khi quá tải' },
    ],
  },
  {
    icon: '🧘', color: '#d946ef', rgb: '217,70,239',
    modalTitle: 'D3 – Thiền & Chánh Niệm',
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thiền 8 tuần thay đổi cấu trúc vật lý của não — hippocampus dày hơn, amygdala nhỏ hơn.',
    detail: 'Thiền không phải là "không suy nghĩ". Thiền là nhận ra mình đang bị cuốn đi và nhẹ nhàng quay lại. Mỗi lần não lang thang rồi quay lại là một rep luyện tập cho cơ chú ý.',
    details: [
      'Nghiên cứu Harvard (Sara Lazar, 2011): 8 tuần thiền chánh niệm làm dày vỏ não trước trán (kiểm soát cảm xúc và quyết định) và thu nhỏ amygdala (trung tâm lo âu).',
      'Thiền chánh niệm giảm triệu chứng lo âu và trầm cảm nhẹ–vừa, hiệu quả tương đương liệu pháp nhận thức hành vi (CBT) trong một số thử nghiệm ngẫu nhiên có đối chứng.',
      'Body scan 5 phút trước ngủ kích hoạt hệ phó giao cảm mạnh và giảm cortisol — người thiền body scan ngủ nhanh hơn và ít thức giữa đêm hơn trong nghiên cứu về insomnia.',
      'Chánh niệm khi ăn (mindful eating) giảm ăn theo cảm xúc và tăng nhận thức tín hiệu no — não nhận tín hiệu no sau 20 phút, chánh niệm giúp "chờ" đủ thời gian đó.',
      'Đi bộ chánh niệm (không tai nghe, cảm nhận bàn chân) kết hợp vận động nhẹ và thiền — hai lợi ích song song trong cùng 10–15 phút mỗi ngày.',
      'Thiền không cần ngồi im 1 tiếng hay ngồi kiết già. 3 phút mỗi ngày là đủ để xây dựng thói quen và nhận thấy hiệu quả rõ ràng sau 2–3 tuần.',
    ],
    points: [
      { icon: '🧠', label: 'Não Khỏe Hơn', note: 'Hippocampus dày sau 8 tuần' },
      { icon: '😌', label: 'Giảm Lo Âu', note: 'Tương đương CBT nhẹ–vừa' },
      { icon: '😴', label: 'Ngủ Tốt Hơn', note: 'Body scan trước ngủ 5 phút' },
      { icon: '🔄', label: 'Bắt Đầu 3 Phút', note: 'Lang thang → quay lại = tập' },
    ],
  },
  {
    icon: '📓', color: '#ec4899', rgb: '236,72,153',
    modalTitle: 'D4 – Journaling 5 Dòng',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Viết ra suy nghĩ giảm lo âu vì não không cần "giữ" chúng nữa — gọi là cognitive offloading.',
    detail: 'Journaling không phải nhật ký kể chuyện. 5 câu hỏi có cấu trúc mỗi tối giúp não xử lý cảm xúc, nhận ra vấn đề thực sự và chuẩn bị cho ngày mai nhẹ nhàng hơn.',
    details: [
      'James Pennebaker (UT Austin, từ 1986): viết ra suy nghĩ và cảm xúc khó khăn (expressive writing) giảm lo âu, tăng hệ miễn dịch và cải thiện giấc ngủ — hiệu quả rõ sau 3–4 ngày viết liên tiếp.',
      'Cognitive offloading: não không cần "giữ" những việc chưa giải quyết khi đã viết ra — giảm vòng lặp suy nghĩ lặp đi lặp lại (rumination) chiếm băng thông nhận thức.',
      'Câu hỏi "Hôm nay mình cảm thấy gì?" kích hoạt affect labeling — não đặt tên cảm xúc thay vì chỉ cảm nhận mơ hồ, từ đó giảm hoạt động amygdala đo được trên fMRI.',
      'Journal sau ngày fail: viết "Điều gì không ổn? Mình rút ra được gì?" chuyển thất bại thành bài học rõ ràng, giảm tự trách vô ích và tăng khả năng thử lại.',
      'Chỉ cần 5–8 phút mỗi tối. Không cần viết đẹp, đúng ngữ pháp hay đủ câu. Viết tự do — não không quan tâm hình thức, chỉ quan tâm việc được xả.',
      '"Một câu tử tế với bản thân" cuối mỗi buổi journal là thực hành self-compassion có cơ sở khoa học — không phải tự khen mà là xác nhận rằng mình đang cố gắng.',
    ],
    points: [
      { icon: '🧠', label: 'Xả Não', note: 'Đưa rác ra khỏi đầu' },
      { icon: '😌', label: 'Xử Lý Cảm Xúc', note: 'Đặt tên = amygdala dịu lại' },
      { icon: '📈', label: 'Rút Bài Học', note: 'Journal sau ngày fail' },
      { icon: '💙', label: 'Tử Tế Bản Thân', note: 'Self-compassion hằng ngày' },
    ],
  },
  {
    icon: '📵', color: '#0ea5e9', rgb: '14,165,233',
    modalTitle: 'D5 – Digital Detox',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Màn hình trước ngủ ức chế melatonin lên đến 23% — làm trễ giờ ngủ trung bình 1,5 giờ.',
    detail: 'Vấn đề không phải điện thoại mà là lướt vô thức khi não mệt. Digital detox là thiết kế lại môi trường số để não có khoảng thở — không cần ép bỏ điện thoại hoàn toàn.',
    details: [
      'Ánh sáng xanh (blue light) từ màn hình điện thoại ức chế melatonin — hormone điều tiết giấc ngủ. Dùng màn hình 2 giờ trước ngủ có thể trì hoãn giờ ngủ trung bình 1,5 giờ.',
      'Social media feed thiết kế theo nguyên lý "variable reward" (phần thưởng ngẫu nhiên) — cùng cơ chế với máy đánh bạc, kích hoạt dopamine và tạo hành vi lướt vô thức.',
      'Thông báo liên tục phân mảnh sự tập trung (cognitive fragmentation) — mỗi interrupt cần trung bình 23 phút để não quay lại trạng thái tập trung sâu (nghiên cứu của Gloria Mark, UC Irvine).',
      '30 phút đầu ngày không điện thoại tạo "khoảng trống nhận thức" — não không ở trạng thái reactive (phản ứng với thông báo) ngay từ khi mở mắt.',
      'Menu thay thế hiệu quả hơn ý chí thuần túy: khi muốn lướt, thay bằng thở 5 nhịp, ra ngoài 2 phút, uống nước, hoặc ghi nhanh 1 câu đang nghĩ trong đầu.',
      'Thiết kế môi trường số: app gây nghiện ở màn hình 2 hoặc trong thư mục khó tìm, điện thoại để phòng khác khi ngủ — giảm trigger lướt tự động đến 80% mà không cần ý chí.',
    ],
    points: [
      { icon: '😴', label: 'Ngủ Ngon Hơn', note: 'Tắt màn hình 20ph trước ngủ' },
      { icon: '🎯', label: 'Tập Trung Sâu', note: 'Tắt thông báo khi làm việc' },
      { icon: '🧘', label: 'Khoảng Trống', note: '10 phút/ngày không màn hình' },
      { icon: '🏠', label: 'Môi Trường Số', note: 'App nghiện ở màn hình 2' },
    ],
  },
  {
    icon: '🌱', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'D6 – Kỷ Luật Mềm',
    img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ý chí là nguồn lực hữu hạn. Hệ thống nhỏ và self-compassion mới tạo thói quen bền vững.',
    detail: 'Kỷ luật mềm không phải dễ dãi — đó là cách quay lại sau ngày lệch mà không tự trách. Không bù gấp đôi. Không bỏ cuộc. Chỉ cần bản nhỏ nhất.',
    details: [
      'Ý chí hoạt động như cơ bắp — dùng nhiều sẽ mệt (ego depletion). Quyết định sau cùng trong ngày thường tệ hơn quyết định đầu ngày. Hệ thống nhỏ thay thế ý chí mới bền vững.',
      'Quy tắc "không bao giờ bỏ lỡ hai lần liên tiếp" (James Clear, Atomic Habits) thực tế hơn "không bao giờ bỏ" — vì cuộc sống luôn có ngày không thể hoàn hảo.',
      'Quy tắc 1%: tập 1 phút vẫn tốt hơn 0 phút. Bản nhỏ nhất duy trì danh tính "người tập/người thiền" — danh tính đó quan trọng hơn số phút thực tế thực hiện.',
      'Tự trách (self-criticism) sau ngày fail kích hoạt thêm stress — phản tác dụng, làm tăng xác suất bỏ cuộc hẳn so với người tự nhẹ nhàng hơn với bản thân.',
      'Self-compassion (Kristen Neff, UT Austin): tử tế với bản thân sau thất bại tăng khả năng thử lại và kiên trì — ngược với lo ngại rằng tự thương hại sẽ làm người ta lười.',
      'Habit stacking: ghép thói quen mới vào sau thói quen cũ ("Sau khi đánh răng, tôi thiền 3 phút") giảm ma sát khởi động và tăng tỷ lệ duy trì theo nghiên cứu hành vi của BJ Fogg.',
    ],
    points: [
      { icon: '🔄', label: 'Quy Tắc 1%', note: 'Bản nhỏ nhất vẫn là thắng' },
      { icon: '💙', label: 'Không Tự Trách', note: 'Self-compassion tăng kiên trì' },
      { icon: '🔗', label: 'Habit Stacking', note: 'Ghép vào thói quen hiện có' },
      { icon: '🏗️', label: 'Hệ Thống Nhỏ', note: 'Thiết kế thay vì dùng ý chí' },
    ],
  },
];

const D0_CARDS = [
  { icon: '🌪️', title: 'D1 – Hiểu Stress', desc: 'Nhận diện 3 tầng stress: cơ thể, cảm xúc, hành vi. Vòng lặp lo âu – thói quen.' },
  { icon: '🫁', title: 'D2 – Thở & Hạ Nhịp', desc: 'Thở cơ hoành, box breathing 4-4-4-4, thở 4-7-8, reset 2 phút.' },
  { icon: '🧘', title: 'D3 – Thiền & Chánh Niệm', desc: 'Thiền 3 phút cho người mới. Body scan 5 phút. Chánh niệm khi ăn, đi bộ.' },
  { icon: '📓', title: 'D4 – Journaling 5 Dòng', desc: '5 câu hỏi mỗi tối. Xả não khi quá tải. Journal sau ngày fail.' },
  { icon: '📵', title: 'D5 – Digital Detox', desc: '3 mức: dễ → chuẩn → nâng cao. Giảm màn hình trước ngủ, tắt thông báo.' },
  { icon: '🌱', title: 'D6 – Kỷ Luật Mềm', desc: 'Không tự trách. Quy tắc 1% quay lại. Thói quen nhỏ bền vững.' },
];

function D0Panel({ color, onCardClick }) {
  return (
    <div className="space-y-4">
      <p className="text-lg text-muted leading-relaxed">Trụ cột D không biến bạn thành người "luôn bình tĩnh". Nó cung cấp bộ công cụ dùng ngay khi căng: thở khi stress, viết khi rối, tắt màn hình khi quá tải.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {D0_CARDS.map((m, i) => (
          <div
            key={m.title}
            className={`group/card rounded-xl border bg-bg p-4 transition-all duration-200 ${onCardClick ? 'cursor-pointer border-border hover:border-purple-500/40 hover:bg-white/[0.03] hover:shadow-[0_0_18px_rgba(168,85,247,0.08)]' : 'border-border hover:border-purple-500/20'}`}
            onClick={onCardClick ? () => onCardClick(i) : undefined}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{m.icon}</span>
              <span className="text-lg font-bold text-text flex-1">{m.title}</span>
              {onCardClick && (
                <span
                  className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/card:opacity-100 transition-opacity"
                  style={{ color: D0_CARD_MODALS[i].color, borderColor: `rgba(${D0_CARD_MODALS[i].rgb},0.35)`, background: `rgba(${D0_CARD_MODALS[i].rgb},0.08)` }}
                >chi tiết →</span>
              )}
            </div>
            <p className="text-base text-muted leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-4 text-lg text-muted leading-relaxed" style={{ borderColor: `rgba(${PURPLE_RGB},0.2)`, background: `rgba(${PURPLE_RGB},0.06)` }}>
        <span className="font-bold" style={{ color }}>⚠️ Quy tắc an toàn: </span>
        Trụ cột D chỉ là giáo dục sức khỏe phổ thông. Nếu lo âu/buồn bã kéo dài nhiều tuần, mất ngủ nặng, cơn hoảng sợ lặp lại hoặc ý nghĩ tự làm hại bản thân — hãy tìm hỗ trợ chuyên môn.
      </div>
    </div>
  );
}

const D1_LAYER_MODALS = [
  {
    icon: '💪', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Tầng Cơ Thể',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cơ thể cảnh báo stress trước khi ý thức nhận ra — học cách đọc tín hiệu sớm để can thiệp kịp thời.',
    detail: 'Tầng cơ thể là tầng đầu tiên và nhanh nhất trong phản ứng stress. Nhận diện được các tín hiệu vật lý này giúp bạn chặn chuỗi phản ứng trước khi nó leo thang.',
    details: [
      'Tim đập nhanh (tachycardia) khi stress do adrenaline và noradrenaline được tuyến thượng thận bơm vào máu trong vòng vài giây — phản xạ fight-or-flight nguyên thủy.',
      'Vai và gáy căng là phản ứng phòng thủ tiến hóa — cơ thể co rút để bảo vệ đầu và cổ khi nhận tín hiệu nguy hiểm, kể cả khi nguy hiểm chỉ là email từ sếp.',
      'Thở nông (shallow breathing) giảm O₂ lên não, làm tăng cảm giác lo âu và mờ đầu — tạo vòng phản hồi: stress → thở nông → lo hơn → thở nông hơn.',
      'Khó ngủ khi stress mãn tính do cortisol không hạ đủ vào buổi tối — bình thường cortisol thấp nhất lúc 3–4h sáng, nhưng căng thẳng kéo dài phá vỡ nhịp này.',
      'Tiêu hóa bị ảnh hưởng qua trục ruột-não (gut-brain axis): hệ giao cảm ức chế tiêu hóa khi stress, gây đau bụng, đầy bụng hoặc tiêu chảy khi căng thẳng kéo dài.',
      'Điểm vàng: nhận ra tín hiệu cơ thể (vai cứng, thở nông) ngay lúc xuất hiện cho phép can thiệp ở ngưỡng thấp nhất — 1 nhịp thở sâu đủ để bắt đầu đảo ngược chuỗi phản ứng.',
    ],
    points: [
      { icon: '❤️', label: 'Tim Đập Nhanh', note: 'Adrenaline trong vòng giây' },
      { icon: '💪', label: 'Vai Gáy Căng', note: 'Phản xạ bảo vệ nguyên thủy' },
      { icon: '🌬️', label: 'Thở Nông', note: 'Vòng phản hồi làm stress hơn' },
      { icon: '😴', label: 'Khó Ngủ', note: 'Cortisol cao buổi tối' },
    ],
  },
  {
    icon: '😤', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Tầng Cảm Xúc',
    img: 'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Cảm xúc không phải yếu đuối — đó là dữ liệu não gửi cho bạn về mức "nguy hiểm" của tình huống.',
    detail: 'Tầng cảm xúc xuất hiện sau tầng cơ thể và khó nhận biết hơn vì thường bị gán nhãn "tính cách xấu" thay vì "phản ứng stress". Nhận diện đúng cho phép xử lý đúng.',
    details: [
      'Dễ cáu (irritability) khi stress do amygdala bị kích hoạt quá mức — ngưỡng phản ứng cảm xúc giảm xuống, những việc nhỏ trở thành "cọng rơm cuối cùng gãy lưng lạc đà".',
      'Lo lắng là cảm xúc hướng về tương lai — não tạo ra "kịch bản tệ nhất" như cơ chế chuẩn bị sinh tồn, kể cả khi tình huống thực tế không nguy hiểm như não nghĩ.',
      'Buồn bực khi stress mãn tính do cortisol ức chế serotonin và dopamine — hai neurotransmitter liên quan đến cảm giác hài lòng, động lực và kết nối xã hội.',
      'Mất kiên nhẫn khi mệt do vỏ não trước trán (prefrontal cortex — kiểm soát xung lực) bị "offline" khi stress cao, não chuyển sang chế độ phản ứng thay vì suy nghĩ có chủ ý.',
      'Đặt tên cho cảm xúc (affect labeling): nói hoặc viết "Tôi đang cảm thấy lo" làm giảm hoạt động amygdala đo được trên fMRI — không chỉ "hữu ích về tâm lý" mà là thay đổi vật lý trong não.',
      'Cảm xúc khó chịu không cần bị loại bỏ — chỉ cần được nhận diện và đặt tên. Sau đó não có thể tiếp tục xử lý tình huống thay vì bị mắc kẹt trong phản ứng tự động.',
    ],
    points: [
      { icon: '😤', label: 'Dễ Cáu', note: 'Amygdala kích hoạt quá mức' },
      { icon: '😰', label: 'Lo Lắng', note: 'Não tạo kịch bản tệ nhất' },
      { icon: '😔', label: 'Buồn Bực', note: 'Cortisol ức chế serotonin' },
      { icon: '🏷️', label: 'Đặt Tên Cảm Xúc', note: 'Affect labeling hạ amygdala' },
    ],
  },
  {
    icon: '🔄', color: '#8b5cf6', rgb: '139,92,246',
    modalTitle: 'Tầng Hành Vi',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Hành vi bù đắp (ăn vặt, lướt điện thoại) giải quyết cảm xúc ngắn hạn nhưng kéo dài stress dài hạn.',
    detail: 'Tầng hành vi là tầng cuối cùng và dễ nhìn thấy nhất — nhưng can thiệp ở đây không hiệu quả bằng can thiệp ở tầng cơ thể hoặc cảm xúc trước đó.',
    details: [
      'Ăn vặt khi stress là phản ứng sinh học: dopamine từ đường và chất béo tạm thời giảm cortisol, nhưng đường huyết tăng vọt rồi tụt nhanh làm mood xuống thêm sau 30–60 phút.',
      'Lướt điện thoại khi mệt là "kháng stress" kém hiệu quả — dopamine từ scroll ngắn hạn không bù đắp cognitive load tích lũy và còn trì hoãn việc xử lý cảm xúc thực sự.',
      'Trì hoãn (procrastination) khi stress cao do não vào "survival mode" — chỉ ưu tiên việc an toàn và quen thuộc, tránh việc khó và không chắc chắn dù biết cần làm.',
      'Bỏ tập thể dục khi bận/mệt là nghịch lý: tập thể dục chính là thuốc giảm cortisol hiệu quả nhất, nhưng khi stress cao, ngưỡng động lực để bắt đầu tập lại tăng lên đáng kể.',
      'Thói quen bù đắp giải quyết cảm xúc ngắn hạn nhưng không giải quyết Trigger — vòng lặp bắt đầu lại vì nguồn gốc stress chưa được xử lý thực sự.',
      'Điểm can thiệp hiệu quả nhất là ở đầu vòng lặp (nhận diện Trigger) hoặc ở giữa (khoảng trống giữa suy nghĩ tự động và hành vi) — không phải sau khi hành vi bù đắp đã xảy ra rồi.',
    ],
    points: [
      { icon: '🍕', label: 'Ăn Vặt', note: 'Dopamine ngắn, mood tụt dài' },
      { icon: '📱', label: 'Lướt Điện Thoại', note: 'Không xử lý được stress gốc' },
      { icon: '⏰', label: 'Trì Hoãn', note: 'Não vào survival mode' },
      { icon: '🔄', label: 'Can Thiệp Sớm', note: 'Nhận Trigger trước khi hành vi' },
    ],
  },
];

function D1Panel({ color, onLayerClick }) {
  const [openLoop, setOpenLoop] = useState(null);
  const D1_LAYERS = [
    { icon: '💪', label: 'Cơ Thể', signs: ['Tim đập nhanh', 'Căng vai gáy', 'Thở nông', 'Khó ngủ'] },
    { icon: '😤', label: 'Cảm Xúc', signs: ['Dễ cáu', 'Lo lắng', 'Buồn bực', 'Mất kiên nhẫn'] },
    { icon: '🔄', label: 'Hành Vi', signs: ['Ăn vặt', 'Lướt điện thoại', 'Trì hoãn', 'Bỏ tập'] },
  ];
  const LOOPS = [
    { trigger: 'Sếp nhắn tin gấp', thought: '"Chắc mình làm sai"', emotion: 'Lo, tim đập nhanh', behavior: 'Mở điện thoại liên tục', result: 'Mệt, làm việc kém hơn' },
    { trigger: 'Thấy người khác thành công', thought: '"Mình không bằng ai"', emotion: 'Tự ti, chán nản', behavior: 'Lướt mạng xã hội nhiều hơn', result: 'Càng so sánh, càng mệt' },
    { trigger: 'Deadline gấp', thought: '"Không xong được đâu"', emotion: 'Lo lắng, tê liệt', behavior: 'Trì hoãn, làm việc khác', result: 'Deadline càng gần, panic càng tăng' },
  ];
  return (
    <div className="space-y-5">
      <div>
        <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color }}>3 Tầng Của Stress</div>
        <div className="grid grid-cols-3 gap-2">
          {D1_LAYERS.map((t, i) => (
            <div
              key={t.label}
              className={`group/layer rounded-xl border bg-bg p-3 transition-all duration-200 ${onLayerClick ? 'cursor-pointer border-border hover:border-purple-500/40 hover:bg-white/[0.03]' : 'border-border'}`}
              onClick={onLayerClick ? () => onLayerClick(i) : undefined}
            >
              <div className="text-2xl mb-1 text-center">{t.icon}</div>
              <div className="text-base font-bold text-center mb-2" style={{ color }}>{t.label}</div>
              <ul className="space-y-0.5">{t.signs.map(s => <li key={s} className="text-base text-muted text-center">{s}</li>)}</ul>
              {onLayerClick && (
                <div className="text-center mt-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/layer:opacity-100 transition-opacity"
                    style={{ color: D1_LAYER_MODALS[i].color, borderColor: `rgba(${D1_LAYER_MODALS[i].rgb},0.35)`, background: `rgba(${D1_LAYER_MODALS[i].rgb},0.08)` }}>
                    chi tiết →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="text-base font-bold uppercase tracking-widest mb-3" style={{ color }}>Vòng Lặp Lo Âu – Thói Quen</div>
        <div className="space-y-2">
          {LOOPS.map((l, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <button onClick={() => setOpenLoop(openLoop === i ? null : i)} className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left">
                <span className="text-lg font-medium text-text flex-1">Trigger: {l.trigger}</span>
                <span className="text-muted text-base">{openLoop === i ? '▲' : '▼'}</span>
              </button>
              {openLoop === i && (
                <div className="px-3 pb-3">
                  <div className="flex flex-wrap gap-1 text-base">
                    {[['💭', 'Suy nghĩ', l.thought], ['😟', 'Cảm xúc', l.emotion], ['📱', 'Hành vi', l.behavior], ['💢', 'Hậu quả', l.result]].map(([ic, lb, val]) => (
                      <div key={lb} className="rounded-lg p-2 flex-1 min-w-[120px]" style={{ background: `rgba(${PURPLE_RGB},0.08)` }}>
                        <div className="font-bold" style={{ color }}>{ic} {lb}</div>
                        <div className="text-muted mt-0.5">{val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-base text-muted p-2 rounded-lg border border-border">
                    🔧 <strong style={{ color }}>Điểm dừng:</strong> Thở 1 phút → gọi tên cảm xúc → chọn việc nhỏ tiếp theo.
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const D2_TECH_MODALS = [
  {
    icon: '🫁', color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Thở Cơ Hoành',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở cơ hoành là nền tảng của mọi kỹ thuật thở — 70% sức mạnh hơi thở đến từ cơ này, nhưng hầu hết người hiện đại đã lãng quên nó vì căng thẳng mãn tính.',
    detail: 'Cơ hoành là cơ thở chính, nằm ngay dưới phổi. Khi thở đúng, bụng phồng ra khi hít vào (cơ hoành hạ xuống). Hầu hết người thành thị thở bằng ngực — chỉ dùng 1/3 dung tích phổi.',
    details: [
      'Cơ hoành chịu trách nhiệm 70–80% công việc thở khi nghỉ ngơi, nhưng căng thẳng mãn tính và thói quen ngồi sai tư thế khiến nhiều người chuyển sang thở ngực.',
      'Thở ngực chỉ dùng 1/3 dung tích phổi, dẫn đến hyperventilation nhẹ — CO₂ dao động làm kích hoạt hệ thần kinh giao cảm và tạo cảm giác lo âu không rõ nguyên do.',
      'Thở cơ hoành kích thích dây thần kinh phế vị (vagus nerve) chạy qua cơ hoành — đây là "đường cao tốc" trực tiếp kích hoạt hệ phó giao cảm (rest & digest).',
      'Chỉ 5 phút thở cơ hoành đủ để giảm nhịp tim 5–10 bpm và hạ huyết áp tâm thu 5–8 mmHg — đo được trong các thử nghiệm kiểm soát.',
      'Cơ hoành, cơ sàn chậu, cơ thắt lưng và cơ bụng sâu hoạt động như một hệ thống — thở cơ hoành đúng cải thiện tư thế, giảm đau lưng và tăng ổn định cột sống.',
      'Test nhanh: đặt 1 tay lên ngực, 1 tay lên bụng. Hít vào — nếu tay bụng nhô lên nhiều hơn tay ngực là đúng. Hầu hết người mới sẽ thấy tay ngực nhô hơn.',
    ],
    points: [
      { icon: '🫁', label: 'Cơ Bắp Thở', note: '70% công việc thở mỗi ngày' },
      { icon: '⚡', label: 'Vagus Nerve', note: 'Kích hoạt rest & digest' },
      { icon: '❤️', label: 'Hạ Nhịp Tim', note: '5–10 bpm sau 5 phút' },
      { icon: '✅', label: 'Test Nhanh', note: '1 tay ngực, 1 tay bụng' },
    ],
  },
  {
    icon: '⬜', color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Box Breathing 4-4-4-4',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Box breathing cân bằng hệ thần kinh tự chủ bằng nhịp điệu đối xứng — kỹ thuật Navy SEALs dùng để duy trì tư duy rõ ràng trong tình huống nguy hiểm tính mạng.',
    detail: 'Bốn giai đoạn bằng nhau (4-4-4-4) tạo "hộp" hơi thở đối xứng. Nhịp điệu này kích hoạt HRV (Heart Rate Variability) cao — dấu hiệu hệ thần kinh linh hoạt và khỏe mạnh.',
    details: [
      'Box breathing được Mark Divine phổ biến trong huấn luyện Navy SEALs — dùng để kiểm soát adrenaline, giảm sợ hãi và duy trì tư duy rõ ràng khi áp lực tột độ.',
      'Giai đoạn "giữ hơi" làm tăng áp lực trong phổi tạm thời, kích thích baroreceptors trên động mạch chủ, gửi tín hiệu "an toàn" lên não và hạ hoạt động amygdala.',
      'HRV (Heart Rate Variability — độ biến thiên nhịp tim) tăng khi thực hành box breathing đều đặn. HRV cao liên quan đến khả năng phục hồi, kiểm soát cảm xúc và hiệu suất nhận thức tốt hơn.',
      'Box breathing giảm cortisol nhanh hơn thở tự nhiên trong một số RCT vì cấu trúc có chủ ý buộc sự tập trung hoàn toàn của não vào hơi thở — không còn bandwidth cho lo âu.',
      'Dùng hiệu quả nhất trong 3 tình huống: trước việc quan trọng (tăng tập trung), khi bực tức (hạ ngưỡng phản ứng), và giữa ngày khi mất tập trung (reset nhận thức).',
      'Timer trong trang D2 này cho phép thực hành ngay: 4 vòng × 16 giây = 64 giây là đủ để cảm nhận hiệu quả rõ ràng — thử ngay sau khi đóng modal này.',
    ],
    points: [
      { icon: '🎖️', label: 'Navy SEALs', note: 'Dùng trong tình huống cực căng' },
      { icon: '❤️', label: 'Tăng HRV', note: 'Hệ thần kinh linh hoạt hơn' },
      { icon: '🧠', label: 'Reset Nhận Thức', note: '64 giây = 4 vòng đầy đủ' },
      { icon: '⬜', label: '4-4-4-4', note: 'Đối xứng = cân bằng tối ưu' },
    ],
  },
  {
    icon: '🌊', color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Thở 4-7-8',
    img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Thở 4-7-8 của Dr. Andrew Weil được gọi là "thuốc an thần tự nhiên" — giữ hơi 7 giây tạo phản xạ thư giãn sâu không thể đạt được bằng thở thông thường.',
    detail: 'Tỉ lệ 1:2 (hít vào : thở ra) là tỉ lệ tối ưu nhất để kích hoạt hệ phó giao cảm. Thở 4-7-8 đẩy tỉ lệ này lên cực đại (4 : 8) với thêm giai đoạn giữ hơi để tăng cường hiệu quả.',
    details: [
      'Dr. Andrew Weil (Harvard Medical School) phát triển kỹ thuật 4-7-8 dựa trên pranayama yoga và nghiên cứu HRV. Ông gọi đây là "công cụ thư giãn tự nhiên mạnh nhất" trong thực hành y khoa của mình.',
      'Giữ hơi 7 giây làm tăng CO₂ trong máu tạm thời (hypercapnia nhẹ), kích thích chemoreceptors trên thân não tạo phản xạ thư giãn sâu — tương tự cơ chế "hold breath" trong freediving.',
      'Thở ra 8 giây (gấp đôi hít vào) kích hoạt phản xạ phó giao cảm mạnh hơn bất kỳ tỉ lệ nào khác theo nghiên cứu về autonomic nervous system — não đọc thở ra dài là "tôi đang an toàn".',
      'Hiệu quả đặc biệt trước khi ngủ: làm chậm nhịp tim, hạ huyết áp và giảm nhiệt độ cơ thể — 3 yếu tố sinh lý cần thiết để cơ thể chuyển từ thức sang ngủ.',
      'Khác với box breathing (vừa thư giãn vừa tỉnh táo), 4-7-8 thiên về thư giãn sâu — không nên dùng trước khi cần tập trung cao độ hoặc lái xe.',
      'Bắt đầu với 3–4 vòng. Nếu cảm thấy chóng mặt (CO₂ biến động), giảm xuống tỉ lệ 3-5-6 trước khi thực hành 4-7-8 đầy đủ.',
    ],
    points: [
      { icon: '🌊', label: 'Tỉ Lệ 1:2', note: 'Hít:thở ra tối ưu nhất' },
      { icon: '💤', label: 'Trước Ngủ', note: 'Hạ nhịp tim & nhiệt độ cơ thể' },
      { icon: '🧬', label: 'CO₂ Kỹ Thuật', note: 'Giữ 7s tạo phản xạ sâu' },
      { icon: '⚠️', label: 'Lưu Ý', note: 'Không dùng trước khi cần tập trung' },
    ],
  },
  {
    icon: '⚡', color: '#6366f1', rgb: '99,102,241',
    modalTitle: 'Reset 2 Phút',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Reset 2 phút không phải thiền — đó là "pattern interrupt" ngắt mạch phản ứng tự động, cho não 120 giây chuyển từ reactive sang responsive.',
    detail: 'Khi quá tải, não ở trạng thái fight-or-flight và không thể tư duy rõ ràng. Reset 2 phút tạo khoảng trống giữa kích thích và phản ứng — và trong khoảng trống đó bạn lấy lại quyền kiểm soát.',
    details: [
      'Pattern interrupt là kỹ thuật trong NLP và CBT: ngắt chuỗi suy nghĩ/hành vi tự động bằng một hành động có chủ ý đủ để não chuyển từ phản ứng tự động sang nhận thức có ý thức.',
      'Dừng 10 giây không cầm điện thoại là bước khó nhất — điện thoại là "hành vi mặc định" khi não mệt và không có việc gì để làm. Ngắt thói quen này là toàn bộ mục đích của bước 1.',
      'Thả lỏng vai–hàm–bàn tay nhắm đến 3 vùng cơ thể giữ căng thẳng mà ít người nhận ra: vai thường nhô lên khi stress, hàm siết lại khi lo, bàn tay nắm chặt khi căng.',
      'Câu neo "Việc nhỏ tiếp theo là..." buộc não chuyển từ overwhelm (bị ngập tràn) sang action — bất kỳ hành động nhỏ nào (uống nước, đứng dậy) đều phá vỡ trạng thái tê liệt.',
      'Reset 2 phút hiệu quả nhất khi làm NGAY khi nhận ra tín hiệu stress đầu tiên — không phải sau khi đã reactive 20 phút rồi. Nhận diện sớm là chìa khóa.',
      'Khác với thiền (cần môi trường yên tĩnh), reset 2 phút dùng được ở bất cứ đâu: toilet công ty, lúc chờ thang máy, giữa hai cuộc họp, khi đang kẹt xe.',
    ],
    points: [
      { icon: '🔄', label: 'Pattern Interrupt', note: 'Ngắt mạch phản xạ tự động' },
      { icon: '💪', label: 'Thả Vai–Hàm–Tay', note: '3 vùng giữ căng thẳng' },
      { icon: '🎯', label: 'Câu Neo', note: '"Việc nhỏ tiếp theo là..."' },
      { icon: '⏱️', label: 'Dùng Ngay', note: 'Không cần môi trường riêng' },
    ],
  },
];

const D2_TECHS_ORDER = ['diaphragm', 'box', '478', 'reset2'];

function D2Panel({ color, onTechClick }) {
  const [active, setActive] = useState('box');
  const TECHS = [
    { id: 'diaphragm', icon: '🫁', name: 'Thở Cơ Hoành', formula: 'Hít bụng phồng → thở ra xẹp', when: 'Sau tập, trước ngủ, khi vai gáy căng', steps: ['1 tay ngực, 1 tay bụng', 'Hít vào — bụng phồng, ngực ít', 'Thở ra chậm, bụng xẹp', '1–3 phút'] },
    { id: 'box', icon: '⬜', name: 'Box Breathing', formula: 'Hít 4 – Giữ 4 – Thở 4 – Giữ 4', when: 'Trước họp, khi bực tức, mất tập trung', steps: ['Hít vào 4 giây', 'Giữ hơi 4 giây', 'Thở ra 4 giây', 'Giữ trống 4 giây — lặp 4 vòng'] },
    { id: '478', icon: '🌊', name: 'Thở 4-7-8', formula: 'Hít 4 – Giữ 7 – Thở 8', when: 'Buổi tối, trước ngủ, hạ nhịp sau ngày căng', steps: ['Hít vào 4 giây', 'Giữ hơi 7 giây', 'Thở ra 8 giây (nhẹ nhàng)', 'Lặp 3–4 vòng'] },
    { id: 'reset2', icon: '⚡', name: 'Reset 2 Phút', formula: 'Dừng → Thở → Thả lỏng → Neo', when: 'Khi quá tải, giữa ngày, sau tranh cãi', steps: ['Dừng 10 giây, không cầm điện thoại', 'Thở 5 nhịp chậm qua mũi', 'Thả lỏng vai – hàm – bàn tay', 'Nói 1 câu: "Việc nhỏ tiếp theo là..."'] },
  ];
  const tech = TECHS.find(t => t.id === active);
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {TECHS.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-base font-medium transition-all border ${active === t.id ? 'text-white' : 'text-muted border-border'}`} style={{ background: active === t.id ? color : undefined, borderColor: active === t.id ? color : undefined }}>
            {t.icon} {t.name}
          </button>
        ))}
      </div>
      {tech && (
        <div className="rounded-xl border p-4" style={{ borderColor: `rgba(${PURPLE_RGB},0.2)`, background: `rgba(${PURPLE_RGB},0.05)` }}>
          <div className="text-lg font-bold text-text mb-1">{tech.formula}</div>
          <div className="text-base text-muted mb-3">⏰ Khi nào: {tech.when}</div>
          <ol className="space-y-1 mb-4">
            {tech.steps.map((s, i) => <li key={i} className="flex items-start gap-2 text-lg text-text"><span className="w-4 h-4 rounded-full flex items-center justify-center text-base font-bold shrink-0 mt-0.5" style={{ background: `rgba(${PURPLE_RGB},0.2)`, color }}>{i + 1}</span>{s}</li>)}
          </ol>
          {active === 'box' && <BoxBreathTimer color={color} />}
          {onTechClick && (
            <button
              onClick={() => onTechClick(D2_TECHS_ORDER.indexOf(active))}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all border"
              style={{ color, borderColor: `rgba(${PURPLE_RGB},0.3)`, background: `rgba(${PURPLE_RGB},0.07)` }}
            >
              Xem khoa học đằng sau →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const D3_MODE_MODALS = [
  {
    icon: '🧘', color: '#d946ef', rgb: '217,70,239',
    modalTitle: 'Thiền 3 Phút',
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80&auto=format&fit=crop',
    keyFact: '3 phút thiền mỗi ngày không phải ít hơn mức cần thiết — đó là "minimum viable dose" đủ để xây dựng thói quen bền vững.',
    detail: 'Tính nhất quán quan trọng hơn thời lượng. 3 phút mỗi ngày trong 30 ngày hiệu quả hơn 30 phút 1 lần/tuần — não học qua lặp lại, không qua cường độ.',
    details: [
      'Harvard study (Sara Lazar, 2011): 8 tuần × 27 phút/ngày đủ để thấy thay đổi cấu trúc não. Nghiên cứu mới hơn cho thấy thay đổi chức năng (functional) xuất hiện sớm hơn — sau vài tuần thực hành 5–10 phút/ngày.',
      'Thiền 3 phút chánh niệm hơi thở kích hoạt PFC (prefrontal cortex) — vùng não kiểm soát chú ý và điều tiết cảm xúc — đủ để tạo "neurological imprint" sau mỗi lần thực hành ngắn.',
      '"Nhận ra mình đang bị cuốn đi và quay lại" là REP luyện tập thực sự. Mỗi lần não lang thang rồi quay lại hơi thở, cortex trước trán tập kiểm soát chú ý — y hệt tập tạ cho cơ bắp.',
      'Không cần ngồi kiết già hay phòng yên tĩnh. Bất kỳ tư thế nào giữ lưng tương đối thẳng — ngồi ghế, ngồi sàn, thậm chí trên bus — đều có tác dụng tương đương.',
      'Headspace research (n > 1 triệu users): chỉ 10 ngày × 10 phút đủ để tăng compassion 23%, giảm aggression và cải thiện focus — hiệu quả tiếp tục tăng với practice dài hơn.',
      '"Thiền xấu" (ngồi mà bị distract liên tục) vẫn tốt hơn không thiền. Nhận ra mình bị distract và quay lại chính xác là những gì thiền luyện tập — không cần đạt trạng thái "hoàn toàn trống".',
    ],
    points: [
      { icon: '🔄', label: 'Mỗi Rep Có Giá Trị', note: 'Lang thang → quay lại = 1 rep' },
      { icon: '📅', label: 'Nhất Quán Hơn Cường Độ', note: '3ph/ngày > 30ph/tuần' },
      { icon: '🧠', label: 'PFC Training', note: 'Cơ chú ý được luyện tập' },
      { icon: '✅', label: 'Không Cần Hoàn Hảo', note: 'Thiền "xấu" vẫn tốt hơn 0' },
    ],
  },
  {
    icon: '🌙', color: '#d946ef', rgb: '217,70,239',
    modalTitle: 'Thiền 5 Phút Trước Ngủ',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Body scan trước ngủ giảm cortisol và kích hoạt hệ phó giao cảm — điều trị mất ngủ first-line được ACP khuyến nghị trước cả thuốc ngủ.',
    detail: 'Nhiều người bị "wired but tired" — cơ thể kiệt sức nhưng não vẫn chạy. Body scan 5 phút không phải thiền để "clear mind" — đó là kỹ thuật tắt hệ thần kinh giao cảm có hướng dẫn.',
    details: [
      'Cortisol giảm tự nhiên vào buổi tối để cho phép ngủ. Nhưng stress mãn tính hoặc màn hình điện thoại trước ngủ giữ cortisol cao — body scan giúp ức chế cortisol chủ động thay vì chờ tự giảm.',
      'Body scan là kỹ thuật cốt lõi trong CBT-I (Cognitive Behavioral Therapy for Insomnia) — điều trị mất ngủ mãn tính first-line được American College of Physicians khuyến nghị, hiệu quả tốt hơn thuốc ngủ dài hạn.',
      '"Scan từ trán → vai → ngực → bụng → chân": chú ý từng vùng cơ thể tuần tự → nhận ra vùng căng → thở ra thả lỏng. Quy trình này phân tán self-referential thinking (vòng lặp "lo ngủ không được").',
      '"Hôm nay đủ rồi, ngày mai làm tiếp" — câu tự nhắc này kích hoạt self-compassion và tắt hệ threat detection. Não không thể đồng thời ở trạng thái threat alert và rest & digest.',
      'Trong nghiên cứu về insomnia, nhóm thiền body scan trước ngủ ngủ nhanh hơn trung bình 13 phút và thức giữa đêm ít hơn 2 lần so với nhóm đối chứng — sau 8 tuần thực hành.',
      'Nếu còn quá tỉnh táo: bắt đầu bằng thở 4-7-8 (2–3 vòng) để hạ nhịp tim xuống trước, rồi mới chuyển sang body scan — kết hợp hai kỹ thuật hiệu quả hơn từng kỹ thuật đơn lẻ.',
    ],
    points: [
      { icon: '😴', label: 'Chữa Mất Ngủ', note: 'CBT-I first-line trước thuốc' },
      { icon: '💉', label: 'Hạ Cortisol', note: 'Tắt hệ giao cảm chủ động' },
      { icon: '🔍', label: 'Scan Từng Vùng', note: 'Trán → vai → ngực → bụng → chân' },
      { icon: '💙', label: 'Self-Compassion', note: '"Hôm nay đủ rồi" tắt threat alert' },
    ],
  },
  {
    icon: '🚶', color: '#d946ef', rgb: '217,70,239',
    modalTitle: 'Chánh Niệm Đi Bộ',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đi bộ chánh niệm kết hợp 2 lợi ích trong 1: vận động aerobic nhẹ tăng BDNF + thiền hiện tại giảm rumination — hai trong những can thiệp mạnh nhất cho sức khỏe não.',
    detail: 'Nhiều người khó ngồi yên thiền nhưng có thể thiền khi di chuyển. Không cần nơi đặc biệt — hành lang văn phòng, con đường từ bãi xe vào nhà, hay siêu thị đều đủ.',
    details: [
      'Đi bộ aerobic nhẹ tăng BDNF (Brain-Derived Neurotrophic Factor) — "phân bón của não" giúp tạo kết nối thần kinh mới và bảo vệ hippocampus khỏi shrinkage do stress mãn tính.',
      '"Cảm nhận bàn chân chạm đất từng bước" là mỏ neo (anchor) chánh niệm hiệu quả khi di chuyển — nhịp bước đi tự nhiên tạo đủ kích thích để não không drift vào rumination (suy nghĩ tiêu cực lặp lại).',
      'Không tai nghe là yếu tố then chốt — nghe podcast/nhạc giữ Default Mode Network (DMN) hoạt động (brain wandering về tương lai/quá khứ). Chú ý âm thanh xung quanh kích hoạt present-moment awareness.',
      'Quan sát ánh sáng, cây cối, bầu trời kích hoạt "awe response" — trải nghiệm ngạc nhiên/kỳ thú làm giảm self-focus và tăng cảm giác kết nối. Awe response liên quan đến giảm IL-6 (inflammation marker).',
      'RCT tại Stanford: đi bộ thiên nhiên 90 phút giảm rumination và hoạt động subgenual PFC (vùng liên quan trầm cảm) nhiều hơn đáng kể so với đi bộ đô thị cùng độ dài.',
      'Không đếm thành tích (không cần 10.000 bước, không cần track pace): chánh niệm đòi hỏi "process mode" — chú ý trải nghiệm hiện tại. "Goal mode" (đếm bước) là chế độ tư duy đối nghịch.',
    ],
    points: [
      { icon: '🧠', label: 'Tăng BDNF', note: '"Phân bón" não khi aerobic nhẹ' },
      { icon: '🎧', label: 'Không Tai Nghe', note: 'Present-moment awareness' },
      { icon: '🌿', label: 'Awe Response', note: 'Giảm rumination & inflammation' },
      { icon: '🚫', label: 'Không Đếm Bước', note: 'Process mode, không goal mode' },
    ],
  },
  {
    icon: '🍽️', color: '#d946ef', rgb: '217,70,239',
    modalTitle: 'Chánh Niệm Khi Ăn',
    img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Não cần 20 phút sau khi bắt đầu ăn để nhận tín hiệu no từ dạ dày — ăn nhanh và ăn trong khi nhìn màn hình luôn dẫn đến ăn quá nhiều trước khi tín hiệu này đến.',
    detail: 'Chánh niệm khi ăn không phải "ăn chậm cho tốt tiêu hóa" — đó là kỹ thuật đồng bộ hành vi ăn với tín hiệu sinh học của cơ thể, giải quyết gốc rễ của ăn theo cảm xúc.',
    details: [
      'CCK (cholecystokinin), leptin và peptide YY — 3 hormone no chính — cần 15–20 phút để tăng đủ trong máu và cross blood-brain barrier để signal cho hypothalamus "đủ rồi". Ăn nhanh luôn xong trước khi tín hiệu đến.',
      '"Tắt màn hình khi ăn" giảm distracted eating — khi chú ý vào màn hình, khả năng nhận biết no/đói giảm 30–40%. Não xử lý ăn uống và xử lý content màn hình cạnh tranh bandwidth nhận thức.',
      'Nhai kỹ hơn (20–30 lần/miếng) bắt đầu tiêu hóa từ miệng — amylase trong nước bọt phân giải tinh bột ngay lập tức. Thức ăn được nhai kỹ cũng tạo cảm giác no sớm hơn vì tiếp xúc với receptors vị giác lâu hơn.',
      '"Dừng 10 giây trước khi lấy thêm" là pattern interrupt cho hành vi ăn tự động — nhiều lần lấy thêm đồ ăn là habit loop (thấy đồ ăn → tay với) chứ không phải đói thực sự.',
      'Mindful eating đặc biệt hiệu quả với binge eating và emotional eating — hai vấn đề phổ biến nhất liên quan đến cân nặng. Mindful eating giảm binge eating episodes 60–70% trong một số RCT.',
      'Không cần mọi bữa ăn đều chánh niệm hoàn toàn — chỉ bữa tối (khi có thời gian nhất và thường ăn nhiều nhất) đủ để xây thói quen và nhận ra patterns ăn theo cảm xúc.',
    ],
    points: [
      { icon: '⏱️', label: 'Quy Tắc 20 Phút', note: 'Não cần 20ph nhận tín hiệu no' },
      { icon: '📵', label: 'Tắt Màn Hình', note: 'Giảm 30–40% nhận biết no' },
      { icon: '🦷', label: 'Nhai Kỹ', note: 'Tiêu hóa bắt đầu từ miệng' },
      { icon: '🛑', label: 'Dừng 10 Giây', note: 'Ngắt habit loop trước khi lấy thêm' },
    ],
  },
];

const D3_MODES_ORDER = ['3min', '5min', 'walk', 'eat'];

function D3Panel({ color, onModeClick }) {
  const [mode, setMode] = useState('3min');
  const MODES = [
    { id: '3min', label: 'Thiền 3 Phút', steps: ['Ngồi thoải mái, nhắm mắt hoặc nhìn xuống', 'Cảm nhận hơi thở vào – ra ở mũi/bụng', 'Khi suy nghĩ xuất hiện, nói thầm "biết rồi"', 'Nhẹ nhàng quay lại hơi thở'] },
    { id: '5min', label: 'Thiền 5 Phút Trước Ngủ', steps: ['1 phút thở chậm, sâu', '2 phút scan cơ thể: trán → vai → ngực → bụng → chân', '1 phút thả lỏng vùng đang căng', '1 phút tự nhắc: "Hôm nay đủ rồi, ngày mai làm tiếp"'] },
    { id: 'walk', label: 'Chánh Niệm Đi Bộ', steps: ['Đi bộ 5–10 phút không tai nghe', 'Cảm nhận bàn chân chạm đất từng bước', 'Quan sát ánh sáng, cây cối, bầu trời', 'Thở đều, không đếm thành tích'] },
    { id: 'eat', label: 'Chánh Niệm Khi Ăn', steps: ['Tắt màn hình khi ăn', 'Ăn chậm hơn, nhai kỹ hơn', 'Nhận ra cảm giác no – đói', 'Dừng 10 giây trước khi lấy thêm đồ ăn'] },
  ];
  const m = MODES.find(x => x.id === mode);
  return (
    <div className="space-y-4">
      <p className="text-base text-muted">Thiền không phải là "không suy nghĩ". Thiền là <strong className="text-text">nhận ra mình đang bị cuốn đi và quay lại nhẹ nhàng</strong>.</p>
      <div className="flex gap-2 flex-wrap">
        {MODES.map(x => (
          <button key={x.id} onClick={() => setMode(x.id)} className={`px-3 py-1.5 rounded-full text-base font-medium transition-all border ${mode === x.id ? 'text-white' : 'text-muted border-border'}`} style={{ background: mode === x.id ? color : undefined, borderColor: mode === x.id ? color : undefined }}>
            {x.label}
          </button>
        ))}
      </div>
      {m && (
        <div className="rounded-xl border p-4" style={{ borderColor: `rgba(${PURPLE_RGB},0.2)`, background: `rgba(${PURPLE_RGB},0.05)` }}>
          <ol className="space-y-2">
            {m.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-lg text-text">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-base font-bold shrink-0 mt-0.5" style={{ background: `rgba(${PURPLE_RGB},0.2)`, color }}>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          {onModeClick && (
            <button
              onClick={() => onModeClick(D3_MODES_ORDER.indexOf(mode))}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all border"
              style={{ color, borderColor: `rgba(${PURPLE_RGB},0.3)`, background: `rgba(${PURPLE_RGB},0.07)` }}
            >
              Xem khoa học đằng sau →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const D4_PROMPT_MODALS = [
  {
    icon: '💭', color: '#ec4899', rgb: '236,72,153',
    modalTitle: 'Hôm Nay Mình Cảm Thấy Gì?',
    img: 'https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Đặt tên cho cảm xúc (affect labeling) giảm hoạt động amygdala đo được trên fMRI — viết "tôi đang lo" thay đổi trạng thái sinh lý não, không chỉ là tự an ủi.',
    detail: 'Câu hỏi đơn giản nhất nhưng quan trọng nhất. Nhiều người chỉ cảm thấy "mệt" hay "bực" mà không biết rõ mình đang cảm thấy gì. Nhận diện chính xác là bước đầu tiên để xử lý — không thể giải quyết điều bạn chưa nhìn thấy.',
    details: [
      'Nghiên cứu Lieberman et al. (UCLA, 2007): đặt tên cho cảm xúc bằng ngôn ngữ kích hoạt vỏ não trước trán, đồng thời giảm hoạt động amygdala đo được qua fMRI — thay đổi vật lý trong não, không phải chỉ "cảm thấy khá hơn".',
      'Emotional granularity — khả năng phân biệt cảm xúc tinh tế (lo lắng vs sợ hãi; buồn vs thất vọng) — liên quan đến sức khỏe tâm lý tốt hơn và khả năng điều tiết cảm xúc cao hơn theo Lisa Feldman Barrett.',
      'Viết về cảm xúc khó khăn chỉ 3–4 ngày × 15–20 phút đủ để cải thiện tâm trạng và giảm lo âu trong nhiều tuần sau — hiệu quả được ghi nhận ngay cả khi không có therapist hay guidance.',
      'Khi chỉ "cảm" trong đầu, não dễ bị rumination (vòng lặp suy nghĩ lặp lại) — viết ra tạo "khoảng cách" giữa bạn và cảm xúc, giúp quan sát thay vì bị cuốn vào.',
      'Không cần đặt tên "đúng" — ngay cả việc viết "tôi không biết mình đang cảm thấy gì, chỉ thấy nặng nề" cũng bắt đầu kích hoạt quá trình xử lý nhận thức-cảm xúc trong não.',
      'Thực hành hằng ngày tăng vocabulary cảm xúc — càng có nhiều từ để mô tả cảm xúc, não càng có nhiều "bộ công cụ" để xử lý tình huống khó theo cách linh hoạt hơn.',
    ],
    points: [
      { icon: '🏷️', label: 'Affect Labeling', note: 'Đặt tên = amygdala dịu xuống' },
      { icon: '🔬', label: 'Thay Đổi Não', note: 'Đo được trên fMRI' },
      { icon: '🔍', label: 'Clarity', note: 'Không thể giải quyết điều chưa thấy' },
      { icon: '📏', label: 'Khoảng Cách', note: 'Quan sát thay vì bị cuốn vào' },
    ],
  },
  {
    icon: '🎯', color: '#ec4899', rgb: '236,72,153',
    modalTitle: 'Điều Gì Làm Mình Căng Nhất?',
    img: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Não mặc định phóng đại mức độ nghiêm trọng khi lo trong đầu — viết ra buộc não phải cụ thể hóa stress và thường tự phát hiện vấn đề không to như tưởng.',
    detail: 'Cognitive offloading: não dùng nhiều năng lượng để "giữ" những việc chưa giải quyết trong working memory. Viết ra giải phóng năng lượng đó và buộc vấn đề phải trở nên cụ thể — mơ hồ thì đáng sợ, cụ thể thì giải quyết được.',
    details: [
      'Zeigarnik effect: não ưu tiên giữ những việc chưa xong trong bộ nhớ — tạo "open loops" tiêu thụ bandwidth nhận thức liên tục. Viết ra đóng loop đó, não không cần giữ nữa và năng lượng được giải phóng.',
      'James Pennebaker (UT Austin, 1986–2010s): expressive writing về stressor chính giảm cortisol measurable, cải thiện hệ miễn dịch và giảm số ngày ốm — hiệu quả mạnh nhất với việc viết về nguồn gốc stress cụ thể.',
      'Viết "điều gì làm mình căng nhất" buộc não chuyển từ diffuse worry (lo lan man) sang focused problem (vấn đề cụ thể) — diffuse worry không giải quyết được, focused problem có thể bắt đầu hành động.',
      'Sau khi xác định nguồn gốc stress chính, não có thể phân loại: kiểm soát được / không kiểm soát được. Chỉ cần hành động với phần kiểm soát được, buông phần còn lại.',
      'Nhiều người phát hiện "điều làm họ căng nhất" không phải deadline hay công việc, mà là mối quan hệ hoặc quyết định chưa được đưa ra — insight này không xuất hiện khi chỉ lo trong đầu.',
      'Viết đều đặn về stress giúp nhận ra patterns: loại tình huống nào thường xuyên căng thẳng bạn nhất? Nhận ra pattern là bước đầu để thay đổi cách phản ứng với nó.',
    ],
    points: [
      { icon: '🧠', label: 'Cognitive Offload', note: 'Giải phóng working memory' },
      { icon: '🎯', label: 'Cụ Thể Hóa', note: 'Mơ hồ sợ, cụ thể giải quyết được' },
      { icon: '🔄', label: 'Zeigarnik Effect', note: 'Viết ra đóng "open loop"' },
      { icon: '🗺️', label: 'Nhận Ra Pattern', note: 'Nhận ra để thay đổi phản ứng' },
    ],
  },
  {
    icon: '✨', color: '#ec4899', rgb: '236,72,153',
    modalTitle: 'Hôm Nay Mình Làm Tốt Điều Gì?',
    img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Não có negativity bias tự nhiên — nhớ xấu gấp 3–5 lần nhớ tốt. Chủ động ghi nhận điều tốt nhỏ mỗi ngày là "counter-training" trực tiếp cho thiên kiến này.',
    detail: 'Không phải tự khen hay tự hài lòng. Đây là kỹ thuật điều chỉnh thống kê — não tự động ghi nhớ nhiều hơn điều tiêu cực. Viết ít nhất 1 điều tốt mỗi ngày cân bằng lại tỉ lệ đó theo thời gian.',
    details: [
      'Negativity bias (Roy Baumeister et al.): não xử lý thông tin tiêu cực sâu hơn và nhớ lâu hơn thông tin tích cực — cơ chế tiến hóa giúp tránh nguy hiểm, nhưng trong cuộc sống hiện đại tạo ra self-narrative quá tiêu cực.',
      'Barbara Fredrickson (Broaden-and-Build Theory): cảm xúc tích cực mở rộng tư duy và xây dựng nguồn lực dài hạn — ngược với cảm xúc tiêu cực thu hẹp focus về survival.',
      'Nhận ra "điều nhỏ làm tốt" quan trọng hơn chờ "thành tích lớn" — não cần dopamine nhỏ và đều đặn từ progress nhỏ để duy trì động lực và cảm giác agency (kiểm soát cuộc sống).',
      'Self-efficacy (Bandura): nhận ra mình đã làm được việc nhỏ tăng niềm tin vào khả năng làm được việc khó hơn — tích lũy evidence cho bức tranh "tôi là người có thể".',
      'Viết "dù nhỏ" tắt tiêu chuẩn perfectionism — chấp nhận progress nhỏ là đủ để ghi nhận, giảm all-or-nothing thinking ("hôm nay không hoàn hảo nên không có gì đáng kể").',
      'Nghiên cứu của Martin Seligman: viết "3 điều tốt mỗi ngày + nguyên nhân" trong 1 tuần cải thiện happiness và giảm depressive symptoms — hiệu quả kéo dài 6 tháng sau khi dừng bài tập.',
    ],
    points: [
      { icon: '⚖️', label: 'Counter-Training', note: 'Cân bằng negativity bias tự nhiên' },
      { icon: '✨', label: 'Nhỏ Vẫn Quan Trọng', note: 'Não cần dopamine từ progress nhỏ' },
      { icon: '💪', label: 'Self-Efficacy', note: 'Tích lũy evidence "tôi có thể"' },
      { icon: '😊', label: 'Seligman 3-Good', note: 'Cải thiện mood kéo dài 6 tháng' },
    ],
  },
  {
    icon: '📋', color: '#ec4899', rgb: '236,72,153',
    modalTitle: 'Ngày Mai Chỉ Cần Làm 1 Việc?',
    img: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Implementation intention ("Khi tôi X, tôi sẽ làm Y") tăng tỷ lệ hoàn thành mục tiêu 2–3 lần — nhưng chỉ hoạt động khi mục tiêu đủ cụ thể và chỉ có 1 mục tiêu.',
    detail: 'Đêm trước xác định 1 việc quan trọng cho ngày mai tạo "pre-commitment" — não đã có kế hoạch rõ và không cần quyết định buổi sáng khi willpower thấp nhất. Loại bỏ decision fatigue và procrastination ở giờ bắt đầu ngày.',
    details: [
      'Peter Gollwitzer (NYU): implementation intention — "Khi tôi X, tôi sẽ làm Y" — tăng tỷ lệ hoàn thành mục tiêu từ ~22% lên 62–91% tùy nghiên cứu. Cơ chế: tạo triggers tự động trong não, không cần ý chí mỗi lần.',
      'Decision fatigue: mỗi quyết định tiêu thụ glucose và willpower. Buổi sáng não chưa phục hồi hoàn toàn — quyết định buổi tối về việc quan trọng nhất ngày mai là cách sử dụng willpower thông minh.',
      '"1 việc quan trọng" cưỡng lại multi-tasking illusion — nghiên cứu nhất quán rằng multi-tasking giảm productivity 20–40%. Não chỉ có thể thực sự tập trung vào 1 việc tại 1 thời điểm.',
      'Chọn "việc quan trọng nhất" buộc phải prioritize — phân biệt giữa urgent (gấp) và important (quan trọng). Hầu hết việc gấp không quan trọng; việc quan trọng nhất thường không gấp nhưng tạo kết quả dài hạn.',
      'Nếu không đạt được 1 việc đó, vẫn dễ dàng điều chỉnh — biết rõ mình định làm gì và chưa làm, dễ quay lại hơn là có danh sách 10 việc mơ hồ chưa biết bắt đầu từ đâu.',
      'Kết hợp với "việc nhỏ tiếp theo" (GTD mindset của David Allen): chia "việc quan trọng" thành hành động cụ thể đầu tiên — không phải "viết báo cáo" mà là "mở file báo cáo và viết 1 câu đầu tiên".',
    ],
    points: [
      { icon: '🎯', label: 'Implementation Intention', note: 'Tăng hoàn thành 2–3 lần' },
      { icon: '⚡', label: 'Tiết Kiệm Willpower', note: 'Quyết định tối, không phải sáng' },
      { icon: '1️⃣', label: 'Chỉ 1 Việc', note: 'Multi-tasking giảm 20–40% năng suất' },
      { icon: '🔑', label: 'Important vs Urgent', note: 'Quan trọng ≠ gấp' },
    ],
  },
  {
    icon: '💙', color: '#ec4899', rgb: '236,72,153',
    modalTitle: 'Một Câu Tử Tế Với Bản Thân',
    img: 'https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Self-compassion tăng khả năng thử lại và kiên trì sau thất bại — ngược với lo ngại rằng tự thương hại sẽ làm người ta lười biếng hơn.',
    detail: 'Câu tử tế với bản thân không phải lời khen ngợi hay tự hào — đó là công nhận rằng bạn đang cố gắng trong điều kiện thực tế, và điều đó đủ rồi. Cơ chế giống như nói chuyện với người bạn đang vất vả.',
    details: [
      'Kristen Neff (UT Austin): self-compassion gồm 3 thành phần — self-kindness (tử tế với bản thân), common humanity (nhận ra đau khổ là phần của trải nghiệm con người), mindfulness (nhận biết không phán xét). Ba thành phần cùng hoạt động mới tạo hiệu quả.',
      'Self-compassion KHÔNG phải self-pity (tự thương hại). Self-pity tập trung vào mình, self-compassion nhìn ra rằng tất cả mọi người đều khó khăn — tạo kết nối thay vì cô lập.',
      'Ngược với trực giác: người thực hành self-compassion có accountability cao hơn và dễ nhận lỗi hơn người self-critical — vì không sợ đối mặt với thất bại, dễ nhìn thẳng vào vấn đề hơn.',
      'Cortisol thấp hơn và oxytocin cao hơn khi thực hành self-compassion — oxytocin (hormone kết nối) được kích thích khi tự đối xử với sự ấm áp tương tự như khi nhận quan tâm từ người khác.',
      'Câu tử tế với bản thân nên "đủ thực tế" — không phải "tôi thật tuyệt vời" (não biết không đúng và reject). Ví dụ đúng: "Hôm nay khó, nhưng mình vẫn cố gắng" hoặc "Mình đủ tốt để tiếp tục ngày mai".',
      'Thực hành hằng ngày thay đổi self-talk pattern dài hạn — người nói chuyện với bản thân bằng giọng tử tế có khả năng phục hồi sau thất bại (resilience) cao hơn đáng kể theo dữ liệu nghiên cứu dọc.',
    ],
    points: [
      { icon: '💙', label: 'Self-Compassion', note: 'Tăng kiên trì sau thất bại' },
      { icon: '🔬', label: 'Oxytocin', note: 'Hormone kết nối khi tự ấm áp' },
      { icon: '🎯', label: 'Accountability', note: 'Dễ nhận lỗi hơn tự trách' },
      { icon: '🔄', label: 'Self-Talk', note: 'Thay đổi pattern dài hạn' },
    ],
  },
];

function D4Panel({ color, onPromptClick }) {
  return (
    <div className="space-y-4">
      <p className="text-base text-muted">Nhiều người mệt không vì nhiều việc, mà vì <strong className="text-text">mọi việc nằm lộn xộn trong đầu</strong>. Journal đưa chúng ra giấy.</p>
      <JournalPrompt color={color} onPromptClick={onPromptClick} />
      <div className="rounded-xl border p-3 text-base text-muted" style={{ borderColor: `rgba(${PURPLE_RGB},0.15)`, background: `rgba(${PURPLE_RGB},0.05)` }}>
        <strong style={{ color }}>Phiên bản siêu ngắn:</strong> "Mình đang cảm thấy… / Mình cần… / Việc nhỏ tiếp theo là…"
      </div>
    </div>
  );
}

const D5_LEVEL_MODALS = [
  {
    icon: '📵', color: '#0ea5e9', rgb: '14,165,233',
    modalTitle: 'Mức 1 – Detox Bắt Đầu',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Ánh sáng xanh từ điện thoại ức chế melatonin lên đến 23% và trì hoãn giờ ngủ trung bình 1,5 giờ — chỉ cần tắt màn hình 20 phút trước ngủ để ngủ sâu hơn ngay đêm đầu tiên.',
    detail: '4 thay đổi nhỏ trong Mức 1 nhắm đúng vào 4 điểm "rò rỉ" phổ biến nhất: buổi sáng (mở MXH ngay khi thức), suốt ngày (thông báo liên tục), trên giường (điện thoại cạnh đầu giường) và tối (màn hình sáng trước ngủ).',
    details: [
      'Ánh sáng xanh (460–480nm) từ màn hình kích thích tế bào ipRGC trong võng mạc, ức chế tuyến tùng tiết melatonin. Harvard Medical School: dùng màn hình 2 giờ trước ngủ làm giảm melatonin 23% và trì hoãn ngủ 1,5 giờ.',
      'Mở điện thoại trong 10 phút đầu sau khi thức đặt não vào "reactive mode" — xử lý thông báo, tin tức, comment. Cortisol sáng sớm (cortisol awakening response) vốn đã cao nhất ngày, thêm self-comparison từ MXH làm tăng stress khởi đầu ngày.',
      'Thông báo liên tục phân mảnh sự tập trung (cognitive fragmentation) — Gloria Mark (UC Irvine): trung bình 23 phút để não quay lại trạng thái tập trung sâu sau mỗi interrupt. 10 thông báo/ngày = mất 3–4 giờ tập trung tiềm năng.',
      'Điện thoại trên giường ngủ có 2 tác hại: ánh sáng khi lướt đêm ức chế melatonin, và proximity effect — chỉ cần biết điện thoại ở đó cũng tăng arousal và giảm chất lượng giấc ngủ theo nghiên cứu Ward et al. 2017.',
      '4 thay đổi Mức 1 không đòi hỏi ý chí cao — chỉ cần thay đổi môi trường vật lý: điện thoại ra khỏi phòng ngủ, tắt thông báo trong Settings, dùng đồng hồ báo thức thay cho điện thoại.',
      'Mức 1 thường tạo hiệu quả ngay trong tuần đầu: ngủ sâu hơn (do melatonin không bị ức chế), buổi sáng bắt đầu chủ động hơn (không reactive), và giảm cảm giác "phone anxiety" khi không có điện thoại.',
    ],
    points: [
      { icon: '😴', label: 'Melatonin', note: 'Tắt màn hình 20ph → ngủ sâu hơn' },
      { icon: '🌅', label: 'Sáng Chủ Động', note: 'Không reactive từ đầu ngày' },
      { icon: '🔕', label: 'Thông Báo', note: 'Tắt = +3–4h tập trung/ngày' },
      { icon: '🛏️', label: 'Phòng Ngủ', note: 'Để điện thoại phòng khác' },
    ],
  },
  {
    icon: '⚡', color: '#0ea5e9', rgb: '14,165,233',
    modalTitle: 'Mức 2 – Detox Chuẩn',
    img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Social media feed được thiết kế theo nguyên lý "variable reward" — cùng cơ chế với máy đánh bạc, kích hoạt dopamine theo chu kỳ ngẫu nhiên. 30 phút đầu ngày không MXH đủ để não không ở trạng thái reactive cả ngày.',
    detail: 'Mức 2 giải quyết nguyên nhân gốc rễ: não đang bị "khai thác" bởi attention economy. Không phải lỗi của bạn khi không thể dừng lướt — đó là thiết kế có chủ ý. Mức 2 tạo khoảng trống để não không ở trạng thái reactive liên tục.',
    details: [
      'Variable reward schedule (B.F. Skinner): phần thưởng ngẫu nhiên (cuộn xuống không biết thấy gì) kích hoạt dopamine mạnh hơn phần thưởng cố định. Social media feed áp dụng chính xác cơ chế này — thiết kế bởi các kỹ sư biết rõ tác động.',
      'Tristan Harris (cựu kỹ sư Google, "The Social Dilemma"): mỗi thông báo "Like" hoặc "Comment" được gom lại và gửi theo chu kỳ để tạo dopamine burst tối đa — không phải ngẫu nhiên.',
      '"30 phút đầu ngày không MXH" tạo "khoảng trống nhận thức" (cognitive white space) — não không ở trạng thái threat detection và comparison ngay từ khi thức dậy. Khởi đầu ngày với agenda của bạn, không phải của người khác.',
      'Ăn mà không cầm điện thoại có 2 lợi ích: (1) não nhận tín hiệu no tốt hơn khi không bị distract (mindful eating), (2) ngăn association "ăn = màn hình" — loại bỏ trigger cho lướt vô thức khi ăn.',
      '"10 phút khoảng trống" giữa ngày cho Default Mode Network (DMN) hoạt động — DMN cần thời gian "không nhiệm vụ" để xử lý ký ức, giải quyết vấn đề ngầm và giảm cognitive overload tích lũy.',
      '30 phút trước ngủ không cuộn feed giúp não chuyển từ xử lý social information (stimulating) sang wind-down — ngoài tác động melatonin, còn giảm "comparison loop" và FOMO trước khi ngủ.',
    ],
    points: [
      { icon: '🎰', label: 'Variable Reward', note: 'Cơ chế máy đánh bạc trong app' },
      { icon: '🌅', label: 'Buổi Sáng Khác', note: '30ph không MXH = agenda của bạn' },
      { icon: '🧠', label: 'DMN Rest', note: '10ph trống = não xử lý ngầm' },
      { icon: '🍽️', label: 'Ăn Không Màn', note: 'Nhận tín hiệu no tốt hơn' },
    ],
  },
  {
    icon: '🌿', color: '#0ea5e9', rgb: '14,165,233',
    modalTitle: 'Mức 3 – Detox Nâng Cao',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Default Mode Network (DMN) cần thời gian "trống" để xử lý ký ức, sáng tạo và cảm xúc. Màn hình liên tục ngăn DMN làm việc — mất khả năng sáng tạo, giảm trí nhớ dài hạn và tăng cảm giác trống rỗng dù bận rộn.',
    detail: 'Mức 3 không phải cực đoan — đó là phục hồi cognitive bandwidth dài hạn. Deep work, sáng tạo và cảm giác kết nối thực sự đều cần não ở trạng thái không màn hình trong thời gian đủ dài để DMN và hệ thần kinh phó giao cảm làm việc.',
    details: [
      'Default Mode Network (Buckner & DiNicola, 2019): mạng lưới não hoạt động khi "không làm gì" — thực ra đang xử lý ký ức, tưởng tượng tương lai, cảm xúc và empathy. Màn hình liên tục không để DMN vào trạng thái này.',
      'Cal Newport ("Deep Work"): công việc đòi hỏi nhận thức cao cần 90–120 phút liên tục không interrupt để đạt trạng thái flow. 1 buổi tối/tuần không màn hình huấn luyện khả năng tập trung sâu cho cả tuần.',
      'Đi bộ không tai nghe, không điện thoại kết hợp aerobic nhẹ (BDNF) + DMN activation + present-moment awareness — 3 lợi ích não bộ song song trong cùng 10–15 phút, không thể đạt được khi đeo tai nghe.',
      'Csikszentmihalyi (Flow): trạng thái "dòng chảy" (flow state) — năng suất và hạnh phúc cao nhất — đòi hỏi thách thức vừa đủ và không có interrupt. "Deep life" cuối tuần (nấu ăn, đọc sách, gia đình) là môi trường tự nhiên tạo flow.',
      'Stanford RCT (Bratman et al., 2015): đi bộ thiên nhiên 90 phút giảm rumination và hoạt động subgenual PFC (liên quan trầm cảm) nhiều hơn đáng kể so với đi bộ đô thị — không cần thiên nhiên hoang dã, công viên đủ.',
      'Đưa app gây nghiện ra khỏi màn hình chính giảm consumption 80% mà không cần ý chí — theo dữ liệu internal của một số app. Friction nhỏ (phải tìm trong thư mục) đủ để ngắt hành vi tự động.',
    ],
    points: [
      { icon: '🧠', label: 'DMN Phục Hồi', note: 'Sáng tạo & ký ức cần idle time' },
      { icon: '🌊', label: 'Flow State', note: 'Deep work 90ph liên tục' },
      { icon: '🌿', label: 'Thiên Nhiên', note: 'Giảm rumination, giảm stress' },
      { icon: '📱', label: 'Friction Design', note: 'App ra màn 2 = giảm 80% lướt' },
    ],
  },
];

function D5Panel({ color, onLevelClick }) {
  const [level, setLevel] = useState(1);
  const LEVELS = [
    { l: 1, name: 'Mức 1 – Dễ', rules: ['Không mở MXH 10 phút sau khi thức', 'Tắt thông báo không cần thiết', 'Không để điện thoại trên giường khi ngủ', 'Giảm màn hình 10–20 phút trước ngủ'] },
    { l: 2, name: 'Mức 2 – Chuẩn', rules: ['30 phút đầu ngày không MXH', '30 phút trước ngủ không cuộn feed', '10 phút "khoảng trống" trong ngày', 'Khi ăn, không cầm điện thoại'] },
    { l: 3, name: 'Mức 3 – Nâng Cao', rules: ['1 buổi tối/tuần ít màn hình', '1 lần đi bộ không tai nghe, không điện thoại', 'Cuối tuần 2–3 giờ "deep life": gia đình, nấu ăn, đọc sách', 'Đưa app gây nghiện ra khỏi màn hình chính'] },
  ];
  const cur = LEVELS.find(x => x.l === level);
  return (
    <div className="space-y-4">
      <p className="text-base text-muted">Điện thoại không xấu. Vấn đề là <strong className="text-text">cuộn vô thức khi não đang mệt</strong>, làm stress nặng hơn và ngủ kém hơn.</p>
      <div className="flex gap-2">
        {LEVELS.map(x => (
          <button key={x.l} onClick={() => setLevel(x.l)} className={`flex-1 py-2 rounded-xl text-base font-bold transition-all border ${level === x.l ? 'text-white' : 'text-muted border-border'}`} style={{ background: level === x.l ? color : undefined, borderColor: level === x.l ? color : undefined }}>
            {x.name}
          </button>
        ))}
      </div>
      {cur && (
        <div className="rounded-xl border p-4" style={{ borderColor: `rgba(${PURPLE_RGB},0.2)`, background: `rgba(${PURPLE_RGB},0.05)` }}>
          <ul className="space-y-2 mb-4">
            {cur.rules.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-lg text-text p-2 rounded-lg" style={{ background: `rgba(${PURPLE_RGB},0.05)` }}>
                <span style={{ color }}>→</span>{r}
              </li>
            ))}
          </ul>
          {onLevelClick && (
            <button
              onClick={() => onLevelClick(level - 1)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all border"
              style={{ color, borderColor: `rgba(14,165,233,0.3)`, background: `rgba(14,165,233,0.07)` }}
            >
              Xem khoa học đằng sau →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

const D6_HABIT_MODALS = [
  {
    icon: '🌬️', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Căng Thẳng → Thở 1 Phút',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop',
    keyFact: '1 phút thở cơ hoành đủ để hạ nhịp tim 5–8 bpm và giảm cortisol đo được — ngắn đến mức không có lý do nào để không làm ngay khi căng thẳng.',
    detail: 'Thở là công cụ duy nhất kiểm soát hệ thần kinh tự chủ bằng ý thức. Khi căng, não ở trạng thái fight-or-flight và không thể tư duy rõ ràng. 1 phút thở chậm kích hoạt hệ phó giao cảm đủ để chuyển trạng thái.',
    details: [
      'Hệ phó giao cảm (rest & digest) kích hoạt khi thở chậm qua cơ chế vagus nerve — dây thần kinh phế vị chạy từ não xuống qua cơ hoành, gửi tín hiệu "an toàn" lên thân não trong 30–60 giây.',
      'Nghiên cứu của Zaccaro et al. (2018): thở chậm 6 nhịp/phút (10 giây/nhịp) tạo HRV cao nhất — chỉ số linh hoạt hệ thần kinh liên quan đến kiểm soát cảm xúc và phục hồi stress tốt hơn.',
      'Kỹ thuật đơn giản nhất: hít vào 4 giây, thở ra 6–8 giây. Tỉ lệ thở ra dài hơn hít vào là chìa khóa — kích hoạt baroreceptors trên động mạch chủ, gửi tín hiệu "hạ nhịp" lên não.',
      '"1 phút" không phải con số tùy ý — chỉ cần 4–5 nhịp thở sâu (khoảng 60 giây ở tốc độ 1 nhịp/12–15 giây) để cortisol bắt đầu giảm theo nghiên cứu kiểm soát có đo nước bọt.',
      'Thở 1 phút hiệu quả nhất khi làm NGAY lúc nhận ra tín hiệu căng đầu tiên — không phải sau 30 phút đã reactive. Vai cứng, thở nông, tim nhanh là tín hiệu — đó là thời điểm.',
      'Dùng được ở bất cứ đâu: toilet công ty, thang máy, kẹt xe, giữa hai cuộc họp. Không cần môi trường yên tĩnh. Đây là lý do "thở 1 phút" hiệu quả hơn "thiền 20 phút" khi bận — friction gần như bằng 0.',
    ],
    points: [
      { icon: '⚡', label: 'Vagus Nerve', note: 'Kích hoạt rest & digest trong 60s' },
      { icon: '❤️', label: 'Hạ Nhịp Tim', note: '5–8 bpm sau 4–5 nhịp thở sâu' },
      { icon: '⏱️', label: '1 Phút', note: 'Đủ để cortisol bắt đầu giảm' },
      { icon: '📍', label: 'Dùng Ngay', note: 'Không cần môi trường đặc biệt' },
    ],
  },
  {
    icon: '🧠', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Quá Tải → Xả Não 5 Dòng',
    img: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Não không thể xử lý task hiện tại tốt khi còn đang "giữ" danh sách việc chưa xong trong working memory — viết ra 5 dòng giải phóng RAM não cho việc đang làm.',
    detail: 'Quá tải nhận thức (cognitive overload) không phải vì quá nhiều việc — mà vì não đang cố giữ quá nhiều thứ cùng lúc. Working memory có giới hạn ~7 đơn vị. Khi đầy, não không thể xử lý thêm và cảm giác "tê liệt" xuất hiện.',
    details: [
      'Working memory (bộ nhớ làm việc) có giới hạn ~7 ± 2 "chunks" theo Miller (1956). Khi overflow, não không thể thêm thông tin mới hay xử lý hiệu quả — gây cảm giác overwhelm và tê liệt.',
      'Zeigarnik effect: não ưu tiên "giữ" những việc chưa xong hơn việc đã hoàn thành — open tasks tiêu thụ working memory liên tục, ngay cả khi bạn đang làm việc khác.',
      '"Xả não 5 dòng" = GTD (Getting Things Done, David Allen) phiên bản tối giản: viết tất cả ra khỏi đầu. Não không cần giữ nữa → working memory được giải phóng → tập trung vào 1 việc hiện tại tốt hơn.',
      'Không cần 5 dòng hoàn hảo hay có cấu trúc. Viết bất kỳ thứ gì đang chiếm "chỗ" trong đầu: việc cần làm, lo lắng, việc đang chờ người khác, ý tưởng random. Não không quan tâm hình thức.',
      'Sau khi viết ra, phân loại đơn giản: "làm ngay" / "lên lịch sau" / "chờ người khác" / "buông — không kiểm soát được". Phân loại này ngăn não tiếp tục giữ những thứ không hành động được.',
      '"5 dòng" là đủ cho hầu hết trường hợp quá tải hằng ngày — không cần brain dump 2 trang. Nghiên cứu về note-taking: ngắn gọn hơn thường hiệu quả hơn vì giảm thêm cognitive load từ chính quá trình viết.',
    ],
    points: [
      { icon: '💾', label: 'Giải Phóng RAM', note: 'Working memory có giới hạn ~7 chunks' },
      { icon: '🔄', label: 'Zeigarnik Effect', note: 'Não giữ việc chưa xong — viết ra đóng loop' },
      { icon: '✍️', label: '5 Dòng', note: 'GTD tối giản, không cần cấu trúc' },
      { icon: '🗂️', label: 'Phân Loại', note: 'Làm / Lên lịch / Chờ / Buông' },
    ],
  },
  {
    icon: '😴', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Trước Ngủ → Tắt Màn Hình',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop',
    keyFact: '20 phút không màn hình trước ngủ đủ để cortisol bắt đầu giảm và melatonin bắt đầu tăng — hai điều kiện sinh lý cần thiết để ngủ sâu và phục hồi hoàn toàn.',
    detail: 'Giấc ngủ là thời gian não "dọn dẹp" — xử lý ký ức, loại bỏ chất thải thần kinh (glymphatic system), và reset cảm xúc. Màn hình trước ngủ không chỉ trì hoãn giờ ngủ mà còn giảm chất lượng ngủ ngay cả khi đã ngủ đủ giờ.',
    details: [
      'Ánh sáng xanh từ màn hình kích thích tế bào ipRGC trong võng mạc, ức chế tuyến tùng tiết melatonin. Harvard: 2 giờ màn hình trước ngủ giảm melatonin 23% và trì hoãn ngủ trung bình 1,5 giờ.',
      'Cortisol cần giảm xuống ngưỡng thấp để não chuyển sang trạng thái sleep-ready. Lướt feed kích hoạt social comparison và FOMO — cả hai tăng cortisol và giữ hệ thần kinh giao cảm hoạt động.',
      'Glymphatic system — hệ thống làm sạch não — hoạt động chủ yếu trong giấc ngủ sâu (slow-wave sleep). Amyloid beta và tau protein (liên quan Alzheimer) được loại bỏ trong giai đoạn này. Ngủ kém dài hạn tích lũy các chất thải này.',
      'REM sleep — giai đoạn xử lý cảm xúc — bị rút ngắn khi ngủ muộn do màn hình. REM ít → cảm xúc ngày hôm sau kém ổn định, dễ reactive hơn, và khả năng empathy giảm (nghiên cứu Walker, "Why We Sleep").',
      'Thói quen thay thế hiệu quả: đọc sách giấy (ánh sáng ấm, không blue light), nghe nhạc nhẹ, body scan, hoặc viết journal 5 dòng — bất kỳ hoạt động nào không có màn hình đều tạo điều kiện melatonin tăng.',
      '"10–20 phút" là ngưỡng tối thiểu — nghiên cứu về pre-sleep routine cho thấy thay đổi hành vi trước ngủ chỉ cần 10–15 phút để bắt đầu thấy hiệu quả rõ trong tuần đầu.',
    ],
    points: [
      { icon: '🌙', label: 'Melatonin', note: 'Tăng sau 20ph không màn hình' },
      { icon: '🧹', label: 'Glymphatic', note: 'Não dọn dẹp chất thải khi ngủ sâu' },
      { icon: '😊', label: 'REM Sleep', note: 'Xử lý cảm xúc ngày hôm sau' },
      { icon: '📖', label: 'Thay Thế', note: 'Sách giấy, journal, body scan' },
    ],
  },
  {
    icon: '🔄', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Sau Khi Fail → Viết 1 Câu Quay Lại',
    img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Người thực hành self-compassion sau thất bại có tỷ lệ thử lại cao hơn người tự trách — nghịch lý là tử tế với bản thân tạo accountability cao hơn, không thấp hơn.',
    detail: '"Viết 1 câu quay lại" ngắt vòng lặp rumination và chuyển não từ threat mode (tự trách, tự phán xét) sang action mode (bước tiếp theo nhỏ nhất). Không phải tự an ủi — đó là cách phục hồi hiệu quả nhất.',
    details: [
      'James Clear ("Atomic Habits"): quy tắc "không bao giờ bỏ lỡ hai lần liên tiếp" thực tế hơn "không bao giờ bỏ". Sau ngày fail, hành động nhỏ nhất ngày hôm sau duy trì danh tính "người đang thực hành" — danh tính đó quan trọng hơn streak.',
      'Self-criticism (tự trách) sau thất bại kích hoạt thêm cortisol và threat response — não vào trạng thái phòng thủ, không phải học hỏi. Nghiên cứu của Neff et al.: self-criticism tăng xác suất abandon goal, không tăng motivation.',
      'Kristen Neff (UT Austin): self-compassion sau thất bại — không phải tự thương hại mà là công nhận "đây là khó, và mình đang cố gắng" — tăng accountability và tỷ lệ thử lại theo dữ liệu longitudinal.',
      '"Viết 1 câu" cụ thể hơn "tha thứ cho bản thân" — não cần hành động cụ thể, không phải cảm xúc mơ hồ. Ví dụ đúng: "Hôm qua bỏ tập. Tối nay tập 10 phút." Một câu đủ để chuyển từ rumination sang intention.',
      'Growth mindset (Carol Dweck): thất bại là data, không phải kết luận về con người. "Mình chưa biết cách" thay vì "mình không thể". 1 câu quay lại là cách thực hành growth mindset trong 10 giây.',
      'Habit identity repair: sau ngày không thiền, viết "Ngày mai thiền 3 phút" duy trì narrative "tôi là người thiền" — danh tính thiền quan trọng hơn chuỗi ngày liên tiếp theo nghiên cứu về habit formation.',
    ],
    points: [
      { icon: '🔄', label: 'Không Bỏ 2 Lần', note: 'Quy tắc James Clear' },
      { icon: '💙', label: 'Self-Compassion', note: 'Tăng tỷ lệ thử lại, không giảm' },
      { icon: '✍️', label: '1 Câu Cụ Thể', note: 'Hành động > cảm xúc mơ hồ' },
      { icon: '🌱', label: 'Identity Repair', note: 'Duy trì narrative về bản thân' },
    ],
  },
  {
    icon: '🍕', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Muốn Ăn Vặt → Dừng 10 Giây',
    img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80&auto=format&fit=crop',
    keyFact: '80% lần "đói" sau bữa ăn vừa xong thực ra là stress, buồn chán, hoặc thói quen — không phải đói thật. 10 giây kiểm tra phân biệt được hai điều đó và ngắt hành vi tự động.',
    detail: 'Ăn vặt theo cảm xúc không phải thiếu ý chí — đó là vòng lặp thần kinh được củng cố qua nhiều năm: cảm xúc khó chịu → tìm đồ ăn → dopamine ngắn → cảm xúc tạm dịu → vòng lặp lặp lại. 10 giây tạo khoảng trống để ngắt vòng lặp đó.',
    details: [
      'Đường và chất béo kích hoạt nucleus accumbens (trung tâm thưởng của não), tạo dopamine burst ngắn hạn. Nhưng đường huyết tăng vọt rồi tụt nhanh sau 30–60 phút làm mood xuống thêm và tạo craving tiếp theo — vòng lặp tự củng cố.',
      'Phân biệt đói thật vs đói cảm xúc: đói thật xuất hiện dần, bất kỳ đồ ăn nào cũng hấp dẫn, đi kèm cảm giác vật lý (bụng réo). Đói cảm xúc xuất hiện đột ngột, chỉ muốn thứ cụ thể (ngọt/giòn/béo), thường sau trigger cảm xúc.',
      '10 giây dừng là "pattern interrupt" — ngắt chuỗi cue → routine tự động bằng một khoảng trống có ý thức. Hỏi "Mình đói hay mệt?" buộc prefrontal cortex tham gia thay vì để amygdala chạy autopilot.',
      'Menu thay thế hiệu quả hơn ý chí thuần túy: khi xác định là stress/mệt (không phải đói thật), thay bằng thở 5 nhịp, uống nước, ra ngoài 2 phút, hoặc viết 1 câu cảm xúc hiện tại. Não cần thay thế hành vi, không phải khoảng trống.',
      'Mindful eating research: dừng trước khi lấy thêm đồ ăn giảm binge eating 60–70% trong một số RCT — không cần không ăn, chỉ cần tạo khoảng dừng có ý thức trước khi tiếp tục.',
      'Lâu dài: nhật ký ghi trigger ăn vặt (tình huống, cảm xúc) giúp nhận ra pattern — loại tình huống nào kích hoạt ăn cảm xúc? Nhận ra pattern là bước đầu để thay đổi cue thay vì chỉ chiến đấu với craving.',
    ],
    points: [
      { icon: '🔍', label: 'Đói Thật vs Cảm Xúc', note: 'Đột ngột + cụ thể = cảm xúc' },
      { icon: '⏸️', label: 'Pattern Interrupt', note: '10s ngắt chuỗi tự động' },
      { icon: '🔄', label: 'Thay Thế', note: 'Hành vi khác, không để trống' },
      { icon: '📊', label: 'Nhận Ra Pattern', note: 'Ghi trigger để thay đổi cue' },
    ],
  },
  {
    icon: '⚡', color: '#10b981', rgb: '16,185,129',
    modalTitle: 'Mất Động Lực → Làm 2 Phút',
    img: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80&auto=format&fit=crop',
    keyFact: 'Động lực không đến trước hành động — nó đến SAU khi đã bắt đầu. 2 phút là ngưỡng đủ thấp để não không kháng cự nhưng đủ để kích hoạt momentum và thường tự mở rộng thành nhiều hơn.',
    detail: '"Làm bản tối thiểu 2 phút" không phải bài tập thực sự — đó là cách đánh lừa activation energy của não. Neuroscience: một khi đã bắt đầu một hành vi, không có lý do nào để dừng lại sau đúng 2 phút.',
    details: [
      'Activation energy: não cần năng lượng để bắt đầu một hành vi mới, nhất là khi động lực thấp. "2 phút" giảm activation energy gần như bằng 0 — không ai thực sự "không có 2 phút". Friction thấp = tỷ lệ bắt đầu cao.',
      'James Clear ("Atomic Habits"): "2-minute rule" — thu nhỏ bất kỳ thói quen nào thành bản 2 phút để bắt đầu. "Tập gym" → "mặc đồ gym". "Đọc sách" → "mở sách đọc 1 trang". Mục tiêu là bắt đầu, không phải hoàn thành.',
      'Zeigarnik effect ngược: một khi đã bắt đầu task, não tạo "open loop" muốn hoàn thành — stopping early tạo cognitive dissonance. Thực tế 70–80% người "làm 2 phút" tiếp tục lâu hơn sau khi đã bắt đầu.',
      'Motivation follows action, không phải ngược lại — đây là một trong những phát hiện nhất quán nhất trong tâm lý học hành vi. Chờ cảm hứng để bắt đầu là backward causation. Bắt đầu trước, cảm hứng đến sau.',
      'Identity anchoring: "Tập 2 phút" vẫn duy trì danh tính "người tập thể dục" — quan trọng hơn số phút thực tế. Danh tính được xây dựng qua hành động lặp lại, dù nhỏ. "Tôi là người tập mỗi ngày" > "tôi tập 30 phút".',
      'BJ Fogg (Stanford, "Tiny Habits"): thói quen nhỏ nhất có thể tạo ra emotional win — mỗi lần hoàn thành dù ngắn tạo dopamine nhỏ, củng cố loop thói quen. Cần ăn mừng ngay sau để não học nhanh hơn.',
    ],
    points: [
      { icon: '⚡', label: 'Activation Energy', note: '2ph = ngưỡng não không kháng cự' },
      { icon: '🌊', label: 'Momentum', note: '70–80% tiếp tục sau khi bắt đầu' },
      { icon: '🎭', label: 'Motivation Follows', note: 'Hành động trước, cảm hứng sau' },
      { icon: '🏷️', label: 'Identity', note: 'Nhỏ vẫn duy trì danh tính' },
    ],
  },
];

function D6Panel({ color, onHabitClick }) {
  const HABITS = [
    { situation: 'Căng thẳng', habit: 'Thở 1 phút' },
    { situation: 'Quá tải công việc', habit: 'Xả não 5 dòng' },
    { situation: 'Trước khi ngủ', habit: 'Tắt màn hình 10–20 phút' },
    { situation: 'Sau khi fail', habit: 'Viết 1 câu quay lại' },
    { situation: 'Muốn ăn vặt', habit: 'Dừng 10 giây hỏi mình đói hay mệt' },
    { situation: 'Mất động lực', habit: 'Làm bản tối thiểu 2 phút' },
  ];
  return (
    <div className="space-y-4">
      <p className="text-base text-muted"><strong className="text-text">Kỷ luật mềm</strong> không phải dễ dãi. Đó là cách quay lại sau khi lệch nhịp — không tự mắng, không bù gấp đôi.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {HABITS.map((h, i) => (
          <div
            key={h.situation}
            className={`group/habit flex items-center gap-3 p-3 rounded-xl border bg-bg transition-all duration-200 ${onHabitClick ? 'cursor-pointer border-border hover:border-emerald-500/40 hover:bg-white/[0.03] hover:shadow-[0_0_14px_rgba(16,185,129,0.08)]' : 'border-border'}`}
            onClick={onHabitClick ? () => onHabitClick(i) : undefined}
          >
            <div className="text-base text-muted w-32 shrink-0">{h.situation}</div>
            <div className="text-base font-bold flex-1" style={{ color }}>→ {h.habit}</div>
            {onHabitClick && (
              <span
                className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border opacity-30 group-hover/habit:opacity-100 transition-opacity"
                style={{ color: D6_HABIT_MODALS[i].color, borderColor: `rgba(${D6_HABIT_MODALS[i].rgb},0.35)`, background: `rgba(${D6_HABIT_MODALS[i].rgb},0.08)` }}
              >chi tiết →</span>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-xl p-3 text-base text-muted leading-relaxed border" style={{ borderColor: `rgba(${PURPLE_RGB},0.15)`, background: `rgba(${PURPLE_RGB},0.06)` }}>
        <strong style={{ color }}>Quy tắc 1% quay lại:</strong> Không tập được 30 phút → làm 5 phút. Ăn quá tay → bữa tiếp theo quay lại. Ngủ muộn → tối hôm sau giảm màn hình sớm 10 phút. <strong className="text-text">Một ngày fail không phá hỏng hành trình. Bỏ luôn mới phá.</strong>
      </div>
    </div>
  );
}

function D7Panel({ color, onItemClick }) {
  return <CalmScore color={color} onItemClick={onItemClick} />;
}

function CardModal({ item, onClose, onPrev, onNext, hasPrev, hasNext, total, idx }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border"
        style={{ background: '#0d0d0d', borderColor: `rgba(${item.rgb},0.28)`, boxShadow: `0 0 80px rgba(${item.rgb},0.15)` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 rounded-t-3xl overflow-hidden shrink-0">
          <img src={item.img} alt={item.modalTitle} className="w-full h-full object-cover" style={{ opacity: 0.50 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-5 left-6 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>
            {item.icon}
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-2xl md:text-3xl mb-3" style={{ color: item.color }}>{item.modalTitle}</h2>
          <div className="rounded-xl px-4 py-3 mb-5 text-base font-medium leading-relaxed"
            style={{ background: `rgba(${item.rgb},0.1)`, borderLeft: `3px solid ${item.color}`, color: `rgba(${item.rgb},0.9)` }}>
            💡 {item.keyFact}
          </div>
          <p className="text-base text-muted leading-relaxed mb-6">{item.detail}</p>

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
            <button onClick={() => hasPrev && onPrev()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasPrev ? item.color : 'rgba(255,255,255,0.2)', background: hasPrev ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasPrev ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasPrev ? 'pointer' : 'default' }}
            >← Trước</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{idx + 1} / {total}</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl transition-all"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >Sau →</button>
          </div>
          <p className="text-center text-xs text-muted mt-4 opacity-40">Nhấn ESC hoặc click bên ngoài để đóng</p>
        </div>
      </div>
    </div>
  );
}

const PANEL_MAP = { d0: D0Panel, d1: D1Panel, d2: D2Panel, d3: D3Panel, d4: D4Panel, d5: D5Panel, d6: D6Panel, d7: D7Panel };

// ─── Teaser components (copied from PillarB pattern) ─────────────────────────
function TeaserSection({ title, children }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-border" />
        <span className="text-base font-bold uppercase tracking-widest text-muted px-3">{title}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function TeaserCard({ to, color, rgb, icon, category, title, accent, desc, features, stats, image, imageAlt, cta }) {
  return (
    <Link to={to} className="group relative rounded-2xl border border-border bg-surface overflow-hidden hover:border-opacity-40 transition-all duration-300 flex flex-col md:flex-row" style={{ '--hov-color': color }} >
      <div className="md:hidden relative h-28 overflow-hidden">
        <img src={image} alt={imageAlt} className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent, var(--color-surface) 90%)` }} />
      </div>
      <div className="flex-1 p-5 flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <div className="text-base font-bold uppercase tracking-widest mb-0.5" style={{ color }}>{category}</div>
              <div className="text-lg font-bold text-text group-hover:text-white transition-colors leading-tight">{title}</div>
            </div>
          </div>
          {accent && <div className="text-base font-medium mb-2 px-2 py-0.5 rounded-full inline-block" style={{ background: `rgba(${rgb},0.1)`, color }}>{accent}</div>}
          <p className="text-base text-muted leading-relaxed mb-3">{desc}</p>
          {features && <ul className="space-y-0.5 mb-3">{features.map(f => <li key={f} className="text-base text-muted flex items-center gap-1.5"><span style={{ color }}>·</span>{f}</li>)}</ul>}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          {stats && <div className="flex gap-3">{stats.map(s => <div key={s.l} className="text-center"><div className="text-lg font-bold" style={{ color }}>{s.v}</div><div className="text-base text-muted">{s.l}</div></div>)}</div>}
          <span className="text-base font-bold ml-auto" style={{ color }}>{cta}</span>
        </div>
      </div>
      <div className="hidden md:block w-[38%] relative overflow-hidden shrink-0">
        <img src={image} alt={imageAlt} className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to right, var(--color-surface) 10%, transparent 60%)` }} />
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PillarD() {
  const { t: tPillars } = useTranslation('pillars');
  const pillar = tPillars('pillarD', { returnObjects: true });
  const [activeTab, setActiveTab] = useState('d0');
  const [d0Modal, setD0Modal] = useState(null);
  const [d1Modal, setD1Modal] = useState(null);
  const [d2Modal, setD2Modal] = useState(null);
  const [d3Modal, setD3Modal] = useState(null);
  const [d4Modal, setD4Modal] = useState(null);
  const [d5Modal, setD5Modal] = useState(null);
  const [d6Modal, setD6Modal] = useState(null);
  const [d7Modal, setD7Modal] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property --pd-orbit-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes pdOrbitSpin { to { --pd-orbit-angle: 360deg; } }
      .pd-orbit-ring {
        background: conic-gradient(
          from var(--pd-orbit-angle),
          transparent 0deg, transparent 55deg,
          rgba(${PURPLE_RGB},0.0) 65deg, rgba(${PURPLE_RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${PURPLE_RGB},0.75) 99deg,
          rgba(${PURPLE_RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: pdOrbitSpin 3.5s linear infinite;
      }
      ${TABS.map(t => `
        @property --${t.frame}-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes ${t.frame}Spin { to { --${t.frame}-angle: 360deg; } }
        .${t.frame} {
          background: conic-gradient(from var(--${t.frame}-angle),
            transparent 0deg, rgba(${t.rgb},0.0) 70deg, rgba(${t.rgb},0.6) 85deg,
            rgba(255,255,255,0.8) 90deg, rgba(${t.rgb},0.6) 95deg,
            rgba(${t.rgb},0.0) 110deg, transparent 360deg);
          animation: ${t.frame}Spin 4s linear infinite;
        }
      `).join('')}
      @keyframes pdTitleShimmer {
        0%   { background-position: -300% center; }
        100% { background-position: 300% center; }
      }
      @keyframes pdCalmBreathe {
        0%, 100% { filter: drop-shadow(0 0 5px rgba(168,85,247,0.3)) drop-shadow(0 0 12px rgba(192,132,252,0.2)); letter-spacing: 0em; }
        50%       { filter: drop-shadow(0 0 16px rgba(168,85,247,0.8)) drop-shadow(0 0 32px rgba(216,180,254,0.4)); letter-spacing: 0.02em; }
      }
      .pd-title-mind {
        background: linear-gradient(90deg,
          #ffffff 0%, #ffffff 22%,
          #c084fc 38%, #a855f7 50%, #d8b4fe 60%,
          #ffffff 76%, #ffffff 100%
        );
        background-size: 320% auto;
        -webkit-background-clip: text; background-clip: text;
        -webkit-text-fill-color: transparent; color: transparent;
        animation: pdTitleShimmer 8s ease-in-out infinite;
      }
      .pd-title-calm {
        -webkit-text-fill-color: #e9d5ff; color: #e9d5ff;
        display: inline-block;
        animation: pdCalmBreathe 4s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById(ORBIT_ID)?.remove();
  }, []);

  const tab = TABS.find(t => t.id === activeTab) || TABS[0];
  const Panel = PANEL_MAP[activeTab] || D0Panel;

  const HERO_STATS = [
    { v: '8', l: 'Module', tip: 'D0–D7: từ nhập môn, stress, thở, thiền, journal, detox, kỷ luật đến theo dõi', idx: 'hero-d-0' },
    { v: '5ph', l: 'Mỗi ngày', tip: '5 phút Mind Reset mỗi ngày là đủ để bắt đầu thay đổi trạng thái tinh thần', idx: 'hero-d-1' },
    { v: '12', l: 'Tuần lộ trình', tip: 'Từ nhận diện stress → thiền ngắn → journaling → digital detox → kỷ luật mềm', idx: 'hero-d-2' },
    { v: '100', l: 'Calm Score', tip: 'Thang điểm tự đánh giá mỗi ngày: thở + journal + detox + routine tối + kỷ luật mềm', idx: 'hero-d-3' },
  ];

  return (
    <div className="px-4 md:px-6 max-w-4xl mx-auto pb-24">
      {/* Breadcrumb */}
      <Link to="/pillars" className="inline-flex items-center gap-2 text-base text-muted hover:text-purple-400 transition-colors mb-8 group">
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        Sống Khỏe 360
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${PURPLE_RGB},0.06)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0 animate-float" style={{ borderColor: `rgba(${PURPLE_RGB},0.2)` }}>🧘</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight animate-fade-in-up">
            {pillar?.title || 'Tâm Trí An Nhiên'}
          </h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: PURPLE, background: `rgba(${PURPLE_RGB},0.1)`, borderColor: `rgba(${PURPLE_RGB},0.2)` }}>{pillar?.subtitle || 'Mind & Calm'}</span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">{pillar?.description || 'An nhiên không phải là không có áp lực.'}</p>
        </div>
      </div>

      {/* Hero stats */}
      <div className="flex flex-wrap gap-4 mb-8">
        {HERO_STATS.map(s => (
          <div key={s.idx} className="group/stat relative">
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none opacity-0 group-hover/stat:opacity-100 scale-90 group-hover/stat:scale-100 -translate-y-1 group-hover/stat:translate-y-0 transition-all duration-200 origin-bottom">
              <ThoughtBubble text={s.tip} idx={s.idx} color={PURPLE} />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: PURPLE }}>{s.v}</div>
              <div className="text-base text-muted">{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero image */}
      <div className="pd-orbit-ring rounded-3xl p-[1.5px] mb-12">
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&auto=format&fit=crop" alt="Mind & Calm" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <div className="absolute bottom-4 left-6">
            <span className="text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: PURPLE, background: 'rgba(0,0,0,0.6)', borderColor: `rgba(${PURPLE_RGB},0.2)` }}>{pillar?.image_caption || 'Mind & Calm'}</span>
          </div>
        </div>
      </div>

      <div className="h-px mb-10" style={{ background: 'linear-gradient(to right, transparent, var(--color-border), transparent)' }} />

      {/* Tabs */}
      <RevealBlock className="mb-8">
        <div className="sticky top-[72px] z-30 -mx-4 md:-mx-6 px-4 md:px-6 pt-3"
          style={{ background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(14px)' }}>
          <div className="relative flex items-end overflow-x-auto scrollbar-none"
            style={{ borderBottom: '1.5px solid rgba(255,255,255,0.09)' }}>
            {TABS.map(t => {
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-2 shrink-0 font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer"
                  style={active ? {
                    color: t.color,
                    padding: '9px 16px 11px',
                    background: '#111213',
                    borderTop: `2px solid ${t.color}`,
                    borderLeft: '1px solid rgba(255,255,255,0.09)',
                    borderRight: '1px solid rgba(255,255,255,0.09)',
                    borderBottom: '1.5px solid #111213',
                    borderRadius: '8px 8px 0 0',
                    marginBottom: '-1.5px',
                    boxShadow: `0 -4px 16px rgba(${t.rgb},0.14)`,
                  } : {
                    color: 'rgba(130,130,148,0.72)',
                    padding: '7px 14px 12px',
                    background: 'transparent',
                    border: '1px solid transparent',
                    borderRadius: '8px 8px 0 0',
                  }}>
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-lg">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`${tab.frame} rounded-2xl p-[1.5px] mt-4`}>
          <div className="rounded-2xl bg-surface p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{tab.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-text">{tab.label}</h2>
                <div className="text-base font-bold uppercase tracking-widest" style={{ color: tab.color }}>{tab.id.toUpperCase()} · Tâm Trí An Nhiên</div>
              </div>
            </div>
            <Panel color={tab.color} onCardClick={activeTab === 'd0' ? setD0Modal : undefined} onLayerClick={activeTab === 'd1' ? setD1Modal : undefined} onTechClick={activeTab === 'd2' ? setD2Modal : undefined} onModeClick={activeTab === 'd3' ? setD3Modal : undefined} onPromptClick={activeTab === 'd4' ? setD4Modal : undefined} onLevelClick={activeTab === 'd5' ? setD5Modal : undefined} onHabitClick={activeTab === 'd6' ? setD6Modal : undefined} onItemClick={activeTab === 'd7' ? setD7Modal : undefined} />
          </div>
        </div>
      </RevealBlock>

      {/* Core quote */}
      <RevealBlock className="mb-14">
        <blockquote className="rounded-2xl p-6 border-l-4 relative overflow-hidden" style={{ borderLeftColor: PURPLE, background: `rgba(${PURPLE_RGB},0.05)` }}>
          <div className="text-5xl absolute right-6 top-4 opacity-10" style={{ color: PURPLE }}>"</div>
          <p className="text-xl font-medium text-text leading-relaxed italic">"Tâm trí an nhiên không phải là không còn áp lực, mà là biết cách hạ nhịp, quay lại và sống khỏe bền hơn mỗi ngày."</p>
          <cite className="text-base text-muted mt-3 block">— Triết lý Tâm Trí An Nhiên</cite>
        </blockquote>
      </RevealBlock>

      {/* Teaser sections */}
      <RevealBlock>
        <h2 className="text-3xl md:text-4xl font-bold text-text mb-2">Khám Phá Chi Tiết</h2>
        <p className="text-muted text-lg mb-10">12 trang chuyên sâu — từ nền tảng đến thực hành và công cụ theo dõi.</p>

        <TeaserSection title="Nền Tảng & Nhận Diện">
          <TeaserCard to="/pillar/d/stress" color="#8b5cf6" rgb="139,92,246" icon="🌪️" category="Nền Tảng" title="Hiểu Stress & Vòng Lặp Lo Âu" accent="3 tầng · Trigger · Vòng lặp" desc="Stress không phải kẻ thù. Hiểu cơ chế để nhận diện sớm và chèn điểm dừng vào vòng lặp lo âu–thói quen." features={['3 tầng: cơ thể, cảm xúc, hành vi', 'Mô hình Trigger → Hành vi → Hậu quả', 'Kỹ thuật đặt tên cho suy nghĩ']} stats={[{ v: '3', l: 'Tầng' }, { v: '5', l: 'Trigger' }]} image="https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&q=80" imageAlt="Stress" cta="Hiểu stress →" />
          <TeaserCard to="/pillar/d/assessment" color="#a855f7" rgb="168,85,247" icon="📋" category="Đánh Giá" title="Mind & Calm Assessment" accent="7 câu hỏi · 3 Track" desc="Đánh giá trạng thái tinh thần hiện tại qua 7 khía cạnh. Xác định Track phù hợp và hành động ưu tiên." features={['Điểm Mind & Calm ban đầu', 'Xác định Track 1–3', 'Đề xuất hành động cá nhân hóa']} stats={[{ v: '7', l: 'Câu hỏi' }, { v: '3', l: 'Tracks' }]} image="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&q=80" imageAlt="Assessment" cta="Đánh giá ngay →" />
        </TeaserSection>

        <TeaserSection title="Công Cụ Thực Hành">
          <TeaserCard to="/pillar/d/breathing" color="#6366f1" rgb="99,102,241" icon="🫁" category="Thực Hành" title="Kỹ Thuật Thở" accent="4 kỹ thuật · Timer tương tác" desc="Thở cơ hoành, box breathing 4-4-4-4, thở 4-7-8 và reset 2 phút — mỗi kỹ thuật cho một tình huống cụ thể." features={['Thở cơ hoành: nền tảng', 'Box breathing: tập trung & bình tĩnh', 'Thở 4-7-8: chuẩn bị ngủ', 'Reset 2 phút: dùng ngay khi quá tải']} stats={[{ v: '4', l: 'Kỹ thuật' }, { v: '2ph', l: 'Tối thiểu' }]} image="https://images.unsplash.com/photo-1518609571773-39b7d303a87b?w=800&q=80" imageAlt="Breathing" cta="Xem kỹ thuật →" />
          <TeaserCard to="/pillar/d/meditation" color="#d946ef" rgb="217,70,239" icon="🧘" category="Thực Hành" title="Thiền Ngắn & Chánh Niệm" accent="3 phút · Body scan · Mindful walking" desc="Thiền không cần ngồi 1 tiếng. 3 phút quan sát hơi thở, 5 phút body scan trước ngủ, chánh niệm khi ăn và đi bộ." features={['Thiền 3 phút cho người mới', 'Body scan 5 phút trước ngủ', 'Chánh niệm khi ăn & đi bộ', 'Lộ trình tăng dần 3→10 phút']} stats={[{ v: '3ph', l: 'Bắt đầu' }, { v: '4', l: 'Kiểu thiền' }]} image="https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80" imageAlt="Meditation" cta="Thực hành →" />
          <TeaserCard to="/pillar/d/body-scan" color="#ec4899" rgb="236,72,153" icon="🔍" category="Thực Hành" title="Body Scan" accent="10 phút · Phục hồi sâu" desc="Body scan 10 phút từng vùng cơ thể — từ trán đến ngón chân. Công cụ thiền tốt nhất cho người khó ngủ và căng cơ." features={['Scan từng vùng cơ thể có hướng dẫn', 'Progressive muscle relaxation', 'Dùng sau tập nặng hoặc trước ngủ', 'Audio guidance từng bước']} stats={[{ v: '10ph', l: 'Thời gian' }, { v: '8', l: 'Vùng scan' }]} image="https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80" imageAlt="Body Scan" cta="Bắt đầu scan →" />
          <TeaserCard to="/pillar/d/journaling" color="#ec4899" rgb="236,72,153" icon="📓" category="Thực Hành" title="Journaling 5 Dòng" accent="5 phút · Mỗi tối" desc="5 câu hỏi mỗi tối giúp dọn rác trong đầu, nhận ra cảm xúc và chuẩn bị cho ngày mai nhẹ nhàng hơn." features={['Mẫu journal 5 dòng cơ bản', 'Journal khi ăn theo cảm xúc', 'Journal sau ngày fail', 'Template in & dùng']} stats={[{ v: '5', l: 'Câu hỏi' }, { v: '5ph', l: 'Mỗi tối' }]} image="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80" imageAlt="Journaling" cta="Xem template →" />
        </TeaserSection>

        <TeaserSection title="Quản Lý Tâm Trí">
          <TeaserCard to="/pillar/d/brain-dump" color="#0ea5e9" rgb="14,165,233" icon="🧠" category="Công Cụ" title="Xả Não & Brain Dump" accent="Brain dump · Vòng tròn kiểm soát" desc="Khi đầu quá nhiều việc, viết tất cả ra giấy rồi phân loại: làm ngay, lên kế hoạch, hoặc buông tạm." features={['Kỹ thuật Brain Dump 5 phút', 'Vòng tròn kiểm soát: tôi kiểm soát được gì?', 'Phân loại: làm ngay / kế hoạch / buông', 'Danh sách lo âu']} stats={[{ v: '5ph', l: 'Brain dump' }, { v: '3', l: 'Nhóm việc' }]} image="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80" imageAlt="Brain Dump" cta="Xả não ngay →" />
          <TeaserCard to="/pillar/d/digital-detox" color="#0ea5e9" rgb="14,165,233" icon="📵" category="Công Cụ" title="Digital Detox" accent="3 mức · Không cực đoan" desc="Giảm màn hình thông minh — không ép bỏ điện thoại hoàn toàn mà thiết kế môi trường số giúp não có khoảng thở." features={['3 mức: Dễ → Chuẩn → Nâng cao', 'Menu thay thế cho lướt điện thoại', 'Thiết kế môi trường số', '7-day digital detox plan']} stats={[{ v: '3', l: 'Mức độ' }, { v: '7', l: 'Ngày plan' }]} image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80" imageAlt="Digital Detox" cta="Bắt đầu detox →" />
          <TeaserCard to="/pillar/d/gentle-discipline" color="#10b981" rgb="16,185,129" icon="🌱" category="Tư Duy" title="Kỷ Luật Mềm" accent="Quy tắc 1% · Không tự trách" desc="Kỷ luật mềm là cách duy trì thói quen mà không tự làm mình kiệt sức. Quay lại bằng bản nhỏ nhất sau mỗi ngày lệch." features={['Quy tắc 1% quay lại sau ngày fail', 'Bản tối thiểu cho mọi thói quen', 'Xử lý ăn uống cảm xúc', 'Tối giản mục tiêu: 1–2 thay đổi/giai đoạn']} stats={[{ v: '1%', l: 'Quay lại' }, { v: '6', l: 'Tình huống' }]} image="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&q=80" imageAlt="Gentle Discipline" cta="Học kỷ luật mềm →" />
          <TeaserCard to="/pillar/d/habits" color="#10b981" rgb="16,185,129" icon="🔗" category="Tư Duy" title="Thói Quen Nhỏ Bền Vững" accent="Habit stacking · 3 phút/ngày" desc="Thói quen tốt không đến từ ý chí mạnh — mà từ hệ thống nhỏ lặp lại. Ghép thói quen mới vào điểm neo hiện có." features={['Habit stacking: ghép vào thói quen cũ', 'Cue → Routine → Reward', '7 thói quen nhỏ Mind & Calm', 'Streak tracker tích hợp']} stats={[{ v: '7', l: 'Thói quen' }, { v: '21', l: 'Ngày hình thành' }]} image="https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80" imageAlt="Habits" cta="Xây thói quen →" />
        </TeaserSection>

        <TeaserSection title="Theo Dõi & Lộ Trình">
          <TeaserCard to="/pillar/d/checklist" color="#f59e0b" rgb="245,158,11" icon="✅" category="Công Cụ" title="Daily Calm Checklist" accent="6 mục · Calm Score · Streak" desc="Checklist hằng ngày với 6 hành động Mind & Calm. Theo dõi điểm số, chuỗi ngày liên tiếp và mood từng ngày." features={['6 mục checklist Mind & Calm', 'Calm Score 100 điểm/ngày', 'Mood tracker 😣→😄', 'Streak ngày liên tiếp']} stats={[{ v: '6', l: 'Mục hàng ngày' }, { v: '100', l: 'Điểm tối đa' }]} image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80" imageAlt="Checklist" cta="Mở checklist →" />
          <TeaserCard to="/pillar/d/roadmap" color="#a855f7" rgb="168,85,247" icon="🗺️" category="Lộ Trình" title="Lộ Trình 12 Tuần Mind & Calm" accent="6 giai đoạn · 3–10 phút/ngày" desc="Từ nhận diện stress → thở → journaling → digital detox → kỷ luật mềm → cá nhân hóa routine. Mỗi ngày chỉ cần 3–10 phút." features={['Tuần 1–2: Nhận diện stress & reset', 'Tuần 3–4: Thở có chủ ý', 'Tuần 5–6: Journaling & xả não', 'Tuần 7–12: Detox, kỷ luật, cá nhân hóa']} stats={[{ v: '12', l: 'Tuần' }, { v: '6', l: 'Giai đoạn' }]} image="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80" imageAlt="Roadmap" cta="Xem lộ trình →" />
        </TeaserSection>
      </RevealBlock>

      {d0Modal !== null && (
        <CardModal
          item={D0_CARD_MODALS[d0Modal]}
          onClose={() => setD0Modal(null)}
          onPrev={() => setD0Modal(i => Math.max(0, i - 1))}
          onNext={() => setD0Modal(i => Math.min(D0_CARD_MODALS.length - 1, i + 1))}
          hasPrev={d0Modal > 0}
          hasNext={d0Modal < D0_CARD_MODALS.length - 1}
          total={D0_CARD_MODALS.length}
          idx={d0Modal}
        />
      )}

      {d1Modal !== null && (
        <CardModal
          item={D1_LAYER_MODALS[d1Modal]}
          onClose={() => setD1Modal(null)}
          onPrev={() => setD1Modal(i => Math.max(0, i - 1))}
          onNext={() => setD1Modal(i => Math.min(D1_LAYER_MODALS.length - 1, i + 1))}
          hasPrev={d1Modal > 0}
          hasNext={d1Modal < D1_LAYER_MODALS.length - 1}
          total={D1_LAYER_MODALS.length}
          idx={d1Modal}
        />
      )}

      {d2Modal !== null && (
        <CardModal
          item={D2_TECH_MODALS[d2Modal]}
          onClose={() => setD2Modal(null)}
          onPrev={() => setD2Modal(i => Math.max(0, i - 1))}
          onNext={() => setD2Modal(i => Math.min(D2_TECH_MODALS.length - 1, i + 1))}
          hasPrev={d2Modal > 0}
          hasNext={d2Modal < D2_TECH_MODALS.length - 1}
          total={D2_TECH_MODALS.length}
          idx={d2Modal}
        />
      )}

      {d3Modal !== null && (
        <CardModal
          item={D3_MODE_MODALS[d3Modal]}
          onClose={() => setD3Modal(null)}
          onPrev={() => setD3Modal(i => Math.max(0, i - 1))}
          onNext={() => setD3Modal(i => Math.min(D3_MODE_MODALS.length - 1, i + 1))}
          hasPrev={d3Modal > 0}
          hasNext={d3Modal < D3_MODE_MODALS.length - 1}
          total={D3_MODE_MODALS.length}
          idx={d3Modal}
        />
      )}

      {d4Modal !== null && (
        <CardModal
          item={D4_PROMPT_MODALS[d4Modal]}
          onClose={() => setD4Modal(null)}
          onPrev={() => setD4Modal(i => Math.max(0, i - 1))}
          onNext={() => setD4Modal(i => Math.min(D4_PROMPT_MODALS.length - 1, i + 1))}
          hasPrev={d4Modal > 0}
          hasNext={d4Modal < D4_PROMPT_MODALS.length - 1}
          total={D4_PROMPT_MODALS.length}
          idx={d4Modal}
        />
      )}

      {d5Modal !== null && (
        <CardModal
          item={D5_LEVEL_MODALS[d5Modal]}
          onClose={() => setD5Modal(null)}
          onPrev={() => setD5Modal(i => Math.max(0, i - 1))}
          onNext={() => setD5Modal(i => Math.min(D5_LEVEL_MODALS.length - 1, i + 1))}
          hasPrev={d5Modal > 0}
          hasNext={d5Modal < D5_LEVEL_MODALS.length - 1}
          total={D5_LEVEL_MODALS.length}
          idx={d5Modal}
        />
      )}

      {d6Modal !== null && (
        <CardModal
          item={D6_HABIT_MODALS[d6Modal]}
          onClose={() => setD6Modal(null)}
          onPrev={() => setD6Modal(i => Math.max(0, i - 1))}
          onNext={() => setD6Modal(i => Math.min(D6_HABIT_MODALS.length - 1, i + 1))}
          hasPrev={d6Modal > 0}
          hasNext={d6Modal < D6_HABIT_MODALS.length - 1}
          total={D6_HABIT_MODALS.length}
          idx={d6Modal}
        />
      )}

      {d7Modal !== null && (
        <CardModal
          item={D7_ITEM_MODALS[d7Modal]}
          onClose={() => setD7Modal(null)}
          onPrev={() => setD7Modal(i => Math.max(0, i - 1))}
          onNext={() => setD7Modal(i => Math.min(D7_ITEM_MODALS.length - 1, i + 1))}
          hasPrev={d7Modal > 0}
          hasNext={d7Modal < D7_ITEM_MODALS.length - 1}
          total={D7_ITEM_MODALS.length}
          idx={d7Modal}
        />
      )}
    </div>
  );
}
