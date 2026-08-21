---
status: Active
feature: US-017
updated: 2026-08-12
raw: docs/kb/ba/raw/US-017-sap-xep-danh-muc-keo-tha.md
spec: docs/features/US-017-sap-xep-danh-muc-keo-tha/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-017"]
---

# Source Record — US-017 Sắp xếp vị trí danh mục bằng kéo thả (Drag-and-drop row reordering)

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-017-sap-xep-danh-muc-keo-tha.md`](../../../raw/US-017-sap-xep-danh-muc-keo-tha.md) |
| Ngày ingest lần đầu | 2026-08-12 |
| Ngày ingest lần cuối | 2026-08-12 |
| Lý do ingest lại | Spec đã `Ready for DEV` (sync) — lần đầu là ingest ban đầu từ raw |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md`](../../knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md) | Tạo mới, sau đó cập nhật (sync) | Ingest: biên soạn từ raw + `DEC-074`..`DEC-077`. Sync: nâng `Active`, bổ sung `DEC-078`/`DEC-079`, cập nhật mục 7 Liên Kết Function |
| [`../../knowledge/feature-summary/US-017-sap-xep-danh-muc-keo-tha.md`](../../knowledge/feature-summary/US-017-sap-xep-danh-muc-keo-tha.md) | Tạo mới, sau đó cập nhật (sync) | Tóm tắt cho AI đọc nhanh |
| [`../../delivery/pbi/US-017-sap-xep-danh-muc-keo-tha.md`](../../delivery/pbi/US-017-sap-xep-danh-muc-keo-tha.md) | Tạo mới (rỗng), sau đó điền đầy đủ (sync) | Điền User Story và 8 AC từ spec `Ready for DEV` |
| [`../../knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md`](../../knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md) | Tạo mới, sau đó cập nhật (sync) | Ingest: rule mới, không có trang nào khớp ngữ nghĩa sẵn có. Sync: nâng `Active`, bổ sung hành vi Clone tháng vào mục 1, xóa nhãn `Cần user xác nhận` ở mục 4 (`DEC-078`) |
| [`../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md`](../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) | Cập nhật | Thêm dòng US-017 vào mục 2 (Áp Dụng Cho Function Nào) |
| [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | Cập nhật | Thêm dòng US-017 vào mục 3 (Function Sử Dụng) và `BR-020` vào mục 4 (Ràng Buộc) |
| [`../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Cập nhật | Ingest: thêm US-017 (`Draft`) vào mục 4. Sync: nâng trạng thái US-017 lên `Active` |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md`](../../knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md`](../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) | Business rule | Đã có sẵn — US-017 phải tôn trọng luật này, chỉ liên kết + cập nhật |
| [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | Entity | Đã có sẵn, chỉ liên kết + cập nhật |
| [`../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Đã có sẵn, chỉ liên kết (luồng F2) |
