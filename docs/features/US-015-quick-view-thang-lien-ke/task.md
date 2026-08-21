# Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view — Phân Rã Task

Status: Implemented
Feature: US-015
Plan: plan.md
Spec: spec.md
Created: 2026-08-11
Updated: 2026-08-11
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 6 tiêu chí chấp nhận (AC-01..AC-06), Screen Element `EL-01`..`EL-05` ở mục 8.1/8.2 |
| `plan.md` | Mục 5 (luồng end-to-end), mục 7 (impact checklist), mục 8 (bản đồ source impact), mục 10 (contract), mục 11 (file sẽ thay đổi), mục 14 (phân rã đề xuất — dùng làm điểm khởi đầu, giữ nguyên 2 task, chỉ bổ sung cột) |
| `data-model.md` | Không áp dụng — plan mục 9 xác nhận `Cần đổi schema: Không` |

## 2. Breakdown Summary

- Phạm vi: Thêm hàm thuần `getQuickViewMonths(months, selectedMonthId)` và đổi nguồn `.map()` của khối `month-grid` ("Lịch sử thu chi") trong `components/BudgetApp.tsx` — không chạm file nào khác, không chạm server/schema.
- Phụ thuộc chặn: Không — `US-001` và `US-006` đều đã Delivered With Notes, không có phụ thuộc ngoài đang chờ.
- Số task: 2
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Hàm thuần `getQuickViewMonths(months, selectedMonthId)` (tìm vị trí tháng đang xem trong `months` đã sắp tăng dần, trả tối đa 3 phần tử liền kề, bỏ phần tử ngoài mảng); đổi nguồn `.map()` của khối `month-grid` (dòng 742) từ `[...months].reverse()` sang hàm này — không đổi JSX bên trong từng thẻ, không đổi `onClick`/class `active` | `components/BudgetApp.tsx` | None | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06; Contract khối `month-grid` + `getQuickViewMonths` (plan mục 10) | `rtk tsc --noEmit`; thủ công trên `next dev` — dựng 5 tháng theo đúng dữ liệu AC-01 ("2026-05","2026-06","2026-08","2026-09","2026-11", bỏ "2026-07"/"2026-10"), lần lượt chọn xem từng tháng và bấm vào thẻ để kiểm đủ AC-01..AC-06 | Done | Triển khai qua Codex CLI (`SSR_IMPLEMENT_EXECUTOR=codex`), đối chiếu phạm vi bằng `git status --porcelain` + md5sum trước/sau — chỉ đúng 1 file đổi (`components/BudgetApp.tsx`); `prisma/schema.prisma`, `docs/db/schema.dbml`, `app/budget/page.tsx`, `server/budget/actions.ts` không đổi (md5 khớp trước/sau). Đọc lại code thật (`components/BudgetApp.tsx:140-146`, `:749-750`) khớp đúng thiết kế ở plan mục 4/5/10 — không đổi JSX bên trong thẻ, không đổi khối "Chọn tháng xem". `npx tsc --noEmit` (tự chạy lại, không dùng kết quả Codex tự báo) → "No errors found", exit 0 (2026-08-11). `npx next build` → "1 routes (1 static, 0 dynamic) — Errors: 0, Warnings: 0", exit 0 (2026-08-11) |
| `TB-02` | Verification tổng hợp: typecheck, build, đủ 6 AC kiểm chứng thủ công trên `next dev`; cập nhật DEV wiki (`docs/kb/dev/wiki/US-015-quick-view-thang-lien-ke.md` mục 7 Verification) với kết quả thật | `docs/kb/dev/wiki/US-015-quick-view-thang-lien-ke.md` | `TB-01` | AC-01..AC-06 | `rtk tsc --noEmit`, `rtk next build`, thao tác thủ công đủ 6 AC | Partial | `npx tsc --noEmit` → 0 lỗi; `npx next build` → Errors: 0, Warnings: 0 (2026-08-11, xem `TB-01`). Kiểm thủ công trên `next dev` bằng dữ liệu thật đang có (13 tháng liên tục "2026-02".."2027-02", không có khoảng trống thật để dựng đúng kịch bản "bỏ qua tháng chưa tạo" của AC-01 — nhưng logic thuần dựa trên vị trí mảng, không phân biệt lịch hay khoảng trống, nên kết quả trên dữ liệu liên tục đã đủ xác nhận đúng thuật toán): (1) chọn xem "2026-08" (tháng giữa) → đúng 3 thẻ "2026-07"/"2026-08" (nổi bật, "26.890.000 ₫ còn lại" khớp progress bar)/"2026-09" — Passed, tương đương AC-01. (2) chọn xem "2027-02" (tháng cuối) qua giá trị mặc định lúc tải trang → đúng 2 thẻ "2027-01"/"2027-02" (nổi bật), không có thẻ "sau" — Passed, tương đương AC-03. (3) dùng "Chọn tháng xem" nhảy tới "2026-02" (tháng đầu) → đúng 2 thẻ "2026-02" (nổi bật)/"2026-03", không có thẻ "trước" — Passed, tương đương AC-02, đồng thời xác nhận AC-06 (dropdown "Chọn tháng xem" vẫn nhảy được tới tháng ngoài 3 thẻ, không đổi hành vi). (4) từ tình huống (1), bấm vào thẻ "2026-09" → tháng đang xem đổi thành "2026-09" ("Còn lại 35.000.000 ₫" khớp), 3 thẻ cập nhật lại thành "2026-08"/"2026-09" (nổi bật)/"2026-10" — Passed, xác nhận AC-05. AC-04 (chỉ đúng 1 tháng đã tạo) **chưa tái hiện được trực tiếp** — dữ liệu dev hiện có 13 tháng, không có cách reset an toàn trong phiên này (nút "Reset dữ liệu" có lỗi có sẵn không liên quan, đã ghi nhận từ US-006). Xác nhận gián tiếp qua đọc code: `getQuickViewMonths` khi `months.length === 1` thì `index=0`, `months[index-1]=undefined` và `months[index+1]=undefined` đều bị `.filter(Boolean)` loại bỏ, chỉ còn `months[0]` — đúng 1 thẻ theo đúng thiết kế. Status `Partial` vì AC-04 chỉ xác nhận qua code, chưa qua thao tác UI trực tiếp. DEV wiki mục 7 đã cập nhật kết quả thật. |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Không áp dụng, stage `data` đã `skipped`.
- Cập nhật BA/DEV function wiki — BA wiki đã sync ở stage `ba`; DEV wiki đã tạo ở stage `plan`, `TB-02` cập nhật lại với kết quả triển khai thật.
- Cập nhật memory — `DEC-071`/`DEC-072` đã ghi trước khi vào stage `ba`; không phát sinh quyết định kỹ thuật mới ở plan/breakdown này.
- Verification cuối — `TB-02`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 | `TB-01`, `TB-02` | 3 thẻ đúng thứ tự (tháng trước/đang xem/sau), bỏ qua tháng chưa tạo nằm giữa |
| AC-02 | `TB-01`, `TB-02` | Tháng đang xem là tháng đầu tiên đã tạo → chỉ 2 thẻ (không có "trước") |
| AC-03 | `TB-01`, `TB-02` | Tháng đang xem là tháng cuối cùng đã tạo → chỉ 2 thẻ (không có "sau") |
| AC-04 | `TB-01`, `TB-02` | Chỉ 1 tháng đã tạo → chỉ 1 thẻ |
| AC-05 | `TB-01`, `TB-02` | Bấm vào thẻ tháng sau → đổi tháng đang xem, 3 thẻ cập nhật lại |
| AC-06 | `TB-01`, `TB-02` | "Chọn tháng xem" (không đổi, thuộc US-006) vẫn nhảy được tới tháng ngoài 3 thẻ |
| Contract khối `month-grid` / `getQuickViewMonths` (plan mục 10) | `TB-01` | Đổi nguồn `.map()`, hàm nội bộ mới, không breaking |
| Knowledge base / memory (impact checklist plan mục 7) | `TB-02` | Cập nhật DEV wiki với kết quả triển khai thật |

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
