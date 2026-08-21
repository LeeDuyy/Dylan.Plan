---
status: Active
updated: 2026-08-11
owner: ssr-ingest
tags: [kb/ba/wiki/data/entity]
aliases: ["ENT-003", "Tháng ngân sách"]
---

# ENT-003 — Tháng ngân sách

> Trang dùng lại được xuyên function. Tên entity là tên nghiệp vụ, không phải tên bảng — tên bảng thật nằm ở cột Model Prisma.

## 1. Định Nghĩa Entity

Tập hợp thu nhập, danh mục và giao dịch của một tháng cụ thể (vd "2026-08"). Mỗi tháng được nhận diện bằng đúng một kỳ tháng — không có hai tháng ngân sách nào cùng kỳ tồn tại song song trong dữ liệu.

## 2. Model Prisma

| Model Prisma | Ghi chú |
| --- | --- |
| `MonthBudget` | `prisma/schema.prisma` — `id` là chuỗi kỳ tháng (vd "2026-08"), đóng vai trò khóa chính nên đã là khóa duy nhất tự nhiên; đã tạo và áp dụng migration ở US-001 (`docs/features/US-001-luu-tru-chi-tieu-ben-vung/data-model.md`) |

## 3. Function Sử Dụng

| Function | Cách dùng |
| --- | --- |
| [`US-001`](../../knowledge/feature/US-001-luu-tru-chi-tieu-ben-vung.md) | Tạo — lưu bền vững, di trú dữ liệu cũ |
| [`US-006`](../../knowledge/feature/US-006-canh-bao-trung-thang.md) | Ngăn chọn trùng kỳ tháng ngay trong ô chọn kỳ tháng để tạo mới |
| [`US-015`](../../knowledge/feature/US-015-quick-view-thang-lien-ke.md) | Đọc danh sách tháng đã tạo để xác định thẻ "trước/đang xem/sau" trong khu vực "Lịch sử thu chi" — không đổi cấu trúc |

## 4. Ràng Buộc

| Ràng buộc | Nguồn |
| --- | --- |
| Tạo tháng trùng kỳ với tháng đã có phải báo rõ cho Dylan, không được âm thầm không làm gì | [`BR-014`](../../knowledge/business-rule/BR-014-canh-bao-trung-thang.md) |
