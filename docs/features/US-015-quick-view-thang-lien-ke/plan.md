# Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view — SE Plan

Status: Implemented
Feature: US-015
Spec: spec.md
Created: 2026-08-11
Updated: 2026-08-11
DEV Wiki: `docs/kb/dev/wiki/US-015-quick-view-thang-lien-ke.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Toàn bộ thay đổi nằm gọn ở phía client, trong `components/BudgetApp.tsx` — không chạm server, không đổi schema, không thêm truy vấn Prisma. `months` (danh sách tháng đã tải sẵn qua `getBudgetSnapshot()`) đã được server sắp xếp tăng dần theo `id` (kỳ tháng, dạng `YYYY-MM`) trước khi trả về — đúng thứ tự "danh sách tháng đã tạo" mà spec cần, không cần sắp lại ở client.

Một việc kỹ thuật duy nhất: thêm hàm thuần `getQuickViewMonths(months, selectedMonthId)` tìm vị trí của tháng đang xem trong `months` (đã sắp tăng dần sẵn) và trả về tối đa 3 phần tử liền kề (chỉ số `index-1`, `index`, `index+1`, bỏ qua chỉ số ngoài mảng) — rồi dùng kết quả này thay cho `[...months].reverse()` làm nguồn `map()` của khối `month-grid` ("Lịch sử thu chi"). Không đổi JSX bên trong từng thẻ, không đổi hành vi `onClick`/class `active` đã có.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-015-quick-view-thang-lien-ke/spec.md` | Nguồn 6 AC, Screen Element mục 8.1/8.2, handoff mục 13 |
| `docs/kb/ba/wiki/knowledge/feature/US-015-quick-view-thang-lien-ke.md` | Đối chiếu mục tiêu, phạm vi, luồng nghiệp vụ |
| `docs/kb/ba/wiki/delivery/pbi/US-015-quick-view-thang-lien-ke.md` | Đối chiếu đủ 6 AC |
| `docs/kb/ba/wiki/knowledge/business-rule/BR-018-quick-view-3-the-thang.md` | Rule giới hạn 3 thẻ, cách tính tháng trước/sau, cách xử lý khi thiếu |
| `docs/kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md` | Ràng buộc thực thể Tháng ngân sách — xác nhận không cần đổi cấu trúc |
| `docs/kb/dev/wiki/US-006-canh-bao-trung-thang.md` | Đối chiếu bounded context `budget`, xác nhận `MonthBudget.id` đã là khóa chính = kỳ tháng, không cần trường mới |
| `docs/memory/decisions.md` (`DEC-004`, `DEC-071`, `DEC-072`) | Single-user không phân quyền; tính tháng trước/sau theo danh sách đã tạo; ẩn thẻ khi thiếu |
| `components/BudgetApp.tsx` (dòng 1-45, 103-145, 210-230, 305-310, 655-760) | Import/type, các hàm thuần hiện có (`formatMonthLabel`, `buildMonthPeriods`, `pickDefaultPeriod`), state `months`/`selectedMonthId`, `selectedMonth` (`useMemo`), khối JSX "Chọn tháng xem" (dòng 686-696) và khối `month-grid` "Lịch sử thu chi" (dòng 741-759) |
| `server/budget/domain/services/budget-snapshot-service.ts` | Xác nhận `months` trả về đã `.sort((a, b) => a.id.localeCompare(b.id))` — tăng dần theo kỳ tháng, đúng thứ tự "đã tạo" cần cho `getQuickViewMonths` |
| `server/budget/application/use-cases/get-budget-snapshot.ts`, `server/budget/actions.ts` | Xác nhận `getBudgetSnapshot()` không cần đổi — chỉ gọi lại service hiện có, trả nguyên `months` |
| `app/budget/page.tsx` | Xác nhận Server Component chỉ gọi `getBudgetSnapshot()` rồi truyền `initialBudget` cho `BudgetApp` — không cần sửa |
| `prisma/schema.prisma` (`MonthBudget`) | Xác nhận `id` là khóa chính duy nhất dạng `YYYY-MM`, không cần trường/index mới |

