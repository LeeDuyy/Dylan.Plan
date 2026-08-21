---
status: Active
feature: US-020
updated: 2026-08-14 (implemented)
plan: docs/features/US-020-lich-su-trang-thai-job/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-020", "Lịch sử thay đổi trạng thái job ứng tuyển (DEV)"]
---

# US-020 — Lịch sử thay đổi trạng thái job ứng tuyển tại trang Roadmap (DEV)

Status: Active
Feature: US-020
Updated: 2026-08-14 (implemented — `task.md` Status: Implemented)
Plan: `docs/features/US-020-lich-su-trang-thai-job/plan.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md`
Owner: ssr-plan

## 1. Tổng Quan Kỹ Thuật

Mở rộng bounded context `server/job-tracker/` đã có từ US-018 (Light DDD 3 lớp), không tạo context mới. Thêm 1 field lưu mốc thời gian (`submittedAt`) trên model `JobApplication` đã có, mở rộng `status` từ 7 lên 8 giá trị chuỗi (thêm `"Expired"`). Hai luật tự động theo thời gian (`BR-025`, `BR-026`) và một luật ghi/xoá mốc theo chiều chuyển trạng thái (`BR-027`) đều cài dưới dạng hàm thuần trong `domain/` (không I/O), được `application/` orchestrate cùng repository.

## 2. Luồng End-To-End

