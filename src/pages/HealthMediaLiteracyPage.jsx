import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const COLOR = '#6366f1';
const RGB = '99,102,241';
const ORBIT_ID = 'e-media-orbit-kf';
const ORBIT_CLASS = 'e-media-orbit-ring';
const ORBIT_PROP = '--e-media-orbit-angle';

const FILTER_QUESTIONS = [
  {
    num: '01', icon: '🏛️', q: '1. Nguồn là ai?',
    good: 'WHO, CDC, Bộ Y tế, tạp chí peer-reviewed (PubMed, Lancet, NEJM)',
    bad: 'Facebook cá nhân, group sức khỏe không xác minh, trang tin không có tên tác giả',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    keyFact: '🏛️ 97% thông tin y tế sai lệch lan truyền qua mạng xã hội xuất phát từ nguồn không được kiểm chứng. Uy tín của tác giả và tổ chức đứng sau thông tin là bộ lọc nhanh và hiệu quả nhất.',
    details: [
      'Hệ thống phân cấp nguồn tin: Cấp 1 — tổ chức y tế quốc tế (WHO, CDC, NIH, EMA) và Bộ Y tế: đưa ra hướng dẫn dựa trên tổng hợp hàng ngàn nghiên cứu. Cấp 2 — tạp chí peer-reviewed (Nature Medicine, Lancet, NEJM, JAMA, BMJ): mỗi bài qua ít nhất 2–3 chuyên gia độc lập đánh giá. Cấp 3 — bệnh viện và trung tâm nghiên cứu uy tín: Mayo Clinic, Cleveland Clinic, các đại học y. Cấp 4 trở xuống: báo chí đại chúng (đưa tin về nghiên cứu — không phải nghiên cứu gốc), blog, mạng xã hội.',
      'Quy trình peer-review (đánh giá đồng nghiệp): khi nhà khoa học nộp bài báo, tạp chí gửi cho 2–3 chuyên gia độc lập trong lĩnh vực đó đánh giá phương pháp, kết quả và kết luận. Thời gian thường 3–12 tháng. Nhiều bài bị từ chối (tỷ lệ từ chối ở Lancet, NEJM lên đến 90%+). Peer-review không hoàn hảo nhưng là cơ chế lọc quan trọng nhất trong khoa học.',
      'Tạp chí predatory (ăn bám) — bẫy uy tín giả: có hàng nghìn tạp chí "mở" tính phí xuất bản ($500–5.000 USD) nhưng không có peer-review thực sự — chấp nhận gần như mọi bài nộp. Danh sách Beall (Beall\'s List) liệt kê các tạp chí predatory. Tên tạp chí nghe có vẻ khoa học ("Journal of Advanced Medical Research") nhưng không có uy tín. Kiểm tra tạp chí trên PubMed hoặc Scopus để xác nhận.',
      'Kiểm tra tác giả và tổ chức: tác giả có học vị và chuyên môn phù hợp không (bác sĩ viết về bệnh tim mạch vs kỹ sư phần mềm viết về điều trị ung thư)? Tổ chức có liên quan đến sản phẩm đang được quảng bá không? Bài viết có ghi tên tác giả cụ thể không (không phải "Ban biên tập")? Tác giả có conflict of interest (xung đột lợi ích) được công bố không?',
      'Mạng xã hội và echo chamber: Facebook, TikTok, YouTube dùng algorithm để giữ người dùng tương tác — không phải để cung cấp thông tin chính xác. Nội dung cảm xúc mạnh (sợ hãi, phẫn nộ, kỳ diệu) lan truyền nhanh hơn thông tin chính xác nhưng nhàm. Nghiên cứu MIT (2018) cho thấy tin sai lan truyền nhanh gấp 6 lần tin đúng trên Twitter. Group sức khỏe trên Facebook không có cơ chế kiểm duyệt chuyên môn.',
      'Công cụ kiểm tra nguồn nhanh: Google Scholar (scholar.google.com) — tìm bài báo khoa học gốc. PubMed (pubmed.ncbi.nlm.nih.gov) — cơ sở dữ liệu y khoa lớn nhất. Snopes, FactCheck.org, PolitiFact — kiểm tra tin giả. WHO Myth Busters — giải thích các quan niệm sai phổ biến. Full Fact (UK) — fact-checking y tế.',
    ],
    points: [
      { icon: '📚', label: 'Peer-review = đã qua chuyên gia kiểm duyệt', note: 'Lancet, NEJM từ chối > 90% bài nộp — chỉ đăng tốt nhất' },
      { icon: '⚠️', label: 'Tạp chí predatory: tên khoa học, không peer-review', note: 'Kiểm tra trên PubMed/Scopus trước khi tin tưởng nguồn' },
      { icon: '📱', label: 'Mạng xã hội: tin sai lan nhanh gấp 6 lần tin đúng', note: 'Algorithm ưu tiên tương tác, không phải độ chính xác' },
      { icon: '🔍', label: 'Google Scholar + PubMed: tìm bài gốc', note: 'Báo đại chúng đưa tin về nghiên cứu — không phải nghiên cứu' },
    ],
  },
  {
    num: '02', icon: '🔬', q: '2. Bằng chứng là gì?',
    good: 'Nghiên cứu có đối chứng (RCT), meta-analysis, systematic review',
    bad: '"1 người dùng và khỏi", "nghiên cứu tôi tự làm", không trích nguồn',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    keyFact: '🔬 Kim tự tháp bằng chứng: Systematic review & meta-analysis ở đỉnh, RCT ở giữa, còn câu chuyện cá nhân (anecdote) ở đáy. "1 người dùng và khỏi" là bằng chứng yếu nhất trong khoa học — không thể phân biệt tác dụng thật vs tự khỏi vs placebo.',
    details: [
      'Kim tự tháp bằng chứng (Evidence Pyramid) từ mạnh đến yếu: (1) Systematic review + meta-analysis: tổng hợp tất cả RCT về một câu hỏi, cho kết quả có độ chính xác cao nhất. (2) RCT (Randomized Controlled Trial): phân nhóm ngẫu nhiên, có nhóm đối chứng — "tiêu chuẩn vàng" để chứng minh nhân quả. (3) Cohort study: theo dõi nhóm người theo thời gian. (4) Case-control: so sánh người có bệnh với nhóm không có bệnh. (5) Case report: báo cáo 1–vài trường hợp. (6) Expert opinion. (7) Anecdote (câu chuyện cá nhân).',
      'Tại sao cần nhóm đối chứng: giả sử bạn uống thuốc X và khỏi trong 7 ngày — có thể thuốc hiệu quả, nhưng cũng có thể bệnh tự khỏi sau 7 ngày (cảm cúm thông thường tự khỏi trong 5–10 ngày), hoặc bạn thay đổi lối sống đồng thời, hoặc placebo effect. Chỉ RCT với nhóm đối chứng (uống giả dược) mới phân biệt được tác dụng thật vs những yếu tố này.',
      'Placebo effect — mạnh hơn bạn nghĩ: nghiên cứu cho thấy placebo có thể giảm đau 30–40%, cải thiện triệu chứng trầm cảm 25–35%, và thậm chí giảm triệu chứng Parkinson quan sát được. Đây là lý do mọi thuốc phải so sánh với giả dược trong RCT, không phải "so với không điều trị gì". Câu chuyện "tôi dùng X và khỏi" không loại trừ được placebo.',
      'P-value và ý nghĩa thống kê — bị hiểu sai rộng rãi: p < 0.05 có nghĩa là "xác suất kết quả này xảy ra ngẫu nhiên là dưới 5%" — không có nghĩa là "thuốc hiệu quả 95%". Một nghiên cứu nhỏ (n=50) có thể cho p < 0.05 nhưng effect size rất nhỏ (không có ý nghĩa lâm sàng). Cần xem effect size (mức độ hiệu quả thực tế) cùng với p-value. Statistical significance ≠ Clinical significance.',
      'Replication crisis — ngay cả nghiên cứu đã đăng cũng có thể sai: dự án Reproducibility Project (2015) cố gắng tái lập 100 nghiên cứu tâm lý học đã đăng — chỉ 36–39% cho kết quả tương tự. Trong y học, nhiều "phát hiện" từ nghiên cứu nhỏ ban đầu không được xác nhận trong nghiên cứu lớn hơn sau đó. Đây là lý do meta-analysis và systematic review quan trọng hơn một nghiên cứu đơn lẻ.',
      'Dấu hiệu nghiên cứu yếu hoặc sai lệch: cỡ mẫu nhỏ (n < 100 với cú kết luận rộng); không có nhóm đối chứng; tự báo cáo (self-reported outcomes — dễ bị bias); follow-up ngắn; nghiên cứu trên động vật được ngoại suy cho người; không công bố conflict of interest; kết quả quá tốt để là thật (effect size quá lớn); chỉ đăng 1 lần và không có nghiên cứu lặp lại.',
    ],
    points: [
      { icon: '🏆', label: 'Systematic review > RCT > anecdote', note: 'Kim tự tháp bằng chứng — "1 người khỏi" ở đáy' },
      { icon: '🎭', label: 'Placebo giảm đau 30–40% — không thể bỏ qua', note: 'Chỉ RCT với giả dược mới phân biệt được tác dụng thật' },
      { icon: '📊', label: 'P-value ≠ hiệu quả thực tế', note: 'p < 0.05 không có nghĩa thuốc hiệu quả — cần effect size' },
      { icon: '🔄', label: 'Replication crisis: 39% nghiên cứu không tái lập được', note: 'Một nghiên cứu đơn lẻ chưa đủ — cần tổng hợp nhiều nghiên cứu' },
    ],
  },
  {
    num: '03', icon: '🧠', q: '3. Tuyên bố có hợp lý không?',
    good: '"Có thể giúp cải thiện...", "Theo nghiên cứu X trong điều kiện Y..."',
    bad: '"Chữa khỏi 100%", "bác sĩ không muốn bạn biết điều này"',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
    keyFact: '🧠 Nguyên tắc Carl Sagan: "Extraordinary claims require extraordinary evidence." Tuyên bố càng cực đoan (chữa mọi bệnh, không tác dụng phụ, hiệu quả 100%) đòi hỏi bằng chứng càng mạnh — và thường không có.',
    details: [
      'Phân tích ngôn ngữ — cách phát hiện tuyên bố thổi phồng: Ngôn ngữ ĐÁNG TIN: "có thể giúp cải thiện", "theo nghiên cứu X trên đối tượng Y", "một số người ghi nhận", "nghiên cứu cho thấy mối liên quan" (không phải nhân quả). Ngôn ngữ CẦN NGHI NGỜ: "chữa khỏi", "loại bỏ hoàn toàn", "100%", "không tác dụng phụ", "thần kỳ", "đột phá", "bác sĩ không muốn bạn biết". Không có gì trong y học là "100%" — ngay cả vaccine không đạt 100% hiệu quả với mọi người.',
      'Hợp lý sinh học (biological plausibility): tuyên bố có cơ chế sinh lý học hợp lý không? Ví dụ "vitamin C hỗ trợ miễn dịch" — có cơ chế rõ ràng (cofactor cho sản xuất collagen, hỗ trợ hoạt động tế bào miễn dịch). Ngược lại "nước kiềm chữa ung thư" — không có cơ chế hợp lý (dạ dày trung hòa pH ngay lập tức, nước không thể thay đổi pH máu trừ khi bị nhiễm kiềm nặng).',
      'Quan hệ liều-đáp ứng (dose-response): một chất có tác dụng sinh học thực sự thường biểu hiện dose-response — nhiều hơn thì hiệu quả hơn (đến một điểm). Nếu không có dose-response, nghi ngờ cao về cơ chế. Tuyên bố "chỉ cần 1 giọt/ngày chữa mọi bệnh" vi phạm nguyên tắc này.',
      'Universality trap — không có gì chữa "mọi bệnh": ung thư không phải một bệnh — là hơn 200 loại bệnh khác nhau với cơ chế và điều trị khác nhau. Tuyên bố một thứ chữa được tiểu đường lẫn ung thư lẫn huyết áp là dấu hiệu rõ ràng của thông tin sai. Ngay cả aspirin (một trong các thuốc được nghiên cứu nhiều nhất) chỉ có chỉ định cụ thể, không phải "tốt cho mọi thứ".',
      'Conspiracy framing — "bác sĩ giấu bạn": tuyên bố rằng y học chính thống "che giấu" sự thật để kiếm tiền từ bệnh nhân vi phạm nhận thức về cách khoa học vận hành. Hàng triệu nhà khoa học, bác sĩ, nhà nghiên cứu trên toàn cầu làm việc độc lập — không có âm mưu toàn cầu nào có thể giữ bí mật lâu dài. Nếu có thuốc chữa ung thư thực sự, đó sẽ là phát hiện của thế kỷ — ai phát hiện đều nổi tiếng và giàu vô cùng, không có lý do che giấu.',
      'Kiểm tra tính nhất quán với kiến thức y học đã được thiết lập: nếu một tuyên bố mâu thuẫn với hàng nghìn nghiên cứu đã được tái lập — cần bằng chứng RẤT mạnh. Thuyết "không có vaccine nào an toàn" mâu thuẫn với hàng trăm triệu dữ liệu an toàn từ nhiều thập kỷ. "Trái đất phẳng" không được chấp nhận dù có người "nghiên cứu" ủng hộ. Consensus khoa học có thể sai nhưng hiếm — và được thay đổi bởi bằng chứng, không phải bởi viral post.',
    ],
    points: [
      { icon: '💯', label: '"Chữa 100%" = không bao giờ đúng trong y học', note: 'Ngay cả vaccine không đạt 100% với mọi người — không gì là tuyệt đối' },
      { icon: '⚗️', label: 'Dose-response: thiếu cơ chế = nghi ngờ cao', note: '"1 giọt chữa mọi bệnh" vi phạm nguyên tắc sinh lý học cơ bản' },
      { icon: '🌐', label: 'Không có âm mưu toàn cầu che giấu thuốc chữa ung thư', note: 'Hàng triệu nhà khoa học độc lập không thể cùng giấu một bí mật' },
      { icon: '🔗', label: 'Mâu thuẫn consensus = cần bằng chứng RẤT mạnh', note: 'Consensus thay đổi bởi dữ liệu, không phải bởi viral post' },
    ],
  },
  {
    num: '04', icon: '💰', q: '4. Có lợi ích tài chính không?',
    good: 'Thông tin giáo dục thuần túy, không bán sản phẩm',
    bad: 'Nội dung kết thúc bằng link mua hàng, hoa hồng affiliate',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80',
    keyFact: '💰 Xung đột lợi ích không có nghĩa là thông tin sai — nhưng nó là lý do để tăng mức độ nghi ngờ. Khi người chia sẻ thông tin sẽ được hưởng lợi tài chính nếu bạn tin theo, đặt câu hỏi kỹ hơn.',
    details: [
      'Các loại xung đột lợi ích (conflict of interest): Tài chính trực tiếp: bán sản phẩm, hoa hồng affiliate, được tài trợ bởi công ty liên quan. Tài chính gián tiếp: nghiên cứu được tài trợ bởi ngành công nghiệp liên quan (ví dụ: nghiên cứu về đường do công ty đồ uống tài trợ). Cá nhân/danh tiếng: người nổi tiếng muốn duy trì hình ảnh "chuyên gia", KOL muốn phát triển audience. Tất cả đều có thể vô thức ảnh hưởng đến cách thông tin được trình bày.',
      'Affiliate marketing trong nội dung sức khỏe: nhiều blogger, influencer, podcast sức khỏe nhận hoa hồng 20–50% từ mỗi sản phẩm bán được qua link của họ. Điều này tạo động cơ mạnh để ca ngợi sản phẩm — dù không có bằng chứng. FTC (Mỹ) yêu cầu công bố mối quan hệ affiliate, nhưng nhiều người không tuân thủ hoặc chỉ ghi nhỏ "#ad" khó thấy. Tại Việt Nam, quy định về công bố affiliate trong y tế còn lỏng lẻo hơn.',
      'Industry-funded research bias (nghiên cứu do ngành tài trợ): phân tích hàng trăm nghiên cứu cho thấy nghiên cứu do ngành tài trợ có xu hướng cho kết quả thuận lợi cho ngành đó gấp 3–5 lần so với nghiên cứu độc lập. Không nhất thiết do gian lận — có thể là publication bias (không đăng kết quả bất lợi), selective reporting, hay thiết kế nghiên cứu có lợi. Ví dụ kinh điển: nghiên cứu về đường và bệnh tim mạch do Sugar Research Foundation tài trợ đã chuyển đổ lỗi sang chất béo trong thập niên 1960–1970.',
      'Paid content và sponsored content: nội dung được trả tiền thường được thiết kế để trông giống bài viết thông thường (native advertising). Tìm chú thích "Nội dung được tài trợ", "Advertorial", "Sponsored by", "#PR" — nếu không có, nghi ngờ cao hơn. Nhiều trang tin sức khỏe Việt Nam đăng bài PR sản phẩm mà không ghi rõ là quảng cáo.',
      'Cách phát hiện nhanh xung đột lợi ích: có link mua hàng hoặc affiliate ở cuối bài không? Tác giả/trang web bán sản phẩm liên quan không? Bài có ghi nguồn tài trợ nghiên cứu không (trong nghiên cứu khoa học, phần "Funding" ở cuối)? "KOL" (Key Opinion Leader) này được ngành dược/TPCN tài trợ tham dự hội thảo không? Họ có nhận mẫu sản phẩm miễn phí không?',
      'Xung đột lợi ích trong học thuật cũng tồn tại: bác sĩ và nhà nghiên cứu có thể nhận tài trợ từ công ty dược để nói chuyện tại hội thảo, làm cố vấn, hoặc đứng tên trong nghiên cứu. ProPublica\'s Dollars for Docs (Mỹ) tra cứu được thanh toán từ ngành dược cho bác sĩ. Điều này không có nghĩa bác sĩ đó sai — nhưng cần biết để đánh giá khách quan hơn. Nhiều tạp chí uy tín yêu cầu công bố tất cả COI.',
    ],
    points: [
      { icon: '🔗', label: 'Link mua hàng cuối bài = động cơ tài chính', note: 'Affiliate commission 20–50%: incentive mạnh để ca ngợi sản phẩm' },
      { icon: '🏭', label: 'Industry-funded research: kết quả thuận lợi gấp 3–5x', note: 'Xem phần "Funding" trong nghiên cứu để kiểm tra ai tài trợ' },
      { icon: '📢', label: 'Tìm "#ad", "sponsored", "tài trợ" trong nội dung', note: 'Không có công bố = tăng mức nghi ngờ về tính khách quan' },
      { icon: '⚖️', label: 'COI không = sai, nhưng = cần thận trọng hơn', note: 'Tìm nguồn xác nhận độc lập khi phát hiện xung đột lợi ích' },
    ],
  },
  {
    num: '05', icon: '📅', q: '5. Thông tin có mới không?',
    good: 'Được cập nhật trong 2–3 năm gần đây (y học thay đổi nhanh)',
    bad: 'Bài viết từ 2010 vẫn đang lan truyền như mới',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    keyFact: '📅 Y học không tĩnh — hướng dẫn điều trị được cập nhật thường xuyên khi có bằng chứng mới. Điều "đúng" năm 2010 có thể đã bị bác bỏ năm 2024. Kiểm tra ngày xuất bản là thói quen quan trọng.',
    details: [
      'Y học thay đổi nhanh hơn bạn nghĩ: số lượng bài báo y tế mới xuất bản mỗi năm vượt 1 triệu bài. Hướng dẫn điều trị (clinical guidelines) của AHA, ADA, ESC, WHO thường được cập nhật mỗi 3–5 năm. Trong các lĩnh vực như ung thư học và truyền nhiễm, hướng dẫn có thể thay đổi trong vài tháng khi có bằng chứng mới.',
      'Những lần y học thay đổi quan điểm quan trọng: Chất béo và bệnh tim mạch (1960–1990 vs 2010–nay): hướng dẫn cũ dạy "giảm chất béo để bảo vệ tim" → hiện nay: chất béo bão hòa vừa phải an toàn hơn carbohydrate tinh chế. Trứng và cholesterol (1970–2010 vs 2015–nay): "không quá 1 trứng/ngày" → FDA 2015 không còn giới hạn cholesterol ăn vào. HRT (hormone thay thế) và ung thư vú: WHO\'s Women\'s Health Initiative (2002) gây hoảng loạn → phân tích lại cho thấy nguy cơ phụ thuộc loại HRT, tuổi bắt đầu, và thời gian dùng.',
      'Aspirin và phòng ngừa tim mạch — đảo chiều quan trọng: trong nhiều thập kỷ, aspirin liều thấp được khuyến nghị cho mọi người > 50 tuổi để phòng ngừa tim mạch. Nghiên cứu ASPREE (2018) và ARRIVE (2018) cho thấy người khỏe mạnh không có tiền sử tim mạch nhận ít lợi ích hơn và tăng nguy cơ chảy máu. AHA/ACC (2019) đảo ngược khuyến nghị: không còn khuyến nghị aspirin dự phòng cho người > 70 tuổi hoặc người nguy cơ thấp. Bài viết từ 2015 về aspirin có thể dẫn đến thực hành sai.',
      'Living guidelines và cập nhật liên tục: một số tổ chức như WHO, NICE (Anh), và nhiều hội chuyên khoa cung cấp "living guidelines" — được cập nhật liên tục khi có bằng chứng mới, không chờ đến kỳ cập nhật định kỳ. COVID-19 là ví dụ rõ nhất: hướng dẫn thay đổi hàng tuần trong giai đoạn đầu đại dịch. Đây là cách khoa học nên vận hành — không phải dấu hiệu khoa học "không đáng tin".',
      'Kiểm tra ngày bài viết và ngày cập nhật lần cuối: nhiều trang web không ghi ngày xuất bản hoặc ghi ngày nhưng không ghi ngày cập nhật. Kỹ thuật xem ngày Google: tìm bằng Google, dưới URL thường hiện ngày lập chỉ mục. Cách xem ngày trong Facebook: click vào timestamp (số giờ/ngày trước) để xem ngày chính xác. Với Wikipedia: xem phần "Last edited" ở cuối trang và check lịch sử chỉnh sửa.',
      'Bài viết cũ lan truyền như mới — một vấn đề nghiêm trọng: mạng xã hội cho phép chia sẻ lại bài cũ mà không thay đổi gì — bài 2012 có thể viral lại năm 2024 với người chia sẻ không biết nó đã lỗi thời. Một số bài blog sức khỏe không ghi ngày — đây là dấu hiệu thiếu minh bạch. Tip thực tế: Google "site:pubmed.ncbi.nlm.nih.gov [chủ đề] [năm gần nhất]" để tìm nghiên cứu mới nhất.',
    ],
    points: [
      { icon: '📆', label: 'Aspirin 2015 vs 2019: khuyến nghị đảo ngược hoàn toàn', note: 'Bài từ 2015 có thể khuyến nghị aspirin mà AHA 2019 đã thu hồi' },
      { icon: '🔄', label: 'Trứng, chất béo, HRT: tất cả đã đổi quan điểm', note: 'Y học không sai — mà đang cập nhật khi có bằng chứng tốt hơn' },
      { icon: '📱', label: 'Bài 2012 viral 2024 — không ai ghi chú', note: 'Click timestamp Facebook để xem ngày đăng thực sự' },
      { icon: '🔍', label: 'PubMed: lọc theo ngày 3–5 năm gần nhất', note: 'Tìm systematic review mới hơn bất cứ bài blog nào' },
    ],
  },
];

