---
status: Active
feature: US-001
updated: 2026-08-05
plan: docs/features/US-001-luu-tru-chi-tieu-ben-vung/plan.md
ba_wiki: docs/kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-001", "Lưu trữ chi tiêu bền vững và liên kết giao dịch theo danh mục cố định (DEV)"]
---

# US-001 — Lưu trữ chi tiêu bền vững và liên kết giao dịch theo danh mục cố định (DEV)

Status: Active
Feature: US-001
Updated: 2026-08-05
Plan: `docs/features/US-001-luu-tru-chi-tieu-ben-vung/plan.md`
BA Wiki: `docs/kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Hiện thực bằng Prisma + SQLite cho 3 thực thể ngân sách (tháng, danh mục, giao dịch) trước đây chỉ tồn tại trong React state + `localStorage` của `components/DylanPlanApp.tsx`, cộng một model theo dõi trạng thái di trú dữ liệu cũ dùng chung giữa các thiết bị. Đọc/ghi qua Server Action, tổ chức theo kiến trúc Light DDD 3 lớp (`domain/application/infrastructure`) trong `server/budget/` (DEC-044) — không phải 1 file phẳng như mô tả sơ bộ ban đầu ở `plan.md`. Không qua Route Handler riêng.

## 2. Luồng End-To-End

```text
app/page.tsx (Server Component) -> server/budget/actions.ts#getBudgetSnapshot() -> application/use-cases -> domain/services (budget-snapshot-service) -> infrastructure/repositories (Prisma) -> lib/prisma.ts -> SQLite -> prop initialBudget -> components/DylanPlanApp.tsx (Client Component) -> Server Action theo thao tác người dùng -> revalidatePath("/")
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `app/page.tsx` | Server Component, gọi `server/budget/actions.ts` trực tiếp, không qua HTTP |
| Auth | Không áp dụng | Single-user, không có phân quyền (DEC-004) |
| Composition root | `server/budget/actions.ts` | `"use server"` — nối repository → domain service → use-case, export đúng 8 hàm Server Action + type |
| Application | `server/budget/application/use-cases/*.ts` | 9 use-case (1 file = 1 hành vi), orchestrate domain service + repository, validate input, `revalidatePath("/")` |
| Domain | `server/budget/domain/{entities,rules,services,repositories}/*.ts` | TypeScript thuần, không import Prisma. `services/budget-snapshot-service.ts` tính "Chi thực tế"; `services/legacy-migration-service.ts` xử lý di trú idempotent; `rules/transaction-input-rule.ts` chặn P1.1 |
| Infrastructure | `server/budget/infrastructure/repositories/*.ts` | 4 Prisma repository, 1/entity (`MonthBudget`, `Category`, `Transaction`, `LegacyMigration`) |
| Data | `prisma/schema.prisma` | `MonthBudget`, `Category`, `Transaction`, `LegacyMigration` |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Page | `app/page.tsx` | Nạp dữ liệu ban đầu, truyền prop `initialBudget` |
| Composition root (Server Action) | `server/budget/actions.ts` | Điểm import duy nhất mà `app/page.tsx`/`DylanPlanApp.tsx` được dùng — export 8 Server Action |
| Application | `server/budget/application/use-cases/` | `get-budget-snapshot`, `get-migration-status`, `migrate-legacy-data`, `record-quick-transaction`, `upsert-category`, `remove-category`, `create-month`, `clear-month-transactions`, `reset-all-budget-data` |
| Domain | `server/budget/domain/` | `entities/` (4), `rules/transaction-input-rule.ts` (P1.1), `services/budget-snapshot-service.ts`, `services/legacy-migration-service.ts`, `repositories/` (4 interface) |
| Infrastructure | `server/budget/infrastructure/repositories/` | 4 Prisma repository (implementation của interface domain) |
| Component | `components/DylanPlanApp.tsx` | UI ngân sách, gọi Server Action qua `server/budget/actions.ts`, giữ state hiển thị, luồng di trú (banner EL-03) |
| Type / schema | `lib/budget-defaults.ts` | Hằng số dùng chung: danh mục mặc định, từ khóa nhận diện, thu nhập mặc định |
| Service | `lib/prisma.ts` | Prisma Client singleton, khởi tạo qua driver adapter `@prisma/adapter-better-sqlite3` (DEC-043) |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `MonthBudget` | `id` (PK, `YYYY-MM`), `income` | PK `id` | 1-n `Category`, 1-n `Transaction` |
| `Category` | `id`, `monthId`, `name`, `type`, `budget`, `locked` | index `monthId` | n-1 `MonthBudget`, 1-n `Transaction` |
| `Transaction` | `id`, `monthId`, `categoryId`, `text`, `amount`, `createdAt` | index `monthId`, `categoryId` | n-1 `MonthBudget`, n-1 `Category` |
| `LegacyMigration` | `id` (`"singleton"`), `status`, `startedAt`, `completedAt`, `errorMessage` | PK `id` | Không |