## 3. Hành Vi Hiện Tại

- `components/BudgetApp.tsx:741-759` — khối `div.month-grid` render **toàn bộ** `months` bằng `[...months].reverse().map(...)` (đảo thành giảm dần theo kỳ tháng để hiển thị tháng mới nhất trước), không giới hạn số lượng thẻ. Mỗi thẻ (`article.card.month-card`) hiển thị kỳ tháng, số tiền còn lại, chi thực tế và % thu nhập; có `onClick={() => setSelectedMonthId(month.id)}` và class `active` khi `month.id === selectedMonthId`.
- `components/BudgetApp.tsx:686-696` — khối "Chọn tháng xem" (`select`) cũng dùng `[...months].reverse()` làm nguồn `option`, không đổi ở requirement này (thuộc `US-006` `EL-01`, dùng chung không sửa).
- `months` đến từ prop `initialBudget.months` (Server Component `app/budget/page.tsx` gọi `getBudgetSnapshot()`), đã được `budget-snapshot-service.ts:95` sắp tăng dần theo `id` trước khi trả về.

## 4. Hành Vi Mục Tiêu

- Khối `month-grid` chỉ render tối đa 3 thẻ: tháng liền trước, tháng đang xem, tháng liền sau — lấy từ hàm thuần mới `getQuickViewMonths(months, selectedMonthId)`.
- `getQuickViewMonths` tìm `index = months.findIndex((m) => m.id === selectedMonthId)`; trả về `[months[index - 1], months[index], months[index + 1]].filter(Boolean)` (bỏ phần tử `undefined` khi `index - 1 < 0` hoặc `index + 1 >= months.length`) — đúng ngữ nghĩa BR-018/DEC-071/DEC-072 vì `months` đã sắp tăng dần sẵn theo kỳ tháng.
- Không đổi nội dung/JSX bên trong từng thẻ (kỳ tháng, số tiền còn lại, chi thực tế, % thu nhập), không đổi `onClick`/class `active` — chỉ đổi nguồn mảng đưa vào `.map()`.
- Khối "Chọn tháng xem" (dòng 686-696) và toàn bộ luồng tạo tháng mới (`US-006`) giữ nguyên, không sửa.

## 5. Luồng End-To-End

```text
components/BudgetApp.tsx
  getQuickViewMonths(months, selectedMonthId)   [HÀM MỚI, thuần client]
    -> index = months.findIndex(m => m.id === selectedMonthId)
    -> trả [months[index-1], months[index], months[index+1]].filter(Boolean)

  JSX khối "Lịch sử thu chi" (div.month-grid)   [SỬA nguồn map]
    -> getQuickViewMonths(months, selectedMonthId).map((month) => thẻ article.card.month-card, JSX bên trong giữ nguyên)
         onClick={() => setSelectedMonthId(month.id)}   [KHÔNG đổi]

  setSelectedMonthId(month.id)   [KHÔNG đổi — state có sẵn]
    -> re-render -> getQuickViewMonths tính lại theo selectedMonthId mới -> 3 thẻ mới quanh tháng vừa chọn
```

