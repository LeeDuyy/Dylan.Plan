---
status: Active
feature: US-002
updated: 2026-08-05
plan: docs/features/US-002-route-rieng-quan-ly-chi-tieu/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-002-route-rieng-quan-ly-chi-tieu.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-002", "Route/module riêng cho Quản lý chi tiêu (DEV)"]
---

# US-002 — Route/module riêng cho Quản lý chi tiêu (DEV)

Status: Active
Feature: US-002
Updated: 2026-08-05
Plan: `docs/features/US-002-route-rieng-quan-ly-chi-tieu/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-002-route-rieng-quan-ly-chi-tieu.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Thuần refactor Next.js App Router: thêm route mới `app/budget/page.tsx`, tách state/handler/UI của khu vực Thu chi (hiện gộp trong Client Component `DylanPlanApp`) ra Client Component riêng `BudgetApp`, và cắt gọn `DylanPlanApp` (shell) chỉ còn Tổng quan/Roadmap/Freelance/Sản phẩm. Không đổi Prisma schema, không thêm/sửa Server Action nào trong `server/budget/**` — chỉ đổi nơi trong cây component gọi các hàm đã có.

## 2. Luồng End-To-End

```text
app/budget/page.tsx (Server Component, mới) -> getBudgetSnapshot() (đã có, server/budget/actions.ts)
  -> render components/BudgetApp.tsx (Client Component, mới) với initialBudget
  -> thao tác Dylan -> Server Action đã có (recordQuickTransaction/upsertCategory/createMonth/updateTransaction/deleteTransaction/...)
  -> revalidatePath (đổi từ "/" sang "/budget") -> client gọi lại getBudgetSnapshot() -> refreshSnapshot() -> UI cập nhật

app/page.tsx (Server Component, sửa — bỏ getBudgetSnapshot())
  -> render components/DylanPlanApp.tsx (Client Component, sửa — bỏ toàn bộ state/UI Thu chi)
  -> nav "Thu chi" / nút "Nhập thu chi" -> next/link điều hướng sang /budget
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry (route mới) | `app/budget/page.tsx` | Server Component, mới — gọi `getBudgetSnapshot()` |
| Entry (route sửa) | `app/page.tsx` | Server Component, sửa — bỏ `async`/`getBudgetSnapshot()` |
| Auth | Không áp dụng | Single-user (`DEC-004`) |
| Application | `server/budget/application/use-cases/*.ts` | Không đổi hành vi — chỉ đổi tham số `revalidatePath` (`"/"` → `"/budget"`) ở các use-case ghi dữ liệu Thu chi |
| Domain | `server/budget/domain/**` | Không đổi |
| Infrastructure | `server/budget/infrastructure/**` | Không đổi |
| Data | `prisma/schema.prisma` | Không đổi |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Page (mới) | `app/budget/page.tsx` | Server Component — gọi `getBudgetSnapshot()`, render `BudgetApp` |
| Page (sửa) | `app/page.tsx` | Server Component tĩnh — chỉ render `DylanPlanApp`, không còn gọi Server Action |
| Component (mới) | `components/BudgetApp.tsx` | Client Component — state/hiệu ứng/handler Thu chi (di chuyển từ `DylanPlanApp`) + UI cũ của `BudgetSections` + link quay lại `/` |
| Component (mới, dùng chung) | `components/shared/TargetGrid.tsx` | Tách từ `DylanPlanApp.tsx`, dùng chung Roadmap/Freelance/Sản phẩm (shell) và khối "Quy tắc kiểm soát" (Thu chi) |
| Component (sửa) | `components/DylanPlanApp.tsx` | Bỏ state/handler/helper chỉ phục vụ Thu chi; `Tab` bỏ `"budget"`; nav + nút Hero đổi thành `next/link`; `summaryCards` còn 3 thẻ |
| Server Action | `server/budget/actions.ts` | Không đổi — 11 export đã có, dùng lại nguyên vẹn từ cả `app/page.tsx` (gián tiếp qua `DylanPlanApp` cho các thao tác không phải Thu chi — không có) và `app/budget/page.tsx`/`BudgetApp.tsx` |
| Use-case (Application) | `server/budget/application/use-cases/*.ts` | Sửa nhỏ — đổi `revalidatePath("/")` thành `revalidatePath("/budget")` ở các use-case ghi dữ liệu Thu chi |

## 4. Prisma Schema Và Migration

Không đổi. `MonthBudget`, `Category`, `Transaction`, `LegacyMigration` (từ US-001) đã đủ dùng.

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| Không đổi | — | — | — |

- Migration liên quan: Không có (không tạo migration mới cho US-002)
- DBML đã đồng bộ: Không áp dụng — không đổi schema
- Lưu ý SQLite: Không áp dụng

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| Route hiển thị Thu chi | Đổi từ `/` (tab cục bộ) sang `/budget` (route riêng) | `components/BudgetApp.tsx`, `app/budget/page.tsx` |
| Props `DylanPlanApp` | Đổi từ `{ initialBudget: BudgetSnapshot }` thành không nhận prop nào | `app/page.tsx` |
| `revalidatePath` trong use-case ghi dữ liệu Thu chi | Đổi từ `"/"` thành `"/budget"` | `server/budget/application/use-cases/*.ts` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-001` | Depends on | `server/budget/**`, `getBudgetSnapshot`, luồng di trú dữ liệu cũ — dùng nguyên, không đổi |
| `US-004` | Depends on | Nút Sửa/Xóa giao dịch inline (trong `BudgetSections` cũ) di chuyển nguyên vẹn sang `BudgetApp.tsx`, không đổi logic |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — "No errors found" | 2026-08-05 |
| `rtk npx prisma validate` | Passed — schema hợp lệ, không đổi | 2026-08-05 |
| `rtk next build` | Passed — `Errors: 0, Warnings: 0`; route `/` (11.6 kB) và `/budget` (8.38 kB) đều xuất hiện | 2026-08-05 |
| `rtk vitest run` | Gap đã biết (giống US-001/US-004) — `vitest` chưa cài, thay bằng kiểm chứng thủ công | 2026-08-05 |
| Thủ công — AC-01 | Nav "Thu chi" và nút Hero "Nhập thu chi" là `next/link` trỏ `/budget`; bấm vào đổi `window.location.href`, hiển thị đủ nội dung Thu chi | 2026-08-05 |
| Thủ công — AC-02 | Tab "Tổng quan" chỉ còn Roadmap/Freelance/Sản phẩm + 3 thẻ tổng quan tĩnh, không còn thẻ "Còn lại tháng này" hay nội dung Thu chi nào | 2026-08-05 |
| Thủ công — AC-03 | Bấm link "← Dylan Plan Dashboard" ở `/budget`, `window.location.href` đổi về `/` | 2026-08-05 |
| Thủ công — AC-04 | Bảng danh mục tại `/budget` hiện đúng số liệu đã seed sẵn (Tiền nhà 7.500.000đ, Tổng cộng 36.000.000đ...), khớp dữ liệu trước khi tách trang | 2026-08-05 |
| Thủ công — AC-05 | Tab trình duyệt mới, gõ trực tiếp `/budget` — hiển thị đủ nội dung ngay, không qua `/` trước | 2026-08-05 |
| Thủ công — regression ghi giao dịch | **Gap công cụ**: không tự động hoá được thao tác nhập nhanh qua trình duyệt (input React 19 không nhận sự kiện tổng hợp của công cụ browser automation, đã thử 4 cách). Thay bằng đối chiếu code: cả 9 use-case chỉ đổi đúng 1 dòng `revalidatePath`, không đổi logic; hành vi gốc đã xác nhận đúng ở US-001 | 2026-08-05 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Hiệu ứng di trú dữ liệu cũ (`DEC-039`) chuyển từ chạy tại `/` sang chỉ chạy tại `/budget` — chỉ kích hoạt khi Dylan mở đúng trang Thu chi | Trung bình (`DEC-053`) | Nếu phát sinh vấn đề dữ liệu cũ chưa di trú, thêm lại một kiểm tra nhẹ (`getMigrationStatus()`) ở `DylanPlanApp.tsx` để hiện banner nhắc, không cần chuyển toàn bộ state Thu chi về shell |
| Tách `components/shared/TargetGrid.tsx` sai (thiếu export/import) làm build lỗi | Thấp | Revert riêng file này, không ảnh hưởng Server Action/data |
| `vitest` chưa cài — không chạy được lệnh test chuẩn của kit | Trung bình | Kiểm chứng thủ công theo `plan.md` mục 12, giống US-001/US-004 |
