---
status: Active
feature: US-007
updated: 2026-08-21
plan: docs/features/US-007-phan-tich-xu-huong-lich-su/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-007-phan-tich-xu-huong-lich-su.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-007", "Phân tích xu hướng toàn bộ lịch sử (DEV)"]
---

# US-007 — Phân tích xu hướng trên toàn bộ lịch sử đã lưu (DEV)

## 1. Tổng Quan Kỹ Thuật

Không có thay đổi kỹ thuật nào. Biểu đồ "Xu hướng" (tổng chi qua các tháng) trong `components/BudgetApp.tsx` đã hiển thị đúng toàn bộ tháng ngân sách lưu bền vững, nhờ chuỗi entry → persistence hiện có: Server Component gọi `getBudgetSnapshot()` mỗi lần render, và `monthBudgetRepository.findAll()` (`prisma.monthBudget.findMany()`) không có `where`/`take` nào giới hạn kết quả. Đây là hệ quả tự nhiên của việc `US-001` chuyển `MonthBudget` sang Prisma/SQLite và `US-002` tách route `/budget` luôn gọi lại server thay vì đọc `localStorage`.

## 2. Luồng End-To-End

```text
app/budget/page.tsx (Server Component) -> getBudgetSnapshot() (Server Action)
  -> get-budget-snapshot.ts (use-case) -> budget-snapshot-service.ts (domain service)
  -> monthBudgetRepository.findAll() (domain interface) -> month-budget-prisma-repository.ts (infrastructure)
  -> prisma.monthBudget.findMany() (không where/take) -> SQLite
  -> BudgetSnapshot { months } -> prop initialBudget -> components/BudgetApp.tsx (Client Component)
  -> state months (khởi tạo từ initialBudget.months, không cắt bớt) -> biểu đồ "Xu hướng" (months.map)
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `app/budget/page.tsx` | Server Component — gọi `getBudgetSnapshot()` mỗi lần render, không cache client-side giữa các phiên |
| Auth | N/A | Single-user, không đăng nhập (`DEC-004`) |
| Application | `server/budget/application/use-cases/get-budget-snapshot.ts` | Gọi thẳng `service.getSnapshot()`, không tham số |
| Domain | `server/budget/domain/services/budget-snapshot-service.ts` | Gộp `months`/`categories`/`transactions`/`purchaseItems`, sắp theo `id` (thời gian) |
| Infrastructure | `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` | `findAll()` → `prisma.monthBudget.findMany()`, không giới hạn |
| Data | `prisma/schema.prisma` (`model MonthBudget`) | Không đổi — không cần field/index mới |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Page | `app/budget/page.tsx` | Server Component, gọi `getBudgetSnapshot()`, truyền `initialBudget` |
| Component | `components/BudgetApp.tsx` | Khối "Xu hướng" (dòng ~1116-1134); state `months` khởi tạo từ `initialBudget.months` (dòng ~251) |
| Use-case (Application) | `server/budget/application/use-cases/get-budget-snapshot.ts` | Đọc snapshot toàn bộ, không tham số lọc |
| Domain service | `server/budget/domain/services/budget-snapshot-service.ts` | Dựng `BudgetSnapshot`, gộp dữ liệu theo `monthId` |
| Domain repository interface | `server/budget/domain/repositories/month-budget-repository.ts` | `findAll(): Promise (MonthBudgetEntity[])` — không tham số |
| Repository (Infrastructure) | `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` | `findAll()` → `prisma.monthBudget.findMany()` không giới hạn |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `MonthBudget` | `id` (dạng `YYYY-MM`, dùng để sắp thứ tự thời gian) | Không có index riêng cho mục đích này | `categories[]`, `transactions[]`, `purchaseItems[]` |

- Migration liên quan: Không có — không đổi schema.
- DBML đã đồng bộ: Có — không đổi, `docs/db/schema.dbml` khớp `schema.prisma` hiện tại.
- Lưu ý SQLite: Không áp dụng — không chạm truy vấn/kiểu dữ liệu mới nào.

## 5. Contract

Không có contract nào bị đổi. `getBudgetSnapshot()` giữ nguyên chữ ký và kiểu dữ liệu trả về `BudgetSnapshot`.

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-001` | Depends on | `MonthBudget` lưu bền vững qua Prisma/SQLite |
| `US-002` | Depends on | Route `/budget` gọi lại server mỗi lần render, không đọc `localStorage` |
| `US-011` | Related only | Cùng thuộc F4, nhưng dùng khối UI và giới hạn thời gian riêng (3/6/9/12 tháng) |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — "No errors found" | 2026-08-21 |
| `npx next build` | Passed — 3 lần liên tiếp "Compiled successfully", 6 route, 0 lỗi | 2026-08-21 |
| Bằng chứng AC-01/AC-02 (không giới hạn số tháng) | `curl` thật tới `/budget` (HTTP 200) đếm được 9 cột trong biểu đồ "Xu hướng" (`class="stick success-stick"`), khớp đúng 9 dòng `MonthBudget` truy vấn trực tiếp `prisma/dev.db` (`2026-02`..`2026-10`) — 1:1, không thiếu/thừa. `grep` xác nhận không có `.slice(`/`take:`/`LIMIT` nào giới hạn mảng tháng trong toàn bộ chuỗi entry → persistence | 2026-08-21 |
| Bằng chứng AC-03 (không phụ thuộc bộ nhớ tạm trình duyệt) | Chính request `curl` trên không mang cookie/localStorage/session nào (tương đương trình duyệt xóa cache/máy lạ) vẫn trả đủ 9 cột khớp DB — chuỗi entry → persistence đọc thẳng từ server mỗi lần request | 2026-08-21 |
| Bằng chứng AC-04 (biểu đồ trống khi chưa có tháng nào) | Xác nhận qua đọc code — `maxMonth` có fallback `1`, `months.map(...)` trên mảng rỗng không crash, không hiển thị cột giả. Không mô phỏng bằng dữ liệu test thật vì môi trường dev đã có 9 tháng dùng chung cho các US khác, xóa hết sẽ phá dữ liệu đó | 2026-08-21 |

Giới hạn của bằng chứng: phiên làm việc này không có công cụ trình duyệt tự động (Browser/Playwright), nên không quan sát trực tiếp bằng mắt qua giao diện như các US trước — thay bằng HTTP request thật (`curl`) tới `next dev` đang chạy, đối chiếu trực tiếp với dữ liệu SQLite thật. Độ tin cậy tương đương vì `curl` nhận đúng HTML đã render từ Server Component thật, không phải dữ liệu mock.

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Một thay đổi tương lai vô tình thêm giới hạn/phân trang vào `monthBudgetRepository.findAll()` | Thấp | Không cần rollback kỹ thuật — chỉ cần gỡ giới hạn nếu phát hiện; `BR-028` là bằng chứng ràng buộc để đối chiếu khi review |
