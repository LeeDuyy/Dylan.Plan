# Phân tích xu hướng trên toàn bộ lịch sử đã lưu — SE Plan

Status: Ready for task-breakdown
Feature: US-007
Spec: spec.md
Created: 2026-08-21
Updated: 2026-08-21
DEV Wiki: `docs/kb/dev/wiki/US-007-phan-tich-xu-huong-lich-su.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Khảo sát cho thấy nguồn dữ liệu của biểu đồ "Xu hướng" (tổng chi qua các tháng) **đã** tính từ toàn bộ tháng ngân sách lưu bền vững trong cơ sở dữ liệu từ khi `US-001` migrate sang Prisma/SQLite — không có giới hạn số tháng, không phụ thuộc bộ nhớ tạm của trình duyệt. Gap gốc mà raw `US-007` mô tả ("chỉ tính trên các tháng đang có trong bộ nhớ hiện tại") thuộc về giai đoạn trước `US-001` (khi dữ liệu còn ở `localStorage`); sau khi `US-001` triển khai, hành vi mong muốn đã tự động đúng như một hệ quả của việc đổi nguồn lưu trữ, không phải một thay đổi tính năng riêng cần code mới. Kế hoạch này **không sửa file source nào** — chỉ xác nhận bằng chứng kỹ thuật cho từng AC và khóa hành vi này lại bằng verification, để tránh hồi quy về sau (ví dụ nếu ai đó vô tình thêm giới hạn/phân trang vào truy vấn tháng).

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-007-phan-tich-xu-huong-lich-su/spec.md` | Nguồn yêu cầu — 4 AC, 1 Screen Element (`EL-01`), mục 9/10/13 |
| `docs/kb/ba/wiki/knowledge/feature/US-007-phan-tich-xu-huong-lich-su.md` | Đối chiếu mục tiêu/phạm vi đã tổng hợp (đã thu hẹp đúng biểu đồ Xu hướng, `DEC-110`) |
| `components/BudgetApp.tsx` | Nơi render biểu đồ "Xu hướng" (dòng ~1116-1134, `months.map(...)`) và khởi tạo state `months` từ `initialBudget.months` (dòng ~251) |
| `app/budget/page.tsx` | Xác nhận Server Component chỉ gọi `getBudgetSnapshot()` rồi truyền `initialBudget` xuống Client Component, không lọc/giới hạn tháng nào trước khi truyền |
| `server/budget/application/use-cases/get-budget-snapshot.ts` | Use-case đọc snapshot — chỉ gọi thẳng `service.getSnapshot()`, không nhận tham số giới hạn |
| `server/budget/domain/services/budget-snapshot-service.ts` | Domain service dựng `BudgetSnapshot` — gọi `monthBudgetRepository.findAll()` không kèm điều kiện, sắp `monthSnapshots` theo `a.id.localeCompare(b.id)` (thứ tự thời gian vì id dạng `YYYY-MM`) |
| `server/budget/domain/repositories/month-budget-repository.ts` | Interface `MonthBudgetRepository.findAll()` — không có tham số lọc/giới hạn |
| `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` | Implementation `findAll()` gọi `prisma.monthBudget.findMany()` — không `where`, không `take`, không giới hạn nào |
| `prisma/schema.prisma` | Xác nhận model `MonthBudget` không có cột nào phục vụ việc lọc/giới hạn theo thời gian riêng cho mục đích này |
| `docs/memory/decisions.md` | `DEC-001` (ưu tiên chuyển sang lưu trữ bền vững), `DEC-109`, `DEC-110` |
| `docs/memory/rules.md` (R13, Light DDD) | Xác nhận không cần domain service/rule mới vì không có logic nghiệp vụ nào cần thêm |

## 3. Hành Vi Hiện Tại

`app/budget/page.tsx` (Server Component) gọi `getBudgetSnapshot()` mỗi lần render trang, trả về toàn bộ `BudgetSnapshot.months` — kết quả của `monthBudgetRepository.findAll()` (`prisma.monthBudget.findMany()`, không `where`/`take`) gộp với `categories`/`transactions`/`purchaseItems` tương ứng. `components/BudgetApp.tsx` nhận `initialBudget` này làm giá trị khởi tạo cho state `months` (dòng 251: `useState` với giá trị khởi tạo `initialBudget.months`). Biểu đồ "Xu hướng" (dòng 1116-1134) lặp trực tiếp qua `months` để vẽ một cột cho mỗi tháng — không có bước lọc, cắt bớt, hay giới hạn số tháng nào ở bất kỳ lớp nào trong chuỗi này.

