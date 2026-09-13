# Bảng điều khiển tuỳ biến (Config Panel) — Data Model Delta

Status: Applied
Feature: US-025-bang-dieu-khien-config (GĐ2 — menu; GĐ3 — roadmap + timetable)
Prisma Schema: prisma/schema.prisma (NavPref, RoadmapPhase, RoadmapDeliverable, TimetableRow)
DBML: docs/db/schema.dbml

Migrations: `20260909141127_add_nav_pref` (GĐ2), `20260909142811_add_roadmap_timetable_config` (GĐ3).

## 1. Thay Đổi Model

Thêm **một** model mới `NavPref` — lưu preference điều hướng (thứ tự + ẩn/hiện) cho
từng mục sidebar. Không sửa/không quan hệ với model nào khác.

Nội dung menu (label, icon, route, `match`) VẪN nằm trong code
(`components/shared/nav.ts` + `lib/nav-registry.ts`). DB chỉ giữ 3 trường/1 dòng.

`id` là khoá do app đặt:
- `"group:" + groupId` — nhóm cha (groupId ∈ `overview|roadmap|timetable|freelance|product|budget`)
- `"leaf:" + href` — section con (vd `leaf:/roadmap/timeline`)

## 2. Prisma Schema Delta

```prisma
model NavPref {
  id     String  @id
  order  Int     @default(0)
  hidden Boolean @default(false)

  updatedAt DateTime @updatedAt

  @@index([order])
}
```

## 3. Migration SQLite

Thuần `CREATE TABLE` + `CREATE INDEX` (không rebuild bảng):

```sql
CREATE TABLE "NavPref" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "NavPref_order_idx" ON "NavPref"("order");
```

Lệnh: `./node_modules/.bin/prisma migrate dev --name add_nav_pref` → `prisma generate`.
(`rtk`/`npx` không resolve được `prisma` trong repo này — dùng `.bin` trực tiếp.)

## 4. Ràng Buộc SQLite

- Không enum/CHECK: `id` chỉ nhận giá trị hợp lệ nhờ luật tầng ứng dụng
  (`ALL_NAV_PREF_IDS` trong `lib/nav-registry.ts`; `set-nav-visibility.ts` chặn id lạ;
  `nav-reorder-rule.ts` bắt buộc danh sách reorder khớp đúng một cấp anh em).
- `order` có thể trùng giữa hai cấp khác nhau (nhóm cha vs con trong nhóm) — không sao,
  `applyNavPrefs` sort theo từng phạm vi riêng.
- Không cột NOT NULL nào cần backfill (bảng tạo rỗng, seed sau).

## 5. Đồng Bộ DBML

Đã thêm `Table NavPref` vào `docs/db/schema.dbml` + cập nhật dòng "Cập nhật lần cuối".

## 6. Backfill Và Rollback

- **Seed**: lười, tầng ứng dụng — `getNavConfig` gọi `ensureDefaultNavPrefs()` ở dòng đầu;
  repo `createDefaultsIfEmpty` bọc `count + createMany` trong 1 `$transaction` (mẫu
  `JobPlatform`, tránh race khi nhiều request đọc layout). Không có script backfill.
- **Reset về mặc định**: `resetNavConfig()` → `deleteMany` + `createMany(defaultNavPrefSeeds())`.
- **Rollback migration**: `DROP TABLE "NavPref"` + gỡ model. App tự về menu tĩnh
  (`applyNavPrefs` với `prefs = []` giữ nguyên thứ tự gốc, không ẩn gì).
- Backup trước migration: `prisma/backups/dev.db.US-025-add_nav_pref.20260909211110.bak`.

## 7. Verification

| Kiểm tra | Kết quả |
| --- | --- |
| `prisma format` / `validate` | Pass |
| `prisma migrate dev --name add_nav_pref` | Applied `20260909141127_add_nav_pref` |
| `prisma generate` | OK (7.9.1) |
| `npx tsc --noEmit` | No errors |
| `npx next lint` | 0 errors / 0 warnings |
| Seed lần đầu | `getNavConfig` tạo đủ dòng, sidebar giữ đúng thứ tự/nội dung cũ |
| Ẩn nhóm "Sản phẩm" | Mất khỏi sidebar; `/product/scope` vẫn vào trực tiếp được; header title vẫn đúng |
| Kéo "Freelance" lên | Sidebar đổi thứ tự sau `router.refresh()`, reload vẫn giữ |
| "Khôi phục mặc định" | Về đúng 6 nhóm + thứ tự gốc |

