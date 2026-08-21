---
status: Active
feature: US-017
updated: 2026-08-12
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-017"]
---

# US-017 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-017-sap-xep-danh-muc-keo-tha.md`](../feature/US-017-sap-xep-danh-muc-keo-tha.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Cho phép Dylan kéo thả trực tiếp một dòng danh mục trên bảng ngân sách để đổi vị trí hiển thị của nó. Thứ tự mới lưu bền vững và đồng bộ sang cả 3 nơi dùng chung danh sách danh mục (bảng, dropdown nhận diện, biểu đồ cơ cấu chi tiêu). Danh mục khóa vẫn kéo thả được; riêng "Chi tiêu khác" không tham gia, luôn cố định ở cuối bảng. Khi Clone tháng, thứ tự danh mục ở tháng mới giữ nguyên theo tháng nguồn. Spec `Ready for DEV`, 8 AC.

## 2. Rule Cốt Lõi

- `BR-020` Thứ tự sau kéo thả lưu bền vững, đồng bộ 3 nơi, danh mục khóa vẫn kéo thả được, Clone tháng giữ nguyên thứ tự theo tháng nguồn
- `BR-016` "Chi tiêu khác" luôn ở cuối bảng — kéo thả không đổi luật này

## 3. Phụ Thuộc Chính

- `US-001` Depends on — cần data model `Category` bền vững để lưu thứ tự
- `US-006` Impacts — nút "Clone tháng đang xem" có thêm ràng buộc thứ tự, cần follow-up cập nhật spec US-006
- `US-014` Related only — cùng đổi thứ tự hiển thị nhưng khác cơ chế, phải tôn trọng `BR-016`