const DANGEROUS_PATTERNS = [
  {
    num: '01', icon: '🕵️', pattern: '"Bí quyết mà bác sĩ giấu bạn"',
    explain: 'Không có âm mưu ẩn — bác sĩ học 6–10 năm để chữa bệnh, không có động cơ che giấu.',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    keyFact: '🕵️ Lý thuyết âm mưu y tế tồn tại vì chúng đơn giản hóa những vấn đề phức tạp. Thực tế: hàng triệu nhà khoa học và bác sĩ trên toàn cầu làm việc độc lập — không có cơ chế nào giữ được bí mật lâu dài ở quy mô đó.',
    details: [
      'Tại sao lý thuyết âm mưu hấp dẫn: não người tìm kiếm mô hình (pattern) và nguyên nhân trong hỗn độn. Khi sự kiện phức tạp xảy ra (ung thư, đại dịch), bộ não ưu tiên giải thích đơn giản có chủ thể hành động hơn là "nhiều yếu tố ngẫu nhiên kết hợp". Âm mưu cũng mang lại cảm giác kiểm soát: "tôi biết điều người khác không biết".',
      'Kinh tế học của ngành dược không ủng hộ âm mưu "che giấu thuốc chữa": nếu công ty dược có thuốc chữa khỏi ung thư vú, họ có thể bán với giá hàng trăm nghìn USD/liệu trình, đăng ký bằng sáng chế 20 năm, và kiếm hàng tỷ USD. Che giấu nó để bán thuốc duy trì điều trị sẽ kiếm ít tiền hơn nhiều — và rủi ro bị lộ sẽ phá hủy công ty. Động cơ tài chính thực tế là CÔNG BỐ thuốc tốt, không che giấu.',
      'Wakefield và bài học từ âm mưu giả mạo nổi tiếng nhất: năm 1998, Andrew Wakefield công bố nghiên cứu liên kết vaccine MMR với tự kỷ. Báo chí lan truyền. Tỷ lệ tiêm vaccine giảm mạnh → dịch sởi bùng phát. Năm 2010: điều tra cho thấy Wakefield giả mạo dữ liệu và nhận tiền từ luật sư đang kiện nhà sản xuất vaccine. Ông bị thu hồi bằng hành nghề. Bài báo bị rút. Hàng chục nghiên cứu lớn sau đó không tìm thấy liên kết nào. Đây là ví dụ về cách "âm mưu" được tạo ra — không phải bởi ngành y, mà bởi 1 người có lợi ích tài chính.',
      '"Thuốc tây điều trị triệu chứng để bán thuốc mãi mãi": quan niệm này hiểu sai về nhiều loại bệnh. Nhiều bệnh mãn tính (đái tháo đường, tăng huyết áp, suy giáp) cần điều trị suốt đời không phải vì "âm mưu" mà vì cơ chế bệnh lý không reversible. Đồng thời, y học đã "chữa khỏi" nhiều bệnh không cần điều trị mãn tính: smallpox (xóa sổ hoàn toàn), polio (gần như xóa sổ), tuberculosis (có thể chữa khỏi trong 6 tháng), nhiều ung thư giai đoạn sớm.',
      'Cách âm mưu lan truyền trong kỷ nguyên số: thuật toán mạng xã hội tối ưu cho tương tác, không phải sự thật. Nội dung kích động cảm xúc (tức giận, sợ hãi, kinh ngạc) nhận engagement cao hơn. Một video "âm mưu" với 10 triệu view không có nghĩa là đúng — có nghĩa là kích thích cảm xúc mạnh. Đây là lý do tại sao tin sai trên Twitter (nay là X) lan truyền nhanh gấp 6 lần tin đúng (nghiên cứu MIT 2018).',
      'Câu hỏi tốt để kiểm tra lý thuyết âm mưu: Có bao nhiêu người cần giữ bí mật? (Công ty dược lớn có 100.000+ nhân viên.) Ai đã bị hại bởi "sự che giấu" này và tại sao họ không lên tiếng? Bằng chứng độc lập từ các quốc gia và tổ chức khác nhau có nhất quán không? Nếu âm mưu này đúng, tại sao chuyên gia trong lĩnh vực đó (người có thể kiếm được danh tiếng và tiền lớn bằng cách vạch trần) không ai công bố bằng chứng cụ thể?',
    ],
    points: [
      { icon: '💰', label: 'Kinh tế học ngược: công bố thuốc tốt = nhiều tiền hơn', note: 'Che giấu "thuốc chữa ung thư" tốt kiếm ít hơn bán nó với giá cao' },
      { icon: '🔬', label: 'Wakefield: âm mưu do 1 người có COI tạo ra', note: 'Hàng chục nghiên cứu độc lập không tìm thấy liên kết vaccine-tự kỷ' },
      { icon: '📱', label: 'Tin sai lan nhanh gấp 6x vì kích thích cảm xúc', note: 'Algorithm tối ưu engagement, không phải sự thật' },
      { icon: '💊', label: 'Y học đã chữa khỏi smallpox, polio, TBC — không che giấu', note: 'Bệnh mãn tính cần điều trị dài hạn vì cơ chế bệnh, không phải âm mưu' },
    ],
  },
  {
    num: '02', icon: '🚫', pattern: '"Chữa khỏi mọi bệnh" hoặc "không tác dụng phụ"',
    explain: 'Mọi chất có tác dụng sinh học đều có thể có tác dụng phụ tùy liều và người dùng.',
    color: '#f97316', rgb: '249,115,22',
    img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80',
    keyFact: '⚗️ Paracelsus (1493–1541), cha đẻ của độc chất học: "Sola dosis facit venenum" — chỉ có liều lượng mới tạo ra chất độc. Nước uống đủ nhiều cũng gây tử vong. Không có gì "hoàn toàn không tác dụng phụ" nếu có hoạt tính sinh học.',
    details: [
      '"Chữa khỏi 100%" vi phạm nguyên tắc sinh học cơ bản: ung thư không phải một bệnh — là hơn 200 loại bệnh với cơ chế đột biến gen khác nhau, vị trí khác nhau, tốc độ tiến triển khác nhau. Tiểu đường type 1 và type 2 có cơ chế hoàn toàn khác nhau. Cao huyết áp có hàng chục nguyên nhân. Không có "một thứ" nào có thể điều trị tất cả — trừ một thứ không có tác dụng gì.',
      '"Không tác dụng phụ" = không có tác dụng gì hoặc chưa được nghiên cứu đủ: nếu một chất thực sự có hoạt tính sinh học (ảnh hưởng đến cơ thể), nó không thể chỉ có tác dụng tốt mà không có tác dụng không mong muốn — bởi vì sinh lý học cơ thể phức tạp và được kết nối với nhau. Tuyên bố "không tác dụng phụ" thường có nghĩa: chất đó quá yếu để có tác dụng gì (cả tốt lẫn xấu), hoặc không ai nghiên cứu đủ kỹ để phát hiện tác dụng phụ.',
      'Nguyên lý liều-đáp ứng (dose-response): mọi chất có đường cong liều-đáp ứng. Nước: uống 1 lít/ngày = tốt cho sức khỏe; uống 6–8 lít trong vài giờ = hạ natri máu nguy hiểm tính mạng. Oxygen: FiO2 21% (không khí bình thường) = cần thiết; FiO2 100% kéo dài = độc phổi (oxygen toxicity). Aspirin: 100mg = chống kết tập tiểu cầu; 4.000mg = viêm loét dạ dày nghiêm trọng. Chỉ liều và ngữ cảnh mới quyết định "độc" hay "thuốc".',
      'Hormesis — hiệu ứng ngược: một số chất gây hại ở liều cao lại có lợi ở liều cực thấp. Phóng xạ liều thấp (radon trong hang động nhất định), rượu vang đỏ liều rất thấp, và nhiều chất phytochemical trong rau củ đều cho thấy hiệu ứng hormesis. Điều này không có nghĩa là "độc thì tốt" — mà là liều quyết định mọi thứ.',
      '"Thảo dược tự nhiên = an toàn": quan niệm sai lầm phổ biến nhất. Digitalis (foxglove) → digoxin (thuốc tim mạch mạnh, có thể gây ngộ độc). Arsenic trong thạch tín = thuốc chữa bệnh bạch cầu (AML) ở nồng độ điều trị. Belladonna → atropine (dùng trong cấp cứu tim). Opium poppy → morphine (giảm đau mạnh nhất). "Tự nhiên" không quyết định an toàn — cơ chế và liều lượng mới quyết định.',
      'Cờ đỏ ngôn ngữ của tuyên bố "chữa mọi bệnh": "Khôi phục cân bằng cơ thể" (quá mơ hồ để đo lường), "Tăng cường hệ miễn dịch" (hệ miễn dịch không phải "yếu hơn tốt" — lupus là hệ miễn dịch hoạt động quá mức), "Loại bỏ độc tố" (không chỉ định độc tố nào), "Chữa từ gốc" (không giải thích cơ chế), "Phù hợp với mọi người" (không có gì phù hợp với mọi người — ngay cả paracetamol có chống chỉ định).',
    ],
    points: [
      { icon: '⚗️', label: 'Liều tạo ra độc hay thuốc — không phải bản chất', note: 'Nước uống 6–8L trong vài giờ cũng gây tử vong (hạ natri máu)' },
      { icon: '🌿', label: '"Tự nhiên" ≠ an toàn: arsenic, digitalis, morphine', note: 'Nhiều chất độc nhất đến từ thiên nhiên — cơ chế và liều mới quan trọng' },
      { icon: '🔬', label: '"Không tác dụng phụ" = không tác dụng gì hoặc chưa nghiên cứu', note: 'Hoạt tính sinh học thực sự luôn kèm theo tác dụng không mong muốn' },
      { icon: '🎯', label: '"Tăng miễn dịch" mơ hồ — lupus là miễn dịch quá mức', note: 'Hệ miễn dịch cần cân bằng, không phải "càng mạnh càng tốt"' },
    ],
  },
  {
    num: '03', icon: '📸', pattern: 'Ảnh trước/sau đáng ngờ',
    explain: 'Góc chụp, ánh sáng, quần áo, tư thế có thể tạo ra sự khác biệt giả. Yêu cầu dữ liệu chứng minh từ nghiên cứu độc lập.',
    color: '#f59e0b', rgb: '245,158,11',
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    keyFact: '📸 Ảnh trước/sau là bằng chứng yếu nhất trong y học — dễ tạo ra nhất và khó kiểm chứng nhất. Không có thông tin về điều kiện chụp, thời gian, hay những gì khác đã thay đổi cùng lúc.',
    details: [
      '7 kỹ thuật phổ biến tạo ảnh trước/sau giả: (1) Tư thế — đứng thẳng, ưỡn bụng vs đứng thẳng, thở ra, hóp bụng; (2) Ánh sáng — ánh sáng từ trên trực tiếp tạo bóng rõ ràng hơn ánh sáng mềm từ bên cạnh; (3) Góc máy ảnh — chụp từ dưới lên vs từ trên xuống; (4) Quần áo — quần lưng cao vs quần lưng thấp; (5) Bơm cơ — tập gym xong vài phút vs ảnh lúc nghỉ ngơi; (6) Thao tác nước — mất nước nhẹ vs hydrated đầy đủ; (7) Chỉnh sửa ảnh — filter, tăng contrast, crop, warp tool.',
      'Thời gian không được kiểm soát: ảnh "30 ngày dùng sản phẩm" thực tế có thể là 6 tháng, hoặc được chụp theo thứ tự ngược lại (ảnh "sau" được chụp trước). FTC (Mỹ) yêu cầu testimonial phải điển hình cho kết quả của người dùng — nhưng enforcement lỏng lẻo và nhiều người chỉ đăng ảnh của người đạt kết quả tốt nhất.',
      'Cherry-picking và survivorship bias: công ty có thể thử nghiệm sản phẩm với 1.000 người, chỉ 5 người có kết quả dramatic, và chỉ đăng ảnh của 5 người đó. 995 người không thấy hiệu quả không được đề cập. Đây là "survivorship bias" — chỉ thấy những thành công, không thấy thất bại. Trong thử nghiệm lâm sàng, mọi người tham gia đều được theo dõi — không chỉ người thành công.',
      'Thay đổi đồng thời không được kiểm soát: người trong ảnh "sau" có thể cùng lúc thay đổi chế độ ăn, tập thể dục, ngủ đủ giấc — nhưng chỉ sản phẩm được credit. Điều này là confounding variable — yếu tố nhiễu. Trong nghiên cứu lâm sàng, mọi biến số này được kiểm soát qua randomization và nhóm đối chứng.',
      'Yêu cầu dữ liệu thực sự thay vì ảnh: "Bao nhiêu người tham gia? Nhóm đối chứng dùng gì? Có theo dõi lâu dài không? Kết quả được đo bằng công cụ khách quan nào (BMI, mỡ cơ thể DEXA, biomarker máu)?" Ảnh là subjective hoàn toàn — số liệu đo lường mới là bằng chứng.',
      'Cách phân tích ảnh trước/sau nghi ngờ: Tìm dấu hiệu chỉnh sửa (đường thẳng bị méo, độ phân giải không đều). So sánh tất cả chi tiết: màu da, nếp nhăn, vết thương — nếu quá nhiều thứ thay đổi thì nghi ngờ. Tìm ảnh gốc qua Google Reverse Image Search. Hỏi: "Có bao nhiêu người dùng sản phẩm không thấy kết quả như vậy?" — nếu không được trả lời, cẩn thận.',
    ],
    points: [
      { icon: '💡', label: '7 kỹ thuật tạo ảnh giả: tư thế, ánh sáng, góc máy', note: 'Tập gym 30 phút → bơm cơ → ảnh "sau" ngay lập tức không cần sản phẩm' },
      { icon: '📊', label: 'Yêu cầu số liệu: BMI, DEXA, biomarker — không phải ảnh', note: 'Ảnh hoàn toàn subjective — đo lường mới là bằng chứng' },
      { icon: '👥', label: 'Cherry-picking: 5/1.000 người thành công = tất cả đăng lên', note: 'Hỏi: bao nhiêu người dùng không thấy kết quả này?' },
      { icon: '🔍', label: 'Google Reverse Image Search để kiểm tra ảnh gốc', note: 'Nhiều ảnh "thật" thực tế là stock photo hoặc đã bị đổi tên người' },
    ],
  },
  {
    num: '04', icon: '🧪', pattern: '"Giải độc cơ thể" hoặc "thải độc"',
    explain: 'Gan và thận đã là hệ thống thải độc hoàn hảo. Không có bằng chứng khoa học nào ủng hộ "detox" thương mại.',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
    keyFact: '🧪 Hỏi bất kỳ người bán "detox" nào: "Độc tố nào cụ thể?" và "Làm sao bạn đo lường sự thay đổi?" Nếu không trả lời được, sản phẩm chỉ là marketing. Gan và thận của bạn đã đang "detox" liên tục 24/7 miễn phí.',
    details: [
      'Gan thực sự "detox" như thế nào — Phase I và Phase II: Phase I (cytochrome P450 enzymes): oxy hóa, khử, thủy phân — biến đổi chất tan trong dầu thành dạng dễ xử lý hơn. Đây cũng là lúc một số chất trở nên "hoạt động hơn" trước khi được thải. Phase II (conjugation): gắn nhóm hóa học (glucuronide, sulfate, glutathione, glycine) vào chất từ Phase I → tăng tính tan trong nước → dễ thải qua mật/nước tiểu. Thận lọc 120–150L máu/ngày và thải các sản phẩm chuyển hóa, thuốc, và chất độc qua nước tiểu.',
      '"Độc tố" trong marketing — không bao giờ được chỉ định cụ thể: sản phẩm detox không bao giờ trả lời được câu hỏi "độc tố nào?" Vì: nếu chỉ định cụ thể (ví dụ: chì, thủy ngân, thuốc trừ sâu), họ phải chứng minh sản phẩm thực sự loại bỏ chất đó qua xét nghiệm máu/nước tiểu trước-sau. Không có sản phẩm detox thương mại nào vượt qua được kiểm tra này. Điều trị ngộ độc thực sự (chì, thủy ngân nặng) dùng chelation therapy — là thuốc kê đơn, không phải nước ép.',
      'Juice cleanse và detox diet — không có bằng chứng: systematic review (Klein & Kiat, 2015) tổng hợp bằng chứng về juice cleanse và detox diet: không tìm thấy bằng chứng từ nghiên cứu lâm sàng ủng hộ loại can thiệp này cho mục đích "thải độc". Người dùng thường cảm thấy "nhẹ nhàng hơn" và "sáng suốt hơn" — nhưng đây thường là do giảm calo, tăng nước, ngưng rượu và thức ăn chế biến trong thời gian cleanse.',
      'Activated charcoal "detox" — hiểu sai về cơ chế: than hoạt tính được dùng trong y tế cấp cứu để hấp thụ một số chất độc trong vài giờ sau khi nuốt — không phải để "dọn sạch" toàn bộ cơ thể. Uống than hoạt tính trong nước ép hoặc sinh tố hàng ngày: (1) Không thải được "độc tố tích lũy" (đã được gan/thận xử lý); (2) Có thể hấp thụ thuốc kê đơn và TPCN đang dùng — giảm hiệu quả thuốc; (3) Có thể gây táo bón.',
      'Colon cleansing và enema — nguy cơ thực sự: quảng cáo rằng ruột già chứa "phân thối" tích lũy gây bệnh là sai — niêm mạc ruột già tự thay mới mỗi vài ngày và có hệ vi khuẩn cộng sinh cần thiết. Rửa ruột thường xuyên: phá vỡ hệ vi khuẩn đường ruột (microbiome), gây mất điện giải (natri, kali → mất nước, rối loạn nhịp tim), và trong một số trường hợp gây thủng ruột. Đây là nguy cơ thực sự, không phải lý thuyết.',
      'Khi nào cơ thể thực sự cần "hỗ trợ thải độc" từ y tế: ngộ độc kim loại nặng (chì, thủy ngân, asen) → chelation therapy kê đơn. Ngộ độc thuốc/hóa chất cấp tính → than hoạt tính trong vài giờ đầu ở cấp cứu. Suy gan cấp → ghép gan. Suy thận → lọc máu (dialysis). Tất cả những trường hợp này đều cần can thiệp y tế thực sự — không phải nước ép hay "trà thải độc".',
    ],
    points: [
      { icon: '🫀', label: 'Gan xử lý 120–150L máu/ngày — miễn phí, liên tục', note: 'Phase I+II detox đã diễn ra trong cơ thể bạn 24/7 không cần sản phẩm' },
      { icon: '❓', label: '"Độc tố nào?" — câu hỏi không ai bán detox trả lời được', note: 'Nếu thật, phải chứng minh qua xét nghiệm máu/nước tiểu trước-sau' },
      { icon: '🖤', label: 'Than hoạt tính trong smoothie hấp thụ thuốc kê đơn', note: 'Dùng cấp cứu trong vài giờ đầu sau ngộ độc — không phải dùng hằng ngày' },
      { icon: '⚠️', label: 'Rửa ruột thường xuyên → phá microbiome + mất điện giải', note: 'Nguy cơ thực sự: rối loạn nhịp tim, mất nước, thủng ruột' },
    ],
  },
  {
    num: '05', icon: '💬', pattern: 'Testimonial thay cho bằng chứng',
    explain: '"1.000 người đã thử và thành công" không phải dữ liệu khoa học — cần nhóm đối chứng, kiểm soát yếu tố nhiễu.',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    keyFact: '💬 Testimonial không thể phân biệt tác dụng thực sự của sản phẩm với: (1) bệnh tự khỏi theo thời gian; (2) placebo effect; (3) thay đổi khác cùng lúc; (4) regression to the mean. Đây là lý do khoa học cần nhóm đối chứng.',
    details: [
      'Regression to the mean — cạm bẫy thống kê ít người biết: khi triệu chứng ở điểm tệ nhất (lý do bắt đầu dùng sản phẩm), chúng có xu hướng tự cải thiện mà không cần can thiệp — đơn giản vì không thể ở điểm tệ nhất mãi. Người đau lưng dữ dội hôm qua bắt đầu dùng kem "thần kỳ" hôm nay — và tốt hơn trong 3 ngày. Nhưng họ cũng sẽ tốt hơn mà không dùng kem đó. Đây là regression to the mean, không phải tác dụng của kem.',
      'Survivorship bias trong testimonial: chỉ những người trải nghiệm tốt mới chia sẻ — và công ty chỉ đăng những testimonial tốt nhất. 95% người dùng không thấy kết quả không chia sẻ (hoặc review của họ bị xóa). Đây là vấn đề lấy mẫu có hệ thống (systematic sampling bias) — không đại diện cho kết quả trung bình của người dùng.',
      'Placebo effect — mạnh hơn nhiều người nghĩ: kỳ vọng thay đổi trải nghiệm chủ quan. Người được nói "đây là thuốc giảm đau mạnh" cảm thấy ít đau hơn người được nói "đây là vitamin" — dù cả hai uống giả dược. Placebo có thể giảm đau 30–40%, cải thiện triệu chứng IBS, và trong nghiên cứu đặc biệt thú vị của Kaptchuk (2010), thậm chí open-label placebo (biết mình đang uống giả dược) vẫn có tác dụng ở IBS. Đây là lý do thử nghiệm lâm sàng phải mù đôi.',
      'Confounding variables — yếu tố nhiễu: người bắt đầu dùng sản phẩm "giảm cân" thường đồng thời bắt đầu chú ý đến ăn uống, tập thể dục thêm, và uống đủ nước hơn. Kết quả tốt sau đó không thể được gán cho sản phẩm — mà có thể do tất cả thay đổi kia. Trong RCT, randomization và kiểm soát chặt chẽ loại trừ confounders này.',
      'Anecdote của người nổi tiếng (celebrity testimonial): người nổi tiếng không có kiến thức y tế đặc biệt. Họ được trả rất nhiều tiền để quảng cáo — thường là 6 con số trở lên cho một campaign. Hiệu ứng halo (halo effect): nếu chúng ta ngưỡng mộ người đó, chúng ta tin tưởng phán đoán của họ nhiều hơn kể cả trong lĩnh vực họ không có chuyên môn. FTC yêu cầu công bố rõ paid partnership, nhưng nhiều influencer vẫn không tuân thủ đầy đủ.',
      '"1.000 người đã thành công" — tại sao không đủ: cần hỏi: 1.000 người này so với bao nhiêu người không thành công? Họ được chọn từ đâu (tự nguyện chia sẻ hay random sample)? Điều kiện ban đầu của họ là gì? Họ có làm gì khác cùng lúc không? Có ai kiểm chứng kết quả của họ bằng đo lường khách quan không? Nếu không trả lời được những câu này, "1.000 người" chỉ là số marketing.',
    ],
    points: [
      { icon: '📈', label: 'Regression to mean: đau nhất → tự cải thiện không cần sản phẩm', note: 'Bắt đầu dùng khi tệ nhất = tự nhiên sẽ tốt hơn dù làm gì' },
      { icon: '🎭', label: 'Placebo giảm đau 30–40% — trải nghiệm không = tác dụng thật', note: 'Open-label placebo vẫn có tác dụng — kỳ vọng thay đổi cảm giác' },
      { icon: '⭐', label: 'Celebrity được trả tiền để quảng cáo — không phải chuyên gia', note: 'Halo effect: ngưỡng mộ người nổi tiếng → tin phán đoán y tế của họ' },
      { icon: '❓', label: '"1.000 người thành công" — bao nhiêu người thất bại?', note: 'Hỏi tỷ lệ thành công thực sự, không chỉ số tuyệt đối được chọn lọc' },
    ],
  },
  {
    num: '06', icon: '😱', pattern: 'Sợ hãi + giải pháp tức thì',
    explain: 'Tạo lo lắng rồi cung cấp "giải pháp" — đây là mô hình marketing. Thông tin tốt giải thích, không dọa nạt.',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80',
    keyFact: '😱 Kỹ thuật "sợ hãi → giải pháp" (fear-mongering) là mô hình marketing cổ xưa nhất — tạo ra nhu cầu bằng cách khuếch đại nguy cơ, sau đó cung cấp giải pháp. Thông tin y tế thực sự giải thích nguy cơ theo tỷ lệ thực tế, không thổi phồng.',
    details: [
      'Cơ chế tâm lý của fear-mongering: amygdala (trung tâm sợ hãi trong não) kích hoạt → hệ thần kinh giao cảm (fight-or-flight) → tư duy phản biện giảm, ra quyết định nhanh hơn và dễ bị ảnh hưởng hơn. Đây là lý do quảng cáo dùng sợ hãi hiệu quả: não trong trạng thái stress làm giảm phân tích lý trí (giảm hoạt động vỏ não trước trán). Ngưỡng mua hàng giảm khi lo lắng tăng.',
      '"Độc chất ẩn" và "hóa chất nguy hiểm" — vũ khí sợ hãi phổ biến: "Sản phẩm X của bạn chứa [tên hóa học dài và đáng sợ]!" Tất cả thực phẩm và thuốc đều chứa "hóa chất" — nước là H2O, muối là NaCl, đường là C12H22O11. Điều quan trọng là nồng độ và ngữ cảnh, không phải sự hiện diện của chất đó. Formaldehyde có trong rau củ tự nhiên, trái cây lên men, và cơ thể người — ở nồng độ rất thấp, không gây hại. Kỹ thuật đặt tên hóa học để gây sợ gọi là "chemophobia marketing".',
      'Manufactured urgency (khẩn cấp giả): "Chỉ còn 24 giờ!", "Giá này không còn vào ngày mai!", "Hàng có hạn — đặt ngay!" — tạo áp lực quyết định nhanh mà không có thời gian suy nghĩ. Thông tin y tế thực sự không có giới hạn thời gian: nếu nghiên cứu cho thấy vitamin D quan trọng, điều đó đúng hôm nay và vẫn đúng sau 1 tháng. Urgency giả là dấu hiệu rõ ràng của marketing, không phải thông tin.',
      'FOMO (Fear Of Missing Out) trong sức khỏe: "Mọi người xung quanh bạn đang làm điều này và khỏe hơn — bạn đang bị bỏ lại!" Kết hợp với social proof giả (số lượng người dùng phóng đại), tạo áp lực xã hội để tuân theo. Người ở trạng thái FOMO ít khả năng đánh giá bằng chứng một cách khách quan.',
      'Phân biệt cảnh báo sức khỏe thực sự với fear-mongering: CẢNH BÁO THỰC: nêu cụ thể nguy cơ với số liệu ("hút thuốc tăng nguy cơ ung thư phổi lên 25 lần", "béo phì BMI > 30 liên quan đến nguy cơ tim mạch cao hơn 2x"), không bán sản phẩm, hướng đến hành vi thay đổi cụ thể có bằng chứng, không tạo áp lực thời gian. FEAR-MONGERING: nguy cơ mơ hồ ("đang hủy hoại sức khỏe của bạn"), ngay sau đó giới thiệu sản phẩm, tạo urgency, không trích nguồn.',
      'Cách chống lại fear-mongering: (1) Dừng lại 24–48 giờ trước khi mua — nếu là thông tin thực sự quan trọng, nó vẫn còn đó sau 2 ngày. (2) Tìm absolute risk (nguy cơ tuyệt đối), không chỉ relative risk ("tăng 100% nguy cơ" nghe đáng sợ, nhưng từ 0.001% lên 0.002% — tức là 1 trên 50.000 người thêm). (3) Hỏi: "Ai được lợi nếu tôi sợ điều này?" (4) Tìm kiếm thông tin từ nguồn không bán sản phẩm liên quan.',
    ],
    points: [
      { icon: '🧠', label: 'Sợ hãi kích hoạt amygdala → giảm tư duy phản biện', note: 'Não trong trạng thái stress ra quyết định nhanh hơn và ít lý trí hơn' },
      { icon: '⏰', label: '"Chỉ còn 24 giờ" = urgency giả — thông tin thật không có hạn', note: 'Nếu vitamin D quan trọng hôm nay, nó vẫn quan trọng sau 1 tháng' },
      { icon: '☠️', label: 'Chemophobia: "hóa chất" trong thực phẩm nghe đáng sợ nhưng bình thường', note: 'Formaldehyde có tự nhiên trong rau củ — nồng độ mới quan trọng, không phải tên' },
      { icon: '🔢', label: 'Hỏi absolute risk, không chỉ relative risk', note: '"Tăng 100% nguy cơ": từ 0.001% lên 0.002% — ít người thêm thực sự bị ảnh hưởng' },
    ],
  },
];

