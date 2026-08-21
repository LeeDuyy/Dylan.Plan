# PO Review — Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định

Status: Reviewed
Scope: Một tính năng (F2 — bảng danh mục)
Reviewed: 2026-08-11
Owner: ssr-po

## 1. Phạm Vi Đã Review

| Nguồn | Path | Lý do đọc |
| --- | --- | --- |
| Business Flow | `docs/kb/ba/business-flow.md` mục 3, 4 (F2), 7 | Xác nhận F2 (Lập và điều chỉnh ngân sách theo danh mục) và các quyết định liên quan đến cột "Loại" (DEC-019, DEC-056) |
| Source — ô nhập Loại hiện tại | `components/BudgetApp.tsx:984-990` | Xác nhận "Loại" đang là phần tử input dạng text tự do, không giới hạn giá trị |
| Source — insight dùng Loại | `components/BudgetApp.tsx:330-335`, `:1061-1062` | Xác nhận thẻ "Tiết kiệm / tích lũy" và "Chi linh hoạt" tính bằng so khớp chuỗi trên `item.type` (và `item.name` cho thẻ tiết kiệm) |
| Source — seed mặc định | `lib/budget-defaults.ts:15-22` | Xác nhận 5 danh mục mặc định đang dùng 3 giá trị Loại: "Cố định" (2), "Linh hoạt" (4), "Tích lũy" (1, danh mục "Tiết kiệm / đầu tư") |
| Source — Loại mặc định khi thêm mới / "Chi tiêu khác" | `components/BudgetApp.tsx:416`, `server/budget/domain/services/fallback-category-service.ts:9` | Xác nhận nút "Thêm danh mục" và "Chi tiêu khác" tự sinh đều hard-code `type: "Linh hoạt"` (DEC-056) |
| Dữ liệu thật | `prisma/dev.db`, bảng `Category`, query `GROUP BY type` (2026-08-11) | Xác nhận 4 giá trị `type` đang tồn tại thật: "Cố định" (22), "Linh hoạt" (43), "Tích lũy" (18), "Linh s" (1 — dữ liệu lỗi do gõ dở dang) |
| Memory | `docs/memory/glossary.md` mục "Loại danh mục" | Xác nhận thuật ngữ hiện định nghĩa 3 giá trị: Cố định, Linh hoạt, Tích lũy — cần cập nhật theo quyết định mới |
| Chỉ đạo trực tiếp của user | Hội thoại `ssr-po` 2026-08-11 (2 lượt) | Yêu cầu đổi "Loại" từ ô nhập tự do thành combobox đúng 3 giá trị cố định: "Cố định", "Tích lũy", "Khác" (thay cho "Linh hoạt") |

## 2. Hiện Trạng

- Cột "Loại" trong bảng danh mục (F2, `components/BudgetApp.tsx:984-990`) là một phần tử input dạng text tự do — Dylan gõ tự do, không có ràng buộc giá trị nào.
- Dữ liệu thật xác nhận rủi ro này đã xảy ra: 1 danh mục có `type = "Linh s"` — rõ ràng là kết quả gõ dở dang, không thuộc một trong các nhãn nghiệp vụ đang dùng.
- Hai thẻ insight ở F4 dựa vào giá trị "Loại" dạng chuỗi: "Tiết kiệm / tích lũy" (so khớp `tiết|đầu tư|dự phòng|tích` trên `name + type`) và "Chi linh hoạt" (so khớp `linh` trên `type`).
- 3 nơi trong code đang hard-code chuỗi `"Linh hoạt"` làm giá trị mặc định: seed 4 danh mục mặc định (`lib/budget-defaults.ts`), nút "Thêm danh mục" (`BudgetApp.tsx:416`), và danh mục "Chi tiêu khác" tự sinh (`fallback-category-service.ts:9`, theo DEC-056).
- User đã chỉ đạo trực tiếp (2 lượt, 2026-08-11): thay ô nhập tự do bằng combobox/select đúng 3 lựa chọn cố định — **Cố định, Tích lũy, Khác** — "Khác" thay thế hoàn toàn vai trò "Linh hoạt" cũ; Dylan chỉ được chọn, không được gõ.

## 3. Findings

| ID | Mức | Loại | Nội dung | Bằng chứng |
| --- | --- | --- | --- | --- |
| PO-03 | Medium | Data integrity (defect) | Ô "Loại" là text tự do, không ràng buộc giá trị — đã sinh dữ liệu rác thật ("Linh s") thay vì một trong các nhãn nghiệp vụ hợp lệ | `prisma/dev.db` (Category.type = "Linh s", 1 dòng), `components/BudgetApp.tsx:984-990` |

Đây vừa là defect (đã có bằng chứng dữ liệu lỗi thật) vừa là cơ hội cải tiến (chuẩn hóa để chặn từ gốc), không phải suy đoán.

## 4. Điểm Mờ Cần Xác Nhận

