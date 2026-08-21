---
status: Active
feature: US-004
updated: 2026-08-05
plan: docs/features/US-004-sua-xoa-tung-giao-dich/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-004-sua-xoa-tung-giao-dich.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-004", "Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu (DEV)"]
---

# US-004 — Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu (DEV)

Status: Active
Feature: US-004
Updated: 2026-08-05
Plan: `docs/features/US-004-sua-xoa-tung-giao-dich/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-004-sua-xoa-tung-giao-dich.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Mở rộng bounded context `budget` (đã có từ US-001) với 2 use-case mới (`updateTransaction`, `deleteTransaction`) và 3 phương thức mới trên `TransactionRepository` (`findById`, `update`, `delete`). Không tạo bounded context mới, không đổi schema Prisma. UI thêm thao tác sửa/xóa từng dòng ngay trong bảng "Giao dịch gần đây" (mở rộng inline theo `DEC-046`), bỏ giới hạn hiển thị 8 dòng (`DEC-047`), và phát hiện xung đột sửa đồng thời bằng so khớp giá trị thay vì cột version (`DEC-048`).

## 2. Luồng End-To-End

```text
components/DylanPlanApp.tsx (nút Sửa/Lưu/Xóa/Xác nhận xóa) -> server/budget/actions.ts#updateTransaction() / #deleteTransaction() -> application/use-cases/update-transaction.ts / delete-transaction.ts -> domain/rules/transaction-input-rule.ts (validate) -> domain/repositories/transaction-repository.ts (interface) -> infrastructure/repositories/transaction-prisma-repository.ts -> lib/prisma.ts -> SQLite -> revalidatePath("/") -> client refreshSnapshot()
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/DylanPlanApp.tsx` | Client Component, đã có sẵn — thêm nút và state theo dòng |
| Auth | Không áp dụng | Single-user (DEC-004) |
| Composition root | `server/budget/actions.ts` | Thêm export `updateTransaction`, `deleteTransaction` |
| Application | `server/budget/application/use-cases/update-transaction.ts`, `delete-transaction.ts` | Validate, kiểm tra xung đột, gọi repository, `revalidatePath` |
| Domain | `server/budget/domain/rules/transaction-input-rule.ts` | Tái dùng nguyên vẹn — P1.1 |
| Data | `prisma/schema.prisma` | Không đổi — `Transaction` đã đủ trường |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Composition root (Server Action) | `server/budget/actions.ts` | Export `updateTransaction`, `deleteTransaction` |
| Application | `server/budget/application/use-cases/update-transaction.ts` | Sửa 4 trường, kiểm tra xung đột đồng thời |
| Application | `server/budget/application/use-cases/delete-transaction.ts` | Xóa một giao dịch, idempotent |
| Domain | `server/budget/domain/repositories/transaction-repository.ts` | Thêm `findById`, `update`, `delete` vào interface |
| Infrastructure | `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | Implementation Prisma cho 3 hàm mới |
| Component | `components/DylanPlanApp.tsx` | Nút Sửa/Xóa, form inline, xác nhận xóa inline, bỏ giới hạn 8 dòng, xử lý lỗi hiển thị tại chỗ |

## 4. Prisma Schema Và Migration

Không đổi. `Transaction` (từ US-001) đã đủ `id`, `monthId`, `categoryId`, `text`, `amount`, `createdAt` cho cả sửa và xóa một bản ghi.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `updateTransaction(input)` | Sửa 4 trường của một giao dịch; `input` gồm `id`, `text`, `amount`, `categoryId`, `createdAt`, và `expected` (giá trị trước khi sửa, dùng để phát hiện xung đột — `DEC-048`); ném lỗi nếu ngày tương lai, nội dung rỗng, danh mục không thuộc tháng, hoặc giá trị hiện tại trong DB khác `expected` | `components/DylanPlanApp.tsx` |
| `deleteTransaction(id)` | Xóa một giao dịch; idempotent — gọi lại với id đã xóa không báo lỗi | `components/DylanPlanApp.tsx` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| US-001 | Depends on | `server/budget/**` — mở rộng cùng bounded context, cùng `TransactionRepository` |
| US-003 | Depends on | `Transaction.categoryId` đã là khóa ngoại thật |
| US-005 | Related only | "Chi tiêu khác" (chưa triển khai) không cần US-004 xử lý riêng — xem spec mục 4/11 |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — 0 lỗi | 2026-08-05 |
| `rtk npx prisma validate` | Passed — không đổi schema | 2026-08-05 |
| `rtk next build` | Passed — `Errors: 0, Warnings: 0` | 2026-08-05 |
| `rtk vitest run` | Chưa cài đặt framework test trong `package.json` — gap đã biết, giống US-001. Thay bằng kiểm chứng thủ công đủ 11 AC | 2026-08-05 |
| Thủ công — AC-01, AC-02, AC-03, AC-04, AC-07, AC-10 | Mở form Sửa hiện đủ 4 trường; sửa số tiền 50.000→60.000đ, Chi thực tế cập nhật đúng; đổi danh mục, amount di chuyển đúng giữa 2 danh mục; chọn ngày tương lai bị chặn tại chỗ; Hủy giữ nguyên giá trị cũ; nội dung rỗng thì nút Lưu tắt | 2026-08-05 |
| Thủ công — AC-05, AC-06 | Bấm Xóa hiện đúng hộp xác nhận inline; Hủy giữ nguyên giao dịch; Xác nhận xóa thì giao dịch mất, Chi thực tế giảm đúng | 2026-08-05 |
| Thủ công — AC-08, AC-09 | Tạo 10 giao dịch trong 1 tháng → hiển thị đủ 10 dòng (không dừng ở 8); Reset về rỗng → hiện đúng trạng thái không có giao dịch | 2026-08-05 |
| Thủ công (giả lập đa thiết bị thật) — AC-11 | Mở form Sửa một giao dịch trên `next dev`, dùng script Prisma xóa thẳng bản ghi đó trong DB (mô phỏng thiết bị khác), bấm Lưu trên form đang mở → đúng thông báo xung đột; xác nhận DB không tạo lại bản ghi đã xóa. `JDG-006` (phát hiện xung đột bằng so khớp giá trị, không cần cột `updatedAt`) được xác nhận đứng vững | 2026-08-05 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| So khớp toàn bộ giá trị để phát hiện xung đột đồng thời có thể false-positive nếu định dạng dữ liệu client/server lệch nhau | Trung bình | Nếu sai nhiều, nới thành chỉ kiểm tra tồn tại bản ghi (bỏ so khớp giá trị), báo lại `ssr-ba` nếu cần đổi phạm vi `DEC-048` |
| Component `DylanPlanApp.tsx` đã lớn, thêm state theo dòng | Thấp | Không tối ưu trừ khi thực sự chậm khi test thủ công |
