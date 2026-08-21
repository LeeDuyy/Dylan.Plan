# Ràng buộc toàn vẹn danh mục + giao dịch không danh mục — SE Plan

Status: Implemented
Feature: US-005
Spec: spec.md
Created: 2026-08-06
Updated: 2026-08-06
DEV Wiki: `docs/kb/dev/wiki/US-005-rang-buoc-toan-ven-danh-muc.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Mở rộng bounded context `budget` (đã có từ US-001/US-003/US-004) với một khái niệm mới: danh mục dự phòng ("Chi tiêu khác") được phân biệt bằng field mới `Category.isFallback`, không chỉ dựa vào `locked` (vốn dùng chung với "Tiền nhà"/"Chi phí cố định khác" — hai danh mục này vẫn cho sửa tên/loại/ngân sách, chỉ chặn xóa). Ba thay đổi hành vi chính:

1. `removeCategory` hiện tại xóa thẳng bằng `prisma.category.delete`, sẽ vỡ ràng buộc khóa ngoại `Transaction.categoryId` (`onDelete: Restrict`) nếu danh mục còn giao dịch — đúng khớp gap gốc "xóa danh mục không hoạt động đúng". Thêm bước chuyển giao dịch sang danh mục dự phòng (tự tạo nếu tháng chưa có) trước khi xóa, và trả về số giao dịch đã chuyển để UI dựng nội dung toast.
2. `recordQuickTransaction` hiện bắt buộc `categoryId` hợp lệ. Đổi `categoryId` thành optional — trống thì tự lấy/tạo danh mục dự phòng của tháng.
3. `upsertCategory` hiện không có ràng buộc nào chặn sửa danh mục khóa (kể cả trên UI, ô nhập vẫn hiển thị bình thường cho mọi `locked`). Thêm chặn cứng khi `id` trỏ tới danh mục `isFallback` — không cho sửa tên/loại/ngân sách.

Domain service mới `fallback-category-service.ts` gói quy tắc "tự sinh khi cần" (BR-009), dùng chung bởi cả hai use-case (1) và (2) — đúng tinh thần R13.4 (nghiệp vụ dùng lại ở ≥ 2 nơi thì tách domain service, không lặp lại trong từng use-case).

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md` | Nguồn AC, Screen Element, handoff mục 13 |
| `docs/kb/ba/wiki/knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md` | Đối chiếu mục tiêu, luồng nghiệp vụ |
| `docs/kb/ba/wiki/delivery/pbi/US-005-rang-buoc-toan-ven-danh-muc.md` | Đối chiếu 6 AC |
| `docs/memory/decisions.md` (DEC-023..030, DEC-054..057, DEC-044, DEC-041) | Business rule "Chi tiêu khác", quy ước layout thư mục, quy ước DDD |
| `docs/kb/dev/wiki/US-004-sua-xoa-tung-giao-dich.md` | Kiến trúc bounded context hiện tại, quy ước Contract/Verification |
| `prisma/schema.prisma` | Cấu trúc `Category`, `Transaction`, ràng buộc `onDelete: Restrict` |
| `server/budget/actions.ts` | Composition root, danh sách use-case hiện có |
| `server/budget/application/use-cases/remove-category.ts` | Hành vi xóa danh mục hiện tại (chưa xử lý giao dịch còn lại) |
| `server/budget/application/use-cases/record-quick-transaction.ts` | Hành vi ghi nhận nhanh hiện tại (bắt buộc `categoryId`) |
| `server/budget/application/use-cases/upsert-category.ts` | Hành vi sửa/tạo danh mục hiện tại (không chặn theo `locked`) |
| `server/budget/application/use-cases/create-month.ts` | Luồng sao chép danh mục khi tạo tháng mới — rủi ro nhân bản "Chi tiêu khác" |
| `server/budget/domain/entities/category.ts` | `CategoryEntity` hiện có |
| `server/budget/domain/repositories/category-repository.ts` | Interface cần bổ sung `findFallbackByMonth` |
| `server/budget/domain/repositories/transaction-repository.ts` | Interface cần bổ sung `countByCategory`, `reassignCategory` |
| `server/budget/domain/services/budget-snapshot-service.ts` | Nơi `actual` được tính — cơ sở để ẩn "Chi tiêu khác" khi hết giao dịch |
| `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Cách map field Prisma ↔ `CategoryEntity` |
| `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | Cách hiện thực các hàm truy vấn/ghi hiện có |
| `lib/budget-defaults.ts` | Xác nhận "Chi tiêu khác" không nằm trong `defaultCategories` (đúng DEC-026) |
| `app/budget/page.tsx` | Entry Server Component, gọi `getBudgetSnapshot` |
| `components/BudgetApp.tsx` (dòng 1-100, 140-340, 655-870) | Luồng nhập nhanh, bảng danh mục, chưa có cơ chế toast nào trong toàn app |