const TRUSTED_SOURCES = [
  {
    num: '01', icon: '📚', name: 'PubMed', url: 'pubmed.ncbi.nlm.nih.gov',
    desc: 'Cơ sở dữ liệu nghiên cứu y khoa lớn nhất, hơn 35 triệu bài báo',
    color: '#3b82f6', rgb: '59,130,246',
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    keyFact: '📚 PubMed là cổng tra cứu miễn phí vào MEDLINE — kho lưu trữ hơn 35 triệu tài liệu sinh y học từ năm 1950 đến nay. Được Thư viện Y học Quốc gia Hoa Kỳ (NLM) duy trì, đây là điểm khởi đầu số một cho mọi câu hỏi y tế cần bằng chứng.',
    details: [
      'Phạm vi và quy mô: PubMed lập chỉ mục hơn 35 triệu tài liệu từ hơn 30.000 tạp chí y sinh học quốc tế từ hơn 80 quốc gia. Cập nhật mỗi ngày với hàng nghìn bài báo mới. Bao gồm cả bài báo toàn văn miễn phí (PubMed Central — PMC) và bài báo chỉ có tóm tắt. Tra cứu hoàn toàn miễn phí, không cần tài khoản.',
      'Cách tìm kiếm hiệu quả — MeSH Terms: PubMed dùng hệ thống thuật ngữ y học chuẩn hóa gọi là MeSH (Medical Subject Headings). Ví dụ: tìm "diabetes mellitus type 2" sẽ cho kết quả chính xác hơn "tiểu đường type 2". Dùng bộ lọc "Systematic Reviews" hoặc "Meta-Analysis" trong cột trái để chỉ xem bằng chứng mạnh nhất. Bộ lọc "Free Full Text" để đọc toàn văn miễn phí.',
      'Đọc tóm tắt (Abstract) đúng cách: Abstract gồm các phần: Background (lý do nghiên cứu), Methods (phương pháp), Results (kết quả con số thực), Conclusions (kết luận tác giả). Luôn đọc Results trước Conclusions — đôi khi tác giả kết luận quá rộng so với dữ liệu. Chú ý cỡ mẫu (n=?), thời gian theo dõi, và loại nghiên cứu (RCT, cohort, case report).',
      'Hạn chế cần biết: PubMed không phải mọi thứ — không lập chỉ mục tất cả tạp chí. Nhiều nghiên cứu đăng trên preprint server (bioRxiv, medRxiv) chưa qua peer-review. Publication bias: nghiên cứu có kết quả dương tính dễ được đăng hơn kết quả âm tính. Không phải mọi bài trong PubMed đều chất lượng cao — vẫn phải đánh giá tạp chí và phương pháp.',
      'PubMed Central (PMC) — toàn văn miễn phí: PMC lưu trữ hơn 9 triệu bài báo toàn văn miễn phí. NIH yêu cầu mọi nghiên cứu được tài trợ bởi NIH phải có toàn văn trong PMC trong vòng 12 tháng. Cách truy cập: từ kết quả tìm kiếm, chọn bài có nút "Free PMC article" màu xanh. Ngoài ra có thể tìm preprint tại Europe PMC.',
      'Công cụ nâng cao trong PubMed: "Similar articles" — tìm bài liên quan tự động. "Cited by" — xem bài nào trích dẫn bài này (cho thấy bài có được ngành công nhận không). "MeSH on Demand" — nhập đoạn văn bản, hệ thống gợi ý MeSH terms phù hợp. "Clinical Queries" — bộ lọc chuyên biệt cho câu hỏi lâm sàng (therapy, diagnosis, prognosis, etiology, clinical prediction).',
    ],
    points: [
      { icon: '🆓', label: 'Hoàn toàn miễn phí, không cần tài khoản', note: '35 triệu bài — lọc "Free Full Text" để đọc toàn văn không mất phí' },
      { icon: '🔍', label: 'Lọc "Systematic Reviews" để xem bằng chứng mạnh nhất', note: 'Meta-analysis > systematic review > RCT — chọn loại phù hợp câu hỏi' },
      { icon: '📊', label: 'Đọc Results trước Conclusions — tự đánh giá dữ liệu', note: 'Tác giả đôi khi kết luận rộng hơn những gì dữ liệu thực sự chứng minh' },
      { icon: '⚠️', label: 'Publication bias: kết quả âm tính ít được đăng hơn', note: 'Tìm systematic review tổng hợp nhiều nghiên cứu thay vì tin vào 1 bài' },
    ],
  },
  {
    num: '02', icon: '🌍', name: 'WHO', url: 'who.int',
    desc: 'Tổ chức Y tế Thế giới — hướng dẫn và cập nhật sức khỏe toàn cầu',
    color: '#0891b2', rgb: '8,145,178',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    keyFact: '🌍 WHO (World Health Organization) — cơ quan y tế của Liên Hợp Quốc với 194 quốc gia thành viên. Hướng dẫn WHO được xây dựng bởi hàng trăm chuyên gia quốc tế và dựa trên tổng hợp bằng chứng khoa học tốt nhất hiện có. Đây là nguồn tham chiếu đầu tiên cho mọi vấn đề sức khỏe toàn cầu.',
    details: [
      'Vai trò và cơ cấu WHO: WHO được thành lập năm 1948, trụ sở tại Geneva, Thụy Sĩ. 194 quốc gia thành viên đóng góp tài chính và chuyên môn. Cơ cấu: Đại Hội đồng Y tế Thế giới (WHA) họp hàng năm để đặt chính sách; Ban Giám đốc điều hành gồm 34 thành viên kỹ thuật; Tổng Giám đốc hiện tại: Tedros Adhanom Ghebreyesus (từ 2017). 6 văn phòng khu vực bao gồm WPRO (Tây Thái Bình Dương, có trụ sở tại Manila) — khu vực Việt Nam thuộc vào.',
      'Hướng dẫn WHO được tạo ra như thế nào: WHO tập hợp nhóm chuyên gia độc lập (Guidelines Development Group — GDG) gồm các nhà khoa học, bác sĩ lâm sàng, đại diện người bệnh, và đại diện chính sách. GDG thực hiện systematic review về tất cả bằng chứng liên quan. Dùng hệ thống GRADE để đánh giá chất lượng bằng chứng (Very low → Low → Moderate → High). Kết quả: khuyến nghị có phân loại rõ ràng ("strong" vs "conditional"). Toàn bộ quá trình có thể mất 1–3 năm.',
      'Myth Busters — công cụ chống tin giả: WHO duy trì trang "Fact-checking" và "Myth Busters" cập nhật liên tục giải thích các quan niệm sai phổ biến. Đặc biệt quan trọng trong đại dịch COVID-19: WHO cung cấp cập nhật kỹ thuật gần như hàng ngày, hướng dẫn điều trị sống (living guidelines), và infographic đơn giản để chia sẻ. Trang này hữu ích để gửi cho người thân khi muốn bác bỏ tin giả một cách lịch sự.',
      'Báo cáo và dữ liệu toàn cầu: WHO Global Health Observatory (GHO) cung cấp dữ liệu sức khỏe từ tất cả quốc gia thành viên — tỷ lệ tử vong, gánh nặng bệnh tật, bao phủ dịch vụ y tế. World Health Statistics xuất bản hàng năm — tổng hợp số liệu sức khỏe toàn cầu. ICD-11 (International Classification of Diseases) — hệ thống phân loại bệnh quốc tế do WHO quản lý, là chuẩn mực toàn cầu.',
      'Hạn chế và phê bình về WHO: WHO phụ thuộc vào đóng góp tài chính của các quốc gia thành viên — điều này tạo ra áp lực chính trị tinh tế trong một số quyết định. Phản ứng chậm trong giai đoạn đầu COVID-19 bị nhiều chuyên gia phê bình. Không phải mọi khuyến nghị WHO đều phù hợp với mọi quốc gia — các nước có điều kiện kinh tế và gánh nặng bệnh tật khác nhau. Tuy nhiên, với người bình thường, WHO vẫn là nguồn đáng tin cậy nhất hiện có.',
      'Cách dùng who.int hiệu quả: Trang chủ → "Health topics" → chủ đề bạn cần (ví dụ: Diabetes, Hypertension, Nutrition). "Publications" → tìm guidelines và reports mới nhất. "News" → cập nhật tình hình dịch bệnh toàn cầu. "Data" → Global Health Observatory cho số liệu thống kê. Ứng dụng "WHO Info" (iOS/Android) — tin tức và cập nhật trực tiếp từ WHO.',
    ],
    points: [
      { icon: '🏛️', label: '194 quốc gia + hàng trăm chuyên gia xây dựng mỗi guideline', note: 'Hệ thống GRADE đánh giá chất lượng bằng chứng — không phải ý kiến cá nhân' },
      { icon: '🚫', label: 'Myth Busters: giải thích quan niệm sai phổ biến', note: 'Hữu ích để chia sẻ cho người thân khi cần bác bỏ tin giả lịch sự' },
      { icon: '📊', label: 'Global Health Observatory: số liệu sức khỏe toàn cầu', note: 'Dữ liệu chuẩn để so sánh tình trạng sức khỏe giữa các quốc gia' },
      { icon: '⚠️', label: 'Áp lực chính trị từ quốc gia tài trợ — không hoàn hảo', note: 'Vẫn là nguồn tốt nhất hiện có, nhưng đọc cùng CDC và NICE để so sánh' },
    ],
  },
  {
    num: '03', icon: '🏛️', name: 'CDC', url: 'cdc.gov',
    desc: 'Trung tâm Kiểm soát và Phòng ngừa Bệnh tật Hoa Kỳ',
    color: '#ef4444', rgb: '239,68,68',
    img: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80',
    keyFact: '🏛️ CDC (Centers for Disease Control and Prevention) là cơ quan y tế hàng đầu của Hoa Kỳ với ngân sách hơn 8 tỷ USD/năm và hơn 10.000 nhân viên. Tuy là cơ quan Mỹ, hướng dẫn CDC được toàn thế giới tham khảo vì chất lượng nghiên cứu và hạ tầng dữ liệu mạnh.',
    details: [
      'Lịch sử và sứ mệnh CDC: CDC thành lập năm 1946 tại Atlanta, Georgia, ban đầu để kiểm soát sốt rét. Ngày nay sứ mệnh mở rộng sang toàn bộ sức khỏe cộng đồng: bệnh truyền nhiễm, bệnh mãn tính, an toàn thực phẩm, sức khỏe nghề nghiệp, và y tế môi trường. CDC không phải cơ quan quản lý (như FDA) — CDC nghiên cứu, theo dõi, và đưa ra khuyến nghị; FDA phê duyệt thuốc và thiết bị y tế.',
      'MMWR — tạp chí theo dõi bệnh tật hàng tuần: MMWR (Morbidity and Mortality Weekly Report) được xuất bản từ năm 1952, là nguồn dữ liệu dịch tễ học quan trọng nhất Hoa Kỳ. Xuất bản hàng tuần, miễn phí, bao gồm: báo cáo ca bệnh đặc biệt, xu hướng bệnh truyền nhiễm, kết quả nghiên cứu dịch tễ. MMWR là nơi đầu tiên đăng báo cáo về HIV/AIDS (1981) và Legionnaires\' disease. Đăng ký nhận qua email tại cdc.gov/mmwr.',
      'Vaccine safety — hệ thống giám sát toàn diện nhất thế giới: CDC vận hành VAERS (Vaccine Adverse Event Reporting System) — nơi báo cáo phản ứng phụ sau tiêm. Hiểu đúng VAERS: đây là hệ thống giám sát tín hiệu (signal detection), không phải bằng chứng nhân quả. Bất kỳ ai cũng có thể báo cáo — kể cả sự kiện không liên quan đến vaccine. VSD (Vaccine Safety Datalink) dùng dữ liệu điện tử từ 10 hệ thống y tế lớn để xác nhận tín hiệu từ VAERS.',
      'Travel Health — thông tin thiết yếu cho người đi nước ngoài: CDC Travel Health (wwwnc.cdc.gov/travel) cung cấp thông tin vaccine và phòng ngừa bệnh theo từng quốc gia đến. Cập nhật cảnh báo dịch bệnh theo thời gian thực (Watch Level 1 → Warning Level 3). Thông tin về thuốc phòng sốt rét theo khu vực. Hữu ích đặc biệt khi du lịch đến Đông Nam Á, châu Phi, Nam Mỹ.',
      'CDC Wonder — dữ liệu y tế công cộng Hoa Kỳ: CDC Wonder (wonder.cdc.gov) — hệ thống truy vấn dữ liệu miễn phí cung cấp số liệu tử vong, tỷ lệ bệnh, và thống kê dân số Hoa Kỳ. Hữu ích cho: tìm tỷ lệ tử vong do các nguyên nhân cụ thể, xu hướng bệnh theo năm, phân bổ địa lý. Dữ liệu có thể xuất ra CSV để phân tích.',
      'Hạn chế của CDC: CDC là cơ quan Mỹ — khuyến nghị phản ánh điều kiện, dịch tễ học, và hệ thống y tế Mỹ. Một số khuyến nghị (ví dụ vaccine schedule) có thể khác với Việt Nam vì khác dịch tễ học địa phương. Trong COVID-19, CDC bị chỉ trích vì thay đổi hướng dẫn nhiều lần — nhưng đây thực ra là cập nhật theo bằng chứng mới, không phải mâu thuẫn. Với Việt Nam, Bộ Y tế VN và WHO vẫn là tham chiếu chính.',
    ],
    points: [
      { icon: '📰', label: 'MMWR hàng tuần: theo dõi xu hướng bệnh dịch miễn phí', note: 'Đăng ký email tại cdc.gov/mmwr để nhận báo cáo tự động' },
      { icon: '💉', label: 'VAERS: hệ thống giám sát vaccine — không phải bằng chứng nhân quả', note: 'Báo cáo sau tiêm ≠ do vaccine gây ra — chỉ là tín hiệu cần điều tra thêm' },
      { icon: '✈️', label: 'Travel Health: vaccine và cảnh báo dịch bệnh theo quốc gia', note: 'Kiểm tra trước mỗi chuyến đi quốc tế để biết cần tiêm vaccine nào' },
      { icon: '🇺🇸', label: 'Khuyến nghị cho Mỹ — tham chiếu chéo với WHO cho VN', note: 'Dịch tễ học khác nhau: lịch vaccine và ngưỡng điều trị có thể không giống VN' },
    ],
  },
  {
    num: '04', icon: '🇻🇳', name: 'Bộ Y tế Việt Nam', url: 'moh.gov.vn',
    desc: 'Thông tin y tế chính thức tại Việt Nam',
    color: '#dc2626', rgb: '220,38,38',
    img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    keyFact: '🇻🇳 Bộ Y tế Việt Nam là cơ quan quản lý nhà nước cao nhất về y tế tại Việt Nam — ban hành Thông tư, Quyết định, và hướng dẫn chuyên môn có hiệu lực pháp lý. Mọi thuốc, thực phẩm chức năng, và thiết bị y tế lưu hành tại VN đều phải được Bộ Y tế cấp phép.',
    details: [
      'Cơ cấu và thẩm quyền Bộ Y tế VN: Bộ Y tế VN thành lập từ 1945 với tên ban đầu là Bộ Y tế và Cứu thương. Cục Quản lý Dược (DAV) — phê duyệt thuốc lưu hành tại VN, tra cứu tại drugbank.vn. Cục An toàn thực phẩm (VFA) — quản lý TPCN và thực phẩm chức năng. Cục Quản lý Khám chữa bệnh — cấp phép cơ sở khám chữa bệnh. Vụ Truyền thông và Thi đua khen thưởng — phụ trách thông tin y tế công cộng.',
      'Kiểm tra thuốc và TPCN được cấp phép: Tra cứu số đăng ký thuốc tại dichvucong.gov.vn (mục Dược phẩm). Mọi thuốc hợp pháp tại VN đều có số đăng ký dạng "VD-XXXXX-XX" (thuốc nội) hoặc "VN-XXXXX-XX" (thuốc ngoại). TPCN có số công bố dạng "XNQC-XXXXX/ATTP". Nếu sản phẩm không có số đăng ký hợp lệ — đây là dấu hiệu sản phẩm không được phép lưu hành.',
      'Hướng dẫn chuyên môn và phác đồ điều trị: Bộ Y tế ban hành "Hướng dẫn chẩn đoán và điều trị" cho hầu hết các bệnh phổ biến: tiểu đường, tăng huyết áp, tim mạch, COVID-19, v.v. Những hướng dẫn này được bác sĩ toàn quốc tuân theo. Tìm tại moh.gov.vn → "Văn bản quy phạm pháp luật" → Quyết định. Đây là nguồn tốt nhất để biết phác đồ điều trị chuẩn được áp dụng tại VN.',
      'Danh sách thuốc bị cấm, thu hồi, và cảnh báo: Bộ Y tế định kỳ công bố danh sách thuốc giả, thuốc không đạt chất lượng, và thuốc bị thu hồi. Tìm tại moh.gov.vn → "Cảnh báo y tế". Đây là thông tin quan trọng: nếu thuốc bạn đang dùng bị thu hồi, trang này sẽ thông báo. Ứng dụng "Thuốc quốc gia" (iOS/Android) — tra cứu thuốc được cấp phép và thông tin thu hồi.',
      'Sức khỏe Việt Nam (suckhoedoisong.vn) — tờ báo của Bộ Y tế: Sức khỏe & Đời sống (suckhoedoisong.vn) là cơ quan ngôn luận của Bộ Y tế VN. Thông tin thường được kiểm duyệt về mặt y tế bởi chuyên gia. Tuy nhiên: đây vẫn là tờ báo — viết cho đại chúng, không phải văn bản hướng dẫn chuyên môn. Với quyết định y tế quan trọng, tham khảo văn bản Thông tư/Quyết định gốc thay vì bài báo.',
      'Cảnh báo về mạo danh Bộ Y tế: Nhiều trang web và tài khoản mạng xã hội mạo danh Bộ Y tế hoặc sử dụng logo BYT để tăng uy tín. Trang chính thức: moh.gov.vn (đuôi .gov.vn). Kênh YouTube chính thức: "Bộ Y tế". Fanpage Facebook chính thức: có tick xanh xác minh. Nếu thấy "Bộ Y tế khuyến cáo..." trên mạng xã hội, tìm văn bản gốc tại moh.gov.vn để xác nhận.',
    ],
    points: [
      { icon: '💊', label: 'Tra cứu số đăng ký thuốc: VD-XXXXX (nội) / VN-XXXXX (ngoại)', note: 'Thuốc không có số đăng ký hợp lệ = chưa được phép lưu hành tại VN' },
      { icon: '📋', label: 'Hướng dẫn chẩn đoán và điều trị — phác đồ chuẩn cho bác sĩ VN', note: 'moh.gov.vn → Văn bản quy phạm pháp luật → Quyết định' },
      { icon: '⚠️', label: 'Danh sách thuốc bị thu hồi cập nhật thường xuyên', note: 'Kiểm tra moh.gov.vn → Cảnh báo y tế nếu lo lắng về thuốc đang dùng' },
      { icon: '🔒', label: 'Chỉ tin trang .gov.vn — nhiều trang mạo danh Bộ Y tế', note: 'Tìm văn bản gốc tại moh.gov.vn thay vì tin bài chia sẻ trên mạng xã hội' },
    ],
  },
  {
    num: '05', icon: '📋', name: 'UpToDate', url: 'uptodate.com',
    desc: 'Tài liệu tham khảo lâm sàng được bác sĩ toàn cầu tin dùng',
    color: '#22c55e', rgb: '34,197,94',
    img: 'https://images.unsplash.com/photo-1584982751601-97ddc0501cb3?w=800&q=80',
    keyFact: '📋 UpToDate là công cụ hỗ trợ quyết định lâm sàng (clinical decision support) được hơn 2 triệu bác sĩ tại 190 quốc gia sử dụng. Mỗi bài được soạn thảo bởi chuyên gia lĩnh vực và cập nhật liên tục khi có bằng chứng mới. Nghiên cứu độc lập cho thấy bệnh viện sử dụng UpToDate có kết quả lâm sàng tốt hơn.',
    details: [
      'UpToDate là gì và ai sử dụng: UpToDate (thuộc Wolters Kluwer) là cơ sở dữ liệu y văn tổng hợp — không phải tạp chí, không phải search engine. Mỗi "topic" (chủ đề) là một bài viết toàn diện về cách chẩn đoán và điều trị một bệnh cụ thể, viết bởi 1–3 chuyên gia đầu ngành và được peer-review nội bộ. Cập nhật liên tục: mỗi bài đều có "Last updated" — thường vài tháng một lần. Hơn 12.500 topic, hơn 6.900 tác giả và biên tập viên.',
      'Hệ thống đánh giá bằng chứng GRADE: UpToDate dùng hệ thống GRADE để phân loại khuyến nghị. Mức độ khuyến nghị: Grade 1 (strong — "chúng tôi khuyến nghị") vs Grade 2 (weak — "chúng tôi gợi ý"). Chất lượng bằng chứng: A (High — RCT lớn), B (Moderate), C (Low — expert opinion). Ví dụ: "Grade 1A = khuyến nghị mạnh, bằng chứng RCT chất lượng cao" — mức đáng tin cậy nhất.',
      'Nghiên cứu về tác động thực tế: nghiên cứu đăng trên Journal of Medical Internet Research cho thấy bệnh nhân tại bệnh viện sử dụng UpToDate có nguy cơ biến chứng thấp hơn 10–11% và thời gian nằm viện ngắn hơn. Người dùng UpToDate ra quyết định điều trị tốt hơn so với không dùng — đây là bằng chứng thực tế về giá trị của tài liệu tham khảo chất lượng cao.',
      'Hạn chế: UpToDate là dịch vụ trả phí ($X00/năm cá nhân) — không miễn phí như PubMed hay WHO. Tuy nhiên nhiều bệnh viện và đại học đăng ký cho nhân viên/sinh viên. Nếu bạn là bệnh nhân: không nên tự đọc UpToDate để tự điều trị — nội dung viết cho bác sĩ, với nhiều sắc thái lâm sàng phức tạp. Thay vào đó, bạn có thể hỏi bác sĩ "UpToDate nói gì về điều này?" để khuyến khích tra cứu có bằng chứng.',
      'Patient Education — phần dành cho bệnh nhân: UpToDate có phần "Patient Education" miễn phí — viết ở ngôn ngữ dễ hiểu hơn cho người không chuyên. Truy cập tại uptodate.com/contents/table-of-contents/patient-education. Bao gồm giải thích bệnh, thuốc, và thủ thuật bằng ngôn ngữ đơn giản. Đây là nguồn thông tin bệnh nhân tốt hơn nhiều so với các trang web sức khỏe thương mại.',
      'Các tài nguyên tương tự (miễn phí hơn): DynaMed (EBSCO) — tương tự UpToDate, miễn phí cho nhiều thư viện y khoa. BMJ Best Practice — miễn phí cho nhiều quốc gia. NICE Guidelines (nice.org.uk) — hướng dẫn lâm sàng Anh Quốc, miễn phí và chất lượng rất cao. Australian Clinical Practice Guidelines — miễn phí, nhiều topic cập nhật tốt. ClinicalKey (Elsevier) — thường có qua thư viện đại học y.',
    ],
    points: [
      { icon: '👨‍⚕️', label: '2 triệu bác sĩ tại 190 quốc gia tin dùng hàng ngày', note: 'Bệnh viện dùng UpToDate có biến chứng thấp hơn 10–11% theo nghiên cứu' },
      { icon: '🏆', label: 'GRADE 1A = khuyến nghị mạnh + bằng chứng RCT cao nhất', note: 'Mỗi khuyến nghị đều có phân loại rõ ràng — không phải ý kiến tùy tiện' },
      { icon: '🎓', label: 'Patient Education: phần miễn phí viết cho bệnh nhân', note: 'uptodate.com/contents/table-of-contents/patient-education' },
      { icon: '💡', label: 'Hỏi bác sĩ "UpToDate nói gì?" để khuyến khích tra cứu bằng chứng', note: 'NICE, DynaMed, BMJ Best Practice là lựa chọn tương tự và miễn phí hơn' },
    ],
  },
  {
    num: '06', icon: '🔬', name: 'Examine.com', url: 'examine.com',
    desc: 'Tổng hợp bằng chứng về bổ sung dinh dưỡng và thảo dược',
    color: '#a855f7', rgb: '168,85,247',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    keyFact: '🔬 Examine.com là tổ chức phi lợi nhuận độc lập, không nhận quảng cáo hoặc tài trợ từ ngành công nghiệp thực phẩm chức năng. Đây là nguồn tốt nhất hiện có để tìm hiểu bằng chứng khoa học về TPCN, thảo dược, và dinh dưỡng — vì họ tổng hợp hàng trăm nghiên cứu và đánh giá trung thực kể cả khi bằng chứng yếu.',
    details: [
      'Mô hình kinh doanh độc lập và khách quan: Examine.com được thành lập năm 2011 với mô hình không nhận quảng cáo và không có mối quan hệ tài chính với ngành TPCN. Doanh thu từ đăng ký thành viên trả phí và bán ấn phẩm ("Examine Research Digest"). Điều này là quan trọng vì: hầu hết trang web về TPCN có thu nhập từ quảng cáo hoặc affiliate — tạo ra xung đột lợi ích cực kỳ lớn. Examine không có động cơ để phóng đại lợi ích của bất kỳ sản phẩm nào.',
      'Phương pháp tổng hợp bằng chứng: Với mỗi supplement (ví dụ: Vitamin D, Omega-3, Creatine, Ashwagandha), Examine tổng hợp tất cả nghiên cứu có sẵn và phân loại theo: kết quả được nghiên cứu (outcomes), phân loại bằng chứng (A–D), hướng tác dụng (positive/neutral/negative/mixed), và lưu ý về khoảng trống trong nghiên cứu. Thang đánh giá: A = nhiều RCT chất lượng cao nhất quán; D = chỉ nghiên cứu in vitro hoặc trên chuột.',
      'Ví dụ minh họa về tính trung thực: Creatine — Examine đánh giá "Grade A" (bằng chứng mạnh) cho tăng sức mạnh và khối cơ trong ngắn hạn, "an toàn cho người khỏe mạnh". Multivitamin — Examine đánh giá "bằng chứng hỗn hợp và yếu" cho lợi ích sức khỏe ở người không thiếu hụt vi chất — trung thực dù multivitamin là ngành tỷ đô. Detox juice — "không có bằng chứng" — khác hoàn toàn với cách nhiều trang web trình bày.',
      'Examine Research Digest (ERD) — newsletter khoa học: ERD là tóm tắt nghiên cứu dinh dưỡng mới nhất, xuất bản hàng tháng bởi đội nghiên cứu Examine. Mỗi số phân tích 5–10 nghiên cứu mới nhất với ngôn ngữ dễ hiểu nhưng chính xác khoa học. Hữu ích cho: người muốn cập nhật khoa học dinh dưỡng mà không đọc PubMed. Trả phí nhưng nhiều issue trước đây miễn phí tại examine.com/research-digest.',
      'Hạn chế của Examine: Tập trung vào TPCN và dinh dưỡng — không phải tài nguyên cho tất cả chủ đề y tế (không có thông tin về thuốc kê đơn, phác đồ điều trị bệnh). Không phải tài liệu lâm sàng — không thay thế tư vấn bác sĩ. Một số topic nhỏ hơn có thể chưa được cập nhật thường xuyên. Phần nội dung sâu nhất yêu cầu đăng ký thành viên trả phí.',
      'Cách dùng Examine.com thực tế: Khi ai đó giới thiệu TPCN mới: vào examine.com, gõ tên supplement → đọc "Summary" (miễn phí) → xem "Evidence Grade" → xem "What works, what doesn\'t, what\'s unknown". So sánh với: HRE (Human Effect Matrix) — xem tất cả outcomes được nghiên cứu trong một bảng. Kết hợp với: Labdoor.com (kiểm tra chất lượng thực tế của sản phẩm cụ thể — TPCN có đúng hàm lượng ghi trên nhãn không).',
    ],
    points: [
      { icon: '🚫', label: 'Không quảng cáo, không affiliate — không có xung đột lợi ích', note: 'Doanh thu từ đăng ký thành viên: không ai trả tiền để Examine khen sản phẩm' },
      { icon: '📊', label: 'Grade A–D: tóm tắt hàng trăm nghiên cứu thành 1 đánh giá', note: 'Creatine = A (mạnh). Multivitamin cho người đủ vi chất = bằng chứng yếu/hỗn hợp' },
      { icon: '🔍', label: 'HRE: xem tất cả outcomes được nghiên cứu trong 1 bảng', note: 'Hữu ích để thấy supplement X thực ra được nghiên cứu cho mục đích nào' },
      { icon: '⚡', label: 'Kết hợp với Labdoor.com: kiểm tra chất lượng thực tế sản phẩm', note: 'TPCN có thể đúng về công thức nhưng sai hàm lượng — Labdoor đo thực tế' },
    ],
  },
];

