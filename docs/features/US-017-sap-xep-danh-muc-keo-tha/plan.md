# Sắp xếp vị trí danh mục bằng kéo thả (Drag-and-drop row reordering) — SE Plan

Status: Ready for task-breakdown
Feature: US-017
Spec: spec.md
Created: 2026-08-12
Updated: 2026-08-12
DEV Wiki: `docs/kb/dev/wiki/US-017-sap-xep-danh-muc-keo-tha.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Thêm một cột thứ tự bền vững cho `Category` (đổi schema), một thao tác ghi hàng loạt để lưu thứ tự mới khi Dylan kéo thả (`reorderCategories`), và một tương tác kéo thả trên các dòng bảng ngân sách ở client (dùng HTML5 Drag and Drop API có sẵn của trình duyệt — không thêm thư viện mới). Ba nơi hiển thị dùng chung (bảng, dropdown, biểu đồ) đã cùng đọc từ một nguồn dữ liệu (`visibleCategories` ở client, vốn tính từ `selectedMonth.categories` do server trả về) nên chỉ cần server trả đúng thứ tự đã lưu là cả 3 nơi tự động đồng bộ, không cần sửa dropdown/biểu đồ. Nghiệp vụ Clone tháng (`create-month.ts`) chỉ cần truyền kèm thứ tự khi sao chép danh mục từ tháng nguồn để tự động thỏa AC-07, không cần đường dẫn code riêng.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-017-sap-xep-danh-muc-keo-tha/spec.md` | Nguồn yêu cầu — 8 AC, 6 Screen Element (`EL-01`..`EL-06`), mục 9/10/12/13 |
| `docs/kb/ba/wiki/knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md` | Đối chiếu mục tiêu/phạm vi/luồng nghiệp vụ đã tổng hợp |
| `prisma/schema.prisma` | Model `Category` hiện tại (dòng 27-43) — chưa có cột thứ tự |
| `server/budget/domain/entities/category.ts` | Shape `CategoryEntity` hiện tại |
| `server/budget/domain/repositories/category-repository.ts` | Interface `CategoryRepository`, `CreateCategoryInput`, `UpdateCategoryInput` |
| `server/budget/infrastructure/repositories/category-prisma-repository.ts` | `findAll`/`findByMonth` hiện không có `orderBy`; `create`/`upsert`/`update` hiện tại |
| `server/budget/application/use-cases/upsert-category.ts` | Pattern use-case CRUD gộp gọn (rule gọi trực tiếp, không qua domain service) |
| `server/budget/application/use-cases/remove-category.ts` | Xác nhận `locked` chỉ chặn xóa, không liên quan vị trí |
| `server/budget/application/use-cases/create-month.ts` | Luồng Clone tháng — sao chép `name/type/budget/locked` từ tháng nguồn, chưa có thứ tự |
| `server/budget/domain/services/fallback-category-service.ts` | Cách "Chi tiêu khác" tự sinh — không cần thứ tự riêng |
| `server/budget/domain/services/budget-snapshot-service.ts` | **Quan trọng**: `categoriesByMonth` dựng từ `categoryRepository.findAll()` (không phải `findByMonth`), giữ nguyên thứ tự mảng trả về — đây là nơi thực sự quyết định thứ tự hiển thị, không phải `findByMonth` |
| `server/budget/actions.ts` | Composition root — nơi khai báo và export Server Action mới |
| `lib/budget-defaults.ts` | `defaultCategories` dùng khi tạo tháng không có tháng nguồn |
| `components/BudgetApp.tsx` | Bảng danh mục (~944-1035), dropdown "Danh mục nhận diện" (~791-825), biểu đồ "Cơ cấu chi tiêu" (~1059-1090), `visibleCategories` (342-346), `updateCategoryLocal`/`commitCategory` (367-397, pattern optimistic-update + `refreshSnapshot()` khi lỗi), nút "Clone tháng đang xem" (443-451, 729-732) |
| `docs/kb/dev/wiki/US-014-chi-tieu-khac-cuoi-bang.md` | Tham chiếu cách DEV wiki mô tả thay đổi liên quan tới cùng bảng danh mục |
| `docs/memory/rules.md` (R13, Light DDD) | Quy tắc khi nào cần domain service riêng vs. rule đơn giản trong use-case |
| `docs/memory/decisions.md` | `DEC-074`..`DEC-079` |
| `docs/db/schema.dbml` | Định dạng ghi chú field hiện có cho `Category` |
| `package.json` | Xác nhận chưa có thư viện kéo thả nào đã cài |

