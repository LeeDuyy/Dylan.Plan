---
status: Active
updated: 2026-08-06
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-008"]
---

# BR-008 — Xóa một danh mục thường chuyển toàn bộ giao dịch của nó sang "Chi tiêu khác"

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan xóa một danh mục không bị khóa (khác "Tiền nhà", "Chi phí cố định khác" và chính "Chi tiêu khác"), toàn bộ giao dịch đang gắn với danh mục đó được chuyển sang danh mục dự phòng "Chi tiêu khác" trước khi xóa danh mục gốc — không giao dịch nào bị mất liên kết danh mục.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-005`](../feature/US-005-rang-buoc-toan-ven-danh-muc.md) | Thao tác xóa danh mục ở bảng ngân sách theo danh mục |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Danh mục bị khóa (`locked = true`) | Không cho xóa — không áp dụng rule chuyển giao dịch vì thao tác xóa đã bị chặn từ đầu | `US-005` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định chuyển giao dịch sang "Chi tiêu khác" khi xóa danh mục | `docs/memory/decisions.md#dec-024` | Đã xác nhận từ knowledge |
