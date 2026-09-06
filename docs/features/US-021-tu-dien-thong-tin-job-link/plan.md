# Tự điền thông tin job từ link tin tuyển dụng — SE Plan

Status: Implemented
Feature: US-021
Spec: spec.md
Created: 2026-08-28
Updated: 2026-08-28
DEV Wiki: `docs/kb/dev/wiki/US-021-tu-dien-thong-tin-job-link.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Thêm một Server Action đọc-thuần `readJobLink(url)` vào bounded-context `server/job-tracker/`, và nối nó vào `components/JobTrackerBoard.tsx` ở sự kiện `blur` của ô Link (cả dòng thêm mới `DraftJobRow` và dòng sửa `JobRow`). Khi giá trị Link hợp lệ (`^https?://`) và khác giá trị đã đọc lần gần nhất cho dòng đó, client gọi `readJobLink`, hiện chỉ báo "Đang lấy thông tin...", rồi điền kết quả vào **các ô đang trống** (Công ty, Platform, Ngày hết hạn) — với dòng đã lưu thì commit patch đó luôn. Server tự `fetch` URL (Node `fetch` + `AbortSignal.timeout(~10s)`, 1 lần), bóc `company` + `deadline` từ dữ liệu có cấu trúc của trang (JSON-LD `JobPosting`, OpenGraph, thẻ tiêu đề trang), và suy `platformId` bằng cách so hostname với danh sách `JobPlatform` hiện có. Không đổi schema, không gọi dịch vụ ngoài, không ghi DB trong luồng đọc.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-021-tu-dien-thong-tin-job-link/spec.md` | Nguồn yêu cầu — 8 AC, luồng, Screen Element, mục 12/13 handoff |
| `docs/kb/ba/wiki/knowledge/feature/US-021-tu-dien-thong-tin-job-link.md` | Business rule `BR-031`/`BR-032`, quan hệ US-018/US-020 |
| `docs/kb/ba/wiki/delivery/pbi/US-021-tu-dien-thong-tin-job-link.md` | Bảng AC đã chốt |
| `docs/kb/dev/wiki/US-018-theo-doi-cv-ung-tuyen.md` | Kiến trúc job-tracker hiện có, contract Server Action |
| `docs/kb/dev/wiki/US-020-lich-su-trang-thai-job.md` | Luật `BR-025` (`computeAutomaticStatusUpdates`) — Ngày hết hạn tự điền là đầu vào |
| `app/roadmap/page.tsx` | Entry: Server Component gọi `getJobTrackerSnapshot()`, render `DylanPlanApp activeTab="roadmap"` |
| `components/JobTrackerBoard.tsx` | UI hiện tại — `DraftJobRow`, `JobRow`, `JobLinkInput`, `commitJob`, `saveDraft`, `validateJobForm`, `Toast` |
| `components/DylanPlanApp.tsx` (phần render `JobTrackerBoard`) | Xác nhận `JobTrackerBoard` nhận `initialJobs`/`initialPlatforms` từ `initialJobTracker` |
| `server/job-tracker/actions.ts` | Composition root — nơi thêm `readJobLink` và wiring |
| `server/job-tracker/application/use-cases/upsert-job-application.ts` | Luồng lưu hiện tại, `assertValidJobLink`, `deadline?: string \| null` (`DEC-119`) |
| `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts` | Cách đọc `jobPlatformRepository.findAll()` |
| `server/job-tracker/domain/entities/job-application.ts`, `job-platform.ts` | Kiểu `JobApplicationEntity` (`deadline: Date \| null`), `JobPlatformEntity` (`id`, `name`) |
| `server/job-tracker/domain/repositories/job-application-repository.ts` | Interface — `deadline: Date \| null` đã có |
| `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` | Cách map row → entity |
| `server/job-tracker/domain/rules/job-link-rule.ts` | `assertValidJobLink` — tái dùng để chặn link sai định dạng trước khi fetch |
| `server/job-tracker/domain/services/job-status-automation-service.ts` | `computeAutomaticStatusUpdates` — `job.deadline !== null && job.deadline < now` |
| `prisma/schema.prisma` | `JobApplication.deadline DateTime?` (`DEC-119`), `JobPlatform` |
| `lib/prisma.ts` | Prisma adapter better-sqlite3 — không liên quan đến luồng đọc (không ghi DB) |
| `docs/memory/decisions.md` (`DEC-088`, `DEC-111`..`DEC-126`, `DEC-004`, `DEC-086`) | Ràng buộc đã chốt |
| `docs/memory/rules.md` (kit R13 Light DDD) | Quy tắc tách lớp domain/application/infrastructure |
| `package.json` | Không có framework test (`vitest` chưa cài), không có thư viện parse HTML |
| `prisma migrate status` (lệnh) | Migration `20260827150332_make_job_deadline_optional` đã áp vào `dev.db` |

