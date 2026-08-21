---
status: Active
feature: US-003
updated: 2026-08-05
spec: docs/features/US-003-lien-ket-giao-dich-theo-id/spec.md
raw: docs/kb/ba/raw/US-003-lien-ket-giao-dich-theo-id.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-003", "Liên kết giao dịch theo danh mục bằng ID"]
---

# US-003 — Liên kết giao dịch theo danh mục bằng ID

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Mỗi giao dịch chi tiêu gắn với danh mục qua mã nhận diện cố định thay vì tên hiển thị — gán một lần khi ghi nhận, không đổi sau này. Đổi tên một danh mục không làm giao dịch cũ bị lệch hay mất liên kết. Phục vụ mục tiêu M1 của Business Flow.

**Ghi chú provenance:** Requirement này đã triển khai thật cùng đợt `US-001` (2026-08-03..05) — khóa `categoryId` trên giao dịch đã có sẵn trong cấu trúc dữ liệu và đang chạy thật. Spec này tổng hợp lại thành artifact riêng, không phải đề xuất mới.

## 2. Phạm Vi

Trong phạm vi:

- Mỗi giao dịch gắn với đúng một danh mục qua mã nhận diện cố định, gán một lần khi ghi nhận
- Tên danh mục hiển thị trên mọi giao dịch (kể cả giao dịch cũ) luôn tra theo tên hiện tại của danh mục đang gắn
- Đổi tên một danh mục không làm mất liên kết hay lệch "Chi thực tế" của giao dịch đã gắn từ trước

Ngoài phạm vi:

- Chặn trùng tên danh mục (thuộc `US-010`)
- Xử lý giao dịch khi danh mục bị xóa (thuộc `US-005`)
- Sửa/xóa từng giao dịch riêng lẻ (thuộc `US-004`, đã dùng đúng cơ chế liên kết này)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, ghi nhận chi tiêu, đổi tên danh mục | Single-user (`DEC-004`) |

## 4. Luồng Nghiệp Vụ

1. Dylan ghi nhận một giao dịch mới — gắn với đúng danh mục Dylan chọn tại thời điểm đó, qua mã nhận diện cố định.
2. Dylan xem lại giao dịch — tên danh mục hiển thị luôn là tên hiện tại của danh mục đang gắn.
3. Dylan đổi tên một danh mục đang có giao dịch — mọi giao dịch cũ vẫn hiển thị đúng dưới tên mới; "Chi thực tế" không đổi.

Ngoại lệ: Không có nhánh riêng — việc gán mã nhận diện xảy ra cùng lúc với ghi nhận giao dịch, không có bước riêng có thể lỗi giữa chừng.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-007` | Giao dịch liên kết danh mục qua mã nhận diện cố định, không theo tên hiển thị | [`../business-rule/BR-007-danh-muc-theo-id.md`](../business-rule/BR-007-danh-muc-theo-id.md) | `docs/kb/ba/business-flow.md#5-điểm-chạm-giữa-các-luồng` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Giao dịch → Danh mục | [`../../data/entity/ENT-001-giao-dich.md`](../../data/entity/ENT-001-giao-dich.md) | `Transaction.categoryId` (khóa ngoại tới `Category`) | Đã tạo và áp dụng migration cùng đợt `US-001` |

Không có thuật ngữ nghiệp vụ mới phát sinh ngoài những gì đã có trong `docs/memory/glossary.md`.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-001`](../../../../features/US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Depends on (song song) | Cùng thiết kế data model, triển khai chung một đợt |
| [`US-004`](../../../../features/US-004-sua-xoa-tung-giao-dich/spec.md) | Impacts | Sửa danh mục của một giao dịch dựa trên đúng cơ chế liên kết theo ID này |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-003-lien-ket-giao-dich-theo-id/spec.md` (`Status: Ready for DEV`, 3 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-003-lien-ket-giao-dich-theo-id.md` |
| Raw | `docs/kb/ba/raw/US-003-lien-ket-giao-dich-theo-id.md` |
| Business Flow (M1, gap #4 đã giải quyết) | `docs/kb/ba/business-flow.md` |
| Data model thật đã áp dụng | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/data-model.md` |
| Trang wiki phẳng trước đây (legacy) | `docs/kb/ba/wiki/US-003-lien-ket-giao-dich-theo-id.md` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-001-ghi-nhan-chi-tieu.md`](../epic/EPC-001-ghi-nhan-chi-tieu.md) | Epic | Thuộc luồng F1 (Ghi nhận chi tiêu); cũng liên quan F2 nhưng chưa có epic riêng cho F2 |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-003-lien-ket-giao-dich-theo-id.md`](../../delivery/pbi/US-003-lien-ket-giao-dich-theo-id.md) | Đã đồng bộ 2026-08-05 — đủ 3 AC |
