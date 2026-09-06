# Tự điền thông tin job từ link tin tuyển dụng — Delivery Report

Status: Delivered With Notes
Feature: US-021
Verdict: Pass With Notes
Created: 2026-08-28
Owner: ssr-pipeline

> Đây là báo cáo duy nhất của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

Sau US-021, khi Dylan dán một đường dẫn tin tuyển dụng vào ô Link của một dòng job ở bảng "Theo dõi CV ứng tuyển" (trang Roadmap) và rời khỏi ô — với điều kiện giá trị Link vừa thay đổi — hệ thống tự truy cập đường dẫn một lần (máy chủ tự đọc, chờ ~10 giây), suy Platform từ tên miền, và đọc phần thông tin công khai của trang để điền Công ty và Ngày hết hạn vào các ô đang trống của dòng đó. Không ghi đè ô Dylan đã tự nhập. Đọc thất bại hoặc thiếu trường thì hiện thông báo nhẹ và vẫn cho lưu job. Không đổi cấu trúc dữ liệu, không gửi dữ liệu ra dịch vụ bên thứ ba.

Rủi ro còn lại: kịch bản click-through UI đầy đủ chưa chạy được bằng trình duyệt thật trong môi trường verification (Browser pane không compositing frames) — hành vi được xác nhận qua rà `git diff` từng dòng + 27 smoke test tầng server + `tsc`/`next build` sạch. Việc parse trang thật của ITViec/VietnamWorks cũng nên được kiểm khi có mạng.

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md` | Có |
| Spec | `docs/features/US-021-tu-dien-thong-tin-job-link/spec.md` | Có — `Status: Ready for DEV`, 8 AC |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-021-tu-dien-thong-tin-job-link.md` | Có — `Status: Active` (đã sync); `BR-031`, `BR-032` |
| Plan | `docs/features/US-021-tu-dien-thong-tin-job-link/plan.md` | Có — `Status: Implemented` |
| DEV wiki | `docs/kb/dev/wiki/US-021-tu-dien-thong-tin-job-link.md` | Có — `Status: Active` |
| Data model | `data-model.md` | Không áp dụng — `DEC-113`, không đổi schema |
| Task | `docs/features/US-021-tu-dien-thong-tin-job-link/task.md` | Có — `Status: Implemented`, 10/10 task Done |
| Report | `docs/features/US-021-tu-dien-thong-tin-job-link/report.md` | Chính file này |
| PO review | `docs/po/review-2026-08-27-tu-dien-thong-tin-job-tu-link.md` | Có (nguồn đề xuất) |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 10:50 | spec `Ready for DEV`, 8 AC; `po-expert` Aligned; wiki synced; `DEC-120`..`DEC-126` |
| 2 | DEV | plan | `ssr-plan` | Passed | 10:05 | `Ready for task-breakdown`; `schemaChangeRequired=false`; DEV wiki + `JDG-033` |
| 3 | DEV | data | `ssr-data` | Skipped | 00:00 | `DEC-113` — không đổi cấu trúc dữ liệu |
| 4 | DEV | task | `ssr-breaker` | Passed | 00:00 | `task.md` Ready — 10 task, coverage đủ AC-01..AC-08, dependency acyclic |
| 5 | DEV | implement | `ssr-dev` | Passed | 30:05 | executor Codex CLI; 9 file source; `tsc`/`build`/`prisma` xanh; 27 smoke test PASS; `ssr-dev` sửa 1 sai lệch spec (F-01) |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 02:46 | Pass With Notes — 8/8 AC đạt, 6/6 Element đạt; 0 fix round |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 02:46 | `tsc` Passed, `prisma validate` Passed, `next build` 0 lỗi 0 cảnh báo; `vitest` N/A |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | join = Pass With Notes, không Fail |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | File này |

