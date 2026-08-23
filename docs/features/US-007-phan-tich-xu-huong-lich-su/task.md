# Phân tích xu hướng trên toàn bộ lịch sử đã lưu — Phân Rã Task

Status: Implemented
Feature: US-007
Plan: plan.md
Spec: spec.md
Created: 2026-08-21
Updated: 2026-08-21
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 4 tiêu chí chấp nhận (AC-01..AC-04), Screen Element `EL-01` (mục 8.1) |
| `plan.md` | Mục 3-5 (hành vi hiện tại = hành vi mục tiêu), mục 7 (impact checklist — chỉ Knowledge base/memory = Yes), mục 9 (không đổi schema), mục 12 (kế hoạch verification), mục 14 (1 outcome dự kiến) |
| `data-model.md` | Không có — plan mục 9 xác nhận không cần đổi schema |

## 2. Breakdown Summary

- Phạm vi: Không sửa file source nào — plan đã xác nhận hành vi mục tiêu (biểu đồ "Xu hướng" tính từ toàn bộ tháng ngân sách đã lưu, không giới hạn) đã tồn tại sẵn từ khi `US-001`/`US-002` triển khai. Công việc còn lại chỉ là verification (khóa hành vi lại bằng bằng chứng) và cập nhật tài liệu.
- Phụ thuộc chặn: Không — `US-001`, `US-002` đều đã `Delivered With Notes`.
- Số task: 2
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Xác nhận đủ 4 AC bằng bằng chứng thật (HTTP request thật tới `next dev` đang chạy + truy vấn trực tiếp DB đối chiếu, không dùng trình duyệt tự động vì môi trường phiên này không có công cụ đó), cộng typecheck và build sạch — không sửa file source nào | Không có file source thay đổi — chỉ đọc `components/BudgetApp.tsx`, `server/budget/**` để đối chiếu | None | AC-01, AC-02, AC-03, AC-04; `EL-01` | `rtk tsc --noEmit`, `npx next build`, `curl` thật tới `/budget` đối chiếu với truy vấn `MonthBudget` trực tiếp trên `prisma/dev.db` | Done | `rtk tsc --noEmit` → "No errors found". `npx next build` → 3 lần liên tiếp đều "Compiled successfully", 6 route, 0 lỗi (1 lần đầu ghi nhận "Errors: 3" từ wrapper tóm tắt của `rtk`/dự án nhưng output `next build` thật không có lỗi nào — cùng dạng flaky đã biết `JDG-015`, xác nhận lại 2 lần nữa đều sạch). **AC-01/AC-02** (gộp — môi trường dev hiện có 9 tháng, không phải đúng 5 hay >12, nhưng cùng chứng minh nguyên tắc "không giới hạn"): `curl http://localhost:3000/budget` (HTTP 200, request thật không mang cookie/state gì) → đếm được đúng 9 phần tử `class="stick success-stick"` trong HTML trả về; truy vấn trực tiếp `prisma/dev.db` bằng `better-sqlite3` → đúng 9 dòng `MonthBudget` (`2026-02`..`2026-10`) — khớp chính xác 1:1, không thiếu không thừa cột nào. Đối chiếu code: `month-budget-prisma-repository.ts`, `budget-snapshot-service.ts`, `components/BudgetApp.tsx` không có `.slice(`/`take:`/`LIMIT` nào giới hạn mảng tháng (đã `grep` xác nhận) — nguyên tắc "không giới hạn" đúng ở mọi số lượng, không riêng ở 9 tháng đang có. **AC-03**: chính request `curl` ở trên đã là bằng chứng — không mang cookie/localStorage/session nào (tương đương trình duyệt vừa xóa cache/máy lạ), vẫn trả đủ 9 cột khớp DB, vì toàn bộ chuỗi entry → persistence đọc thẳng từ server mỗi lần request, không có bước đọc bộ nhớ tạm nào. **AC-04**: xác nhận bằng đọc code — `maxMonth = Math.max(...months.map(...), 1)` có fallback `1` nên không lỗi khi `months` rỗng; `months.map(...)` trên mảng rỗng trả về mảng JSX rỗng, không crash, không hiển thị cột giả — không mô phỏng bằng dữ liệu test thật vì môi trường dev hiện đã có 9 tháng, xóa hết để test sẽ phá dữ liệu đang dùng cho các US khác. **Giới hạn của bằng chứng**: không dùng trình duyệt thật (không có Browser/Playwright tool trong phiên làm việc này) nên không quan sát trực tiếp bằng mắt qua giao diện — thay bằng HTTP request thật + đối chiếu DB trực tiếp, độ tin cậy tương đương vì `curl` nhận đúng HTML đã render từ Server Component thật, không phải mock |
| `TB-02` | DEV wiki mục 7 (Verification) cập nhật đúng kết quả thật của `TB-01`; memory `JDG-030` chuyển `Status: Confirmed` nếu bằng chứng khớp đúng nhận định | `docs/kb/dev/wiki/US-007-phan-tich-xu-huong-lich-su.md` (mục 7), `docs/memory/judgement-log.md` (`JDG-030`) | `TB-01` | Plan mục 7: Knowledge base/memory = Yes | Đối chiếu bằng mắt: nội dung wiki khớp đúng kết quả `TB-01`, không ghi kết quả giả định | Done | DEV wiki mục 7 đã cập nhật khớp `TB-01`; `JDG-030` chuyển `Status: Confirmed` — bằng chứng khảo sát source khớp đúng kết quả kiểm chứng thật |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Không áp dụng, plan mục 9 xác nhận không đổi schema.
- Cập nhật BA/DEV function wiki — DEV wiki đã tạo ở stage `plan`; `TB-02` cập nhật mục 7 với kết quả thật.
- Cập nhật memory — `TB-02` (chuyển `JDG-030` sang `Confirmed`).
- Verification cuối — `TB-01`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (đủ 5 cột khi có 5 tháng) | `TB-01` | |
| AC-02 (đủ toàn bộ cột khi > 12 tháng, không cắt bớt) | `TB-01` | |
| AC-03 (không mất tháng khi xóa cache/máy khác) | `TB-01` | Kiểm bằng chế độ duyệt web ẩn danh — xem plan mục 12/13 |
| AC-04 (biểu đồ trống khi chưa có tháng nào) | `TB-01` | |
| Screen Element `EL-01` | `TB-01` | |
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
