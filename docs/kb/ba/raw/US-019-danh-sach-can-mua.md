---
status: Raw
feature: US-019
created: 2026-08-14
source: Chat
requester: Dylan
priority: Trung bình
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-019"]
---

# Raw Requirement — Danh sách items cần mua theo tháng tại bảng thu chi

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-019 |
| Slug | danh-sach-can-mua |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | spec (dừng sau khi có spec `Ready for DEV`, chưa sang plan/dev) |
| Cần report | Không |
| Spec dự kiến | `docs/features/US-019-danh-sach-can-mua/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Tại bảng thu chi: tôi muốn có danh sách các items cần mua, tại đó tôi có thể note tên sản phẩm, giá (không bắt buộc) và trạng thái chưa mua/đã mua(tiếng anh)- phân biệt rõ bằng 2 màu sắc.
Khi đang xem ở tháng hiện tại, thì sẽ hiển thị sp chưa mua và đã mua. Khi qua tháng mới sẽ mặc định clone hiển thị sản phẩm chưa mua của tháng trước + sản phẩm của tháng này. Các sản phẩm clone tại 1 thời điểm chỉ hiển thị tại 1 tháng, không được trùng nhau, ví dụ nếu quay về tháng cũ thì chỉ xem được các SP đã mua và không được thêm mới hoặc chỉnh sửa thông tin gì
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Route module Quản lý chi tiêu | `/budget` | `docs/memory/decisions.md#dec-005` | Đã xác nhận |
| Bảng thu chi hiện tại | Component `BudgetApp.tsx`, có khái niệm "Tháng ngân sách" (`MonthBudget`) và lựa chọn tháng đang xem qua `selectedMonthId` | `components/BudgetApp.tsx` | Đã xác nhận |
| Nguyên tắc chỉ thao tác trên tháng đang chọn | Sửa/xóa giao dịch chỉ cho phép ở tháng đang được chọn xem trên UI; các tháng khác chỉ xem, không cho thao tác | `docs/memory/decisions.md#dec-010` | Đã xác nhận |
| Cơ chế "Clone tháng đang xem" đã có | Khi tạo tháng mới, Dylan có thể chọn sao chép kế hoạch ngân sách (danh mục) từ tháng đang xem — kích hoạt thủ công qua nút bấm, không tự động theo ngày thực tế | `components/BudgetApp.tsx` (hàm `createNewMonth`), `docs/kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md` | Đã xác nhận |
| Lưu trữ dữ liệu | Toàn bộ dữ liệu chi tiêu đã chuyển sang Prisma + SQLite, không còn dùng `localStorage` cho dữ liệu nghiệp vụ | `docs/memory/decisions.md#dec-001`, `prisma/schema.prisma` | Đã xác nhận |
| Không có cơ chế chạy nền theo lịch | Ứng dụng hiện không có tiến trình chạy nền/cron tự kiểm tra ngày thực tế để tự sinh dữ liệu — mọi thay đổi tháng đều do Dylan chủ động bấm | `components/BudgetApp.tsx` (không có scheduler), `server/budget/actions.ts` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Giá sản phẩm (không bắt buộc) có được cộng vào tổng chi tiêu/ngân sách của tháng đó không? | Không. Giá chỉ hiển thị như ghi chú tham khảo trên danh sách cần mua, không ảnh hưởng tới Ngân sách/Chi thực tế/Số dư còn lại của tháng. Muốn tính vào chi tiêu thật thì Dylan vẫn ghi một giao dịch thu chi riêng như cách làm hiện nay. | Đã xác nhận từ knowledge (user chọn qua dialog `AskUserQuestion` ngày 2026-08-14) |
| Q2 | Tên 2 trạng thái tiếng Anh và màu sắc phân biệt cụ thể là gì? | "Pending" (màu cam/vàng) khi chưa mua; "Purchased" (màu xanh lá) khi đã mua — khớp tông màu cảnh báo/thành công app đang dùng ở nơi khác. | Đã xác nhận từ knowledge (user chọn qua dialog `AskUserQuestion` ngày 2026-08-14) |
| Q3 | Phạm vi "tháng cũ" (chỉ xem, không thêm/sửa/xóa) được xác định thế nào? | Là bất kỳ tháng nào khác tháng đang được Dylan chọn xem hiện tại trên UI (`selectedMonthId`) — không phải xác định theo ngày hệ thống thực tế. Suy ra từ tiền lệ DEC-010 (nguyên tắc "chỉ thao tác trên tháng đang chọn" đã áp dụng cho giao dịch chi tiêu). | Giả định hợp lý (suy từ `docs/memory/decisions.md#dec-010`, chưa hỏi lại user — `ssr-ba` cần xác nhận lại khi tổng hợp spec nếu còn nghi ngờ) |
| Q4 | Sản phẩm "chưa mua" sau khi bị sao chép sang tháng mới có còn hiển thị ở tháng gốc (tháng cũ) nữa không? | Không. Ẩn khỏi tháng gốc, chỉ còn hiển thị ở tháng mới nhất — tại một thời điểm, một item chưa mua chỉ xuất hiện đúng ở 1 tháng. | Đã xác nhận từ knowledge (user chọn qua dialog `AskUserQuestion` ngày 2026-08-14) |
| Q5 | Có cho phép xóa một item khỏi danh sách cần mua không, và có áp dụng được cho tháng cũ (chỉ xem) không? | Có, cho xóa item ở tháng đang hoạt động (tháng đang được chọn xem). Chặn hoàn toàn việc xóa (cũng như thêm/sửa) ở tháng cũ — khớp nguyên tắc DEC-010. | Đã xác nhận từ knowledge (user chọn qua dialog `AskUserQuestion` ngày 2026-08-14) |
| Q6 | Việc "clone sản phẩm chưa mua sang tháng mới" được kích hoạt khi nào — tự động theo ngày thực tế, hay chỉ khi Dylan chủ động tạo tháng mới? | Chỉ khi Dylan chủ động tạo tháng mới (bấm "Tạo tháng"/tương đương), khớp đúng cơ chế "Clone tháng đang xem" đã có sẵn cho danh mục ngân sách (US-006). Không có tiến trình chạy nền tự động theo lịch thực tế. | Đã xác nhận từ knowledge (user chọn qua dialog `AskUserQuestion` ngày 2026-08-14) |

