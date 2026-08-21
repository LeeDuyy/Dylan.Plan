# Sắp xếp vị trí danh mục bằng kéo thả (Drag-and-drop row reordering) — Phân Rã Task

Status: Implemented
Feature: US-017
Plan: plan.md
Spec: spec.md
Created: 2026-08-12
Updated: 2026-08-12
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 8 tiêu chí chấp nhận (AC-01..AC-08), Screen Element `EL-01`..`EL-06` (mục 8.1-8.4) |
| `plan.md` | Mục 5 (luồng end-to-end kéo thả + Clone tháng), mục 7 (Impact Checklist), mục 8 (Bản Đồ Source Impact), mục 9 (đã đổi schema), mục 10 (Contract), mục 11 (File Sẽ Thay Đổi), mục 14 (8 outcome dự kiến) |
| `data-model.md` | Xác nhận `TB-01` (migration + backfill `Category.order`) đã `Applied` thật (2026-08-12) — không cần task migration nào nữa |

## 2. Breakdown Summary

- Phạm vi: Domain (`CategoryEntity`, `CategoryRepository` interface, rule mới `category-reorder-rule.ts`); Infrastructure (`category-prisma-repository.ts` — `orderBy`, tự tính `order` khi tạo, `reorder` transaction); Application (use-case mới `reorder-categories.ts`, sửa `create-month.ts` gán `order` khi seed/Clone); Composition root (`actions.ts` export `reorderCategories`); UI (`components/BudgetApp.tsx` — tay cầm kéo thả, state, handler).
- Phụ thuộc chặn: Không — `US-001`, `US-014`, `US-006`, `US-005` đều đã Ready for DEV/Delivered; migration + backfill (`TB-01`) đã xong thật trước khi breakdown này chạy.
- Số task: 10 — tất cả `Done` (`TB-01` từ stage `data`; `TB-02`..`TB-10` triển khai qua Codex CLI — `SSR_IMPLEMENT_EXECUTOR=codex` — và tự `ssr-dev` chạy lại verification/đối chiếu phạm vi)
- Readiness: Implemented

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | `Category.order Int @default(0)` + index `(monthId, order)` đã có trong schema, migration đã áp dụng, 84 dòng dữ liệu cũ đã backfill đúng thứ tự `rowid` hiện có trong từng tháng | `prisma/schema.prisma`, `prisma/migrations/20260812063115_add_category_order/`, `prisma/dev.db` (backfill trực tiếp, không qua migration — `JDG-018`) | None | AC-02, AC-07, AC-08; Contract "findAll/findByMonth orderBy" (plan mục 10) | `npx prisma validate`; query `Category` `ORDER BY "order"` theo từng `monthId` | Done | Đã chạy thật ở stage `data` (2026-08-12) — xem `data-model.md` mục 3, 6, 7: migration `Passed`, backfill 84/84 dòng đúng 11 tháng, `prisma generate` + `tsc --noEmit` đều `Passed` |
| `TB-02` | `CategoryEntity` thêm `order: number` | `server/budget/domain/entities/category.ts` | `TB-01` | Contract `CategoryEntity` (plan mục 10) | `tsc --noEmit` | Done | Đọc lại file: đúng 1 dòng `order: number;` thêm vào type. `npx tsc --noEmit` (lần chạy cuối sau toàn bộ TB-02..TB-09) → `ok`, 0 lỗi (2026-08-12) |
| `TB-03` | `CreateCategoryInput`/`UpdateCategoryInput` thêm `order?: number`; interface `CategoryRepository` thêm `reorder(monthId: string, orderedIds: string[]): Promise (void)` | `server/budget/domain/repositories/category-repository.ts` | `TB-02` | Contract `CategoryRepository` (plan mục 10) | `tsc --noEmit` | Done | Đọc lại file: `CreateCategoryInput.order?: number`; `UpdateCategoryInput` = phần chọn lọc (Partial Pick) từ `CategoryEntity` gồm đúng 5 trường `name`/`type`/`budget`/`locked`/`order`; interface thêm đúng `reorder(monthId: string, orderedIds: string[]): Promise (void)`. `npx tsc --noEmit` → `ok` |
| `TB-04` | File mới `category-reorder-rule.ts` export `assertReorderableCategories(orderedIds, existingCategories)` (throw `CategoryReorderError` khi: id lạ, id thuộc danh mục `isFallback`, hoặc tập id không khớp chính xác danh mục thường/khóa hiện có của tháng) và `CategoryReorderError` | `server/budget/domain/rules/category-reorder-rule.ts` (mới) | None | AC-06 (chặn kéo "Chi tiêu khác" ở tầng server, không chỉ UI) | `tsc --noEmit` | Done | Đọc lại file: đúng pattern `category-name-rule.ts`/`category-type-rule.ts` — không import Prisma/infrastructure (đúng R13.2), 3 nhánh chặn đúng như thiết kế (id lạ, `isFallback`, tập id không khớp chính xác qua so sánh `Set`). `npx tsc --noEmit` → `ok` |
| `TB-05` | `category-prisma-repository.ts`: `toEntity` thêm `order`; `findAll`/`findByMonth` thêm `orderBy` (theo `order` tăng dần, kèm `monthId` cho `findAll`); `create` khi không truyền `order` tự tính giá trị kế tiếp bằng `aggregate({ _max: { order: true } })` trong cùng `monthId`; implement `reorder` bằng `prisma.$transaction([...])`, mỗi phần tử `orderedIds` update `order = index` | `server/budget/infrastructure/repositories/category-prisma-repository.ts` | `TB-02`, `TB-03` | AC-01, AC-02, AC-03, AC-04, AC-08; Contract "findAll/findByMonth orderBy" (plan mục 10) | `tsc --noEmit` | Done | Đọc lại file: `findAll` → `orderBy: [{ monthId: "asc" }, { order: "asc" }]`; `findByMonth` → `orderBy: { order: "asc" }`; `create` tính `order` bằng `aggregate({ _max: { order: true } })._max.order ?? -1) + 1` khi `data.order` undefined; `reorder` dùng đúng `prisma.$transaction([orderedIds.map(...)])`. `npx tsc --noEmit` → `ok`. Xác nhận hành vi thật qua `next dev` (xem `TB-10`) |
| `TB-06` | Use-case mới `reorderCategories({ monthId, orderedCategoryIds })`: đọc danh mục hiện có qua `findByMonth`, gọi `assertReorderableCategories`, gọi `repository.reorder`, `revalidatePath("/budget")` | `server/budget/application/use-cases/reorder-categories.ts` (mới) | `TB-03`, `TB-04` | AC-01, AC-02, AC-06, AC-08 | `tsc --noEmit` | Done | Đọc lại file: validate `monthId` (regex `YYYY-MM`, cùng pattern `create-month.ts`), validate mảng id không rỗng, gọi `findByMonth` → `assertReorderableCategories` → `repository.reorder` → `revalidatePath("/budget")`; lỗi rule được bọc lại thành `ReorderCategoriesError` (đúng pattern `upsert-category.ts` bọc `InvalidCategoryTypeError`). `npx tsc --noEmit` → `ok` |
| `TB-07` | `create-month.ts`: `seedCategories` (cả nhánh sao chép từ tháng nguồn và nhánh `defaultCategories`) map thêm `order: index` theo đúng vị trí trong mảng nguồn đã đọc được (mảng nguồn đã đúng thứ tự nhờ `TB-05`); vòng lặp `categoryRepository.create` truyền kèm `order` | `server/budget/application/use-cases/create-month.ts` | `TB-03` | AC-07 | `tsc --noEmit` | Done | Đọc lại file: cả 2 nhánh `sourceCategories.map((category, index) => ({..., order: index}))` và `defaultCategories.map((category, index) => ({..., order: index}))` đúng thiết kế. `npx tsc --noEmit` → `ok`. Kiểm chứng thủ công AC-07 **không thực hiện được trên UI thật** — mọi kỳ tháng trong cửa sổ 13 tháng quanh ngày hệ thống (2026-08-12) đều đã có dữ liệu ("Không còn kỳ tháng trống"), không có tháng trống nào để bấm "Clone tháng đang xem"; xác nhận đúng bằng đọc code: nguồn `sourceCategories` lấy từ `findByMonth` (đã đúng thứ tự nhờ `TB-05`, xác nhận thật ở `TB-10`), map giữ nguyên thứ tự mảng nguồn qua `order: index` — không có bước nào làm xáo trộn thứ tự giữa lúc đọc và lúc tạo |
| `TB-08` | `actions.ts`: khai báo `reorderCategoriesUseCase = createReorderCategoriesUseCase(categoryRepository)`; export `async function reorderCategories(input: ReorderCategoriesInput): Promise (void)`; re-export type `ReorderCategoriesInput` | `server/budget/actions.ts` | `TB-05`, `TB-06` | Contract "Server Action `reorderCategories`" (plan mục 10); Impact checklist "Server Action" = Yes | `tsc --noEmit` | Done | Đọc lại file: wiring + export + re-export type đúng vị trí, cùng pattern các use-case khác (`createMonth`...). `npx tsc --noEmit` → `ok` |
| `TB-09` | `BudgetApp.tsx`: import `reorderCategories`; thêm state kéo thả cục bộ; thêm cột tay cầm kéo thả (`EL-01`, icon) ở đầu mỗi dòng danh mục thường/khóa (`EL-02`) trong bảng ngân sách, **không** render ở dòng "Chi tiêu khác" (`EL-03`); `draggable`/`onDragStart`/`onDragOver`/`onDrop` tính `orderedCategoryIds` mới, cập nhật `months` cục bộ (optimistic), gọi `reorderCategories`, `await refreshSnapshot()` cả khi thành công lẫn khi lỗi (bắt lỗi bằng `setToastMessage`, theo đúng pattern `commitCategory`); dropdown (`EL-04`, ~791-825) và biểu đồ (`EL-05`, ~1059-1090) **không sửa** | `components/BudgetApp.tsx` | `TB-08` | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-08; Screen Element `EL-01`, `EL-02`, `EL-03` | `tsc --noEmit` | Done | Đọc lại file: cột tay cầm mới (`GripVertical`, `aria-label="Sắp xếp danh mục"`) chỉ render ở dòng không phải `isFallback`; `onDragOver`/`onDrop` gắn trên `<tr>`; `dropCategory` tính `orderedCategoryIds` từ `visibleCategories` đã loại `isFallback`, gọi `reorderCategoryLocal` (optimistic) rồi `reorderCategories` + `refreshSnapshot()` cả 2 nhánh thành công/lỗi — đúng pattern `commitCategory`. `thead`/`tfoot` đã chỉnh `colSpan` cho cột mới. Dropdown/biểu đồ không đổi dòng nào. `npx tsc --noEmit` → `ok`. Kiểm chứng thủ công đủ trên `next dev` — xem `TB-10` |
| `TB-10` | Verification tổng hợp: typecheck, `prisma validate`, build, đủ 8 AC kiểm chứng thủ công trên `next dev` (gồm cả `EL-06` — Clone tháng giữ thứ tự); cập nhật DEV wiki mục 5/7/8 với kết quả thật | `docs/kb/dev/wiki/US-017-sap-xep-danh-muc-keo-tha.md` | `TB-07`, `TB-09` | AC-01..AC-08 | `tsc --noEmit`, `npx prisma validate`, `next build`, thao tác thủ công đủ 8 AC | Done | `npx tsc --noEmit` → `ok`. `npx prisma validate` → "The schema at prisma\schema.prisma is valid" (không đổi so với stage `data`). `npx next build` → Compiled successfully, 3 route (`/`, `/_not-found`, `/budget`), 0 lỗi. Thủ công trên `next dev` (cổng 52478, dữ liệu thật nhiều tháng, mô phỏng kéo thả bằng `DragEvent` gắn `DataTransfer` thật trên đúng element `draggable` — không phải giả lập bằng click chuột): **AC-01** tháng `2027-02`, kéo "Di chuyển" (vị trí 4) lên vị trí 1 — bảng đổi thứ tự ngay đúng như kỳ vọng. **AC-02** tải lại trang cứng (`navigate force`) — thứ tự vẫn giữ "Di chuyển" ở đầu, không quay lại thứ tự cũ. **AC-03** dropdown "Danh mục nhận diện" đọc qua DOM — đúng thứ tự mới `["Di chuyển","Tiền nhà","Chi phí cố định khác",...]`. **AC-04** biểu đồ "Cơ cấu chi tiêu" đọc nhãn cột qua DOM — đúng thứ tự mới `["Di","Tiền","Chi","Ăn",...]`. **AC-05** danh mục khóa "Tiền nhà" (không có nút xóa) có tay cầm kéo thả và kéo thành công xuống cuối bảng. **AC-06** tháng `2026-08` (có "Chi tiêu khácc" đang hiển thị): dòng fallback xác nhận qua DOM không có tay cầm kéo thả (`hasHandle: false`), luôn ở vị trí cuối. **AC-07** không kiểm chứng được trên UI thật — xem ghi chú ở `TB-07`; xác nhận bằng đọc code (`TB-05` + `TB-07`). **AC-08** mô phỏng lỗi mạng bằng cách chặn đúng 1 lần gọi `fetch` đầu tiên (`reorderCategories`), để các lần gọi sau (bao gồm `refreshSnapshot`) chạy bình thường — xác nhận toast "Simulated network failure..." hiện ra ngay, và thứ tự bảng trở lại đúng y hệt trước khi kéo (`before` === `afterRecovery`), không có danh mục nào bị mất vị trí. Không phát hiện lỗi console nào ngoài lỗi mô phỏng có chủ đích ở AC-08. Đã cập nhật DEV wiki mục 5/7/8 với kết quả thật (xem file) |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Đã Done ở stage `data` (`TB-01`; DBML đã cập nhật thủ công, không có generator — xem `data-model.md` mục 5).
- Cập nhật BA/DEV function wiki — DEV wiki đã tạo ở stage `plan`, đã cập nhật mục 4 ở stage `data`; `TB-10` cập nhật lại mục 5/7/8 với kết quả triển khai thật.
- Cập nhật memory — `DEC-074`..`DEC-079` (stage `ba`), `JDG-019`, `JDG-020`, `JDG-021` (stage `plan`/`data`) đã ghi; không phát sinh quyết định mới ở breakdown này.
- Verification cuối — `TB-10`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (kéo thả đổi vị trí, hiển thị ngay) | `TB-05`, `TB-06`, `TB-08`, `TB-09`, `TB-10` | UI → Server Action → use-case → repository transaction |
| AC-02 (thứ tự giữ nguyên qua tải lại) | `TB-01`, `TB-05`, `TB-06`, `TB-09`, `TB-10` | Persist ở DB (`TB-01`) + `orderBy` khi đọc lại (`TB-05`) |
| AC-03 (đồng bộ dropdown "Danh mục nhận diện") | `TB-05`, `TB-10` | Không sửa UI dropdown — tự động đồng bộ qua `visibleCategories` một khi nguồn dữ liệu (`findAll`) đã đúng thứ tự |
| AC-04 (đồng bộ biểu đồ "Cơ cấu chi tiêu") | `TB-05`, `TB-10` | Tương tự AC-03 |
| AC-05 (danh mục khóa vẫn kéo thả được) | `TB-04`, `TB-09`, `TB-10` | Rule không chặn `locked`; UI không loại trừ `locked` khỏi tay cầm |
| AC-06 ("Chi tiêu khác" không kéo được, luôn cuối) | `TB-04`, `TB-09`, `TB-10` | Chặn cả server (rule) lẫn client (không render tay cầm) |
| AC-07 (Clone tháng giữ thứ tự tháng nguồn) | `TB-01`, `TB-05`, `TB-07`, `TB-10` | `findByMonth` đã đúng thứ tự (`TB-05`) trước khi `create-month.ts` map sang `order: index` (`TB-07`) |
| AC-08 (lỗi lưu giữ nguyên thứ tự cũ) | `TB-05`, `TB-06`, `TB-09`, `TB-10` | Atomic qua `$transaction` (`TB-05`) + revert bằng `refreshSnapshot()` khi lỗi (`TB-09`) |
| Contract `CategoryEntity` (plan mục 10) | `TB-02` | Thêm `order: number` |
| Contract `CategoryRepository` (plan mục 10) | `TB-03` | Thêm `reorder`, `CreateCategoryInput`/`UpdateCategoryInput.order?` |
| Contract Server Action `reorderCategories` (plan mục 10) | `TB-08` | Action mới, không đổi action cũ |
| Contract `findAll`/`findByMonth` đổi `orderBy` (plan mục 10) | `TB-01`, `TB-05` | Migration cấp field, repository cấp truy vấn |
| Impact checklist — Server Action = Yes | `TB-08` | |
| Impact checklist — Prisma schema / Migration SQLite / DBML = Yes | `TB-01` (Done) | |
| Impact checklist — Caching/revalidate = Yes | `TB-06` | `revalidatePath("/budget")` trong use-case mới |
| Impact checklist — Knowledge base/memory = Yes | Đã Done ở stage `ba`/`plan`/`data`; `TB-10` cập nhật DEV wiki cuối | |
| Rủi ro "backfill thiếu, xáo trộn thứ tự hiện có" (plan mục 13) | `TB-01` (Done) | Backfill đã chạy ngay sau migration, xác nhận 84/84 dòng |
| Rủi ro "reorder không transaction" (plan mục 13) | `TB-05` | Bắt buộc `prisma.$transaction` |
| Follow-up US-006 (plan mục 11, chưa sửa spec US-006) | Không có task riêng | Ngoài phạm vi breakdown này — ghi nhận ở `plan.md` mục 11, để lần cập nhật US-006 kế tiếp xử lý |

## 5. Thứ Tự Dependency

1. `TB-01` (Done)
2. `TB-02` (phụ thuộc `TB-01`)
3. `TB-03` (phụ thuộc `TB-02`)
4. `TB-04` (độc lập — không dùng field `order`, chỉ dùng `id`/`monthId`/`isFallback` đã có sẵn từ trước)
5. `TB-05` (phụ thuộc `TB-02`, `TB-03`)
6. `TB-06` (phụ thuộc `TB-03`, `TB-04`)
7. `TB-07` (phụ thuộc `TB-03`)
8. `TB-08` (phụ thuộc `TB-05`, `TB-06`)
9. `TB-09` (phụ thuộc `TB-08`)
10. `TB-10` (phụ thuộc `TB-07`, `TB-09`)

Không có vòng lặp. `TB-04` và `TB-07` có thể chạy song song với nhánh `TB-05`/`TB-06` vì không phụ thuộc lẫn nhau.

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