Nói cách khác: hành vi mục tiêu của `US-007` đã tồn tại sẵn trong source hiện tại, là hệ quả tự nhiên của việc `US-001` chuyển `MonthBudget` sang lưu trong SQLite và `US-002` tách trang `/budget` gọi `getBudgetSnapshot()` mỗi lần tải trang (không cache phía client giữa các phiên, không đọc từ `localStorage`).

## 4. Hành Vi Mục Tiêu

Giống hệt hành vi hiện tại — không cần đổi source. Chỉ xác nhận và khóa lại bằng verification:

- Biểu đồ "Xu hướng" tiếp tục hiển thị đủ mọi tháng trả về từ `getBudgetSnapshot()`, không thêm giới hạn/phân trang nào (đúng `DEC-109`).
- Không có bước nào trong chuỗi entry → persistence phụ thuộc `localStorage` hay bất kỳ bộ nhớ tạm nào của trình duyệt cho dữ liệu tháng.

## 5. Luồng End-To-End

```text
Entry: app/budget/page.tsx (Server Component)
  -> getBudgetSnapshot() (Server Action, server/budget/actions.ts)
       -> application/use-cases/get-budget-snapshot.ts -> service.getSnapshot()
            -> domain/services/budget-snapshot-service.ts
                 -> monthBudgetRepository.findAll() (infrastructure/repositories/month-budget-prisma-repository.ts)
                      -> prisma.monthBudget.findMany() — không where, không take, trả toàn bộ tháng đã lưu
                 -> gộp categories/transactions/purchaseItems theo monthId, sắp theo a.id.localeCompare(b.id)
  -> trả BudgetSnapshot { months: MonthBudgetSnapshot[] } cho page.tsx
  -> truyền làm prop initialBudget xuống components/BudgetApp.tsx (Client Component)
       -> state cục bộ months khởi tạo bằng initialBudget.months — giữ nguyên toàn bộ mảng, không cắt bớt
       -> biểu đồ "Xu hướng" (EL-01): months.map((month) => cột tổng chi của tháng đó)
```