## 3. Hành Vi Hiện Tại

- **Xóa danh mục** (`removeCategory` → `RemoveCategoryUseCase`): chỉ kiểm tra `category.locked`, nếu không khóa thì gọi thẳng `prisma.category.delete`. Vì `Transaction.categoryId` có `onDelete: Restrict`, xóa một danh mục đang có giao dịch sẽ ném lỗi ràng buộc khóa ngoại từ Prisma — không có xử lý, không có phản hồi nào cho Dylan. Không có khái niệm danh mục dự phòng.
- **Ghi nhận nhanh** (`recordQuickTransaction`): `categoryId` bắt buộc, không thuộc tháng thì báo lỗi. UI (`BudgetApp.tsx`) luôn có `quickCategory` mang một giá trị (khởi tạo từ `defaultCategories[2]`), dropdown không có lựa chọn trống; khi nội dung không khớp từ khóa nào, `quickCategory` giữ nguyên giá trị cũ thay vì để trống — không có đường nào tạo ra giao dịch "không danh mục" trong thực tế dù `DEC-028` đã chốt về mặt nghiệp vụ.
- **Sửa danh mục** (`upsertCategory`): không có bất kỳ chặn nào theo `locked` — kể cả danh mục khóa hiện tại ("Tiền nhà") cũng gọi được `update` nếu có cách gọi tới (hiện tại UI không chặn ô nhập theo `locked`, chỉ ẩn nút xóa).
- **Bảng danh mục** (`components/BudgetApp.tsx` dòng ~805-859): mọi danh mục hiển thị 3 ô nhập (tên/loại/ngân sách) không điều kiện; nút xóa chỉ ẩn khi `item.locked`.
- **Sao chép tháng** (`createMonth` với `sourceMonthId`): copy nguyên `category.locked` từ tháng nguồn, không có khái niệm loại trừ danh mục dự phòng.
- Toàn ứng dụng (`components/BudgetApp.tsx`, `components/shared/`) **chưa có cơ chế toast** nào — mọi phản hồi hiện tại chỉ là banner di trú tĩnh và `editError` dạng dòng chữ đỏ.

## 4. Hành Vi Mục Tiêu

- Xóa danh mục thường có giao dịch → giao dịch chuyển hết sang danh mục "Chi tiêu khác" (tự tạo nếu tháng chưa có), sau đó xóa danh mục gốc thành công; toast báo tên danh mục + số giao dịch đã chuyển (không có giao dịch nào thì toast chỉ báo đã xóa).
- Ghi nhận nhanh không bắt buộc chọn danh mục: dropdown có thêm lựa chọn trống, tự động chọn trạng thái này khi nội dung không khớp từ khóa nào; bấm "Ghi nhận" ở trạng thái trống vẫn thành công, giao dịch tự vào "Chi tiêu khác".
- "Chi tiêu khác" không cho sửa tên/loại/ngân sách (chặn cả ở UI lẫn server), không cho xóa (đã có sẵn qua `locked`); chỉ hiển thị trên bảng khi đang có ít nhất một giao dịch, tự ẩn khi hết giao dịch (dữ liệu vẫn giữ nguyên).
- Sao chép tháng không bao giờ nhân bản "Chi tiêu khác" sang tháng mới — giữ đúng tinh thần lazy-create của `DEC-026`.

## 5. Luồng End-To-End

