---
status: Active
feature: US-016
updated: 2026-08-11
raw: docs/kb/ba/raw/US-016-loai-chi-tieu-combobox.md
spec: docs/features/US-016-loai-chi-tieu-combobox/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-016"]
---

# Source Record — US-016 Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-016-loai-chi-tieu-combobox.md`](../../../raw/US-016-loai-chi-tieu-combobox.md) |
| Ngày ingest lần đầu | 2026-08-11 |
| Ngày ingest lần cuối | 2026-08-11 |
| Lý do ingest lại | Spec đã `Ready for DEV` (sync) — lần đầu là ingest ban đầu từ raw |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-016-loai-chi-tieu-combobox.md`](../../knowledge/feature/US-016-loai-chi-tieu-combobox.md) | Tạo mới, sau đó cập nhật (sync) | Ingest: biên soạn từ raw + `DEC-073`. Sync: nâng `Active`, bổ sung ngoại lệ lỗi lưu vào mục 4 |
| [`../../knowledge/feature-summary/US-016-loai-chi-tieu-combobox.md`](../../knowledge/feature-summary/US-016-loai-chi-tieu-combobox.md) | Tạo mới, sau đó cập nhật (sync) | Tóm tắt cho AI đọc nhanh |
| [`../../delivery/pbi/US-016-loai-chi-tieu-combobox.md`](../../delivery/pbi/US-016-loai-chi-tieu-combobox.md) | Tạo mới (rỗng), sau đó điền đầy đủ (sync) | Điền User Story và 8 AC từ spec `Ready for DEV` |
| [`../../knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md`](../../knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md) | Tạo mới | Rule mới — giới hạn "Loại" đúng 3 giá trị cố định, không có trang nào khớp ngữ nghĩa sẵn có |
| [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | Cập nhật | Thêm dòng US-016 vào mục 3 (Function Sử Dụng) và `BR-019` vào mục 4 (Ràng Buộc) |
| [`../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Cập nhật | Ingest: thêm US-016 (`Draft`) vào mục 4. Sync: nâng trạng thái US-016 lên `Active` |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md`](../../knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md) | Business rule | Tạo mới từ raw này |
| [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | Entity | Đã có sẵn, chỉ liên kết + cập nhật |
| [`../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Đã có sẵn, chỉ liên kết (luồng F2) |
| [`../../knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md`](../../knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md) | Business rule | Đã có sẵn — US-016 đổi giá trị Loại mặc định mà rule này gán khi tự sinh "Chi tiêu khác" |
