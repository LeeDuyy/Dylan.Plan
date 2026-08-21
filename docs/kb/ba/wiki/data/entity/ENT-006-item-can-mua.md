---
status: Draft
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/data/entity]
aliases: ["ENT-006", "Item cần mua"]
---

# ENT-006 — Item cần mua

> Trang dùng lại được xuyên function. Tên entity là tên nghiệp vụ, không phải tên bảng — tên bảng thật nằm ở cột Model Prisma.

## 1. Định Nghĩa Entity

Một dòng trong danh sách mua sắm gắn theo một tháng ngân sách cụ thể — gồm tên sản phẩm (bắt buộc), giá (tùy chọn, chỉ để tham khảo) và trạng thái Pending/Purchased. Không liên kết với Danh mục hay Giao dịch — độc lập hoàn toàn với số liệu ngân sách của tháng.

## 2. Model Prisma

| Model Prisma | Ghi chú |
| --- | --- |
| Chưa có model — entity mới, chờ `ssr-data` | Dự kiến liên kết theo khóa của [`ENT-003`](ENT-003-thang-ngan-sach.md) (`MonthBudget.id`), không liên kết `Category`/`Transaction` |

## 3. Function Sử Dụng

| Function | Cách dùng |
| --- | --- |
| [`US-019`](../../knowledge/feature/US-019-danh-sach-can-mua.md) | Tạo, Đọc, Sửa, Xóa, Đổi trạng thái — chỉ trong phạm vi tháng đang được chọn xem |

## 4. Ràng Buộc

| Ràng buộc | Nguồn |
| --- | --- |
| Giá không cộng vào Ngân sách/Chi thực tế/Số dư còn lại của tháng | [`BR-022`](../../knowledge/business-rule/BR-022-gia-item-khong-cong-ngan-sach.md) |
| Item còn Pending được chuyển hẳn sang tháng mới khi Dylan tạo tháng mới, không giữ lại ở tháng gốc | [`BR-023`](../../knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md) |
| Chỉ thêm/sửa/xóa/đổi trạng thái được ở tháng đang chọn; tháng khác chỉ xem | [`BR-024`](../../knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md) |
