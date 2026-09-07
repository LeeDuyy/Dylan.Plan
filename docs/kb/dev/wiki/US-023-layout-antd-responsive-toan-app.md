---
status: Implemented
feature: US-023
updated: 2026-09-07
plan: docs/features/US-023-layout-antd-responsive-toan-app/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-023-layout-antd-responsive-toan-app.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-023", "Layout Ant Design responsive toàn app (DEV)"]
---

# US-023 — Chuẩn hóa layout toàn app bằng Ant Design, responsive mobile/tablet (DEV)

## 1. Tổng Quan Kỹ Thuật

Thuần tầng trình bày, không đụng `server/`, Prisma, Server Action, migration. Ant Design v5 (`antd@5.29.3`) + `@ant-design/nextjs-registry` (trích xuất CSS-in-JS phía server, tránh FOUC với App Router) + `@ant-design/v5-patch-for-react-19` (tương thích React 19) + `@ant-design/icons`. `app/layout.tsx` bọc `AntdRegistry` + component client mới `AppThemeProvider` (`ConfigProvider` token map từ biến CSS trong `globals.css` + `theme.darkAlgorithm`, `App` cho `message`, context sáng/tối dùng chung). `AppShell` dựng lại bằng `Layout`/`Menu`/`Drawer` + `Grid.useBreakpoint()`; `/budget` gộp vào `AppShell` (bỏ topbar riêng của `BudgetApp`). Primitive 6 tab → component antd; bảng có kéo-thả inline (`BudgetApp`) giữ thẻ bảng HTML trong `Card`; bảng CV (`JobTrackerBoard`) → antd `Table`. `globals.css` nới `.container` → 2000px căn giữa, giữ token + lớp biểu đồ.

## 2. Luồng End-To-End

