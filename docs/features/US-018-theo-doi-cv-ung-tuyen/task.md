# Bảng theo dõi CV ứng tuyển tại trang Roadmap — Phân Rã Task

Status: Implemented
Feature: US-018
Plan: plan.md
Spec: spec.md
Created: 2026-08-13
Updated: 2026-08-13
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 11 tiêu chí chấp nhận (AC-01..AC-11), Screen Element `EL-01`..`EL-09` (mục 8.1) |
| `plan.md` | Mục 5 (luồng end-to-end), mục 7 (Impact Checklist), mục 8 (Bản Đồ Source Impact), mục 9 (đã đổi schema), mục 10 (Contract), mục 11 (File Sẽ Thay Đổi), mục 13 (Rủi Ro) |
| `data-model.md` | Xác nhận migration `20260813110324_add_job_tracker` đã `Applied` thật (2026-08-13) — không cần task migration nào nữa, chỉ cần task đọc lại xác nhận |

## 2. Breakdown Summary

- Phạm vi: Bounded context mới hoàn toàn `server/job-tracker/` (Domain: 2 entity, 2 repository interface, 1 rule, 2 service; Infrastructure: 2 Prisma repository; Application: 5 use-case; Composition root `actions.ts`); Entry (`app/page.tsx` → `async`); UI (`components/DylanPlanApp.tsx` nhận/truyền prop, `components/JobTrackerBoard.tsx` — Client Component mới, toàn bộ tương tác).
- Phụ thuộc chặn: Không — US-018 độc lập với `server/budget/**` và mọi function `US-001`..`US-017` (`DEC-088`, plan mục 6); migration đã `Applied` thật trước khi breakdown này chạy.
- Số task: 12 — tất cả `Done` (`TB-01` từ stage `data`; `TB-02`..`TB-11` triển khai qua Codex CLI — `SSR_IMPLEMENT_EXECUTOR=codex` — `ssr-dev` tự chạy lại verification/đối chiếu phạm vi; `TB-12` verification tổng hợp cuối do `ssr-dev` tự làm).
- Readiness: Implemented

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Model `JobApplication`, `JobPlatform` đã có trong `schema.prisma`, migration đã áp dụng (chỉ `CREATE TABLE`/`CREATE INDEX`, không có dữ liệu cũ cần backfill), DBML đã đồng bộ | `prisma/schema.prisma`, `prisma/migrations/20260813110324_add_job_tracker/`, `docs/db/schema.dbml` | None | Nền tảng dữ liệu cho toàn bộ AC-01..AC-11; Impact checklist "Prisma schema"/"Migration SQLite"/"DBML" = Yes | `rtk npx prisma validate` | Done | Đã chạy thật ở stage `data` (2026-08-13) — `data-model.md` mục 3, 7: migration Passed (`CREATE TABLE "JobPlatform"`, `CREATE TABLE "JobApplication"`, `CREATE INDEX "JobApplication_platformId_idx"`), `prisma generate` Passed, backup `prisma/backups/dev.db.us-018-before-job-tracker.20260813180307.bak` |
| `TB-02` | `JobApplicationEntity` (id, company, deadline, platformId, link, status, note, createdAt, updatedAt) và `JobPlatformEntity` (id, name, createdAt) — type thuần, không import Prisma | `server/job-tracker/domain/entities/job-application.ts` (mới), `server/job-tracker/domain/entities/job-platform.ts` (mới) | `TB-01` | Contract `JobTrackerSnapshot` (plan mục 10) | `rtk tsc --noEmit` | Done | Đọc lại file: đúng type thuần + `JobApplicationStatus` union 7 giá trị + hằng `JOB_APPLICATION_STATUSES`, không import Prisma (đúng R13.2). `rtk tsc --noEmit` → chỉ còn 2 lỗi có sẵn không liên quan ở `components/BudgetApp.tsx:911` (`JDG-024`, xác nhận bằng `git diff HEAD` rỗng trên file đó trước khi Codex chạy) |
| `TB-03` | Interface `JobApplicationRepository` (`findAll`, `create`, `update`, `delete`, `countByPlatform`) và `JobPlatformRepository` (`findAll`, `create`, `delete`, `count`) — chỉ khai báo thao tác thật sự dùng tới (R13.6) | `server/job-tracker/domain/repositories/job-application-repository.ts` (mới), `server/job-tracker/domain/repositories/job-platform-repository.ts` (mới) | `TB-02` | Nền tảng cho TB-05, TB-06, TB-07 | `rtk tsc --noEmit` | Done | Đọc lại file: đúng 5/4 phương thức khai báo, không thừa. Trong lúc kiểm chứng `TB-05` phát hiện cần thêm `createDefaultsIfEmpty(names)` vào `JobPlatformRepository` để sửa race condition — đã bổ sung (`DEC-091`). `rtk tsc --noEmit` → chỉ còn 2 lỗi có sẵn không liên quan |
| `TB-04` | `assertValidJobLink(link)` — throw lỗi nghiệp vụ nếu `link` không bắt đầu `http://` hoặc `https://`, không import Prisma | `server/job-tracker/domain/rules/job-link-rule.ts` (mới) | None | AC-08 | `rtk tsc --noEmit` | Done | Đọc lại file: regex `^https?:\/\//i`, throw `InvalidJobLinkError`. Kiểm chứng thật trên `next dev`: nhập "linkedin.com/jobs/123" (thiếu `http://`) → chặn lưu, thông báo đúng "Link phải bắt đầu bằng http:// hoặc https://." hiện ngay dưới ô Link (AC-08 Passed) |
| `TB-05` | `assertJobPlatformNotInUse(platformId)` (gọi `jobApplicationRepository.countByPlatform`, throw lỗi nghiệp vụ thân thiện nếu > 0 — `BR-021`) và `ensureDefaultJobPlatforms()` (tạo đúng 3 dòng "ITViec"/"LinkedIn"/"VietNamWork" khi bảng rỗng, atomic) | `server/job-tracker/domain/services/job-platform-guard-service.ts` (mới), `server/job-tracker/domain/services/default-job-platforms-service.ts` (mới) | `TB-03` | AC-03, AC-04 (`BR-021`); Impact checklist "Seed data" = Yes | `rtk tsc --noEmit` | Done | **Phát hiện lỗi thật khi kiểm chứng**: bản đầu tiên (Codex) dùng `count()` rồi lặp `create()` rời rạc — không atomic. 7 request tải trang gần như đồng thời (dev server compile chậm lần đầu, xác nhận qua log) đều đọc `count()===0` trước khi kịp ghi, tạo ra 21 dòng thay vì 3 (xác nhận bằng đọc thẳng `prisma/dev.db` qua `better-sqlite3`). Đã sửa: `default-job-platforms-service.ts` gọi `jobPlatformRepository.createDefaultsIfEmpty(names)` — đếm + `createMany` trong cùng `prisma.$transaction` (`DEC-091`, `JDG-025`). Đã xóa 21 dòng rác, xác nhận lại bằng 8 request `fetch("/")` đồng thời sau khi sửa → đúng 3 dòng, ổn định. `rtk tsc --noEmit` → chỉ còn 2 lỗi có sẵn không liên quan. AC-03 (xóa "ITViec" không dùng) và AC-04 (xóa "LinkedIn" đang dùng → chặn, toast đúng "Không thể xóa Platform \"LinkedIn\" vì đang có job sử dụng.") đều Passed trên `next dev` |
| `TB-06` | Implementation Prisma cho cả 2 repository — `job-application-prisma-repository.ts` (map `JobApplication` ↔ `JobApplicationEntity`, `countByPlatform` dùng `prisma.jobApplication.count({ where: { platformId } })`), `job-platform-prisma-repository.ts` (map `JobPlatform` ↔ `JobPlatformEntity`, `count()`/`createDefaultsIfEmpty` dùng transaction) | `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` (mới), `server/job-tracker/infrastructure/repositories/job-platform-prisma-repository.ts` (mới) | `TB-03` | AC-01..AC-06, AC-10, AC-11 (mọi thao tác đọc/ghi dữ liệu) | `rtk tsc --noEmit` | Done | Đọc lại file: `toEntity` map đúng field, `findAll` orderBy `createdAt` (desc cho job, asc cho platform), `createDefaultsIfEmpty` dùng `prisma.$transaction` (sau khi sửa `TB-05`). `rtk tsc --noEmit` → chỉ còn 2 lỗi có sẵn không liên quan. Xác nhận hành vi thật qua truy vấn trực tiếp `prisma/dev.db` ở tất cả các AC đã test (`TB-11`) |
| `TB-07` | 5 use-case: `get-job-tracker-snapshot.ts` (gọi `ensureDefaultJobPlatforms` trước, trả `{ jobs, platforms }`), `upsert-job-application.ts` (validate `company`/`deadline`/`platformId` không rỗng — AC-10, gọi `assertValidJobLink` — AC-08, có `id` thì update còn không thì create với `status` mặc định `"Interested"` khi không truyền — AC-01/AC-05/AC-11, `revalidatePath("/")`), `delete-job-application.ts`, `create-job-platform.ts`, `delete-job-platform.ts` (gọi `assertJobPlatformNotInUse` trước khi xóa — AC-03/AC-04) | `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts`, `upsert-job-application.ts`, `delete-job-application.ts`, `create-job-platform.ts`, `delete-job-platform.ts` (tất cả mới) | `TB-04`, `TB-05`, `TB-06` | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-08, AC-10, AC-11; Impact checklist "Caching/revalidate" = Yes | `rtk tsc --noEmit` | Done | Đọc lại file: `upsert-job-application.ts` validate đủ company/deadline (parse + `Number.isNaN` check)/platformId/link/status trước khi gọi repository; mọi use-case ghi đều gọi `revalidatePath("/")`. `rtk tsc --noEmit` → chỉ còn 2 lỗi có sẵn không liên quan. Toàn bộ 9 AC liên quan Passed trên `next dev` (chi tiết ở `TB-11`) |
| `TB-08` | `server/job-tracker/actions.ts` — composition root nối repository → domain service → use-case, export 6 hàm `getJobTrackerSnapshot`, `createJobApplication`, `updateJobApplication`, `deleteJobApplication`, `createJobPlatform`, `deleteJobPlatform`, re-export type `JobTrackerSnapshot`/`UpsertJobApplicationInput` | `server/job-tracker/actions.ts` (mới) | `TB-07` | Contract "server/job-tracker/actions.ts (Server Action, mới)" (plan mục 10); Impact checklist "Server Action" = Yes | `rtk tsc --noEmit` | Done | Đọc lại file: đúng 6 hàm export + re-export 4 type, wiring đúng thứ tự repository → service → use-case, đúng mẫu `server/budget/actions.ts`. `rtk tsc --noEmit` → chỉ còn 2 lỗi có sẵn không liên quan |
| `TB-09` | `app/page.tsx` chuyển thành `async function Home()`, gọi `getJobTrackerSnapshot()`, truyền `initialJobTracker` làm prop cho `DylanPlanApp` | `app/page.tsx` | `TB-08` | Contract "app/page.tsx (Server Component)" (plan mục 10); Impact checklist "App Router page/layout" = Yes | `rtk tsc --noEmit` | Done | Đọc lại file: đúng mẫu `app/budget/page.tsx`. Kiểm chứng thật: `GET /` trả 200, trang render đầy đủ dữ liệu ban đầu (3 Platform mặc định, danh sách job) không cần tương tác gì thêm |
| `TB-10` | `DylanPlanApp` nhận prop `initialJobTracker: JobTrackerSnapshot`, truyền tiếp xuống `RoadmapSections`; `RoadmapSections` nhận prop và chèn component `JobTrackerBoard` (props `initialJobs`, `initialPlatforms`) ngay sau section `id="roadmap"` (dòng ~359), trước cặp `TargetGrid` | `components/DylanPlanApp.tsx` | `TB-09` | Contract "DylanPlanApp props" (plan mục 10); `DEC-081` (vị trí chèn) | `rtk tsc --noEmit` | Done | Đọc lại file: `JobTrackerBoard` được chèn đúng ngay sau section `id="roadmap"`, trước `TargetGrid` "Tuần đầu". Kiểm chứng thật trên `next dev`: mở tab Roadmap, bảng "Theo dõi CV ứng tuyển" xuất hiện đúng vị trí — ngay dưới "Lộ trình thực hiện", trước "Kế hoạch 22/06-28/06" |
| `TB-11` | `JobTrackerBoard.tsx` — Client Component đầy đủ: bảng job (cột Công ty/Ngày hết hạn/Platform/Link/Trạng thái/Ghi chú, inline-edit từng ô theo `DEC-089`), nút "+ Thêm job", nút xóa job có xác nhận (state `confirm-delete` theo dòng, đúng pattern giao dịch trong `BudgetApp.tsx`), dropdown Platform tự dựng (chọn + ô "+ Thêm platform mới" + biểu tượng xóa từng option, hiển thị lỗi khi `deleteJobPlatform` bị chặn), tiêu đề cột click được để sắp xếp tăng/giảm (client-side, state `{ column, direction }`), toast lỗi dùng lại `components/shared/Toast.tsx` cho mọi lỗi từ Server Action (link sai định dạng, thiếu trường, lỗi mạng, chặn xóa Platform) | `components/JobTrackerBoard.tsx` (mới) | `TB-08`, `TB-10` | AC-01..AC-11; `EL-01`..`EL-09` | `rtk tsc --noEmit` | Done | `rtk tsc --noEmit` → chỉ còn 2 lỗi có sẵn không liên quan (`JDG-024`). Kiểm chứng thủ công đủ 11 AC trên `next dev` (cổng 3000, dữ liệu thật qua `prisma/dev.db`, thao tác qua Browser tool + đọc trực tiếp DB để xác nhận persist): **AC-01** thêm job "Tech Corp" đầy đủ thông tin → dòng mới đúng dữ liệu, Trạng thái "Interested". **AC-02** gõ "TopCV" vào dropdown Platform → option mới xuất hiện và được chọn ngay, xác nhận qua DB. **AC-03** xóa "ITViec" (không job nào dùng) → xóa thành công, DB còn 2 dòng. **AC-04** xóa "LinkedIn" (đang được job dùng) → bị chặn, toast đúng "Không thể xóa Platform \"LinkedIn\" vì đang có job sử dụng.", DB vẫn còn 3 dòng. **AC-05** đổi Trạng thái "Interested" → "Fail" trực tiếp (bỏ qua các trạng thái giữa) → lưu ngay, không cảnh báo. **AC-06** bấm Xóa job → hiện "Xác nhận xóa"/"Hủy xóa" (chưa xóa, xác nhận qua DB count không đổi) → bấm xác nhận → job biến mất khỏi DB. **AC-07** click tiêu đề "Ngày hết hạn" → sắp tăng dần; click lại → đảo giảm dần (xác nhận qua giá trị input 2 job test). **AC-08** nhập Link thiếu `http://` → chặn lưu, đúng thông báo lỗi. **AC-09** giả lập lỗi mạng (chặn đúng 1 lần gọi `fetch` đầu) khi sửa Ghi chú → dữ liệu vẫn hiển thị trên ô input (không mất), DB không đổi; phục hồi `fetch`, thử lưu lại → thành công, DB cập nhật đúng. **AC-10** để trống Công ty/Ngày hết hạn/Platform rồi bấm Lưu → chặn, đúng 3 thông báo lỗi tương ứng từng ô, chưa thêm dòng nào. **AC-11** sửa Công ty "Tech Corp" → "Tech Corp Vietnam" rồi blur → lưu ngay, xác nhận qua DB, không mở form riêng. **Lỗi phát hiện sau khi review** (user cung cấp ảnh chụp màn hình thật): menu dropdown Platform (`EL-04`) bị `.budget-table-wrap` (dùng chung với `BudgetApp.tsx`, `overflow-x: auto` kéo theo `overflow-y` mặc định `auto`) cắt mất phần dưới — chỉ thấy 1 option "ITViec" bị che một phần thay vì đủ 3 option. Kiểm tra bằng accessibility tree (không render hình ảnh) trước đó không phát hiện được lỗi thị giác này. Đã sửa: `PlatformDropdown` render menu qua `createPortal(document.body)`, `position: fixed`, toạ độ tính từ `getBoundingClientRect()` của nút trigger, đóng khi cuộn/resize, thêm backdrop để đóng khi click ra ngoài. Xác nhận lại bằng `getBoundingClientRect()` của menu: `parentIsBody: true`, `computedPosition: "fixed"`, `clippedByAncestor: false`, đủ cả 3 option "ITViec"/"LinkedIn"/"VietNamWork", chọn được, đóng đúng khi click ra ngoài. **Lỗi thứ hai** (user yêu cầu kiểm tra riêng): `addPlatform` gọi `setOpen(false)` ngay sau khi thêm — Dylan bấm "+" nhưng không thấy option mới xuất hiện trong danh sách vì menu đã đóng ngay lập tức, chỉ thấy nhãn nút trigger đổi tên sau đó. Đã sửa: bỏ `setOpen(false)` khỏi `addPlatform`, giữ menu mở sau khi thêm. Xác nhận lại: thêm "Referral Network" → menu vẫn mở (`menuOpen: true`), option mới xuất hiện trong danh sách với `selected: true`, nhãn trigger cũng cập nhật đúng |
| `TB-12` | Verification tổng hợp: typecheck, `prisma validate`, build, đủ 11 AC kiểm chứng thủ công trên `next dev`; cập nhật DEV wiki mục 5/7/8 với kết quả thật | `docs/kb/dev/wiki/US-018-theo-doi-cv-ung-tuyen.md` | `TB-11` | AC-01..AC-11 | `rtk tsc --noEmit`, `rtk npx prisma validate`, `rtk next build`, thao tác thủ công đủ 11 AC | Done | `rtk tsc --noEmit` → 2 lỗi, cả 2 đều ở `components/BudgetApp.tsx:911`, có sẵn trước US-018, không liên quan (`JDG-024`). `rtk npx prisma validate` → "The schema at prisma\schema.prisma is valid". `npx next build` → **Failed** (`Type error` tại đúng `components/BudgetApp.tsx:911` — cùng lỗi có sẵn; `rtk next build` báo "Errors: 0" không đáng tin, `npx next build` trực tiếp báo đúng "Errors: 1" — `JDG-015` vẫn đúng). Build production của toàn app hiện không chạy được vì lỗi có sẵn này — đã tách `task_8ec82b68` (spawn_task) để sửa riêng, không thuộc phạm vi US-018. Đủ 11 AC Passed trên `next dev` — xem chi tiết ở `TB-11`. Đã dọn dữ liệu test, xác nhận lại trạng thái sạch: đúng 3 Platform mặc định, 0 job. DEV wiki mục 3/5/7/8 đã cập nhật kết quả thật (xem file) |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Đã `Done` ở stage `data` (`TB-01`).
- Cập nhật BA/DEV function wiki — DEV wiki đã tạo ở stage `plan`, đã cập nhật mục 4 ở stage `data`; `TB-12` cập nhật lại mục 3/5/7/8 với kết quả triển khai thật.
- Cập nhật memory — `DEC-080`..`DEC-090`, `JDG-022`..`JDG-024` đã ghi ở stage `raw`/`ba`/`plan`/`data`; `ssr-dev` phát sinh thêm `DEC-091` và `JDG-025` khi phát hiện và sửa race condition thật ở `TB-05` trong lúc kiểm chứng.
- Verification cuối — `TB-12`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (thêm job mới, mặc định "Interested") | `TB-06`, `TB-07`, `TB-08`, `TB-09`, `TB-10`, `TB-11`, `TB-12` | Toàn bộ chuỗi entry → persistence |
| AC-02 (thêm option Platform mới, chọn ngay) | `TB-06`, `TB-07`, `TB-08`, `TB-11`, `TB-12` | |
| AC-03 (xóa option Platform không dùng) | `TB-05`, `TB-06`, `TB-07`, `TB-08`, `TB-11`, `TB-12` | Guard cho qua khi `countByPlatform` = 0 |
| AC-04 (chặn xóa option Platform đang dùng — `BR-021`) | `TB-05`, `TB-06`, `TB-07`, `TB-08`, `TB-11`, `TB-12` | Guard chặn khi `countByPlatform` > 0 |
| AC-05 (đổi Trạng thái tự do, không tuần tự) | `TB-06`, `TB-07`, `TB-08`, `TB-11`, `TB-12` | `upsert-job-application.ts` nhánh update |
| AC-06 (xóa job có xác nhận) | `TB-06`, `TB-07`, `TB-08`, `TB-11`, `TB-12` | State `confirm-delete` ở `TB-11` |
| AC-07 (click tiêu đề cột để sắp xếp, đảo chiều) | `TB-11`, `TB-12` | Hoàn toàn client-side, không chạm server |
| AC-08 (Link sai định dạng bị chặn lưu) | `TB-04`, `TB-07`, `TB-11`, `TB-12` | Rule ở domain, thông báo lỗi hiển thị ở UI |
| AC-09 (lỗi hệ thống khi lưu, giữ nguyên dữ liệu form) | `TB-11`, `TB-12` | Xử lý lỗi ở Client Component, không revert state form khi mutation thất bại |
| AC-10 (thiếu Công ty/Ngày hết hạn/Platform bị chặn lưu) | `TB-07`, `TB-11`, `TB-12` | Validate inline trong `upsert-job-application.ts` |
| AC-11 (sửa Công ty inline, không mở form riêng) | `TB-06`, `TB-07`, `TB-08`, `TB-11`, `TB-12` | Cùng đường dữ liệu với AC-05, khác cột |
| `EL-01`..`EL-09` (Screen Element mục 8.1 spec) | `TB-11` | Toàn bộ nằm trong 1 Client Component |
| Contract `JobTrackerSnapshot` (plan mục 10) | `TB-02`, `TB-08` | Định nghĩa ở entity, export ở actions.ts |
| Contract `server/job-tracker/actions.ts` 6 hàm (plan mục 10) | `TB-08` | |
| Contract `app/page.tsx` (plan mục 10) | `TB-09` | |
| Contract `DylanPlanApp` props (plan mục 10) | `TB-10` | |
| Impact checklist — App Router page/layout = Yes | `TB-09` | |
| Impact checklist — Server Action = Yes | `TB-08` | |
| Impact checklist — Prisma schema / Migration SQLite / DBML = Yes | `TB-01` (Done) | |
| Impact checklist — Seed data = Yes | `TB-05`, `TB-07` | `ensureDefaultJobPlatforms` gọi từ `get-job-tracker-snapshot.ts` |
| Impact checklist — Caching/revalidate = Yes | `TB-07` | `revalidatePath("/")` trong mọi use-case ghi |
| Impact checklist — Knowledge base/memory = Yes | Đã `Done` ở stage `ba`/`plan`/`data`; `TB-12` cập nhật DEV wiki cuối | |
| Rủi ro "dropdown Platform tự dựng, khác `select` gốc" (plan mục 13) | `TB-11` | Bám sát ASCII Mockup mục 8.1 của spec |
| Rủi ro "chỉ dựa FK Restrict sẽ trả lỗi thô" (plan mục 13) | `TB-05`, `TB-07` | Guard-service kiểm tra trước, `onDelete: Restrict` chỉ là lớp dự phòng |
| Rủi ro "ensure-default có thể tạo trùng khi gọi đồng thời" (plan mục 13) | `TB-05` | Chấp nhận rủi ro thấp — single-user (`DEC-004`) |

