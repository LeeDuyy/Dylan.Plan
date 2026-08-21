---
status: Draft
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/indexes]
---

# Wiki Raw Index

> Manifest các nguồn raw đã được `ssr-ingest` biên soạn thành wiki dạng nested. Raw file gốc vẫn nằm ở `docs/kb/ba/raw/` — bảng này chỉ trỏ tới, không sao chép nội dung. US-002, US-003, US-004, US-005, US-006, US-010, US-012, US-014, US-015, US-016, US-017, US-018, US-019 và US-020 đã ingest vào cấu trúc nested; 5 US khác vẫn ở dạng phẳng, xem ghi chú mục 2. `US-013` đã gộp vào `US-006` (`DEC-065`), không có source record riêng.

## 1. Danh Sách Nguồn Raw

| Mã | Raw file | Source record | Ingest lần cuối |
| --- | --- | --- | --- |
| `US-002` | [`../../../raw/US-002-route-rieng-quan-ly-chi-tieu.md`](../../../raw/US-002-route-rieng-quan-ly-chi-tieu.md) | [`../ingestion/source-record/US-002-route-rieng-quan-ly-chi-tieu.md`](../ingestion/source-record/US-002-route-rieng-quan-ly-chi-tieu.md) | 2026-08-05 |
| `US-003` | [`../../../raw/US-003-lien-ket-giao-dich-theo-id.md`](../../../raw/US-003-lien-ket-giao-dich-theo-id.md) | [`../ingestion/source-record/US-003-lien-ket-giao-dich-theo-id.md`](../ingestion/source-record/US-003-lien-ket-giao-dich-theo-id.md) | 2026-08-05 |
| `US-004` | [`../../../raw/US-004-sua-xoa-tung-giao-dich.md`](../../../raw/US-004-sua-xoa-tung-giao-dich.md) | [`../ingestion/source-record/US-004-sua-xoa-tung-giao-dich.md`](../ingestion/source-record/US-004-sua-xoa-tung-giao-dich.md) | 2026-08-05 |
| `US-005` | [`../../../raw/US-005-rang-buoc-toan-ven-danh-muc.md`](../../../raw/US-005-rang-buoc-toan-ven-danh-muc.md) | [`../ingestion/source-record/US-005-rang-buoc-toan-ven-danh-muc.md`](../ingestion/source-record/US-005-rang-buoc-toan-ven-danh-muc.md) | 2026-08-06 |
| `US-006` | [`../../../raw/US-006-canh-bao-trung-thang.md`](../../../raw/US-006-canh-bao-trung-thang.md) | [`../ingestion/source-record/US-006-canh-bao-trung-thang.md`](../ingestion/source-record/US-006-canh-bao-trung-thang.md) | 2026-08-10 |
| `US-010` | [`../../../raw/US-010-chan-trung-ten-danh-muc.md`](../../../raw/US-010-chan-trung-ten-danh-muc.md) | [`../ingestion/source-record/US-010-chan-trung-ten-danh-muc.md`](../ingestion/source-record/US-010-chan-trung-ten-danh-muc.md) | 2026-08-10 |
| `US-012` | [`../../../raw/US-012-sua-loi-nhan-dien-danh-muc.md`](../../../raw/US-012-sua-loi-nhan-dien-danh-muc.md) | [`../ingestion/source-record/US-012-sua-loi-nhan-dien-danh-muc.md`](../ingestion/source-record/US-012-sua-loi-nhan-dien-danh-muc.md) | 2026-08-06 |
| `US-013` (gộp vào `US-006`) | [`../../../raw/US-013-khu-vuc-chon-thang-clone.md`](../../../raw/US-013-khu-vuc-chon-thang-clone.md) | Dùng chung [`../ingestion/source-record/US-006-canh-bao-trung-thang.md`](../ingestion/source-record/US-006-canh-bao-trung-thang.md) | 2026-08-10 |
| `US-014` | [`../../../raw/US-014-chi-tieu-khac-cuoi-bang.md`](../../../raw/US-014-chi-tieu-khac-cuoi-bang.md) | [`../ingestion/source-record/US-014-chi-tieu-khac-cuoi-bang.md`](../ingestion/source-record/US-014-chi-tieu-khac-cuoi-bang.md) | 2026-08-10 |
| `US-015` | [`../../../raw/US-015-quick-view-thang-lien-ke.md`](../../../raw/US-015-quick-view-thang-lien-ke.md) | [`../ingestion/source-record/US-015-quick-view-thang-lien-ke.md`](../ingestion/source-record/US-015-quick-view-thang-lien-ke.md) | 2026-08-11 |
| `US-016` | [`../../../raw/US-016-loai-chi-tieu-combobox.md`](../../../raw/US-016-loai-chi-tieu-combobox.md) | [`../ingestion/source-record/US-016-loai-chi-tieu-combobox.md`](../ingestion/source-record/US-016-loai-chi-tieu-combobox.md) | 2026-08-11 |
| `US-017` | [`../../../raw/US-017-sap-xep-danh-muc-keo-tha.md`](../../../raw/US-017-sap-xep-danh-muc-keo-tha.md) | [`../ingestion/source-record/US-017-sap-xep-danh-muc-keo-tha.md`](../ingestion/source-record/US-017-sap-xep-danh-muc-keo-tha.md) | 2026-08-12 |
| `US-018` | [`../../../raw/US-018-theo-doi-cv-ung-tuyen.md`](../../../raw/US-018-theo-doi-cv-ung-tuyen.md) | [`../ingestion/source-record/US-018-theo-doi-cv-ung-tuyen.md`](../ingestion/source-record/US-018-theo-doi-cv-ung-tuyen.md) | 2026-08-13 |
| `US-019` | [`../../../raw/US-019-danh-sach-can-mua.md`](../../../raw/US-019-danh-sach-can-mua.md) | [`../ingestion/source-record/US-019-danh-sach-can-mua.md`](../ingestion/source-record/US-019-danh-sach-can-mua.md) | 2026-08-14 |
| `US-020` | [`../../../raw/US-020-lich-su-trang-thai-job.md`](../../../raw/US-020-lich-su-trang-thai-job.md) | [`../ingestion/source-record/US-020-lich-su-trang-thai-job.md`](../ingestion/source-record/US-020-lich-su-trang-thai-job.md) | 2026-08-14 |

