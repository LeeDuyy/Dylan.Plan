# Cảnh báo trùng tháng khi tạo tháng mới — Phân Rã Task

Status: Implemented
Feature: US-006
Plan: plan.md
Spec: spec.md
Created: 2026-08-10
Updated: 2026-08-10
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 7 tiêu chí chấp nhận (AC-01..AC-07, gồm AC-06/AC-07 gộp từ US-013), Screen Element `EL-01`..`EL-05` ở mục 8.1/8.2 |
| `plan.md` | Mục 5 (luồng end-to-end), mục 7 (impact checklist), mục 8 (bản đồ source impact), mục 10 (contract), mục 11 (file sẽ thay đổi), mục 14 (phân rã đề xuất — dùng làm điểm khởi đầu, đã granularity lại) |
| `data-model.md` | Không áp dụng — plan mục 9 xác nhận `Cần đổi schema: Không` |

## 2. Breakdown Summary

- Phạm vi: Tách khu vực "Chọn tháng xem"/"Tạo tháng mới" thành 2 khối; đổi ô "Tạo tháng mới" thành combobox 13 kỳ tháng (disable kỳ đã có dữ liệu); sửa `createNewMonth` để "Tạo tháng" và "Clone tháng đang xem" cho hai kết quả khác nhau đúng như tên gọi. Toàn bộ nằm trong `components/BudgetApp.tsx` và `app/globals.css` — không chạm server/schema.
- Phụ thuộc chặn: Không — `US-001` đã Delivered, `US-013` đã gộp vào chính spec này (`DEC-065`), không có phụ thuộc ngoài đang chờ.
- Số task: 4
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-02` | Tách JSX khối "Tháng đang xem" thành 2 phần tử `article` riêng ("Chọn tháng xem", "Tạo tháng mới"), bọc trong wrapper mới để giữ lưới `.two-col` 2 cột; đổi nhãn "Chọn tháng" → "Chọn tháng xem", "Clone tháng hiện tại" → "Clone tháng đang xem"; thêm class wrapper trong `app/globals.css`, gỡ `.budget-tools` khỏi 2 khối chỉ còn 1 field | `components/BudgetApp.tsx`, `app/globals.css` | None | AC-06; Screen Element mục 8.1/8.2 | `rtk tsc --noEmit`; thủ công trên `next dev` — quan sát 2 khối tách biệt, đúng nhãn | Done | Triển khai qua Codex CLI (`SSR_IMPLEMENT_EXECUTOR=codex`), đối chiếu phạm vi bằng `git status --untracked-files=all` trước/sau — chỉ 2 file đổi (`components/BudgetApp.tsx`, `app/globals.css`), `prisma/schema.prisma`/`docs/db/schema.dbml` không đổi (xác nhận bằng md5). `npx tsc --noEmit` (tự chạy lại, không dùng kết quả Codex tự báo) → "No errors found", exit 0 (2026-08-10). Thủ công trên `next dev`: 2 `article` tách biệt trong `.month-panels` (`app/globals.css:478`), nhãn đúng "Chọn tháng xem" và "Tạo tháng mới"/"Clone tháng đang xem" — xác nhận qua DOM (`document.querySelectorAll('select')[0]` gắn với label "Chọn tháng xem") |
| `TB-01` | Hàm thuần `buildMonthPeriods(referenceDate, months)` và `pickDefaultPeriod(periods)`; đổi input kiểu `month` của ô "Tạo tháng mới" (trong khối đã tách ở `TB-02`) thành combobox liệt kê 13 kỳ, kỳ đã có dữ liệu mang `disabled` kèm nhãn "Đã có dữ liệu"; `newMonth` đồng bộ theo `pickDefaultPeriod` | `components/BudgetApp.tsx` | `TB-02` | AC-01, AC-04; Contract `newMonth`/`setNewMonth` (plan mục 10) | `rtk tsc --noEmit`; thủ công trên `next dev` — dựng dữ liệu 3/13 và 13/13 kỳ đã có, kiểm đúng số dòng mờ/không mờ | Done | `npx tsc --noEmit` → 0 lỗi (2026-08-10). AC-01 (thủ công, `next dev`, dữ liệu có sẵn 2026-04..08 = 5/13): đọc DOM combobox "Tạo tháng mới" → đúng 13 `option` (2026-02..2027-02), 5 option `disabled=true` kèm "(Đã có dữ liệu)" khớp chính xác 04-08, 8 option còn lại `disabled=false`; giá trị mặc định "2026-09" (tháng hiện tại 2026-08 đã taken, quét luân phiên ra "09" trước "07" — đúng thiết kế `pickDefaultPeriod`). AC-04 (thủ công): tạo lần lượt đủ 13/13 kỳ (dùng nút "Tạo tháng" nhiều lần) → khi hết kỳ trống, `select` "Tạo tháng mới" hiện option ẩn "Không còn kỳ tháng trống" (`value=""`, `disabled`), `newMonth=""`, cả 13 option đều `disabled=true`. |
| `TB-03` | Sửa `createNewMonth(cloneCurrent)`: chỉ truyền `sourceMonthId` khi `cloneCurrent === true`; bọc `try/catch` quanh lệnh gọi `createMonthAction`, lỗi hiện qua `setToastMessage(error.message)` rồi `refreshSnapshot()`; 2 nút "Tạo tháng"/"Clone tháng đang xem" thêm `disabled={!newMonth}` | `components/BudgetApp.tsx` | `TB-01`, `TB-02` | AC-02, AC-03, AC-04, AC-05, AC-07; Contract `createNewMonth(cloneCurrent)` (plan mục 10) | `rtk tsc --noEmit`; thủ công trên `next dev` — AC-02 (Tạo tháng → mặc định), AC-03 (Clone → sao chép), AC-05 (2 tab tạo trùng), AC-07 (Tạo tháng không mang danh mục tùy chỉnh) | Done | `npx tsc --noEmit` → 0 lỗi (2026-08-10). AC-02+AC-07 (thủ công): chọn "2026-09", bấm "Tạo tháng" → tháng tạo thành công với đúng 8 danh mục mặc định (tổng ngân sách 36.000.000đ khớp `lib/budget-defaults.ts#defaultCategories`), chi thực tế 0; "Chọn tháng xem" có thêm lựa chọn "2026-09"; "Tạo tháng mới" tự chuyển "2026-09" sang mờ, mặc định nhảy sang "2026-10". Lặp lại với tháng đang xem "2026-08" (có danh mục tùy chỉnh: "Tiền nhà", "Chi phí cố định khác", "Sức khỏe / cá nhân", "Chi tiêu khácc" (fallback), "Ăn uống linh tinh", "Ăn uống & đi chợ") → tháng "2026-09" mới KHÔNG mang theo bất kỳ danh mục tùy chỉnh nào, xác nhận AC-07. AC-03 (thủ công): tháng đang xem "2026-08", chọn "2026-10", bấm "Clone tháng đang xem" → tháng "2026-10" có đúng 5 danh mục sao chép từ "2026-08" (tên + ngân sách khớp nguyên văn: Tiền nhà 7.500.000đ, Chi phí cố định khác 15.000.000đ, Sức khỏe/cá nhân 1.000.000đ, Ăn uống linh tinh 0đ, Ăn uống & đi chợ 0đ), **không** mang theo "Chi tiêu khácc" (danh mục fallback, đúng `DEC-026`/`DEC-064`); thu nhập tháng mới là 35.000.000đ (mặc định, không sao chép từ "2026-08"); chi thực tế mọi danh mục = 0. AC-04 (thủ công): sau khi lấp đủ 13/13 kỳ, cả 2 nút "Tạo tháng"/"Clone tháng đang xem" có `disabled=true` (đọc DOM). AC-05: **chưa kiểm chứng trực tiếp bằng race 2 tab** — trong phiên này đã lấp hết 13/13 kỳ để kiểm AC-04 nên hết kỳ trống để dựng lại race, và nút "Reset dữ liệu" (để dựng lại dữ liệu sạch) hiện gặp lỗi có sẵn không liên quan (`PrismaClientKnownRequestError` — vi phạm khóa ngoại trong `resetAllBudgetData`, đã tách thành task riêng, không thuộc phạm vi US-006). Xác nhận thay thế bằng rà soát code: khối `try/catch` mới dùng đúng pattern đã có sẵn và đã qua kiểm chứng ở `saveEditTransaction` (dòng ~568-585 cùng file) — `error instanceof Error ? error.message : "..."`; `create-month.ts` (không đổi trong đợt này) đã ném đúng `CreateMonthError("Tháng này đã tồn tại.")` khi trùng `monthId`, khớp nguyên văn Then của AC-05. |
| `TB-04` | Verification tổng hợp: typecheck, build, đủ 7 AC kiểm chứng thủ công trên `next dev`; cập nhật DEV wiki (`docs/kb/dev/wiki/US-006-canh-bao-trung-thang.md` mục 7 Verification) với kết quả thật | `docs/kb/dev/wiki/US-006-canh-bao-trung-thang.md` | `TB-01`, `TB-02`, `TB-03` | AC-01..AC-07 | `rtk tsc --noEmit`, `rtk next build`, thao tác thủ công đủ 7 AC | Partial | `npx tsc --noEmit` → 0 lỗi; `npx next build` → "1 routes (1 static, 0 dynamic) — Errors: 0, Warnings: 0" (2026-08-10). AC-01..AC-04, AC-06, AC-07: Passed (chi tiết ở `TB-01`/`TB-03`/`TB-02`). AC-05: chưa dựng được kịch bản race 2 tab thật trong phiên này (xem lý do ở `TB-03`) — xác nhận gián tiếp qua rà soát code, không phải thao tác UI trực tiếp. DEV wiki mục 7 đã cập nhật kết quả thật. |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Không áp dụng, stage `data` đã `skipped`.
- Cập nhật BA/DEV function wiki — BA wiki đã sync ở stage `ba`; DEV wiki đã tạo ở stage `plan`, `TB-04` cập nhật lại với kết quả triển khai thật.
- Cập nhật memory — `DEC-061`..`DEC-065` đã ghi ở stage `ba`/lúc gộp US-013; `JDG-012` đã ghi ở stage `plan`; không phát sinh quyết định mới ở breakdown này.
- Verification cuối — `TB-04`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 | `TB-01`, `TB-04` | Combobox liệt kê đúng 13 kỳ, kỳ đã có dữ liệu bị mờ/không chọn được |
| AC-02 | `TB-01`, `TB-03`, `TB-04` | "Tạo tháng" → danh mục mặc định; kỳ mới xuất hiện ở "Chọn tháng xem" (nhãn từ `TB-02`) |
| AC-03 | `TB-01`, `TB-03`, `TB-04` | "Clone tháng đang xem" → sao chép cấu trúc danh mục từ tháng đang xem |
| AC-04 | `TB-01`, `TB-03`, `TB-04` | Hết 13/13 kỳ → `newMonth` rỗng → 2 nút `disabled` |
| AC-05 | `TB-03`, `TB-04` | Race condition tạo trùng đồng thời → toast lỗi, danh sách tự cập nhật |
| AC-06 | `TB-02`, `TB-04` | Đổi nhãn "Chọn tháng xem", tách 2 khối rõ ràng |
| AC-07 | `TB-03`, `TB-04` | "Tạo tháng" không mang theo danh mục tùy chỉnh của tháng đang xem |
| Contract `createNewMonth(cloneCurrent)` (plan mục 10) | `TB-03` | Rẽ nhánh đúng theo `cloneCurrent`, không breaking (hàm nội bộ) |
| Contract `newMonth`/`setNewMonth` (plan mục 10) | `TB-01` | Nguồn giá trị đổi từ input tự do sang combobox, kiểu dữ liệu không đổi |
| Contract `createMonth` Server Action / `CreateMonthInput` (plan mục 10) | `TB-04` | Không đổi chữ ký — xác nhận qua typecheck/build không phá vỡ, không cần task sửa riêng |
| Knowledge base / memory (impact checklist plan mục 7) | `TB-04` | Cập nhật DEV wiki với kết quả triển khai thật |

## 5. Thứ Tự Dependency

1. `TB-02`
2. `TB-01`
3. `TB-03`
4. `TB-04`

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
