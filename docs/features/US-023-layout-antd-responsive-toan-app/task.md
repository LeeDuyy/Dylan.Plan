# Chuẩn hóa layout toàn app bằng Ant Design, responsive mobile/tablet — Phân Rã Task

Status: Implemented
Feature: US-023
Plan: plan.md
Spec: spec.md
Created: 2026-09-07
Updated: 2026-09-07
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 8 AC (AC-01..AC-08); Screen Element EL-01..EL-19; luồng mục 6 |
| `plan.md` | Impact checklist mục 7; bản đồ source impact mục 8; contract mục 10; file sẽ đổi mục 11; verification mục 12 |
| `data-model.md` | Không áp dụng — US-023 không đổi schema (data stage `skipped`) |

## 2. Breakdown Summary

- Phạm vi: nền Ant Design (`layout.tsx` + `AppThemeProvider`) + `AppShell` responsive + gộp `/budget` vào khung chung + primitive 6 tab → antd + `globals.css` nới container/responsive.
- Phụ thuộc chặn: US-022 (Delivered `cc7b436`) — đã xong. antd đã cài.
- Số task: 8 (`TB-01`..`TB-08`).
- Readiness: Ready.
- Trạng thái triển khai (2026-09-07): TB-01..TB-08 `Done`. `ssr-review` round 0 = Fail (F-01 AC-04 thanh nav antd Menu tràn ở tablet); đã sửa F-01..F-08 (tách dải nav riêng theo spec §8.1; `min-width:0` chuỗi flex để bảng antd cuộn trong khung; UserMenu → `Dropdown`; thanh tiến độ PlanViews → antd `Progress`; xác nhận xóa giao dịch → `Popconfirm`). tsc + `next build` pass; smoke Playwright 375/768/820/1440/2560 cho 6 tab + sáng/tối — AC-01..AC-08 đạt.
- Vòng dọn còn thiếu so với plan (2026-09-07, cùng phiên):
  - **FOUC (plan §13 / TB-01)**: `@ant-design/nextjs-registry@1.3.0` dành cho antd v6, kéo `@ant-design/cssinjs@2.x` không dùng chung cache với antd v5 → style không flush server-side (HTML nguồn 0 thẻ `<style>` antd). Sửa: hạ về `~1.2.0` (dùng chung `@ant-design/cssinjs@1.24.0`). Verify: HTML nguồn `/` nay có `<style id="antd-cssinjs" data-rc-order="prepend">` — hết FOUC.
  - **Dead CSS (TB-07)**: cắt hẳn `.app-shell`, `.topbar`, `.nav`, `.nav-actions`, `.nav-tabs`, `.tab-button`(+`.active`), `.icon-button`, `.btn`(+`.primary/.danger/.ghost`), `.card` bare, `.overview-phase .btn`, `.phase*`, `.timeline` (grid) + các dòng tương ứng trong media query. Giữ `.brand`/`.logo`/`.user-menu`/`.user-menu-email`/`.summary`/`.target-card` (còn dùng).
  - **Roadmap Timeline (TB-04)**: roadmap phases `Card` → antd `Timeline` (EL-18).
  - **`<Link><Button>` (PlanViews)**: 3 CTA `<a><button>` lồng nhau → antd `Button` + `router.push` (SPA nav, HTML hợp lệ).
  - **Follow-up spec US-002 §8.2**: `EL-04`/`AC-03` (liên kết "← Dylan Plan Dashboard" ở `/budget`) đánh dấu bị thay thế bởi US-023.

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | `AppThemeProvider` (ConfigProvider token map + dark algorithm + `App` + context `{dark,toggle}`); `layout.tsx` bọc `AntdRegistry` + import patch React 19 + provider | `components/shared/AppThemeProvider.tsx` (mới), `app/layout.tsx` | None | Contract `AppThemeProvider`/`useAppTheme`; Theme storage giữ key cũ; AC-06 | `./node_modules/.bin/tsc --noEmit`; `next build` pass; HTML nguồn `/` chứa thẻ style của antd (thuộc tính data-antd-cssinjs) — không FOUC | Done | `AppThemeProvider.tsx` mới + `layout.tsx` bọc `AntdRegistry`/patch React 19/provider; `tsc`+`next build` pass; smoke: đổi giao diện → `body.dark` + `localStorage {"dark":true}`, reload vẫn tối (AC-06). **FOUC**: ban đầu HTML nguồn 0 thẻ style antd (registry `1.3.0` sai cho antd v5); sau khi hạ `@ant-design/nextjs-registry` → `~1.2.0`, HTML nguồn `/` có `<style id="antd-cssinjs" data-rc-order="prepend">` — style flush server-side, hết FOUC |
| `TB-02` | `AppShell` dựng lại: `Layout`/`Header`(logo + `Menu` ngang + nút đổi giao diện + `UserMenu` + nút Drawer)/`Content`(`.app-content` max-width 2000 căn giữa)/`Footer`; `Drawer` (điện thoại) chứa `Menu` dọc + nút đổi giao diện; gate bằng `Grid.useBreakpoint()` (`screens.md`) | `components/shared/AppShell.tsx` | `TB-01` | AC-01, AC-03, AC-04; EL-01..EL-09 | `tsc`; `next build`; smoke: 6 tab cùng khung ở 1440px; nav → Drawer ở 375px; nav ngang ở 768px | Done | `AppShell.tsx`: `Layout`/`Header`(logo+actions) + **dải nav ngang riêng** `.app-shell-nav-bar` dưới header (spec §8.1) + `Drawer` + `Grid.useBreakpoint()` + `mounted` guard (bỏ hydration flash). Smoke 375/768/820/1440: cả 6 tab một hàng ở tablet & wide; Drawer ở 375 có 6 mục + nút đổi giao diện; `horiz=0` mọi kích thước |
| `TB-03` | `BudgetApp.tsx`: gỡ khối `header.topbar` + `dark` state + 2 effect dark; bọc ; primitive tab Thu chi → antd (`Card`/`Button`/`Select`/`Input`/`Progress`/`Tag`); **giữ thẻ bảng HTML** cho bảng danh mục chi / nguồn thu / items cần mua (chỉ bọc `Card` + giữ `.budget-table-wrap`); biểu đồ tròn/cột giữ nguyên, khoác `Card` | `components/BudgetApp.tsx` | `TB-02` | AC-01, AC-07, AC-08 (một phần — bảng kéo-thả giữ HTML); EL-11..EL-19 | `tsc`; `next build`; smoke: `/budget` không còn topbar riêng; thêm/sửa/xóa/kéo-thả nguồn thu + danh mục vẫn chạy (AC-07); insight/tháng mặc định của US-022 giữ nguyên | Done | `BudgetApp.tsx` bỏ topbar + dark state, bọc `<AppShell>`, primitive → `Card`/`Button`/`Select`/`Input`/`Progress`/`Tag`; bảng nguồn thu/danh mục/items giữ `<table>` trong `.budget-table-wrap` (kéo-thả nguyên vẹn); xác nhận xóa giao dịch → `Popconfirm` (giữ câu chữ). Smoke AC-07: thêm nguồn thu "…1.234.567" → hàng hiện + "Thu nhập tháng" = 36.234.567 ₫; xóa → hàng biến mất (0 dữ liệu test còn lại) |
| `TB-04` | `PlanViews.tsx` 5 tab: `.card *` → `Card`; `.summary-grid`/`.targets`/`.insight-grid` → `Row`/`Col`; `.btn` → `Button`; roadmap phases → `Steps`/`Timeline` khi sạch; giữ mọi dữ liệu + nhãn + `Link` điều hướng | `components/PlanViews.tsx` | `TB-02` | AC-01, AC-08; EL-12..EL-14 | `tsc`; `next build`; smoke: 5 tab render đúng nội dung ở 1440 + 375px | Done | `PlanViews.tsx` 5 tab: `.card`→`Card`, grid→`Row`/`Col` (2 cột ở tablet), `.btn`→`Button`; thanh tiến độ `.bar`/`.income-track`/`.hybrid-ratio` → antd `Progress` (EL-18); roadmap phases → antd `Timeline` (EL-18). Smoke: 6 tab render đúng, `horiz=0` ở 375/768/820/1440/2560 |
| `TB-05` | `JobTrackerBoard.tsx`: thẻ bảng HTML → antd `Table` (`pagination={false}`, `scroll={{x:'max-content'}}`, `sticky`, `sortDirections=['ascend','descend']`); cột giữ thứ tự + `render` cho inline edit/nút; form thêm job → `Form`/`Input`/`Select`; xóa → `Popconfirm` giữ câu chữ; `Toast` → `message` | `components/JobTrackerBoard.tsx` | `TB-02` | AC-05, AC-07, AC-08; EL-13 | `tsc`; `next build`; smoke: `/roadmap` — sắp xếp cột 2 chiều, sửa 1 dòng inline, thêm 1 job, xóa 1 job đều chạy đúng như trước; bảng cuộn ngang trong khung riêng ở 375px | Done | `JobTrackerBoard.tsx` → antd `Table` (`pagination={false}`, `scroll={{x:'max-content'}}`, `sticky`, `sortDirections=['ascend','descend']` giữ sort 2 chiều), cột có `width`; `Popconfirm` xóa (giữ câu chữ); `message` thay Toast; `Dropdown popupRender`. Smoke 375: `.ant-table-body` clientWidth 263 / scrollWidth 1360 → **cuộn ngang bên trong**, trang không cuộn (`horiz=0`). "Thêm job" → hàng nháp antd (10 input/textarea) + "Lưu job"; hủy → về 1 hàng |
| `TB-06` | `TargetGrid.tsx` → `Row`/`Col`/`Card`; `Toast.tsx` giữ prop `{message,onDismiss}`, ruột gọi `App.useApp().message` | `components/shared/TargetGrid.tsx`, `components/shared/Toast.tsx` | `TB-01` | AC-08; contract `Toast`/`TargetGrid` không đổi | `tsc`; `next build`; smoke: lưới mục tiêu ở Tổng quan render; toast lỗi vẫn hiện | Done | `TargetGrid.tsx` → `Row`/`Col`/`Card` (`xs=24 sm=12 lg=8 xl=6` → 2 cột ở tablet, AC-04); `Toast.tsx` giữ prop `{message,onDismiss}`, ruột gọi `App.useApp().message`. `UserMenu.tsx` → antd `Dropdown` (EL-09). Smoke: lưới render 375/1440; `tsc`+`build` pass |
| `TB-07` | `globals.css`: `.container` → `min(2000px, calc(100% - 48px))`; thêm `.app-content`; guard `html,body` `overflow-x:hidden` cấp trang (khung bảng vẫn `overflow-x:auto`); giữ toàn bộ biến `:root`/`body.dark` + `.pie-*`/`.chart`/`.stick`; cắt `.topbar`/`.nav`/`.nav-tabs`/`.btn`/`.card` khi từng tab đã hết dùng (đối chiếu trước khi cắt) | `app/globals.css` | `TB-02`, `TB-03`, `TB-04`, `TB-05`, `TB-06` | AC-02, AC-05 | `next build`; smoke: 1440px nội dung rộng; 2560px trần ~2000px căn giữa; 375px không cuộn ngang toàn trang | Done | `globals.css`: `.container` → `min(2000px, calc(100% - 48px))`; `.app-content` max-width 2000 căn giữa; `.app-shell-nav-bar` + `.app-shell-nav` (thu nhỏ chữ/ẩn icon ≤992px); `min-width:0` chuỗi `.ant-layout-content`/`.app-content`/`.container` (bật cuộn trong cho antd Table); guard `html,body overflow-x:hidden` cấp trang; cắt hẳn lớp cũ `.app-shell/.topbar/.nav/.nav-actions/.nav-tabs/.tab-button/.icon-button/.btn*/.card/.phase*/.timeline/.bar/.buy-build/.salary-bar…` (kể cả trong media query); giữ token + `.pie-*`/`.chart`/`.stick` + `.brand/.logo/.user-menu*/.summary/.target-card` (còn dùng). Smoke: 1440 nội dung = 1440; 2560 nội dung = 2000 căn giữa; `horiz=0` ở 375; smoke `deadClass` (số phần tử `.topbar/.nav-tabs/button.btn/article.card`) = 0 mọi tab |
| `TB-08` | Verification cuối: `tsc` + `next build` + smoke thủ công AC-01..AC-08 ở 375/768/1440/2560px cho cả 6 tab + sáng/tối; cập nhật DEV wiki mục 7 evidence | `docs/kb/dev/wiki/US-023-layout-antd-responsive-toan-app.md`, `docs/kb/dev/00-index.md` | `TB-01`..`TB-07` | Toàn bộ AC | `./node_modules/.bin/tsc --noEmit`; `./node_modules/.bin/next build`; smoke script `curl -H "Host: plan.localhost"` + kiểm mắt | Done | `tsc --noEmit` pass; `next build` pass (7 route, "Compiled successfully"). Smoke Playwright headless (chromium-1234) 375/768/820/1440/2560 × 6 tab + sáng/tối: AC-01..AC-08 đạt (bảng đối chiếu ở DEV wiki §7). DEV wiki §7 + `docs/kb/dev/00-index.md` (đã có dòng US-023) cập nhật |

