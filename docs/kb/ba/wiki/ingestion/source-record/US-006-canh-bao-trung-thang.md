---
status: Active
feature: US-006
updated: 2026-08-10
raw: docs/kb/ba/raw/US-006-canh-bao-trung-thang.md; docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md (gộp)
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-006", "US-013"]
---

# Source Record — US-006 Cảnh báo trùng tháng khi tạo tháng mới

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`docs/kb/ba/raw/US-006-canh-bao-trung-thang.md`](../../../raw/US-006-canh-bao-trung-thang.md), [`docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md`](../../../raw/US-013-khu-vuc-chon-thang-clone.md) (gộp — `status: Merged`) |
| Ngày ingest lần đầu | 2026-08-06 |
| Ngày ingest lần cuối | 2026-08-10 |
| Lý do ingest lại | Lần 1 (ingest, 2026-08-06): migrate từ trang phẳng cũ sang cấu trúc nested. Lần 2 (sync, 2026-08-07): spec đã `Ready for DEV` (5 AC, sau 2 lượt dialog trong `ssr-ba` — `DEC-061`, `DEC-062` — `po-expert` Aligned) — nạp ngược vào `feature.md` (`Active`), `pbi.md` (đủ 5 AC), `BR-014`. Lần 3 (sync, 2026-08-10): raw `US-013` được gộp vào spec `US-006` thay vì tách spec riêng (`DEC-065`, đánh giá impact theo yêu cầu user) — spec cập nhật thêm 2 AC (AC-06, AC-07), tách Screen Element mục 8.1/8.2, đổi tên nhãn/nút — nạp ngược vào `feature.md`, `pbi.md` (7 AC), `feature-summary.md`, `BR-014` (đổi tên nút trong mô tả), mint mới `BR-015` (`DEC-063`, `DEC-064`) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-006-canh-bao-trung-thang.md`](../../knowledge/feature/US-006-canh-bao-trung-thang.md) | Tạo mới, sau đó cập nhật 2 lần | `Status: Draft` → `Active`; lần 2 gộp thêm nội dung US-013 |
| [`../../knowledge/feature-summary/US-006-canh-bao-trung-thang.md`](../../knowledge/feature-summary/US-006-canh-bao-trung-thang.md) | Tạo mới, sau đó cập nhật 2 lần | Tóm tắt 1 đoạn, đã gồm phần gộp US-013 |
| [`../../delivery/pbi/US-006-canh-bao-trung-thang.md`](../../delivery/pbi/US-006-canh-bao-trung-thang.md) | Tạo mới, sau đó cập nhật 2 lần | Rỗng → 5 AC → 7 AC (thêm AC-06, AC-07 từ US-013) |
| [`../../knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md`](../../knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md) | Tạo mới | Epic đầu tiên cho luồng F3 (Quản lý theo chu kỳ tháng) |
| [`../../knowledge/business-rule/BR-014-canh-bao-trung-thang.md`](../../knowledge/business-rule/BR-014-canh-bao-trung-thang.md) | Cập nhật (sync) 2 lần | Lần 1: đổi nội dung rule cho khớp hướng đã chốt qua dialog. Lần 2: đổi tên nút "Clone tháng hiện tại" → "Clone tháng đang xem" trong mô tả |
| [`../../knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md`](../../knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md) | Tạo mới (sync lần 2) | Rule mới tách từ nội dung gộp US-013: "Tạo tháng" dùng mặc định, "Clone tháng đang xem" sao chép từ tháng đang xem |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-014-canh-bao-trung-thang.md`](../../knowledge/business-rule/BR-014-canh-bao-trung-thang.md) | Business rule | Tạo mới từ raw US-006 |
| [`../../knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md`](../../knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md) | Business rule | Tạo mới từ raw US-013 (gộp) |
| [`../../../../data/entity/ENT-003-thang-ngan-sach.md`](../../../../data/entity/ENT-003-thang-ngan-sach.md) | Entity | Tạo mới — "Tháng ngân sách" chưa có trang entity trước US-006 |

**Ghi chú phạm vi:** Không tìm thấy concept/business-rule/workflow/entity nào đã có khớp ngữ nghĩa cho "tháng ngân sách", "cảnh báo trùng", hay "phân biệt Tạo tháng/Clone" — mint mới `ENT-003`, `BR-014`, `BR-015`. Raw `US-013` không có trang `feature`/`feature-summary`/`pbi` riêng — toàn bộ nội dung nằm trong các trang của `US-006` (xem `docs/memory/decisions.md#dec-065`).
