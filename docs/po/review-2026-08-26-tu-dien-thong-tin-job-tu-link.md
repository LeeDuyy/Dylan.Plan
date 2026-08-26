# PO Review — Tự điền thông tin job từ link tin tuyển dụng (bảng "Theo dõi CV ứng tuyển")

Status: Reviewed
Scope: Một function — bảng "Theo dõi CV ứng tuyển" trên trang Roadmap (mở rộng US-018)
Reviewed: 2026-08-26
Owner: ssr-po

> Nguồn yêu cầu: user (Dylan), trực tiếp — "tại danh sách job, tôi muốn khi nhập link vào, hệ thống phải tự truy cập vào link và điền các thông tin còn lại vào danh sách."
> Business Flow "Hệ Thống Quản Lý Chi Tiêu" (`docs/kb/ba/business-flow.md`) **không** mô tả mảng Roadmap/theo dõi tuyển dụng — review này đối chiếu với ranh giới đã chốt ở `DEC-088` (bảng job là tiện ích tách biệt) thay vì với F1–F4.

## 1. Phạm Vi Đã Review

| Nguồn | Path | Lý do đọc |
| --- | --- | --- |
| Source — UI + validate bảng job | `components/JobTrackerBoard.tsx` | Xác nhận hiện trạng nhập tay, quy tắc validate Link, luồng lưu job |
| Source — cấu trúc dữ liệu job | `server/job-tracker/domain/entities/job-application.ts` | Các trường của entity Job ứng tuyển và ràng buộc bắt buộc |
| Source — use case lưu job | `server/job-tracker/application/use-cases/upsert-job-application.ts` | Xác nhận luồng lưu hiện thuần DB, chưa gọi mạng ngoài |
| Feature artifact — spec US-018 | `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` (mục 2, 6) | Phạm vi và ranh giới **ngoài phạm vi** đã ghi tường minh |
| Knowledge — wiki feature | `docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md`, `US-020-lich-su-trang-thai-job.md` | Mục tiêu nghiệp vụ, business rule, quan hệ function |
| Knowledge — entity | `docs/kb/ba/wiki/data/entity/ENT-004-job-ung-tuyen.md`, `ENT-005-platform-tuyen-dung.md` | Ràng buộc trạng thái, quan hệ Platform |
| Memory — quyết định | `docs/memory/decisions.md` DEC-080..DEC-089 (US-018), DEC-099..DEC-104 (US-020), DEC-088 (ranh giới Business Flow) | Kiểm tra mâu thuẫn với quyết định Active |
| Knowledge — Business Flow | `docs/kb/ba/business-flow.md` mục 1, 6, 9 | Xác nhận mảng job nằm ngoài phạm vi F1–F4 |
| Memory — thuật ngữ | `docs/memory/glossary.md` mục 1 ("Job ứng tuyển", "Platform (tuyển dụng)") | Định nghĩa nghiệp vụ chuẩn |
| Knowledge — raw | `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 4 | Câu hỏi mở còn treo về validate Link |

## 2. Hiện Trạng

- **Người dùng hôm nay làm được gì:** Dylan mở trang Roadmap → bảng "Theo dõi CV ứng tuyển" → bấm "Thêm job" → **nhập tay toàn bộ**: Công ty, Ngày hết hạn (qua lịch chọn ngày), Platform (combobox động, mặc định "ITViec"/"LinkedIn"/"VietNamWork"), Link, Trạng thái (mặc định "Interested"), Ghi chú. Sửa từng ô ngay tại dòng (inline). **Không có bất kỳ tự động hóa nào từ Link** — Link chỉ là một ô nhập chữ và một liên kết mở tab mới.
- **Dữ liệu/contract hệ thống dựa vào:** entity Job ứng tuyển (`ENT-004`) gồm `company`, `deadline` (ngày, bắt buộc), `platformId` (tham chiếu Platform, bắt buộc), `link` (chuỗi, bắt buộc), `status` (đúng 1 trong 8 giá trị cố định), `note`, `submittedAt`. Validate Link hiện **chỉ** kiểm tra tiền tố `http://` hoặc `https://` (`components/JobTrackerBoard.tsx:134`). Không có model/cột nào cho "vị trí ứng tuyển"/chức danh. Luồng lưu (`upsert-job-application.ts`) thuần ghi DB, không gọi mạng ngoài.
- **Rule đã được ghi lại ở đâu:** `docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md` mục 5 (`BR-021`); `docs/memory/decisions.md` DEC-080..DEC-089; `docs/memory/glossary.md` mục 1.
- **Ranh giới đã chốt (quan trọng):** US-018 spec mục 2 ghi rõ **ngoài phạm vi** — "Liên kết hoặc đồng bộ với các nền tảng tuyển dụng bên ngoài (ITViec, LinkedIn, VietNamWork...) — Platform chỉ là một nhãn Dylan tự quản lý, không có tích hợp dữ liệu thật với các nền tảng đó" (`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md:46`). `DEC-088`: bảng job là tiện ích cá nhân tách biệt, ngoài Business Flow "Hệ Thống Quản Lý Chi Tiêu".

