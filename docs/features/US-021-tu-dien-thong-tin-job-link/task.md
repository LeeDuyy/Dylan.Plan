# Tự điền thông tin job từ link tin tuyển dụng — Phân Rã Task

Status: Implemented
Feature: US-021
Plan: plan.md
Spec: spec.md
Created: 2026-08-28
Updated: 2026-08-28
Owner: ssr-breaker

> Triển khai bởi `ssr-dev` (executor: Codex CLI 0.142.5) 2026-08-28. `ssr-dev` đối chiếu phạm vi + tự chạy lại toàn bộ verification, không dùng nguyên kết quả Codex tự báo. Một sai lệch nhỏ so với spec (thông báo nhẹ Platform) đã được `ssr-dev` sửa ngay: đổi từ "chưa lấy được Platform — mời chọn tay" sang đúng chuỗi spec AC-05 "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới".

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 8 tiêu chí chấp nhận AC-01..AC-08 (mục 7); Screen Element EL-01..EL-06 (mục 8); luồng và ngoại lệ (mục 6) |
| `plan.md` | Bản đồ source impact (mục 8), contract mới (mục 10), impact checklist (mục 7), luồng end-to-end (mục 5), phác thảo TB-01..TB-09 (mục 14), rủi ro (mục 13) |
| `data-model.md` | Không áp dụng — `DEC-113`, không đổi schema (`plan.md` mục 9: `schemaChangeRequired=false`) |
| `docs/kb/dev/wiki/US-021-tu-dien-thong-tin-job-link.md` | Ranh giới lớp Light DDD, contract, luồng end-to-end |

## 2. Breakdown Summary

