---
status: Active
feature: US-020
updated: 2026-08-14
spec: docs/features/US-020-lich-su-trang-thai-job/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-020"]
---

# PBI — US-020 Lịch sử thay đổi trạng thái job ứng tuyển

> Tạo rỗng ở lần `ssr-ingest mode=ingest` đầu tiên. `ssr-ba` KHÔNG tự sửa trang này — bảng dưới đây được `ssr-ingest mode=sync` điền đầy đủ từ `spec.md` sau khi spec đạt `Status: Ready for DEV`. Trang rỗng nghĩa là chưa có spec hoàn chỉnh cho function này.

## 1. User Story

Là Dylan, tôi muốn mỗi job giữ mốc "Ngày nộp hồ sơ" và tự động cập nhật Trạng thái theo thời gian (chuyển "Expired" khi job đang "Interested" mà quá hạn nộp; chuyển "No Response" khi job đang "Waiting" mà im lặng quá 7 ngày kể từ "Ngày nộp hồ sơ"), để tôi thấy ngay job nào cần chú ý mà không phải tự nhớ hay tính tay từng ngày hết hạn/ngày nộp hồ sơ.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Job "Nova Tech" đang có Trạng thái "Interested", Ngày hết hạn là một ngày đã qua so với hôm nay | Dylan mở trang Roadmap (hoặc làm mới dữ liệu bảng "Theo dõi CV ứng tuyển") | Trạng thái job "Nova Tech" hiển thị "Expired" | Xem ASCII Mockup mục 8.1 |
| AC-02 | Job "Beta Ltd" đang có Trạng thái "Waiting", Ngày hết hạn là một ngày đã qua so với hôm nay | Dylan mở trang Roadmap (hoặc làm mới dữ liệu bảng "Theo dõi CV ứng tuyển") | Trạng thái job "Beta Ltd" vẫn hiển thị "Waiting", không đổi thành "Expired" | Xem ASCII Mockup mục 8.1 |
| AC-03 | Job "Tech Corp" đang có Trạng thái "Interested", chưa có giá trị nào ở cột "Ngày nộp hồ sơ" | Dylan mở ô chọn Trạng thái của job "Tech Corp" và chọn "Waiting" | Trạng thái job đổi ngay thành "Waiting"; cột "Ngày nộp hồ sơ" của job đó hiển thị đúng thời điểm vừa đổi (ngày và giờ) | Xem ASCII Mockup mục 8.1 |
| AC-04 | Job "Tech Corp" đang có Trạng thái "Waiting", cột "Ngày nộp hồ sơ" đang hiển thị "10/08/2026 09:15" | Dylan mở ô chọn Trạng thái của job "Tech Corp" và chọn "Interested" | Trạng thái job đổi ngay thành "Interested"; cột "Ngày nộp hồ sơ" của job đó trống, không còn hiển thị giá trị cũ | Xem ASCII Mockup mục 8.1 |
| AC-05 | Job "Global Soft" đang có Trạng thái "Waiting", cột "Ngày nộp hồ sơ" hiển thị một thời điểm đã hơn 7 ngày trước so với hôm nay, chưa từng đổi trạng thái nào khác kể từ đó | Dylan mở trang Roadmap (hoặc làm mới dữ liệu bảng "Theo dõi CV ứng tuyển") | Trạng thái job "Global Soft" hiển thị "No Response" | Xem ASCII Mockup mục 8.1 |
| AC-06 | Job "Global Soft" đang có Trạng thái "Waiting", cột "Ngày nộp hồ sơ" hiển thị một thời điểm cách đây chưa tới 7 ngày | Dylan mở trang Roadmap (hoặc làm mới dữ liệu bảng "Theo dõi CV ứng tuyển") | Trạng thái job "Global Soft" vẫn hiển thị "Waiting", không đổi thành "No Response" | Xem ASCII Mockup mục 8.1 |
| AC-07 | Job "Delta Inc" đang có Trạng thái "No Response", đã từng có mốc "Ngày nộp hồ sơ" từ lần "Interested → Waiting" trước đó | Dylan mở ô chọn Trạng thái của job "Delta Inc" và chọn "Waiting" | Trạng thái job đổi ngay thành "Waiting"; cột "Ngày nộp hồ sơ" của job đó vẫn giữ nguyên giá trị cũ, không đổi thành thời điểm vừa thao tác | Xem ASCII Mockup mục 8.1 |
| AC-08 | Job "Beta Ltd" đang có Trạng thái bất kỳ (vd "No Response") | Dylan mở ô chọn Trạng thái của job "Beta Ltd" và chọn "Expired" | Trạng thái job "Beta Ltd" đổi ngay thành "Expired", được chấp nhận như mọi lựa chọn thủ công khác, không bị chặn | Xem ASCII Mockup mục 8.1 |
| AC-09 | Job "Omega Corp" đang có Trạng thái "Waiting" nhưng chưa từng chuyển đúng từ "Interested" sang "Waiting" (vd được tạo mới sẵn ở "Waiting", hoặc vào "Waiting" từ một trạng thái khác "Interested"), cột "Ngày nộp hồ sơ" đang trống | Dylan mở trang Roadmap (hoặc làm mới dữ liệu bảng "Theo dõi CV ứng tuyển") | Trạng thái job "Omega Corp" vẫn hiển thị "Waiting", không tự động đổi thành "No Response" dù đã ở trạng thái này bao lâu; cột "Ngày nộp hồ sơ" vẫn trống | Xem ASCII Mockup mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-025` | [`../../knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md`](../../knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md) |
| `BR-026` | [`../../knowledge/business-rule/BR-026-waiting-qua-7-ngay-tu-dong-no-response.md`](../../knowledge/business-rule/BR-026-waiting-qua-7-ngay-tu-dong-no-response.md) |
| `BR-027` | [`../../knowledge/business-rule/BR-027-ngay-nop-ho-so-theo-chieu-waiting.md`](../../knowledge/business-rule/BR-027-ngay-nop-ho-so-theo-chieu-waiting.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-018` | Không (đã `Ready for DEV`, entity và bảng đã sẵn sàng để mở rộng) |
