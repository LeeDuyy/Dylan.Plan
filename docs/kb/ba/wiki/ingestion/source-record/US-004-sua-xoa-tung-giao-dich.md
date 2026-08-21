---
status: Active
updated: 2026-08-05
feature: US-004
raw: docs/kb/ba/raw/US-004-sua-xoa-tung-giao-dich.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-004"]
---

# Source Record — US-004 Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-004-sua-xoa-tung-giao-dich.md`](../../../raw/US-004-sua-xoa-tung-giao-dich.md) |
| Ngày ingest lần đầu | 2026-08-03 (dạng phẳng, trước khi có cấu trúc nested) |
| Ngày ingest lần cuối | 2026-08-05 (sync sau khi spec đạt `Ready for DEV`) |
| Lý do ingest lại | Lần 1 (ingest): migrate từ trang wiki phẳng sang cấu trúc nested, bổ sung mục 4 Luồng Nghiệp Vụ, chuẩn bị cho `ssr-ba` tổng hợp spec. Lần 2 (sync, cùng ngày): spec đã `Ready for DEV` (11 AC) — nạp ngược vào `feature.md` (`Active`), `pbi.md` (đủ 11 AC) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-004-sua-xoa-tung-giao-dich.md`](../../knowledge/feature/US-004-sua-xoa-tung-giao-dich.md) | Tạo mới (nested) | Nội dung kế thừa từ trang phẳng cũ, bổ sung mục 4 Luồng Nghiệp Vụ từ Business Flow F1 |
| [`../../knowledge/feature-summary/US-004-sua-xoa-tung-giao-dich.md`](../../knowledge/feature-summary/US-004-sua-xoa-tung-giao-dich.md) | Tạo mới | Tóm tắt 1 đoạn |
| [`../../delivery/pbi/US-004-sua-xoa-tung-giao-dich.md`](../../delivery/pbi/US-004-sua-xoa-tung-giao-dich.md) | Tạo mới | Rỗng — chờ sync sau khi spec Ready for DEV |
| [`../../knowledge/epic/EPC-001-ghi-nhan-chi-tieu.md`](../../knowledge/epic/EPC-001-ghi-nhan-chi-tieu.md) | Tạo mới | Epic cho luồng F1, ánh xạ từ Business Flow |
| [`../../data/entity/ENT-001-giao-dich.md`](../../data/entity/ENT-001-giao-dich.md) | Tạo mới | Entity Giao dịch, model Prisma `Transaction` đã có từ US-001 |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-001-sua-day-du-4-truong.md`](../../knowledge/business-rule/BR-001-sua-day-du-4-truong.md) | Business rule | Tạo mới từ raw này (mint ID kế tiếp, chưa có trang BR nào trong wiki trước đó) |
| [`../../knowledge/business-rule/BR-002-xoa-can-xac-nhan.md`](../../knowledge/business-rule/BR-002-xoa-can-xac-nhan.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-003-chi-thang-dang-chon.md`](../../knowledge/business-rule/BR-003-chi-thang-dang-chon.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-004-ngay-khong-tuong-lai.md`](../../knowledge/business-rule/BR-004-ngay-khong-tuong-lai.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-005-khong-undo.md`](../../knowledge/business-rule/BR-005-khong-undo.md) | Business rule | Tạo mới từ raw này |

**Ghi chú phạm vi:** Đây là lần đầu dự án tạo cấu trúc wiki nested (`indexes/`, `knowledge/`, `delivery/`, `ingestion/`, `data/`) theo đúng template chuẩn của kit — trước đó 10 US khác (US-001, US-002, US-003, US-005..US-011) chỉ có trang phẳng `docs/kb/ba/wiki/US-###-*.md`, **chưa được migrate** sang cấu trúc này. `.ssr-kit.env` của dự án cũng chưa khai các biến `SSR_BA_WIKI_INGESTION`/`SSR_BA_WIKI_KNOWLEDGE`/`SSR_BA_WIKI_DELIVERY`/`SSR_BA_WIKI_GOVERNANCE`/`SSR_BACKLOG` mà bản kit hiện tại (2.6.0) kỳ vọng — các đường dẫn trong lần ingest này được suy trực tiếp từ bảng ownership ở `memory/rules.md` (R3.1), không phải đoán tùy ý. Khuyến nghị user cập nhật `.ssr-kit.env` và migrate 10 US còn lại khi thuận tiện.
