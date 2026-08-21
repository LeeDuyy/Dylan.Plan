---
status: Active
updated: 2026-08-06
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-009"]
---

# BR-009 — "Chi tiêu khác" chỉ tự sinh khi thật sự cần, không có sẵn mặc định mọi tháng

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Danh mục "Chi tiêu khác" không được tạo sẵn khi khởi tạo một tháng ngân sách mới (dù tạo trống hay sao chép từ tháng trước). Hệ thống chỉ tự động sinh ra danh mục này cho tháng đang chọn (nếu tháng đó chưa có) tại đúng thời điểm phát sinh một trong hai trường hợp: (a) có giao dịch được ghi nhận mà không gán danh mục nào, hoặc (b) danh mục cha của một giao dịch đã bị xóa.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-005`](../feature/US-005-rang-buoc-toan-ven-danh-muc.md) | Cả hai đường sinh "Chi tiêu khác": xóa danh mục cha, và ghi nhận giao dịch không chọn danh mục |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định "Chi tiêu khác" chỉ tự sinh khi cần (đảo `DEC-023`) | `docs/memory/decisions.md#dec-026` | Đã xác nhận từ knowledge |