Kết quả join phase TEST: **Pass With Notes**

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | Sửa 1 mâu thuẫn nội bộ mục 6 (đọc link thất bại vẫn suy Platform từ tên miền), làm chặt 8 AC, phát hiện 2 điểm mờ A14/A15 → dialog `DEC-125`/`DEC-126` |
| `po-expert` | ba | Aligned (áp dụng tiền lệ `DEC-088`/`DEC-111`) |
| `swe-expert` | implement | Không dùng — `SSR_IMPLEMENT_EXECUTOR=codex` |
| Codex CLI 0.142.5 | implement | Giao TB-01..TB-08; `ssr-dev` đối chiếu phạm vi + tự chạy lại verification |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | `matchPlatformByHostname` (`BR-032`) | Done | `tsc` 0 lỗi; smoke 6/6 PASS (itviec.com/subdomain/.com.vn → khớp, example.com/bad-url → null) |
| `TB-02` | `parseAbsoluteDeadline` (`BR-031`/`DEC-124`/`DEC-126`) | Done | `tsc` 0 lỗi; smoke 10/10 PASS (ISO, DD/MM/YYYY, VN, EN, "còn N ngày"→null, MM/YYYY→null, quá khứ→giữ nguyên) |
| `TB-03` | `job-link-enrichment-service` `enrich()` | Done | `tsc` 0 lỗi; smoke 3/3 PASS (`missing[]` đúng thứ tự); domain thuần |
| `TB-04` | `job-posting-fetcher` timeout + chặn host nội bộ | Done | `tsc` 0 lỗi; smoke 5/5 PASS (localhost/127/192.168/169.254/ftp → null); `AbortSignal.timeout(10_000)`, giới hạn 2MB |
| `TB-05` | `job-posting-parser` JSON-LD + OG/meta/title | Done | `tsc` 0 lỗi; smoke 3/3 PASS; không thêm dependency |
| `TB-06` | `read-job-link` use-case + `actions.ts` export | Done | `tsc`/`build` xanh; không `revalidatePath`, không ghi DB; `actions.ts` +19 additive |
| `TB-07` | `JobTrackerBoard.tsx` trigger + điền ô trống + chống race | Done | `tsc`/`build` xanh; rà `git diff`: guard `DEC-125`, `buildReadLinkPatch` chỉ ô trống (`DEC-116`), stale-guard, draft/saved-job phân nhánh. Click-through browser: F-02 |
| `TB-08` | `JobTrackerBoard.tsx` chỉ báo `EL-02` + thông báo nhẹ `EL-06` | Done | `tsc`/`build` xanh; `ssr-dev` sửa chuỗi Platform → khớp spec AC-05 (F-01); auto-clear 10s/5s; CSS +15 dòng `globals.css` |
| `TB-09` | Cập nhật DEV wiki + kiểm memory | Done | DEV wiki mục 7 có kết quả thật; không phát sinh DEC/JDG mới khi code |
| `TB-10` | Verification cuối | Done (với ghi chú) | `tsc` 0 lỗi · `next build` 0/0 · `prisma validate` valid · `vitest`/`lint` N/A · 27 smoke test PASS · click-through UI: F-02 |

Task thêm mới trong quá trình làm: Không có.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source (mới) | `server/job-tracker/domain/rules/job-platform-match-rule.ts`, `server/job-tracker/domain/rules/job-deadline-parse-rule.ts`, `server/job-tracker/domain/services/job-link-enrichment-service.ts`, `server/job-tracker/infrastructure/job-posting-fetcher.ts`, `server/job-tracker/infrastructure/job-posting-parser.ts`, `server/job-tracker/application/use-cases/read-job-link.ts` |
| Source (sửa) | `server/job-tracker/actions.ts` (+19, additive), `components/JobTrackerBoard.tsx` (+218/−9), `app/globals.css` (+15) |
| Prisma / migration | Không có (cho US-021) |
| DBML | Không có |
| Knowledge base | `docs/kb/ba/wiki/knowledge/feature/US-021-*.md`, `feature-summary/US-021-*.md`, `delivery/pbi/US-021-*.md`, `business-rule/BR-031-*.md`, `BR-032-*.md`, `ingestion/source-record/US-021-*.md`, `data/entity/ENT-004-*.md` + `ENT-005-*.md` + `business-rule/BR-025-*.md` (thêm liên kết US-021), `indexes/*`, `reports/wiki-health-report.md`, `docs/kb/ba/00-index.md`, `docs/kb/dev/wiki/US-021-*.md`, `docs/kb/dev/00-index.md` |
| Memory | `docs/memory/decisions.md` (`DEC-111`..`DEC-126`), `docs/memory/judgement-log.md` (`JDG-032`, `JDG-033`) |
| Artifact feature | `docs/features/US-021-tu-dien-thong-tin-job-link/{spec,plan,task,report}.md` |

