---
status: Active
updated: 2026-08-11
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-018"]
---

# BR-018 — Khu vực "Lịch sử thu chi" chỉ hiển thị tối đa 3 thẻ tháng liền kề tháng đang xem

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khu vực "Lịch sử thu chi" (khu vực thẻ tháng quick view) chỉ hiển thị tối đa 3 thẻ: tháng trước, tháng đang xem, tháng sau — tính theo vị trí tương đối của tháng đang xem trong danh sách các tháng **đã tạo** (không tính theo lịch, bỏ qua tháng chưa tạo).

Nếu tháng đang xem không có tháng trước hoặc tháng sau tương ứng trong danh sách đã tạo (ví dụ tháng đang xem là tháng đầu tiên hoặc cuối cùng đã có dữ liệu), ô thẻ tương ứng bị ẩn — lưới quick view có thể chỉ còn 1 hoặc 2 thẻ thay vì luôn cố định 3.

Muốn xem một tháng không nằm trong 3 thẻ này, Dylan dùng "Chọn tháng xem" (dropdown liệt kê toàn bộ tháng đã tạo) đã có sẵn phía trên khu vực này — không mở rộng số thẻ hiển thị.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-015`](../feature/US-015-quick-view-thang-lien-ke.md) | Khu vực "Lịch sử thu chi" của trang Thu chi — thay thế hành vi hiện tại (hiển thị toàn bộ tháng đã tạo, không giới hạn) |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Chỉ có đúng 1 tháng đã tạo (chính tháng đang xem) | Không có tháng trước lẫn tháng sau | `US-015` — chỉ hiển thị 1 thẻ |
| Tháng đang xem là tháng đầu tiên hoặc cuối cùng trong danh sách đã tạo | Chỉ có 1 trong 2 hướng (trước hoặc sau) | `US-015` — chỉ hiển thị 2 thẻ |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt qua `AskUserQuestion` trong phiên `ssr-po mode=review` (2026-08-11) | `docs/memory/decisions.md#dec-071`, `docs/memory/decisions.md#dec-072` | Đã xác nhận từ knowledge |
| PO review phát hiện hành vi hiện tại không giới hạn | `docs/po/review-2026-08-11-quick-view-thang.md` | Đã xác nhận từ knowledge |
| Hành vi hiện tại (hiển thị toàn bộ tháng đã tạo) | `components/BudgetApp.tsx:741-759` | Đã xác nhận từ knowledge |
| Cách xem tháng khác đã có sẵn ("Chọn tháng xem") | `components/BudgetApp.tsx:686-695` | Đã xác nhận từ knowledge |
