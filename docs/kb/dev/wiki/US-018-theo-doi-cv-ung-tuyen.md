---
status: Active
feature: US-018
updated: 2026-08-13 (implemented)
plan: docs/features/US-018-theo-doi-cv-ung-tuyen/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-018", "Bảng theo dõi CV ứng tuyển (DEV)"]
---

# US-018 — Bảng theo dõi CV ứng tuyển tại trang Roadmap (DEV)

Status: Active
Feature: US-018
Updated: 2026-08-13 (implemented — `task.md` Status: Implemented)
Plan: `docs/features/US-018-theo-doi-cv-ung-tuyen/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Bounded context mới `server/job-tracker/`, Light DDD 3 lớp đúng khuôn `server/budget/` đã có, hoàn toàn độc lập với nó. 2 model Prisma mới (`JobApplication`, `JobPlatform`), route entry là trang gốc `/` (`app/page.tsx`, không phải `/budget`). UI là Client Component mới `components/JobTrackerBoard.tsx`, chèn vào `RoadmapSections()` trong `components/DylanPlanApp.tsx`. Điểm kỹ thuật khác biệt: dropdown "Platform" cần tự dựng (không dùng thẻ `select` gốc) vì phải hỗ trợ thêm/xóa option ngay trong ô chọn — thẻ `select`/`option` gốc không có chỗ đặt nút xóa cạnh option.

## 2. Luồng End-To-End

```text
app/page.tsx (Server Component, async) -> getJobTrackerSnapshot()
  -> Không có Auth (DEC-004)
  -> Validate: inline trong use-case (company/deadline/platformId không rỗng, job-link-rule cho Link)
  -> application/use-cases/{get-job-tracker-snapshot, upsert-job-application, delete-job-application, create-job-platform, delete-job-platform}.ts
  -> domain/services/{job-platform-guard-service, default-job-platforms-service}.ts (chỉ 2 hành vi phối hợp nhiều entity)
  -> domain/repositories/{job-application-repository, job-platform-repository}.ts (interface)
     -> infrastructure/repositories/{job-application-prisma-repository, job-platform-prisma-repository}.ts (implementation)
  -> lib/prisma.ts -> SQLite (model JobApplication, JobPlatform)
  -> revalidatePath("/") -> components/JobTrackerBoard.tsx gọi lại snapshot, cập nhật state
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `app/page.tsx`, `components/DylanPlanApp.tsx`, `components/JobTrackerBoard.tsx` | Server Component (đọc ban đầu) + Client Component (mọi tương tác) |
| Auth | Không có | Single-user, không đăng nhập/phân quyền (`DEC-004`) |
| Application | `server/job-tracker/application/use-cases/*.ts` | Thêm/sửa/xóa job, thêm/xóa option Platform, đọc snapshot |
| Domain | `server/job-tracker/domain/services/job-platform-guard-service.ts`, `.../default-job-platforms-service.ts`, `.../rules/job-link-rule.ts` | Chặn xóa Platform đang dùng (`BR-021`), ensure-default 3 option, validate Link |
| Infrastructure | `server/job-tracker/infrastructure/repositories/*.ts` | `JobApplication`, `JobPlatform` |
| Data | `prisma/schema.prisma` | Model `JobApplication`, `JobPlatform` — `ssr-data` thêm |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Page | `app/page.tsx` | Server Component `async`, gọi `getJobTrackerSnapshot()`, render `DylanPlanApp` |
| Component | `components/DylanPlanApp.tsx` | Nhận/truyền prop `initialJobTracker`; `RoadmapSections` chèn `JobTrackerBoard` sau section `id="roadmap"` |
| Component (mới) | `components/JobTrackerBoard.tsx` | Toàn bộ UI bảng: form thêm job, inline-edit từng cột, dropdown Platform tùy biến, xác nhận xóa, click-to-sort |
| Server Action (mới) | `server/job-tracker/actions.ts` | Composition root — 6 hàm export |
| Use-case (Application) | `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts` | Đọc toàn bộ job + platform, gọi ensure-default trước |
| Use-case (Application) | `server/job-tracker/application/use-cases/upsert-job-application.ts` | Tạo mới hoặc sửa từng trường (AC-01, AC-05, AC-11) |
| Use-case (Application) | `server/job-tracker/application/use-cases/delete-job-application.ts` | Xóa một job |
| Use-case (Application) | `server/job-tracker/application/use-cases/create-job-platform.ts` | Tạo option Platform mới |
| Use-case (Application) | `server/job-tracker/application/use-cases/delete-job-platform.ts` | Gọi guard rồi xóa option Platform |
| Domain service | `server/job-tracker/domain/services/job-platform-guard-service.ts` | `assertJobPlatformNotInUse` — `BR-021` |
| Domain service | `server/job-tracker/domain/services/default-job-platforms-service.ts` | `ensureDefaultJobPlatforms` — 3 option mặc định |
| Domain rule/entity | `server/job-tracker/domain/rules/job-link-rule.ts` | `assertValidJobLink` — `DEC-086` |
| Domain rule/entity | `server/job-tracker/domain/entities/job-application.ts`, `.../job-platform.ts` | `JobApplicationEntity`, `JobPlatformEntity` |
| Repository (Infrastructure) | `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` | Implement `JobApplicationRepository` |
| Repository (Infrastructure) | `server/job-tracker/infrastructure/repositories/job-platform-prisma-repository.ts` | Implement `JobPlatformRepository`, gồm `createDefaultsIfEmpty` (đếm + `createMany` trong cùng `prisma.$transaction` — sửa race condition thật, `DEC-091`) |
| UI (mới) | `components/JobTrackerBoard.tsx` | Client Component: `JobRow`/`DraftJobRow` (inline edit), `PlatformDropdown` (tự dựng, không dùng `select` gốc), `StatusSelect`, sort client-side qua state `{ column, direction }`, xác nhận xóa qua state `confirmDeleteJobId` |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `JobApplication` (mới) | `id`, `company`, `deadline`, `platformId`, `link`, `status` (default `"Interested"`), `note` (nullable), `createdAt`, `updatedAt` | `@@index([platformId])` | `platform JobPlatform @relation(fields: [platformId], references: [id], onDelete: Restrict)` |
| `JobPlatform` (mới) | `id`, `name`, `createdAt` | Không cần thêm | `jobApplications JobApplication[]` |

