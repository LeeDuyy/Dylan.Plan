# Nguồn thu, sửa insight tiết kiệm, tháng mặc định và bỏ giới hạn tháng cho Item cần mua tại tab Thu chi — SE Plan

Status: Ready for task-breakdown
Feature: US-022
Spec: spec.md
Created: 2026-09-07
Updated: 2026-09-07
DEV Wiki: `docs/kb/dev/wiki/US-022-nguon-thu-va-insight-tab-thu-chi.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Thêm entity `IncomeSource` vào bounded-context `budget` (mirror gần hết pattern của `Category`, bỏ `type`/`budget`/`locked`/`isFallback`), gắn theo `MonthBudget` bằng `monthId`. `budget-snapshot-service` bổ sung `incomeSources` cho mỗi tháng và tính `income = Σ IncomeSource.amount` ở đường đọc (cột `MonthBudget.income` giữ lại nhưng không còn là nguồn sự thật cho UI — chi tiết mục 9). Ba use-case CRUD + reorder mirror `Category`. Một luật domain mới `assertMonthNotPast` thay `assertMonthIsCurrent` cho cả 4 use-case purchase-item lẫn 3 use-case income-source mới (BR-036/DEC-130/DEC-133). `components/BudgetApp.tsx` thêm khu vực bảng "Nguồn thu", tính lại `totals` (netSaving/savingRate/allocatedToSaving lọc theo `Category.type`), gỡ các chuỗi mốc cứng, và đổi cách khởi tạo `selectedMonthId` sang helper "tháng hiện tại hoặc gần nhất". Không đụng layout/antd (US-023).

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `app/budget/page.tsx` | Entry point tab Thu chi (Server Component gọi `getBudgetSnapshot`) |
| `components/BudgetApp.tsx` | Client Component chính — bảng nguồn thu, insight, chọn tháng, item cần mua, DnD danh mục (mẫu cho DnD nguồn thu) |
| `server/budget/actions.ts` | Composition root bounded-context budget — nơi wire repository/use-case/Server Action |
| `server/budget/domain/services/budget-snapshot-service.ts` | Dựng `BudgetSnapshot` cho UI — cần thêm `incomeSources` + tính `income` |
| `server/budget/application/use-cases/get-budget-snapshot.ts` | Use-case đọc snapshot |
| `server/budget/application/use-cases/upsert-category.ts` | Mẫu cho `upsert-income-source` |
| `server/budget/application/use-cases/reorder-categories.ts` | Mẫu cho `reorder-income-sources` |
| `server/budget/application/use-cases/remove-category.ts` | Mẫu cho `remove-income-source` (bỏ phần reassign giao dịch) |
| `server/budget/application/use-cases/create-month.ts` | Cần đảm bảo KHÔNG seed nguồn thu (BR-037) |
| `server/budget/application/use-cases/reset-all-budget-data.ts` | Cần xử lý nguồn thu khi reset |
| `server/budget/application/use-cases/add-purchase-item.ts` | Đổi `assertMonthIsCurrent` → `assertMonthNotPast` |
| `server/budget/application/use-cases/update-purchase-item.ts` | Đổi `assertMonthIsCurrent` → `assertMonthNotPast` |
| `server/budget/application/use-cases/mark-purchase-item-purchased.ts` | Đổi `assertMonthIsCurrent` → `assertMonthNotPast` |
| `server/budget/application/use-cases/delete-purchase-item.ts` | Đổi `assertMonthIsCurrent` → `assertMonthNotPast` |
| `server/budget/domain/rules/current-month-rule.ts` | Thêm `assertMonthNotPast` + `MonthInPastError`, giữ `getCurrentMonthId` |
| `server/budget/domain/rules/purchase-item-rule.ts` | Mẫu cho `income-source-rule.ts` |
| `server/budget/domain/entities/category.ts` | Mẫu cho `income-source.ts` entity |
| `server/budget/domain/entities/month-budget.ts` | Xem `MonthBudgetEntity` — quyết định giữ/bỏ `income` |
| `server/budget/domain/repositories/category-repository.ts` | Mẫu cho `income-source-repository.ts` interface |
| `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Mẫu cho `income-source-prisma-repository.ts` |
| `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` | Xem cách map row `income`; onDelete Cascade dọn con |
| `server/budget/infrastructure/repositories/purchase-item-prisma-repository.ts` | Xem `transferPendingToMonth` (giữ nguyên) |
| `lib/budget-defaults.ts` | `DEFAULT_INCOME`, `CATEGORY_TYPES` (Loại "Tích lũy" dùng cho "Đã phân bổ vào tích lũy") |
| `prisma/schema.prisma` | Model `MonthBudget`/`Category`/`PurchaseItem`; generator `prisma-client` output `../generated/prisma` |
| `docs/features/US-019-danh-sach-can-mua/plan.md` | Tiền lệ entity mới cùng bounded-context |
| `docs/kb/ba/wiki/knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md` | Business rule của function |
| `docs/kb/ba/wiki/data/entity/ENT-007-nguon-thu.md` | Ràng buộc entity Nguồn thu |

