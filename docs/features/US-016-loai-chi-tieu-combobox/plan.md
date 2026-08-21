# Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định — SE Plan

Status: Implemented
Feature: US-016
Spec: spec.md
Created: 2026-08-11
Updated: 2026-08-12
DEV Wiki: `docs/kb/dev/wiki/US-016-loai-chi-tieu-combobox.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Trường `Category.type` (cột "Loại") hiện là chuỗi tự do, chỉ được validate "không rỗng" ở `upsert-category.ts`. Thay đổi này khóa tập giá trị hợp lệ lại đúng 3 hằng số cố định — `"Cố định"`, `"Tích lũy"`, `"Khác"` — ở hai lớp: UI (client chỉ render phần tử select, không còn phần tử input tự do) và domain (một rule mới chặn giá trị sai ngay tại use-case). Không đổi cấu trúc `schema.prisma` (field `type` vẫn là `String`), nhưng cần một migration **data-only** (không đổi field/model) để chuẩn hóa 44 dòng dữ liệu cũ đang lệch chuẩn (`"Linh hoạt"` × 43, `"Linh s"` × 1) thành `"Khác"`.

Khảo sát phát hiện thêm một điểm spec không đề cập: `legacy-migration-service.ts` (di trú dữ liệu `localStorage` cũ, `DEC-039`/`DEC-040`, vẫn đang chạy) ghi thẳng `type: category.type` từ payload client xuống DB, không đi qua `upsert-category.ts` — nếu không xử lý, đường này vẫn có thể ghi giá trị Loại rác vào DB **sau khi** tính năng này triển khai, vô hiệu hóa toàn bộ mục tiêu của US-016. Plan này bổ sung một hàm chuẩn hóa (không throw) dùng riêng cho đường di trú, tách biệt với hàm validate chặt (throw) dùng cho đường nhập liệu tương tác — xem mục 4, 8.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-016-loai-chi-tieu-combobox/spec.md` | Nguồn 8 AC, Screen Element, handoff mục 13 |
| `docs/kb/ba/wiki/knowledge/feature/US-016-loai-chi-tieu-combobox.md` | Đối chiếu mục tiêu, luồng nghiệp vụ, business rule |
| `docs/kb/ba/wiki/delivery/pbi/US-016-loai-chi-tieu-combobox.md` | Đối chiếu 8 AC |
| `docs/kb/ba/wiki/knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md` | Nội dung rule, quy tắc migrate dữ liệu cũ |
| `docs/memory/decisions.md` (`DEC-004`, `DEC-056`, `DEC-058`, `DEC-073`) | Business rule "Chi tiêu khác", quy ước layout thư mục |
| `docs/kb/dev/wiki/US-005-rang-buoc-toan-ven-danh-muc.md`, `US-014-chi-tieu-khac-cuoi-bang.md` | Kiến trúc bounded context hiện tại, quy ước Contract/Verification |
| `prisma/schema.prisma` | Xác nhận `Category.type` vẫn là `String`, không có ràng buộc enum |
| `prisma/dev.db` (query `GROUP BY type`, 2026-08-11) | Xác nhận 4 giá trị thật đang tồn tại — bằng chứng cho migration data-only |
| `server/budget/actions.ts` | Composition root, danh sách use-case hiện có |
| `server/budget/application/use-cases/upsert-category.ts` | Hành vi validate `type` hiện tại (chỉ kiểm tra không rỗng) |
| `server/budget/application/use-cases/create-month.ts` | Xác nhận chỉ đọc `defaultCategories`, không hard-code `"Linh hoạt"` trực tiếp |
| `server/budget/domain/entities/category.ts` | `CategoryEntity.type: string` — không đổi kiểu |
| `server/budget/domain/repositories/category-repository.ts` | `CreateCategoryInput.type: string`, `UpdateCategoryInput` — không đổi chữ ký |
| `server/budget/domain/rules/category-name-rule.ts` | Mẫu tham chiếu cho domain rule mới (`category-type-rule.ts`) — cùng kiểu assert + custom Error |
| `server/budget/domain/services/fallback-category-service.ts` | `FALLBACK_CATEGORY_TYPE = "Linh hoạt"` (`DEC-056`) — nơi cần đổi sang `"Khác"` |
| `server/budget/domain/services/legacy-migration-service.ts` (dòng 60-104) | Phát hiện đường ghi `type` không qua `upsert-category.ts` — rủi ro tái phát sinh dữ liệu rác |
| `lib/budget-defaults.ts` | 8 danh mục mặc định thật (không phải 5 như raw mô tả sơ bộ) — xác nhận đúng 4 dòng `"Linh hoạt"` (`food`, `transport`, `coffee`, `health`); `"saving"` và `"backup"` đã là `"Tích lũy"`, không cần đổi |
| `components/BudgetApp.tsx` (dòng 1-45, 320-420, 940-1070) | Vị trí chính xác: `totals` (330-335), `updateCategoryLocal`/`commitCategory` (367-396), `addCategory` (414-422), bảng danh mục — ô Loại (984-990), khu vực Insight (1058-1069) |
| `docs/db/schema.dbml` | Xác nhận `type text [not null]` chưa có `note` liệt kê giá trị hợp lệ — cơ hội bổ sung tài liệu, không phải thay đổi cấu trúc |

