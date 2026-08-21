# Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi — SE Plan

Status: Implemented
Feature: US-012
Spec: spec.md
Created: 2026-08-06
Updated: 2026-08-06
DEV Wiki: `docs/kb/dev/wiki/US-012-sua-loi-nhan-dien-danh-muc.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Đây là một defect fix thuần client-side, không chạm server/schema. Nguyên nhân gốc: `inferredQuickCategory` (và `onChange` của ô nhập nhanh) trong `components/BudgetApp.tsx` chỉ trả về **nhãn chuỗi cố định** của rule (`quickRules[].category`, vd `"Ăn uống"`) khi rule khớp từ khóa, không đối chiếu lại với danh sách danh mục thật của tháng. `addQuickExpense` sau đó tìm danh mục bằng so khớp **tên tuyệt đối** (`item.name === categoryName`) — nếu Dylan đã đổi tên danh mục (vd thành `"Ăn uống & đi chợ"`), so khớp tuyệt đối thất bại và hàm `return` sớm, không gọi `recordQuickTransaction` — giao dịch biến mất trong im lặng.

Sửa bằng cách thêm một hàm thuần (`findQuickCategoryMatch`) so khớp gần đúng (tên danh mục chứa nhãn rule, hoặc ngược lại) ngay tại nơi tính `inferredQuickCategory` và tại `onChange` của ô nhập nội dung — cả hai đều đối chiếu với `selectedMonth.categories` (dữ liệu danh mục thật đã tải), không còn dùng nhãn rule thô. `addQuickExpense` **không cần sửa** vì `categoryName` (lấy từ `inferredQuickCategory`) giờ đã luôn là tên danh mục thật (khớp tuyệt đối hoặc rỗng), nên so khớp tuyệt đối sẵn có trong `addQuickExpense` tiếp tục đúng.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-012-sua-loi-nhan-dien-danh-muc/spec.md` | Nguồn 5 AC, Screen Element `EL-01`, handoff mục 13 |
| `docs/kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md` | Đối chiếu mục tiêu, luồng nghiệp vụ |
| `docs/kb/ba/wiki/delivery/pbi/US-012-sua-loi-nhan-dien-danh-muc.md` | Đối chiếu 5 AC |
| `docs/kb/ba/wiki/knowledge/business-rule/BR-013-so-khop-gan-dung-danh-muc.md` | Quy tắc so khớp gần đúng + cách chọn khi nhiều kết quả (`DEC-060`) |
| `docs/memory/decisions.md` (`DEC-059`, `DEC-060`, `DEC-055`, `DEC-028`) | Hướng sửa đã chốt, hành vi fallback "Chi tiêu khác" đã có |
| `docs/memory/judgement-log.md` (`JDG-004`, `JDG-011`) | Quy tắc chuẩn hóa NFC cho so khớp chuỗi tiếng Việt; phát hiện gốc của defect này |
| `docs/kb/dev/wiki/US-005-rang-buoc-toan-ven-danh-muc.md` | Kiến trúc bounded context `budget`, xác nhận `recordQuickTransaction` đã hỗ trợ `categoryId` optional (không cần sửa lại) |
| `lib/budget-defaults.ts` | `quickRules[].category` là nhãn cố định; xác nhận đây là nguồn nhãn rule dùng để so khớp |
| `components/BudgetApp.tsx` (dòng 160-335, 685-712) | Luồng nhập nhanh hiện tại: state `quickCategory`, `inferredQuickCategory` (dòng 281-287), `onChange` ô nhập nội dung (dòng ~685-692), `addQuickExpense` (dòng 320-333), dropdown (dòng 703-710) |
| `server/budget/application/use-cases/record-quick-transaction.ts` | Xác nhận `categoryId` đã optional từ US-005 — không cần sửa server |

## 3. Hành Vi Hiện Tại

