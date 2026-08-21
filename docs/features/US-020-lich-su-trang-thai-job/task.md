# Lịch sử thay đổi trạng thái job ứng tuyển — Phân Rã Task

Status: Implemented
Feature: US-020
Plan: plan.md
Spec: spec.md
Created: 2026-08-14
Updated: 2026-08-14
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 9 AC (AC-01..AC-09), mục 8 Screen Element (`EL-06`, `EL-10`) |
| `plan.md` | Mục 5 (luồng end-to-end), 7 (impact checklist), 8 (bản đồ source impact), 9 (data model), 11 (file sẽ thay đổi), 12 (verification), 14 (11 task nháp) |
| `data-model.md` | Field `submittedAt DateTime?` đã thêm vào `JobApplication`, migration `20260814095134_add_job_submitted_at` đã áp dụng — dùng để xác nhận `TB-01` đã hoàn tất trước khi breakdown |

## 2. Breakdown Summary

- Phạm vi: Mở rộng bounded context `server/job-tracker/` (domain/application/infrastructure) + UI `JobTrackerBoard.tsx` cho 3 business rule (`BR-025`, `BR-026`, `BR-027`) và cột dữ liệu mới "Ngày nộp hồ sơ".
- Phụ thuộc chặn: Không — `US-018` đã `Ready for DEV`/triển khai xong, migration đã áp dụng trước khi breakdown.
- Số task: 13
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | `submittedAt DateTime?` thêm vào `JobApplication`, migration áp dụng, DBML đồng bộ | `prisma/schema.prisma`, `prisma/migrations/20260814095134_add_job_submitted_at/`, `docs/db/schema.dbml` | None | Nền tảng cho AC-03, AC-04, AC-05, AC-06, AC-07, AC-09 | `rtk npx prisma validate`; đọc `migration.sql` xác nhận đúng `ALTER TABLE ... ADD COLUMN` | Done | `data-model.md` mục 7 — `prisma validate` Passed, migration `20260814095134_add_job_submitted_at` applied (2026-08-14), `rtk tsc --noEmit` 0 lỗi sau khi generate client |
| `TB-02` | `JobApplicationStatus`/`JOB_APPLICATION_STATUSES` mở rộng 8 giá trị (thêm `"Expired"`); `JobApplicationEntity` thêm `submittedAt: Date \| null` | `server/job-tracker/domain/entities/job-application.ts` | `TB-01` | AC-01, AC-02, AC-08 (status); nền tảng kiểu dữ liệu cho AC-03, AC-04, AC-07, AC-09 | `rtk tsc --noEmit`; đọc file xác nhận đủ 8 giá trị đúng chính tả (`"Expired"`) và field `submittedAt` | Done | `npx tsc --noEmit` → 0 lỗi (2026-08-14). Đọc file xác nhận đủ 8 giá trị (`Interested`..`Fail`, `Expired`) và `submittedAt: Date \| null` trong `JobApplicationEntity` |
| `TB-03` | Domain rule thuần `computeNextSubmittedAt` cài `BR-027` (Interested→Waiting: ghi mốc mới; Waiting→Interested: xoá; còn lại: giữ nguyên) | `server/job-tracker/domain/rules/job-submitted-at-rule.ts` (mới) | `TB-02` | AC-03, AC-04, AC-07 | Đọc code xác nhận đủ 3 nhánh logic đúng `BR-027`; kiểm chứng gián tiếp qua thao tác UI ở `TB-13` (dự án chưa có framework test, `JDG-002`) | Done | Đọc code xác nhận đủ 3 nhánh; hàm thuần, không import Prisma. Kiểm chứng thật qua UI ở `TB-13`: AC-03 (ghi mốc mới khi Interested→Waiting), AC-04 (xoá mốc khi Waiting→Interested), AC-07 (giữ nguyên mốc cũ khi vào Waiting từ trạng thái khác Interested) đều Passed |
| `TB-04` | Domain service thuần `computeAutomaticStatusUpdates` cài `BR-025` (Interested + quá hạn → Expired) và `BR-026` (Waiting + quá 7 ngày kể từ `submittedAt`, chưa đổi trạng thái khác → No Response) | `server/job-tracker/domain/services/job-status-automation-service.ts` (mới) | `TB-02` | AC-01, AC-02, AC-05, AC-06, AC-09 | Đọc code xác nhận đúng 2 điều kiện, đúng phạm vi (chỉ từ Interested cho `BR-025`; bỏ qua job chưa có `submittedAt` cho `BR-026`); kiểm chứng gián tiếp qua `TB-13` | Done | Đọc code xác nhận đúng điều kiện (so sánh mili-giây `> 7 × 24 × 60 × 60 × 1000`, không so sánh lịch ngày); hàm thuần, không import Prisma. Kiểm chứng thật qua UI ở `TB-13`: AC-01, AC-02, AC-05, AC-06, AC-09 đều Passed |
| `TB-05` | `JobApplicationRepository` thêm `findById`; `UpdateJobApplicationInput` mở rộng thêm `submittedAt`; Prisma repository cài `findById` và map `submittedAt` trong `toEntity` | `server/job-tracker/domain/repositories/job-application-repository.ts`, `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` | `TB-01`, `TB-02` | Nền tảng cho AC-03, AC-04, AC-07 (cần đọc `oldStatus`/`submittedAt` hiện tại trước khi update) | `rtk tsc --noEmit`; đọc code xác nhận `findById` dùng `prisma.jobApplication.findUnique`, trả `null` khi không thấy | Done | `npx tsc --noEmit` → 0 lỗi. Đọc code xác nhận `findById` dùng `prisma.jobApplication.findUnique({ where: { id } })`, trả `null` khi không có dòng nào |
| `TB-06` | `getJobTrackerSnapshot()` gọi domain service sau `findAll()`, ghi các job cần tự động đổi trạng thái (song song) trước khi trả snapshot | `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts` | `TB-04`, `TB-05` | AC-01, AC-02, AC-05, AC-06, AC-09 | `rtk tsc --noEmit`; đọc code xác nhận gọi đúng thứ tự (đọc → tính → ghi → trả kết quả đã cập nhật, không cần đọc lại DB lần hai) | Done | `npx tsc --noEmit` → 0 lỗi. Đọc code xác nhận đúng thứ tự: `findAll()` → `computeAutomaticStatusUpdates` → `Promise.all(update...)` → merge vào mảng `jobs` trong bộ nhớ, không đọc lại DB |
| `TB-07` | `upsertJobApplication()` khi có `id`: đọc job cũ qua `findById`, tính `submittedAt` mới qua `computeNextSubmittedAt`, đưa vào patch cùng `status`; khi tạo mới: không set `submittedAt` | `server/job-tracker/application/use-cases/upsert-job-application.ts` | `TB-03`, `TB-05` | AC-03, AC-04, AC-07 | `rtk tsc --noEmit`; đọc code xác nhận thứ tự đọc-trước-khi-ghi | Done | `npx tsc --noEmit` → 0 lỗi. Đọc code xác nhận nhánh tạo mới (`!input.id`) không set `submittedAt`; nhánh cập nhật gọi `findById` trước, tính `computeNextSubmittedAt(currentJob?.status, status, currentJob?.submittedAt ?? null, new Date())` rồi mới `update` |
| `TB-08` | Composition root khởi tạo `jobStatusAutomationService`, truyền vào `createGetJobTrackerSnapshotUseCase` | `server/job-tracker/actions.ts` | `TB-04`, `TB-06` | Hạ tầng cho AC-01, AC-02, AC-05, AC-06, AC-09 (không có wiring thì use-case không chạy được) | `rtk tsc --noEmit` | Done | `npx tsc --noEmit` → 0 lỗi. Đọc code xác nhận `createJobStatusAutomationService()` khởi tạo và truyền đúng vào `createGetJobTrackerSnapshotUseCase({...})` |
| `TB-09` | UI: `STATUS_OPTIONS`/`STATUS_CLASS` thêm `"Expired"`; thêm cột "Ngày nộp hồ sơ" chỉ đọc (`formatDateTime`) giữa cột Trạng thái và Ghi chú trong `JobRow`/`DraftJobRow`; `SortColumn` tách khỏi `JobField`; `colSpan` 7 → 8 | `components/JobTrackerBoard.tsx` | `TB-02`, `TB-08` | AC-01..AC-09 (toàn bộ AC quan sát qua UI) | Thao tác thủ công trên `next dev` qua Browser tool: kiểm dropdown 8 giá trị, cột mới hiển thị đúng định dạng, dòng trống hiện đủ `colSpan` | Done | Trên `next dev` (`http://localhost:60604/roadmap`): dropdown Trạng thái đủ 8 giá trị; cột "Ngày nộp hồ sơ" hiển thị đúng `DD/MM/YYYY HH:mm` hoặc `-`; `colSpan={8}` xác nhận qua đọc code. `SortColumn` giữ nguyên = `JobField` (không thêm sort cho cột mới — lựa chọn giữ đơn giản, không bắt buộc theo spec) |
| `TB-10` | CSS: `.status-expired`; đổi % cột `.job-tracker-table` cho 8 cột (giữ không cần scroll ngang, kế thừa nguyên tắc đã áp dụng cho bảng này) | `app/globals.css` | `TB-09` | AC-01, AC-08 (màu "Expired" hiển thị đúng); hỗ trợ chung UI | `computer{screenshot}` hoặc `getBoundingClientRect()` xác nhận `scrollWidth === clientWidth` (không cần scroll ngang) và màu `.status-expired` áp dụng đúng | Done | `getBoundingClientRect()`/`scrollWidth` trên `next dev`: `.job-tracker-table-wrap` `scrollWidth === clientWidth === 1172` ở viewport 1280px (không cần scroll ngang). `select.job-status-select` khi status "Expired" có `className` gồm `status-expired`; % cột 8 cột (13/10/11/14/12/12/20/8) cộng đúng 100% |
| `TB-11` | Cập nhật DEV function wiki mục 2 (Luồng End-To-End), 3 (Bản Đồ Source), 5 (Contract), 7 (Verification), 8 (Rủi Ro) theo code thật đã triển khai | `docs/kb/dev/wiki/US-020-lich-su-trang-thai-job.md` | `TB-01`..`TB-10` | Khu vực "Knowledge base / memory" trong plan mục 7 | Đối chiếu nội dung wiki với diff thật — không còn mô tả "dự kiến", chuyển hẳn sang thì đã xảy ra | Done | Đã cập nhật mục 2, 3, 5, 7, 8 của `docs/kb/dev/wiki/US-020-lich-su-trang-thai-job.md` khớp code thật, kết quả verification thật (2026-08-14) |
| `TB-12` | Ghi memory: quyết định kỹ thuật phát sinh trong lúc code (nếu có) → `decisions.md`; nhận định kỹ thuật tái sử dụng được (nếu có) → `judgement-log.md`; không có phát sinh mới thì ghi rõ "Không có" | `docs/memory/decisions.md`, `docs/memory/judgement-log.md` | `TB-01`..`TB-10` | Khu vực "Knowledge base / memory" trong plan mục 7 | Đọc lại 2 file xác nhận entry mới (nếu có) tuân đúng định dạng `DEC-###`/`JDG-###` đã dùng trong dự án | Done | Không phát sinh quyết định kỹ thuật mới ngoài những gì đã chốt ở stage BA/Plan/Data (`DEC-099`..`DEC-104`). Đã ghi `JDG-028` vào `judgement-log.md` — nhận định về hệ quả xác nhận thật qua kiểm chứng UI: mốc cũ đã quá 7 ngày khiến job tự động quay lại "No Response" ngay sau khi Dylan chuyển nó sang "Waiting" từ trạng thái khác (đúng theo `DEC-103`, tái hiện được thật trên `next dev`) |
| `TB-13` | Kiểm chứng thủ công đủ 9 AC (AC-01..AC-09) trên `next dev`; chạy verification tổng hợp | Toàn bộ (không có file riêng) | `TB-01`..`TB-11` | AC-01..AC-09 | `rtk tsc --noEmit`, `rtk npx prisma validate`, `rtk next build`, thao tác đủ 9 AC (dựng dữ liệu biên qua Prisma Studio hoặc đọc/ghi trực tiếp `prisma/dev.db` cho các mốc `deadline`/`submittedAt` không thể chờ thời gian thật) | Done | `npx tsc --noEmit` → 0 lỗi; `npx prisma validate` → schema hợp lệ; `npx next build` → build thành công, 6 route (`/`, `/budget`, `/freelance`, `/product`, `/roadmap`, `/_not-found`), 0 lỗi. Dựng 7 job test qua script `tsx` (dùng `PrismaBetterSqlite3` adapter giống `lib/prisma.ts`) với `deadline`/`submittedAt` ở đúng ranh giới, thao tác trên `next dev` (`http://localhost:60604/roadmap`) qua Browser tool — cả 9 AC quan sát đúng như spec mục 7 (chi tiết evidence từng AC nằm ở `TB-03`/`TB-04`/`TB-09`/`TB-10` ở trên). Đã xoá toàn bộ dữ liệu test và script tạm sau khi kiểm chứng xong |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML. → `TB-01`
- Cập nhật BA/DEV function wiki. → `TB-11`
- Cập nhật memory (`decisions.md`, `judgement-log.md`, `glossary.md`). → `TB-12`
- Verification cuối. → `TB-13`

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (Interested quá hạn → Expired tự động) | `TB-02`, `TB-04`, `TB-06`, `TB-08`, `TB-09`, `TB-10`, `TB-13` | `BR-025` |
| AC-02 (Waiting quá hạn KHÔNG tự chuyển Expired) | `TB-02`, `TB-04`, `TB-06`, `TB-08`, `TB-09`, `TB-13` | Ngoại lệ phạm vi `BR-025` |
| AC-03 (Interested→Waiting ghi mốc) | `TB-02`, `TB-03`, `TB-05`, `TB-07`, `TB-09`, `TB-13` | `BR-027` |
| AC-04 (Waiting→Interested xoá mốc) | `TB-02`, `TB-03`, `TB-05`, `TB-07`, `TB-09`, `TB-13` | `BR-027` |
| AC-05 (Waiting quá 7 ngày → No Response tự động) | `TB-02`, `TB-04`, `TB-06`, `TB-08`, `TB-09`, `TB-13` | `BR-026` |
| AC-06 (Waiting chưa quá 7 ngày → giữ nguyên) | `TB-02`, `TB-04`, `TB-06`, `TB-08`, `TB-09`, `TB-13` | Ngoại lệ phạm vi `BR-026` |
| AC-07 (Vào Waiting từ trạng thái khác Interested → giữ mốc cũ) | `TB-02`, `TB-03`, `TB-05`, `TB-07`, `TB-09`, `TB-13` | `BR-027`, `DEC-103` |
| AC-08 (Chọn tay "Expired" bất kỳ lúc nào) | `TB-02`, `TB-09`, `TB-10`, `TB-13` | `DEC-102` |
| AC-09 (Waiting chưa từng có mốc → không tự động No Response) | `TB-02`, `TB-04`, `TB-06`, `TB-08`, `TB-09`, `TB-13` | Ngoại lệ phạm vi `BR-026` |
| Contract `JobApplicationEntity` (plan mục 10) | `TB-02` | |
| Contract `JobApplicationRepository` (plan mục 10) | `TB-05` | |
| Contract `GetJobTrackerSnapshotDeps` (plan mục 10) | `TB-06`, `TB-08` | |
| Impact "Server Action" = Yes | `TB-06`, `TB-07`, `TB-08` | |
| Impact "Prisma schema" = Yes | `TB-01` | |
| Impact "Migration SQLite" = Yes | `TB-01` | |
| Impact "DBML" = Yes | `TB-01` | |
| Impact "Knowledge base / memory" = Yes | `TB-11`, `TB-12` | |

## 5. Thứ Tự Dependency

1. `TB-01`
2. `TB-02`
3. `TB-03`, `TB-04`, `TB-05` (song song — đều chỉ phụ thuộc `TB-01`/`TB-02`, không phụ thuộc lẫn nhau)
4. `TB-06` (sau `TB-04`, `TB-05`), `TB-07` (sau `TB-03`, `TB-05`)
5. `TB-08` (sau `TB-04`, `TB-06`)
6. `TB-09` (sau `TB-02`, `TB-08`)
7. `TB-10` (sau `TB-09`)
8. `TB-11`, `TB-12` (sau `TB-01`..`TB-10`, song song với nhau)
9. `TB-13` (sau tất cả)

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
