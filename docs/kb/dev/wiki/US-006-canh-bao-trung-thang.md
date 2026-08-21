---
status: Active
feature: US-006
updated: 2026-08-10
plan: docs/features/US-006-canh-bao-trung-thang/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-006", "US-013", "Cảnh báo trùng tháng khi tạo tháng mới (DEV)"]
---

# US-006 — Cảnh báo trùng tháng khi tạo tháng mới (DEV)

Status: Active
Feature: US-006
Updated: 2026-08-10
Plan: `docs/features/US-006-canh-bao-trung-thang/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Thay đổi thuần client-side trong bounded context `budget` — không chạm server, không đổi schema. Ô "Tạo tháng mới" đổi từ input tự do thành combobox liệt kê 13 kỳ tháng liên tục (tính bằng hàm thuần dựa trên danh sách tháng đã tải sẵn ở client), kỳ đã có dữ liệu bị vô hiệu hóa. Khu vực "Tháng đang xem" tách thành hai khối: "Chọn tháng xem" và "Tạo tháng mới". Sửa đúng nguyên nhân gốc khiến "Tạo tháng" và "Clone tháng đang xem" (trước đây "Clone tháng hiện tại") cho kết quả giống hệt nhau: `createNewMonth` trước đây bỏ qua tham số `cloneCurrent`, nay dùng nó để quyết định có truyền `sourceMonthId` cho server hay không. Server (`create-month.ts`) không cần sửa — rẽ nhánh theo `sourceMonthId` đã đúng sẵn.

## 2. Luồng End-To-End

```text
components/BudgetApp.tsx (useMemo monthPeriods = buildMonthPeriods(new Date(), months))
  -> pickDefaultPeriod(monthPeriods) đồng bộ giá trị mặc định của ô "Tạo tháng mới"
  -> combobox "Tạo tháng mới" (kỳ đã có dữ liệu bị disabled)
  -> nút "Tạo tháng" -> createNewMonth(false) -> createMonthAction({ monthId }) [không kèm sourceMonthId]
  -> nút "Clone tháng đang xem" -> createNewMonth(true) -> createMonthAction({ monthId, sourceMonthId: selectedMonth.id })
       -> server/budget/actions.ts#createMonth (không đổi) -> create-month.ts (không đổi)
            sourceMonthId có -> sao chép cấu trúc danh mục (loại trừ isFallback)
            sourceMonthId không có -> defaultCategories
  -> lỗi (trùng tháng do tạo đồng thời) -> catch -> setToastMessage(error.message) -> refreshSnapshot()
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — toàn bộ thay đổi UI/logic nằm ở đây |
| Application | `server/budget/application/use-cases/create-month.ts` | Không đổi — rẽ nhánh `sourceMonthId` đã đúng từ trước |
| Data | Không chạm | Không đổi `prisma/schema.prisma` |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Component | `components/BudgetApp.tsx` | Hàm thuần `buildMonthPeriods`, `pickDefaultPeriod`; combobox "Tạo tháng mới"; tách khối "Chọn tháng xem"/"Tạo tháng mới"; sửa `createNewMonth` |
| Style | `app/globals.css` | Class wrapper mới giữ lưới `.two-col` 2 cột khi tách khối |

## 4. Prisma Schema Và Migration

Không áp dụng — không đổi schema, không có migration mới. `MonthBudget.id` (khóa chính, dạng `YYYY-MM`) đã đủ để xác định trùng tháng.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `createNewMonth(cloneCurrent: boolean)` | Hàm nội bộ Client Component — `cloneCurrent=false` gọi `createMonthAction` không kèm `sourceMonthId` (danh mục mặc định); `cloneCurrent=true` kèm `sourceMonthId=selectedMonth.id` (sao chép cấu trúc danh mục) | `components/BudgetApp.tsx` (2 nút "Tạo tháng"/"Clone tháng đang xem") |
| `buildMonthPeriods(referenceDate, months)` | Hàm thuần — sinh 13 kỳ tháng liên tục (6 trước — hiện tại — 6 sau), đánh dấu kỳ nào đã có dữ liệu | `components/BudgetApp.tsx` (combobox "Tạo tháng mới") |
| `pickDefaultPeriod(periods)` | Hàm thuần — chọn kỳ mặc định: ưu tiên tháng hiện tại, quét luân phiên xa dần nếu đã có dữ liệu | `components/BudgetApp.tsx` (giá trị khởi tạo `newMonth`) |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| US-001 | Depends on | `MonthBudget`/`Category` đã lưu DB, `createMonth` use-case dùng lại nguyên trạng |
| US-013 (raw, đã gộp qua `DEC-065`) | Gộp vào US-006 | Không có function riêng — toàn bộ nghiệp vụ nằm trong spec/plan của US-006 |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `npx tsc --noEmit` | Passed — "No errors found" | 2026-08-10 |
| `npx next build` | Passed — 1 route, Errors: 0, Warnings: 0 | 2026-08-10 |
| Thủ công AC-01 | Passed — combobox "Tạo tháng mới" đúng 13 kỳ (2026-02..2027-02), 5 kỳ đã có dữ liệu (04-08) `disabled` kèm "(Đã có dữ liệu)", mặc định chọn "2026-09" | 2026-08-10 |
| Thủ công AC-02 | Passed — "Tạo tháng" tạo tháng với đúng 8 danh mục mặc định (tổng 36.000.000đ), không mang danh mục tùy chỉnh; "Chọn tháng xem" có thêm lựa chọn mới | 2026-08-10 |
| Thủ công AC-03 | Passed — "Clone tháng đang xem" sao chép đúng 5 danh mục (tên + ngân sách) từ tháng đang xem, loại trừ danh mục fallback; thu nhập vẫn mặc định, chi thực tế = 0 | 2026-08-10 |
| Thủ công AC-04 | Passed — lấp đủ 13/13 kỳ, cả 2 nút `disabled=true`, combobox hiện "Không còn kỳ tháng trống" | 2026-08-10 |
| Thủ công AC-05 | Chưa kiểm chứng trực tiếp — hết kỳ trống để dựng race 2 tab trong phiên này, và "Reset dữ liệu" gặp lỗi có sẵn không liên quan (`PrismaClientKnownRequestError`, đã tách task riêng). Xác nhận gián tiếp qua rà soát code: pattern `try/catch` khớp `saveEditTransaction` đã có; `create-month.ts` (không đổi) đã ném đúng thông báo "Tháng này đã tồn tại." | 2026-08-10 |
| Thủ công AC-06 | Passed — nhãn "Chọn tháng xem" đúng, 2 khối tách biệt trong `.month-panels` | 2026-08-10 |
| Thủ công AC-07 | Passed — "Tạo tháng" trên tháng đang xem có danh mục tùy chỉnh vẫn cho ra đúng bộ mặc định, không mang theo tùy chỉnh | 2026-08-10 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Quy tắc chọn giá trị mặc định cho combobox (`A5` trong spec) là giả định hợp lý, chưa Dylan xác nhận trực tiếp | Thấp | Đổi `pickDefaultPeriod` về logic đơn giản hơn (luôn ưu tiên tháng hiện tại, không quét luân phiên) nếu cần |
| Wrapper CSS mới cho `.two-col` lệch spacing so với `.card.panel` hiện có | Thấp | Gỡ wrapper, trả JSX về 1 khối như cũ nếu layout vỡ |