- `components/BudgetApp.tsx:281-287` — `inferredQuickCategory` tính bằng: nếu một rule trong `quickRules` khớp từ khóa trong `quickText`, trả về **nguyên văn** `rule.category` (chuỗi cố định, vd `"Ăn uống"`); không khớp rule nào thì trả về `quickCategory` (giá trị dropdown hiện tại, có thể rỗng từ US-005).
- Ô nhập nội dung (`onChange`, gần dòng 685-692) làm tương tự: khớp rule thì `setQuickCategory(matched.category)` — cũng gán thẳng nhãn rule thô, không đối chiếu danh mục thật.
- `addQuickExpense` (dòng 320-333): lấy `categoryName = inferredQuickCategory`, rồi `selectedMonth.categories.find(item => item.name === categoryName)` — so khớp **tên tuyệt đối**. Nếu `categoryName` khác rỗng nhưng không tìm thấy (vì danh mục đã đổi tên khỏi nhãn rule gốc), dòng `if (categoryName && !category) return;` khiến hàm dừng ngay — không gọi `recordQuickTransaction`, không có phản hồi lỗi nào cho Dylan. Đây chính là defect PO-01.
- Dropdown (`select`, dòng 703): hiển thị theo `value={quickCategory}`. Khi `quickCategory` mang giá trị nhãn rule thô (vd `"Ăn uống"`) mà không có lựa chọn (option) nào trong dropdown khớp giá trị đó (vì danh mục thật tên khác), trình duyệt hiển thị dropdown ở trạng thái không chọn gì — trùng hợp giống hệt trạng thái "Chưa xác định" (`value=""`), gây hiểu lầm là không nhận diện được (defect PO-02).

## 4. Hành Vi Mục Tiêu

- Khi rule khớp từ khóa, hệ thống đối chiếu nhãn rule với danh sách danh mục thật của tháng đang chọn: khớp tên tuyệt đối thì dùng luôn; không khớp tuyệt đối thì thử so khớp gần đúng (tên danh mục chứa nhãn rule, hoặc ngược lại — không phân biệt hoa/thường, chuẩn hóa NFC).
- Nhiều danh mục cùng khớp gần đúng → lấy danh mục **đầu tiên** theo đúng thứ tự trong mảng `selectedMonth.categories` (thứ tự này chính là thứ tự hiển thị trên bảng ngân sách — `DEC-060`).
- Không tìm được danh mục nào (kể cả sau khi thử so khớp gần đúng) → `inferredQuickCategory`/`quickCategory` trả về chuỗi rỗng, đúng hệt hành vi "không khớp từ khóa nào" đã có — dropdown hiện "Chưa xác định", `addQuickExpense` gọi `recordQuickTransaction` với `categoryId: undefined`, server tự lấy/tạo "Chi tiêu khác" (đã có từ US-005, không cần sửa).
- Dropdown luôn hiển thị đúng tên danh mục thật đã được chọn (không còn tình trạng "nhận diện đúng nhưng hiển thị sai thành Chưa xác định").

## 5. Luồng End-To-End

```text
components/BudgetApp.tsx
  (onChange ô nhập nội dung, dòng ~685-692)
    -> quickRules.find() khớp rule theo từ khóa
    -> findQuickCategoryMatch(selectedMonth.categories, rule.category)  [HÀM MỚI, thuần client]
         -> so khớp tuyệt đối (chuẩn hóa NFC + lowercase) trước
         -> không thấy thì so khớp gần đúng (contains hai chiều), lấy phần tử đầu tiên khớp
    -> setQuickCategory(resolved?.name ?? "")

  (useMemo inferredQuickCategory, dòng 281-287)
    -> cùng logic findQuickCategoryMatch, dùng để hiển thị preview và làm nguồn cho addQuickExpense

  (addQuickExpense, dòng 320-333 — KHÔNG đổi)
    -> categoryName = inferredQuickCategory (nay luôn là tên thật hoặc rỗng)
    -> selectedMonth.categories.find(item => item.name === categoryName)  [so khớp tuyệt đối vẫn đúng vì categoryName đã được resolve]
    -> recordQuickTransaction({ categoryId: category?.id, ... })  -> server/budget/actions.ts (KHÔNG đổi, đã hỗ trợ categoryId optional từ US-005)
```

