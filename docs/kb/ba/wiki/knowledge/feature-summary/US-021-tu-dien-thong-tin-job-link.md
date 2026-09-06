---
status: Active
feature: US-021
updated: 2026-08-28
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-021"]
---

# US-021 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-021-tu-dien-thong-tin-job-link.md`](../feature/US-021-tu-dien-thong-tin-job-link.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

`US-021` mở rộng bảng "Theo dõi CV ứng tuyển" (`US-018`) trên trang Roadmap. Khi Dylan dán đường dẫn tin tuyển dụng vào ô Link của một dòng job và rời khỏi ô — với điều kiện giá trị Link vừa thay đổi — hệ thống tự truy cập đường dẫn một lần (chờ ~10 giây) và điền Công ty, Platform (suy từ tên miền — chứa tên kênh), Ngày hết hạn (khi trang ghi ngày đầy đủ) vào các ô đang trống; không ghi đè ô Dylan đã nhập. Đọc thất bại hoặc thiếu trường thì báo nhẹ và vẫn cho lưu job. Máy chủ tự đọc, không gửi dữ liệu ra ngoài. Spec `Ready for DEV`, 8 AC, `po-expert` Aligned. Giữ ngoài Business Flow (`DEC-111`).

## 2. Rule Cốt Lõi

- `BR-031` Tự điền Công ty/Platform/Ngày hết hạn từ link khi giá trị ô Link đổi; chỉ điền ô trống; không chặn lưu khi thiếu; chờ ~10 giây.
- `BR-032` Suy Platform từ tên miền — tên miền chứa tên kênh (không phân biệt hoa/thường); không khớp hoặc khớp nhiều kênh thì để trống + báo nhẹ; không tự tạo kênh, không nhãn "Khác".

## 3. Phụ Thuộc Chính

- `US-018` Depends on — mở rộng trực tiếp bảng và các ô job đã có; giữ nguyên validate Link, trường bắt buộc, sửa inline.
- `US-020` Impacts — Ngày hết hạn tự điền là đầu vào luật `BR-025` (tự chuyển "Expired"); ngày quá khứ vẫn điền là có chủ đích (`DEC-126`).
- `DEC-119` (Ngày hết hạn không bắt buộc) — spec viết trên nền này; code đã xong, chưa commit.
