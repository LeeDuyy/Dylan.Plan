---
status: Implemented
feature: US-024
updated: 2026-09-09
plan: C:/Users/Admin/.claude/plans/witty-sprouting-pond.md
owner: ssr-dev
tags: [kb/dev/wiki]
aliases: ["US-024", "Chuyển design system sang @vn-dylan/ui (DEV)"]
---

# US-024 — Chuyển toàn bộ Plan app từ Ant Design sang design system `@vn-dylan/ui` (DEV)

## 1. Tổng Quan Kỹ Thuật

Thuần tầng trình bày, không đụng `server/`, Prisma, Server Action, migration nghiệp vụ. Gỡ **Ant
Design** (`antd`, `@ant-design/icons`, `@ant-design/nextjs-registry`,
`@ant-design/v5-patch-for-react-19`) → dùng **`@vn-dylan/ui@0.1.1`** + **`@vn-dylan/utils@0.1.1`**.

Design system theming hoàn toàn qua CSS custom properties trong `@vn-dylan/ui/styles.css` (`:root` =
sáng, class `.dark` trên phần tử `html` = tối) — **không còn provider** (`ConfigProvider`/`App`/
`AntdRegistry`). `app/layout.tsx` chỉ `import "@vn-dylan/ui/styles.css"` + `import "./globals.css"`,
thêm thẻ `script` nhỏ chống FOUC (đọc `localStorage["dyl-color-mode"]` + `prefers-color-scheme`
đặt class `.dark` sớm) và `metadata.icons.icon = "/favicon.svg"` (favicon lấy từ portfolio). Toaster
mount qua `components/shared/RootClient.tsx` (client wrapper).

Dark mode: hook `useDarkMode()` của `@vn-dylan/utils` (trả tuple `[isDark, setMode]`, toggle class
`.dark` trên phần tử `html`, tự lưu `localStorage["dyl-color-mode"]`). Nút toggle nằm trong navbar,
có `mounted` guard tránh hydration mismatch icon Moon/Sun.

Layout chuẩn: `AppShell` dựng lại bằng một thanh `header.app-navbar` — thương hiệu + 6 link điều
hướng inline (`next/link`, class `active` theo `usePathname`) + nút giao diện + `UserMenu` + nút ba
gạch. Điện thoại (CSS `max-width: 900px`): ẩn link inline, hiện ba gạch → `Drawer` (`isOpen`/
`onClose`). Bỏ dải nav ngang riêng `.app-shell-nav-bar` và `Grid.useBreakpoint`.

`globals.css`: ~1700 dòng CSS app giữ nguyên; biến cũ (`--primary`, `--surface`, `--line`, `--text`,
`--muted`, `--bg`, `--success`…) đổi thành **alias mỏng lên token `--dyl-*`**. Bỏ mọi selector
`.ant-*` (thay bằng `.dyl-card__body`, `.dyl-select__trigger`, `.dyl-progress__line-value`…). Bảng
màu biểu đồ `--chart-1..8` giữ thủ công (design system không có), có biến thể dưới `.dark`. Thêm
`.app-navbar`, `.app-nav-link`, `.btn-danger`, `.progress-warn/-danger/-success`, `.tag-purchased/
-pending`.

## 2. Luồng End-To-End