## 3. Hành Vi Hiện Tại

- `app/budget/page.tsx` gọi `getBudgetSnapshot()` (Server Action) → `budgetSnapshotService.getSnapshot()` đọc `MonthBudget`/`Category`/`Transaction`/`PurchaseItem` từ Prisma, aggregate chi thực tế theo `categoryId`, trả `BudgetSnapshot { months: MonthBudgetSnapshot[] }`. Mỗi `MonthBudgetSnapshot` có `income` lấy thẳng từ cột `MonthBudget.income`.
- `MonthBudget.income` chỉ được đặt tại `create-month.ts` (`income: DEFAULT_INCOME` = 35.000.000) và `reset-all-budget-data.ts`. Không có Server Action nào sửa nó.
- `components/BudgetApp.tsx`:
  - `selectedMonthId` khởi tạo `useState(initialBudget.months.at(-1)?.id ?? "")` — tháng cuối danh sách.
  - `totals` useMemo: `remaining = income - totalActual`, `ratio = totalActual / income`, `saving` = tổng `actual` của danh mục khớp regex `/tiết|đầu tư|dự phòng|tích/i` trên `name + type`, `flexible` = tổng `actual` type `"Khác"`.
  - `TargetGrid` "Quy tắc kiểm soát" + text insight chứa chuỗi cứng "5M", "7.5M", "31.5M", "30M", "hơn 90% thu nhập".
  - `canEditPurchaseItems = selectedMonth.id === formatMonthId(new Date())`.
- 4 use-case purchase-item (`add`/`update`/`mark`/`delete`) gọi `assertMonthIsCurrent(monthId)` → ném `CurrentMonthViolationError` nếu `monthId !== getCurrentMonthId()`.

## 4. Hành Vi Mục Tiêu