Không có bước nào chạm server, Prisma, hay cache revalidate — `months` đã có sẵn ở client từ lúc tải trang, không cần truy vấn thêm.

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — thêm 1 hàm thuần, đổi nguồn `.map()` của khối `month-grid` |
| Application | Không chạm | Không có use-case nào bị ảnh hưởng |
| Data | Không chạm | Không đổi `prisma/schema.prisma`, không thêm truy vấn |

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-001` (data model bền vững, `MonthBudget` đã lưu DB, `months` sắp tăng dần theo `id`) | `server/budget/domain/services/budget-snapshot-service.ts:95`, `docs/requirements-index.md` (Delivered With Notes) | Không | Đã xong, dùng lại nguyên trạng |
| `US-006` (khối "Chọn tháng xem"/"Tạo tháng mới" cùng trang) | `docs/requirements-index.md` (Delivered With Notes), `components/BudgetApp.tsx:684-726` | Không — chỉ dùng chung cùng trang, không đổi hành vi của khối đó | Không áp dụng |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | Không chạm `app/budget/page.tsx` |
| Server Action | No | `server/budget/actions.ts` không đổi |
| Route Handler (`app/api`) | N/A | Không có route handler trong bounded context này |
| Auth / middleware / permission | N/A | Single-user, không áp dụng (`DEC-004`) |
| Prisma schema | No | Không đổi |
| Migration SQLite | No | Không đổi |
| DBML | No | Không đổi |
| Seed data | No | Không đổi |
| Caching / revalidate | No | Không thêm/đổi truy vấn hay revalidate |
| Export / báo cáo | No | Không ảnh hưởng |
| Mail / webhook / job nền | N/A | Không có trong bounded context này |
| Knowledge base / memory | Yes | DEV wiki `US-015-quick-view-thang-lien-ke.md` mới; `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry (UI) | `components/BudgetApp.tsx` | Thêm hàm thuần `getQuickViewMonths(months, selectedMonthId)`; đổi nguồn `.map()` của khối `month-grid` (dòng 742) từ `[...months].reverse()` sang `getQuickViewMonths(months, selectedMonthId)` |
| Application (use-case) | Không chạm | Không có use-case nào cần sửa |
| Domain service / rule | Không cần | Lọc hiển thị thuần UI, không phải nghiệp vụ cần domain service — logic gói gọn trong 1 hàm thuần phía component |
| Repository | Không chạm | `findAll()` đã đủ, không cần phương thức mới |
| Data | Không chạm | Không đổi `prisma/schema.prisma` |
| UI | `components/BudgetApp.tsx` | Khối `month-grid` render tối đa 3 thẻ thay vì toàn bộ `months` |
| Consumer | Không có | Không có file nào khác import hay dùng lại khối `month-grid`/`getQuickViewMonths` ngoài chính `components/BudgetApp.tsx` |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

