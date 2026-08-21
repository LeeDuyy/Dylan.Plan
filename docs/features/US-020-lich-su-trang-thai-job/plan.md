# Lịch sử thay đổi trạng thái job ứng tuyển — SE Plan

Status: Ready for task-breakdown
Feature: US-020
Spec: spec.md
Created: 2026-08-14
Updated: 2026-08-14
DEV Wiki: `docs/kb/dev/wiki/US-020-lich-su-trang-thai-job.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Mở rộng bounded context `server/job-tracker/` đã có từ US-018 (Light DDD 3 lớp): thêm 1 field lưu mốc thời gian (`submittedAt`) trên model `JobApplication`, mở rộng enum-string `status` từ 7 lên 8 giá trị (thêm `"Expired"`), và thêm 2 khối logic nghiệp vụ thuần (domain layer, không I/O):

- Một **domain rule** thuần (pure function) tính mốc `submittedAt` tiếp theo dựa trên `(oldStatus, newStatus, currentSubmittedAt)` — dùng khi Dylan tự tay đổi Trạng thái (`BR-027`).
- Một **domain service** thuần tính danh sách job cần tự động đổi trạng thái dựa trên `(status, deadline, submittedAt, now)` — dùng mỗi khi đọc snapshot (`BR-025`, `BR-026`).

Cả hai chỉ tính toán, không tự ghi DB — việc ghi do use-case (Application) orchestrate qua repository, đúng ranh giới Light DDD (`docs/memory/rules.md` R13.2, R13.3).

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-020-lich-su-trang-thai-job/spec.md` | Nguồn yêu cầu — mục 6 (luồng), 7 (AC), 8 (Screen Element), 9-13 |
| `docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md` | Xác nhận scope, 3 business rule |
| `docs/kb/ba/wiki/knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md`, `BR-026-waiting-qua-7-ngay-tu-dong-no-response.md`, `BR-027-ngay-nop-ho-so-theo-chieu-waiting.md` | Nội dung 3 rule cần cài đặt |
| `docs/kb/dev/wiki/US-018-theo-doi-cv-ung-tuyen.md` | Kiến trúc gốc của bounded context `server/job-tracker/` — US-020 mở rộng trực tiếp, không tạo context mới |
| `docs/kb/dev/00-index.md` | Xác nhận chưa có DEV wiki riêng cho US-020 |
| `server/job-tracker/domain/entities/job-application.ts` | `JobApplicationStatus`, `JOB_APPLICATION_STATUSES`, `JobApplicationEntity` hiện tại (7 trạng thái, chưa có `submittedAt`) |
| `server/job-tracker/domain/repositories/job-application-repository.ts` | Interface hiện tại — `update()` đã nhận `Partial` patch; **chưa có** `findById` |
| `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` | Implementation Prisma hiện tại — `toEntity()` map field, chưa map `submittedAt` |
| `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts` | Use-case đọc snapshot — nơi duy nhất đọc toàn bộ job (đúng điểm nối cho `BR-025`/`BR-026` theo `DEC-100`) |
| `server/job-tracker/application/use-cases/upsert-job-application.ts` | Use-case tạo/sửa job — validate `status`, chưa đọc job cũ trước khi update nên chưa biết `oldStatus` |
| `server/job-tracker/domain/rules/job-link-rule.ts` | Mẫu domain rule thuần đã có (`assertValidJobLink`) — dùng làm khuôn cho rule mới |
| `server/job-tracker/domain/services/default-job-platforms-service.ts`, `job-platform-guard-service.ts` | Mẫu domain service đã có — dùng làm khuôn cho service mới |
| `server/job-tracker/actions.ts` | Composition root — nơi wiring dependency cho các use-case |
| `prisma/schema.prisma` | Model `JobApplication` hiện tại (dòng 81-96) — `status String @default("Interested")`, chưa có `submittedAt` |
| `components/JobTrackerBoard.tsx` | Toàn bộ UI bảng — `STATUS_OPTIONS`, `STATUS_CLASS`, `ClientJob`, `JobField`/`SortColumn`, `JobRow`/`DraftJobRow`, `StatusSelect`, các hàm format ngày |
| `app/globals.css` | CSS bảng `job-tracker-table` (`table-layout: fixed`, % cột theo `nth-child`), 7 class màu trạng thái `.status-*` |
| `app/roadmap/page.tsx` | Entry point Server Component duy nhất gọi `getJobTrackerSnapshot()` (đã tách khỏi `/` từ trước, ngoài phạm vi US-020) |

