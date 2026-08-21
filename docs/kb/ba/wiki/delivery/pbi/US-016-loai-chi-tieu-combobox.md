---
status: Active
feature: US-016
updated: 2026-08-11
spec: docs/features/US-016-loai-chi-tieu-combobox/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-016"]
---

# PBI — US-016 Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định

> Tạo rỗng ở lần `ssr-ingest mode=ingest` đầu tiên. `ssr-ba` KHÔNG tự sửa trang này — bảng dưới đây được `ssr-ingest mode=sync` điền đầy đủ từ `spec.md` sau khi spec đạt `Status: Ready for DEV`. Trang rỗng nghĩa là chưa có spec hoàn chỉnh cho function này.

## 1. User Story

Là Dylan, tôi muốn cột "Loại" trong bảng danh mục không còn là ô nhập chữ tự do mà là một danh sách chọn (combobox) chỉ cho chọn đúng 3 giá trị cố định — "Cố định", "Tích lũy", "Khác" — để tôi không thể vô tình gõ nhầm hoặc tạo ra một giá trị Loại rác như đã từng xảy ra ("Linh s"), và bảng danh mục luôn chỉ mang đúng những giá trị Loại có nghĩa.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Danh mục "Ăn uống" trong tháng đang chọn đang có Loại "Cố định" | Dylan bấm vào ô Loại của danh mục "Ăn uống" | Một danh sách chọn hiện ra đúng 3 lựa chọn: "Cố định", "Tích lũy", "Khác"; ô này không cho gõ ký tự nào | Xem ASCII Mockup mục 8.1 |
| AC-02 | Ô Loại của danh mục "Ăn uống" đang mở danh sách chọn (AC-01) | Dylan chọn "Tích lũy" | Ô Loại hiển thị ngay "Tích lũy"; giá trị được lưu lại cho danh mục "Ăn uống", không cần thao tác lưu riêng | Xem ASCII Mockup mục 8.1 |
| AC-03 | Trước khi tính năng này triển khai, danh mục "Tiền nhà" có Loại "Cố định" và danh mục "Tiết kiệm / đầu tư" có Loại "Tích lũy" | Dylan mở bảng danh mục sau khi tính năng này đã triển khai xong | Ô Loại của "Tiền nhà" vẫn hiển thị "Cố định"; ô Loại của "Tiết kiệm / đầu tư" vẫn hiển thị "Tích lũy" — không đổi | Xem ASCII Mockup mục 8.1 |
| AC-04 | Trước khi tính năng này triển khai, danh mục "Ăn uống" có Loại "Linh hoạt" và một danh mục khác có Loại "Linh s" (dữ liệu lỗi do gõ dở dang) | Dylan mở bảng danh mục sau khi tính năng này đã triển khai xong | Ô Loại của cả "Ăn uống" và danh mục kia đều hiển thị "Khác" | Xem ASCII Mockup mục 8.1 |
| AC-05 | Dylan đang xem bảng danh mục của tháng hiện tại | Dylan bấm nút "Thêm danh mục" | Một dòng danh mục mới xuất hiện với Loại mặc định là "Khác" | Xem ASCII Mockup mục 8.1 |
| AC-06 | Tháng đang chọn chưa có danh mục "Chi tiêu khác"; Dylan ghi nhận một giao dịch mà không chọn danh mục nào | Giao dịch được ghi nhận, kích hoạt tự sinh "Chi tiêu khác" theo quy tắc đã có | Danh mục "Chi tiêu khác" xuất hiện trên bảng danh mục với Loại là "Khác" | Xem ASCII Mockup mục 8.1 |
| AC-07 | Tháng đang chọn có tổng chi thực tế của các danh mục Loại "Khác" là 3.000.000đ | Dylan xem khu vực Phân tích | Thẻ insight hiển thị tên "Chi khác" (không còn "Chi linh hoạt") với giá trị 3.000.000đ | Xem ASCII Mockup mục 8.2 |
| AC-08 | Danh mục "Ăn uống" đang có Loại "Cố định"; Dylan đã mở danh sách chọn ở ô Loại (AC-01) | Dylan chọn "Tích lũy" nhưng việc lưu bị lỗi (mất kết nối hoặc lỗi máy chủ) | Ứng dụng hiện thông báo lỗi chung đã có sẵn; ô Loại của "Ăn uống" vẫn hiển thị "Cố định" cho tới khi Dylan chọn lại và lưu thành công | Xem ASCII Mockup mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-019` | [`../../knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md`](../../knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md) |
| `BR-009` | [`../../knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md`](../../knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered) |
| `US-005` | Không (đã Delivered) — spec này có tác động follow-up tới `US-005` (mục 11 của spec), không phải phụ thuộc chặn |
