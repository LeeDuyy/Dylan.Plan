---
status: Active
updated: 2026-08-10
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-014"]
---

# BR-014 — Ngăn trùng tháng bằng cách disable kỳ tháng đã có dữ liệu trong ô chọn kỳ tháng

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Ô chọn kỳ tháng để tạo tháng mới (trống hoặc sao chép) là một danh sách liệt kê 13 kỳ tháng liên tục (6 tháng trước — tháng hiện tại — 6 tháng sau, theo đồng hồ hệ thống). Kỳ tháng nào đã có dữ liệu trong danh sách này hiển thị mờ, kèm ghi chú "Đã có dữ liệu", và không bấm chọn được — Dylan chỉ chọn được những kỳ tháng còn trống. Việc này ngăn tình trạng trùng tháng ngay từ thao tác chọn, thay vì để Dylan bấm nút tạo rồi mới báo lỗi.

Lớp bảo vệ dự phòng: nếu kỳ tháng vừa chọn bị một thao tác khác tạo trước đúng lúc Dylan bấm nút (ví dụ hai cửa sổ trình duyệt cùng lúc), hệ thống vẫn phải báo lỗi rõ ràng ("Tháng này đã tồn tại"), không được tạo trùng hay im lặng.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-006`](../feature/US-006-canh-bao-trung-thang.md) | Ô "Tạo tháng mới" của F3 (Quản lý theo chu kỳ tháng) — bước Dylan chọn kỳ tháng cần tạo, trước khi bấm "Tạo tháng"/"Clone tháng đang xem" |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Toàn bộ 13 kỳ tháng trong khoảng đều đã có dữ liệu | Không còn kỳ tháng nào chọn được; hai nút tạo tháng bị vô hiệu hóa thay vì để trống ô chọn | `US-006` |
| Kỳ tháng vừa chọn bị tạo bởi thao tác khác đúng lúc bấm nút | Áp dụng lớp bảo vệ dự phòng ở mục 1 — báo lỗi rõ ràng, không tạo trùng | `US-006` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Business Flow (F3, điều kiện rẽ nhánh, gap #6) | `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng` | Đã xác nhận từ knowledge |
| Quyết định hướng sửa (dialog `ssr-ba`) | `docs/memory/decisions.md#dec-061`, `docs/memory/decisions.md#dec-062` | Đã xác nhận từ knowledge |
