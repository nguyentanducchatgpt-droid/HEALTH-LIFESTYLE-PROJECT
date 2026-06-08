import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const COLOR = '#6366f1';
const RGB = '99,102,241';
const ORBIT_ID = 'e-media-orbit-kf';
const ORBIT_CLASS = 'e-media-orbit-ring';
const ORBIT_PROP = '--e-media-orbit-angle';

const FILTER_QUESTIONS = [
  { q: '1. Nguồn là ai?', good: 'WHO, CDC, Bộ Y tế, tạp chí peer-reviewed (PubMed, Lancet, NEJM)', bad: 'Facebook cá nhân, group sức khỏe không xác minh, trang tin không có tên tác giả' },
  { q: '2. Bằng chứng là gì?', good: 'Nghiên cứu có đối chứng (RCT), meta-analysis, systematic review', bad: '"1 người dùng và khỏi", "nghiên cứu tôi tự làm", không trích nguồn' },
  { q: '3. Tuyên bố có hợp lý không?', good: '"Có thể giúp cải thiện...", "Theo nghiên cứu X trong điều kiện Y..."', bad: '"Chữa khỏi 100%", "bác sĩ không muốn bạn biết điều này"' },
  { q: '4. Có lợi ích tài chính không?', good: 'Thông tin giáo dục thuần túy, không bán sản phẩm', bad: 'Nội dung kết thúc bằng link mua hàng, hoa hồng affiliate' },
  { q: '5. Thông tin có mới không?', good: 'Được cập nhật trong 2–3 năm gần đây (y học thay đổi nhanh)', bad: 'Bài viết từ 2010 vẫn đang lan truyền như mới' },
];

const DANGEROUS_PATTERNS = [
  { icon: '❌', pattern: '"Bí quyết mà bác sĩ giấu bạn"', explain: 'Không có âm mưu ẩn — bác sĩ học 6–10 năm để chữa bệnh, không có động cơ che giấu.' },
  { icon: '❌', pattern: '"Chữa khỏi mọi bệnh" hoặc "không tác dụng phụ"', explain: 'Mọi chất có tác dụng sinh học đều có thể có tác dụng phụ tùy liều và người dùng.' },
  { icon: '❌', pattern: 'Ảnh trước/sau đáng ngờ', explain: 'Góc chụp, ánh sáng, quần áo, tư thế có thể tạo ra sự khác biệt giả. Yêu cầu dữ liệu chứng minh từ nghiên cứu độc lập.' },
  { icon: '❌', pattern: '"Giải độc cơ thể" hoặc "thải độc"', explain: 'Gan và thận đã là hệ thống thải độc hoàn hảo. Không có bằng chứng khoa học nào ủng hộ "detox" thương mại.' },
  { icon: '❌', pattern: 'Testimonial thay cho bằng chứng', explain: '"1.000 người đã thử và thành công" không phải dữ liệu khoa học — cần nhóm đối chứng, kiểm soát yếu tố nhiễu.' },
  { icon: '❌', pattern: 'Sợ hãi + giải pháp tức thì', explain: 'Tạo lo lắng rồi cung cấp "giải pháp" — đây là mô hình marketing. Thông tin tốt giải thích, không dọa nạt.' },
];

const TRUSTED_SOURCES = [
  { name: 'PubMed', url: 'pubmed.ncbi.nlm.nih.gov', desc: 'Cơ sở dữ liệu nghiên cứu y khoa lớn nhất, hơn 35 triệu bài báo' },
  { name: 'WHO', url: 'who.int', desc: 'Tổ chức Y tế Thế giới — hướng dẫn và cập nhật sức khỏe toàn cầu' },
  { name: 'CDC', url: 'cdc.gov', desc: 'Trung tâm Kiểm soát và Phòng ngừa Bệnh tật Hoa Kỳ' },
  { name: 'Bộ Y tế Việt Nam', url: 'moh.gov.vn', desc: 'Thông tin y tế chính thức tại Việt Nam' },
  { name: 'UpToDate', url: 'uptodate.com', desc: 'Tài liệu tham khảo lâm sàng được bác sĩ toàn cầu tin dùng' },
  { name: 'Examine.com', url: 'examine.com', desc: 'Tổng hợp bằng chứng về bổ sung dinh dưỡng và thảo dược' },
];

function RevealBlock({ children, delay = 0, className = '' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const io = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
        { threshold: 0.07 }
      );
      const el = document.getElementById(`reveal-media-${delay}`);
      if (el) io.observe(el);
      return () => io.disconnect();
    }, 50);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div id={`reveal-media-${delay}`} className={className}
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(26px)', transition: `opacity 0.55s ease ${delay * 0.1}s, transform 0.55s ease ${delay * 0.1}s` }}>
      {children}
    </div>
  );
}

