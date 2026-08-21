---
status: Active
feature: US-006
updated: 2026-08-10
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-006", "US-013"]
---

# US-006 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-006-canh-bao-trung-thang.md`](../feature/US-006-canh-bao-trung-thang.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng. Bao gồm nội dung đã gộp từ raw `US-013`.

## 1. Tóm Tắt Một Đoạn

Khi Dylan tạo tháng ngân sách mới với kỳ tháng đã tồn tại, hệ thống hiện âm thầm không làm gì. Function này đổi ô "Tạo tháng mới" thành combobox liệt kê 13 kỳ tháng (6 trước — tháng hiện tại — 6 sau); kỳ đã có dữ liệu hiển thị mờ, không chọn được — ngăn trùng tháng ngay từ thao tác chọn thay vì báo lỗi sau khi bấm nút. Kèm lớp bảo vệ dự phòng báo lỗi rõ ràng nếu có tạo trùng do thao tác đồng thời (hai cửa sổ trình duyệt). Đồng thời (gộp từ US-013): nhãn khu vực xem tháng đổi thành "Chọn tháng xem", tách hẳn thành khối riêng khỏi khu vực tạo tháng mới; nút "Clone tháng hiện tại" đổi tên thành "Clone tháng đang xem" và luôn sao chép cấu trúc danh mục của tháng đang xem, trong khi "Tạo tháng" luôn dùng danh mục mặc định.

## 2. Rule Cốt Lõi

- `BR-014` Ngăn trùng tháng bằng cách disable kỳ tháng đã có dữ liệu ngay trong combobox, kèm báo lỗi dự phòng khi tạo trùng đồng thời
- `BR-015` "Tạo tháng" dùng danh mục mặc định; "Clone tháng đang xem" sao chép cấu trúc danh mục từ tháng đang xem

## 3. Phụ Thuộc Chính

- `US-001` Related only — đã có bảng tháng bền vững (`MonthBudget`) và logic tạo tháng, chỉ đổi cách chọn kỳ tháng
- Raw `US-013` gộp thẳng vào spec này, không có spec/plan/task riêng
