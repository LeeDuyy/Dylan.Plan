# Route/module riêng cho Quản lý chi tiêu — SE Plan

Status: Implemented
Feature: US-002
Spec: spec.md
Created: 2026-08-05
Updated: 2026-08-05
DEV Wiki: `docs/kb/dev/wiki/US-002-route-rieng-quan-ly-chi-tieu.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Đây là một refactor thuần UI/routing, không đổi Prisma schema, không đổi Server Action. `app/page.tsx` hiện là Server Component duy nhất, gọi `getBudgetSnapshot()` rồi truyền `initialBudget` xuống Client Component `DylanPlanApp` (1808 dòng) — component này vẽ **cả 5 khu vực** (Tổng quan, Roadmap, Freelance, Sản phẩm, Thu chi) trong cùng một cây React, chuyển "tab" chỉ bằng state `activeTab` cục bộ, không đổi URL.

Điểm mấu chốt: toàn bộ UI + state + handler của khu vực Thu chi đã được factor sẵn thành một hàm con `BudgetSections(...)` (dòng 1184-1701 của `DylanPlanApp.tsx`) nhận props thuần (dữ liệu + callback), nhưng **state và handler nguồn** (`months`, `selectedMonthId`, `quickText`, hiệu ứng di trú dữ liệu cũ, các hàm gọi Server Action...) vẫn khai báo ở cấp `DylanPlanApp`. Việc tách route vì vậy không phải viết lại UI Thu chi, mà là: (1) tạo `app/budget/page.tsx` làm Server Component riêng tự gọi `getBudgetSnapshot()`, (2) tạo Client Component mới `components/BudgetApp.tsx` chứa nguyên state/handler/hiệu ứng di trú hiện đang nằm trong `DylanPlanApp` cộng nội dung cũ của `BudgetSections`, (3) cắt gọn `DylanPlanApp.tsx` — bỏ toàn bộ state/handler/import chỉ phục vụ Thu chi, đổi 2 điểm điều hướng ("Thu chi" trên nav, nút "Nhập thu chi") thành `next/link`, và bỏ thẻ "Còn lại tháng này" khỏi khối tổng quan (`DEC-052`) — kéo theo `app/page.tsx` không còn cần là Server Component gọi `getBudgetSnapshot()` nữa, vì shell không còn hiển thị dữ liệu Thu chi ở bất kỳ đâu.

Một component dùng chung giữa shell và trang Thu chi (`TargetGrid` — khối "N ô số liệu + nhãn") cần tách ra file riêng để cả hai phía import, tránh trùng code.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-002-route-rieng-quan-ly-chi-tieu/spec.md` | Nguồn yêu cầu chính thức — 5 AC, Screen Element, Handoff |
| `docs/kb/ba/wiki/knowledge/feature/US-002-route-rieng-quan-ly-chi-tieu.md` | Business rule BR-006, phạm vi |
| `docs/memory/decisions.md` | `DEC-002` (dùng chung codebase), `DEC-004` (single-user), `DEC-005` (route `/budget`), `DEC-049`/`DEC-050`/`DEC-051`/`DEC-052` (chi tiết điều hướng, bỏ nội dung Thu chi khỏi Tổng quan kể cả thẻ "Còn lại tháng này") |
| `docs/memory/rules.md` (project) | Không có luật riêng chặn requirement này |
| `docs/kb/dev/00-index.md`, `docs/kb/dev/wiki/US-004-sua-xoa-tung-giao-dich.md` | Xác nhận kiến trúc `server/budget/**` (Light DDD) đã triển khai, không cần đổi cho US-002 |
| `docs/features/US-004-sua-xoa-tung-giao-dich/spec.md`, `plan.md`, `docs/kb/ba/wiki/delivery/pbi/US-004-sua-xoa-tung-giao-dich.md` | Đối chiếu mục 11 (tác động chéo) của spec US-002 — xác nhận vị trí Screen Element US-004 cần cập nhật follow-up sau khi US-002 xong |
| `app/page.tsx` | Xác nhận Server Component hiện tại: `async function Home()`, gọi `getBudgetSnapshot()`, truyền `initialBudget` cho `DylanPlanApp` |
| `app/layout.tsx` | Xác nhận root layout áp dụng chung cho mọi route dưới `app/`, kể cả route mới `app/budget` — không cần layout riêng |
| `next.config.mjs` | Xác nhận không có `rewrites`/`redirects` nào ảnh hưởng route `/budget`; không có `middleware.ts` |
| `components/DylanPlanApp.tsx` (đọc dòng 1-60, 60-290, 280-660, 1140-1360, 1680-1808; grep cấu trúc còn lại) | Xác nhận: `Tab` type (dòng 49), nav-tabs 5 mục (dòng 511-544), hero 2 nút CTA (dòng 558-567), khối tổng quan 4 thẻ (dòng 504-508, `summaryCards`), điều kiện render theo `activeTab` (dòng 595-649), `BudgetProps`/`BudgetSections` (dòng 1148-1702, tự chứa toàn bộ UI Thu chi), helper `TargetGrid` (dòng 1704-1736, dùng chung Roadmap/Freelance/Sản phẩm/Thu chi — 11 lượt gọi qua `grep`), helper `TopicList`/`GateSection` (chỉ dùng trong Roadmap/Freelance/Sản phẩm, không dùng trong Budget), helper `formatMoney`/`safeNumber`/`extractAmount`/`formatMonthLabel`/`toLegacyMigrationPayload`/`LegacyStoredState*` (chỉ dùng trong phạm vi Thu chi — xác nhận qua `grep`), helper `shortMoney` (chỉ dùng ở 2 thẻ tổng quan tĩnh còn giữ lại, không dùng trong Budget) |
| `server/budget/actions.ts` (grep danh sách export) | Xác nhận đủ 11 export (8 từ US-001 + `updateTransaction`/`deleteTransaction` từ US-004) — không cần thêm Server Action nào cho US-002 |
| `prisma/schema.prisma` | Không cần đọc chi tiết — spec mục 13 và US-004 plan đã xác nhận `Transaction`/`Category`/`MonthBudget` đủ dùng, US-002 không chạm dữ liệu |

