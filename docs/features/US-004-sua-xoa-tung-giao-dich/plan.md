# Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu — SE Plan

Status: Ready for task-breakdown
Feature: US-004
Spec: spec.md
Created: 2026-08-05
Updated: 2026-08-05
DEV Wiki: `docs/kb/dev/wiki/US-004-sua-xoa-tung-giao-dich.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

`server/budget/domain/repositories/transaction-repository.ts` hiện chỉ có `findAll`, `findByMonth`, `sumAmountGroupedByCategory`, `create`, `upsert` (dùng cho di trú, cần đủ `TransactionEntity`), `deleteManyByMonth` (xóa cả tháng) — **không có** thao tác sửa/xóa một bản ghi đơn lẻ. Cần thêm `findById`, `update`, `delete` vào interface này (và implementation Prisma tương ứng), theo đúng khuôn mẫu đã có ở `CategoryRepository` (đã có sẵn `findById`/`update`/`delete`).

Hai use-case mới: `updateTransaction` (sửa 4 trường, validate lại bằng domain rule đã có `transaction-input-rule.ts`, cộng kiểm tra xung đột sửa đồng thời `DEC-048` bằng cách so khớp toàn bộ giá trị hiện tại trong DB với giá trị client đã tải trước khi sửa — không cần thêm cột `updatedAt`) và `deleteTransaction` (xóa một bản ghi). Cả hai đặt trong `server/budget/application/use-cases/`, cùng bounded context `budget` đã có từ US-001 — không tạo bounded context mới, không cần `domain/services/` riêng vì đây là CRUD 1 entity có validate, giống hệt khuôn mẫu `recordQuickTransaction` (use-case gọi thẳng repository + domain rule, không phối hợp ≥ 2 entity theo nghĩa cần domain service — R13.4/R13.9).

Phía UI: `components/DylanPlanApp.tsx` khu vực "Giao dịch gần đây" (`selectedMonth.transactions.slice(0, 8)`) đã tải **toàn bộ** giao dịch của tháng từ server (`getSnapshot()` không giới hạn số dòng) — giới hạn 8 hiện tại là cắt bớt thuần phía client. AC-08 (hiển thị toàn bộ tháng) chỉ cần bỏ `.slice(0, 8)`, **không cần đổi gì ở tầng server**. Thêm state sửa/xóa theo từng dòng (`editingTransactionId`, `deletingTransactionId`, form field tạm), nút Sửa/Xóa, form mở rộng inline theo `DEC-046`, và xử lý lỗi trả về từ use-case (validate ngày tương lai, nội dung rỗng, xung đột đồng thời) hiển thị tại chỗ — đây là lần đầu component cần bắt lỗi từ một Server Action thay vì gọi rồi bỏ qua như các hàm mutate hiện có.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-004-sua-xoa-tung-giao-dich/spec.md` | Nguồn yêu cầu chính thức — 11 AC, Screen Element, Handoff |
| `docs/kb/ba/wiki/knowledge/feature/US-004-sua-xoa-tung-giao-dich.md` | Business rule BR-001..BR-005 |
| `docs/kb/ba/wiki/delivery/pbi/US-004-sua-xoa-tung-giao-dich.md` | Xác nhận 11 AC đã đồng bộ đúng spec |
| `docs/memory/decisions.md` | DEC-046 (form/hộp xác nhận inline), DEC-047 (hiển thị toàn bộ tháng), DEC-048 (xung đột sửa đồng thời), DEC-041/044 (layout thật, kiến trúc DDD `server/budget/`) |
| `docs/memory/rules.md` (project) | P1.1 (ngày giao dịch ≤ hôm nay) |
| `docs/kb/dev/00-index.md`, `docs/kb/dev/wiki/US-001-luu-tru-chi-tieu-ben-vung.md` | Xác nhận DEV wiki hiện có cho US-001, kiến trúc `server/budget/` thật đã triển khai |
| `server/budget/domain/entities/transaction.ts` | Shape `TransactionEntity` hiện tại |
| `server/budget/domain/repositories/transaction-repository.ts` | Interface hiện tại — xác nhận thiếu `findById`/`update`/`delete` đơn lẻ |
| `server/budget/domain/repositories/category-repository.ts` | Khuôn mẫu `update`/`delete`/`findById` đã có sẵn cho `Category`, dùng làm chuẩn cho `Transaction` |
| `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | Cách implement hiện tại, để nối thêm 3 hàm mới đúng khuôn mẫu |
| `server/budget/application/use-cases/record-quick-transaction.ts` | Khuôn mẫu use-case ghi giao dịch: validate domain rule, kiểm tra category thuộc đúng tháng, `revalidatePath` |
| `server/budget/domain/rules/transaction-input-rule.ts` | `assertValidTransactionAmount`, `assertTransactionDateNotInFuture` — tái dùng nguyên vẹn cho sửa |
| `server/budget/domain/services/budget-snapshot-service.ts` | Xác nhận `getSnapshot()` đọc `findAll()` không giới hạn, `TransactionSnapshot` đã có đủ `text`/`amount`/`categoryId`/`createdAt` cho client dùng làm "giá trị đã tải trước khi sửa" |
| `server/budget/actions.ts` | Composition root — nơi export Server Action mới |
| `prisma/schema.prisma` (model `Transaction`) | Xác nhận đủ trường (`text`, `amount`, `categoryId`, `createdAt`), không có `updatedAt`, không cần đổi |
| `app/page.tsx` | Xác nhận không đổi — vẫn chỉ gọi `getBudgetSnapshot()` |
| `components/DylanPlanApp.tsx` (đọc dòng 1-40, 1340-1420 — khu vực import và khu vực "Giao dịch gần đây") | Xác nhận `.slice(0, 8)` là cắt phía client; chưa có nút Sửa/Xóa; chưa có cơ chế bắt lỗi từ Server Action |

## 3. Hành Vi Hiện Tại

- `TransactionRepository` chỉ hỗ trợ tạo mới (`create`), upsert theo id gốc (dùng cho di trú), và xóa cả tháng (`deleteManyByMonth`) — không có sửa/xóa một bản ghi.
- `budget-snapshot-service.ts#getSnapshot()` đọc toàn bộ giao dịch (`findAll()`), gộp theo tháng, sắp mới nhất lên đầu — không giới hạn số dòng ở tầng server.
- `components/DylanPlanApp.tsx` khu vực "Giao dịch gần đây" (trong `QuickInputCard`, gần dòng 1350) chỉ hiển thị `selectedMonth.transactions.slice(0, 8)` — cắt bớt phía client, không có nút thao tác nào trên mỗi dòng.
- Các hàm mutate hiện có trong component (`addQuickExpense`, `commitCategory`...) gọi Server Action rồi `await refreshSnapshot()` ngay, không có `try/catch` — lỗi ném ra từ use-case sẽ trở thành unhandled rejection, không hiển thị gì cho Dylan.

