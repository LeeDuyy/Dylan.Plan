---
status: Active
feature: US-020
updated: 2026-08-14
raw: docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-020"]
---

# Source Record — US-020 Lịch sử thay đổi trạng thái job ứng tuyển

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`../../../raw/US-020-lich-su-trang-thai-job.md`](../../../raw/US-020-lich-su-trang-thai-job.md) |
| Ngày ingest lần đầu | 2026-08-14 |
| Ngày ingest lần cuối | 2026-08-14 |
| Lý do ingest lại | Spec đã `Ready for DEV` (sync) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../knowledge/feature/US-020-lich-su-trang-thai-job.md`](../knowledge/feature/US-020-lich-su-trang-thai-job.md) | Tạo mới, sau đó cập nhật (sync) | `Status: Draft` → `Active`; mở rộng nghiệp vụ của `US-018` |
| [`../knowledge/feature-summary/US-020-lich-su-trang-thai-job.md`](../knowledge/feature-summary/US-020-lich-su-trang-thai-job.md) | Tạo mới, sau đó cập nhật (sync) | Tóm tắt cho `US-020` |
| [`../delivery/pbi/US-020-lich-su-trang-thai-job.md`](../delivery/pbi/US-020-lich-su-trang-thai-job.md) | Tạo mới, sau đó điền đầy đủ (sync) | Rỗng → 9 AC, User Story đầy đủ |
| [`../data/entity/ENT-004-job-ung-tuyen.md`](../data/entity/ENT-004-job-ung-tuyen.md) | Cập nhật | Thêm mốc "Ngày nộp hồ sơ", mở rộng Trạng thái từ 7 lên 8 giá trị (thêm "Expired"), thêm `US-020` vào Function Sử Dụng |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`BR-025-het-han-tu-dong-chuyen-expired.md`](../knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md) | Business rule | Tạo mới từ raw này |
| [`BR-026-waiting-qua-7-ngay-tu-dong-no-response.md`](../knowledge/business-rule/BR-026-waiting-qua-7-ngay-tu-dong-no-response.md) | Business rule | Tạo mới từ raw này |
| [`BR-027-ngay-nop-ho-so-theo-chieu-waiting.md`](../knowledge/business-rule/BR-027-ngay-nop-ho-so-theo-chieu-waiting.md) | Business rule | Tạo mới từ raw này |
| [`ENT-004-job-ung-tuyen.md`](../data/entity/ENT-004-job-ung-tuyen.md) | Entity | Đã có sẵn (từ `US-018`), chỉ liên kết và mở rộng |