- Phạm vi: thêm Server Action đọc-thuần `readJobLink(url)` trong `server/job-tracker/` (6 file mới theo 3 lớp domain/application/infrastructure) và nối vào `components/JobTrackerBoard.tsx` ở blur ô Link. Không đổi Prisma schema, không migration, không gọi dịch vụ bên thứ ba.
- Phụ thuộc chặn: Không. US-018/US-020 đã Implemented; `DEC-119` (Ngày hết hạn nullable) đã có trên working tree (`prisma migrate status` = up to date). DEV chạy trên cùng working tree.
- Số task: 10
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | `matchPlatformByHostname(url, platforms)` trả về id kênh khi hostname (lowercase) chứa tên một kênh (lowercase, bỏ khoảng trắng); trả `null` khi khớp 0 hoặc ≥2 kênh; URL không phân giải được host → `null` | `server/job-tracker/domain/rules/job-platform-match-rule.ts` (mới) | None | `BR-032`; AC-01, AC-02, AC-05 | `rtk tsc --noEmit` 0 lỗi; đọc lại file xác nhận hàm thuần, không import Prisma/infrastructure (R13.2); thử tay trong REPL/`node -e` với `itviec.com`, `careers.itviec.com`, `itviec.com.vn`, `example.com`, hostname khớp 2 kênh giả định | Done | `tsc --noEmit` 0 lỗi (2026-08-28). Smoke test (`npx tsx`, `ssr-dev` tự chạy): 6/6 PASS — `itviec.com`→`p-it`, `careers.itviec.com`→`p-it`, `itviec.com.vn`→`p-it`, `www.linkedin.com`→`p-li`, `example.com`→`null`, `"not a url"`→`null`. File chỉ import type `JobPlatformEntity`, không import Prisma/infrastructure. |
| `TB-02` | `parseAbsoluteDeadline(text)` trả về `YYYY-MM-DD` khi `text` là ngày đầy đủ ngày-tháng-năm (dạng ISO, `DD/MM/YYYY`, `DD tháng M[, ] YYYY`); trả `null` với "còn N ngày", "tuyển gấp", chỉ tháng/năm, chuỗi rỗng, `null`; ngày ở quá khứ vẫn trả đúng (`DEC-126`) | `server/job-tracker/domain/rules/job-deadline-parse-rule.ts` (mới) | None | `BR-031`, `DEC-124`, `DEC-126`; AC-01, AC-04, AC-07 | `rtk tsc --noEmit` 0 lỗi; hàm thuần không import Prisma; thử tay các chuỗi: `"2026-09-30"`, `"30/09/2026"`, `"Hạn nộp: 30 tháng 9, 2026"`, `"Còn 5 ngày"`, `"tuyển gấp"`, `"09/2026"`, `"2020-01-01"` (quá khứ) | Done | `tsc --noEmit` 0 lỗi. Smoke test 10/10 PASS: `2026-09-30`→`2026-09-30`, `30/09/2026`→`2026-09-30`, `"...30 tháng 9, 2026"`→`2026-09-30`, `"September 30, 2026"`→`2026-09-30`, `"Còn 5 ngày..."`→`null`, `"tuyển gấp"`→`null`, `"09/2026"`→`null`, `""`→`null`, `null`→`null`, `"2020-01-01"` (quá khứ, `DEC-126`)→`2020-01-01`. Hàm thuần, chỉ dùng `new Date(Date.UTC(...))` để validate ngày thật. |
| `TB-03` | `createJobLinkEnrichmentService().enrich({ url, parsed, platforms })` trả `{ company, deadline, platformId, missing }`: `company` = `parsed.companyText` trim hoặc `null`; `deadline` = `parseAbsoluteDeadline(parsed.deadlineText)`; `platformId` = `matchPlatformByHostname(url, platforms)`; `missing` chứa `"company"`/`"platform"`/`"deadline"` cho từng trường `null` | `server/job-tracker/domain/services/job-link-enrichment-service.ts` (mới) | `TB-01`, `TB-02` | `BR-031`, `BR-032`; AC-01, AC-02, AC-04, AC-05 | `rtk tsc --noEmit` 0 lỗi; service thuần không import Prisma/infrastructure/mạng (R13.2, R13.3); thử tay: parsed đầy đủ → `missing` rỗng; parsed rỗng + hostname khớp → `missing=["company","deadline"]`; parsed rỗng + hostname không khớp → `missing=["company","platform","deadline"]` | Done | `tsc --noEmit` 0 lỗi. Smoke test 3/3 PASS đúng như mô tả: full → `{company:"Tech Corp",deadline:"2026-09-30",platformId:"p-it",missing:[]}`; LinkedIn chặn nội dung → `missing:["company","deadline"]` (Platform vẫn suy từ tên miền); tên miền lạ → `missing:["company","platform","deadline"]`. Service chỉ import 2 rule + entity type, không import Prisma/infrastructure/mạng (R13.2/R13.3). |
| `TB-04` | `createJobPostingFetcher().fetchJobPostingHtml(url)` trả chuỗi HTML khi fetch thành công (status ok, host công khai); trả `null` khi: quá 10 giây (`AbortSignal.timeout(10_000)`), status không ok, lỗi mạng, host là loopback/`127.0.0.0/8`/`10/8`/`172.16-31`/`192.168/16`/`169.254/16`/`::1`/`localhost`, hoặc scheme không phải http/https (kể cả sau redirect) | `server/job-tracker/infrastructure/job-posting-fetcher.ts` (mới) | None | Contract `fetchJobPostingHtml`; `DEC-121`, `DEC-122`; AC-02, AC-06 | `rtk tsc --noEmit` 0 lỗi; đọc lại xác nhận có `AbortSignal.timeout`, chặn host nội bộ, header User-Agent, không import thư viện ngoài; thử tay `node -e` fetch một URL công khai (trả HTML) và `http://localhost:9/` (trả `null` nhanh) | Done | `tsc --noEmit` 0 lỗi. Smoke test 5/5 PASS chặn host nội bộ: `http://localhost:9`→`null`, `http://127.0.0.1:9`→`null`, `http://192.168.1.1`→`null`, `http://169.254.169.254`→`null`, `ftp://example.com`→`null`. Đọc lại file: `AbortSignal.timeout(10_000)`, `MAX_HTML_BYTES=2MB` streaming reader, kiểm cả URL ban đầu và `response.url` sau redirect, header User-Agent trình duyệt, mọi lỗi/`!ok`/timeout → `null`. Không import thư viện ngoài. |
| `TB-05` | `createJobPostingParser().parseJobPosting(html, url)` trả `{ companyText, deadlineText }`: đọc khối script `application/ld+json`, tìm object `@type: "JobPosting"` → `hiringOrganization.name`, `validThrough`; fallback thẻ meta `og:site_name`/`author`, thẻ tiêu đề trang; trả `null` cho trường không tìm thấy; HTML rỗng/null → cả hai `null` | `server/job-tracker/infrastructure/job-posting-parser.ts` (mới) | None | Contract `parseJobPosting`; `JDG-033`; AC-01, AC-04 | `rtk tsc --noEmit` 0 lỗi; không thêm dependency (`package.json` không đổi); thử tay với HTML mẫu chứa JSON-LD JobPosting, HTML chỉ có OG tags, HTML rỗng | Done | `tsc --noEmit` 0 lỗi. Smoke test 3/3 PASS: HTML có khối script JSON-LD (type application/ld+json) `@type JobPosting` → `{companyText:"Tech Corp",deadlineText:"2026-09-30"}`; HTML chỉ có `og:site_name` + title → `{companyText:"ACME Corp",deadlineText:null}`; HTML rỗng → `{companyText:null,deadlineText:null}`. Đọc code: đệ quy tìm `JobPosting` trong mảng/`@graph`, giải mã HTML entities, không thêm dependency (`package.json` không đổi — `git status`). |
| `TB-06` | Server Action `readJobLink(url)` hoạt động: `assertValidJobLink` (link sai định dạng → ném lỗi, không fetch), `jobPlatformRepository.findAll()`, fetch → parse → `enrich` → trả `JobLinkReadResult`; KHÔNG `revalidatePath`, KHÔNG ghi DB. `actions.ts` export `readJobLink`, type `JobLinkReadResult`, `JobLinkField` | `server/job-tracker/application/use-cases/read-job-link.ts` (mới); `server/job-tracker/actions.ts` (wiring + export) | `TB-03`, `TB-04`, `TB-05` | Contract `readJobLink` / `JobLinkReadResult` / `JobLinkField` (plan mục 10); AC-01, AC-08; impact "Server Action" | `rtk tsc --noEmit` 0 lỗi; đọc lại `read-job-link.ts` xác nhận không có `revalidatePath`/`prisma.*.create|update|delete`; use-case chỉ orchestrate (R13.3); `actions.ts` export đủ 3 tên mới | Done | `tsc --noEmit` 0 lỗi; `next build` 0 lỗi 0 cảnh báo. Đọc `read-job-link.ts`: `assertValidJobLink` gọi trước fetch, không có `revalidatePath`, không gọi `prisma.jobApplication.*`, chỉ orchestrate. `actions.ts` (`git diff`): +19 dòng additive — thêm `readJobLink(url)` (async) trả `JobLinkReadResult`, export type `JobLinkField`/`JobLinkReadResult`; wiring qua factory pattern như các use-case sẵn có; không đổi các action cũ. |
| `TB-07` | Ô Link ở `DraftJobRow` và `JobRow`: khi blur, nếu `^https?://` hợp lệ VÀ giá trị khác `lastReadLink[key]` → gọi `readJobLink`, khi kết quả về (và `lastReadLink[key]` vẫn bằng url đã gửi) điền patch CHỈ các ô đang trống (Công ty/Platform/Ngày hết hạn). Draft → `setDraft`; job đã lưu → `onChange(patch)` + `onCommit(patch)`. Bấm vào ô rồi rời không sửa gì → không gọi (`DEC-125`) | `components/JobTrackerBoard.tsx` (state `readingLinkKey`, `lastReadLink`, hàm `readLinkFor`; `JobLinkInput` `onBlur` ở cả hai row) | `TB-06` | AC-01, AC-03, AC-06, AC-07, AC-08; `DEC-116`, `DEC-119`, `DEC-125` | `rtk tsc --noEmit` 0 lỗi; `rtk lint` 0 lỗi; chạy dev, kịch bản AC-01 (điền 3 ô), AC-03 (gõ Công ty trước → không bị đè), AC-07 (job đã lưu, sửa link → Ngày hết hạn điền + lưu), AC-08 (link thiếu `https://` → không gọi), kịch bản `DEC-125` (blur không sửa → không gọi) | Done | `tsc --noEmit` 0 lỗi; `next build` 0 lỗi 0 cảnh báo; `lint` = N/A (dự án chưa có ESLint config hoạt động — `next lint` prompt cấu hình; giống tiền lệ các US trước). Rà `git diff components/JobTrackerBoard.tsx`: `readLinkFor(key, rawLink)` guard `!/^https?:\/\//i.test(url) \|\| lastReadLinkRef.current[key] === url → return` (AC-08 + `DEC-125`); `lastReadLinkRef` khởi tạo từ `initialJobs` (job đã lưu chỉ đọc khi Link đổi); `buildReadLinkPatch` chỉ set `company`/`platformId`/`deadline` khi ô tương ứng `!trim()` (AC-03 + `DEC-116`); stale-guard so `currentForm.link.trim() !== url \|\| lastReadLinkRef.current[key] !== url`; draft → `setDraft`, job đã lưu → `updateJobLocal` + `await commitJob(key, patch)` (AC-07 lưu). Dev server `plan.localhost:56388/roadmap` render bảng OK. Click-through từng ô không kiểm được đầy đủ vì Browser pane không compositing frames — hành vi xác nhận qua rà code + smoke test tầng server. |
| `TB-08` | Trong lúc đọc: dòng job hiện "Đang lấy thông tin..." (`EL-02`, inline theo dòng, không chặn thao tác, tự tắt khi xong/quá 10s). Sau khi đọc: mỗi trường trong `missing` mà ô đang trống → một dòng "chưa lấy được [Công ty/Platform/Ngày hết hạn] — mời nhập/chọn tay" (`EL-06`, inline dưới ô Link, tự biến mất sau vài giây); không hiện cho ô Dylan đã nhập | `components/JobTrackerBoard.tsx` (render theo `readingLinkKey`, `linkMessages[key]`) | `TB-06` | AC-02, AC-04, AC-05, AC-06; `EL-02`, `EL-06`; `DEC-114` | `rtk tsc --noEmit` 0 lỗi; `rtk lint` 0 lỗi; chạy dev, kịch bản AC-02 (LinkedIn → Platform điền, 2 thông báo Công ty + Ngày hết hạn), AC-04 ("còn 5 ngày" → 1 thông báo Ngày hết hạn), AC-05 (tên miền lạ → 1 thông báo Platform), AC-06 (timeout → 3 thông báo); xác nhận chỉ báo hiện rồi tắt | Done | `tsc --noEmit` 0 lỗi; `next build` 0 lỗi 0 cảnh báo. **Sai lệch spec đã sửa bởi `ssr-dev`:** Codex ban đầu dựng thông báo Platform là "chưa lấy được Platform — mời chọn tay"; spec AC-05 yêu cầu "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới" → `ssr-dev` đổi `LINK_FIELD_MESSAGES` thành đúng 3 chuỗi spec (`tsc` xanh lại). Rà code: `EL-02` render một span "Đang lấy thông tin..." (class `job-link-read-status`) khi `readingLinkByKey[key]`, tự tắt sau `LINK_READING_TTL_MS=10s`; `EL-06` render một span (class `job-link-read-message`) cho mỗi `linkMessages[key]`, tự ẩn sau `LINK_MESSAGE_TTL_MS=5s`; `buildReadLinkMessages` lọc `missing` theo `isLinkFieldEmpty(form, field)` (không hiện cho ô Dylan đã nhập — `DEC-114`/spec EL-06). CSS `.job-link-read-status`/`.job-link-read-message` thêm ở `app/globals.css` (+15 dòng, dùng var `--muted`/`--warning`). Số lượng thông báo khớp `missing` — xác nhận qua smoke test `enrich`. |
| `TB-09` | DEV wiki US-021 mục 7 (Verification) cập nhật kết quả thật (`tsc`/`lint`/`build`/`prisma validate`, ngày); xác nhận không phát sinh `DEC`/`JDG` mới ngoài `DEC-111`..`DEC-126` + `JDG-032`/`JDG-033` đã ghi (nếu có phát sinh khi code thì `ssr-dev` ghi bổ sung) | `docs/kb/dev/wiki/US-021-tu-dien-thong-tin-job-link.md`; `docs/memory/*` (chỉ kiểm, ghi nếu phát sinh) | `TB-07`, `TB-08` | impact "Knowledge base / memory" (plan mục 7) | Đọc lại DEV wiki mục 7 có ngày và kết quả `Passed`/`Failed` thật, không còn "Chưa chạy" | Done | DEV wiki `docs/kb/dev/wiki/US-021-tu-dien-thong-tin-job-link.md` mục 7 cập nhật: `tsc` Passed, `next build` Passed, `prisma validate` Passed (2026-08-28), `lint` N/A, `vitest` N/A. `Status: Active`. Memory: không phát sinh `DEC` hay `JDG` mới khi code — `DEC-111`..`DEC-126` + `JDG-032`/`JDG-033` đã đủ. Việc sửa chuỗi thông báo Platform là chỉnh cho khớp spec, không phải đánh đổi kỹ thuật, ghi thẳng vào task.md TB-08 + report. |
| `TB-10` | Verification cuối toàn feature: `rtk tsc --noEmit` 0 lỗi, `rtk lint` 0 lỗi, `rtk next build` pass, `rtk npx prisma validate` hợp lệ; `rtk vitest run` = N/A (`JDG-002`, không có framework test); chạy tay đủ 6 kịch bản `plan.md` mục 12; ghi evidence từng bước | `docs/features/US-021-tu-dien-thong-tin-job-link/` (evidence trong task.md/report) | `TB-07`, `TB-08`, `TB-09` | Toàn bộ AC-01..AC-08; plan mục 12 | Chạy 4 lệnh + 6 kịch bản tay, dán output/quan sát vào cột Evidence | Done (với ghi chú) | `rtk tsc --noEmit` → **0 lỗi**. `rtk next build` → **Errors: 0 \| Warnings: 0**. `rtk npx prisma validate` → **valid** (schema không đổi). `rtk vitest run` → **N/A** (`JDG-002` — dự án chưa cài framework test). `rtk lint` → **N/A** (dự án chưa có ESLint config hoạt động; `next lint` dừng ở prompt cấu hình — hiện trạng có sẵn, không phải do US-021). Kịch bản tay: server `next dev` chạy OK, `/roadmap` render bảng "Theo dõi CV ứng tuyển"; 27 smoke test tầng server (`matchPlatformByHostname`, `parseAbsoluteDeadline`, `enrich`, `parseJobPosting`, `fetchJobPostingHtml` chặn host nội bộ) **PASS toàn bộ** — phủ AC-01/02/04/05/06 ở tầng logic. Kịch bản click-through UI đầy đủ (AC-03/07/08 tương tác) chưa chạy được vì Browser pane không compositing frames trong môi trường verification; hành vi xác nhận qua rà `git diff` + smoke test. Chuyển sang phase TEST để `ssr-review` đối chiếu AC/Element độc lập. |

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (đọc thành công 3 trường từ link ITViec) | `TB-01`, `TB-02`, `TB-03`, `TB-04`, `TB-05`, `TB-06`, `TB-07` | End-to-end happy path |
| AC-02 (LinkedIn chặn nội dung → Platform vẫn suy, 2 thông báo) | `TB-01`, `TB-04`, `TB-08` | Suy Platform không cần mở trang |
| AC-03 (không ghi đè ô Dylan đã gõ — Công ty + Platform) | `TB-07` | `DEC-116` — chỉ điền ô trống |
| AC-04 ("Còn 5 ngày" → Ngày hết hạn để trống + báo nhẹ) | `TB-02`, `TB-03`, `TB-08` | `DEC-124` — chỉ ngày đầy đủ |
| AC-05 (tên miền không khớp kênh nào → Platform để trống + báo nhẹ) | `TB-01`, `TB-03`, `TB-08` | `DEC-118`, `DEC-124` |
| AC-06 (không mở được trang/quá 10s → 3 ô trống + 3 báo nhẹ, vẫn lưu được) | `TB-04`, `TB-07`, `TB-08` | Timeout + non-blocking |
| AC-07 (job đã lưu, sửa Link mới → Ngày hết hạn điền vì đang trống, ô khác giữ nguyên) | `TB-07` | `DEC-116`, `DEC-120` |
| AC-08 (Link thiếu `http(s)://` → không mở đường dẫn, giữ lỗi định dạng US-018) | `TB-06`, `TB-07` | Tái dùng `assertValidJobLink` / `validateJobForm` |
| Contract `readJobLink` (Server Action) | `TB-06` | additive, non-breaking |
| Contract `JobLinkReadResult` / `JobLinkField` (type) | `TB-06` | export từ `actions.ts` |
| Impact "Server Action" = Yes (plan mục 7) | `TB-06` | — |
| Impact "Knowledge base / memory" = Yes (plan mục 7) | `TB-09` | DEV wiki verification + kiểm memory |
| `EL-01` ô Link (đổi hành vi) | `TB-07` | — |
| `EL-02` chỉ báo "Đang lấy thông tin..." | `TB-08` | — |
| `EL-03` ô Công ty (tự điền nếu trống) | `TB-07` | — |
| `EL-04` ô Platform (tự chọn theo tên miền) | `TB-07` | — |
| `EL-05` ô Ngày hết hạn (tự điền nếu trống + ngày đầy đủ) | `TB-07` | — |
| `EL-06` thông báo nhẹ trường chưa lấy được | `TB-08` | — |
| `DEC-125` (chỉ đọc khi giá trị Link đổi) | `TB-07` | — |
| Verification cuối | `TB-10` | — |

