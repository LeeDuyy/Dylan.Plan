---
status: Draft
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/data/entity]
aliases: ["ENT-007", "Nguồn thu"]
---

# ENT-007 — Nguồn thu

> Trang dùng lại được xuyên function. Tên entity là tên nghiệp vụ, không phải tên bảng — tên bảng thật nằm ở cột Model Prisma.

## 1. Định Nghĩa Entity

Một dòng thu nhập gắn theo một tháng ngân sách cụ thể — gồm tên nguồn (bắt buộc, ví dụ "Lương", "Freelance", "Thưởng"), số tiền (bắt buộc, số nguyên đồng từ 0 trở lên, không cho số âm — `DEC-134`) và thứ tự hiển thị. Nhiều nguồn thu cùng thuộc một tháng; cho phép hai nguồn thu trùng tên. Dylan tự thêm, sửa, xóa và sắp xếp thứ tự hiển thị các nguồn thu — chỉ khi tháng đang xem là tháng hiện tại hoặc tương lai; tháng đã kết thúc chỉ xem (`BR-036`, `DEC-133`). Tổng số tiền tất cả nguồn thu của một tháng chính là "Thu nhập tháng" của tháng đó — con số đầu vào cho mọi chỉ số tổng (Số dư còn lại, Tỷ lệ sử dụng thu nhập, Tiết kiệm ròng, Tỷ lệ tiết kiệm).

Nguồn thu độc lập với Danh mục và Giao dịch: thêm/sửa/xóa nguồn thu không làm đổi Ngân sách hay Chi thực tế của bất kỳ danh mục nào.

## 2. Model Prisma

| Model Prisma | Ghi chú |
| --- | --- |
| Chưa có model — entity mới, chờ `ssr-data` | Dự kiến tên `IncomeSource`, liên kết theo khóa của [`ENT-003`](ENT-003-thang-ngan-sach.md) (`MonthBudget.id`); không liên kết `Category`/`Transaction`. `ssr-data` chốt số phận cột `MonthBudget.income` (giữ làm cache tổng hay bỏ hẳn) |

## 3. Function Sử Dụng

| Function | Cách dùng |
| --- | --- |
| [`US-022`](../../knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Tạo, Đọc, Sửa, Xóa, Sắp xếp — trong phạm vi tháng đang được chọn xem tại tab Thu chi |

## 4. Ràng Buộc

| Ràng buộc | Nguồn |
| --- | --- |
| Thu nhập tháng = tổng số tiền tất cả nguồn thu của tháng | [`BR-033`](../../knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md) |
| Tháng được tạo mới bắt đầu không có nguồn thu nào — kể cả khi bấm "Clone tháng đang xem" | [`BR-037`](../../knowledge/business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md) |
| Thêm/sửa/xóa/sắp xếp nguồn thu chỉ ở tháng hiện tại hoặc tương lai; tháng đã kết thúc chỉ xem | [`BR-036`](../../knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md), `docs/memory/decisions.md#dec-133` |
| Số tiền nguồn thu là số nguyên đồng từ 0 trở lên, không cho số âm | `docs/memory/decisions.md#dec-134` |
| Nguồn thu không cộng vào / không làm đổi Ngân sách và Chi thực tế của danh mục | `docs/memory/decisions.md#dec-127` |
