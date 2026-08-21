# Chặn trùng tên danh mục — SE Plan

Status: Implemented
Feature: US-010
Spec: spec.md
Created: 2026-08-10
Updated: 2026-08-10
DEV Wiki: `docs/kb/dev/wiki/US-010-chan-trung-ten-danh-muc.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Thêm một domain rule thuần (`category-name-rule.ts`) kiểm tra tên danh mục mới (đã chuẩn hóa: trim, lowercase, rút gọn khoảng trắng lặp ở giữa) có trùng với tên của một danh mục khác (không phải `isFallback`, không phải chính nó) trong cùng `monthId` không. Gọi rule này ngay trong use-case `upsert-category.ts` — dùng chung cho cả hai nhánh tạo mới (`addCategory`) và cập nhật (`commitCategory` khi sửa tên), vì cả hai đều đi qua đúng một use-case `upsertCategory`. Không thêm bounded context mới, không đổi Prisma schema — kiểm tra thực hiện bằng cách gọi `categoryRepository.findByMonth(monthId)` (đã có sẵn) rồi so sánh ở tầng ứng dụng.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-010-chan-trung-ten-danh-muc/spec.md` | Nguồn yêu cầu — mục 3, 6, 7, 9, 10, 13 |
| `docs/kb/ba/wiki/knowledge/feature/US-010-chan-trung-ten-danh-muc.md` | Business rule `BR-017`, phụ thuộc |
| `docs/kb/dev/wiki/US-005-rang-buoc-toan-ven-danh-muc.md` | Cấu trúc bounded context `budget` hiện tại, chỗ dùng `Category.isFallback` |
| `components/BudgetApp.tsx` (dòng 359-416, 953-1010) | Hành vi hiện tại của `commitCategory`, `addCategory`, ô nhập tên, nút "Thêm danh mục" |
| `server/budget/actions.ts` | Composition root — cách `upsertCategory` được nối từ use-case tới Server Action |
| `server/budget/application/use-cases/upsert-category.ts` | Use-case hiện tại — validation đã có, chỗ cần thêm điều kiện mới |
| `server/budget/application/use-cases/create-month.ts` | Mẫu quy ước: mỗi use-case tự định nghĩa một class lỗi riêng kế thừa `Error` (ví dụ `CreateMonthError`), throw message tiếng Việt rõ ràng |
| `server/budget/domain/rules/transaction-input-rule.ts` | Mẫu quy ước: domain rule thuần, tự có `Error` riêng, không gọi repository |
| `server/budget/domain/repositories/category-repository.ts` | Xác nhận `findByMonth(monthId)` đã có sẵn, không cần thêm method |
| `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Xác nhận `findByMonth` là `findMany({ where: { monthId } })` đơn giản, không lọc gì thêm |
| `server/budget/domain/entities/category.ts` | Xác nhận field `name`, `isFallback` đã có sẵn trên entity |
| `components/shared/Toast.tsx` | Xác nhận cơ chế toast dùng lại được nguyên vẹn, không cần sửa |
| `prisma/schema.prisma` | Xác nhận `Category` không cần field/index mới |
| `docs/db/schema.dbml` | Xác nhận không cần cập nhật DBML |
| `package.json` | Xác nhận chưa có framework test cài đặt (gap đã biết, không thuộc phạm vi US-010) |

## 3. Hành Vi Hiện Tại

- Nút "Thêm danh mục" (`components/BudgetApp.tsx:401-404`, hàm `addCategory`) gọi thẳng `upsertCategory({ monthId, name: "Danh mục mới", type: "Linh hoạt", budget: 0 })`, không bọc `try/catch` — lỗi ném ra sẽ không được xử lý, không có toast.
- Sửa tên (ô nhập tại `components/BudgetApp.tsx:962`) gọi `updateCategoryLocal` khi gõ (chỉ đổi state cục bộ), rồi `commitCategory(id)` khi rời ô nhập (`onBlur`, dòng 372-383) — cũng không bọc `try/catch`.
- `upsertCategory` (`server/budget/application/use-cases/upsert-category.ts`) hiện chỉ kiểm: tên/loại không rỗng, ngân sách là số không âm, và (khi sửa) danh mục không phải `isFallback`. Không có bước kiểm tra trùng tên với danh mục khác trong cùng tháng.
- `categoryRepository.findByMonth(monthId)` đã tồn tại và trả về toàn bộ danh mục của một tháng, không lọc gì — dùng được ngay để lấy danh sách so trùng.

## 4. Hành Vi Mục Tiêu

- `upsertCategory` kiểm tra tên (đã chuẩn hóa: trim, lowercase, rút gọn khoảng trắng lặp ở giữa — `DEC-022`, `DEC-069`) có trùng với tên đã chuẩn hóa của một danh mục khác trong cùng `monthId` không, loại trừ chính danh mục đang sửa (theo `id`) và loại trừ danh mục `isFallback` ("Chi tiêu khác" — `DEC-027`). Trùng → ném lỗi mới, không tạo/sửa gì trong Prisma.
- Cả hai nhánh gọi `upsertCategory` — `addCategory` (thêm mới, tên mặc định "Danh mục mới") và `commitCategory` (sửa tên qua ô nhập) — đều tự động được bảo vệ vì cùng đi qua một use-case, đúng `DEC-068` (áp dụng luôn cho tên mặc định).
- `components/BudgetApp.tsx`: `addCategory` và `commitCategory` bọc `try/catch` theo đúng mẫu đã có ở `createNewMonth` (dòng 423-436) — bắt lỗi, gọi `setToastMessage(error.message)`, rồi `refreshSnapshot()` để đồng bộ lại từ server (ô nhập tự "trở lại tên trước khi sửa" vì state được nạp lại từ snapshot thật, không cần code riêng để revert).

## 5. Luồng End-To-End

```text
[Sửa tên danh mục — AC-01, AC-03, AC-04, AC-05, AC-06, AC-07]
components/BudgetApp.tsx (ô nhập, onBlur) -> commitCategory(id)
  -> try { server/budget/actions.ts#upsertCategory({ id, monthId, name, type, budget }) }
       -> application/use-cases/upsert-category.ts
            -> domain/repositories/category-repository.ts#findById (đã có — kiểm isFallback khi sửa)
            -> domain/repositories/category-repository.ts#findByMonth (đã có — lấy danh sách so trùng, MỚI dùng ở đây)
            -> domain/rules/category-name-rule.ts#assertCategoryNameNotDuplicate (MỚI — ném DuplicateCategoryNameError nếu trùng)
            -> domain/repositories/category-repository.ts#update (chỉ chạy khi không trùng)
       -> infrastructure/repositories/category-prisma-repository.ts -> lib/prisma.ts -> SQLite
       -> revalidatePath("/budget")
  -> catch (lỗi) { setToastMessage(error.message); refreshSnapshot() }
  -> refreshSnapshot() (khi thành công) -> getBudgetSnapshot() -> setMonths(...) -> UI vẽ lại

[Thêm danh mục — AC-02]
components/BudgetApp.tsx (nút "Thêm danh mục") -> addCategory()
  -> try { actions.ts#upsertCategory({ monthId, name: "Danh mục mới", type: "Linh hoạt", budget: 0 }) }
       -> application/use-cases/upsert-category.ts
            -> domain/repositories/category-repository.ts#findByMonth (MỚI dùng ở đây)
            -> domain/rules/category-name-rule.ts#assertCategoryNameNotDuplicate (MỚI)
            -> domain/repositories/category-repository.ts#create (chỉ chạy khi không trùng)
       -> infrastructure -> Prisma -> SQLite -> revalidatePath("/budget")
  -> catch (lỗi) { setToastMessage(error.message); refreshSnapshot() }
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-001` (`Category` model, `name` field) | `prisma/schema.prisma` dòng 28-39 — đã Implemented | Không | Đã sẵn sàng |
| `US-005` (`Category.isFallback`, `findFallbackByMonth`) | `prisma/schema.prisma` dòng 34, `category-repository.ts` dòng 20 — đã Implemented | Không | Đã sẵn sàng |

Không có task nào của US-010 phải chờ requirement khác chưa triển khai.

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | Không đổi route, không đổi layout |
| Server Action | Yes | `upsertCategory` (trong `server/budget/actions.ts`) giữ nguyên signature `UpsertCategoryInput` → `CategoryEntity`, nhưng thêm một điều kiện lỗi mới (`DuplicateCategoryNameError`) |
| Route Handler (`app/api`) | N/A | Dự án không dùng Route Handler cho luồng này |
| Auth / middleware / permission | N/A | Single-user, không có auth (`DEC-004`) |
| Prisma schema | No | Không thêm field/model/index |
| Migration SQLite | No | Không cần |
| DBML | No | Không cần cập nhật `docs/db/schema.dbml` |
| Seed data | No | Không đổi seed |
| Caching / revalidate | No | Vẫn `revalidatePath("/budget")` như hiện tại, chỉ chạy khi không lỗi |
| Export / báo cáo | No | Ngoài phạm vi (spec mục 4, 9) |
| Mail / webhook / job nền | No | Không liên quan |
| Knowledge base / memory | Yes | BA wiki (`BR-017`), `decisions.md` (`DEC-068`, `DEC-069`), `judgement-log.md` (`JDG-014`) đã cập nhật ở stage `ba`; DEV wiki mới tạo ở stage này |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry (UI) | `components/BudgetApp.tsx` | Bọc `try/catch` quanh lệnh gọi `upsertCategory` trong `commitCategory` (dòng ~372-383) và `addCategory` (dòng ~401-404); lỗi → `setToastMessage(error.message)` rồi `refreshSnapshot()`, theo đúng mẫu `createNewMonth` (dòng 423-436) |
| Application (use-case) | `server/budget/application/use-cases/upsert-category.ts` | Sau bước validate hiện có, gọi `repository.findByMonth(input.monthId)` rồi `assertCategoryNameNotDuplicate(name, siblings, input.id)` trước khi `create`/`update` |
| Domain rule (mới) | `server/budget/domain/rules/category-name-rule.ts` | File mới — export `normalizeCategoryName(name)`, `assertCategoryNameNotDuplicate(name, siblings, excludeId?)`, `DuplicateCategoryNameError` |
| Repository interface (domain) | `server/budget/domain/repositories/category-repository.ts` | Không đổi — `findByMonth` đã có sẵn |
| Repository implementation (infrastructure) | `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Không đổi |
| Data | `prisma/schema.prisma` | Không đổi |
| Consumer | Không có — `upsertCategory` chỉ được `components/BudgetApp.tsx` gọi | Không ảnh hưởng nơi khác |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

`categoryRepository.findByMonth(monthId)` đã tồn tại và trả về toàn bộ danh mục của một tháng (bao gồm `name`, `isFallback`) — đủ để so sánh ở tầng ứng dụng trước khi ghi. Không cần thêm cột, index, hay ràng buộc `UNIQUE` ở tầng Prisma/SQLite vì so sánh phải qua bước chuẩn hóa (lowercase, rút gọn khoảng trắng) mà một `UNIQUE` index thô trên cột `name` không làm được.

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `upsertCategory(input)` — trả về `CategoryEntity` (bất đồng bộ) | Ném `UpsertCategoryError` khi tên/loại rỗng, ngân sách âm, hoặc sửa danh mục `isFallback` | Thêm: ném `DuplicateCategoryNameError` (cũng là `Error`, client xử lý y như các lỗi khác qua `error.message`) khi tên (đã chuẩn hóa) trùng với danh mục khác cùng tháng | Không — chỉ thêm một điều kiện lỗi mới, signature và các trường hợp lỗi cũ giữ nguyên |

Nội dung thông báo lỗi dùng một mẫu chung cho cả hai luồng (thêm mới và sửa tên), nội suy tên thật của danh mục vào chỗ trống, ví dụ khi tên là "Danh mục mới": `Tên danh mục "Danh mục mới" đã tồn tại trong tháng này. Vui lòng đổi tên khác.` — đáp ứng đúng nội dung quan sát được yêu cầu ở AC-01 (nêu rõ tên trùng, yêu cầu đổi tên) và AC-02 (nêu rõ tên "Danh mục mới" đã tồn tại, yêu cầu đổi tên); không cần hai chuỗi lỗi riêng biệt vì cả hai đi qua đúng một điều kiện kiểm tra.

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `server/budget/domain/rules/category-name-rule.ts` | **Tạo mới.** `normalizeCategoryName(name)` — trim, lowercase, rút gọn khoảng trắng lặp ở giữa bằng `replace(/\s+/g, " ")`. `assertCategoryNameNotDuplicate(name, siblings, excludeId?)` — ném `DuplicateCategoryNameError` nếu có `sibling` nào (khác `excludeId`, `isFallback === false`) có tên chuẩn hóa trùng. `DuplicateCategoryNameError extends Error`. |
| `server/budget/application/use-cases/upsert-category.ts` | Import rule mới. Sau khối validate hiện có (dòng 19-36), thêm: `const siblings = await repository.findByMonth(input.monthId); assertCategoryNameNotDuplicate(name, siblings, input.id);` — chạy trước dòng gọi `create`/`update` (dòng 38-40). |
| `components/BudgetApp.tsx` | `commitCategory`: bọc thân hàm hiện tại trong `try`, thêm `catch (error) { setToastMessage(error instanceof Error ? error.message : "Có lỗi xảy ra, vui lòng thử lại."); await refreshSnapshot(); }`. `addCategory`: áp dụng đúng mẫu try/catch tương tự. |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng |
| --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | Passed — 0 lỗi (2026-08-10) |
| Prisma | `rtk npx prisma validate` | Passed — hợp lệ, không đổi (2026-08-10) |
| Test | `rtk vitest run` | Chưa có framework test cài đặt trong `package.json` (gap đã biết từ US-001/US-004/US-005) — thay bằng kiểm chứng thủ công đủ 7 AC |
| Build | `rtk next build` | `rtk next build` trả exit 1 dù in "Errors: 0 \| Warnings: 0" — quirk của wrapper `rtk`, không phải lỗi thật; xác nhận lại bằng `npx next build` trực tiếp → exit 0, Errors: 0, Warnings: 0 (2026-08-10). Kết luận: Passed |
| Thủ công — AC-01 | Sửa tên một danh mục thành tên đã trùng (khác hoa/thường, khoảng trắng thừa đầu) với danh mục khác cùng tháng | Passed — server log đúng message, ô nhập trở lại tên cũ (xác nhận qua reload cứng) |
| Thủ công — AC-02 | Bấm "Thêm danh mục" khi đã có một danh mục tên "Danh mục mới" chưa đổi | Passed — không có dòng mới; toast xác nhận trực tiếp qua DOM đúng nội dung |
| Thủ công — AC-03 | Bấm vào ô nhập tên một danh mục, không đổi ký tự, rời ô nhập | Passed — POST 200 sạch, không lỗi |
| Thủ công — AC-04 | Sửa tên một danh mục thành tên chưa tồn tại trong tháng | Passed — lưu bền vững, xác nhận qua reload cứng |
| Thủ công — AC-05 | Đổi tên một danh mục ở tháng A thành tên đã tồn tại ở tháng B (khác tháng) | Passed — lưu bền vững, không bị chặn, xác nhận qua reload cứng |
| Thủ công — AC-06 | Tháng chỉ có một danh mục duy nhất, sửa tên nó | Không dựng lại bằng UI (tránh tạo/xóa tháng thêm trong `dev.db`) — xác nhận bằng đọc code: `siblings` rỗng sau loại trừ `excludeId` → `Array.prototype.some` luôn `false` |
| Thủ công — AC-07 | Sửa tên một danh mục thành tên có hai khoảng trắng liền giữa hai từ, trùng (sau chuẩn hóa) với danh mục khác | Passed — server log xác nhận rút gọn khoảng trắng đúng, chặn như AC-01 |
| Thủ công (phòng thủ) — điều kiện lỗi cũ của `upsertCategory` | Xóa trắng tên một danh mục; nhập ngân sách âm | Passed cho tên rỗng (không tạo được danh mục tên rỗng); ngân sách âm bị `safeNumber()` ở client kẹp về 0 trước khi gửi — hành vi có từ trước US-010, không phải lỗi mới |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| `commitCategory`/`addCategory` trước đây không có `try/catch` — lỗi ném ra trước đây có thể đã bị một error boundary mặc định của Next.js nuốt âm thầm hoặc làm crash một phần UI; thêm `try/catch` thay đổi hành vi lỗi hiện có (kể cả lỗi không liên quan tới trùng tên, ví dụ ngân sách âm) | Thấp | Test thủ công cả đường lỗi cũ (tên rỗng, ngân sách âm) sau khi thêm `try/catch`, xác nhận vẫn hiện toast đúng như 3 điều kiện lỗi cũ của `upsertCategory` | Bỏ `try/catch` mới thêm, quay lại hành vi không bắt lỗi như trước |
| Thêm `findByMonth` vào mỗi lần gọi `upsertCategory` tăng một lượt truy vấn DB | Thấp | Bảng `Category` của một tháng rất nhỏ (vài chục dòng tối đa), không ảnh hưởng hiệu năng đáng kể | Không cần — chấp nhận chi phí nhỏ này |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Domain rule `category-name-rule.ts` tạo mới, kiểm tra chuẩn hóa đúng (đơn vị: trim, lowercase, rút gọn khoảng trắng giữa) | Done |
| `TB-02` | `upsert-category.ts` gọi rule mới trước khi ghi, không đổi 3 validation cũ | Done |
| `TB-03` | `components/BudgetApp.tsx` — `commitCategory` và `addCategory` có `try/catch`, toast đúng nội dung | Done |
| `TB-04` | Verification tổng hợp (typecheck, build, prisma validate, đủ 7 AC thủ công trên `next dev`), cập nhật DEV wiki với kết quả thật | Done |

Readiness: Ready — toàn bộ 4 task đã `Done`, xem evidence chi tiết ở `task.md`.
