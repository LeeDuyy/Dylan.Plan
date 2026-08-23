# Xuất dữ liệu từ nguồn lưu trữ bền vững — SE Plan

Status: Ready for task-breakdown
Feature: US-008
Spec: spec.md
Created: 2026-08-21
Updated: 2026-08-21
DEV Wiki: `docs/kb/dev/wiki/US-008-xuat-du-lieu-ben-vung.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Giống hệt phát hiện ở `US-007` (`JDG-030`): khảo sát source cho thấy nút "Xuất JSON" **đã** đóng gói dữ liệu lấy từ state `months` — vốn là chính `BudgetSnapshot.months` trả về từ `getBudgetSnapshot()` (đọc toàn bộ cơ sở dữ liệu, không lọc/giới hạn), không phải một bản sao rút gọn. `exportData()` xuất thẳng `{ months, selectedMonthId }`, và mỗi phần tử `months` đã có đủ `categories`, `transactions`, `purchaseItems` cho **mọi tháng** (không chỉ tháng đang xem). Gap gốc mà raw `US-008` mô tả (xuất từ bộ nhớ tạm trình duyệt thay vì cơ sở dữ liệu) đã tự động được `US-001`/`US-002` giải quyết — không cần sửa file source nào. Kế hoạch này chỉ xác nhận bằng bằng chứng và ghi lại ràng buộc (`BR-029`) để tránh hồi quy.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-008-xuat-du-lieu-ben-vung/spec.md` | Nguồn yêu cầu — 4 AC, 1 Screen Element (`EL-01`), mục 9/10/13 |
| `docs/kb/ba/wiki/knowledge/feature/US-008-xuat-du-lieu-ben-vung.md` | Đối chiếu mục tiêu/phạm vi đã tổng hợp |
| `components/BudgetApp.tsx` | Hàm `exportData()` (dòng ~558-566); khai báo `type MonthBudget = MonthBudgetSnapshot` (dòng 44) — xác nhận state client dùng thẳng type server, không rút gọn field nào; state `months` khởi tạo từ `initialBudget.months` (dòng ~251) |
| `app/budget/page.tsx` | Xác nhận Server Component chỉ gọi `getBudgetSnapshot()` rồi truyền `initialBudget`, không lọc field nào trước khi truyền |
| `server/budget/application/use-cases/get-budget-snapshot.ts` | Use-case đọc snapshot — không tham số, không lọc |
| `server/budget/domain/services/budget-snapshot-service.ts` | Domain service dựng `MonthBudgetSnapshot` cho từng tháng — đủ `categories`, `transactions`, `purchaseItems`, không riêng cho tháng hiện tại |
| `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` | `findAll()` không giới hạn — đã xác minh lại ở `US-007` |
| `docs/memory/decisions.md` | `DEC-001` (ưu tiên chuyển sang lưu trữ bền vững) |
| `docs/memory/judgement-log.md` | `JDG-030` (US-007 — cùng dạng gap đã tự giải quyết bởi US-001) |

## 3. Hành Vi Hiện Tại

`exportData()` (`components/BudgetApp.tsx:558-566`) đóng gói `JSON.stringify({ months, selectedMonthId })` thành file tải về. `months` là state client được khởi tạo và làm mới từ `initialBudget.months`/`getBudgetSnapshot()` — chính là `BudgetSnapshot.months` do server trả về, đọc trực tiếp từ cơ sở dữ liệu qua `monthBudgetRepository.findAll()` (không giới hạn) và gộp đầy đủ `categories`/`transactions`/`purchaseItems` cho từng tháng (`budget-snapshot-service.ts`). Không có bước nào trong `exportData()` đọc từ `localStorage` hay bất kỳ bộ nhớ tạm nào khác của trình duyệt.

## 4. Hành Vi Mục Tiêu

Giống hệt hành vi hiện tại — không cần đổi source. Chỉ xác nhận và khóa lại bằng verification:

- File JSON tải về tiếp tục chứa `months` với đầy đủ mọi tháng, danh mục, giao dịch, item cần mua đã lưu bền vững (đúng `DEC-001`, `BR-029`), không lọc theo tháng đang xem.

## 5. Luồng End-To-End

