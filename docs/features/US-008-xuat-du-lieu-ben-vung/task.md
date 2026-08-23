# Xuất dữ liệu từ nguồn lưu trữ bền vững — Phân Rã Task

Status: Implemented
Feature: US-008
Plan: plan.md
Spec: spec.md
Created: 2026-08-21
Updated: 2026-08-21
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 4 tiêu chí chấp nhận (AC-01..AC-04), Screen Element `EL-01` (mục 8.1) |
| `plan.md` | Mục 3-5 (hành vi hiện tại = hành vi mục tiêu), mục 7 (impact checklist — chỉ Knowledge base/memory và Export = Yes), mục 9 (không đổi schema), mục 12 (kế hoạch verification) |
| `data-model.md` | Không có — plan mục 9 xác nhận không cần đổi schema |

## 2. Breakdown Summary

- Phạm vi: Không sửa file source nào — plan đã xác nhận `exportData()` đã đóng gói đúng toàn bộ dữ liệu bền vững (`JDG-031`, cùng dạng `JDG-030` của US-007). Công việc còn lại là verification và cập nhật tài liệu.
- Phụ thuộc chặn: Không — `US-001`, `US-002` đều đã `Delivered With Notes`.
- Số task: 2
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Xác nhận đủ 4 AC bằng bằng chứng thật (truy vấn trực tiếp DB đối chiếu với payload HTML thật từ `next dev` đang chạy, đọc code xác nhận không có nhánh lọc/giới hạn nào), cộng typecheck và build sạch — không sửa file source nào | Không có file source thay đổi — chỉ đọc `components/BudgetApp.tsx`, `server/budget/**` để đối chiếu | None | AC-01, AC-02, AC-03, AC-04; `EL-01` | `rtk tsc --noEmit`, `npx next build`, `curl` thật tới `/budget` đối chiếu với truy vấn `prisma/dev.db` | Done | `rtk tsc --noEmit` → "No errors found". `npx next build` → "Errors: 0", exit 0. **AC-01**: truy vấn trực tiếp `prisma/dev.db` → 9 `MonthBudget`, 52 `Category`, 3 `Transaction`; `curl` tới `/budget` (HTTP 200) → payload HTML embed đủ `categories` cho từng tháng (đối chiếu bằng đọc code `budget-snapshot-service.ts`, không có nhánh lọc). **AC-02/AC-03** (bằng chứng mạnh nhất — item cần mua ở tháng KHÁC tháng hiện tại): DB có đúng 2 `PurchaseItem`, cả hai đều thuộc tháng không phải hiện tại (`2026-09`: "Mua chuột không dây", `2026-10`: "Mua sạc dự phòng" — tháng hiện tại là `2026-08`); `curl` payload HTML chứa cả 2 id lẫn tên 2 item này (`grep -c` khớp đúng 1 lần mỗi id, tên "Mua chuột không dây" xuất hiện trong payload) — xác nhận `initialBudget`/state `months` **có** đủ `purchaseItems` của tháng khác tháng hiện tại, không bị lọc theo tháng đang xem. Vì `exportData()` đọc thẳng state `months` này (đã đọc code xác nhận, không có bước lọc nào giữa state và `JSON.stringify`), suy ra trực tiếp: file xuất cũng sẽ có đủ. **AC-04**: xác nhận qua đọc code — khi `MonthBudget` rỗng, `months = []`, `exportData()` chạy `JSON.stringify({ months: [], selectedMonthId })` không có nhánh nào ném lỗi; không mô phỏng bằng dữ liệu test thật vì sẽ phá dữ liệu dev đang dùng chung (9 tháng, 52 danh mục). **Giới hạn của bằng chứng**: không bấm nút "Xuất JSON" thật qua trình duyệt (không có công cụ Browser trong phiên này) và không mở file JSON thật đã tải về; thay bằng đối chiếu payload HTML server thật (nguồn dữ liệu `exportData()` đọc) với DB thật — độ tin cậy cao vì đã đọc code xác nhận `exportData()` không có bước biến đổi/lọc nào giữa state và file xuất, chỉ `JSON.stringify` trực tiếp |
| `TB-02` | DEV wiki mục 7 (Verification) cập nhật đúng kết quả thật của `TB-01`; memory `JDG-031` chuyển `Status: Confirmed` nếu bằng chứng khớp đúng nhận định | `docs/kb/dev/wiki/US-008-xuat-du-lieu-ben-vung.md` (mục 7), `docs/memory/judgement-log.md` (`JDG-031`) | `TB-01` | Plan mục 7: Knowledge base/memory = Yes | Đối chiếu bằng mắt: nội dung wiki khớp đúng kết quả `TB-01`, không ghi kết quả giả định | Done | DEV wiki mục 7 đã cập nhật khớp `TB-01`; `JDG-031` chuyển `Status: Confirmed` |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Không áp dụng, plan mục 9 xác nhận không đổi schema.
- Cập nhật BA/DEV function wiki — DEV wiki đã tạo ở stage `plan`; `TB-02` cập nhật mục 7 với kết quả thật.
- Cập nhật memory — `TB-02` (chuyển `JDG-031` sang `Confirmed`).
- Verification cuối — `TB-01`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (đủ tháng/danh mục/giao dịch) | `TB-01` | |
| AC-02 (item cần mua tháng hiện tại) | `TB-01` | |
| AC-03 (không thiếu tháng, kể cả item cần mua tháng khác) | `TB-01` | |
| AC-04 (JSON hợp lệ khi chưa có dữ liệu) | `TB-01` | |
| Screen Element `EL-01` | `TB-01` | |
| Impact checklist — Export/báo cáo = Yes | `TB-01` | |
| Impact checklist — Knowledge base/memory = Yes | `TB-02` | |

## 5. Thứ Tự Dependency

1. `TB-01`
2. `TB-02` (phụ thuộc `TB-01`)

Không có vòng lặp.

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