## 5. Thứ Tự Dependency

1. `TB-01` (Done)
2. `TB-02` (phụ thuộc `TB-01`)
3. `TB-03` (phụ thuộc `TB-02`)
4. `TB-04` (độc lập — hàm thuần, không dùng entity/repository nào)
5. `TB-05` (phụ thuộc `TB-03`)
6. `TB-06` (phụ thuộc `TB-03`)
7. `TB-07` (phụ thuộc `TB-04`, `TB-05`, `TB-06`)
8. `TB-08` (phụ thuộc `TB-07`)
9. `TB-09` (phụ thuộc `TB-08`)
10. `TB-10` (phụ thuộc `TB-09`)
11. `TB-11` (phụ thuộc `TB-08`, `TB-10`)
12. `TB-12` (phụ thuộc `TB-11`)

Không có vòng lặp. `TB-04` có thể chạy song song với `TB-02`/`TB-03` vì không phụ thuộc entity hay repository nào.

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task.
- [x] Mọi tiêu chí chấp nhận đều map tới ít nhất một task.
- [x] Dependency có thứ tự và không vòng lặp.
- [x] Mỗi task có cách verification riêng.
- [x] Cập nhật knowledge base, memory và verification cuối là task tường minh.
- [x] Không task nào gộp các thay đổi cần verify độc lập.
- [x] Không task nào cần đọc source mới hiểu được kết quả mong đợi.

## 7. Blocker Và Câu Hỏi Mở

- Không có.
