---
status: Active
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-005"]
---

# BR-005 — Không phát triển tính năng khôi phục (undo) sau khi xóa

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Sau khi một giao dịch bị xóa (đã qua hộp xác nhận — [`BR-002`](BR-002-xoa-can-xac-nhan.md)), hệ thống không cung cấp cách khôi phục lại giao dịch đó. Hộp xác nhận trước khi xóa là lớp bảo vệ duy nhất chống xóa nhầm.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-004`](../feature/US-004-sua-xoa-tung-giao-dich.md) | Luồng xóa giao dịch — không thiết kế nút "Hoàn tác" |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt không phát triển undo | `docs/memory/decisions.md#dec-031` | Đã xác nhận từ knowledge |