Task bắt buộc đã có: migration + DBML → không áp dụng (data skip); DEV wiki → `TB-08`; memory → `JDG-036` đã ghi ở stage BA; verification cuối → `TB-08`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (mọi tab cùng khung, /budget không topbar riêng) | `TB-02`, `TB-03`, `TB-04` | AppShell + gộp budget + 5 tab |
| AC-02 (nới bề ngang; màn siêu rộng trần 2000 căn giữa) | `TB-02`, `TB-07` | `.app-content` + `.container` |
| AC-03 (điện thoại: nav → Drawer + nút đổi giao diện; 1 cột; không cuộn ngang) | `TB-02`, `TB-07` | Drawer + guard cuộn ngang |
| AC-04 (máy tính bảng: nav ngang đủ 6 tab thu nhỏ; chuyển tab OK; 1–2 cột) | `TB-02`, `TB-04` | breakpoint `screens.md` |
| AC-05 (bảng rộng cuộn trong khung riêng) | `TB-03`, `TB-05`, `TB-07` | `.budget-table-wrap` + `Table scroll.x` + guard |
| AC-06 (dark nhất quán, nhớ sau reload) | `TB-01`, `TB-02` | `AppThemeProvider` + `darkAlgorithm` |
| AC-07 (nội dung/số liệu/thao tác từng tab không đổi) | `TB-03`, `TB-04`, `TB-05` | logic giữ nguyên |
| AC-08 (primitive là antd; khối trống + hộp thoại giữ câu chữ) | `TB-03`, `TB-04`, `TB-05`, `TB-06` | một phần cho bảng kéo-thả (giữ HTML trong Card) |
| Contract `AppShell`/`Toast`/`TargetGrid` không đổi | `TB-02`, `TB-06` | — |
| Contract `AppThemeProvider`/`useAppTheme` (mới) | `TB-01` | — |
| Theme storage giữ key cũ | `TB-01` | tương thích ngược |
| Impact: App Router page/layout (Yes) | `TB-01` | chỉ `layout.tsx` |
| Impact: Knowledge base/memory (Yes) | `TB-08` | DEV wiki; `JDG-036` đã ghi |
| Impact: Prisma/migration/DBML/Server Action (No) | — | không chạm |

