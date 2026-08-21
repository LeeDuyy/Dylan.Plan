# Cảnh báo trùng tháng khi tạo tháng mới — SE Plan

Status: Implemented
Feature: US-006
Spec: spec.md
Created: 2026-08-10
Updated: 2026-08-10
DEV Wiki: `docs/kb/dev/wiki/US-006-canh-bao-trung-thang.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Toàn bộ thay đổi nằm gọn ở phía client, trong `components/BudgetApp.tsx` — không chạm server, không đổi schema, không thêm truy vấn Prisma. Ba việc kỹ thuật chính:

1. Thay ô "Tạo tháng mới" từ input kiểu `month` (gõ tự do) thành phần tử `select` liệt kê 13 kỳ tháng liên tục (6 trước — hiện tại — 6 sau), tính bằng một hàm thuần phía client dựa trên `months` (danh sách tháng đã tải sẵn, không cần truy vấn mới) — kỳ đã có dữ liệu bị `disabled`.
2. Tách khối JSX "Tháng đang xem" thành hai khối riêng — "Chọn tháng xem" và "Tạo tháng mới" — bọc trong một wrapper CSS mới để không phá vỡ lưới 2 cột `.two-col` hiện có.
3. Sửa đúng nguyên nhân gốc khiến "Tạo tháng" và "Clone tháng hiện tại" (nay "Clone tháng đang xem") cho kết quả giống hệt nhau: hàm `createNewMonth` hiện `void cloneCurrent` (bỏ qua tham số) và luôn truyền `sourceMonthId`. Sửa để chỉ truyền `sourceMonthId` khi `cloneCurrent === true`. `server/budget/application/use-cases/create-month.ts` **không cần sửa** — logic rẽ nhánh theo `sourceMonthId` (có → sao chép cấu trúc danh mục; không có → `defaultCategories`) đã đúng sẵn, bug chỉ nằm ở phía gọi.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-006-canh-bao-trung-thang/spec.md` | Nguồn 7 AC (gồm AC-06, AC-07 gộp từ US-013), Screen Element mục 8.1/8.2, handoff mục 13 |
| `docs/kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md` | Đối chiếu mục tiêu, phạm vi, luồng nghiệp vụ |
| `docs/kb/ba/wiki/delivery/pbi/US-006-canh-bao-trung-thang.md` | Đối chiếu đủ 7 AC |
| `docs/kb/ba/wiki/knowledge/business-rule/BR-014-canh-bao-trung-thang.md` | Rule ngăn trùng tháng bằng disable trong combobox |
| `docs/kb/ba/wiki/knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md` | Rule phân biệt nghiệp vụ "Tạo tháng" (mặc định) vs "Clone tháng đang xem" (sao chép) |
| `docs/memory/decisions.md` (`DEC-004`, `DEC-007`, `DEC-026`, `DEC-061`..`DEC-065`) | Single-user không phân quyền; chi thực tế luôn derived; "Chi tiêu khác" không copy khi tạo tháng; hướng ngăn trùng; nghiệp vụ Tạo/Clone; quyết định gộp US-013 |
| `components/BudgetApp.tsx` (dòng 1-80, 175-217, 340-457, 590-680) | State `months`/`selectedMonthId`/`newMonth`, `refreshSnapshot`, `createNewMonth` hiện tại, JSX khu vực "Tháng đang xem", cách `BudgetSections` nhận props, pattern try/catch + `setToastMessage`/`setEditError` đã dùng ở nơi khác trong file |
| `server/budget/actions.ts` | Composition root — xác nhận `createMonth` chỉ là wrapper mỏng gọi `createMonthUseCase(input)`, không có logic riêng |
| `server/budget/application/use-cases/create-month.ts` | Xác nhận rẽ nhánh `sourceMonthId` đã đúng: có → sao chép danh mục (loại trừ `isFallback`); không có → `defaultCategories`; thu nhập luôn `DEFAULT_INCOME`; ném `CreateMonthError("Tháng này đã tồn tại.")` khi trùng |
| `server/budget/domain/repositories/month-budget-repository.ts` | Xác nhận `findAll()` có sẵn — không cần thêm phương thức nào |
| `server/budget/domain/entities/category.ts`, `prisma/schema.prisma` (`MonthBudget`, `Category`) | Xác nhận `MonthBudget.id` là khóa chính = chính kỳ tháng (`YYYY-MM`), không cần trường mới |
| `app/globals.css` (dòng ~200-300, ~472-480, ~775-781, ~1029-1103) | Xác nhận `.two-col` là grid 2 cột cố định (`1.08fr 0.92fr`), `.budget-tools` là grid 2 cột dùng cho cặp field — cả hai đều cần một wrapper mới khi tách khối |

