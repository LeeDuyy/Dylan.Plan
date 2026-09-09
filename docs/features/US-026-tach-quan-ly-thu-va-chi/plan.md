# Tách "Ngân sách & nhập nhanh" thành "Quản lý thu" và "Quản lý chi" — SE Plan

Status: Ready for task-breakdown
Feature: US-026
Spec: spec.md
Created: 2026-09-09
Updated: 2026-09-09
DEV Wiki: `docs/kb/dev/wiki/US-026-tach-quan-ly-thu-va-chi.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Thuần tầng trình bày. `BudgetApp` (`components/BudgetApp.tsx`) hiện render theo prop `section: "monthly" | "insight" | "control"`. Nhánh `"control"` gói 4 khối lên một trang: bảng nguồn thu, nhập nhanh + danh sách giao dịch, bảng "Items cần mua", bảng danh mục ngân sách + cụm nút; đầu section là `TargetGrid` "Quy tắc kiểm soát".

US-026 tách nhánh `"control"` thành hai giá trị mới `"income"` và `"expense"`, thêm hai route `/budget/income` + `/budget/expense`, bỏ route `/budget/control` (chuyển hướng sang `/budget/expense`), cập nhật registry điều hướng (`components/shared/nav.ts` + `lib/nav-registry.ts`) và reconcile dữ liệu `NavPref` đã lưu. Bảng "Items cần mua" chuyển vào `Drawer` (`@vn-dylan/ui`, đã dùng ở `AppShell`/`ConfigDrawer`), mở bằng nút có `Badge` đếm số item `status === "Pending"`. Không đổi Prisma schema, không migration; `NavPref` chỉ là dữ liệu (id/order/hidden).

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-026-tach-quan-ly-thu-va-chi/spec.md` | Nguồn yêu cầu, AC, Screen Element |
| `docs/memory/decisions.md` (DEC-137, DEC-005, DEC-073, DEC-088, DEC-105, DEC-130, DEC-133) | Ràng buộc đã chốt, tiền lệ function trình bày ngoài Business Flow, thứ tự với US-025 |
| `docs/memory/rules.md` | Luật dự án (P1.1 ngày giao dịch — không đụng) |
| `components/BudgetApp.tsx` (toàn bộ, 2081 dòng) | Nhánh `section`, cấu trúc khối `control`, state nguồn thu / giao dịch / purchase item / danh mục, `totals.allocatedToSaving`, `canEditMonth`, `BUDGET_MONTH_KEY` |
| `components/shared/nav.ts` | `navGroups`, nhóm `budget`, `applyNavPrefs`, `currentMeta` |
| `lib/nav-registry.ts` | `NAV_GROUP_IDS`, `NAV_CHILD_HREFS`, `defaultNavPrefSeeds`, `resolveReorderScope`, `ALL_NAV_PREF_IDS`, `leafPrefId` |
| `components/shared/AppShell.tsx` | Cách render `navTree` (side + drawer), dùng `Drawer` của `@vn-dylan/ui` |
| `app/(app)/layout.tsx` | Layout `force-dynamic`, gọi `getNavConfig()` |
| `app/(app)/budget/page.tsx`, `budget/monthly/page.tsx`, `budget/insight/page.tsx`, `budget/control/page.tsx` | Mẫu trang: `getBudgetSnapshot()` + `BudgetApp( section = giá trị tương ứng )`, `dynamic = "force-dynamic"` |
| `middleware.ts` | Chặn theo host + email allowlist; không đụng path `/budget/*` cụ thể; matcher không loại trừ `/budget` |
| `server/config/actions.ts` + `application/use-cases/{get,reset,set-nav-visibility,reorder}-nav.ts` + `domain/services/default-nav-prefs-service.ts` + `domain/rules/nav-reorder-rule.ts` + `infrastructure/repositories/nav-pref-prisma-repository.ts` | Bounded-context `config`: seed lười `createDefaultsIfEmpty`, reset, reorder, set hidden; `revalidatePath("/", "layout")` |
| `prisma/schema.prisma` (model `NavPref`) | Xác nhận `NavPref { id, order, hidden, updatedAt }` — không cần đổi |
| `prisma/migrations/20260909141127_add_nav_pref/migration.sql` | Xác nhận bảng thuần, không ràng buộc FK |
| `lib/budget-defaults.ts` | `CATEGORY_TYPES` (`"Tích lũy"`), `quickRules`, `defaultCategories` |
| `node_modules/@vn-dylan/ui/dist/Drawer/{Drawer,types}.d.ts` | Prop `Drawer`: `isOpen`, `placement`, `width`, `title`, `onClose(reason)`, `shouldCloseOnOverlayClick`, `shouldCloseOnEsc` |
| `docs/kb/dev/00-index.md`, `docs/kb/dev/wiki/US-025-bang-dieu-khien-config.md`, `docs/kb/dev/wiki/US-022-nguon-thu-va-insight-tab-thu-chi.md` | Trạng thái US-025 đã implemented (chạm nav), mẫu section 9 kiến trúc, ghi chú `architecture/` chưa khởi tạo (JDG-005) |
| `package.json` | Không có test runner (`vitest` chưa cấu hình) — verification bằng typecheck + lint + build + thủ công |

