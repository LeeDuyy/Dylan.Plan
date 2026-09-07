---
status: Active
feature: US-023
updated: 2026-09-07
spec: docs/features/US-023-layout-antd-responsive-toan-app/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-023"]
---

# PBI — US-023 Chuẩn hóa layout toàn app bằng Ant Design, responsive mobile/tablet

> Đồng bộ từ `spec.md` (`Status: Ready for DEV`, 8 AC) ngày 2026-09-07 qua `ssr-ingest mode=sync`.

## 1. User Story

Là Dylan (người dùng duy nhất của ứng dụng kế hoạch cá nhân), tôi muốn toàn bộ sáu tab dùng chung một khung màn hình Ant Design gọn gàng, tận dụng bề ngang màn hình rộng và co gọn dùng được trên điện thoại/máy tính bảng — để dùng ứng dụng thoải mái trên mọi thiết bị, mà nội dung, số liệu và thao tác của từng tab giữ nguyên.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Dylan đang dùng ứng dụng trên màn hình rộng | Dylan mở lần lượt cả sáu tab (Tổng quan, Roadmap, Thời gian biểu, Freelance, Sản phẩm, Thu chi) | Cả sáu tab đều hiển thị trong cùng một khung: cùng thanh tiêu đề trên cùng, cùng vùng chuyển tab, cùng chân trang; tab Thu chi không còn thanh tiêu đề riêng khác các tab kia | Xem ASCII Mockup mục 8.1 |
| AC-02 | Dylan đang xem một tab bất kỳ trên màn hình rộng khoảng 1440 điểm ảnh, và một lần nữa trên màn hình siêu rộng khoảng 2560 điểm ảnh | Dylan quan sát vùng nội dung | Ở khoảng 1440 điểm ảnh: vùng nội dung rộng hơn rõ so với khung khoảng 1220 điểm ảnh trước đây (dùng phần lớn bề ngang, chỉ chừa lề hai bên). Ở khoảng 2560 điểm ảnh: vùng nội dung dừng ở khoảng 2000 điểm ảnh và được căn giữa, không kéo dài hết bề ngang cửa sổ | Xem ASCII Mockup mục 8.1 |
| AC-03 | Dylan mở ứng dụng trên bề ngang khoảng 375 điểm ảnh | Dylan quan sát và bấm nút mở vùng chuyển tab | Vùng chuyển tab thu vào một nút ở thanh tiêu đề; bấm nút mở một bảng trượt liệt kê đủ sáu tab và nút đổi giao diện; chọn một tab thì bảng trượt đóng và nội dung tab đó hiện ra; toàn trang không cuộn ngang, mọi khu vực xếp một cột | Xem ASCII Mockup mục 8.2 |
| AC-04 | Dylan mở ứng dụng trên bề ngang khoảng 768 điểm ảnh | Dylan mở tab Tổng quan và tab Thu chi, rồi chuyển qua lại giữa hai tab bằng vùng chuyển tab | Khung màn hình hiện cả bốn phần (thanh tiêu đề, vùng chuyển tab, vùng nội dung, chân trang); vùng chuyển tab hiện cả sáu nhãn tab trên một hàng ngang (cỡ chữ và khoảng cách nhỏ hơn so với màn hình rộng), không thu vào nút; bấm một nhãn tab thì nội dung đổi sang tab đó; các khu vực nội dung vốn hai cột trở lên trên màn hình rộng rút xuống một đến hai cột; thanh cuộn ngang của cả trang không xuất hiện | Xem ASCII Mockup mục 8.2 |
| AC-05 | Dylan mở tab Thu chi (bảng danh mục chi) và tab Roadmap (bảng theo dõi CV ứng tuyển) trên bề ngang khoảng 375 điểm ảnh | Dylan cuộn ngang trong khu vực bảng | Bảng cuộn ngang bên trong khung riêng của nó để xem đủ các cột; phần còn lại của trang và thanh tiêu đề không bị đẩy hay cuộn theo | Xem ASCII Mockup mục 8.2 |
| AC-06 | Dylan đang ở chế độ sáng trên một tab bất kỳ | Dylan bấm nút đổi giao diện, rồi đóng và mở lại ứng dụng | Thanh tiêu đề, vùng chuyển tab, mọi thẻ, bảng, nút và nhãn trên tab đều chuyển sang chế độ tối cùng lúc, dùng đúng các màu nền/chữ/nhấn quen thuộc của ứng dụng; sau khi mở lại ứng dụng vẫn ở chế độ tối; bấm nút lần nữa thì quay về chế độ sáng | Xem ASCII Mockup mục 8.1 |
| AC-07 | Dylan đang xem tab Thu chi và tab Roadmap sau khi đổi giao diện | Dylan thêm một nguồn thu ở tab Thu chi; thêm một job ở bảng theo dõi CV ứng tuyển ở tab Roadmap | Cả hai thao tác lưu thành công và hiển thị kết quả đúng như trước khi đổi giao diện — nội dung, số liệu và luồng nghiệp vụ không thay đổi | Xem ASCII Mockup mục 8.1 |
| AC-08 | Dylan đang xem một tab đang có dữ liệu và một tab chưa có dữ liệu sau thay đổi | Dylan quan sát các nút, thẻ, bảng, menu người dùng, hộp thoại xác nhận (mở một thao tác xóa rồi hủy) và vùng "chưa có dữ liệu" | Tất cả là thành phần của bộ Ant Design (dáng vẻ và hành vi nhất quán của bộ đó — nút có hiệu ứng khi rê chuột, bảng có phần đầu bảng cố định, khối trống và hộp thoại kiểu bộ đó); vùng "chưa có dữ liệu" và câu chữ hộp thoại giữ nguyên nội dung như trước; không còn thành phần tự dựng rời rạc như trước | Xem ASCII Mockup mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-038` | [`../../knowledge/business-rule/BR-038-layout-antd-responsive-toan-app.md`](../../knowledge/business-rule/BR-038-layout-antd-responsive-toan-app.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-022` (đã Delivered With Notes) | Không |
| `US-018` (task đã Implemented) | Không |
