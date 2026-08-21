---
status: Active
feature: US-003
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-003"]
---

# US-003 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-003-lien-ket-giao-dich-theo-id.md`](../feature/US-003-lien-ket-giao-dich-theo-id.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Giao dịch chi tiêu gắn với danh mục qua mã nhận diện cố định thay vì tên hiển thị, để đổi tên danh mục không làm lệch/mất liên kết giao dịch đã ghi trước đó. Đã triển khai thật cùng đợt `US-001` (khóa `Transaction.categoryId`); spec/wiki riêng chỉ tổng hợp lại artifact, không xây mới. Giá trị đo được: sau khi đổi tên một danh mục, giao dịch cũ vẫn cộng đúng vào "Chi thực tế" dưới tên mới.

## 2. Rule Cốt Lõi

- `BR-007` Giao dịch liên kết danh mục qua mã nhận diện cố định, không theo tên hiển thị

## 3. Phụ Thuộc Chính

- `US-001` Depends on (song song) — cùng thiết kế data model, triển khai chung một đợt
- `US-004` Impacts — sửa danh mục của một giao dịch dựa trên đúng cơ chế liên kết này
