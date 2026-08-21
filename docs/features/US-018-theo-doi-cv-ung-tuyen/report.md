# Bảng theo dõi CV ứng tuyển tại trang Roadmap — Delivery Report

Status: Delivered With Notes
Feature: US-018
Verdict: Pass With Notes
Created: 2026-08-13
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.
> Ghi chú quy trình: các stage dưới đây được gọi tay theo từng yêu cầu trực tiếp của user trong cùng một phiên (`/dylan-ssrkit:ssr-po` → `ssr-raw` → `ssr-ingest` → `ssr-ba` → `ssr-plan` → `ssr-data` → `ssr-breaker` → `ssr-dev` → `ssr-review`), không qua điều phối tự động của `ssr-pipeline`. Không có phase TEST song song (`review ∥ test`) vì không chạy qua `ssr-pipeline`.

## 1. Tóm Tắt

Dylan giờ có một bảng "Theo dõi CV ứng tuyển" ngay trên trang Roadmap (`/`) để quản lý các job đang quan tâm — thêm, sửa từng ô ngay tại dòng (Công ty, Ngày hết hạn, Platform, Link, Trạng thái, Ghi chú), xóa có xác nhận, sắp xếp theo bất kỳ cột nào, và tự quản lý danh sách Platform (thêm/xóa option, mặc định có sẵn "ITViec"/"LinkedIn"/"VietNamWork"). Dữ liệu lưu bền vững qua 2 model Prisma mới (`JobApplication`, `JobPlatform`), hoàn toàn độc lập với hệ thống Quản lý chi tiêu hiện có (`DEC-088`, `po-expert` xác nhận `Aligned`). Toàn bộ 11 tiêu chí chấp nhận đã kiểm chứng thật trên `next dev` bằng thao tác trình duyệt thật, đối chiếu trực tiếp qua `prisma/dev.db`.

Trong lúc kiểm chứng, phát hiện và tự sửa 3 lỗi thật (không phải giả định): (1) race condition khi seed 3 Platform mặc định — 7 request tải trang gần như đồng thời tạo 21 dòng thay vì 3, sửa bằng transaction atomic (`DEC-091`); (2) dropdown Platform bị `.budget-table-wrap` (overflow-x: auto) cắt mất một phần — sửa bằng `createPortal` render ra `document.body`; (3) thêm Platform mới xong dropdown đóng ngay khiến Dylan không thấy option mới trong danh sách — sửa bằng cách giữ menu mở sau khi thêm. Cả 3 đều đã xác nhận lại bằng thao tác/truy vấn thật, không còn mở.

