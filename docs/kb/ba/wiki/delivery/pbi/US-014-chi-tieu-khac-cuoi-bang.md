---
status: Active
feature: US-014
updated: 2026-08-10
spec: docs/features/US-014-chi-tieu-khac-cuoi-bang/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-014"]
---

# PBI — US-014 Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục

> Đồng bộ từ `spec.md` (`Status: Ready for DEV`, 2026-08-10). `ssr-ba` KHÔNG tự sửa trang này.

## 1. User Story

Là một Dylan, tôi muốn danh mục "Chi tiêu khác" luôn hiển thị ở cuối danh sách danh mục (bảng ngân sách, ô chọn danh mục nhập nhanh, biểu đồ cơ cấu chi tiêu), để không còn tình huống nó nằm giữa các danh mục khác chỉ vì thời điểm được tạo ra.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Tháng đang xem có "Chi tiêu khác" đang hiển thị (còn giao dịch) và có 3 danh mục thường khác | Dylan mở bảng ngân sách theo danh mục | "Chi tiêu khác" hiển thị ở dòng cuối cùng của bảng; 3 danh mục thường còn lại theo đúng thứ tự tương đối đã có trước đó | Chưa có mockup ảnh/design thật; xem ASCII mockup minh họa đúng trạng thái này ở mục 8.1 |
| AC-02 | Đang ở tình huống AC-01 | Dylan bấm "Thêm danh mục" để thêm một danh mục mới tên "Danh mục mới" | Danh mục "Danh mục mới" xuất hiện ngay trước "Chi tiêu khác" trong bảng; "Chi tiêu khác" vẫn ở dòng cuối cùng | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-03 | Tháng đang xem chưa từng phát sinh nhu cầu dùng "Chi tiêu khác" — không có giao dịch nào gán vào nó | Dylan mở bảng ngân sách theo danh mục | Không có dòng "Chi tiêu khác" nào trong bảng; thứ tự các danh mục còn lại giữ nguyên như trước khi có thay đổi này | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-04 | Đang ở tình huống AC-01 | Dylan mở ô "Danh mục nhận diện" ở khu nhập nhanh chi tiêu | "Chi tiêu khác" xuất hiện ở cuối danh sách lựa chọn trong ô này, sau 3 danh mục thường | Chưa có mockup ảnh/design thật; xem ASCII mockup minh họa đúng trạng thái này ở mục 8.2 |
| AC-05 | Đang ở tình huống AC-01 | Dylan xem biểu đồ "Cơ cấu chi tiêu" | Danh mục "Chi tiêu khác" nằm ở vị trí cuối cùng trong biểu đồ, sau 3 danh mục thường còn lại | Chưa có — xem mô tả hành vi ở mục 8.3 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-016` | [`../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md`](../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-005` | Không (đã `Ready for DEV`) |