```text
[Xóa danh mục]
components/BudgetApp.tsx (nút xóa danh mục)
  -> server/budget/actions.ts#removeCategory()
  -> application/use-cases/remove-category.ts
       -> domain/repositories/category-repository.ts findById/delete
       -> domain/repositories/transaction-repository.ts countByCategory/reassignCategory
       -> domain/services/fallback-category-service.ts getOrCreate() (nếu còn giao dịch)
  -> infrastructure/repositories/category-prisma-repository.ts, transaction-prisma-repository.ts
  -> lib/prisma.ts -> SQLite
  -> revalidatePath("/budget")
  -> client nhận { deletedName, movedCount } -> dựng toast -> refreshSnapshot()

[Ghi nhận nhanh không chọn danh mục]
components/BudgetApp.tsx (ô nhập nhanh, dropdown để trống)
  -> server/budget/actions.ts#recordQuickTransaction({ categoryId: undefined, ... })
  -> application/use-cases/record-quick-transaction.ts
       -> domain/services/fallback-category-service.ts getOrCreate() (khi categoryId trống)
       -> domain/rules/transaction-input-rule.ts (validate ngày/số tiền — tái dùng nguyên vẹn)
       -> domain/repositories/transaction-repository.ts create
  -> infrastructure -> Prisma -> SQLite -> revalidatePath("/budget") -> client refreshSnapshot()

[Chặn sửa "Chi tiêu khác"]
components/BudgetApp.tsx (ẩn hẳn ô nhập khi item.isFallback — không gọi commitCategory)
  -> phòng thủ thêm ở server: application/use-cases/upsert-category.ts kiểm tra
     category.isFallback trước khi update -> throw nếu vi phạm
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component, đã có sẵn — thêm state toast, đổi logic dropdown/bảng |
| Auth | Không áp dụng | Single-user (`DEC-004`) |
| Composition root | `server/budget/actions.ts` | Đổi chữ ký `removeCategory`, `recordQuickTransaction`; thêm khởi tạo `fallbackCategoryService` |
| Application | `remove-category.ts`, `record-quick-transaction.ts`, `upsert-category.ts` | Xem mục 4 |
| Domain service | `fallback-category-service.ts` (mới) | Get-or-create "Chi tiêu khác" theo tháng (BR-009) |
| Domain repository | `category-repository.ts`, `transaction-repository.ts` | Thêm phương thức mới (mục 8) |
| Data | `prisma/schema.prisma` | Thêm field `Category.isFallback` — việc của `ssr-data` |

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-001` (data model bền vững) | `prisma/schema.prisma`, `docs/features/US-001-.../report.md` (Delivered With Notes) | Không | Đã xong, dùng lại nguyên trạng |
| `US-003` (liên kết giao dịch theo ID) | `server/budget/domain/repositories/transaction-repository.ts` (`categoryId` là khóa ngoại thật) | Không | Đã xong, dùng lại nguyên trạng |
| `US-004` (sửa/xóa giao dịch) | `server/budget/application/use-cases/delete-transaction.ts` tồn tại và hoạt động | Không | Đã xong — AC-05 dùng thao tác xóa giao dịch của US-004 để kiểm chứng, không cần sửa gì thêm ở US-004 |
| `ssr-data` (thêm `Category.isFallback`) | Mục 9 dưới đây | Có — phải chạy trước `ssr-breaker`/`ssr-dev` | Trước toàn bộ task application/UI của US-005 |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | `app/budget/page.tsx` không đổi — vẫn gọi `getBudgetSnapshot()` nguyên trạng |
| Server Action | Yes | `removeCategory`, `recordQuickTransaction` đổi chữ ký trong `server/budget/actions.ts` |
| Route Handler (`app/api`) | N/A | Không có route handler trong bounded context này |
| Auth / middleware / permission | N/A | Single-user, không áp dụng |
| Prisma schema | Yes | Thêm `Category.isFallback Boolean @default(false)` — `ssr-data` thực hiện |
| Migration SQLite | Yes | Migration mới cho field trên — `ssr-data` thực hiện |
| DBML | Yes | Đồng bộ `docs/db/schema.dbml` sau khi đổi schema — `ssr-data` thực hiện |
| Seed data | No | `lib/budget-defaults.ts` không đổi — "Chi tiêu khác" không nằm trong seed mặc định (đúng `DEC-026`) |
| Caching / revalidate | Yes | `remove-category.ts`, `record-quick-transaction.ts` tiếp tục gọi `revalidatePath("/budget")` như hiện có, không đổi cơ chế |
| Export / báo cáo | No | Spec mục 9 xác nhận không ảnh hưởng export |
| Mail / webhook / job nền | N/A | Không có trong bounded context này |
| Knowledge base / memory | Yes | DEV wiki `US-005-rang-buoc-toan-ven-danh-muc.md` mới; `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Thêm state `toastMessage`; đổi logic dropdown nhập nhanh (thêm option trống, reset khi không khớp từ khóa); đổi `addQuickExpense` cho phép `categoryId` rỗng; đổi `removeCategory` để đọc kết quả trả về và dựng toast; bảng danh mục lọc `isFallback && actual===0`, hiển thị dạng chữ thường cho dòng `isFallback` |
| UI dùng chung | `components/shared/Toast.tsx` (mới) | Component toast dùng chung đầu tiên của app — nhận `message`, tự đóng sau vài giây (`DEC-012`) |
| Application (use-case) | `server/budget/application/use-cases/remove-category.ts` | Đếm/chuyển giao dịch sang "Chi tiêu khác" trước khi xóa; đổi kiểu trả về |
| Application (use-case) | `server/budget/application/use-cases/record-quick-transaction.ts` | `categoryId` optional; lấy/tạo "Chi tiêu khác" khi trống |
| Application (use-case) | `server/budget/application/use-cases/upsert-category.ts` | Chặn update khi `category.isFallback` |
| Application (use-case) | `server/budget/application/use-cases/create-month.ts` | Lọc bỏ danh mục `isFallback` khỏi `sourceCategories` khi sao chép tháng |
| Domain service | `server/budget/domain/services/fallback-category-service.ts` (mới) | `getOrCreate(monthId)` — BR-009, dùng chung bởi 2 use-case trên (R13.4) |
| Domain rule/entity | `server/budget/domain/entities/category.ts` | Thêm field `isFallback: boolean` |
| Repository interface (domain) | `server/budget/domain/repositories/category-repository.ts` | Thêm `findFallbackByMonth`; `CreateCategoryInput` thêm `isFallback?: boolean` |
| Repository interface (domain) | `server/budget/domain/repositories/transaction-repository.ts` | Thêm `countByCategory`, `reassignCategory` |
| Repository implementation (infrastructure) | `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Map `isFallback` hai chiều; hiện thực `findFallbackByMonth` |
| Repository implementation (infrastructure) | `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | Hiện thực `countByCategory` (`count`), `reassignCategory` (`updateMany`) |
| Data | `prisma/schema.prisma` | `Category.isFallback Boolean @default(false)` — `ssr-data` |
| Data | `docs/db/schema.dbml` | Đồng bộ field mới — `ssr-data` |
| Composition root | `server/budget/actions.ts` | Khởi tạo `fallbackCategoryService`; truyền thêm dep vào `removeCategory`/`recordQuickTransaction`; export type `RemoveCategoryResult` |
| Consumer | `server/budget/domain/services/budget-snapshot-service.ts` | Thêm field `isFallback` vào `BudgetCategorySnapshot` (đọc từ `CategoryEntity`, không đổi logic tính `actual`) |

## 9. Thay Đổi Data Model

Cần đổi schema: **Có**.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `Category` | Thêm field `isFallback Boolean` | Không | `false` | Không cần (bảng nhỏ, không truy vấn diện rộng theo field này ngoài lọc theo `monthId`) | Toàn bộ danh mục hiện có (kể cả "Tiền nhà", "Chi phí cố định khác") mặc định `isFallback=false` — đúng, vì chưa danh mục nào từng là "Chi tiêu khác" trước US-005 |

`ssr-data` cần chạy trước `ssr-breaker`/`ssr-dev` của US-005; `data-model.md` riêng do `ssr-data` tạo.

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `removeCategory(id)` — kiểu trả về | Trả về một `Promise` rỗng (`void`) | Trả về một `Promise` chứa `RemoveCategoryResult` hoặc `null` — chuyển giao dịch sang "Chi tiêu khác" nếu cần, trả `{ deletedName, movedCount }`; `null` nếu danh mục đã không còn tồn tại (idempotent, giữ đúng quy ước hiện có ở `deleteTransaction`) | Có — đổi kiểu trả về, `components/BudgetApp.tsx` là nơi gọi duy nhất, phải cập nhật cùng lúc |
| `recordQuickTransaction(input)` | `categoryId: string` bắt buộc | `categoryId?: string` — trống thì tự vào "Chi tiêu khác" | Có (nới lỏng, không phá vỡ lời gọi cũ vì `categoryId` cũ vẫn hợp lệ) |
| `upsertCategory(input)` khi có `id` trỏ tới danh mục `isFallback` | Cho sửa tự do | Ném `UpsertCategoryError` | Có, nhưng đúng ý định — trước US-005 không có danh mục `isFallback` nào tồn tại nên không phá vỡ lời gọi cũ |
| `CategoryEntity` | `{ id, monthId, name, type, budget, locked }` | Thêm `isFallback: boolean` | Không (thêm field, không xóa field cũ) |
| `BudgetCategorySnapshot` (đọc bởi UI) | Không có `isFallback` | Thêm `isFallback: boolean` | Không (thêm field) |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `prisma/schema.prisma` | Thêm `Category.isFallback Boolean @default(false)` (việc của `ssr-data`) |
| `docs/db/schema.dbml` | Đồng bộ field mới (việc của `ssr-data`) |
| `server/budget/domain/entities/category.ts` | Thêm `isFallback: boolean` |
| `server/budget/domain/repositories/category-repository.ts` | Thêm `findFallbackByMonth`, `CreateCategoryInput.isFallback?` |
| `server/budget/domain/repositories/transaction-repository.ts` | Thêm `countByCategory`, `reassignCategory` |
| `server/budget/domain/services/fallback-category-service.ts` | **Mới** — `getOrCreate(monthId)` |
| `server/budget/domain/services/budget-snapshot-service.ts` | `BudgetCategorySnapshot` thêm `isFallback`, map từ `CategoryEntity` |
| `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Map `isFallback` (đọc/ghi), hiện thực `findFallbackByMonth` |
| `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | Hiện thực `countByCategory`, `reassignCategory` |
| `server/budget/application/use-cases/remove-category.ts` | Chuyển giao dịch trước khi xóa; đổi kiểu trả về; nhận thêm `transactionRepository`, `fallbackCategoryService` |
| `server/budget/application/use-cases/record-quick-transaction.ts` | `categoryId` optional; gọi `fallbackCategoryService` khi trống |
| `server/budget/application/use-cases/upsert-category.ts` | Chặn update danh mục `isFallback` |
| `server/budget/application/use-cases/create-month.ts` | Lọc bỏ danh mục `isFallback` khỏi `sourceCategories` khi sao chép tháng |
| `server/budget/actions.ts` | Khởi tạo `fallbackCategoryService`; nối dep mới vào 2 use-case; export `RemoveCategoryResult` |
| `components/shared/Toast.tsx` | **Mới** — component toast dùng chung đầu tiên |
| `components/BudgetApp.tsx` | Thêm state toast; đổi dropdown/quick-entry; đổi `removeCategory` wrapper; đổi render bảng danh mục (ẩn `isFallback` khi hết giao dịch, hiển thị chữ thường không ô nhập/không nút xóa) |
| `docs/kb/dev/wiki/US-005-rang-buoc-toan-ven-danh-muc.md` | **Mới** — DEV wiki |
| `docs/kb/dev/00-index.md` | Thêm dòng US-005 |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng |
| --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | Passed — 0 lỗi (2026-08-06) |
| Prisma | `rtk npx prisma validate` | Passed — hợp lệ (2026-08-06) |
| Test | `rtk vitest run` | Chưa có framework test cài đặt trong `package.json` (gap đã biết từ US-001/US-004) — thay bằng kiểm chứng thủ công đủ 6 AC |
| Build | `rtk next build` | Passed — Errors: 0, Warnings: 0 (2026-08-06) |
| Thủ công — AC-01, AC-06 | Xóa danh mục thường đang có giao dịch (tháng chưa có / đã có "Chi tiêu khác") trên `next dev` | Passed — xem chi tiết ở `task.md` `TB-12`: toast đúng nội dung, "Chi tiêu khác" xuất hiện/cộng dồn đúng "Chi thực tế", không tạo bản ghi trùng |
| Thủ công — AC-02 | Xóa danh mục thường không có giao dịch | Passed — toast chỉ báo đã xóa, không tạo "Chi tiêu khác" |
| Thủ công — AC-03 | Gõ nội dung không khớp từ khóa nào, bấm "Ghi nhận" khi dropdown để trống | Passed — dropdown về "— Chưa xác định —", nút không bị disable, giao dịch gắn "Chi tiêu khác" mới (Linh hoạt, 0đ). Ghi chú: ví dụ "sửa xe máy 200k" trong spec thực ra khớp từ khóa "xe" (Di chuyển) — đã dùng câu khác để kiểm đúng hành vi, xem finding ở `task.md` `TB-12` |
| Thủ công — AC-04 | Xem dòng "Chi tiêu khác" đang có giao dịch trên bảng | Passed — xác nhận qua DOM: không `input`, không nút xóa |
| Thủ công — AC-05 | Xóa giao dịch duy nhất của "Chi tiêu khác" (dùng thao tác xóa giao dịch của US-004) | Passed — dòng "Chi tiêu khác" biến mất khỏi bảng ngay |
| Thủ công (phòng thủ) | `upsertCategory` chặn update khi `category.isFallback` (đọc code, không có đường UI để gọi được) | Passed — xác nhận bằng đọc lại `upsert-category.ts` sau khi sửa; UI không render ô nhập nào cho dòng `isFallback` nên không có đường kích hoạt được từ giao diện |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Đổi kiểu trả về `removeCategory` là breaking contract, nhưng chỉ có đúng một nơi gọi (`components/BudgetApp.tsx`) | Thấp | Sửa đồng thời use-case và UI trong cùng một task, không tách rời | Nếu lỗi, có thể tạm quay về kiểu trả `void` như cũ và bỏ toast, không ảnh hưởng dữ liệu |
| Sao chép tháng (`createMonth` với `sourceMonthId`) từng có thể copy nhầm "Chi tiêu khác" nếu không lọc — phát hiện trong lúc khảo sát, chưa từng xảy ra trong thực tế (chưa có `isFallback` trước US-005) | Thấp | Lọc `isFallback` khỏi `sourceCategories` ngay trong task này | Không cần rollback riêng — chỉ là phòng ngừa trước khi field mới tồn tại |
| Bảng danh mục ở `components/BudgetApp.tsx` vẫn dùng tên cột cũ "Chênh lệch"/"Tỷ trọng" thay vì "Còn lại" theo `DEC-019` — gap có từ trước, không thuộc phạm vi US-005 | Thấp | Không sửa trong task này, chỉ ghi nhận | Không áp dụng |
| Toast là component dùng chung đầu tiên của app — rủi ro về vị trí hiển thị/z-index chưa có tiền lệ | Thấp | Đặt cố định góc màn hình, `position: fixed`, kiểm tra thủ công trên `next dev` trước khi coi là xong | Gỡ import `Toast` nếu vỡ layout, giữ nguyên `alert`-free hiện trạng tạm thời |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Prisma: thêm `Category.isFallback`, migration, đồng bộ DBML (`ssr-data`) | Done |
| `TB-02` | Domain: `CategoryEntity.isFallback`, `CategoryRepository.findFallbackByMonth`, `TransactionRepository.countByCategory`/`reassignCategory` | Pending |
| `TB-03` | Domain service `fallback-category-service.ts` (BR-009) | Pending |
| `TB-04` | Application: `remove-category.ts` chuyển giao dịch trước khi xóa, đổi kiểu trả về | Pending |
| `TB-05` | Application: `record-quick-transaction.ts` cho `categoryId` optional | Pending |
| `TB-06` | Application: `upsert-category.ts` chặn sửa danh mục `isFallback`; `create-month.ts` lọc `isFallback` khi sao chép tháng | Pending |
| `TB-07` | Infrastructure: cập nhật 2 repository Prisma cho các phương thức mới | Pending |
| `TB-08` | Composition root `actions.ts`: nối dep, export `RemoveCategoryResult` | Pending |
| `TB-09` | UI: component `Toast` dùng chung + tích hợp vào `removeCategory` wrapper | Pending |
| `TB-10` | UI: dropdown nhập nhanh (lựa chọn trống, reset khi không khớp từ khóa), `addQuickExpense` cho phép trống | Pending |
| `TB-11` | UI: bảng danh mục — ẩn `isFallback` khi hết giao dịch, hiển thị chữ thường không ô nhập/không nút xóa | Pending |
| `TB-12` | Verification tổng hợp: typecheck, build, prisma validate, đủ 6 AC thủ công trên `next dev` | Pending |

Readiness: Ready
