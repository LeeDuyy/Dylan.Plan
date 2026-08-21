---
status: Active
feature: US-017
updated: 2026-08-12
spec: docs/features/US-017-sap-xep-danh-muc-keo-tha/spec.md
owner: ssr-ingest
tags: [kb/ba/wiki/delivery/pbi]
aliases: ["US-017"]
---

# PBI — US-017 Sắp xếp vị trí danh mục bằng kéo thả (Drag-and-drop row reordering)

> Tạo rỗng ở lần `ssr-ingest mode=ingest` đầu tiên. `ssr-ba` KHÔNG tự sửa trang này — bảng dưới đây được `ssr-ingest mode=sync` điền đầy đủ từ `spec.md` sau khi spec đạt `Status: Ready for DEV`. Trang rỗng nghĩa là chưa có spec hoàn chỉnh cho function này.

## 1. User Story

Là một Dylan, tôi muốn kéo thả để sắp xếp lại vị trí các danh mục trên bảng ngân sách, để nhóm hoặc sắp xếp danh mục theo mức độ quan trọng hay thói quen theo dõi cá nhân, thay vì bị ràng buộc theo thứ tự tạo.

## 2. Tiêu Chí Chấp Nhận

| ID | Given | When | Then | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Bảng ngân sách của tháng đang xem có 4 danh mục thường theo thứ tự: "Tiền nhà", "Ăn uống", "Di chuyển", "Giải trí" | Dylan kéo dòng "Di chuyển" lên vị trí đầu tiên và thả | Bảng hiển thị ngay thứ tự mới: "Di chuyển", "Tiền nhà", "Ăn uống", "Giải trí" | Xem ASCII Mockup mục 8.1 |
| AC-02 | Đang ở tình huống AC-01, vừa kéo thả xong | Dylan tải lại trang Thu chi | Bảng vẫn hiển thị đúng thứ tự vừa kéo thả: "Di chuyển", "Tiền nhà", "Ăn uống", "Giải trí" — không quay về thứ tự cũ | Xem ASCII Mockup mục 8.1 |
| AC-03 | Đang ở tình huống AC-01, vừa kéo thả xong | Dylan mở dropdown "Danh mục nhận diện" ở khu nhập nhanh chi tiêu | Danh sách lựa chọn trong dropdown hiển thị đúng thứ tự mới: "Di chuyển", "Tiền nhà", "Ăn uống", "Giải trí" | Xem ASCII Mockup mục 8.2 |
| AC-04 | Đang ở tình huống AC-01, vừa kéo thả xong | Dylan xem biểu đồ "Cơ cấu chi tiêu" | Thứ tự các danh mục trong biểu đồ khớp đúng thứ tự mới: "Di chuyển", "Tiền nhà", "Ăn uống", "Giải trí" | Xem ASCII Mockup mục 8.3 |
| AC-05 | Bảng ngân sách có danh mục "Tiền nhà" đang ở trạng thái khóa (không có nút xóa) | Dylan kéo dòng "Tiền nhà" tới một vị trí khác trong bảng và thả | Dòng "Tiền nhà" đổi sang vị trí mới thành công, giống như kéo thả một danh mục thường | Xem ASCII Mockup mục 8.1 |
| AC-06 | Tháng đang xem có "Chi tiêu khác" đang hiển thị (còn giao dịch) ở dòng cuối cùng, cộng 3 danh mục thường phía trên | Dylan thử nhấn giữ và kéo dòng "Chi tiêu khác" | Dòng "Chi tiêu khác" không di chuyển theo thao tác kéo, vẫn giữ nguyên ở vị trí cuối cùng | Xem ASCII Mockup mục 8.1 |
| AC-07 | Tháng nguồn đang xem có 3 danh mục theo thứ tự đã kéo thả: "Di chuyển", "Tiền nhà", "Ăn uống" | Dylan bấm nút "Clone tháng đang xem" để tạo tháng mới | Tháng mới được tạo với 3 danh mục xuất hiện đúng theo thứ tự của tháng nguồn: "Di chuyển", "Tiền nhà", "Ăn uống" | Xem ASCII Mockup mục 8.4 |
| AC-08 | Bảng ngân sách đang hiển thị đúng thứ tự hiện tại của các danh mục, và lần lưu thứ tự kế tiếp sẽ gặp lỗi (ví dụ mất kết nối tạm thời) | Dylan kéo một dòng danh mục sang vị trí mới và thả | Bảng vẫn hiển thị đúng thứ tự trước khi kéo thả — không danh mục nào bị mất vị trí; thứ tự chỉ đổi khi Dylan thử kéo thả lại và lưu thành công | Xem ASCII Mockup mục 8.1 |

## 3. Business Rule Áp Dụng

| Rule | Trang |
| --- | --- |
| `BR-020` | [`../../knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md`](../../knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md) |
| `BR-016` | [`../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md`](../../knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) |

## 4. Phụ Thuộc

| Đối tượng | Chặn triển khai |
| --- | --- |
| `US-001` | Không (đã Delivered With Notes) |
| `US-014` | Không (đã Ready for DEV) |
| `US-006` | Không (đã Ready for DEV) |
| `US-005` | Không (đã Ready for DEV) |