## 5. Thứ Tự Dependency

1. `TB-01` (nền antd + provider)
2. `TB-02` (AppShell) — sau `TB-01`
3. `TB-03` (BudgetApp) · `TB-04` (PlanViews) · `TB-05` (JobTrackerBoard) · `TB-06` (TargetGrid/Toast) — song song được, đều sau `TB-02` (`TB-06` chỉ cần `TB-01`)
4. `TB-07` (globals.css cắt lớp) — sau `TB-02..TB-06`
5. `TB-08` (verification cuối + wiki) — sau tất cả

Acyclic: một chiều `TB-01` → `TB-02` → {`TB-03`,`TB-04`,`TB-05`,`TB-06`} → `TB-07` → `TB-08`.

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task (mục 4).
- [x] Mọi AC-01..AC-08 map tới ít nhất một task.
- [x] Dependency có thứ tự, không vòng lặp (mục 5).
- [x] Mỗi task có verification riêng (`TB-08` mới là build/smoke tổng).
- [x] Cập nhật DEV wiki (`TB-08`), memory (`JDG-036` ở BA), verification cuối (`TB-08`) là task tường minh.
- [x] Không task nào gộp thay đổi cần verify độc lập (provider / shell / từng nhóm tab / css tách riêng).
- [x] Không task nào cần đọc source mới hiểu — outcome mô tả bằng hành vi quan sát được.
- [x] Số task 8 ≤ `SSR_MAX_TASKS_PER_FEATURE` (40).
- [x] ID `TB-01`..`TB-08` mới cho feature này.
- [x] `plan.md` mục 14 đã đồng bộ (skeleton 8 task).

