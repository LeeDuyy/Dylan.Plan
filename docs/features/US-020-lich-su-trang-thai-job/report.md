# Lịch sử thay đổi trạng thái job ứng tuyển — Delivery Report

Status: Delivered With Notes
Feature: US-020
Verdict: Pass With Notes
Created: 2026-08-14
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

Bảng "Theo dõi CV ứng tuyển" (trang Roadmap) giờ tự ghi mốc "Ngày nộp hồ sơ" khi Dylan chuyển một job từ "Interested" sang "Waiting", và xoá mốc đó khi chuyển ngược lại. Hệ thống tự động cập nhật Trạng thái cho hai tình huống thời gian: job đang "Interested" mà đã quá Ngày hết hạn thì tự chuyển "Expired" (trạng thái mới, Dylan vẫn chọn tay được); job đang "Waiting" mà im lặng quá 7 ngày kể từ "Ngày nộp hồ sơ" thì tự chuyển "No Response". Cả hai luật tính lại ngay mỗi khi bảng được tải hoặc làm mới, không cần hạ tầng chạy nền. Cần đổi cấu trúc dữ liệu (thêm cột `submittedAt`, migration đã áp dụng). Không có rủi ro Critical/High còn mở; 2 ghi chú Low không chặn giao hàng (chi tiết mục 7, 9).

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` | Có |
| Spec | `docs/features/US-020-lich-su-trang-thai-job/spec.md` | Có (`Ready for DEV`, 9 AC) |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md` | Có (đã `sync`, `Active`) |
| Plan | `docs/features/US-020-lich-su-trang-thai-job/plan.md` | Có (`Ready for task-breakdown`) |
| DEV wiki | `docs/kb/dev/wiki/US-020-lich-su-trang-thai-job.md` | Có (`Active`) |
| Data model | `docs/features/US-020-lich-su-trang-thai-job/data-model.md` | Có (`Applied`) |
| Task | `docs/features/US-020-lich-su-trang-thai-job/task.md` | Có (`Implemented`, 13/13 Done) |
| Report | `docs/features/US-020-lich-su-trang-thai-job/report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 11:10 | Ready for DEV, 9 AC, `po-expert` Aligned |
| 2 | DEV | plan | `ssr-plan` | Passed | 07:39 | Ready for task-breakdown, `schemaChangeRequired=true` |
| 3 | DEV | data | `ssr-data` | Passed | 04:23 | `submittedAt` thêm vào `JobApplication`, migration áp dụng, DBML đồng bộ |
| 4 | DEV | task | `ssr-breaker` | Passed | 02:23 | 13 task, readiness Ready |
| 5 | DEV | implement | `ssr-dev` | Passed | 32:09 | 13/13 task Done, 9 AC kiểm chứng thật qua browser |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 139:35 | Pass With Notes — 9/9 AC đạt, 2 ghi chú Low |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 139:35 | `tsc`/`prisma validate`/`build` Passed, `lint` không kiểm được (gap có sẵn) |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | join = Pass With Notes, không cần fix |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | Báo cáo này |

Kết quả join phase TEST: Pass With Notes

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | Thêm `AC-09` (lỗ hổng tiêu chí chấp nhận), sửa 2 điểm số liệu (đếm spec đã rà, đếm DEC) |
| `po-expert` | ba | Aligned — áp dụng hợp lý tiền lệ `DEC-088` (mở rộng cùng entity/cùng trang) |
| `swe-expert` | implement | Không dùng — `SSR_IMPLEMENT_EXECUTOR=codex`, giao Codex CLI cho TB-02..TB-10, `ssr-dev` tự chạy lại verification |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | `submittedAt` thêm vào `JobApplication`, migration áp dụng, DBML đồng bộ | Done | `prisma validate` Passed; migration `20260814095134_add_job_submitted_at` applied; `tsc --noEmit` 0 lỗi |
| `TB-02` | Mở rộng `JobApplicationStatus`/`JOB_APPLICATION_STATUSES` (8 giá trị), `JobApplicationEntity` (`submittedAt`) | Done | `tsc --noEmit` 0 lỗi; đọc file xác nhận đủ 8 giá trị |
| `TB-03` | Domain rule `computeNextSubmittedAt` (`BR-027`) | Done | Đọc code + kiểm chứng thật qua UI: AC-03, AC-04, AC-07 Passed |
| `TB-04` | Domain service `computeAutomaticStatusUpdates` (`BR-025`, `BR-026`) | Done | Đọc code + kiểm chứng thật qua UI: AC-01, AC-02, AC-05, AC-06, AC-09 Passed |
| `TB-05` | Repository: `findById`, map `submittedAt` | Done | `tsc --noEmit` 0 lỗi; đọc code xác nhận `findUnique`, trả `null` khi không thấy |
| `TB-06` | `get-job-tracker-snapshot.ts`: tự động đổi trạng thái trước khi trả snapshot | Done | `tsc --noEmit` 0 lỗi; đọc code xác nhận đúng thứ tự đọc→tính→ghi→trả |
| `TB-07` | `upsert-job-application.ts`: đọc job cũ, tính `submittedAt` | Done | `tsc --noEmit` 0 lỗi; đọc code xác nhận đọc-trước-khi-ghi |
| `TB-08` | Wiring `actions.ts` | Done | `tsc --noEmit` 0 lỗi |
| `TB-09` | UI 8 trạng thái, cột "Ngày nộp hồ sơ", `colSpan` | Done | Kiểm chứng thật trên `next dev` qua Browser tool |
| `TB-10` | CSS `.status-expired`, % cột 8 cột | Done | `scrollWidth === clientWidth` (không cần scroll ngang); màu áp dụng đúng |
| `TB-11` | Cập nhật DEV wiki theo code thật | Done | Mục 2,3,5,7,8 của DEV wiki khớp code thật |
| `TB-12` | Cập nhật memory | Done | Ghi `JDG-028`; không phát sinh DEC mới ngoài `DEC-099`..`DEC-104` đã có |
| `TB-13` | Kiểm chứng thủ công đủ 9 AC + verification tổng hợp | Done | `tsc`/`prisma validate`/`next build` Passed; 9/9 AC Passed qua Browser tool |

Task thêm mới trong quá trình làm: Không có (13 task đúng như `task.md` gốc)

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | `server/job-tracker/domain/entities/job-application.ts` |
| Source | `server/job-tracker/domain/rules/job-submitted-at-rule.ts` (mới) |
| Source | `server/job-tracker/domain/services/job-status-automation-service.ts` (mới) |
| Source | `server/job-tracker/domain/repositories/job-application-repository.ts` |
| Source | `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` |
| Source | `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts` |
| Source | `server/job-tracker/application/use-cases/upsert-job-application.ts` |
| Source | `server/job-tracker/actions.ts` |
| Source | `components/JobTrackerBoard.tsx` |
| Source | `app/globals.css` |
| Prisma / migration | `prisma/schema.prisma` |
| Prisma / migration | `prisma/migrations/20260814095134_add_job_submitted_at/migration.sql` |
| DBML | `docs/db/schema.dbml` |
| Knowledge base | `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` |
| Knowledge base | `docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md`, `feature-summary/US-020-lich-su-trang-thai-job.md`, `delivery/pbi/US-020-lich-su-trang-thai-job.md`, `ingestion/source-record/US-020-lich-su-trang-thai-job.md` |
| Knowledge base | `docs/kb/ba/wiki/knowledge/business-rule/BR-025-*.md`, `BR-026-*.md`, `BR-027-*.md` (mới) |
| Knowledge base | `docs/kb/ba/wiki/data/entity/ENT-004-job-ung-tuyen.md` (mở rộng) |
| Knowledge base | `docs/kb/ba/wiki/indexes/{root,raw,feature}-index.md`, `docs/kb/ba/wiki/reports/wiki-health-report.md` |
| Knowledge base | `docs/kb/dev/wiki/US-020-lich-su-trang-thai-job.md`, `docs/kb/dev/00-index.md`, `docs/kb/ba/00-index.md`, `docs/requirements-index.md` |
| Memory | `docs/memory/decisions.md` (`DEC-099`..`DEC-104`), `docs/memory/judgement-log.md` (`JDG-027`, `JDG-028`), `docs/memory/glossary.md` |
| Artifact feature | `docs/features/US-020-lich-su-trang-thai-job/{spec,plan,data-model,task,report}.md` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — 0 lỗi | 2026-08-14 |
| `rtk npx prisma validate` | Passed | 2026-08-14 |
| `rtk lint` | Không kiểm được — repo chưa từng cấu hình ESLint (`next lint` chỉ hiện wizard lần đầu); gap có sẵn, ngoài phạm vi US-020 | 2026-08-14 |
| `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (`JDG-002`) | — |
| `rtk next build` (`npx --yes next build` trực tiếp, tránh báo sai theo `JDG-015`) | Passed — 6 route (`/`, `/budget`, `/freelance`, `/product`, `/roadmap`, `/_not-found`), 0 lỗi | 2026-08-14 |
| Thủ công 9 AC trên `next dev` | Passed — cả 9 AC qua Browser tool, dữ liệu biên dựng qua script `tsx` (đã xoá sau khi xong) | 2026-08-14 |