- Migration liên quan: `prisma/migrations/20260803064029_init_budget_persistence/`
- DBML đã đồng bộ: Có (cập nhật thủ công, không có generator DBML cài đặt) — `docs/db/schema.dbml`
- Lưu ý SQLite: `status` trên `LegacyMigration` lưu dạng `String` (không có enum gốc — R5.3), tập giá trị hợp lệ `Pending`/`InProgress`/`Completed`/`Failed`; `Category.actual` không tồn tại như cột, luôn tính bằng `aggregate` tại thời điểm đọc.
- **Prisma 7**: generator mặc định là `prisma-client` (không phải `prisma-client-js`), Prisma Client sinh ra tại `generated/prisma` (thư mục mới ở gốc dự án, ngoài `prisma/`) — import qua `@/generated/prisma`. Cấu hình đọc qua `prisma.config.ts` (không tự đọc `.env`); đã sửa `DATABASE_URL` trong `.env` thành `file:./prisma/dev.db` để khớp đúng `SSR_SQLITE_FILE` (mặc định của `prisma init` tạo `dev.db` ở gốc dự án, không đúng vị trí kit yêu cầu). `schema.prisma` không khai `url` tĩnh trong `datasource` nên `PrismaClient` bắt buộc khởi tạo qua driver adapter tại runtime (DEC-043).

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `getBudgetSnapshot()` | Trả toàn bộ tháng + danh mục (kèm `actual` tính bằng `aggregate` trên `Transaction`) + giao dịch + trạng thái di trú | `app/page.tsx`, `components/DylanPlanApp.tsx` |
| `getMigrationStatus()` | Trả trạng thái dòng `LegacyMigration(id="singleton")` hiện tại | `components/DylanPlanApp.tsx` |
| `recordQuickTransaction(input)` | Ghi một giao dịch mới sau khi validate server-side (P1.1: `amount > 0`, ngày ≤ hôm nay), trả `TransactionEntity` | `components/DylanPlanApp.tsx` |
| `upsertCategory(input)` | Tạo/sửa tên-loại-ngân sách danh mục, không đụng `actual` | `components/DylanPlanApp.tsx` |
| `removeCategory(id)` | Xoá danh mục (chặn nếu `locked`) | `components/DylanPlanApp.tsx` |
| `createMonth(input)` | Tạo tháng mới (trống hoặc sao chép danh mục từ tháng nguồn) | `components/DylanPlanApp.tsx` |
| `clearMonthTransactions(monthId)` | Xoá toàn bộ giao dịch của một tháng ("Reset chi tháng này") | `components/DylanPlanApp.tsx` |
| `resetAllBudgetData()` | Xoá toàn bộ tháng/danh mục/giao dịch, tạo lại 3 tháng mặc định | `components/DylanPlanApp.tsx` |
| `migrateLegacyData(payload)` | Di trú một lần dữ liệu `localStorage` cũ, idempotent theo id gốc, dùng dòng `LegacyMigration(id="singleton")` để chặn chạy trùng đa thiết bị (DEC-042) | `components/DylanPlanApp.tsx` |