```text
Entry: components/BudgetApp.tsx (Client Component)
  -> Dylan bấm nút "Xuất JSON" (EL-01)
  -> exportData() đọc trực tiếp state months (không gọi lại server — đã có sẵn từ getBudgetSnapshot() lúc tải trang / lần refreshSnapshot() gần nhất)
  -> JSON.stringify({ months, selectedMonthId }) -> Blob -> tải file .json về máy (URL.createObjectURL + anchor.click())

Nguồn của state months (đã xác nhận ở US-007, dùng lại nguyên vẹn ở đây):
app/budget/page.tsx (Server Component) -> getBudgetSnapshot()
  -> budget-snapshot-service.ts -> monthBudgetRepository.findAll() (không giới hạn)
  -> gộp categories/transactions/purchaseItems cho MỌI tháng, không riêng tháng hiện tại
  -> BudgetSnapshot { months } -> prop initialBudget -> state months (không cắt bớt field/tháng nào)
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `docs/features/US-001-luu-tru-chi-tieu-ben-vung/plan.md` | `prisma/schema.prisma` đã có model bền vững, đã áp migration | Không (đã Delivered With Notes) | — |
| `docs/features/US-002-route-rieng-quan-ly-chi-tieu/plan.md` | `app/budget/page.tsx` đã gọi `getBudgetSnapshot()` mỗi lần render | Không (đã Delivered With Notes) | — |
| `docs/features/US-007-phan-tich-xu-huong-lich-su/plan.md` | Đã xác nhận cùng chuỗi entry → persistence (`months` state), tái sử dụng kết luận `JDG-030` | Không (đã Delivered With Notes) | — |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | Không đổi `app/budget/page.tsx` |
| Server Action | No | `getBudgetSnapshot` giữ nguyên |
| Route Handler (`app/api`) | N/A | Không dùng cho luồng này |
| Auth / middleware / permission | N/A | Single-user (`DEC-004`) |
| Prisma schema | No | Không đổi |
| Migration SQLite | No | Không cần |
| DBML | No | Không đổi |
| Seed data | No | Không liên quan |
| Caching / revalidate | No | `exportData()` không ghi dữ liệu, không cần `revalidatePath` |
| Export / báo cáo | Yes | Chính là nội dung yêu cầu này — xác nhận `exportData()` đã đúng |
| Mail / webhook / job nền | N/A | Không có |
| Knowledge base / memory | Yes | DEV wiki mới (`US-008`), `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

Không có — kế hoạch này không sửa file source nào. Bảng dưới liệt kê file đã xác minh (không đổi):

| Tầng | File | Trạng thái |
| --- | --- | --- |
| Entry (UI) | `components/BudgetApp.tsx` (`exportData()`, dòng 558-566; state `months`, dòng 251) | Đã xác minh — không đổi |
| Application | `server/budget/application/use-cases/get-budget-snapshot.ts` | Đã xác minh — không đổi |
| Domain | `server/budget/domain/services/budget-snapshot-service.ts` | Đã xác minh — không đổi |
| Infrastructure | `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` | Đã xác minh — không đổi |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

`exportData()` dùng thẳng `months` — vốn đã là `BudgetSnapshot` đầy đủ, không giới hạn. Không cần thêm field, index, hay truy vấn mới.

## 10. Contract

Không có contract nào bị đổi.

## 11. File Sẽ Thay Đổi

Không có file source nào thay đổi.

| File | Ý định thay đổi |
| --- | --- |
| `docs/kb/dev/wiki/US-008-xuat-du-lieu-ben-vung.md` | Tạo mới — ghi lại bằng chứng kỹ thuật xác nhận hành vi đã đúng |
| `docs/kb/dev/00-index.md` | Thêm dòng `US-008` |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng |
| --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi |
| Prisma | `rtk npx prisma validate` | schema hợp lệ — không đổi schema |
| Test | `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (`JDG-002`) |
| Build | `npx next build` (exit code thật — `JDG-015`) | 0 lỗi |
| Bằng chứng AC-01/AC-03 | Truy vấn trực tiếp `prisma/dev.db` đếm số `MonthBudget`/`Category`/`Transaction`/`PurchaseItem`; đối chiếu với cấu trúc `months` mà `exportData()` sẽ đóng gói (đọc code, không có bước lọc nào) | Khớp 1:1, không thiếu tháng/danh mục/giao dịch nào |
| Bằng chứng AC-02/AC-03 (item cần mua ở tháng khác) | Xác nhận `MonthBudgetSnapshot.purchaseItems` được gộp cho **mọi** `monthId` trong `budget-snapshot-service.ts` (không riêng tháng hiện tại), và `exportData()` không lọc bớt trường này | Đúng — không có nhánh code nào loại trừ tháng không phải hiện tại |
| Bằng chứng AC-04 | Đọc code: khi `MonthBudget` rỗng, `months = []`, `exportData()` vẫn chạy `JSON.stringify({ months: [], selectedMonthId })` — không có nhánh nào ném lỗi khi mảng rỗng | Không crash, cấu trúc JSON hợp lệ |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Một thay đổi tương lai vô tình đổi `exportData()` để chỉ xuất `selectedMonth` thay vì toàn bộ `months` | Thấp | `BR-029` ghi rõ ràng buộc — `ssr-review` của các thay đổi sau này chạm `exportData()` cần đối chiếu lại `BR-029` | Không cần rollback kỹ thuật — chỉ cần sửa lại nếu phát hiện |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Verification tổng hợp: typecheck, build, đủ 4 AC kiểm chứng bằng bằng chứng thật | Pending |
| `TB-02` | Cập nhật DEV wiki mục 7 với kết quả thật của `TB-01` | Pending |

Readiness: Ready — không có phụ thuộc chặn (`US-001`, `US-002`, `US-007` đã Delivered With Notes); không cần `ssr-data`; `ssr-breaker` đã chia đúng 2 task (`TB-01`, `TB-02`), ma trận coverage đủ 4 AC — xem `task.md`.
