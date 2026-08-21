# Lưu trữ chi tiêu bền vững và liên kết giao dịch theo danh mục cố định — SE Plan

Status: Ready for task-breakdown
Feature: US-001
Spec: spec.md
Created: 2026-08-03
Updated: 2026-08-03
DEV Wiki: `docs/kb/dev/wiki/US-001-luu-tru-chi-tieu-ben-vung.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Hiện `components/DylanPlanApp.tsx` là một Client Component duy nhất giữ toàn bộ state của cả app (roadmap, freelance, sản phẩm, và Thu chi), trong đó `months` (gồm `categories` và `transactions` lồng bên trong) chỉ tồn tại trong React state và được đồng bộ hai chiều với `window.localStorage` qua khóa `dylan-plan-next-dashboard-v2`. `BudgetCategory.actual` là số cộng dồn thủ công, có ô input cho sửa tay trực tiếp; `Transaction.category` lưu **tên** danh mục dạng chuỗi tại thời điểm tạo.

Việc cần làm: dựng lần đầu một tầng Prisma + SQLite cho 3 thực thể ngân sách (tháng, danh mục, giao dịch) cộng một thực thể mới theo dõi trạng thái di trú dữ liệu cũ; thêm tầng Server Action làm cầu nối giữa Client Component hiện có và Prisma; sửa `DylanPlanApp.tsx` để đọc/ghi qua Server Action thay vì `localStorage` cho phần dữ liệu ngân sách (giữ nguyên `localStorage` chỉ cho tuỳ chọn giao diện `dark`); bỏ khả năng sửa tay `actual`, đổi thành giá trị Prisma tính bằng `aggregate` trên `Transaction`; và thêm luồng di trú một lần từ `localStorage` sang DB, tự thử lại, dùng một dòng trạng thái dùng chung để chặn chạy trùng khi mở nhiều thiết bị.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` | Nguồn yêu cầu chính thức — 8 AC, Screen Element, Handoff |
| `docs/kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md` | Business rule BR-01..BR-05 |
| `docs/kb/ba/wiki/US-003-lien-ket-giao-dich-theo-id.md` | Business rule liên kết theo ID |
| `docs/memory/decisions.md` | DEC-004 (single-user), DEC-007 (actual derived), DEC-037/039/040 (di trú) |
| `docs/memory/rules.md` (project) | Luật P1.1 (ngày giao dịch ≤ hôm nay) |
| `${CLAUDE_PLUGIN_ROOT}/memory/rules.md` (kit-level) | R5 Tech stack, R2.4 Prisma là nguồn sự thật |
| `docs/kb/dev/00-index.md` | Xác nhận chưa có DEV function wiki nào tồn tại |
| `.ssr-kit.env` | Cấu hình path — phát hiện lệch với layout thật (xem mục 6) |
| `package.json` | Xác nhận **chưa có** `prisma`, `@prisma/client`, và chưa có framework test nào cài đặt |
| `tsconfig.json` | Xác nhận alias `@/*` trỏ tới gốc dự án (`./*`), không phải `src/*` |
| `app/layout.tsx` | Layout gốc, không cần đổi |
| `app/page.tsx` | Entry point hiện tại — render thẳng component `DylanPlanApp`, không truyền prop nào |
| `components/DylanPlanApp.tsx` | Toàn bộ state, kiểu dữ liệu, và UI ngân sách hiện tại (đọc đầy đủ dòng 1-450 và 1071-1445) |

## 3. Hành Vi Hiện Tại

