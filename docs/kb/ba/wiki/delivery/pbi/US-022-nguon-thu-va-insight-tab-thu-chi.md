---
status: Active
feature: US-022
updated: 2026-09-07
spec: docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-022"]
---

# PBI — US-022 Nguồn thu, sửa insight tiết kiệm, tháng mặc định và bỏ giới hạn tháng cho Item cần mua tại tab Thu chi

> Đồng bộ từ `spec.md` (`Status: Ready for DEV`, 13 AC) ngày 2026-09-07 qua `ssr-ingest mode=sync`.

## 1. User Story

Là Dylan (người dùng duy nhất quản lý thu chi cá nhân), tôi muốn khai báo các nguồn thu thật của từng tháng và thấy các chỉ số tiết kiệm được tính đúng, tách bạch, mở tab đúng vào tháng đang quan tâm, và ghi đồ cần mua cho cả các tháng sắp tới — để kiểm soát tài chính dựa trên số liệu chính xác thay vì con số thu nhập cố định 35.000.000 đồng không sửa được.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Dylan đang xem tháng "2026-09" có 2 nguồn thu tổng 30.000.000đ và bảng "Nguồn thu" đang hiển thị | Dylan nhập tên "Thưởng dự án" và số tiền 5.000.000, bấm "Thêm nguồn thu" | Một dòng "Thưởng dự án — 5.000.000đ" xuất hiện ở cuối bảng; dòng tổng "Thu nhập tháng" đổi thành 35.000.000đ; ô "Thu nhập tháng" trong khu vực insight cũng hiển thị 35.000.000đ | Xem ASCII Mockup spec mục 8.1 |
| AC-02 | Dylan đang xem tháng "2026-09" có nguồn thu "Lương" 25.000.000đ, "Thu nhập tháng" là 25.000.000đ, "Tổng chi" là 20.000.000đ | Dylan sửa số tiền dòng "Lương" thành 28.000.000 và rời khỏi ô nhập | Dòng tổng "Thu nhập tháng" đổi thành 28.000.000đ; ô "Số dư còn lại" đổi thành 8.000.000đ; ô "Tiết kiệm ròng" đổi thành 8.000.000đ | Xem ASCII Mockup spec mục 8.1 |
| AC-03 | Dylan đang xem tháng "2026-09" chỉ còn 1 nguồn thu "Lương" 25.000.000đ | Dylan xóa dòng "Lương" | Bảng "Nguồn thu" trống; dòng tổng "Thu nhập tháng" hiển thị 0đ; ô "Tỷ lệ tiết kiệm" hiển thị dấu gạch ngang thay cho phần trăm | Xem ASCII Mockup spec mục 8.1 |
| AC-04 | Dylan đang xem tháng "2026-09" có "Thu nhập tháng" 20.000.000đ và "Tổng chi" 23.000.000đ | Dylan mở khu vực "Insight tài chính" | Ô "Tiết kiệm ròng" hiển thị số âm 3.000.000đ; ô "Số dư còn lại" cũng hiển thị -3.000.000đ; ô "Tỷ lệ tiết kiệm" hiển thị -15,0%; ô "Tỷ lệ sử dụng thu nhập" hiển thị 115,0%; không có câu chữ nào nhắc mốc mục tiêu 30.000.000đ hay 90% | Xem ASCII Mockup spec mục 8.2 |
| AC-05 | Dylan đang xem tháng "2026-09"; các danh mục Loại "Tích lũy" có tổng Chi thực tế 6.000.000đ, các danh mục khác không thuộc Loại "Tích lũy" có phát sinh chi | Dylan mở khu vực "Insight tài chính" | Ô "Đã phân bổ vào tích lũy" hiển thị 6.000.000đ — đúng bằng tổng Chi thực tế của riêng các danh mục Loại "Tích lũy", không phụ thuộc tên danh mục | Xem ASCII Mockup spec mục 8.2 |
| AC-06 | Hôm nay theo lịch là tháng "2026-09"; dữ liệu có các tháng "2026-06", "2026-07" và "2026-11" nhưng chưa có tháng "2026-09" | Dylan mở tab Thu chi | Ô "Chọn tháng xem" hiển thị sẵn "2026-07" và nội dung tab hiển thị dữ liệu tháng "2026-07"; khi "2026-07" và "2026-11" cách đều tháng hiện tại thì chọn tháng ở quá khứ | Xem ASCII Mockup spec mục 8.3 |
| AC-07 | Hôm nay theo lịch là tháng "2026-09"; dữ liệu có tháng "2026-11" (tương lai) và tháng "2026-06" (đã kết thúc) | Dylan chọn xem tháng "2026-11", thêm một item "Bàn phím" giá 1.200.000; sau đó Dylan chọn xem tháng "2026-06" | Ở tháng "2026-11": item "Bàn phím" được thêm, có ô nhập và nút thao tác. Ở tháng "2026-06": danh sách item hiển thị nhưng không có nút thêm, ô tên/giá không sửa được, không có nút đánh dấu đã mua hay nút xóa | Xem ASCII Mockup spec mục 8.4 |
| AC-08 | Dylan đang xem một tháng có nhiều nguồn thu | Dylan tạo một tháng ngân sách mới bằng nút "Clone tháng đang xem" và chuyển sang xem tháng vừa tạo | Bảng "Nguồn thu" của tháng mới trống; dòng tổng "Thu nhập tháng" hiển thị 0đ; khu vực "Quy tắc kiểm soát" và khu vực insight không hiển thị câu chữ nào nêu mốc 7.500.000đ hay 31.500.000đ | Xem ASCII Mockup spec mục 8.1 |
| AC-09 | Tháng "2026-05" đã tồn tại từ trước khi tính năng nguồn thu ra mắt, có "Thu nhập tháng" cố định 35.000.000đ và chưa có dòng nguồn thu nào | Việc chuyển dữ liệu một lần được chạy khi tính năng ra mắt | Tháng "2026-05" có đúng một dòng nguồn thu tên "Lương" số tiền 35.000.000đ; dòng tổng "Thu nhập tháng" vẫn hiển thị 35.000.000đ; các chỉ số tổng của tháng giữ nguyên như trước khi chuyển | Xem ASCII Mockup spec mục 8.1 |
| AC-10 | Dylan đang xem tháng "2026-09" có 3 nguồn thu theo thứ tự "Lương", "Freelance", "Thưởng"; "Thu nhập tháng" là 33.000.000đ | Dylan kéo dòng "Thưởng" lên vị trí đầu tiên rồi thả | Thứ tự hiển thị đổi thành "Thưởng", "Lương", "Freelance"; dòng tổng "Thu nhập tháng" vẫn là 33.000.000đ; sau khi rời tab và mở lại tháng "2026-09", thứ tự vẫn là "Thưởng", "Lương", "Freelance" | Xem ASCII Mockup spec mục 8.1 |
| AC-11 | Dylan đang xem tháng "2026-09" đã có một nguồn thu tên "Thưởng" số tiền 2.000.000đ; "Thu nhập tháng" là 2.000.000đ | Dylan nhập tên "Thưởng" và số tiền 3.000.000, bấm "Thêm nguồn thu" | Bảng "Nguồn thu" hiển thị hai dòng "Thưởng" riêng biệt (một 2.000.000đ, một 3.000.000đ); dòng tổng "Thu nhập tháng" đổi thành 5.000.000đ | Xem ASCII Mockup spec mục 8.1 |
| AC-12 | Dylan đang xem tháng "2026-09", đã nhập tên "Thưởng" và số tiền 1.000.000 vào ô thêm nguồn thu; bảng đang có "Thu nhập tháng" 30.000.000đ | Dylan bấm "Thêm nguồn thu" nhưng thao tác lưu không thành công | Màn hình hiện thông báo ngắn "Có lỗi xảy ra, vui lòng thử lại."; bảng "Nguồn thu" không có dòng mới và dòng tổng "Thu nhập tháng" vẫn là 30.000.000đ | Xem ASCII Mockup spec mục 8.1 |
| AC-13 | Hôm nay theo lịch là tháng "2026-09"; dữ liệu có tháng "2026-06" (đã kết thúc) với 2 nguồn thu "Lương" 25.000.000đ và "Freelance" 4.000.000đ | Dylan chọn xem tháng "2026-06" | Bảng "Nguồn thu" hiển thị đúng hai dòng "Lương" 25.000.000đ và "Freelance" 4.000.000đ; không có ô "Thêm nguồn thu"; bấm vào ô tên hoặc ô số tiền của một dòng không cho gõ sửa; không có nút xóa ở cuối dòng; kéo một dòng không làm đổi vị trí | Xem ASCII Mockup spec mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-033` | [`../../knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md`](../../knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md) |
| `BR-034` | [`../../knowledge/business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md`](../../knowledge/business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md) |
| `BR-035` | [`../../knowledge/business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md`](../../knowledge/business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md) |
| `BR-036` | [`../../knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md`](../../knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md) |
| `BR-037` | [`../../knowledge/business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md`](../../knowledge/business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-006` (đã Implemented) | Không |
| `US-016` (đã Implemented — cần trường Loại danh mục cho "Đã phân bổ vào tích lũy") | Không |
| `US-019` (Impacts — `BR-024` → `BR-036`) | Không |
