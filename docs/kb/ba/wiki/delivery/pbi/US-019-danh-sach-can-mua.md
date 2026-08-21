---
status: Active
feature: US-019
updated: 2026-08-14
spec: docs/features/US-019-danh-sach-can-mua/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-019"]
---

# PBI — US-019 Danh sách items cần mua theo tháng tại bảng thu chi

> Đã đồng bộ từ `spec.md` (`Status: Ready for DEV`) ngày 2026-08-14.

## 1. User Story

Là Dylan (chủ ngân sách cá nhân), tôi muốn ghi tên sản phẩm cần mua, giá tham khảo tùy chọn, và đánh dấu trạng thái Pending/Purchased ngay trong bảng thu chi của từng tháng — sản phẩm chưa mua tự động mang sang tháng mới khi tạo tháng, tháng cũ chỉ xem — để không phải nhớ trong đầu hay ghi ở nơi khác, giảm nguy cơ quên hoặc mua trùng.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Hôm nay theo đồng hồ hệ thống là một ngày trong tháng "2026-08"; Dylan đang xem tháng "2026-08" — đúng tháng hiện tại; khu vực "Items cần mua" chưa có item nào | Dylan nhập "Mua chuột không dây" vào ô "Tên sản phẩm", để trống ô "Giá", bấm "Thêm item" | Danh sách hiển thị 1 dòng: tên "Mua chuột không dây", cột Giá để trống, badge trạng thái "Pending" màu cam/vàng | Xem ASCII Mockup mục 8.1 |
| AC-02 | Đang ở tình huống AC-01, Ngân sách và Chi thực tế của tháng "2026-08" trước đó lần lượt là 30.000.000đ và 12.000.000đ | Dylan nhập "Mua bàn phím cơ", nhập giá "1tr5" vào ô "Giá", bấm "Thêm item" | Danh sách có thêm dòng "Mua bàn phím cơ" hiển thị giá 1.500.000đ, trạng thái "Pending"; Ngân sách và Chi thực tế của tháng vẫn giữ nguyên 30.000.000đ và 12.000.000đ, không đổi | Xem ASCII Mockup mục 8.1 |
| AC-03 | Đang ở tình huống AC-02, item "Mua bàn phím cơ" đang ở trạng thái Pending | Dylan bấm nút đánh dấu đã mua trên dòng "Mua bàn phím cơ" | Badge trạng thái của dòng đó đổi từ "Pending" (cam/vàng) sang "Purchased" (xanh lá); các dòng khác không đổi | Xem ASCII Mockup mục 8.1 |
| AC-04 | Đang ở tình huống AC-03, danh sách có 2 item: "Mua chuột không dây" (Pending), "Mua bàn phím cơ" (Purchased) | Dylan bấm nút xóa trên dòng "Mua chuột không dây" | Dòng "Mua chuột không dây" biến mất khỏi danh sách ngay lập tức; chỉ còn lại "Mua bàn phím cơ" (Purchased) | Xem ASCII Mockup mục 8.1 |
| AC-05 | Hôm nay theo đồng hồ hệ thống là một ngày trong tháng "2026-08" — "2026-08" là tháng hiện tại; tháng "2026-07" đã có 2 item: "Mua quà sinh nhật" (Pending), "Mua sách" (Purchased) | Dylan đổi ô "Chọn tháng xem" sang "2026-07" | Khu vực "Items cần mua" hiển thị đủ 2 dòng "Mua quà sinh nhật" và "Mua sách" với đúng trạng thái đã lưu; không có ô nhập "Tên sản phẩm"/"Giá", không có nút "Thêm item", không có nút đánh dấu đã mua hay nút xóa trên cả hai dòng — vì "2026-07" không phải tháng hiện tại, dù đang được chọn xem | Xem ASCII Mockup mục 8.2 |
| AC-06 | Hôm nay theo đồng hồ hệ thống là một ngày trong tháng "2026-08" — "2026-08" là tháng hiện tại, đang có 2 item: "Mua chuột không dây" (Pending), "Mua bàn phím cơ" (Purchased); kỳ tháng "2026-09" chưa có dữ liệu; Dylan đang xem tháng "2026-08" | Dylan chọn "2026-09" ở ô "Tạo tháng mới", bấm "Tạo tháng" (không phải "Clone tháng đang xem") | Tháng "2026-09" được tạo; khu vực "Items cần mua" của "2026-09" có đúng 1 item "Mua chuột không dây" (Pending); quay lại xem tháng "2026-08", danh sách chỉ còn "Mua bàn phím cơ" (Purchased) — "Mua chuột không dây" không còn hiển thị ở "2026-08" nữa | Xem ASCII Mockup mục 8.1 |
| AC-07 | Đang ở tình huống AC-06 nhưng Dylan bấm "Clone tháng đang xem" thay vì "Tạo tháng" | Dylan bấm "Clone tháng đang xem" | Kết quả giống hệt AC-06 đối với item cần mua: tháng "2026-09" có "Mua chuột không dây" (Pending), tháng "2026-08" chỉ còn "Mua bàn phím cơ" (Purchased) — không phụ thuộc vào việc "Clone tháng đang xem" có sao chép thêm cấu trúc danh mục ngân sách hay không | Xem ASCII Mockup mục 8.1 |
| AC-08 | Dylan đang xem đúng tháng hiện tại, ô "Tên sản phẩm" đang để trống | Dylan không nhập gì vào ô "Tên sản phẩm", quan sát nút "Thêm item" | Nút "Thêm item" hiển thị ở trạng thái vô hiệu hóa (mờ, không bấm được) cho tới khi Dylan nhập ít nhất một ký tự vào ô "Tên sản phẩm" | Xem ASCII Mockup mục 8.1 |
| AC-09 | Đang ở tháng hiện tại, item "Mua chuột không dây" đang có giá để trống | Dylan bấm vào ô Tên sản phẩm của dòng đó, sửa thành "Mua chuột Logitech", rời khỏi ô | Tên hiển thị trên dòng đó đổi ngay thành "Mua chuột Logitech"; giá và trạng thái của dòng không đổi | Xem ASCII Mockup mục 8.1 |
| AC-10 | Đang ở tháng hiện tại, item "Mua bàn phím cơ" đang có giá 1.500.000đ | Dylan bấm vào ô Giá của dòng đó, sửa thành "2tr", rời khỏi ô | Giá hiển thị trên dòng đó đổi ngay thành 2.000.000đ; tên và trạng thái của dòng không đổi; Ngân sách/Chi thực tế của tháng vẫn không đổi | Xem ASCII Mockup mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-022` | [`../../knowledge/business-rule/BR-022-gia-item-khong-cong-ngan-sach.md`](../../knowledge/business-rule/BR-022-gia-item-khong-cong-ngan-sach.md) |
| `BR-023` | [`../../knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md`](../../knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md) |
| `BR-024` | [`../../knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md`](../../knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-006` | Không (đã `Implemented`) |
| `US-001` | Không (đã `Implemented`) |