---

## GĐ3 — RoadmapPhase / RoadmapDeliverable / TimetableRow

### Model changes
3 model mới, độc lập mọi bảng khác. `RoadmapDeliverable` thuộc `RoadmapPhase`
(FK `phaseId`, `onDelete: Cascade`). Không sửa model cũ.

```prisma
model RoadmapPhase {
  id String @id @default(cuid())
  order Int @default(0)
  dateRange String   // "DD/MM-DD/MM", năm 2026 cố định
  label String
  title String
  desc  String
  deliverables RoadmapDeliverable[]
  updatedAt DateTime @updatedAt
  @@index([order])
}
model RoadmapDeliverable {
  id String @id @default(cuid())
  phaseId String
  order Int @default(0)
  title String
  desc  String
  phase RoadmapPhase @relation(fields: [phaseId], references: [id], onDelete: Cascade)
  @@index([phaseId, order])
}
model TimetableRow {
  id String @id @default(cuid())
  order Int @default(0)
  timeLabel String
  mon String  tue String  wed String  thu String  fri String  sat String  sun String
  updatedAt DateTime @updatedAt
  @@index([order])
}
```

### Migration SQLite
`20260909142811_add_roadmap_timetable_config` — thuần `CREATE TABLE` (3) + `CREATE INDEX` (3).
`RoadmapDeliverable` có `CONSTRAINT ... FOREIGN KEY ... ON DELETE CASCADE`.

### Ràng buộc SQLite
- `dateRange` không CHECK — validate bởi `roadmap-date-range-rule.ts` (`assertValidDateRange`,
  regex `DD/MM-DD/MM` + `parsePhaseRange` parse được + end ≥ start).
- Xoá phase/dòng cuối cùng bị chặn ở use-case (`delete-roadmap-phase.ts`, `delete-timetable-row.ts`)
  — phải giữ ≥ 1.
- 7 cột ngày NOT NULL — seed luôn cấp đủ, editor gửi cả 7 (chuỗi rỗng cho phép).

### DBML sync
Đã thêm `Table RoadmapPhase` / `RoadmapDeliverable` / `TimetableRow` vào `docs/db/schema.dbml`.

### Backfill & rollback
- Seed lười: `getRoadmapConfig` / `getTimetableConfig` gọi `ensureDefault*()` ở dòng đầu →
  repo `createDefaultsIfEmpty` bọc `$transaction`. Nguồn: `lib/roadmap-defaults.ts` /
  `lib/timetable-defaults.ts` (chuyển ra từ `components/PlanViews.tsx`).
- Reset: `resetRoadmapConfig()` / `resetTimetableConfig()` → `deleteAll` + `seed`.
- Rollback: `DROP TABLE` (3) + gỡ model + revert `PlanViews`/route pages về không nhận props.
  Section components default prop = `DEFAULT_*` nên gỡ mềm cũng render đúng.
- Backup: `prisma/backups/dev.db.US-025-add_roadmap_timetable.20260909212756.bak`.

### Verification (GĐ3)
| Kiểm tra | Kết quả |
| --- | --- |
| `prisma migrate dev --name add_roadmap_timetable_config` | Applied |
| `prisma generate` | OK |
| `npx tsc --noEmit` / `npx next lint` | No errors / 0 warning |
| `npm run build` | Toàn bộ 25 route compile OK |
| Seed lần đầu (kiểm DB trực tiếp) | 4 RoadmapPhase (đúng order/dateRange/title), 20 RoadmapDeliverable, 7 TimetableRow |
| `/`, `/roadmap/timeline`, `/timetable` render | HTTP 200, nội dung khớp seed (đọc từ DB) |
| Editor round-trip trong browser | Verify lại 2026-09-13 qua Chrome DevTools MCP (`plan.localhost:3000`): sửa 1 ô ở tab Roadmap (`Tên đầu ra`) và 1 ô ở tab Lịch tuần (`T2`), blur → reload → giá trị mới còn nguyên trên `/roadmap/timeline` và `/timetable`; không lỗi console; khôi phục lại giá trị gốc sau khi verify |
