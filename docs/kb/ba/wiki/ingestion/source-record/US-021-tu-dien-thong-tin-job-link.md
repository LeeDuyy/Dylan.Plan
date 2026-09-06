---
status: Active
feature: US-021
updated: 2026-08-28
raw: docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-021"]
---

# Source Record — US-021 Tự điền thông tin job từ link tin tuyển dụng

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md`](../../../raw/US-021-tu-dien-thong-tin-job-link.md) |
| Ngày ingest lần đầu | 2026-08-27 |
| Ngày ingest lần cuối | 2026-08-28 |
| Lý do ingest lại | spec đã Ready for DEV (sync) — nạp 8 AC + luồng đã chốt ngược vào wiki |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-021-tu-dien-thong-tin-job-link.md`](../../knowledge/feature/US-021-tu-dien-thong-tin-job-link.md) | Cập nhật (sync) | `Status: Active`; luồng + ngoại lệ khớp spec mục 6 (thêm `DEC-119`, `DEC-125`, `DEC-126`) |
| [`../../knowledge/feature-summary/US-021-tu-dien-thong-tin-job-link.md`](../../knowledge/feature-summary/US-021-tu-dien-thong-tin-job-link.md) | Cập nhật (sync) | `Status: Active`, khớp feature.md mới |
| [`../../delivery/pbi/US-021-tu-dien-thong-tin-job-link.md`](../../delivery/pbi/US-021-tu-dien-thong-tin-job-link.md) | Cập nhật (sync) | `Status: Active`; User Story + 8 AC chép nguyên văn từ spec mục 7 |
| [`../../knowledge/business-rule/BR-031-tu-dien-job-tu-link.md`](../../knowledge/business-rule/BR-031-tu-dien-job-tu-link.md) | Cập nhật (sync) | `Status: Active`; bổ sung `DEC-121`, `DEC-124`, `DEC-125`, `DEC-126` |
| [`../../knowledge/business-rule/BR-032-suy-platform-tu-ten-mien.md`](../../knowledge/business-rule/BR-032-suy-platform-tu-ten-mien.md) | Cập nhật (sync) | `Status: Active`; chốt cách khớp tên miền = chứa tên kênh (`DEC-124`) |
| [`../../data/entity/ENT-004-job-ung-tuyen.md`](../../data/entity/ENT-004-job-ung-tuyen.md), [`ENT-005`](../../data/entity/ENT-005-platform-tuyen-dung.md), [`BR-025`](../../knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md) | Cập nhật (sync) | Thêm `US-021` vào mục "Function Sử Dụng" / "Áp Dụng Cho Function Nào" |
| `../../indexes/root-index.md`, `../../indexes/raw-index.md`, `../../indexes/feature-index.md`, `../../indexes/epic-index.md` | Cập nhật | Thêm `US-021`; ghi vào mục "không thuộc Business Flow" (như `US-018`, `US-020`) |
| `../../reports/wiki-health-report.md` | Cập nhật | Số lượng feature và business rule |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md`](../../knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md) | Feature | Đã có sẵn — `US-021` mở rộng (Depends on) |
| [`../../knowledge/feature/US-020-lich-su-trang-thai-job.md`](../../knowledge/feature/US-020-lich-su-trang-thai-job.md) | Feature | Đã có sẵn — `US-021` tác động (Impacts) qua luật `BR-025` |
| [`../../data/entity/ENT-004-job-ung-tuyen.md`](../../data/entity/ENT-004-job-ung-tuyen.md) | Entity | Đã có sẵn, chỉ liên kết — không đổi cấu trúc (`DEC-113`) |
| [`../../data/entity/ENT-005-platform-tuyen-dung.md`](../../data/entity/ENT-005-platform-tuyen-dung.md) | Entity | Đã có sẵn, chỉ liên kết |
| [`../../knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md`](../../knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md) | Business rule | Đã có sẵn — Ngày hết hạn tự điền là đầu vào của rule này |
| [`../../knowledge/business-rule/BR-031-tu-dien-job-tu-link.md`](../../knowledge/business-rule/BR-031-tu-dien-job-tu-link.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-032-suy-platform-tu-ten-mien.md`](../../knowledge/business-rule/BR-032-suy-platform-tu-ten-mien.md) | Business rule | Tạo mới từ raw này |