## 3. Hành Vi Hiện Tại

- `app/page.tsx` là route `/` duy nhất, Server Component `async`, gọi `getBudgetSnapshot()` trước khi render, luôn tải dữ liệu Thu chi dù Dylan có xem tab Thu chi hay không.
- `components/DylanPlanApp.tsx` (Client Component) nhận `initialBudget`, giữ **toàn bộ** state của cả 5 khu vực trong cùng một component: `activeTab` (`"overview" | "roadmap" | "freelance" | "product" | "budget"`), cộng state riêng cho Thu chi (`months`, `selectedMonthId`, `newMonth`, `quickText`, `quickCategory`, `hydrated`, `migrationBanner`, `legacyPayloadRef`) và `dark` (dùng chung toàn app).
- Thanh điều hướng (`nav-tabs`, dòng 520-538) render 5 nút bấm (thẻ `button`, `onClick` gọi `setActiveTab(tab)`) — bấm "Thu chi" chỉ đổi state cục bộ, không đổi URL.
- Nút "Nhập thu chi" ở Hero (dòng 563-566) cũng chỉ `setActiveTab("budget")`.
- Khối tổng quan 4 thẻ (`summaryCards`, dòng 504-509) hiển thị khi `activeTab === "overview" || activeTab === "budget"` (dòng 595) — bao gồm thẻ thứ 4 "Còn lại tháng này" tính từ `totals.remaining` (số liệu Thu chi).
- Roadmap/Freelance/Sản phẩm/Thu chi mỗi khối render khi `activeTab === "overview"` **hoặc** đúng tab của nó (dòng 619-649) — khi chọn "Tổng quan", cả 4 khối (kể cả Thu chi) hiển thị gộp.
- Hiệu ứng di trú dữ liệu cũ (`useEffect` dòng 341-386) chạy vô điều kiện mỗi khi `DylanPlanApp` mount — tức là chạy ngay cả khi Dylan chỉ mở `/` và chưa từng bấm vào tab "Thu chi".
- `BudgetSections` (dòng 1184-1701) là hàm con thuần props-in, chứa toàn bộ UI Thu chi: chọn/tạo tháng, banner di trú, nhập nhanh, bảng danh mục, bảng chi tiết chi tiêu, phân tích, "Quy tắc kiểm soát" (dùng chung `TargetGrid`), nút xuất JSON.

## 4. Hành Vi Mục Tiêu

