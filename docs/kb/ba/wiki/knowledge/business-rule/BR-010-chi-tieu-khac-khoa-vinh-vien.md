---
status: Active
updated: 2026-08-06
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-010"]
---

# BR-010 — "Chi tiêu khác" bị khóa vĩnh viễn, chỉ xem, không cho sửa hay xóa

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Danh mục "Chi tiêu khác" luôn ở chế độ chỉ xem đối với Dylan — không cho xóa (bất kể còn hay hết giao dịch), không cho sửa tên, loại hay ngân sách trực tiếp trên bảng danh mục như các danh mục thường khác.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-005`](../feature/US-005-rang-buoc-toan-ven-danh-muc.md) | Dòng "Chi tiêu khác" trong bảng ngân sách theo danh mục — ẩn nút xóa, ẩn ô nhập tên/loại/ngân sách |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định khóa vĩnh viễn (đảo `DEC-025`) | `docs/memory/decisions.md#dec-027` | Đã xác nhận từ knowledge |