## 3. Hành Vi Hiện Tại

- `app/(app)/layout.tsx` (`force-dynamic`) gọi `getNavConfig()` → `AppShell` nhận `navPrefs`.
- `AppShell.navTree` render `applyNavPrefs(navGroups, navPrefs)`. Nhóm `budget` (id `"budget"`, icon `WalletCards`, `match` = path `/budget` hoặc `/budget/*`) có 3 mục con: `/budget/monthly` ("Lịch sử thu chi"), `/budget/insight` ("Insight tài chính"), `/budget/control` ("Ngân sách & nhập nhanh").
- `app/(app)/budget/page.tsx` → `redirect("/budget/monthly")`. Mỗi trang con: `const initialBudget = await getBudgetSnapshot(); return BudgetApp( initialBudget={initialBudget} section = giá trị tương ứng )`.
- `BudgetApp` (client) giữ tháng đang xem ở `localStorage` key `dylan-plan-budget-month` (`BUDGET_MONTH_KEY`), khôi phục sau mount → tháng đồng bộ khi chuyển giữa các trang con dù component remount.
- Nhánh `section === "control"` render (theo thứ tự): `TargetGrid` "Quy tắc kiểm soát" (đặt ngoài, ngay đầu hàm `BudgetSections`, `section === "control"`); `monthViewPicker`; `Card.panel` bọc: `quick-panel` "Nguồn thu" (bảng + kéo-thả + thêm/xóa, chỉ sửa khi `canEditMonth`), `quick-panel` "Nhập nhanh chi tiêu" (ô nhập + `Select` danh mục nhận diện + nút "Ghi nhận" + `transaction-list` sửa/xóa inline), `quick-panel` "Items cần mua" (bảng `purchaseItemsDraft` + thêm/sửa/xóa/đánh dấu Purchased, chỉ khi `canEditPurchaseItems`), `budget-table-wrap` bảng danh mục (kéo-thả, sửa tên/loại/ngân sách, xóa), `div.actions` gồm 4 nút: "Thêm danh mục", "Reset chi tháng này", "Xuất JSON", "Reset dữ liệu".
- `NavPref`: `getNavConfig` gọi `ensureDefaultNavPrefs()` → `repository.createDefaultsIfEmpty(defaultNavPrefSeeds())` chỉ chèn khi bảng **rỗng**. `defaultNavPrefSeeds()` sinh từ `NAV_GROUP_IDS` + `NAV_CHILD_HREFS`. `applyNavPrefs` tra pref theo `groupPrefId(id)` / `leafPrefId(href)`; pref không khớp mục nào → bị bỏ qua; mục thiếu pref → `order` fallback theo index, `hidden = false`.
- `reorder-nav` validate qua `resolveReorderScope` + `assertValidNavReorder`: danh sách phải là hoán vị **đầy đủ** của một cấp anh em; `NAV_CHILD_HREFS.budget` hiện có 3 phần tử.

## 4. Hành Vi Mục Tiêu

