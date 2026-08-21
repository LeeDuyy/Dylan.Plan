# Danh sách items cần mua theo tháng tại bảng thu chi — SE Plan

Status: Ready for task-breakdown
Feature: US-019
Spec: spec.md
Created: 2026-08-14
Updated: 2026-08-19
DEV Wiki: `docs/kb/dev/wiki/US-019-danh-sach-can-mua.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Thêm một entity hoàn toàn mới `PurchaseItem` (tên nghiệp vụ "Item cần mua") vào bounded-context `budget` đã có sẵn (`server/budget/`), theo đúng cấu trúc 3 lớp Light DDD đang dùng cho `Category`/`Transaction`. Không tạo bounded-context mới vì `PurchaseItem` gắn theo `MonthBudget` và hiển thị trong cùng trang `/budget`.

Điểm kỹ thuật đáng chú ý nhất: quyền thêm/sửa/xóa `PurchaseItem` không theo tháng Dylan đang chọn xem trên dropdown (khác `Category`/`Transaction`), mà theo **tháng hiện tại tính theo đồng hồ hệ thống** (`DEC-107`). Vì vậy cần một hàm tiện ích dùng chung `getCurrentMonthId()` để cả 5 use-case (add/update/delete/mark-purchased/create-month) tự tính "tháng hiện tại" từ `new Date()` của server, không nhận giá trị này từ client — tránh client giả mạo tháng để bỏ qua ràng buộc.

Việc "chuyển item Pending sang tháng mới" (`BR-023`) không cần Server Action mới hay UI mới — chỉ nối thêm một bước vào use-case `create-month` đã có (`createMonth`), gọi ngay sau khi tạo xong tháng + danh mục, dùng chung một lần bấm nút "Tạo tháng"/"Clone tháng đang xem" đã tồn tại từ US-006.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-019-danh-sach-can-mua/spec.md` | Nguồn nghiệp vụ chính thức — 10 AC, mục 9/10/12/13 |
| `docs/kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md` | Đối chiếu phạm vi, luồng nghiệp vụ với spec |
| `docs/kb/ba/wiki/knowledge/business-rule/BR-022-gia-item-khong-cong-ngan-sach.md` | Rule giá không cộng ngân sách — xác nhận không cần đụng tới `Category`/`Transaction` |
| `docs/kb/ba/wiki/knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md` | Rule chuyển item — xác nhận "tháng nguồn" = tháng hiện tại theo đồng hồ hệ thống (`DEC-107`) |
| `docs/kb/ba/wiki/knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md` | Rule ràng buộc tháng hiện tại mới được thao tác |
| `docs/kb/ba/wiki/data/entity/ENT-006-item-can-mua.md` | Xác nhận chưa có model Prisma |
| `docs/memory/decisions.md` (`DEC-010`, `DEC-034`, `DEC-092`..`DEC-098`, `DEC-105`..`DEC-107`) | Đối chiếu các quyết định nghiệp vụ đã chốt |
| `docs/memory/rules.md` (`R13` Light DDD) | Chuẩn kiến trúc bắt buộc cho `${SSR_SERVER_DIR}` |
| `docs/kb/dev/wiki/US-006-canh-bao-trung-thang.md` | DEV wiki của function dùng chung luồng tạo tháng |
| `server/budget/actions.ts` | Composition root — nơi export Server Action mới |
| `server/budget/application/use-cases/create-month.ts` | Use-case cần nối thêm bước chuyển item |
| `server/budget/application/use-cases/upsert-category.ts` | Mẫu use-case thêm/sửa có validate |
| `server/budget/application/use-cases/remove-category.ts` | Mẫu use-case xóa, idempotent |
| `server/budget/application/use-cases/update-transaction.ts` | Mẫu use-case sửa có validate server-side dù UI đã validate |
| `server/budget/application/use-cases/delete-transaction.ts` | Mẫu use-case xóa đơn giản, idempotent |
| `server/budget/application/use-cases/get-budget-snapshot.ts` | Use-case đọc snapshot — nơi `purchaseItems` phải được thêm vào |
| `server/budget/domain/services/budget-snapshot-service.ts` | Domain service dựng snapshot — cần mở rộng deps + output |
| `server/budget/domain/repositories/category-repository.ts` | Mẫu interface repository |
| `server/budget/domain/entities/category.ts` | Mẫu entity |
| `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Mẫu implementation repository |
| `prisma/schema.prisma` | Data model hiện tại — xác nhận chưa có `PurchaseItem` |
| `components/BudgetApp.tsx` | UI hiện tại — nơi thêm khu vực "Items cần mua"; mẫu `updateCategoryLocal`/`commitCategory` (inline edit onBlur), mẫu `startEditTransaction`/`activeTransactionId` |
| `app/budget/page.tsx` | Entry Server Component — xác nhận chỉ gọi `getBudgetSnapshot()` rồi truyền props |

Chỉ liệt kê file THỰC SỰ đã đọc.

## 3. Hành Vi Hiện Tại

Trang `/budget` (`app/budget/page.tsx`, Server Component) gọi `getBudgetSnapshot()` (Server Action, composition root `server/budget/actions.ts`) để lấy toàn bộ `BudgetSnapshot` (danh sách tháng, mỗi tháng có `categories[]` và `transactions[]`), truyền xuống `components/BudgetApp.tsx` (Client Component) làm `initialBudget`. Component client tự quản lý `selectedMonthId` (tháng đang chọn xem qua dropdown "Chọn tháng xem") và gọi lại `refreshSnapshot()` (Server Action `getBudgetSnapshot`) sau mỗi thao tác ghi. Chưa có khái niệm "Item cần mua" nào trong data model, use-case, hay UI — `BudgetSnapshot`/`MonthBudgetSnapshot` chỉ có `categories`/`transactions`.

Luồng tạo tháng mới (`createMonth`, US-006) nhận `{ monthId, sourceMonthId? }`: tạo `MonthBudget`, sao chép danh mục từ `sourceMonthId` nếu có (nếu không thì dùng `defaultCategories`), rồi `revalidatePath("/budget")`. Không có bước nào liên quan tới "tháng hiện tại theo đồng hồ hệ thống" ở tầng server — khái niệm "tháng hiện tại" hiện chỉ tồn tại ở tầng UI (`components/BudgetApp.tsx`, hàm `buildMonthPeriods`/`pickDefaultPeriod`, dùng `new Date()` để tính giá trị mặc định cho dropdown "Tạo tháng mới").

## 4. Hành Vi Mục Tiêu

Sau thay đổi:
- `BudgetSnapshot` → mỗi `MonthBudgetSnapshot` có thêm `purchaseItems: PurchaseItemSnapshot[]` (id, name, price nullable, status).
- 4 Server Action mới: `addPurchaseItem`, `updatePurchaseItem`, `markPurchaseItemPurchased`, `deletePurchaseItem` — mỗi cái tự tính "tháng hiện tại theo đồng hồ hệ thống" ở server và **chặn thao tác** (ném lỗi nghiệp vụ) nếu item mục tiêu không thuộc tháng hiện tại đó, bất kể client gửi gì.
- `createMonth` (US-006, không đổi contract input) nối thêm bước: sau khi tạo tháng + danh mục xong, tính "tháng hiện tại theo đồng hồ hệ thống" tại thời điểm gọi, rồi chuyển toàn bộ `PurchaseItem` đang `Pending` của tháng đó (đổi `monthId`) sang tháng vừa tạo — áp dụng cho cả hai nhánh "Tạo tháng" và "Clone tháng đang xem" (`DEC-098`).
- `components/BudgetApp.tsx` có thêm khu vực "Items cần mua": form thêm (tên + giá), bảng liệt kê (Tên sản phẩm — sửa inline, Giá — sửa inline, Trạng thái badge, Hành động), chỉ hiện đầy đủ điều khiển khi `selectedMonthId` trùng "tháng hiện tại" tính theo `new Date()` phía client (cùng logic hiển thị với server, không phải nguồn thẩm quyền — server vẫn là nơi chặn thật).

## 5. Luồng End-To-End

```text
Entry: components/BudgetApp.tsx (Client Component, "use client")
  -> Server Action: server/budget/actions.ts (addPurchaseItem | updatePurchaseItem | markPurchaseItemPurchased | deletePurchaseItem)
  -> Application: server/budget/application/use-cases/{add,update,mark-purchased,delete}-purchase-item.ts
       -> Domain rule: server/budget/domain/rules/purchase-item-rule.ts (tên bắt buộc, giá >= 0 nếu có)
       -> Domain rule: server/budget/domain/rules/current-month-rule.ts (getCurrentMonthId, assertMonthIsCurrent — chặn thao tác nếu item không thuộc tháng hiện tại)
  -> Repository interface: server/budget/domain/repositories/purchase-item-repository.ts
  -> Repository implementation: server/budget/infrastructure/repositories/purchase-item-prisma-repository.ts
  -> Prisma client (model PurchaseItem) -> SQLite
  -> Side effect: revalidatePath("/budget")
  -> Response: PurchaseItemEntity | void -> Client Component gọi lại refreshSnapshot() (getBudgetSnapshot)

