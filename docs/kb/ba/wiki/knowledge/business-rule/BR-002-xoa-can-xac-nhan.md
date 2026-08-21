---
status: Active
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-002"]
---

# BR-002 — Xóa giao dịch phải qua hộp xác nhận trước

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan bấm "Xóa" trên một giao dịch, hệ thống hiện hộp thoại xác nhận trước; giao dịch chỉ bị xóa thật sau khi Dylan xác nhận trong hộp thoại đó.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-004`](../feature/US-004-sua-xoa-tung-giao-dich.md) | Nút "Xóa" tại bảng chi tiết chi tiêu |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có tính năng khôi phục sau khi đã xác nhận xóa | Xem [`BR-005`](BR-005-khong-undo.md) | `US-004` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt yêu cầu xác nhận trước khi xóa | `docs/memory/decisions.md#dec-009` | Đã xác nhận từ knowledge |
