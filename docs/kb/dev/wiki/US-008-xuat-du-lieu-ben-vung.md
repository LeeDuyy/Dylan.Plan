---
status: Active
feature: US-008
updated: 2026-08-21
plan: docs/features/US-008-xuat-du-lieu-ben-vung/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-008-xuat-du-lieu-ben-vung.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-008", "Xuất dữ liệu bền vững (DEV)"]
---

# US-008 — Xuất dữ liệu từ nguồn lưu trữ bền vững (DEV)

## 1. Tổng Quan Kỹ Thuật

Không có thay đổi kỹ thuật nào. `exportData()` trong `components/BudgetApp.tsx` đã đóng gói state `months` — vốn là chính `BudgetSnapshot.months` trả về từ `getBudgetSnapshot()`, đọc trực tiếp từ cơ sở dữ liệu qua `monthBudgetRepository.findAll()` (không giới hạn) và gộp đầy đủ `categories`/`transactions`/`purchaseItems` cho mọi tháng. Đây là hệ quả tự nhiên của `US-001`/`US-002`, cùng chuỗi entry → persistence đã xác nhận ở `US-007` (`JDG-030`).

## 2. Luồng End-To-End

```text
components/BudgetApp.tsx: Dylan bấm "Xuất JSON" -> exportData()
  -> JSON.stringify({ months, selectedMonthId }) -> Blob -> tải file .json

Nguồn của months (dùng chung với US-007):
app/budget/page.tsx -> getBudgetSnapshot() -> budget-snapshot-service.ts
  -> monthBudgetRepository.findAll() (không giới hạn) -> BudgetSnapshot { months } -> state months
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | `exportData()` dòng ~558-566 — không gọi lại server, dùng thẳng state `months` đã có sẵn |
| Application | `server/budget/application/use-cases/get-budget-snapshot.ts` | Nguồn của `months` — không tham số lọc |
| Domain | `server/budget/domain/services/budget-snapshot-service.ts` | Gộp `categories`/`transactions`/`purchaseItems` cho mọi tháng |
| Infrastructure | `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` | `findAll()` không giới hạn |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Component | `components/BudgetApp.tsx` | `exportData()` (dòng 558-566); `type MonthBudget = MonthBudgetSnapshot` (dòng 44) — dùng thẳng type server, không rút gọn field |
| Use-case (Application) | `server/budget/application/use-cases/get-budget-snapshot.ts` | Nguồn dữ liệu của state `months` |
| Domain service | `server/budget/domain/services/budget-snapshot-service.ts` | Dựng `MonthBudgetSnapshot` đầy đủ cho từng tháng |
| Repository (Infrastructure) | `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` | `findAll()` không giới hạn |

## 4. Prisma Schema Và Migration

Không đổi — không có migration nào liên quan tới requirement này.

## 5. Contract

Không có contract nào bị đổi. `exportData()` không gọi Server Action nào, chỉ đọc state client hiện có.

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-001` | Depends on | Dữ liệu lưu bền vững qua Prisma/SQLite |
| `US-002` | Depends on | Route `/budget` gọi lại server mỗi lần render |
| `US-007` | Related only | Cùng dùng chung chuỗi entry → persistence (state `months`), cùng kết luận `JDG-030` |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — "No errors found" | 2026-08-21 |
| `npx next build` | Passed — "Errors: 0", exit 0 | 2026-08-21 |
| Bằng chứng AC-01 (đủ tháng/danh mục/giao dịch) | Truy vấn trực tiếp `prisma/dev.db`: 9 `MonthBudget`, 52 `Category`, 3 `Transaction` — khớp payload HTML thật từ `curl` tới `/budget` | 2026-08-21 |
| Bằng chứng AC-02/AC-03 (item cần mua ở tháng khác tháng hiện tại) | DB có 2 `PurchaseItem`, cả hai đều ở tháng khác tháng hiện tại (`2026-09`, `2026-10`; hiện tại `2026-08`); `curl` payload HTML chứa đủ cả 2 id lẫn tên — xác nhận `initialBudget`/state `months` có đủ `purchaseItems` của tháng khác, không lọc theo tháng đang xem. `exportData()` đọc thẳng state này, không có bước lọc nào thêm | 2026-08-21 |
| Bằng chứng AC-04 (JSON hợp lệ khi rỗng) | Xác nhận qua đọc code — `months = []` không có nhánh nào ném lỗi trong `exportData()` | 2026-08-21 |

Giới hạn của bằng chứng: không bấm nút "Xuất JSON" thật qua trình duyệt (không có công cụ Browser trong phiên này); thay bằng đối chiếu payload HTML server thật (nguồn dữ liệu `exportData()` đọc) với DB thật, cộng xác nhận qua đọc code rằng `exportData()` không biến đổi/lọc gì thêm giữa state và file xuất.

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Một thay đổi tương lai vô tình đổi `exportData()` để chỉ xuất tháng đang chọn | Thấp | `BR-029` là bằng chứng ràng buộc để đối chiếu khi review; sửa lại nếu phát hiện |
