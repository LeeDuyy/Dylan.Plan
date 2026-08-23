---
status: Active
updated: 2026-08-21
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-028"]
---

# BR-028 — Biểu đồ "Xu hướng" (F4) tính từ toàn bộ dữ liệu bền vững, không giới hạn số tháng, không chỉ tháng đang có trong bộ nhớ trình duyệt

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Biểu đồ "Xu hướng" (tổng chi qua các tháng) ở luồng F4 (Phân tích và báo cáo chi tiêu) phải được tính từ toàn bộ tháng ngân sách đã lưu bền vững trong cơ sở dữ liệu, không giới hạn số tháng tối đa (`DEC-109`), không chỉ từ các tháng đang có sẵn trong bộ nhớ tạm của trình duyệt tại thời điểm Dylan mở trang. Các thẻ insight (danh mục chi nhiều nhất, tiết kiệm, chi linh hoạt) và biểu đồ "Cơ cấu chi tiêu" không thuộc phạm vi rule này — cả hai chỉ mô tả đúng một tháng Dylan đang xem, không có khái niệm "lịch sử nhiều tháng" (`DEC-110`).

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-007`](../feature/US-007-phan-tich-xu-huong-lich-su.md) | Nguồn dữ liệu tính biểu đồ "Xu hướng" (`EL-01`) |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Mini dashboard 3/6/9/12 tháng gần đây có giới hạn khoảng thời gian riêng, không áp dụng "toàn bộ lịch sử" | Khi Dylan mở khối mini dashboard | `US-011` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Trường hợp hỏng F4 ghi nhận xu hướng chỉ tính trên tháng đang có trong bộ nhớ | `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng` (F4) | Đã xác nhận từ knowledge |
| Raw requirement | `docs/kb/ba/raw/US-007-phan-tich-xu-huong-lich-su.md` | Đã xác nhận từ knowledge |
| Spec | `docs/features/US-007-phan-tich-xu-huong-lich-su/spec.md` (`Ready for DEV`, `DEC-109`, `DEC-110`) | Đã xác nhận từ knowledge |
