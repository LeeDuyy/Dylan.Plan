---
status: Active
feature: US-010
updated: 2026-08-10
raw: docs/kb/ba/raw/US-010-chan-trung-ten-danh-muc.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-010"]
---

# Source Record — US-010 Chặn trùng tên danh mục

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-010-chan-trung-ten-danh-muc.md`](../../../raw/US-010-chan-trung-ten-danh-muc.md) |
| Ngày ingest lần đầu | 2026-08-10 |
| Ngày ingest lần cuối | 2026-08-10 |
| Lý do ingest lại | Spec đã `Ready for DEV` (sync) — lần đầu là migrate sang cấu trúc nested (trang phẳng cũ `docs/kb/ba/wiki/US-010-chan-trung-ten-danh-muc.md` đã lỗi thời) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-010-chan-trung-ten-danh-muc.md`](../../knowledge/feature/US-010-chan-trung-ten-danh-muc.md) | Tạo mới, sau đó cập nhật (sync) | Ingest: biên soạn từ raw + `DEC-020/021/022/027`. Sync: nâng `Active`, bổ sung `DEC-068/069` |
| [`../../knowledge/feature-summary/US-010-chan-trung-ten-danh-muc.md`](../../knowledge/feature-summary/US-010-chan-trung-ten-danh-muc.md) | Tạo mới, sau đó cập nhật (sync) | Tóm tắt cho AI đọc nhanh |
| [`../../delivery/pbi/US-010-chan-trung-ten-danh-muc.md`](../../delivery/pbi/US-010-chan-trung-ten-danh-muc.md) | Tạo mới (rỗng), sau đó điền đầy đủ (sync) | Điền User Story và 7 AC từ spec `Ready for DEV` |
| [`../../knowledge/business-rule/BR-017-chan-trung-ten-danh-muc.md`](../../knowledge/business-rule/BR-017-chan-trung-ten-danh-muc.md) | Tạo mới, sau đó cập nhật (sync) | Ingest: gộp `DEC-020/021/022`, ngoại lệ `DEC-027`. Sync: bổ sung `DEC-068` (áp cho tên mặc định), `DEC-069` (rút gọn khoảng trắng giữa) |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-017-chan-trung-ten-danh-muc.md`](../../knowledge/business-rule/BR-017-chan-trung-ten-danh-muc.md) | Business rule | Tạo mới từ raw này |
| [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | Entity | Đã có sẵn, chỉ liên kết |
| [`../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Đã có sẵn, chỉ liên kết (luồng F2) |
