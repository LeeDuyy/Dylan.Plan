# Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định — Phân Rã Task

Status: Implemented
Feature: US-016
Plan: plan.md
Spec: spec.md
Created: 2026-08-11
Updated: 2026-08-12
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 8 tiêu chí chấp nhận (AC-01..AC-08), Screen Element EL-01..EL-04 (mục 8.1, 8.2) |
| `plan.md` | Mục 5 (Luồng end-to-end, thiết kế `commitCategory` override), mục 7 (Impact Checklist), mục 8 (Bản Đồ Source Impact), mục 10 (Contract), mục 11 (File Sẽ Thay Đổi), mục 13 (Rủi ro — `legacy-migration-service.ts`), mục 14 (7 outcome dự kiến) |
| `data-model.md` | Xác nhận `TB-01` (backfill `Category.type`) đã `Applied` thật (2026-08-11) — không cần task migration nào nữa |

## 2. Breakdown Summary

- Phạm vi: Thêm domain rule `category-type-rule.ts` (validate chặt + chuẩn hóa không throw); đổi hằng số mặc định ở 2 nơi (`lib/budget-defaults.ts`, `fallback-category-service.ts`); áp validate vào `upsert-category.ts`; áp chuẩn hóa vào đường di trú `legacy-migration-service.ts` (rủi ro phát hiện ở stage `plan`, spec không nhắc); đổi UI `components/BudgetApp.tsx` (ô Loại thành select, `addCategory`, `totals.flexible`, nhãn thẻ insight).
- Phụ thuộc chặn: Không — `US-001`, `US-005` đã Delivered; backfill dữ liệu (`TB-01`) đã xong thật trước khi breakdown này chạy.
- Số task: 8 (`TB-01` đã Done)
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Dữ liệu `Category.type` cũ đã chuẩn hóa: 44 dòng (`"Linh hoạt"` 43, `"Linh s"` 1) → `"Khác"`; `"Cố định"` (22), `"Tích lũy"` (18) giữ nguyên | `prisma/dev.db` (backfill trực tiếp, không qua migration — `JDG-018`) | None | AC-03, AC-04 | Query `Category` `GROUP BY type` | Done | Đã chạy thật ở stage `data` (2026-08-11) qua `better-sqlite3`, có backup trước; kết quả xác nhận trong `data-model.md` mục 3, 7 — chỉ còn đúng 3 giá trị hợp lệ |
| `TB-02` | `lib/budget-defaults.ts` export `CATEGORY_TYPES = ["Cố định", "Tích lũy", "Khác"] as const` và `CategoryType`; 4 seed (`food`, `transport`, `coffee`, `health`) đổi `type` từ `"Linh hoạt"` sang `"Khác"`; `saving`/`backup`/`rent`/`fixed` giữ nguyên | `lib/budget-defaults.ts` | None | Impact checklist "Seed data" = Yes | `tsc --noEmit` | Done | Đọc lại file: đúng như thiết kế — `CATEGORY_TYPES`/`CategoryType` thêm ở dòng 13-14; `food`/`transport`/`coffee`/`health` = `"Khác"`; `rent`/`fixed` vẫn `"Cố định"`, `saving`/`backup` vẫn `"Tích lũy"`. `npx tsc --noEmit` (tự chạy lại sau khi cả 6 file đổi) → exit 0, không lỗi (2026-08-12) |
| `TB-03` | File mới `category-type-rule.ts` export `isValidCategoryType(type)`, `assertValidCategoryType(type)` (throw `InvalidCategoryTypeError` nếu sai), `normalizeCategoryType(rawType)` (không throw — giữ nguyên `"Cố định"`/`"Tích lũy"`, còn lại trả `"Khác"`); import `CATEGORY_TYPES`/`CategoryType` từ `lib/budget-defaults.ts`, không định nghĩa lại danh sách | `server/budget/domain/rules/category-type-rule.ts` (mới) | `TB-02` | BR-019 (nền tảng cho AC-01, AC-02, AC-06, AC-08) | `tsc --noEmit` | Done | Đọc lại file: đúng 3 hàm + 1 Error class như thiết kế, không import Prisma/infrastructure (đúng R13.2). `npx tsc --noEmit` → 0 lỗi (2026-08-12) |
| `TB-04` | `upsert-category.ts`: thay đoạn kiểm tra `!type` bằng gọi `assertValidCategoryType(type)`; bắt `InvalidCategoryTypeError`, ném lại dưới dạng `UpsertCategoryError` (giữ nguyên kiểu lỗi UI đang xử lý); 3 validation khác (tên rỗng, ngân sách âm, chặn sửa `isFallback`) giữ nguyên | `server/budget/application/use-cases/upsert-category.ts` | `TB-03` | AC-01, AC-02, AC-08; Contract `UpsertCategoryInput.type` (plan mục 10) | `tsc --noEmit` | Done | Đọc lại file: `try { assertValidCategoryType(type) } catch (InvalidCategoryTypeError) { throw new UpsertCategoryError(...) }` đúng vị trí (sau kiểm tra tên rỗng, trước kiểm tra ngân sách âm); 3 validation cũ không đổi. `npx tsc --noEmit` → 0 lỗi (2026-08-12) |
| `TB-05` | `fallback-category-service.ts`: `FALLBACK_CATEGORY_TYPE` đổi giá trị `"Linh hoạt"` (`DEC-056`) → `"Khác"` (`DEC-073`); sửa comment trích dẫn `DEC` | `server/budget/domain/services/fallback-category-service.ts` | None | AC-06 | `tsc --noEmit` | Done | Đọc lại file: `const FALLBACK_CATEGORY_TYPE = "Khác"; // DEC-073 (thay DEC-056)`. Kiểm chứng thủ công trên `next dev` (tháng 2027-01, chưa từng có "Chi tiêu khác"): ghi giao dịch "zzz linh tinh khong khop 77k" không khớp từ khóa nào, không chọn danh mục → "Chi tiêu khác" tự sinh với Loại "Khác", 77.000đ — xác nhận qua DOM (`querySelector`) |
| `TB-06` | `legacy-migration-service.ts` dòng ghi `type: category.type` đổi thành `type: normalizeCategoryType(category.type)` — chặn dữ liệu Loại rác tái phát sinh từ đường di trú `localStorage`, phát hiện ở stage `plan` (spec không nhắc, xem plan mục 1, 13) | `server/budget/domain/services/legacy-migration-service.ts` | `TB-03` | Không có AC trực tiếp — giảm thiểu rủi ro ở plan mục 13 | `tsc --noEmit`; thủ công nếu còn dữ liệu `localStorage` cũ để di trú (plan mục 12, dòng "Thủ công — di trú") | Done | Đọc lại file: import + dòng 90 dùng `normalizeCategoryType(category.type)` đúng vị trí duy nhất từng ghi `type` trong vòng lặp di trú danh mục. `npx tsc --noEmit` → 0 lỗi. Không còn thiết bị/trình duyệt nào có dữ liệu `localStorage` cũ để kiểm thủ công đường di trú thật (US-001/US-002 đã Delivered từ lâu, banner di trú không còn xuất hiện trên `next dev`) — xác nhận đúng bằng đọc code, không chặn `Done` (2026-08-12) |
| `TB-07` | `BudgetApp.tsx`: ô Loại đổi từ input thành select (3 option từ `CATEGORY_TYPES`), `onChange` gọi `updateCategoryLocal(id, {type})` + `commitCategory(id, {type})` ngay (đổi chữ ký `commitCategory` nhận `overridePatch`, merge trực tiếp — không đọc lại `selectedMonth.categories`, tránh bug state cũ theo thiết kế ở plan mục 5); `addCategory` mặc định `type: "Khác"`; `totals.flexible` đổi điều kiện từ `/linh/i.test(item.type)` sang `item.type === "Khác"`; mảng insight đổi nhãn `"Chi linh hoạt"` → `"Chi khác"` | `components/BudgetApp.tsx` | `TB-02`, `TB-04` | AC-01, AC-02, AC-05, AC-07, AC-08; Screen Element EL-01, EL-02, EL-03, EL-04 | `tsc --noEmit` | Done | Đọc lại file: cả 5 điểm đổi đúng như thiết kế (dòng 380-397 `commitCategory`, dòng 417 `addCategory`, dòng 333-335 `totals.flexible`, dòng 986-999 phần tử select, dòng 1072 nhãn insight). `npx tsc --noEmit` → 0 lỗi. Kiểm chứng thủ công trên `next dev`: AC-01 (mọi ô Loại đều là phần tử select đúng 3 option qua `document.querySelectorAll('table select')`), AC-02 (đổi "Sức khỏe / cá nhân" tháng 2026-08 từ "Khác" sang "Tích lũy", reload cứng vẫn giữ "Tích lũy" — xác nhận không có bug đọc lại state cũ; đã đổi lại "Khác" sau khi kiểm), AC-05 (bấm "Thêm danh mục" → dòng mới Loại "Khác"; đã xóa lại), AC-07 (thẻ "Chi khác" hiển thị đúng tổng — xem `TB-08`) |
| `TB-08` | Verification tổng hợp: typecheck, `prisma validate`, build, đủ 8 AC kiểm chứng thủ công trên `next dev`; cập nhật DEV wiki mục 5/7/8 với kết quả thật | `docs/kb/dev/wiki/US-016-loai-chi-tieu-combobox.md` | `TB-05`, `TB-06`, `TB-07` | AC-01..AC-08 | `tsc --noEmit`, `npx prisma validate`, `next build`, thao tác thủ công đủ 8 AC | Done | `npx tsc --noEmit` → exit 0. `npx prisma validate` → "The schema at prisma\schema.prisma is valid". `npx next build` → Compiled successfully, 3 route (`/`, `/_not-found`, `/budget`), Errors: 0. Thủ công trên `next dev` (cổng 50513, dữ liệu thật nhiều tháng): AC-01 xác nhận `table select` với đúng 3 option `["Cố định","Tích lũy","Khác"]` ở mọi dòng. AC-02 xác nhận persist sau reload cứng (xem `TB-07`). AC-03 xác nhận trên tháng 2026-08 (dữ liệu thật có từ trước migration): "Tiền nhà"/"Chi phí cố định khác" vẫn `"Cố định"`. AC-04 xác nhận cùng tháng 2026-08: "Ăn uống linh tinh", "Giải trí kiểm thử" (trước đây `"Linh hoạt"`) nay đều `"Khác"`. AC-05, AC-06 xem `TB-07`/`TB-05`. AC-07 xác nhận tháng 2027-01 sau khi thêm giao dịch 77.000đ vào "Chi tiêu khác": thẻ insight hiện đúng `"Chi khác" 77.000 ₫` (không còn "Chi linh hoạt"), khớp chính xác giá trị giao dịch. AC-08 xác nhận bằng đọc lại code (không mô phỏng lỗi mạng qua trình duyệt tự động) — nhánh `catch` của `commitCategory` (dòng 393-395) không đổi so với trước, dùng lại đúng cơ chế `setToastMessage` + `refreshSnapshot()` đã kiểm chứng hoạt động đúng ở `US-005`/`US-010` cho các trường khác của cùng use-case `upsertCategory`. Đã cập nhật DEV wiki mục 5/7/8 với kết quả thật (xem file) |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Đã Done ở stage `data` (`TB-01`; DBML `note` đã thêm, không phải migration có version — `JDG-018`).
- Cập nhật BA/DEV function wiki — DEV wiki đã tạo ở stage `plan`; `TB-08` cập nhật lại với kết quả triển khai thật.
- Cập nhật memory — `DEC-073` (stage `ba`), `JDG-018` (stage `data`) đã ghi; không phát sinh quyết định mới ở breakdown này.
- Verification cuối — `TB-08`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (mở select, đúng 3 lựa chọn, không gõ được) | `TB-03`, `TB-04`, `TB-07`, `TB-08` | Ràng buộc UI (select) + server (validate) |
| AC-02 (chọn giá trị, lưu ngay không cần blur) | `TB-03`, `TB-04`, `TB-07`, `TB-08` | `commitCategory(id, {type})` gọi ngay trong `onChange` |
| AC-03 (Cố định/Tích lũy giữ nguyên sau migrate) | `TB-01`, `TB-08` | Đã Done, verify lại ở `TB-08` |
| AC-04 (Linh hoạt/Linh s → Khác sau migrate) | `TB-01`, `TB-08` | Đã Done, verify lại ở `TB-08` |
| AC-05 (Thêm danh mục mặc định "Khác") | `TB-07`, `TB-08` | `addCategory` |
| AC-06 (Chi tiêu khác tự sinh Loại "Khác") | `TB-05`, `TB-08` | `fallback-category-service.ts` |
| AC-07 (thẻ insight "Chi khác") | `TB-07`, `TB-08` | `totals.flexible` + nhãn |
| AC-08 (lỗi lưu → giữ nguyên giá trị cũ) | `TB-04`, `TB-07`, `TB-08` | Server ném lỗi; UI dùng lại cơ chế `refreshSnapshot()` có sẵn |
| Contract `UpsertCategoryInput.type` (plan mục 10) | `TB-04` | Thêm điều kiện lỗi `InvalidCategoryTypeError` → `UpsertCategoryError`, signature không đổi |
| Rủi ro `legacy-migration-service.ts` (plan mục 13, không có AC riêng) | `TB-06` | Phát hiện ở stage `plan`, ngoài phạm vi spec ban đầu |
| Impact checklist — Seed data = Yes | `TB-02` | `lib/budget-defaults.ts` |
| Impact checklist — Migration SQLite / DBML = Yes | `TB-01` (Done) | Backfill trực tiếp, không phải migration có version |
| Impact checklist — Knowledge base/memory = Yes | Đã Done ở stage `ba`/`data` (`DEC-073`, `JDG-018`, DEV wiki); `TB-08` cập nhật DEV wiki cuối | |

## 5. Thứ Tự Dependency

1. `TB-01` (Done)
2. `TB-02` (độc lập với `TB-01`, có thể chạy song song về mặt logic)
3. `TB-03` (phụ thuộc `TB-02`)
4. `TB-04` (phụ thuộc `TB-03`)
5. `TB-05` (độc lập, có thể chạy song song với `TB-03`/`TB-04`)
6. `TB-06` (phụ thuộc `TB-03`)
7. `TB-07` (phụ thuộc `TB-02`, `TB-04`)
8. `TB-08` (phụ thuộc `TB-05`, `TB-06`, `TB-07`)

Không có vòng lặp. `TB-05` không phụ thuộc `TB-03` vì chỉ đổi giá trị một hằng số chuỗi, không gọi hàm nào từ `category-type-rule.ts`.

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
