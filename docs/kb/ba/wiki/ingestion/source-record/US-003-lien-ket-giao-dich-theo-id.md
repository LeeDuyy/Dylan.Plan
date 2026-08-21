---
status: Active
updated: 2026-08-05
feature: US-003
raw: docs/kb/ba/raw/US-003-lien-ket-giao-dich-theo-id.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-003"]
---

# Source Record — US-003 Liên kết giao dịch theo danh mục bằng ID

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-003-lien-ket-giao-dich-theo-id.md`](../../../raw/US-003-lien-ket-giao-dich-theo-id.md) |
| Ngày ingest lần đầu | 2026-08-03 (dạng phẳng, trước khi có cấu trúc nested) |
| Ngày ingest lần cuối | 2026-08-05 (sync sau khi spec đạt `Ready for DEV`) |
| Lý do ingest lại | Lần 1 (ingest): migrate từ trang wiki phẳng sang cấu trúc nested để `ssr-ba` tổng hợp spec riêng — requirement đã triển khai thật cùng đợt `US-001`. Lần 2 (sync, cùng ngày): spec đã `Ready for DEV` (3 AC, `po-expert` Aligned, `ba-expert` xác nhận khớp source thật) — nạp ngược vào `feature.md` (`Active`), `pbi.md` (đủ 3 AC) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md`](../../knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md) | Tạo mới (nested) | Nội dung kế thừa từ trang phẳng cũ, ghi rõ provenance đã triển khai thật từ trước |
| [`../../knowledge/feature-summary/US-003-lien-ket-giao-dich-theo-id.md`](../../knowledge/feature-summary/US-003-lien-ket-giao-dich-theo-id.md) | Tạo mới | Tóm tắt 1 đoạn |
| [`../../delivery/pbi/US-003-lien-ket-giao-dich-theo-id.md`](../../delivery/pbi/US-003-lien-ket-giao-dich-theo-id.md) | Tạo mới | Rỗng — chờ sync sau khi spec Ready for DEV |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-007-danh-muc-theo-id.md`](../../knowledge/business-rule/BR-007-danh-muc-theo-id.md) | Business rule | Tạo mới từ raw này (mint ID kế tiếp sau `BR-006`) |
| [`../../data/entity/ENT-001-giao-dich.md`](../../data/entity/ENT-001-giao-dich.md) | Entity | Đã có sẵn (từ US-004) — cập nhật mục 4 (Ràng buộc) để trỏ tới `BR-007` thay vì trích dẫn trực tiếp `data-model.md` |

**Ghi chú phạm vi:** Gắn `US-003` vào `EPC-001` (F1) giống `US-004`, dù raw ghi ảnh hưởng cả F1 và F2 — F2 chưa có epic riêng trong cấu trúc nested (xem `epic-index.md` mục 2).
