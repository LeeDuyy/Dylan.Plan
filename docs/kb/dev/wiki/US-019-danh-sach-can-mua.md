---
status: Active
feature: US-019
updated: 2026-08-19
plan: docs/features/US-019-danh-sach-can-mua/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-019", "Danh sách items cần mua theo tháng (DEV)"]
---

# US-019 — Danh sách items cần mua theo tháng tại bảng thu chi (DEV)

Status: Active
Feature: US-019
Updated: 2026-08-19
Plan: `docs/features/US-019-danh-sach-can-mua/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Entity mới `PurchaseItem` trong bounded-context `budget` đã có sẵn, theo đúng 3 lớp Light DDD như `Category`/`Transaction`. Điểm kỹ thuật cốt lõi: quyền ghi (thêm/sửa/xóa/đánh dấu đã mua) không dựa vào tháng đang chọn xem trên UI (`selectedMonthId`, như `Category`/`Transaction`) mà dựa vào **tháng hiện tại tính theo đồng hồ hệ thống** (`DEC-107`) — một hàm thuần `getCurrentMonthId()` dùng chung, gọi ở cả 4 use-case ghi lẫn use-case `create-month`. Việc chuyển item `Pending` sang tháng mới khi tạo tháng (`BR-023`) nối thẳng vào use-case `create-month` đã có của US-006, không cần Server Action hay nút bấm mới.

## 2. Luồng End-To-End

```text
components/BudgetApp.tsx (khu vực "Items cần mua")
  -> addPurchaseItem / updatePurchaseItem / markPurchaseItemPurchased / deletePurchaseItem
       (Server Action, server/budget/actions.ts)
  -> application/use-cases/{add,update,mark-purchased,delete}-purchase-item.ts
       -> domain/rules/purchase-item-rule.ts (tên bắt buộc, giá >= 0 nếu có)
       -> domain/rules/current-month-rule.ts (getCurrentMonthId, assertMonthIsCurrent)
       -> domain/repositories/purchase-item-repository.ts (interface)
            -> infrastructure/repositories/purchase-item-prisma-repository.ts
                 -> prisma.purchaseItem.* -> SQLite
  -> revalidatePath("/budget")

Nhánh tạo tháng (dùng lại luồng US-006, không đổi Server Action `createMonth`):
components/BudgetApp.tsx -> createMonth({ monthId, sourceMonthId? })
  -> application/use-cases/create-month.ts
       (như cũ) tạo MonthBudget + Category
       (mới) currentMonthId = getCurrentMonthId()
       (mới) purchaseItemRepository.transferPendingToMonth(currentMonthId, monthId)
  -> revalidatePath("/budget")

Nhánh đọc:
app/budget/page.tsx -> getBudgetSnapshot()
  -> domain/services/budget-snapshot-service.ts (mở rộng: + purchaseItemRepository.findAll())
  -> gộp purchaseItems vào từng MonthBudgetSnapshot theo monthId
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — khu vực "Items cần mua" mới |
| Application | `server/budget/application/use-cases/add-purchase-item.ts` | Tạo item `Pending`, chặn nếu `monthId` không phải tháng hiện tại |
| Application | `server/budget/application/use-cases/update-purchase-item.ts` | Sửa tên/giá tại chỗ (inline) |
| Application | `server/budget/application/use-cases/mark-purchase-item-purchased.ts` | Đổi trạng thái, no-op nếu đã `Purchased` |
| Application | `server/budget/application/use-cases/delete-purchase-item.ts` | Xóa, idempotent trong phạm vi tháng hiện tại |
| Application | `server/budget/application/use-cases/create-month.ts` | Nối thêm bước `transferPendingToMonth` sau khi tạo danh mục |
| Domain | `server/budget/domain/rules/current-month-rule.ts` | `getCurrentMonthId()`, `assertMonthIsCurrent()` — dùng chung cho mọi use-case ghi |
| Domain | `server/budget/domain/rules/purchase-item-rule.ts` | Validate tên/giá |
| Infrastructure | `server/budget/infrastructure/repositories/purchase-item-prisma-repository.ts` | Toàn bộ entity `PurchaseItem` |
| Data | `prisma/schema.prisma` | Model `PurchaseItem` mới (do `ssr-data`) |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Page | `app/budget/page.tsx` | Không đổi — vẫn gọi `getBudgetSnapshot()` |
| Server Action | `server/budget/actions.ts` | Composition root — thêm 4 export mới, khởi tạo `purchaseItemRepository` |
| Component | `components/BudgetApp.tsx` | Khu vực "Items cần mua": form thêm, bảng, sửa inline theo mẫu `updateCategoryLocal`/`commitCategory`, badge trạng thái, ẩn/hiện theo `currentMonthId` tính bằng `new Date()` ở client |
| Use-case (Application) | `server/budget/application/use-cases/add-purchase-item.ts` | Thêm item |
| Use-case (Application) | `server/budget/application/use-cases/update-purchase-item.ts` | Sửa tên/giá |
| Use-case (Application) | `server/budget/application/use-cases/mark-purchase-item-purchased.ts` | Đánh dấu đã mua |
| Use-case (Application) | `server/budget/application/use-cases/delete-purchase-item.ts` | Xóa item |
| Use-case (Application) | `server/budget/application/use-cases/create-month.ts` | Sửa — nối bước chuyển item |
| Domain service | `server/budget/domain/services/budget-snapshot-service.ts` | Mở rộng deps + output, không tách domain service riêng cho CRUD `PurchaseItem` (R13.9 — CRUD 1 entity không rule phức tạp) |
| Domain rule/entity | `server/budget/domain/entities/purchase-item.ts`, `server/budget/domain/rules/purchase-item-rule.ts`, `server/budget/domain/rules/current-month-rule.ts` | Entity + 2 rule |
| Repository (Infrastructure) | `server/budget/infrastructure/repositories/purchase-item-prisma-repository.ts` | Implement `PurchaseItemRepository` |
| Type / schema | `server/budget/actions.ts` (re-export type-only) | `PurchaseItemSnapshot`, input type của 4 Server Action mới |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `PurchaseItem` | `id`, `monthId`, `name`, `price` (nullable), `status` (default `"Pending"`), `createdAt`, `updatedAt` | `@@index([monthId])` | `month MonthBudget @relation(fields: [monthId], references: [id], onDelete: Cascade)` |
| `MonthBudget` | thêm field quan hệ `purchaseItems PurchaseItem[]` | — | 1-n với `PurchaseItem` |