- `getBudgetSnapshot()` trả thêm `incomeSources: IncomeSourceSnapshot[]` (id, name, amount, order — sort theo `order`) cho mỗi tháng; `income` = `Σ incomeSources.amount` (0 khi rỗng). Cột `MonthBudget.income` không còn được đọc cho UI.
- Ba Server Action mới: `upsertIncomeSource({ id?, monthId, name, amount })`, `removeIncomeSource(id)`, `reorderIncomeSources({ monthId, orderedIds })`. Tất cả `revalidatePath("/budget")`.
- `upsertIncomeSource`: `name` sau trim không rỗng; `amount` là số nguyên `>= 0` (DEC-134); tháng của bản ghi không ở quá khứ (DEC-133). Cho phép trùng tên (không có luật chống trùng như `Category`).
- `removeIncomeSource` / `reorderIncomeSources`: tháng không ở quá khứ.
- 4 use-case purchase-item: đổi điều kiện từ "đúng tháng hiện tại" sang "tháng không ở quá khứ" (`assertMonthNotPast`). Thông báo lỗi đổi thành "Chỉ được thao tác ... từ tháng hiện tại trở đi." (giữ nguyên style message hiện có).
- `create-month.ts`: không tạo `IncomeSource` nào; ghi `MonthBudget.income = 0` (giá trị vô nghĩa nhưng để 0 cho nhất quán) — chi tiết mục 9.
- `reset-all-budget-data.ts`: 3 tháng mặc định vẫn tạo; mỗi tháng seed **một** `IncomeSource { name: "Lương", amount: DEFAULT_INCOME, order: 0 }` (reset = khôi phục trạng thái demo dùng được, khác `create-month`; ghi rõ ở DEV wiki + task).
- `components/BudgetApp.tsx`:
  - `selectedMonthId` khởi tạo bằng `pickInitialMonthId(initialBudget.months)` — tháng hiện tại nếu có, không thì tháng gần nhất theo `|monthIndex - currentIndex|`, hòa thì ưu tiên quá khứ (BR-035).
  - `totals`: `totalIncome = selectedMonth.income`; `netSaving = totalIncome - totalActual`; `savingRate = totalIncome > 0 ? netSaving / totalIncome : null`; `allocatedToSaving = categories.filter(c => c.type === "Tích lũy").reduce((s,c) => s + c.actual, 0)`; giữ `remaining` (= `netSaving`, hiển thị ô "Số dư còn lại"); `ratio` giữ nguyên công thức (mẫu số là `totalIncome` thật).
  - Thêm khu vực bảng "Nguồn thu" (component con trong cùng file, đặt gần khu vực chọn tháng / trước bảng danh mục): bảng inline-edit tên + số tiền, nút xóa mỗi dòng, form thêm (tên + số tiền), DnD đổi thứ tự (tái dùng đúng cơ chế state `draggedCategoryId`/`dragOverCategoryId` — nhân bản cho income), dòng tổng "Thu nhập tháng". Ẩn form/nút/ô-sửa khi `isMonthPast(selectedMonth.id)`.
  - Khu vực "Insight tài chính": thêm ô "Thu nhập tháng", "Tiết kiệm ròng" (+ "Tỷ lệ tiết kiệm"), "Đã phân bổ vào tích lũy", "Tổng chi", "Tỷ lệ sử dụng thu nhập"; giữ ô "Số dư còn lại"; giữ toggle ẩn/hiện cho ô tích lũy. Bỏ mọi chuỗi mốc cứng ở `TargetGrid` "Quy tắc kiểm soát" và text insight.
  - `canEditPurchaseItems` → `canEditMonth = selectedMonth.id >= formatMonthId(new Date())` (so sánh chuỗi `YYYY-MM` là đủ); dùng chung cho cả bảng nguồn thu và khu vực item cần mua.

## 5. Luồng End-To-End

