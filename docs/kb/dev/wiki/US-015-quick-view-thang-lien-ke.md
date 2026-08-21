---
status: Active
feature: US-015
updated: 2026-08-11
plan: docs/features/US-015-quick-view-thang-lien-ke/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-015-quick-view-thang-lien-ke.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-015", "Quick view thẻ tháng liền kề (DEV)"]
---

# US-015 — Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view (DEV)

Status: Active
Feature: US-015
Updated: 2026-08-11
Plan: `docs/features/US-015-quick-view-thang-lien-ke/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-015-quick-view-thang-lien-ke.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Thay đổi thuần client-side trong bounded context `budget` — không chạm server, không đổi schema. Khối "Lịch sử thu chi" đổi nguồn render từ toàn bộ `months` (đảo ngược) sang một hàm thuần `getQuickViewMonths(months, selectedMonthId)` chỉ lấy tối đa 3 phần tử liền kề tháng đang xem trong mảng `months` đã sắp tăng dần sẵn theo kỳ tháng.

## 2. Luồng End-To-End

```text
components/BudgetApp.tsx (getQuickViewMonths(months, selectedMonthId))
  -> khối month-grid ("Lịch sử thu chi") map trên kết quả đó thay vì [...months].reverse()
  -> onClick mỗi thẻ vẫn gọi setSelectedMonthId(month.id) như cũ
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — toàn bộ thay đổi nằm ở đây |
| Application | Không chạm | Không có use-case nào bị ảnh hưởng |
| Data | Không chạm | Không đổi `prisma/schema.prisma` |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Component | `components/BudgetApp.tsx` | Hàm thuần `getQuickViewMonths`; khối `month-grid` đổi nguồn `.map()` |

## 4. Prisma Schema Và Migration

Không áp dụng — không đổi schema, không có migration mới. `MonthBudget.id` (khóa chính, dạng `YYYY-MM`) đã đủ để xác định thứ tự "đã tạo".

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `getQuickViewMonths(months, selectedMonthId)` | Hàm thuần — tìm vị trí `selectedMonthId` trong `months` (đã sắp tăng dần), trả về tối đa 3 phần tử liền kề (`index-1`, `index`, `index+1`, bỏ phần tử ngoài mảng) | `components/BudgetApp.tsx` (khối `month-grid` "Lịch sử thu chi") |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| US-001 | Depends on | `MonthBudget` đã lưu DB, `months` trả về đã sắp tăng dần theo `id` (`budget-snapshot-service.ts`) |
| US-006 | Related only | Cùng trang Thu chi, khối "Chọn tháng xem"/"Tạo tháng mới" không đổi |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `npx tsc --noEmit` | Passed — "No errors found" | 2026-08-11 |
| `npx next build` | Passed — 1 route, Errors: 0, Warnings: 0 | 2026-08-11 |
| `rtk vitest run` | Không áp dụng — chưa có framework test cài đặt trong dự án | — |
| Thủ công tương đương AC-01 | Passed — chọn xem tháng giữa ("2026-08"), đúng 3 thẻ (trước/đang xem nổi bật/sau) | 2026-08-11 |
| Thủ công tương đương AC-02, AC-06 | Passed — dùng "Chọn tháng xem" nhảy tới tháng đầu ("2026-02"), đúng 2 thẻ (không có "trước"); dropdown không đổi hành vi | 2026-08-11 |
| Thủ công tương đương AC-03 | Passed — tháng cuối ("2027-02", mặc định lúc tải trang), đúng 2 thẻ (không có "sau") | 2026-08-11 |
| Thủ công AC-05 | Passed — bấm thẻ "2026-09", tháng đang xem đổi, 3 thẻ cập nhật lại đúng | 2026-08-11 |
| Thủ công AC-04 | Chưa tái hiện trực tiếp (dữ liệu dev có 13 tháng, không reset được an toàn); xác nhận gián tiếp qua đọc code — đúng thiết kế khi `months.length === 1` | 2026-08-11 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| `getQuickViewMonths` trả rỗng nếu `selectedMonthId` không khớp phần tử nào trong `months` (lý thuyết — bất biến hiện có đảm bảo luôn khớp) | Thấp | Thêm fallback `months[0]` tương tự `selectedMonth` nếu xảy ra |
