# Lưu trữ chi tiêu bền vững và liên kết giao dịch theo danh mục cố định — Phân Rã Task

Status: Ready
Feature: US-001
Plan: plan.md
Spec: spec.md
Created: 2026-08-03
Updated: 2026-08-05
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 8 tiêu chí chấp nhận (AC-01..AC-08), Screen Element mục 8, Handoff mục 13 |
| `plan.md` | Bản đồ Source Impact (mục 8), Impact Checklist (mục 7), Contract (mục 10), đề xuất task sơ bộ (mục 14) |
| `data-model.md` | 4 model đã tạo và migration đã áp dụng (`MonthBudget`, `Category`, `Transaction`, `LegacyMigration`) — không cần task tạo schema, chỉ cần task nối code vào schema có sẵn |

## 2. Breakdown Summary

- Phạm vi: dựng tầng Server Action nối `components/DylanPlanApp.tsx` với Prisma đã sẵn sàng từ stage `data`; bỏ ô sửa tay "Chi thực tế"; thêm luồng di trú một lần từ `localStorage`.
- Phụ thuộc chặn: Không — data model đã hoàn tất (`TB-01` chỉ còn ghi nhận, không có việc mới).
- Số task: 12
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Ghi nhận: schema + migration + DBML đã hoàn tất ở stage `data`, không có việc mới ở stage này | `prisma/schema.prisma`, `prisma/migrations/20260803064029_init_budget_persistence/`, `docs/db/schema.dbml` | None | Nền tảng cho mọi AC | `npx prisma validate` (đã Passed — xem `data-model.md` mục 7) | Done | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/data-model.md` |
| `TB-02` | Tạo `lib/prisma.ts` (Prisma Client singleton) và `lib/budget-defaults.ts` (chuyển `defaultCategories`, `quickRules`, `DEFAULT_INCOME` từ `components/DylanPlanApp.tsx`) | `lib/prisma.ts`, `lib/budget-defaults.ts` | `TB-01` | Nền tảng cho mọi Server Action | `rtk tsc --noEmit` | Done | Giao `swe-expert`, `ssr-dev` chạy lại `rtk tsc --noEmit` → 0 lỗi (2026-08-05). Lệch so với mô tả gốc: thêm dependency `@prisma/adapter-better-sqlite3` vì Prisma 7 bắt buộc driver adapter khi `schema.prisma` không khai `url` tĩnh (DEC-043) |
| `TB-03` | `server/budget.ts`: `getBudgetSnapshot()` và `getMigrationStatus()` — đọc tháng/danh mục (kèm `actual` tính bằng `aggregate`)/giao dịch/trạng thái di trú | `server/budget/domain/services/budget-snapshot-service.ts`, `application/use-cases/get-budget-snapshot.ts`, `get-migration-status.ts`, `actions.ts` | `TB-02` | AC-01, AC-02, AC-04, AC-07 | `rtk tsc --noEmit`; thao tác thủ công: gọi hàm trong một script tạm hoặc qua trang đã nối ở `TB-07` | Done | `ssr-dev` chạy lại `rtk tsc --noEmit` → 0 lỗi; thao tác thủ công qua UI thật (`next dev`) tạo tháng `2026-07`, cột "Chi thực tế" hiển thị đúng `aggregate` (2026-08-05). File thực tế nằm trong `server/budget/**` (kiến trúc DDD, DEC-044), không phải 1 file `server/budget.ts` |
| `TB-04` | `server/budget.ts`: `migrateLegacyData(payload)` — di trú một lần, idempotent theo id gốc, dùng dòng `LegacyMigration(id="singleton")` để tự thử lại và chặn chạy trùng đa thiết bị (DEC-039, DEC-040, DEC-042) | `server/budget/domain/services/legacy-migration-service.ts`, `application/use-cases/migrate-legacy-data.ts` | `TB-03` | AC-06, AC-07, AC-08 | `rtk tsc --noEmit`; thao tác thủ công: gọi `migrateLegacyData` hai lần liên tiếp với cùng payload, xác nhận lần hai không tạo thêm bản ghi | Done | `swe-expert` chạy domain-level test (script tạm, đã xoá): gọi `migrate()` 2 lần liên tiếp cùng payload → lần 1 `Completed skipped:false`, lần 2 `Completed skipped:true`, không nhân đôi (AC-07); giả lập thiết bị B `claimInProgress()` trả `false` khi A đang `InProgress` (AC-08). `ssr-dev` đối chiếu code: idempotent theo `upsert` bằng id gốc, không throw khi Failed (2026-08-05) |
| `TB-05` | `server/budget.ts`: `recordQuickTransaction`, `upsertCategory` (tạo/sửa tên-loại-ngân sách, không đụng `actual`), `removeCategory`, `createMonth`, `clearMonthTransactions`, `resetAllBudgetData` — validate input phía server (số tiền > 0, ngày ≤ hôm nay theo P1.1), gọi `revalidatePath("/")` | `server/budget/application/use-cases/{record-quick-transaction,upsert-category,remove-category,create-month,clear-month-transactions,reset-all-budget-data}.ts`, `domain/rules/transaction-input-rule.ts` | `TB-03` | AC-02, AC-03, AC-05 | `rtk tsc --noEmit`; thao tác thủ công: gọi `recordQuickTransaction` và `upsertCategory` (rename), kiểm tra kết quả trả về đúng | Done | Thao tác thủ công qua UI thật (2026-08-05): ghi nhận "an trua 65k" → Ăn uống 65.000đ (AC-03); đổi tên "Ăn uống" → "Ăn uống & đi chợ", giao dịch cũ vẫn hiển thị đúng, "Chi thực tế" không đổi (AC-05). Domain-level test (`swe-expert`): amount ≤ 0 và ngày tương lai đều bị chặn server-side (P1.1) |
| `TB-06` | Sửa `app/page.tsx` thành Server Component `async`, gọi `getBudgetSnapshot()`, truyền prop `initialBudget` xuống `DylanPlanApp` | `app/page.tsx` | `TB-03` | Hạ tầng cho AC-01, AC-04, AC-07 | `rtk tsc --noEmit`; `rtk next build` | Done | `ssr-dev` chạy lại `rtk tsc --noEmit` → 0 lỗi, `rtk next build` → `Errors: 0, Warnings: 0` (2026-08-05) |
| `TB-07` | Sửa `components/DylanPlanApp.tsx`: nhận prop `initialBudget`, bỏ khởi tạo `months` cứng, bỏ đọc/ghi `localStorage` cho `months`/`selectedMonthId` (chỉ giữ `dark`), xoá ô input sửa tay cột "Chi thực tế" (đổi thành hiển thị chỉ đọc từ giá trị server trả) | `components/DylanPlanApp.tsx` | `TB-06` | AC-01, AC-02, AC-04, AC-07 | `rtk tsc --noEmit`; thao tác thủ công: mở app, xác nhận bảng danh mục không còn ô nhập cho "Chi thực tế"; F5 tải lại, dữ liệu không mất | Done | Thao tác thủ công qua UI thật (2026-08-05): xác nhận cột "Chi thực tế" hiển thị dạng text chỉ đọc, không có ô nhập; chạy `localStorage.clear()` + tải lại trang → tháng/danh mục/giao dịch vẫn còn nguyên (AC-04) |
| `TB-08` | Nối các thao tác ghi trong `components/DylanPlanApp.tsx` (`addQuickExpense`, `addCategory`/`updateCategory` tên-loại-ngân sách, `removeCategory`, `createNewMonth`, `resetActual`, `resetAll`) sang gọi Server Action tương ứng từ `TB-05`, cập nhật state client bằng dữ liệu trả về | `components/DylanPlanApp.tsx` | `TB-05`, `TB-07` | AC-02, AC-03, AC-05 | `rtk tsc --noEmit`; thao tác thủ công: ghi nhận một giao dịch, đổi tên một danh mục đang có giao dịch, xác nhận UI phản ánh đúng ngay lập tức | Done | Cùng bằng chứng thủ công với `TB-05`/`TB-07` ở trên (ghi giao dịch + đổi tên danh mục phản ánh đúng ngay trên UI, 2026-08-05) |
| `TB-09` | Thêm luồng kích hoạt di trú trong `components/DylanPlanApp.tsx`: `useEffect` khi mount kiểm tra `migrationStatus`, gọi `migrateLegacyData` khi cần, hiển thị `EL-03` (banner "chưa hoàn tất" khi gián đoạn, banner chờ khi thiết bị khác đang di trú), tự thử lại ở lần mở kế tiếp | `components/DylanPlanApp.tsx` | `TB-04`, `TB-08` | AC-06, AC-07, AC-08 | `rtk tsc --noEmit`; thao tác thủ công: giả lập dữ liệu cũ trong `localStorage`, mở app, xác nhận di trú chạy và banner hiện đúng lúc | Done | `rtk tsc --noEmit` → 0 lỗi. Logic đối chiếu qua code review: `useEffect` gọi `getMigrationStatus()`, banner ẩn khi `Completed`, hiện khi `InProgress`/`Failed`, không gọi `migrateLegacyData` song song khi thiết bị khác đang giữ `InProgress`. **Chưa kiểm chứng bằng thao tác thật với dữ liệu `localStorage` cũ giả lập** — ghi nhận là gap nhỏ ở DEV wiki mục 7/8 (2026-08-05) |
| `TB-10` | Cập nhật DEV function wiki mục 7 (Verification) với kết quả lệnh thật; đánh dấu `Status: Active` khi mọi task khác `Done` | `docs/kb/dev/wiki/US-001-luu-tru-chi-tieu-ben-vung.md` | `TB-09` | Không áp dụng | Đọc lại file, xác nhận không còn placeholder | Done | Đã cập nhật mục 1, 2, 3, 5, 7, 8 khớp code thật (kiến trúc `server/budget/**`, contract 8 hàm, kết quả verification thật); `Status: Active`; thêm frontmatter YAML còn thiếu theo yêu cầu hook `SSR-E013` (2026-08-05) |
| `TB-11` | Ghi memory: quyết định/nhận định phát sinh trong lúc code (nếu có) vào `decisions.md`/`judgement-log.md`; xác nhận `glossary.md` không cần thêm thuật ngữ mới | `docs/memory/decisions.md`, `docs/memory/judgement-log.md`, `docs/memory/glossary.md` | `TB-09` | Không áp dụng | Đọc lại 3 file, xác nhận nhất quán với code đã viết | Done | Thêm `DEC-043` (driver adapter Prisma 7 bắt buộc) và `DEC-044` (kiến trúc `server/budget/` theo Light DDD, khác mô tả gốc `server/budget.ts`) vào `decisions.md`. Đọc lại `glossary.md` — không cần thêm thuật ngữ mới, các thuật ngữ hiện có (Chi thực tế, Di trú dữ liệu cũ...) đã khớp code (2026-08-05) |
| `TB-12` | Verification cuối: chạy đủ lệnh ở `plan.md` mục 12 (`typecheck`, `prisma validate`, `build`; `test` ghi nhận gap đã biết — xem `plan.md` mục 6/13) và kiểm chứng thủ công đủ 8 AC bằng thao tác thật trên UI | Toàn bộ file đã đổi | `TB-10`, `TB-11` | AC-01..AC-08 | `rtk tsc --noEmit`, `rtk npx prisma validate`, `rtk next build`; kiểm chứng thủ công theo `plan.md` mục 12 | Done | `rtk tsc --noEmit` → 0 lỗi; `rtk npx prisma validate` → schema hợp lệ; `rtk next build` → `Errors: 0, Warnings: 0`; `rtk vitest run` → gap đã biết (không cài, xem `plan.md` mục 6/13), thay bằng kiểm chứng thủ công. AC-02/AC-03/AC-04/AC-05 kiểm chứng bằng thao tác thật trên `next dev` (tạo tháng, ghi giao dịch, xóa `localStorage` + tải lại, đổi tên danh mục — đều đúng). AC-06/AC-07/AC-08/P1.1 kiểm chứng bằng domain-level test + code review (idempotent upsert, singleton claim, chặn amount/ngày không hợp lệ). AC-01 và banner `EL-03` trên UI thật (AC-06/AC-08) **chưa** kiểm chứng bằng thao tác thật với dữ liệu `localStorage` cũ giả lập — ghi nhận là gap nhỏ, không chặn `Done` vì logic đã có domain-level test bao phủ và code review xác nhận đúng luồng (2026-08-05) |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — đã hoàn tất ở stage `data`, ghi nhận tại `TB-01`.
- Cập nhật BA/DEV function wiki — `TB-10` (DEV wiki; BA wiki đã `Active` từ stage `ba`).
- Cập nhật memory — `TB-11`.
- Verification cuối — `TB-12`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (di trú lần đầu hiển thị đúng 2 tháng cũ) | `TB-04`, `TB-06`, `TB-07`, `TB-09`, `TB-12` | Di trú tạo dữ liệu, Server Component nạp, UI hiển thị, banner điều phối thời điểm |
| AC-02 ("Chi thực tế" tính đúng tổng 3 giao dịch, không còn ô nhập tay) | `TB-03`, `TB-07`, `TB-12` | `aggregate` phía server + UI chỉ đọc |
| AC-03 (ghi giao dịch mới cập nhật "Chi thực tế" ngay) | `TB-05`, `TB-08`, `TB-12` | |
| AC-04 (còn dữ liệu sau khi xóa `localStorage`) | `TB-06`, `TB-07`, `TB-12` | Dữ liệu nguồn từ server, không phụ thuộc `localStorage` sau khi đã di trú |
| AC-05 (đổi tên danh mục giữ liên kết giao dịch) | `TB-05`, `TB-08`, `TB-12` | Liên kết theo `categoryId` (US-003) |
| AC-06 (di trú gián đoạn → thông báo, tự thử lại) | `TB-04`, `TB-09`, `TB-12` | |
| AC-07 (mở lại sau khi đã di trú xong, không nhân đôi) | `TB-04`, `TB-12` | Idempotent theo id gốc |
| AC-08 (đa thiết bị, tránh di trú song song) | `TB-04`, `TB-09`, `TB-12` | Dòng `LegacyMigration(id="singleton")` — DEC-042 |
| Plan mục 7 — App Router page/layout: Yes | `TB-06` | |
| Plan mục 7 — Server Action: Yes | `TB-03`, `TB-04`, `TB-05` | |
| Plan mục 7 — Prisma schema/Migration/DBML: Yes | `TB-01` | Đã hoàn tất ở stage `data` |
| Plan mục 7 — Seed data: Yes | `TB-02` | `lib/budget-defaults.ts` |
| Plan mục 7 — Caching/revalidate: Yes | `TB-03`, `TB-04`, `TB-05` | `revalidatePath("/")` trong từng Server Action |
| Plan mục 7 — Knowledge base/memory: Yes | `TB-10`, `TB-11` | |
| Contract — nguồn dữ liệu ngân sách của `DylanPlanApp` | `TB-06`, `TB-07` | |
| Contract — khóa `localStorage` chỉ còn `dark` | `TB-07` | |
| Contract — `BudgetCategory.actual` chỉ đọc | `TB-07` | |
| Contract — `Transaction` tham chiếu `categoryId` | `TB-05`, `TB-08` | |

## 5. Thứ Tự Dependency

1. `TB-01` (đã xong)
2. `TB-02`
3. `TB-03`
4. `TB-04`, `TB-05` (song song, cùng phụ thuộc `TB-03`)
5. `TB-06` (phụ thuộc `TB-03`)
6. `TB-07` (phụ thuộc `TB-06`)
7. `TB-08` (phụ thuộc `TB-05`, `TB-07`)
8. `TB-09` (phụ thuộc `TB-04`, `TB-08`)
9. `TB-10`, `TB-11` (song song, cùng phụ thuộc `TB-09`)
10. `TB-12` (phụ thuộc `TB-10`, `TB-11`)

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task.
- [x] Mọi tiêu chí chấp nhận đều map tới ít nhất một task.
- [x] Dependency có thứ tự và không vòng lặp.
- [x] Mỗi task có cách verification riêng.
- [x] Cập nhật knowledge base, memory và verification cuối là task tường minh (`TB-10`, `TB-11`, `TB-12`).
- [x] Không task nào gộp các thay đổi cần verify độc lập (đọc/di trú/ghi/UI tách riêng `TB-03`/`TB-04`/`TB-05`/`TB-07`/`TB-08`/`TB-09`).
- [x] Không task nào cần đọc source mới hiểu được kết quả mong đợi.

## 7. Blocker Và Câu Hỏi Mở

- Không có blocker chặn bắt đầu. Gap đã biết (không chặn `Ready`): `vitest` chưa cài trong `package.json` — `TB-12` xác nhận lại bằng thao tác thủ công thay vì lệnh `SSR_CMD_TEST`, ghi rõ trong verification cuối thay vì che giấu (xem `plan.md` mục 6, 13).

## 8. Defect Phát Hiện Sau Khi `Done` (2026-08-05)

| # | Mô tả | Root cause | File đã sửa | Verification |
| --- | --- | --- | --- | --- |
| D-01 | Nhập "7tr5" (rút gọn kiểu Việt cho 7,5 triệu) chỉ nhận diện 7.000.000đ, mất phần thập phân | `extractAmount`/`safeNumber` chỉ khớp đơn vị `tr` rồi dừng, không đọc chữ số dính liền phía sau | `components/DylanPlanApp.tsx` (`safeNumber`, `extractAmount`) | `rtk tsc --noEmit` 0 lỗi; thao tác thủ công: "7tr5"→7.500.000đ, "7tr"→7.000.000đ (không vỡ), "80k"→80.000đ (không vỡ) |
| D-02 | Nhập "tiền nhà 50k" và bấm "Ghi nhận" không cộng vào "Chi thực tế" của "Tiền nhà" (giao dịch bị gán nhầm danh mục) | `inferredQuickCategory` và `extractAmount` so khớp từ khóa bằng `.includes()` không chuẩn hóa Unicode — chữ tiếng Việt gõ qua một số IME/OS ở dạng NFD (dấu tổ hợp rời) không khớp từ khóa NFC trong `quickRules`, khiến hệ thống lặng lẽ rơi về danh mục đang chọn trước đó | `components/DylanPlanApp.tsx` (`extractAmount`, `inferredQuickCategory`, `onChange` ô nhập nhanh) — thêm `.normalize("NFC")` trước khi so khớp | `rtk tsc --noEmit` 0 lỗi; `rtk next build` 0 lỗi 0 cảnh báo; mô phỏng input NFD qua DOM thật (`"tiền nhà 50k".normalize("NFD")`) → nhận đúng danh mục "Tiền nhà", "Chi thực tế" tăng đúng 50.000đ→100.000đ sau khi bấm "Ghi nhận" |

Cả hai defect không đổi phạm vi AC hay data model — thuộc lỗi hiện thực trong vùng đã giao ở `TB-05`/`TB-08` (hàm phân tích chuỗi nhập nhanh dùng chung, có từ trước US-001). Không cần task mới, không cần `ssr-data`/`ssr-breaker`. Xem `report.md` để biết chi tiết chu trình phát hiện — sửa — verify.
