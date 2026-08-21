---
status: Active
feature: US-003
updated: 2026-08-05
spec: docs/features/US-003-lien-ket-giao-dich-theo-id/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-003"]
---

# PBI — US-003 Liên kết giao dịch theo danh mục bằng ID

> Đồng bộ từ `spec.md` (`Status: Ready for DEV`, 2026-08-05). `ssr-ba` KHÔNG tự sửa trang này.

## 1. User Story

Là một Dylan, tôi muốn mỗi giao dịch chi tiêu gắn với danh mục qua một mã nhận diện cố định thay vì tên hiển thị, để khi tôi đổi tên một danh mục, các giao dịch đã ghi trước đó vẫn hiển thị đúng dưới tên mới và vẫn cộng đúng vào "Chi thực tế" của danh mục đó.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Danh mục "Ăn uống & đi chợ" của tháng đang chọn chưa có giao dịch nào | Dylan ghi nhận giao dịch "cafe" 45.000đ vào danh mục "Ăn uống & đi chợ" | Giao dịch xuất hiện ở bảng chi tiết chi tiêu, gắn đúng với danh mục "Ăn uống & đi chợ"; "Chi thực tế" của danh mục đổi thành 45.000đ | Xem ASCII Mockup mục 8.1 |
| AC-02 | Danh mục "Di chuyển" đang có 2 giao dịch: "grab" 80.000đ và "xăng xe" 50.000đ | Dylan mở bảng ngân sách theo danh mục của tháng đang chọn | Cột "Chi thực tế" của danh mục "Di chuyển" hiển thị đúng 130.000đ (tổng 2 giao dịch đang gắn với danh mục đó) | Xem ASCII Mockup mục 8.2 |
| AC-03 | Danh mục "Ăn uống" đang có một giao dịch "cafe" 45.000đ đã ghi nhận trước đó, "Chi thực tế" đang là 45.000đ | Dylan đổi tên danh mục "Ăn uống" thành "Ăn uống & đi chợ" | Giao dịch "cafe" 45.000đ vẫn hiển thị gắn với danh mục đó, dưới tên mới "Ăn uống & đi chợ", ở cả bảng chi tiết chi tiêu lẫn bảng ngân sách theo danh mục; "Chi thực tế" của danh mục vẫn giữ nguyên 45.000đ — không tách thành danh mục riêng, không giảm hay biến mất | Xem ASCII Mockup mục 8.2 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-007` | [`../../knowledge/business-rule/BR-007-danh-muc-theo-id.md`](../../knowledge/business-rule/BR-007-danh-muc-theo-id.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered With Notes, triển khai chung một đợt) |