## 3. Findings

Tất cả là **opportunity/gap**, **không có defect** — hành vi nhập tay hiện tại đúng với US-018 spec.

| ID | Mức | Loại | Nội dung | Bằng chứng |
| --- | --- | --- | --- | --- |
| PO-01 | Medium | Gap nghiệp vụ | Thêm job đòi Dylan gõ tay 4 trường bắt buộc (Công ty, Ngày hết hạn, Platform, Link) kể cả khi link tin tuyển dụng đã chứa sẵn phần lớn thông tin đó; thao tác lặp lại cho mỗi job khi theo dõi nhiều job cùng lúc | `components/JobTrackerBoard.tsx:127-138,232-251`; `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` mục 6 bước 2 |
| PO-02 | Low | UI/UX | Platform là combobox bắt buộc nhưng gần như luôn suy được từ tên miền của Link (`itviec.com` → ITViec, `linkedin.com` → LinkedIn, `vietnamworks.com` → VietNamWork) — Dylan vẫn phải chọn tay mỗi lần | `components/JobTrackerBoard.tsx:131`; `docs/kb/ba/wiki/data/entity/ENT-005-platform-tuyen-dung.md` |
| PO-03 | Medium | Knowledge / ranh giới | Yêu cầu mới **đảo một ranh giới đã ghi tường minh** trong US-018 spec mục 2 ("không có tích hợp dữ liệu thật với các nền tảng đó"). Cần một quyết định ghi lại rõ ràng để spec sau không mâu thuẫn với spec US-018 | `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md:46`; `docs/memory/decisions.md#dec-088` |
| PO-04 | Low | Knowledge | Raw US-018 mục 4 để mở câu hỏi "có cần validate Link là URL hợp lệ trước khi lưu" — hiện chỉ validate tiền tố. Tính năng đọc link cần chuẩn hóa/parse URL chặt hơn (tên miền, đường dẫn); là dịp giải quyết luôn điểm mờ này | `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md:69` |

## 4. Điểm Mờ Cần Xác Nhận

