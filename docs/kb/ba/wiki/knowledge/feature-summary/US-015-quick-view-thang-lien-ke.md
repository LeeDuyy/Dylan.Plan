---
status: Active
feature: US-015
updated: 2026-08-11
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-015"]
---

# US-015 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-015-quick-view-thang-lien-ke.md`](../feature/US-015-quick-view-thang-lien-ke.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Khu vực "Lịch sử thu chi" tại trang Thu chi hiện hiển thị toàn bộ tháng ngân sách đã tạo, không giới hạn số lượng, làm mất vai trò quick view. US-015 giới hạn khu vực này chỉ còn tối đa 3 thẻ tháng — tháng trước, tháng đang xem, tháng sau — tính theo danh sách tháng đã tạo, ẩn thẻ nào không có dữ liệu tương ứng. Xem tháng khác thì dùng "Chọn tháng xem" đã có sẵn. Spec đạt `Ready for DEV` với 6 AC.

## 2. Rule Cốt Lõi

- `BR-018` Khu vực "Lịch sử thu chi" chỉ hiển thị tối đa 3 thẻ tháng (trước/đang xem/sau) theo danh sách tháng đã tạo, ẩn ô thiếu.

## 3. Phụ Thuộc Chính

- `US-001` Depends on — cần danh sách tháng ngân sách đã lưu bền vững để xác định thứ tự "đã tạo".
- `US-006` Related only — cùng luồng F3, cùng trang Thu chi, không đổi logic của nhau.
