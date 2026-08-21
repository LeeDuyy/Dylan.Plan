---
status: Active
feature: US-004
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-004"]
---

# US-004 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-004-sua-xoa-tung-giao-dich.md`](../feature/US-004-sua-xoa-tung-giao-dich.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Cho Dylan sửa đầy đủ 4 trường (nội dung, số tiền, danh mục, ngày) hoặc xóa (có xác nhận) một giao dịch chi tiêu thuộc tháng đang chọn, thay vì chỉ có "reset toàn bộ tháng". "Chi thực tế" của danh mục liên quan tính lại tự động sau mỗi lần sửa/xóa. Giá trị đo được: Dylan sửa được một giao dịch nhập sai mà không phải xóa sạch cả tháng để nhập lại.

## 2. Rule Cốt Lõi

- `BR-001` Sửa giao dịch cho phép đổi đầy đủ 4 trường
- `BR-002` Xóa giao dịch phải qua hộp xác nhận trước
- `BR-003` Chỉ cho sửa/xóa giao dịch của tháng đang chọn
- `BR-004` Ngày giao dịch khi sửa chỉ nhận giá trị ≤ hôm nay
- `BR-005` Không có tính năng khôi phục (undo) sau khi xóa

## 3. Phụ Thuộc Chính

- `US-001` Depends on — cần data model bền vững và "Chi thực tế" derived đã có sẵn
- `US-003` Depends on — cần giao dịch liên kết danh mục theo ID
