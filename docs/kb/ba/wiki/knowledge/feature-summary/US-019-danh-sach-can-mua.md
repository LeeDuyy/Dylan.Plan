---
status: Active
feature: US-019
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-019"]
---

# US-019 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-019-danh-sach-can-mua.md`](../feature/US-019-danh-sach-can-mua.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Thêm một khu vực "Items cần mua" vào bảng thu chi, cho Dylan ghi tên sản phẩm, giá tùy chọn và trạng thái Pending (cam/vàng)/Purchased (xanh lá) cho từng tháng. Giá không ảnh hưởng tới ngân sách. Ở tháng đang chọn, Dylan thêm/sửa (inline)/xóa/đổi trạng thái được; khi tạo tháng mới (bằng "Tạo tháng" hoặc "Clone tháng đang xem"), item còn Pending tự chuyển sang tháng mới và biến mất khỏi tháng gốc. Tháng khác chỉ xem. Spec `Ready for DEV`, 10 AC, thuộc epic F3, phục vụ mục tiêu `M3` của Business Flow.

## 2. Rule Cốt Lõi

- `BR-022` Giá item chỉ là ghi chú, không cộng ngân sách
- `BR-023` Item Pending chuyển hẳn sang tháng mới khi bấm "Tạo tháng"/"Clone tháng đang xem", ẩn khỏi tháng gốc
- `BR-024` Chỉ thao tác (kể cả sửa inline) được ở tháng đang chọn, tháng khác chỉ xem

## 3. Phụ Thuộc Chính

- `US-006` Depends on — dùng chung nút/luồng tạo tháng mới để kích hoạt chuyển item; đã `Implemented`, không chặn
