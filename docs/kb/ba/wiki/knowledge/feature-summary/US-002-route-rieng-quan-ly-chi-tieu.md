---
status: Active
feature: US-002
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-002"]
---

# US-002 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-002-route-rieng-quan-ly-chi-tieu.md`](../feature/US-002-route-rieng-quan-ly-chi-tieu.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Tách khu vực Thu chi ra địa chỉ trang riêng `/budget`, độc lập điều hướng khỏi các mục khác của Dylan Plan Dashboard (Roadmap, Freelance, Sản phẩm), dùng chung codebase Next.js hiện tại. Nav "Thu chi" và nút "Nhập thu chi" trên trang chủ đổi thành liên kết sang `/budget`; "Tổng quan" không còn hiển thị nội dung Thu chi (kể cả thẻ "Còn lại tháng này"); `/budget` có liên kết quay lại trang chủ và vào được trực tiếp không cần qua trang chủ trước. Giá trị đo được: có địa chỉ trang riêng, điều hướng độc lập trong cùng dự án Next.js.

## 2. Rule Cốt Lõi

- `BR-006` Module Quản lý chi tiêu có route riêng `/budget`, tách khỏi shell chung, dùng chung codebase

## 3. Phụ Thuộc Chính

- `US-001` Related only — nội dung bên trong `/budget` phụ thuộc dữ liệu bền vững của US-001 để hoàn chỉnh, nhưng route tự nó không chặn triển khai
- `US-004` Related only — mô tả vị trí màn hình trong spec US-004 cần cập nhật sau khi US-002 triển khai (follow-up, không chặn)
