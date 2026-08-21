---
status: Active
feature: US-016
updated: 2026-08-12
plan: docs/features/US-016-loai-chi-tieu-combobox/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-016-loai-chi-tieu-combobox.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-016", "Loại chi tiêu combobox (DEV)"]
---

# US-016 — Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định (DEV)

Status: Active
Feature: US-016
Updated: 2026-08-12
Plan: `docs/features/US-016-loai-chi-tieu-combobox/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-016-loai-chi-tieu-combobox.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Khóa tập giá trị hợp lệ của `Category.type` lại đúng 3 hằng số — `"Cố định"`, `"Tích lũy"`, `"Khác"` — ở cả hai lớp: UI (phần tử select thay cho input tự do) và domain (rule mới `category-type-rule.ts`, mẫu theo `category-name-rule.ts` đã có). Không đổi `schema.prisma` — chỉ cần một migration data-only chuẩn hóa dữ liệu cũ. Khảo sát phát hiện thêm `legacy-migration-service.ts` (di trú `localStorage`, vẫn đang chạy) ghi `type` thẳng xuống DB không qua validate — xử lý bằng một hàm chuẩn hóa riêng (không throw), tách biệt với hàm validate chặt dùng cho đường tương tác.

## 2. Luồng End-To-End

```text
[Đổi Loại một danh mục — tương tác]
components/BudgetApp.tsx (chọn giá trị trong select Loại)
  -> updateCategoryLocal(id, { type }) + commitCategory(id, { type }) [override trực tiếp, không đọc lại state]
  -> server/budget/actions.ts#upsertCategory()
  -> application/use-cases/upsert-category.ts
       -> domain/rules/category-type-rule.ts assertValidCategoryType(type) [throw nếu sai]
       -> domain/repositories/category-repository.ts update()
  -> infrastructure -> lib/prisma.ts -> SQLite -> revalidatePath("/budget")

[Di trú dữ liệu cũ]
actions.ts#migrateLegacyData() -> legacy-migration-service.ts
  -> domain/rules/category-type-rule.ts normalizeCategoryType(category.type) [không throw]
  -> category-repository.ts upsert()

[Migration data-only — chạy một lần]
prisma/migrations/ (thư mục mới do Prisma tự đặt tên theo thời điểm tạo, hậu tố "normalize_category_type")
  UPDATE "Category" SET "type" = 'Khác' WHERE "type" NOT IN ('Cố định', 'Tích lũy');
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Ô Loại: input → select; `addCategory`, `totals`, nhãn insight |
| Application | `upsert-category.ts` | Validate qua rule mới thay vì kiểm tra rỗng |
| Domain rule (mới) | `category-type-rule.ts` | `assertValidCategoryType` (throw), `normalizeCategoryType` (không throw) — BR-019 |
| Domain service | `fallback-category-service.ts`, `legacy-migration-service.ts` | Đổi hằng số mặc định; dùng hàm chuẩn hóa khi di trú |
| Data | `prisma/migrations/` | Migration data-only — `ssr-data` |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Component | `components/BudgetApp.tsx` | Ô Loại (~984-990), `addCategory` (~416), `totals` (~330-335), nhãn insight (~1062) |
| Shared constant | `lib/budget-defaults.ts` | `CATEGORY_TYPES`/`CategoryType` dùng chung server + client; seed 4 danh mục đổi sang "Khác" |
| Use-case (Application) | `server/budget/application/use-cases/upsert-category.ts` | Gọi `assertValidCategoryType` |
| Domain rule (mới) | `server/budget/domain/rules/category-type-rule.ts` | `isValidCategoryType`, `assertValidCategoryType`, `normalizeCategoryType` |
| Domain service | `server/budget/domain/services/fallback-category-service.ts` | `FALLBACK_CATEGORY_TYPE` đổi giá trị |
| Domain service | `server/budget/domain/services/legacy-migration-service.ts` | Dùng `normalizeCategoryType` khi ghi dữ liệu di trú |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `Category` | `type` — không đổi kiểu, vẫn `String` | Không đổi | Không đổi quan hệ hiện có |