## 7. Review Findings

Không có finding nào ở mức Critical/High/Medium. 2 ghi chú Low (không chặn), gộp vào mục 9.

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | Job Interested + deadline quá khứ → tự động "Expired" (Browser tool, `/roadmap`) |
| AC-02 | Đạt | Job Waiting + deadline quá khứ → giữ "Waiting" (chỉ `BR-025` target `status === "Interested"`) |
| AC-03 | Đạt | Interested→Waiting qua UI → cột "Ngày nộp hồ sơ" ghi đúng thời điểm |
| AC-04 | Đạt | Waiting→Interested qua UI → mốc về "-" |
| AC-05 | Đạt | Waiting, `submittedAt` 8 ngày trước → tự động "No Response" |
| AC-06 | Đạt | Waiting, `submittedAt` 3 ngày trước → giữ "Waiting" |
| AC-07 | Đạt | No Response→Waiting (đã có mốc cũ) → mốc giữ nguyên, không ghi đè (`DEC-103`) |
| AC-08 | Đạt | Chọn tay "Expired" từ trạng thái bất kỳ → được chấp nhận |
| AC-09 | Đạt | Waiting chưa từng có mốc → giữ "Waiting", không tự No Response |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-06` (Trạng thái) | Có | 8 giá trị đúng chính tả; tự động qua `BR-025`/`BR-026`; chọn tay tự do |
| `EL-10` (Ngày nộp hồ sơ) | Có | Cột mới chỉ đọc, `formatDateTime`, `DraftJobRow` hiện "-" tĩnh |

## 8. Fix Rounds

Không có — join = Pass With Notes ngay từ vòng đầu, không cần fix round.

Số vòng đã dùng: 0/2

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | `revalidatePath("/")` trong 4 use-case của `server/job-tracker/**` trỏ nhầm route cũ (bảng đã chuyển sang `/roadmap` từ trước) — bug có sẵn, không phải do US-020, đã xác nhận Codex không đụng vào | Nợ kỹ thuật | Đã tách task nền riêng (`task_07677905`, chip đã hiển thị cho user) — không cần xử lý lại trong pipeline này |
| 2 | Repo chưa từng cấu hình ESLint — `rtk lint`/`next lint` chỉ hiện wizard cấu hình lần đầu, không lint được | Nợ kỹ thuật | Ngoài phạm vi US-020; nếu cần, chạy `npx @next/codemod@canary next-lint-to-eslint-cli .` hoặc cấu hình ESLint riêng ở một task khác |
| 3 | `upsertJobApplication`: `findById` rồi `update` không bọc transaction — rủi ro race lý thuyết nếu double-submit rất nhanh trên cùng một job | Rủi ro | Mức thấp, chấp nhận được với single-user (`DEC-004`); tự phục hồi ở lượt `getJobTrackerSnapshot()` kế tiếp nếu có lệch. Không cần sửa trừ khi thực tế gặp phải |
| 4 | Mốc "Ngày nộp hồ sơ" cũ đã quá 7 ngày khiến job tự quay lại "No Response" ngay sau khi Dylan chuyển nó sang "Waiting" từ trạng thái khác Interested (đúng theo `DEC-103`, đã tái hiện thật — `JDG-028`) | Câu hỏi mở (hành vi, không phải lỗi) | Theo dõi phản hồi thực tế của Dylan khi dùng — nếu gây khó chịu, cân nhắc đảo `DEC-103` ở một US sau |
| 5 | `US-018` mục `EL-06` trong spec cũ vẫn mô tả Trạng thái có 7 giá trị (chưa cập nhật để phản ánh 8 giá trị của `US-020`) | Nợ tài liệu | Không chặn triển khai — cập nhật tham chiếu ở `US-018` khi có dịp chỉnh sửa spec đó (đã ghi ở spec `US-020` mục 11) |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git diff`/revert 10 file trong mục 5 (nhóm Source) về trạng thái trước US-020 — bounded context `server/job-tracker/**` độc lập, không ảnh hưởng `server/budget/**` |
| Migration SQLite | Backup trước migration tại `prisma/backups/dev.db.us-020-before-submitted-at.20260814165055.bak`; hoặc tạo migration mới `DROP COLUMN "submittedAt"` qua `prisma migrate dev` (không sửa tay `migration.sql`) |
| Dữ liệu đã backfill | Không áp dụng — cột `submittedAt` mới hoàn toàn nullable, không backfill dữ liệu cũ nào |
