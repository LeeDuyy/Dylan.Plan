---
status: Active
feature: US-017
updated: 2026-08-12
plan: docs/features/US-017-sap-xep-danh-muc-keo-tha/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-017", "Sắp xếp danh mục kéo thả (DEV)"]
---

# US-017 — Sắp xếp vị trí danh mục bằng kéo thả (DEV)

Status: Active
Feature: US-017
Updated: 2026-08-12
Plan: `docs/features/US-017-sap-xep-danh-muc-keo-tha/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Thêm một cột thứ tự bền vững (`order`) cho `Category`, một use-case ghi hàng loạt (`reorderCategories`) chạy trong một transaction Prisma, và một tương tác kéo thả trên bảng ngân sách ở client dùng HTML5 Drag and Drop API sẵn có của trình duyệt (không thêm thư viện). Vì `budget-snapshot-service.ts` và `visibleCategories` ở client đã dùng chung một nguồn dữ liệu cho cả bảng, dropdown và biểu đồ, chỉ cần đổi thứ tự tại nguồn (`categoryRepository.findAll()` có `orderBy`) là cả 3 nơi tự động đồng bộ. Nghiệp vụ Clone tháng chỉ cần gán `order` theo đúng thứ tự mảng nguồn khi seed danh mục cho tháng mới.

## 2. Luồng End-To-End

```text
components/BudgetApp.tsx
  Dylan nhấn giữ tay cầm (GripVertical, EL-01) -> onDragStart: setDraggedCategoryId(id)
  kéo qua các dòng khác -> onDragOver (mỗi <tr>): setDragOverCategoryId(id) (chỉ để tô nền)
  thả -> dropCategory(targetId):
    - tính lại vị trí trong reorderableCategories (visibleCategories đã loại isFallback)
    - reorderCategoryLocal(orderedCategoryIds) — cập nhật state months cục bộ ngay (optimistic)
    -> reorderCategories({ monthId, orderedCategoryIds }) (server/budget/actions.ts, "use server")
         -> application/use-cases/reorder-categories.ts
              -> categoryRepository.findByMonth(monthId)
              -> domain/rules/category-reorder-rule.ts: assertReorderableCategories(...)
              -> categoryRepository.reorder(monthId, orderedCategoryIds)
                   -> infrastructure/repositories/category-prisma-repository.ts
                        -> prisma.$transaction([ ...update order theo từng id ])
              -> revalidatePath("/budget")
    -> await refreshSnapshot() (thành công: đồng bộ lại đúng dữ liệu server; lỗi: bắt bằng
       try/catch, setToastMessage rồi vẫn await refreshSnapshot() để phục hồi đúng thứ tự cũ)
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — tay cầm kéo thả trên bảng ngân sách |
| Auth | Không có | Single-user, không đăng nhập (`DEC-004`) |
| Application | `server/budget/application/use-cases/reorder-categories.ts` | Ghi thứ tự mới cho một tháng |
| Domain | `server/budget/domain/rules/category-reorder-rule.ts` | Chặn id lạ/"Chi tiêu khác"/thiếu-thừa id — rule đơn giản, không cần domain service (R13.4/R13.9: CRUD 1 entity kèm rule, không phối hợp entity khác) |
| Infrastructure | `server/budget/infrastructure/repositories/category-prisma-repository.ts` | `reorder` (transaction), `findAll`/`findByMonth` thêm `orderBy`, `create` tự tính `order` kế tiếp |
| Data | `prisma/schema.prisma` | `Category.order Int @default(0)`, `@@index([monthId, order])` |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Component | `components/BudgetApp.tsx` | Bảng ngân sách: cột tay cầm kéo thả mới (`GripVertical`, đầu mỗi dòng danh mục thường/khóa), state `draggedCategoryId`/`dragOverCategoryId`, hàm `reorderCategoryLocal`/`dropCategory`/`startCategoryDrag`/`dragCategoryOver`/`resetCategoryDragState`, `thead`/`tfoot` chỉnh `colSpan` cho cột mới. Dropdown "Danh mục nhận diện" và biểu đồ "Cơ cấu chi tiêu" không sửa dòng nào — dùng lại `visibleCategories` |
| Server Action | `server/budget/actions.ts` | Composition root — export `reorderCategories`, wiring use-case mới |
| Use-case (Application) | `server/budget/application/use-cases/reorder-categories.ts` | Ghi thứ tự mới, orchestrate rule + repository |
| Use-case (Application) | `server/budget/application/use-cases/create-month.ts` | `seedCategories` gán `order` theo thứ tự mảng nguồn (cả nhánh Clone và nhánh mặc định) |
| Domain rule | `server/budget/domain/rules/category-reorder-rule.ts` | `assertReorderableCategories` — cùng pattern `category-name-rule.ts`/`category-type-rule.ts` |
| Domain entity | `server/budget/domain/entities/category.ts` | Thêm `order: number` |
| Repository (Infrastructure) | `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Implement `reorder`, `orderBy`, tự tính `order` khi tạo mới không truyền |
| Type / schema | `server/budget/domain/repositories/category-repository.ts` | `CreateCategoryInput`/`UpdateCategoryInput` thêm `order?`, interface thêm `reorder` |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `Category` | `order Int @default(0)` (đã thêm vào `schema.prisma`) | `@@index([monthId, order])` (đã thêm) | Không đổi quan hệ với `MonthBudget`/`Transaction` |

- Migration liên quan: `prisma/migrations/20260812063115_add_category_order/` — đã áp dụng (2026-08-12). Kèm backfill `order` tuần tự theo `rowid` trong từng `monthId` ngay sau migration (84 dòng, 11 tháng) — xem `docs/features/US-017-sap-xep-danh-muc-keo-tha/data-model.md` mục 6.
- DBML đã đồng bộ: Có — `docs/db/schema.dbml` đã cập nhật thủ công theo delta (không có generator DBML cài sẵn trong dự án).
- Lưu ý SQLite: nhiều dòng cùng giá trị `order` không có thứ tự tie-break đảm bảo theo chuẩn SQL — đây chính là lý do bắt buộc backfill thay vì để mặc định tĩnh. `ALTER TABLE ADD COLUMN` với default hằng số và `CREATE INDEX` đều là thao tác SQLite hỗ trợ trực tiếp, không cần chiến lược tạo bảng mới.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `reorderCategories(input: ReorderCategoriesInput): Promise (void)` | Server Action mới — `{ monthId: string; orderedCategoryIds: string[] }`, ghi thứ tự mới trong một transaction | `components/BudgetApp.tsx` (handler kéo thả) |
| `CategoryRepository.reorder(monthId, orderedIds): Promise (void)` | Method mới trong interface repository | `application/use-cases/reorder-categories.ts` |
| `CategoryEntity.order: number` | Field mới trên entity | `budget-snapshot-service.ts` (gián tiếp, qua thứ tự mảng `findAll()` trả về), `create-month.ts` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-001` | Depends on | Cần model `Category` bền vững đã có migration áp dụng |
| `US-014` | Related only | Dùng lại nguyên vẹn `visibleCategories` (`components/BudgetApp.tsx:342-346`) — không sửa hàm này |
| `US-006` | Impacts | `create-month.ts` (nghiệp vụ Clone tháng) — thêm `order` vào `seedCategories`, không đổi chữ ký `CreateMonthInput` |
| `US-005` | Related only | Dùng chung dropdown "Danh mục nhận diện" (`EL-01`/`EL-02` của US-005) — không sửa hành vi chọn/gán |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `npx prisma validate` | Passed — không đổi so với stage `data` | 2026-08-12 |
| `npx tsc --noEmit` | Passed — `ok`, 0 lỗi sau khi toàn bộ `TB-02`..`TB-09` áp dụng | 2026-08-12 |
| `npx next build` | Passed — Compiled successfully, 3 route (`/`, `/_not-found`, `/budget`), 0 lỗi | 2026-08-12 |
| `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (`JDG-002`) | — |
| Thủ công AC-01..AC-06, AC-08 | Passed — mô phỏng kéo thả bằng `DragEvent`/`DataTransfer` thật trên `next dev`, xem chi tiết từng AC ở `docs/features/US-017-sap-xep-danh-muc-keo-tha/task.md` `TB-10` | 2026-08-12 |
| Thủ công AC-07 | Không kiểm chứng được trên UI thật — không còn kỳ tháng trống trong cửa sổ 13 tháng quanh ngày hệ thống; xác nhận thay thế bằng đọc code (`create-month.ts` + `category-prisma-repository.ts`) | 2026-08-12 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Migration thiếu bước backfill, xáo trộn thứ tự hiển thị hiện có của Dylan | Đã xử lý — backfill 84/84 dòng chạy ngay sau migration (stage `data`), xác nhận đúng thứ tự bằng query trực tiếp | Chạy lại script backfill gán `order` theo `rowid` tăng dần trong từng `monthId` nếu phát hiện sai lệch |
| `reorder` không transaction, cập nhật dở dang khi lỗi giữa chừng | Đã xử lý — implement bằng `prisma.$transaction`; xác nhận thật bằng test AC-08 (chặn 1 lần gọi mạng): dữ liệu không đổi, không có trạng thái dở dang | Không cần rollback thủ công — transaction tự hoàn tác |
| Không kiểm chứng được AC-07 (Clone tháng giữ thứ tự) trên UI thật do hết kỳ tháng trống trong dữ liệu hiện có | Thấp — logic đơn giản (map `order: index` trên mảng đã đúng thứ tự), đã xác nhận bằng đọc code | Kiểm lại bằng UI thật khi có kỳ tháng trống (ví dụ sau khi ngày hệ thống trôi qua, cửa sổ 13 tháng dịch chuyển) hoặc bằng script test riêng gọi thẳng `createMonth` |