## 5. Ghi Chú BA

- Đây là entity hoàn toàn mới (tạm gọi "Item cần mua"/"Purchase Item"), không tái dùng bảng `Transaction` — cần `ssr-data` bổ sung model mới liên kết theo `MonthBudget` (theo `monthId`), tương tự cách `Category`/`Transaction` liên kết hiện nay.
- Q3 chỉ ở mức "Giả định hợp lý" (suy từ DEC-010), chưa được user xác nhận trực tiếp cho riêng tính năng này — `ssr-ba` cần cân nhắc đưa lại vào dialog bước 14 nếu khi viết spec phát hiện tình huống biên chưa rõ (ví dụ Dylan mở một tháng tương lai còn trống trong danh sách chọn tháng — tháng đó có coi là "tháng đang hoạt động" cho phép thêm item không, hay chỉ tháng đã có dữ liệu mới cho thêm).
- Cơ chế "clone khi tạo tháng mới" (Q6) nên tái dùng đúng luồng nút "Tạo tháng"/"Clone tháng đang xem" đã có trong `BudgetApp.tsx` thay vì tạo luồng UI riêng — cần `ssr-plan` khảo sát điểm nối cụ thể vào hàm `createNewMonth`/`createMonthAction`.
- Trạng thái "Purchased" (Q2) chưa nói rõ có ghi lại thời điểm đánh dấu đã mua hay không (mốc thời gian) — chưa có yêu cầu rõ ràng từ Dylan, để `ssr-ba` cân nhắc khi thiết kế tiêu chí chấp nhận, không tự thêm trường nếu không cần thiết.
- Chưa có yêu cầu về giới hạn số lượng item tối đa mỗi tháng — không giả định giới hạn nào ngoài giới hạn kỹ thuật hợp lý thông thường.