## 4. Hành Vi Mục Tiêu

- `TransactionRepository` (domain) thêm 3 phương thức: `findById(id)` — trả về `TransactionEntity` hoặc `null` nếu không có; `update(id, patch)` — patch gồm `text`/`amount`/`categoryId`/`createdAt` đều optional, trả về `TransactionEntity` đã cập nhật; `delete(id)` — không trả giá trị. Implementation Prisma tương ứng dùng `prisma.transaction.findUnique`/`update`/`delete`.
- Use-case mới `updateTransaction(input)`: validate `text` không rỗng, `assertValidTransactionAmount`, `assertTransactionDateNotInFuture` (tái dùng nguyên vẹn từ `transaction-input-rule.ts`); kiểm tra `categoryId` mới thuộc đúng `monthId` (tái dùng logic như `recordQuickTransaction`); đọc bản ghi hiện tại bằng `findById`, nếu không tồn tại **hoặc** giá trị hiện tại (`text`/`amount`/`categoryId`/`createdAt`) khác với `input.expected` (giá trị client đã tải trước khi vào chế độ sửa) → ném lỗi với message đúng nguyên văn AC-11 ("Giao dịch này vừa được thay đổi ở nơi khác, hãy tải lại để xem bản mới nhất."); nếu khớp → `repository.update(id, patch)`, `revalidatePath("/")`, trả `TransactionEntity` mới.
- Use-case mới `deleteTransaction(id)`: `findById` trước, không tồn tại thì coi như đã xóa (không lỗi, idempotent), có thì `repository.delete(id)`, `revalidatePath("/")`.
- `server/budget/actions.ts` export thêm `updateTransaction`, `deleteTransaction`, cùng type `UpdateTransactionInput` (client-facing, gồm `expected`).
- `components/DylanPlanApp.tsx`:
  - Bỏ `.slice(0, 8)` — hiển thị toàn bộ `selectedMonth.transactions` (đã sort mới nhất lên đầu từ server), thêm `overflow-y: auto`/cuộn nếu cần qua CSS đã có class `transaction-list` (kiểm tra style hiện có, thêm max-height nếu chưa có).
  - Mỗi dòng giao dịch có state cục bộ xác định đang ở chế độ nào: hiển thị thường, đang sửa, hay đang xác nhận xóa. Vì tại một thời điểm chỉ một dòng ở chế độ khác "hiển thị thường", đơn giản nhất là 2 state đơn: id của dòng đang active, và chế độ hiện tại của dòng đó ("sửa" hoặc "xác nhận xóa") — quyết định cụ thể cách hiện thực để `ssr-dev` chọn khi code, không ảnh hưởng hành vi quan sát được.
  - Chế độ sửa: 4 ô nhập (nội dung, số tiền, danh mục — dropdown từ `selectedMonth.categories`, ngày — input `type="date"`) khởi tạo từ giá trị hiện tại của giao dịch; nút "Lưu" tắt khi nội dung rỗng hoặc số tiền không hợp lệ (validate phía client, gương với `assertValidTransactionAmount`); bấm "Lưu" gọi `updateTransaction` trong `try/catch`, thành công thì `refreshSnapshot()` và thoát chế độ sửa, lỗi thì hiển thị `error.message` tại chỗ (không thoát chế độ sửa, giữ nguyên input Dylan đang gõ).
  - Chế độ xác nhận xóa: hiện thông báo + 2 nút; "Xác nhận xóa" gọi `deleteTransaction` rồi `refreshSnapshot()`; "Hủy" (cả 2 chế độ) chỉ đổi state cục bộ về "view", không gọi Server Action nào.

