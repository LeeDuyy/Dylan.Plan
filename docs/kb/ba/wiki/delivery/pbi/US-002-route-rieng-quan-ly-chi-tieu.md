---
status: Active
feature: US-002
updated: 2026-08-05
spec: docs/features/US-002-route-rieng-quan-ly-chi-tieu/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-002"]
---

# PBI — US-002 Route/module riêng cho Quản lý chi tiêu

> Đồng bộ từ `spec.md` (`Status: Ready for DEV`, 2026-08-05). `ssr-ba` KHÔNG tự sửa trang này.

## 1. User Story

Là một Dylan, tôi muốn khu vực Thu chi có một địa chỉ trang riêng (`/budget`) tách khỏi các mục khác của Dylan Plan Dashboard (Roadmap, Freelance, Sản phẩm), để tôi có thể vào thẳng trang Thu chi bằng địa chỉ riêng đó — kể cả gõ trực tiếp hay lưu bookmark — thay vì phải luôn đi qua trang chủ rồi chọn tab.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Dylan đang ở trang chủ Dylan Plan Dashboard, bất kể tab nào đang chọn | Dylan bấm mục "Thu chi" trên thanh điều hướng, hoặc bấm nút "Nhập thu chi" ở khu giới thiệu đầu trang | Địa chỉ trang trên trình duyệt đổi thành `/budget`; trang mới hiển thị đúng 7 khối theo thứ tự: chọn/tạo tháng và lịch sử tháng, ô nhập nhanh chi tiêu, bảng danh mục và ngân sách, bảng chi tiết chi tiêu, phân tích, quy tắc kiểm soát ngân sách, nút xuất dữ liệu — không thiếu khối nào so với trước đây từng nằm trong tab "Thu chi" của trang chủ | Xem ASCII Mockup mục 8.1 |
| AC-02 | Dylan đang ở trang chủ, tab "Tổng quan" đang chọn | Dylan xem nội dung trang chủ | Chỉ thấy các khối Roadmap, Freelance, Sản phẩm; khối tổng quan ở đầu trang chỉ còn đúng 3 thẻ: Mục tiêu offer, Thu nhập hiện tại, Chi phí cố định — không còn thẻ "Còn lại tháng này", không còn bảng danh mục, ô nhập nhanh, hay bất kỳ nội dung Thu chi nào khác trên trang chủ | Xem ASCII Mockup mục 8.1 |
| AC-03 | Dylan đang ở trang `/budget` | Dylan bấm liên kết quay lại ở đầu trang | Trình duyệt chuyển về địa chỉ trang chủ, hiển thị lại Dylan Plan Dashboard (mặc định tab "Tổng quan") | Xem ASCII Mockup mục 8.2 |
| AC-04 | Trước khi có thay đổi này, Dylan đã có sẵn dữ liệu Thu chi (tháng, danh mục, giao dịch đã lưu) hiển thị trong tab "Thu chi" của trang chủ | Dylan mở `/budget` lần đầu sau khi thay đổi này có hiệu lực | Bảng danh mục hiển thị đúng số dòng, đúng số tiền ngân sách và Chi thực tế như trước; bảng chi tiết chi tiêu liệt kê đúng số giao dịch đã có trước đó, không thiếu hay thừa dòng nào so với khi còn hiển thị trong tab "Thu chi" của trang chủ | Xem ASCII Mockup mục 8.2 |
| AC-05 | Dylan chưa mở trang chủ trong phiên làm việc hiện tại | Dylan gõ trực tiếp địa chỉ `/budget` vào trình duyệt, hoặc mở từ bookmark đã lưu | Trang tải xong hiển thị ngay đúng 7 khối liệt kê ở AC-01 (mục 3) — không có bước chuyển hướng trung gian nào về trang chủ trước khi hiển thị các khối này | Xem ASCII Mockup mục 8.2 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-006` | [`../../knowledge/business-rule/BR-006-route-budget.md`](../../knowledge/business-rule/BR-006-route-budget.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered) |
