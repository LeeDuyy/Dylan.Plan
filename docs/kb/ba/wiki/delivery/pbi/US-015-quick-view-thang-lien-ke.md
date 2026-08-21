---
status: Active
feature: US-015
updated: 2026-08-11
spec: docs/features/US-015-quick-view-thang-lien-ke/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-015"]
---

# PBI — US-015 Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view

> Điền từ `ssr-ingest mode=sync` sau khi spec đạt `Status: Ready for DEV`. `ssr-ba` KHÔNG tự sửa trang này.

## 1. User Story

Là Dylan (chủ ngân sách, người dùng duy nhất của hệ thống), tôi muốn khu vực "Lịch sử thu chi" chỉ hiển thị tối đa 3 thẻ tháng — tháng liền trước, tháng đang xem, tháng liền sau (tính theo vị trí trong danh sách các tháng đã tạo, ẩn thẻ nào không có tháng tương ứng) — để tôi nắm nhanh tình hình 3 tháng gần tháng đang xem mà không phải cuộn qua danh sách dài; xem tháng khác thì dùng ô "Chọn tháng xem" đã có sẵn.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Các tháng đã tạo (theo thứ tự): "2026-05", "2026-06", "2026-08", "2026-09", "2026-11" (chưa từng tạo "2026-07" và "2026-10"); tháng đang xem là "2026-08" | Dylan mở trang Thu chi | Khu vực "Lịch sử thu chi" hiển thị đúng 3 thẻ: "2026-06" (tháng trước), "2026-08" (đang xem, có dấu hiệu nổi bật), "2026-09" (tháng sau) — không hiển thị "2026-07" vì tháng đó chưa từng được tạo | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.1 |
| AC-02 | Cùng danh sách tháng đã tạo như AC-01; tháng đang xem là "2026-05" (tháng đầu tiên trong danh sách đã tạo) | Dylan mở trang Thu chi | Khu vực "Lịch sử thu chi" chỉ hiển thị 2 thẻ: "2026-05" (đang xem) và "2026-06" (tháng sau) — không có thẻ nào ở vị trí "tháng trước" | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.1 |
| AC-03 | Cùng danh sách tháng đã tạo như AC-01; tháng đang xem là "2026-11" (tháng cuối cùng trong danh sách đã tạo) | Dylan mở trang Thu chi | Khu vực "Lịch sử thu chi" chỉ hiển thị 2 thẻ: "2026-09" (tháng trước) và "2026-11" (đang xem) — không có thẻ nào ở vị trí "tháng sau" | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.1 |
| AC-04 | Dylan mới bắt đầu dùng hệ thống, chỉ có đúng một tháng đã được tạo: "2026-08" (chính là tháng đang xem) | Dylan mở trang Thu chi | Khu vực "Lịch sử thu chi" chỉ hiển thị 1 thẻ duy nhất: "2026-08" (đang xem) | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.1 |
| AC-05 | Đang ở tình huống AC-01 (đang xem "2026-08", 3 thẻ hiển thị: "2026-06", "2026-08", "2026-09") | Dylan bấm vào thẻ "2026-09" (thẻ tháng sau) | Tháng đang xem đổi thành "2026-09"; khu vực "Lịch sử thu chi" cập nhật lại, hiển thị 3 thẻ mới: "2026-08" (tháng trước), "2026-09" (đang xem, có dấu hiệu nổi bật), "2026-11" (tháng sau) | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.1 |
| AC-06 | Đang ở tình huống AC-01 (đang xem "2026-08"); Dylan muốn xem tháng "2026-05" — tháng này không nằm trong 3 thẻ đang hiển thị | Dylan mở ô "Chọn tháng xem" phía trên khu vực "Lịch sử thu chi" và chọn "2026-05" | Tháng đang xem đổi thành "2026-05" ngay lập tức, không cần bấm qua từng thẻ liền kề; khu vực "Lịch sử thu chi" cập nhật lại theo tháng "2026-05" (xem AC-02) | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.2 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-018` | [`../../knowledge/business-rule/BR-018-quick-view-3-the-thang.md`](../../knowledge/business-rule/BR-018-quick-view-3-the-thang.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không — đã Delivered With Notes |
| `US-006` | Không — chỉ dùng chung ô "Chọn tháng xem", không đổi hành vi |