## 5. Luồng End-To-End

```text
Entry: components/DylanPlanApp.tsx (Client Component, đã có sẵn) — nút "Sửa"/"Lưu"/"Xóa"/"Xác nhận xóa" mới trong khu vực "Giao dịch gần đây"
  -> Server Action: server/budget/actions.ts#updateTransaction() / #deleteTransaction() ("use server", mới)
  -> Application: server/budget/application/use-cases/update-transaction.ts / delete-transaction.ts (mới)
       -> Domain rule: server/budget/domain/rules/transaction-input-rule.ts (tái dùng nguyên vẹn — P1.1)
       -> Domain repository interface: server/budget/domain/repositories/transaction-repository.ts (thêm findById/update/delete)
       -> Infrastructure: server/budget/infrastructure/repositories/transaction-prisma-repository.ts (thêm findById/update/delete, mới)
       -> Prisma Client (lib/prisma.ts) -> SQLite (prisma/dev.db)
  -> revalidatePath("/") -> client gọi lại getBudgetSnapshot() (đã có, không đổi) -> refreshSnapshot() cập nhật state -> UI hiện giá trị mới hoặc thông báo lỗi
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-001` (data model `Transaction`, `Category`, tầng `server/budget/`) | Đọc trực tiếp source `server/budget/**`, `prisma/schema.prisma` — đã Delivered, đang chạy tốt | Không | US-004 chỉ thêm use-case/repository method vào bounded context đã có, không phụ thuộc chờ |
| `US-003` (`categoryId` thay vì tên) | `Transaction.categoryId` đã là khóa ngoại thật trong schema hiện tại | Không | Không cần làm gì thêm — đã sẵn |
| `US-005` (ràng buộc toàn vẹn danh mục, "Chi tiêu khác") | `docs/kb/ba/raw/US-005-*.md` — chưa có spec | Không (đã xác nhận ở spec mục 4/11 — US-004 không cần biết "Chi tiêu khác") | Không ảnh hưởng thứ tự |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | `app/page.tsx` không đổi |
| Server Action | Yes | `server/budget/actions.ts` thêm export `updateTransaction`, `deleteTransaction` |
| Route Handler (`app/api`) | N/A | Không dùng route riêng, giống các mutation khác trong dự án |
| Auth / middleware / permission | N/A | Single-user, không có phân quyền (DEC-004) |
| Prisma schema | No | `Transaction` đã đủ trường; xung đột sửa đồng thời xử lý bằng so khớp giá trị, không cần cột mới |
| Migration SQLite | No | Không đổi schema |
| DBML | No | Không đổi schema |
| Seed data | No | Không đổi `lib/budget-defaults.ts` |
| Caching / revalidate | Yes | `updateTransaction`/`deleteTransaction` đều gọi `revalidatePath("/")` sau khi ghi |
| Export / báo cáo | No | `exportData` không đổi (spec mục 9 xác nhận) |
| Mail / webhook / job nền | N/A | Không có |
| Knowledge base / memory | Yes | DEV function wiki mới cho US-004; `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry | `components/DylanPlanApp.tsx` | Bỏ `.slice(0, 8)`; thêm state chế độ dòng (view/edit/confirm-delete); thêm nút Sửa/Xóa, form inline, xử lý lỗi try/catch cho `updateTransaction`/`deleteTransaction` |
| Composition root (Server Action) | `server/budget/actions.ts` | Thêm import + export `updateTransaction`, `deleteTransaction`; re-export type `UpdateTransactionInput` |
| Application (use-case) | `server/budget/application/use-cases/update-transaction.ts` (mới) | Validate 4 trường, kiểm tra category thuộc tháng, kiểm tra xung đột đồng thời (`DEC-048`), gọi repository, `revalidatePath` |
| Application (use-case) | `server/budget/application/use-cases/delete-transaction.ts` (mới) | Xóa một bản ghi (idempotent nếu đã không còn), `revalidatePath` |
| Domain service / rule | Không cần domain service mới — CRUD 1 entity có validate, tái dùng `domain/rules/transaction-input-rule.ts` nguyên vẹn (R13.9) | — |
| Repository interface (domain) | `server/budget/domain/repositories/transaction-repository.ts` | Thêm `findById`, `update`, `delete` vào interface (khuôn mẫu giống `category-repository.ts`) |
| Repository implementation (infrastructure) | `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | Thêm implementation Prisma cho 3 hàm mới |
| Data | `prisma/schema.prisma` | Không đổi |
| UI | `components/DylanPlanApp.tsx` | (trùng dòng Entry ở trên — cùng một file) |
| Consumer | Không có file nào khác import trực tiếp `TransactionRepository`/`transaction-prisma-repository.ts` ngoài `server/budget/actions.ts` | Không ảnh hưởng |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

