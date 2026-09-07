---
status: Raw
feature: US-022
created: 2026-09-07
source: Chat
requester: Dylan
priority: Cao
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-022"]
---

# Raw Requirement — Nguồn thu, sửa insight tiết kiệm, tháng mặc định và bỏ giới hạn tháng cho Item cần mua tại tab Thu chi

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-022 |
| Slug | nguon-thu-va-insight-tab-thu-chi |
| Workflow mong muốn | Raw → Report |
| Điểm dừng | report (chạy trọn pipeline ba → dev → test, rồi commit/push) |
| Cần report | Có |
| Spec dự kiến | `docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
tôi cần bạn lên kế hoạch cho các việc sau, thay đổi layout cho trang plan, hãy tận dụng đầy đủ các khoảng không gian và xử dụng antd để có các component cần thiết. Sau đó hãy làm responsive để cho mobile và tablet. Về phần budget hãy thông kê insight chính xác hên về tiết kiệm và thu nhập (hiện tại đang bị sai), layout chưa được thân thiện, khi vào tab này mặc định show tháng hiện tại, nếu không có thì hãy show tháng gần với hiện tại nhất. Danh mục "Item cần mua" sẽ có thể nhập bất kỳ tháng nào, không nhất thiết phải là tháng hiện tại, và trong tab này mới chỉ có phần chi, chưa có phần thu, hãy cơ cấu cho tôi điều chỉnh các nguồn thu tương ứng. Bạn có thể sử dụng codex --yolo để hỗ trợ bạn implement

Chạy phương án a. Sau khi chạy xong hãy đảm bảo k bug lúc đó hãy commit và push lên main
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Route module Quản lý chi tiêu | `/budget`, render `components/BudgetApp.tsx` | `app/budget/page.tsx`, `docs/memory/decisions.md#dec-005` | Đã xác nhận |
| Thu nhập tháng hiện tại | Một số nguyên duy nhất `MonthBudget.income`, seed cứng `DEFAULT_INCOME = 35_000_000` khi tạo tháng; **không có UI hay Server Action nào cho phép sửa** | `prisma/schema.prisma` (model `MonthBudget`), `lib/budget-defaults.ts`, `server/budget/**` (không có use-case income) | Đã xác nhận |
| Insight đang tính trên income cứng | `totals` trong `components/BudgetApp.tsx:358-372`: `remaining = income - totalActual`, `ratio = totalActual / income`, `saving` lọc danh mục theo regex tên `/tiết|đầu tư|dự phòng|tích/i` rồi cộng `actual`, hiển thị `% thu nhập = saving / income` | `components/BudgetApp.tsx` | Đã xác nhận |
| Số cứng trong giao diện insight | "Quy tắc kiểm soát" (`TargetGrid`) và text insight nhắc các mốc 5M / 7.5M / 31.5M / 30M / 90% cố định trong code | `components/BudgetApp.tsx:934-1135` | Đã xác nhận |
| Tháng mặc định khi mở tab | `selectedMonthId` khởi tạo bằng `initialBudget.months.at(-1)?.id` — tháng cuối cùng **có dữ liệu**, không phải tháng hiện tại theo đồng hồ hệ thống | `components/BudgetApp.tsx:253` | Đã xác nhận |
| Đã có helper tháng hiện tại | `getCurrentMonthId()` trả `YYYY-MM` theo `new Date()`; `formatMonthId(date)` cùng dạng ở client | `server/budget/domain/rules/current-month-rule.ts`, `components/BudgetApp.tsx:116` | Đã xác nhận |
| Giới hạn "Item cần mua" theo tháng hiện tại | `canEditPurchaseItems = selectedMonth.id === currentMonthId` (UI ẩn form thêm/ô sửa/nút xóa ở tháng khác) + `assertMonthIsCurrent()` chặn ở 4 use-case: `add-purchase-item`, `update-purchase-item`, `mark-purchase-item-purchased`, `delete-purchase-item` | `components/BudgetApp.tsx:737`, `server/budget/application/use-cases/*purchase-item*.ts`, `server/budget/domain/rules/current-month-rule.ts` | Đã xác nhận |
| Chuyển item Pending sang tháng mới | `create-month` gọi `purchaseItemRepository.transferPendingToMonth(getCurrentMonthId(), monthId)` khi tạo tháng | `server/budget/application/use-cases/create-month.ts:75`, `docs/memory/decisions.md#dec-095` | Đã xác nhận |
| Loại danh mục là combobox cố định 3 giá trị | `Cố định`, `Tích lũy`, `Khác` (`CATEGORY_TYPES`) | `lib/budget-defaults.ts:13`, `docs/memory/glossary.md` (Loại danh mục), `docs/memory/decisions.md#dec-073` | Đã xác nhận |
| Kiến trúc bounded-context budget | Composition root `server/budget/actions.ts` nối repository (Prisma) → domain service → use-case → Server Action; Client Component chỉ import use-case | `server/budget/actions.ts` (comment đầu file), kit rule R2.4 | Đã xác nhận |
| Pattern CRUD + reorder danh mục đã có sẵn | `upsert-category`, `remove-category`, `reorder-categories` use-case + `category-prisma-repository`; UI kéo-thả sắp xếp hàng (US-017) | `server/budget/application/use-cases/*category*.ts`, `components/BudgetApp.tsx` | Đã xác nhận |
| Toàn bộ dữ liệu ngân sách trên Prisma + SQLite | Không còn dùng `localStorage` cho dữ liệu nghiệp vụ (chỉ còn `{ dark }`) | `docs/memory/decisions.md#dec-001`, `prisma/schema.prisma` | Đã xác nhận |
| Executor implement của kit | `SSR_IMPLEMENT_EXECUTOR=codex`, `SSR_CMD_CODEX=codex exec --yolo` — pipeline đã giao việc viết code cho Codex CLI | `.ssr-kit.env` mục 13 | Đã xác nhận |
| Layout / antd / responsive | Tách sang raw riêng **US-023** (chuẩn hóa layout toàn app bằng Ant Design + responsive) — raw này chỉ giữ phần nghiệp vụ thu/insight/tháng/item | Quyết định phân rã của phiên làm việc 2026-09-07 | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | "Nguồn thu" mô hình hóa thế nào — một số thu nhập chỉnh tay, hay nhiều nguồn có tên? | Nhiều nguồn thu **có tên** (vd Lương, Freelance, Thưởng), mỗi nguồn có số tiền; cho thêm/sửa/xóa/sắp xếp; đối xứng với bảng danh mục chi. Thu nhập tháng = tổng các nguồn thu. Cần model mới (`ssr-data`), có migration. | Đã xác nhận từ knowledge (user chọn qua dialog `AskUserQuestion` ngày 2026-09-07) |
| Q2 | Con số "tiết kiệm" đúng nên hiểu là gì? | Hiển thị **hai chỉ số tách riêng**: (a) **Tiết kiệm ròng** = Thu nhập tháng − Tổng chi thực tế; (b) **Đã phân bổ vào tích lũy** = tổng Chi thực tế của các danh mục Loại = "Tích lũy" (thay regex tên mong manh). Kèm **Tỷ lệ tiết kiệm** = (a) / Thu nhập tháng. | Đã xác nhận từ knowledge (user chọn qua dialog `AskUserQuestion` ngày 2026-09-07) |
| Q3 | Tháng mặc định khi mở tab? | Tháng hiện tại theo đồng hồ hệ thống nếu tháng đó đã có dữ liệu; nếu chưa, chọn tháng **gần hiện tại nhất** theo khoảng cách số tháng tuyệt đối nhỏ nhất (có ràng buộc phá hòa: `ssr-ba` chốt ưu tiên tháng quá khứ hay tương lai khi bằng khoảng cách). | Đã xác nhận từ knowledge (user nêu trực tiếp trong raw + dialog ngày 2026-09-07) |
| Q4 | Bỏ giới hạn "tháng cũ chỉ xem" của US-019 tới mức nào? | Cho **thêm/sửa/xóa/đánh dấu đã mua** item ở tháng hiện tại **và các tháng tương lai**; **chặn** thao tác ở các tháng đã kết thúc (chỉ xem). Thay `assertMonthIsCurrent` bằng luật "tháng không ở quá khứ". Đảo một phần các quyết định US-019 (`DEC-094`, `DEC-096`) — cần cập nhật wiki/BR khi `ssr-ingest`. | Đã xác nhận từ knowledge (user chọn "Hiện tại + tương lai, chặn tháng đã qua" qua dialog `AskUserQuestion` ngày 2026-09-07) |
| Q5 | Khi tạo tháng mới, danh sách nguồn thu tháng mới lấy từ đâu? | **Luôn bắt đầu rỗng** — tháng mới không có nguồn thu nào, Dylan tự thêm từng dòng. Thu nhập tháng = 0 cho tới khi nhập. Không clone nguồn thu từ tháng nguồn kể cả khi bấm "Clone tháng đang xem". | Đã xác nhận từ knowledge (user chọn qua dialog `AskUserQuestion` ngày 2026-09-07) |
| Q6 | Các mốc số cứng 5M / 7.5M / 31.5M / 30M / 90% trong "Quy tắc kiểm soát" và text insight xử lý thế nào? | **Bỏ hẳn khỏi giao diện** — chỉ hiển thị các chỉ số thực tế (thu nhập, tổng chi, tiết kiệm ròng, tỷ lệ, phân bổ tích lũy). Không còn câu chữ mục tiêu cố định. Việc cấu hình ngưỡng để dành cho US-009, ngoài phạm vi US-022. | Đã xác nhận từ knowledge (user chọn qua dialog `AskUserQuestion` ngày 2026-09-07) |
| Q7 | Chỉnh sửa nguồn thu có bị giới hạn theo tháng như "Item cần mua" không? | Không có yêu cầu giới hạn riêng từ Dylan. Giả định: nguồn thu chỉnh sửa được cho **tháng đang chọn xem**; vì bộ chọn tháng cho chọn mọi tháng nên thực tế sửa được mọi tháng. `ssr-ba` xác nhận lại nếu phát sinh tình huống biên (vd tháng đã kết thúc). | Giả định hợp lý (suy từ pattern chỉnh sửa danh mục theo `selectedMonth`, chưa hỏi lại user) |
| Q8 | Nguồn thu có ảnh hưởng tới "Chi thực tế" / "Ngân sách" của danh mục không? | Không. Nguồn thu chỉ cấu thành "Thu nhập tháng" — đầu vào cho các chỉ số tổng (tiết kiệm ròng, tỷ lệ dùng thu nhập, số dư còn lại). Không đụng tới `Category.budget` hay `Category.actual`. | Giả định hợp lý (nhất quán với glossary: "Thu nhập tháng" và "Tổng chi thực tế" là hai vế độc lập) |

