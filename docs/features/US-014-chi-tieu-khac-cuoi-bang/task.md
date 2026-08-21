# Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục — Phân Rã Task

Status: Implemented
Feature: US-014
Plan: plan.md
Spec: spec.md
Created: 2026-08-10
Updated: 2026-08-10
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 5 tiêu chí chấp nhận (AC-01..AC-05), Screen Element `EL-01`/`EL-02`/`EL-03` |
| `plan.md` | Mục 5 (luồng end-to-end), mục 8 (bản đồ source impact — chỉ 1 file), mục 10 (contract), mục 11 (file sẽ thay đổi), mục 14 (phân rã đề xuất) |
| `data-model.md` | Không áp dụng — plan mục 9 xác nhận `Cần đổi schema: Không` |

## 2. Breakdown Summary

- Phạm vi: Sửa đúng một biến `visibleCategories` trong `components/BudgetApp.tsx` để danh mục "Chi tiêu khác" (khi còn hiển thị) luôn nằm cuối mảng — áp dụng tự động ở cả 3 nơi dùng lại biến này (bảng ngân sách, dropdown nhập nhanh, biểu đồ cơ cấu chi tiêu).
- Phụ thuộc chặn: Không — `US-005` đã Delivered, `Category.isFallback` đã có sẵn, không cần chờ gì thêm.
- Số task: 2
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Sửa `visibleCategories` (dòng 334-337): sau khi lọc như hiện có, đưa danh mục `isFallback` (nếu còn hiển thị) xuống cuối mảng, giữ nguyên thứ tự các danh mục khác | `components/BudgetApp.tsx` | None | AC-01, AC-02, AC-03, AC-04, AC-05; Contract `visibleCategories` (plan mục 10) | `rtk tsc --noEmit`; thủ công trên `next dev` — quan sát cả 3 nơi (bảng, dropdown, biểu đồ) | Done | Triển khai qua Codex CLI (`SSR_IMPLEMENT_EXECUTOR=codex`), đối chiếu phạm vi bằng `git status --untracked-files=all` trước/sau — chỉ `components/BudgetApp.tsx` đổi, `prisma/schema.prisma`/`docs/db/schema.dbml` không đổi (xác nhận bằng md5). `npx tsc --noEmit` (tự chạy lại) → "No errors found" (2026-08-10). Diff đúng như thiết kế: `visibleCategories` nay lọc rồi tách `fallback` ra append cuối cùng |
| `TB-02` | Verification tổng hợp: typecheck, build, đủ 5 AC kiểm chứng thủ công trên `next dev`; cập nhật DEV wiki (`docs/kb/dev/wiki/US-014-chi-tieu-khac-cuoi-bang.md` mục 7) với kết quả thật | `docs/kb/dev/wiki/US-014-chi-tieu-khac-cuoi-bang.md` | `TB-01` | AC-01..AC-05 | `rtk tsc --noEmit`, `rtk next build`, thao tác thủ công đủ 5 AC | Done | `npx tsc --noEmit` → 0 lỗi; `npx next build` → 1 route, Errors: 0, Warnings: 0 (2026-08-10). Thủ công trên `next dev`, tháng "2026-08" (có "Chi tiêu khácc" hiển thị, actual > 0, cùng 5 danh mục khác): **AC-01** — đọc DOM bảng ngân sách → thứ tự `Tiền nhà, Chi phí cố định khác, Sức khỏe / cá nhân, Ăn uống linh tinh, Ăn uống & đi chợ, Chi tiêu khácc` — fallback đúng ở cuối (bằng chứng before/after: trước khi sửa, cùng tháng này "Chi tiêu khácc" từng ở vị trí thứ 4/6, không phải cuối). **AC-02** — bấm "Thêm danh mục" → "Danh mục mới" chèn ngay trước "Chi tiêu khácc", fallback vẫn ở cuối (thứ tự mới: `..., Ăn uống & đi chợ, Danh mục mới, Chi tiêu khácc`). **AC-03** — chuyển sang tháng "2026-09" (8 danh mục mặc định, chưa từng có giao dịch nào cần "Chi tiêu khác") → không có dòng "Chi tiêu khác" nào, đúng 8 danh mục mặc định theo thứ tự seed. **AC-04** — quay lại "2026-08", đọc dropdown "Danh mục nhận diện" → `— Chưa xác định —, Tiền nhà, Chi phí cố định khác, Sức khỏe / cá nhân, Ăn uống linh tinh, Ăn uống & đi chợ, Danh mục mới, Chi tiêu khácc` — fallback ở cuối cùng. **AC-05** — đọc DOM biểu đồ "Cơ cấu chi tiêu" → đúng 7 cột theo thứ tự `visibleCategories`, cột cuối cùng ứng với "Chi tiêu khácc". DEV wiki mục 7 đã cập nhật kết quả thật |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Không áp dụng, stage `data` đã `skipped`.
- Cập nhật BA/DEV function wiki — BA wiki đã sync ở stage `ba`; DEV wiki đã tạo ở stage `plan`, `TB-02` cập nhật lại với kết quả triển khai thật.
- Cập nhật memory — `DEC-066`, `DEC-067` đã ghi ở stage `ba`; không phát sinh quyết định mới ở breakdown này.
- Verification cuối — `TB-02`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 | `TB-01`, `TB-02` | "Chi tiêu khác" ở cuối bảng ngân sách, danh mục khác giữ nguyên thứ tự |
| AC-02 | `TB-01`, `TB-02` | Thêm danh mục mới vẫn chèn trước "Chi tiêu khác" |
| AC-03 | `TB-01`, `TB-02` | Không có "Chi tiêu khác" → không đổi hành vi |
| AC-04 | `TB-01`, `TB-02` | "Chi tiêu khác" ở cuối dropdown "Danh mục nhận diện" |
| AC-05 | `TB-01`, `TB-02` | "Chi tiêu khác" ở cuối biểu đồ "Cơ cấu chi tiêu" |
| Contract `visibleCategories` (plan mục 10) | `TB-01` | Đổi hành vi tính toán nội bộ, không breaking vì dùng lại nguyên trạng ở 3 nơi |
| Knowledge base / memory (impact checklist plan mục 7) | `TB-02` | Cập nhật DEV wiki cuối cùng |

## 5. Thứ Tự Dependency

1. `TB-01`
2. `TB-02`

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
