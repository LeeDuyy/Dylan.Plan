# PO Review — Nhận diện danh mục khi nhập nhanh chi tiêu (F1)

Status: Reviewed
Scope: Một luồng nghiệp vụ
Reviewed: 2026-08-06
Owner: ssr-po

## 1. Phạm Vi Đã Review

| Nguồn | Path | Lý do đọc |
| --- | --- | --- |
| Business Flow | `docs/kb/ba/business-flow.md` | Đối chiếu F1 bước 1-2, điều kiện rẽ nhánh "khớp từ khóa" |
| Yêu cầu user | Tin nhắn `/ssr-po` — mô tả hành vi mong muốn kèm 2 ví dụ cụ thể | Xác định đúng phạm vi cần kiểm chứng |
| Danh sách từ khóa nhận diện | `lib/budget-defaults.ts` (`quickRules`, `defaultCategories`) | Đối chiếu tên danh mục trong rule với tên danh mục thật |
| Logic ghi nhận nhanh | `components/BudgetApp.tsx` (`inferredQuickCategory`, `addQuickExpense`, dòng ~272-336, ~672-707) | Xác minh cách xử lý khi khớp/không khớp từ khóa |
| Dữ liệu thật đang chạy | `next dev` (cổng tạm 51420), thao tác trực tiếp qua DOM | Tái hiện đúng ví dụ user đưa ra bằng dữ liệu thật, không suy đoán |
| Delivery report liên quan | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/report.md` (giao hôm nay) | Xác nhận phần "bỏ qua chọn danh mục → Chi tiêu khác" đã Delivered, tránh đề xuất trùng |

## 2. Hiện Trạng

- Người dùng hôm nay làm được gì: Gõ nội dung tự nhiên vào ô nhập nhanh (F1 bước 1) → hệ thống tách số tiền và thử khớp một trong 8 rule từ khóa cố định (`quickRules`) để gợi ý danh mục. Nếu **không** khớp từ khóa nào, kể từ US-005 (giao hôm nay), ô chọn danh mục tự về trạng thái trống và Dylan vẫn ghi nhận được — giao dịch tự vào "Chi tiêu khác".
- Dữ liệu/contract hệ thống dựa vào: `quickRules[].category` là một **chuỗi tên cố định** (vd `"Ăn uống"`, `"Giải trí / cafe"`), được dùng để tìm đúng bản ghi `Category` bằng so khớp **tên chính xác** (`selectedMonth.categories.find(item => item.name === categoryName)`) — không phải theo mã định danh (`id`).
- Rule đã được ghi lại ở đâu: `docs/kb/ba/business-flow.md` mục 4 (F1), dòng điều kiện rẽ nhánh "Từ khóa trong nội dung khớp một danh mục đã định nghĩa → Tự gán danh mục" — ghi chú "Danh sách từ khóa cố định trong code (`quickRules`)", nhưng **không** ghi rằng việc gán còn phụ thuộc tên danh mục chưa từng bị đổi.

## 3. Findings

| ID | Mức | Loại | Nội dung | Bằng chứng |
| --- | --- | --- | --- | --- |
| PO-01 | **Critical** | Defect | Khi từ khóa khớp đúng một rule, nhưng danh mục thật trong tháng đã được Dylan **đổi tên** (khác với tên cố định trong `quickRules`), hệ thống **âm thầm không ghi nhận gì cả** — không tạo giao dịch, không báo lỗi, không rơi vào "Chi tiêu khác". Dylan bấm "Ghi nhận" tưởng đã lưu nhưng dữ liệu biến mất | Tái hiện thật trên `next dev`: gõ "ăn tối 300k" (khớp từ khóa "ăn"/"tối" → rule trả về category="Ăn uống") nhưng danh mục thật trong tháng tên "Ăn uống & đi chợ" (đã bị đổi tên) → `inferredQuickCategory`="Ăn uống" (đúng, thấy trong preview "Tự nhận diện: 300.000 ₫ → Ăn uống."), nhưng dropdown hiện "— Chưa xác định —", bấm "Ghi nhận" (nút không disable) → danh sách giao dịch **không đổi**, nội dung ô nhập **không bị xóa** → giao dịch không được lưu, không có phản hồi lỗi nào |
| PO-02 | Low | UI/UX | Khi rule khớp nhưng tên danh mục đã đổi, dropdown hiển thị "— Chưa xác định —" dù nội bộ `quickCategory` đang mang giá trị "Ăn uống" (không rỗng) — gây hiểu lầm rằng hệ thống không nhận diện được, trong khi thực ra nó nhận diện đúng nhưng tra cứu sai | Cùng bằng chứng PO-01 — `select.value` rỗng do không có lựa chọn (option) nào trong dropdown khớp giá trị "Ăn uống" |

Đây là **defect**, không phải khoảng trống tính năng — nghiệp vụ "tự nhận diện danh mục, không xác định được thì vào Chi tiêu khác" (điều user mô tả) **đã có chủ đích trong thiết kế** (F1 điều kiện rẽ nhánh, US-005 vừa giao), nhưng cách hiện thực (so khớp theo tên chuỗi thay vì theo mã cố định) bị vỡ ngay khi Dylan đổi tên một danh mục mặc định — một thao tác hoàn toàn hợp lệ và đã được hỗ trợ từ F2 (sửa tên danh mục).

## 4. Điểm Mờ Cần Xác Nhận

| # | Điểm mờ | Đã tự trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| 1 | Khi rule khớp từ khóa nhưng không tìm thấy danh mục đúng tên (đã đổi tên), hệ thống nên: (a) cố so khớp gần đúng để giữ đúng ý định phân loại, hay (b) luôn rơi thẳng về "Chi tiêu khác" cho an toàn, hay (c) gắn `quickRules` với một mã cố định thay vì tên hiển thị (giải pháp bền vững hơn, cần đổi schema)? | Không tự trả lời được — đây là lựa chọn đánh đổi giữa độ chính xác phân loại và độ phức tạp triển khai, cần user quyết | Cần user xác nhận |
| 2 | Có bao nhiêu danh mục mặc định hiện đã bị Dylan đổi tên khỏi tên gốc trong `quickRules`, ảnh hưởng tới bao nhiêu rule? | Đã tự kiểm một phần: quan sát trực tiếp trên dữ liệu tháng 2026-08 thấy ít nhất 2/8 rule bị lệch ("Ăn uống"→"Ăn uống & đi chợ", "Giải trí / cafe"→"Giải trí / cafe / trà sữa"); không kiểm được toàn bộ lịch sử các tháng khác trong phạm vi review này | Đã xác nhận từ knowledge (một phần) |

## 5. Cơ Hội Nghiệp Vụ

Không có — mục này dành cho cơ hội cải tiến mới; nội dung chính ở đây là sửa một defect đã có chủ đích thiết kế nhưng bị vỡ do cách hiện thực.

## 6. Cơ Hội UI/UX

| # | Màn hình | Vấn đề | Đề xuất |
| --- | --- | --- | --- |
| 1 | Ô nhập nhanh chi tiêu (`/budget`) | Khi ghi nhận thất bại âm thầm (PO-01), Dylan không có cách nào biết được | Sau khi sửa PO-01, cân nhắc thêm: nếu sau khi sửa vẫn còn trường hợp không xác định được danh mục dù rule có khớp, nên áp dụng đúng hành vi đã có của US-005 (rơi về "Chi tiêu khác" + toast), không để lại trạng thái im lặng nào |

## 7. Rủi Ro Chất Lượng Và Hiệu Năng

| # | Rủi ro | Bằng chứng | Mức chắc chắn |
| --- | --- | --- | --- |
| 1 | Mất dữ liệu chi tiêu do Dylan tưởng đã ghi nhận nhưng thực ra không có gì được lưu — rủi ro cao nhất là sai lệch ngân sách tháng vì thiếu giao dịch mà Dylan không biết để bổ sung lại | Tái hiện thật, xem PO-01 | Đã đo (tái hiện trực tiếp bằng thao tác thật, không phải suy đoán) |
| 2 | Rủi ro tái diễn: mọi lần Dylan đổi tên một trong 8 danh mục mặc định (thao tác hợp lệ, đã hỗ trợ từ F2) đều có thể kích hoạt lại defect này cho đúng rule tương ứng | Đối chiếu logic `addQuickExpense`/`inferredQuickCategory`, không phụ thuộc dữ liệu cụ thể | Có bằng chứng source |

## 8. Đề Xuất Ưu Tiên

| Ưu tiên | Đề xuất | Effort | Cần | Lý do |
| --- | --- | --- | --- | --- |
| 1 | Sửa PO-01: khi rule khớp từ khóa nhưng không tìm thấy danh mục đúng tên, không được im lặng bỏ qua — tối thiểu phải rơi về "Chi tiêu khác" giống nhánh "không khớp từ khóa nào" (tái dùng đúng cơ chế `fallbackCategoryService` vừa giao ở US-005) | Quick win | Xác nhận rule (điểm mờ #1) | Đây là lỗi mất dữ liệu, ưu tiên cao nhất, không cần đổi schema nếu chọn phương án (a)/(b) ở điểm mờ #1 |
| 2 | Nếu user muốn giữ đúng ý định phân loại ban đầu (vd "ăn tối 300k" vẫn nên vào đúng "Ăn uống & đi chợ" thay vì rơi vào "Chi tiêu khác") thay vì chỉ chặn mất dữ liệu | Medium | BA spec, có thể cần SE plan | Cải thiện độ chính xác, nhưng phức tạp hơn (so khớp gần đúng hoặc gắn mã cố định) — nên tách thành yêu cầu riêng sau khi đã chặn được rủi ro mất dữ liệu ở đề xuất 1 |

## 9. Raw Candidate

| # | Nội dung raw đề xuất | Đã được duyệt tạo raw |
| --- | --- | --- |
| 1 | "Khi nội dung nhập nhanh khớp từ khóa của một danh mục nhưng danh mục đó đã bị Dylan đổi tên (không còn khớp tên gốc dùng để so khớp), hệ thống hiện đang âm thầm không ghi nhận gì. Cần sửa để giao dịch luôn được lưu: ưu tiên vẫn gán đúng ý định phân loại ban đầu nếu xác định được, nếu không thì rơi về danh mục 'Chi tiêu khác' như trường hợp không khớp từ khóa nào — không bao giờ để mất giao dịch một cách im lặng." | Chưa — chờ user đồng ý |

`ssr-po` chỉ gọi `ssr-raw` sau khi user cho phép tường minh.
