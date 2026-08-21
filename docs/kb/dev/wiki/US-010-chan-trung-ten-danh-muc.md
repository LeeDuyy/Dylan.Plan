---
status: Active
feature: US-010
updated: 2026-08-10
plan: docs/features/US-010-chan-trung-ten-danh-muc/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-010-chan-trung-ten-danh-muc.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-010", "Chặn trùng tên danh mục (DEV)"]
---

# US-010 — Chặn trùng tên danh mục (DEV)

## 1. Tổng Quan Kỹ Thuật

Mở rộng use-case `upsertCategory` (bounded context `budget`, đã có từ US-001/US-005) với một domain rule thuần mới (`category-name-rule.ts`) kiểm tra trùng tên trong cùng tháng trước khi ghi. Không thêm bounded context, không đổi Prisma schema — tận dụng `categoryRepository.findByMonth(monthId)` đã có sẵn để lấy danh sách so trùng. Dùng chung đúng một use-case cho cả hai luồng UI (nút "Thêm danh mục" và ô sửa tên), nên chỉ cần sửa một chỗ ở tầng application.

## 2. Luồng End-To-End

```text
components/BudgetApp.tsx (commitCategory | addCategory) -> [không auth, single-user]
  -> server/budget/actions.ts#upsertCategory -> application/use-cases/upsert-category.ts
       -> domain/repositories/category-repository.ts (findById khi sửa, findByMonth — MỚI dùng ở đây)
       -> domain/rules/category-name-rule.ts (MỚI — assertCategoryNameNotDuplicate)
       -> domain/repositories/category-repository.ts (create | update, chỉ khi không trùng)
  -> infrastructure/repositories/category-prisma-repository.ts -> lib/prisma.ts -> SQLite
  -> revalidatePath("/budget") -> client setToastMessage khi lỗi, refreshSnapshot() cả hai nhánh
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — `commitCategory` (sửa tên, onBlur), `addCategory` (nút "Thêm danh mục") |
| Auth | Không áp dụng | Single-user (`DEC-004`) |
| Application | `upsert-category.ts` | Thêm bước kiểm tra trùng tên trước khi tạo/sửa |
| Domain | `domain/rules/category-name-rule.ts` (mới) | `BR-017` — chuẩn hóa và so trùng tên trong cùng tháng |
| Infrastructure | `category-prisma-repository.ts` | Không đổi — chỉ gọi thêm `findByMonth` đã có sẵn |
| Data | `prisma/schema.prisma` | Không đổi |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Component | `components/BudgetApp.tsx` | Bọc `try/catch` quanh `upsertCategory` ở cả `commitCategory` và `addCategory`, hiện toast khi lỗi |
| Use-case (Application) | `server/budget/application/use-cases/upsert-category.ts` | Gọi `findByMonth` + rule mới trước khi ghi |
| Domain rule (mới) | `server/budget/domain/rules/category-name-rule.ts` | `normalizeCategoryName`, `assertCategoryNameNotDuplicate`, `DuplicateCategoryNameError` |
| Repository (Infrastructure) | `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Không đổi — `findByMonth` đã hiện thực sẵn |

## 4. Prisma Schema Và Migration

Không có thay đổi. `Category` giữ nguyên các field đã có từ US-001 (`name`, `type`, `budget`) và US-005 (`isFallback`).

- Migration liên quan: Không có
- DBML đã đồng bộ: Không cần — không đổi schema
- Lưu ý SQLite: Không áp dụng

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `upsertCategory(input)` | Thêm điều kiện lỗi mới: ném `DuplicateCategoryNameError` (kế thừa `Error`) khi tên đã chuẩn hóa (`normalizeCategoryName` — trim, lowercase, rút gọn khoảng trắng lặp giữa) trùng với danh mục khác (không phải `isFallback`, không phải chính nó) trong cùng `monthId`. Message nội suy tên thật vào chỗ trống, ví dụ: `Tên danh mục "Danh mục mới" đã tồn tại trong tháng này. Vui lòng đổi tên khác.` — dùng chung cho cả thêm mới và sửa tên. Signature không đổi | `components/BudgetApp.tsx` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| US-001 | Depends on | `server/budget/**`, `Category` model |
| US-005 | Depends on | `Category.isFallback`, `findFallbackByMonth` — dùng để loại trừ "Chi tiêu khác" khỏi kiểm tra trùng tên |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — 0 lỗi | 2026-08-10 |
| `rtk npx prisma validate` | Passed — hợp lệ, không đổi | 2026-08-10 |
| `rtk next build` / `npx next build` | `rtk next build` trả exit 1 dù in "Errors: 0 \| Warnings: 0" (quirk wrapper); xác nhận lại bằng `npx next build` trực tiếp → exit 0, Errors: 0, Warnings: 0. Kết luận Passed | 2026-08-10 |
| `rtk vitest run` | Chưa có framework test cài đặt trong `package.json` (gap đã biết) | 2026-08-10 |
| Thủ công đủ 7 AC trên `next dev` | Passed — AC-01/AC-02/AC-07 (chặn trùng tên, kể cả tên mặc định và khoảng trắng lặp giữa) xác nhận qua server log + toast thật; AC-03/AC-04/AC-05 (không trùng, giữ nguyên tên, khác tháng) xác nhận lưu bền vững qua reload cứng; AC-06 xác nhận bằng đọc code (siblings rỗng). Chi tiết đầy đủ ở `docs/features/US-010-chan-trung-ten-danh-muc/task.md` `TB-04` | 2026-08-10 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Thêm `try/catch` vào `commitCategory`/`addCategory` (trước đây không có) thay đổi cách lỗi hiện có (tên rỗng, ngân sách âm) hiển thị — trước đây có thể bị nuốt âm thầm | Thấp | Bỏ `try/catch` mới thêm, quay lại hành vi cũ |
| Thêm một lượt gọi `findByMonth` mỗi lần `upsertCategory` | Thấp | Không cần rollback — bảng `Category` mỗi tháng rất nhỏ |

Finding phát sinh khi verify (Low, không thuộc phạm vi sửa của US-010):

- `rtk next build` trả exit code 1 dù in "Errors: 0 \| Warnings: 0" — chạy trực tiếp `npx next build` (bỏ qua wrapper `rtk`) cho exit 0, đúng "Errors: 0, Warnings: 0". Là quirk của wrapper `rtk`, không phải lỗi build thật. Không thuộc phạm vi sửa của US-010.
- Điều kiện lỗi cũ "Ngân sách danh mục phải là số không âm" (`UpsertCategoryError` trong `upsert-category.ts`) không thể kích hoạt được từ UI hiện tại, vì `safeNumber()` ở `components/BudgetApp.tsx` đã kẹp giá trị âm về 0 ngay khi gõ (`Math.max(0, value)`), trước khi gửi lên server. Hành vi này có từ trước US-010, không phải lỗi phát sinh từ thay đổi này.