## 3. Hành Vi Hiện Tại

- `app/roadmap/page.tsx` (Server Component, `force-dynamic`) gọi `getJobTrackerSnapshot()` → truyền xuống `DylanPlanApp` → `JobTrackerBoard`.
- `JobTrackerBoard` là Client Component. Thêm job: `DraftJobRow` với `draft` state; sửa job: `JobRow` với `onBlur` từng ô gọi `commitJob(id)` → `updateJobApplication` (Server Action) → `refreshSnapshot()`.
- Ô Link: `JobLinkInput` — chỉ là một ô input thường; `validateJobForm` kiểm `^https?://` khi lưu; không có hành vi nào khác khi blur ngoài `onCommit()` (chỉ ở `JobRow`).
- Server Actions ở `server/job-tracker/actions.ts`: `getJobTrackerSnapshot`, `createJobApplication`, `updateJobApplication`, `deleteJobApplication`, `createJobPlatform`, `deleteJobPlatform`. Không có action nào gọi mạng ngoài.
- `upsert-job-application.ts`: bắt buộc `company`, `platformId`, `link`; `deadline` không bắt buộc (`deadlineRaw` rỗng → `deadline = null`) — `DEC-119`.
- `job-status-automation-service.ts` (`BR-025`): job "Interested" + `deadline !== null` + `deadline < now` → tự chuyển "Expired", tính ở `getJobTrackerSnapshot`.

## 4. Hành Vi Mục Tiêu

- Ô Link (`DraftJobRow` và `JobRow`): khi blur, nếu giá trị `^https?://` hợp lệ **và** khác giá trị đã gửi đọc lần gần nhất cho chính dòng đó → gọi Server Action mới `readJobLink(url)`.
- Trong lúc chờ: dòng job hiện chỉ báo "Đang lấy thông tin..." (`EL-02`); không chặn thao tác khác.
- Kết quả trả về `{ company, deadline, platformId, missing }`. Client điền vào **chỉ các ô đang trống**:
  - `company` (nếu ô Công ty trống và `result.company` có giá trị)
  - `platformId` (nếu ô Platform trống và `result.platformId` có giá trị)
  - `deadline` (nếu ô Ngày hết hạn trống và `result.deadline` có giá trị — dạng `YYYY-MM-DD`)
- Với `DraftJobRow`: `setDraft` patch. Với `JobRow` (job đã lưu): `onChange(patch)` + `onCommit(patch)` để lưu ngay.
- Với mỗi trường trong `missing` (không lấy được, và ô đang trống, và Dylan chưa nhập), hiện một thông báo nhẹ "chưa lấy được [tên trường] — mời nhập/chọn tay" (`EL-06`). Không hiện cho ô Dylan đã có giá trị.
- `readJobLink` thất bại toàn bộ (timeout/không mở được/HTML rỗng) → `company=null`, `deadline=null`, nhưng `platformId` vẫn suy được từ hostname; `missing = ["company","deadline"]` (và `"platform"` nếu hostname không khớp).
- Không đổi validate lưu, không đổi trường bắt buộc, không đổi luồng sửa inline của US-018. Ngày hết hạn quá khứ đầy đủ vẫn điền (`DEC-126`) — `BR-025` xử lý phần "Expired" như cũ.

## 5. Luồng End-To-End

