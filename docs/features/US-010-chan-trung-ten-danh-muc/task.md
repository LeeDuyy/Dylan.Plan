# Chặn trùng tên danh mục — Phân Rã Task

Status: Implemented
Feature: US-010
Plan: plan.md
Spec: spec.md
Created: 2026-08-10
Updated: 2026-08-10
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 7 tiêu chí chấp nhận (AC-01..AC-07), Screen Element EL-01..EL-03, contract `upsertCategory` |
| `plan.md` | Mục 7 (Impact Checklist), mục 8 (Bản Đồ Source Impact), mục 10 (Contract), mục 11 (File Sẽ Thay Đổi), mục 14 (4 task đề xuất) |
| `data-model.md` | Không áp dụng — mục 9 của `plan.md` xác nhận không đổi schema |

## 2. Breakdown Summary

- Phạm vi: Thêm domain rule `category-name-rule.ts` kiểm tra trùng tên danh mục (đã chuẩn hóa) trong cùng tháng; gọi rule này trong use-case `upsertCategory` (dùng chung cho cả thêm mới và sửa tên); bọc `try/catch` + toast ở hai điểm gọi trên UI (`commitCategory`, `addCategory`).
- Phụ thuộc chặn: Không — `US-001`, `US-005` đã Delivered, không có task nào phải chờ requirement khác.
- Số task: 4
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | File mới `category-name-rule.ts` export `normalizeCategoryName(name)` (trim, lowercase, rút gọn khoảng trắng lặp giữa), `assertCategoryNameNotDuplicate(name, siblings, excludeId?)` (ném `DuplicateCategoryNameError` khi trùng, loại trừ `excludeId` và mọi `isFallback === true`), `DuplicateCategoryNameError extends Error` | `server/budget/domain/rules/category-name-rule.ts` (mới) | None | AC-01, AC-02, AC-03, AC-05, AC-06, AC-07 | `rtk tsc --noEmit` | Done | Codex CLI (`SSR_IMPLEMENT_EXECUTOR=codex`) tạo file; `ssr-dev` đối chiếu phạm vi (chỉ đúng 3 file được giao, không chạm `schema.prisma`/docs) và tự chạy lại `rtk tsc --noEmit` → "TypeScript: No errors found" (2026-08-10) |
| `TB-02` | `upsertCategory` gọi `repository.findByMonth(input.monthId)` rồi `assertCategoryNameNotDuplicate(name, siblings, input.id)` trước dòng `create`/`update`; 3 validation cũ (tên/loại rỗng, ngân sách âm, sửa `isFallback`) giữ nguyên | `server/budget/application/use-cases/upsert-category.ts` | `TB-01` | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-07; Contract `upsertCategory` (plan mục 10) | `rtk tsc --noEmit` | Done | Codex CLI sửa đúng như plan; đọc lại code xác nhận 3 validation cũ (dòng 22-30, 33-36) giữ nguyên, thêm đúng 2 dòng (39-40) trước `create`/`update`; `rtk tsc --noEmit` (tự chạy lại) → 0 lỗi (2026-08-10) |
| `TB-03` | `commitCategory` và `addCategory` bọc `try/catch` theo đúng mẫu `createNewMonth` — lỗi → `setToastMessage(error.message)` rồi `refreshSnapshot()`; đường thành công giữ nguyên hành vi cũ | `components/BudgetApp.tsx` | `TB-02` | AC-01, AC-02; Impact checklist "Server Action" = Yes | `rtk tsc --noEmit` | Done | Codex CLI sửa đúng mẫu `createNewMonth`; đọc lại code (dòng 372-388, 406-414) xác nhận try/catch đúng, đường thành công (`await refreshSnapshot()` trong `try`) không đổi; `rtk tsc --noEmit` (tự chạy lại) → 0 lỗi (2026-08-10) |
| `TB-04` | Verification tổng hợp: typecheck, build, prisma validate, đủ 7 AC kiểm chứng thủ công trên `next dev` (gồm cả 3 điều kiện lỗi cũ của `upsertCategory` vẫn hiện toast đúng sau khi thêm `try/catch`); cập nhật DEV wiki mục 5/7/8 với kết quả thật | `docs/kb/dev/wiki/US-010-chan-trung-ten-danh-muc.md` | `TB-03` | AC-01..AC-07 | `rtk tsc --noEmit`, `rtk next build`, `rtk npx prisma validate`, thao tác thủ công đủ 7 AC | Done | `rtk tsc --noEmit` → 0 lỗi. `rtk next build` (qua `rtk`) trả exit 1 nhưng in "Errors: 0 \| Warnings: 0"; chạy trực tiếp `npx next build` (bỏ qua wrapper `rtk`) → exit 0, "1 routes (1 static, 0 dynamic)", Errors: 0, Warnings: 0 — kết luận build thật sự Passed, exit code 1 của `rtk next build` là quirk của wrapper, không phải lỗi build. `rtk npx prisma validate` → "hợp lệ" (không đổi so với trước). Thủ công trên `next dev` (tháng 2026-08 và 2026-07 có dữ liệu thật): AC-01 sửa "Ăn uống & đi chợ" thành " ăn uống linh tinh" (khoảng trắng thừa đầu, khác hoa/thường, trùng "Ăn uống linh tinh") → server log `Error: Tên danh mục "ăn uống linh tinh" đã tồn tại trong tháng này. Vui lòng đổi tên khác.` (POST 500 rồi 200), ô nhập trở lại "Ăn uống & đi chợ", xác nhận qua reload cứng; AC-02 bấm "Thêm danh mục" khi đã có "Danh mục mới" chưa đổi tên → không có dòng mới (rowCount giữ 7), toast xác nhận trực tiếp qua DOM: `Tên danh mục "Danh mục mới" đã tồn tại trong tháng này. Vui lòng đổi tên khác.`; AC-03 giữ nguyên tên "Ăn uống & đi chợ" (không đổi) → POST 200 sạch, không lỗi; AC-04 đổi "Ăn uống & đi chợ" thành "Giải trí kiểm thử" (tên mới, không trùng) → POST 200, xác nhận lưu bền vững qua reload cứng (tên vẫn "Giải trí kiểm thử" sau khi tải lại trang từ đầu); AC-05 đổi "Di chuyển" (tháng 2026-07) thành "Ăn uống linh tinh" (tên đã tồn tại ở tháng 2026-08, tháng khác) → POST 200 sạch, không bị chặn, xác nhận lưu bền vững qua reload cứng; AC-06 không dựng lại bằng UI (tránh tạo/xóa tháng thêm trong dev.db) — xác nhận bằng đọc lại `category-name-rule.ts`: khi `siblings` sau khi loại trừ `excludeId` rỗng, `Array.prototype.some` trả `false`, không ném lỗi — đúng logic; AC-07 sửa "Ăn uống & đi chợ" thành "Ăn uống  linh tinh" (hai khoảng trắng liền giữa hai từ) → server log `Error: Tên danh mục "ăn uống linh tinh" đã tồn tại trong tháng này...` (rút gọn khoảng trắng đúng), chặn như AC-01. Ngoài 7 AC: xác nhận 3 điều kiện lỗi cũ của `upsertCategory` không bị `try/catch` mới làm hỏng — thử xóa trắng tên một danh mục ("Dự phòng") → ô nhập trở lại "Dự phòng" sau khi rời ô (không tạo được danh mục tên rỗng); thử nhập ngân sách âm ("-5000") → bị `safeNumber()` ở client kẹp về 0 trước khi gửi lên server (hành vi có từ trước, không phải lỗi mới, đường lỗi `UpsertCategoryError` cho ngân sách âm vẫn không thể kích hoạt được từ UI như trước khi có US-010). Đã cập nhật DEV wiki mục 5/7/8 với kết quả thật (xem file). |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Không áp dụng, plan mục 9 xác nhận không đổi schema.
- Cập nhật BA/DEV function wiki — DEV wiki đã tạo ở stage `plan`; `TB-04` cập nhật lại với kết quả triển khai thật.
- Cập nhật memory — `DEC-068`, `DEC-069` (stage `ba`), `DEC-070`, `JDG-014` (stage `plan`) đã ghi; không phát sinh quyết định mới ở breakdown này.
- Verification cuối — `TB-04`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (sửa tên trùng — khác hoa/thường, khoảng trắng đầu) | `TB-01`, `TB-02`, `TB-03`, `TB-04` | Chặn, ô nhập trở lại tên cũ, toast đúng |
| AC-02 (bấm "Thêm danh mục" khi tên mặc định đã trùng) | `TB-01`, `TB-02`, `TB-03`, `TB-04` | Không có dòng mới, toast đúng |
| AC-03 (giữ nguyên tên cũ — không tự trùng với chính nó) | `TB-01`, `TB-02`, `TB-04` | `excludeId = input.id` |
| AC-04 (sửa tên hợp lệ, không trùng — happy path) | `TB-02`, `TB-04` | Không chạm nhánh lỗi mới |
| AC-05 (trùng tên nhưng khác tháng — không chặn) | `TB-01`, `TB-02`, `TB-04` | `findByMonth` chỉ lấy đúng tháng đang chọn |
| AC-06 (tháng chỉ có một danh mục duy nhất) | `TB-01`, `TB-02`, `TB-04` | `siblings` rỗng sau khi loại trừ chính nó |
| AC-07 (khoảng trắng lặp ở giữa — vẫn coi là trùng) | `TB-01`, `TB-02`, `TB-04` | `normalizeCategoryName` rút gọn khoảng trắng giữa |
| Contract `upsertCategory` (plan mục 10) | `TB-02` | Thêm điều kiện lỗi `DuplicateCategoryNameError`, signature không đổi |
| Impact checklist — Server Action = Yes | `TB-02`, `TB-03` | Hành vi lỗi mới, chữ ký giữ nguyên |
| Impact checklist — Knowledge base/memory = Yes | Đã Done ở stage `ba`/`plan` (`DEC-068`, `DEC-069`, `DEC-070`, `JDG-014`, `BR-017`, DEV wiki); `TB-04` cập nhật DEV wiki cuối | |

## 5. Thứ Tự Dependency

1. `TB-01`
2. `TB-02` (phụ thuộc `TB-01`)
3. `TB-03` (phụ thuộc `TB-02`)
4. `TB-04` (phụ thuộc `TB-03`)

Chuỗi tuyến tính, không có nhánh song song — phạm vi nhỏ, mỗi task nối trực tiếp vào task trước.

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
