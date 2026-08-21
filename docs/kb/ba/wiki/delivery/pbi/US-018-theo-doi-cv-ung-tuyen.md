---
status: Active
feature: US-018
updated: 2026-08-13
spec: docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-018"]
---

# PBI — US-018 Bảng theo dõi CV ứng tuyển tại trang Roadmap

> Tạo rỗng ở lần `ssr-ingest mode=ingest` đầu tiên. `ssr-ba` KHÔNG tự sửa trang này — bảng dưới đây được `ssr-ingest mode=sync` điền đầy đủ từ `spec.md` sau khi spec đạt `Status: Ready for DEV`.

## 1. User Story

Là một Dylan, tôi muốn theo dõi tập trung các job đang quan tâm và trạng thái nộp CV ngay trên trang Roadmap, để không còn phải nhớ hoặc quản lý thủ công danh sách này ở nơi khác, và xem lại được toàn bộ tiến độ ứng tuyển chỉ bằng một lượt mở trang, kể cả sau khi đóng trình duyệt hoặc đổi máy.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Bảng "Theo dõi CV ứng tuyển" đang rỗng (chưa có job nào); Platform có sẵn 3 option mặc định "ITViec", "LinkedIn", "VietNamWork" | Dylan bấm "+ Thêm job", nhập Công ty "Tech Corp", chọn Ngày hết hạn 30/09/2026 qua lịch chọn ngày, chọn Platform "LinkedIn", nhập Link "https://linkedin.com/jobs/123", giữ nguyên Trạng thái mặc định, nhập Ghi chú "Đã nộp CV qua giới thiệu", rồi lưu | Một dòng mới xuất hiện trên bảng đúng với dữ liệu vừa nhập; cột Trạng thái hiển thị "Interested" | Xem ASCII Mockup mục 8.1 |
| AC-02 | Dylan đang mở ô chọn Platform khi thêm/sửa một job; danh sách hiện có 3 option mặc định | Dylan gõ "TopCV" vào ô "+ Thêm platform mới" ở cuối danh sách rồi xác nhận | Option "TopCV" xuất hiện trong danh sách Platform và được chọn ngay cho job đang thao tác | Xem ASCII Mockup mục 8.1 |
| AC-03 | Option Platform "TopCV" không được job nào sử dụng | Dylan bấm biểu tượng xóa cạnh "TopCV" trong ô chọn Platform | Option "TopCV" biến mất khỏi danh sách Platform | Xem ASCII Mockup mục 8.1 |
| AC-04 | Option Platform "LinkedIn" đang được ít nhất một job sử dụng | Dylan bấm biểu tượng xóa cạnh "LinkedIn" trong ô chọn Platform | Thao tác xóa bị chặn; thông báo hiện ra cho biết đang có job dùng "LinkedIn"; option "LinkedIn" vẫn còn trong danh sách | Xem ASCII Mockup mục 8.1 |
| AC-05 | Job "Tech Corp" đang có Trạng thái "Waiting" | Dylan mở ô chọn Trạng thái của job "Tech Corp" và chọn thẳng "Fail" | Trạng thái của job "Tech Corp" đổi ngay thành "Fail", không có cảnh báo hay chặn nào về việc bỏ qua các trạng thái ở giữa | Xem ASCII Mockup mục 8.1 |
| AC-06 | Bảng đang có job "Tech Corp" | Dylan bấm nút xóa (biểu tượng thùng rác) trên dòng "Tech Corp", rồi xác nhận trong hộp thoại hiện ra | Job "Tech Corp" biến mất khỏi bảng | Xem ASCII Mockup mục 8.1 |
| AC-07 | Bảng đang có nhiều job với Ngày hết hạn khác nhau, chưa từng được sắp xếp | Dylan click vào tiêu đề cột "Ngày hết hạn" | Toàn bộ job trên bảng được sắp xếp lại theo Ngày hết hạn tăng dần; click lại lần nữa vào tiêu đề "Ngày hết hạn" thì thứ tự đảo thành giảm dần | Xem ASCII Mockup mục 8.1 |
| AC-08 | Dylan đang thêm hoặc sửa một job | Dylan nhập vào ô Link giá trị "linkedin.com/jobs/123" (thiếu `http://` hoặc `https://`) rồi bấm lưu | Thao tác lưu bị chặn; thông báo lỗi hiện ngay dưới ô Link yêu cầu nhập đúng định dạng đường dẫn | Xem ASCII Mockup mục 8.1 |
| AC-09 | Dylan đã điền đầy đủ thông tin hợp lệ cho một job mới và bấm lưu | Việc lưu bị lỗi do mất kết nối hoặc lỗi máy chủ | Ứng dụng hiện thông báo lỗi chung; dữ liệu Dylan vừa nhập vẫn còn nguyên trên form, chưa có dòng nào được thêm vào bảng, cho tới khi Dylan thử lưu lại thành công | Xem ASCII Mockup mục 8.1 |
| AC-10 | Dylan đang thêm một job mới, đã nhập Link và Ghi chú nhưng để trống Công ty | Dylan bấm lưu mà chưa nhập Công ty | Thao tác lưu bị chặn; thông báo lỗi hiện ngay dưới ô Công ty yêu cầu nhập tên công ty; chưa có dòng nào được thêm vào bảng | Xem ASCII Mockup mục 8.1 |
| AC-11 | Job "Tech Corp" đang có Công ty "Tech Corp", Ngày hết hạn 30/09/2026, Platform "LinkedIn" | Dylan bấm vào ô Công ty của job "Tech Corp", sửa thành "Tech Corp Vietnam", rồi xác nhận | Ô Công ty của job đó hiển thị ngay "Tech Corp Vietnam"; giá trị được lưu lại cho job đó, không cần mở form riêng | Xem ASCII Mockup mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-021` | [`../../knowledge/business-rule/BR-021-chan-xoa-platform-dang-dung.md`](../../knowledge/business-rule/BR-021-chan-xoa-platform-dang-dung.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| Không có | Không |