- **`app/budget/page.tsx` (mới)** — Server Component `async`, gọi `getBudgetSnapshot()`, render component `BudgetApp` với prop `initialBudget` truyền vào. Route `/budget` độc lập, vào được trực tiếp (AC-05).
- **`components/BudgetApp.tsx` (mới)** — Client Component nhận `initialBudget`, chuyển nguyên state/hiệu ứng hiện đang nằm trong `DylanPlanApp` mà chỉ phục vụ Thu chi: `months`, `selectedMonthId`, `newMonth`, `quickText`, `quickCategory`, `hydrated`, `migrationBanner`, `legacyPayloadRef`, hiệu ứng di trú dữ liệu cũ (nguyên vẹn — chỉ đổi nơi mount, xem mục 13), `dark` + hiệu ứng đọc/ghi `localStorage[STORAGE_KEY]` (đọc riêng độc lập với shell, cùng key `dylan-plan-next-dashboard-v2`, chỉ còn field `dark` — hai trang cùng đọc/ghi 1 key không xung đột vì chỉ là toggle class `document.body`). Render: header có link quay lại `/` (`EL-04`, dòng đầu trang) + nội dung cũ của `BudgetSections` (không đổi UI/hành vi bên trong, đúng AC-01/AC-04/AC-05).
- **`components/shared/TargetGrid.tsx` (mới)** — tách nguyên `TargetGrid` (props không đổi) ra file riêng, export, để cả `DylanPlanApp.tsx` (Roadmap/Freelance/Sản phẩm) và `BudgetApp.tsx` (khối "Quy tắc kiểm soát") cùng import — tránh trùng code giữa hai file.
- **`components/DylanPlanApp.tsx` (sửa)** — bỏ prop `initialBudget`; bỏ toàn bộ state/handler/helper chỉ phục vụ Thu chi (`months`, `selectedMonthId`, `newMonth`, `quickText`, `quickCategory`, `hydrated`, `migrationBanner`, `legacyPayloadRef`, hiệu ứng di trú, `refreshSnapshot`, `updateCategoryLocal`, `commitCategory`, `addQuickExpense`, `addCategory`, `removeCategory`, `resetActual`, `createNewMonth`, `exportData`, `resetAll`, `inferredQuickCategory`, `quickAmount`, `totals`, `BudgetProps`, `BudgetSections`, `safeNumber`, `extractAmount`, `formatMoney`, `formatMonthLabel`, `toLegacyMigrationPayload`, `LegacyStoredState`/`LegacyStoredCategory`/`LegacyStoredTransaction`/`LegacyStoredMonth`); giữ nguyên `dark` + hiệu ứng riêng của nó (đọc/ghi cùng `STORAGE_KEY`); `Tab` bỏ giá trị `"budget"` (còn `"overview" | "roadmap" | "freelance" | "product"`); nav item "Thu chi" và nút Hero "Nhập thu chi" đổi từ nút bấm gọi `setActiveTab` sang liên kết `next/link` trỏ tới `/budget`, giữ nguyên class/icon để không đổi giao diện (AC-01, `EL-01`/`EL-02`); `summaryCards` bỏ phần tử thứ 4 ("Còn lại tháng này"), còn 3 thẻ; điều kiện render khối tổng quan đổi từ `activeTab === "overview" || activeTab === "budget"` thành chỉ `activeTab === "overview"`; bỏ hẳn nhánh render component `BudgetSections` gắn với điều kiện `activeTab === "overview" || activeTab === "budget"` (AC-02, `EL-03`, `EL-06`).
- **`app/page.tsx` (sửa)** — không còn cần `async`/`getBudgetSnapshot()`/`initialBudget` vì `DylanPlanApp` không còn đọc dữ liệu Thu chi ở bất kỳ đâu; trở thành Server Component tĩnh chỉ render component `DylanPlanApp` không kèm prop nào.

## 5. Luồng End-To-End

