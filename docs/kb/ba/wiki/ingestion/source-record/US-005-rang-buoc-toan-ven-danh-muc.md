---
status: Active
updated: 2026-08-06
feature: US-005
raw: docs/kb/ba/raw/US-005-rang-buoc-toan-ven-danh-muc.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-005"]
---

# Source Record — US-005 Ràng buộc toàn vẹn danh mục + giao dịch không danh mục

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-005-rang-buoc-toan-ven-danh-muc.md`](../../../raw/US-005-rang-buoc-toan-ven-danh-muc.md) |
| Ngày ingest lần đầu | 2026-08-03 (dạng phẳng, trước khi có cấu trúc nested) |
| Ngày ingest lần cuối | 2026-08-06 (sync sau khi spec đạt `Ready for DEV`) |
| Lý do ingest lại | Lần 1 (ingest): migrate từ trang wiki phẳng sang cấu trúc nested. Lần 2 (sync, cùng ngày): spec đã `Ready for DEV` (6 AC, sau 1 lượt dialog 3 câu — `DEC-054`..`DEC-057`, `po-expert` Aligned, `ba-expert` xác nhận khớp source thật) — nạp ngược vào `feature.md` (`Active`), `pbi.md` (đủ 6 AC). Lần 3 (sync, `ssr-pipeline` rà soát lại trước stage `plan`): `ba-expert` bổ sung `US-004` vào mục 10 Phụ Thuộc của spec (AC-05 dùng thao tác xóa giao dịch của `US-004`) — đồng bộ thêm dòng này vào `pbi.md` mục 4 và `feature.md` mục 7 |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md`](../../knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md) | Tạo mới (nested) | Nội dung kế thừa từ trang phẳng cũ, bổ sung mục 4 Luồng Nghiệp Vụ từ Business Flow F1/F2 |
| [`../../knowledge/feature-summary/US-005-rang-buoc-toan-ven-danh-muc.md`](../../knowledge/feature-summary/US-005-rang-buoc-toan-ven-danh-muc.md) | Tạo mới | Tóm tắt 1 đoạn |
| [`../../delivery/pbi/US-005-rang-buoc-toan-ven-danh-muc.md`](../../delivery/pbi/US-005-rang-buoc-toan-ven-danh-muc.md) | Tạo mới | Rỗng — chờ sync sau khi spec Ready for DEV |
| [`../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Tạo mới | Epic cho luồng F2, ánh xạ từ Business Flow — lần đầu F2 có epic trong cấu trúc nested |
| [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | Tạo mới | Entity Danh mục, model Prisma `Category` đã có từ US-001 |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-008-xoa-chuyen-chi-tieu-khac.md`](../../knowledge/business-rule/BR-008-xoa-chuyen-chi-tieu-khac.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md`](../../knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md`](../../knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-011-bo-qua-danh-muc.md`](../../knowledge/business-rule/BR-011-bo-qua-danh-muc.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-012-an-khi-het-giao-dich.md`](../../knowledge/business-rule/BR-012-an-khi-het-giao-dich.md) | Business rule | Tạo mới từ raw này |

**Ghi chú phạm vi:** Mint `EPC-002` cho luồng F2 vì đây là function nested đầu tiên thuộc F2 (trước đó chỉ có ghi chú "chưa có" ở `epic-index.md` mục 2). `ENT-002-danh-muc` tạo mới vì chưa có trang entity nào cho `Category` (chỉ có `ENT-001-giao-dich`).
