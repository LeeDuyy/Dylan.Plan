---
status: Active
feature: US-014
updated: 2026-08-10
plan: docs/features/US-014-chi-tieu-khac-cuoi-bang/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-014", "Chi tiêu khác luôn cuối bảng danh mục (DEV)"]
---

# US-014 — Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục (DEV)

Status: Active
Feature: US-014
Updated: 2026-08-10
Plan: `docs/features/US-014-chi-tieu-khac-cuoi-bang/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Thay đổi thuần client-side, một hàm duy nhất trong `components/BudgetApp.tsx` — không chạm server, không đổi schema. `visibleCategories` (biến dùng chung cho bảng ngân sách, dropdown "Danh mục nhận diện", biểu đồ "Cơ cấu chi tiêu") hiện chỉ lọc bỏ "Chi tiêu khác" khi hết giao dịch. Sửa để sau khi lọc, danh mục `isFallback` (nếu còn hiển thị) luôn được đưa xuống cuối mảng — các danh mục khác giữ nguyên thứ tự tương đối. Không cần trường sắp xếp mới trong database — đây là thứ tự hiển thị, tính lại mỗi lần render.

## 2. Luồng End-To-End

```text
components/BudgetApp.tsx
  visibleCategories = useMemo(() => {
    const visible = selectedMonth.categories.filter(item => !(item.isFallback && item.actual === 0))
    const fallback = visible.find(item => item.isFallback)
    return fallback ? [...visible.filter(item => !item.isFallback), fallback] : visible
  }, [selectedMonth])

  -> dropdown "Danh mục nhận diện" (~dòng 791), bảng ngân sách (~dòng 937), biểu đồ "Cơ cấu chi tiêu" (~dòng 1059)
     đều dùng lại visibleCategories, tự động nhất quán
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — sửa duy nhất định nghĩa `visibleCategories` |
| Application | Không chạm | Không use-case nào tính thứ tự hiển thị |
| Data | Không chạm | Không đổi `prisma/schema.prisma` |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Component | `components/BudgetApp.tsx` | Định nghĩa `visibleCategories` (dòng 334-337); dùng lại ở 3 nơi hiển thị danh mục |

## 4. Prisma Schema Và Migration

Không áp dụng — không đổi schema, không có migration mới. `Category.isFallback` đã có sẵn từ US-001, đủ để tính thứ tự hiển thị.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `visibleCategories` (biến nội bộ Client Component) | Danh sách danh mục đã lọc "Chi tiêu khác" hết giao dịch, cộng đưa danh mục `isFallback` (nếu còn) xuống cuối mảng | `components/BudgetApp.tsx` (dropdown "Danh mục nhận diện", bảng ngân sách, biểu đồ "Cơ cấu chi tiêu") |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-005` | Depends on | Field `Category.isFallback`, hành vi sinh/ẩn "Chi tiêu khác" — dùng lại nguyên trạng, không sửa |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `npx tsc --noEmit` | Passed — "No errors found" | 2026-08-10 |
| `npx next build` | Passed — 1 route, Errors: 0, Warnings: 0 | 2026-08-10 |
| Thủ công AC-01 | Passed — tháng "2026-08": "Chi tiêu khácc" ở dòng cuối bảng (trước đó từng ở vị trí 4/6) | 2026-08-10 |
| Thủ công AC-02 | Passed — thêm "Danh mục mới" chèn trước "Chi tiêu khácc", fallback vẫn ở cuối | 2026-08-10 |
| Thủ công AC-03 | Passed — tháng "2026-09" (8 danh mục mặc định, chưa từng có "Chi tiêu khác") không đổi thứ tự | 2026-08-10 |
| Thủ công AC-04 | Passed — dropdown "Danh mục nhận diện": "Chi tiêu khácc" là lựa chọn cuối cùng | 2026-08-10 |
| Thủ công AC-05 | Passed — biểu đồ "Cơ cấu chi tiêu": cột "Chi tiêu khácc" ở vị trí cuối cùng | 2026-08-10 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Giả định tối đa 1 danh mục `isFallback` mỗi tháng (kiến trúc đã có từ US-005) — nếu bị phá vỡ, `find` chỉ xử lý đúng phần tử đầu tiên | Rất thấp | Không cần — lỗi (nếu có) nằm ở tầng tạo danh mục fallback, không phải logic sắp xếp này |
