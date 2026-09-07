---
status: Active
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/data/entity]
aliases: ["ENT-003", "Tháng ngân sách"]
---

# ENT-003 — Tháng ngân sách

> Trang dùng lại được xuyên function. Tên entity là tên nghiệp vụ, không phải tên bảng — tên bảng thật nằm ở cột Model Prisma.

## 1. Định Nghĩa Entity

Tập hợp thu nhập, danh mục, giao dịch và item cần mua của một tháng cụ thể (vd "2026-08"). Mỗi tháng được nhận diện bằng đúng một kỳ tháng — không có hai tháng ngân sách nào cùng kỳ tồn tại song song trong dữ liệu.

Từ US-022, "thu nhập" của tháng không còn là một con số cố định gán sẵn mà là tổng số tiền các nguồn thu ([`ENT-007`](ENT-007-nguon-thu.md)) Dylan tự khai báo cho tháng đó ([`BR-033`](../../knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md)).

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
| [`US-022`](../../knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Đọc danh sách tháng để chọn sẵn tháng hiện tại/gần nhất khi mở tab; thu nhập tháng chuyển sang tổng nguồn thu |

## 4. Ràng Buộc

| Ràng buộc | Nguồn |
| --- | --- |
| Tạo tháng trùng kỳ với tháng đã có phải báo rõ cho Dylan, không được âm thầm không làm gì | [`BR-014`](../../knowledge/business-rule/BR-014-canh-bao-trung-thang.md) |
| Thu nhập tháng = tổng số tiền các nguồn thu của tháng; tháng tạo mới bắt đầu không có nguồn thu nào | [`BR-033`](../../knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md), [`BR-037`](../../knowledge/business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md) |
| Tab Thu chi khi mở chọn sẵn tháng hiện tại, hoặc tháng gần hiện tại nhất nếu tháng hiện tại chưa có dữ liệu | [`BR-035`](../../knowledge/business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md) |
