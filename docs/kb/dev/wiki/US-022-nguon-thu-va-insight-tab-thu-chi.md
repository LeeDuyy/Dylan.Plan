---
status: Draft
feature: US-022
updated: 2026-09-07
plan: docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-022", "Nguồn thu và insight tab Thu chi (DEV)"]
---

# US-022 — Nguồn thu, sửa insight tiết kiệm, tháng mặc định và bỏ giới hạn tháng cho Item cần mua tại tab Thu chi (DEV)

## 1. Tổng Quan Kỹ Thuật

Bounded-context `budget` (`server/budget/`, Light DDD 3 lớp: `domain/` → `application/` → `infrastructure/`, composition root `server/budget/actions.ts`). Thêm entity `IncomeSource` gắn theo `MonthBudget` (`monthId`), mirror gần hết pattern của `Category` nhưng chỉ có `name` + `amount` (Int, ≥ 0) + `order`. Đường đọc: `budget-snapshot-service` trả thêm `incomeSources` và tính `income = Σ amount` thay cho cột `MonthBudget.income`. Đường ghi: 3 Server Action mới (`upsert`/`remove`/`reorder` income source), tất cả `revalidatePath("/budget")`. Luật tháng: `assertMonthNotPast` (mới, trong `current-month-rule.ts`) dùng cho cả nguồn thu và 4 use-case purchase-item, thay `assertMonthIsCurrent`. UI (`components/BudgetApp.tsx`, Client Component) thêm bảng "Nguồn thu" + tính lại `totals` + helper chọn tháng mặc định; KHÔNG đụng layout/antd (thuộc US-023).

## 2. Luồng End-To-End