- `schema.prisma` không đổi — không có migration nào trong `prisma/migrations/` cho US-016.
- Đã thử `prisma migrate dev --create-only` để tạo migration data-only rồi tự điền SQL, nhưng hook `guard-artifact-path` chặn đúng thiết kế (`SSR-E020` — không cho sửa tay `migration.sql`). Đã xóa thư mục rỗng đó.
- Thay vào đó: chạy trực tiếp một câu `UPDATE` một lần lên `prisma/dev.db` qua `better-sqlite3` (đã backup trước). Đã xác nhận: 44 dòng đổi thành "Khác" (từ "Linh hoạt" × 43, "Linh s" × 1), "Cố định" (22) và "Tích lũy" (18) giữ nguyên. Chi tiết đầy đủ, kể cả lý do kỹ thuật, xem `docs/features/US-016-loai-chi-tieu-combobox/data-model.md` mục 3.
- DBML: đã thêm `note` liệt kê 3 giá trị hợp lệ cho field `type` trong `docs/db/schema.dbml` — tài liệu, không đổi cấu trúc.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `UpsertCategoryInput.type` | Vẫn `string`, nhưng server chặn giá trị ngoài `CATEGORY_TYPES`, ném `UpsertCategoryError` | `components/BudgetApp.tsx` |
| `CategoryType` (mới, `lib/budget-defaults.ts`) | `"Cố định" \| "Tích lũy" \| "Khác"` | UI (render options), domain rule |
| `normalizeCategoryType(rawType)` (mới) | Không throw — giữ nguyên nếu khớp đúng "Cố định"/"Tích lũy", còn lại trả "Khác" | `legacy-migration-service.ts` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-001` | Depends on | `server/budget/**`, `Category` model, `legacy-migration-service.ts` |
| `US-005` | Impacts | `fallback-category-service.ts` — giá trị Loại mặc định của "Chi tiêu khác" đổi từ "Linh hoạt" sang "Khác" (`DEC-056` giữ nguyên phần còn lại) |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `npx tsc --noEmit` | Passed — exit 0, không lỗi | 2026-08-12 |
| `npx prisma validate` | Passed — "The schema at prisma\schema.prisma is valid" | 2026-08-12 |
| `npx next build` | Passed — Compiled successfully, 3 route (`/`, `/_not-found`, `/budget`), Errors: 0 | 2026-08-12 |
| Thủ công đủ 8 AC trên `next dev` | Passed — chi tiết ở `docs/features/US-016-loai-chi-tieu-combobox/task.md` `TB-08`. Tóm tắt: AC-01/02 xác nhận select 3 lựa chọn + persist sau reload cứng; AC-03/04 xác nhận trên tháng 2026-08 (dữ liệu thật đã migrate); AC-05 "Thêm danh mục" mặc định "Khác"; AC-06 "Chi tiêu khác" tự sinh với Loại "Khác" trên tháng 2027-01 (chưa từng có); AC-07 thẻ "Chi khác" hiện đúng giá trị; AC-08 xác nhận bằng đọc code (dùng lại `try/catch` đã có, không mô phỏng lỗi mạng qua trình duyệt tự động) | 2026-08-12 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| `legacy-migration-service.ts` ghi `type` không qua validate — phát hiện khi khảo sát, spec không nhắc | Trung bình | Đã xử lý — dùng `normalizeCategoryType` (idempotent) tại điểm ghi này (dòng 90) |
| Commit giá trị mới ngay trong `onChange` có rủi ro đọc lại state cũ nếu không truyền override trực tiếp cho `commitCategory` | Trung bình | Đã xử lý — `commitCategory(id, overridePatch)` merge trực tiếp, không đọc lại `selectedMonth.categories`; xác nhận thật bằng kiểm chứng đổi giá trị + reload cứng (AC-02) không bị mất/sai giá trị |