function SourceCard({ item, onClick }) {
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
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-bold text-base text-text">{item.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold transition-opacity duration-200"
              style={{ background: `rgba(${item.rgb},0.12)`, color: item.color, opacity: hovered ? 1 : 0 }}>Chi tiết →</span>
          </div>
          <div className="text-xs font-mono mb-1" style={{ color: `rgba(${item.rgb},0.7)` }}>{item.url}</div>
          <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>
  );
}

function SourceModal({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
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
          <img src={item.img} alt={item.name} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>Nguồn {item.num}/06</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-1 leading-snug" style={{ color: item.color }}>{item.name}</h2>
          <div className="text-xs font-mono mb-2" style={{ color: `rgba(${item.rgb},0.7)` }}>{item.url}</div>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(209,213,219,0.8)' }}>{item.desc}</p>
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
            >{p.e_prev_btn || '← Trước'}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.num} / 06</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >{p.e_next_btn || 'Sau →'}</button>
          </div>
          <p className="text-center text-xs mt-4 opacity-40" style={{ color: '#9ca3af' }}>{p.e_esc_hint || 'Nhấn ESC hoặc click bên ngoài để đóng'}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function PatternCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-4 cursor-pointer transition-all duration-200 flex gap-3"
      style={{ borderColor: hovered ? `rgba(${item.rgb},0.55)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 20px rgba(${item.rgb},0.12)` : 'none', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-base leading-snug mb-1" style={{ color: item.color }}>{item.pattern}</div>
        <p className="text-sm text-muted leading-relaxed">{item.explain}</p>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0 self-start mt-0.5 transition-opacity duration-200"
        style={{ background: `rgba(${item.rgb},0.12)`, color: item.color, opacity: hovered ? 1 : 0 }}>Chi tiết →</span>
    </div>
  );
}

function PatternModal({ item, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
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
          <img src={item.img} alt={item.pattern} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>Pattern {item.num}/06</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-2 leading-snug" style={{ color: item.color }}>{item.pattern}</h2>
          <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(209,213,219,0.8)' }}>{item.explain}</p>
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
            >{p.e_prev_btn || '← Trước'}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.num} / 06</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >{p.e_next_btn || 'Sau →'}</button>
          </div>
          <p className="text-center text-xs mt-4 opacity-40" style={{ color: '#9ca3af' }}>{p.e_esc_hint || 'Nhấn ESC hoặc click bên ngoài để đóng'}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

function FilterCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="rounded-2xl border bg-surface p-5 cursor-pointer transition-all duration-200"
      style={{ borderColor: hovered ? `rgba(${item.rgb},0.55)` : 'rgba(255,255,255,0.08)', boxShadow: hovered ? `0 0 20px rgba(${item.rgb},0.12)` : 'none', transform: hovered ? 'translateY(-2px)' : 'translateY(0)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl shrink-0">{item.icon}</span>
        <span className="font-bold text-base leading-snug flex-1" style={{ color: item.color }}>{item.q}</span>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0 transition-opacity duration-200"
          style={{ background: `rgba(${item.rgb},0.12)`, color: item.color, opacity: hovered ? 1 : 0 }}>Chi tiết →</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <div className="text-xs font-bold text-emerald-400 mb-1">✓ Đáng tin</div>
          <p className="text-xs text-muted leading-relaxed">{item.good}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="text-xs font-bold text-red-400 mb-1">✗ Nghi ngờ</div>
          <p className="text-xs text-muted leading-relaxed">{item.bad}</p>
        </div>
      </div>
    </div>
  );
}

function FilterModal({ item, idx, total, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
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
          <img src={item.img} alt={item.q} className="w-full h-full object-cover" style={{ opacity: 0.38 }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(${item.rgb},0.08) 50%, #0d0d0d 100%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
          <div className="absolute bottom-4 left-6 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: `rgba(${item.rgb},0.18)`, border: `2px solid rgba(${item.rgb},0.45)` }}>{item.icon}</div>
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `rgba(${item.rgb},0.18)`, color: item.color, border: `1px solid rgba(${item.rgb},0.4)` }}>Câu hỏi {item.num}/05</span>
          </div>
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)' }}>✕</button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="font-bold text-xl md:text-2xl mb-3 leading-snug" style={{ color: item.color }}>{item.q}</h2>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div className="text-xs font-bold text-emerald-400 mb-1">✓ Đáng tin</div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(209,213,219,0.8)' }}>{item.good}</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <div className="text-xs font-bold text-red-400 mb-1">✗ Nghi ngờ</div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(209,213,219,0.8)' }}>{item.bad}</p>
            </div>
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
            >{p.e_prev_btn || '← Trước'}</button>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.num} / 05</span>
            <button onClick={() => hasNext && onNext()}
              className="text-xs font-bold px-4 py-2 rounded-xl"
              style={{ color: hasNext ? item.color : 'rgba(255,255,255,0.2)', background: hasNext ? `rgba(${item.rgb},0.1)` : 'transparent', border: `1px solid ${hasNext ? `rgba(${item.rgb},0.25)` : 'rgba(255,255,255,0.07)'}`, cursor: hasNext ? 'pointer' : 'default' }}
            >{p.e_next_btn || 'Sau →'}</button>
          </div>
          <p className="text-center text-xs mt-4 opacity-40" style={{ color: '#9ca3af' }}>{p.e_esc_hint || 'Nhấn ESC hoặc click bên ngoài để đóng'}</p>
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
  const { t } = useTranslation('pillars');
  const p = t('pillarE', { returnObjects: true }) || {};
  const filterQuestions = FILTER_QUESTIONS.map((fq, i) => { const tr = p.ml_filters_tr?.[i] || {}; return { ...fq, ...tr, ...(tr.title ? { q: tr.title } : {}), ...(tr.sub ? { good: tr.sub } : {}) }; });
  const [filterModal, setFilterModal] = useState(null);
  const [patternModal, setPatternModal] = useState(null);
  const [sourceModal, setSourceModal] = useState(null);

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
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text mb-8 transition-colors">← {p.sub_breadcrumb || 'Kiến Thức Sức Khỏe'}</Link>

      <div className="flex items-start gap-6 mb-10 relative">
        <div className="absolute -top-8 -left-8 w-64 h-64 rounded-full blur-3xl pointer-events-none" style={{ background: `rgba(${RGB},0.05)` }} />
        <div className="w-20 h-20 rounded-3xl text-6xl bg-surface border flex items-center justify-center shrink-0" style={{ borderColor: `rgba(${RGB},0.2)`, animation: 'float 3s ease-in-out infinite' }}>🔍</div>
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-text leading-tight">{p.ml_h1 || 'Lọc Thông Tin Y Tế'}</h1>
          <span className="inline-block text-base font-bold uppercase tracking-widest mt-3 mb-4 px-3 py-1 rounded-full border" style={{ color: COLOR, background: `rgba(${RGB},0.1)`, borderColor: `rgba(${RGB},0.2)` }}>
            {p.ml_badge || 'Media Literacy · Phân biệt thật giả'}
          </span>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            {p.ml_desc || 'Thông tin y tế sai lệch (medical misinformation) là một trong những vấn đề sức khỏe công cộng lớn nhất. WHO gọi đây là "infodemic" — đại dịch thông tin. Học cách lọc thông tin là kỹ năng bảo vệ sức khỏe trong kỷ nguyên số.'}
          </p>
        </div>
      </div>

      <div className={`${ORBIT_CLASS} rounded-3xl p-[1.5px] mb-12`}>
        <div className="relative rounded-3xl overflow-hidden h-52 md:h-72">
          <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80&auto=format&fit=crop" alt="Lọc thông tin" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/30 to-transparent" />
          <span className="absolute bottom-4 left-6 text-base font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: COLOR, background: 'rgba(10,10,10,0.6)', borderColor: `rgba(${RGB},0.2)` }}>
            {p.ml_caption || 'Tư duy phản biện · Bằng chứng khoa học'}
          </span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

      <RevealBlock delay={0} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.ml_s1_h2 || '5 Câu Hỏi Để Lọc Thông Tin'}</h2>
        <p className="text-muted text-lg mb-6">Áp dụng mỗi khi đọc thông tin y tế trên mạng xã hội, group sức khỏe, hoặc từ người thân. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="space-y-4">
          {filterQuestions.map((fq, i) => (
            <FilterCard key={i} item={fq} onClick={() => setFilterModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={1} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.ml_s2_h2 || 'Nhận Biết Thông Tin Sai Lệch'}</h2>
        <p className="text-muted text-lg mb-6">6 pattern phổ biến nhất trong thông tin y tế sai lệch trên mạng. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="space-y-3">
          {DANGEROUS_PATTERNS.map((d, i) => (
            <PatternCard key={i} item={d} onClick={() => setPatternModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <RevealBlock delay={2} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: COLOR }}>Kiểm Tra Thông Tin</h2>
        <MisinfoChecker />
      </RevealBlock>

      <RevealBlock delay={3} className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: COLOR }}>{p.ml_s3_h2 || 'Nguồn Thông Tin Đáng Tin Cậy'}</h2>
        <p className="text-muted text-lg mb-5">Bookmark những nguồn này để tra cứu khi cần. <span className="text-xs opacity-60">Click để xem chi tiết →</span></p>
        <div className="grid sm:grid-cols-2 gap-3">
          {TRUSTED_SOURCES.map((s, i) => (
            <SourceCard key={i} item={s} onClick={() => setSourceModal(i)} />
          ))}
        </div>
      </RevealBlock>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
      <Link to="/pillar/e" className="inline-flex items-center gap-2 text-lg text-muted hover:text-text transition-colors">← {p.sub_back_footer || 'Quay lại Kiến Thức Sức Khỏe'}</Link>

      {filterModal !== null && (
        <FilterModal
          item={filterQuestions[filterModal]}
          idx={filterModal}
          total={filterQuestions.length}
          onClose={() => setFilterModal(null)}
          onPrev={() => setFilterModal(i => Math.max(0, i - 1))}
          onNext={() => setFilterModal(i => Math.min(filterQuestions.length - 1, i + 1))}
          hasPrev={filterModal > 0}
          hasNext={filterModal < filterQuestions.length - 1}
        />
      )}

      {patternModal !== null && (
        <PatternModal
          item={DANGEROUS_PATTERNS[patternModal]}
          onClose={() => setPatternModal(null)}
          onPrev={() => setPatternModal(i => Math.max(0, i - 1))}
          onNext={() => setPatternModal(i => Math.min(DANGEROUS_PATTERNS.length - 1, i + 1))}
          hasPrev={patternModal > 0}
          hasNext={patternModal < DANGEROUS_PATTERNS.length - 1}
        />
      )}

      {sourceModal !== null && (
        <SourceModal
          item={TRUSTED_SOURCES[sourceModal]}
          onClose={() => setSourceModal(null)}
          onPrev={() => setSourceModal(i => Math.max(0, i - 1))}
          onNext={() => setSourceModal(i => Math.min(TRUSTED_SOURCES.length - 1, i + 1))}
          hasPrev={sourceModal > 0}
          hasNext={sourceModal < TRUSTED_SOURCES.length - 1}
        />
      )}
    </div>
  );
}
