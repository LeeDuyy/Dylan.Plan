# Chuẩn hóa layout toàn app bằng Ant Design, responsive mobile/tablet — SE Plan

Status: Delivered
Feature: US-023
Spec: spec.md
Created: 2026-09-07
Updated: 2026-09-07
DEV Wiki: `docs/kb/dev/wiki/US-023-layout-antd-responsive-toan-app.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Thuần tầng trình bày. Ba khối: (a) nền Ant Design v5 — `layout.tsx` bọc `AntdRegistry` (`@ant-design/nextjs-registry`) + import patch React 19 (`@ant-design/v5-patch-for-react-19`) + component client `AppThemeProvider` bọc `ConfigProvider` (token map từ biến CSS + `theme.darkAlgorithm`) và `App` (message/notification), cấp context sáng/tối dùng chung; (b) `AppShell` dựng lại bằng `Layout`/`Header`/`Content`/`Footer` + `Menu` ngang (máy tính bảng/màn rộng) + `Drawer` (điện thoại, gate bằng `Grid.useBreakpoint()`), gộp `/budget` vào khung này (bỏ topbar riêng của `BudgetApp`); (c) chuyển primitive trong 6 tab sang component antd (`Button`/`Card`/`Table`/`Select`/`Input`/`Tag`/`Progress`/`Steps`/`Timeline`/`Modal`/`message`), giữ nguyên mọi handler/state/nhãn. Container nới `min(2000px, calc(100% - 48px))` căn giữa. Biểu đồ tròn/cột tab Thu chi giữ cách vẽ hiện tại, chỉ khoác `Card`. `next.config` giữ `output: standalone` — không đổi.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `app/layout.tsx` | Root layout — nơi bọc registry + patch + theme provider |
| `app/globals.css` | Token màu (biến CSS), `.container` 1220px, `@media` rải rác — nới container + guard cuộn ngang + giữ token |
| `components/shared/AppShell.tsx` | Khung chung 5 tab — dựng lại bằng antd `Layout`/`Menu`/`Drawer` |
| `components/BudgetApp.tsx` | Tab Thu chi có topbar riêng (dòng ~576-591) + logic dark lặp — bỏ topbar, bọc `AppShell`, bỏ dark state |
| `components/PlanViews.tsx` | 5 tab (Overview/Roadmap/Timetable/Freelance/Product) — section/card/btn/summary-grid → antd |
| `components/JobTrackerBoard.tsx` | Bảng "Theo dõi CV ứng tuyển" — bảng có sort + inline edit + add + xóa; chuyển sang `Table` antd giữ mọi hành vi |
| `components/shared/TargetGrid.tsx` | Lưới thẻ mục tiêu — `Card` trong `Row/Col` |
| `components/shared/Toast.tsx` | Toast tự dựng — thay bằng `App.useApp().message` hoặc giữ, khoác style antd |
| `components/shared/UserMenu.tsx` | Menu đăng xuất (email + logout form) — giữ nội dung, đặt trong `Header` |
| `components/shared/UserSessionContext.tsx` | Context email — không đổi |
| `package.json` | Đã thêm `antd@5.29.3`, `@ant-design/nextjs-registry@1.3`, `@ant-design/v5-patch-for-react-19@1.0`, `@ant-design/icons@5.6` |
| `next.config.ts` | `output: standalone` — giữ |
| `middleware.ts` | Định tuyến theo host (`plan.localhost` → tab app) — không đổi |
| `docs/kb/ba/wiki/knowledge/feature/US-023-...md`, `BR-038` | Rule của function |

## 3. Hành Vi Hiện Tại

- `app/layout.tsx`: cấu trúc `html > body(suppressHydrationWarning) > UserSessionProvider > children` — không có provider giao diện.
- `components/shared/AppShell.tsx`: `div.app-shell > header.topbar (nav-tabs: 6 Link, nút đổi giao diện, UserMenu) + main{children} + footer`; đọc/ghi `dark` từ `localStorage` key `dylan-plan-next-dashboard-v2`, `document.body.classList.toggle("dark", dark)`.
- `components/BudgetApp.tsx`: **không** dùng `AppShell` — tự dựng `div.app-shell > header.topbar > ... > main` với logic dark **lặp lại y hệt** AppShell.
- 5 tab trong `PlanViews.tsx` mỗi tab: `AppShell > section.section > div.container > (card panel / summary-grid / btn)`.
- `.container { width: min(1220px, calc(100% - 32px)) }` — bó nội dung.
- Toast: một `div` `position:fixed` tự dựng.
- Bảng: `<table>` HTML thuần trong `.budget-table-wrap` (có `overflow-x:auto`) cho danh mục chi / nguồn thu / items cần mua; JobTrackerBoard tự dựng thẻ bảng HTML + sort state.

## 4. Hành Vi Mục Tiêu

- `layout.tsx`: `body > AntdRegistry > UserSessionProvider > AppThemeProvider > children`; import `@ant-design/v5-patch-for-react-19` ở đầu file.
- `AppThemeProvider` (mới, client): state `dark` (khởi tạo từ `localStorage` key cũ, giữ tương thích), effect `document.body.classList.toggle("dark", dark)` + ghi localStorage; `ConfigProvider theme={algorithm: dark?darkAlgorithm:defaultAlgorithm, token:{colorPrimary,borderRadius,colorSuccess,colorWarning,colorError,colorBgLayout,colorText,fontFamily}} > App > children`; cấp `ThemeContext { dark, toggle }`.
- `AppShell` (dựng lại): `Layout > Layout.Header` chứa: bên trái `Link` logo+tên (EL-08), giữa `Menu mode=horizontal` 6 item (EL-03) — ẩn khi `!screens.md`; bên phải nút đổi giao diện (EL-06, ẩn khi `!screens.md`) + `UserMenu` (EL-09) + nút mở `Drawer` (EL-04, chỉ khi `!screens.md`). `Drawer placement=right` chứa `Menu mode=inline` 6 item + `Button` đổi giao diện (EL-05/EL-06 trên điện thoại). `Layout.Content` bọc `div.app-content` (max-width 2000, margin auto, padding responsive). `Layout.Footer` giữ nội dung chân trang.
- `BudgetApp.tsx`: bỏ toàn bộ khối `header.topbar` + `dark` state + 2 effect dark; đổi `div.app-shell > ... > main` thành `AppShell` bọc nội dung (như `PlanViews`). Nội dung bên trong (sections, bảng nguồn thu, insight, danh mục) giữ nguyên logic, khoác `Card`/`Button`/`Select`/`Input` antd.
- 5 tab `PlanViews.tsx`: `.card panel`/`.card summary`/`.card target-card` → `Card` antd; `.summary-grid`/`.targets`/`.insight-grid` → `Row` + `Col` (xs=24, sm/md nhỏ hơn); `.btn`/`.btn primary` → `Button` antd; `Link` giữ (bọc `Button` khi cần dáng nút). `PrioritySection`/`RoadmapSections`/`TimetableSection`/`FreelanceSections`/`ProductSections`/`LongTermSections`: giữ dữ liệu + cấu trúc, đổi vỏ.
- `JobTrackerBoard.tsx`: thẻ bảng HTML → antd `Table` (`pagination={false}`, `scroll={{x:'max-content'}}`, `sticky`); cột giữ nguyên thứ tự, dùng `render` cho inline edit/nút; `sort` state → `Table` `sorter` + `sortDirections=[ascend,descend]` (giữ chu kỳ 2 chiều); form thêm job → antd `Form`/`Input`/`Select`; xóa → `Popconfirm` giữ nguyên câu chữ; toast → `message`.
- `TargetGrid.tsx`: `.targets` → `Row` + `Col` + `Card` antd.
- `Toast.tsx`: giữ API prop `{ message, onDismiss }` để không phải sửa call site; ruột đổi sang gọi `App.useApp().message` antd.
- `globals.css`: `.container` → `width: min(2000px, calc(100% - 48px))`; thêm `.app-content { max-width: 2000px; margin: 0 auto; padding: 16px clamp(12px, 4vw, 32px) }`; `html, body` `max-width:100%` + `overflow-x:hidden` **chỉ** ở cấp trang (các khung bảng vẫn có `overflow-x:auto` riêng); giữ toàn bộ biến `:root`/`body.dark` + lớp biểu đồ (`.pie-*`, `.chart`, `.stick`); cắt các lớp `.topbar`/`.nav`/`.nav-tabs`/`.btn`/`.card`/`.summary`/`.target-card` sau khi đối chiếu từng tab không còn dùng.

## 5. Luồng End-To-End

```text
Request -> middleware (host routing, không đổi)
  -> app/layout.tsx (Server Component)
     -> import "@ant-design/v5-patch-for-react-19"
     -> <AntdRegistry> (trích xuất CSS-in-JS phía server)
        -> <UserSessionProvider email={session.email}>
           -> <AppThemeProvider>  [MỚI, client]
              -> <ConfigProvider theme={token map + dark algorithm}> <App>
                 -> {children} = một trong 6 page
  -> page.tsx (mỗi tab) -> *View (client) -> <AppShell> [dựng lại antd Layout/Menu/Drawer]
       -> nội dung tab (Card/Table/Button/... antd, logic + Server Action giữ nguyên)