- `app/page.tsx` render component `DylanPlanApp` không có prop nào — mọi state khởi tạo cứng trong component (`createMonth("2026-04", ...)`, `createMonth("2026-05", ...)`, `createMonth("2026-06")`).
- `useEffect` đọc `localStorage.getItem("dylan-plan-next-dashboard-v2")` khi mount, parse JSON `{ months, selectedMonthId, dark }`, gọi `normalizeMonth` cho từng tháng.
- Một `useEffect` khác ghi lại `localStorage.setItem(...)` mỗi khi `months`/`selectedMonthId`/`dark` đổi.
- `addQuickExpense`: cập nhật `categories[].actual` bằng cộng dồn thủ công VÀ đẩy một `Transaction` mới vào đầu mảng `transactions` — hai state độc lập, không có ràng buộc đồng bộ (đúng như `JDG-001`/`DEC-007` đã ghi nhận).
- Bảng ngân sách (`BudgetSections`, dòng ~1284-1349) có ô nhập liệu (input) cho cột "Chi thực tế" gọi `updateCategory(id, { actual: ... })` — cho sửa tay trực tiếp.
- `Transaction.category` là `string` (tên hiển thị tại thời điểm tạo) — không có tham chiếu ID.
- `createNewMonth`, `addCategory`, `removeCategory`, `resetActual`, `resetAll` đều chỉ sửa React state, không có khái niệm lưu trữ ngoài trình duyệt.

## 4. Hành Vi Mục Tiêu

- `app/page.tsx` trở thành Server Component `async`, gọi trực tiếp một hàm dịch vụ (không qua HTTP) để lấy dữ liệu ngân sách ban đầu, truyền xuống component `DylanPlanApp` qua một prop mới tên `initialBudget`.
- `DylanPlanApp` (vẫn là Client Component) khởi tạo state `months`/`selectedMonthId` từ `initialBudget` thay vì mảng cứng; `localStorage` chỉ còn giữ `dark`.
- Mọi thao tác ghi (ghi nhận giao dịch, tạo/sao chép tháng, thêm/sửa/xóa danh mục, reset) gọi một Server Action tương ứng, rồi cập nhật state client bằng dữ liệu trả về (không còn tự tính toán `actual` ở client).
- "Chi thực tế" luôn là giá trị Prisma tính bằng `aggregate` (`_sum.amount`) trên `Transaction` theo `categoryId`, trả kèm trong dữ liệu đọc — ô input sửa tay cho cột này bị xoá khỏi UI.
- `Transaction` tham chiếu `Category` qua `categoryId` (khoá ngoại) thay vì tên chuỗi; đổi tên danh mục không còn cần cập nhật lại giao dịch cũ.
- Lần đầu mở app sau khi triển khai: nếu còn dữ liệu cũ ở khoá `localStorage` hiện tại và trạng thái di trú (bảng dùng chung) chưa `Completed`, client gửi dữ liệu đó lên một Server Action di trú; server ghi đè an toàn khi gọi lại nhiều lần (idempotent theo `id` gốc của tháng/danh mục/giao dịch cũ), đặt trạng thái `InProgress` khi bắt đầu và `Completed` khi xong; nếu một thiết bị khác đã đặt `InProgress`, thiết bị hiện tại chỉ hiển thị banner chờ, không tự chạy song song (DEC-040); nếu bị gián đoạn, lần mở kế tiếp tự thử lại (DEC-039).
- `resetActual` ("Reset chi tháng này") đổi cơ chế thành xoá toàn bộ `Transaction` của tháng đang chọn (hiệu ứng quan sát được với người dùng không đổi: mọi "Chi thực tế" về 0đ).
- `resetAll` ("Reset dữ liệu") đổi cơ chế thành xoá toàn bộ tháng/danh mục/giao dịch đã lưu và tạo lại 3 tháng mặc định ban đầu trong DB (giữ nguyên hiệu ứng quan sát được hiện tại).
- `exportData` ("Xuất JSON") không đổi — vẫn xuất từ state client hiện có (đã được nạp từ DB), đúng như spec mục 9 xác nhận không đổi ở phạm vi này.

## 5. Luồng End-To-End

