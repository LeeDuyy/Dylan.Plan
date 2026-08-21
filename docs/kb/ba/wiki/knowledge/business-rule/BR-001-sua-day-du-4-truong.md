---
status: Active
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-001"]
---

# BR-001 — Sửa giao dịch cho phép đổi đầy đủ 4 trường

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan sửa một giao dịch chi tiêu đã ghi nhận, hệ thống cho phép đổi đầy đủ 4 trường: nội dung, số tiền, danh mục, và ngày.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-004`](../feature/US-004-sua-xoa-tung-giao-dich.md) | Form sửa giao dịch tại bảng chi tiết chi tiêu |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Trường ngày chỉ nhận giá trị ≤ hôm nay | Xem [`BR-004`](BR-004-ngay-khong-tuong-lai.md) | `US-004` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt phạm vi sửa giao dịch | `docs/memory/decisions.md#dec-008` | Đã xác nhận từ knowledge |