```

Không có luồng dữ liệu/Server Action nào đổi. Mọi mutation của các tab (upsert nguồn thu, upsert job, ...) đi đúng đường cũ.

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| US-022 (Delivered) | `git log` `cc7b436`; `components/BudgetApp.tsx` đã có bảng Nguồn thu + insight mới | Có | US-023 dựng lại giao diện tab Thu chi trên nền này — làm sau (`DEC-132`) |
| `antd@5.29.3` + `@ant-design/nextjs-registry@1.3` + `@ant-design/v5-patch-for-react-19@1.0` + `@ant-design/icons@5.6` | `package.json`; `node -e "require('antd')..."` OK | Không | Đã cài sẵn ở bước chuẩn bị |
| React 19 + Next 15.5 App Router | `package.json` | Không | patch React 19 bắt buộc cho antd v5 |
| `output: standalone` | `next.config.ts` | Không | `AntdRegistry` hoạt động với standalone; không đổi config |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | Yes | `app/layout.tsx` bọc provider; 6 page không đổi (vẫn render `*View`) |
| Server Action | No | Không chạm |
| Route Handler (`app/api`) | No | Không chạm |
| Auth / middleware / permission | No | `middleware.ts` không đổi |
| Prisma schema | No | — |
| Migration SQLite | No | — |
| DBML | No | — |
| Seed data | No | — |
| Caching / revalidate | No | Không thêm mutation |
| Export / báo cáo | No | `exportData` trong `BudgetApp` không đổi |
| Mail / webhook / job nền | N/A | — |
| Knowledge base / memory | Yes | DEV wiki mới; `docs/kb/dev/00-index.md`; `judgement-log.md` (JDG-036 đã ghi) |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry | `app/layout.tsx` | Bọc `AntdRegistry` + `AppThemeProvider`; import patch React 19 |
| UI (mới) | `components/shared/AppThemeProvider.tsx` | `ConfigProvider` token map + dark algorithm + `App`; context sáng/tối |
| UI | `components/shared/AppShell.tsx` | Dựng lại bằng `Layout`/`Header`/`Content`/`Footer` + `Menu` + `Drawer` + `Grid.useBreakpoint` |
| UI | `components/BudgetApp.tsx` | Bỏ topbar + dark state; bọc `<AppShell>`; primitive trong tab → antd |
| UI | `components/PlanViews.tsx` | 5 tab: section/card/grid/btn → antd `Card`/`Row`/`Col`/`Button`; `Steps`/`Timeline` cho roadmap phases |
| UI | `components/JobTrackerBoard.tsx` | `<table>` → antd `Table` (giữ cột, sort, inline edit, add, xóa); form → antd; toast → `message` |
| UI | `components/shared/TargetGrid.tsx` | `Row`/`Col`/`Card` |
| UI | `components/shared/Toast.tsx` | Ruột đổi sang `message` antd, giữ API prop |
| Style | `app/globals.css` | Nới `.container` → 2000px; `.app-content`; guard cuộn ngang cấp trang; giữ token + lớp biểu đồ; cắt lớp bị antd thay |
| Consumer | `app/*/page.tsx` (6) | Không sửa — vẫn import `*View` |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**. US-023 thuần tầng trình bày. Không có truy vấn Prisma nào đổi; mọi Server Action giữ nguyên contract. `schemaChangeRequired: false` → bỏ qua stage `data`.

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `AppShell` props | `{ children }` | `{ children }` | Không |
| `Toast` props | `{ message, onDismiss }` | `{ message, onDismiss }` (ruột đổi) | Không |
| `TargetGrid` props | `{ eyebrow, title, desc?, items }` | như cũ | Không |
| Theme (dark) storage | `localStorage["dylan-plan-next-dashboard-v2"] = { dark }` | Giữ nguyên key + shape | Không |
| Server Action (mọi tab) | — | không đổi | Không |
| CSS class công khai (`.btn`, `.card`, `.container`...) | Dùng khắp nơi | Một số bị gỡ sau khi tab hết dùng | Không breaking runtime (không ai import từ ngoài); rủi ro sót lớp → verify từng tab |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `app/layout.tsx` | Bọc registry + theme provider + patch |
| `components/shared/AppThemeProvider.tsx` | Tạo mới |
| `components/shared/AppShell.tsx` | Dựng lại bằng antd Layout/Menu/Drawer responsive |
| `components/BudgetApp.tsx` | Bỏ topbar/dark; bọc AppShell; primitive → antd |
| `components/PlanViews.tsx` | 5 tab: primitive → antd |
| `components/JobTrackerBoard.tsx` | Bảng + form → antd, giữ hành vi |
| `components/shared/TargetGrid.tsx` | Row/Col/Card antd |
| `components/shared/Toast.tsx` | Ruột → message antd |
| `components/shared/UserMenu.tsx` | Menu đăng xuất → antd `Dropdown` (EL-09), giữ email + nút đăng xuất |
| `app/globals.css` | Nới container, app-content, guard cuộn ngang, cắt lớp thừa, giữ token + biểu đồ |
| `docs/kb/dev/wiki/US-023-layout-antd-responsive-toan-app.md` | Tạo DEV wiki |
| `docs/kb/dev/00-index.md` | Thêm dòng US-023 |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng |
| --- | --- | --- |
| Typecheck | `./node_modules/.bin/tsc --noEmit` | 0 lỗi |
| Build | `./node_modules/.bin/next build` | pass, 6 route compile |
| Lint | `./node_modules/.bin/next lint` | N/A (dự án chưa có eslint config) |
| Test | `vitest` | N/A (repo không có test suite) |
| Thủ công 1 | `next dev`, mở 6 tab với `Host: plan.localhost` ở ~1440px | Cùng khung, cùng nav, `/budget` không còn topbar riêng — AC-01; nội dung dùng phần lớn bề ngang — AC-02 |
| Thủ công 2 | Thu cửa sổ ~375px | Nav → nút + Drawer (chứa 6 tab + nút đổi giao diện); nội dung 1 cột; không cuộn ngang toàn trang — AC-03 |
| Thủ công 3 | ~768px | Nav ngang đủ 6 tab (chữ nhỏ), chuyển tab OK; nội dung 1–2 cột; không cuộn ngang — AC-04 |
| Thủ công 4 | ~2560px | Nội dung dừng ~2000px, căn giữa — AC-02 |
| Thủ công 5 | Bảng danh mục chi + bảng CV ở ~375px | Cuộn ngang trong khung riêng, trang không cuộn — AC-05 |
| Thủ công 6 | Bấm đổi giao diện, reload | Toàn bộ đổi tối nhất quán, nhớ sau reload — AC-06 |
| Thủ công 7 | Sau khi đổi tối: thêm 1 nguồn thu ở Thu chi, thêm 1 job ở CV | Lưu OK, hiển thị đúng — AC-07 |
| Thủ công 8 | Quan sát nút/thẻ/bảng/menu/hộp thoại xóa | Là component antd; khối trống + câu chữ hộp thoại giữ nguyên — AC-08 |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Nháy giao diện (FOUC) do CSS-in-JS SSR | Trung bình | `AntdRegistry` xử lý; verify `next build` + xem HTML nguồn có style antd | Revert `layout.tsx` |
| `JobTrackerBoard` sang antd `Table` làm hồi quy sort/inline-edit/xóa (US-018/US-020/US-021) | Cao | Giữ nguyên toàn bộ handler/state; `Table` chỉ đổi vỏ; smoke AC-07 + kiểm sort 2 chiều + inline edit + xóa từng bước | Revert `JobTrackerBoard.tsx` (các file khác độc lập) |
| Bảng antd tự thêm phân trang / chu kỳ sắp xếp 3 trạng thái | Trung bình | `pagination={false}`; `sortDirections={['ascend','descend']}` | — |
| Kéo-thả sắp xếp danh mục / nguồn thu (US-017/US-022) hỏng khi bảng đổi vỏ | Cao | **Giữ thẻ bảng HTML thuần cho các bảng có kéo-thả inline** (danh mục chi, nguồn thu, items cần mua trong `BudgetApp`), chỉ bọc `Card` antd + giữ `.budget-table-wrap` — không chuyển sang antd Table (DnD + inline edit của antd Table rủi ro cao). AC-08 với các bảng này đạt ở mức "trong Card antd, đầu bảng cố định bằng CSS", ghi rõ ở report | Revert phần bảng trong `BudgetApp.tsx` |
| Cắt nhầm lớp CSS còn dùng | Trung bình | Cắt sau cùng, `next build` + smoke từng tab trước khi cắt; giữ lại nếu nghi ngờ | Revert `globals.css` |
| Bundle size tăng (antd) | Thấp | antd v5 tree-shake theo import; chấp nhận cho app nội bộ | — |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | `AppThemeProvider` + `layout.tsx` bọc registry/patch/provider | Done |
| `TB-02` | `AppShell` dựng lại antd Layout + dải nav ngang riêng + Drawer responsive | Done |
| `TB-03` | `BudgetApp.tsx` bỏ topbar/dark, bọc AppShell; primitive tab Thu chi → antd (giữ `<table>` cho bảng có kéo-thả); xóa giao dịch → `Popconfirm` | Done |
| `TB-04` | `PlanViews.tsx` 5 tab primitive → antd; thanh tiến độ → `Progress` | Done |
| `TB-05` | `JobTrackerBoard.tsx` bảng + form → antd `Table`/`Form`, giữ sort 2 chiều/inline-edit/add/xóa; cột có `width`; cuộn ngang trong `.ant-table-body` | Done |
| `TB-06` | `TargetGrid.tsx` (2 cột tablet) + `Toast.tsx` + `UserMenu.tsx` (`Dropdown`) → antd | Done |
| `TB-07` | `globals.css` nới container 2000px + `.app-content` + `.app-shell-nav-bar` + `min-width:0` chuỗi flex + guard cuộn ngang + cắt lớp thừa (giữ token + biểu đồ) | Done |
| `TB-08` | Verification cuối: tsc + build + smoke Playwright AC-01..AC-08 ở 375/768/820/1440/2560px + DEV wiki | Done |

Readiness: Delivered — không đổi schema (data skip); antd đã cài; thứ tự `TB-01` → `TB-02` → (`TB-03`, `TB-04`, `TB-05`, `TB-06` song song được) → `TB-07` → `TB-08`. `ssr-review` round 0 = Fail (F-01 AC-04) → đã sửa F-01..F-08 trong cùng phiên; `tsc` + `next build` pass; smoke đạt cả 8 AC.
