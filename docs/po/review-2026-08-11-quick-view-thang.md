# PO Review — Khu vực "Lịch sử thu chi" (thẻ tháng quick view) tại `/budget`

Status: Reviewed
Scope: Một màn hình
Reviewed: 2026-08-11
Owner: ssr-po

## 1. Phạm Vi Đã Review

| Nguồn | Path | Lý do đọc |
| --- | --- | --- |
| Business Flow | `docs/kb/ba/business-flow.md` mục 3, 4 (F3), 7 | Xác nhận F3 (Quản lý theo chu kỳ tháng) và khoảng trống liên quan đã ghi nhận trước đó |
| Source | `components/BudgetApp.tsx:683-759` | Xác nhận hành vi thật của khu vực "Chọn tháng xem" (dropdown) và khu vực thẻ tháng "Lịch sử thu chi" (`month-grid`) |
| Ảnh chụp màn hình do user cung cấp | (đính kèm trong hội thoại) | Cho thấy khu vực thẻ tháng hiển thị 12+ thẻ liên tiếp (2027-02 → 2026-02 và tiếp), khoanh đỏ đúng khu vực cần giới hạn |

## 2. Hiện Trạng

- Người dùng hôm nay thấy: khu vực "Lịch sử thu chi" (`components/BudgetApp.tsx:741-759`, class `month-grid`) render **toàn bộ** tháng đã tạo trong `months`, sắp giảm dần theo `id`, không giới hạn số lượng thẻ. Ảnh chụp màn hình xác nhận đúng hành vi này (12 thẻ liền nhau).
- Đã có sẵn một cách xem tháng khác ở phía trên (`components/BudgetApp.tsx:686-695`): dropdown "Chọn tháng xem", liệt kê toàn bộ `months` để chọn nhanh một tháng bất kỳ, không phụ thuộc vị trí liền kề.
- Rule giới hạn số thẻ hiển thị: chưa có ở bất kỳ đâu trong knowledge base — đây là hành vi mặc định "hiển thị hết" do chưa từng được đặc tả.

## 3. Findings

| ID | Mức | Loại | Nội dung | Bằng chứng |
| --- | --- | --- | --- | --- |
| PO-02 | Medium | UI/UX | Khu vực "Lịch sử thu chi" hiển thị không giới hạn số thẻ tháng thay vì chỉ đóng vai trò "quick view" các tháng liền kề tháng đang xem — gây trang dài khi đã tạo nhiều tháng, làm loãng vai trò quick view so với dropdown "Chọn tháng xem" đã có sẵn cho việc xem tháng xa | `components/BudgetApp.tsx:741-759` |

Đây là opportunity (cơ hội cải tiến UI/UX), không phải defect — hành vi hiện tại không sai dữ liệu, chỉ chưa tối ưu cách trình bày.

## 4. Điểm Mờ Cần Xác Nhận

| # | Điểm mờ | Đã tự trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| 1 | "Tháng trước/tháng sau" tính theo lịch hay theo thứ tự trong danh sách tháng đã tạo? | Không tự trả lời được — ảnh hưởng trực tiếp hành vi khi có tháng chưa tạo ở giữa | Đã xác nhận từ user (2026-08-11, qua `AskUserQuestion`): tính theo thứ tự trong danh sách tháng **đã tạo**, bỏ qua tháng chưa tạo |
| 2 | Ô tương ứng nên hiển thị thế nào khi không có tháng trước/sau (ở đầu hoặc cuối danh sách đã tạo)? | Không tự trả lời được | Đã xác nhận từ user (2026-08-11, qua `AskUserQuestion`): ẩn ô đó — lưới có thể chỉ còn 1-2 thẻ thay vì luôn 3 |
| 3 | Thẻ tháng trước/sau có còn giữ hành vi click-để-chọn (đổi `selectedMonthId`) như hiện tại không? | Có — không có lý do nghiệp vụ nào để bỏ, user không đề cập thay đổi | Giả định hợp lý |

## 5. Cơ Hội Nghiệp Vụ

Không có — đây thuần là cơ hội UI/UX, không đổi kết quả nghiệp vụ.

## 6. Cơ Hội UI/UX

| # | Màn hình | Vấn đề | Đề xuất |
| --- | --- | --- | --- |
| 1 | "Lịch sử thu chi" (khu vực thẻ tháng, trang `/budget`) | Hiển thị không giới hạn số thẻ tháng (đã thấy 12+ thẻ liên tiếp), không đúng vai trò "quick view" mà chỉ nên hiện tháng liền kề tháng đang xem | Giới hạn còn tối đa 3 thẻ: tháng trước, tháng đang xem, tháng sau — tính theo thứ tự trong danh sách tháng **đã tạo** (bỏ qua tháng chưa tạo); ẩn ô nào không có dữ liệu tương ứng; xem tháng xa hơn dùng "Chọn tháng xem" đã có sẵn ở trên |

## 7. Rủi Ro Chất Lượng Và Hiệu Năng

| # | Rủi ro | Bằng chứng | Mức chắc chắn |
| --- | --- | --- | --- |
| 1 | Không có rủi ro hiệu năng đáng kể — thay đổi chỉ giảm số phần tử render (`month-grid` từ N thẻ xuống tối đa 3), không đổi cách tính dữ liệu | `components/BudgetApp.tsx:742-758` | Có bằng chứng source |

## 8. Đề Xuất Ưu Tiên

| Ưu tiên | Đề xuất | Effort | Cần | Lý do |
| --- | --- | --- | --- | --- |
| 1 | Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị tối đa 3 thẻ tháng (trước/đang xem/sau, theo thứ tự tháng đã tạo, ẩn ô thiếu) | Quick win | BA spec | User đã chỉ đạo trực tiếp hành vi mong muốn và cả 2 điểm mờ đã được chốt qua dialog (2026-08-11); chỉ cần BA viết spec + AC, không còn câu hỏi mở |

## 9. Raw Candidate

| # | Nội dung raw đề xuất | Đã được duyệt tạo raw |
| --- | --- | --- |
| 1 | "Là Dylan, tôi muốn khu vực 'Lịch sử thu chi' tại trang Quản lý chi tiêu chỉ hiển thị tối đa 3 thẻ tháng — tháng trước, tháng đang xem, tháng sau, tính theo thứ tự trong danh sách tháng đã tạo (bỏ qua tháng chưa tạo) và ẩn ô nào không có dữ liệu tương ứng — để khu vực này thực sự là quick view nhanh gọn thay vì danh sách dài; muốn xem các tháng xa hơn thì dùng 'Chọn tháng xem' đã có sẵn ở trên" | Chưa — chờ user đồng ý |

`ssr-po` chỉ gọi `ssr-raw` sau khi user cho phép tường minh.
