---
status: Draft
feature: US-009
updated: 2026-08-22
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-009"]
---

# US-009 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-009-cau-hinh-nguong-ngan-sach.md`](../feature/US-009-cau-hinh-nguong-ngan-sach.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Cho Dylan tự đổi ba ngưỡng ngân sách (cảnh báo vượt, mục tiêu tổng chi, quỹ linh hoạt) cho từng tháng thay vì cố định trong code. Dành cho Dylan, giá trị đo được là ba ngưỡng đổi được và áp dụng đúng ngay trên giao diện.

## 2. Rule Cốt Lõi

- `BR-030` Ba ngưỡng ngân sách cấu hình được theo từng tháng, kế thừa tháng gần nhất khi tạo tháng mới

## 3. Phụ Thuộc Chính

- `US-001` Depends on — cần dữ liệu tháng ngân sách bền vững
- `US-006` Depends on — dùng chung luồng tạo tháng mới