```text
middleware (host routing, không đổi)
  -> app/layout.tsx (Server Component): import styles.css + globals.css; script FOUC;
     phần tử html gắn suppressHydrationWarning;
     UserSessionProvider > RootClient (mount Toaster) > children
  -> app/(mỗi tab)/page.tsx (6 route, không đổi) -> *View client -> AppShell
     -> header.app-navbar (Link x6 + nút giao diện useDarkMode + UserMenu + Drawer điện thoại)
     -> nội dung tab: Button/Card/Input/Select/Progress/Tag/Table/Timeline/Dropdown của @vn-dylan/ui
        + InlineConfirm + toast.push ; logic + Server Action giữ nguyên
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `app/layout.tsx` | styles.css + script FOUC + favicon; bọc `RootClient` |
| Toaster | `components/shared/RootClient.tsx` (mới) | client wrapper render `Toaster` |
| Helper | `components/shared/ui.tsx` (mới) | `opt`, `selected` (Select), `InlineConfirm` (thay `Popconfirm`) |
| Shell | `components/shared/AppShell.tsx` | navbar + `Drawer` + `useDarkMode` + `mounted` guard |
| Tab content | `components/PlanViews.tsx`, `components/JobTrackerBoard.tsx`, `components/BudgetApp.tsx` | antd → vn-dylan theo bảng §5 |
| Style | `app/globals.css` | alias `--dyl-*`, `.app-navbar`, bỏ `.ant-*` |
| Data | — | Không chạm |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Root layout | `app/layout.tsx` | styles.css + FOUC script + `metadata.icons`; `html` có `suppressHydrationWarning` |
| Toaster mount | `components/shared/RootClient.tsx` (mới) | render `Toaster` |
| Helper UI | `components/shared/ui.tsx` (mới) | `opt`, `selected`, `InlineConfirm` |
| Shell | `components/shared/AppShell.tsx` | navbar + drawer + toggle giao diện |
| UserMenu | `components/shared/UserMenu.tsx` | `Dropdown` + `renderTitle` + `Dropdown.Item` |
| Toast | `components/shared/Toast.tsx` | `toast.push(message,{duration:4000})` |
| TargetGrid | `components/shared/TargetGrid.tsx` | `Card` + `div.targets` |
| Tab content | `components/PlanViews.tsx`, `components/JobTrackerBoard.tsx`, `components/BudgetApp.tsx` | primitive antd → vn-dylan |
| Config | `next.config.mjs` | `transpilePackages` + `optimizePackageImports` + `serverExternalPackages` |
| Deps | `package.json` | gỡ 4 gói antd; thêm `@vn-dylan/utils` |
| Đã xóa | `components/shared/AppThemeProvider.tsx` | thay bằng `useDarkMode` + `RootClient` |
| Data | — | Không chạm |

## 4. Prisma Schema Và Migration

Không áp dụng — US-024 thuần UI, không đụng data model, không migration, DBML không đổi.

Ghi chú vận hành (không thuộc phạm vi nghiệp vụ): repo vừa chuyển npm → pnpm. Bundler Next của
`prisma-client` generator lỗi `TypeError: Cannot read properties of undefined (reading 'indexOf')`
tại `prisma.$transaction` khi chạy dưới pnpm — khắc phục bằng
`next.config.mjs` → `serverExternalPackages: ["@prisma/client","@prisma/adapter-better-sqlite3","better-sqlite3"]`.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `AppShell` | props `{ children }` — không đổi | 6 `*View` trong `PlanViews.tsx`, `BudgetApp.tsx` |
| `RootClient` | props `{ children }` — mới, mount `Toaster` | `app/layout.tsx` |
| `Toast` | props `{ message, onDismiss }` — không đổi (nội bộ gọi `toast.push`) | `BudgetApp.tsx`, `JobTrackerBoard.tsx` |
| `opt(value,label?)` / `selected(options,value)` | helper Select vn-dylan (value = object option) | `BudgetApp.tsx`, `JobTrackerBoard.tsx` |
| `InlineConfirm` | props `{ open,label,onOpen,onConfirm,onCancel,trigger,... }` — thay `Popconfirm` | `BudgetApp.tsx` (xóa giao dịch); JobTracker dùng biến thể inline sẵn có |
| Theme storage | `localStorage["dyl-color-mode"] = "light"\|"dark"` (do `useDarkMode`) | tách biệt với key migration `"dylan-plan-next-dashboard-v2"` của `BudgetApp` |
| antd→vn-dylan | Bảng ánh xạ component | — |

### 5.1. Bảng ánh xạ antd → `@vn-dylan/ui`

| antd | vn-dylan | Ghi chú |
| --- | --- | --- |
| `ConfigProvider`+`theme.darkAlgorithm`+`App` | *(bỏ)* + `useDarkMode()` + `RootClient` | theming qua CSS var |
| `Layout/Header/Content/Footer` + `Menu` ngang + `Drawer` | `header.app-navbar` + `Link` + `Drawer` | `Menu` vn-dylan chỉ dọc |
| `Button type="primary"` / `type="text"` / `danger` | `variant="solid"` / `variant="plain"` / `className="btn-danger"` | không có `href` → bọc thẻ `a` |
| `Card` (children) | `Card` | class app trên gốc `.dyl-card`; padding thân qua `X > .dyl-card__body` |
| `Input` / `Input.TextArea` | `Input` / `Input textArea rows` | `status="error"` → `invalid` |
| `Select` (value=string) | `Select` (value=`SelectOption\|null`) | helper `opt`/`selected`; `isClearable={false}` |
| `Progress strokeColor/status` | `Progress strokeClass` | `progress-warn/-danger/-success` |
| `Table` column-driven + sorter | `Table.THead/TBody/Tr/Th/Td` primitive | JobTracker render `tableRows` thủ công, `Th sortable sortDirection onSort` |
| `Timeline items` | `Timeline` + `Timeline.Item` | |
| `Dropdown menu={{items}}` | `Dropdown` + `renderTitle` + `Dropdown.Item` (UserMenu); PlatformDropdown → popover controlled tự dựng | |
| `Popconfirm` | `InlineConfirm` / state `confirmDelete*Id` | |
| `Tag style` | `Tag className` | `tag-purchased/-pending` |
| `App.useApp().message` | `toast.push` | |
| `Row`/`Col` gutter | `div` + class grid sẵn có | `.summary-grid`, `.priority-grid`, `.service-grid`, `.module-grid`, `.product-roadmap`, `.targets` |
| `@ant-design/icons` | `lucide-react` | |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| US-023 | Supersedes (UI) | Thay toàn bộ nền antd của US-023 bằng `@vn-dylan/ui`; giữ nguyên cấu trúc `AppShell` bọc mọi `*View` |
| US-022 | Impacts | `components/BudgetApp.tsx` — nguồn thu / insight tab Thu chi: chỉ đổi component, logic giữ |
| US-017 | Impacts | Bảng danh mục/nguồn thu kéo-thả — giữ thẻ `table` HTML, chỉ đổi `Input`/`Button` bên trong |
| US-018/US-020/US-021 | Impacts | `JobTrackerBoard` bảng CV → `Table` primitive vn-dylan, giữ sort/inline-edit/add/xóa/đọc link |
| US-002 | Related only | `AppShell` — điều hướng qua navbar chung |

## 7. Verification

| Lệnh | Kết quả | Ngày |
| --- | --- | --- |
| `npx tsc --noEmit` | Pass (0 lỗi) | 2026-09-09 |
| `npx next build` | Pass — "Compiled successfully", 7 route; First Load JS `/budget` ~142 kB (barrel không phình nhờ `optimizePackageImports`) | 2026-09-09 |
| `next lint` / test | N/A — dự án chưa có eslint config / test suite | 2026-09-09 |
| Smoke thủ công `chrome-devtools`, Host `plan.localhost:3000` (bypass auth dev) | Pass — xem §7.1 | 2026-09-09 |

### 7.1. Đối chiếu yêu cầu (smoke 2026-09-09)

| Yêu cầu | Kết quả | Bằng chứng |
| --- | --- | --- |
| Thay toàn bộ component sang `@vn-dylan/ui` | Đạt | `grep "from \"antd\"\|@ant-design"` trong `app/` `components/` = 0; `pnpm ls antd` = không có |
| Layout chuẩn, menu lên navbar | Đạt | `/`, `/roadmap`, `/budget`, `/timetable`, `/freelance`, `/product` cùng `header.app-navbar` với 6 link inline + `active` đúng theo route |
| Điện thoại (≤900px) | Đạt | 390px: link inline ẩn, nút ba gạch → `Drawer` "Điều hướng" đủ 6 link + "Đổi giao diện"; lưới xuống 1 cột |
| Icon/favicon lấy của portfolio | Đạt | `metadata.icons.icon = "/favicon.svg"` (ô bo góc nền tối, chữ D vàng chanh); logo navbar + badge signin style theo portfolio |
| Sáng/tối | Đạt | Nút navbar toggle → class `.dark` trên `html` + `localStorage["dyl-color-mode"]`; reload giữ; đổi tức thì không nạp lại |
| JobTracker giữ hành vi | Đạt | "Thêm job" → hàng nháp (Company/Date/Platform/Link/Status/Note + nút lưu/hủy); header cột sắp xếp `Th sortable`; `Select` trạng thái (pill màu); Platform dropdown mở/chọn/thêm/xóa; xóa job → xác nhận inline |
| BudgetApp giữ hành vi | Đạt | `Select` tháng/tạo tháng/loại/danh mục nhận diện; `Progress` "Mức sử dụng thu nhập" đổi màu theo ngưỡng; `Tag` trạng thái mua sắm; `InlineConfirm` xóa giao dịch; xuất JSON; kéo-thả danh mục |
| Hydration | Sạch | Console `/` và `/budget` = 0 error sau khi thêm `mounted` guard + `suppressHydrationWarning` |

### 7.2. Review round

Chưa chạy `ssr-review` (yêu cầu đến từ hội thoại trực tiếp, không qua pipeline). Verify tự thực hiện
qua build + smoke chrome-devtools ở trên.

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| `JobTrackerBoard` `Table` primitive hồi quy sort/inline-edit/xóa | Cao | Revert `components/JobTrackerBoard.tsx` (file độc lập) |
| `Select` đổi ngữ nghĩa value gây sót call site | Trung bình | helper `opt`/`selected` dùng chung; revert từng file |
| Barrel `@vn-dylan/ui` kéo apexcharts/tiptap khi SSR | Trung bình | `optimizePackageImports`; nếu vẫn lỗi thêm `transpilePackages` (đã có) |
| FOUC dark mode | Thấp | script inline trong phần `head`; revert `app/layout.tsx` |
| CSS bám cấu trúc DOM antd còn sót | Thấp | alias `--dyl-*` giữ phần lớn; revert `app/globals.css` |
| Prisma `$transaction` lỗi dưới pnpm | Trung bình (không do US-024) | `serverExternalPackages` trong `next.config.mjs` |

Rollback tổng: `git revert` commit US-024 — mọi thay đổi nằm ở tầng UI + config, không có migration.

## 9. Kiến Trúc Áp Dụng

Bounded context: không áp dụng (US-024 thuần UI, không chạm `server/` bounded-context nào). Cấu trúc
`architecture/` chưa khởi tạo cho dự án (`docs/memory/judgement-log.md#jdg-005`).

| Pattern | Dùng ở lớp/lát cắt nào | Lệch pattern (lý do) |
| --- | --- | --- |
| "Khung `AppShell` dùng chung bọc mọi `*View`" (từ US-002/US-023) | UI shell | Không — giữ khung, đổi nền component |
| "Theming qua CSS custom properties + class `.dark`" (mới, thay `ConfigProvider`) | root layout + `globals.css` | Không |
| "Helper adapter cho API component đổi ngữ nghĩa" (`opt`/`selected`/`InlineConfirm`) | `components/shared/ui.tsx` | Mới — gom điểm khác biệt antd↔vn-dylan về một nơi |