## 3. Hành Vi Hiện Tại

Bảng danh mục không có cách nào để Dylan tự đổi vị trí hiển thị. `Category` không có cột lưu thứ tự. `budget-snapshot-service.ts` dựng `categoriesByMonth` bằng cách gọi `categoryRepository.findAll()` (không `orderBy`) rồi nhóm theo `monthId`, giữ nguyên thứ tự SQLite trả về (mặc định theo rowid/thời điểm tạo — không đảm bảo bởi chuẩn SQL nhưng hiện đang quan sát đúng thứ tự tạo). Ở client, `visibleCategories` (`components/BudgetApp.tsx:342-346`) chỉ làm đúng một việc: nếu "Chi tiêu khác" đang hiển thị thì đưa nó xuống cuối mảng — không đổi thứ tự các danh mục còn lại. Bảng ngân sách, dropdown "Danh mục nhận diện", và biểu đồ "Cơ cấu chi tiêu" đều `map` trực tiếp trên `visibleCategories`.

## 4. Hành Vi Mục Tiêu

- `Category` có thêm một cột thứ tự lưu bền vững (`order`, kiểu số nguyên).
- `categoryRepository.findAll()` trả kết quả đã sắp theo `order` tăng dần trong từng tháng — không đổi hành vi nhóm theo `monthId` ở `budget-snapshot-service.ts`.
- Một Server Action mới `reorderCategories({ monthId, orderedCategoryIds })` ghi lại thứ tự mới cho toàn bộ danh mục thường/khóa của một tháng trong một giao dịch (transaction) — thất bại thì không có danh mục nào bị đổi (thỏa AC-08).
- Bảng ngân sách ở client có thêm một cột "tay cầm kéo thả" (`EL-01`) ở đầu mỗi dòng danh mục thường/khóa; kéo thả một dòng gọi `reorderCategories` rồi làm mới dữ liệu từ server.
- Dòng "Chi tiêu khác" không có tay cầm kéo thả, không nhận sự kiện kéo thả.
- `create-month.ts` khi sao chép danh mục từ tháng nguồn (hoặc từ `defaultCategories`) gán thứ tự tuần tự đúng theo thứ tự mảng nguồn đã đọc được (mảng nguồn đã đúng thứ tự nhờ thay đổi ở `findAll()`), nên tháng mới tự động giữ đúng thứ tự tháng nguồn mà không cần logic Clone riêng.

## 5. Luồng End-To-End