- Nhóm `budget` có 4 mục con theo thứ tự: `/budget/monthly` ("Lịch sử thu chi"), `/budget/insight` ("Insight tài chính"), `/budget/income` ("Quản lý thu"), `/budget/expense` ("Quản lý chi"). Không còn `/budget/control` trong menu.
- `/budget/income` → `BudgetApp( section="income" )`: `monthViewPicker` + `quick-panel` "Nguồn thu" (giữ nguyên hành vi + `canEditMonth`) + khu mới **chỉ đọc** "Khoản để dành": bảng 2 cột (tên danh mục loại "Tích lũy" | số đã chi), dòng tổng "Đã phân bổ vào tích lũy" = `totals.allocatedToSaving`; rỗng → "Chưa có danh mục để dành nào trong tháng này".
- `/budget/expense` → `BudgetApp( section="expense" )`: `TargetGrid` "Quy tắc kiểm soát" + `monthViewPicker` + layout 2 cột (`two-col` hoặc lớp mới): cột trái = `quick-panel` "Nhập nhanh chi tiêu" + `transaction-list`; cột phải = nút "Items cần mua" + `Badge` đếm `status === "Pending"` (tháng đang xem) → mở `Drawer` phải chứa bảng "Items cần mua"; dưới nút là bảng danh mục ngân sách; dưới bảng là `div.actions` 4 nút (giữ nguyên).
- `Drawer` "Items cần mua": `placement="right"`, `title="Items cần mua"`, đóng bằng nút × của `Drawer` hoặc bấm nền mờ (`shouldCloseOnOverlayClick` mặc định true) hoặc Esc; nội dung là toàn bộ UI bảng purchase item hiện có (ô thêm + bảng + nút Purchased/xóa), giữ `canEditPurchaseItems`.
- `/budget/control` mở trực tiếp → `redirect("/budget/expense")` (server redirect trong `app/(app)/budget/control/page.tsx`, giữ file làm redirect-only). Tháng đang xem không nằm ở URL nên giữ nguyên qua `localStorage`.
- `NAV_CHILD_HREFS.budget` = `["/budget/monthly", "/budget/insight", "/budget/income", "/budget/expense"]`; `navGroups[budget].href` đổi từ `/budget/monthly` giữ nguyên (mục cha vẫn trỏ trang con đầu). `currentMeta` cho `/budget/income` và `/budget/expense` ra tiêu đề "Thu chi · Quản lý thu" / "Thu chi · Quản lý chi".
- `NavPref` reconcile: `ensureDefaultNavPrefs()` (hoặc use-case `getNavConfig`) bổ sung — chèn mọi seed id còn thiếu trong bảng (idempotent, không ghi đè order/hidden của id đã có) và xóa các id không còn thuộc `ALL_NAV_PREF_IDS` (dọn `leaf:/budget/control`). Nhờ đó DB đã seed từ US-025 (bản chạy trên VPS) có `leaf:/budget/income` + `leaf:/budget/expense` đúng thứ tự và không còn orphan.

## 5. Luồng End-To-End

