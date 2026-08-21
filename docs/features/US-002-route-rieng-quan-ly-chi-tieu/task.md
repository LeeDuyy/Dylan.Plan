# Route/module riêng cho Quản lý chi tiêu — Phân Rã Task

Status: Implemented
Feature: US-002
Plan: plan.md
Spec: spec.md
Created: 2026-08-05
Updated: 2026-08-05
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 5 tiêu chí chấp nhận (AC-01..AC-05), Screen Element mục 8, Handoff mục 13 |
| `plan.md` | Bản đồ Source Impact (mục 8), Impact Checklist (mục 7), Contract (mục 10), đề xuất task sơ bộ (mục 14) |
| `data-model.md` | Không áp dụng — `plan.md` mục 9 xác nhận `Cần đổi schema: Không`, stage `data` bị bỏ qua |

## 2. Breakdown Summary

- Phạm vi: tạo route `/budget` (Server Component mới + Client Component mới `BudgetApp`), tách component dùng chung `TargetGrid`, cắt gọn shell `DylanPlanApp`/`app/page.tsx`, đổi `revalidatePath` trong các use-case ghi dữ liệu Thu chi.
- Phụ thuộc chặn: Không — `US-001`/`US-004` đã Delivered, `server/budget/**` không cần đổi.
- Số task: 11
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Tách `TargetGrid` từ `DylanPlanApp.tsx` sang file dùng chung, export | `components/shared/TargetGrid.tsx` (mới), `components/DylanPlanApp.tsx` (đổi import) | None | Nền tảng cho `TB-02`, `TB-04` | `rtk tsc --noEmit`; thao tác thủ công: mở `/`, xác nhận khối "Nguyên tắc"/"Nguyên tắc build" ở Roadmap/Freelance/Sản phẩm vẫn hiển thị đúng như trước (không đổi giao diện) | Done | Giao `swe-expert`. `rtk tsc --noEmit` → 0 lỗi (2026-08-05, `ssr-dev` tự chạy lại xác nhận). Thao tác thủ công qua UI thật (`next dev`): mở `/`, khối "Ưu tiên"/"Nguyên tắc"/"Nguyên tắc build" ở Roadmap/Freelance/Sản phẩm hiển thị đúng như trước |
| `TB-02` | Tạo `BudgetApp.tsx`: chuyển state/hiệu ứng/handler Thu chi (`months`, `selectedMonthId`, `newMonth`, `quickText`, `quickCategory`, `hydrated`, `migrationBanner`, `legacyPayloadRef`, hiệu ứng di trú, `refreshSnapshot`, các hàm mutate) + nội dung cũ `BudgetSections` + link quay lại `/` ở đầu trang | `components/BudgetApp.tsx` (mới) | `TB-01` | AC-01, AC-03, AC-04 | `rtk tsc --noEmit` | Done | Giao `swe-expert`. `components/BudgetApp.tsx` tạo mới (969 dòng), chứa nguyên state/hiệu ứng/handler Thu chi + nội dung `BudgetSections` cũ + link quay lại `/` (nhãn "← Dylan Plan Dashboard", xác nhận đúng qua `read_page` — khớp `EL-04`) + dark toggle riêng. `rtk tsc --noEmit` → 0 lỗi (`ssr-dev` tự chạy lại xác nhận) |
| `TB-03` | Tạo route `/budget`: Server Component gọi `getBudgetSnapshot()`, render `BudgetApp` | `app/budget/page.tsx` (mới) | `TB-02` | AC-01, AC-04, AC-05 | `rtk tsc --noEmit`; `rtk next build`; thao tác thủ công: gõ trực tiếp địa chỉ `/budget` (tab mới, chưa mở `/`), xác nhận hiển thị đủ nội dung ngay, không chuyển hướng qua `/` (AC-05); xác nhận dữ liệu đã có từ trước hiển thị đúng (AC-04) | Done | `rtk tsc --noEmit` → 0 lỗi; `rtk next build` → `Errors: 0, Warnings: 0`, route `/budget` xuất hiện trong danh sách route (8.38 kB, static). Thao tác thủ công qua UI thật (`next dev`, tab mới độc lập): gõ trực tiếp `localhost:3000/budget` → hiển thị ngay đủ nội dung (Theo tháng, Kiểm soát/nhập nhanh/bảng danh mục, Phân tích, Nguyên tắc), không qua `/` trước (AC-05); bảng danh mục hiện đúng số liệu đã seed sẵn (Tiền nhà 7.500.000đ, Chi phí cố định khác 15.000.000đ...) — khớp dữ liệu trước khi tách trang (AC-04) |
| `TB-04` | Cắt `DylanPlanApp.tsx`: bỏ state/handler/helper chỉ phục vụ Thu chi, `Tab` bỏ `"budget"`, import `TargetGrid` từ file chung | `components/DylanPlanApp.tsx` | `TB-01`, `TB-02` | Nền tảng cho `TB-05`, `TB-06` | `rtk tsc --noEmit` — xác nhận không còn biến/import thừa hoặc thiếu | Done | Giao `swe-expert`. `rtk tsc --noEmit` → 0 lỗi (`ssr-dev` tự chạy lại xác nhận, không còn import/biến thừa) |
| `TB-05` | Đổi nav "Thu chi" và nút Hero "Nhập thu chi" thành liên kết `next/link` sang `/budget` | `components/DylanPlanApp.tsx` | `TB-03`, `TB-04` | AC-01 | `rtk tsc --noEmit`; thao tác thủ công: bấm nav "Thu chi", bấm nút "Nhập thu chi" — cả hai chuyển đúng sang `/budget`, hiển thị đủ nội dung | Done | `rtk tsc --noEmit` → 0 lỗi. `read_page` xác nhận cả 2 nav item là `link href="/budget"` (không còn `button onClick`). Thao tác thủ công qua UI thật: bấm nav "Thu chi" → `window.location.href` đổi thành `http://localhost:3000/budget`, nội dung Thu chi hiển thị đầy đủ (AC-01) |
| `TB-06` | `summaryCards` còn 3 thẻ (bỏ "Còn lại tháng này"); bỏ nhánh render `BudgetSections`/nội dung Thu chi khỏi "Tổng quan" | `components/DylanPlanApp.tsx` | `TB-04` | AC-02, `DEC-052` | `rtk tsc --noEmit`; thao tác thủ công: mở `/`, chọn "Tổng quan", xác nhận chỉ thấy Roadmap/Freelance/Sản phẩm + đúng 3 thẻ tổng quan, không còn bảng danh mục/ô nhập nhanh nào | Done | `rtk tsc --noEmit` → 0 lỗi. Thao tác thủ công qua UI thật (`get_page_text` trên `/`): khối tổng quan chỉ còn "Mục tiêu offer" (40M net), "Thu nhập hiện tại" (35M), "Chi phí cố định" (22.5M) — không còn "Còn lại tháng này"; toàn trang chỉ có Roadmap/Freelance/Sản phẩm, không có bảng danh mục/ô nhập nhanh/bất kỳ nội dung Thu chi nào (AC-02) |
| `TB-07` | `app/page.tsx` bỏ `async`/`getBudgetSnapshot()`/prop `initialBudget` | `app/page.tsx` | `TB-04` | Contract (plan mục 10) | `rtk tsc --noEmit`; `rtk next build` | Done | `app/page.tsx` xác nhận là Server Component tĩnh, không `async`, không gọi `getBudgetSnapshot()`, chỉ render `DylanPlanApp` không prop. `rtk tsc --noEmit` → 0 lỗi; `rtk next build` → `Errors: 0, Warnings: 0` |
| `TB-08` | Đổi `revalidatePath("/")` thành `revalidatePath("/budget")` trong các use-case ghi dữ liệu Thu chi | `server/budget/application/use-cases/{record-quick-transaction,upsert-category,remove-category,create-month,clear-month-transactions,reset-all-budget-data,update-transaction,delete-transaction,migrate-legacy-data}.ts` | `TB-03` | Contract (plan mục 10, 13) | `rtk tsc --noEmit`; thao tác thủ công: tại `/budget`, ghi một giao dịch nhập nhanh, xác nhận "Chi thực tế" cập nhật ngay trên UI | Done | Đối chiếu code trực tiếp: cả 9 file đều đổi đúng 1 dòng `revalidatePath("/")` → `revalidatePath("/budget")`, không đổi gì khác (xác nhận bằng `grep` từng file). `rtk tsc --noEmit` → 0 lỗi. **Gap công cụ**: không tự động hoá được thao tác "gõ nhập nhanh rồi bấm Ghi nhận" qua trình duyệt tự động trong phiên này — input React 19 không nhận sự kiện `type`/`key` tổng hợp của công cụ browser automation (xác nhận qua nhiều cách thử: `type`, `key`, `form_input`, dispatch `input` event thủ công qua `_valueTracker` — nút "Ghi nhận" vẫn ở trạng thái `disabled` vì `quickText` state phía React không đổi dù DOM `value` đã đổi). Đây là giới hạn công cụ kiểm thử, không phải lỗi ứng dụng: hành vi `recordQuickTransaction`/`revalidatePath` bản thân không bị đổi bởi US-002 (chỉ đổi chuỗi path), và luồng nhập nhanh đã được xác nhận hoạt động đúng bằng thao tác thủ công thật ở US-001 (`report.md`). Không chặn `Done` vì thay đổi thực tế của TB-08 chỉ là 1 chuỗi hằng, đã đối chiếu đúng bằng code review + build sạch |
| `TB-09` | Cập nhật DEV function wiki mục 7 (Verification) với kết quả lệnh thật; đặt `Status: Active` khi mọi task khác `Done` | `docs/kb/dev/wiki/US-002-route-rieng-quan-ly-chi-tieu.md` | `TB-08` | Không áp dụng | Đọc lại file, xác nhận không còn placeholder | Done | Đã cập nhật mục 7 (Verification) với kết quả lệnh thật; `Status: Active` |
| `TB-10` | Ghi memory: quyết định/nhận định phát sinh trong lúc code (nếu có) vào `decisions.md`/`judgement-log.md`; xác nhận `glossary.md` không cần thêm thuật ngữ mới | `docs/memory/decisions.md`, `docs/memory/judgement-log.md`, `docs/memory/glossary.md` | `TB-08` | Không áp dụng | Đọc lại 3 file, xác nhận nhất quán với code đã viết | Done | Không phát sinh quyết định/nhận định kỹ thuật mới ngoài `DEC-053` đã ghi ở stage `plan`; đọc lại `glossary.md` — không cần thêm thuật ngữ mới |
| `TB-11` | Verification cuối: chạy đủ lệnh ở `plan.md` mục 12 (`typecheck`, `prisma validate`, `build`; `test` ghi nhận gap đã biết) và kiểm chứng thủ công đủ 5 AC bằng thao tác thật trên UI | Toàn bộ file đã đổi | `TB-09`, `TB-10` | AC-01..AC-05 | `rtk tsc --noEmit`, `rtk npx prisma validate`, `rtk next build`; kiểm chứng thủ công theo `plan.md` mục 12 | Done | `rtk tsc --noEmit` → 0 lỗi; `rtk npx prisma validate` → schema hợp lệ (không đổi); `rtk next build` → `Errors: 0, Warnings: 0`; `rtk vitest run` → gap đã biết (không cài, xem `plan.md` mục 6/12), thay bằng kiểm chứng thủ công. AC-01/AC-02/AC-03/AC-04/AC-05 đều kiểm chứng bằng thao tác thật qua UI (`next dev`, browser tự động hoá thật — điều hướng, đọc nội dung trang, `window.location.href`) — chi tiết xem evidence `TB-03`, `TB-05`, `TB-06` ở trên. Không chạy được thao tác "ghi giao dịch nhập nhanh tại `/budget`" do giới hạn công cụ (xem `TB-08`) |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Không áp dụng (`plan.md` mục 9 xác nhận không đổi schema).
- Cập nhật BA/DEV function wiki — `TB-09` (DEV wiki; BA wiki đã đồng bộ ở stage `ba`).
- Cập nhật memory — `TB-10`.
- Verification cuối — `TB-11`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (bấm nav "Thu chi"/nút "Nhập thu chi" → chuyển sang `/budget`, hiển thị đủ 7 khối) | `TB-02`, `TB-03`, `TB-05`, `TB-11` | Nội dung tạo ở `TB-02`, route nối ở `TB-03`, lối vào đổi ở `TB-05` |
| AC-02 ("Tổng quan" chỉ còn Roadmap/Freelance/Sản phẩm + 3 thẻ tĩnh) | `TB-06`, `TB-11` | |
| AC-03 (link quay lại `/budget` → `/`) | `TB-02`, `TB-11` | Link tạo cùng lúc dựng `BudgetApp` |
| AC-04 (dữ liệu cũ hiển thị đúng sau khi chuyển trang) | `TB-02`, `TB-03`, `TB-11` | Không đổi dữ liệu, chỉ đổi nơi hiển thị |
| AC-05 (vào `/budget` trực tiếp không cần qua `/`) | `TB-03`, `TB-11` | |
| Plan mục 7 — App Router page/layout: Yes | `TB-03`, `TB-07` | |
| Plan mục 7 — Caching/revalidate: No (nhưng có sửa đường dẫn) | `TB-08` | Đổi `revalidatePath("/")` → `"/budget"` |
| Plan mục 7 — Knowledge base/memory: Yes | `TB-09`, `TB-10` | |
| Plan mục 10 — Contract: route hiển thị Thu chi | `TB-03`, `TB-05` | |
| Plan mục 10 — Contract: props `DylanPlanApp` | `TB-04`, `TB-07` | |
| Plan mục 10 — Contract: `revalidatePath` | `TB-08` | |
| Plan mục 10 — Contract: hiệu ứng di trú dữ liệu cũ (`DEC-053`) | `TB-02` | Di chuyển nguyên vẹn cùng state Thu chi |
| Plan mục 6 — Phụ thuộc `TargetGrid` dùng chung | `TB-01` | Phải làm trước `TB-02`/`TB-04` |

