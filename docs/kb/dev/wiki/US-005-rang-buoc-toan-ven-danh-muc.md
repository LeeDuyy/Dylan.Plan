---
status: Active
feature: US-005
updated: 2026-08-06
plan: docs/features/US-005-rang-buoc-toan-ven-danh-muc/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-005", "Ràng buộc toàn vẹn danh mục + giao dịch không danh mục (DEV)"]
---

# US-005 — Ràng buộc toàn vẹn danh mục + giao dịch không danh mục (DEV)

Status: Active
Feature: US-005
Updated: 2026-08-06
Plan: `docs/features/US-005-rang-buoc-toan-ven-danh-muc/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Mở rộng bounded context `budget` (đã có từ US-001/US-003/US-004) với field mới `Category.isFallback` (`DEC-058`) để phân biệt danh mục dự phòng "Chi tiêu khác" với các danh mục khóa khác. Thêm domain service `fallback-category-service.ts` gói quy tắc "tự sinh khi cần" (BR-009), dùng chung bởi use-case xóa danh mục (chuyển giao dịch trước khi xóa) và use-case ghi nhận nhanh (tự gán khi bỏ qua chọn danh mục). Không tạo bounded context mới.

## 2. Luồng End-To-End

```text
[Xóa danh mục có giao dịch]
components/BudgetApp.tsx -> server/budget/actions.ts#removeCategory()
  -> application/use-cases/remove-category.ts
       -> domain/repositories/transaction-repository.ts (countByCategory, reassignCategory)
       -> domain/services/fallback-category-service.ts (getOrCreate — chỉ khi còn giao dịch)
       -> domain/repositories/category-repository.ts (delete)
  -> infrastructure/repositories/*.ts -> lib/prisma.ts -> SQLite
  -> revalidatePath("/budget") -> client dựng toast từ { deletedName, movedCount }

[Ghi nhận nhanh không chọn danh mục]
components/BudgetApp.tsx (dropdown để trống) -> actions.ts#recordQuickTransaction({ categoryId: undefined })
  -> application/use-cases/record-quick-transaction.ts
       -> domain/services/fallback-category-service.ts (getOrCreate)
       -> domain/rules/transaction-input-rule.ts (tái dùng nguyên vẹn)
       -> domain/repositories/transaction-repository.ts (create)
  -> infrastructure -> Prisma -> SQLite -> revalidatePath("/budget")
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — dropdown nhập nhanh, bảng danh mục, wrapper `removeCategory`, toast mới |
| Auth | Không áp dụng | Single-user (`DEC-004`) |
| Application | `remove-category.ts`, `record-quick-transaction.ts`, `upsert-category.ts`, `create-month.ts` | Xem mục 3 |
| Domain | `fallback-category-service.ts` (mới) | BR-009 — get-or-create "Chi tiêu khác" theo tháng |
| Infrastructure | `category-prisma-repository.ts`, `transaction-prisma-repository.ts` | Thêm `findFallbackByMonth`, `countByCategory`, `reassignCategory` |
| Data | `prisma/schema.prisma` | `Category.isFallback Boolean @default(false)` — `ssr-data` |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Component | `components/BudgetApp.tsx` | Dropdown nhập nhanh (lựa chọn trống), bảng danh mục (ẩn/đọc-chỉ dòng `isFallback`), wrapper `removeCategory` dựng toast |
| Component (mới) | `components/shared/Toast.tsx` | Toast dùng chung đầu tiên của app, tự đóng sau vài giây (`DEC-012`) |
| Use-case (Application) | `server/budget/application/use-cases/remove-category.ts` | Chuyển giao dịch sang "Chi tiêu khác" trước khi xóa nếu còn giao dịch; đổi kiểu trả về |
| Use-case (Application) | `server/budget/application/use-cases/record-quick-transaction.ts` | `categoryId` optional — tự lấy/tạo "Chi tiêu khác" khi trống |
| Use-case (Application) | `server/budget/application/use-cases/upsert-category.ts` | Chặn update khi danh mục `isFallback` |
| Use-case (Application) | `server/budget/application/use-cases/create-month.ts` | Lọc bỏ danh mục `isFallback` khỏi `sourceCategories` khi sao chép tháng (`JDG-010`) |
| Domain service | `server/budget/domain/services/fallback-category-service.ts` | `getOrCreate(monthId)` — BR-009, dùng chung 2 use-case trên |
| Domain entity | `server/budget/domain/entities/category.ts` | Thêm `isFallback: boolean` |
| Repository (Infrastructure) | `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Map `isFallback`, hiện thực `findFallbackByMonth` |
| Repository (Infrastructure) | `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | Hiện thực `countByCategory`, `reassignCategory` |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `Category` | `isFallback Boolean @default(false)` | Không cần index riêng | Không đổi quan hệ hiện có |

- Migration liên quan: `prisma/migrations/20260806083443_add_category_is_fallback/`
- DBML đã đồng bộ: Có — `docs/db/schema.dbml` (cập nhật thủ công, dự án chưa cài generator DBML)
- Lưu ý SQLite: `ALTER TABLE ADD COLUMN` với `@default(false)` áp dụng an toàn cho toàn bộ danh mục hiện có (kể cả "Tiền nhà"/"Chi phí cố định khác" — tự nhận `isFallback=false`, đúng ý nghĩa vì chưa danh mục nào từng là "Chi tiêu khác" trước US-005); xem chi tiết đối chiếu ràng buộc ở `docs/features/US-005-rang-buoc-toan-ven-danh-muc/data-model.md` mục 4

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `removeCategory(id)` | Trả `RemoveCategoryResult` (`{ deletedName, movedCount }`) hoặc `null` nếu danh mục đã không còn; chuyển giao dịch sang "Chi tiêu khác" trước khi xóa nếu cần | `components/BudgetApp.tsx` |
| `recordQuickTransaction(input)` | `categoryId` nay là optional; trống thì tự vào "Chi tiêu khác" | `components/BudgetApp.tsx` |
| `upsertCategory(input)` | Ném `UpsertCategoryError` nếu `id` trỏ tới danh mục `isFallback` | `components/BudgetApp.tsx` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| US-001 | Depends on | `server/budget/**`, `Category`/`Transaction` model |
| US-003 | Depends on | `Transaction.categoryId` là khóa ngoại thật — cần để chuyển giao dịch chính xác |
| US-004 | Depends on | AC-05 dùng thao tác xóa giao dịch của `US-004` (`deleteTransaction`) để kiểm chứng ẩn "Chi tiêu khác" |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — 0 lỗi (sau khi `ssr-data` thêm field và sinh lại client, giữ nguyên sau khi `ssr-dev` triển khai xong) | 2026-08-06 |
| `rtk npx prisma validate` | Passed | 2026-08-06 |
| `rtk next build` | Passed — Errors: 0, Warnings: 0 | 2026-08-06 |
| Thủ công đủ 6 AC trên `next dev` | Passed — chi tiết ở `docs/features/US-005-rang-buoc-toan-ven-danh-muc/task.md` `TB-12` | 2026-08-06 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Đổi kiểu trả về `removeCategory` là breaking contract, chỉ một nơi gọi | Thấp | Quay lại kiểu trả `void`, bỏ toast |
| Sao chép tháng từng có nguy cơ nhân bản "Chi tiêu khác" nếu không lọc (`JDG-010`) | Thấp | Không cần rollback riêng — xử lý ngay trong `TB-06` trước khi field `isFallback` tồn tại thật |
| Ví dụ trong spec AC-03 ("sửa xe máy 200k") thực ra khớp từ khóa "xe" của danh mục "Di chuyển" (`lib/budget-defaults.ts`, so khớp substring có từ US-001) — không tái hiện đúng như mô tả nếu dùng nguyên văn | Thấp | Không phải lỗi code US-005; kiểm chứng AC-03 đã dùng câu khác không va chạm từ khóa. Follow-up: `ssr-ba` nên đổi ví dụ trong spec ở một lượt sau |
