---
status: Active
feature: US-010
updated: 2026-08-10
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-010"]
---

# US-010 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-010-chan-trung-ten-danh-muc.md`](../feature/US-010-chan-trung-ten-danh-muc.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Chặn và báo lỗi rõ ràng khi Dylan cố thêm mới hoặc sửa tên danh mục thành tên đã trùng với một danh mục khác trong cùng tháng đang chọn — kể cả khi trùng với tên mặc định "Danh mục mới" do hệ thống tự đặt lúc bấm "Thêm danh mục". So sánh bỏ qua khác biệt hoa/thường, khoảng trắng thừa đầu/cuối, và rút gọn khoảng trắng lặp ở giữa. Không tự đổi tên hay thêm hậu tố — Dylan phải tự chọn tên khác. Không áp dụng cho "Chi tiêu khác" (khóa vĩnh viễn, không có thao tác sửa tên). Giá trị đo được: bảng danh mục của mỗi tháng luôn có tên riêng biệt, giúp nhập nhanh xác định đúng danh mục cần gán. Spec `Ready for DEV`, 7 AC.

## 2. Rule Cốt Lõi

- `BR-017` Chặn trùng tên danh mục (thêm mới/sửa tên, kể cả tên mặc định), so sánh chuẩn hóa hoa/thường, khoảng trắng thừa và khoảng trắng lặp giữa, trong cùng tháng.

## 3. Phụ Thuộc Chính

- `US-001` Depends on — cần data model `Category` bền vững để áp ràng buộc.
- `US-005` Depends on — cần dòng "Chi tiêu khác" đã hiển thị dạng chỉ đọc để loại trừ nó khỏi kiểm tra có ý nghĩa.