```text
Entry: components/BudgetApp.tsx (Client Component)
  -> kéo thả một <tr> danh mục (tay cầm EL-01), thả tại vị trí mới
  -> tính mảng orderedCategoryIds mới ở client (dựa trên visibleCategories, loại "Chi tiêu khác")
  -> cập nhật state months cục bộ (optimistic, giống pattern updateCategoryLocal)
  -> gọi Server Action reorderCategories({ monthId, orderedCategoryIds }) (server/budget/actions.ts)
       -> application/use-cases/reorder-categories.ts
            -> categoryRepository.findByMonth(monthId) — lấy danh sách hiện có để đối chiếu
            -> domain/rules/category-reorder-rule.ts: assertReorderableCategories(orderedCategoryIds, existing)
               (chặn: id lạ, id thuộc "Chi tiêu khác", thiếu/thừa id so với danh mục thường/khóa hiện có)
            -> categoryRepository.reorder(monthId, orderedCategoryIds)
                 -> infrastructure/repositories/category-prisma-repository.ts
                      -> prisma.$transaction([...orderedCategoryIds.map((id, i) => prisma.category.update({ where: { id }, data: { order: i } }))])
            -> revalidatePath("/budget")
  -> thành công: await refreshSnapshot() (đọc lại toàn bộ, đồng bộ cả 3 nơi hiển thị)
  -> thất bại: catch, setToastMessage, await refreshSnapshot() (khôi phục đúng thứ tự trước kéo thả — AC-08)

Nhánh Clone tháng:
components/BudgetApp.tsx (nút "Clone tháng đang xem", dòng ~729-732)
  -> createNewMonth(true) -> createMonthAction({ monthId, sourceMonthId }) (server/budget/actions.ts)
       -> application/use-cases/create-month.ts
            -> categoryRepository.findByMonth(sourceMonthId) — đã đúng thứ tự nhờ orderBy mới
            -> map sang seedCategories, gán order = index trong mảng nguồn đã đúng thứ tự
            -> categoryRepository.create({ ...category, order }) cho từng danh mục, theo đúng thứ tự vòng lặp
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `docs/features/US-001-luu-tru-chi-tieu-ben-vung/plan.md` | `prisma/schema.prisma` đã có model `Category` bền vững, đã áp migration | Không (Delivered With Notes) | — |
| `docs/features/US-014-chi-tieu-khac-cuoi-bang/plan.md` | `components/BudgetApp.tsx:342-346` (`visibleCategories`) đã triển khai đúng luật "Chi tiêu khác luôn cuối" | Không (Ready for DEV, đã có source thật) | US-017 phải giữ nguyên hàm `visibleCategories`, chỉ thêm tương tác kéo thả xung quanh nó |
| `docs/features/US-006-canh-bao-trung-thang/plan.md` | `components/BudgetApp.tsx:443-451,729-732` (`createNewMonth(true)`) đã gọi `createMonthAction` với `sourceMonthId` | Không (Ready for DEV, đã có source thật) | Không cần sửa nút này — chỉ sửa `create-month.ts` phía sau |
| Migration thêm cột `Category.order` (`ssr-data`) | Chưa tồn tại — xác minh bằng cách đọc `prisma/schema.prisma` hiện tại, không có field này | Có | **Bắt buộc chạy `ssr-data` trước `ssr-breaker`** — mọi task đọc/ghi `order` phải chờ migration áp dụng |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | Không đổi route, không đổi `app/budget/page.tsx` |
| Server Action | Yes | Thêm `reorderCategories` vào `server/budget/actions.ts` |
| Route Handler (`app/api`) | N/A | Dự án không dùng Route Handler cho luồng này |
| Auth / middleware / permission | N/A | Single-user, không đăng nhập (`DEC-004`) |
| Prisma schema | Yes | Thêm field `order` vào model `Category` |
| Migration SQLite | Yes | Migration mới, kèm bước backfill dữ liệu cũ (xem mục 9) |
| DBML | Yes | Đồng bộ `docs/db/schema.dbml` sau khi `schema.prisma` đổi |
| Seed data | No | `prisma/seed.ts` không seed `Category` theo cách cần sửa riêng (danh mục mặc định tạo qua `create-month.ts`, đã có trong phạm vi sửa) |
| Caching / revalidate | Yes | `revalidatePath("/budget")` trong use-case mới, giống các use-case khác cùng bounded-context |
| Export / báo cáo | No | US-008 (xuất dữ liệu) chưa triển khai, ngoài phạm vi |
| Mail / webhook / job nền | N/A | Không có |
| Knowledge base / memory | Yes | DEV wiki mới (`US-017`), `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Thêm cột tay cầm kéo thả (`EL-01`) vào bảng ngân sách (~944-1035); state kéo thả cục bộ; handler gọi `reorderCategories`; dropdown (~791-825) và biểu đồ (~1059-1090) **không sửa** — tự động đồng bộ qua `visibleCategories` |
| Application (use-case) | `server/budget/application/use-cases/reorder-categories.ts` (mới) | Orchestrate: đọc danh mục hiện có, gọi rule kiểm tra, gọi `repository.reorder`, `revalidatePath` |
| Application (use-case) | `server/budget/application/use-cases/create-month.ts` | `seedCategories` map thêm `order: index` cho cả nhánh sao chép từ tháng nguồn và nhánh `defaultCategories` |
| Domain rule | `server/budget/domain/rules/category-reorder-rule.ts` (mới) | `assertReorderableCategories(orderedIds, existingCategories)` — chặn id lạ/id "Chi tiêu khác"/thiếu-thừa id, theo đúng pattern `category-name-rule.ts`/`category-type-rule.ts` hiện có (R13.4: CRUD 1 entity kèm rule đơn giản, không cần domain service riêng) |
| Domain entity | `server/budget/domain/entities/category.ts` | Thêm field `order: number` vào `CategoryEntity` |
| Repository interface (domain) | `server/budget/domain/repositories/category-repository.ts` | `CreateCategoryInput`/`UpdateCategoryInput` thêm `order?: number`; thêm method `reorder(monthId: string, orderedIds: string[]): Promise (void)` |
| Repository implementation (infrastructure) | `server/budget/infrastructure/repositories/category-prisma-repository.ts` | `findAll`/`findByMonth` thêm `orderBy`; `create` tự tính `order` kế tiếp khi không truyền; `toEntity` thêm `order`; implement `reorder` bằng `prisma.$transaction` |
| Data | `prisma/schema.prisma` | Model `Category` thêm field `order Int @default(0)`, thêm `@@index([monthId, order])` — do `ssr-data` thực hiện |
| Composition root | `server/budget/actions.ts` | Khai báo `reorderCategoriesUseCase`, export `reorderCategories` Server Action + type `ReorderCategoriesInput` |
| Consumer | `docs/db/schema.dbml` | Đồng bộ thủ công theo `schema.prisma` mới (do `ssr-data` cập nhật, cùng lượt với migration) |

