---
status: Active
updated: 2026-08-10
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-017"]
---

# BR-017 — Chặn trùng tên danh mục khi thêm mới hoặc sửa tên

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan thêm danh mục mới hoặc sửa tên một danh mục đã có, hệ thống kiểm tra tên đó có trùng với một danh mục khác trong cùng tháng đang chọn không. Khi so sánh, hệ thống bỏ qua khác biệt hoa/thường, khoảng trắng thừa ở đầu/cuối chuỗi, và rút gọn mọi dãy khoảng trắng liên tiếp ở giữa chuỗi thành một khoảng trắng (vd " Ăn uống", "ăn uống ", và "Ăn  uống" — hai khoảng trắng liền giữa hai từ — đều được coi là trùng với "Ăn uống"). Áp dụng cho cả tên do Dylan tự gõ và tên mặc định do hệ thống tự đặt khi tạo danh mục mới. Nếu trùng, hệ thống chặn thao tác thêm/sửa, hiện thông báo lỗi rõ ràng yêu cầu Dylan đổi tên khác — không tự động đổi tên hay thêm hậu tố phân biệt.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-010`](../feature/US-010-chan-trung-ten-danh-muc.md) | Toàn bộ — thao tác thêm danh mục mới và sửa tên danh mục đã có, trong phạm vi bảng danh mục của tháng đang chọn (F2) |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| "Chi tiêu khác" không áp dụng rule này | "Chi tiêu khác" khóa vĩnh viễn, chỉ xem, không cho sửa tên (`BR-010`) — không có thao tác sửa tên để kiểm tra trùng | `US-010`, `US-005` |
| Kiểm tra trùng tên chỉ tính trong cùng một tháng | Hai danh mục cùng tên ở hai tháng khác nhau không bị chặn — mỗi tháng có danh sách danh mục riêng | `US-010` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Áp dụng cho cả thêm mới và sửa tên, trong phạm vi tháng đang chọn | `docs/memory/decisions.md#dec-020` | Đã xác nhận từ knowledge |
| Trùng tên thì chặn thao tác, báo lỗi rõ ràng, không tự đổi tên | `docs/memory/decisions.md#dec-021` | Đã xác nhận từ knowledge |
| So sánh bỏ qua khác biệt hoa/thường và khoảng trắng thừa đầu/cuối | `docs/memory/decisions.md#dec-022` | Đã xác nhận từ knowledge |
| "Chi tiêu khác" khóa vĩnh viễn, không cho sửa tên (nguồn ngoại lệ) | `docs/memory/decisions.md#dec-027` | Đã xác nhận từ knowledge |
| Áp dụng luôn cho tên mặc định "Danh mục mới" của nút "Thêm danh mục" | `docs/memory/decisions.md#dec-068` | Đã xác nhận từ knowledge |
| Mở rộng chuẩn hóa: rút gọn khoảng trắng lặp ở giữa chuỗi | `docs/memory/decisions.md#dec-069` | Đã xác nhận từ knowledge |
