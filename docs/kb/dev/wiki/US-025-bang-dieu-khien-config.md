---
status: Active
feature: US-025
updated: 2026-09-09 (GĐ1 density + GĐ2 menu + GĐ3 roadmap/timetable — implemented trực tiếp, không qua ssr-pipeline)
plan: C:/Users/Admin/.claude/plans/encapsulated-sparking-peach.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-025", "Config Panel (DEV)", "Bảng điều khiển tuỳ biến"]
---

# US-025 — Bảng điều khiển tuỳ biến app (DEV)

Status: Active
Feature: US-025-bang-dieu-khien-config
Updated: 2026-09-09
Owner: ssr-plan

Nút bánh răng trên header mở Drawer trượt phải cho người dùng tự tuỳ biến app.
Triển khai 3 giai đoạn — **cả 3 đã implemented**.

## 1. Tổng Quan Kỹ Thuật

| GĐ | Nội dung | Lưu trữ |
| --- | --- | --- |
| 1 | Mật độ hiển thị (compact / comfortable / spacious) | localStorage `dylan-plan-density` + attribute `data-density` trên phần tử `html` |
| 2 | Thứ tự + ẩn/hiện mục sidebar (nhóm cha & section con) | DB — model `NavPref`, bounded context `server/config` |
| 3 | Sửa dữ liệu Roadmap timeline (giai đoạn + đầu ra) + Timetable (dòng lịch) | DB — model `RoadmapPhase` / `RoadmapDeliverable` / `TimetableRow`, cùng bounded context `server/config` |

## 2. Luồng End-To-End

**GĐ1 (density):** `app/layout.tsx` `DENSITY_INIT` đọc localStorage đặt `data-density` trước hydrate → CSS `:root[data-density=…]` lật biến `--app-*` → `useDensity` giữ state ở client, `setDensity` ghi lại localStorage + attribute.

**GĐ2 (menu):**
1. `app/(app)/layout.tsx` (server, dynamic) gọi `getNavConfig()` → `ensureDefaultNavPrefs()` (seed lười, `$transaction` count+createMany) → `findAll()` trả `NavPref[]`.
2. `AppShell` nhận prop `navPrefs` → `applyNavPrefs(navGroups, navPrefs)` (sort + filter theo `order`/`hidden`) → dựng sidebar + Drawer + truyền xuống `ConfigDrawer`.
3. Trong `NavConfigEditor`, bấm ▲▼ hoặc `Switcher` → server action (`reorderNav` / `setNavVisibility` / `resetNavConfig`) → `revalidatePath("/", "layout")` → `router.refresh()` → layout chạy lại → sidebar cập nhật. Lỗi → toast + `router.refresh()` rollback.
4. `currentMeta(pathname)` luôn tra trên `navGroups` đầy đủ nên route của nhóm đang ẩn vẫn cho tiêu đề header đúng khi mở trực tiếp.

## 3. Bản Đồ Source

**GĐ1:**
- `components/shared/useDensity.ts` — hook kiểu `useDarkMode`.
- `app/layout.tsx` — thêm script `DENSITY_INIT`.
- `app/globals.css` — biến `--app-*` trong `:root` + block `:root[data-density="compact"]` / `["spacious"]`; ~14 rule đổi literal sang `var(--app-*)`.
- `components/shared/ConfigDrawer.tsx` — Drawer phải + Tabs (Hiển thị / Menu) + Segment density.
- `components/shared/AppShell.tsx` — nút `Settings2` + render Drawer config.

**GĐ2:**
- `lib/nav-registry.ts` — cấu trúc nav thuần dữ liệu: `NAV_GROUP_IDS`, `NAV_CHILD_HREFS`, `defaultNavPrefSeeds()`, `resolveReorderScope()`, `groupPrefId`/`leafPrefId`, `ALL_NAV_PREF_IDS`, type `NavPref`.
- `components/shared/nav.ts` — `id` cho mỗi `NavGroup`; `applyNavPrefs(groups, prefs)`; `activeGroup(pathname, groups?)`.
- `server/config/` — bounded context mới (mẫu `server/job-tracker`):
  - `domain/entities/nav-pref.ts`
  - `domain/repositories/nav-pref-repository.ts`
  - `domain/services/default-nav-prefs-service.ts`
  - `domain/rules/nav-reorder-rule.ts`
  - `application/use-cases/{get-nav-config,reorder-nav,set-nav-visibility,reset-nav-config}.ts`
  - `infrastructure/repositories/nav-pref-prisma-repository.ts`
  - `actions.ts` (composition root)
- `app/(app)/layout.tsx` — `async` + `export const dynamic = "force-dynamic"`.
- `components/shared/NavConfigEditor.tsx` — editor client (▲▼ + Switcher + reset).

