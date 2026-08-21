---
status: Active
feature: US-005
updated: 2026-08-06
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-005"]
---

# US-005 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-005-rang-buoc-toan-ven-danh-muc.md`](../feature/US-005-rang-buoc-toan-ven-danh-muc.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Xóa danh mục thường có giao dịch → chuyển giao dịch sang "Chi tiêu khác" (tự sinh khi cần), toast báo rõ số giao dịch. Ghi nhận chi tiêu không khớp từ khóa danh mục nào → ô chọn danh mục tự để trống, Ghi nhận thẳng không cần xác nhận, giao dịch vào "Chi tiêu khác". "Chi tiêu khác" khóa vĩnh viễn, chỉ đọc, chỉ hiện khi còn giao dịch, Loại "Linh hoạt", Ngân sách 0đ. Giá trị đo được: không giao dịch nào mất liên kết danh mục hay bị mất khi xóa danh mục.

## 2. Rule Cốt Lõi

- `BR-008` Xóa danh mục thường chuyển giao dịch sang "Chi tiêu khác"
- `BR-009` "Chi tiêu khác" chỉ tự sinh khi cần
- `BR-010` "Chi tiêu khác" khóa vĩnh viễn, chỉ xem
- `BR-011` Ghi nhận cho phép bỏ qua danh mục
- `BR-012` "Chi tiêu khác" ẩn khi hết giao dịch, không xóa bản ghi

## 3. Phụ Thuộc Chính

- `US-001` Depends on — cần data model bền vững
- `US-003` Depends on — cần liên kết theo ID
- `US-004` Impacts — sửa/xóa giao dịch có thể kích hoạt ẩn "Chi tiêu khác"