```text
Entry mới: app/budget/page.tsx (Server Component, mới)
  -> getBudgetSnapshot() (server/budget/actions.ts, đã có — không đổi)
  -> render components/BudgetApp.tsx (Client Component, mới) với initialBudget
  -> hiệu ứng mount: đọc localStorage[STORAGE_KEY] -> dark + legacy migration payload (nếu còn)
       -> nếu có payload chưa di trú: getMigrationStatus() -> migrateLegacyData() (đã có, không đổi) -> refreshSnapshot()
  -> thao tác Dylan (nhập nhanh / sửa danh mục / tạo tháng / xuất JSON...) gọi đúng Server Action đã có (recordQuickTransaction, upsertCategory, createMonth, updateTransaction, deleteTransaction...)
  -> revalidatePath("/") (đã có trong use-case, không đổi) -> client gọi lại getBudgetSnapshot() -> refreshSnapshot() cập nhật state -> UI cập nhật

Entry shell: app/page.tsx (Server Component, sửa — bỏ getBudgetSnapshot())
  -> render components/DylanPlanApp.tsx (Client Component, sửa — bỏ toàn bộ state/UI Thu chi)
  -> bấm nav "Thu chi" / nút "Nhập thu chi" -> next/link điều hướng sang /budget (client-side navigation, Next.js App Router)
  -> bấm link quay lại ở đầu trang /budget -> next/link điều hướng về /
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-001` (data model, `server/budget/**`, `getBudgetSnapshot`, luồng di trú) | Đọc trực tiếp `server/budget/actions.ts`, `components/DylanPlanApp.tsx` — đã Delivered, đang chạy tốt | Không | US-002 chỉ di chuyển nơi gọi các hàm đã có, không đổi bản thân chúng |
| `US-004` (nút Sửa/Xóa giao dịch inline trong `BudgetSections`) | Đọc trực tiếp `components/DylanPlanApp.tsx` dòng 1210-1279 — đã Delivered, nằm trong đúng khối sẽ di chuyển nguyên vẹn sang `BudgetApp.tsx` | Không | Di chuyển nguyên khối, không sửa logic sửa/xóa giao dịch |
| `TargetGrid` dùng chung Roadmap/Freelance/Sản phẩm/Thu chi | Grep 11 lượt gọi trong `DylanPlanApp.tsx` | Có (chặn nội bộ, không chặn requirement) | Phải tách `components/shared/TargetGrid.tsx` **trước** khi sửa cả `DylanPlanApp.tsx` lẫn `BudgetApp.tsx`, để cả hai cùng import từ một nguồn thay vì tạm thời trùng code |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | Yes | `app/budget/page.tsx` mới (route mới); `app/page.tsx` sửa (bỏ `async`/`getBudgetSnapshot`); `app/layout.tsx` không đổi (áp dụng chung cho cả `/budget`) |
| Server Action | No | Dùng nguyên 11 export đã có trong `server/budget/actions.ts`, không thêm/sửa hàm nào |
| Route Handler (`app/api`) | N/A | Không dùng route riêng |
| Auth / middleware / permission | N/A | Single-user, không phân quyền (`DEC-004`); không có `middleware.ts` |
| Prisma schema | No | Không đổi model nào |
| Migration SQLite | No | Không đổi schema |
| DBML | No | Không đổi schema |
| Seed data | No | `lib/budget-defaults.ts` không đổi |
| Caching / revalidate | No | Các Server Action hiện có đã tự `revalidatePath("/")`; do route Thu chi đổi từ `/` sang `/budget`, cần xác nhận `revalidatePath` vẫn đúng đích — ghi chú rủi ro ở mục 13, không phải thay đổi bắt buộc cho US-002 (không chặn AC nào) |
| Export / báo cáo | No | `exportData` (xuất JSON) di chuyển nguyên vẹn sang `BudgetApp.tsx`, hành vi không đổi (spec mục 9 xác nhận) |
| Mail / webhook / job nền | N/A | Không có |
| Knowledge base / memory | Yes | DEV function wiki mới cho US-002; `SSR_DEV_KB_INDEX` cập nhật; `decisions.md` thêm `DEC-053` (vị trí hiệu ứng di trú) |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry (route mới) | `app/budget/page.tsx` (mới) | Server Component `async`, gọi `getBudgetSnapshot()`, render component `BudgetApp` với prop `initialBudget` |
| Entry (route sửa) | `app/page.tsx` | Bỏ `async`, bỏ gọi `getBudgetSnapshot()`, bỏ prop `initialBudget` truyền xuống `DylanPlanApp` |
| UI (component mới) | `components/BudgetApp.tsx` (mới) | Chứa toàn bộ state/hiệu ứng/handler Thu chi chuyển từ `DylanPlanApp.tsx`, cộng nội dung cũ của `BudgetSections`; thêm link quay lại `/` ở đầu trang (`EL-04`) |
| UI (shared, mới) | `components/shared/TargetGrid.tsx` (mới) | Tách nguyên `TargetGrid` từ `DylanPlanApp.tsx`, export để dùng chung |
| UI (component sửa) | `components/DylanPlanApp.tsx` | Bỏ state/handler/helper chỉ phục vụ Thu chi (liệt kê đủ ở mục 4); đổi 2 điểm điều hướng thành `next/link`; bỏ thẻ 4 khỏi `summaryCards`; bỏ nhánh render `BudgetSections`; import `TargetGrid` từ file chung thay vì định nghĩa tại chỗ |
| Application / Domain / Infrastructure | Không đổi | `server/budget/**` giữ nguyên — chỉ đổi nơi gọi (client component nào import `server/budget/actions`), không đổi bản thân use-case/repository |
| Data | `prisma/schema.prisma` | Không đổi |
| Consumer | Không có file nào khác import `DylanPlanApp` ngoài `app/page.tsx` (xác nhận qua cấu trúc `app/` chỉ có 1 page) | Không ảnh hưởng thêm |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