**GĐ3:**
- `lib/roadmap-defaults.ts` — chuyển `roadmapPhases` + helper (`ROADMAP_YEAR`, `parsePhaseRange`, `resolveActivePhase`, `PHASE_STATE_LABEL`) ra khỏi `PlanViews.tsx`; type `RoadmapPhaseView`/`RoadmapDeliverableView`.
- `lib/timetable-defaults.ts` — chuyển `weekRows` + `scheduleClass`; `TIMETABLE_DAY_KEYS`/`TIMETABLE_DAY_HEADERS`; type `TimetableRowView`.
- `lib/array-move.ts` — helper đổi chỗ phần tử cho các editor.
- `components/PlanViews.tsx` — `RoadmapTimelineSection({ phases })`, `TimetableSection({ rows })`, `CurrentStatusSection({ phases })` (default = `DEFAULT_*`).
- `app/(app)/roadmap/timeline/page.tsx`, `app/(app)/timetable/page.tsx`, `app/(app)/page.tsx` — `dynamic` + `await getRoadmapConfig()/getTimetableConfig()` truyền prop.
- `server/config/` — mở rộng cùng bounded context:
  - `domain/entities/{roadmap,timetable}.ts`, `domain/repositories/{roadmap,timetable}-repository.ts`
  - `domain/services/{default-roadmap,default-timetable}-service.ts` (`ensureDefault*` + `reset*`)
  - `domain/rules/{roadmap-date-range,exact-reorder}-rule.ts`
  - `application/use-cases/` — `get-roadmap-config`, `upsert-roadmap-phase`, `delete-roadmap-phase`, `reorder-roadmap-phases`, `upsert-deliverable`, `delete-deliverable`, `reorder-deliverables`, `reset-roadmap-config`; `get-timetable-config`, `upsert-timetable-row`, `delete-timetable-row`, `reorder-timetable-rows`, `reset-timetable-config`
  - `infrastructure/repositories/{roadmap,timetable}-prisma-repository.ts`
  - `actions.ts` — thêm export cho toàn bộ trên
- `app/(app)/layout.tsx` — fetch thêm `getRoadmapConfig()` + `getTimetableConfig()` (`Promise.all`), truyền qua `AppShell` → `ConfigDrawer`.
- `components/shared/{RoadmapConfigEditor,TimetableConfigEditor}.tsx` — editor client: sửa field lưu on-blur (`upsert*` + `router.refresh()`), ▲▼ reorder, thêm/xoá, "Khôi phục mặc định".
- `components/shared/ConfigDrawer.tsx` — thêm 2 tab "Roadmap" + "Lịch tuần".

## 4. Prisma Schema Và Migration

```prisma
model NavPref {
  id     String  @id
  order  Int     @default(0)
  hidden Boolean @default(false)
  updatedAt DateTime @updatedAt
  @@index([order])
}
```
GĐ3: `RoadmapPhase` / `RoadmapDeliverable` (FK `phaseId`, `onDelete: Cascade`) / `TimetableRow`
(7 cột `mon`..`sun`). Migration `20260909142811_add_roadmap_timetable_config` — thuần `CREATE TABLE` + `CREATE INDEX`.

Migrations: `20260909141127_add_nav_pref`, `20260909142811_add_roadmap_timetable_config`.
Delta chi tiết: `docs/features/US-025-bang-dieu-khien-config/data-model.md`.
DBML: `docs/db/schema.dbml`.

## 5. Contract

- `getNavConfig()` trả `NavPrefEntity[]` — mảng `{ id, order, hidden }`.
- `reorderNav({ orderedIds: string[] })` — `orderedIds` phải là hoán vị đầy đủ của một cấp anh em (toàn `group:` hoặc toàn `leaf:` của cùng một nhóm); sai → `ReorderNavError`.
- `setNavVisibility({ id, hidden })` — `id` phải thuộc `ALL_NAV_PREF_IDS`; sai → `SetNavVisibilityError`.
- `resetNavConfig()` — xoá hết + seed lại mặc định.
- Format id: `group:` cộng groupId (`overview|roadmap|timetable|freelance|product|budget`), hoặc `leaf:` cộng href section con.

