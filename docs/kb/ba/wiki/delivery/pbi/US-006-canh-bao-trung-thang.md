---
status: Active
feature: US-006
updated: 2026-08-10
spec: docs/features/US-006-canh-bao-trung-thang/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-006", "US-013"]
---

# PBI — US-006 Cảnh báo trùng tháng khi tạo tháng mới

> Đồng bộ từ `spec.md` (`Status: Ready for DEV`, 2026-08-10). `ssr-ba` KHÔNG tự sửa trang này. Bao gồm cả nội dung đã gộp từ raw `US-013` (`docs/memory/decisions.md#dec-065`).

## 1. User Story

Là một Dylan, tôi muốn không thể chọn được một kỳ tháng đã có dữ liệu khi tạo tháng ngân sách mới, và muốn khu vực xem tháng tách biệt rõ khỏi khu vực tạo tháng mới với hai nút cho hai kết quả khác nhau rõ ràng ("Tạo tháng" dùng danh mục mặc định, "Clone tháng đang xem" sao chép từ tháng đang xem), để không bao giờ bấm nhầm nút hay bấm mà không có chuyện gì xảy ra.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Tháng hiện tại theo đồng hồ hệ thống là "2026-08"; đã có dữ liệu cho các tháng "2026-06", "2026-07", "2026-08" | Dylan mở ô "Tạo tháng mới" | Danh sách hiển thị đủ 13 kỳ tháng từ "2026-02" đến "2027-02"; ba dòng "2026-06", "2026-07", "2026-08" hiển thị mờ kèm ghi chú "Đã có dữ liệu" và không bấm chọn được; 10 kỳ tháng còn lại hiển thị rõ nét và bấm chọn được | Chưa có mockup ảnh/design thật; xem ASCII mockup minh họa đúng trạng thái này ở mục 8.2 |
| AC-02 | Đang ở tình huống AC-01, kỳ tháng "2026-09" chưa có dữ liệu | Dylan chọn "2026-09" trong ô "Tạo tháng mới", rồi bấm "Tạo tháng" | Tháng "2026-09" được tạo thành công với danh mục mặc định, chi thực tế bằng 0; ô "Chọn tháng xem" giờ có thêm lựa chọn "2026-09"; ô "Tạo tháng mới" cập nhật lại danh sách, "2026-09" chuyển sang trạng thái mờ "Đã có dữ liệu" | Chưa có mockup ảnh/design thật; xem ASCII mockup minh họa đúng lựa chọn "2026-09" trước khi bấm "Tạo tháng" ở mục 8.2 |
| AC-03 | Đang ở tình huống AC-01, kỳ tháng "2026-10" chưa có dữ liệu, tháng đang xem là "2026-08" có sẵn danh mục "Ăn uống" (ngân sách 3.000.000đ) | Dylan chọn "2026-10" trong ô "Tạo tháng mới", rồi bấm "Clone tháng đang xem" | Tháng "2026-10" được tạo thành công, có danh mục "Ăn uống" với ngân sách 3.000.000đ sao chép từ tháng "2026-08" (tháng đang xem ở khu vực "Chọn tháng xem"), chi thực tế của danh mục này bằng 0; thu nhập của tháng "2026-10" là giá trị mặc định, không sao chép từ tháng "2026-08" | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-04 | Tháng hiện tại là "2026-08"; toàn bộ 13 kỳ tháng từ "2026-02" đến "2027-02" đều đã có dữ liệu | Dylan mở ô "Tạo tháng mới" | Không có kỳ tháng nào trong danh sách chọn được (tất cả hiển thị mờ); nút "Tạo tháng" và "Clone tháng đang xem" bị vô hiệu hóa, kèm ghi chú "Không còn kỳ tháng trống trong 6 tháng trước/sau" | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-05 | Đang ở tình huống AC-01, Dylan đã chọn "2026-09" (chưa có dữ liệu) trong ô "Tạo tháng mới" trên một cửa sổ trình duyệt; ngay trước khi Dylan bấm "Tạo tháng", một cửa sổ trình duyệt khác đã tạo xong tháng "2026-09" | Dylan bấm "Tạo tháng" trên cửa sổ đầu tiên (dữ liệu hiển thị lúc đó chưa biết "2026-09" vừa được tạo ở nơi khác) | Hệ thống không tạo tháng trùng; hiện thông báo lỗi rõ ràng "Tháng này đã tồn tại"; ô "Tạo tháng mới" tự cập nhật, "2026-09" chuyển sang trạng thái mờ "Đã có dữ liệu" | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-06 | Dylan đang mở trang Thu chi, tháng đang xem là "2026-08" | Dylan nhìn vào khu vực xem tháng và khu vực tạo tháng mới | Tiêu đề khu vực xem tháng hiển thị đúng chữ "Chọn tháng xem" (không còn chữ "Chọn tháng"); khu vực tạo tháng mới (ô "Tạo tháng mới", nút "Tạo tháng", nút "Clone tháng đang xem") hiển thị thành một khối tách biệt rõ ràng khỏi khu vực "Chọn tháng xem", không nằm lẫn trong cùng một khối như trước | Xem ASCII Mockup mục 8.1 và 8.2 |
| AC-07 | Đang ở tình huống AC-01, tháng đang xem "2026-08" có một danh mục đã bị Dylan đổi tên/ngân sách khác với bộ danh mục mặc định của hệ thống; kỳ tháng "2026-11" chưa có dữ liệu | Dylan chọn "2026-11" trong ô "Tạo tháng mới", rồi bấm "Tạo tháng" (không phải "Clone tháng đang xem") | Tháng "2026-11" được tạo với đúng bộ danh mục mặc định của hệ thống; danh mục đã tùy chỉnh của tháng "2026-08" không xuất hiện trong tháng "2026-11" — kết quả khác với khi bấm "Clone tháng đang xem" (AC-03) | Chưa có — xem mô tả hành vi ở mục 6 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-014` | [`../../knowledge/business-rule/BR-014-canh-bao-trung-thang.md`](../../knowledge/business-rule/BR-014-canh-bao-trung-thang.md) |
| `BR-015` | [`../../knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md`](../../knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered) |
| Raw `US-013` (gộp) | Không — nội dung đã ở spec này (`docs/memory/decisions.md#dec-065`) |
