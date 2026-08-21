---
status: Active
feature: US-012
updated: 2026-08-06
raw: docs/kb/ba/raw/US-012-sua-loi-nhan-dien-danh-muc.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-012"]
---

# Source Record — US-012 Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-012-sua-loi-nhan-dien-danh-muc.md`](../../../raw/US-012-sua-loi-nhan-dien-danh-muc.md) |
| Ngày ingest lần đầu | 2026-08-06 |
| Ngày ingest lần cuối | 2026-08-06 |
| Lý do ingest lại | Lần 1 (ingest): tạo mới từ raw. Lần 2 (sync, cùng ngày): spec đã `Ready for DEV` (5 AC, sau 2 lượt dialog — `DEC-059` tại `ssr-po mode=review`, `DEC-060` tại `ssr-ba` — `po-expert` Aligned, `ba-expert` bổ sung AC-05) — nạp ngược vào `feature.md` (`Active`), `pbi.md` (đủ 5 AC) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md`](../../knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md) | Tạo mới, sau đó cập nhật | `Status: Draft` → `Active` sau khi sync |
| [`../../knowledge/feature-summary/US-012-sua-loi-nhan-dien-danh-muc.md`](../../knowledge/feature-summary/US-012-sua-loi-nhan-dien-danh-muc.md) | Tạo mới | Tóm tắt 1 đoạn |
| [`../../delivery/pbi/US-012-sua-loi-nhan-dien-danh-muc.md`](../../delivery/pbi/US-012-sua-loi-nhan-dien-danh-muc.md) | Tạo mới | Rỗng — chờ sync sau khi spec `Ready for DEV` |
| [`../../knowledge/epic/EPC-001-ghi-nhan-chi-tieu.md`](../../knowledge/epic/EPC-001-ghi-nhan-chi-tieu.md) | Cập nhật | Thêm US-012 vào danh sách feature của epic (thuộc F1) |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-013-so-khop-gan-dung-danh-muc.md`](../../knowledge/business-rule/BR-013-so-khop-gan-dung-danh-muc.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-011-bo-qua-danh-muc.md`](../../knowledge/business-rule/BR-011-bo-qua-danh-muc.md) | Business rule | Đã có sẵn (từ US-005), chỉ liên kết — BR-013 là bước xảy ra ngay trước khi rơi vào nhánh của BR-011 |
| [`../../../../data/entity/ENT-002-danh-muc.md`](../../../../data/entity/ENT-002-danh-muc.md) | Entity | Đã có sẵn (từ US-005), chỉ liên kết — không đổi cấu trúc `Category` |

**Ghi chú phạm vi:** Không mint entity/concept mới — requirement này là defect fix trên hành vi đã có (F1 bước 1, nhận diện danh mục), dùng lại `ENT-002-danh-muc` và bổ sung đúng một business rule mới (`BR-013`) mô tả bước so khớp gần đúng còn thiếu.