> Các file `server/job-tracker/**` khác đang `M` trên working tree (`upsert-job-application.ts`, `domain/entities/job-application.ts`, `domain/repositories/job-application-repository.ts`, `domain/services/job-status-automation-service.ts`, `infrastructure/repositories/job-application-prisma-repository.ts`) và `prisma/schema.prisma` + migration `20260827150332_make_job_deadline_optional` thuộc đợt `DEC-119` (Ngày hết hạn không bắt buộc) — chưa commit, ngoài phạm vi US-021, không được US-021 chạm.

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — 0 lỗi | 2026-08-28 |
| `rtk npx prisma validate` | Passed — schema hợp lệ (không đổi) | 2026-08-28 |
| `rtk next build` | Passed — Errors: 0, Warnings: 0 | 2026-08-28 |
| `rtk vitest run` | N/A — dự án chưa cài framework test (`JDG-002`); thay bằng 27 smoke test thuần (`npx tsx`) cho 2 rule + service + parser + fetcher — **PASS toàn bộ** | 2026-08-28 |
| `rtk lint` | N/A — dự án chưa có ESLint config hoạt động (`next lint` dừng ở prompt cấu hình); hiện trạng có sẵn, không do US-021 | 2026-08-28 |

## 7. Review Findings

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 0 | Low | `components/JobTrackerBoard.tsx:72` (`LINK_FIELD_MESSAGES`) | Thông báo Platform khớp spec AC-05: "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới" | Codex ban đầu dựng "chưa lấy được Platform — mời chọn tay" | **Đã sửa** — `ssr-dev` đổi `LINK_FIELD_MESSAGES` thành đúng 3 chuỗi spec ngay trong stage `implement`; `tsc` xanh lại |
| F-02 | 0 | Low | Toàn bộ UI wiring `JobTrackerBoard.tsx` | 6 kịch bản Thủ công `plan.md` mục 12 chạy click-through thật trên trình duyệt | Chỉ xác nhận qua rà `git diff` line-by-line + 27 smoke test tầng server; Browser pane không compositing frames | **Còn mở** — rủi ro thấp; đề xuất chạy một lượt thủ công thật khi môi trường hỗ trợ. Không chặn giao hàng |
| F-03 | 0 | Low | `package.json` | `rtk lint` / `rtk vitest run` chạy được | Dự án chưa có ESLint config, chưa cài vitest (`JDG-002`) | **Còn mở (nợ hạ tầng có sẵn)** — không do US-021; bỏ qua theo tiền lệ các US trước |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | `read-job-link.ts` orchestrate fetch→parse JSON-LD→enrich; smoke test PASS từng thành phần; `buildReadLinkPatch` điền 3 ô trống. End-to-end URL ITViec thật chưa click-through (F-02) |
| AC-02 | Đạt | smoke `enrich` LinkedIn chặn nội dung → `platformId` vẫn suy từ tên miền, `missing=["company","deadline"]`; 2 thông báo đúng chuỗi |
| AC-03 | Đạt | `buildReadLinkPatch` chỉ set từng ô khi ô đó đang rỗng (`!form.company.trim()` / `!form.platformId.trim()` / `!form.deadline.trim()`) — ô Dylan đã nhập giữ nguyên (`DEC-116`) |
| AC-04 | Đạt | smoke `parseAbsoluteDeadline("Còn 5 ngày...")` → `null`; 1 thông báo "chưa lấy được Ngày hết hạn — mời chọn tay" |
| AC-05 | Đạt | smoke `matchPlatformByHostname` tên miền lạ → `null`; thông báo "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới" (khớp spec sau F-01); không tạo kênh mới |
| AC-06 | Đạt | smoke fetcher timeout/lỗi/host nội bộ → `null`; 3 ô trống + 3 thông báo; `validateJobForm` không đổi → job vẫn lưu được |
| AC-07 | Đạt | `lastReadLinkRef` khởi tạo từ `initialJobs[].link`; Link đổi → `readLinkFor` → `updateJobLocal` + `await commitJob(key, patch)` lưu; ô cũ giữ nguyên (rà code, F-02) |
| AC-08 | Đạt | `readLinkFor` guard `!/^https?:\/\//i.test(url) → return`; `validateJobForm` vẫn chặn lưu — hành vi US-018 nguyên vẹn |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-01` Ô "Link" (đổi hành vi) | Có | `JobLinkInput` `onBlur` → `readLinkFor` chỉ khi giá trị đổi (`DEC-125`); text Link không bị viết lại; validate `^https?://` giữ nguyên |
| `EL-02` "Đang lấy thông tin..." | Có | span `job-link-read-status` khi `readingLinkByKey[key]`; auto-clear 10s (`DEC-121`); không chặn ô input |
| `EL-03` Ô "Công ty" (tự điền nếu trống) | Có | `buildReadLinkPatch` company |
| `EL-04` Ô "Platform" (suy tên miền) | Có | `matchPlatformByHostname` (chứa tên kênh, không phân biệt hoa/thường — `DEC-124`); 0/≥2 khớp → trống; không tự tạo kênh (`DEC-118`) |
| `EL-05` Ô "Ngày hết hạn" (tự điền khi ngày đầy đủ) | Có | `parseAbsoluteDeadline` chỉ ngày đầy đủ (`DEC-124`); quá khứ vẫn điền (`DEC-126`); không bắt buộc (`DEC-119`); `JobDateInput` không đổi |
| `EL-06` Thông báo nhẹ trường chưa lấy được | Có | span `job-link-read-message` 1/trường trong `missing` & ô trống; auto-hide 5s; không hiện cho ô Dylan đã nhập |

