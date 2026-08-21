# Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục — SE Plan

Status: Implemented
Feature: US-014
Spec: spec.md
Created: 2026-08-10
Updated: 2026-08-10
DEV Wiki: `docs/kb/dev/wiki/US-014-chi-tieu-khac-cuoi-bang.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Thay đổi thuần client-side, một hàm duy nhất trong `components/BudgetApp.tsx` — không chạm server, không đổi schema, không thêm truy vấn Prisma. `visibleCategories` (biến dùng chung cho cả bảng ngân sách, dropdown "Danh mục nhận diện", và biểu đồ "Cơ cấu chi tiêu") hiện chỉ lọc bỏ "Chi tiêu khác" khi hết giao dịch, không sắp xếp gì thêm. Sửa để, sau khi lọc, danh mục fallback (nếu còn hiển thị) luôn được đưa xuống cuối mảng — các phần tử còn lại giữ nguyên thứ tự tương đối.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-014-chi-tieu-khac-cuoi-bang/spec.md` | Nguồn 5 AC, Screen Element `EL-01`/`EL-02`/`EL-03`, handoff mục 13 |
| `docs/kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md` | Đối chiếu mục tiêu, phạm vi, luồng nghiệp vụ |
| `docs/kb/ba/wiki/delivery/pbi/US-014-chi-tieu-khac-cuoi-bang.md` | Đối chiếu đủ 5 AC |
| `docs/kb/ba/wiki/knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md` | Rule "Chi tiêu khác luôn ở cuối", áp dụng cả 3 nơi |
| `docs/memory/decisions.md` (`DEC-004`, `DEC-007`, `DEC-026`, `DEC-027`, `DEC-029`, `DEC-066`) | Single-user; chi thực tế luôn derived; quy tắc sinh/ẩn/khóa "Chi tiêu khác"; phạm vi áp dụng 3 nơi đã chốt |
| `components/BudgetApp.tsx` (dòng 1-40, 330-340, 480-545, 780-800, 930-950, 1050-1065) | Định nghĩa `visibleCategories` (dòng 334-337), 3 nơi dùng lại nó (dropdown nhập nhanh ~791, bảng ngân sách ~937, biểu đồ cơ cấu chi tiêu ~1059), khai báo prop `BudgetProps`/`BudgetSections` |
| `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Xác nhận `findByMonth` không có `orderBy` — thứ tự hiện tại phụ thuộc thứ tự chèn vào SQLite, không đảm bảo gì |
| `server/budget/domain/entities/category.ts` | Xác nhận field `isFallback: boolean` — đủ để nhận diện danh mục cần đưa xuống cuối, không cần trường mới |

## 3. Hành Vi Hiện Tại

- `components/BudgetApp.tsx:334-337` — `visibleCategories` chỉ `filter` bỏ "Chi tiêu khác" khi `actual === 0`, giữ nguyên thứ tự của `selectedMonth.categories` (đến từ `getBudgetSnapshot()`, vốn phản ánh đúng thứ tự trả về từ `findByMonth` — không `orderBy`, tức thứ tự chèn vào SQLite).
- "Chi tiêu khác" được tạo lười biếng (`fallbackCategoryService`, chỉ khi tháng lần đầu cần — `DEC-026`), thường ở giữa vòng đời tháng. Nếu Dylan bấm "Thêm danh mục" (`addCategory`, dòng ~357-360 hiện tại) sau thời điểm đó, danh mục mới được `create()` sau, xuất hiện sau "Chi tiêu khác" trong mảng — không có vị trí cố định.
- `visibleCategories` được dùng lại y hệt ở 3 nơi: dropdown "Danh mục nhận diện" (`select`, ~dòng 791), bảng ngân sách (`tbody`, ~dòng 937), biểu đồ "Cơ cấu chi tiêu" (`div.chart`, ~dòng 1059) — cả 3 hiện cùng chịu vấn đề thứ tự không cố định.

## 4. Hành Vi Mục Tiêu

- `visibleCategories`: sau khi lọc như hiện tại, nếu còn danh mục `isFallback` trong danh sách, đưa nó xuống cuối mảng; các phần tử còn lại giữ nguyên thứ tự tương đối đã có.
- Vì cả 3 nơi hiển thị đều đọc trực tiếp từ `visibleCategories`, sửa đúng một chỗ này áp dụng nhất quán ở cả bảng, dropdown, và biểu đồ — không cần sửa riêng từng nơi.
- Không có danh mục `isFallback` nào trong `visibleCategories` (tháng chưa từng cần "Chi tiêu khác", hoặc nó đang bị ẩn vì hết giao dịch) → hành vi không đổi so với hiện tại.

## 5. Luồng End-To-End

```text
components/BudgetApp.tsx
  visibleCategories = useMemo(() => {
    const visible = selectedMonth.categories.filter(item => !(item.isFallback && item.actual === 0))  [KHÔNG đổi]
    const fallback = visible.find(item => item.isFallback)                                             [MỚI]
    return fallback ? [...visible.filter(item => !item.isFallback), fallback] : visible                [MỚI]
  }, [selectedMonth])

  -> dropdown "Danh mục nhận diện" (~dòng 791): visibleCategories.map(...)          [KHÔNG đổi, dùng lại kết quả mới]
  -> bảng ngân sách (~dòng 937): visibleCategories.map(...)                        [KHÔNG đổi, dùng lại kết quả mới]
  -> biểu đồ "Cơ cấu chi tiêu" (~dòng 1059): visibleCategories.map(...)            [KHÔNG đổi, dùng lại kết quả mới]
