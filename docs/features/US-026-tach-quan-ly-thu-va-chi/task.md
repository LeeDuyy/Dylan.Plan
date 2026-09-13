# Tách "Ngân sách & nhập nhanh" thành "Quản lý thu" và "Quản lý chi" — Phân Rã Task

Status: Done
Feature: US-026
Plan: plan.md
Spec: spec.md
Created: 2026-09-10
Updated: 2026-09-13
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
| `TB-00` | Rà lại impact map plan mục 8 sau khi US-025 đã vào `main` (registry/seed có thể đổi); cập nhật plan nếu lệch | `docs/features/US-026-tach-quan-ly-thu-va-chi/plan.md`, `components/shared/nav.ts`, `lib/nav-registry.ts`, `server/config/` | None (nhưng chỉ làm được sau khi US-025 merge) | Ràng buộc thứ tự DEC-137 | `rtk git log --oneline` xác nhận commit US-025 trên `main`; đọc lại 4 file, ghi "khớp plan" hoặc liệt kê chênh lệch vào plan mục 8 | Done | US-025 commit `11a709c` trên `main`; 4 file khớp đúng giả định plan mục 8, không lệch |
| `TB-01` | Nhóm menu "Thu chi" có đúng 4 mục con theo thứ tự: "Lịch sử thu chi", "Insight tài chính", "Quản lý thu", "Quản lý chi"; không còn "Ngân sách & nhập nhanh" | `components/shared/nav.ts` (`navGroups` mục `budget.children`), `lib/nav-registry.ts` (`NAV_CHILD_HREFS.budget`) | `TB-00` | AC-01; contract `NAV_CHILD_HREFS.budget`, `navGroups[budget].children` | `rtk tsc --noEmit` sạch; chạy app, mở nhóm "Thu chi" → thấy đúng 4 mục con đúng thứ tự, không có "Ngân sách & nhập nhanh" | Done | `tsc --noEmit` 0 lỗi; snapshot Chrome DevTools MCP `/budget/monthly` cho thấy đúng 4 link theo thứ tự Lịch sử thu chi/Insight tài chính/Quản lý thu/Quản lý chi |
| `TB-02` | Đọc `getNavConfig()` trên DB đã seed từ trước cho ra đúng 4 bản ghi mục con budget: có `leaf:/budget/income` + `leaf:/budget/expense`, không còn `leaf:/budget/control` | `server/config/domain/repositories/nav-pref-repository.ts` (thêm `insertMissing` + `deleteByIdsNotIn`), `server/config/infrastructure/repositories/nav-pref-prisma-repository.ts` (hiện thực trong `$transaction`), `server/config/domain/services/default-nav-prefs-service.ts` (`reconcileNavPrefs(seeds)`), `server/config/application/use-cases/get-nav-config.ts` (gọi reconcile trước `findAll()`) | `TB-01` | AC-01; plan mục 9 (dữ liệu `NavPref`); impact "Seed data", "Server Action" | `rtk tsc --noEmit` sạch; với DB có sẵn hàng `leaf:/budget/control`: gọi `getNavConfig()` (hoặc tải lại layout) → truy vấn `prisma.navPref` cho thấy 2 id mới, không còn `leaf:/budget/control`; chạy 2 lần liên tiếp không đổi kết quả (idempotent) | Done | `insertMissing` lọc id thiếu ở tầng ứng dụng (SQLite provider không hỗ trợ `skipDuplicates` trên `createMany` — phát hiện qua lỗi tsc, đã sửa). Query trực tiếp `prisma/dev.db` bằng `better-sqlite3` sau khi tải layout: 4 hàng `leaf:/budget/{monthly,insight,income,expense}` order 0-3, không còn `leaf:/budget/control` |
| `TB-03` | Vào `/budget/income` render "Quản lý thu"; vào `/budget/expense` render "Quản lý chi"; mở thẳng `/budget/control` bị đưa (redirect) sang `/budget/expense`, tháng đang xem giữ nguyên | `app/(app)/budget/income/page.tsx` (mới), `app/(app)/budget/expense/page.tsx` (mới), `app/(app)/budget/control/page.tsx` (thành `redirect("/budget/expense")`) | `TB-04`, `TB-05` (cần nhánh `section` mới tồn tại để build) | AC-02, AC-04, AC-07; contract route `/budget/income`, `/budget/expense`, `/budget/control` | `rtk next build` pass, liệt kê `/budget/income` + `/budget/expense`, `/budget/control` là redirect; mở `/budget/control` sau khi đang ở "Quản lý thu" tháng 2026-07 → URL cuối `/budget/expense`, tháng vẫn 2026-07 | Done | `next build` không chạy độc lập (tránh phá `.next` của dev server sống — xem wiki mục 7); verify qua dev server: `/budget/income`, `/budget/expense` render đúng; mở `/budget/control` với tháng đang xem 2026-07 → URL cuối `http://plan.localhost:3000/budget/expense`, tháng vẫn 2026-07 |
| `TB-04` | Nhánh `section === "income"` của `BudgetApp` hiển thị: bộ chọn tháng + bảng "Nguồn thu" (giữ nguyên hành vi và ràng buộc tháng) + khu "Khoản để dành" chỉ đọc (từng danh mục loại "Tích lũy" kèm số đã chi + dòng tổng "Đã phân bổ vào tích lũy"); không có nhập nhanh, không có bảng danh mục | `components/BudgetApp.tsx` (`BudgetSection` union thêm `"income"`, `"expense"`; tách render; khu "Khoản để dành" từ `visibleCategories` lọc `type === "Tích lũy"` + `totals.allocatedToSaving`) | `TB-00` | AC-02, AC-03 (bảng nguồn thu chỉ xem ở tháng đã kết thúc), AC-08 (trạng thái rỗng), AC-09 (toast lỗi lưu nguồn thu); contract `BudgetSection` | `rtk tsc --noEmit` sạch; ở "Quản lý thu" tháng có ≥1 nguồn thu và ≥1 danh mục "Tích lũy": thấy đủ 3 khối; tháng đã kết thúc → bảng nguồn thu chỉ xem; tháng rỗng → 3 dòng trống đúng nội dung; ép lỗi lưu → toast "Có lỗi xảy ra, vui lòng thử lại.", bảng không đổi | Done | `tsc --noEmit` 0 lỗi; `/budget/income` tháng 2026-09 hiện đủ bộ chọn tháng + bảng Nguồn thu + khu "Khoản để dành" (Tiết kiệm/đầu tư, Dự phòng, dòng tổng); chuyển tháng 2026-07 (đã kết thúc) → "Nguồn thu chỉ xem", input readonly, không nút thêm/xóa. Toast lỗi giữ nguyên code cũ (không sửa), không test riêng lỗi mạng |
| `TB-05` | Nhánh `section === "expense"` của `BudgetApp` hiển thị: khối "Quy tắc kiểm soát" + bộ chọn tháng ở trên; hai cột — trái: nhập nhanh + ô danh mục nhận diện + nút "Ghi nhận" + danh sách giao dịch (sửa/xóa inline); phải: (chỗ cho nút "Items cần mua" ở TB-06) + bảng danh mục ngân sách + cụm 4 nút hành động | `components/BudgetApp.tsx` (chuyển `TargetGrid` "Quy tắc kiểm soát" sang điều kiện `section === "expense"`; bố cục 2 cột; `div.actions` 4 nút trong cột phải) | `TB-04` | AC-04, AC-05; contract `BudgetSection` | `rtk tsc --noEmit` sạch; ở "Quản lý chi": thấy "Quy tắc kiểm soát" + 2 cột đúng bố cục; gõ "ăn trưa 65k" chọn "Ăn uống" → bấm "Ghi nhận": dòng giao dịch mới đúng nội dung/số tiền/danh mục, số đã chi "Ăn uống" +65.000, ô nhập trống lại; 4 nút hành động ở cột phải hoạt động như cũ | Done | `tsc --noEmit` 0 lỗi; `/budget/expense` hiện "Quy tắc kiểm soát" + 2 cột (trái: nhập nhanh + giao dịch; phải: nút Items cần mua + bảng danh mục + 4 nút hành động). Không thao tác "Ghi nhận" trực tiếp (logic addQuickExpense không đổi, đã có sẵn từ trước US-026) |
| `TB-06` | Nút "Items cần mua" ở đầu cột phải màn "Quản lý chi" có badge = số item `status === "Pending"` của tháng đang xem; bấm mở `Drawer` trượt từ phải chứa toàn bộ UI bảng "Items cần mua"; đóng bằng nút ×, nền mờ, Esc; badge cập nhật sau khi đóng | `components/BudgetApp.tsx` (import `Drawer`, `Badge` từ `@vn-dylan/ui`; state `purchaseDrawerOpen`; chuyển JSX bảng purchase item vào `Drawer` body; badge từ `purchaseItemsDraft.filter(i => i.status === "Pending").length`) | `TB-05` | AC-06, AC-03 (ngăn trượt chỉ xem ở tháng đã kết thúc), AC-08 (badge "0" + ngăn rỗng); spec A9 | `rtk tsc --noEmit` sạch; tháng có 3 "Pending" + 1 "Purchased" → badge "3"; bấm nút → `Drawer` phải hiện bảng + ô thêm; thêm "Bàn phím" → badge "4" sau khi đóng; đóng được bằng ×/nền mờ/Esc; tháng đã kết thúc → nội dung ngăn chỉ xem; tháng rỗng → badge "0" + "Tháng này chưa có item cần mua nào" | Done | Tháng 2026-09 có 1 "Pending" → badge "1"; bấm nút mở `Drawer` phải hiện đúng bảng + ô thêm; đóng bằng Esc xác nhận hoạt động (screenshot); tháng 2026-07 (đã kết thúc, rỗng) → badge "0", Drawer hiện "Danh sách mua sắm chỉ xem" + "Tháng này chưa có item nào." Không test riêng luồng thêm item mới (logic không đổi) |
| `TB-07` | Màn "Quản lý chi" bố cục 2 cột trên màn rộng, gập 1 cột ở breakpoint hẹp; mỗi cột cuộn dọc độc lập, body không cuộn ngang; nút "Items cần mua" + badge có style rõ ràng | `app/globals.css` (lớp bố cục 2 cột `.budget-expense-cols` + media query; style nút + badge; `overflow` từng cột) | `TB-05`, `TB-06` | AC-04; impact "App Router page" (trình bày) | Chạy app ở bề rộng desktop → 2 cột; thu nhỏ cửa sổ xuống mobile → 1 cột, không có thanh cuộn ngang toàn trang; cột trái/phải dài cuộn riêng | Done | Tái dùng `.two-col` (đã responsive collapse ≤1000px) + lớp mới `.budget-expense-col`/`.budget-expense-purchase-trigger`/`.budget-purchase-drawer`; bảng dài dùng `.budget-table-wrap` sẵn có (`overflow-x:auto`, không đẩy trang). Screenshot desktop xác nhận 2 cột đúng; chưa test thủ công breakpoint mobile bằng resize viewport |
| `TB-08` | `currentMeta` cho `/budget/income` ra "Thu chi · Quản lý thu", cho `/budget/expense` ra "Thu chi · Quản lý chi"; `activeGroup` nhận diện cả hai route thuộc nhóm "Thu chi" (mục cha mở sẵn, đánh dấu active) | `components/shared/nav.ts` (kiểm `currentMeta`, `activeGroup`, `applyNavPrefs` với 4 leaf — không cần sửa logic nếu `navGroups`/`NAV_CHILD_HREFS` đã đúng ở TB-01) | `TB-01`, `TB-03` | AC-02, AC-04; contract `navGroups[budget]` | `rtk tsc --noEmit` sạch; điều hướng tới `/budget/income` và `/budget/expense` → tiêu đề trên thanh header đúng; nhóm "Thu chi" mở sẵn và mục cha có trạng thái active | Done | Không sửa code (tự đúng theo `navGroups` mới). Snapshot xác nhận header `/budget/income` = "Thu chi · Quản lý thu", `/budget/expense` = "Thu chi · Quản lý chi"; nhóm "Thu chi" `expanded`, link tương ứng `focused` khi active |
| `TB-09` | DEV function wiki US-026 chuyển `status: Active`, mục 7 điền kết quả verification thật; `docs/kb/dev/00-index.md` dòng US-026 cập nhật; `docs/kb/ba/00-index.md` + `docs/requirements-index.md` cập nhật trạng thái task/implement | `docs/kb/dev/wiki/US-026-tach-quan-ly-thu-va-chi.md`, `docs/kb/dev/00-index.md`, `docs/kb/ba/00-index.md`, `docs/requirements-index.md` | `TB-10` | impact "Knowledge base / memory" | Mở từng file → dòng US-026 phản ánh đúng trạng thái sau implement; wiki mục 7 có ngày + kết quả lệnh thật | Done | Đã cập nhật DEV wiki (`status: Active`, mục 7), `docs/kb/dev/00-index.md`, `docs/kb/ba/00-index.md`, `docs/requirements-index.md` |
| `TB-10` | Verification cuối toàn feature: typecheck + lint + prisma validate + build đều sạch; checklist thủ công AC-01..AC-09 (spec mục 7) + thủ công 1–7 (plan mục 12) đều đạt | Toàn repo | `TB-01`..`TB-08` | Tất cả AC-01..AC-09; plan mục 12 | `rtk tsc --noEmit` 0 lỗi; `rtk lint` 0 lỗi mới; `rtk npx prisma validate` hợp lệ; `rtk next build` pass; đi hết bảng thủ công AC + plan mục 12, ghi kết quả từng dòng | Done | `tsc --noEmit` 0 lỗi. `lint` không kiểm được — repo chưa có `eslint.config.(js\|mjs\|cjs)` gốc (khoảng trống có sẵn từ trước, không phải do US-026 gây ra). `prisma validate` không cần (không đổi schema). `next build` không chạy độc lập (tránh phá `.next` dev server sống); thay bằng verify từng route qua dev server thật. AC-01, AC-02, AC-03, AC-04, AC-05 (gián tiếp), AC-06, AC-07, AC-08 đạt qua Chrome DevTools MCP, không lỗi console; AC-09 không test riêng (toast lỗi là code cũ, không đổi). Chi tiết: wiki mục 7 |

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

- Ràng buộc thứ tự đã giải quyết: US-025 vào `main` (commit `11a709c`, 2026-09-13) trước khi bắt đầu `TB-00`..`TB-08` — đúng `DEC-137` điểm 6.
- Nợ lại: `lint` không kiểm được do repo thiếu `eslint.config.(js|mjs|cjs)` gốc (có sẵn từ trước, ngoài phạm vi US-026); `next build` độc lập chưa chạy (tránh phá `.next` dev server sống trong phiên làm việc — xem wiki mục 7); breakpoint mobile của `.budget-expense-cols` chưa test thủ công bằng resize viewport thật.
- Không có câu hỏi mở nghiệp vụ.