Không có nhánh ghi nào liên quan tới yêu cầu này — đây là luồng chỉ đọc.

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `docs/features/US-001-luu-tru-chi-tieu-ben-vung/plan.md` | `prisma/schema.prisma` đã có model `MonthBudget` bền vững, đã áp migration; `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` đã dùng Prisma + SQLite thật | Không (đã Delivered With Notes) | — |
| `docs/features/US-002-route-rieng-quan-ly-chi-tieu/plan.md` | `app/budget/page.tsx` đã tồn tại, gọi `getBudgetSnapshot()` mỗi lần render, không đọc `localStorage` | Không (đã Delivered With Notes) | — |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | Không đổi `app/budget/page.tsx` |
| Server Action | No | `getBudgetSnapshot` giữ nguyên chữ ký và hành vi |
| Route Handler (`app/api`) | N/A | Dự án không dùng Route Handler cho luồng này |
| Auth / middleware / permission | N/A | Single-user, không đăng nhập (`DEC-004`) |
| Prisma schema | No | Không thêm/đổi field nào |
| Migration SQLite | No | Không cần migration |
| DBML | No | Không đổi schema |
| Seed data | No | Không liên quan |
| Caching / revalidate | No | Không đổi hành vi ghi/`revalidatePath` nào — đây là luồng chỉ đọc |
| Export / báo cáo | No | US-008 (xuất dữ liệu) riêng, ngoài phạm vi |
| Mail / webhook / job nền | N/A | Không có |
| Knowledge base / memory | Yes | DEV wiki mới (`US-007`), `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

Không có — kế hoạch này không sửa file source nào. Bảng dưới liệt kê các file đã xác minh (không đổi) để reviewer đối chiếu:

| Tầng | File | Trạng thái |
| --- | --- | --- |
| Entry | `app/budget/page.tsx` | Đã xác minh — không đổi |
| Entry (UI) | `components/BudgetApp.tsx` (khối "Xu hướng", dòng ~1116-1134; state `months`, dòng 251) | Đã xác minh — không đổi |
| Application | `server/budget/application/use-cases/get-budget-snapshot.ts` | Đã xác minh — không đổi |
| Domain | `server/budget/domain/services/budget-snapshot-service.ts` | Đã xác minh — không đổi |
| Domain | `server/budget/domain/repositories/month-budget-repository.ts` | Đã xác minh — không đổi |
| Infrastructure | `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` | Đã xác minh — không đổi |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

`monthBudgetRepository.findAll()` (`prisma.monthBudget.findMany()`, không `where`/`take`) đã trả về toàn bộ tháng ngân sách đã lưu, đúng yêu cầu "không giới hạn số tháng" (`DEC-109`). Không cần thêm field, index, hay truy vấn mới.

## 10. Contract

Không có contract nào bị đổi — không có Server Action, type, hay response shape nào thay đổi trong kế hoạch này.

## 11. File Sẽ Thay Đổi

Không có file source nào thay đổi.

| File | Ý định thay đổi |
| --- | --- |
| `docs/kb/dev/wiki/US-007-phan-tich-xu-huong-lich-su.md` | Tạo mới — ghi lại bằng chứng kỹ thuật xác nhận hành vi đã đúng |
| `docs/kb/dev/00-index.md` | Thêm dòng `US-007` |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng |
| --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi — không đổi source nên dự kiến giữ nguyên trạng thái sạch đã có |
| Prisma | `rtk npx prisma validate` | schema hợp lệ — không đổi schema |
| Test | `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (`JDG-002`) |
| Build | `rtk next build` (dùng `npx next build` để lấy exit code thật — `JDG-015`) | 0 lỗi |
| Thủ công AC-01 | Tạo/xác nhận 5 tháng ngân sách đã lưu, mở `/budget`, đếm số cột biểu đồ "Xu hướng" | Đủ 5 cột |
| Thủ công AC-02 | Xác nhận môi trường có nhiều hơn 12 tháng ngân sách đã lưu, mở `/budget`, đếm số cột | Đủ toàn bộ số tháng, không bị cắt ở 12 |
| Thủ công AC-03 | Mở `/budget` bằng chế độ duyệt web ẩn danh (tương đương chưa từng có cache/local state cho trang này), đếm số cột | Số cột khớp đúng số tháng đã lưu trong DB tại thời điểm kiểm tra |
| Thủ công AC-04 | Xác nhận (hoặc mô phỏng bằng dữ liệu test riêng) trường hợp chưa có tháng nào — quan sát biểu đồ | Không có cột nào, không lỗi console |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Một thay đổi tương lai vô tình thêm `take`/phân trang vào `monthBudgetRepository.findAll()` hoặc `prisma.monthBudget.findMany()`, làm hồi quy lại đúng gap mà `US-007` giải quyết | Thấp | `BR-028` đã ghi rõ ràng buộc "không giới hạn số tháng" — `ssr-review` của các US sau này chạm tới `findAll()` cần đối chiếu lại `BR-028` | Không cần rollback kỹ thuật — chỉ cần gỡ giới hạn nếu phát hiện |
| AC-03 (xóa cache/máy khác) khó mô phỏng chính xác trong môi trường dev cục bộ | Thấp | Dùng chế độ duyệt web ẩn danh (không chia sẻ cache/localStorage với phiên thường) làm bằng chứng thay thế hợp lý — đã nêu ở mục 12 | Không áp dụng |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Verification tổng hợp: typecheck, build, đủ 4 AC kiểm chứng qua thao tác thật | Pending |
| `TB-02` | Cập nhật DEV wiki mục 7 (Verification) với kết quả thật của `TB-01`; chuyển `JDG-030` sang `Confirmed` nếu khớp | Pending |

Readiness: Ready — không có phụ thuộc chặn (`US-001`, `US-002` đã Delivered With Notes); không cần `ssr-data` vì không đổi schema; `ssr-breaker` đã chia 2 task, ma trận coverage đủ 4 AC — xem `task.md`.