```text
Entry: components/JobTrackerBoard.tsx  (Client Component)
  -> JobLinkInput onBlur  (DraftJobRow | JobRow)
  -> guard: /^https?:\/\//i test + url !== lastReadLink[key]
  -> setReadingLink(key); setLastReadLink(key, url)
  -> Server Action: server/job-tracker/actions.ts  readJobLink(url)
       -> application/use-cases/read-job-link.ts  createReadJobLinkUseCase({ jobPlatformRepository, jobPostingFetcher, jobPostingParser, jobLinkEnrichmentService })
            1. domain/rules/job-link-rule.ts  assertValidJobLink(url)   (sai định dạng -> ném lỗi, client bỏ qua)
            2. jobPlatformRepository.findAll()                          (đọc danh sách kênh — repo đã có)
            3. infrastructure/job-posting-fetcher.ts  fetchJobPostingHtml(url)
                 -> Node fetch(url, { signal: AbortSignal.timeout(10000), redirect: "follow", headers: { "User-Agent": ... } })
                 -> chặn host nội bộ sau redirect (localhost/127/10/172.16-31/192.168/169.254/::1) -> null
                 -> lỗi / not-ok / timeout -> null
            4. infrastructure/job-posting-parser.ts  parseJobPosting(html, url)
                 -> tách các khối script JSON-LD (type application/ld+json) -> tìm object @type "JobPosting" -> hiringOrganization.name, validThrough
                 -> fallback: thẻ meta og:site_name, thẻ meta author, thẻ tiêu đề trang
                 -> trả { companyText: string|null, deadlineText: string|null }
            5. domain/services/job-link-enrichment-service.ts  enrich({ url, parsed, platforms })
                 -> domain/rules/job-platform-match-rule.ts  matchPlatformByHostname(url, platforms)   (BR-032)
                 -> domain/rules/job-deadline-parse-rule.ts  parseAbsoluteDeadline(deadlineText)       (BR-031/DEC-124)
                 -> company = parsed.companyText?.trim() || null
                 -> missing = [] ; nếu !company -> push "company" ; nếu !platformId -> push "platform" ; nếu !deadline -> push "deadline"
                 -> return { company, deadline, platformId, missing }
       -> KHÔNG revalidatePath, KHÔNG ghi DB
  -> Client: nếu lastReadLink[key] vẫn === url (không bị ghi đè bởi lần blur mới):
       -> build patch chỉ gồm ô đang trống -> setDraft | (onChange(patch) + onCommit(patch))
       -> setLinkMessages(key, missing.map(fieldLabel))
       -> setReadingLink(null)
  -> UI state: ô được điền + dòng chỉ báo tắt + các dòng "chưa lấy được ..."
```

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| US-018 — bảng "Theo dõi CV ứng tuyển", các ô job, Server Actions job-tracker | Đọc thật `components/JobTrackerBoard.tsx`, `server/job-tracker/actions.ts`, cả bộ `server/job-tracker/**` — đều tồn tại và hoạt động | Không | Đã có sẵn |
| US-020 — luật `BR-025` tự chuyển "Expired" | Đọc thật `server/job-tracker/domain/services/job-status-automation-service.ts` — `deadline !== null && deadline < now` | Không | Chỉ đối chiếu, không sửa |
| `DEC-119` — Ngày hết hạn không bắt buộc | `prisma/schema.prisma` `deadline DateTime?`; `git status` cho thấy migration `20260827150332_make_job_deadline_optional` đã tạo; `rtk npx prisma migrate status` → "Database schema is up to date!"; `upsert-job-application.ts` xử lý `deadline` rỗng → `null`; `validateJobForm` không còn dòng deadline | Không — code đã xong trên working tree, DEV của US-021 chạy cùng working tree | Làm sau (đã có) |
| Framework test (`vitest`) | `package.json` — chưa cài, không có `*.test.ts` nào; `JDG-002` | Không chặn — theo tiền lệ các US trước, bước `SSR_CMD_TEST` ghi N/A | — |
| Thư viện parse HTML | `package.json` — không có `cheerio`/`node-html-parser` | Không chặn — dùng tách chuỗi/regex JSON-LD + meta, không thêm dependency (xem mục 13 rủi ro #3) | — |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | No | `app/roadmap/page.tsx` không đổi — vẫn `getJobTrackerSnapshot()` |
| Server Action | Yes | Thêm `readJobLink` vào `server/job-tracker/actions.ts` (additive, không breaking) |
| Route Handler (`app/api`) | N/A | Không dùng route handler — Server Action đủ |
| Auth / middleware / permission | No | Single-user, không đăng nhập (`DEC-004`) |
| Prisma schema | No | `DEC-113` — không đổi model/field/index |
| Migration SQLite | No | Không có migration cho US-021 |
| DBML | No | Không đổi schema |
| Seed data | No | Không đổi seed (`JobPlatform` mặc định do `default-job-platforms-service` đảm nhiệm, không đụng) |
| Caching / revalidate | No | `readJobLink` đọc-thuần, không `revalidatePath`; commit sau đó (`updateJobApplication`) đã revalidate như cũ |
| Export / báo cáo | No | Không liên quan |
| Mail / webhook / job nền | No | Không có |
| Knowledge base / memory | Yes | DEV wiki `docs/kb/dev/wiki/US-021-tu-dien-thong-tin-job-link.md` (tạo mới), `docs/kb/dev/00-index.md` (thêm dòng) |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry (Server Action) | `server/job-tracker/actions.ts` | Thêm `import` use-case + fetcher + parser + enrichment service; khởi tạo `readJobLinkUseCase` với `jobPlatformRepository` (đã có) + 3 thành phần mới; export `async function readJobLink(url: string)` trả về `Promise` của `JobLinkReadResult`; export type `JobLinkReadResult`, `JobLinkField` |
| Boundary (validation) | `server/job-tracker/domain/rules/job-link-rule.ts` | Không sửa — tái dùng `assertValidJobLink` trong use-case mới |
| Application (use-case) | `server/job-tracker/application/use-cases/read-job-link.ts` | **Mới**. `createReadJobLinkUseCase(deps)` orchestrate: validate link → `jobPlatformRepository.findAll()` → `fetcher.fetchJobPostingHtml` → `parser.parseJobPosting` → `enrichmentService.enrich` → trả `JobLinkReadResult`. Không ghi DB, không revalidate |
| Domain service | `server/job-tracker/domain/services/job-link-enrichment-service.ts` | **Mới**. `createJobLinkEnrichmentService()` với `enrich({ url, parsed, platforms })` — quy trình nghiệp vụ "suy thông tin job từ nội dung trang" (R13.4: có tên gọi khớp AC): áp `matchPlatformByHostname` + `parseAbsoluteDeadline`, lấy company, dựng danh sách `missing`. Thuần TS, test được không cần DB/mạng |
| Domain rule | `server/job-tracker/domain/rules/job-platform-match-rule.ts` | **Mới**. `matchPlatformByHostname(url, platforms)` trả về id kênh hoặc `null` — `BR-032`: hostname (lowercase) *chứa* tên kênh (lowercase, bỏ khoảng trắng) → id kênh đó; khớp 0 hoặc ≥2 kênh → `null` |
| Domain rule | `server/job-tracker/domain/rules/job-deadline-parse-rule.ts` | **Mới**. `parseAbsoluteDeadline(text)` trả về chuỗi ngày `YYYY-MM-DD` hoặc `null` — `BR-031`/`DEC-124`: chỉ nhận ngày đầy đủ ngày-tháng-năm (dạng ISO, `DD/MM/YYYY`, `DD tháng M[, ] YYYY`); "còn N ngày"/"tuyển gấp"/thiếu ngày → `null`. Ngày quá khứ vẫn trả (`DEC-126`) |
| Infrastructure | `server/job-tracker/infrastructure/job-posting-fetcher.ts` | **Mới**. `createJobPostingFetcher()` với `fetchJobPostingHtml(url)` trả về chuỗi HTML hoặc `null` — Node `fetch` + `AbortSignal.timeout(10_000)`, `redirect: "follow"`, header User-Agent; chặn host nội bộ (localhost/loopback/private/link-local) sau khi phân giải URL cuối; mọi lỗi/không-ok/timeout → `null` |
| Infrastructure | `server/job-tracker/infrastructure/job-posting-parser.ts` | **Mới**. `createJobPostingParser()` với `parseJobPosting(html, url)` trả về `{ companyText, deadlineText }` (mỗi trường là chuỗi hoặc `null`) — tách các khối script JSON-LD tìm `@type: "JobPosting"` (`hiringOrganization.name`, `validThrough`); fallback thẻ meta og:site_name, thẻ meta author, thẻ tiêu đề trang. Tách chuỗi/regex, không thêm dependency |
| Repository interface (domain) | `server/job-tracker/domain/repositories/job-platform-repository.ts` | Không sửa — `findAll()` đã đủ |
| Repository implementation (infrastructure) | `server/job-tracker/infrastructure/repositories/job-platform-prisma-repository.ts` | Không sửa |
| Data | `prisma/schema.prisma` | Không sửa (`DEC-113`) |
| UI | `components/JobTrackerBoard.tsx` | Thêm state: `readingLinkKey` (khóa dòng đang đọc hoặc `null`), `lastReadLink` (map khóa dòng → URL đã đọc gần nhất), `linkMessages` (map khóa dòng → mảng thông báo); hàm `readLinkFor(key, url, currentForm, applyPatch)`; `JobLinkInput` nhận thêm `onBlur` chạy `readLinkFor` (song song với `onCommit()` sẵn có ở `JobRow`); hiển thị "Đang lấy thông tin..." khi `readingLinkKey` bằng khóa dòng, và các dòng `linkMessages[key]` (inline dưới ô Link — xem mục 13 #6); import type `JobLinkReadResult` từ `@/server/job-tracker/actions` |
| UI (type) | `components/JobTrackerBoard.tsx` | `JobField`/`FieldErrors`/`validateJobForm` không đổi |
| Consumer | `components/DylanPlanApp.tsx` | Không sửa — chỉ truyền props xuống `JobTrackerBoard` như cũ |

## 9. Thay Đổi Data Model

Cần đổi schema: **Không**.

`DEC-113` chốt không thêm cột, không đổi cấu trúc. Luồng đọc chỉ cần:
- Danh sách kênh Platform để so hostname → `jobPlatformRepository.findAll()` đã tồn tại và trả `{ id, name, createdAt }[]`.
- Không đọc/ghi `JobApplication` trong luồng `readJobLink` — việc điền giá trị diễn ra ở client, việc lưu đi qua `updateJobApplication`/`createJobApplication` sẵn có (đã hỗ trợ `deadline` nullable từ `DEC-119`).

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `JobApplication` | Không đổi | — | — | — | Không |
| `JobPlatform` | Không đổi | — | — | — | Không |

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| Server Action `readJobLink` | Không có | `readJobLink(url: string)` (bất đồng bộ) trả về `JobLinkReadResult` — export từ `server/job-tracker/actions.ts` | Không (additive) |
| Type `JobLinkReadResult` | Không có | `{ company: string \| null; deadline: string \| null; platformId: string \| null; missing: JobLinkField[] }` — export từ `actions.ts` | Không |
| Type `JobLinkField` | Không có | `"company" \| "platform" \| "deadline"` | Không |
| `UpsertJobApplicationInput` | `{ id?, company, deadline?: string\|null, platformId, link, status?, note? }` | Không đổi | Không |
| Server Action `getJobTrackerSnapshot` / `createJobApplication` / `updateJobApplication` | như hiện tại | Không đổi | Không |
| Prop `JobLinkInput` (nội bộ component) | `{ error?, onBlur?, onChange, value }` | thêm dùng `onBlur` cho cả `DraftJobRow` (trước đây không truyền) | Không (nội bộ) |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `server/job-tracker/infrastructure/job-posting-fetcher.ts` | **Tạo mới** — fetch HTML có timeout 10s, chặn host nội bộ, trả `string \| null` |
| `server/job-tracker/infrastructure/job-posting-parser.ts` | **Tạo mới** — bóc `companyText`/`deadlineText` từ JSON-LD JobPosting + OG/meta/title |
| `server/job-tracker/domain/rules/job-platform-match-rule.ts` | **Tạo mới** — `matchPlatformByHostname` (`BR-032`) |
| `server/job-tracker/domain/rules/job-deadline-parse-rule.ts` | **Tạo mới** — `parseAbsoluteDeadline` (`BR-031`/`DEC-124`), nhận ngày đầy đủ, trả `YYYY-MM-DD` |
| `server/job-tracker/domain/services/job-link-enrichment-service.ts` | **Tạo mới** — `enrich()` gộp company + platform match + deadline parse + `missing[]` |
| `server/job-tracker/application/use-cases/read-job-link.ts` | **Tạo mới** — `createReadJobLinkUseCase(deps)` orchestrate, không ghi DB, không revalidate |
| `server/job-tracker/actions.ts` | Thêm wiring + export `readJobLink` + export type `JobLinkReadResult`, `JobLinkField` |
| `components/JobTrackerBoard.tsx` | Gọi `readJobLink` ở blur ô Link (chỉ khi giá trị đổi), điền ô trống, hiện chỉ báo + thông báo nhẹ, giữ nguyên toàn bộ validate/commit/inline sẵn có |
| `docs/kb/dev/wiki/US-021-tu-dien-thong-tin-job-link.md` | **Tạo mới** (bước này của `ssr-plan`) |
| `docs/kb/dev/00-index.md` | Thêm dòng US-021 (bước này của `ssr-plan`) |

## 12. Kế Hoạch Verification

Kết quả `ssr-dev` chạy thật 2026-08-28 (executor: Codex CLI; `ssr-dev` tự chạy lại):

| Bước | Lệnh | Kỳ vọng | Kết quả 2026-08-28 |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi | **Passed** — TypeScript: No errors found |
| Prisma | `rtk npx prisma validate` | schema hợp lệ | **Passed** — schema valid (không đổi) |
| Test | `rtk vitest run` | N/A — chưa cài framework test (`JDG-002`) | **N/A** — thay bằng 27 smoke test thuần (`npx tsx`) cho 2 rule + service + parser + fetcher, **PASS toàn bộ** |
| Lint | `rtk lint` | 0 lỗi | **N/A** — dự án chưa có ESLint config hoạt động (`next lint` dừng ở prompt cấu hình); hiện trạng có sẵn, không do US-021 |
| Build | `rtk next build` | pass | **Passed** — Errors: 0 \| Warnings: 0 |
| Thủ công 1 | Chạy dev, mở `/roadmap`, bấm "Thêm job", dán một URL job ITViec (trang công khai có JSON-LD JobPosting) vào ô Link, blur | Dòng hiện "Đang lấy thông tin..." rồi tắt; ô Platform = "ITViec", ô Công ty có tên công ty, ô Ngày hết hạn có ngày (nếu trang ghi ngày đầy đủ); không có thông báo "chưa lấy được" cho ô đã điền |
| Thủ công 2 | Dán một URL job LinkedIn vào ô Link của dòng mới, blur | Ô Platform = "LinkedIn"; ô Công ty + Ngày hết hạn trống; 2 thông báo "chưa lấy được Công ty", "chưa lấy được Ngày hết hạn" |
| Thủ công 3 | Gõ "ACME" vào ô Công ty trước, rồi dán URL ITViec vào Link, blur | Ô Công ty giữ "ACME" (không bị đè); Platform/Ngày hết hạn điền theo kết quả |
| Thủ công 4 | Với 1 job đã lưu, ô Ngày hết hạn trống — sửa ô Link sang URL mới có ngày, blur | Ngày hết hạn được điền và lưu (mở lại trang vẫn còn); Công ty/Platform cũ giữ nguyên |
| Thủ công 5 | Bấm vào ô Link rồi blur mà không sửa gì | Không hiện "Đang lấy thông tin...", không gọi lại |
| Thủ công 6 | Dán URL sai định dạng (`itviec.com/...` thiếu `https://`), blur/lưu | Không đọc; giữ nguyên lỗi định dạng của US-018 khi lưu |

Ghi chú `ssr-dev`: kịch bản Thủ công 1–6 yêu cầu click-through UI thật. `next dev` chạy OK, `/roadmap` render bảng "Theo dõi CV ứng tuyển". Không hoàn tất được click-through từng ô vì Browser pane không compositing frames trong môi trường verification hiện tại. Hành vi được xác nhận bằng: (a) rà `git diff` toàn bộ 3 file client/CSS + 6 file server, (b) 27 smoke test tầng server phủ AC-01/02/04/05/06 ở tầng logic, (c) `tsc`/`build` sạch. Đối chiếu AC/Screen Element độc lập chuyển cho `ssr-review` ở phase TEST.

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Fetch tới địa chỉ nội bộ (Dylan dán `http://localhost`, IP riêng, `169.254.169.254`) | Trung bình | `job-posting-fetcher` phân giải host, chặn loopback/private/link-local trước khi fetch và sau mỗi redirect; chỉ cho `http`/`https` | Xóa các file mới, gỡ export `readJobLink` |
| Trang tuyển dụng đổi cấu trúc → bóc sai Công ty/Ngày hết hạn âm thầm | Trung bình | Ưu tiên nguồn có cấu trúc (JSON-LD `JobPosting`, OG) hơn heuristic; `parseAbsoluteDeadline` chỉ nhận ngày đầy đủ rõ ràng (`DEC-124`); chỉ điền ô trống (`DEC-116`) nên Dylan luôn sửa được | — |
| LinkedIn / nền tảng chặn bot → đọc nội dung gần như luôn thất bại | Thấp (theo thiết kế) | `DEC-112` chấp nhận; fetcher trả `null` êm; Platform vẫn suy từ hostname (`JDG-032`); AC "đọc thành công" dùng ITViec/VietnamWorks | — |
| Gọi mạng ngoài làm chậm thao tác blur | Thấp | Timeout cứng 10s (`DEC-121`); luồng đọc bất đồng bộ, không chặn UI; commit lưu job không phụ thuộc kết quả đọc | — |
| Nhiều lần blur liên tiếp → phản hồi cũ ghi đè phản hồi mới | Thấp | Khi phản hồi về, so `lastReadLink[key]` với url đã gửi; khác thì bỏ qua phản hồi cũ | — |
| `rtk vitest run` fail vì chưa cài vitest | Thấp | Ghi N/A theo tiền lệ US trước; không coi là fail của US-021 | — |
| Toast hiện tại chỉ 1 message, cần nhiều dòng "chưa lấy được" | Thấp | Dùng chỉ báo inline trong dòng job (khớp ASCII Mockup spec mục 8.1) thay vì hàng đợi toast; giữ `Toast` cho lỗi cứng. `ssr-dev`/`swe-expert` quyết hình thức cuối, không đổi hành vi |
| Thư viện parse HTML: tách chuỗi/regex có thể không đủ cho vài trang | Thấp–Trung bình | Bắt đầu bằng JSON-LD + OG (đủ cho ITViec/VietnamWorks); nếu `ssr-dev` thấy cần, thêm `node-html-parser` (thư viện thuần, không gửi dữ liệu ra ngoài — vẫn thỏa `DEC-122`) là fallback, ghi vào task |

## 14. Phân Rã Task

Canonical task file: `task.md` (10 task, `ssr-breaker` 2026-08-28)

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | `domain/rules/job-platform-match-rule.ts` — `matchPlatformByHostname` (`BR-032`) | Pending |
| `TB-02` | `domain/rules/job-deadline-parse-rule.ts` — `parseAbsoluteDeadline` (`BR-031`/`DEC-124`/`DEC-126`) | Pending |
| `TB-03` | `domain/services/job-link-enrichment-service.ts` — `enrich()` gộp company + 2 rule + `missing[]` | Pending |
| `TB-04` | `infrastructure/job-posting-fetcher.ts` — fetch timeout 10s + chặn host nội bộ | Pending |
| `TB-05` | `infrastructure/job-posting-parser.ts` — bóc `companyText`/`deadlineText` từ JSON-LD + OG/meta/title | Pending |
| `TB-06` | `application/use-cases/read-job-link.ts` + wiring + export `readJobLink`/`JobLinkReadResult`/`JobLinkField` trong `actions.ts` | Pending |
| `TB-07` | `JobTrackerBoard.tsx` — trigger blur ô Link chỉ khi giá trị đổi (`DEC-125`) + điền ô trống (draft + job đã lưu) + chống phản hồi cũ | Pending |
| `TB-08` | `JobTrackerBoard.tsx` — chỉ báo "Đang lấy thông tin..." (`EL-02`) + thông báo nhẹ (`EL-06`) inline theo dòng | Pending |
| `TB-09` | Cập nhật DEV wiki US-021 mục 7 (Verification kết quả thật) + kiểm memory | Pending |
| `TB-10` | Verification cuối: `rtk tsc --noEmit` / `rtk lint` / `rtk next build` / `rtk npx prisma validate` + 6 kịch bản tay (plan mục 12) + evidence | Pending |

Readiness: Ready — spec `Ready for DEV`, `po-expert` Aligned, không đổi schema (`ssr-data` skip), mọi AC-01..AC-08 và contract đã map task (task.md mục 4), dependency acyclic, không còn câu hỏi chặn.
