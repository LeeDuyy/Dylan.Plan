# Ràng buộc toàn vẹn danh mục + giao dịch không danh mục — Phân Rã Task

Status: Implemented
Feature: US-005
Plan: plan.md
Spec: spec.md
Created: 2026-08-06
Updated: 2026-08-06
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 6 tiêu chí chấp nhận (AC-01..AC-06), Screen Element EL-01..EL-04 |
| `plan.md` | Mục 7 (Impact Checklist), mục 8 (Bản Đồ Source Impact), mục 10 (Contract), mục 11 (File Sẽ Thay Đổi), mục 14 (Phân Rã Task đề xuất) |
| `data-model.md` | Field `Category.isFallback` đã `Applied` — migration `20260806083443_add_category_is_fallback` đã chạy, DBML đã đồng bộ |

## 2. Breakdown Summary

- Phạm vi: Thêm danh mục dự phòng "Chi tiêu khác" (phân biệt bằng `Category.isFallback`) — xóa danh mục có giao dịch chuyển giao dịch sang đó thay vì lỗi; ghi nhận nhanh cho phép bỏ qua chọn danh mục; chặn sửa danh mục dự phòng; ẩn khỏi UI khi hết giao dịch; loại trừ khi sao chép tháng.
- Phụ thuộc chặn: Không — `US-001`/`US-003`/`US-004` đã Delivered, `ssr-data` đã áp dụng migration trước khi task này chạy (`TB-01` coi như Done).
- Số task: 12
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | `Category.isFallback Boolean @default(false)` có trong schema, migration đã áp dụng, DBML đã đồng bộ | `prisma/schema.prisma`, `prisma/migrations/20260806083443_add_category_is_fallback/`, `docs/db/schema.dbml` | None | Plan mục 9 | `rtk npx prisma validate`, `rtk tsc --noEmit` | Done | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/data-model.md` mục 7 — cả hai lệnh Passed 2026-08-06 |
| `TB-02` | `CategoryEntity` có `isFallback`; `CategoryRepository` có `findFallbackByMonth`, `CreateCategoryInput.isFallback?`; `TransactionRepository` có `countByCategory`, `reassignCategory` | `server/budget/domain/entities/category.ts`, `server/budget/domain/repositories/category-repository.ts`, `server/budget/domain/repositories/transaction-repository.ts` | `TB-01` | Plan mục 8 (Domain repository) | `rtk tsc --noEmit` | Done | Passed — 0 lỗi, 2026-08-06 |
| `TB-03` | Domain service `fallback-category-service.ts` — `getOrCreate(monthId)` trả về "Chi tiêu khác" hiện có hoặc tự tạo (Loại "Linh hoạt", Ngân sách 0đ, `locked=true`, `isFallback=true`) | `server/budget/domain/services/fallback-category-service.ts` (mới) | `TB-02` | BR-009, DEC-056, DEC-057 | `rtk tsc --noEmit` | Done | Passed — 0 lỗi, 2026-08-06 |
| `TB-04` | `remove-category.ts`: đếm giao dịch của danh mục, chuyển sang "Chi tiêu khác" (qua `TB-03`) nếu còn giao dịch, xóa danh mục gốc, trả `{ deletedName, movedCount }` hoặc `null` nếu đã không còn tồn tại | `server/budget/application/use-cases/remove-category.ts` | `TB-02`, `TB-03` | AC-01, AC-02, AC-06; Contract `removeCategory` | `rtk tsc --noEmit` | Done | Passed — 0 lỗi, 2026-08-06 |
| `TB-05` | `record-quick-transaction.ts`: `categoryId` optional, tự lấy/tạo "Chi tiêu khác" (qua `TB-03`) khi trống | `server/budget/application/use-cases/record-quick-transaction.ts` | `TB-03` | AC-03; Contract `recordQuickTransaction` | `rtk tsc --noEmit` | Done | Passed — 0 lỗi, 2026-08-06 |
| `TB-06` | `upsert-category.ts` ném lỗi khi `id` trỏ tới danh mục `isFallback`; `create-month.ts` lọc bỏ danh mục `isFallback` khỏi `sourceCategories` khi sao chép tháng | `server/budget/application/use-cases/upsert-category.ts`, `server/budget/application/use-cases/create-month.ts` | `TB-02` | AC-04; Contract `upsertCategory`; `JDG-010` | `rtk tsc --noEmit` | Done | Passed — 0 lỗi, 2026-08-06 |
| `TB-07` | Hai repository Prisma hiện thực đủ các phương thức mới (`findFallbackByMonth`, `countByCategory`, `reassignCategory`) và map `isFallback` hai chiều | `server/budget/infrastructure/repositories/category-prisma-repository.ts`, `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | `TB-02` | Plan mục 8 (Repository implementation) | `rtk tsc --noEmit` | Done | Passed — 0 lỗi, 2026-08-06 |
| `TB-08` | `server/budget/actions.ts` khởi tạo `fallbackCategoryService`, nối dep mới vào `removeCategory`/`recordQuickTransaction`, export `RemoveCategoryResult` | `server/budget/actions.ts` | `TB-03`, `TB-04`, `TB-05`, `TB-07` | Plan mục 8 (Composition root) | `rtk tsc --noEmit` | Done | Passed — 0 lỗi, 2026-08-06. Ngoài phạm vi liệt kê ban đầu: `legacy-migration-service.ts` (thêm `isFallback: false` khi upsert danh mục di trú — bắt buộc để hết lỗi kiểu), `budget-snapshot-service.ts` (thêm `isFallback` vào `BudgetCategorySnapshot`, đã có trong plan mục 8 "Consumer") |
| `TB-09` | Component `Toast` dùng chung đầu tiên của app; `removeCategory` wrapper trong `BudgetApp.tsx` đọc kết quả trả về và dựng nội dung toast đúng theo `movedCount` | `components/shared/Toast.tsx` (mới), `components/BudgetApp.tsx` | `TB-08` | AC-01, AC-02, AC-06; DEC-054, DEC-012 | `rtk tsc --noEmit`; thủ công trên `next dev` | Done | `rtk tsc --noEmit` Passed 2026-08-06; thủ công xem mục evidence AC-01/AC-02/AC-06 ở `TB-12` |
| `TB-10` | Dropdown "Danh mục nhận diện" có lựa chọn trống, tự động chọn khi nội dung không khớp từ khóa; `addQuickExpense` cho phép gọi với `categoryId` rỗng | `components/BudgetApp.tsx` | `TB-08` | AC-03; EL-01; DEC-055 | `rtk tsc --noEmit`; thủ công trên `next dev` | Done | `rtk tsc --noEmit` Passed 2026-08-06; thủ công xem mục evidence AC-03 ở `TB-12` |
| `TB-11` | Bảng danh mục: ẩn dòng `isFallback` khi `actual === 0`; dòng `isFallback` hiển thị chữ thường (không ô nhập, không nút xóa) khi có giao dịch | `components/BudgetApp.tsx` | `TB-08` | AC-04, AC-05; EL-02, EL-03; DEC-027, DEC-029, DEC-030 | `rtk tsc --noEmit`; thủ công trên `next dev` | Done | `rtk tsc --noEmit` Passed 2026-08-06; áp dụng thêm cho biểu đồ "Chi thực tế theo danh mục" (nhất quán ẩn khỏi mọi nơi hiển thị, không chỉ bảng); thủ công xem mục evidence AC-04/AC-05 ở `TB-12` |
| `TB-12` | Verification tổng hợp: typecheck, build, prisma validate, đủ 6 AC kiểm chứng thủ công trên `next dev`; cập nhật DEV wiki mục 5/7/8 với kết quả thật | `docs/kb/dev/wiki/US-005-rang-buoc-toan-ven-danh-muc.md` | `TB-09`, `TB-10`, `TB-11` | AC-01..AC-06 | `rtk tsc --noEmit`, `rtk next build`, `rtk npx prisma validate`, thao tác thủ công đủ 6 AC | Done | `rtk tsc --noEmit` → 0 lỗi; `rtk next build` → Errors: 0, Warnings: 0; `rtk npx prisma validate` → hợp lệ (không đổi thêm sau `TB-01`). Thủ công trên `next dev` (cổng riêng, tránh đụng dev server khác đang chạy cùng `dev.db`): AC-01 xóa "Di chuyển" (2 giao dịch) → toast "Đã xóa 'Di chuyển'. 2 giao dịch đã chuyển sang Chi tiêu khác.", "Chi tiêu khác" xuất hiện Loại Linh hoạt/Ngân sách 0đ/Chi thực tế 30.000đ đúng tổng; AC-02 xóa "Tiết kiệm / đầu tư" (0 giao dịch) → toast "Đã xóa 'Tiết kiệm / đầu tư'." không nhắc Chi tiêu khác; AC-03 gõ nội dung không khớp từ khóa nào → dropdown về "— Chưa xác định —" (`select.value === ""`), bấm "Ghi nhận" (nút không bị disabled) → giao dịch gắn "Chi tiêu khác" mới, Chi thực tế 200.000đ đúng; AC-04 dòng "Chi tiêu khác" xác nhận qua DOM: `hasInput=false`, `hasDeleteButton=false`; AC-05 xóa giao dịch duy nhất của "Chi tiêu khác" → dòng biến mất khỏi bảng ngay (`bodyIncludesFallback=false` sau khi xóa); AC-06 xóa "Giải trí / cafe / trà sữa" (1 giao dịch) khi "Chi tiêu khác" đã có sẵn 30.000đ → toast đúng, chỉ 1 dòng "Chi tiêu khác" duy nhất (không tạo bản ghi mới), Chi thực tế cộng dồn thành 75.000đ. Finding phát sinh (Low, không thuộc phạm vi sửa của US-005): ví dụ trong spec AC-03 "sửa xe máy 200k" thực ra khớp từ khóa "xe" của danh mục "Di chuyển" (`lib/budget-defaults.ts`, so khớp kiểu substring có từ US-001) nên không tái hiện đúng như mô tả — đã dùng câu khác ("mua quà sinh nhật 200k") để kiểm chứng đúng hành vi AC-03; đề xuất `ssr-ba` đổi ví dụ trong một lượt sau. |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — `TB-01` (đã Done, thực hiện ở stage `data`).
- Cập nhật BA/DEV function wiki — DEV wiki đã tạo ở stage `plan`; `TB-12` cập nhật lại với kết quả triển khai thật.
- Cập nhật memory — `DEC-058`, `JDG-010` đã ghi ở stage `plan`; không phát sinh quyết định mới ở breakdown này.
- Verification cuối — `TB-12`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 | `TB-02`, `TB-03`, `TB-04`, `TB-07`, `TB-08`, `TB-09`, `TB-12` | Xóa danh mục có giao dịch, tháng chưa có "Chi tiêu khác" |
| AC-02 | `TB-04`, `TB-09`, `TB-12` | Xóa danh mục không có giao dịch |
| AC-03 | `TB-03`, `TB-05`, `TB-07`, `TB-08`, `TB-10`, `TB-12` | Ghi nhận nhanh không chọn danh mục |
| AC-04 | `TB-06`, `TB-11`, `TB-12` | Dòng "Chi tiêu khác" hiển thị chỉ đọc |
| AC-05 | `TB-11`, `TB-12` | Ẩn dòng khi hết giao dịch — dùng thao tác xóa giao dịch có sẵn của `US-004`, không cần task use-case riêng |
| AC-06 | `TB-03`, `TB-04`, `TB-12` | Gộp vào "Chi tiêu khác" đã tồn tại sẵn, không tạo bản ghi mới |
| Contract `removeCategory` (plan mục 10) | `TB-04`, `TB-08`, `TB-09` | Đổi kiểu trả về |
| Contract `recordQuickTransaction` (plan mục 10) | `TB-05`, `TB-08`, `TB-10` | `categoryId` optional |
| Contract `upsertCategory` (plan mục 10) | `TB-06` | Chặn sửa danh mục `isFallback` |
| Prisma schema / Migration SQLite / DBML (impact checklist) | `TB-01` | Đã Done |
| Server Action (impact checklist) | `TB-08` | `removeCategory`, `recordQuickTransaction` đổi chữ ký |
| Caching / revalidate (impact checklist) | `TB-04`, `TB-05` | Tiếp tục `revalidatePath("/budget")` như hiện có |
| Knowledge base / memory (impact checklist) | `TB-01` (đã ghi `DEC-058`, `JDG-010` ở stage `plan`), `TB-12` (cập nhật DEV wiki cuối) | |

## 5. Thứ Tự Dependency

1. `TB-01` (Done)
2. `TB-02`
3. `TB-03`, `TB-06`, `TB-07` (song song, đều chỉ phụ thuộc `TB-02`)
4. `TB-04`, `TB-05` (phụ thuộc `TB-03`; `TB-04` phụ thuộc thêm `TB-02`)
5. `TB-08` (phụ thuộc `TB-03`, `TB-04`, `TB-05`, `TB-07`)
6. `TB-09`, `TB-10`, `TB-11` (song song, đều chỉ phụ thuộc `TB-08`)
7. `TB-12`

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task.
- [x] Mọi tiêu chí chấp nhận đều map tới ít nhất một task.
- [x] Dependency có thứ tự và không vòng lặp.
- [x] Mỗi task có cách verification riêng.
- [x] Cập nhật knowledge base, memory và verification cuối là task tường minh.
- [x] Không task nào gộp các thay đổi cần verify độc lập.
- [x] Không task nào cần đọc source mới hiểu được kết quả mong đợi.

## 7. Blocker Và Câu Hỏi Mở

- Không có.