GĐ3 (server actions từ `server/config/actions.ts`):
- `getRoadmapConfig()` trả `RoadmapPhaseEntity[]` (`{ id, dateRange, label, title, desc, deliverables[] }`, đã sắp order).
- `upsertRoadmapPhase({ id?, dateRange, label, title, desc })` — không id → tạo mới cuối danh sách. `dateRange` sai format → `UpsertRoadmapPhaseError`.
- `deleteRoadmapPhase(id)` — chặn nếu chỉ còn 1 phase. `reorderRoadmapPhases({ orderedIds })` — hoán vị đầy đủ.
- `upsertDeliverable({ id?, phaseId, title, desc })` / `deleteDeliverable(id)` / `reorderDeliverables({ phaseId, orderedIds })`.
- `resetRoadmapConfig()` — về `lib/roadmap-defaults.ts`.
- `getTimetableConfig()` trả `TimetableRowEntity[]`. `upsertTimetableRow({ id?, timeLabel, mon..sun })`, `deleteTimetableRow(id)` (chặn nếu còn 1), `reorderTimetableRows({ orderedIds })`, `resetTimetableConfig()`.
- Mutation roadmap → `revalidatePath("/roadmap/timeline")` + `revalidatePath("/")`. Mutation timetable → `revalidatePath("/timetable")`.

## 6. Liên Kết Function

- Nền tảng: US-024 (design system `@vn-dylan/ui`) + fix layout header/footer cố định trước đó — `AppShell`, `.app-topbar`.
- Dùng lại mẫu: US-017 (kéo thả sắp xếp danh mục — cùng contract `reorder` = `$transaction(update order=index)`), US-018 (bounded context `server/job-tracker` — `createDefaultsIfEmpty` seed lười).
- GĐ3: `roadmapPhases` / `weekRows` (từ `components/PlanViews.tsx`) → `lib/*-defaults.ts`; `resolveActivePhase` giờ nhận `phases` param; section components nhận props từ route page (mẫu `roadmap/jobs/page.tsx`).

## 7. Verification

- `npx tsc --noEmit` — No errors. `npx next lint` — 0 error / 0 warning. `npm run build` — 25 route compile OK.
- `prisma migrate dev` — 2 migration applied; `prisma generate` OK.
- **GĐ1 (density)**: chọn Gọn/Thoáng → toàn app co/giãn tức thì; reload giữ (attr đặt trước hydrate, không nháy). Dark + light đều đúng.
- **GĐ2 (menu)**: seed đúng thứ tự cũ; ẩn "Sản phẩm" → mất khỏi sidebar, `/product/scope` vẫn vào trực tiếp, header title vẫn đúng, reload giữ; kéo "Freelance" lên → sidebar đổi thứ tự, reload giữ; "Khôi phục mặc định" → về nguyên trạng. Không lỗi console.
- **GĐ3 (roadmap/timetable)**: seed đúng (kiểm DB trực tiếp: 4 phase / 20 deliverable / 7 row); `/`, `/roadmap/timeline`, `/timetable` render HTTP 200 khớp seed. Editor round-trip trong browser **chưa verify lại** — dev env mất ổn định do process `pnpm build` bên ngoài (IDE) liên tục xoá `.next`; cần user mở tab "Roadmap" / "Lịch tuần" để kiểm.

## 8. Rủi Ro Và Rollback

- `app/(app)/layout.tsx` thành `dynamic` → mọi trang trong group là SSR động (đã kiểm hydration OK, nhiều trang vốn đã `force-dynamic`).
- Ẩn/hiện KHÔNG chặn route — chỉ tác động render menu.
- Rollback GĐ2: `DROP TABLE "NavPref"` + gỡ model + revert `layout.tsx` / `AppShell` / `nav.ts` về không nhận `navPrefs`. `applyNavPrefs([], …)` giữ nguyên thứ tự gốc nên gỡ mềm cũng an toàn.
- Rollback GĐ3: `DROP TABLE` 3 bảng + gỡ model + revert route pages / `PlanViews` về không nhận props. Section components default prop = `DEFAULT_*` (từ `lib/*-defaults.ts`) nên gỡ mềm vẫn render đúng dữ liệu cũ.
- Rollback GĐ1: gỡ script `DENSITY_INIT`, `useDensity`, biến `--app-*` (hoặc để nguyên — mặc định `comfortable` = giá trị `:root` cũ).
- Save on-blur mỗi field → `router.refresh()` mỗi lần blur (chấp nhận round-trip nhẹ cho panel config); `useEffect([phases])` re-sync draft từ server.

## 9. Kiến Trúc Áp Dụng

- Hexagonal / DDD per bounded context (`server/config/{domain,application,infrastructure}` + composition root `actions.ts`) — đúng khuôn `server/job-tracker`, `server/budget`.
- Route / client component chỉ import từ `server/config/actions.ts`, không chạm `domain/` hay `infrastructure/`.
- Nội dung menu giữ ở code (registry tĩnh), DB chỉ lưu preference `{ id, order, hidden }` — icon (component React) và `match` (hàm) không serialize được.
- Reorder: contract "mảng id đã sắp" → `order = index` trong `$transaction` (mẫu US-017).
- Seed lười idempotent qua `createDefaultsIfEmpty` bọc `$transaction` (mẫu US-018, tránh race nhiều request đọc layout).
