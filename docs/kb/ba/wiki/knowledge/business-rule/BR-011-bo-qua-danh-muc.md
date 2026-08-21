---
status: Active
updated: 2026-08-06
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-011"]
---

# BR-011 — Ghi nhận chi tiêu cho phép bỏ qua chọn danh mục, tự động vào "Chi tiêu khác"

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi ghi nhận một giao dịch chi tiêu, Dylan không bắt buộc phải chọn danh mục (dù nội dung không khớp từ khóa nào hay Dylan chủ động bỏ qua). Giao dịch được ghi nhận mà không có danh mục sẽ tự động gán vào "Chi tiêu khác" — kích hoạt sinh danh mục này nếu tháng đang chọn chưa có.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-005`](../feature/US-005-rang-buoc-toan-ven-danh-muc.md) | Bước xác nhận danh mục khi ghi nhận giao dịch |
| [`US-012`](../feature/US-012-sua-loi-nhan-dien-danh-muc.md) | Nhánh cuối cùng khi `BR-013` (so khớp gần đúng) cũng không tìm ra danh mục nào |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định nới F1 cho bỏ qua chọn danh mục | `docs/memory/decisions.md#dec-028` | Đã xác nhận từ knowledge |
