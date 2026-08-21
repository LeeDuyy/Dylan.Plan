---
status: Active
updated: 2026-08-05
feature: US-002
raw: docs/kb/ba/raw/US-002-route-rieng-quan-ly-chi-tieu.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-002"]
---

# Source Record — US-002 Route/module riêng cho Quản lý chi tiêu

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-002-route-rieng-quan-ly-chi-tieu.md`](../../../raw/US-002-route-rieng-quan-ly-chi-tieu.md) |
| Ngày ingest lần đầu | 2026-08-03 (dạng phẳng, trước khi có cấu trúc nested) |
| Ngày ingest lần cuối | 2026-08-05 (sync sau khi spec đạt `Ready for DEV`) |
| Lý do ingest lại | Lần 1 (ingest): migrate từ trang wiki phẳng sang cấu trúc nested, chuẩn bị cho `ssr-ba` tổng hợp spec. Lần 2 (sync, cùng ngày): spec đã `Ready for DEV` (5 AC, sau 2 lượt dialog với user — 3 câu ban đầu + 1 câu do `ba-expert` phát hiện mâu thuẫn) — nạp ngược vào `feature.md` (`Active`), `pbi.md` (đủ 5 AC) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-002-route-rieng-quan-ly-chi-tieu.md`](../../knowledge/feature/US-002-route-rieng-quan-ly-chi-tieu.md) | Tạo mới (nested), rồi sync → `Active` | Nội dung kế thừa từ trang phẳng cũ, bổ sung mục 4 Luồng Nghiệp Vụ và Liên Kết Function (`US-004`) sau sync |
| [`../../knowledge/feature-summary/US-002-route-rieng-quan-ly-chi-tieu.md`](../../knowledge/feature-summary/US-002-route-rieng-quan-ly-chi-tieu.md) | Tạo mới, rồi sync | Tóm tắt 1 đoạn |
| [`../../delivery/pbi/US-002-route-rieng-quan-ly-chi-tieu.md`](../../delivery/pbi/US-002-route-rieng-quan-ly-chi-tieu.md) | Tạo rỗng, rồi sync đủ 5 AC | — |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-006-route-budget.md`](../../knowledge/business-rule/BR-006-route-budget.md) | Business rule | Tạo mới từ raw này (mint ID kế tiếp sau `BR-005`) |

**Ghi chú phạm vi:** Không tạo epic mới. US-002 là hạ tầng route/điều hướng dùng chung cho cả 4 luồng (F1-F4), không khớp mô hình ánh xạ 1:1 epic↔luồng hiện tại (chỉ `EPC-001` cho F1 đã tồn tại) — xem mục 9 của `feature.md`. Trong quá trình viết spec, `ssr-ba` mở 2 lượt dialog với user: lượt 1 chốt 3 điểm điều hướng (`DEC-049`, `DEC-050`, `DEC-051`); lượt 2 chốt 1 điểm do `ba-expert` phát hiện mâu thuẫn giữa `DEC-050` và bản nháp spec (`DEC-052` — bỏ thẻ "Còn lại tháng này" khỏi Tổng quan).
