---
status: Active
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-003"]
---

# BR-003 — Chỉ cho sửa/xóa giao dịch của tháng đang chọn

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Dylan chỉ được sửa hoặc xóa giao dịch thuộc tháng đang chọn trên giao diện; giao dịch của các tháng khác chỉ xem, không cho thao tác sửa/xóa.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-004`](../feature/US-004-sua-xoa-tung-giao-dich.md) | Bảng chi tiết chi tiêu — kiểm tra tháng của giao dịch trước khi cho phép Sửa/Xóa |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt phạm vi tháng để tránh làm lệch số liệu lịch sử dùng cho phân tích xu hướng | `docs/memory/decisions.md#dec-010` | Đã xác nhận từ knowledge |