| # | Điểm mờ | Đã tự trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| 1 | 3 giá trị combobox cụ thể là gì? | Không tự trả lời được | Đã xác nhận từ user (2026-08-11, chỉ đạo trực tiếp): "Cố định", "Tích lũy", "Khác" — "Khác" thay cho "Linh hoạt" |
| 2 | 18 danh mục đang `type = "Tích lũy"` xử lý thế nào? | Không cần xử lý — "Tích lũy" đã là 1 trong 3 giá trị chính thức mới, giữ nguyên | Suy ra trực tiếp từ quyết định #1, không còn mơ hồ |
| 3 | 43 danh mục đang `type = "Linh hoạt"` migrate thành gì? | Có — user đã nói rõ "Khác (thay cho linh hoạt)" | Đã xác nhận từ user (2026-08-11): migrate thành "Khác" |
| 4 | 1 danh mục đang `type = "Linh s"` (dữ liệu lỗi) migrate thành gì? | Có | Đã xác nhận từ user (2026-08-11, trực tiếp): "Linh s sẽ đổi thành khác" |
| 5 | Thẻ insight "Chi linh hoạt" (F4, dựa vào so khớp `linh` trên `type`) sẽ không còn khớp giá trị nào sau khi migrate — nên đổi cách tính (so `type === "Khác"`) và có đổi nhãn hiển thị hay giữ tên cũ "Chi linh hoạt"? | Không tự trả lời được — là quyết định UI copy | **Cần user xác nhận** — để `ssr-ba` hỏi lại khi viết spec, không chặn việc tạo raw |
| 6 | Thẻ insight "Tiết kiệm / tích lũy" có bị ảnh hưởng không? | Có — không ảnh hưởng, vì thẻ này so khớp cả `name` lẫn `type`; danh mục mặc định "Tiết kiệm / đầu tư" vẫn khớp qua tên dù `type` là gì | Giả định hợp lý, độ tin cậy cao (đọc trực tiếp từ code) |

## 5. Cơ Hội Nghiệp Vụ

Không có cơ hội nghiệp vụ mới ngoài việc chuẩn hóa dữ liệu — đây thuần là cải thiện chất lượng dữ liệu và tính nhất quán của trường "Loại".

## 6. Cơ Hội UI/UX

| # | Màn hình | Vấn đề | Đề xuất |
| --- | --- | --- | --- |
| 1 | Bảng danh mục (F2, `/budget`) | Cột "Loại" là ô nhập chữ tự do, không ràng buộc giá trị, đã sinh dữ liệu rác thật | Đổi thành combobox/select đúng 3 lựa chọn cố định: "Cố định", "Tích lũy", "Khác"; Dylan chỉ chọn, không gõ được |

## 7. Rủi Ro Chất Lượng Và Hiệu Năng

| # | Rủi ro | Bằng chứng | Mức chắc chắn |
| --- | --- | --- | --- |
| 1 | Không có rủi ro hiệu năng — đổi input thành select không ảnh hưởng số lượng phần tử render hay truy vấn dữ liệu | `components/BudgetApp.tsx:984-990` | Có bằng chứng source |
| 2 | Rủi ro migration: nếu không cập nhật đồng bộ 3 nơi hard-code `"Linh hoạt"` (`lib/budget-defaults.ts`, `BudgetApp.tsx:416`, `fallback-category-service.ts:9`) cùng lúc đổi schema/UI, danh mục mới tạo sau này sẽ lại sinh ra giá trị "Linh hoạt" không còn hợp lệ trong combobox — lặp lại đúng lỗi dữ liệu rác đang muốn sửa | `lib/budget-defaults.ts:18-21`, `components/BudgetApp.tsx:416`, `server/budget/domain/services/fallback-category-service.ts:9` | Có bằng chứng source |
| 3 | Thẻ insight "Chi linh hoạt" (F4) sẽ luôn hiển thị 0đ sau khi migrate nếu không đổi điều kiện so khớp từ `/linh/i.test(item.type)` sang so `type === "Khác"` | `components/BudgetApp.tsx:333-335` | Có bằng chứng source |

## 8. Đề Xuất Ưu Tiên

| Ưu tiên | Đề xuất | Effort | Cần | Lý do |
| --- | --- | --- | --- | --- |
| 1 | Đổi "Loại" từ ô nhập tự do thành combobox cố định 3 giá trị (Cố định/Tích lũy/Khác), kèm migrate dữ liệu cũ và đồng bộ mọi nơi hard-code "Linh hoạt", cập nhật cách tính thẻ insight "Chi linh hoạt" | Quick win | BA spec (+ `ssr-data` nếu cần ràng buộc ở tầng schema) | User đã chỉ đạo trực tiếp cả giá trị combobox lẫn quy tắc thay thế "Linh hoạt" → "Khác"; chỉ còn 2 điểm mờ nhỏ (mục 4, #4 và #5) cần `ssr-ba` chốt nốt khi viết spec, không chặn việc tạo raw |

## 9. Raw Candidate

| # | Nội dung raw đề xuất | Đã được duyệt tạo raw |
| --- | --- | --- |
| 1 | "Là Dylan, tôi muốn cột 'Loại' trong bảng danh mục không còn là ô nhập chữ tự do mà là một combobox chỉ cho chọn đúng 3 giá trị cố định — 'Cố định', 'Tích lũy', 'Khác' (giá trị 'Khác' thay thế hoàn toàn cho 'Linh hoạt' cũ) — để không thể gõ nhầm hoặc tạo ra giá trị Loại rác như đã từng xảy ra ('Linh s'); dữ liệu Loại cũ ('Linh hoạt' và biến thể lỗi 'Linh s' của nó) được chuyển hết sang 'Khác', còn 'Cố định' và 'Tích lũy' giữ nguyên" | Đã duyệt (2026-08-11, user: "Linh s sẽ đổi thành khác, tạo req chính thức") |

`ssr-po` gọi `ssr-raw` ngay sau mục này — user đã cho phép tường minh (2026-08-11).