## 8. Fix Rounds

Không có vòng fix nào. Số vòng đã dùng: 0/2.

F-01 được `ssr-dev` sửa ngay trong stage `implement` (trước phase TEST), không tính là fix round.

Finding bị từ chối: Không có.

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | Kịch bản click-through UI đầy đủ (AC-03/07/08 tương tác, `DEC-125` blur-không-đổi, chỉ báo hiện/tắt) chưa chạy bằng trình duyệt thật | Rủi ro | Chạy một lượt thủ công theo `plan.md` mục 12 khi Browser pane compositing được, hoặc trên máy có màn hình |
| 2 | Parser tách chuỗi thuần chưa fetch trang ITViec/VietnamWorks thật để xác nhận có JSON-LD `JobPosting` / OG tags đủ dùng (`JDG-033` "cái gì chứng minh nó sai") | Rủi ro | Kiểm khi có mạng; nếu HTML thô rỗng (trang render bằng JavaScript client), thêm `node-html-parser` (thư viện thuần, không gửi ra ngoài — vẫn thỏa `DEC-122`) hoặc chấp nhận tỉ lệ đọc thấp |
| 3 | Đợt `DEC-119` (Ngày hết hạn không bắt buộc) và toàn bộ artifact US-021 chưa commit | Nợ kỹ thuật | User commit khi sẵn sàng — US-021 xây trên nền `DEC-119`, nên commit cùng nhau hoặc `DEC-119` trước |
| 4 | `rtk lint` / `rtk vitest run` không chạy được trong dự án (F-03) | Nợ kỹ thuật (có sẵn) | Requirement riêng nếu muốn thêm ESLint config + vitest — ngoài phạm vi US-021 |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | Xóa 6 file mới (`server/job-tracker/domain/rules/job-platform-match-rule.ts`, `job-deadline-parse-rule.ts`, `domain/services/job-link-enrichment-service.ts`, `infrastructure/job-posting-fetcher.ts`, `job-posting-parser.ts`, `application/use-cases/read-job-link.ts`); `git checkout -- server/job-tracker/actions.ts components/JobTrackerBoard.tsx app/globals.css` để đưa về trạng thái sau `DEC-119` (lưu ý: `JobTrackerBoard.tsx` và `actions.ts` chứa cả thay đổi `DEC-119` — nếu chỉ muốn gỡ US-021 thì revert thủ công phần US-021, không revert cả file) |
| Migration SQLite | Không có migration cho US-021 — không cần hoàn tác |
| Dữ liệu đã backfill | Không có — luồng `readJobLink` không ghi DB |
| Artifact/wiki/memory US-021 | Xóa `docs/features/US-021-tu-dien-thong-tin-job-link/`, các trang wiki `*/US-021-*` + `BR-031`/`BR-032` + `docs/kb/dev/wiki/US-021-*`, revert các dòng `US-021`/`DEC-111`..`DEC-126`/`JDG-032`/`JDG-033` trong memory và index. Raw đã commit ở `9bf0f4f` |