## 2. Trạng Thái Ingest

| Mã | Trạng thái | Ghi chú |
| --- | --- | --- |
| `US-002` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (5 AC), đã sync |
| `US-003` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (3 AC), đã sync — requirement đã triển khai thật cùng đợt US-001 |
| `US-004` | Đã ingest | Cấu trúc nested đầy đủ |
| `US-005` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (6 AC), đã sync |
| `US-006` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (7 AC — gồm 2 AC gộp từ US-013), đã sync |
| `US-010` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (7 AC), đã sync |
| `US-012` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (5 AC), đã sync |
| `US-013` | Gộp vào US-006 (`DEC-065`) | Không có trang nested riêng — nội dung nằm trong bộ trang của `US-006` |
| `US-014` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (5 AC), đã sync |
| `US-015` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (6 AC), đã sync |
| `US-016` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (8 AC), đã sync |
| `US-017` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (8 AC), đã sync |
| `US-018` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (11 AC), đã sync — không thuộc luồng F# nào của Business Flow hiện có, xác nhận qua `DEC-088` (trang Roadmap, ngoài phạm vi Hệ Thống Quản Lý Chi Tiêu) |
| `US-019` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (10 AC), đã sync — gắn `EPC-003` (F3), phục vụ mục tiêu mới `M3` (`DEC-105`), `po-expert` xác nhận `Aligned` sau 2 lượt |
| `US-020` | Đã ingest | Cấu trúc nested đầy đủ, spec `Ready for DEV` (9 AC), đã sync — mở rộng trực tiếp `US-018` (Depends on), không gắn epic, `po-expert` xác nhận `Aligned` áp dụng tiền lệ `DEC-088` |
| US-001, US-007, US-008, US-009, US-011 | Chưa ingest (dạng nested) | Có raw + trang wiki phẳng tại `docs/kb/ba/wiki/US-###-*.md`, chưa qua `ssr-ingest` cấu trúc nested — không chặn triển khai (US-001 đã Delivered dùng quy trình cũ), chỉ là nợ migrate |
