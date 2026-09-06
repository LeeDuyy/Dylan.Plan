---
status: Active
feature: US-021
updated: 2026-08-28
spec: docs/features/US-021-tu-dien-thong-tin-job-link/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-021"]
---

# PBI — US-021 Tự điền thông tin job từ link tin tuyển dụng

> `ssr-ingest mode=sync` đã điền bảng dưới đây từ `spec.md` (`Status: Ready for DEV`, 2026-08-28). Bảng AC chép nguyên văn từ spec mục 7.

## 1. User Story

Là Dylan, tôi muốn khi dán đường dẫn tin tuyển dụng vào ô Link của một dòng job ở bảng "Theo dõi CV ứng tuyển" và rời khỏi ô, hệ thống tự truy cập đường dẫn và điền Công ty, Platform (suy từ tên miền), và Ngày hết hạn (khi trang ghi một ngày đầy đủ) vào các ô đang trống của dòng đó, để tôi không phải gõ tay lại các thông tin đã có sẵn trong tin tuyển dụng.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Dylan đang thêm một job mới, cả ba ô Công ty, Platform, Ngày hết hạn còn trống; danh sách Platform có kênh "ITViec"; đường dẫn tin tuyển dụng có tên miền chứa "itviec.com" và trang cho xem công khai, ghi tên công ty "Tech Corp" và dòng "Hạn nộp: 30 tháng 9, 2026" | Dylan dán đường dẫn đó vào ô Link rồi bấm ra ngoài ô | Dòng job hiện "Đang lấy thông tin..." rồi tắt; ô Platform hiển thị "ITViec"; ô Công ty hiển thị "Tech Corp"; ô Ngày hết hạn hiển thị "30/09/2026"; không có thông báo nhẹ nào | Xem ASCII Mockup spec mục 8.1 |
| AC-02 | Dylan đang thêm một job mới, cả ba ô còn trống; danh sách Platform có kênh "LinkedIn"; đường dẫn có tên miền chứa "linkedin.com" nhưng trang chặn truy cập tự động (không đọc được nội dung) | Dylan dán đường dẫn đó vào ô Link rồi bấm ra ngoài ô | Ô Platform hiển thị "LinkedIn"; ô Công ty và ô Ngày hết hạn vẫn trống; hiện đúng hai thông báo nhẹ "chưa lấy được Công ty — mời nhập tay" và "chưa lấy được Ngày hết hạn — mời chọn tay" (không có thông báo nhẹ cho Platform); nút lưu job vẫn bấm được | Xem ASCII Mockup spec mục 8.1 |
| AC-03 | Dylan đang thêm một job mới, đã tự gõ "Công ty ABC" vào ô Công ty và tự chọn Platform "LinkedIn"; ô Ngày hết hạn còn trống; danh sách Platform cũng có kênh "ITViec"; đường dẫn có tên miền chứa "itviec.com", trang ghi tên công ty "ABC Vietnam JSC" và hạn nộp "15/10/2026" | Dylan dán đường dẫn vào ô Link rồi bấm ra ngoài ô | Ô Công ty vẫn hiển thị "Công ty ABC" đúng như Dylan gõ, không bị đổi thành "ABC Vietnam JSC"; ô Platform vẫn hiển thị "LinkedIn", không bị đổi thành "ITViec"; ô Ngày hết hạn hiển thị "15/10/2026" (được điền vì đang trống); không có thông báo nhẹ nào | Xem ASCII Mockup spec mục 8.1 |
| AC-04 | Dylan đang thêm một job mới, cả ba ô còn trống; danh sách Platform có kênh "ITViec"; đường dẫn có tên miền chứa "itviec.com", trang ghi tên công ty "Data Co" nhưng phần hạn nộp chỉ ghi "Còn 5 ngày để ứng tuyển" | Dylan dán đường dẫn vào ô Link rồi bấm ra ngoài ô | Ô Công ty hiển thị "Data Co"; ô Platform hiển thị "ITViec"; ô Ngày hết hạn vẫn trống; hiện đúng một thông báo nhẹ "chưa lấy được Ngày hết hạn — mời chọn tay" | Xem ASCII Mockup spec mục 8.1 |
| AC-05 | Dylan đang thêm một job mới, ô Platform còn trống; danh sách Platform có "ITViec", "LinkedIn", "VietNamWork"; đường dẫn thuộc một trang tuyển dụng riêng của công ty, tên miền không chứa tên kênh nào trong danh sách | Dylan dán đường dẫn vào ô Link rồi bấm ra ngoài ô | Ô Platform vẫn trống; hiện một thông báo nhẹ "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới"; danh sách Platform vẫn đúng ba kênh cũ, không có kênh nào được thêm | Xem ASCII Mockup spec mục 8.1 |
| AC-06 | Dylan đang thêm một job mới, cả ba ô còn trống; đường dẫn hợp lệ, tên miền không chứa tên kênh Platform nào trong danh sách; máy chủ không mở được trang (trang không phản hồi trong vòng mười giây) | Dylan dán đường dẫn vào ô Link rồi bấm ra ngoài ô, sau đó gõ tên công ty, chọn một kênh Platform, rồi bấm lưu | Dấu hiệu "Đang lấy thông tin..." hiện rồi tắt sau khoảng mười giây; ngay sau đó cả ba ô Công ty, Platform, Ngày hết hạn vẫn trống; hiện ba thông báo nhẹ tương ứng; sau khi Dylan gõ tên công ty và chọn kênh rồi bấm lưu, một dòng job mới xuất hiện trên bảng với Công ty và Platform Dylan vừa nhập, ô Ngày hết hạn để trống | Xem ASCII Mockup spec mục 8.1 |
| AC-07 | Job "Cũ Corp" đã có trong bảng: ô Công ty và ô Platform đã có giá trị, ô Ngày hết hạn đang trống, ô Link đang là một đường dẫn cũ | Dylan bấm vào ô Link của job "Cũ Corp", xóa đường dẫn cũ, dán một đường dẫn tin tuyển dụng mới cho xem công khai (trang ghi hạn nộp "2026-10-15") rồi bấm ra ngoài ô | Dòng job "Cũ Corp" hiện "Đang lấy thông tin..." rồi tắt; ô Ngày hết hạn của job đó hiển thị "15/10/2026" (được điền vì đang trống); ô Công ty và ô Platform của job đó giữ nguyên giá trị cũ, không bị thay đổi | Xem ASCII Mockup spec mục 8.1 |
| AC-08 | Dylan đang thêm một job mới | Dylan gõ "itviec.com/jobs/abc" (thiếu `http://` hoặc `https://`) vào ô Link rồi bấm ra ngoài ô hoặc bấm lưu | Hệ thống không mở đường dẫn, không hiện "Đang lấy thông tin..."; giữ nguyên hành vi US-018: thao tác lưu bị chặn, thông báo lỗi định dạng hiện ngay dưới ô Link | Xem ASCII Mockup spec mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-031` | [`../../knowledge/business-rule/BR-031-tu-dien-job-tu-link.md`](../../knowledge/business-rule/BR-031-tu-dien-job-tu-link.md) |
| `BR-032` | [`../../knowledge/business-rule/BR-032-suy-platform-tu-ten-mien.md`](../../knowledge/business-rule/BR-032-suy-platform-tu-ten-mien.md) |
| `BR-025` (chỉ tác động — Ngày hết hạn tự điền là đầu vào) | [`../../knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md`](../../knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-018` (bảng "Theo dõi CV ứng tuyển" và các ô job) | Không — đã Implemented |
| `US-020` (luật `BR-025` tự chuyển "Expired") | Không — chỉ đối chiếu để không đọc sai Ngày hết hạn |
| `DEC-119` (Ngày hết hạn không bắt buộc — code đã xong, chưa commit) | Không — spec đã viết trên nền này, DEV chạy trên cùng working tree |