Nhánh tạo tháng mới (dùng chung luồng US-006):
components/BudgetApp.tsx -> createMonth (Server Action, không đổi input)
  -> application/use-cases/create-month.ts
       -> (như cũ) tạo MonthBudget + Category
       -> (mới) currentMonthId = getCurrentMonthId()
       -> purchaseItemRepository.transferPendingToMonth(currentMonthId, monthId đích)
  -> revalidatePath("/budget")

Nhánh đọc:
app/budget/page.tsx (Server Component) -> getBudgetSnapshot() -> get-budget-snapshot.ts
  -> domain/services/budget-snapshot-service.ts (mở rộng: gọi thêm purchaseItemRepository.findAll())
  -> gộp purchaseItems vào từng MonthBudgetSnapshot theo monthId
  -> trả BudgetSnapshot cho Client Component render
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-006` (`Tạo tháng`/`Clone tháng đang xem`) | `server/budget/application/use-cases/create-month.ts` đã tồn tại, hoạt động, `report.md` Delivered With Notes | Không | `US-019` chỉ sửa thêm vào `create-month.ts` đã có, không tạo luồng song song |
| `US-001` (lưu trữ bền vững) | `prisma/schema.prisma`, `server/budget/infrastructure/` đã dùng Prisma + SQLite thật | Không | Đã sẵn nền tảng |
| `ssr-data` (thêm model `PurchaseItem`) | Mục 9 dưới đây — schema chưa có model này | **Có** | Phải chạy `ssr-data` trước `ssr-breaker`, tạo migration trước khi viết bất kỳ code nào đụng tới `prisma.purchaseItem.*` |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | `app/budget/page.tsx` không đổi — vẫn gọi `getBudgetSnapshot()`, kiểu dữ liệu tự mở rộng qua type suy ra |
| Server Action | Yes | Thêm 4 action mới trong `server/budget/actions.ts`; `createMonth` export giữ nguyên chữ ký |
| Route Handler (`app/api`) | N/A | Dự án không dùng Route Handler cho luồng này |
| Auth / middleware / permission | N/A | Hệ thống single-user, không có auth (`DEC-004`) |
| Prisma schema | Yes | Thêm model `PurchaseItem`, thêm quan hệ `purchaseItems` trên `MonthBudget` |
| Migration SQLite | Yes | Migration mới cho bảng `PurchaseItem` — `ssr-data` tạo |
| DBML | Yes | `docs/db/schema.dbml` cần đồng bộ lại — `ssr-data` xử lý |
| Seed data | No | Không có seed mặc định cho Item cần mua |
| Caching / revalidate | Yes | Mọi use-case ghi đều gọi `revalidatePath("/budget")`, đúng mẫu hiện có |
| Export / báo cáo | No | Spec mục 9 xác nhận không ảnh hưởng xuất JSON (US-008 riêng) |
| Mail / webhook / job nền | No | Không có, đúng `DEC-097` (không có tiến trình chạy nền theo ngày) |
| Knowledge base / memory | Yes | DEV wiki mới (`docs/kb/dev/wiki/US-019-danh-sach-can-mua.md`), cập nhật `SSR_DEV_KB_INDEX` |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry (UI) | `components/BudgetApp.tsx` | Thêm state (tên/giá nhập mới, id đang sửa inline), khu vực "Items cần mua" (form thêm + bảng), tính `currentMonthId` client-side bằng `new Date()` để quyết định hiển thị chế độ mutable/read-only |
| Application (use-case) | `server/budget/application/use-cases/add-purchase-item.ts` (mới) | Validate tên/giá, chặn nếu `monthId` không phải tháng hiện tại, tạo item `Pending`, `revalidatePath` |
| Application (use-case) | `server/budget/application/use-cases/update-purchase-item.ts` (mới) | Sửa tên/giá tại chỗ — validate, chặn nếu item không thuộc tháng hiện tại |
| Application (use-case) | `server/budget/application/use-cases/mark-purchase-item-purchased.ts` (mới) | Đổi trạng thái Pending → Purchased — chặn nếu không thuộc tháng hiện tại |
| Application (use-case) | `server/budget/application/use-cases/delete-purchase-item.ts` (mới) | Xóa, idempotent — chặn nếu không thuộc tháng hiện tại |
| Application (use-case) | `server/budget/application/use-cases/create-month.ts` (sửa) | Nối thêm bước gọi `purchaseItemRepository.transferPendingToMonth(getCurrentMonthId(), monthId)` sau khi tạo danh mục xong |
| Application (use-case) | `server/budget/application/use-cases/get-budget-snapshot.ts` | Không đổi chữ ký — chỉ nhận thêm dữ liệu từ service đã mở rộng |
| Domain rule | `server/budget/domain/rules/purchase-item-rule.ts` (mới) | `assertValidPurchaseItemName(name)`, `assertValidPurchaseItemPrice(price)` |
| Domain rule | `server/budget/domain/rules/current-month-rule.ts` (mới) | `getCurrentMonthId(): string` (tính từ `new Date()`, định dạng `YYYY-MM`, cùng công thức đã dùng ở `components/BudgetApp.tsx`/`buildMonthPeriods` và mini dashboard `DEC-034`), `assertMonthIsCurrent(monthId: string): void` |
| Domain service | `server/budget/domain/services/budget-snapshot-service.ts` (sửa) | Thêm dep `purchaseItemRepository`; thêm type `PurchaseItemSnapshot`; gộp `purchaseItems` vào từng `MonthBudgetSnapshot` |
| Domain entity | `server/budget/domain/entities/purchase-item.ts` (mới) | `PurchaseItemEntity = { id, monthId, name, price: number \| null, status: "Pending" \| "Purchased" }` |
| Repository interface (domain) | `server/budget/domain/repositories/purchase-item-repository.ts` (mới) | `findByMonth`, `findAll`, `findById`, `create`, `update`, `markPurchased`, `delete`, `transferPendingToMonth` |
| Repository implementation (infrastructure) | `server/budget/infrastructure/repositories/purchase-item-prisma-repository.ts` (mới) | Implement interface trên bằng `prisma.purchaseItem.*`; `transferPendingToMonth` dùng `updateMany` |
| Data | `prisma/schema.prisma` (sửa, do `ssr-data`) | Model `PurchaseItem` mới + quan hệ `MonthBudget.purchaseItems` |
| Consumer | `server/budget/actions.ts` | Composition root — khởi tạo `purchaseItemRepository`, nối vào 4 use-case mới + `budgetSnapshotService` + `createMonthUseCase`; export 4 Server Action mới + type liên quan |

## 9. Thay Đổi Data Model

Cần đổi schema: **Có**.

- Bắt buộc có `data-model.md` do `ssr-data` tạo, và task breakdown phải có task riêng cho migration.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `PurchaseItem` | Thêm model | `price` nullable, còn lại bắt buộc | `status` default `"Pending"` | `@@index([monthId])` | Không có — entity hoàn toàn mới, không có dữ liệu cũ cần backfill |
| `MonthBudget` | Thêm quan hệ | — | — | — | Thêm field quan hệ `purchaseItems PurchaseItem[]`, không đổi cột hiện có |

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `BudgetSnapshot` / `MonthBudgetSnapshot` (type xuất từ `server/budget/actions.ts`) | Có `categories`, `transactions` | Thêm field `purchaseItems: PurchaseItemSnapshot[]` | Không — thêm field mới, không đổi/xóa field cũ, mọi consumer hiện tại (`components/BudgetApp.tsx`) chỉ đọc field cần dùng |
| `CreateMonthInput` (Server Action `createMonth`) | `{ monthId, sourceMonthId? }` | Giữ nguyên — không thêm field | Không |
| Server Action mới: `addPurchaseItem({ monthId, name, price? })` | Chưa có | Trả về một `PurchaseItemEntity`; ném `AddPurchaseItemError` nếu tên rỗng, giá âm, hoặc `monthId` không phải tháng hiện tại | Không — API mới |
| Server Action mới: `updatePurchaseItem({ id, name?, price? })` | Chưa có | Trả về một `PurchaseItemEntity`; ném lỗi nếu không có field nào để sửa, tên rỗng, giá âm, hoặc item không thuộc tháng hiện tại | Không — API mới |
| Server Action mới: `markPurchaseItemPurchased(id: string)` | Chưa có | Trả về một `PurchaseItemEntity`; ném lỗi nếu item không thuộc tháng hiện tại hoặc đã là `Purchased` (đổi tình huống không đổi thành no-op, xem mục 13 Rủi ro) | Không — API mới |
| Server Action mới: `deletePurchaseItem(id: string)` | Chưa có | Không trả về dữ liệu; idempotent (không có thì coi như đã xóa) trừ khi item thuộc tháng khác tháng hiện tại — khi đó ném lỗi thay vì âm thầm bỏ qua, để tránh Dylan tưởng đã xóa thành công | Không — API mới |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `prisma/schema.prisma` | (Do `ssr-data`) Thêm model `PurchaseItem`, quan hệ trên `MonthBudget` |
| `server/budget/domain/entities/purchase-item.ts` | Tạo mới — `PurchaseItemEntity` |
| `server/budget/domain/repositories/purchase-item-repository.ts` | Tạo mới — interface repository |
| `server/budget/domain/rules/purchase-item-rule.ts` | Tạo mới — validate tên/giá |
| `server/budget/domain/rules/current-month-rule.ts` | Tạo mới — `getCurrentMonthId`, `assertMonthIsCurrent` |
| `server/budget/domain/services/budget-snapshot-service.ts` | Sửa — thêm dep `purchaseItemRepository`, thêm `PurchaseItemSnapshot`, gộp vào `MonthBudgetSnapshot` |
| `server/budget/infrastructure/repositories/purchase-item-prisma-repository.ts` | Tạo mới — implementation Prisma |
| `server/budget/application/use-cases/add-purchase-item.ts` | Tạo mới |
| `server/budget/application/use-cases/update-purchase-item.ts` | Tạo mới |
| `server/budget/application/use-cases/mark-purchase-item-purchased.ts` | Tạo mới |
| `server/budget/application/use-cases/delete-purchase-item.ts` | Tạo mới |
| `server/budget/application/use-cases/create-month.ts` | Sửa — nối thêm bước chuyển `PurchaseItem` Pending |
| `server/budget/actions.ts` | Sửa — khởi tạo repository/use-case mới, export 4 Server Action + type |
| `components/BudgetApp.tsx` | Sửa — thêm khu vực UI "Items cần mua" (form thêm, bảng, sửa inline, badge trạng thái, ẩn/hiện theo tháng hiện tại) |
| `docs/db/schema.dbml` | (Do `ssr-data`) Đồng bộ lại từ `schema.prisma` |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng |
| --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi — **Passed**, "No errors found" (2026-08-19) |
| Prisma | `rtk npx prisma validate` | schema hợp lệ — **Passed** (chạy ở giai đoạn `ssr-data`, 2026-08-14, không đổi lại ở `ssr-dev`) |
| Test | `rtk vitest run` | Không chạy — dự án hiện chưa có test tự động cho `server/budget` (không có file `*.test.ts` nào trong context này); verification thay thế bằng thao tác trình duyệt thật đầy đủ 10 AC, xem `task.md` `TB-08` |
| Build | `rtk next build` | pass — **Passed**, "Errors: 0 \| Warnings: 0" (2026-08-19) |
| Thủ công | Mở `/budget` ở tháng hiện tại thật (theo ngày máy chạy dev server, "2026-08"): thêm 1 item không giá, 1 item có giá; sửa tên/giá inline; đánh dấu đã mua; xóa 1 item | **Passed** — đúng như AC-01 đến AC-04, AC-08 đến AC-10; Ngân sách/Số dư (26.950.000đ) không đổi trước/sau — evidence đầy đủ ở `task.md` `TB-08` |
| Thủ công | Đổi dropdown "Chọn tháng xem" sang một tháng khác tháng hiện tại (cũ hoặc tương lai, đã tồn tại dữ liệu) | **Passed** — nhãn "Danh sách mua sắm chỉ xem", không ô nhập, bảng chỉ 3 cột (không có "Hành động"), đúng AC-05 |
| Thủ công | Bấm "Tạo tháng" rồi (ở lượt thử khác) "Clone tháng đang xem" để tạo 2 tháng mới liên tiếp, tháng hiện tại đang có item Pending | **Passed** — cả hai lượt đều thấy item Pending chuyển sang tháng mới, biến mất khỏi tháng gốc, đúng AC-06, AC-07 |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Client và server tính "tháng hiện tại" lệch nhau nếu máy chạy dev server và trình duyệt khác múi giờ/đồng hồ | Thấp | Áp dụng đúng hạn chế đã có sẵn của toàn bộ ứng dụng (mọi nơi khác cũng dùng `new Date()` không xử lý múi giờ, vd `buildMonthPeriods`) — không phải rủi ro mới riêng cho US-019; server vẫn là nơi chặn thật, UI chỉ là gợi ý hiển thị | Nếu phát sinh lệch thật, Dylan bấm thao tác bị chặn sẽ thấy thông báo lỗi rõ ràng thay vì âm thầm sai dữ liệu |
| Bấm "Tạo tháng"/"Clone tháng đang xem" thất bại giữa chừng (trùng kỳ tháng — đã có ở US-006) sau khi đã chuyển item Pending | Trung bình | Gọi `transferPendingToMonth` **sau** bước `monthBudgetRepository.create` (đã ném lỗi nếu trùng) trong cùng use-case — nếu `create` ném lỗi, hàm dừng lại trước khi tới bước chuyển item, khớp `A8` của spec (giả định hợp lý) | Không cần rollback thủ công vì thao tác dừng sớm; nếu cần rollback dữ liệu đã lỡ chuyển, cập nhật lại `monthId` của các dòng `PurchaseItem` đang `Pending` ở tháng đích về đúng tháng gốc bằng một câu lệnh `UPDATE` trực tiếp trên SQLite, thay hai giá trị kỳ tháng gốc/đích thực tế vào điều kiện |
| `markPurchaseItemPurchased` gọi trên item đã `Purchased` | Thấp | Coi là no-op, trả về item hiện tại không đổi gì — spec không yêu cầu chặn hành động lặp lại, và không có ý nghĩa nghiệp vụ để báo lỗi | Không cần rollback |
| Xóa nhầm item ở tháng hiện tại (không có hộp xác nhận theo spec) | Thấp | Đúng thiết kế đã chốt ở spec (mục 6: "không cần xác nhận thêm") — không phải rủi ro kỹ thuật cần giảm thiểu thêm | Không có undo, đúng như `US-004`/`DEC-031` (không phát triển undo cho hành động xóa trong hệ này) |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Model `PurchaseItem` + migration + DBML đồng bộ (qua `ssr-data`) | Done |
| `TB-02` | Domain layer: entity, 2 rule file, repository interface | Done |
| `TB-03` | Infrastructure: `purchase-item-prisma-repository.ts` | Done |
| `TB-04` | Application: 4 use-case mới (add/update/mark-purchased/delete) | Done |
| `TB-05` | Application: sửa `create-month.ts` nối bước chuyển item; sửa `budget-snapshot-service.ts`/`get-budget-snapshot.ts` thêm `purchaseItems` vào snapshot | Done |
| `TB-06` | Composition root: sửa `server/budget/actions.ts` export 4 Server Action mới | Done |
| `TB-07` | UI: khu vực "Items cần mua" trong `components/BudgetApp.tsx` (form thêm, bảng, sửa inline, badge, ẩn/hiện theo tháng hiện tại) | Done |
| `TB-08` | Verification: typecheck, build, kiểm thủ công đủ 10 AC | Done |
| `TB-09` | Cập nhật DEV wiki mục 7 (Verification) + memory theo kết quả `TB-08` | Done |

Readiness: **Ready** — `ssr-data` đã tạo `data-model.md` (`Status: Applied`) và áp migration `20260819080706_add_purchase_item` thành công (2026-08-14), không còn phụ thuộc chặn. `ssr-breaker` đã chia đủ 9 task, ma trận coverage đủ 10 AC — xem `task.md`.