## 3. Hành Vi Hiện Tại

- **Nhập "Loại"** (`components/BudgetApp.tsx:984-990`): một phần tử input chữ tự do, `onChange` cập nhật state cục bộ, `onBlur` gọi `commitCategory` để lưu lên server. Không có ràng buộc giá trị.
- **Validate ở server** (`upsert-category.ts`): chỉ kiểm tra `type` sau khi `trim()` không rỗng — chấp nhận bất kỳ chuỗi nào.
- **Giá trị mặc định khi tạo mới**: 3 nơi hard-code chuỗi `"Linh hoạt"` — `lib/budget-defaults.ts` (4 danh mục: `food`, `transport`, `coffee`, `health`), `components/BudgetApp.tsx:416` (`addCategory`), `fallback-category-service.ts:9` (`FALLBACK_CATEGORY_TYPE`, khi tự sinh "Chi tiêu khác").
- **Di trú dữ liệu cũ** (`legacy-migration-service.ts:89`): ghi thẳng `type: category.type` từ payload `localStorage` xuống DB qua `categoryRepository.upsert`, không qua `upsert-category.ts`, không có ràng buộc nào.
- **Thẻ insight "Chi linh hoạt"** (`components/BudgetApp.tsx:333-335,1062`): `totals.flexible` tính bằng `/linh/i.test(item.type)`; nhãn hiển thị cố định là chuỗi `"Chi linh hoạt"` trong mảng render.
- **Dữ liệu thật** (`prisma/dev.db`): `Category.type` có 4 giá trị — `"Cố định"` (22), `"Linh hoạt"` (43), `"Tích lũy"` (18), `"Linh s"` (1, lỗi gõ dở dang).

## 4. Hành Vi Mục Tiêu

- Ô "Loại" trên bảng danh mục là phần tử select với đúng 3 lựa chọn — `"Cố định"`, `"Tích lũy"`, `"Khác"` — không còn phần tử input tự do; chọn xong lưu ngay (không cần rời ô).
- Server chặn cứng giá trị ngoài 3 lựa chọn qua một domain rule mới (`assertValidCategoryType`), áp dụng cho đường nhập liệu tương tác (`upsert-category.ts`).
- Đường di trú dữ liệu cũ (`legacy-migration-service.ts`) dùng một hàm **chuẩn hóa** riêng (`normalizeCategoryType`, không throw) — giữ nguyên nếu khớp đúng `"Cố định"`/`"Tích lũy"`, còn lại quy về `"Khác"`. Hai hàm khác ngữ nghĩa: đường tương tác (Dylan chỉ chọn được từ combobox, không bao giờ nên sai) validate chặt và ném lỗi nếu sai; đường di trú thụ động (dữ liệu lịch sử không đoán trước được) chuẩn hóa không throw, để một giá trị lạ trong dữ liệu cũ không làm vỡ cả lượt di trú tháng đó.
- 3 nơi hard-code `"Linh hoạt"` đổi thành `"Khác"`.
- Toàn bộ 44 dòng dữ liệu `Category.type` hiện đang là `"Linh hoạt"` hoặc `"Linh s"` được chuyển thành `"Khác"` qua một migration data-only, chạy một lần.
- Thẻ insight đổi tên thành `"Chi khác"`, tính bằng `item.type === "Khác"` thay vì so khớp chuỗi.

