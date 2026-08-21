---
status: Active
updated: 2026-08-12
owner: ssr-ingest
tags: [kb/ba/wiki/data/entity]
aliases: ["ENT-002", "Danh mục"]
---

# ENT-002 — Danh mục

> Trang dùng lại được xuyên function. Tên entity là tên nghiệp vụ, không phải tên bảng — tên bảng thật nằm ở cột Model Prisma.

## 1. Định Nghĩa Entity

Một nhóm chi tiêu dùng để phân loại giao dịch và đặt ngân sách (vd "Ăn uống", "Di chuyển"). Thuộc về đúng một tháng ngân sách. Một trường hợp đặc biệt của danh mục là "Chi tiêu khác" — danh mục dự phòng, tự sinh khi cần, khóa vĩnh viễn, chỉ xem (`BR-009`, `BR-010`).

## 2. Model Prisma

| Model Prisma | Ghi chú |
| --- | --- |
| `Category` | `prisma/schema.prisma` — đã tạo và áp dụng migration ở US-001 (`docs/features/US-001-luu-tru-chi-tieu-ben-vung/data-model.md`) |

## 3. Function Sử Dụng

| Function | Cách dùng |
| --- | --- |
| [`US-001`](../../knowledge/feature/US-001-luu-tru-chi-tieu-ben-vung.md) | Tạo — lưu bền vững, di trú dữ liệu cũ |
| [`US-003`](../../knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md) | Là đích liên kết của `Transaction.categoryId` |
| [`US-005`](../../knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md) | Xóa danh mục thường, tự sinh/ẩn-hiện "Chi tiêu khác" |
| [`US-014`](../../knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md) | Sắp xếp lại thứ tự hiển thị — "Chi tiêu khác" luôn ở cuối |
| [`US-016`](../../knowledge/feature/US-016-loai-chi-tieu-combobox.md) | Giới hạn trường "Loại" đúng 3 giá trị cố định, chọn qua combobox |
| [`US-017`](../../knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md) | Kéo thả sắp xếp lại thứ tự hiển thị, lưu bền vững (spec `Ready for DEV`, 8 AC) — chưa có cột thứ tự trong schema hiện tại, để `ssr-data` bổ sung khi lập kế hoạch kỹ thuật |

## 4. Ràng Buộc

| Ràng buộc | Nguồn |
| --- | --- |
| Danh mục bị khóa (`locked = true`) không cho xóa | [`BR-010`](../../knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md) |
| Xóa danh mục thường chuyển toàn bộ giao dịch sang "Chi tiêu khác" | [`BR-008`](../../knowledge/business-rule/BR-008-xoa-chuyen-chi-tieu-khac.md) |
| "Chi tiêu khác" chỉ tự sinh khi cần, không có sẵn mặc định | [`BR-009`](../../knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md) |
| "Chi tiêu khác" chỉ hiển thị khi còn giao dịch | [`BR-012`](../../knowledge/business-rule/BR-012-an-khi-het-giao-dich.md) |
| "Chi tiêu khác" (khi đang hiển thị) luôn ở cuối danh sách danh mục | [`BR-016`](../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) |
| "Loại" chỉ nhận đúng 3 giá trị cố định (Cố định/Tích lũy/Khác), chọn qua combobox, không nhập tự do | [`BR-019`](../../knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md) |
| Thứ tự hiển thị sau kéo thả lưu bền vững, đồng bộ 3 nơi dùng chung danh sách, trừ "Chi tiêu khác" luôn cố định cuối | [`BR-020`](../../knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md) |