## 3. Hành Vi Hiện Tại

- `components/BudgetApp.tsx:601-653` — một phần tử `article` duy nhất (class `card panel`) chứa cả nhãn "Chọn tháng" (dropdown chọn tháng xem, dòng 628-637) lẫn "Tạo tháng mới" (input kiểu `month`, dòng 638-641) và hai nút (dòng 643-652), là 1 trong 2 cột của lưới `.two-col`.
- `newMonth` (dòng 177) là ô nhập ngày tháng tự do, giá trị mặc định hard-code `"2026-07"` (còn sót từ lúc phát triển), Dylan gõ bất kỳ kỳ tháng nào kể cả đã tồn tại.
- `createNewMonth` (dòng 379-389): tham số `cloneCurrent` bị `void` — không dùng để rẽ nhánh gì. Luôn gọi `createMonthAction({ monthId: newMonth, sourceMonthId: selectedMonth.id || undefined })`, nên nút "Tạo tháng" và "Clone tháng hiện tại" luôn cho kết quả giống hệt nhau (đều sao chép cấu trúc danh mục từ tháng đang chọn).
- Không có xử lý lỗi: nếu `createMonthAction` ném lỗi (kể cả do trùng tháng), lỗi rơi thẳng ra console, không có thông báo nào cho Dylan; không có `disabled` nào trên hai nút.
- `server/budget/application/use-cases/create-month.ts:48-64` đã đúng sẵn: `input.sourceMonthId` có giá trị → sao chép `name/type/budget/locked` của các danh mục không phải `isFallback` từ tháng nguồn; không có → dùng `defaultCategories`. Ném `CreateMonthError("Tháng này đã tồn tại.")` khi `findById(monthId)` đã có bản ghi.

## 4. Hành Vi Mục Tiêu

- Ô "Tạo tháng mới" trở thành phần tử `select` liệt kê đúng 13 kỳ tháng liên tục (6 trước — tháng hiện tại — 6 sau, theo đồng hồ hệ thống), tính từ `months` đã có sẵn ở client — kỳ tháng nào trùng với một `month.id` đã tồn tại thì phần tử `option` tương ứng mang thuộc tính `disabled` kèm nhãn "(Đã có dữ liệu)".
- Giá trị mặc định của ô `select`: tháng hiện tại nếu còn trống; nếu không, quét luân phiên các kỳ liền kề (sau rồi trước, xa dần) tới khi gặp kỳ còn trống — theo đúng giả định `A5` (đã xác nhận) của spec. Toàn bộ 13 kỳ đều đã có dữ liệu → không có giá trị mặc định hợp lệ, `newMonth` rỗng.
- Nhãn khu vực xem tháng đổi từ "Chọn tháng" thành "Chọn tháng xem"; khu vực này và khu vực tạo tháng mới tách thành hai phần tử `article` (class `card panel`) riêng biệt, cùng nằm trong cột đầu của `.two-col` (không đổi cột thứ hai "Tiến độ").
- Nút "Clone tháng hiện tại" đổi nhãn hiển thị thành "Clone tháng đang xem".
- `createNewMonth(cloneCurrent)`: `cloneCurrent === false` ("Tạo tháng") → gọi `createMonthAction({ monthId: newMonth })`, không kèm `sourceMonthId` → server tự dùng `defaultCategories`. `cloneCurrent === true` ("Clone tháng đang xem") → gọi `createMonthAction({ monthId: newMonth, sourceMonthId: selectedMonth.id || undefined })` như cũ.
- Cả hai nút `disabled` khi `newMonth` rỗng (không còn kỳ tháng nào chọn được) — phủ đúng AC-04.
- Bắt lỗi khi gọi `createMonthAction` (lớp bảo vệ dự phòng AC-05): nếu server ném lỗi (trùng tháng do tạo đồng thời ở nơi khác), hiển thị `error.message` qua `setToastMessage` (component `Toast` đã có sẵn, đang dùng cho luồng xóa danh mục), sau đó vẫn làm mới `months` để kỳ tháng đó chuyển sang trạng thái `disabled`.