Toàn bộ 8 hàm trên export từ composition root `server/budget/actions.ts` — đây là **điểm import duy nhất** được phép dùng ở `app/`/`components/`; không import trực tiếp `application/use-cases`, `domain/services` hay `infrastructure/repositories` từ ngoài `server/budget/`.

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| US-003 | Depends on (gộp chung spec/plan) | Toàn bộ — liên kết theo ID là một phần thiết kế của `Transaction.categoryId` |
| US-004, US-005, US-009, US-010, US-011 | Impacts | `server/budget/**` sẽ được các US này sửa tiếp (sửa/xóa giao dịch, ràng buộc danh mục, ngưỡng cấu hình, chặn trùng tên, mini dashboard) — thêm use-case/domain rule mới, không quay lại 1 file phẳng (DEC-044) |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | 0 lỗi | 2026-08-05 |
| `rtk npx prisma validate` | `The schema at prisma\schema.prisma is valid` | 2026-08-05 |
| `rtk next build` | `Errors: 0, Warnings: 0` | 2026-08-05 |
| `rtk vitest run` | Chưa cài đặt framework test trong `package.json` — gap đã biết, xem `plan.md` mục 6, 12, 13. Thay thế bằng kiểm chứng thủ công (thao tác UI thật) cho toàn bộ 8 AC | 2026-08-05 |
| Thủ công — AC-02, AC-03 | Mở app (`next dev`), tạo tháng `2026-07`, ghi nhận "an trua 65k" → tự nhận diện danh mục "Ăn uống", "Chi thực tế" cột danh mục cập nhật ngay 0đ → 65.000đ, cột hiển thị dạng text thuần chỉ đọc (class `money`), không còn ô nhập tay | 2026-08-05 |
| Thủ công — AC-04 | `localStorage.clear()` + tải lại trang → tháng `2026-07`, 8 danh mục và giao dịch "an trua 65k" vẫn hiển thị đầy đủ (dữ liệu từ Prisma/SQLite, không phụ thuộc `localStorage` sau khi đã có trong DB) | 2026-08-05 |
| Thủ công — AC-05 | Đổi tên danh mục "Ăn uống" → "Ăn uống & đi chợ" (onBlur) → giao dịch cũ hiển thị đúng tên mới, "Chi thực tế" vẫn 65.000đ, không tách thành danh mục riêng | 2026-08-05 |
| Domain-level (script tạm, đã xoá sau khi dùng, do `swe-expert` chạy khi triển khai `TB-04`/`TB-05`) — AC-06, AC-07, AC-08, P1.1 | Gọi `migrate()` 2 lần liên tiếp cùng payload: lần 1 `Completed skipped:false`, lần 2 `Completed skipped:true` (không nhân đôi — AC-07); giả lập thiết bị B `claimInProgress()` trả `false` khi thiết bị A đang `InProgress` (AC-08); `amount ≤ 0` và ngày tương lai bị chặn server-side (P1.1) | 2026-08-05 |
| Chưa kiểm chứng bằng thao tác thật (chỉ ở mức domain-level/code review) | AC-01 (2 tháng dữ liệu cũ di trú đúng số danh mục/giao dịch), AC-06/AC-08 trên UI thật (banner EL-03 hiển thị đúng lúc khi di trú gián đoạn hoặc đang chạy từ thiết bị khác) — cần dữ liệu `localStorage` cũ thật hoặc giả lập đa tab để test hết, ghi nhận là gap nhỏ cho lần review kế tiếp | 2026-08-05 |
| Defect sau `Done`, đã sửa cùng ngày (D-01, D-02 — xem `task.md` mục 8, `report.md`) | D-01: "7tr5" mất phần thập phân khi phân tích số tiền. D-02: input tiếng Việt dạng NFD (một số IME/OS) không khớp từ khóa NFC trong `quickRules`, giao dịch bị gán nhầm danh mục, "Chi thực tế" của danh mục đúng không tăng (vi phạm AC-03). Cả hai đã sửa trong `components/DylanPlanApp.tsx`, verify lại `tsc`/`build`/thao tác thật (mô phỏng NFD qua DOM) đều Passed. Xem `docs/memory/judgement-log.md#jdg-004` | 2026-08-05 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Di trú chạy sai gây nhân đôi/mất giao dịch | Cao | Xoá `prisma/dev.db` trong môi trường dev, chạy lại migration; dữ liệu gốc trong `localStorage` của Dylan không bị đổi bởi thay đổi này |
| Danh mục "mồ côi" khi xoá danh mục đang có giao dịch (hành vi cũ giữ nguyên, chưa có "Chi tiêu khác") | Trung bình | US-005 sẽ sửa trực tiếp `removeCategory` trong `server/budget/application/use-cases/remove-category.ts`, không cần rollback US-001 |
| AC-01/AC-06/AC-08 chưa kiểm chứng bằng thao tác thật trên UI (chỉ domain-level) | Thấp | `ssr-review`/lần mở app tiếp theo với dữ liệu `localStorage` cũ thật sẽ tự động kích hoạt và kiểm chứng luồng di trú đầy đủ; logic đã được domain-level test bao phủ |