- Migration liên quan: `prisma/migrations/20260813110324_add_job_tracker/migration.sql` — đã áp dụng (2026-08-13), backup trước tại `prisma/backups/dev.db.us-018-before-job-tracker.20260813180307.bak`. Chỉ gồm `CREATE TABLE`/`CREATE INDEX`, không `RedefineTables` (bảng mới, không dữ liệu cũ).
- DBML đã đồng bộ: Có — `docs/db/schema.dbml` (thủ công, dự án không có generator DBML).
- Lưu ý SQLite: 2 bảng hoàn toàn mới (`JobApplication`, `JobPlatform`), không có dữ liệu cũ cần backfill, migration chỉ gồm `CREATE TABLE`/`CREATE INDEX`. `status` dùng `String` + validate tầng ứng dụng (không có enum gốc trong SQLite, đúng mẫu `Category.type`/`BR-019`). `platformId` có `onDelete: Restrict` làm lớp bảo vệ dự phòng ở DB cho `BR-021`, nhưng đường xử lý chính là `job-platform-guard-service.ts` kiểm tra trước để trả lỗi nghiệp vụ thân thiện. 3 dòng `JobPlatform` mặc định **không** tạo bằng migration data-only — xử lý ở tầng application (`ensureDefaultJobPlatforms`, ensure-default kiểm tra `count() === 0`), vì hook `guard-artifact-path` từng chặn sửa tay `migration.sql` cho thay đổi data-only tương tự ở US-016 (`JDG-018`, khái quát hóa thành `JDG-023`).

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `JobTrackerSnapshot` (mới) | `{ jobs: JobApplicationEntity[], platforms: JobPlatformEntity[] }` | `app/page.tsx`, `components/JobTrackerBoard.tsx` |
| `UpsertJobApplicationInput` (mới) | `{ id?, company, deadline, platformId, link, status, note? }` | `components/JobTrackerBoard.tsx` |
| `server/job-tracker/actions.ts` (mới) | 6 hàm: `getJobTrackerSnapshot`, `createJobApplication`, `updateJobApplication`, `deleteJobApplication`, `createJobPlatform`, `deleteJobPlatform` | `app/page.tsx`, `components/JobTrackerBoard.tsx` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| Không có | — | US-018 độc lập hoàn toàn với `server/budget/**` và mọi function `US-001`..`US-017` (`DEC-088`) |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk npx prisma validate` | Passed | 2026-08-13 |
| `rtk npx prisma migrate dev --name add_job_tracker` | Passed | 2026-08-13 |
| `rtk tsc --noEmit` | Failed — 2 lỗi ở `components/BudgetApp.tsx:911`, **không liên quan** US-018 (lỗi có sẵn trước migration, xem `JDG-024`); không có lỗi nào ở model/type mới của `JobApplication`/`JobPlatform` hay ở `server/job-tracker/**`/`components/JobTrackerBoard.tsx` | 2026-08-13 |
| `npx next build` | Failed — cùng lỗi có sẵn ở `BudgetApp.tsx:911` chặn build production của toàn app; `rtk next build` báo "Errors: 0" không đáng tin (`JDG-015`), `npx next build` trực tiếp báo đúng "Errors: 1". Đã tách task riêng ngoài phạm vi US-018 (`task_8ec82b68`) | 2026-08-13 |
| `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (`JDG-002`) | — |
| Thủ công đủ 11 AC trên `next dev` | Passed — AC-01..AC-11 đều Passed, xem chi tiết từng AC ở `task.md` `TB-11`. Phát hiện thêm 1 defect thật ngoài AC (race condition ở `ensureDefaultJobPlatforms`, 7 request đồng thời tạo 21 dòng `JobPlatform` thay vì 3) — đã sửa (`DEC-091`) và xác nhận lại bằng 8 request đồng thời, ổn định | 2026-08-13 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Dropdown Platform tự dựng (không dùng `select` gốc) có thể lệch hành vi bàn phím so với combobox gốc | Trung bình — chưa kiểm chứng đầy đủ hành vi bàn phím (Tab/Enter/Escape), chỉ kiểm chứng bằng chuột qua Browser tool | Xóa `components/JobTrackerBoard.tsx`, revert `app/page.tsx`, `components/DylanPlanApp.tsx` |
| Ensure-default 3 Platform tạo trùng khi có nhiều request gần như đồng thời | **Đã xảy ra thật** (không còn là rủi ro lý thuyết) — 7 request tải trang lúc dev server compile lần đầu tạo 21 dòng thay vì 3; đã sửa bằng `prisma.$transaction` atomic (`DEC-091`, `JDG-025`), xác nhận lại bằng 8 request đồng thời sau khi sửa | Đã áp dụng — không còn cần rollback thủ công cho lỗi này; nếu tái phát, xóa tay dòng trùng qua script `better-sqlite3` như đã làm khi kiểm chứng |
| Build production của toàn app đang Failed do lỗi có sẵn không liên quan (`components/BudgetApp.tsx:911`) | Trung bình — không chặn `next dev`, nhưng chặn `next build`/deploy thật cho tới khi lỗi đó được sửa | Không thuộc US-018 — theo dõi qua `task_8ec82b68` (spawn_task riêng) |
