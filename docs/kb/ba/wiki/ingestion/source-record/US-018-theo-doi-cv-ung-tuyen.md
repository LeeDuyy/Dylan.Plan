---
status: Active
feature: US-018
updated: 2026-08-13
raw: docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-018"]
---

# Source Record — US-018 Bảng theo dõi CV ứng tuyển tại trang Roadmap

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md`](../../../raw/US-018-theo-doi-cv-ung-tuyen.md) |
| Ngày ingest lần đầu | 2026-08-13 |
| Ngày ingest lần cuối | 2026-08-13 |
| Lý do ingest lại | Spec đã `Ready for DEV` (sync) — `po-expert` xác nhận `Aligned` sau khi user chốt `DEC-088` (US-018 là tiện ích cá nhân tách biệt, không thuộc Business Flow) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md`](../knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md) | Cập nhật | `Status: Draft` → `Active`, nội dung nạp từ spec `Ready for DEV` |
| [`../knowledge/feature-summary/US-018-theo-doi-cv-ung-tuyen.md`](../knowledge/feature-summary/US-018-theo-doi-cv-ung-tuyen.md) | Cập nhật | Tóm tắt khớp `feature.md` mới |
| [`../delivery/pbi/US-018-theo-doi-cv-ung-tuyen.md`](../delivery/pbi/US-018-theo-doi-cv-ung-tuyen.md) | Cập nhật | Điền đầy đủ User Story + 11 AC từ spec mục 7 |
| [`../data/entity/ENT-004-job-ung-tuyen.md`](../data/entity/ENT-004-job-ung-tuyen.md) | Không đổi | Entity vẫn chưa có model Prisma — chờ `ssr-data` |
| [`../data/entity/ENT-005-platform-tuyen-dung.md`](../data/entity/ENT-005-platform-tuyen-dung.md) | Không đổi | Entity vẫn chưa có model Prisma — chờ `ssr-data` |
| [`../knowledge/business-rule/BR-021-chan-xoa-platform-dang-dung.md`](../knowledge/business-rule/BR-021-chan-xoa-platform-dang-dung.md) | Không đổi | Nội dung rule không đổi so với lượt ingest đầu |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`ENT-004-job-ung-tuyen.md`](../data/entity/ENT-004-job-ung-tuyen.md) | Entity | Tạo mới từ raw này |
| [`ENT-005-platform-tuyen-dung.md`](../data/entity/ENT-005-platform-tuyen-dung.md) | Entity | Tạo mới từ raw này |
| [`BR-021-chan-xoa-platform-dang-dung.md`](../knowledge/business-rule/BR-021-chan-xoa-platform-dang-dung.md) | Business rule | Tạo mới từ raw này |
| [`BR-019-loai-danh-muc-combobox-co-dinh.md`](../knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md) | Business rule | Đã có sẵn — chỉ liên kết để đối chiếu (combobox cố định vs combobox động của US-018) |

Không tìm thấy luồng F# nào trong `docs/kb/ba/business-flow.md` chứa US-018 — Business Flow hiện tại chỉ phạm vi "Hệ Thống Quản Lý Chi Tiêu" (F1-F4), không bao gồm trang Roadmap. Không gắn epic, không tự bịa; ghi lý do trong `feature.md` mục 9.
