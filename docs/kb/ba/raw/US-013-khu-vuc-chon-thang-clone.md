---
status: Merged
feature: US-013
created: 2026-08-10
source: Chat
requester: Dylan (user)
priority: Trung bình
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-013"]
---

# Raw Requirement — Cập nhật khu vực chọn tháng và nghiệp vụ Clone tháng đang xem

> **Đã gộp vào US-006 (2026-08-10).** Đánh giá impact cho thấy US-013 chạm đúng khu vực màn hình "Tạo tháng mới"/"Chọn tháng" mà US-006 (spec `Ready for DEV`, chưa qua stage plan/task) đã mô tả, và US-006 vốn đã ngầm giả định đúng nghiệp vụ mà US-013 yêu cầu (AC-02/AC-03 gốc). Toàn bộ nội dung dưới đây đã được đưa vào [`docs/features/US-006-canh-bao-trung-thang/spec.md`](../../../features/US-006-canh-bao-trung-thang/spec.md) (mục 1, 3, 4, 6, 7, 8, 10, 11, 12, 14) thay vì tách một spec riêng cho `US-013`. Không tạo `docs/features/US-013-khu-vuc-chon-thang-clone/`. Xem quyết định gộp tại `docs/memory/decisions.md#dec-065`.

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-013 |
| Slug | khu-vuc-chon-thang-clone |
| Workflow mong muốn | Raw → Gộp vào spec `US-006` (không tách spec riêng) |
| Điểm dừng | Đã dừng — gộp vào `US-006` ngày 2026-08-10 |
| Cần report | Không — theo report chung của `US-006` |
| Spec dự kiến | Không có — nội dung đã ở [`docs/features/US-006-canh-bao-trung-thang/spec.md`](../../../features/US-006-canh-bao-trung-thang/spec.md) |
| BA wiki dự kiến | Không có — `ssr-ingest` sẽ đồng bộ phần nội dung liên quan vào trang wiki của `US-006`, không tạo trang riêng cho `US-013` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
tạo US cập nhật các điều kiện sau:

* Thay đổi tittle "Chọn tháng" thành "Chọn tháng xem"
* Vị trí của "tạo tháng mới". button tạo tháng, button Clone tháng hiện tại cùng 1 area để dễ dàng phân biệt đâu là tháng đang xem và đâu là tạo mới tháng
* Cập nhật tên "Clone tháng hiện tại" "Clone tháng đang xem". Cập nhật nghiệp vụ: Khi xác nhận clone tháng đang xem thì sẽ clone dữ liệu của tháng đang xem qua tháng mới đang tạo
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Tiêu đề khu vực hiện tại | Khu vực chọn tháng đang hiển thị nhãn "Chọn tháng" cùng dropdown chọn tháng, và cùng khu vực đó còn có input "Tạo tháng mới" và hai nút "Tạo tháng"/"Clone tháng hiện tại" — chưa tách khu vực | `components/BudgetApp.tsx` (khối `.actions` cạnh dropdown chọn tháng) | Đã xác nhận |
| Hành vi hiện tại của 2 nút tạo tháng | "Tạo tháng" (`createNewMonth(false)`) và "Clone tháng hiện tại" (`createNewMonth(true)`) chạy đúng một đoạn code — tham số `cloneCurrent` bị bỏ qua (`void cloneCurrent`) — cả hai đều sao chép cấu trúc danh mục (tên, loại, hạn mức ngân sách, trạng thái khóa) từ tháng đang chọn (`selectedMonth`), không có phân biệt nào | `components/BudgetApp.tsx` (hàm `createNewMonth`), `server/budget/application/use-cases/create-month.ts` | Đã xác nhận |
| Cơ chế sao chép danh mục khi tạo tháng có nguồn | Sao chép tên/loại/hạn mức ngân sách/trạng thái khóa của từng danh mục từ tháng nguồn; danh mục "Chi tiêu khác" (fallback) không được sao chép — chỉ tự sinh khi tháng mới thật sự phát sinh nhu cầu | `server/budget/application/use-cases/create-month.ts`, `docs/memory/decisions.md#dec-026` | Đã xác nhận |
| Thu nhập (income) không được sao chép ở cơ chế hiện tại | Tháng mới luôn khởi tạo với thu nhập mặc định (`DEFAULT_INCOME`), bất kể có tháng nguồn hay không | `server/budget/application/use-cases/create-month.ts` | Đã xác nhận |
| Giao dịch không được sao chép | "Chi thực tế" của tháng mới luôn bắt đầu ở 0 vì được tính bằng tổng hợp giao dịch thật tại thời điểm đọc, không lưu tay/carry-over | `components/BudgetApp.tsx` (chú thích hàm `createNewMonth`), `docs/memory/glossary.md` (mục "Chi thực tế") | Đã xác nhận |
| Feature liên quan cùng khu vực UI | US-006 (Cảnh báo trùng tháng khi tạo tháng mới) đã có spec `Ready for DEV` nhưng chưa có plan/task, cũng tác động tới cùng khu vực nút "Tạo tháng"/"Clone tháng hiện tại" | `docs/features/US-006-canh-bao-trung-thang/spec.md`, `docs/requirements-index.md` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Sau khi tách bạch nghiệp vụ, nút "Tạo tháng" (không phải Clone) nên làm gì với danh mục của tháng mới? | "Tạo tháng" luôn tạo danh mục theo bộ mặc định của hệ thống (`defaultCategories`), không sao chép gì từ tháng đang xem — tạo sự khác biệt rõ ràng với "Clone tháng đang xem" (`docs/memory/decisions.md#dec-063`) | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` trong `ssr-raw` (2026-08-10) |
| Q2 | "Clone dữ liệu của tháng đang xem" sang tháng mới cụ thể gồm những gì? | Chỉ cấu trúc danh mục (tên, loại, hạn mức ngân sách, trạng thái khóa) — giữ nguyên cơ chế sao chép đang có trong code. Không gồm thu nhập (tháng mới vẫn dùng thu nhập mặc định), không gồm giao dịch, không gồm danh mục "Chi tiêu khác" (đúng quy tắc đã chốt ở `DEC-026`, ghi lại tại `docs/memory/decisions.md#dec-064`) | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` trong `ssr-raw` (2026-08-10) |

## 5. Ghi Chú BA

- Đây vừa là thay đổi giao diện (đổi tiêu đề, sắp xếp lại khu vực) vừa là sửa nghiệp vụ (bug hiện tại: "Tạo tháng" và "Clone tháng hiện tại" đang cho kết quả giống hệt nhau do tham số `cloneCurrent` bị bỏ qua). `ssr-ba` cần viết cả tiêu chí chấp nhận cho phần UI (tên nhãn, bố cục khu vực) lẫn phần nghiệp vụ (rẽ nhánh đúng giữa "Tạo tháng dùng mặc định" và "Clone tháng đang xem sao chép cấu trúc danh mục").
- Phạm vi sửa dự kiến nằm trong `components/BudgetApp.tsx` (hàm `createNewMonth`, JSX khu vực chọn tháng/tạo tháng) và `server/budget/application/use-cases/create-month.ts` (thêm nhánh phân biệt nguồn sao chép theo `cloneCurrent`); nhiều khả năng không cần đổi schema, để `ssr-plan` xác nhận chính thức khi tới lượt.
- Cần đối chiếu với US-006 (cảnh báo trùng tháng) khi viết spec vì cả hai cùng chạm khu vực nút "Tạo tháng"/"Clone tháng đang xem" — `ssr-ba` nên nêu rõ mục 10/11 (Phụ thuộc/Tác động chéo) giữa US-013 và US-006.
- Yêu cầu không nói rõ layout cụ thể (thứ tự, khoảng cách) của khu vực mới — chỉ yêu cầu "cùng 1 area để dễ phân biệt". Bố cục chi tiết (ASCII Mockup) do `ssr-ba` thiết kế khi viết spec, dựa trên nguyên tắc tách rõ "khu vực xem" và "khu vực tạo mới".
