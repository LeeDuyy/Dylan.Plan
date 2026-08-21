---
status: Active
feature: US-012
updated: 2026-08-06
plan: docs/features/US-012-sua-loi-nhan-dien-danh-muc/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-012", "Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi (DEV)"]
---

# US-012 — Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi (DEV)

Status: Active
Feature: US-012
Updated: 2026-08-06
Plan: `docs/features/US-012-sua-loi-nhan-dien-danh-muc/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Defect fix thuần client-side trong bounded context `budget` — không chạm server, không đổi schema. Thêm hàm thuần `findQuickCategoryMatch` để so khớp gần đúng giữa nhãn nhóm chi tiêu (`quickRules[].category`) và tên danh mục thật của tháng đang chọn, thay vì so khớp tên tuyệt đối như trước (nguyên nhân gây mất giao dịch âm thầm khi Dylan đổi tên danh mục).

## 2. Luồng End-To-End

```text
components/BudgetApp.tsx (onChange ô nhập nội dung, useMemo inferredQuickCategory)
  -> quickRules.find() khớp rule theo từ khóa
  -> findQuickCategoryMatch(selectedMonth.categories, rule.category) [hàm thuần, client-only]
       -> so khớp tuyệt đối trước, không thấy thì so khớp gần đúng (contains hai chiều)
  -> setQuickCategory(resolved?.name ?? "") / inferredQuickCategory trả cùng giá trị
  -> addQuickExpense (không đổi) -> server/budget/actions.ts#recordQuickTransaction (không đổi, đã hỗ trợ categoryId optional từ US-005)
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — toàn bộ thay đổi nằm ở đây |
| Application | `server/budget/application/use-cases/record-quick-transaction.ts` | Không đổi — đã đủ từ US-005 |
| Domain | `server/budget/domain/services/fallback-category-service.ts` | Không đổi — đã đủ từ US-005 |
| Data | Không chạm | Không đổi `prisma/schema.prisma` |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Component | `components/BudgetApp.tsx` | Hàm thuần `findQuickCategoryMatch`; sửa `onChange` ô nhập nội dung và `inferredQuickCategory` |

## 4. Prisma Schema Và Migration

Không áp dụng — không đổi schema, không có migration mới.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `findQuickCategoryMatch(categories, ruleLabel)` | Hàm thuần nội bộ — trả về danh mục khớp tuyệt đối, hoặc khớp gần đúng đầu tiên theo thứ tự mảng, hoặc `undefined` | `components/BudgetApp.tsx` (`onChange`, `inferredQuickCategory`) |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| US-005 | Depends on | `recordQuickTransaction` (`categoryId` optional), `fallbackCategoryService` — dùng lại nguyên trạng, không sửa |
| US-001 | Depends on | Data model bền vững, danh mục lưu trong DB để so khớp |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — 0 lỗi | 2026-08-06 |
| `rtk next build` | Passed — Errors: 0, Warnings: 0 | 2026-08-06 |
| Thủ công đủ 5 AC trên `next dev` | Passed — chi tiết ở `docs/features/US-012-sua-loi-nhan-dien-danh-muc/task.md` `TB-02` | 2026-08-06 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| So khớp gần đúng kiểu "chứa chuỗi" có thể khớp nhầm với tên danh mục ngắn trùng ngẫu nhiên | Thấp | Thu hẹp lại chỉ dùng so khớp tuyệt đối nếu phát sinh vấn đề thật |
