# Tách "Ngân sách & nhập nhanh" thành "Quản lý thu" và "Quản lý chi" — Phân Rã Task

Status: Ready
Feature: US-026
Plan: plan.md
Spec: spec.md
Created: 2026-09-10
Updated: 2026-09-10
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 9 tiêu chí chấp nhận (AC-01..AC-09); Screen Element 8.1–8.4; mục 14 (A9 ngăn trượt, A10 thứ tự sau US-025) |
| `plan.md` | Impact checklist mục 7, bản đồ source mục 8, contract mục 10, verification mục 12, bản nháp task mục 14 |
| `data-model.md` | Không áp dụng — `schemaChangeRequired: false`, `ssr-data` không chạy |

## 2. Breakdown Summary

- Phạm vi: tầng trình bày. Đổi nhóm menu "Thu chi" (4 mục con), reconcile dữ liệu `NavPref`, thêm 2 route + 1 redirect, tách nhánh `section` của `BudgetApp` thành `income`/`expense`, khu "Khoản để dành" chỉ đọc, ngăn trượt "Items cần mua" + badge, CSS 2 cột, tài liệu.
- Phụ thuộc chặn: **Có — chỉ chặn thực thi (TB-01..TB-08 phần code), không chặn lập task.** DEC-137 điểm 6: code US-026 chỉ bắt đầu sau khi US-025 (bảng điều khiển tùy biến menu) vào `main`. Hiện `components/shared/nav.ts`, `lib/nav-registry.ts`, `server/config/*`, `NavConfigEditor` đang là thay đổi chưa commit của US-025.
- Số task: 10 (TB-01..TB-10).
- Readiness: Ready (để phân rã và giao); **stage implement giữ trạng thái chờ** cho tới khi US-025 merge — `ssr-pipeline` không chạy `ssr-dev` ở lượt này.

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-00` | Rà lại impact map plan mục 8 sau khi US-025 đã vào `main` (registry/seed có thể đổi); cập nhật plan nếu lệch | `docs/features/US-026-tach-quan-ly-thu-va-chi/plan.md`, `components/shared/nav.ts`, `lib/nav-registry.ts`, `server/config/` | None (nhưng chỉ làm được sau khi US-025 merge) | Ràng buộc thứ tự DEC-137 | `rtk git log --oneline` xác nhận commit US-025 trên `main`; đọc lại 4 file, ghi "khớp plan" hoặc liệt kê chênh lệch vào plan mục 8 | Pending | |
| `TB-01` | Nhóm menu "Thu chi" có đúng 4 mục con theo thứ tự: "Lịch sử thu chi", "Insight tài chính", "Quản lý thu", "Quản lý chi"; không còn "Ngân sách & nhập nhanh" | `components/shared/nav.ts` (`navGroups` mục `budget.children`), `lib/nav-registry.ts` (`NAV_CHILD_HREFS.budget`) | `TB-00` | AC-01; contract `NAV_CHILD_HREFS.budget`, `navGroups[budget].children` | `rtk tsc --noEmit` sạch; chạy app, mở nhóm "Thu chi" → thấy đúng 4 mục con đúng thứ tự, không có "Ngân sách & nhập nhanh" | Pending | |
| `TB-02` | Đọc `getNavConfig()` trên DB đã seed từ trước cho ra đúng 4 bản ghi mục con budget: có `leaf:/budget/income` + `leaf:/budget/expense`, không còn `leaf:/budget/control` | `server/config/domain/repositories/nav-pref-repository.ts` (thêm `insertMissing` + `deleteByIdsNotIn`), `server/config/infrastructure/repositories/nav-pref-prisma-repository.ts` (hiện thực trong `$transaction`), `server/config/domain/services/default-nav-prefs-service.ts` (`reconcileNavPrefs(seeds)`), `server/config/application/use-cases/get-nav-config.ts` (gọi reconcile trước `findAll()`) | `TB-01` | AC-01; plan mục 9 (dữ liệu `NavPref`); impact "Seed data", "Server Action" | `rtk tsc --noEmit` sạch; với DB có sẵn hàng `leaf:/budget/control`: gọi `getNavConfig()` (hoặc tải lại layout) → truy vấn `prisma.navPref` cho thấy 2 id mới, không còn `leaf:/budget/control`; chạy 2 lần liên tiếp không đổi kết quả (idempotent) | Pending | |
| `TB-03` | Vào `/budget/income` render "Quản lý thu"; vào `/budget/expense` render "Quản lý chi"; mở thẳng `/budget/control` bị đưa (redirect) sang `/budget/expense`, tháng đang xem giữ nguyên | `app/(app)/budget/income/page.tsx` (mới), `app/(app)/budget/expense/page.tsx` (mới), `app/(app)/budget/control/page.tsx` (thành `redirect("/budget/expense")`) | `TB-04`, `TB-05` (cần nhánh `section` mới tồn tại để build) | AC-02, AC-04, AC-07; contract route `/budget/income`, `/budget/expense`, `/budget/control` | `rtk next build` pass, liệt kê `/budget/income` + `/budget/expense`, `/budget/control` là redirect; mở `/budget/control` sau khi đang ở "Quản lý thu" tháng 2026-07 → URL cuối `/budget/expense`, tháng vẫn 2026-07 | Pending | |
| `TB-04` | Nhánh `section === "income"` của `BudgetApp` hiển thị: bộ chọn tháng + bảng "Nguồn thu" (giữ nguyên hành vi và ràng buộc tháng) + khu "Khoản để dành" chỉ đọc (từng danh mục loại "Tích lũy" kèm số đã chi + dòng tổng "Đã phân bổ vào tích lũy"); không có nhập nhanh, không có bảng danh mục | `components/BudgetApp.tsx` (`BudgetSection` union thêm `"income"`, `"expense"`; tách render; khu "Khoản để dành" từ `visibleCategories` lọc `type === "Tích lũy"` + `totals.allocatedToSaving`) | `TB-00` | AC-02, AC-03 (bảng nguồn thu chỉ xem ở tháng đã kết thúc), AC-08 (trạng thái rỗng), AC-09 (toast lỗi lưu nguồn thu); contract `BudgetSection` | `rtk tsc --noEmit` sạch; ở "Quản lý thu" tháng có ≥1 nguồn thu và ≥1 danh mục "Tích lũy": thấy đủ 3 khối; tháng đã kết thúc → bảng nguồn thu chỉ xem; tháng rỗng → 3 dòng trống đúng nội dung; ép lỗi lưu → toast "Có lỗi xảy ra, vui lòng thử lại.", bảng không đổi | Pending | |
| `TB-05` | Nhánh `section === "expense"` của `BudgetApp` hiển thị: khối "Quy tắc kiểm soát" + bộ chọn tháng ở trên; hai cột — trái: nhập nhanh + ô danh mục nhận diện + nút "Ghi nhận" + danh sách giao dịch (sửa/xóa inline); phải: (chỗ cho nút "Items cần mua" ở TB-06) + bảng danh mục ngân sách + cụm 4 nút hành động | `components/BudgetApp.tsx` (chuyển `TargetGrid` "Quy tắc kiểm soát" sang điều kiện `section === "expense"`; bố cục 2 cột; `div.actions` 4 nút trong cột phải) | `TB-04` | AC-04, AC-05; contract `BudgetSection` | `rtk tsc --noEmit` sạch; ở "Quản lý chi": thấy "Quy tắc kiểm soát" + 2 cột đúng bố cục; gõ "ăn trưa 65k" chọn "Ăn uống" → bấm "Ghi nhận": dòng giao dịch mới đúng nội dung/số tiền/danh mục, số đã chi "Ăn uống" +65.000, ô nhập trống lại; 4 nút hành động ở cột phải hoạt động như cũ | Pending | |
| `TB-06` | Nút "Items cần mua" ở đầu cột phải màn "Quản lý chi" có badge = số item `status === "Pending"` của tháng đang xem; bấm mở `Drawer` trượt từ phải chứa toàn bộ UI bảng "Items cần mua"; đóng bằng nút ×, nền mờ, Esc; badge cập nhật sau khi đóng | `components/BudgetApp.tsx` (import `Drawer`, `Badge` từ `@vn-dylan/ui`; state `purchaseDrawerOpen`; chuyển JSX bảng purchase item vào `Drawer` body; badge từ `purchaseItemsDraft.filter(i => i.status === "Pending").length`) | `TB-05` | AC-06, AC-03 (ngăn trượt chỉ xem ở tháng đã kết thúc), AC-08 (badge "0" + ngăn rỗng); spec A9 | `rtk tsc --noEmit` sạch; tháng có 3 "Pending" + 1 "Purchased" → badge "3"; bấm nút → `Drawer` phải hiện bảng + ô thêm; thêm "Bàn phím" → badge "4" sau khi đóng; đóng được bằng ×/nền mờ/Esc; tháng đã kết thúc → nội dung ngăn chỉ xem; tháng rỗng → badge "0" + "Tháng này chưa có item cần mua nào" | Pending | |
| `TB-07` | Màn "Quản lý chi" bố cục 2 cột trên màn rộng, gập 1 cột ở breakpoint hẹp; mỗi cột cuộn dọc độc lập, body không cuộn ngang; nút "Items cần mua" + badge có style rõ ràng | `app/globals.css` (lớp bố cục 2 cột `.budget-expense-cols` + media query; style nút + badge; `overflow` từng cột) | `TB-05`, `TB-06` | AC-04; impact "App Router page" (trình bày) | Chạy app ở bề rộng desktop → 2 cột; thu nhỏ cửa sổ xuống mobile → 1 cột, không có thanh cuộn ngang toàn trang; cột trái/phải dài cuộn riêng | Pending | |
| `TB-08` | `currentMeta` cho `/budget/income` ra "Thu chi · Quản lý thu", cho `/budget/expense` ra "Thu chi · Quản lý chi"; `activeGroup` nhận diện cả hai route thuộc nhóm "Thu chi" (mục cha mở sẵn, đánh dấu active) | `components/shared/nav.ts` (kiểm `currentMeta`, `activeGroup`, `applyNavPrefs` với 4 leaf — không cần sửa logic nếu `navGroups`/`NAV_CHILD_HREFS` đã đúng ở TB-01) | `TB-01`, `TB-03` | AC-02, AC-04; contract `navGroups[budget]` | `rtk tsc --noEmit` sạch; điều hướng tới `/budget/income` và `/budget/expense` → tiêu đề trên thanh header đúng; nhóm "Thu chi" mở sẵn và mục cha có trạng thái active | Pending | |
| `TB-09` | DEV function wiki US-026 chuyển `status: Active`, mục 7 điền kết quả verification thật; `docs/kb/dev/00-index.md` dòng US-026 cập nhật; `docs/kb/ba/00-index.md` + `docs/requirements-index.md` cập nhật trạng thái task/implement | `docs/kb/dev/wiki/US-026-tach-quan-ly-thu-va-chi.md`, `docs/kb/dev/00-index.md`, `docs/kb/ba/00-index.md`, `docs/requirements-index.md` | `TB-10` | impact "Knowledge base / memory" | Mở từng file → dòng US-026 phản ánh đúng trạng thái sau implement; wiki mục 7 có ngày + kết quả lệnh thật | Pending | |
| `TB-10` | Verification cuối toàn feature: typecheck + lint + prisma validate + build đều sạch; checklist thủ công AC-01..AC-09 (spec mục 7) + thủ công 1–7 (plan mục 12) đều đạt | Toàn repo | `TB-01`..`TB-08` | Tất cả AC-01..AC-09; plan mục 12 | `rtk tsc --noEmit` 0 lỗi; `rtk lint` 0 lỗi mới; `rtk npx prisma validate` hợp lệ; `rtk next build` pass; đi hết bảng thủ công AC + plan mục 12, ghi kết quả từng dòng | Pending | |

Ghi chú task bắt buộc:

- Migration Prisma + đồng bộ DBML: **không áp dụng** (`schemaChangeRequired: false`).
- Cập nhật BA/DEV function wiki: `TB-09`.
- Cập nhật memory: đã hoàn tất ở stage BA/plan (`DEC-137` trong `decisions.md`, `JDG-037` trong `judgement-log.md`, `glossary.md` — hai màn hình + tên cũ). `ssr-dev` bổ sung `JDG` nếu implement rút ra nhận định mới.
- Verification cuối: `TB-10`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (menu 4 mục con) | `TB-01`, `TB-02` | `TB-01` nội dung menu; `TB-02` dữ liệu `NavPref` đã seed |
| AC-02 ("Quản lý thu" đủ nội dung) | `TB-03`, `TB-04`, `TB-08` | route + render + tiêu đề |
| AC-03 (tháng đã kết thúc: nguồn thu + ngăn trượt chỉ xem) | `TB-04`, `TB-06` | |
| AC-04 ("Quản lý chi" bố cục + nút + cụm nút) | `TB-03`, `TB-05`, `TB-07`, `TB-08` | |
| AC-05 (nhập nhanh ghi nhận khoản chi) | `TB-05` | giữ nguyên hành vi hiện có |
| AC-06 (nút + badge "Pending" + ngăn trượt thêm item → badge cập nhật) | `TB-06` | |
| AC-07 (redirect `/budget/control` → "Quản lý chi", giữ tháng) | `TB-03` | |
| AC-08 (trạng thái rỗng ở cả hai màn + badge "0") | `TB-04`, `TB-06` | |
| AC-09 (toast lỗi khi lưu nguồn thu thất bại) | `TB-04` | hành vi toast có sẵn, giữ ở màn mới |
| Contract route `/budget/income` | `TB-03` | mới |
| Contract route `/budget/expense` | `TB-03` | mới |
| Contract route `/budget/control` (redirect) | `TB-03` | |
| Contract `BudgetSection` union | `TB-04`, `TB-05` | |
| Contract `NAV_CHILD_HREFS.budget` (4 phần tử) | `TB-01`, `TB-02` | |
| Contract `navGroups[budget].children` (4 leaf) | `TB-01`, `TB-08` | |
| Impact "App Router page / layout" = Yes | `TB-03`, `TB-07` | |
| Impact "Server Action" = Yes (nav reconcile) | `TB-02` | |
| Impact "Seed data" = Yes | `TB-01`, `TB-02` | |
| Impact "Knowledge base / memory" = Yes | `TB-09` | memory phần lớn đã xong ở BA/plan |
| Ràng buộc thứ tự US-025 (DEC-137) | `TB-00` | rà impact sau khi US-025 merge |

## 5. Thứ Tự Dependency

1. `TB-00` (chỉ chạy được sau khi US-025 vào `main`)
2. `TB-01` → `TB-02`
3. `TB-04` → `TB-05` → `TB-06` → `TB-07`
4. `TB-03` (cần `TB-04`, `TB-05` để build) 
5. `TB-08` (cần `TB-01`, `TB-03`)
6. `TB-10` (cần `TB-01`..`TB-08`)
7. `TB-09` (cần `TB-10`)

Không có vòng lặp: `TB-00 → TB-01 → TB-02`; `TB-00 → TB-04 → TB-05 → TB-06 → TB-07`; `{TB-04,TB-05} → TB-03 → TB-08`; `{TB-01..TB-08} → TB-10 → TB-09`.

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task (App Router page → TB-03/07; Server Action → TB-02; Seed data → TB-01/02; Knowledge base → TB-09; các khu No/N/A không cần task).
- [x] Mọi tiêu chí chấp nhận (AC-01..AC-09) đều map tới ít nhất một task (xem ma trận coverage).
- [x] Dependency có thứ tự và không vòng lặp.
- [x] Mỗi task có cách verification riêng (không phải chỉ "chạy build").
- [x] Cập nhật knowledge base (TB-09), memory (đã xong BA/plan, TB-09 nhắc), verification cuối (TB-10) là task tường minh.
- [x] Không task nào gộp các thay đổi cần verify độc lập (nav nội dung / nav dữ liệu / route / render income / render expense / drawer / css tách riêng).
- [x] Không task nào cần đọc source mới hiểu được kết quả mong đợi.

## 7. Blocker Và Câu Hỏi Mở

- Ràng buộc thứ tự (không phải blocker nghiệp vụ): toàn bộ task code (`TB-00`..`TB-08`) chỉ bắt đầu sau khi yêu cầu US-025 vào nhánh `main` — `DEC-137` điểm 6. `ssr-pipeline` ở lượt này **không chạy `ssr-dev`**; báo cáo ghi rõ pipeline dừng trước stage implement, task.md để trạng thái `Ready` sẵn sàng giao khi US-025 xong.
- Không có câu hỏi mở nghiệp vụ.