## 5. Luồng End-To-End

```text
components/BudgetApp.tsx
  useMemo monthPeriods = buildMonthPeriods(new Date(), months)   [HÀM MỚI, thuần client]
    -> sinh 13 kỳ tháng liên tục, đối chiếu months để đánh dấu taken/available
  useMemo/useEffect đồng bộ newMonth = pickDefaultPeriod(monthPeriods) khi monthPeriods đổi và newMonth hiện tại không còn hợp lệ

  JSX (BudgetSections, khối "Chọn tháng xem")
    -> select value=selectedMonthId onChange=setSelectedMonthId (KHÔNG đổi hành vi, chỉ đổi nhãn cha)

  JSX (BudgetSections, khối "Tạo tháng mới")
    -> select value=newMonth onChange=setNewMonth
         mỗi phần tử option lấy từ monthPeriods, disabled=period.taken
    -> button disabled=!newMonth, onClick gọi createNewMonth(false), nhãn "Tạo tháng"
    -> button disabled=!newMonth, onClick gọi createNewMonth(true), nhãn "Clone tháng đang xem"

  createNewMonth(cloneCurrent)  [SỬA]
    -> guard: !newMonth || months.some(trùng) -> return (giữ nguyên)
    -> try:
         createMonthAction({ monthId: newMonth, ...(cloneCurrent ? { sourceMonthId: selectedMonth.id || undefined } : {}) })
           -> server/budget/actions.ts#createMonth (KHÔNG đổi) -> create-month.ts (KHÔNG đổi)
         getBudgetSnapshot() -> setMonths, setSelectedMonthId(newMonth)
       catch (error):
         setToastMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại.")
         await refreshSnapshot()   [để combobox cập nhật lại trạng thái disabled]
```

Không có bước nào chạm server, Prisma, hay cache revalidate mới — `revalidatePath("/budget")` đã có sẵn trong `createMonth` use-case, không cần thêm.

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — thêm 2 hàm thuần, sửa JSX và `createNewMonth` |
| Style | `app/globals.css` | Thêm 1 class wrapper mới để giữ lưới `.two-col` 2 cột khi tách khối |
| Application | `server/budget/application/use-cases/create-month.ts` | Không đổi — rẽ nhánh `sourceMonthId` đã đúng sẵn |
| Data | Không chạm | Không đổi `prisma/schema.prisma`, không thêm truy vấn |

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-001` (data model bền vững, `MonthBudget`/`Category` đã lưu DB) | `prisma/schema.prisma`, `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` (đã đọc gián tiếp qua `actions.ts`) | Không | Đã xong, dùng lại nguyên trạng |
| `US-013` (raw, đã gộp vào spec này qua `DEC-065`) | `docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md` (status: Merged) | Không | Không áp dụng — không phải một function riêng cần chờ |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | Không chạm `app/budget/page.tsx` |
| Server Action | No | `server/budget/actions.ts` không đổi — client chỉ đổi cách gọi (có/không truyền `sourceMonthId`) |
| Route Handler (`app/api`) | N/A | Không có route handler trong bounded context này |
| Auth / middleware / permission | N/A | Single-user, không áp dụng (`DEC-004`) |
| Prisma schema | No | Không đổi |
| Migration SQLite | No | Không đổi |
| DBML | No | Không đổi |
| Seed data | No | `lib/budget-defaults.ts` không đổi |
| Caching / revalidate | No | `revalidatePath("/budget")` đã có sẵn trong use-case, không thêm |
| Export / báo cáo | No | Không ảnh hưởng |
| Mail / webhook / job nền | N/A | Không có trong bounded context này |
| Knowledge base / memory | Yes | DEV wiki `US-006-canh-bao-trung-thang.md` mới; `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry (UI) | `components/BudgetApp.tsx` | Thêm hàm thuần `buildMonthPeriods(referenceDate, months)` và `pickDefaultPeriod(periods)`; đổi input kiểu `month` thành phần tử `select` liệt kê 13 kỳ; tách JSX "Tháng đang xem" thành 2 phần tử `article`; đổi nhãn "Chọn tháng" → "Chọn tháng xem", "Clone tháng hiện tại" → "Clone tháng đang xem"; sửa `createNewMonth` để chỉ truyền `sourceMonthId` khi `cloneCurrent`, thêm `try/catch` + `disabled` cho 2 nút |
| Style | `app/globals.css` | Thêm class wrapper mới (vd `.month-panels`, `display:flex; flex-direction:column; gap` phù hợp khoảng cách hiện có của `.actions`/`.card`) bọc 2 phần tử `article` mới làm cột đầu của `.two-col`; gỡ 2 phần tử `label` khỏi grid `.budget-tools` (2 cột) vì mỗi khối giờ chỉ còn đúng 1 field |
| Application (use-case) | Không chạm | `create-month.ts` đã đúng rẽ nhánh theo `sourceMonthId` |
| Domain | Không chạm | Không có rule mới cần domain service |
| Repository | Không chạm | `findAll()`/`findById()` đã đủ, không cần phương thức mới |
| Data | Không chạm | Không đổi `prisma/schema.prisma` |
| Consumer | Không có | Không có file nào khác import `newMonth`/`createNewMonth` ngoài chính `components/BudgetApp.tsx` |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

