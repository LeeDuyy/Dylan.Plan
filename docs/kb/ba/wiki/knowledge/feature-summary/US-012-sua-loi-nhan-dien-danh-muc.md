---
status: Active
feature: US-012
updated: 2026-08-06
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-012"]
---

# US-012 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-012-sua-loi-nhan-dien-danh-muc.md`](../feature/US-012-sua-loi-nhan-dien-danh-muc.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Khi nội dung nhập nhanh khớp từ khóa của một nhóm chi tiêu nhưng danh mục thật đã bị Dylan đổi tên, hệ thống hiện âm thầm không ghi nhận gì — một defect mất dữ liệu. Sửa để thử so khớp gần đúng trước (giữ đúng ý định phân loại), không tìm được thì rơi về "Chi tiêu khác" như đã có từ US-005 — không bao giờ mất giao dịch trong im lặng.

## 2. Rule Cốt Lõi

- `BR-013` So khớp gần đúng trước khi coi là không xác định được danh mục; nhiều kết quả khớp thì lấy cái đầu theo thứ tự hiển thị
- `BR-011` Không xác định được thì tự vào "Chi tiêu khác" (dùng lại từ US-005)

## 3. Phụ Thuộc Chính

- `US-005` Depends on — dùng lại cơ chế tự sinh "Chi tiêu khác"
- `US-001` Depends on — cần data model bền vững