| # | Điểm mờ | Đã tự trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| 1 | Định vị tính năng trong định hướng sản phẩm | User chốt: mở rộng US-018 như tiện ích độc lập, **giữ ngoài** Business Flow (theo tiền lệ `DEC-088`), không cần phiên `ssr-po mode=business-flow` | Đã xác nhận — `AskUserQuestion` 2026-08-26 → `DEC-111` |
| 2 | Nền tảng link cần đọc được | User chốt: **thử đọc mọi link kể cả LinkedIn**, chấp nhận tỷ lệ thất bại cao và rủi ro điều khoản dịch vụ của nền tảng | Đã xác nhận — 2026-08-26 → `DEC-112` |
| 3 | Trường tự điền khi đọc được link | User chốt: **Công ty + Platform (suy từ tên miền) + Ngày hết hạn (nếu trang tuyển dụng có ghi)**; không thêm cột "Vị trí ứng tuyển" | Đã xác nhận — 2026-08-26 → `DEC-113` |
| 4 | Hành vi khi đọc lỗi / chỉ lấy được một phần | User chốt: **vẫn lưu job** với link + phần điền được; báo nhẹ "chưa lấy được [tên trường] — mời nhập tay"; **không chặn lưu** | Đã xác nhận — 2026-08-26 → `DEC-114` |
| 5 | Việc đọc link xảy ra lúc nào — ngay khi Dylan rời ô Link (chờ trong dòng) hay sau khi lưu (làm giàu nền)? | Nghiêng về: đọc ngay khi Dylan rời ô Link hoặc bấm nút "Lấy thông tin", có chỉ báo "Đang lấy thông tin..." | Cần user xác nhận — để `ssr-ba` chốt khi viết spec |
| 6 | Có ghi đè giá trị Dylan đã gõ tay không, nếu đọc link ra giá trị khác? | Nghiêng về: chỉ điền vào ô đang trống, không ghi đè ô Dylan đã nhập | Cần user xác nhận — `ssr-ba` |
| 7 | Cần timeout / giới hạn số lần thử khi gọi ra mạng ngoài? | Giả định hợp lý: 1 lần thử, timeout ngắn (vd 10 giây), thất bại thì rơi về nhập tay | Giả định hợp lý — `ssr-plan` chốt |
| 8 | Xử lý ra sao khi trang ghi hạn nộp kiểu "còn 5 ngày" / không có ngày rõ ràng? | Chưa có câu trả lời | Cần user xác nhận — `ssr-ba` |
| 9 | Áp dụng cho cả job đã lưu (dán/sửa link sau) hay chỉ lúc thêm mới? | Nghiêng về: cả hai, nhưng với job đã lưu thì qua nút "Lấy lại thông tin" chủ động, không tự chạy ngầm mỗi lần sửa link | Cần user xác nhận — `ssr-ba` |

## 5. Cơ Hội Nghiệp Vụ

| # | Đề xuất | Giá trị | Rủi ro nếu không làm |
| --- | --- | --- | --- |
| 1 | Đọc link tin tuyển dụng và tự điền Công ty, Platform, Ngày hết hạn vào dòng job (non-blocking, báo nhẹ khi thiếu) | Dylan chỉ cần dán link + chọn Trạng thái; bỏ được thao tác gõ tay lặp lại mỗi lần thêm job | Dylan tiếp tục gõ tay 4 trường/job, dễ nản khi theo dõi nhiều job — giảm khả năng bảng được cập nhật đầy đủ |
| 2 | Suy Platform từ tên miền link kể cả khi không đọc được nội dung trang | Ngay cả link LinkedIn bị chặn nội dung vẫn tự chọn đúng Platform "LinkedIn"; đây là phần rẻ và đáng tin cậy nhất | Bỏ lỡ phần tự động hóa chắc chắn hoạt động với mọi nền tảng |

## 6. Cơ Hội UI/UX

| # | Màn hình | Vấn đề | Đề xuất |
| --- | --- | --- | --- |
| 1 | Bảng "Theo dõi CV ứng tuyển" — dòng thêm/sửa job | Sau khi dán link không có phản hồi gì; Dylan không biết hệ thống có "đọc" được link không | Chỉ báo trạng thái ngay tại ô Link: "Đang lấy thông tin..." → "Đã điền Công ty, Platform" / "Chưa lấy được Ngày hết hạn — mời nhập tay" |
| 2 | Ô Link | Chỉ validate tiền tố `http(s)://`, không chuẩn hóa | Chuẩn hóa link (bỏ tham số theo dõi thừa, chuẩn hóa tên miền) trước khi lưu và trước khi đọc |
| 3 | Dòng job đã lưu | Nếu Dylan sửa/dán link mới vào job cũ, không rõ hệ thống có đọc lại không | Một nút nhỏ "Lấy lại thông tin từ link" trên dòng job để Dylan chủ động kích hoạt, không tự chạy ngầm mỗi lần sửa link |

## 7. Rủi Ro Chất Lượng Và Hiệu Năng

