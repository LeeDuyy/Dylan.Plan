---
status: Active
feature: US-019
updated: 2026-08-14
raw: docs/kb/ba/raw/US-019-danh-sach-can-mua.md
owner: ssr-ingest
tags: [kb/ba/wiki/ingestion]
aliases: ["US-019"]
---

# Source Record — US-019 Danh sách items cần mua theo tháng tại bảng thu chi

> Bản ghi provenance: nguồn raw nào sinh ra những trang wiki nào. Không sao chép nội dung raw — chỉ trỏ tới.

## 1. Metadata Nguồn

| Trường | Giá trị |
| --- | --- |
| Raw file | [`../../../raw/US-019-danh-sach-can-mua.md`](../../../raw/US-019-danh-sach-can-mua.md) |
| Ngày ingest lần đầu | 2026-08-14 |
| Ngày ingest lần cuối | 2026-08-14 |
| Lý do ingest lại | Spec đã `Ready for DEV` (sync) — 10 AC, `po-expert` xác nhận `Aligned` sau khi Business Flow mở rộng thêm `M3`/`F3` (`DEC-105`) |

## 2. Tác Động Ingest

| Trang wiki bị tạo/sửa | Hành động | Ghi chú |
| --- | --- | --- |
| [`../../knowledge/feature/US-019-danh-sach-can-mua.md`](../../knowledge/feature/US-019-danh-sach-can-mua.md) | Cập nhật | `Status: Active`, chính thức gắn epic `EPC-003` (F3) |
| [`../../knowledge/feature-summary/US-019-danh-sach-can-mua.md`](../../knowledge/feature-summary/US-019-danh-sach-can-mua.md) | Cập nhật | Tóm tắt khớp bản `Active` |
| [`../../delivery/pbi/US-019-danh-sach-can-mua.md`](../../delivery/pbi/US-019-danh-sach-can-mua.md) | Cập nhật | Điền đủ 10 AC chép nguyên văn từ spec |
| [`../../../data/entity/ENT-006-item-can-mua.md`](../../../data/entity/ENT-006-item-can-mua.md) | Không đổi | Vẫn chờ `ssr-data` cấp model Prisma |
| [`../../knowledge/business-rule/BR-022-gia-item-khong-cong-ngan-sach.md`](../../knowledge/business-rule/BR-022-gia-item-khong-cong-ngan-sach.md) | Không đổi | Nội dung đã khớp spec cuối |
| [`../../knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md`](../../knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md) | Cập nhật | Đã xóa nhãn `Cần user xác nhận`, chốt qua `DEC-098` |
| [`../../knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md`](../../knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md) | Cập nhật | Bổ sung định nghĩa "sửa" = inline, theo `DEC-106` |
| [`../../epic/EPC-003-quan-ly-chu-ky-thang.md`](../../epic/EPC-003-quan-ly-chu-ky-thang.md) | Cập nhật | Dòng `US-019` chuyển từ `Draft` (đề xuất) sang `Active` |

## 3. Trang Wiki Liên Quan

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../../knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md`](../../knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md) | Business rule | Đã có sẵn, chỉ liên kết — dùng chung luồng tạo tháng |
| [`../../knowledge/business-rule/BR-003-chi-thang-dang-chon.md`](../../knowledge/business-rule/BR-003-chi-thang-dang-chon.md) | Business rule | Đã có sẵn, chỉ liên kết — tiền lệ cho `BR-024` |
| [`../../../data/entity/ENT-003-thang-ngan-sach.md`](../../../data/entity/ENT-003-thang-ngan-sach.md) | Entity | Đã có sẵn, chỉ liên kết — Item cần mua gắn theo tháng ngân sách |
| [`../../knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md`](../../knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md) | Epic | Chính thức — US-019 đã gắn vào đây (F3), xác nhận qua `DEC-105` |
