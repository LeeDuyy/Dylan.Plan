---
status: Active
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/data/entity]
aliases: ["ENT-001", "Giao dịch"]
---

# ENT-001 — Giao dịch

> Trang dùng lại được xuyên function. Tên entity là tên nghiệp vụ, không phải tên bảng — tên bảng thật nằm ở cột Model Prisma.

## 1. Định Nghĩa Entity

Một lần ghi nhận chi tiêu, gồm nội dung, số tiền, danh mục và thời điểm phát sinh. Thuộc về đúng một tháng ngân sách và đúng một danh mục (qua mã nhận diện cố định, không theo tên — US-003).

## 2. Model Prisma

| Model Prisma | Ghi chú |
| --- | --- |
| `Transaction` | `prisma/schema.prisma` — đã tạo và áp dụng migration ở US-001 (`docs/features/US-001-luu-tru-chi-tieu-ben-vung/data-model.md`) |

## 3. Function Sử Dụng

| Function | Cách dùng |
| --- | --- |
| [`US-001`](../../knowledge/feature/US-001-luu-tru-chi-tieu-ben-vung.md) | Tạo — lưu bền vững, di trú dữ liệu cũ |
| `US-004` | Sửa, Xóa — một giao dịch riêng lẻ tại bảng chi tiết chi tiêu (spec đang tổng hợp) |

## 4. Ràng Buộc

| Ràng buộc | Nguồn |
| --- | --- |
| Gắn với danh mục qua `categoryId` (mã cố định), không theo tên hiển thị | [`BR-007`](../../knowledge/business-rule/BR-007-danh-muc-theo-id.md), `docs/features/US-001-luu-tru-chi-tieu-ben-vung/data-model.md` mục 2 |
| Ngày giao dịch phải ≤ hôm nay | [`BR-004`](../../knowledge/business-rule/BR-004-ngay-khong-tuong-lai.md) |
| Chỉ sửa/xóa được nếu thuộc tháng đang chọn | [`BR-003`](../../knowledge/business-rule/BR-003-chi-thang-dang-chon.md) |