## 9. Thay Đổi Data Model

Cần đổi schema: **Có**.

Bắt buộc có `data-model.md` do `ssr-data` tạo; `ssr-data` phải chạy trước `ssr-breaker`.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `Category` | Thêm field `order` (kiểu số nguyên) | Không | `0` (mức schema) | Thêm `@@index([monthId, order])` (đọc theo thứ tự trong từng tháng) | **Bắt buộc backfill** — không được để mọi dòng cũ cùng nhận giá trị mặc định `0`, vì SQLite không đảm bảo thứ tự ổn định khi nhiều dòng có cùng giá trị `order`; migration phải kèm một bước gán `order` tuần tự cho các dòng đã có, theo đúng thứ tự hiện đang hiển thị trong từng `monthId` (thứ tự tạo/`createdAt` tăng dần — đúng thứ tự SQLite/Prisma đang trả về hôm nay, xác minh ở mục 3), để không làm xáo trộn thứ tự hiển thị hiện tại của Dylan ngay sau khi migrate |

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `CategoryEntity` (`server/budget/domain/entities/category.ts`) | `{ id, monthId, name, type, budget, locked, isFallback }` | Thêm `order: number` | Không — chỉ thêm field, mọi nơi dùng destructuring/spread hiện có vẫn chạy |
| `CategoryRepository` (`server/budget/domain/repositories/category-repository.ts`) | Không có `reorder` | Thêm method `reorder(monthId, orderedIds): Promise (void)` | Không — thêm method mới, không đổi method cũ |
| Server Action `reorderCategories` (`server/budget/actions.ts`) | Chưa tồn tại | `reorderCategories(input: ReorderCategoriesInput): Promise (void)` | Không — action mới |
| `categoryRepository.findAll()` / `findByMonth()` | Không `orderBy`, thứ tự phụ thuộc SQLite | `orderBy: order tăng dần` | Không breaking về kiểu dữ liệu, nhưng **đổi thứ tự phần tử trả về** — mọi nơi gọi hai hàm này (`budget-snapshot-service.ts`, `upsert-category.ts` kiểm tên trùng, `create-month.ts`) không phụ thuộc thứ tự cho logic nghiệp vụ của chúng, chỉ `budget-snapshot-service.ts` dùng thứ tự này cho hiển thị (đúng mục tiêu) |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `prisma/schema.prisma` | Thêm `order Int @default(0)` vào `model Category`, thêm `@@index([monthId, order])` (do `ssr-data`) |
| `prisma/migrations/` (thư mục migration mới, tên do `prisma migrate dev` tự sinh theo thời điểm chạy, hậu tố `add_category_order`) | Migration mới + script backfill thứ tự cho dữ liệu cũ (do `ssr-data`) |
| `docs/db/schema.dbml` | Đồng bộ field `order` mới cho `Table Category` (do `ssr-data`) |
| `server/budget/domain/entities/category.ts` | Thêm `order: number` |
| `server/budget/domain/repositories/category-repository.ts` | `CreateCategoryInput`/`UpdateCategoryInput` thêm `order?: number`; thêm `reorder` vào interface |
| `server/budget/domain/rules/category-reorder-rule.ts` | File mới — `assertReorderableCategories` + `CategoryReorderError` |
| `server/budget/infrastructure/repositories/category-prisma-repository.ts` | `toEntity` thêm `order`; `findAll`/`findByMonth` thêm `orderBy`; `create` tự tính `order` kế tiếp khi không truyền (dùng `aggregate max`); implement `reorder` bằng `$transaction` |
| `server/budget/application/use-cases/reorder-categories.ts` | File mới — use-case `reorderCategories` |
| `server/budget/application/use-cases/create-month.ts` | `seedCategories` (cả 2 nhánh) thêm `order: index` |
| `server/budget/actions.ts` | Composition wiring `reorderCategoriesUseCase`; export `reorderCategories` + type `ReorderCategoriesInput` |
| `components/BudgetApp.tsx` | Import `reorderCategories`; thêm state kéo thả; thêm cột tay cầm (`EL-01`) và xử lý `draggable`/`onDragStart`/`onDragOver`/`onDrop` trên dòng danh mục thường/khóa (`EL-02`), loại trừ dòng "Chi tiêu khác" (`EL-03`); optimistic update + `refreshSnapshot()` theo đúng pattern `commitCategory` |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng | Kết quả thật (2026-08-12) |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi | Passed — `ok` |
| Prisma | `rtk npx prisma validate` | schema hợp lệ | Passed — "The schema at prisma\schema.prisma is valid" |
| Prisma generate | `rtk npx prisma generate` | client sinh lại thành công sau khi thêm field | Passed (đã chạy ở stage `data`, không đổi lại ở stage `dev`) |
| Test | `rtk vitest run` | pass (nếu có test cho `category-reorder-rule`) | Không áp dụng — dự án chưa cài framework test (`JDG-002`, vẫn đúng tới nay) |
| Build | `rtk next build` | pass | Passed — Compiled successfully, 3 route, 0 lỗi |
| Thủ công AC-01/AC-02 | Kéo dòng "Di chuyển" lên vị trí đầu trên bảng, tải lại trang | Thứ tự mới hiển thị ngay và giữ nguyên sau tải lại | Passed — tháng `2027-02`, xác nhận qua DOM trước/sau `navigate force` |
| Thủ công AC-03/AC-04 | Sau khi kéo thả, mở dropdown "Danh mục nhận diện" và xem biểu đồ "Cơ cấu chi tiêu" | Cả hai phản ánh đúng thứ tự mới, không cần thao tác gì thêm | Passed — cả 2 tự đồng bộ đúng thứ tự mới, không sửa dòng code nào ở 2 nơi này |
| Thủ công AC-05 | Kéo dòng "Tiền nhà" (khóa) sang vị trí khác | Đổi vị trí thành công như danh mục thường | Passed |
| Thủ công AC-06 | Thử kéo dòng "Chi tiêu khác" | Không phản hồi, vẫn ở cuối | Passed — tháng `2026-08`, dòng "Chi tiêu khácc" xác nhận không có tay cầm kéo thả |
| Thủ công AC-07 | Kéo thả sắp xếp lại một tháng, sau đó bấm "Clone tháng đang xem" | Tháng mới có danh mục theo đúng thứ tự tháng nguồn | Không kiểm chứng được trên UI thật — không còn kỳ tháng trống nào trong cửa sổ 13 tháng quanh ngày hệ thống để tạo tháng mới; xác nhận thay thế bằng đọc code (`task.md` `TB-07`) |
| Thủ công AC-08 | Ngắt kết nối mạng tạm thời rồi thử kéo thả | Bảng giữ nguyên thứ tự cũ, có toast báo lỗi, thử lại thành công thì mới đổi | Passed — mô phỏng lỗi mạng bằng cách chặn đúng 1 lần gọi `fetch` đầu (`reorderCategories`); toast hiện đúng, thứ tự phục hồi y hệt trước khi kéo |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Migration để mặc định `order = 0` cho toàn bộ dòng cũ mà không backfill, khiến thứ tự hiển thị hiện tại của Dylan bị xáo trộn ngay sau khi deploy | Trung bình | `ssr-data` bắt buộc kèm bước backfill tuần tự theo thứ tự hiện có (đã ghi rõ ở mục 9); `ssr-review` đối chiếu migration có bước backfill trước khi duyệt | Migration xuống (`prisma migrate` down thủ công) hoặc chạy lại script backfill nếu phát hiện sai lệch |
| `reorder` không bọc trong transaction, một phần danh mục đổi `order` thành công rồi lỗi giữa chừng — vi phạm AC-08 | Trung bình | Bắt buộc dùng `prisma.$transaction` cho toàn bộ mảng update trong `reorder`, không update rời rạc | Không cần rollback thủ công — transaction tự rollback khi lỗi |
| HTML5 Drag and Drop API có hành vi khác nhau giữa trình duyệt desktop và không hỗ trợ cảm ứng (mobile/touch) tốt | Thấp | Dự án hiện chỉ nhắm desktop (single-user cá nhân, chưa có yêu cầu responsive/touch trong spec); nếu cần hỗ trợ cảm ứng sau này, đó là US riêng | Không cần — nằm ngoài phạm vi hiện tại |
| `findAll()`/`findByMonth()` đổi `orderBy` có thể ảnh hưởng tới đoạn code khác đang ngầm dựa vào thứ tự cũ mà không được ghi nhận | Thấp | Đã rà toàn bộ nơi gọi hai hàm này ở mục 2 (`budget-snapshot-service`, `upsert-category` kiểm trùng tên, `create-month`) — không có logic nào phụ thuộc thứ tự ngoài hiển thị | Bỏ `orderBy` nếu phát hiện hồi quy, quay lại hành vi cũ |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Migration + backfill `Category.order` (`ssr-data`) | Done |
| `TB-02` | Domain: `CategoryEntity` thêm `order` | Pending |
| `TB-03` | Domain: `CategoryRepository` interface thêm `reorder`, `CreateCategoryInput`/`UpdateCategoryInput.order?` | Pending |
| `TB-04` | Domain: `category-reorder-rule.ts` (mới) | Pending |
| `TB-05` | Infrastructure: `category-prisma-repository.ts` (`orderBy`, `create` tự tính order, `reorder`) | Pending |
| `TB-06` | Application: `reorder-categories.ts` use-case (mới) | Pending |
| `TB-07` | Application: `create-month.ts` gán `order` khi seed/clone | Pending |
| `TB-08` | Composition root: `server/budget/actions.ts` export `reorderCategories` | Pending |
| `TB-09` | UI: tay cầm kéo thả + tương tác trên bảng ngân sách (`components/BudgetApp.tsx`) | Pending |
| `TB-10` | Verification: typecheck, build, thủ công AC-01..AC-08, cập nhật DEV wiki | Pending |

Readiness: Ready — `TB-01` đã Done thật (2026-08-12, xem `data-model.md`); `ssr-breaker` đã chia chi tiết `TB-02`..`TB-10` trong `task.md`, sẵn sàng cho `ssr-dev`.