```text
Điều hướng / menu:
  Request /budget/*  (middleware.ts: chỉ gate host + email, không đụng path con)
    -> app/(app)/layout.tsx (force-dynamic)
       -> server/config/actions.ts :: getNavConfig()
          -> application/use-cases/get-nav-config.ts
             -> domain/services/default-nav-prefs-service.ts :: ensureDefaultNavPrefs()
                -> infrastructure/repositories/nav-pref-prisma-repository.ts
                   :: createDefaultsIfEmpty(seeds)  +  [MỚI] ensureSeedsPresent(seeds) + pruneUnknown(ALL_NAV_PREF_IDS)
                   -> prisma.navPref (SQLite)
             -> navPrefRepository.findAll()
    -> AppShell :: applyNavPrefs(navGroups, navPrefs)  (nav.ts + nav-registry.ts đã thêm income/expense)
    -> navTree render 4 mục con nhóm "Thu chi"

Trang màn hình:
  /budget/income  -> app/(app)/budget/income/page.tsx (force-dynamic)
      -> server/budget/actions.ts :: getBudgetSnapshot()
      -> BudgetApp( initialBudget section="income" )  (client)
         -> khôi phục tháng từ localStorage BUDGET_MONTH_KEY
         -> render khu "Nguồn thu" + khu "Khoản để dành" (đọc totals.allocatedToSaving, categories.type==="Tích lũy")
  /budget/expense -> app/(app)/budget/expense/page.tsx  -> BudgetApp( section="expense" )
         -> render "Quy tắc kiểm soát" + 2 cột; nút "Items cần mua" mở Drawer (component) chứa bảng purchase item
  /budget/control -> app/(app)/budget/control/page.tsx  -> redirect("/budget/expense")

Thao tác dữ liệu (không đổi): nguồn thu / giao dịch nhập nhanh / danh mục / purchase item vẫn qua server/budget/actions.ts như hiện tại; revalidate giữ nguyên.
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| US-025 (bảng điều khiển tùy biến menu) đã merge | `git status` cho thấy `components/shared/nav.ts`, `lib/nav-registry.ts`, `components/shared/NavConfigEditor.tsx`, `server/config/`, migration `20260909141127`/`20260909142811` đều **chưa commit**; `docs/kb/dev/00-index.md` ghi US-025 "implemented" nhưng chưa vào lịch sử git | Có — chặn **stage implement** của US-026 (DEC-137 điểm 6). Không chặn plan/task | Toàn bộ code US-026 chạy **sau** khi US-025 vào `main` |
| Spec US-026 `Ready for DEV` | `docs/features/US-026-.../spec.md` header; po-expert `Aligned` lượt 2 | Không | trước plan (đã xong) |
| US-022 (`IncomeSource`, bảng nguồn thu, `totals` insight) | `docs/kb/dev/wiki/US-022-...md`; `components/BudgetApp.tsx` có `incomeSourcesDraft`, `totals.allocatedToSaving` | Không | Implemented |
| US-019 (`PurchaseItem`, bảng "Items cần mua", ràng buộc tháng) | `components/BudgetApp.tsx` `purchaseItemsDraft`, `canEditPurchaseItems`; glossary "Item cần mua" | Không | Implemented |
| US-016 (`Category.type` combobox cố định, có "Tích lũy") | `lib/budget-defaults.ts` `CATEGORY_TYPES`; glossary "Loại danh mục" | Không | Implemented |
| `@vn-dylan/ui` `Drawer` | `node_modules/@vn-dylan/ui/dist/Drawer/*.d.ts`; đã dùng ở `AppShell.tsx`, `ConfigDrawer.tsx` | Không | có sẵn |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | Yes | Thêm `app/(app)/budget/income/page.tsx`, `app/(app)/budget/expense/page.tsx`; sửa `app/(app)/budget/control/page.tsx` thành redirect. `app/(app)/layout.tsx` không đổi |
| Server Action | Yes | `server/config/*` (nav-pref): thêm bước reconcile seed (không thêm Server Action mới, sửa use-case/service/repository của `getNavConfig`). `server/budget/*` không đổi |
| Route Handler (`app/api`) | No | — |
| Auth / middleware / permission | No | `middleware.ts` matcher và logic không phụ thuộc path con `/budget/*` |
| Prisma schema | No | `NavPref` giữ nguyên `{ id, order, hidden, updatedAt }` |
| Migration SQLite | No | Không đổi cấu trúc bảng; `NavPref` là dữ liệu, reconcile ở tầng ứng dụng (idempotent, chạy mỗi request layout) |
| DBML | No | Không đổi schema |
| Seed data | Yes | `defaultNavPrefSeeds()` sinh thêm 2 leaf từ `NAV_CHILD_HREFS.budget`; thêm hàm reconcile chèn-thiếu + xóa-orphan cho DB đã seed |
| Caching / revalidate | No | `getNavConfig` đã ở layout `force-dynamic`; reconcile không cần `revalidatePath` thêm (đọc là chính) |
| Export / báo cáo | No | Nút "Xuất JSON" giữ nguyên hành vi, chỉ đổi vị trí hiển thị |
| Mail / webhook / job nền | N/A | — |
| Knowledge base / memory | Yes | DEV function wiki US-026 (mới); `docs/kb/dev/00-index.md` + `dev-root-index` nếu có; `decisions.md` DEC-137 (đã ghi); `judgement-log.md` JDG-037 (đã ghi); `glossary.md` (đã ghi) |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry | `app/(app)/budget/income/page.tsx` (mới) | Server Component: `getBudgetSnapshot()` → `BudgetApp( initialBudget section="income" )`, `export const dynamic = "force-dynamic"` |
| Entry | `app/(app)/budget/expense/page.tsx` (mới) | Như trên với `section="expense"` |
| Entry | `app/(app)/budget/control/page.tsx` | Thay toàn bộ nội dung bằng `import { redirect } from "next/navigation"; export default function () { redirect("/budget/expense"); }` |
| Entry | `components/shared/nav.ts` | `navGroups` phần tử `id: "budget"`: `children` thành 4 mục (bỏ `/budget/control`, thêm `/budget/income` "Quản lý thu" + `/budget/expense` "Quản lý chi" kèm `desc`). `href` mục cha giữ `/budget/monthly` |
| Entry | `lib/nav-registry.ts` | `NAV_CHILD_HREFS.budget` = `["/budget/monthly", "/budget/insight", "/budget/income", "/budget/expense"]` |
| Application (use-case) | `server/config/application/use-cases/get-nav-config.ts` | Sau `ensureDefaultNavPrefs()` gọi thêm bước reconcile (chèn seed thiếu + xóa id lạ) trước `findAll()`; hoặc gộp reconcile vào chính `ensureDefaultNavPrefs` |
| Domain service | `server/config/domain/services/default-nav-prefs-service.ts` | Thêm method `reconcileNavPrefs(seeds)` (hoặc mở rộng `ensureDefaultNavPrefs`): chèn id thiếu, xóa id không thuộc `ALL_NAV_PREF_IDS` |
| Repository interface (domain) | `server/config/domain/repositories/nav-pref-repository.ts` | Thêm `insertMissing(seeds)` + `deleteByIdsNotIn(ids)` (hoặc `deleteByIds(ids)`) |
| Repository implementation (infrastructure) | `server/config/infrastructure/repositories/nav-pref-prisma-repository.ts` | Hiện thực: `createMany({ data, skipDuplicates: true })` cho chèn thiếu; `deleteMany({ where: { id: { notIn: ids } } })` cho dọn orphan; bọc `$transaction` |
| Domain rule | `server/config/domain/rules/nav-reorder-rule.ts` | Không sửa code — nhưng `resolveReorderScope`/`assertValidNavReorder` tự đúng theo `NAV_CHILD_HREFS.budget` mới (4 phần tử). Ghi chú test lại reorder nhóm budget |
| Data | `prisma/schema.prisma` | Không đổi |
| UI | `components/BudgetApp.tsx` | `BudgetSection` type `"monthly" | "insight" | "control"` → `"monthly" | "insight" | "income" | "expense"`. Prop default đổi. Tách khối `section === "control"`: (a) `section === "income"` = "Nguồn thu" + khu "Khoản để dành" chỉ đọc; (b) `section === "expense"` = "Quy tắc kiểm soát" + `monthViewPicker` + 2 cột (trái: nhập nhanh + transaction-list; phải: nút+Badge "Items cần mua" → `Drawer`, bảng danh mục, `div.actions`). `TargetGrid` "Quy tắc kiểm soát" chuyển điều kiện `section === "control"` → `section === "expense"`. Thêm import `Drawer`, `Badge` từ `@vn-dylan/ui`; state `const [purchaseDrawerOpen, setPurchaseDrawerOpen] = useState(false)`. Đưa JSX bảng purchase item vào `Drawer` body. Badge value = `purchaseItemsDraft.filter(i => i.status === "Pending").length` |
| UI | `app/globals.css` | Lớp bố cục 2 cột cho màn "Quản lý chi" (tái dùng `.two-col`/`.quick-grid` nếu đủ; thêm lớp `.budget-expense-cols` + responsive 1 cột ở breakpoint hẹp); style nút "Items cần mua" + badge; đảm bảo mỗi cột `overflow` độc lập, body không cuộn ngang |
| Consumer | `components/shared/nav.ts` `currentMeta` / `activeGroup` | Tự đúng theo `navGroups` mới; kiểm `currentMeta("/budget/income")` và `("/budget/expense")` ra tiêu đề đúng |
| Consumer | `components/shared/ConfigDrawer.tsx` / `NavConfigEditor.tsx` (US-025) | Đọc `navPrefs` + `navGroups` để cho user sắp xếp/ẩn hiện; sau khi `NAV_CHILD_HREFS.budget` đổi, danh sách mục con budget trong editor tự cập nhật. Cần rà khi US-025 đã merge (thứ tự DEC-137) |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

- `NavPref` giữ nguyên `{ id: String @id, order: Int, hidden: Boolean, updatedAt }`. Hai mục con mới chỉ thêm **bản ghi** (`leaf:/budget/income`, `leaf:/budget/expense`), bỏ bản ghi `leaf:/budget/control`.
- Trên cài đặt mới (bảng `NavPref` rỗng): `createDefaultsIfEmpty(defaultNavPrefSeeds())` tự sinh đủ theo `NAV_CHILD_HREFS.budget` mới — không cần thao tác gì.
- Trên DB đã seed (bản US-025 đang chạy): reconcile ở tầng ứng dụng — `createMany({ skipDuplicates: true })` chèn 2 id mới, `deleteMany({ where: { id: { notIn: ALL_NAV_PREF_IDS } } })` xóa `leaf:/budget/control`. Idempotent, chạy trong `getNavConfig` mỗi request layout (`force-dynamic`), không phải migration.
- `applyNavPrefs` đã tолерantе pref orphan / mục thiếu pref, nên kể cả khi reconcile chưa chạy, menu vẫn hiển thị đúng 4 mục (chỉ khác: 2 mục mới nhận order/visible mặc định thay vì giá trị user từng chỉnh — chấp nhận được, mục con `/budget/control` trước đó cũng chưa từng được user chỉnh riêng).

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `NavPref` | Không đổi (chỉ thêm/bớt bản ghi qua reconcile ứng dụng) | — | — | `@@index([order])` giữ nguyên | Xóa 1 hàng `leaf:/budget/control`; chèn 2 hàng `leaf:/budget/income`, `leaf:/budget/expense` |

`ssr-data` **không cần chạy** (`schemaChangeRequired: false`).

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| Route `/budget/control` | Trang "Ngân sách & nhập nhanh" | `redirect` 307 → `/budget/expense` | Không (liên kết cũ vẫn tới nội dung, chỉ đổi URL cuối) |
| Route `/budget/income` | 404 | Trang "Quản lý thu" | Không (route mới) |
| Route `/budget/expense` | 404 | Trang "Quản lý chi" | Không (route mới) |
| `BudgetSection` type (`components/BudgetApp.tsx`, export) | `"monthly" | "insight" | "control"` | `"monthly" | "insight" | "income" | "expense"` | Có — mọi nơi truyền `section="control"` phải đổi; consumer duy nhất là 3 trang `app/(app)/budget/*/page.tsx` (nội bộ) |
| `NAV_CHILD_HREFS.budget` (`lib/nav-registry.ts`, export) | 3 phần tử | 4 phần tử | Có — `resolveReorderScope`/`defaultNavPrefSeeds`/`assertValidNavReorder` phụ thuộc; đều tự suy theo mảng nên không cần sửa logic, chỉ cần dữ liệu `NavPref` reconcile |
| `navGroups` mục `budget.children` (`components/shared/nav.ts`, export) | 3 leaf | 4 leaf | Không breaking về kiểu; consumer `AppShell`, `ConfigDrawer`/`NavConfigEditor` (US-025) tự render theo mảng |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `app/(app)/budget/income/page.tsx` | Tạo mới — Server Component render `BudgetApp( section="income" )`, `dynamic = "force-dynamic"` |
| `app/(app)/budget/expense/page.tsx` | Tạo mới — như trên với `section="expense"` |
| `app/(app)/budget/control/page.tsx` | Rút gọn thành `redirect("/budget/expense")` |
| `components/shared/nav.ts` | Sửa `navGroups` mục `budget.children`: bỏ `/budget/control`, thêm `/budget/income` + `/budget/expense` với `label`/`desc` |
| `lib/nav-registry.ts` | Sửa `NAV_CHILD_HREFS.budget` thành 4 href mới |
| `components/BudgetApp.tsx` | Đổi `BudgetSection`; tách render `control` → `income` + `expense`; thêm khu "Khoản để dành" chỉ đọc; layout 2 cột màn expense; `Drawer` + `Badge` cho "Items cần mua"; chuyển "Quy tắc kiểm soát" và `div.actions` sang `expense` |
| `app/globals.css` | Lớp bố cục 2 cột + responsive cho màn "Quản lý chi"; style nút "Items cần mua" + badge |
| `server/config/domain/repositories/nav-pref-repository.ts` | Thêm chữ ký `insertMissing(seeds)` + `deleteByIdsNotIn(ids)` |
| `server/config/infrastructure/repositories/nav-pref-prisma-repository.ts` | Hiện thực 2 method mới (createMany skipDuplicates / deleteMany notIn), bọc `$transaction` |
| `server/config/domain/services/default-nav-prefs-service.ts` | Thêm `reconcileNavPrefs(seeds)` gọi 2 method mới |
| `server/config/application/use-cases/get-nav-config.ts` | Gọi `reconcileNavPrefs` (hoặc `ensureDefaultNavPrefs` đã gộp) trước `findAll()` |
| `docs/kb/dev/wiki/US-026-tach-quan-ly-thu-va-chi.md` | Tạo mới — DEV function wiki |
| `docs/kb/dev/00-index.md` | Thêm dòng US-026 |
| `docs/features/US-026-tach-quan-ly-thu-va-chi/task.md` | `ssr-breaker` tạo |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng |
| --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi (đặc biệt `BudgetSection` đổi ở cả 3+2 trang) |
| Lint | `rtk lint` | 0 lỗi mới |
| Prisma | `rtk npx prisma validate` | schema hợp lệ (không đổi, chạy để chắc) |
| Build | `rtk next build` | pass; 2 route mới `/budget/income`, `/budget/expense` xuất hiện, `/budget/control` là redirect |
| Test | `rtk vitest run` | Bỏ qua — dự án chưa cấu hình test runner (xem `package.json`); ghi rõ trong report |
| Thủ công 1 | Mở app, nhóm "Thu chi" | Bung 4 mục con đúng thứ tự; không còn "Ngân sách & nhập nhanh" |
| Thủ công 2 | Vào "Quản lý thu" | Thấy bộ chọn tháng + bảng "Nguồn thu" + khu "Khoản để dành" chỉ đọc; không có nhập nhanh/bảng danh mục |
| Thủ công 3 | Vào "Quản lý chi" | Thấy "Quy tắc kiểm soát" + 2 cột; trái nhập nhanh + giao dịch; phải nút "Items cần mua" + bảng danh mục + 4 nút hành động |
| Thủ công 4 | Bấm nút "Items cần mua" | `Drawer` trượt từ phải, chứa bảng + ô thêm; badge = số item "Pending"; đóng bằng ×, nền mờ, Esc; badge cập nhật sau khi thêm/xóa |
| Thủ công 5 | Mở thẳng `/budget/control` | Được đưa tới `/budget/expense`; tháng đang xem giữ nguyên |
| Thủ công 6 | Tháng đã kết thúc ở "Quản lý thu" / trong Drawer | Bảng "Nguồn thu" và bảng "Items cần mua" ở chế độ chỉ xem |
| Thủ công 7 | (Sau khi US-025 merge) Mở bảng tùy biến menu | Danh sách mục con "Thu chi" hiển thị 4 mục mới; kéo-thả/ẩn-hiện hoạt động; reset nav trả đúng 4 mục |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Xung đột với US-025 ở `nav.ts` / `nav-registry.ts` / `NavConfigEditor` | Cao | DEC-137: code US-026 chỉ bắt đầu sau khi US-025 vào `main`; `ssr-plan` rà lại impact map trước khi code | Revert commit US-026; `nav.ts`/`nav-registry.ts` về bản US-025 |
| DB đã seed `NavPref` (VPS) còn orphan `leaf:/budget/control` hoặc thiếu 2 mục mới nếu reconcile lỗi | Trung bình | Reconcile idempotent + `applyNavPrefs` đã tолерantе; test thủ công 7; có nút "Reset nav" (US-025) khôi phục seed chuẩn | Chạy `resetNavConfig()` (đã có) để dựng lại toàn bộ `NavPref` theo seed mới |
| `BudgetSection` đổi làm sót một chỗ truyền `"control"` | Thấp | `rtk tsc --noEmit` bắt hết (union type); chỉ 3 file trang nội bộ | Sửa theo lỗi typecheck |
| `Drawer` của `@vn-dylan/ui` không khớp kỳ vọng (chiều rộng, cuộn body dài) | Thấp | Đã dùng ở `AppShell`/`ConfigDrawer`; đặt `width` hợp lý, `bodyClass` cho cuộn dọc | Bỏ `Drawer`, để bảng "Items cần mua" hiển thị trực tiếp cột phải (spec A9 nêu phương án lùi) |
| Bố cục 2 cột vỡ trên màn hẹp | Thấp | CSS responsive gập 1 cột ở breakpoint; mỗi cột `overflow-x: auto` | Sửa CSS |
| Người dùng bookmark `/budget/control` sâu trong lịch sử | Thấp | Redirect 307 giữ liên kết sống | — |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-00` | Rà lại impact map (plan mục 8) sau khi US-025 vào `main`; cập nhật plan nếu lệch | Pending |
| `TB-01` | `nav.ts` + `nav-registry.ts`: nhóm "Thu chi" có 4 mục con (bỏ `/budget/control`, thêm `/budget/income` + `/budget/expense`) | Pending |
| `TB-02` | `NavPref` reconcile: repository interface + prisma repo + service + use-case chèn seed thiếu, xóa id lạ; idempotent | Pending |
| `TB-03` | Route: `app/(app)/budget/income/page.tsx` + `expense/page.tsx` mới; `control/page.tsx` → `redirect("/budget/expense")` | Pending |
| `TB-04` | `BudgetApp`: `BudgetSection` union mới; nhánh `section === "income"` = "Nguồn thu" + khu "Khoản để dành" chỉ đọc | Pending |
| `TB-05` | `BudgetApp`: nhánh `section === "expense"` = "Quy tắc kiểm soát" + 2 cột (nhập nhanh + giao dịch \| bảng danh mục + `div.actions`) | Pending |
| `TB-06` | `BudgetApp`: nút "Items cần mua" + badge đếm "Pending" → `Drawer` phải chứa toàn bộ UI bảng purchase item; giữ ràng buộc tháng | Pending |
| `TB-07` | `app/globals.css`: bố cục 2 cột + responsive màn "Quản lý chi"; style nút + badge | Pending |
| `TB-08` | `currentMeta`/`activeGroup` cho `/budget/income` + `/budget/expense` ra tiêu đề đúng, nhóm "Thu chi" active | Pending |
| `TB-09` | Cập nhật DEV wiki (`status: Active`, verification thật) + `docs/kb/dev/00-index.md` + `docs/kb/ba/00-index.md` + `docs/requirements-index.md` | Pending |
| `TB-10` | Verification cuối: typecheck + lint + prisma validate + build sạch; checklist thủ công AC-01..AC-09 + plan mục 12 | Pending |

Readiness: Ready — `task.md` đã lập đầy đủ (10 task, ma trận coverage phủ AC-01..AC-09 + contract + impact). Lưu ý điều phối: **stage `implement` giữ trạng thái chờ** cho tới khi US-025 vào `main` (DEC-137 điểm 6); `ssr-pipeline` lượt này không chạy `ssr-dev`. `ssr-data` không chạy (`schemaChangeRequired: false`).
