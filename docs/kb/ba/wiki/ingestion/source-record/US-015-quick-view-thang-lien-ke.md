---
status: Active
feature: US-015
updated: 2026-08-11
raw: docs/kb/ba/raw/US-015-quick-view-thang-lien-ke.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-015"]
---

# Source Record — US-015 Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`../../../raw/US-015-quick-view-thang-lien-ke.md`](../../../raw/US-015-quick-view-thang-lien-ke.md) |
| Ngày ingest lần đầu | 2026-08-11 |
| Ngày ingest lần cuối | 2026-08-11 |
| Lý do ingest lại | Spec đã Ready for DEV (sync) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-015-quick-view-thang-lien-ke.md`](../../knowledge/feature/US-015-quick-view-thang-lien-ke.md) | Tạo mới, sau đó cập nhật (sync) | Feature `Active`, thuộc epic `EPC-003` (F3) |
| [`../../knowledge/feature-summary/US-015-quick-view-thang-lien-ke.md`](../../knowledge/feature-summary/US-015-quick-view-thang-lien-ke.md) | Tạo mới, sau đó cập nhật (sync) | — |
| [`../../delivery/pbi/US-015-quick-view-thang-lien-ke.md`](../../delivery/pbi/US-015-quick-view-thang-lien-ke.md) | Tạo mới (rỗng), sau đó cập nhật (sync) | Đã điền đủ 6 AC từ spec `Ready for DEV` |
| [`../../knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md`](../../knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md) | Cập nhật | Thêm `US-015` vào mục 4 Danh Sách Feature |
| [`../../knowledge/business-rule/BR-018-quick-view-3-the-thang.md`](../../knowledge/business-rule/BR-018-quick-view-3-the-thang.md) | Tạo mới | Rule mới — chưa có trang nào mô tả giới hạn hiển thị thẻ tháng quick view |
| [`../../../data/entity/ENT-003-thang-ngan-sach.md`](../../../data/entity/ENT-003-thang-ngan-sach.md) | Cập nhật | Thêm `US-015` vào mục 3 Function Sử Dụng |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md`](../../knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md) | Epic | Đã có sẵn, chỉ liên kết — F3 |
| [`../../../data/entity/ENT-003-thang-ngan-sach.md`](../../../data/entity/ENT-003-thang-ngan-sach.md) | Entity | Đã có sẵn, chỉ liên kết — không đổi cấu trúc, chỉ đổi cách hiển thị danh sách tháng |
| [`../../knowledge/business-rule/BR-018-quick-view-3-the-thang.md`](../../knowledge/business-rule/BR-018-quick-view-3-the-thang.md) | Business rule | Tạo mới từ raw này |