Không có bước nào chạm server, Prisma, hay cache revalidate — toàn bộ thay đổi nằm trong logic tính toán phía client trước khi gọi Server Action đã có sẵn.

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `components/BudgetApp.tsx` | Client Component — thêm hàm `findQuickCategoryMatch`, sửa `onChange` và `inferredQuickCategory` |
| Application | `server/budget/application/use-cases/record-quick-transaction.ts` | Không đổi — đã nhận `categoryId` optional từ US-005 |
| Data | Không chạm | Không đổi schema, không thêm truy vấn Prisma mới |

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `US-001` (data model bền vững) | `prisma/schema.prisma` | Không | Đã xong, dùng lại nguyên trạng |
| `US-005` (`recordQuickTransaction` nhận `categoryId` optional, `fallbackCategoryService`) | `server/budget/application/use-cases/record-quick-transaction.ts` (đã đọc, xác nhận `categoryId?: string`) | Không | Đã xong, dùng lại nguyên trạng — không cần sửa gì thêm |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | Không chạm `app/budget/page.tsx` |
| Server Action | No | `server/budget/actions.ts` và toàn bộ use-case không đổi |
| Route Handler (`app/api`) | N/A | Không có route handler trong bounded context này |
| Auth / middleware / permission | N/A | Single-user, không áp dụng |
| Prisma schema | No | Không đổi |
| Migration SQLite | No | Không đổi |
| DBML | No | Không đổi |
| Seed data | No | `lib/budget-defaults.ts` không đổi — vẫn dùng nguyên `quickRules` hiện có |
| Caching / revalidate | No | Không thêm/đổi lệnh `revalidatePath` nào — mutation vẫn đi qua use-case cũ |
| Export / báo cáo | No | Không ảnh hưởng |
| Mail / webhook / job nền | N/A | Không có trong bounded context này |
| Knowledge base / memory | Yes | DEV wiki `US-012-sua-loi-nhan-dien-danh-muc.md` mới; `SSR_DEV_KB_INDEX` cập nhật |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry (UI) | `components/BudgetApp.tsx` | Thêm hàm thuần `findQuickCategoryMatch(categories, ruleLabel)`; sửa `onChange` ô nhập nội dung (dòng ~685-692) và `inferredQuickCategory` (dòng 281-287) để dùng hàm này thay vì trả thẳng nhãn rule thô |
| Application (use-case) | Không chạm | `record-quick-transaction.ts` đã đủ từ US-005 |
| Domain service | Không chạm | `fallback-category-service.ts` đã đủ từ US-005 |
| Repository | Không chạm | Không cần truy vấn mới — dùng lại `selectedMonth.categories` đã tải sẵn qua `getBudgetSnapshot` |
| Data | Không chạm | Không đổi `prisma/schema.prisma` |
| Consumer | Không có | Không có file nào khác dùng `inferredQuickCategory`/`quickCategory` ngoài chính `components/BudgetApp.tsx` |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

