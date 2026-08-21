---
status: Active
feature: US-010
updated: 2026-08-10
spec: docs/features/US-010-chan-trung-ten-danh-muc/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-010"]
---

# PBI — US-010 Chặn trùng tên danh mục

> Tạo rỗng ở lần `ssr-ingest mode=ingest` đầu tiên. `ssr-ba` KHÔNG tự sửa trang này — bảng dưới đây được `ssr-ingest mode=sync` điền đầy đủ từ `spec.md` sau khi spec đạt `Status: Ready for DEV`. Trang rỗng nghĩa là chưa có spec hoàn chỉnh cho function này.

## 1. User Story

Là Dylan, tôi muốn hệ thống chặn và báo lỗi rõ ràng khi tôi cố thêm mới hoặc sửa tên danh mục thành tên đã trùng (kể cả tên mặc định "Danh mục mới") với một danh mục khác trong cùng tháng, để bảng danh mục luôn có tên riêng biệt và tôi không còn khó xác định gán giao dịch (khi nhập nhanh) vào danh mục nào trong hai danh mục trùng tên.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Tháng đang chọn đã có danh mục "Ăn uống" | Dylan sửa tên một danh mục khác ("Di chuyển") thành " ăn uống" (có khoảng trắng thừa đầu, chữ thường) rồi rời khỏi ô nhập | Ô nhập tên trở lại "Di chuyển" (tên trước khi sửa); thông báo lỗi hiện ra nêu rõ tên "ăn uống" đã tồn tại trong tháng này và yêu cầu đổi tên khác; danh mục "Di chuyển" không đổi tên trên bảng | Xem ASCII Mockup mục 8.1 |
| AC-02 | Tháng đang chọn đã có một danh mục tên "Danh mục mới" (vừa thêm, chưa đổi tên) | Dylan bấm nút "Thêm danh mục" một lần nữa | Không có dòng danh mục mới nào xuất hiện thêm trên bảng; thông báo lỗi hiện ra nêu rõ đã có danh mục "Danh mục mới" trong tháng này và yêu cầu đổi tên danh mục đó trước khi thêm mới | Xem ASCII Mockup mục 8.1 |
| AC-03 | Danh mục "Ăn uống" của tháng đang chọn đang hiển thị | Dylan bấm vào ô nhập tên của chính danh mục "Ăn uống", không đổi ký tự nào, rồi rời khỏi ô nhập | Ô nhập vẫn hiển thị "Ăn uống"; không có thông báo lỗi nào hiện ra trên màn hình | Xem ASCII Mockup mục 8.1 |
| AC-04 | Tháng đang chọn có danh mục "Ăn uống", chưa có danh mục tên "Giải trí" | Dylan sửa tên một danh mục khác thành "Giải trí" rồi rời khỏi ô nhập | Ô nhập hiển thị đúng "Giải trí" trên dòng danh mục đó; không có thông báo lỗi nào hiện ra trên màn hình | Xem ASCII Mockup mục 8.1 |
| AC-05 | Tháng 08/2026 đang có danh mục "Ăn uống"; tháng 09/2026 (khác tháng) cũng đang có danh mục "Ăn uống" | Dylan đang xem tháng 09/2026, thêm một danh mục mới rồi đổi tên nó thành "Ăn uống" | Ô nhập hiển thị đúng "Ăn uống" trên dòng danh mục vừa đổi tên ở tháng 09/2026; không có thông báo lỗi nào hiện ra trên màn hình, dù tháng 08/2026 đã có tên này | Xem ASCII Mockup mục 8.1 |
| AC-06 | Tháng đang chọn chỉ có duy nhất một danh mục "Ăn uống" (không có danh mục nào khác) | Dylan sửa tên danh mục đó thành "Chi tiêu vặt" rồi rời khỏi ô nhập | Ô nhập hiển thị đúng "Chi tiêu vặt"; lưu thành công ngay, không có thông báo lỗi nào hiện ra trên màn hình, vì không có danh mục khác trong tháng để so trùng | Xem ASCII Mockup mục 8.1 |
| AC-07 | Tháng đang chọn đã có danh mục "Ăn uống" (một khoảng trắng giữa hai từ) | Dylan sửa tên một danh mục khác thành "Ăn  uống" (hai khoảng trắng liền giữa hai từ) rồi rời khỏi ô nhập | Ô nhập tên trở lại tên trước khi sửa; thông báo lỗi hiện ra nêu rõ tên "Ăn uống" đã tồn tại trong tháng này và yêu cầu đổi tên khác — hai khoảng trắng liền được rút gọn thành một trước khi so sánh nên vẫn bị coi là trùng | Xem ASCII Mockup mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-017` | [`../../knowledge/business-rule/BR-017-chan-trung-ten-danh-muc.md`](../../knowledge/business-rule/BR-017-chan-trung-ten-danh-muc.md) |
| `BR-010` | [`../../knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md`](../../knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered) |
| `US-005` | Không (đã Delivered) |
