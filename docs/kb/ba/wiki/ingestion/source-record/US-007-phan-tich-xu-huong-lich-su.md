---
status: Active
feature: US-007
updated: 2026-08-21
raw: docs/kb/ba/raw/US-007-phan-tich-xu-huong-lich-su.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-007"]
---

# Source Record — US-007 Phân tích xu hướng trên toàn bộ lịch sử đã lưu

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-007-phan-tich-xu-huong-lich-su.md`](../../../raw/US-007-phan-tich-xu-huong-lich-su.md) |
| Ngày ingest lần đầu | 2026-08-21 |
| Ngày ingest lần cuối | 2026-08-21 |
| Lý do ingest lại | Spec đã Ready for DEV (sync) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-007-phan-tich-xu-huong-lich-su.md`](../../knowledge/feature/US-007-phan-tich-xu-huong-lich-su.md) | Tạo mới, sau đó sync | Nâng cấp từ trang phẳng cũ; sync → `Active`, thu hẹp đúng phạm vi biểu đồ Xu hướng (`DEC-110`) |
| [`../../knowledge/feature-summary/US-007-phan-tich-xu-huong-lich-su.md`](../../knowledge/feature-summary/US-007-phan-tich-xu-huong-lich-su.md) | Tạo mới, sau đó sync | — |
| [`../../delivery/pbi/US-007-phan-tich-xu-huong-lich-su.md`](../../delivery/pbi/US-007-phan-tich-xu-huong-lich-su.md) | Tạo mới, sau đó sync | Sync → 4 AC từ spec |
| [`../../knowledge/business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md`](../../knowledge/business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md) | Tạo mới, sau đó sync | Rule gốc của function này; sync → thu hẹp đúng phạm vi biểu đồ Xu hướng (`DEC-110`) |
| [`../../knowledge/epic/EPC-004-phan-tich-bao-cao-chi-tieu.md`](../../knowledge/epic/EPC-004-phan-tich-bao-cao-chi-tieu.md) | Tạo mới | Epic đầu tiên cho luồng F4, trước đây chưa có function nào ingest vào cấu trúc nested |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md`](../../knowledge/business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md) | Business rule | Tạo mới từ raw này |
| [`EPC-004-phan-tich-bao-cao-chi-tieu.md`](../../knowledge/epic/EPC-004-phan-tich-bao-cao-chi-tieu.md) | Epic | Tạo mới từ raw này (ánh xạ F4) |
| [`ENT-003-thang-ngan-sach.md`](../../data/entity/ENT-003-thang-ngan-sach.md) | Entity | Đã có sẵn, chỉ liên kết |
