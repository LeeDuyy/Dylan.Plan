---
status: Active
feature: US-005
updated: 2026-08-06
spec: docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md
raw: docs/kb/ba/raw/US-005-rang-buoc-toan-ven-danh-muc.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-005", "Ràng buộc toàn vẹn danh mục + giao dịch không danh mục"]
---

# US-005 — Ràng buộc toàn vẹn danh mục + giao dịch không danh mục

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, xóa một danh mục đang có giao dịch không hoạt động đúng — hệ thống không xử lý được thao tác này và không cho Dylan biết chuyện gì đã xảy ra. Sau thay đổi này, xóa một danh mục thường luôn thành công: giao dịch của nó tự động chuyển sang danh mục dự phòng "Chi tiêu khác", kèm thông báo rõ ràng. Khi ghi nhận chi tiêu mà nội dung không khớp danh mục nào, Dylan ghi nhận được ngay mà không bắt buộc chọn danh mục — giao dịch cũng tự vào "Chi tiêu khác". Phục vụ mục tiêu M1 của Business Flow.

## 2. Phạm Vi

Trong phạm vi:

- Xóa danh mục thường có giao dịch → chuyển giao dịch sang "Chi tiêu khác" (tự sinh nếu tháng chưa có), toast báo rõ số giao dịch đã chuyển
- Xóa danh mục thường không có giao dịch → xóa bình thường, toast chỉ báo đã xóa
- Ghi nhận chi tiêu không khớp từ khóa danh mục nào → ô chọn danh mục tự để trống, Dylan bấm "Ghi nhận" được ngay, giao dịch tự vào "Chi tiêu khác"
- "Chi tiêu khác": khóa vĩnh viễn, hiển thị chỉ đọc, chỉ xuất hiện khi có giao dịch, Loại "Linh hoạt", Ngân sách khởi tạo 0đ

Ngoài phạm vi:

- Chặn trùng tên danh mục (thuộc `US-010`)
- Cấu hình ngưỡng cảnh báo/mục tiêu chi (thuộc `US-009`)
- Sửa/xóa từng giao dịch riêng lẻ (đã triển khai ở `US-004`, dùng đúng cơ chế của `US-003`)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, tạo, sửa, xóa danh mục thường; ghi nhận chi tiêu không chọn danh mục | Không sửa/xóa "Chi tiêu khác" — khóa vĩnh viễn (`DEC-027`) |

## 4. Luồng Nghiệp Vụ

1. Dylan bấm nút xóa trên một danh mục thường đang có giao dịch — giao dịch chuyển sang "Chi tiêu khác" (tự sinh nếu chưa có); danh mục gốc biến mất; toast báo tên danh mục + số giao dịch đã chuyển.
2. Dylan bấm nút xóa trên một danh mục thường không có giao dịch — danh mục biến mất ngay; toast chỉ báo đã xóa.
3. Dylan gõ nội dung không khớp từ khóa danh mục nào — ô chọn danh mục tự để trống; Dylan bấm "Ghi nhận" — giao dịch tự gắn vào "Chi tiêu khác".
4. Dylan xem bảng ngân sách — "Chi tiêu khác" (nếu có giao dịch) hiển thị chỉ đọc, không ô nhập, không nút xóa.
5. Giao dịch cuối cùng của "Chi tiêu khác" bị chuyển đi/xóa — dòng "Chi tiêu khác" ẩn khỏi bảng, bản ghi vẫn giữ nguyên.

Ngoại lệ: Xóa nhiều danh mục có giao dịch trong cùng tháng → tất cả gộp vào cùng một "Chi tiêu khác" duy nhất, không tạo nhiều bản ghi.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-008` | Xóa danh mục thường chuyển toàn bộ giao dịch sang "Chi tiêu khác" | [`../business-rule/BR-008-xoa-chuyen-chi-tieu-khac.md`](../business-rule/BR-008-xoa-chuyen-chi-tieu-khac.md) | `docs/memory/decisions.md#dec-024` | Đã xác nhận từ knowledge |
| `BR-009` | "Chi tiêu khác" chỉ tự sinh khi cần | [`../business-rule/BR-009-chi-tieu-khac-tu-sinh.md`](../business-rule/BR-009-chi-tieu-khac-tu-sinh.md) | `docs/memory/decisions.md#dec-026` | Đã xác nhận từ knowledge |
| `BR-010` | "Chi tiêu khác" khóa vĩnh viễn, chỉ xem | [`../business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md`](../business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md) | `docs/memory/decisions.md#dec-027` | Đã xác nhận từ knowledge |
| `BR-011` | Ghi nhận cho phép bỏ qua chọn danh mục | [`../business-rule/BR-011-bo-qua-danh-muc.md`](../business-rule/BR-011-bo-qua-danh-muc.md) | `docs/memory/decisions.md#dec-028` | Đã xác nhận từ knowledge |
| `BR-012` | "Chi tiêu khác" ẩn khi hết giao dịch, không xóa bản ghi | [`../business-rule/BR-012-an-khi-het-giao-dich.md`](../business-rule/BR-012-an-khi-het-giao-dich.md) | `docs/memory/decisions.md#dec-029`, `#dec-030` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Danh mục (bao gồm "Chi tiêu khác") | [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | `Category` | Cần cách phân biệt "Chi tiêu khác" (khóa hoàn toàn) với danh mục khóa khác (chỉ chặn xóa) — chưa qua `ssr-data` |
| Giao dịch | [`../../data/entity/ENT-001-giao-dich.md`](../../data/entity/ENT-001-giao-dich.md) | `Transaction` | Đổi `categoryId` khi danh mục cha bị xóa |

Không có thuật ngữ nghiệp vụ mới phát sinh ngoài "Chi tiêu khác" — đã có sẵn trong `docs/memory/glossary.md`.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-001`](../../../../features/US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Depends on | Cần data model bền vững |
| [`US-003`](../../../../features/US-003-lien-ket-giao-dich-theo-id/spec.md) | Depends on | Cần liên kết theo ID để chuyển giao dịch chính xác |
| [`US-004`](../../../../features/US-004-sua-xoa-tung-giao-dich/spec.md) | Depends on / Impacts | Depends on: AC-05 dùng thao tác xóa giao dịch của `US-004` để kiểm chứng. Impacts: sửa/xóa giao dịch có thể làm "Chi tiêu khác" mất giao dịch cuối cùng |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md` (`Status: Ready for DEV`, 6 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-005-rang-buoc-toan-ven-danh-muc.md` |
| Raw | `docs/kb/ba/raw/US-005-rang-buoc-toan-ven-danh-muc.md` |
| Business Flow (M1, F1-F2, gap #5) | `docs/kb/ba/business-flow.md` |
| Trang wiki phẳng trước đây (legacy) | `docs/kb/ba/wiki/US-005-rang-buoc-toan-ven-danh-muc.md` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Thuộc luồng F2 (Lập và điều chỉnh ngân sách theo danh mục); cũng liên quan F1 |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-005-rang-buoc-toan-ven-danh-muc.md`](../../delivery/pbi/US-005-rang-buoc-toan-ven-danh-muc.md) | Đã đồng bộ 2026-08-06 — đủ 6 AC |