Rủi ro còn lại: build production (`next build`) của toàn app hiện đang Failed vì một lỗi kiểu dữ liệu có sẵn ở `components/BudgetApp.tsx:911`, hoàn toàn không liên quan tới US-018 (xác nhận bằng `git diff` rỗng trên file đó) — đã tách task riêng (`task_8ec82b68`), không chặn `next dev` hay bất kỳ AC nào của US-018.

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` | Có |
| Spec | `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` | Có (`Ready for DEV`, 11 AC) |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md` | Có (`Active`) |
| Plan | `docs/features/US-018-theo-doi-cv-ung-tuyen/plan.md` | Có (`Ready for task-breakdown`, mục 14 đồng bộ `Implemented`) |
| DEV wiki | `docs/kb/dev/wiki/US-018-theo-doi-cv-ung-tuyen.md` | Có (`Active`) |
| Data model | `docs/features/US-018-theo-doi-cv-ung-tuyen/data-model.md` | Có (`Applied`) |
| Task | `docs/features/US-018-theo-doi-cv-ung-tuyen/task.md` | Có (`Implemented`, 12/12 Done) |
| Report | `docs/features/US-018-theo-doi-cv-ung-tuyen/report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| 1 | Ngoài pipeline | intake | `ssr-po` → `ssr-raw` | Passed | User yêu cầu trực tiếp qua `/dylan-ssrkit:ssr-po`; `po-expert` sau đó xác nhận US-018 không cần thuộc Business Flow (`DEC-088`) |
| 2 | BA | ba | `ssr-ingest` + `ssr-ba` | Passed | `Ready for DEV`, 11 AC; `ba-expert` sửa 1 khoảng trống (luồng sửa inline 5 trường ngoài Trạng thái); `po-expert` lần 1 `Blocked` (chưa có quyết định phạm vi) → user chốt `DEC-088` → gọi lại `po-expert` → `Aligned` |
| 3 | DEV | plan | `ssr-plan` | Passed | `Ready for task-breakdown`, `schemaChangeRequired=true` |
| 4 | DEV | data | `ssr-data` | Passed | 2 model mới, migration `20260813110324_add_job_tracker` áp dụng thật, DBML đồng bộ thủ công |
| 5 | DEV | task | `ssr-breaker` | Passed | `Ready`, 12 task (`TB-01` Done từ stage `data`), coverage đủ 11 AC + 9 EL |
| 6 | DEV | implement | `ssr-dev` | Passed | 12/12 task Done; executor `codex` cho `TB-02`..`TB-11`, `ssr-dev` tự đối chiếu phạm vi + chạy lại verification; tự phát hiện và sửa race condition thật (`DEC-091`) trong lúc kiểm chứng |
| 7 | TEST | review | `ssr-review` | Passed With Notes | `Pass With Notes` — 2 finding `Low` (F-01, F-02), đủ 11 AC + 9 EL đạt |
| 8 | Sau review | fix thủ công | — (user kiểm chứng trực tiếp qua ảnh chụp màn hình) | Passed | 2 lỗi thật phát sinh sau khi review kết luận (F-03 dropdown bị cắt, F-04 option mới không hiện) — sửa ngay, không qua vòng `ssr-fix` chính thức vì không đủ điều kiện severity để route lại, nhưng vẫn được coi là fix round thực tế (xem mục 8) |
| 9 | OUT | report | Ghi tay (không qua `ssr-pipeline`) | Passed | Chính file này |

Kết quả cuối cùng: Pass With Notes (0 finding còn mở mức chặn; 2 finding Low còn mở nhưng không chặn, 2 finding phát sinh sau review đã Đã sửa).

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | Sửa 1 điểm (bổ sung luồng + AC cho sửa inline 5 trường ngoài Trạng thái) |
| `po-expert` | ba | Lần 1: `Blocked` (thiếu quyết định phạm vi) → Lần 2 (sau `DEC-088`): `Aligned` |
| `swe-expert` | implement | Không dùng — `SSR_IMPLEMENT_EXECUTOR=codex`, giao Codex CLI cho `TB-02`..`TB-11` |

Executor implement: `codex` — `ssr-dev` soạn brief, chạy Codex CLI, đối chiếu phạm vi (đúng 19 file trong `plan.md` mục 11, không chạm `schema.prisma`/migration/DBML/artifact tri thức), tự chạy lại verification trước khi chấp nhận.

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | Migration `add_job_tracker` áp dụng, DBML đồng bộ | Done | `data-model.md` mục 3, 7 — Passed |
| `TB-02` | `JobApplicationEntity`, `JobPlatformEntity` | Done | `tsc --noEmit` sạch (trừ lỗi có sẵn không liên quan) |
| `TB-03` | Interface `JobApplicationRepository`, `JobPlatformRepository` (bổ sung `createDefaultsIfEmpty` khi sửa `TB-05`) | Done | Đọc lại file khớp thiết kế + bổ sung |
| `TB-04` | `assertValidJobLink` | Done | AC-08 Passed trên `next dev` |
| `TB-05` | Guard xóa Platform (`BR-021`) + ensure-default 3 Platform | Done | **Phát hiện + sửa race condition thật** (`DEC-091`, `JDG-025`) — xem mục 7 |
| `TB-06` | Implementation Prisma cho 2 repository | Done | AC-01..AC-06, AC-10, AC-11 Passed |
| `TB-07` | 5 use-case (get/upsert/delete job, create/delete platform) | Done | Validate server-side đúng R5.5, `revalidatePath` đủ 4 mutation |
| `TB-08` | `server/job-tracker/actions.ts` | Done | 6 hàm export đúng contract |
| `TB-09` | `app/page.tsx` → `async` | Done | `GET /` 200, dữ liệu ban đầu đầy đủ |
| `TB-10` | `DylanPlanApp`/`RoadmapSections` chèn `JobTrackerBoard` | Done | Đúng vị trí dưới "Lộ trình thực hiện" |
| `TB-11` | `components/JobTrackerBoard.tsx` | Done | Đủ 11 AC Passed; 2 lỗi UI phát sinh sau review đã sửa (xem mục 7) |
| `TB-12` | Verification tổng hợp + cập nhật DEV wiki | Done | `tsc --noEmit`/`prisma validate` Passed; `next build` Failed (lỗi có sẵn, ngoài phạm vi) |

Task thêm mới trong quá trình làm: Không có — 2 lỗi UI phát sinh sau review (F-03, F-04) được sửa trực tiếp trong `TB-11` (đã có sẵn trong phạm vi task đó), không cần `TB-##` mới.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source (mới) | `server/job-tracker/actions.ts`, `server/job-tracker/domain/entities/{job-application,job-platform}.ts`, `server/job-tracker/domain/repositories/{job-application-repository,job-platform-repository}.ts`, `server/job-tracker/domain/rules/job-link-rule.ts`, `server/job-tracker/domain/services/{job-platform-guard-service,default-job-platforms-service}.ts`, `server/job-tracker/infrastructure/repositories/{job-application-prisma-repository,job-platform-prisma-repository}.ts`, `server/job-tracker/application/use-cases/{get-job-tracker-snapshot,upsert-job-application,delete-job-application,create-job-platform,delete-job-platform}.ts`, `components/JobTrackerBoard.tsx` |
| Source (sửa) | `app/page.tsx`, `components/DylanPlanApp.tsx`, `app/globals.css` |
| Prisma / migration | `prisma/schema.prisma` (model `JobApplication`, `JobPlatform`), `prisma/migrations/20260813110324_add_job_tracker/`, backup `prisma/backups/dev.db.us-018-before-job-tracker.20260813180307.bak` |
| DBML | `docs/db/schema.dbml` |
| Knowledge base | `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md`, `docs/kb/ba/wiki/**` (feature, feature-summary, pbi, source-record, `BR-021` mới, `ENT-004`/`ENT-005` mới, 4 index, `wiki-health-report.md`), `docs/kb/dev/wiki/US-018-theo-doi-cv-ung-tuyen.md`, `docs/kb/dev/00-index.md` |
| Memory | `docs/memory/decisions.md` (`DEC-080`..`DEC-091`), `docs/memory/judgement-log.md` (`JDG-022`..`JDG-026`), `docs/memory/glossary.md` ("Job ứng tuyển", "Platform (tuyển dụng)") |
| Artifact feature | `spec.md`, `plan.md`, `data-model.md`, `task.md`, `report.md` (chính file này) |
| Index cấp dự án | `docs/requirements-index.md`, `docs/kb/ba/00-index.md` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — 2 lỗi còn lại đều ở `components/BudgetApp.tsx:911`, có sẵn trước US-018, không liên quan (`JDG-024`) | 2026-08-13 |
| `rtk npx prisma validate` | Passed | 2026-08-13 |
| `rtk npx prisma generate` | Passed | 2026-08-13 |
| `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (`JDG-002`) | — |
| `next build` | **Failed** — cùng lỗi có sẵn `BudgetApp.tsx:911`, chặn build production toàn app; `rtk next build` báo sai "Errors: 0" (`JDG-015`), `npx next build` trực tiếp báo đúng "Errors: 1". Đã tách `task_8ec82b68`, ngoài phạm vi US-018 | 2026-08-13 |
| Thủ công đủ 11 AC trên `next dev` | Passed | 2026-08-13 |

## 7. Review Findings

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 0 (`ssr-review`) | Low | `components/JobTrackerBoard.tsx:534-553` (JobDateInput) | Spec EL-03: hiển thị DD/MM/YYYY | Dùng `input[type=date]` gốc — định dạng hiển thị phụ thuộc locale trình duyệt/OS, chỉ có `title` tooltip là DD/MM/YYYY chắc chắn | Còn mở — chấp nhận được, đây là đánh đổi tường minh ở `DEC-085` |
| F-02 | 0 (`ssr-review`) | Low | `components/JobTrackerBoard.tsx:474-480` | Spec mục 8.1 không liệt kê nút "mở link" | Thêm 1 link mở tab mới cạnh ô Link, ngoài Screen Element đã đặc tả | Còn mở — tiện ích bổ sung hợp lý, không mâu thuẫn AC nào |
| F-03 | Sau review (user cung cấp ảnh chụp màn hình) | Medium | `app/globals.css` (`.platform-menu`), `components/JobTrackerBoard.tsx` (`PlatformDropdown`) | Dropdown Platform hiển thị đủ 3 option, không bị che | Bị `.budget-table-wrap` (`overflow-x: auto` → `overflow-y` tự thành `auto`) cắt mất phần dưới, chỉ thấy 1 option bị che một phần | **Đã sửa** — render qua `createPortal(document.body)`, `position: fixed` tính từ `getBoundingClientRect()`, đóng khi cuộn/resize/click ra ngoài. Xác nhận lại: `clippedByAncestor: false`, đủ 3 option, chọn được |
| F-04 | Sau review (user yêu cầu kiểm tra) | Low | `components/JobTrackerBoard.tsx` (`addPlatform`) | Option Platform vừa thêm phải hiển thị trong danh sách đang mở (AC-02) | `setOpen(false)` chạy ngay sau khi thêm — Dylan không thấy option mới xuất hiện trong list, chỉ thấy nhãn nút đổi sau đó | **Đã sửa** — bỏ `setOpen(false)`, giữ menu mở. Xác nhận lại: thêm "Referral Network" → menu vẫn mở, option mới hiện trong list với `selected: true` |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | Thêm "Tech Corp" đầy đủ → DB xác nhận đủ 6 trường, `status="Interested"` |
| AC-02 | Đạt | Thêm "TopCV"/"Referral Network" → DB xác nhận platform mới + job đang thao tác trỏ đúng; sau F-04 còn xác nhận thêm option hiện trong list đang mở |
| AC-03 | Đạt | Xóa "ITViec" (0 job dùng) → DB còn 2 dòng |
| AC-04 | Đạt | Xóa "LinkedIn" (đang dùng) → chặn, toast đúng "Không thể xóa Platform \"LinkedIn\" vì đang có job sử dụng." |
| AC-05 | Đạt | Đổi thẳng "Interested" → "Fail", không cảnh báo |
| AC-06 | Đạt | Bấm Xóa → "Xác nhận xóa"/"Hủy xóa"; DB không đổi tới khi xác nhận |
| AC-07 | Đạt | Click "Ngày hết hạn" → tăng dần; click lại → giảm dần |
| AC-08 | Đạt | `job-link-rule.ts` regex `^https?://`; UI hiện đúng thông báo |
| AC-09 | Đạt | Chặn 1 lần `fetch` → dữ liệu giữ nguyên trên form, DB không đổi; phục hồi mạng → lưu thành công |
| AC-10 | Đạt | Để trống Công ty/Ngày hết hạn/Platform → chặn, đúng 3 thông báo lỗi |
| AC-11 | Đạt | Sửa "Tech Corp" → "Tech Corp Vietnam", blur → DB cập nhật ngay |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-01` (Bảng) | Có | Sort mọi cột, mặc định `createdAt desc` |
| `EL-02` (Cột Công ty) | Có | Bắt buộc, inline edit |
| `EL-03` (Cột Ngày hết hạn) | Có (F-01) | `input[type=date]`, định dạng phụ thuộc locale |
| `EL-04` (Cột Platform) | Có (đã sửa F-03, F-04) | Dropdown tự dựng qua portal |
| `EL-05` (Cột Link) | Có (F-02) | Kèm 1 phần tử thêm ngoài spec |
| `EL-06` (Cột Trạng thái) | Có | 7 giá trị cố định, chọn tự do |
| `EL-07` (Cột Ghi chú) | Có | Không bắt buộc |
| `EL-08` (Nút Thêm job) | Có | Mở draft row, mặc định "Interested" |
| `EL-09` (Nút xóa job) | Có | Confirm-delete theo dòng |

## 8. Fix Rounds

Không có vòng fix chính thức qua `ssr-fix` (F-01, F-02 là `Low`, không đủ điều kiện route sang `ssr-fix` theo `ssr-review` mục 10). F-03, F-04 phát sinh **sau khi** `ssr-review` đã kết luận `Pass With Notes` — do user tự kiểm chứng bằng mắt (ảnh chụp màn hình) và bằng thao tác trực tiếp, phát hiện 2 lỗi UI mà kiểm chứng qua accessibility tree trước đó bỏ sót (`JDG-026`). Sửa ngay tại chỗ, không mở vòng `ssr-fix` riêng vì đã có đủ ngữ cảnh và không cần thêm một chu trình review độc lập cho 2 thay đổi CSS/UI cục bộ, rủi ro thấp.

| Vòng | Finding nhận | Nguyên nhân gốc | Thay đổi | Verification |
| --- | --- | --- | --- | --- |
| Sau review (không đánh số) | F-03 | `.platform-menu` dùng `position: absolute` trong container `overflow-x: auto` (khiến `overflow-y` tự thành `auto`, cắt phần tử vượt khung) | `components/JobTrackerBoard.tsx` (portal), `app/globals.css` (`.platform-menu`, `.platform-menu-backdrop`) | Passed — `getBoundingClientRect()` xác nhận không bị cắt |
| Sau review (không đánh số) | F-04 | `addPlatform` gọi `setOpen(false)` ngay sau khi thêm | `components/JobTrackerBoard.tsx` (`addPlatform`) | Passed — option mới hiện trong list đang mở |

Finding bị từ chối: Không có.

Số vòng đã dùng: 0/3 (không tính 2 lượt sửa trực tiếp trên như một "vòng fix" chính thức theo định nghĩa `SSR_FIX_ROUND_LIMIT`).

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | `next build` (production) của toàn app đang Failed do lỗi kiểu dữ liệu có sẵn ở `components/BudgetApp.tsx:911` (mảng insight trộn kiểu khiến `Icon` bị suy rộng gồm cả `boolean`) — không liên quan US-018 nhưng chặn deploy thật | Nợ kỹ thuật (có từ trước) | Đã tách `task_8ec82b68` (spawn_task) — nên xử lý trước khi deploy production |
| 2 | F-01 (định dạng ngày phụ thuộc locale trình duyệt) | Rủi ro thấp | Không cần hành động — đánh đổi tường minh ở `DEC-085`; nếu muốn kiểm soát chặt hơn, cần đổi sang ô nhập chữ có mask riêng (đã bị loại ở dialog `ssr-ba`) |
| 3 | F-02 (thêm nút "Mở link" ngoài spec) | Cải tiến nhỏ ngoài kế hoạch | Có thể chính thức hóa thành `EL-10` ở lượt cập nhật spec sau nếu muốn, không bắt buộc |
| 4 | `JDG-026`: kiểm chứng UI chỉ qua accessibility tree không phát hiện được lỗi bị cắt hình ảnh (CSS overflow clipping) | Nhận định quy trình | Với mọi dropdown/menu/popover mới dùng `position: absolute` trong container có `overflow` khác `visible`, nên kiểm chứng thêm bằng ảnh chụp màn hình hoặc `getBoundingClientRect()`, không chỉ dựa `read_page` |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | Xóa toàn bộ `server/job-tracker/` và `components/JobTrackerBoard.tsx`; revert `app/page.tsx`, `components/DylanPlanApp.tsx`, `app/globals.css` về bản trước US-018 |
| Migration SQLite | Tạo migration mới `DROP TABLE "JobApplication"`, `DROP TABLE "JobPlatform"` qua `prisma migrate dev` (không xóa tay); hoặc khôi phục từ `prisma/backups/dev.db.us-018-before-job-tracker.20260813180307.bak` nếu chưa có dữ liệu thật nào cần giữ |
| Dữ liệu đã backfill | Không áp dụng — US-018 không backfill dữ liệu cũ, chỉ tạo bảng mới hoàn toàn |
