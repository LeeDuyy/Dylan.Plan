---
status: Active
feature: US-007
updated: 2026-08-21
spec: docs/features/US-007-phan-tich-xu-huong-lich-su/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-007"]
---

# PBI — US-007 Phân tích xu hướng trên toàn bộ lịch sử đã lưu

> Tạo rỗng ở lần `ssr-ingest mode=ingest` đầu tiên. `ssr-ba` KHÔNG tự sửa trang này — bảng dưới đây được `ssr-ingest mode=sync` điền đầy đủ từ `spec.md` sau khi spec đạt `Status: Ready for DEV`. Trang rỗng nghĩa là chưa có spec hoàn chỉnh cho function này.

## 1. User Story

Là Dylan, tôi muốn biểu đồ "Xu hướng" (tổng chi qua các tháng) luôn hiển thị đủ mọi tháng ngân sách đã lưu bền vững, để số liệu phân tích luôn đúng với toàn bộ lịch sử đã lưu, kể cả khi trình duyệt bị xóa cache.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Hệ thống đã có 5 tháng ngân sách được tạo và lưu bền vững | Dylan mở trang Thu chi và xem biểu đồ "Xu hướng" | Biểu đồ hiển thị đủ 5 cột, mỗi cột tương ứng một tháng đã lưu, không thiếu tháng nào | Xem ASCII Mockup mục 8.1 |
| AC-02 | Hệ thống đã có nhiều hơn 12 tháng ngân sách được tạo và lưu bền vững (ví dụ 15 tháng) | Dylan mở trang Thu chi và xem biểu đồ "Xu hướng" | Biểu đồ hiển thị đủ toàn bộ 15 cột — không bị cắt bớt hay chỉ hiển thị một số tháng gần nhất | Xem ASCII Mockup mục 8.1 |
| AC-03 | Hệ thống đã có 5 tháng ngân sách được tạo và lưu bền vững; Dylan đã xóa cache trình duyệt (hoặc mở trang Thu chi trên một máy/trình duyệt khác chưa từng truy cập trang này) | Dylan mở lại trang Thu chi | Biểu đồ "Xu hướng" vẫn hiển thị đủ 5 cột — đúng bằng số tháng đã từng được tạo và lưu trong hệ thống, không mất tháng nào vì lý do xóa cache | Xem ASCII Mockup mục 8.1 |
| AC-04 | Hệ thống chưa có tháng ngân sách nào được tạo (dữ liệu trống) | Dylan mở trang Thu chi và xem biểu đồ "Xu hướng" | Biểu đồ không hiển thị cột nào, giữ nguyên trạng thái trống hiện có — không báo lỗi, không hiển thị cột giả | Xem ASCII Mockup mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-028` | [`../../knowledge/business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md`](../../knowledge/business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered With Notes) |