```

Không có bước nào chạm server, Prisma, hay cache revalidate — toàn bộ thay đổi nằm trong một phép biến đổi mảng phía client, dữ liệu nguồn (`selectedMonth.categories`) không đổi.

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry (UI) | `components/BudgetApp.tsx` | Client Component — sửa duy nhất định nghĩa `visibleCategories` |
| Application | Không chạm | Không use-case nào liên quan tới thứ tự hiển thị |
| Data | Không chạm | Không đổi `prisma/schema.prisma`, không đổi truy vấn |

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-005` (field `isFallback` trên `Category`, hành vi sinh/ẩn "Chi tiêu khác") | `server/budget/domain/entities/category.ts` (đã đọc, xác nhận `isFallback: boolean` có sẵn) | Không | Đã xong (`Ready for DEV`/Delivered), dùng lại nguyên trạng |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | Không chạm `app/budget/page.tsx` |
| Server Action | No | `server/budget/actions.ts` không đổi |
| Route Handler (`app/api`) | N/A | Không có route handler trong bounded context này |
| Auth / middleware / permission | N/A | Single-user, không áp dụng (`DEC-004`) |
| Prisma schema | No | Không đổi |
| Migration SQLite | No | Không đổi |
| DBML | No | Không đổi |
| Seed data | No | `lib/budget-defaults.ts` không đổi |
| Caching / revalidate | No | Không có mutation mới — chỉ đổi cách tính giá trị hiển thị phía client |
| Export / báo cáo | No | Không ảnh hưởng — spec mục 9 xác nhận không đổi export JSON |
| Mail / webhook / job nền | N/A | Không có trong bounded context này |
| Knowledge base / memory | Yes | DEV wiki `US-014-chi-tieu-khac-cuoi-bang.md` mới; `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry (UI) | `components/BudgetApp.tsx` | Sửa `visibleCategories` (dòng 334-337): sau khi `filter` như hiện có, đưa phần tử `isFallback` (nếu còn) xuống cuối mảng, giữ nguyên thứ tự các phần tử khác |
| Application (use-case) | Không chạm | Không có use-case nào tính thứ tự hiển thị |
| Domain | Không chạm | Không có rule mới cần domain service — đây là logic trình bày (presentation), không phải nghiệp vụ lưu trữ |
| Repository | Không chạm | Không cần `orderBy` ở tầng Prisma — sắp xếp chỉ áp dụng cho danh sách đã lọc hiển thị, không phải toàn bộ `categories` (ví dụ bảng chỉnh sửa danh mục ở nơi khác, nếu có, phải giữ nguyên thứ tự gốc) |
| Data | Không chạm | Không đổi `prisma/schema.prisma` |
| Consumer | 3 nơi trong cùng file | Dropdown "Danh mục nhận diện" (~791), bảng ngân sách (~937), biểu đồ "Cơ cấu chi tiêu" (~1059) — cả 3 tự động nhất quán vì cùng đọc `visibleCategories` |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

Đây là thứ tự **hiển thị**, không phải thứ tự **lưu trữ**. `Category` không cần trường sắp xếp mới (ví dụ `sortOrder`) — sắp xếp được tính lại mỗi lần render từ field `isFallback` đã có sẵn, không cần lưu vào database, không cần truy vấn `orderBy` mới. Giữ nguyên `findByMonth()` không đổi.

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `visibleCategories` (biến nội bộ Client Component) | Giữ nguyên thứ tự `selectedMonth.categories` sau khi lọc "Chi tiêu khác" hết giao dịch | Cùng phép lọc, cộng thêm: danh mục `isFallback` (nếu còn) luôn ở cuối mảng | Không — biến nội bộ, không phải API/route công khai; 3 nơi dùng lại đều tự động nhận kết quả mới, không cần sửa gì thêm ở nơi dùng |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `components/BudgetApp.tsx` | Sửa định nghĩa `visibleCategories` (dòng 334-337) để đưa danh mục `isFallback` xuống cuối |
| `docs/kb/dev/wiki/US-014-chi-tieu-khac-cuoi-bang.md` | **Mới** — DEV wiki |
| `docs/kb/dev/00-index.md` | Thêm dòng US-014 |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng | Kết quả thật (2026-08-10) |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi | Passed — "No errors found" |
| Build | `rtk next build` | Errors: 0, Warnings: 0 | Passed — 1 route, Errors: 0, Warnings: 0 |
| Test | `rtk vitest run` | Chưa có framework test cài đặt (gap đã biết từ US-001) — thay bằng kiểm chứng thủ công đủ 5 AC | Không áp dụng — dùng thủ công như dự kiến |
| Thủ công — AC-01, AC-02 | Trên `next dev`, dựng tháng có "Chi tiêu khác" hiển thị + danh mục khác, quan sát bảng; sau đó bấm "Thêm danh mục" | "Chi tiêu khác" luôn ở dòng cuối cả trước và sau khi thêm danh mục mới | Passed — bằng chứng before/after rõ ràng (trước sửa từng ở vị trí 4/6) |
| Thủ công — AC-03 | Dựng tháng chưa từng phát sinh "Chi tiêu khác" | Không có dòng "Chi tiêu khác" nào, thứ tự các danh mục khác không đổi | Passed |
| Thủ công — AC-04 | Mở ô "Danh mục nhận diện" ở khu nhập nhanh, cùng tháng AC-01 | "Chi tiêu khác" là lựa chọn cuối cùng trong dropdown | Passed |
| Thủ công — AC-05 | Xem biểu đồ "Cơ cấu chi tiêu", cùng tháng AC-01 | Cột/thanh "Chi tiêu khác" nằm cuối cùng trong biểu đồ | Passed |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Nếu về sau có hơn một danh mục `isFallback` trong cùng tháng (hiện tại kiến trúc chỉ cho phép tối đa 1 — `findFallbackByMonth` dùng `findFirst`), logic `find` chỉ xử lý đúng phần tử đầu tiên tìm thấy | Rất thấp | Không cần xử lý thêm — ràng buộc "tối đa 1 Chi tiêu khác mỗi tháng" là bất biến kiến trúc đã có từ US-005, không phải giả định riêng của US-014 | Không cần — nếu bất biến đó từng bị phá vỡ, đó là lỗi ở tầng tạo danh mục fallback, không phải ở logic sắp xếp này |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Sửa `visibleCategories` trong `components/BudgetApp.tsx` để đưa danh mục `isFallback` xuống cuối | Pending |
| `TB-02` | Verification tổng hợp: typecheck, build, đủ 5 AC thủ công trên `next dev`; cập nhật DEV wiki mục 7 — phụ thuộc `TB-01` | Pending |

Readiness: Ready (đã qua `ssr-breaker`, xem `task.md` mục 3-6 cho chi tiết đầy đủ)