```text
app/budget/page.tsx (Server Component)
  -> getBudgetSnapshot() (server/budget/actions.ts, "use server")
     -> getBudgetSnapshotUseCase()
        -> budgetSnapshotService.getSnapshot()
           -> monthBudgetRepository.findAll()
           -> categoryRepository.findAll() + transactionRepository.sumAmountGroupedByCategory()
           -> purchaseItemRepository.findAll()
           -> incomeSourceRepository.findAll()          [MỚI]
           -> dựng MonthBudgetSnapshot: incomeSources[] + income = Σ amount   [MỚI]
  -> render Client Component BudgetApp với prop initialBudget = snapshot

Thao tác Nguồn thu (Client):
  BudgetApp form/onBlur/onDrop
   -> upsertIncomeSource | removeIncomeSource | reorderIncomeSources (server/budget/actions.ts)
      -> use-case tương ứng (application/use-cases/*income-source*.ts)
         -> assertValidIncomeSourceName / assertValidIncomeSourceAmount (domain/rules/income-source-rule.ts)
         -> assertMonthNotPast(monthId) (domain/rules/current-month-rule.ts)   [MỚI]
         -> incomeSourceRepository.create|update|delete|reorder (infrastructure/repositories/income-source-prisma-repository.ts)
            -> prisma.incomeSource.* -> SQLite
         -> revalidatePath("/budget")
   -> refreshSnapshot() -> re-render, totals useMemo tính lại

Thao tác Item cần mua (Client): như hiện tại, chỉ đổi assertMonthIsCurrent -> assertMonthNotPast trong 4 use-case.
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `ssr-data` tạo model `IncomeSource` + migration + backfill + DBML | Mục 9 plan này; `prisma/schema.prisma` chưa có model | Có | Trước `ssr-breaker` |
| US-006 (tạo/clone tháng) đã Implemented | `server/budget/application/use-cases/create-month.ts` tồn tại và hoạt động | Không | — |
| US-016 (Loại danh mục combobox 3 giá trị) đã Implemented | `lib/budget-defaults.ts` `CATEGORY_TYPES = ["Cố định","Tích lũy","Khác"]`; `Category.type` là chuỗi | Không | "Đã phân bổ vào tích lũy" lọc `type === "Tích lũy"` — cần giá trị này ổn định |
| US-019 (item cần mua) đã Implemented | 4 use-case purchase-item + `current-month-rule.ts` tồn tại | Không | US-022 sửa điều kiện tháng trong các use-case đó |
| US-023 (layout antd) | Raw, chưa spec | Không | US-023 làm SAU US-022 (DEC-132) — cùng chạm `BudgetApp.tsx` |
| Prisma generator `prisma-client` output `../generated/prisma`, import qua `@/generated/prisma/client` | `prisma/schema.prisma` dòng 6-9; các repo hiện có import `@/generated/prisma/client` | Không | Repo mới import cùng đường |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | `app/budget/page.tsx` không đổi (vẫn gọi `getBudgetSnapshot`) |
| Server Action | Yes | Thêm `upsertIncomeSource`/`removeIncomeSource`/`reorderIncomeSources` trong `server/budget/actions.ts`; sửa thông báo/điều kiện 4 action purchase-item |
| Route Handler (`app/api`) | N/A | Không có route handler cho budget |
| Auth / middleware / permission | No | Budget không có auth riêng (Dylan là user duy nhất) |
| Prisma schema | Yes | Model mới `IncomeSource` |
| Migration SQLite | Yes | `add_income_source` + backfill "Lương" cho MonthBudget đang có |
| DBML | Yes | Thêm bảng `IncomeSource` vào `docs/db/schema.dbml` |
| Seed data | Yes | `reset-all-budget-data.ts` seed 1 nguồn thu "Lương" mỗi tháng mặc định |
| Caching / revalidate | Yes | 3 action mới gọi `revalidatePath("/budget")` |
| Export / báo cáo | Yes | `exportData` trong `BudgetApp` serialize `months` state → tự động gồm `incomeSources`; `income` xuất ra nay là số thật (không phá vỡ US-008, chỉ thêm field) |
| Mail / webhook / job nền | N/A | Không có |
| Knowledge base / memory | Yes | DEV wiki mới `US-022-...md`; `docs/kb/dev/00-index.md`; `judgement-log.md` (số phận `MonthBudget.income`) |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Data | `prisma/schema.prisma` | Model mới `IncomeSource { id, monthId, name String, amount Int, order Int @default(0), month relation onDelete: Cascade, createdAt, updatedAt, @@index([monthId]), @@index([monthId, order]) }` |
| Data | thư mục `prisma/migrations/` — migration `add_income_source` | `ssr-data` sinh bằng `prisma migrate dev`; kèm bước backfill (SQL `INSERT ... SELECT` hoặc script) tạo 1 `IncomeSource` "Lương" = `MonthBudget.income` cho mỗi tháng đang có |
| Data | `docs/db/schema.dbml` | Thêm bảng `IncomeSource` + quan hệ tới `MonthBudget` |
| Domain entity | `server/budget/domain/entities/income-source.ts` | Mới: `IncomeSourceEntity { id, monthId, name, amount, order }` |
| Domain repo interface | `server/budget/domain/repositories/income-source-repository.ts` | Mới: `findAll`, `findByMonth`, `findById`, `create`, `update`, `reorder`, `delete` (+ `CreateIncomeSourceInput`, `UpdateIncomeSourceInput`) |
| Domain rule | `server/budget/domain/rules/income-source-rule.ts` | Mới: `assertValidIncomeSourceName`, `assertValidIncomeSourceAmount` (số nguyên, `>= 0`), `InvalidIncomeSourceInputError` |
| Domain rule | `server/budget/domain/rules/current-month-rule.ts` | Thêm `assertMonthNotPast(monthId)` + `MonthInPastError` (so sánh `monthId < getCurrentMonthId()`); giữ `getCurrentMonthId`. Gỡ `assertMonthIsCurrent` + `CurrentMonthViolationError` sau khi hết chỗ dùng |
| Domain service | `server/budget/domain/services/budget-snapshot-service.ts` | Thêm dep `incomeSourceRepository`; type `IncomeSourceSnapshot`; `MonthBudgetSnapshot.incomeSources`; `income` = `Σ amount` (thay `month.income`) |
| Domain service | `server/budget/domain/services/*` | Không cần domain service riêng cho Nguồn thu — CRUD gộp gọn, use-case gọi thẳng repository (giống `Category`) |
| Application | `server/budget/application/use-cases/upsert-income-source.ts` | Mới — mirror `upsert-category` (bỏ luật trùng tên; thêm `assertMonthNotPast`) |
| Application | `server/budget/application/use-cases/remove-income-source.ts` | Mới — mirror `remove-category` (bỏ reassign giao dịch; thêm `assertMonthNotPast`) |
| Application | `server/budget/application/use-cases/reorder-income-sources.ts` | Mới — mirror `reorder-categories` (thêm `assertMonthNotPast`) |
| Application | `server/budget/application/use-cases/add-purchase-item.ts` | `assertMonthIsCurrent` → `assertMonthNotPast`; đổi text lỗi |
| Application | `server/budget/application/use-cases/update-purchase-item.ts` | như trên |
| Application | `server/budget/application/use-cases/mark-purchase-item-purchased.ts` | như trên |
| Application | `server/budget/application/use-cases/delete-purchase-item.ts` | như trên |
| Application | `server/budget/application/use-cases/create-month.ts` | Không seed `IncomeSource`; ghi `income: 0` |
| Application | `server/budget/application/use-cases/reset-all-budget-data.ts` | Thêm dep `incomeSourceRepository`; seed 1 "Lương" = `DEFAULT_INCOME` mỗi tháng mặc định |
| Infrastructure | `server/budget/infrastructure/repositories/income-source-prisma-repository.ts` | Mới — mirror `category-prisma-repository` (không `findFallbackByMonth`/`upsert` nếu không cần) |
| Composition root | `server/budget/actions.ts` | Wire `incomeSourceRepository` → `budgetSnapshotService` + 3 use-case mới; export 3 Server Action + `type IncomeSourceSnapshot`, `UpsertIncomeSourceInput`, `ReorderIncomeSourcesInput` |
| Entity (domain) | `server/budget/domain/entities/month-budget.ts` | Giữ `income` trong `MonthBudgetEntity` (repo vẫn map) — không xóa cột, xem mục 9 |
| UI | `components/BudgetApp.tsx` | Khu vực bảng "Nguồn thu" (state + handlers + JSX); `totals` useMemo tính lại; helper `pickInitialMonthId`; đổi `selectedMonthId` khởi tạo; `canEditMonth`; gỡ chuỗi mốc cứng; thêm ô insight mới |
| Consumer | `components/PlanViews.tsx` (`OverviewView`) | Không đọc `budget` snapshot — không ảnh hưởng |
| Consumer | US-007 biểu đồ "Xu hướng" trong `BudgetApp` | Dùng `month.income` cho nhãn/so sánh — nay là số thật, không cần sửa code |

## 9. Thay Đổi Data Model

Cần đổi schema: **Có**. Bắt buộc `ssr-data` tạo `data-model.md` và task breakdown có task migration riêng.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `IncomeSource` | Thêm model | — | `order` = 0; `createdAt`/`updatedAt` như `Category` | `@@index([monthId])`, `@@index([monthId, order])` | Backfill: mỗi `MonthBudget` đang có → 1 `IncomeSource { name: "Lương", amount: MonthBudget.income, order: 0 }` |
| `MonthBudget` | Thêm quan hệ | — | — | — | Thêm `incomeSources IncomeSource[]`; **giữ cột `income`** (không drop) — SQLite drop-column qua Prisma tạo rủi ro không cần thiết, và cột này còn dùng đúng một lần lúc backfill. Sau US-022 cột thành vestigial (UI đọc từ tổng nguồn thu). `ssr-data` quyết định cuối; đề xuất giữ, ghi `JDG` để dọn sau. |

Ràng buộc SQLite đã biết: enum lưu dạng `String` (không áp dụng ở đây); `@@index` được hỗ trợ; quan hệ `onDelete: Cascade` như `Category`/`PurchaseItem` đang dùng.

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `MonthBudgetSnapshot` (type export từ `server/budget/actions.ts`) | `{ id, label, income, categories, transactions, purchaseItems }` | + `incomeSources: IncomeSourceSnapshot[]` | Không (thêm field) |
| `MonthBudgetSnapshot.income` | Giá trị cột `MonthBudget.income` (cố định 35tr) | `Σ IncomeSource.amount` của tháng | Không breaking về kiểu; giá trị nay phản ánh dữ liệu thật |
| Server Action budget | `getBudgetSnapshot`, `upsert/removeCategory`, `reorderCategories`, `*PurchaseItem`, ... | + `upsertIncomeSource`, `removeIncomeSource`, `reorderIncomeSources` | Không (thêm) |
| `assertMonthIsCurrent` (nội bộ domain) | Ném khi `monthId !== getCurrentMonthId()` | Thay bằng `assertMonthNotPast` (ném khi `monthId < getCurrentMonthId()`) | Không (nội bộ, không export ra ngoài bounded-context) |
| Thông báo lỗi thao tác item cần mua ở tháng sai | "Chỉ được thao tác item cần mua trong tháng hiện tại." | "Chỉ được thao tác item cần mua từ tháng hiện tại trở đi." | Không (chỉ đổi chữ) |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `prisma/schema.prisma` | Thêm model `IncomeSource` + quan hệ `MonthBudget.incomeSources` |
| `prisma/migrations/` — file `migration.sql` của migration `add_income_source` | (do `prisma migrate dev` sinh) tạo bảng + 2 index; kèm backfill "Lương" |
| `docs/db/schema.dbml` | Thêm bảng `IncomeSource` |
| `server/budget/domain/entities/income-source.ts` | Tạo `IncomeSourceEntity` |
| `server/budget/domain/repositories/income-source-repository.ts` | Tạo interface + input types |
| `server/budget/domain/rules/income-source-rule.ts` | Tạo 2 assert + error class |
| `server/budget/domain/rules/current-month-rule.ts` | Thêm `assertMonthNotPast` + `MonthInPastError`; gỡ `assertMonthIsCurrent`/`CurrentMonthViolationError` khi hết chỗ dùng |
| `server/budget/domain/services/budget-snapshot-service.ts` | Thêm dep + type + `incomeSources` + `income` = tổng |
| `server/budget/infrastructure/repositories/income-source-prisma-repository.ts` | Tạo repo Prisma mirror category |
| `server/budget/application/use-cases/upsert-income-source.ts` | Tạo use-case |
| `server/budget/application/use-cases/remove-income-source.ts` | Tạo use-case |
| `server/budget/application/use-cases/reorder-income-sources.ts` | Tạo use-case |
| `server/budget/application/use-cases/add-purchase-item.ts` | Đổi assert + text lỗi |
| `server/budget/application/use-cases/update-purchase-item.ts` | Đổi assert + text lỗi |
| `server/budget/application/use-cases/mark-purchase-item-purchased.ts` | Đổi assert + text lỗi |
| `server/budget/application/use-cases/delete-purchase-item.ts` | Đổi assert + text lỗi |
| `server/budget/application/use-cases/create-month.ts` | Không seed IncomeSource; `income: 0` |
| `server/budget/application/use-cases/reset-all-budget-data.ts` | Thêm dep + seed 1 "Lương" mỗi tháng mặc định |
| `server/budget/actions.ts` | Wire repo + use-case mới; export 3 Server Action + types |
| `components/BudgetApp.tsx` | Bảng "Nguồn thu"; `totals` mới; `pickInitialMonthId`; `canEditMonth`; gỡ mốc cứng; ô insight mới |
| `docs/kb/dev/wiki/US-022-nguon-thu-va-insight-tab-thu-chi.md` | Tạo DEV function wiki (bước này của `ssr-plan`) |
| `docs/kb/dev/00-index.md` | Thêm dòng US-022 |

## 12. Kế Hoạch Verification

> Kết quả thực tế (`ssr-dev`, 2026-09-07): `./node_modules/.bin/prisma validate` → schema valid; `./node_modules/.bin/prisma migrate dev` → `20260907005635_add_income_source` áp OK; `node prisma/backfill/us022-income-sources.mjs` → 9 tháng, idempotent; `./node_modules/.bin/tsc --noEmit` → exit 0; `./node_modules/.bin/next build` → pass (`/budget` 12.8 kB). `next lint` không chạy được (dự án chưa có eslint config — có sẵn, ngoài phạm vi US-022). Smoke thủ công AC-01..AC-13: chạy ở stage `review`/`test`.

| Bước | Lệnh | Kỳ vọng |
| --- | --- | --- |
| Prisma format/validate | `rtk npx prisma format` · `rtk npx prisma validate` | schema hợp lệ |
| Migration | `rtk npx prisma migrate dev` | migration `add_income_source` áp thành công; backfill chạy |
| DBML sync | `rtk npx prisma generate` | `docs/db/schema.dbml` cập nhật (prisma-dbml-generator) |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi |
| Lint | `rtk lint` | 0 lỗi |
| Test | `rtk vitest run` | pass (nếu có test; repo hiện chưa có thư mục test cho budget — task breakdown cân nhắc thêm test use-case) |
| Build | `rtk next build` | pass |
| Thủ công 1 | Mở `/budget` khi máy ở tháng chưa có dữ liệu | Tab chọn sẵn tháng gần hiện tại nhất (ưu tiên quá khứ khi hòa) — AC-06 |
| Thủ công 2 | Thêm/sửa/xóa nguồn thu ở tháng hiện tại | "Thu nhập tháng", "Số dư còn lại", "Tiết kiệm ròng", "Tỷ lệ tiết kiệm", "Tỷ lệ sử dụng thu nhập" đổi đúng — AC-01/02/03/04 |
| Thủ công 3 | Xem "Đã phân bổ vào tích lũy" | = tổng Chi thực tế danh mục Loại "Tích lũy" — AC-05 |
| Thủ công 4 | Mở một tháng đã kết thúc | Bảng nguồn thu + item cần mua chỉ xem — AC-07/13 |
| Thủ công 5 | Thêm item cần mua cho một tháng tương lai | Thêm được — AC-07 |
| Thủ công 6 | Tạo tháng mới bằng "Clone tháng đang xem" | Bảng nguồn thu trống, "Thu nhập tháng" 0đ; không còn chuỗi "7.5M"/"31.5M"/"90%" ở insight/Quy tắc kiểm soát — AC-08 |
| Thủ công 7 | Sau khi migrate, mở một tháng cũ | Có 1 nguồn thu "Lương" = 35.000.000đ; chỉ số tổng giữ nguyên — AC-09 |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Backfill migration chạy sai (bỏ sót tháng, sai số tiền) | Trung bình | `ssr-data` viết backfill dạng `INSERT INTO IncomeSource (...) SELECT ... FROM MonthBudget`; verification thủ công 7 đối chiếu từng tháng | `prisma migrate resolve --rolled-back` + revert commit; cột `MonthBudget.income` vẫn còn nên phục hồi được |
| `budget-snapshot-service` tính `income` sai khi tháng chưa có nguồn thu | Thấp | Mặc định `Σ [] = 0`; unit test cho service | Revert file service |
| DnD nguồn thu xung đột state với DnD danh mục (dùng chung biến) | Trung bình | Tách biến state riêng cho income (`draggedIncomeId`/`dragOverIncomeId`), không tái dùng biến của category | Revert phần JSX + state income trong `BudgetApp.tsx` |
| Đổi `assertMonthIsCurrent` làm hồi quy US-019 (cho thao tác tháng lẽ ra khóa) | Thấp | `assertMonthNotPast` chặt hơn đúng phần cần: chỉ nới sang tương lai, vẫn chặn quá khứ; AC-07/13 kiểm chứng | Khôi phục `assertMonthIsCurrent` trong 4 use-case |
| `MonthBudget.income` để lại gây nhầm lẫn về sau | Thấp | Ghi `JDG` + comment trong `month-budget-prisma-repository.ts` nêu rõ cột vestigial | — |

## 14. Phân Rã Task

Canonical task file: `task.md` (do `ssr-breaker` sở hữu — bảng chi tiết + ma trận coverage + thứ tự dependency nằm ở đó).

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Xác nhận migration `20260907005635_add_income_source` + backfill "Lương" + DBML (phần làm: **đã Applied** bởi `ssr-data`) | Pending |
| `TB-02` | Domain entity/repo-interface/rule cho Nguồn thu | Pending |
| `TB-03` | `assertMonthNotPast` + `MonthInPastError` trong `current-month-rule.ts` | Pending |
| `TB-04` | `income-source-prisma-repository.ts` mirror category | Pending |
| `TB-05` | 3 use-case `upsert`/`remove`/`reorder` income source | Pending |
| `TB-06` | 4 use-case purchase-item sang `assertMonthNotPast` + text lỗi; gỡ `assertMonthIsCurrent` | Pending |
| `TB-07` | `budget-snapshot-service`: `incomeSources` + `income` = tổng | Pending |
| `TB-08` | Wire `actions.ts` + export 3 Server Action + types | Pending |
| `TB-09` | `create-month` (không seed, `income:0`) + `reset-all-budget-data` (seed "Lương" mỗi tháng mặc định) | Pending |
| `TB-10` | `BudgetApp.tsx`: khu vực bảng "Nguồn thu" (state riêng + handlers + JSX + DnD) | Pending |
| `TB-11` | `BudgetApp.tsx`: `totals` mới + ô insight mới + gỡ chuỗi mốc cứng + `pickInitialMonthId` + `canEditMonth` | Pending |
| `TB-12` | Verification cuối (prisma validate, tsc, lint, build, smoke AC-01..AC-13) + DEV wiki evidence | Pending |

Readiness: Ready — 12 task, ma trận coverage phủ AC-01..AC-13 và mọi ô `Yes` ở mục 7; migration đã áp ở stage `data`.