`MonthBudget.id` đã là khóa chính duy nhất, chính là kỳ tháng (`YYYY-MM`) — đủ để kiểm tra trùng. Danh sách 13 kỳ tháng và trạng thái "đã có dữ liệu" tính hoàn toàn từ `months` (đã tải sẵn ở client qua `getBudgetSnapshot()` lúc vào trang, cập nhật lại qua `refreshSnapshot()`/`getBudgetSnapshot()` sau mỗi thao tác) — không cần thêm truy vấn Prisma, không cần trường hay bảng mới.

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `createNewMonth(cloneCurrent: boolean)` (hàm nội bộ Client Component) | Nhận `cloneCurrent` nhưng bỏ qua (`void cloneCurrent`) — luôn truyền `sourceMonthId` | Dùng `cloneCurrent` để quyết định có truyền `sourceMonthId` hay không | Không — hàm nội bộ, không phải API/route công khai, không ai gọi lại ngoài 2 nút trong chính component này |
| `newMonth` / `setNewMonth` (state + prop truyền xuống `BudgetSections`) | Giá trị từ `input type="month"` gõ tự do | Giá trị từ phần tử `select` giới hạn trong 13 kỳ đã tính; kiểu dữ liệu (`string`) không đổi | Không — vẫn cùng kiểu `string`, chỉ đổi nguồn nhập |
| `createMonth` Server Action / `CreateMonthInput` (`server/budget/actions.ts`, `create-month.ts`) | `{ monthId, sourceMonthId? }` | Không đổi | Không — chữ ký giữ nguyên, chỉ đổi cách client gọi |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `components/BudgetApp.tsx` | Thêm `buildMonthPeriods`, `pickDefaultPeriod`; đổi combobox "Tạo tháng mới"; tách JSX 2 khối; đổi nhãn; sửa `createNewMonth` (rẽ nhánh `sourceMonthId`, `try/catch`, `disabled`) |
| `app/globals.css` | Thêm class wrapper mới cho 2 khối trong cột đầu `.two-col`; điều chỉnh `.budget-tools` cho khối chỉ còn 1 field |
| `docs/kb/dev/wiki/US-006-canh-bao-trung-thang.md` | **Mới** — DEV wiki |
| `docs/kb/dev/00-index.md` | Thêm dòng US-006 |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng | Kết quả thật (2026-08-10) |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi | Passed — "No errors found" |
| Build | `rtk next build` | Errors: 0, Warnings: 0 | Passed — 1 route, Errors: 0, Warnings: 0 |
| Test | `rtk vitest run` | Chưa có framework test cài đặt (gap đã biết từ US-001) — thay bằng kiểm chứng thủ công đủ 7 AC | Không áp dụng — dùng thủ công như dự kiến |
| Thủ công — AC-01, AC-04 | Trên `next dev`, dựng dữ liệu sao cho 3/13 và sau đó 13/13 kỳ đã có dữ liệu, mở ô "Tạo tháng mới" | Đúng số kỳ mờ/không mờ theo AC; khi đủ 13/13, 2 nút bị vô hiệu hóa | Passed — 5/13 rồi 13/13, đúng trạng thái `disabled` từng bước |
| Thủ công — AC-02 | Chọn kỳ trống, bấm "Tạo tháng" | Tháng mới có danh mục mặc định (không giống danh mục đã tùy chỉnh của tháng đang xem), "Chọn tháng xem" có thêm lựa chọn mới | Passed |
| Thủ công — AC-03 | Tháng đang xem có danh mục đã sửa ngân sách, chọn kỳ trống, bấm "Clone tháng đang xem" | Tháng mới có đúng danh mục (tên/ngân sách) sao chép từ tháng đang xem, thu nhập vẫn mặc định | Passed — kể cả loại trừ danh mục fallback đúng `DEC-064` |
| Thủ công — AC-05 | Mở 2 tab, tạo cùng một kỳ tháng gần như đồng thời | Tab bấm sau nhận thông báo "Tháng này đã tồn tại.", không tạo trùng, danh sách tự cập nhật | Chưa kiểm chứng trực tiếp trong phiên này (hết kỳ tháng trống sau khi kiểm AC-04; "Reset dữ liệu" gặp lỗi có sẵn không liên quan). Xác nhận gián tiếp qua rà soát code — xem `task.md` `TB-03` |
| Thủ công — AC-06 | Quan sát giao diện | Nhãn "Chọn tháng xem" đúng chữ; 2 khối tách biệt rõ ràng | Passed |
| Thủ công — AC-07 | Tháng đang xem có danh mục tùy chỉnh, bấm "Tạo tháng" (không phải Clone) | Tháng mới ra đúng danh mục mặc định, không mang theo tùy chỉnh | Passed |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Quy tắc chọn giá trị mặc định cho combobox (`A5` trong spec) là giả định hợp lý, chưa được Dylan xác nhận trực tiếp | Thấp | Không ảnh hưởng luồng ngăn trùng chính; nếu sai chỉ cần đổi lại `pickDefaultPeriod`, không ảnh hưởng AC còn lại | Đổi giá trị mặc định về kỳ tháng hiện tại đơn giản (không quét luân phiên) nếu Dylan phản hồi khó dùng |
| Đổi từ `input type="month"` (bàn phím quen thuộc của trình duyệt) sang phần tử `select` có thể chậm hơn khi Dylan muốn nhảy xa ngoài khoảng 13 kỳ | Thấp | Đúng theo yêu cầu spec (mục 4 Ngoài Phạm Vi: không mở rộng khoảng ở requirement này) | Không cần — đây là thay đổi chủ đích, không phải lỗi |
| Wrapper CSS mới cho `.two-col` có thể lệch spacing nếu không khớp `gap`/`padding` hiện có của `.card.panel` | Thấp | Dùng lại giá trị `gap` đã có ở `.actions` (10px) hoặc khoảng cách tương đương, kiểm bằng mắt trên `next dev` trước khi coi là xong | Gỡ wrapper, trả JSX về 1 khối như cũ nếu layout vỡ |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-02` | Tách JSX thành khối "Chọn tháng xem" + "Tạo tháng mới"; đổi nhãn; thêm wrapper CSS trong `app/globals.css` | Pending |
| `TB-01` | Hàm `buildMonthPeriods`/`pickDefaultPeriod` + đổi combobox "Tạo tháng mới" (disable kỳ đã có dữ liệu) trong `components/BudgetApp.tsx` — phụ thuộc `TB-02` | Pending |
| `TB-03` | Sửa `createNewMonth` (rẽ nhánh `sourceMonthId` theo `cloneCurrent`, `try/catch` báo lỗi trùng, `disabled` 2 nút) — phụ thuộc `TB-01`, `TB-02` | Pending |
| `TB-04` | Verification tổng hợp: typecheck, build, đủ 7 AC thủ công trên `next dev`; cập nhật DEV wiki mục 7 — phụ thuộc `TB-01`, `TB-02`, `TB-03` | Pending |

Readiness: Ready (đã qua `ssr-breaker`, xem `task.md` mục 3-6 cho chi tiết đầy đủ)
