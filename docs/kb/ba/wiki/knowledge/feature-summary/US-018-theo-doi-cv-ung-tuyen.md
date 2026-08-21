---
status: Active
feature: US-018
updated: 2026-08-13
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-018"]
---

# US-018 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-018-theo-doi-cv-ung-tuyen.md`](../feature/US-018-theo-doi-cv-ung-tuyen.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Bảng "Theo dõi CV ứng tuyển" trên trang Roadmap, cho Dylan thêm/sửa inline/xóa job đang quan tâm (Công ty, Ngày hết hạn, Platform, Link, Trạng thái, Ghi chú), lưu bền vững qua database. Platform là combobox Dylan tự thêm/xóa option; bảng cho sắp xếp theo cột bất kỳ. Độc lập với Business Flow "Hệ Thống Quản Lý Chi Tiêu" (`DEC-088`). Spec `Ready for DEV`, 11 AC.

## 2. Rule Cốt Lõi

- `BR-021` Chặn xóa option Platform đang được ít nhất một job sử dụng.

## 3. Phụ Thuộc Chính

- Không có function nào phụ thuộc hoặc bị US-018 tác động — độc lập với luồng F1-F4 của Hệ Thống Quản Lý Chi Tiêu.