## 5. Thứ Tự Dependency

1. `TB-01`, `TB-02`, `TB-04`, `TB-05` — song song, không phụ thuộc nhau (module lá)
2. `TB-03` — sau `TB-01`, `TB-02`
3. `TB-06` — sau `TB-03`, `TB-04`, `TB-05`
4. `TB-07`, `TB-08` — sau `TB-06` (có thể song song; cùng file nên khuyến nghị tuần tự `TB-07` → `TB-08`)
5. `TB-09` — sau `TB-07`, `TB-08`
6. `TB-10` — sau `TB-09` (cổng cuối)

Không có vòng lặp.

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task (Server Action → TB-06; Knowledge base/memory → TB-09; các ô `No`/`N/A` không cần task).
- [x] Mọi tiêu chí chấp nhận (AC-01..AC-08) đều map tới ít nhất một task — xem mục 4.
- [x] Dependency có thứ tự và không vòng lặp — xem mục 5.
- [x] Mỗi task có cách verification riêng (không phải "chạy build" chung — riêng TB-10 là verification cuối).
- [x] Cập nhật knowledge base (TB-09), memory (TB-09 kiểm/ghi bổ sung) và verification cuối (TB-10) là task tường minh.
- [x] Không task nào gộp các thay đổi cần verify độc lập (TB-07 hành vi điền, TB-08 chỉ báo/thông báo — tách vì quan sát và rollback khác nhau).
- [x] Không task nào cần đọc source mới hiểu được kết quả mong đợi.
- [x] Số task 10 ≤ `SSR_MAX_TASKS_PER_FEATURE` (40).
- [x] Không có ID cũ (task.md lần đầu).
- [x] `plan.md` mục 14 đã đồng bộ.

## 7. Blocker Và Câu Hỏi Mở

- Không có blocker.
- Ghi chú cho `ssr-dev`: nếu `job-posting-parser.ts` bằng tách chuỗi thuần không đủ cho ITViec/VietnamWorks (trang render bằng JavaScript, HTML thô rỗng — xem `JDG-033` "cái gì sẽ chứng minh nó sai"), thêm `node-html-parser` (thư viện thuần, không gửi dữ liệu ra ngoài — vẫn thỏa `DEC-122`) và ghi vào Evidence của `TB-05`; không cần quay lại `ssr-plan`.
- Ghi chú: `rtk vitest run` sẽ báo lỗi "vitest not found" — coi là N/A theo `JDG-002` và tiền lệ các US trước, không tính là fail của `TB-10`.