Chỉ liệt kê file THỰC SỰ đã đọc.

## 3. Hành Vi Hiện Tại

`getJobTrackerSnapshot()` chỉ đọc `findAll()` của cả hai repository rồi trả nguyên trạng — không có bước tính toán/tự cập nhật nào. `upsertJobApplication()` validate `status` nằm trong 7 giá trị cố định rồi `create`/`update` thẳng, không đọc job cũ để biết `status` trước đó. `JobApplication` trong `schema.prisma` chưa có cột lưu mốc thời gian nào ngoài `createdAt`/`updatedAt` (tự động, không phải nghiệp vụ). UI hiển thị đúng 7 trạng thái trong dropdown, 7 màu tương ứng, bảng có 7 cột dữ liệu + 1 cột thao tác.

## 4. Hành Vi Mục Tiêu

`getJobTrackerSnapshot()` sau khi đọc `findAll()` sẽ tính danh sách job cần tự động đổi trạng thái (`BR-025`, `BR-026`) và ghi các thay đổi đó trước khi trả kết quả — client luôn thấy trạng thái đã cập nhật mới nhất mỗi lần tải/làm mới (`DEC-100`). `upsertJobApplication()` khi có `id` (sửa job) sẽ đọc job hiện tại trước, dùng domain rule để quyết định mốc `submittedAt` mới dựa trên `(oldStatus, newStatus)`, rồi ghi cả `status` lẫn `submittedAt` trong cùng một lệnh update (`BR-027`). `JobApplication` có thêm cột `submittedAt` (nullable). UI có 8 trạng thái (thêm "Expired", màu riêng), thêm 1 cột "Ngày nộp hồ sơ" chỉ đọc giữa cột Trạng thái và Ghi chú.

## 5. Luồng End-To-End