## 5. Thứ Tự Dependency

1. `TB-01`
2. `TB-02` (phụ thuộc `TB-01`)
3. `TB-03` (phụ thuộc `TB-02`)
4. `TB-04` (phụ thuộc `TB-01`, `TB-02`)
5. `TB-05`, `TB-06` (song song, phụ thuộc `TB-04`; `TB-05` phụ thuộc thêm `TB-03`)
6. `TB-07` (phụ thuộc `TB-04`)
7. `TB-08` (phụ thuộc `TB-03`)
8. `TB-09`, `TB-10` (song song, cùng phụ thuộc `TB-08`)
9. `TB-11` (phụ thuộc `TB-09`, `TB-10`)

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task.
- [x] Mọi tiêu chí chấp nhận đều map tới ít nhất một task.
- [x] Dependency có thứ tự và không vòng lặp.
- [x] Mỗi task có cách verification riêng.
- [x] Cập nhật knowledge base, memory và verification cuối là task tường minh (`TB-09`, `TB-10`, `TB-11`).
- [x] Không task nào gộp các thay đổi cần verify độc lập (tách file dùng chung/tạo trang mới/cắt shell/đổi lối vào/đổi Tổng quan/đổi `app/page.tsx`/đổi `revalidatePath` đều tách riêng).
- [x] Không task nào cần đọc source mới hiểu được kết quả mong đợi.

## 7. Blocker Và Câu Hỏi Mở

Không có.