```text
middleware (host routing, không đổi)
  -> app/layout.tsx: import patch React 19; AntdRegistry > UserSessionProvider > AppThemeProvider(ConfigProvider + App) > children
  -> app/(mỗi tab)/page.tsx (6 route, không đổi) -> *View client -> AppShell (Layout/Menu/Drawer responsive)
     -> nội dung tab (Card/Table/Button/Select/Input/Tag/Progress/Steps/Timeline/Popconfirm/message antd; logic + Server Action giữ nguyên)
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `app/layout.tsx` | Server Component — bọc registry + patch + theme provider |
| Provider | `components/shared/AppThemeProvider.tsx` (mới, client) | `ConfigProvider` + `App` + context sáng/tối |
| Shell | `components/shared/AppShell.tsx` | `Layout`/`Header`(logo + actions) + **dải nav ngang riêng** `.app-shell-nav-bar`(antd `Menu` horizontal, `disabledOverflow`) + `Content`/`Footer` + `Drawer` (điện thoại); gate `Grid.useBreakpoint()` + `mounted` guard |
| Tab content | `components/BudgetApp.tsx`, `components/PlanViews.tsx`, `components/JobTrackerBoard.tsx` | primitive → antd, logic giữ nguyên |
| Style | `app/globals.css` | container 2000px, `.app-content`, guard cuộn ngang, giữ token + biểu đồ |
| Data | — | Không chạm |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Root layout | `app/layout.tsx` | Bọc `AntdRegistry` + `AppThemeProvider` + patch |
| Provider | `components/shared/AppThemeProvider.tsx` | `ConfigProvider` token/dark + `App` + `ThemeContext` |
| Shell | `components/shared/AppShell.tsx` | Khung chung mọi tab |
| Component | `components/BudgetApp.tsx` | Tab Thu chi — bỏ topbar, bọc AppShell, primitive → antd |
| Component | `components/PlanViews.tsx` | 5 tab — primitive → antd |
| Component | `components/JobTrackerBoard.tsx` | Bảng CV → antd `Table` + `Form` |
| Component | `components/shared/TargetGrid.tsx` | `Row`/`Col`/`Card` |
| Component | `components/shared/Toast.tsx` | Giữ API, ruột → `message` antd |
| Component | `components/shared/UserMenu.tsx` | Menu đăng xuất → antd `Dropdown` (EL-09): email là mục disabled + "Đăng xuất" submit form `signOutAction`; trigger đặt trong `Header` |
| Style | `app/globals.css` | Token + lớp biểu đồ giữ; container nới; lớp shell/nav/btn/card cắt sau khi tab hết dùng |

## 4. Prisma Schema Và Migration

Không áp dụng — US-023 không đụng data model. Không migration, DBML không đổi.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `AppShell` | props `{ children }` — không đổi | 6 `*View` trong `PlanViews.tsx`, `BudgetApp.tsx` |
| `AppThemeProvider` / `useAppTheme()` | context `{ dark, toggle }` — mới | `AppShell` (nút đổi giao diện) |
| `Toast` | props `{ message, onDismiss }` — không đổi | `BudgetApp.tsx`, `JobTrackerBoard.tsx` |
| Theme storage | `localStorage["dylan-plan-next-dashboard-v2"] = { dark }` — giữ nguyên key/shape | tương thích ngược |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| US-022 | Depends on | `components/BudgetApp.tsx` — US-023 làm sau |
| US-002 | Related only | `AppShell` — `/budget` gộp vào khung chung |
| US-017 | Impacts | Bảng danh mục kéo-thả — giữ thẻ bảng HTML, chỉ bọc `Card` |
| US-018/US-020/US-021 | Impacts | `JobTrackerBoard` bảng CV → antd `Table`, giữ sort/inline-edit/add/xóa |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `./node_modules/.bin/tsc --noEmit` | Pass (0 lỗi) | 2026-09-07 |
| `./node_modules/.bin/next build` | Pass — "Compiled successfully", 7 route (`/`, `/budget`, `/freelance`, `/product`, `/roadmap`, `/timetable`, `/signin`) | 2026-09-07 |
| `next lint` / test | N/A — dự án chưa có eslint config / test suite | 2026-09-07 |
| Smoke Playwright headless (chromium-1234, Host `plan.localhost`) — 6 tab × 375/768/820/1440/2560px + sáng/tối | Pass — xem bảng AC dưới | 2026-09-07 |

### 7.1. Đối chiếu AC (smoke 2026-09-07)

| AC | Kết quả | Bằng chứng |
| --- | --- | --- |
| AC-01 mọi tab cùng khung, `/budget` không topbar riêng | Đạt | 5 `*View` + `BudgetApp` bọc `<AppShell>`; smoke: cùng header + dải nav + footer ở mọi tab; `menuItems=6` |
| AC-02 nới bề ngang; siêu rộng trần 2000 căn giữa | Đạt | 1440: `contentWidth=1440`; 2560: `contentWidth=2000`, `maxWidth=2000px`, căn giữa |
| AC-03 điện thoại: nav → Drawer + nút đổi giao diện; 1 cột; không cuộn ngang | Đạt | 375: `drawerBtn` hiện, Drawer mở có 6 mục + nút "Đổi giao diện"; `horiz=0`; cột đơn |
| AC-04 máy tính bảng: 6 tab hàng ngang, không thu nút | Đạt (sau sửa F-01) | 768/820: cả 6 nhãn một hàng ở **dải nav riêng**, `hasOverflow=false`; lưới nội dung 2 cột |
| AC-05 bảng rộng cuộn trong khung riêng | Đạt (sau sửa F-05) | 375 `/roadmap`: `.ant-table-body` clientWidth 263 / scrollWidth 1360 → cuộn ngang bên trong; `horiz=0` toàn trang; bảng `/budget` giữ `.budget-table-wrap` `overflow-x:auto` |
| AC-06 dark nhất quán, nhớ sau reload | Đạt | Toggle (header & trong Drawer) → `body.dark` + `localStorage {"dark":true}`; reload vẫn tối; `theme.darkAlgorithm` phủ mọi component antd |
| AC-07 nội dung/thao tác từng tab không đổi | Đạt | Thêm nguồn thu → hàng hiện + "Thu nhập tháng" = 36.234.567 ₫; xóa → biến mất (0 dữ liệu test còn lại). "Thêm job" → hàng nháp antd (10 input/textarea) + "Lưu job"; hủy → về 1 hàng. Sort bảng CV giữ chu kỳ 2 chiều (`sortDirections=['ascend','descend']`) |
| AC-08 primitive là antd; khối trống + hộp thoại giữ câu chữ | Đạt | `Button`/`Card`/`Table`/`Select`/`Input`/`Tag`/`Progress`/`Dropdown`/`Popconfirm`/`message` antd; `UserMenu` → `Dropdown` (EL-09); bảng kéo-thả (`BudgetApp`) chủ ý giữ `<table>` HTML trong `Card` (AC-08 mức "trong Card antd" — plan mục 13); xác nhận xóa giao dịch → `Popconfirm` giữ nguyên câu chữ |

### 7.2. Review round 0 (ssr-review) và cách xử lý

Verdict round 0 = **Fail** (F-01 High: antd `Menu` ngang trong `Header` bị gộp phần thừa vào `...` ở tablet → AC-04 không đạt). Đã sửa trong cùng phiên:

| Finding | Sửa |
| --- | --- |
| F-01 AC-04 | Tách thanh chuyển tab thành **dải ngang riêng** `.app-shell-nav-bar` dưới `Header` (theo ASCII mockup spec §8.1) + `disabledOverflow` + thu nhỏ chữ/ẩn icon ≤992px |
| F-05 AC-05 | `min-width:0` xuyên chuỗi flex `.ant-layout-content` → `.app-content` → `.container` + `width` cho từng cột antd `Table` → `.ant-table-body` bật cuộn ngang trong khung |
| F-02 EL-09 | `UserMenu` → antd `Dropdown` (email disabled + "Đăng xuất" submit `signOutAction`) |
| F-03 hydration | `Grid.useBreakpoint()` + `mounted` guard — hết chớp layout điện thoại khi nạp màn desktop |
| F-04 EL-18 | Thanh tiến độ PlanViews (`.bar`/`.income-track`/`.hybrid-ratio`) → antd `Progress` |
| F-07 EL-17 | Xác nhận xóa giao dịch `BudgetApp` → `Popconfirm` (giữ câu chữ) |
| F-06 | `UserMenu.tsx` bổ sung vào plan mục 11; dọn `dropdownRender` → `popupRender` (`JobTrackerBoard`) |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| `JobTrackerBoard` antd `Table` hồi quy sort/inline-edit/xóa | Cao | Revert `JobTrackerBoard.tsx` (các file độc lập) |
| Kéo-thả danh mục/nguồn thu hỏng | Cao | Giữ thẻ bảng HTML cho các bảng đó (không dùng antd `Table`) |
| FOUC do CSS-in-JS SSR | Trung bình | `AntdRegistry` xử lý; revert `layout.tsx` |
| Cắt nhầm lớp CSS còn dùng | Trung bình | Cắt sau cùng; revert `globals.css` |

## 9. Kiến Trúc Áp Dụng

- Bounded context: không áp dụng (US-023 thuần UI, không chạm `server/` bounded-context nào). Cấu trúc `architecture/` chưa được khởi tạo cho dự án (`docs/memory/judgement-log.md#jdg-005`).

| Pattern | Dùng ở lớp/lát cắt nào | Lệch pattern (lý do) |
| --- | --- | --- |
| "Khung `AppShell` dùng chung bọc mọi `*View`" (đã có từ US-002, US-023 dựng lại bằng antd) | UI shell | Không — mở rộng khung cũ, thêm `/budget` |
| "Provider giao diện ở root layout" (mới) | `app/layout.tsx` | Không |
