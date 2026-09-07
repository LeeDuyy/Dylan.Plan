---
status: Active
feature: US-022
updated: 2026-09-07
raw: docs/kb/ba/raw/US-022-nguon-thu-va-insight-tab-thu-chi.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-022"]
---

# Source Record — US-022 Nguồn thu, sửa insight tiết kiệm, tháng mặc định và bỏ giới hạn tháng cho Item cần mua tại tab Thu chi

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`../../raw/US-022-nguon-thu-va-insight-tab-thu-chi.md`](../../raw/US-022-nguon-thu-va-insight-tab-thu-chi.md) |
| Ngày ingest lần đầu | 2026-09-07 |
| Ngày ingest lần cuối | 2026-09-07 (sync — spec đã Ready for DEV) |
| Lý do ingest lại | spec đã Ready for DEV (sync) — cập nhật `feature.md` → `Active`, `pbi.md` → 13 AC, `feature-summary.md` → `Active`, `BR-036`/`ENT-007` mở rộng theo `DEC-133`/`DEC-134`, Business Flow đồng bộ inline (`JDG-034`) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md`](../../knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Tạo mới | Trang tri thức chính, `Status: Draft` |
| [`../../knowledge/feature-summary/US-022-nguon-thu-va-insight-tab-thu-chi.md`](../../knowledge/feature-summary/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Tạo mới | Tóm tắt |
| [`../../delivery/pbi/US-022-nguon-thu-va-insight-tab-thu-chi.md`](../../delivery/pbi/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Tạo mới | Rỗng — chờ sync |
| [`../../data/entity/ENT-007-nguon-thu.md`](../../data/entity/ENT-007-nguon-thu.md) | Tạo mới | Entity mới |
| [`../../knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md`](../../knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md) | Tạo mới | — |
| [`../../knowledge/business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md`](../../knowledge/business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md) | Tạo mới | — |
| [`../../knowledge/business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md`](../../knowledge/business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md) | Tạo mới | — |
| [`../../knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md`](../../knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md) | Tạo mới | Thay `BR-024` trong phạm vi điều kiện tháng |
| [`../../knowledge/business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md`](../../knowledge/business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md) | Tạo mới | — |
| [`../../knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md`](../../knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md) | Cập nhật | Ghi chú bị `BR-036` thay thế trong phạm vi US-022 |
| [`../../data/entity/ENT-003-thang-ngan-sach.md`](../../data/entity/ENT-003-thang-ngan-sach.md) | Cập nhật | Thêm quan hệ với Nguồn thu + US-022 |
| [`../../data/entity/ENT-006-item-can-mua.md`](../../data/entity/ENT-006-item-can-mua.md) | Cập nhật | Thêm US-022 + `BR-036` |
| `../../indexes/*`, `../../reports/wiki-health-report.md` | Cập nhật | 4 index + báo cáo sức khỏe |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../data/entity/ENT-007-nguon-thu.md`](../../data/entity/ENT-007-nguon-thu.md) | Entity | Tạo mới từ raw này |
| [`../../data/entity/ENT-003-thang-ngan-sach.md`](../../data/entity/ENT-003-thang-ngan-sach.md) | Entity | Đã có sẵn, chỉ liên kết |
| [`../../data/entity/ENT-006-item-can-mua.md`](../../data/entity/ENT-006-item-can-mua.md) | Entity | Đã có sẵn, chỉ liên kết |
| [`../../knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md`](../../knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md`](../../knowledge/business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md`](../../knowledge/business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md`](../../knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md`](../../knowledge/business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md) | Business rule | Tạo mới từ raw này |
| [`../../knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md`](../../knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md) | Business rule | Đã có sẵn, chỉ liên kết |
| [`../../knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md`](../../knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md) | Business rule | Đã có sẵn, chỉ liên kết (giữ nguyên) |
