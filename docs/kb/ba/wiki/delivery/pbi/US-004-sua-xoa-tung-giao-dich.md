---
status: Active
feature: US-004
updated: 2026-08-05
spec: docs/features/US-004-sua-xoa-tung-giao-dich/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-004"]
---

# PBI — US-004 Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu

> Đồng bộ từ `spec.md` (`Status: Ready for DEV`, 2026-08-05). `ssr-ba` KHÔNG tự sửa trang này.

## 1. User Story

Là một Dylan, tôi muốn sửa đầy đủ nội dung, số tiền, danh mục và ngày của một giao dịch chi tiêu nhập sai, hoặc xóa riêng một giao dịch (có xác nhận trước), để không phải xóa sạch toàn bộ giao dịch của cả tháng rồi nhập lại từ đầu chỉ vì một giao dịch nhập sai.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Tháng đang chọn có giao dịch "cafe" 45.000đ, danh mục "Giải trí / cafe", ghi ngày hôm nay | Dylan bấm nút "Sửa" trên giao dịch đó | Dòng giao dịch mở rộng thành 4 ô nhập đã điền sẵn: nội dung "cafe", số tiền 45.000, danh mục "Giải trí / cafe", ngày hôm nay | Xem ASCII Mockup mục 8.1 |
| AC-02 | Dòng giao dịch "cafe" 45.000đ đang ở chế độ sửa; danh mục "Giải trí / cafe" đang có "Chi thực tế" là 45.000đ | Dylan đổi ô số tiền thành 55.000 và bấm "Lưu" | Giao dịch hiển thị lại với số tiền 55.000đ; "Chi thực tế" của danh mục "Giải trí / cafe" đổi thành 55.000đ (tăng đúng phần chênh lệch 10.000đ) | Xem ASCII Mockup mục 8.1 |
| AC-03 | Giao dịch "grab" 80.000đ đang gắn danh mục "Di chuyển" (Chi thực tế 80.000đ); danh mục "Ăn uống" đang có "Chi thực tế" 200.000đ | Dylan mở sửa giao dịch đó, đổi danh mục thành "Ăn uống", bấm "Lưu" | "Chi thực tế" của "Di chuyển" giảm còn 0đ; "Chi thực tế" của "Ăn uống" tăng thành 280.000đ; giao dịch hiển thị gắn với danh mục "Ăn uống" | Xem ASCII Mockup mục 8.1 |
| AC-04 | Dòng một giao dịch đang ở chế độ sửa, ô ngày hiện đang là hôm nay | Dylan chọn một ngày ở tương lai (vd ngày mai) rồi bấm "Lưu" | Hệ thống chặn lưu, hiện thông báo lỗi ngay tại ô ngày yêu cầu chọn ngày không ở tương lai; giao dịch vẫn giữ nguyên giá trị ngày cũ, dòng vẫn ở chế độ sửa | Xem ASCII Mockup mục 8.1 |
| AC-05 | Tháng đang chọn có giao dịch "taxi" 60.000đ | Dylan bấm nút "Xóa" trên giao dịch đó | Dòng hiện câu hỏi "Bạn có chắc muốn xóa giao dịch này?" kèm hai nút "Xác nhận xóa" và "Hủy"; giao dịch "taxi" 60.000đ vẫn còn nguyên trong danh sách, chưa bị xóa. Nếu Dylan bấm "Hủy": câu hỏi và hai nút biến mất, dòng hiện lại đúng như trước khi bấm "Xóa" (nội dung "taxi", số tiền 60.000đ, nút "Sửa"/"Xóa") | Xem ASCII Mockup mục 8.1 |
| AC-06 | Dòng giao dịch "taxi" 60.000đ đang ở trạng thái xác nhận xóa; danh mục "Di chuyển" đang có "Chi thực tế" 60.000đ | Dylan bấm "Xác nhận xóa" | Giao dịch "taxi" biến mất khỏi danh sách; "Chi thực tế" của danh mục "Di chuyển" giảm còn 0đ | Xem ASCII Mockup mục 8.1 |
| AC-07 | Dòng giao dịch "cafe" 45.000đ đang ở chế độ sửa, Dylan đã đổi số tiền thành 99.000 nhưng chưa lưu | Dylan bấm "Hủy" thay vì "Lưu" | 4 ô nhập biến mất, dòng hiện lại đúng nội dung "cafe" và số tiền 45.000đ (giá trị 99.000 vừa gõ không được lưu), kèm nút "Sửa"/"Xóa" như trước khi bấm "Sửa"; "Chi thực tế" của danh mục giữ nguyên, không đổi | Xem ASCII Mockup mục 8.1 |
| AC-08 | Tháng đang chọn có 10 giao dịch (nhiều hơn 8) | Dylan mở bảng chi tiết chi tiêu của tháng đang chọn | Đếm được đúng 10 dòng giao dịch trong danh sách (không dừng ở 8 dòng như trước), sắp theo thứ tự giao dịch mới nhất ở trên cùng; mỗi dòng đều có đủ nút "Sửa" và "Xóa" | Xem ASCII Mockup mục 8.1 |
| AC-09 | Tháng đang chọn chưa có giao dịch nào | Dylan mở bảng chi tiết chi tiêu của tháng đang chọn | Danh sách hiển thị trống, không có dòng giao dịch nào; không có nút "Sửa" hay "Xóa" nào xuất hiện trên màn hình vì không có giao dịch nào để thao tác | Xem ASCII Mockup mục 8.1 |
| AC-10 | Dòng giao dịch "cafe" 45.000đ đang ở chế độ sửa | Dylan xóa trắng ô nội dung, hoặc sửa ô số tiền thành 0 hoặc một số âm | Nút "Lưu" chuyển sang trạng thái tắt (không bấm được) ngay khi ô nội dung rỗng hoặc số tiền không hợp lệ; giao dịch chưa bị thay đổi; nút "Lưu" chỉ bật lại khi Dylan nhập lại nội dung không rỗng và số tiền hợp lệ | Xem ASCII Mockup mục 8.1 |
| AC-11 | Giao dịch "taxi" 60.000đ đang mở ở chế độ sửa trên một tab; cùng giao dịch đó vừa bị xóa từ một tab/thiết bị khác trước khi tab đang sửa kịp lưu | Dylan bấm "Lưu" trên tab đang sửa | Hệ thống chặn lưu, hiện thông báo "Giao dịch này vừa được thay đổi ở nơi khác, hãy tải lại để xem bản mới nhất"; danh sách không tạo lại giao dịch "taxi" đã bị xóa từ tab kia | Xem ASCII Mockup mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-001` | [`../../knowledge/business-rule/BR-001-sua-day-du-4-truong.md`](../../knowledge/business-rule/BR-001-sua-day-du-4-truong.md) |
| `BR-002` | [`../../knowledge/business-rule/BR-002-xoa-can-xac-nhan.md`](../../knowledge/business-rule/BR-002-xoa-can-xac-nhan.md) |
| `BR-003` | [`../../knowledge/business-rule/BR-003-chi-thang-dang-chon.md`](../../knowledge/business-rule/BR-003-chi-thang-dang-chon.md) |
| `BR-004` | [`../../knowledge/business-rule/BR-004-ngay-khong-tuong-lai.md`](../../knowledge/business-rule/BR-004-ngay-khong-tuong-lai.md) |
| `BR-005` | [`../../knowledge/business-rule/BR-005-khong-undo.md`](../../knowledge/business-rule/BR-005-khong-undo.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered) |
| `US-003` | Không (đã Delivered, gộp chung US-001) |
