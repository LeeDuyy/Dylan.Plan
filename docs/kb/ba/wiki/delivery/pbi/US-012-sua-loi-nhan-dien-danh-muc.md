---
status: Active
feature: US-012
updated: 2026-08-06
spec: docs/features/US-012-sua-loi-nhan-dien-danh-muc/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-012"]
---

# PBI — US-012 Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi

> Đồng bộ từ `spec.md` (`Status: Ready for DEV`, 2026-08-06). `ssr-ba` KHÔNG tự sửa trang này.

## 1. User Story

Là một Dylan, tôi muốn giao dịch luôn được ghi nhận thành công (đúng danh mục nếu suy ra được bằng so khớp gần đúng, hoặc vào "Chi tiêu khác" nếu không) ngay cả khi tôi đã đổi tên một danh mục mặc định, để không bao giờ mất một giao dịch mà không hay biết.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Tháng đang chọn có danh mục tên "Ăn uống & đi chợ" (đã đổi tên từ "Ăn uống"), chưa có giao dịch nào trong danh mục này | Dylan gõ "ăn tối 300k" vào ô nhập nhanh, xem ô chọn danh mục, rồi bấm "Ghi nhận" | Ô chọn danh mục tự động hiển thị "Ăn uống & đi chợ" (không phải "Chưa xác định"); sau khi bấm "Ghi nhận", giao dịch "ăn tối 300k" xuất hiện trong danh sách giao dịch của tháng, gắn danh mục "Ăn uống & đi chợ"; "Chi thực tế" của "Ăn uống & đi chợ" tăng thêm 300.000đ | Chưa có — chưa có mockup ảnh/design cho ô nhập nhanh, xem mô tả hành vi ở mục 6 spec |
| AC-02 | Tháng đang chọn không còn danh mục nào có tên chứa "Ăn uống" (Dylan đã xóa hẳn danh mục đó, giao dịch cũ nếu có đã chuyển sang "Chi tiêu khác" theo US-005) | Dylan gõ "ăn tối 300k" vào ô nhập nhanh, rồi bấm "Ghi nhận" mà không tự chọn danh mục nào | Ô chọn danh mục hiển thị "Chưa xác định"; bấm "Ghi nhận" vẫn tạo giao dịch thành công, gắn vào danh mục "Chi tiêu khác" (tự sinh nếu tháng chưa có) — không có trường hợp nào không ghi nhận được gì | Chưa có — xem mô tả hành vi ở mục 6 spec |
| AC-03 | Tháng đang chọn có danh mục "Di chuyển" (chưa từng đổi tên) | Dylan gõ "grab 20k" vào ô nhập nhanh, rồi bấm "Ghi nhận" | Ô chọn danh mục hiển thị đúng "Di chuyển" như trước giờ; giao dịch được ghi nhận đúng vào "Di chuyển" — xác nhận việc sửa lỗi không làm hỏng trường hợp tên danh mục chưa bị đổi | Chưa có — xem mô tả hành vi ở mục 6 spec |
| AC-04 | Tháng đang chọn có cả hai danh mục "Ăn uống linh tinh" và "Ăn uống & đi chợ" (cùng chứa cụm "Ăn uống"), "Ăn uống linh tinh" đứng trước trên bảng ngân sách | Dylan gõ "ăn tối 300k" vào ô nhập nhanh, rồi bấm "Ghi nhận" | Ô chọn danh mục tự động hiển thị "Ăn uống linh tinh" (danh mục đứng trước theo thứ tự hiển thị trong hai danh mục cùng khớp), không phải "Ăn uống & đi chợ"; giao dịch được ghi nhận vào đúng danh mục đó | Chưa có — xem mô tả hành vi ở mục 6 spec |
| AC-05 | Tháng đang chọn chưa có danh mục nào cả (danh sách danh mục rỗng), kể cả "Chi tiêu khác" | Dylan gõ "ăn tối 300k" vào ô nhập nhanh, rồi bấm "Ghi nhận" mà không tự chọn danh mục nào | Ô chọn danh mục hiển thị "Chưa xác định" (không có danh mục nào để so khớp); bấm "Ghi nhận" vẫn tạo giao dịch thành công — hệ thống tự sinh danh mục "Chi tiêu khác" và gắn giao dịch vào đó, không có trường hợp ghi nhận thất bại chỉ vì tháng đang trống danh mục | Chưa có — xem mô tả hành vi ở mục 6 spec |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-013` | [`../../knowledge/business-rule/BR-013-so-khop-gan-dung-danh-muc.md`](../../knowledge/business-rule/BR-013-so-khop-gan-dung-danh-muc.md) |
| `BR-011` | [`../../knowledge/business-rule/BR-011-bo-qua-danh-muc.md`](../../knowledge/business-rule/BR-011-bo-qua-danh-muc.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered) |
| `US-005` | Không (đã Delivered) |
