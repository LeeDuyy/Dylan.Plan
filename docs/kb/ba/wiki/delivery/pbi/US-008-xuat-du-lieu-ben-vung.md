---
status: Active
feature: US-008
updated: 2026-08-21
spec: docs/features/US-008-xuat-du-lieu-ben-vung/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-008"]
---

# PBI — US-008 Xuất dữ liệu từ nguồn lưu trữ bền vững

> Tạo rỗng ở lần `ssr-ingest mode=ingest` đầu tiên. `ssr-ba` KHÔNG tự sửa trang này — bảng dưới đây được `ssr-ingest mode=sync` điền đầy đủ từ `spec.md` sau khi spec đạt `Status: Ready for DEV`. Trang rỗng nghĩa là chưa có spec hoàn chỉnh cho function này.

## 1. User Story

Là Dylan, tôi muốn nút "Xuất JSON" luôn đóng gói toàn bộ dữ liệu (mọi tháng, danh mục, giao dịch, item cần mua) đã lưu bền vững trong hệ thống, để file tải về luôn khớp đúng dữ liệu thật, không phụ thuộc bộ nhớ tạm của trình duyệt.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Hệ thống đã lưu bền vững nhiều tháng ngân sách, mỗi tháng có danh mục và giao dịch riêng | Dylan mở trang Thu chi, bấm "Xuất JSON" | File JSON tải về chứa đủ đúng số tháng, danh mục, và giao dịch đã lưu trong hệ thống, khớp 100% với dữ liệu hiển thị trên các bảng của trang | Xem ASCII Mockup mục 8.1 |
| AC-02 | Tháng hiện tại đang có item cần mua (cả Pending lẫn Purchased) | Dylan bấm "Xuất JSON" | File JSON tải về có chứa đủ danh sách item cần mua của tháng đó, đúng tên, giá, trạng thái đã lưu | Xem ASCII Mockup mục 8.1 |
| AC-03 | Dylan vừa tải lại trang Thu chi (chưa thao tác gì khác), hệ thống đang có 5 tháng ngân sách đã lưu bền vững, trong đó có tháng không phải tháng hiện tại cũng đang có item cần mua | Dylan bấm ngay "Xuất JSON" | File JSON tải về chứa đúng cả 5 tháng đã lưu, kể cả item cần mua của những tháng không phải tháng hiện tại — không thiếu tháng, danh mục, giao dịch hay item cần mua nào, không phụ thuộc việc Dylan đã thao tác gì trước đó trên trang | Xem ASCII Mockup mục 8.1 |
| AC-04 | Hệ thống chưa có tháng ngân sách nào được tạo (dữ liệu trống) | Dylan bấm "Xuất JSON" | File JSON vẫn tải về thành công, có cấu trúc hợp lệ, chỉ chứa danh sách tháng rỗng — không báo lỗi | Xem ASCII Mockup mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-029` | [`../../knowledge/business-rule/BR-029-xuat-json-tu-du-lieu-ben-vung.md`](../../knowledge/business-rule/BR-029-xuat-json-tu-du-lieu-ben-vung.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered With Notes) |