Không cần trường hoặc bảng mới. So khớp gần đúng chỉ đọc lại `selectedMonth.categories` — dữ liệu danh mục của tháng đang chọn đã được tải sẵn ở phía client qua `getBudgetSnapshot()` (Server Component `app/budget/page.tsx` gọi khi tải trang, cập nhật lại qua `refreshSnapshot()` sau mỗi thao tác) — không cần thêm truy vấn Prisma nào.

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `inferredQuickCategory` (biến nội bộ Client Component) | Trả nguyên văn nhãn rule cố định khi khớp từ khóa | Trả tên danh mục thật đã so khớp gần đúng, hoặc chuỗi rỗng nếu không tìm được | Không — đây là biến nội bộ, không phải API/route công khai, không ai dùng lại ngoài chính component này |
| `recordQuickTransaction(input)` | Không đổi | Không đổi | Không |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `components/BudgetApp.tsx` | Thêm hàm thuần `findQuickCategoryMatch`; sửa `onChange` ô nhập nội dung và `inferredQuickCategory` để so khớp gần đúng với danh mục thật thay vì dùng thẳng nhãn rule |
| `docs/kb/dev/wiki/US-012-sua-loi-nhan-dien-danh-muc.md` | **Mới** — DEV wiki |
| `docs/kb/dev/00-index.md` | Thêm dòng US-012 |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng |
| --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | Passed — 0 lỗi (2026-08-06) |
| Build | `rtk next build` | Passed — Errors: 0, Warnings: 0 (2026-08-06) |
| Test | `rtk vitest run` | Chưa có framework test cài đặt trong `package.json` (gap đã biết từ US-001) — thay bằng kiểm chứng thủ công đủ 5 AC |
| Thủ công — AC-01 | Đổi tên danh mục "Ăn uống" (hoặc tương đương) thành "Ăn uống & đi chợ" trên `next dev`, gõ "ăn tối 300k" | Passed — dropdown/preview đúng "Ăn uống & đi chợ", Ghi nhận thành công, Chi thực tế +300.000đ |
| Thủ công — AC-02 | Xóa hẳn danh mục có tên chứa "Ăn uống" trong tháng, gõ "ăn tối 300k" | Passed — dropdown "Chưa xác định", Ghi nhận vẫn thành công, gộp vào danh mục dự phòng hiện có |
| Thủ công — AC-03 | Gõ "khám bệnh 50k" khi danh mục "Sức khỏe / cá nhân" chưa đổi tên | Passed — dropdown đúng như cũ, không phá vỡ hồi quy |
| Thủ công — AC-04 | Tạo hai danh mục cùng chứa "Ăn uống" ("Ăn uống linh tinh" đứng trước "Ăn uống & đi chợ"), gõ "ăn tối 300k" | Passed — dropdown chọn đúng danh mục đứng trước, xác nhận lại sau khi reload trang (server-persisted) |
| Thủ công — AC-05 | Mảng danh mục rỗng | Passed (xác nhận qua cùng nhánh code với AC-02 — không dựng được kịch bản UI tháng trống hoàn toàn vì danh mục dự phòng bị khóa không xóa được) |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| So khớp gần đúng kiểu "chứa chuỗi" có thể khớp nhầm nếu tên danh mục ngắn trùng ngẫu nhiên với nhãn rule khác (vd danh mục tên "Xe" trùng một phần từ khóa khác) | Thấp | Chỉ so khớp gần đúng sau khi so khớp tuyệt đối thất bại; áp dụng đúng 8 nhãn rule cố định hiện có, rủi ro trùng ngẫu nhiên thấp trong thực tế | Nếu sai nhiều, có thể thu hẹp lại chỉ dùng so khớp tuyệt đối (quay về hành vi US-005, chấp nhận lại defect PO-01 tạm thời) trong khi chờ thiết kế mã cố định (phương án đã loại ở `DEC-059`) |
| AC-05 (tháng trống hoàn toàn danh mục) khó dựng kịch bản thật trên dữ liệu hiện có (mọi tháng đều có ít nhất danh mục mặc định) | Thấp | Có thể kiểm bằng cách xóa thủ công toàn bộ danh mục của một tháng test qua thao tác xóa từng danh mục (nếu UI cho phép xóa hết), hoặc chấp nhận kiểm bằng đọc code nếu không dựng được kịch bản UI | Không cần rollback — đây là verification, không phải thay đổi hành vi |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Hàm `findQuickCategoryMatch` + sửa `onChange`/`inferredQuickCategory` trong `components/BudgetApp.tsx` | Pending |
| `TB-02` | Verification tổng hợp: typecheck, build, đủ 5 AC thủ công trên `next dev` | Pending |

Readiness: Ready
