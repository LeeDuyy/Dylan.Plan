---
status: Active
feature: US-003
updated: 2026-08-05
plan: docs/features/US-003-lien-ket-giao-dich-theo-id/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-003", "Liên kết giao dịch theo danh mục bằng ID (DEV)"]
---

# US-003 — Liên kết giao dịch theo danh mục bằng ID (DEV)

Status: Active
Feature: US-003
Updated: 2026-08-05
Plan: `docs/features/US-003-lien-ket-giao-dich-theo-id/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Không phải tính năng mới — ghi lại thiết kế kỹ thuật đã triển khai thật cùng đợt `US-001`. `Transaction.categoryId` là khóa ngoại bắt buộc tới `Category.id` (Prisma, `onDelete: Restrict`). "Chi thực tế" luôn tính bằng `groupBy` trên `Transaction.categoryId`, không lưu tay. Đổi tên danh mục chỉ sửa `Category.name`, không đụng `Transaction`.

## 2. Luồng End-To-End

```text
Ghi nhận: components/BudgetApp.tsx -> server/budget/actions.ts#recordQuickTransaction()
  -> application/use-cases/record-quick-transaction.ts (gán categoryId, validate cùng tháng)
  -> domain/repositories/transaction-repository.ts -> infrastructure/repositories/transaction-prisma-repository.ts -> Prisma -> SQLite

Đổi tên: components/BudgetApp.tsx -> server/budget/actions.ts#upsertCategory()
  -> application/use-cases/upsert-category.ts (chỉ sửa Category.name/type/budget)
  -> infrastructure/repositories/category-prisma-repository.ts -> Prisma -> SQLite (Transaction không đổi)

Đọc: components/BudgetApp.tsx -> server/budget/actions.ts#getBudgetSnapshot()
  -> domain/services/budget-snapshot-service.ts -> transactionRepository.sumAmountGroupedByCategory() (Prisma groupBy theo categoryId)
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component, không đổi |
| Auth | Không áp dụng | Single-user (`DEC-004`) |
| Application | `server/budget/application/use-cases/record-quick-transaction.ts`, `upsert-category.ts` | Gán/giữ `categoryId` — không đổi |
| Domain | `server/budget/domain/services/budget-snapshot-service.ts` | Aggregate "Chi thực tế" theo `categoryId` — không đổi |
| Infrastructure | `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | `sumAmountGroupedByCategory` — không đổi |
| Data | `prisma/schema.prisma` | `Transaction.categoryId` khóa ngoại — không đổi |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Component | `components/BudgetApp.tsx` | Tra tên danh mục hiển thị theo `categoryId` mỗi lần render |
| Server Action | `server/budget/actions.ts` | `recordQuickTransaction`, `upsertCategory`, `getBudgetSnapshot` — không đổi |
| Use-case (Application) | `server/budget/application/use-cases/record-quick-transaction.ts` | Gán `categoryId` khi tạo giao dịch |
| Use-case (Application) | `server/budget/application/use-cases/upsert-category.ts` | Đổi tên/loại/ngân sách danh mục, không đụng `Transaction` |
| Domain service | `server/budget/domain/services/budget-snapshot-service.ts` | Tính "Chi thực tế" bằng aggregate |
| Repository (Infrastructure) | `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | `sumAmountGroupedByCategory` (Prisma `groupBy`) |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `Transaction` | `categoryId` (bắt buộc) | `@@index([categoryId])` | Khóa ngoại tới `Category`, `onDelete: Restrict` |

- Migration liên quan: `prisma/migrations/20260803064029_init_budget_persistence/` (đã áp dụng cùng đợt US-001, không có migration riêng cho US-003)
- DBML đã đồng bộ: Có — `docs/db/schema.dbml`
- Lưu ý SQLite: Không có ràng buộc đặc biệt ngoài các ràng buộc đã ghi ở `data-model.md` của US-001

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `Transaction.categoryId` | Khóa ngoại bắt buộc, không đổi khi `Category.name` đổi | `record-quick-transaction.ts`, `update-transaction.ts` (US-004), `budget-snapshot-service.ts` |
| `TransactionSnapshot.categoryId` | DTO client chỉ mang mã, không mang tên — tên tra động ở UI | `components/BudgetApp.tsx` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-001` | Depends on (song song) | `server/budget/**`, thiết kế `Transaction.categoryId` |
| `US-004` | Impacts | `updateTransaction` dùng cùng cơ chế `categoryId` khi đổi danh mục một giao dịch |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — "No errors found" | 2026-08-06 |
| `rtk npx prisma validate` | Passed — schema hợp lệ, không đổi | 2026-08-06 |
| `rtk next build` | Passed — `Errors: 0, Warnings: 0` | 2026-08-06 |
| `rtk vitest run` | Gap đã biết (giống US-001/US-002/US-004) — `vitest` chưa cài, thay bằng thao tác thủ công | 2026-08-06 |
| Thủ công — AC-01 | Ghi "cafe 45k" vào danh mục "Giải trí / cafe" (đang 0đ) → giao dịch gắn đúng danh mục, "Chi thực tế" đổi 0đ → 45.000đ | 2026-08-06 |
| Thủ công — AC-02 | Danh mục "Di chuyển" có 2 giao dịch (10.000đ + 20.000đ) → "Chi thực tế" hiện đúng 30.000đ | 2026-08-06 |
| Thủ công — AC-03 | Đổi tên "Giải trí / cafe" → "Giải trí / cafe / trà sữa" → giao dịch "cafe 45k" tự hiện đúng tên mới, "Chi thực tế" giữ nguyên 45.000đ | 2026-08-06 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Không có rủi ro kỹ thuật mới — requirement chỉ xác nhận lại hành vi đã triển khai từ `US-001` | Thấp | Không áp dụng — không có thay đổi source |
