# Liên kết giao dịch theo danh mục bằng ID — SE Plan

Status: Implemented
Feature: US-003
Spec: spec.md
Created: 2026-08-05
Updated: 2026-08-05
DEV Wiki: `docs/kb/dev/wiki/US-003-lien-ket-giao-dich-theo-id.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Đây **không phải** một tính năng cần viết mới — toàn bộ hành vi mô tả trong spec (AC-01..AC-03) đã triển khai thật cùng đợt `US-001` và đang chạy đúng trong `server/budget/**` hiện có. Khảo sát source thật xác nhận khớp 100% với spec, không phát hiện lệch nào:

- `prisma/schema.prisma` — `Transaction.categoryId` là khóa ngoại thật tới `Category.id` (`onDelete: Restrict`), không phải trường tùy chọn hay chuỗi tên.
- `record-quick-transaction.ts` — gán `categoryId` khi tạo giao dịch, kiểm tra danh mục thuộc đúng tháng trước khi lưu.
- `upsert-category.ts` (nhánh cập nhật) — chỉ sửa `name`/`type`/`budget` trên `Category`, **không đụng** tới bất kỳ `Transaction` nào — đây chính là lý do đổi tên danh mục không làm mất liên kết giao dịch cũ (AC-03).
- `budget-snapshot-service.ts` — "Chi thực tế" (`actual`) tính bằng `transactionRepository.sumAmountGroupedByCategory()` (Prisma `groupBy` theo `categoryId`), không có trường lưu tay.
- `TransactionSnapshot` (DTO trả cho client) chỉ mang `categoryId`, không mang tên danh mục — `components/BudgetApp.tsx` tự tra tên hiện tại bằng `categories.find(c => c.id === item.categoryId)?.name` mỗi lần render, nên tên hiển thị luôn là tên mới nhất.

Vì vậy, plan này không đề xuất sửa file nào. Nhiệm vụ của các stage kế tiếp là **xác nhận lại bằng thao tác thật** (task-breakdown sẽ tạo task dạng "kiểm chứng AC-0x bằng thao tác thật", không phải "viết code X").

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-003-lien-ket-giao-dich-theo-id/spec.md` | Nguồn yêu cầu — 3 AC, Screen Element, Handoff (đã ghi rõ "Cần thay đổi cấu trúc dữ liệu: Không") |
| `docs/kb/ba/wiki/knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md` | Business rule `BR-007`, ghi chú provenance đã triển khai thật |
| `docs/kb/ba/wiki/delivery/pbi/US-003-lien-ket-giao-dich-theo-id.md` | Xác nhận 3 AC đã đồng bộ đúng spec |
| `docs/memory/decisions.md` | `DEC-004` (single-user), `DEC-007` (Chi thực tế là số suy ra) — cả hai đã áp dụng đúng trong code khảo sát được |
| `docs/kb/dev/00-index.md`, `docs/kb/dev/wiki/US-001-luu-tru-chi-tieu-ben-vung.md`, `docs/kb/dev/wiki/US-004-sua-xoa-tung-giao-dich.md` | Xác nhận DEV wiki hiện có cho `US-001`/`US-004`, kiến trúc `server/budget/**` thật |
| `prisma/schema.prisma` (model `Transaction`, `Category`) | Xác nhận `categoryId` là khóa ngoại thật, `onDelete: Restrict` — không cho xóa danh mục còn giao dịch (ngoài phạm vi US-003, thuộc US-005) |
| `server/budget/application/use-cases/record-quick-transaction.ts` | Xác nhận gán `categoryId` khi tạo giao dịch (AC-01) |
| `server/budget/application/use-cases/upsert-category.ts` | Xác nhận đổi tên chỉ sửa `Category`, không đụng `Transaction` (AC-03) |
| `server/budget/domain/services/budget-snapshot-service.ts` | Xác nhận "Chi thực tế" tính bằng aggregate theo `categoryId` (AC-02, AC-03) |
| `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` (`sumAmountGroupedByCategory`) | Xác nhận dùng Prisma `groupBy` theo `categoryId`, không theo tên |
| `components/BudgetApp.tsx` (đọc lại đoạn tra tên danh mục theo `categoryId` khi render giao dịch, đã đọc khi làm US-002) | Xác nhận tên danh mục hiển thị trên giao dịch luôn tra động, không lưu cứng (EL-01) |

## 3. Hành Vi Hiện Tại

Đây chính là hành vi **mục tiêu** — không có "trước/sau" cho requirement này vì đã triển khai xong. Mô tả dưới đây là trạng thái hiện tại, đồng thời là trạng thái mục tiêu của spec:

- Mỗi `Transaction` có cột `categoryId` bắt buộc (không null), là khóa ngoại thật tới `Category.id`.
- Ghi nhận giao dịch mới (`recordQuickTransaction`) luôn gán `categoryId` tại thời điểm tạo, xác thực danh mục thuộc đúng tháng.
- Đổi tên danh mục (`upsertCategory` nhánh update) chỉ sửa cột `name` trên `Category`, không viết lại bất kỳ `Transaction` nào.
- "Chi thực tế" của mỗi danh mục là kết quả `groupBy` trên `Transaction.categoryId` tại thời điểm đọc — không lưu trong `Category`.
- Client tra tên danh mục hiển thị trên mỗi giao dịch bằng cách tìm trong danh sách `categories` hiện tại theo `categoryId`, mỗi lần render.

## 4. Hành Vi Mục Tiêu

Không đổi — khớp hoàn toàn với mục 3. Không có file nào cần sửa.

## 5. Luồng End-To-End

```text
Ghi nhận: components/BudgetApp.tsx (nút "Ghi nhận") -> server/budget/actions.ts#recordQuickTransaction()
  -> application/use-cases/record-quick-transaction.ts (validate, gán categoryId) -> domain/repositories/transaction-repository.ts (interface)
  -> infrastructure/repositories/transaction-prisma-repository.ts -> Prisma Client -> SQLite (cột categoryId, khóa ngoại)

Đổi tên danh mục: components/BudgetApp.tsx (ô tên danh mục, onBlur) -> server/budget/actions.ts#upsertCategory()
  -> application/use-cases/upsert-category.ts (chỉ sửa Category.name) -> infrastructure/repositories/category-prisma-repository.ts -> SQLite (không đụng Transaction)

Đọc "Chi thực tế": app/budget/page.tsx / components/BudgetApp.tsx (refreshSnapshot) -> server/budget/actions.ts#getBudgetSnapshot()
  -> domain/services/budget-snapshot-service.ts#getSnapshot() -> transactionRepository.sumAmountGroupedByCategory() (Prisma groupBy theo categoryId) -> UI hiển thị tên danh mục hiện tại + "Chi thực tế" tính từ aggregate
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-001` (data model `Transaction.categoryId`, `server/budget/**`) | Đọc trực tiếp `prisma/schema.prisma`, `server/budget/**` — đã Delivered With Notes, đang chạy tốt | Không | Không có thứ tự nào cần tuân — chỉ xác nhận lại bằng thao tác thật |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | Không đổi `app/budget/page.tsx`, `app/page.tsx` |
| Server Action | No | Dùng nguyên `recordQuickTransaction`, `upsertCategory`, `getBudgetSnapshot` đã có |
| Route Handler (`app/api`) | N/A | Không dùng route riêng |
| Auth / middleware / permission | N/A | Single-user (`DEC-004`) |
| Prisma schema | No | `Transaction.categoryId` đã là khóa ngoại thật từ trước |
| Migration SQLite | No | Không cần migration mới |
| DBML | No | Không đổi schema |
| Seed data | No | Không đổi `lib/budget-defaults.ts` |
| Caching / revalidate | No | Không đổi hành vi ghi |
| Export / báo cáo | No | Không thuộc phạm vi |
| Mail / webhook / job nền | N/A | Không có |
| Knowledge base / memory | Yes | DEV function wiki mới cho US-003; `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Không đổi — đã đúng hành vi |
| Application (use-case) | `server/budget/application/use-cases/record-quick-transaction.ts` | Không đổi — đã gán `categoryId` đúng |
| Application (use-case) | `server/budget/application/use-cases/upsert-category.ts` | Không đổi — đã chỉ sửa `Category`, không đụng `Transaction` |
| Domain service | `server/budget/domain/services/budget-snapshot-service.ts` | Không đổi — đã aggregate đúng theo `categoryId` |
| Repository interface (domain) | `server/budget/domain/repositories/transaction-repository.ts` | Không đổi |
| Repository implementation (infrastructure) | `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | Không đổi — `sumAmountGroupedByCategory` đã đúng |
| Data | `prisma/schema.prisma` | Không đổi — `categoryId` đã là khóa ngoại |
| UI | `components/BudgetApp.tsx` | Không đổi — đã tra tên danh mục theo `categoryId` mỗi lần render |
| Consumer | Không có file nào khác cần đổi | — |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

`Transaction.categoryId` đã là khóa ngoại bắt buộc tới `Category.id` từ khi `US-001` áp dụng migration đầu tiên — không cần thêm/sửa field, index hay quan hệ nào cho US-003.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `Transaction` | Không đổi | Không (`categoryId` bắt buộc) | — | `@@index([categoryId])` đã có | Không có |

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `Transaction.categoryId` | Khóa ngoại bắt buộc tới `Category` | Không đổi | Không |
| `TransactionSnapshot` (DTO client) | Mang `categoryId`, không mang tên danh mục | Không đổi | Không |

## 11. File Sẽ Thay Đổi

Không có file nào cần sửa — toàn bộ hành vi đã đúng theo spec. Task ở stage kế tiếp là **xác nhận lại bằng thao tác thật**, không phải viết code.

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng | Kết quả thật (2026-08-06) |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi (xác nhận không có gì vỡ, dù không sửa file nào) | Passed — "No errors found" |
| Prisma | `rtk npx prisma validate` | schema hợp lệ | Passed |
| Test | `rtk vitest run` | Gap đã biết (giống US-001/US-002/US-004): `vitest` chưa cài — thay bằng kiểm chứng thủ công | Không chạy — gap giữ nguyên |
| Build | `rtk next build` | pass | Passed — `Errors: 0, Warnings: 0` |
| Thủ công | Ghi một giao dịch mới vào một danh mục trống, xem lại bảng chi tiết chi tiêu và bảng ngân sách | Giao dịch gắn đúng danh mục, "Chi thực tế" đổi đúng số tiền (AC-01) | Passed — "cafe 45k" vào "Giải trí / cafe", 0đ → 45.000đ |
| Thủ công | Xem "Chi thực tế" của một danh mục đang có ≥ 2 giao dịch | Đúng bằng tổng các giao dịch đó (AC-02) | Passed — "Di chuyển" 10.000đ + 20.000đ = 30.000đ |
| Thủ công | Đổi tên một danh mục đang có giao dịch, xem lại bảng chi tiết chi tiêu và bảng ngân sách | Giao dịch cũ vẫn hiển thị đúng dưới tên mới; "Chi thực tế" không đổi (AC-03) | Passed — "Giải trí / cafe" → "Giải trí / cafe / trà sữa", Chi thực tế giữ 45.000đ |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Vì không sửa code, rủi ro kỹ thuật gần như không có — rủi ro chính là spec/plan mô tả sai lệch so với hành vi thật nếu khảo sát bỏ sót trường hợp nào | Thấp | Đã đối chiếu trực tiếp 6 file source cốt lõi (schema, 2 use-case, domain service, repository, UI) trước khi viết plan | Không áp dụng — không có thay đổi để hoàn tác |
| `vitest` chưa cài — không chạy được lệnh test chuẩn của kit | Trung bình | Kiểm chứng bằng thao tác thủ công ở mục 12, giống các US trước | Không áp dụng — gap có sẵn từ trước |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Kiểm chứng AC-01 bằng thao tác thật (ghi giao dịch mới) | Done |
| `TB-02` | Kiểm chứng AC-02 bằng thao tác thật (Chi thực tế = tổng giao dịch) | Done |
| `TB-03` | Kiểm chứng AC-03 bằng thao tác thật (đổi tên danh mục, giao dịch cũ giữ liên kết) | Done |
| `TB-04` | Cập nhật DEV function wiki mục 7 (Verification) | Done |
| `TB-05` | Cập nhật memory (nếu phát sinh) | Done |
| `TB-06` | Verification cuối: lệnh + xác nhận đủ 3 AC | Done |

Readiness: Ready. Triển khai hoàn tất 2026-08-06 — chi tiết evidence từng task xem `task.md`. Breakdown chi tiết (8 cột, ma trận coverage, thứ tự dependency) xem `task.md`.