`MonthBudget`, `Category`, `Transaction`, `LegacyMigration` (từ US-001) đã đủ cho toàn bộ nội dung hiển thị tại `/budget` — US-002 không thêm/bớt trường nào, chỉ đổi nơi trong cây component gọi `getBudgetSnapshot()`/các Server Action đã có.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `MonthBudget`, `Category`, `Transaction`, `LegacyMigration` | Không đổi | — | — | — | Không có |

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| Route hiển thị Thu chi | `/` (tab "Thu chi" trong `DylanPlanApp`) | `/budget` (trang riêng) | Có, đối với người dùng — nhưng đây chính là mục tiêu nghiệp vụ của US-002 (`DEC-005`); không breaking về mặt kỹ thuật (dữ liệu/Server Action không đổi) |
| `DylanPlanApp` (props) | `{ initialBudget: BudgetSnapshot }` | `{}` (không nhận prop) | Có — nhưng chỉ ảnh hưởng nội bộ `app/page.tsx`, không có consumer nào khác |
| `app/page.tsx` | `async function Home()`, gọi `getBudgetSnapshot()` | `function Home()` đồng bộ, không gọi Server Action nào | Không breaking với người dùng cuối; giảm 1 lần gọi DB không cần thiết mỗi khi mở `/` |
| `summaryCards` (khối tổng quan) | 4 thẻ | 3 thẻ (bỏ "Còn lại tháng này") | Có, đúng theo `DEC-052` |
| Hiệu ứng di trú dữ liệu cũ — nơi kích hoạt | Mount `DylanPlanApp` tại `/` (chạy dù đang xem tab nào) | Mount `BudgetApp` tại `/budget` (chỉ chạy khi Dylan mở `/budget`) | Có — xem rủi ro và lý do ở mục 13, `DEC-053` |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `app/budget/page.tsx` | Tạo mới — Server Component `async`, gọi `getBudgetSnapshot()`, render component `BudgetApp` với prop `initialBudget` |
| `components/BudgetApp.tsx` | Tạo mới — Client Component `"use client"`, chứa state/hiệu ứng/handler Thu chi (di chuyển từ `DylanPlanApp.tsx`) + nội dung cũ `BudgetSections` + link quay lại `/` ở đầu trang |
| `components/shared/TargetGrid.tsx` | Tạo mới — tách `TargetGrid` từ `DylanPlanApp.tsx`, export |
| `app/page.tsx` | Sửa — bỏ `async`, bỏ `getBudgetSnapshot()`, bỏ prop `initialBudget` |
| `components/DylanPlanApp.tsx` | Sửa — bỏ toàn bộ state/handler/helper chỉ phục vụ Thu chi; `Tab` bỏ `"budget"`; nav "Thu chi" và nút Hero "Nhập thu chi" đổi thành `next/link` sang `/budget`; `summaryCards` còn 3 thẻ; bỏ nhánh render `BudgetSections`; import `TargetGrid` từ `components/shared/TargetGrid.tsx` |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng | Kết quả thật (2026-08-05) |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi — đặc biệt xác nhận không còn import/biến thừa sau khi cắt `DylanPlanApp.tsx` | Passed — "No errors found" |
| Prisma | `rtk npx prisma validate` | schema hợp lệ (không đổi, chỉ xác nhận vẫn hợp lệ) | Passed — schema hợp lệ, không đổi |
| Test | `rtk vitest run` | Gap đã biết (giống US-001/US-004): `vitest` chưa cài — thay bằng kiểm chứng thủ công | Không chạy — gap giữ nguyên, thay bằng thao tác thủ công dưới đây |
| Build | `rtk next build` | pass — xác nhận route `/budget` xuất hiện trong danh sách route được build | Passed — `Errors: 0, Warnings: 0`; route `/` (11.6 kB) và `/budget` (8.38 kB) đều xuất hiện, đúng 2 route static mong đợi |
| Thủ công | Mở `/`, bấm nav "Thu chi" | Địa chỉ trang đổi thành `/budget`, hiển thị đủ nội dung Thu chi (AC-01) | Passed — `read_page` xác nhận nav là `link href="/budget"`; bấm vào, `window.location.href` đổi thành `.../budget`, đủ nội dung (Theo tháng, Kiểm soát/nhập nhanh/bảng danh mục, Phân tích, Nguyên tắc) |
| Thủ công | Mở `/`, bấm nút "Nhập thu chi" ở Hero | Cùng kết quả AC-01 (đường vào thứ hai) | Passed — `read_page` xác nhận nút Hero cũng là `link href="/budget"` |
| Thủ công | Mở `/`, chọn tab "Tổng quan" | Chỉ thấy Roadmap/Freelance/Sản phẩm + 3 thẻ tổng quan tĩnh, không còn thẻ "Còn lại tháng này", không còn nội dung Thu chi (AC-02) | Passed — `get_page_text` xác nhận đúng 3 thẻ (Mục tiêu offer/Thu nhập hiện tại/Chi phí cố định), không có thẻ 4, không có bảng danh mục/nhập nhanh nào trên trang |
| Thủ công | Ở `/budget`, bấm link quay lại đầu trang | Về `/`, mặc định tab "Tổng quan" (AC-03) | Passed — bấm link "← Dylan Plan Dashboard", `window.location.href` đổi về `.../` |
| Thủ công | Mở `/budget` với dữ liệu Thu chi đã có sẵn từ trước (tháng/danh mục/giao dịch) | Bảng danh mục và bảng chi tiết chi tiêu hiển thị đúng số liệu như trước khi tách trang (AC-04) | Passed — bảng danh mục hiện đúng số liệu đã seed (Tiền nhà 7.500.000đ, Chi phí cố định khác 15.000.000đ, Tổng cộng 36.000.000đ...) |
| Thủ công | Gõ trực tiếp `/budget` vào trình duyệt (tab mới, chưa mở `/` trong phiên) | Trang tải và hiển thị đủ nội dung ngay, không chuyển hướng qua `/` (AC-05) | Passed — tab trình duyệt mới, điều hướng thẳng `/budget`, hiển thị đủ nội dung ngay, không qua `/` |
| Thủ công | Ghi một giao dịch nhập nhanh tại `/budget`, sửa/xóa một giao dịch (US-004), đổi tháng, xuất JSON | Toàn bộ thao tác hiện có vẫn hoạt động đúng như trước khi tách trang — không có regression | **Gap công cụ** — không tự động hoá được thao tác nhập nhanh qua trình duyệt tự động (input React 19 không nhận sự kiện tổng hợp của công cụ, đã thử 4 cách). Thay thế bằng đối chiếu code: cả 9 use-case chỉ đổi đúng 1 dòng `revalidatePath`, không đổi logic ghi dữ liệu; hành vi `recordQuickTransaction` bản thân đã xác nhận đúng ở US-001. Không phải regression do US-002 |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Hiệu ứng di trú dữ liệu cũ (từ US-001, `DEC-039`) chuyển từ chạy tại `/` (mọi lần mở app) sang chỉ chạy tại `/budget` (chỉ khi Dylan mở trang Thu chi) — nếu một thiết bị/trình duyệt còn dữ liệu `localStorage` cũ chưa từng di trú và Dylan chỉ ghé `/` mà không bấm vào Thu chi, di trú sẽ không tự chạy như trước | Trung bình (rủi ro dữ liệu, nhưng US-001 đã Delivered và đang dùng thật từ 2026-08-03 — hầu hết dữ liệu thật của Dylan nhiều khả năng đã di trú xong) | Ghi rõ quyết định này (`DEC-053`); vì `/budget` giờ là nơi duy nhất hiển thị dữ liệu Thu chi, Dylan chắc chắn phải mở `/budget` để dùng tính năng chính, nên hiệu ứng vẫn sẽ chạy trong thực tế — chỉ khác thời điểm so với trước | Nếu phát sinh vấn đề thật (dữ liệu cũ không di trú được vì Dylan không mở `/budget`), có thể thêm lại một bước kiểm tra nhẹ ở `DylanPlanApp.tsx` (shell) chỉ gọi `getMigrationStatus()` để hiện banner nhắc, không cần chuyển toàn bộ state Thu chi trở lại shell |
| Các use-case hiện gọi `revalidatePath("/")` sau khi ghi dữ liệu Thu chi — sau khi tách, dữ liệu Thu chi hiển thị ở `/budget`, không phải `/` | Trung bình | `ssr-dev` cần đổi các lệnh gọi `revalidatePath("/")` liên quan tới dữ liệu Thu chi (trong `server/budget/application/use-cases/*.ts`) thành `revalidatePath("/budget")`; xác nhận bằng thao tác thủ công: ghi một giao dịch, `refreshSnapshot()` (gọi lại `getBudgetSnapshot()` phía client) đã đủ để cập nhật UI ngay nên cache Next.js không chặn hiển thị dù `revalidatePath` gọi sai đường dẫn — rủi ro thực tế thấp, nhưng vẫn nên sửa cho đúng ngữ nghĩa | Nếu chưa kịp sửa, không ảnh hưởng chức năng vì client tự gọi lại dữ liệu sau mỗi thao tác ghi (`refreshSnapshot`), chỉ ảnh hưởng cache Next.js ở lớp không quan trọng cho single-user |
| Tách `TargetGrid` sai cách (vd quên export, quên cập nhật cả 2 nơi import) có thể làm `rtk tsc --noEmit`/`rtk next build` lỗi ngay | Thấp | Làm task tách `TargetGrid` trước, xác nhận build sạch, rồi mới cắt tiếp `DylanPlanApp.tsx`/tạo `BudgetApp.tsx` (thứ tự task ở mục 14) | Revert riêng file `components/shared/TargetGrid.tsx` nếu cần, không ảnh hưởng Server Action/data |
| `vitest` chưa cài — không chạy được lệnh test chuẩn của kit | Trung bình | Giống US-001/US-004: kiểm chứng bằng thao tác thủ công ở mục 12 | Không áp dụng — gap có sẵn từ trước |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | `components/shared/TargetGrid.tsx`: tách từ `DylanPlanApp.tsx`, export | Done |
| `TB-02` | `components/BudgetApp.tsx`: tạo mới, chuyển state/hiệu ứng/handler Thu chi + nội dung `BudgetSections` cũ, thêm link quay lại | Done |
| `TB-03` | `app/budget/page.tsx`: tạo mới, gọi `getBudgetSnapshot()`, render `BudgetApp` | Done |
| `TB-04` | `components/DylanPlanApp.tsx`: cắt state/handler/helper Thu chi, bỏ `"budget"` khỏi `Tab`, import `TargetGrid` từ file chung | Done |
| `TB-05` | `components/DylanPlanApp.tsx`: đổi nav "Thu chi" + nút Hero "Nhập thu chi" thành `next/link` sang `/budget` (AC-01) | Done |
| `TB-06` | `components/DylanPlanApp.tsx`: `summaryCards` còn 3 thẻ, bỏ nhánh render Thu chi ở "Tổng quan" (AC-02, `DEC-052`) | Done |
| `TB-07` | `app/page.tsx`: bỏ `async`/`getBudgetSnapshot()`/prop `initialBudget` | Done |
| `TB-08` | Cập nhật `revalidatePath("/")` → `revalidatePath("/budget")` trong các use-case ghi dữ liệu Thu chi (`server/budget/application/use-cases/*.ts`) | Done |
| `TB-09` | Cập nhật DEV function wiki mục 7 (Verification) với kết quả lệnh thật | Done |
| `TB-10` | Cập nhật memory (`decisions.md`/`judgement-log.md` nếu phát sinh trong lúc code) | Done |
| `TB-11` | Verification cuối: lệnh + kiểm chứng thủ công đủ 5 AC | Done |

Readiness: Ready. Triển khai hoàn tất 2026-08-05 — chi tiết evidence từng task xem `task.md`. Breakdown chi tiết (8 cột, ma trận coverage, thứ tự dependency) xem `task.md`.