- Migration liên quan: `prisma/migrations/20260819080706_add_purchase_item/` — `CREATE TABLE "PurchaseItem"` + `CREATE INDEX "PurchaseItem_monthId_idx"`, đã áp thành công (2026-08-14).
- DBML đã đồng bộ: Có — `docs/db/schema.dbml` (cập nhật thủ công, dự án không có generator DBML cài sẵn).
- Lưu ý SQLite: `status` lưu dạng `String` (không có enum gốc), đúng mẫu đã dùng cho `Category.type`/`JobApplication.status` (`BR-019`, `DEC-108`, tiền lệ đã có trong dự án) — ràng buộc đúng 2 giá trị `"Pending"`/`"Purchased"` ở tầng ứng dụng (`domain/rules/purchase-item-rule.ts`, chờ `ssr-dev`), không ở DB.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `addPurchaseItem({ monthId, name, price? })` | Server Action — tạo item `Pending`; ném lỗi nếu tên rỗng, giá âm, hoặc `monthId` không phải tháng hiện tại | `components/BudgetApp.tsx` (nút "Thêm item") |
| `updatePurchaseItem({ id, name?, price? })` | Server Action — sửa tại chỗ; ném lỗi nếu không có field nào để sửa, tên rỗng, giá âm, hoặc item không thuộc tháng hiện tại | `components/BudgetApp.tsx` (blur ô Tên sản phẩm/Giá) |
| `markPurchaseItemPurchased(id)` | Server Action — đổi trạng thái sang `Purchased`, no-op nếu đã `Purchased` | `components/BudgetApp.tsx` (nút đánh dấu đã mua) |
| `deletePurchaseItem(id)` | Server Action — xóa, idempotent trong tháng hiện tại | `components/BudgetApp.tsx` (nút xóa) |
| `getCurrentMonthId()` | Hàm thuần domain — tính `YYYY-MM` từ `new Date()` server, cùng công thức đã dùng ở `buildMonthPeriods` (client) và mini dashboard (`DEC-034`) | 4 use-case ghi + `create-month.ts` |
| `BudgetSnapshot.months[].purchaseItems` | Mảng `PurchaseItemSnapshot` mới trong snapshot đọc | `components/BudgetApp.tsx` (render khu vực "Items cần mua") |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-006` | Depends on | Dùng chung use-case `create-month.ts` và 2 nút "Tạo tháng"/"Clone tháng đang xem" — không đổi contract input của `createMonth` |
| `US-001` | Depends on | Nền tảng Prisma/SQLite đã có sẵn |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk npx prisma validate` | Passed | 2026-08-14 |
| `rtk tsc --noEmit` (sau khi sinh Prisma Client cho `PurchaseItem`) | Passed — "No errors found" | 2026-08-14 |
| `rtk tsc --noEmit` (sau khi triển khai xong toàn bộ use-case/UI) | Passed — "No errors found" | 2026-08-19 |
| `rtk next build` | Passed — "Errors: 0 \| Warnings: 0" | 2026-08-19 |
| Thủ công — đủ 10 AC qua Browser tool trên `localhost:3000/budget` | Passed — chi tiết từng AC xem `docs/features/US-019-danh-sach-can-mua/task.md` `TB-08`; không có lỗi console trình duyệt, không có lỗi server | 2026-08-19 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Client (`new Date()` trình duyệt) và server (`new Date()` server) tính "tháng hiện tại" lệch nhau nếu đồng hồ hai bên khác nhau | Thấp | Server luôn là nơi chặn thật (throw lỗi); UI chỉ dùng để quyết định hiển thị — không có rủi ro sai dữ liệu, chỉ có thể lệch trải nghiệm hiển thị nút bấm |
| `transferPendingToMonth` chạy dù bước tạo tháng phía trước thất bại | Trung bình | Đặt lệnh gọi `transferPendingToMonth` sau dòng `monthBudgetRepository.create` (đã ném lỗi nếu trùng kỳ) trong cùng use-case — lỗi phía trước dừng hàm sớm, không tới được bước chuyển item |