## 5. Luồng End-To-End

```text
[Đổi Loại một danh mục — tương tác]
components/BudgetApp.tsx (chọn giá trị trong phần tử select Loại)
  -> updateCategoryLocal(id, { type }) [cập nhật state cục bộ ngay]
  -> commitCategory(id, { type }) [gọi ngay trong cùng onChange, KHÔNG đợi onBlur — truyền
     override trực tiếp, không đọc lại state vừa set (tránh đọc giá trị cũ do setState bất đồng bộ)]
  -> server/budget/actions.ts#upsertCategory()
  -> application/use-cases/upsert-category.ts
       -> domain/rules/category-type-rule.ts assertValidCategoryType(type) [throw UpsertCategoryError nếu sai]
       -> domain/rules/category-name-rule.ts (không đổi, vẫn chạy kèm)
       -> domain/repositories/category-repository.ts update()
  -> infrastructure/repositories/category-prisma-repository.ts -> lib/prisma.ts -> SQLite
  -> revalidatePath("/budget") -> client refreshSnapshot()
  -> lỗi (nếu có): setToastMessage + refreshSnapshot() [đã có sẵn — tự khôi phục giá trị cũ, thỏa AC-08]

[Di trú dữ liệu cũ từ localStorage]
components/BudgetApp.tsx (banner di trú) -> actions.ts#migrateLegacyData(payload)
  -> domain/services/legacy-migration-service.ts
       -> domain/rules/category-type-rule.ts normalizeCategoryType(category.type) [không throw]
       -> domain/repositories/category-repository.ts upsert()
  -> infrastructure -> Prisma -> SQLite

[Migration data-only — chạy một lần lúc triển khai, không qua UI]
prisma/migrations/ (thư mục mới do Prisma tự đặt tên theo thời điểm tạo, hậu tố "normalize_category_type") /migration.sql
  UPDATE "Category" SET "type" = 'Khác' WHERE "type" NOT IN ('Cố định', 'Tích lũy');
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — đổi ô Loại từ phần tử input sang phần tử select, đổi `addCategory`, `totals`, nhãn insight |
| Auth | Không áp dụng | Single-user (`DEC-004`) |
| Composition root | `server/budget/actions.ts` | Không đổi chữ ký — `upsertCategory` giữ nguyên contract, chỉ đổi hành vi validate bên trong |
| Application | `upsert-category.ts` | Gọi `assertValidCategoryType` thay vì kiểm tra rỗng |
| Domain rule (mới) | `category-type-rule.ts` | `assertValidCategoryType` (throw), `normalizeCategoryType` (không throw) — BR-019 |
| Domain service | `fallback-category-service.ts`, `legacy-migration-service.ts` | Đổi hằng số mặc định; dùng `normalizeCategoryType` khi di trú |
| Data | `prisma/migrations/` | Migration data-only — việc của `ssr-data` |
| Shared constant | `lib/budget-defaults.ts` | Thêm `CATEGORY_TYPES`/`CategoryType` dùng chung server + client (theo đúng quy ước hiện có của file này) |

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-001` (data model bền vững) | `prisma/schema.prisma`, đã Delivered | Không | Đã xong, dùng lại nguyên trạng |
| `US-005` (`fallback-category-service.ts`, `DEC-056`) | `server/budget/domain/services/fallback-category-service.ts:9` | Không | Đã xong — US-016 chỉ đổi giá trị hằng số, không đổi cấu trúc |
| `ssr-data` (migration data-only) | Mục 9 dưới đây | Có — phải chạy trước `ssr-breaker`/`ssr-dev` (dữ liệu cũ phải sạch trước khi UI mới ra mắt, tránh cửa sổ thời gian hiển thị "Linh hoạt" không khớp option nào) | Trước toàn bộ task domain/application/UI |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | `app/budget/page.tsx` không đổi |
| Server Action | No | `upsertCategory` giữ nguyên chữ ký (`UpsertCategoryInput` không đổi field) — chỉ đổi hành vi validate bên trong |
| Route Handler (`app/api`) | N/A | Không có route handler trong bounded context này |
| Auth / middleware / permission | N/A | Single-user, không áp dụng |
| Prisma schema | No | `Category.type` giữ nguyên kiểu `String`, không thêm/sửa/xóa field |
| Migration SQLite | Yes | **Không phải migration có version** — `ssr-data` đã backfill trực tiếp 44 dòng dữ liệu cũ qua `better-sqlite3` (không đi qua `prisma/migrations/`, xem `JDG-018`); đã thực hiện xong (2026-08-11) |
| DBML | Yes | Thêm `note` liệt kê 3 giá trị hợp lệ của `type` trong `docs/db/schema.dbml` (tài liệu, không đổi cấu trúc) — `ssr-data` thực hiện |
| Seed data | Yes | `lib/budget-defaults.ts` — 4 dòng `"Linh hoạt"` đổi thành `"Khác"`; thêm hằng số `CATEGORY_TYPES` |
| Caching / revalidate | No | `upsertCategory` tiếp tục gọi `revalidatePath("/budget")` như hiện có |
| Export / báo cáo | No | Spec mục 9 xác nhận không ảnh hưởng export — Loại vẫn xuất đúng giá trị chuỗi hiện có |
| Mail / webhook / job nền | N/A | Không có trong bounded context này |
| Knowledge base / memory | Yes | DEV wiki `US-016-loai-chi-tieu-combobox.md` mới; `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry / UI | `components/BudgetApp.tsx` | Ô Loại (`~984-990`): đổi phần tử input thành phần tử select với 3 lựa chọn từ `CATEGORY_TYPES`, `onChange` gọi `updateCategoryLocal` + `commitCategory(id, { type })` ngay (không đợi `onBlur`); `addCategory` (`~416`): `type: "Linh hoạt"` → `type: "Khác"`; `totals` (`~333-335`): đổi điều kiện `flexible` từ `/linh/i.test(item.type)` sang `item.type === "Khác"`; mảng insight (`~1062`): đổi nhãn `"Chi linh hoạt"` → `"Chi khác"` |
| Shared constant | `lib/budget-defaults.ts` | Thêm `export const CATEGORY_TYPES = ["Cố định", "Tích lũy", "Khác"] as const;` và `export type CategoryType = (typeof CATEGORY_TYPES)[number];`; đổi `type` của 4 seed (`food`, `transport`, `coffee`, `health`) từ `"Linh hoạt"` sang `"Khác"` |
| Application (use-case) | `server/budget/application/use-cases/upsert-category.ts` | Thay đoạn kiểm tra `!type` bằng gọi `assertValidCategoryType(type)`, bắt `InvalidCategoryTypeError` và ném lại dưới dạng `UpsertCategoryError` (giữ nguyên kiểu lỗi hiện có mà UI đang xử lý) |
| Domain rule (mới) | `server/budget/domain/rules/category-type-rule.ts` | `isValidCategoryType`, `assertValidCategoryType` (throw `InvalidCategoryTypeError`), `normalizeCategoryType` (không throw) — import `CATEGORY_TYPES`/`CategoryType` từ `@/lib/budget-defaults` (không định nghĩa lại danh sách ở đây, tránh lệch giữa server và client) |
| Domain service | `server/budget/domain/services/fallback-category-service.ts` | `FALLBACK_CATEGORY_TYPE = "Linh hoạt"` (`DEC-056`) → `"Khác"` (`DEC-073`); sửa comment trích dẫn `DEC` |
| Domain service | `server/budget/domain/services/legacy-migration-service.ts` | Dòng 89: `type: category.type` → `type: normalizeCategoryType(category.type)` — phát hiện thêm ở plan này (spec không nhắc), lý do ở mục 1 và mục 13 |
| Data | `prisma/dev.db` (backfill trực tiếp, không qua `prisma/migrations/`) | Đã chạy: `UPDATE "Category" SET "type" = 'Khác' WHERE "type" NOT IN ('Cố định', 'Tích lũy');` qua `better-sqlite3` — `ssr-data` thực hiện xong (2026-08-11), xem `JDG-018` |
| Data (tài liệu) | `docs/db/schema.dbml` | Thêm `note` cho field `type` của `Table Category` liệt kê 3 giá trị hợp lệ — việc của `ssr-data` |
| Consumer | Không có file nào khác đọc `Category.type` ngoài các file đã liệt kê (đã grep toàn repo, xem mục 2) | — |

## 9. Thay Đổi Data Model

Cần đổi schema: **Có** — nhưng **không** ở dạng thêm/sửa/xóa field hay model. Chỉ cần một migration **data-only** để chuẩn hóa dữ liệu `Category.type` hiện có; `schema.prisma` giữ nguyên.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `Category` | Không đổi field/model — backfill dữ liệu bằng `UPDATE` trực tiếp qua `better-sqlite3` (không phải migration có version, xem `JDG-018`) | Không áp dụng | Không áp dụng | Không cần | 43 dòng `"Linh hoạt"` + 1 dòng `"Linh s"` (44 dòng) → `"Khác"`; 22 dòng `"Cố định"` và 18 dòng `"Tích lũy"` giữ nguyên — đã thực hiện và xác nhận (2026-08-11) |

`ssr-data` cần chạy trước `ssr-breaker`/`ssr-dev` của US-016 — dữ liệu phải sạch trước khi UI mới (chỉ hiển thị đúng 3 lựa chọn) ra mắt, tránh trường hợp danh mục cũ hiển thị giá trị không khớp option nào trên phần tử select. `data-model.md` riêng do `ssr-data` tạo.

**Cập nhật sau khi `ssr-data` chạy thật (2026-08-11):** `prisma migrate dev --create-only` không khả dụng cho migration data-only trong dự án này — hook `guard-artifact-path` chặn việc điền SQL tay vào `migration.sql` (`SSR-E020`, xem `JDG-018`). Backfill đã thực hiện trực tiếp qua `better-sqlite3` (driver adapter dự án đã dùng sẵn), ngoài `prisma/migrations/`, có backup trước khi chạy — kết quả xác nhận thật: 44 dòng đổi thành "Khác", "Cố định"/"Tích lũy" giữ nguyên. Chi tiết đầy đủ ở `data-model.md` mục 3 (`Status: Applied`).

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `UpsertCategoryInput.type` (chữ ký) | `string` bất kỳ, chỉ validate không rỗng | `string`, phải là một trong `CATEGORY_TYPES` — validate qua `assertValidCategoryType`, ném `UpsertCategoryError` nếu sai | Có, nhưng đúng ý định — trước US-016 không có UI nào gửi giá trị ngoài 3 lựa chọn hợp lệ và các biến thể lỗi gõ tay, nên không phá vỡ luồng hợp lệ hiện có |
| `FALLBACK_CATEGORY_TYPE` (hằng số nội bộ, `fallback-category-service.ts`) | `"Linh hoạt"` | `"Khác"` | Không phải breaking contract (hằng số nội bộ), nhưng đổi giá trị dữ liệu quan sát được — đã ghi ở spec mục 11 (tác động tới `US-005`) |
| `CategoryType` (kiểu mới, xuất từ `lib/budget-defaults.ts`) | Không tồn tại | `"Cố định" \| "Tích lũy" \| "Khác"` | Không (thêm mới, không xóa gì) |
| Di trú dữ liệu cũ — giá trị `type` ghi vào DB | Ghi nguyên văn từ `localStorage`, không ràng buộc | Chuẩn hóa qua `normalizeCategoryType` trước khi ghi | Có, nhưng đúng ý định — mục tiêu chính của US-016 là không còn giá trị Loại rác trong DB, kể cả từ đường di trú |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `prisma/dev.db` | Đã backfill trực tiếp qua `better-sqlite3` (không có file migration nào — xem `data-model.md` mục 3, `JDG-018`). Đã xong (2026-08-11) |
| `docs/db/schema.dbml` | Thêm `note` liệt kê 3 giá trị hợp lệ cho field `type` của `Category` (việc của `ssr-data`) |
| `lib/budget-defaults.ts` | Thêm `CATEGORY_TYPES`, `CategoryType`; đổi `type` của 4 seed (`food`, `transport`, `coffee`, `health`) từ `"Linh hoạt"` sang `"Khác"` |
| `server/budget/domain/rules/category-type-rule.ts` | **Mới** — `isValidCategoryType`, `assertValidCategoryType`, `normalizeCategoryType`, `InvalidCategoryTypeError` |
| `server/budget/application/use-cases/upsert-category.ts` | Gọi `assertValidCategoryType` thay vì kiểm tra rỗng; bắt lỗi, ném lại dưới dạng `UpsertCategoryError` |
| `server/budget/domain/services/fallback-category-service.ts` | `FALLBACK_CATEGORY_TYPE` đổi giá trị `"Linh hoạt"` → `"Khác"` |
| `server/budget/domain/services/legacy-migration-service.ts` | Dòng 89 dùng `normalizeCategoryType(category.type)` thay vì ghi nguyên văn |
| `components/BudgetApp.tsx` | Ô Loại: phần tử input → phần tử select (3 option, commit ngay khi chọn); `addCategory` mặc định `"Khác"`; `totals.flexible` tính theo `type === "Khác"`; nhãn insight `"Chi linh hoạt"` → `"Chi khác"` |
| `docs/kb/dev/wiki/US-016-loai-chi-tieu-combobox.md` | **Mới** — DEV wiki |
| `docs/kb/dev/00-index.md` | Thêm dòng US-016 |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng |
| --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi |
| Prisma | `rtk npx prisma validate` | Schema hợp lệ (không đổi so với hiện tại) |
| Test | `vitest run` | Chưa có framework test cài đặt trong `package.json` (gap đã biết từ US-001/US-004/US-005) — thay bằng kiểm chứng thủ công đủ 8 AC |
| Build | `next build` | Passed (2026-08-12) — Compiled successfully, 3 route (`/`, `/_not-found`, `/budget`), Errors: 0 |
| Thủ công — AC-01, AC-02 | Bấm ô Loại một danh mục thường trên `next dev`, chọn giá trị khác | Passed (2026-08-12) — mọi ô Loại là phần tử select đúng 3 lựa chọn (`["Cố định","Tích lũy","Khác"]`, xác nhận qua `document.querySelectorAll('table select')`); đổi "Sức khỏe / cá nhân" (tháng 2026-08) sang "Tích lũy", reload cứng vẫn giữ "Tích lũy" — không có bug đọc lại state cũ |
| Thủ công — AC-03, AC-04 | Kiểm tra danh mục có sẵn dữ liệu "Cố định"/"Tích lũy" và "Linh hoạt"/"Linh s" sau khi chạy migration | Passed (2026-08-12) — tháng 2026-08 (dữ liệu thật có từ trước migration): "Tiền nhà"/"Chi phí cố định khác" vẫn "Cố định"; "Ăn uống linh tinh"/"Giải trí kiểm thử" (trước đây "Linh hoạt") nay đều "Khác" |
| Thủ công — AC-05 | Bấm "Thêm danh mục" | Passed (2026-08-12) — danh mục mới có Loại mặc định "Khác" |
| Thủ công — AC-06 | Ghi nhận giao dịch không chọn danh mục ở tháng chưa có "Chi tiêu khác" | Passed (2026-08-12) — tháng 2027-01 (chưa từng có "Chi tiêu khác"): giao dịch không khớp từ khóa, không chọn danh mục → "Chi tiêu khác" tự sinh với Loại "Khác" |
| Thủ công — AC-07 | Xem khu vực Phân tích với ít nhất một danh mục Loại "Khác" có chi thực tế | Passed (2026-08-12) — thẻ hiện đúng "Chi khác" 77.000 ₫, khớp chính xác giao dịch vừa ghi ở AC-06 |
| Thủ công — AC-08 | Ngắt kết nối mạng (hoặc giả lập lỗi server) rồi chọn lại Loại | Xác nhận bằng đọc lại code, không mô phỏng qua trình duyệt tự động — nhánh `catch` của `commitCategory` không đổi so với trước, dùng lại đúng cơ chế `setToastMessage` + `refreshSnapshot()` đã kiểm chứng hoạt động đúng ở `US-005`/`US-010` |
| Thủ công — di trú | Nếu còn thiết bị/trình duyệt nào chưa hoàn tất di trú `localStorage`, kiểm tra dữ liệu di trú vào không còn giá trị Loại ngoài 3 lựa chọn | Không còn dữ liệu `localStorage` cũ nào để kiểm trên máy phát triển (banner di trú không còn xuất hiện) — xác nhận đúng bằng đọc code (`legacy-migration-service.ts` dùng `normalizeCategoryType`), không chặn hoàn tất |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| `legacy-migration-service.ts` ghi thẳng `type` từ dữ liệu cũ, bỏ qua validate — nếu không xử lý sẽ tái tạo dữ liệu rác sau khi triển khai (phát hiện khi khảo sát, spec không nhắc) | Trung bình | Đã xử lý (`TB-06`, 2026-08-12) — dùng `normalizeCategoryType` (không throw) tại đúng điểm ghi này | Nếu bỏ sót, sửa bổ sung là thay đổi một dòng, không cần rollback dữ liệu vì `normalizeCategoryType` là idempotent |
| Commit giá trị Loại mới ngay trong `onChange` (không đợi `onBlur`) có rủi ro đọc lại state cũ nếu code gọi `commitCategory()` không nhận override mà tự đọc lại `selectedMonth.categories` (do `setState` không đồng bộ) | Trung bình | Đã thiết kế cụ thể ở mục 5: `commitCategory` nhận tham số `overridePatch`, merge trực tiếp thay vì đọc lại state — ghi rõ cho `ssr-dev` làm đúng ngay từ đầu, không phải tự phát hiện lúc code | Nếu vẫn xảy ra, sửa lại đúng như thiết kế ở mục 5, không ảnh hưởng dữ liệu đã lưu (chỉ là bug UI gửi sai giá trị một lần) |
| Cửa sổ thời gian giữa lúc migration data-only chạy và lúc code UI mới lên — nếu tách rời hai bước, danh mục cũ có thể hiển thị `"Linh hoạt"` không khớp option nào trên phần tử select cũ (trước khi UI đổi) | Thấp | Dự án cá nhân, một lần deploy duy nhất (`SSR_CMD_PRISMA_MIGRATE_DEPLOY` chạy cùng lượt build) — không có khoảng hở thực tế; vẫn ghi thứ tự bắt buộc ở mục 6, 9 để `ssr-breaker` xếp task đúng trình tự | Không cần — chạy lại migration là idempotent (`NOT IN` không match dữ liệu đã sạch) |
| Bảng danh mục vẫn dùng tên cột cũ "Chênh lệch"/"Tỷ trọng" thay vì "Còn lại" theo `DEC-019` — gap có từ trước, không thuộc phạm vi US-016 | Thấp | Không sửa trong task này, chỉ ghi nhận (đã ghi nhận tương tự ở plan `US-005`) | Không áp dụng |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Prisma: backfill `Category.type` (không qua migration, `JDG-018`), thêm `note` DBML (`ssr-data`) | Done |
| `TB-02` | `lib/budget-defaults.ts`: thêm `CATEGORY_TYPES`/`CategoryType`, đổi 4 seed sang `"Khác"` | Pending |
| `TB-03` | Domain: `category-type-rule.ts` mới (`assertValidCategoryType`, `normalizeCategoryType`) | Pending |
| `TB-04` | Application: `upsert-category.ts` validate qua rule mới | Pending |
| `TB-05` | Domain service: `fallback-category-service.ts` đổi hằng số mặc định | Pending |
| `TB-06` | Domain service: `legacy-migration-service.ts` dùng `normalizeCategoryType` khi di trú | Pending |
| `TB-07` | UI: `BudgetApp.tsx` — ô Loại thành phần tử select (commit ngay khi chọn), `addCategory` mặc định "Khác", `totals.flexible` theo `type === "Khác"`, đổi nhãn thẻ insight | Pending |
| `TB-08` | Verification tổng hợp: typecheck, prisma validate, build, đủ 8 AC thủ công trên `next dev` | Pending |

Đã tách `TB-04` (cũ, gộp `upsert-category.ts` + `fallback-category-service.ts`) thành `TB-04`/`TB-05` riêng ở `ssr-breaker` — hai thay đổi verify độc lập (khác AC: AC-01/02/08 vs AC-06). Chi tiết đầy đủ, ma trận coverage, và thứ tự dependency: xem `task.md`.

Readiness: Ready