function MisinfoChecker() {
  const [text, setText] = useState('');
  const [score, setScore] = useState(null);

  const redFlags = ['chữa khỏi', 'bác sĩ không muốn', 'bí quyết', '100%', 'không tác dụng phụ', 'thải độc', 'detox', 'tuyệt vời', 'thần kỳ', 'kỳ diệu'];

  function check() {
    if (!text.trim()) return;
    const lower = text.toLowerCase();
    const found = redFlags.filter(f => lower.includes(f));
    setScore(found);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="font-bold mb-3" style={{ color: COLOR }}>Kiểm Tra Thông Tin Nhanh</h3>
      <p className="text-base text-muted mb-3">Dán tiêu đề hoặc đoạn trích nội dung y tế bạn đọc vào đây:</p>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={4}
        placeholder="Ví dụ: 'Uống nước lá X chữa khỏi tiểu đường trong 7 ngày, bác sĩ không muốn bạn biết...'"
        className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-lg text-text placeholder-muted resize-none mb-3"
      />
      <button onClick={check} className="px-5 py-2 rounded-xl text-lg font-bold text-white mb-4" style={{ background: COLOR }}>
        Phân Tích
      </button>
      {score !== null && (
        <div className={`rounded-xl p-4 border ${score.length === 0 ? 'border-emerald-500/30' : 'border-red-500/30'}`}
          style={{ background: score.length === 0 ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)' }}>
          {score.length === 0
            ? <p className="text-lg text-emerald-400">✓ Không tìm thấy cờ đỏ rõ ràng. Vẫn nên kiểm tra nguồn và bằng chứng.</p>
            : <>
              <p className="text-lg text-red-400 font-bold mb-2">⚠ Phát hiện {score.length} cờ đỏ:</p>
              <div className="flex flex-wrap gap-2">
                {score.map((f, i) => <span key={i} className="text-base px-2 py-1 rounded-full bg-red-500/20 text-red-400">"{f}"</span>)}
              </div>
              <p className="text-base text-muted mt-2">Đây là dấu hiệu có thể chứa thông tin sai lệch. Hãy kiểm tra nguồn gốc và tìm bằng chứng khoa học.</p>
            </>
          }
        </div>
      )}
    </div>
  );
}

export default function HealthMediaLiteracyPage() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = ORBIT_ID;
    style.textContent = `
      @property ${ORBIT_PROP} { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
      @keyframes eMediaOrbitSpin { to { ${ORBIT_PROP}: 360deg; } }
      .${ORBIT_CLASS} {
        background: conic-gradient(
          from var(${ORBIT_PROP}),
          transparent 0deg, transparent 55deg,
          rgba(${RGB},0.0) 65deg, rgba(${RGB},0.75) 85deg,
          rgba(255,255,255,0.9) 92deg, rgba(${RGB},0.75) 99deg,
          rgba(${RGB},0.0) 115deg, transparent 125deg, transparent 360deg
        );
        animation: eMediaOrbitSpin 3.5s linear infinite;
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
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🔍</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">Lọc Thông Tin Y Tế</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            Media Literacy · Phân biệt thật giả
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            Thông tin y tế sai lệch (medical misinformation) là một trong những vấn đề sức khỏe công cộng lớn nhất. WHO gọi đây là "infodemic" — đại dịch thông tin. Học cách lọc thông tin là kỹ năng bảo vệ sức khỏe trong kỷ nguyên số.
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80&auto=format&fit=crop" alt="Lọc thông tin" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            Tư duy phản biện · Bằng chứng khoa học
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>5 Câu Hỏi Để Lọc Thông Tin</h2>
        <p className="text-muted text-lg mb-6">Áp dụng mỗi khi đọc thông tin y tế trên mạng xã hội, group sức khỏe, hoặc từ người thân.</p>
        <div className="space-y-4">
          {FILTER_QUESTIONS.map((fq, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-5">
              <div className="font-bold text-text mb-3" style={{ color: COLOR }}>{fq.q}</div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div className="text-base font-bold text-emerald-400 mb-1">✓ Đáng tin</div>
                  <p className="text-base text-muted">{fq.good}</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div className="text-base font-bold text-red-400 mb-1">✗ Nghi ngờ</div>
                  <p className="text-base text-muted">{fq.bad}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Nhận Biết Thông Tin Sai Lệch</h2>
        <p className="text-muted text-lg mb-6">6 pattern phổ biến nhất trong thông tin y tế sai lệch trên mạng.</p>
        <div className="space-y-3">
          {DANGEROUS_PATTERNS.map((d, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 flex gap-3">
              <span className="text-2xl shrink-0">{d.icon}</span>
              <div>
                <div className="font-bold text-lg text-red-400 mb-1">{d.pattern}</div>
                <p className="text-base text-muted">{d.explain}</p>
              </div>
            </div>
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Kiểm Tra Thông Tin</h2>
        <MisinfoChecker />
      </RevealBlock>

      <RevealBlock delay={3} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>Nguồn Thông Tin Đáng Tin Cậy</h2>
        <p className="text-muted text-lg mb-5">Bookmark những nguồn này để tra cứu khi cần.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {TRUSTED_SOURCES.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-4 hover:border-indigo-500/30 transition-colors">
              <div className="font-bold text-lg text-text mb-1">{s.name}</div>
              <div className="text-base font-mono text-muted mb-1">{s.url}</div>
              <p className="text-base text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← Quay lại Kiến Thức Sức Khỏe</Link>
    </div>
  );
}
