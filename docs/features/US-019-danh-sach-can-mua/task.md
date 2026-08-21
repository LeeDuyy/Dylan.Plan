# Danh sách items cần mua theo tháng tại bảng thu chi — Phân Rã Task

Status: Implemented
Feature: US-019
Plan: plan.md
Spec: spec.md
Created: 2026-08-14
Updated: 2026-08-19
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 10 tiêu chí chấp nhận (AC-01 đến AC-10), mục 8 Screen Element |
| `plan.md` | Mục 5 (luồng end-to-end), mục 7 (impact checklist), mục 8 (bản đồ source impact), mục 10 (contract), mục 11 (file sẽ thay đổi) |
| `data-model.md` | Model `PurchaseItem` mới + quan hệ `MonthBudget.purchaseItems` — `Status: Applied`, migration `20260819080706_add_purchase_item` đã chạy, không còn là phụ thuộc chặn |

## 2. Breakdown Summary

- Phạm vi: thêm entity `PurchaseItem` (Item cần mua) vào bounded-context `budget`, 4 Server Action mới (thêm/sửa/đánh dấu đã mua/xóa), nối vào luồng tạo tháng có sẵn (US-006) để chuyển item Pending, mở rộng `BudgetSnapshot`, thêm khu vực UI "Items cần mua" trong `components/BudgetApp.tsx`.
- Phụ thuộc chặn: Không — `ssr-data` đã chạy xong, migration đã áp (`data-model.md` mục 7 toàn bộ `Passed`).
- Số task: 9
- Readiness: Implemented — cả 9 task `Done`, đủ 10 AC kiểm chứng qua thao tác thật (2026-08-19), `rtk tsc --noEmit` và `rtk next build` sạch

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Model `PurchaseItem` tồn tại trong DB, quan hệ với `MonthBudget`, DBML đồng bộ | `prisma/schema.prisma`, `prisma/migrations/20260819080706_add_purchase_item/`, `docs/db/schema.dbml` | None | Plan mục 7: Prisma schema / Migration SQLite / DBML = Yes | `rtk npx prisma validate` + `rtk npx prisma migrate dev` | Done | `docs/features/US-019-danh-sach-can-mua/data-model.md` mục 7 — cả 5 lệnh `Passed` (2026-08-14); migration tạo `CREATE TABLE "PurchaseItem"` + `CREATE INDEX "PurchaseItem_monthId_idx"` |
| `TB-02` | Domain layer sẵn sàng: entity, 2 rule (validate tên/giá; tính + chặn theo tháng hiện tại), interface repository | `server/budget/domain/entities/purchase-item.ts`, `server/budget/domain/rules/purchase-item-rule.ts`, `server/budget/domain/rules/current-month-rule.ts`, `server/budget/domain/repositories/purchase-item-repository.ts` | `TB-01` | Nền tảng cho AC-01, AC-02, AC-05, AC-08, AC-09, AC-10 | `rtk tsc --noEmit` biên dịch sạch riêng các file domain mới (không import Prisma — R13.2) | Done | Viết qua Codex CLI (`SSR_IMPLEMENT_EXECUTOR=codex`), `ssr-dev` đọc lại toàn bộ 4 file — đúng R13.2 (không import Prisma/infrastructure); `rtk tsc --noEmit` → "No errors found" (2026-08-19) |
| `TB-03` | `PurchaseItemRepository` có implementation Prisma đầy đủ, gồm `transferPendingToMonth` dùng một câu `updateMany` | `server/budget/infrastructure/repositories/purchase-item-prisma-repository.ts` | `TB-02` | Nền tảng cho AC-01 đến AC-10 | `rtk tsc --noEmit`; kiểm tra thủ công bằng một script gọi trực tiếp repository (vd qua `node` REPL hoặc test tạm) tạo 1 item rồi đọc lại đúng giá trị | Done | Viết qua Codex CLI, `ssr-dev` đọc lại — `transferPendingToMonth` dùng đúng 1 câu `prisma.purchaseItem.updateMany`; kiểm chứng gián tiếp qua thao tác trình duyệt thật ở `TB-08` (AC-01, AC-06, AC-07 đều đi qua đúng repository này); `rtk tsc --noEmit` → "No errors found" |
| `TB-04` | 4 use-case ghi hoạt động đúng: thêm, sửa tại chỗ, đánh dấu đã mua, xóa — mỗi cái chặn nếu `monthId`/item không thuộc tháng hiện tại | `server/budget/application/use-cases/add-purchase-item.ts`, `update-purchase-item.ts`, `mark-purchase-item-purchased.ts`, `delete-purchase-item.ts` | `TB-03` | AC-01, AC-02, AC-03, AC-04, AC-08, AC-09, AC-10; Contract 4 Server Action mới (plan mục 10) | `rtk tsc --noEmit`; gọi trực tiếp từng use-case với input hợp lệ/không hợp lệ, xác nhận đúng lỗi ném ra và đúng `revalidatePath("/budget")` được gọi | Done | Viết qua Codex CLI, `ssr-dev` đọc lại cả 4 file — mỗi use-case gọi `assertMonthIsCurrent`, ném đúng lỗi class riêng, gọi `revalidatePath("/budget")`; `markPurchaseItemPurchased` no-op đúng khi đã `Purchased`; kiểm chứng thật qua Browser tool ở `TB-08` (AC-01, AC-02, AC-03, AC-04, AC-08, AC-09, AC-10 đều Passed); `rtk tsc --noEmit` → "No errors found" |
| `TB-05` | Tạo tháng mới (cả "Tạo tháng" lẫn "Clone tháng đang xem") tự động chuyển toàn bộ `PurchaseItem` Pending của tháng hiện tại sang tháng mới; `BudgetSnapshot` có thêm `purchaseItems` cho mỗi tháng | `server/budget/application/use-cases/create-month.ts` (sửa), `server/budget/domain/services/budget-snapshot-service.ts` (sửa), `server/budget/application/use-cases/get-budget-snapshot.ts` (đối chiếu, không đổi chữ ký) | `TB-03` | AC-01 (đọc), AC-05, AC-06, AC-07; Contract `CreateMonthInput` không đổi, `BudgetSnapshot` mở rộng (plan mục 10) | `rtk tsc --noEmit`; gọi `createMonth` với dữ liệu có item Pending sẵn ở tháng hiện tại, xác nhận item xuất hiện ở tháng mới và biến mất ở tháng gốc | Done | Viết qua Codex CLI, `ssr-dev` đọc lại — `create-month.ts` gọi `purchaseItemRepository.transferPendingToMonth(getCurrentMonthId(), monthId)` ngay sau khi tạo danh mục, `CreateMonthInput` giữ nguyên chữ ký; kiểm chứng thật qua Browser tool ở `TB-08`: bấm "Tạo tháng" tạo `2026-09` → item Pending "Mua chuột không dây" chuyển sang `2026-09`, biến mất khỏi `2026-08` (AC-06 Passed); bấm "Clone tháng đang xem" tạo `2026-10` → item Pending "Mua sạc dự phòng" chuyển tương tự (AC-07 Passed); `rtk tsc --noEmit` → "No errors found" |
| `TB-06` | 4 Server Action mới export từ composition root, đúng type dùng lại được ở Client Component | `server/budget/actions.ts` (sửa) | `TB-04`, `TB-05` | Contract 4 Server Action mới + `BudgetSnapshot` (plan mục 10); Plan mục 7: Server Action = Yes | `rtk tsc --noEmit` toàn dự án | Done | Viết qua Codex CLI, `ssr-dev` đọc lại — 4 Server Action (`addPurchaseItem`, `updatePurchaseItem`, `markPurchaseItemPurchased`, `deletePurchaseItem`) export đúng, `purchaseItemRepository` nối vào `budgetSnapshotService` và `createMonthUseCase`, type `PurchaseItemSnapshot`/`PurchaseItemEntity`/`PurchaseItemStatus` re-export đầy đủ; `rtk tsc --noEmit` → "No errors found" |
| `TB-07` | Khu vực "Items cần mua" hiển thị đúng trong `components/BudgetApp.tsx`: form thêm, bảng (Tên sản phẩm/Giá sửa inline, badge Trạng thái, cột Hành động), ẩn/hiện điều khiển theo tháng hiện tại tính bằng `new Date()` | `components/BudgetApp.tsx` (sửa) | `TB-06` | AC-01 đến AC-10 (toàn bộ, ở tầng UI); mục 8 spec (EL-01 đến EL-13) | `rtk tsc --noEmit`; mở `/budget` bằng trình duyệt, đối chiếu từng ASCII Mockup mục 8.1/8.2 của spec | Done | Viết qua Codex CLI, `ssr-dev` đọc lại — `canEditPurchaseItems = selectedMonth.id === formatMonthId(new Date())` đúng công thức dùng chung với server; sửa inline theo đúng mẫu `updateCategoryLocal`/`commitCategory`; badge dùng `var(--success)`/`var(--warning)` có sẵn trong `app/globals.css`; kiểm chứng đầy đủ 10 AC qua Browser tool ở `TB-08`; `rtk tsc --noEmit` → "No errors found" |
| `TB-08` | Toàn bộ 10 AC kiểm chứng được bằng thao tác thật trên `/budget`, `next build` sạch | Toàn bộ file đã đổi ở `TB-02` đến `TB-07` | `TB-07` | AC-01 đến AC-10 (xác nhận cuối) | `rtk tsc --noEmit`, `rtk next build`; đi qua từng AC bằng Browser tool, đối chiếu đúng Given/When/Then | Done | `rtk tsc --noEmit` → "No errors found"; `rtk next build` → "Errors: 0 \| Warnings: 0"; đi qua Browser tool (localhost:3000/budget, dev server) từng AC: AC-01 thêm "Mua chuột không dây" không giá → Pending, cam/vàng (`var(--warning)`) — Passed. AC-02 thêm "Mua bàn phím cơ" giá "1tr5" → 1.500.000đ, Ngân sách/Số dư không đổi (26.950.000đ trước/sau) — Passed. AC-03 đánh dấu đã mua → badge đổi `var(--success)`, text "Purchased" — Passed. AC-04 xóa "Mua chuột Logitech" → biến mất, chỉ còn "Mua bàn phím cơ" — Passed. AC-05 đổi dropdown sang "2026-07" → nhãn "Danh sách mua sắm chỉ xem", không form thêm, bảng chỉ 3 cột (không có "Hành động") — Passed. AC-06 bấm "Tạo tháng" tạo "2026-09" → item Pending chuyển sang tháng mới, biến mất khỏi tháng gốc — Passed. AC-07 bấm "Clone tháng đang xem" tạo "2026-10" → item Pending chuyển tương tự — Passed. AC-08 để trống ô Tên sản phẩm → nút "Thêm item" `disabled: true` (kiểm bằng `element.disabled`) — Passed. AC-09 sửa tên inline "Mua chuột không dây" → "Mua chuột Logitech", lưu đúng — Passed. AC-10 sửa giá inline "1.500.000" → "2tr" → hiển thị "2,000,000", Ngân sách/Số dư không đổi — Passed. Không có lỗi console trình duyệt, không có lỗi server (`preview_logs`). Dữ liệu test đã dọn (xóa item "Mua bàn phím cơ" khỏi 2026-08 sau khi test xong); 2 tháng test "2026-09"/"2026-10" không có cách xóa qua UI (đúng thiết kế — không có tính năng xóa tháng), còn lại item Pending test bên trong, không ảnh hưởng chức năng, chỉ là dữ liệu dev thừa. |
| `TB-09` | DEV wiki mục 7 (Verification) và memory (`judgement-log.md`/`decisions.md` nếu phát sinh quyết định kỹ thuật mới trong lúc code) cập nhật đúng kết quả thật của `TB-08` | `docs/kb/dev/wiki/US-019-danh-sach-can-mua.md` (mục 7), `docs/memory/judgement-log.md`, `docs/memory/decisions.md` (nếu phát sinh) | `TB-08` | Plan mục 7: Knowledge base / memory = Yes | Đối chiếu bằng mắt: nội dung wiki khớp đúng kết quả `TB-08`, không ghi kết quả giả định | Done | DEV wiki mục 2, 3, 5, 7 cập nhật khớp code thật (2026-08-19); không phát sinh quyết định kỹ thuật mới ngoài plan — không thêm `DEC`/`JDG` mới |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — `TB-01`.
- Cập nhật BA/DEV function wiki — DEV wiki khởi tạo ở `ssr-plan`, mục 7 hoàn tất ở `TB-09`; BA wiki đã đồng bộ đủ ở `ssr-ba`/`ssr-po` (`feature.md`, `pbi.md`, `BR-022`..`BR-024`, `EPC-003`), không cần task riêng vì không còn gì đổi ở tầng BA khi code.
- Cập nhật memory — `TB-09`.
- Verification cuối — `TB-08`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (thêm item không giá, mặc định Pending) | `TB-04`, `TB-07`, `TB-08` | |
| AC-02 (thêm item có giá, ngân sách không đổi) | `TB-04`, `TB-07`, `TB-08` | Ngân sách/Chi thực tế không đổi là hệ quả tự nhiên của việc `PurchaseItem` không liên kết `Category`/`Transaction` (`TB-02`/`TB-03`), không cần logic riêng |
| AC-03 (đánh dấu đã mua) | `TB-04`, `TB-07`, `TB-08` | |
| AC-04 (xóa item) | `TB-04`, `TB-07`, `TB-08` | |
| AC-05 (tháng khác tháng hiện tại — chỉ xem) | `TB-07`, `TB-08` | Chặn thật ở `TB-04` (server), hiển thị đúng ở `TB-07` |
| AC-06 (chuyển item khi bấm "Tạo tháng") | `TB-05`, `TB-08` | |
| AC-07 (chuyển item khi bấm "Clone tháng đang xem") | `TB-05`, `TB-08` | Dùng chung logic với AC-06 — `create-month.ts` không rẽ nhánh theo `sourceMonthId` cho bước chuyển item |
| AC-08 (tên rỗng vô hiệu hóa nút Thêm item) | `TB-07`, `TB-08` | |
| AC-09 (sửa tên inline) | `TB-04`, `TB-07`, `TB-08` | |
| AC-10 (sửa giá inline) | `TB-04`, `TB-07`, `TB-08` | |
| Contract: `addPurchaseItem`/`updatePurchaseItem`/`markPurchaseItemPurchased`/`deletePurchaseItem` | `TB-04`, `TB-06` | |
| Contract: `CreateMonthInput` không đổi | `TB-05` | Xác nhận qua `tsc --noEmit` — chữ ký hàm không đổi |
| Contract: `BudgetSnapshot` mở rộng `purchaseItems` | `TB-05`, `TB-06` | |
| Plan mục 7 — Prisma schema / Migration / DBML = Yes | `TB-01` | |
| Plan mục 7 — Server Action = Yes | `TB-06` | |
| Plan mục 7 — Caching/revalidate = Yes | `TB-04`, `TB-05` | Mỗi use-case ghi tự gọi `revalidatePath("/budget")` |
| Plan mục 7 — Knowledge base/memory = Yes | `TB-09` | |

## 5. Thứ Tự Dependency

1. `TB-01`
2. `TB-02`
3. `TB-03`
4. `TB-04`, `TB-05` (có thể làm song song — cùng phụ thuộc `TB-03`, không đụng chung file)
5. `TB-06`
6. `TB-07`
7. `TB-08`
8. `TB-09`

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task.
- [x] Mọi tiêu chí chấp nhận đều map tới ít nhất một task.
- [x] Dependency có thứ tự và không vòng lặp.
- [x] Mỗi task có cách verification riêng.
- [x] Cập nhật knowledge base, memory và verification cuối là task tường minh (`TB-09`, `TB-08`).
- [x] Không task nào gộp các thay đổi cần verify độc lập (domain/infrastructure/application/composition-root/UI tách riêng theo từng lớp Light DDD).
- [x] Không task nào cần đọc source mới hiểu được kết quả mong đợi.

## 7. Blocker Và Câu Hỏi Mở

- Không có.