`months` đã tải sẵn ở client qua `getBudgetSnapshot()` lúc vào trang (và làm mới qua các hàm `refreshSnapshot`/tương đương sau mỗi thao tác), đã sắp tăng dần theo `id` (kỳ tháng) sẵn từ `budget-snapshot-service.ts`. `getQuickViewMonths` chỉ lọc lại mảng đã có trong bộ nhớ trình duyệt — không cần truy vấn Prisma mới, không cần trường hay bảng mới.

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| Khối `month-grid` (nguồn `.map()`) | `[...months].reverse()` — toàn bộ tháng, giảm dần | `getQuickViewMonths(months, selectedMonthId)` — tối đa 3 tháng liền kề, tăng dần (trước → đang xem → sau) | Không — hàm nội bộ Client Component, không phải API/route công khai; không ai gọi lại khối này ngoài chính component |
| `getQuickViewMonths(months, selectedMonthId)` (hàm nội bộ mới) | Chưa tồn tại | `(MonthBudgetSnapshot[], string) => MonthBudgetSnapshot[]`, độ dài 1-3 | Không — hàm mới, không thay thế contract công khai nào |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `components/BudgetApp.tsx` | Thêm hàm thuần `getQuickViewMonths`; đổi nguồn `.map()` của khối `month-grid` (dòng 742) |
| `docs/kb/dev/wiki/US-015-quick-view-thang-lien-ke.md` | **Mới** — DEV wiki |
| `docs/kb/dev/00-index.md` | Thêm dòng US-015 |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng | Kết quả thật (2026-08-11) |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi | Passed — "No errors found" |
| Build | `rtk next build` | Errors: 0, Warnings: 0 | Passed — 1 route, Errors: 0, Warnings: 0 |
| Test | `rtk vitest run` | Chưa có framework test cài đặt trong dự án (gap đã biết từ US-001/US-006) — thay bằng kiểm chứng thủ công đủ 6 AC trên `next dev` | Không áp dụng — dùng thủ công như dự kiến |
| Thủ công — tương đương AC-01 | Trên dữ liệu dev thật (13 tháng liên tục "2026-02".."2027-02"), chọn xem "2026-08" (tháng giữa) | Đúng 3 thẻ: tháng trước/đang xem (nổi bật)/tháng sau | Passed — "2026-07"/"2026-08" (nổi bật, khớp progress bar)/"2026-09" |
| Thủ công — tương đương AC-03 | Giá trị mặc định lúc tải trang là tháng cuối cùng đã tạo ("2027-02") | Chỉ 2 thẻ, không có "tháng sau" | Passed — "2027-01"/"2027-02" (nổi bật) |
| Thủ công — tương đương AC-02 + AC-06 | Dùng "Chọn tháng xem" nhảy tới "2026-02" (tháng đầu) | Chỉ 2 thẻ, không có "tháng trước"; dropdown vẫn nhảy được tới tháng ngoài 3 thẻ | Passed — "2026-02" (nổi bật)/"2026-03" |
| Thủ công — AC-05 | Từ tình huống AC-01, bấm vào thẻ "2026-09" | Tháng đang xem đổi thành "2026-09"; 3 thẻ cập nhật lại | Passed — "2026-08"/"2026-09" (nổi bật, "Còn lại 35.000.000 ₫" khớp)/"2026-10" |
| Thủ công — AC-04 | Chỉ có đúng 1 tháng đã tạo | Chỉ hiện 1 thẻ | Chưa tái hiện trực tiếp — dữ liệu dev hiện có 13 tháng, không có cách reset an toàn trong phiên này (nút "Reset dữ liệu" có lỗi có sẵn không liên quan, ghi nhận từ US-006). Xác nhận gián tiếp qua đọc code `getQuickViewMonths`: khi `months.length === 1`, cả hai phần tử lân cận đều `undefined` và bị `.filter(Boolean)` loại, chỉ còn đúng 1 thẻ |

Lưu ý: dữ liệu dev thật hiện có (13 tháng liên tục, không có khoảng trống) không tái hiện đúng nghĩa "bỏ qua tháng chưa tạo nằm giữa hai tháng đã tạo" của AC-01 gốc trong spec — nhưng `getQuickViewMonths` chỉ dựa trên **vị trí trong mảng** (`index ± 1`), không phân biệt lịch hay khoảng trống, nên kết quả đúng trên dữ liệu liên tục đã đủ chứng minh thuật toán đúng cho cả trường hợp có khoảng trống.

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Không có framework test tự động (`rtk vitest run` chưa cấu hình trong dự án) để phủ `getQuickViewMonths` bằng unit test | Thấp | Hàm thuần, dễ kiểm bằng tay qua 6 AC trên `next dev`; logic đơn giản (lấy index ± 1) | Không cần — cùng gap đã chấp nhận từ US-006 |
| `getQuickViewMonths` trả mảng rỗng nếu `selectedMonthId` không khớp phần tử nào trong `months` (trường hợp lý thuyết, `selectedMonth` `useMemo` đã có fallback `months[0] ?? EMPTY_MONTH`) | Thấp | Giữ nguyên bất biến hiện có: `selectedMonthId` luôn được khởi tạo/đồng bộ về một `month.id` có thật trong `months` (dòng 213, 306) | Nếu xảy ra, thêm fallback `months[0]` tương tự `selectedMonth` |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Hàm thuần `getQuickViewMonths(months, selectedMonthId)` + đổi nguồn `.map()` của khối `month-grid` trong `components/BudgetApp.tsx` | Pending |
| `TB-02` | Verification tổng hợp: typecheck, build, đủ 6 AC thủ công trên `next dev`; cập nhật DEV wiki mục 7 — phụ thuộc `TB-01` | Pending |

Readiness: Ready (đã qua `ssr-breaker`, xem `task.md` mục 3-6 cho chi tiết đầy đủ)
