---
status: Active
feature: US-005
updated: 2026-08-06
spec: docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-005"]
---

# PBI — US-005 Ràng buộc toàn vẹn danh mục + giao dịch không danh mục

> Đồng bộ từ `spec.md` (`Status: Ready for DEV`, 2026-08-06). `ssr-ba` KHÔNG tự sửa trang này.

## 1. User Story

Là một Dylan, tôi muốn xóa một danh mục đang có giao dịch luôn thành công (giao dịch tự chuyển sang "Chi tiêu khác", kèm thông báo rõ ràng) và ghi nhận chi tiêu được ngay cả khi không chọn danh mục nào, để không giao dịch nào bị mất liên kết danh mục hay bị mất dữ liệu.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Danh mục thường "Giải trí / cafe" của tháng đang chọn đang có 3 giao dịch, tháng đó chưa có danh mục "Chi tiêu khác" | Dylan bấm nút xóa trên danh mục "Giải trí / cafe" | Danh mục "Giải trí / cafe" biến mất khỏi bảng ngân sách; một dòng "Chi tiêu khác" mới xuất hiện với Loại "Linh hoạt", Ngân sách 0 đ, "Chi thực tế" bằng đúng tổng 3 giao dịch đó; toast hiện "Đã xóa 'Giải trí / cafe'. 3 giao dịch đã chuyển sang Chi tiêu khác."; đúng 3 giao dịch đó xuất hiện ở bảng chi tiết chi tiêu, mỗi giao dịch gắn nhãn danh mục "Chi tiêu khác" | Xem ASCII Mockup mục 8.2 |
| AC-02 | Danh mục thường "Dự phòng" của tháng đang chọn chưa có giao dịch nào | Dylan bấm nút xóa trên danh mục "Dự phòng" | Danh mục "Dự phòng" biến mất khỏi bảng ngân sách ngay; toast hiện "Đã xóa 'Dự phòng'."; không có dòng "Chi tiêu khác" nào xuất hiện thêm | Xem ASCII Mockup mục 8.2 |
| AC-03 | Tháng đang chọn chưa có danh mục "Chi tiêu khác"; Dylan gõ "sửa xe máy 200k" vào ô nhập nhanh — nội dung không khớp từ khóa của danh mục nào hiện có | Dylan xem ô chọn danh mục, rồi bấm "Ghi nhận" mà không chọn danh mục nào | Ô chọn danh mục tự hiển thị trạng thái trống, không có danh mục nào được chọn sẵn; nút "Ghi nhận" vẫn bấm được; sau khi bấm, giao dịch "sửa xe máy 200k" xuất hiện ở bảng chi tiết chi tiêu, gắn với danh mục "Chi tiêu khác" mới xuất hiện trên bảng ngân sách với Loại "Linh hoạt", Ngân sách 0 đ, "Chi thực tế" 200.000đ | Xem ASCII Mockup mục 8.1 |
| AC-04 | "Chi tiêu khác" của tháng đang chọn đang có giao dịch | Dylan xem dòng "Chi tiêu khác" trên bảng ngân sách theo danh mục | Dòng "Chi tiêu khác" hiển thị tên, "Chi thực tế" và "Còn lại" dạng chữ thường (không phải ô nhập); không có ô nhập cho tên/loại/ngân sách; không có nút xóa ở cuối dòng | Xem ASCII Mockup mục 8.2 |
| AC-05 | "Chi tiêu khác" của tháng đang chọn chỉ đang có đúng một giao dịch | Dylan xóa giao dịch duy nhất đó (ở bảng chi tiết chi tiêu) | Dòng "Chi tiêu khác" biến mất khỏi bảng ngân sách theo danh mục ngay sau khi xóa | Xem ASCII Mockup mục 8.2 |
| AC-06 | Danh mục thường "Ăn uống" của tháng đang chọn đang có 2 giao dịch, danh mục "Chi tiêu khác" trong tháng đó đã tồn tại sẵn (đang có 1 giao dịch khác từ trước) | Dylan bấm nút xóa trên danh mục "Ăn uống" | Danh mục "Ăn uống" biến mất; "Chi tiêu khác" (không tạo thêm bản ghi mới) tăng "Chi thực tế" lên đúng tổng 3 giao dịch (1 giao dịch cũ + 2 giao dịch vừa chuyển); toast hiện "Đã xóa 'Ăn uống'. 2 giao dịch đã chuyển sang Chi tiêu khác." | Xem ASCII Mockup mục 8.2 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-008` | [`../../knowledge/business-rule/BR-008-xoa-chuyen-chi-tieu-khac.md`](../../knowledge/business-rule/BR-008-xoa-chuyen-chi-tieu-khac.md) |
| `BR-009` | [`../../knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md`](../../knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md) |
| `BR-010` | [`../../knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md`](../../knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md) |
| `BR-011` | [`../../knowledge/business-rule/BR-011-bo-qua-danh-muc.md`](../../knowledge/business-rule/BR-011-bo-qua-danh-muc.md) |
| `BR-012` | [`../../knowledge/business-rule/BR-012-an-khi-het-giao-dich.md`](../../knowledge/business-rule/BR-012-an-khi-het-giao-dich.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered) |
| `US-003` | Không (đã Delivered) |
| `US-004` | Không (đã Delivered) — AC-05 dùng thao tác xóa giao dịch của `US-004` để kiểm chứng |