## 5. Ghi Chú BA

- **Đụng data model — bắt buộc qua `ssr-data`:** entity mới (tạm gọi "Nguồn thu" / `IncomeSource`) liên kết theo `MonthBudget` (`monthId`), có `name`, `amount` (số nguyên VND), `order` (phục vụ kéo-thả sắp xếp), timestamps, index `monthId` — mô phỏng đúng cấu trúc `Category` bỏ trường `type`/`budget`/`locked`/`isFallback`. Cần migration Prisma (`prisma migrate dev`), đồng bộ `docs/db/schema.dbml` và `docs/features/US-022-.../data-model.md`.
- **Số phận trường `MonthBudget.income`:** đề xuất giữ cột làm cache (các use-case ghi nguồn thu cập nhật lại tổng), còn `budget-snapshot-service` tính `income = Σ IncomeSource.amount` ở đường đọc. `ssr-data` / `ssr-plan` chốt: giữ cache hay bỏ hẳn cột và luôn tính runtime.
- **Backfill dữ liệu cũ:** các `MonthBudget` đang tồn tại hiện có `income = 35_000_000` (giá trị cứng, chưa từng sửa được). Migration nên tạo cho mỗi tháng đang có **một** `IncomeSource` tên "Lương" với số tiền bằng đúng `MonthBudget.income` hiện tại của tháng đó, để không làm hồi quy các chỉ số của tháng lịch sử. Quyết định "tháng mới bắt đầu rỗng" (Q5) chỉ áp cho tháng tạo **sau** khi tính năng lên — không mâu thuẫn với backfill. `ssr-ba` xác nhận lại điểm này.
- **Định nghĩa chỉ số mới cho glossary:** "Tiết kiệm ròng" (Thu nhập tháng − Tổng chi thực tế; có thể âm khi chi vượt thu), "Đã phân bổ vào tích lũy" (Σ Chi thực tế danh mục Loại = Tích lũy), "Tỷ lệ tiết kiệm" (Tiết kiệm ròng / Thu nhập tháng). Cần tách rõ khỏi "Số dư còn lại (mức tổng tháng)" đã có trong glossary — hai tên có thể trùng nghĩa, `ssr-ingest` rà lại để không tạo hai dòng cùng nghĩa. Xử lý chia cho 0 (Thu nhập tháng = 0): `ssr-ba` chốt hiển thị (vd "—" hoặc 0%).
- **Xung đột với US-019:** Q4 đảo một phần `DEC-094`/`DEC-096` (tháng khác tháng đang chọn chỉ xem). Sau khi có spec US-022 `Ready for DEV`, `ssr-ingest mode=sync` phải cập nhật wiki feature US-019, các BR liên quan và glossary ("Item cần mua"). Hành vi `transferPendingToMonth` khi tạo tháng mới (`DEC-095`) **giữ nguyên**.
- **"trang plan" trong raw** = tab Thu chi `/budget` (mọi chi tiết trong raw — insight, tháng mặc định, item cần mua, nguồn thu — đều thuộc tab này). Phần "đổi layout / antd / responsive toàn app" tách sang **US-023**.
- **Ràng buộc phá hòa Q3:** khi tháng hiện tại chưa có dữ liệu và có hai tháng cách đều (một quá khứ, một tương lai), `ssr-ba` chốt quy tắc chọn (đề xuất: ưu tiên tháng gần nhất trong **quá khứ** vì đó là dữ liệu Dylan nhiều khả năng muốn xem tiếp).
- **Verification cuối:** sau pipeline, chạy build + lint, smoke thủ công (mở tab đúng tháng; sửa nguồn thu → insight đổi đúng; thêm item cho tháng tương lai; chặn tháng đã qua), rồi commit + push lên `main` (yêu cầu trực tiếp của user trong raw).
