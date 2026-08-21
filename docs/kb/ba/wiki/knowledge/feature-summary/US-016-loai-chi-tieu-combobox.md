---
status: Active
feature: US-016
updated: 2026-08-11
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-016"]
---

# US-016 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-016-loai-chi-tieu-combobox.md`](../feature/US-016-loai-chi-tieu-combobox.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Đổi cột "Loại" trong bảng danh mục từ ô nhập chữ tự do sang combobox chỉ cho chọn đúng 3 giá trị cố định: "Cố định", "Tích lũy", "Khác" — "Khác" thay thế hoàn toàn "Linh hoạt" cũ. Dữ liệu thật xác nhận rủi ro đã xảy ra (giá trị lỗi "Linh s"). Migrate một lần: Cố định/Tích lũy giữ nguyên, Linh hoạt và giá trị lỗi chuyển thành Khác. Đồng bộ 3 nơi hard-code "Linh hoạt" (seed mặc định, nút Thêm danh mục, "Chi tiêu khác" tự sinh) sang "Khác". Thẻ insight "Chi linh hoạt" đổi tên thành "Chi khác". Giá trị đo được: không còn khả năng tạo ra giá trị "Loại" ngoài 3 lựa chọn hợp lệ. Nguồn: PO review PO-03 (defect + opportunity). Spec `Ready for DEV`, 8 AC.

## 2. Rule Cốt Lõi

- `BR-019` "Loại" danh mục giới hạn đúng 3 giá trị cố định, chọn qua combobox, không nhập tự do; "Khác" thay "Linh hoạt".

## 3. Phụ Thuộc Chính

- `US-001` Depends on — cần data model `Category` bền vững để chạy migrate dữ liệu.
- `US-005` Impacts — đổi giá trị "Loại" mặc định của "Chi tiêu khác" khi tự sinh.
