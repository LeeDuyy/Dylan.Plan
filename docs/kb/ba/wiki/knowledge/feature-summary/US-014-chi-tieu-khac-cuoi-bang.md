---
status: Active
feature: US-014
updated: 2026-08-10
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-014"]
---

# US-014 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-014-chi-tieu-khac-cuoi-bang.md`](../feature/US-014-chi-tieu-khac-cuoi-bang.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Danh mục "Chi tiêu khác" hiện hiển thị theo đúng thứ tự tạo ra trong dữ liệu (do sinh lười biếng), nên vị trí trong bảng danh mục không cố định — có thể không ở cuối nếu Dylan thêm danh mục mới sau đó. Function này đưa "Chi tiêu khác" (khi đang hiển thị) luôn xuống cuối danh sách, áp dụng nhất quán ở mọi nơi dùng chung danh sách danh mục (bảng ngân sách, ô chọn danh mục nhập nhanh, biểu đồ cơ cấu chi tiêu); các danh mục còn lại giữ nguyên thứ tự tương đối.

## 2. Rule Cốt Lõi

- `BR-016` "Chi tiêu khác" (khi đang hiển thị) luôn ở cuối danh sách danh mục

## 3. Phụ Thuộc Chính

- `US-005` Related only — đã định nghĩa hành vi sinh/ẩn-hiện "Chi tiêu khác", US-014 chỉ đổi thứ tự hiển thị