```text
app/roadmap/page.tsx (Server Component, async) -> getJobTrackerSnapshot()
  -> Không có Auth (DEC-004)
  -> application/use-cases/get-job-tracker-snapshot.ts
       -> domain/services/job-status-automation-service.ts (BR-025, BR-026 — thuần, không I/O)
       -> jobApplicationRepository.update(id, { status }) cho từng job cần đổi (side effect, song song)
  -> infrastructure/repositories/job-application-prisma-repository.ts -> lib/prisma.ts -> SQLite
  -> trả JobTrackerSnapshot đã cập nhật -> components/JobTrackerBoard.tsx (initial render + refreshSnapshot)

components/JobTrackerBoard.tsx (StatusSelect onChange) -> updateJobApplication() (Server Action)
  -> application/use-cases/upsert-job-application.ts
       -> jobApplicationRepository.findById(id) (đọc oldStatus + submittedAt hiện tại)
       -> domain/rules/job-submitted-at-rule.ts -> computeNextSubmittedAt(oldStatus, newStatus, current, now) (BR-027 — thuần)
       -> assertValidStatus (8 giá trị)
       -> jobApplicationRepository.update(id, { status, submittedAt })
  -> revalidatePath("/roadmap")  -- LƯU Ý: hiện tại là revalidatePath("/"), lệch route thật (xem mục 6, 13) — KHÔNG sửa trong phạm vi US-020, đã tách task riêng
  -> refreshSnapshot() ở client (bỏ qua cache, đọc thẳng qua Server Action)
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` + source `server/job-tracker/**` | Đọc trực tiếp source — bounded context, entity, use-case đã tồn tại và hoạt động (`npx tsc --noEmit` 0 lỗi, `npx prisma validate` hợp lệ, 2026-08-14) | Không | US-020 chỉ mở rộng, không cần US-018 làm lại |
| `prisma/schema.prisma` — thêm field `submittedAt` | Đọc `prisma/schema.prisma:81-96` | Có — cần `ssr-data` chạy trước `ssr-breaker`/`ssr-dev` | `ssr-data` trước, sau đó mới tới `ssr-breaker` |
| **Ghi chú ngoài phạm vi** — `revalidatePath("/")` lệch route ở 4 use-case (`upsert-job-application.ts`, `delete-job-application.ts`, `create-job-platform.ts`, `delete-job-platform.ts`) do route Roadmap đã tách sang `/roadmap` trước đây (không thuộc US-020) | Đọc trực tiếp 4 file — xác nhận cả 4 đều gọi `revalidatePath("/")` | Không chặn US-020 (client bỏ qua cache nhờ `refreshSnapshot`, chỉ ảnh hưởng hard-reload) | Đã tách thành task riêng ngoài pipeline này — **không sửa trong phạm vi US-020** để giữ diff sạch đúng scope |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | Không đổi `app/roadmap/page.tsx` — vẫn gọi `getJobTrackerSnapshot()` như cũ, hành vi mới nằm bên trong use-case |
| Server Action | Yes | `updateJobApplication`/`createJobApplication` (qua `upsertJobApplication`) và `getJobTrackerSnapshot` trong `server/job-tracker/actions.ts` đổi hành vi nội bộ, không đổi chữ ký export |
| Route Handler (`app/api`) | N/A | Không có route handler nào trong luồng này |
| Auth / middleware / permission | No | Không đổi — vẫn single-user (`DEC-004`) |
| Prisma schema | Yes | Thêm field `submittedAt DateTime?` vào model `JobApplication` |
| Migration SQLite | Yes | Migration `ADD COLUMN` cho `submittedAt` — cột mới nullable, không cần backfill |
| DBML | Yes | `docs/db/schema.dbml` cần đồng bộ tay theo field mới (dự án không có generator DBML) |
| Seed data | No | Không có seed liên quan tới `JobApplication` |
| Caching / revalidate | No (trong phạm vi US-020) | `revalidatePath` giữ nguyên hiện trạng — lỗi route đã có từ trước, tách task riêng (mục 6) |
| Export / báo cáo | N/A | Job ứng tuyển không thuộc phạm vi xuất dữ liệu nào (xác nhận ở spec mục 13) |
| Mail / webhook / job nền | N/A | Không có — luật tự động chạy đồng bộ trong use-case đọc, không cần hạ tầng nền (`DEC-100`) |
| Knowledge base / memory | Yes | DEV function wiki mới `docs/kb/dev/wiki/US-020-lich-su-trang-thai-job.md`, cập nhật `SSR_DEV_KB_INDEX` |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry | `app/roadmap/page.tsx` | Không đổi — vẫn gọi `getJobTrackerSnapshot()` nguyên trạng |
| Application (use-case) | `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts` | Sau `findAll()`, gọi `job-status-automation-service` tính job cần đổi (`BR-025`/`BR-026`), ghi qua `jobApplicationRepository.update` (song song, `Promise.all`), merge kết quả vào `jobs` trả về mà không cần đọc lại DB lần hai. Thêm `jobStatusAutomationService` vào `GetJobTrackerSnapshotDeps` |
| Application (use-case) | `server/job-tracker/application/use-cases/upsert-job-application.ts` | Khi có `input.id`: gọi `repository.findById(input.id)` lấy job hiện tại (nếu không tìm thấy → lỗi rõ ràng, không âm thầm bỏ qua); dùng `computeNextSubmittedAt` để tính `submittedAt` mới; đưa `submittedAt` vào `data` patch cùng `status`. Khi tạo mới (không có `id`): không set `submittedAt` (giữ `null` mặc định) |
| Domain rule (mới) | `server/job-tracker/domain/rules/job-submitted-at-rule.ts` | Hàm thuần `computeNextSubmittedAt(oldStatus: JobApplicationStatus \| undefined, newStatus: JobApplicationStatus, currentSubmittedAt: Date \| null, now: Date): Date \| null` — cài `BR-027`: `Interested→Waiting` trả `now`; `Waiting→Interested` trả `null`; mọi trường hợp khác trả `currentSubmittedAt` nguyên trạng |
| Domain service (mới) | `server/job-tracker/domain/services/job-status-automation-service.ts` | Hàm thuần `computeAutomaticStatusUpdates(jobs: JobApplicationEntity[], now: Date): { id: string; status: JobApplicationStatus }[]` — cài `BR-025` (`Interested` + `deadline < now` → `"Expired"`) và `BR-026` (`Waiting` + `submittedAt` không null + `now - submittedAt > 7 ngày` → `"No Response"`); chỉ trả về job thực sự cần đổi |
| Repository interface (domain) | `server/job-tracker/domain/repositories/job-application-repository.ts` | Thêm `findById`, trả về một `JobApplicationEntity` hoặc `null` khi không tìm thấy (kiểu `Promise` bọc `JobApplicationEntity` hoặc `null`); mở rộng `UpdateJobApplicationInput` (kiểu `Partial` bọc `Pick` các field hiện có) thêm `"submittedAt"` vào danh sách field được chọn |
| Repository implementation (infrastructure) | `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` | Cài `findById` (`prisma.jobApplication.findUnique`); `toEntity()` map thêm `submittedAt: row.submittedAt` |
| Domain entity | `server/job-tracker/domain/entities/job-application.ts` | Thêm `"Expired"` vào `JobApplicationStatus` và `JOB_APPLICATION_STATUSES` (8 giá trị); thêm `submittedAt: Date \| null` vào `JobApplicationEntity` |
| Composition root | `server/job-tracker/actions.ts` | Khởi tạo `jobStatusAutomationService`, truyền vào `createGetJobTrackerSnapshotUseCase` cùng `jobApplicationRepository` |
| Data | `prisma/schema.prisma` | Model `JobApplication` thêm `submittedAt DateTime?` (giao `ssr-data`) |
| UI | `components/JobTrackerBoard.tsx` | `STATUS_OPTIONS`/`STATUS_CLASS` thêm `"Expired"`; `ClientJob` thêm `submittedAt: Date \| string \| null`; thêm `SortColumn` riêng khỏi `JobField` (thêm `"submittedAt"`, không đưa vào `JobField` vì không phải trường form); thêm cột "Ngày nộp hồ sơ" chỉ đọc (`<th>` + `<td>`) giữa cột Trạng thái và Ghi chú trong cả `JobRow` và `DraftJobRow` (draft hiển thị "-" tĩnh vì job chưa tồn tại); thêm hàm `formatDateTime()` (`DD/MM/YYYY HH:mm`); đổi `colSpan={7}` → `colSpan={8}` ở dòng trống |
| UI (style) | `app/globals.css` | Thêm `.status-expired`; đổi % cột `.job-tracker-table th:nth-child(N)`/`td:nth-child(N)` từ 7 cột sang 8 cột (dịch chỉ số từ cột 6 trở đi) |
| Consumer | Không có | Không component/module nào khác import `JobApplicationStatus`/`JOB_APPLICATION_STATUSES`/`JobApplicationEntity` ngoài `server/job-tracker/**` và `components/JobTrackerBoard.tsx` (đã rà bằng tìm kiếm toàn repo) |