```text
app/roadmap/page.tsx (Server Component) -> getJobTrackerSnapshot()
  -> Không có Auth (DEC-004)
  -> application/use-cases/get-job-tracker-snapshot.ts
     -> domain/services/job-status-automation-service.ts (BR-025, BR-026 — thuần)
     -> domain/repositories/job-application-repository.ts (interface)
        -> infrastructure/repositories/job-application-prisma-repository.ts (implementation, ghi job cần tự động đổi)
  -> lib/prisma.ts -> SQLite

components/JobTrackerBoard.tsx (đổi Trạng thái) -> updateJobApplication()
  -> application/use-cases/upsert-job-application.ts
     -> repository.findById (đọc oldStatus)
     -> domain/rules/job-submitted-at-rule.ts (BR-027 — thuần)
     -> repository.update(status, submittedAt)
  -> revalidatePath (giữ nguyên hiện trạng — bug route lệch có sẵn, tách task riêng, không thuộc US-020)
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `app/roadmap/page.tsx`, `components/JobTrackerBoard.tsx` | Server Component (đọc ban đầu) + Client Component (mọi tương tác) — không đổi so với US-018 |
| Auth | Không có | Single-user, không đăng nhập/phân quyền (`DEC-004`) |
| Application | `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts`, `upsert-job-application.ts` | Tự động đổi trạng thái khi đọc snapshot; ghi/xoá mốc khi đổi trạng thái tay |
| Domain | `server/job-tracker/domain/services/job-status-automation-service.ts` (mới), `domain/rules/job-submitted-at-rule.ts` (mới) | `BR-025`/`BR-026` (tự động), `BR-027` (mốc theo chiều chuyển) |
| Infrastructure | `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` | Thêm `findById`, map `submittedAt` |
| Data | `prisma/schema.prisma` | Thêm `submittedAt DateTime?` vào `JobApplication` — `ssr-data` thêm |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Page | `app/roadmap/page.tsx` | Không đổi — vẫn gọi `getJobTrackerSnapshot()` |
| Component | `components/JobTrackerBoard.tsx` | Thêm 8 trạng thái, cột "Ngày nộp hồ sơ" chỉ đọc, `formatDateTime` |
| Server Action | `server/job-tracker/actions.ts` | Wiring thêm `jobStatusAutomationService` |
| Use-case (Application) | `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts` | Gọi domain service, ghi job cần tự động đổi trước khi trả snapshot |
| Use-case (Application) | `server/job-tracker/application/use-cases/upsert-job-application.ts` | Đọc job cũ, tính `submittedAt` mới qua domain rule |
| Domain service (mới) | `server/job-tracker/domain/services/job-status-automation-service.ts` | `computeAutomaticStatusUpdates` — `BR-025`, `BR-026` |
| Domain rule (mới) | `server/job-tracker/domain/rules/job-submitted-at-rule.ts` | `computeNextSubmittedAt` — `BR-027` |
| Domain rule/entity | `server/job-tracker/domain/entities/job-application.ts` | Mở rộng `JobApplicationStatus`/`JOB_APPLICATION_STATUSES`/`JobApplicationEntity` |
| Repository (Infrastructure) | `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` | Thêm `findById`, map `submittedAt` |
| Type / schema | `server/job-tracker/domain/repositories/job-application-repository.ts` | Thêm `findById` vào interface, mở rộng `UpdateJobApplicationInput` |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `JobApplication` (mở rộng) | Thêm `submittedAt DateTime?` (nullable, không default) | Không cần thêm — không dùng để lọc/join | Không đổi quan hệ với `JobPlatform` |

- Migration liên quan: `prisma/migrations/20260814095134_add_job_submitted_at/migration.sql` — đã áp dụng (2026-08-14), backup trước tại `prisma/backups/dev.db.us-020-before-submitted-at.20260814165055.bak`. Chỉ gồm `ALTER TABLE ... ADD COLUMN "submittedAt" DATETIME;` (cột nullable, không cần backfill).
- DBML đã đồng bộ: Có — `docs/db/schema.dbml` (cập nhật thủ công, dự án không có generator DBML).
- Lưu ý SQLite: `ADD COLUMN` cho cột nullable không cần backfill (các dòng cũ nhận `NULL`). `status` vẫn là `String` (không có enum gốc trong SQLite), validate ở tầng ứng dụng — mở rộng danh sách hợp lệ từ 7 lên 8 giá trị trong `assertValidStatus` (`upsert-job-application.ts`), không đổi kiểu cột.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `JobApplicationEntity` (mở rộng) | Thêm `submittedAt: Date \| null`; `status` mở rộng 8 giá trị (`JOB_APPLICATION_STATUSES`) | `server/job-tracker/**`, `components/JobTrackerBoard.tsx` |
| `JobApplicationRepository` (mở rộng) | Thêm `findById` — nhận `id`, trả về một `JobApplicationEntity` hoặc `null` khi không tìm thấy | `upsert-job-application.ts` |
| `computeNextSubmittedAt` (mới, `domain/rules/job-submitted-at-rule.ts`) | `(oldStatus, newStatus, currentSubmittedAt, now) => Date \| null` — hàm thuần | `upsert-job-application.ts` |
| `computeAutomaticStatusUpdates` (mới, `domain/services/job-status-automation-service.ts`) | `(jobs, now) => { id, status }[]` — hàm thuần | `get-job-tracker-snapshot.ts` |
| `GetJobTrackerSnapshotDeps` (mở rộng) | Thêm `jobStatusAutomationService` | `server/job-tracker/actions.ts` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-018` | Depends on | Toàn bộ bounded context `server/job-tracker/**`, entity `JobApplication`, component `JobTrackerBoard.tsx` — US-020 mở rộng trực tiếp, không tạo context/route mới |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk npx prisma validate` | Passed | 2026-08-14 |
| `rtk npx prisma migrate dev --name add_job_submitted_at` | Passed — migration `20260814095134_add_job_submitted_at` đã áp dụng | 2026-08-14 |
| `rtk npx prisma generate` | Passed — Prisma Client 7.9.1 | 2026-08-14 |
| `rtk tsc --noEmit` | Passed — 0 lỗi (baseline trước đó cũng đã 0 lỗi; lỗi có sẵn ở `BudgetApp.tsx:911` đã được sửa trong phiên làm việc trước đó, không còn liên quan) | 2026-08-14 |
| `rtk next build` (chạy trực tiếp `npx next build` để tránh báo sai — `JDG-015`) | Passed — 6 route biên dịch (`/`, `/budget`, `/freelance`, `/product`, `/roadmap`, `/_not-found`), 0 lỗi | 2026-08-14 |
| `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (`JDG-002`) | — |
| Thủ công đủ 9 AC trên `next dev` | Passed — AC-01..AC-09 đều Passed. Dựng 7 job test qua script `tsx` (driver adapter giống `lib/prisma.ts`) với `deadline`/`submittedAt` ở đúng ranh giới, thao tác qua Browser tool trên `http://localhost:60604/roadmap`, xoá dữ liệu test sau khi xong. Phát hiện thêm một hệ quả đúng thiết kế (không phải defect): job có mốc cũ đã quá 7 ngày, khi Dylan chuyển nó sang "Waiting" từ trạng thái khác Interested, tự động quay lại "No Response" ngay ở lượt tải dữ liệu kế tiếp — đúng theo `DEC-103` (`JDG-028`) | 2026-08-14 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| `getJobTrackerSnapshot()` chuyển từ đọc thuần sang có side effect ghi (tự động đổi trạng thái) | Trung bình — đã rà chỉ 2 nơi gọi hàm này (`app/roadmap/page.tsx`, `refreshSnapshot()` trong `JobTrackerBoard.tsx`), cả hai đều mong đợi dữ liệu mới nhất; đã kiểm chứng thật không có nơi nào cần đọc thuần | Bỏ bước gọi domain service trong `get-job-tracker-snapshot.ts`, giữ `findAll()` thuần như cũ |
| `revalidatePath("/")` lệch route (bug có sẵn từ trước, không thuộc US-020) | Thấp — không chặn AC nào của US-020 vì client đọc lại qua Server Action, bỏ qua cache; đã xác nhận Codex không sửa nhầm dòng này | Không áp dụng trong phạm vi US-020 — theo dõi qua task nền đã tách |
| Ranh giới "quá 7 ngày" tính bằng mili-giây tuyệt đối, không theo lịch ngày | Thấp — đã kiểm chứng thật qua dữ liệu biên (8 ngày trước → No Response, 3 ngày trước → giữ nguyên) | Đổi điều kiện so sánh trong `job-status-automation-service.ts` nếu sau này cần diễn giải khác |
