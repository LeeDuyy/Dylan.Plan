---
status: Active
updated: 2026-08-06
owner: ssr-po
tags: [backlog]
aliases: ["Backlog", "Hệ Thống Quản Lý Chi Tiêu (Dylan Expense Manager)"]
---

# Backlog — Hệ Thống Quản Lý Chi Tiêu (Dylan Expense Manager)

Status: US-001, US-002, US-003, US-004, US-005 đã Delivered/Delivered With Notes (xem ghi chú dưới bảng); US-006 đến US-011 (trừ đã liệt kê) đã tạo raw, chờ chạy `ssr-pipeline` (hoặc `ssr-ba`) cho từng mã để viết spec; #12 là đề xuất mới (defect), chưa được duyệt tạo raw
Updated: 2026-08-06 (US-005 hoàn tất pipeline, verdict `Pass With Notes` — `docs/features/US-005-rang-buoc-toan-ven-danh-muc/report.md`; PO review cùng ngày phát hiện defect nhận diện danh mục nhập nhanh khi tên danh mục bị đổi, thêm đề xuất #12 — `docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md`; trước đó 2026-08-03 user duyệt "DUYỆT TẠO CHO 11 US"; `ssr-raw` đã cấp mã US-001..US-011 và tạo raw + BA wiki stub cho tất cả; bổ sung DEC-037 (di trú dữ liệu US-001), DEC-038 (nơi lưu ngưỡng US-009) — xem `docs/memory/decisions.md` DEC-005..DEC-038)
Nguồn: `docs/kb/ba/business-flow.md` mục 7 (Khoảng Trống Và Ưu Tiên) + mục 8 (Quyết Định Đã Chốt Với User)

> Danh sách dưới đây là các User Story **đề xuất**, rút ra từ khoảng trống quan sát được trong `components/DylanPlanApp.tsx`.
> Mã `US-###-<slug>` chỉ được gán chính thức khi `ssr-raw` tạo raw requirement cho US đó — trước khi user duyệt, cột "Mã" để trống.
> Thứ tự trong bảng là thứ tự triển khai đề xuất (xem business-flow.md mục 7), không phải thứ tự ưu tiên tuyệt đối nếu user muốn đổi.

## Danh sách User Story đề xuất

| # | Mã | Tên US (đề xuất) | Mô tả ngắn | Luồng | Mục tiêu | Ưu tiên | Effort | Duyệt tạo raw |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | US-001 | Lưu trữ chi tiêu bền vững (data model + migration) | Chuyển dữ liệu tháng/danh mục/giao dịch từ `localStorage` sang Prisma + SQLite | F1, F2, F3, F4 | M1 | Cao | Medium | Đã tạo raw |
| 2 | US-002 | Route/module riêng cho Quản lý chi tiêu | Tách route riêng tại `/budget` (DEC-005) khỏi shell chung Dylan Plan Dashboard, dùng chung codebase Next.js | F1, F2, F3, F4 | M2 | Trung bình | Medium | Đã tạo raw |
| 3 | US-003 | Liên kết giao dịch theo danh mục bằng ID | Giao dịch tham chiếu danh mục qua ID thay vì tên chuỗi, tránh lệch dữ liệu khi đổi tên danh mục | F1, F2 | M1 | Trung bình | Quick win | Đã tạo raw |
| 4 | US-004 | Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu | Cho sửa đầy đủ 4 trường (nội dung, số tiền, danh mục, ngày — ngày chỉ nhận giá trị ≤ hôm nay theo DEC-017) hoặc xóa (có xác nhận) một giao dịch của tháng đang chọn; "Chi thực tế" tính lại tự động từ tổng giao dịch thay vì lưu tay (DEC-007, DEC-008, DEC-009, DEC-010, DEC-017) | F1, F2 | M1 | Cao | Medium | Đã tạo raw |
| 5 | US-005 | Ràng buộc toàn vẹn danh mục + giao dịch không danh mục | Xóa một danh mục thường chuyển giao dịch sang "Chi tiêu khác" (tự sinh khi tháng chưa có, khóa vĩnh viễn, chỉ xem — DEC-024, DEC-026, DEC-027); F1 nới để Dylan bỏ qua chọn danh mục khi ghi nhận, giao dịch đó tự vào "Chi tiêu khác" (DEC-028); "Chi tiêu khác" tự ẩn khỏi giao diện khi hết giao dịch (DEC-029) | F2, F1 | M1 | Trung bình | Medium | Đã tạo raw |
| 6 | US-006 | Cảnh báo trùng tháng khi tạo tháng mới | Thông báo rõ ràng khi người dùng tạo một tháng đã tồn tại | F3 | M2 | Thấp | Quick win | Đã tạo raw |
| 7 | US-007 | Phân tích xu hướng trên toàn bộ lịch sử đã lưu | Tính insight/biểu đồ xu hướng từ dữ liệu bền vững (DB) thay vì chỉ các tháng đang có trong state trình duyệt | F4 | M1 | Trung bình | Quick win | Đã tạo raw |
| 8 | US-008 | Xuất dữ liệu từ nguồn lưu trữ bền vững | Xuất JSON đọc từ database thay vì chỉ từ state trình duyệt hiện tại | F4 | M1 | Thấp | Quick win | Đã tạo raw |
| 9 | US-009 | Cấu hình ngưỡng ngân sách | Cho Dylan tự cấu hình ngưỡng cảnh báo vượt ngân sách (mặc định 90%), mục tiêu tổng chi (mặc định ≤ 30M) và quỹ linh hoạt (mặc định 7.5M) thay vì cố định trong code (DEC-006); lưu trên từng tháng ngân sách (DEC-038) | F2, F4 | M1 | Trung bình | Medium | Đã tạo raw |
| 10 | US-010 | Chặn trùng tên danh mục | Khi thêm mới hoặc sửa tên danh mục, chặn và báo lỗi nếu tên trùng (không phân biệt hoa/thường, bỏ khoảng trắng thừa) với một danh mục khác trong cùng tháng (DEC-020, DEC-021, DEC-022) | F2, F1 | M1 | Trung bình | Quick win | Đã tạo raw |
| 11 | US-011 | Mini dashboard 3/6/9/12 tháng gần đây | Mở rộng F4: biểu đồ tổng chi thực tế theo tháng so với ngân sách/thu nhập, chọn khoảng 3/6/9/12 tháng tính từ tháng hiện tại theo đồng hồ hệ thống lùi về trước, bỏ qua tháng chưa được tạo (DEC-032, DEC-033, DEC-034, DEC-036); phụ thuộc M1 (DEC-035) | F4 | M1 | Trung bình | Medium | Đã tạo raw |
| 12 | US-012 | Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi | Là Dylan, tôi muốn giao dịch luôn được ghi nhận (đúng danh mục nếu xác định được, hoặc vào "Chi tiêu khác" nếu không) kể cả khi tôi đã đổi tên một danh mục mặc định, để không bao giờ mất một giao dịch mà không hay biết (defect PO-01, tái hiện thật 2026-08-06 — `docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md`) | F1 | M1 | Cao | Quick win | Đã tạo raw |
| 13 | US-015 | Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view | Là Dylan, tôi muốn khu vực "Lịch sử thu chi" chỉ hiển thị tối đa 3 thẻ tháng — tháng trước, tháng đang xem, tháng sau (theo thứ tự trong danh sách tháng đã tạo, ẩn ô thiếu — DEC-071, DEC-072) — để khu vực này thực sự là quick view thay vì danh sách dài; xem tháng xa hơn dùng "Chọn tháng xem" đã có (opportunity PO-02, `docs/po/review-2026-08-11-quick-view-thang.md`) | F3 | M2 | Trung bình | Quick win | Đã tạo raw |
| 14 | US-016 | Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định | Là Dylan, tôi muốn cột "Loại" trong bảng danh mục không còn là ô nhập chữ tự do mà là combobox chỉ cho chọn đúng 3 giá trị cố định — "Cố định", "Tích lũy", "Khác" (thay thế hoàn toàn "Linh hoạt" cũ) — để không thể gõ nhầm hoặc tạo ra giá trị Loại rác như đã từng xảy ra ("Linh s"); dữ liệu Loại cũ được migrate theo quy tắc đã chốt (DEC-073); thẻ insight "Chi linh hoạt" đổi tên thành "Chi khác" | F2 | M1 | Cao | Quick win | Đã tạo raw (defect + opportunity PO-03, `docs/po/review-2026-08-11-loai-chi-tieu-combobox.md`) |
| 15 | US-019 | Danh sách items cần mua theo tháng tại bảng thu chi | Là Dylan, tôi muốn ghi tên sản phẩm cần mua, giá tham khảo tùy chọn, và đánh dấu Pending/Purchased ngay trong bảng thu chi của từng tháng — sản phẩm chưa mua tự động mang sang tháng mới khi tạo tháng, tháng cũ chỉ xem — để không phải nhớ trong đầu hay ghi ở nơi khác, giảm quên/mua trùng (yêu cầu trực tiếp của user, không phải audit; mở rộng mục tiêu mới M3, `DEC-105`) | F3 | M3 | Trung bình | Medium | Đã tạo raw, đang viết spec (`docs/features/US-019-danh-sach-can-mua/spec.md`) |

## Thứ tự triển khai đề xuất (theo phụ thuộc kỹ thuật)

1. **#1** — Lưu trữ chi tiêu bền vững — nền tảng bắt buộc, mọi US khác phụ thuộc vào đây (DEC-001, DEC-003).
2. **#2** — Route/module riêng tại `/budget` — làm trước hoặc song song #1, vì đây là nơi UI sẽ gọi vào dữ liệu bền vững (DEC-002, DEC-005).
3. **#3** — Liên kết giao dịch theo ID — phải làm cùng lúc với #1, thuộc thiết kế data model, làm sau sẽ phải migrate lại.
4. **#4, #5, #6, #10** — Sửa/xóa giao dịch tại bảng chi tiết chi tiêu (kèm tính lại "Chi thực tế" từ tổng giao dịch), ràng buộc khi xóa danh mục, cảnh báo trùng tháng, chặn trùng tên danh mục — thao tác hằng ngày, làm ngay sau khi có nền tảng dữ liệu bền vững.
5. **#9** — Cấu hình ngưỡng ngân sách — làm sau khi có data model bền vững vì cần nơi lưu ngưỡng theo tháng/người dùng (DEC-006).
6. **#7, #8, #11** — Phân tích lịch sử đầy đủ, xuất dữ liệu từ DB, và mini dashboard 3/6/9/12 tháng — chỉ có ý nghĩa sau khi dữ liệu nhiều tháng đã được lưu bền vững (DEC-035).

## Bước tiếp theo

User đã duyệt "DUYỆT TẠO CHO 11 US" (2026-08-03). `ssr-raw` đã cấp mã US-001..US-011, tạo raw + BA wiki stub cho từng US, và cập nhật `docs/requirements-index.md` + `docs/kb/ba/00-index.md`. Bước tiếp theo là chạy `ssr-pipeline` (hoặc `ssr-ba` riêng lẻ) cho từng mã để viết spec — khuyến nghị theo đúng thứ tự triển khai đã đề xuất bên dưới, bắt đầu US-001 (cùng lúc US-003).

Riêng US #4: không cần thiết kế undo sau khi xóa giao dịch — đã chốt tại DEC-031 (không phát triển undo), hộp xác nhận trước khi xóa (DEC-009) là lớp bảo vệ duy nhất.

## Nguồn bằng chứng

| Bằng chứng | Path |
| --- | --- |
| Business Flow gốc, mục 7 và 8 | `docs/kb/ba/business-flow.md` |
| Quyết định đã chốt liên quan | `docs/memory/decisions.md` (DEC-001 .. DEC-036; DEC-023 và DEC-025 đã Superseded) |