## 9. Thay Đổi Data Model

Cần đổi schema: **Có**.

- Bắt buộc có `data-model.md` do `ssr-data` tạo, và task breakdown phải có task riêng cho migration.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `JobApplication` | Thêm field `submittedAt DateTime?` | Có | Không có (mặc định `NULL`) | Không cần thêm index — không dùng để lọc/join, chỉ đọc/ghi theo `id` | Các dòng đã có sẵn nhận `NULL` tự động (SQLite `ADD COLUMN` không có `NOT NULL` không cần backfill) |

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `JobApplicationEntity` (`server/job-tracker/domain/entities/job-application.ts`) | `{ id, company, deadline, platformId, link, status: 7 giá trị, note, createdAt, updatedAt }` | Thêm `submittedAt: Date \| null`; `status` mở rộng 8 giá trị (thêm `"Expired"`) | Không — mở rộng thuần túy (thêm field optional-ish và thêm 1 giá trị enum-string), không xóa/đổi kiểu field cũ nào |
| `JobApplicationRepository` (`server/job-tracker/domain/repositories/job-application-repository.ts`) | 5 method: `findAll`, `create`, `update`, `delete`, `countByPlatform` | Thêm `findById` | Không — chỉ thêm method, implementation Prisma cập nhật cùng lúc |
| `GetJobTrackerSnapshotDeps` (`server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts`) | `{ jobApplicationRepository, jobPlatformRepository, defaultJobPlatformsService }` | Thêm `jobStatusAutomationService` | Không — chỉ thêm dependency, wiring nằm trong `actions.ts` |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `prisma/schema.prisma` | Thêm `submittedAt DateTime?` vào model `JobApplication` (giao `ssr-data`) |
| `server/job-tracker/domain/entities/job-application.ts` | Thêm `"Expired"` vào status union + mảng; thêm `submittedAt` vào entity |
| `server/job-tracker/domain/rules/job-submitted-at-rule.ts` (mới) | Hàm thuần `computeNextSubmittedAt` — cài `BR-027` |
| `server/job-tracker/domain/services/job-status-automation-service.ts` (mới) | Hàm thuần `computeAutomaticStatusUpdates` — cài `BR-025`, `BR-026` |
| `server/job-tracker/domain/repositories/job-application-repository.ts` | Thêm `findById`; mở rộng `UpdateJobApplicationInput` thêm `submittedAt` |
| `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` | Cài `findById`; map `submittedAt` trong `toEntity` |
| `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts` | Gọi domain service, ghi các job cần tự động đổi trạng thái trước khi trả snapshot |
| `server/job-tracker/application/use-cases/upsert-job-application.ts` | Đọc job cũ qua `findById` khi sửa, tính `submittedAt` mới qua domain rule, đưa vào patch |
| `server/job-tracker/actions.ts` | Wiring `jobStatusAutomationService` vào `createGetJobTrackerSnapshotUseCase` |
| `components/JobTrackerBoard.tsx` | 8 trạng thái, cột "Ngày nộp hồ sơ" mới, `formatDateTime`, `SortColumn` tách khỏi `JobField`, `colSpan` |
| `app/globals.css` | `.status-expired`, đổi % cột bảng cho 8 cột |
| `docs/db/schema.dbml` | Đồng bộ tay field `submittedAt` mới (do `ssr-data` thực hiện cùng migration) |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng | Kết quả thật |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi | Passed — 0 lỗi (2026-08-14) |
| Prisma | `rtk npx prisma validate` | schema hợp lệ | Passed (2026-08-14) |
| Test | `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (tiền lệ `JDG-002`, US-018) | Không áp dụng |
| Build | `rtk next build` | "Errors: 0"; đối chiếu thêm bằng `npx next build` trực tiếp nếu nghi ngờ (tiền lệ `JDG-015` — `rtk next build` từng báo sai) | Passed — `npx next build` trực tiếp xác nhận 6 route biên dịch thành công, 0 lỗi (2026-08-14) |
| Thủ công | Trên `next dev`: kiểm đủ 9 AC của spec — đặc biệt AC-01/AC-02 (Expired tự động, chỉ từ Interested), AC-03/AC-04/AC-07 (ghi/giữ/xoá mốc), AC-05/AC-06/AC-09 (No Response tự động sau 7 ngày, có mốc mới áp dụng) | Cả 9 AC quan sát đúng như mô tả trong spec mục 7 | Passed — cả 9 AC quan sát đúng qua Browser tool trên `next dev` (2026-08-14), chi tiết ở `task.md` `TB-13` |
| Thủ công (biên thời gian) | Tạo/sửa dữ liệu test qua Prisma Studio hoặc script đọc `prisma/dev.db` trực tiếp để dựng job có `deadline`/`submittedAt` ở đúng ranh giới 7 ngày/quá hạn (không thể chờ 7 ngày thật trong lúc kiểm thử) | `BR-025`/`BR-026` kích hoạt đúng ranh giới đã mô tả | Passed — dựng 7 job qua script `tsx` dùng cùng driver adapter với `lib/prisma.ts`, xác nhận đúng ranh giới (>7 ngày → No Response, <7 ngày → giữ nguyên; quá hạn ở Interested → Expired, quá hạn ở trạng thái khác → giữ nguyên); dữ liệu test đã xoá sau khi xong |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| `getJobTrackerSnapshot()` giờ có side effect ghi (update trạng thái tự động) trong một use-case trước đây chỉ đọc — có thể vi phạm kỳ vọng "đọc thuần" nếu có nơi khác gọi hàm này chỉ để đọc | Trung bình | Đã rà: chỉ 2 nơi gọi `getJobTrackerSnapshot()` — `app/roadmap/page.tsx` (đọc ban đầu) và `refreshSnapshot()` trong `JobTrackerBoard.tsx` (đọc lại sau mọi thao tác) — cả hai đều mong đợi dữ liệu mới nhất, không có nơi nào cần "đọc thuần không side effect" | Bỏ bước gọi domain service trong use-case, giữ nguyên `findAll()` thuần như cũ |
| `revalidatePath("/")` lệch route (bug có sẵn, không thuộc US-020) có thể khiến reviewer nhầm là do US-020 gây ra | Thấp | Đã ghi rõ trong mục 6 và spawn task riêng theo dõi độc lập; `ssr-review`/`ssr-fix` cần đối chiếu mục này để không quy nhầm finding vào US-020 | Không áp dụng — không sửa trong phạm vi này |
| Domain service tính "quá 7 ngày" cần định nghĩa chính xác ranh giới (`> 7 ngày` hay `≥ 7 ngày 0 giờ`) — `ba-expert` đã lưu ý AC-05/AC-06 chưa test đúng ranh giới | Thấp | Diễn giải "quá 7 ngày" = khoảng cách thời gian lớn hơn 7×24 giờ kể từ `submittedAt` (dùng mili-giây, không dùng so sánh lịch ngày) — nhất quán với cách "Ngày hết hạn" đã dùng `Date` object trong domain hiện tại | Đổi điều kiện so sánh trong `job-status-automation-service.ts` nếu diễn giải sai |
| Thêm `findById` vào interface repository trong khi `R13.6` khuyến nghị "chỉ khai báo thao tác domain thật sự dùng tới" | Thấp | Method này thực sự cần (đọc `oldStatus` trước khi update để cài `BR-027`) — không phải CRUD generic thừa | Không cần rollback — đúng theo R13.6 |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | `submittedAt DateTime?` thêm vào `JobApplication`, migration áp dụng, DBML đồng bộ | Done |
| `TB-02` | Mở rộng `JobApplicationStatus`/`JOB_APPLICATION_STATUSES` (8 giá trị) và `JobApplicationEntity` (`submittedAt`) | Pending |
| `TB-03` | Domain rule `job-submitted-at-rule.ts` (`BR-027`) | Pending |
| `TB-04` | Domain service `job-status-automation-service.ts` (`BR-025`, `BR-026`) | Pending |
| `TB-05` | Repository: thêm `findById`, map `submittedAt` (interface + Prisma implementation) | Pending |
| `TB-06` | Use-case `get-job-tracker-snapshot.ts`: gọi domain service, ghi job cần tự động đổi | Pending |
| `TB-07` | Use-case `upsert-job-application.ts`: đọc job cũ, tính `submittedAt` qua domain rule | Pending |
| `TB-08` | Wiring `actions.ts` (composition root) | Pending |
| `TB-09` | UI `JobTrackerBoard.tsx`: 8 trạng thái, cột "Ngày nộp hồ sơ", `formatDateTime`, `colSpan` | Pending |
| `TB-10` | CSS `globals.css`: `.status-expired`, đổi % cột 8 cột | Pending |
| `TB-11` | Cập nhật DEV function wiki theo code thật | Pending |
| `TB-12` | Cập nhật memory (`decisions.md`/`judgement-log.md` nếu phát sinh) | Pending |
| `TB-13` | Kiểm chứng thủ công đủ 9 AC + verification tổng hợp | Pending |

Readiness: Ready