Model `Transaction` hiện có đủ `id`, `monthId`, `categoryId`, `text`, `amount`, `createdAt` — đủ cho cả sửa (cập nhật 4 trường) lẫn xóa. Việc phát hiện "giao dịch vừa bị đổi/xóa ở nơi khác" (`DEC-048`, AC-11) không cần thêm cột `updatedAt`/version: use-case `updateTransaction` tự so khớp toàn bộ giá trị hiện tại đọc được từ `findById` với giá trị `expected` mà client gửi kèm (chính là giá trị `TransactionSnapshot` client đã tải lần gần nhất trước khi Dylan bấm "Sửa") — khác bất kỳ trường nào, hoặc không tìm thấy bản ghi, đều coi là xung đột.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `Transaction` | Không đổi | — | — | — | Không có |

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `server/budget/actions.ts` — danh sách export | 8 Server Action (US-001) | Thêm `updateTransaction`, `deleteTransaction` (10 tổng) | Không — chỉ thêm, không đổi chữ ký hàm cũ |
| `TransactionRepository` (interface domain) | 6 phương thức | Thêm `findById`, `update`, `delete` (9 tổng) | Không — chỉ thêm, implementation cũ (`transaction-prisma-repository.ts`) vẫn tương thích vì TypeScript interface mở rộng không phá vỡ hàm đã có |
| Hành vi mutate trong `DylanPlanApp.tsx` | Gọi Server Action, không bắt lỗi | Có lỗi thì bắt và hiển thị `error.message` tại dòng đang sửa/xóa | Không breaking với người dùng — chỉ thêm phản hồi khi trước đây im lặng thất bại |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `server/budget/domain/repositories/transaction-repository.ts` | Thêm `findById(id)`, `update(id, patch)`, `delete(id)` vào interface; thêm type `UpdateTransactionInput` |
| `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | Thêm implementation Prisma cho 3 hàm mới |
| `server/budget/application/use-cases/update-transaction.ts` | Tạo mới — validate, kiểm tra xung đột, gọi repository, `revalidatePath` |
| `server/budget/application/use-cases/delete-transaction.ts` | Tạo mới — xóa idempotent, `revalidatePath` |
| `server/budget/actions.ts` | Thêm wiring cho 2 use-case mới, export Server Action + type |
| `components/DylanPlanApp.tsx` | Bỏ giới hạn 8 dòng; thêm nút Sửa/Xóa, form sửa inline, xác nhận xóa inline, xử lý lỗi hiển thị tại chỗ |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng | Kết quả thật (2026-08-05) |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi | Passed — 0 lỗi |
| Prisma | `rtk npx prisma validate` | schema hợp lệ (không đổi, chỉ xác nhận vẫn hợp lệ) | Passed |
| Test | `rtk vitest run` | **Gap đã biết** (giống US-001): `vitest` chưa cài trong `devDependencies` — không tự ý cài thêm, thay bằng kiểm chứng thủ công | Không chạy — gap giữ nguyên, thay bằng thao tác thủ công dưới đây |
| Build | `rtk next build` | pass | Passed — `Errors: 0, Warnings: 0` |
| Thủ công | Sửa nội dung + số tiền một giao dịch, bấm Lưu | Giá trị mới hiển thị ngay, "Chi thực tế" danh mục liên quan cập nhật đúng (AC-02) | Passed — 50.000→60.000đ, Chi thực tế 50.000→110.000đ |
| Thủ công | Sửa danh mục của một giao dịch, bấm Lưu | "Chi thực tế" danh mục cũ giảm, danh mục mới tăng đúng (AC-03) | Passed — amount di chuyển đúng giữa 2 danh mục theo aggregate |
| Thủ công | Sửa ngày sang tương lai, bấm Lưu | Bị chặn, báo lỗi tại chỗ, giao dịch không đổi (AC-04) | Passed — báo "Ngày giao dịch không được sau ngày hôm nay.", giao dịch giữ nguyên |
| Thủ công | Xóa một giao dịch, xác nhận | Giao dịch biến mất, "Chi thực tế" giảm đúng (AC-06) | Passed — 110.000→50.000đ |
| Thủ công | Tạo tháng có > 8 giao dịch | Toàn bộ hiển thị, không dừng ở 8 dòng (AC-08) | Passed — 10/10 giao dịch hiển thị |
| Thủ công | Mở 2 tab cùng sửa/xóa 1 giao dịch (giả lập bằng script Prisma xóa thẳng DB trong lúc form Sửa đang mở) | Lần `updateTransaction` sau báo đúng lỗi xung đột, không ghi đè (AC-11) | Passed — đúng thông báo, DB xác nhận không tạo lại bản ghi |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| So khớp toàn bộ giá trị để phát hiện xung đột (thay vì cột version) có thể false-positive nếu client gửi `expected` không khớp định dạng lưu trong DB (vd làm tròn số, format ngày) | Trung bình | Dùng đúng kiểu dữ liệu `TransactionSnapshot` đã chuẩn hóa (client không tự parse lại); `ssr-dev` viết test thủ công gọi 2 lần liên tiếp với `expected` đúng để xác nhận không false-positive trước khi coi AC-11 đạt | Nếu sai nhiều, có thể nới thành chỉ kiểm tra tồn tại (bỏ so khớp giá trị), báo lại `ssr-ba` để cập nhật spec nếu cần đổi phạm vi `DEC-048` |
| `vitest` chưa cài — không chạy được lệnh test chuẩn của kit | Trung bình | Giống US-001: kiểm chứng bằng thao tác thủ công ở mục 12, ghi rõ gap trong report | Không áp dụng — gap có sẵn từ trước |
| Component `DylanPlanApp.tsx` đã khá lớn (~1600 dòng), thêm state theo dòng có thể làm re-render toàn bảng khi gõ | Thấp | Không tối ưu performance ở phạm vi này trừ khi thực sự chậm khi test thủ công; ghi nhận là follow-up nếu phát sinh | Không áp dụng |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | `transaction-repository.ts` + `transaction-prisma-repository.ts`: thêm `findById`/`update`/`delete` | Done |
| `TB-02` | `application/use-cases/update-transaction.ts`: validate + kiểm tra xung đột + gọi repository | Done |
| `TB-03` | `application/use-cases/delete-transaction.ts`: xóa idempotent | Done |
| `TB-04` | `server/budget/actions.ts`: export `updateTransaction`, `deleteTransaction` | Done |
| `TB-05` | `components/DylanPlanApp.tsx`: bỏ giới hạn 8 dòng (AC-08), xác nhận vẫn đúng khi tháng trống (AC-09) | Done |
| `TB-06` | `components/DylanPlanApp.tsx`: nút Sửa + form sửa inline (AC-01, AC-02, AC-03, AC-04, AC-07, AC-10) | Done |
| `TB-07` | `components/DylanPlanApp.tsx`: nút Xóa + xác nhận inline (AC-05, AC-06) | Done |
| `TB-08` | `components/DylanPlanApp.tsx`: xử lý lỗi xung đột đồng thời hiển thị tại chỗ (AC-11) | Done |
| `TB-09` | Cập nhật DEV function wiki mục 7 (Verification) | Done |
| `TB-10` | Cập nhật memory (`decisions.md`/`judgement-log.md` nếu phát sinh trong lúc code) | Done |
| `TB-11` | Verification cuối: lệnh + kiểm chứng thủ công đủ 11 AC | Done |

Readiness: Ready. Triển khai hoàn tất 2026-08-05 — chi tiết evidence từng task xem `task.md`.