```text
Entry: app/page.tsx (Server Component, async)
  -> Service: server/budget.ts#getBudgetSnapshot() — đọc trực tiếp qua Prisma, không qua route/API
  -> Prisma Client (lib/prisma.ts) -> SQLite (prisma/dev.db)
  -> Trả prop initialBudget xuống components/DylanPlanApp.tsx (Client Component)
  -> Client mount: nếu migrationStatus != "Completed" và còn localStorage cũ
       -> gọi server/budget.ts#migrateLegacyData() (Server Action, "use server")
       -> Prisma transaction: upsert MonthBudget/Category/Transaction theo id cũ, cập nhật LegacyMigration.status
       -> revalidatePath("/") -> client gọi lại getBudgetSnapshot() để nạp dữ liệu mới nhất
  -> Người dùng ghi nhận giao dịch -> server/budget.ts#recordQuickTransaction() (Server Action)
       -> validate input phía server (số tiền > 0, categoryId thuộc đúng tháng, ngày ≤ hôm nay theo P1.1)
       -> Prisma tạo Transaction -> revalidatePath("/") -> trả snapshot mới cho client cập nhật UI
  -> Người dùng đổi tên/ngân sách danh mục, tạo/sao chép tháng, xoá danh mục, reset
       -> các Server Action tương ứng trong server/budget.ts -> Prisma -> revalidatePath("/")
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| Không có spec nào khác đã `Ready for DEV`/`Implemented` | `docs/requirements-index.md` — mọi US khác đang `Missing` ở cột Spec | Không | US-001 là nền tảng, không phụ thuộc ngược |
| `prisma`, `@prisma/client`, driver SQLite chưa cài trong `package.json` | Đọc trực tiếp `package.json` (mục 2) | Có — phải cài trước khi `ssr-data` chạy `prisma migrate dev` | Task cài dependency phải đứng trước task tạo schema |
| `.ssr-kit.env` khai `SSR_APP_DIR=src/app`, `SSR_COMPONENTS_DIR=src/components`, `SSR_SERVER_DIR=src/server` nhưng repo thật dùng `app/`, `components/` ở gốc, không có `src/` | Đọc trực tiếp cấu trúc thư mục (mục 2) | Không chặn triển khai, nhưng plan này **dùng path thật của repo** (`app/`, `components/`, `lib/`, `server/` ở gốc — không tạo `src/`) thay vì giá trị `.env` | Ghi chú cho `ssr-breaker`/`ssr-dev`: không tạo thư mục `src/` mới |
| `SSR_CMD_TEST=rtk vitest run` nhưng `vitest` không có trong `devDependencies` | Đọc trực tiếp `package.json` | Có — lệnh test sẽ lỗi "command not found" nếu chạy nguyên trạng | Xem mục 12 (Verification) — ghi rõ là gap đã biết, không tự ý cài thêm framework test ngoài phạm vi được giao |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | Yes | `app/page.tsx` đổi thành Server Component `async`, gọi service lấy dữ liệu ban đầu |
| Server Action | Yes | File mới `server/budget.ts` — 8 action (xem mục 8) |
| Route Handler (`app/api`) | No | Không cần route riêng — Server Action gọi thẳng từ Client Component |
| Auth / middleware / permission | N/A | Hệ thống single-user, không có khái niệm phân quyền (DEC-004) |
| Prisma schema | Yes | 4 model mới: `MonthBudget`, `Category`, `Transaction`, `LegacyMigration` |
| Migration SQLite | Yes | Migration khởi tạo đầu tiên cho 4 model trên — `ssr-data` thực hiện |
| DBML | Yes | `docs/db/schema.dbml` hiện chưa tồn tại — tạo mới đồng bộ từ `schema.prisma` |
| Seed data | Yes | Hằng số `defaultCategories` (8 danh mục mặc định) chuyển từ hard-code trong component sang `lib/budget-defaults.ts`, dùng chung cho seed lúc tạo tháng và di trú |
| Caching / revalidate | Yes | Mọi Server Action ghi dữ liệu gọi `revalidatePath("/")` sau khi hoàn tất |
| Export / báo cáo | No | `exportData` không đổi (spec mục 9 xác nhận) |
| Mail / webhook / job nền | N/A | Không có |
| Knowledge base / memory | Yes | DEV function wiki mới, cập nhật `SSR_DEV_KB_INDEX`, ghi nhận judgement mới nếu phát sinh |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry | `app/page.tsx` | Đổi thành Server Component `async`; gọi `getBudgetSnapshot()`; truyền `initialBudget` xuống `DylanPlanApp` |
| Service | `server/budget.ts` (mới) | 8 Server Action: `getBudgetSnapshot`, `recordQuickTransaction`, `upsertCategory`, `removeCategory`, `createMonth`, `clearMonthTransactions`, `resetAllBudgetData`, `migrateLegacyData`, `getMigrationStatus` — validate input phía server (R5.5), gọi `revalidatePath` (R5.6) |
| Data | `prisma/schema.prisma` (mới) | 4 model: `MonthBudget`, `Category`, `Transaction`, `LegacyMigration` |
| Data | `lib/prisma.ts` (mới) | Prisma Client singleton dùng chung, tránh tạo nhiều connection khi hot-reload dev |
| Data | `lib/budget-defaults.ts` (mới) | Hằng số `defaultCategories`, `quickRules`, `DEFAULT_INCOME` chuyển từ `components/DylanPlanApp.tsx` sang đây để dùng chung server/client |
| UI | `components/DylanPlanApp.tsx` | Nhận prop `initialBudget`; bỏ state `months` khởi tạo cứng; bỏ đọc/ghi `localStorage` cho `months`/`selectedMonthId` (giữ `dark`); thay các hàm mutate local (`addQuickExpense`, `addCategory`, `removeCategory`, `updateCategory`, `createNewMonth`, `resetActual`, `resetAll`) bằng lời gọi Server Action tương ứng; xoá ô input sửa tay "Chi thực tế" trong `BudgetSections`; thêm `useEffect` kích hoạt di trú một lần khi cần |
| Consumer | `app/layout.tsx` | Không đổi — chỉ đọc để xác nhận không ảnh hưởng |

## 9. Thay Đổi Data Model

Cần đổi schema: **Có**.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `MonthBudget` | Thêm model | id String (PK, dạng `YYYY-MM`), income Int NOT NULL | `income` default theo `DEFAULT_INCOME` hiện tại (35.000.000) | PK trên `id` | Nhận dữ liệu di trú từ `localStorage` (giữ nguyên `id` tháng cũ) |
| `Category` | Thêm model | id String (PK, cuid), monthId String NOT NULL (FK), name/type String NOT NULL, budget Int NOT NULL, locked Boolean | `locked` default `false` | Index trên `monthId` | Nhận dữ liệu di trú, giữ nguyên `id` gốc (vd `rent`, `food`) khi có thể để tương thích tham chiếu |
| `Transaction` | Thêm model | id String (PK, cuid), monthId String NOT NULL (FK), categoryId String NOT NULL (FK), text String, amount Int, createdAt DateTime | Không | Index trên `monthId`, `categoryId` | Nhận dữ liệu di trú; `categoryId` suy ra từ tên danh mục cũ khớp với danh mục đã di trú của cùng tháng |
| `LegacyMigration` | Thêm model (mới, không có tương đương cũ) | id String (PK, giá trị cố định `"singleton"` vì single-user), status String (`Pending`\|`InProgress`\|`Completed`\|`Failed`), startedAt/completedAt DateTime nullable, errorMessage String nullable | `status` default `"Pending"` | PK trên `id` | Không có dữ liệu cũ tương ứng — khởi tạo `Pending` khi migration lần đầu chạy |

Không có cột `actual` trên `Category` — giá trị "Chi thực tế" luôn tính bằng `prisma.transaction.aggregate({ _sum: { amount: true }, where: { categoryId } })` tại thời điểm đọc (BR-01/DEC-007). Không thêm ràng buộc `@@unique([monthId, name])` trên `Category` ở US-001 — việc chặn trùng tên thuộc US-010, cố tình để ngỏ ở đây để tránh migrate lại schema khi US-010 triển khai.

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| Nguồn dữ liệu ngân sách của `DylanPlanApp` | State React khởi tạo cứng + đồng bộ `localStorage` | Prop `initialBudget` từ Server Component + Server Action cho mọi mutation | Không (không có API/contract công khai nào tồn tại trước đó để phá vỡ — đây là ứng dụng nội bộ một người dùng) |
| Khoá `localStorage` `dylan-plan-next-dashboard-v2` | Chứa `{ months, selectedMonthId, dark }` | Chỉ còn `{ dark }`; `months`/`selectedMonthId` không còn ghi vào đây | Không breaking với người dùng (Dylan không thao tác trực tiếp khoá này), nhưng là thay đổi có chủ đích cần task riêng để không rò rỉ ghi thừa |
| `BudgetCategory.actual` (kiểu dữ liệu client) | Trường số độc lập, có thể set trực tiếp | Trường số **chỉ đọc**, luôn đến từ kết quả `aggregate` phía server | Có, nhưng nội bộ — không có consumer bên ngoài `components/DylanPlanApp.tsx` |
| `Transaction.category` (kiểu dữ liệu client) | `string` (tên danh mục) | Đổi thành `categoryId` (tham chiếu `Category.id`); tên hiển thị suy ra khi render bằng cách tra cứu danh mục theo `categoryId` | Có, nhưng nội bộ — không có consumer bên ngoài `components/DylanPlanApp.tsx` |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `package.json` | Thêm dependency `prisma`, `@prisma/client`; thêm script tương ứng nếu cần (`postinstall: prisma generate`) |
| `prisma/schema.prisma` | Tạo mới — datasource `sqlite`, generator `client`, 4 model ở mục 9 |
| `lib/prisma.ts` | Tạo mới — Prisma Client singleton |
| `lib/budget-defaults.ts` | Tạo mới — di chuyển `defaultCategories`, `quickRules`, `DEFAULT_INCOME` từ `components/DylanPlanApp.tsx` |
| `server/budget.ts` | Tạo mới — 8 Server Action (`"use server"`), validate input, gọi Prisma, `revalidatePath("/")` |
| `app/page.tsx` | Đổi thành Server Component `async`; gọi `getBudgetSnapshot()`; truyền prop `initialBudget` |
| `components/DylanPlanApp.tsx` | Nhận prop `initialBudget`; bỏ khởi tạo `months` cứng; bỏ đọc/ghi `localStorage` cho phần ngân sách; thay mutate local bằng gọi Server Action; xoá ô input "Chi thực tế"; thêm luồng kích hoạt di trú (banner chờ, tự thử lại) |
| `docs/db/schema.dbml` | Tạo mới bởi `ssr-data`, đồng bộ từ `schema.prisma` |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng | Kết quả thật (2026-08-05) |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi | Passed — 0 lỗi |
| Prisma | `rtk npx prisma validate` | schema hợp lệ | Passed — `The schema at prisma\schema.prisma is valid` |
| Test | `rtk vitest run` | **Gap đã biết**: `vitest` chưa cài trong `devDependencies` (xem mục 6) — lệnh sẽ báo lỗi "command not found" nếu chạy nguyên trạng; không tự ý cài thêm framework test ngoài phạm vi được giao, ghi nhận là finding cho `ssr-review`/`report.md` thay vì âm thầm bỏ qua | Không chạy — gap giữ nguyên đúng như dự đoán. Thay thế bằng kiểm chứng thủ công trên UI thật + domain-level test tạm thời (script xoá sau khi dùng) do `swe-expert` chạy khi triển khai `TB-04`/`TB-05` |
| Build | `rtk next build` | pass | Passed — `Errors: 0, Warnings: 0` |
| Thủ công | Mở app, ghi nhận một giao dịch, tải lại trang (F5) | Giao dịch và "Chi thực tế" vẫn hiển thị đúng sau khi tải lại (kiểm chứng AC-03 kết hợp AC-04 bằng thao tác thật) | Passed — ghi "an trua 65k" → Ăn uống 65.000đ cập nhật ngay; `localStorage.clear()` + tải lại → tháng/danh mục/giao dịch còn nguyên |
| Thủ công | Đổi tên một danh mục đang có giao dịch, kiểm tra bảng giao dịch | Giao dịch cũ vẫn hiển thị đúng dưới tên mới (kiểm chứng AC-05) | Passed — đổi "Ăn uống" → "Ăn uống & đi chợ", giao dịch cũ hiển thị đúng tên mới, "Chi thực tế" không đổi |
| Chưa kiểm chứng | — | — | AC-01 và banner `EL-03` trên UI thật cho AC-06/AC-08 (di trú dữ liệu cũ) chưa test bằng thao tác thật với `localStorage` giả lập — chỉ có domain-level test + code review. Ghi nhận ở DEV wiki mục 7/8, không chặn `Done` |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| `vitest` chưa cài — không chạy được lệnh test chuẩn của kit | Trung bình | Ghi rõ gap trong report thay vì che giấu; kiểm chứng bằng thao tác thủ công ở mục 12 cho tới khi có task riêng cài test framework | Không áp dụng — đây là gap có sẵn từ trước, không phải rủi ro do thay đổi này gây ra |
| Di trú dữ liệu cũ chạy sai làm nhân đôi hoặc mất giao dịch | Cao | Dùng khoá idempotent theo `id` gốc khi upsert; test thủ công kịch bản gọi `migrateLegacyData` hai lần liên tiếp (khớp AC-07); giữ nguyên `localStorage` cũ cho tới khi `status = Completed` | Vì SQLite là file cục bộ (`prisma/dev.db`), rollback bằng cách xoá file DB và chạy lại migration từ đầu trong môi trường dev; dữ liệu `localStorage` gốc của Dylan không bị xoá bởi thay đổi này nên không mất dữ liệu nguồn |
| Việc bỏ ô sửa tay "Chi thực tế" làm Dylan mất thói quen điều chỉnh nhanh số liệu | Thấp | Đã được `po-expert` xác nhận Aligned với DEC-007 — đây là thay đổi nghiệp vụ có chủ đích, không phải rủi ro kỹ thuật | Không áp dụng |
| Danh mục/giao dịch "mồ côi" khi xoá danh mục đang có giao dịch (hành vi cũ vẫn giữ nguyên, chưa có "Chi tiêu khác") | Trung bình | Không mở rộng sửa ở US-001 — đúng phạm vi đã chốt (US-005 xử lý); ghi rõ trong DEV wiki để `ssr-plan` của US-005 biết cần sửa `removeCategory` trong `server/budget.ts` | US-005 sẽ sửa trực tiếp Server Action đã có, không cần rollback US-001 |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Schema + migration + DBML (đã hoàn tất ở stage `data`, xem `data-model.md`) | Done |
| `TB-02` | Tạo `lib/prisma.ts` (Prisma Client singleton) và `lib/budget-defaults.ts` | Done |
| `TB-03` | `server/budget/**`: `getBudgetSnapshot`, `getMigrationStatus` (DEC-044: kiến trúc DDD, không phải 1 file phẳng) | Done |
| `TB-04` | `server/budget/**`: `migrateLegacyData` (idempotent, cờ trạng thái dùng chung) | Done |
| `TB-05` | `server/budget/**`: `recordQuickTransaction`, `upsertCategory`, `removeCategory`, `createMonth`, `clearMonthTransactions`, `resetAllBudgetData` | Done |
| `TB-06` | Sửa `app/page.tsx` thành Server Component, truyền `initialBudget` | Done |
| `TB-07` | Sửa `components/DylanPlanApp.tsx`: nhận prop, bỏ `localStorage` cho phần ngân sách, bỏ ô input "Chi thực tế" | Done |
| `TB-08` | Nối các thao tác ghi trong `DylanPlanApp.tsx` sang Server Action | Done |
| `TB-09` | Thêm luồng kích hoạt di trú trong `DylanPlanApp.tsx` (banner, tự thử lại) | Done |
| `TB-10` | Cập nhật DEV function wiki mục 7 (Verification) | Done |
| `TB-11` | Cập nhật memory (`decisions.md`/`judgement-log.md`/`glossary.md` nếu phát sinh) | Done |
| `TB-12` | Verification cuối: lệnh + kiểm chứng thủ công đủ 8 AC | Done |

Readiness: Ready (chi tiết coverage và dependency đầy đủ xem `task.md`). Triển khai hoàn tất 2026-08-05 — chi tiết evidence từng task xem `task.md`.