| # | Rủi ro | Bằng chứng | Mức chắc chắn |
| --- | --- | --- | --- |
| 1 | LinkedIn chặn truy cập tự động từ máy chủ (yêu cầu đăng nhập, trả về trang chặn hoặc mã 999) — với link LinkedIn phần đọc nội dung gần như luôn thất bại, chỉ suy được Platform từ tên miền | 1 trong 3 Platform mặc định là LinkedIn (`components/JobTrackerBoard.tsx:24-33`); kiến thức chung về chính sách chống truy cập tự động của LinkedIn | Nghi ngờ — chưa đo trên môi trường dự án |
| 2 | Truy cập tự động nội dung trang tuyển dụng có thể vi phạm điều khoản dịch vụ của một số nền tảng (đặc biệt LinkedIn) | User đã chấp nhận rủi ro này khi chọn "thử đọc mọi link" (`DEC-112`) | Có bằng chứng — điều khoản dịch vụ LinkedIn công khai cấm truy cập/thu thập tự động |
| 3 | Bố cục trang tuyển dụng của nền tảng thay đổi → quy tắc tách Công ty/Ngày hết hạn hỏng âm thầm và điền dữ liệu sai | Bản chất của việc phân tích HTML bên thứ ba | Nghi ngờ |
| 4 | Gọi ra mạng ngoài trong luồng thêm/lưu job làm chậm thao tác nếu không có timeout hoặc không tách khỏi bước lưu | `server/job-tracker/application/use-cases/upsert-job-application.ts` hiện thuần DB, chưa có gọi mạng ngoài | Có bằng chứng source |
| 5 | Ngày hết hạn đọc sai (hiểu nhầm định dạng, hoặc "còn N ngày") → job bị luật `BR-025` của US-020 tự chuyển "Expired" sai | `docs/kb/ba/wiki/knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md`; `docs/features/US-020-lich-su-trang-thai-job/spec.md` | Nghi ngờ |

Chưa có số đo hiệu năng thực tế — mọi rủi ro ở trên là suy luận từ source hoặc kiến thức chung, **chưa đo**.

## 8. Đề Xuất Ưu Tiên

| Ưu tiên | Đề xuất | Effort | Cần | Lý do |
| --- | --- | --- | --- | --- |
| 1 | Suy Platform + chuẩn hóa link từ tên miền (không cần đọc nội dung trang) | Quick win | BA spec | Phần đáng tin cậy nhất, chạy được với mọi link kể cả LinkedIn, không rủi ro điều khoản dịch vụ |
| 2 | Đọc nội dung link để điền Công ty + Ngày hết hạn, non-blocking, báo nhẹ khi thiếu | Medium | BA spec + SE plan | Đúng yêu cầu gốc của user; cần thiết kế luồng gọi mạng ngoài, timeout, xử lý thất bại |
| 3 | Chỉ báo trạng thái đọc link tại ô Link + nút "Lấy lại thông tin" trên dòng job đã lưu | Quick win | BA spec | Làm cùng #2 để Dylan luôn biết hệ thống đọc được gì |

Không cần Data migration — theo `DEC-113` không thêm cột mới, các cột hiện có đủ dùng. Không cần phiên `ssr-po mode=business-flow` — theo `DEC-111`.

## 9. Raw Candidate

| # | Nội dung raw đề xuất | Đã được duyệt tạo raw |
| --- | --- | --- |
| 1 | **Là Dylan, tôi muốn khi dán link tin tuyển dụng vào một dòng job ở bảng "Theo dõi CV ứng tuyển", hệ thống tự truy cập link đó và điền Công ty, Platform (suy từ tên miền), và Ngày hết hạn (nếu trang tuyển dụng có ghi) vào dòng job, để tôi không phải gõ tay lại các thông tin đã có sẵn trong tin tuyển dụng.** Hệ thống thử đọc mọi link kể cả LinkedIn; đọc được tới đâu điền tới đó; trường nào không lấy được thì báo nhẹ "chưa lấy được [tên trường] — mời nhập tay" và vẫn cho lưu job bình thường, không chặn. Áp dụng cho cả lúc thêm job mới và khi dán/sửa link của job đã có (job đã có: qua thao tác chủ động, không tự chạy ngầm). Ràng buộc kèm theo: `DEC-111` (mở rộng US-018, ngoài Business Flow), `DEC-112` (thử mọi link), `DEC-113` (3 trường tự điền, không thêm cột), `DEC-114` (non-blocking, báo nhẹ khi thiếu). Các điểm mờ #5–#9 ở mục 4 để `ssr-ba` chốt qua dialog khi viết spec. | Chưa — chờ user đồng ý |

`ssr-po` chỉ gọi `ssr-raw` sau khi user cho phép tường minh.