```text
app/budget/page.tsx (Server Component)
  -> getBudgetSnapshot() [server/budget/actions.ts "use server"]
  -> getBudgetSnapshotUseCase -> budgetSnapshotService.getSnapshot()
     -> monthBudgetRepository / categoryRepository / transactionRepository / purchaseItemRepository / incomeSourceRepository(MỚI)
     -> MonthBudgetSnapshot { ..., incomeSources[], income = Σ amount }
  -> render BudgetApp (Client) với initialBudget = snapshot

Ghi nguồn thu:
  BudgetApp (form / onBlur / onDrop)
  -> upsertIncomeSource | removeIncomeSource | reorderIncomeSources [server/budget/actions.ts]
  -> use-case [application/use-cases/*income-source*.ts]
     -> assertValidIncomeSourceName / assertValidIncomeSourceAmount [domain/rules/income-source-rule.ts]
     -> assertMonthNotPast(monthId) [domain/rules/current-month-rule.ts MỚI]
     -> incomeSourceRepository.create|update|delete|reorder [infrastructure/repositories/income-source-prisma-repository.ts]
     -> prisma.incomeSource.* -> SQLite
     -> revalidatePath("/budget")
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `app/budget/page.tsx` | Server Component — không đổi |
| Entry (ghi) | `server/budget/actions.ts` | Server Action — thêm 3 action nguồn thu; sửa text/điều kiện 4 action purchase-item |
| Auth | — | Không có auth cho budget (Dylan là user duy nhất, DEC-004) |
| Application | `server/budget/application/use-cases/{upsert,remove,reorder}-income-source.ts` | CRUD + reorder nguồn thu; `{add,update,mark,delete}-purchase-item.ts` đổi assert |
| Domain | `server/budget/domain/rules/income-source-rule.ts`, `current-month-rule.ts` | Validate name/amount; `assertMonthNotPast`. Không có domain service riêng (CRUD gộp gọn) |
| Domain | `server/budget/domain/services/budget-snapshot-service.ts` | Dựng snapshot — thêm `incomeSources` + `income` = tổng |
| Infrastructure | `server/budget/infrastructure/repositories/income-source-prisma-repository.ts` | Mirror `category-prisma-repository.ts` |
| Data | `prisma/schema.prisma` | Model mới `IncomeSource` |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Page | `app/budget/page.tsx` | Server Component gọi `getBudgetSnapshot` (không đổi) |
| Server Action | `server/budget/actions.ts` | Composition root — wire repo/use-case, export Server Action + type |
| Component | `components/BudgetApp.tsx` | Bảng nguồn thu, insight, chọn tháng, item cần mua, DnD |
| Component | `components/shared/TargetGrid.tsx` | "Quy tắc kiểm soát" — gỡ nội dung nêu mốc tiền cứng |
| Use-case | `server/budget/application/use-cases/upsert-income-source.ts` | Thêm/sửa một nguồn thu |
| Use-case | `server/budget/application/use-cases/remove-income-source.ts` | Xóa một nguồn thu |
| Use-case | `server/budget/application/use-cases/reorder-income-sources.ts` | Sắp xếp thứ tự nguồn thu |
| Use-case | `server/budget/application/use-cases/{add,update,mark-purchased,delete}-purchase-item.ts` | Đổi `assertMonthIsCurrent` → `assertMonthNotPast` |
| Use-case | `server/budget/application/use-cases/create-month.ts` | Không seed nguồn thu (BR-037); `income: 0` |
| Use-case | `server/budget/application/use-cases/reset-all-budget-data.ts` | Seed 1 "Lương" = `DEFAULT_INCOME` mỗi tháng mặc định |
| Domain rule/entity | `server/budget/domain/entities/income-source.ts`, `domain/rules/income-source-rule.ts`, `domain/rules/current-month-rule.ts` | Entity + validate + luật tháng |
| Repository | `server/budget/infrastructure/repositories/income-source-prisma-repository.ts` | Implement `IncomeSourceRepository` |
| Repository interface | `server/budget/domain/repositories/income-source-repository.ts` | `findAll`/`findByMonth`/`findById`/`create`/`update`/`reorder`/`delete` |
| Type | `server/budget/domain/services/budget-snapshot-service.ts` | `IncomeSourceSnapshot`, `MonthBudgetSnapshot.incomeSources` |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `IncomeSource` | `id`, `monthId`, `name String`, `amount Int`, `order Int @default(0)`, `createdAt`, `updatedAt` | `@@index([monthId])`, `@@index([monthId, order])` | `month MonthBudget @relation(fields: [monthId], references: [id], onDelete: Cascade)` |
| `MonthBudget` | `income Int` (giữ, thành vestigial sau US-022) | — | `incomeSources IncomeSource[]` |

- Migration liên quan: `prisma/migrations/20260907005635_add_income_source/` — `CREATE TABLE "IncomeSource"` + 2 index (`IncomeSource_monthId_idx`, `IncomeSource_monthId_order_idx`), FK `monthId` → `MonthBudget.id` `ON DELETE CASCADE`. Đã áp 2026-09-07.
- Backfill (ngoài `migration.sql`): `prisma/backfill/us022-income-sources.mjs` (better-sqlite3, idempotent) — mỗi `MonthBudget` chưa có nguồn thu → 1 `IncomeSource { name:'Lương', amount:MonthBudget.income, order:0 }`. Đã chạy 2026-09-07 cho 9 tháng.
- DBML đã đồng bộ: Có — `docs/db/schema.dbml` (thủ công, không có generator) thêm `Table IncomeSource` + ghi chú cột `MonthBudget.income` vestigial.
- Lưu ý SQLite: `@@index` hỗ trợ tốt; enum không dùng ở đây; `onDelete: Cascade` đã dùng cho `Category`/`PurchaseItem`. KHÔNG drop cột `MonthBudget.income` (JDG-035 — còn dùng lúc backfill + rollback). Backfill KHÔNG nhét vào `migration.sql` (chuẩn `ssr-data`).

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `MonthBudgetSnapshot.incomeSources` | `IncomeSourceSnapshot[] { id, name, amount, order }`, sort theo `order` | `components/BudgetApp.tsx`; `exportData` (US-008, tự động qua serialize) |
| `MonthBudgetSnapshot.income` | Đổi nghĩa: `Σ IncomeSource.amount` (trước là cột `MonthBudget.income`) | `components/BudgetApp.tsx` (`totals`), biểu đồ "Xu hướng" (US-007) |
| `upsertIncomeSource` / `removeIncomeSource` / `reorderIncomeSources` | Server Action mới trong `server/budget/actions.ts` | `components/BudgetApp.tsx` |
| `assertMonthNotPast(monthId)` | Ném `MonthInPastError` khi `monthId < getCurrentMonthId()` | 3 use-case income-source + 4 use-case purchase-item |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| US-019 | Impacts | 4 use-case purchase-item + `current-month-rule.ts` — đổi điều kiện tháng |
| US-016 | Depends on | `Category.type === "Tích lũy"` cho "Đã phân bổ vào tích lũy" |
| US-006 | Depends on | Luồng `create-month` — đảm bảo không seed nguồn thu |
| US-007 | Related only | Biểu đồ "Xu hướng" dùng `month.income` — nay là số thật |
| US-008 | Related only | `exportData` serialize snapshot — tự động gồm `incomeSources` |
| US-023 | Impacts | Cùng chạm `BudgetApp.tsx` — US-023 làm sau (DEC-132) |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `./node_modules/.bin/prisma validate` | Passed | 2026-09-07 |
| `./node_modules/.bin/prisma migrate dev` | Passed (`20260907005635_add_income_source`) | 2026-09-07 |
| `node prisma/backfill/us022-income-sources.mjs` | Passed (9 tháng) | 2026-09-07 |
| `./node_modules/.bin/tsc --noEmit` | Passed (sau `ssr-dev`, exit 0) | 2026-09-07 |
| `./node_modules/.bin/next build` | Passed (`/budget` compiled, 12.8 kB; gồm kiểm type + lint nội bộ Next) | 2026-09-07 |
| `./node_modules/.bin/next lint` | Không chạy được — dự án chưa có cấu hình ESLint (tình trạng có sẵn, không do US-022) | 2026-09-07 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Backfill migration sai số/bỏ sót tháng | Trung bình | `prisma migrate resolve --rolled-back` + revert commit; cột `MonthBudget.income` còn nguyên |
| DnD nguồn thu xung đột state DnD danh mục | Trung bình | Tách state riêng `draggedIncomeId`/`dragOverIncomeId` |
| `assertMonthNotPast` hồi quy US-019 | Thấp | Khôi phục `assertMonthIsCurrent` trong 4 use-case |

## 9. Kiến Trúc Áp Dụng

- Bounded context: `budget` (`server/budget/`) — chưa có trang `bounded-context` riêng trong `docs/kb/dev/wiki/` (cấu trúc `architecture/` chưa được khởi tạo cho dự án này — xem `docs/memory/judgement-log.md#jdg-005`). Bounded-context được mô tả tại DEV wiki của US-001/US-005 (data model + Light DDD gốc).

| Pattern | Dùng ở lớp/lát cắt nào | Lệch pattern (lý do) |
| --- | --- | --- |
| "Entity gắn theo MonthBudget, mirror Category" (`Category` → `PurchaseItem` (US-019) → `IncomeSource` (US-022)) | domain entity + repository interface + prisma repository + use-case CRUD gọi thẳng repo (không domain service) | Không |
| "Server Action composition root" (`server/budget/actions.ts` wire tất cả) | Server Action | Không |
| "Luật tháng ở domain rule" (`current-month-rule.ts`) | domain rule dùng chung nhiều use-case | Không — mở rộng từ `assertMonthIsCurrent` sang `assertMonthNotPast` |
