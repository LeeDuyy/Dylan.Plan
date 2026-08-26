---
status: Raw
feature: US-021
created: 2026-08-26
source: PO Review
requester: Dylan
priority: Trung bình
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-021"]
---

# Raw Requirement — Tự điền thông tin job từ link tin tuyển dụng

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-021 |
| Slug | tu-dien-thong-tin-job-link |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định — user quyết định sau khi có spec (chạy `ssr-pipeline` hay từng stage) |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-021-tu-dien-thong-tin-job-link/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-021-tu-dien-thong-tin-job-link.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
tại danh sách job, tôi muốn khi nhập link vào, hệ thống pjhải tự truy cập vào lionk và điền các thông tin còn lại vào danh sách.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Màn hình liên quan | "Danh sách job" = bảng "Theo dõi CV ứng tuyển" trên trang Roadmap; thao tác diễn ra ở dòng thêm job mới và dòng sửa job | `components/JobTrackerBoard.tsx` | Đã xác nhận |
| Function gốc | US-021 là phần mở rộng của US-018 (bảng theo dõi CV ứng tuyển); US-020 cũng mở rộng cùng bảng này | `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`, `docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md` | Đã xác nhận |
| Các trường hiện có của một job | Công ty, Ngày hết hạn, Platform, Link, Trạng thái, Ngày nộp hồ sơ, Ghi chú | `server/job-tracker/domain/entities/job-application.ts`, `components/JobTrackerBoard.tsx:296-312` | Đã xác nhận |
| Validate Link hiện tại | Chỉ kiểm tra Link bắt đầu bằng `http://` hoặc `https://`; không chuẩn hóa URL | `components/JobTrackerBoard.tsx:132-136` | Đã xác nhận |
| Trường bắt buộc khi lưu job | Công ty, Ngày hết hạn, Platform, Link (thiếu thì chặn lưu, báo lỗi dưới ô — `DEC-086`) | `components/JobTrackerBoard.tsx:127-138`, `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` mục 6 | Đã xác nhận |
| Platform là danh sách động | 3 option mặc định "ITViec"/"LinkedIn"/"VietNamWork"; Dylan tự thêm/xóa option; chặn xóa option đang có job dùng (`BR-021`) | `docs/kb/ba/wiki/data/entity/ENT-005-platform-tuyen-dung.md`, `docs/memory/decisions.md#dec-082` | Đã xác nhận |
| Luồng lưu job hiện tại | Thuần ghi database, chưa có bước gọi ra mạng ngoài | `server/job-tracker/application/use-cases/upsert-job-application.ts` | Đã xác nhận |
| Ranh giới cũ được nới | US-018 spec mục 2 ghi "không có tích hợp dữ liệu thật với các nền tảng đó"; nay nới riêng cho việc đọc link tự điền (`DEC-111`, `DEC-112`) | `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md:46`, `docs/memory/decisions.md#dec-111`, `#dec-112` | Đã xác nhận |
| Định vị Business Flow | US-021 nằm NGOÀI Business Flow "Hệ Thống Quản Lý Chi Tiêu", theo tiền lệ `DEC-088` | `docs/memory/decisions.md#dec-111`, `#dec-088` | Đã xác nhận |
| Rủi ro khi đọc sai Ngày hết hạn | Ngày hết hạn sai có thể kích hoạt luật `BR-025` (US-020) tự chuyển job đang "Interested" sang "Expired" | `docs/kb/ba/wiki/knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md` | Đã xác nhận |
| Nguồn đề xuất | PO review 2026-08-26 (`ssr-po mode=review` → `mode=intake` sau khi user duyệt "tạo raw cho đề xuất này") | `docs/po/review-2026-08-26-tu-dien-thong-tin-job-tu-link.md` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Đọc được link thì tự điền những trường nào? | Công ty + Platform (suy từ tên miền) + Ngày hết hạn (chỉ khi trang có ngày tuyệt đối rõ ràng). Trạng thái và Ghi chú luôn do Dylan nhập. Không thêm cột mới "Vị trí ứng tuyển". Không cần đổi schema/model | Đã xác nhận từ knowledge — user chốt qua `ssr-po` `AskUserQuestion` 2026-08-26 (`docs/memory/decisions.md#dec-113`) |
| Q2 | Link từ nền tảng nào cần đọc được? | Thử đọc mọi link, kể cả LinkedIn. Chấp nhận tỷ lệ thất bại cao (LinkedIn thường chặn truy cập tự động) và rủi ro điều khoản dịch vụ nền tảng. Đọc nội dung thất bại thì vẫn suy Platform từ tên miền | Đã xác nhận từ knowledge — user chốt qua `ssr-po` `AskUserQuestion` 2026-08-26 (`docs/memory/decisions.md#dec-112`) |
| Q3 | Đọc link thất bại hoặc chỉ lấy được một phần thì làm gì? | Vẫn lưu job với link + phần điền được; báo nhẹ "chưa lấy được [tên trường] — mời nhập tay"; không chặn thao tác | Đã xác nhận từ knowledge — user chốt qua `ssr-po` `AskUserQuestion` 2026-08-26 (`docs/memory/decisions.md#dec-114`) |
| Q4 | Tính năng này có làm mảng theo dõi tuyển dụng thành khu vực chính thức của Business Flow không? | Không. Mở rộng US-018 như tiện ích độc lập, giữ ngoài Business Flow (tiền lệ `DEC-088`) | Đã xác nhận từ knowledge — user chốt qua `ssr-po` `AskUserQuestion` 2026-08-26 (`docs/memory/decisions.md#dec-111`) |
| Q5 | Việc đọc link xảy ra vào lúc nào? | Ngay khi Dylan rời ô Link (sau khi dán/gõ xong): hiện chỉ báo "Đang lấy thông tin...", điền xong thì các ô cập nhật tại chỗ, Dylan xem và sửa lại được trước khi lưu | Đã xác nhận từ knowledge — user chốt qua `ssr-raw` `AskUserQuestion` 2026-08-26 (`docs/memory/decisions.md#dec-115`) |
| Q6 | Nếu đọc link ra giá trị khác với ô Dylan đã tự gõ thì xử lý sao? | Chỉ điền vào ô đang trống; ô Dylan đã nhập thì giữ nguyên, không đụng tới | Đã xác nhận từ knowledge — user chốt qua `ssr-raw` `AskUserQuestion` 2026-08-26 (`docs/memory/decisions.md#dec-116`) |
| Q7 | Khi trang tuyển dụng không ghi ngày hết hạn rõ ràng (vd "còn 5 ngày", "tuyển gấp", không có mục hạn nộp) thì xử lý Ngày hết hạn thế nào? | Chỉ điền khi trang có ngày ở dạng tuyệt đối, rõ ràng. Mọi kiểu mập mờ đều để trống + báo nhẹ "chưa lấy được Ngày hết hạn — mời chọn tay" | Đã xác nhận từ knowledge — user chốt qua `ssr-raw` `AskUserQuestion` 2026-08-26 (`docs/memory/decisions.md#dec-117`) |
| Q8 | Khi tên miền của link không khớp Platform nào đang có (vd trang tuyển dụng riêng của công ty) thì tự điền Platform thế nào? | Để trống Platform, báo nhẹ "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới". Không tự tạo option Platform mới, không gán vào nhãn "Khác" | Đã xác nhận từ knowledge — user chốt qua `ssr-raw` `AskUserQuestion` 2026-08-26 (`docs/memory/decisions.md#dec-118`) |
| Q9 | Với job đã lưu, khi Dylan dán/sửa link mới thì đọc lại thế nào? | Nghiêng về: có nút "Lấy lại thông tin từ link" trên dòng job để Dylan chủ động kích hoạt, không tự chạy ngầm mỗi lần sửa link (`docs/po/review-2026-08-26-tu-dien-thong-tin-job-tu-link.md` mục 6 #3) | Giả định hợp lý — `ssr-ba` xác nhận qua dialog khi viết spec |
| Q10 | Cần timeout / giới hạn số lần thử khi gọi ra mạng ngoài không? | Nghiêng về: 1 lần thử, thời gian chờ ngắn (khoảng 10 giây); quá hạn thì coi như đọc thất bại và rơi về nhập tay (`DEC-114`) | Giả định hợp lý — `ssr-plan` chốt |
| Q11 | Cơ chế đọc trang là gì — tự phân tích trang theo quy tắc riêng cho từng nền tảng, hay đọc phần thông tin chuẩn mà trang tự khai báo, hay gửi link/nội dung tới một dịch vụ ngoài để trích xuất? | Mặc định: máy chủ của ứng dụng tự đọc trang, ưu tiên phần thông tin chuẩn trang tự khai báo (tên công ty, tin tuyển dụng) cộng quy tắc riêng cho ITViec/VietnamWorks; KHÔNG gửi link hay nội dung tới bất kỳ dịch vụ ngoài nào. Nếu `ssr-plan` kết luận cần một dịch vụ ngoài thì phải nêu lại thành câu hỏi cho user (quyết định kiến trúc + riêng tư), không tự quyết | Giả định hợp lý — chốt cơ chế cụ thể ở `ssr-plan`; việc gửi dữ liệu ra ngoài (nếu có) quay lại hỏi user |
| Q12 | Có cần lưu/hiển thị "thông tin này lấy từ link lúc nào" cho từng job không? | Nghiêng về: không cần — đây chỉ là tiện ích hỗ trợ nhập liệu, sau khi điền xong các trường là dữ liệu job bình thường | Giả định hợp lý — `ssr-ba` xác nhận |

## 5. Ghi Chú BA

- **Nguyên văn có lỗi gõ:** "pjhải" = "phải", "lionk" = "link" — giữ nguyên trong mục 2 theo quy tắc `ssr-raw` (không sửa chính tả). Ý người dùng đã rõ: khi nhập Link vào một dòng job, hệ thống tự truy cập link đó và điền các trường còn lại của dòng.
- **Diễn giải thành user story (để `ssr-ba` tham chiếu, không phải nguyên văn):** "Là Dylan, tôi muốn khi dán link tin tuyển dụng vào một dòng job ở bảng 'Theo dõi CV ứng tuyển', hệ thống tự đọc link đó và điền Công ty, Platform, Ngày hết hạn vào dòng job, để tôi không phải gõ tay lại thông tin đã có sẵn trong tin tuyển dụng."
- **Chồng lấn function:** US-021 mở rộng US-018 và dùng chung entity Job ứng tuyển (`ENT-004`), cùng bảng với US-020. `ssr-ba`/`ssr-plan` phải đối chiếu để không phá vỡ AC của US-018 (validate Link, trường bắt buộc, sửa inline) và US-020 (luật `BR-025` tự chuyển "Expired"). Đặc biệt: nếu Ngày hết hạn đọc sai/lệch, job đang "Interested" có thể bị `BR-025` tự chuyển sang "Expired" — đây là lý do `DEC-117` chốt chỉ điền khi có ngày tuyệt đối rõ ràng.
- **Không đổi data model** (`DEC-113`): các cột hiện có đủ dùng, không cần `ssr-data`/migration. Nhưng `ssr-plan` cần thiết kế một luồng gọi ra mạng ngoài phía máy chủ (server action hoặc route) — trình duyệt không tự đọc trang khác tên miền được.
- **Rủi ro điều khoản dịch vụ** (đặc biệt LinkedIn): user đã chấp nhận tường minh (`DEC-112`), không chặn ở tầng sản phẩm. Nên ghi vào spec như một "ghi chú rủi ro đã biết", không phải AC.
- **Tách phạm vi khi viết spec** (theo PO review mục 8): phần "suy Platform + chuẩn hóa link từ tên miền" là Quick win chạy được với mọi link (kể cả LinkedIn) và nên là nhóm AC độc lập với phần "đọc nội dung trang để điền Công ty + Ngày hết hạn" (Medium, phụ thuộc nền tảng). Xem `docs/memory/judgement-log.md#jdg-032` — AC "đọc nội dung thành công" không nên lấy link LinkedIn làm trường hợp chính.
- **Điểm mờ còn lại cho `ssr-ba`/`ssr-plan`:** Q9 (job đã lưu), Q10 (timeout), Q11 (cơ chế đọc + có gửi dữ liệu ra dịch vụ ngoài không — cần user chốt vì là quyết định kiến trúc/riêng tư), Q12 (dấu vết nguồn).
