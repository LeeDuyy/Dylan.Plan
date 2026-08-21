---
status: Active
feature: US-014
updated: 2026-08-10
raw: docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-014"]
---

# Source Record — US-014 Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md`](../../../raw/US-014-chi-tieu-khac-cuoi-bang.md) |
| Ngày ingest lần đầu | 2026-08-10 |
| Ngày ingest lần cuối | 2026-08-10 |
| Lý do ingest lại | Lần 1 (ingest, 2026-08-10): function mới, tạo bộ trang đầy đủ cho lần đầu. Lần 2 (sync, 2026-08-10): spec đã `Ready for DEV` (5 AC, sau 1 lượt dialog trong `ssr-ba` — `DEC-066` chốt phạm vi áp dụng 3 nơi và không sắp xếp lại danh mục khác; `po-expert` ban đầu `Needs Adjustment` về thứ tự ưu tiên với US-010, user quyết làm US-014 trước qua dialog — `DEC-067` — sau đó `po-expert` xác nhận `Aligned`) — nạp ngược vào `feature.md` (`Active`), `pbi.md` (đủ 5 AC), `BR-016` |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md`](../../knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md) | Tạo mới | `Status: Draft` |
| [`../../knowledge/feature-summary/US-014-chi-tieu-khac-cuoi-bang.md`](../../knowledge/feature-summary/US-014-chi-tieu-khac-cuoi-bang.md) | Tạo mới | Tóm tắt 1 đoạn |
| [`../../delivery/pbi/US-014-chi-tieu-khac-cuoi-bang.md`](../../delivery/pbi/US-014-chi-tieu-khac-cuoi-bang.md) | Tạo mới | Rỗng — chờ spec |
| [`../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md`](../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) | Tạo mới | Rule mới — chưa có trang nào khớp ngữ nghĩa về thứ tự hiển thị danh mục |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md`](../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) | Business rule | Tạo mới từ raw này |
| [`../../../../data/entity/ENT-002-danh-muc.md`](../../../../data/entity/ENT-002-danh-muc.md) | Entity | Đã có sẵn — liên kết thêm, không tạo mới |
| [`../../epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../../epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Gắn vào epic đã có của luồng F2 (Lập và điều chỉnh ngân sách theo danh mục), không tạo epic mới |

**Ghi chú phạm vi:** Không tìm thấy business-rule nào đã có khớp ngữ nghĩa về "thứ tự hiển thị danh mục" trong 15 rule hiện có (`BR-001`..`BR-015`) — mint mới `BR-016`. Raw không còn câu hỏi `Cần user xác nhận` (cả 2 câu ở mục 4 đã tự trả lời bằng "Giả định hợp lý") — `openItemsCount=0`.