## 7. Blocker Và Câu Hỏi Mở

- Rủi ro đã nêu ở plan mục 13: `JobTrackerBoard` sang antd `Table` (`TB-05`) và cắt lớp CSS (`TB-07`) là hai điểm rủi ro cao nhất — verification của hai task đó kiểm chứng kỹ hành vi cũ. Bảng có kéo-thả inline (`BudgetApp`) chủ ý giữ thẻ bảng HTML trong `Card` antd, không chuyển antd `Table` — AC-08 với các bảng đó đạt ở mức "trong Card antd", ghi rõ ở report.
- Không còn blocker. Kết quả `ssr-review` round 0 = Fail đã được xử lý trong cùng phiên:
  - **F-01 (AC-04, High)**: antd `Menu` ngang nhét trong `Header` bị tràn → gộp phần thừa vào nút `...` ở tablet. Sửa: tách thành **dải nav ngang riêng** dưới `Header` (đúng ASCII mockup spec §8.1) + `disabledOverflow` + thu nhỏ chữ/ẩn icon ≤992px → cả 6 tab một hàng ở 768/820/1440/2560.
  - **F-05 (AC-05, Medium)**: bảng antd `Table` ở /roadmap tràn khung, bị `overflow-x:hidden` cấp trang cắt cụt (không có thanh cuộn trong). Sửa: `min-width:0` xuyên chuỗi flex `.ant-layout-content` → `.app-content` → `.container` + `width` cho từng cột → `.ant-table-body` cuộn ngang trong khung riêng.
  - **F-02 (EL-09)**: `UserMenu` → antd `Dropdown` (email là mục disabled + "Đăng xuất" submit form `signOutAction`).
  - **F-03 (hydration)**: `Grid.useBreakpoint()` → thêm `mounted` guard, hết chớp layout điện thoại khi nạp màn desktop.
  - **F-04 (EL-18)**: thanh tiến độ trong PlanViews (`.bar`/`.income-track`/`.hybrid-ratio`) → antd `Progress`.
  - **F-07 (EL-17)**: xác nhận xóa giao dịch trong `BudgetApp` → `Popconfirm` (giữ nguyên câu chữ "Bạn có chắc muốn xóa giao dịch này?" / "Xác nhận xóa" / "Hủy").
  - **F-06**: `UserMenu.tsx` bổ sung vào plan mục 11. Kèm dọn `dropdownRender` (deprecated) → `popupRender` ở `JobTrackerBoard`.
