---
status: Active
feature: US-021
updated: 2026-08-28
plan: docs/features/US-021-tu-dien-thong-tin-job-link/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-021-tu-dien-thong-tin-job-link.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-021", "Tự điền thông tin job từ link (DEV)"]
---

# US-021 — Tự điền thông tin job từ link tin tuyển dụng (DEV)

## 1. Tổng Quan Kỹ Thuật

Một Server Action đọc-thuần `readJobLink(url)` trong bounded-context `server/job-tracker/` (Light DDD). Client `components/JobTrackerBoard.tsx` gọi action này ở sự kiện blur của ô Link (dòng thêm mới và dòng sửa) khi giá trị Link hợp lệ và khác lần đọc gần nhất. Action: validate link → đọc danh sách `JobPlatform` → `fetch` HTML của URL (Node `fetch` + `AbortSignal.timeout(10s)`, 1 lần, chặn host nội bộ) → bóc `company`/`deadline` từ dữ liệu có cấu trúc của trang (JSON-LD `JobPosting`, OpenGraph, thẻ tiêu đề) → suy `platformId` bằng cách so hostname với tên các kênh → trả `{ company, deadline, platformId, missing }`. Client điền kết quả vào các ô đang trống, hiện chỉ báo "Đang lấy thông tin..." và các thông báo nhẹ "chưa lấy được ...". Không đổi Prisma schema (`DEC-113`), không ghi DB trong luồng đọc, không gọi dịch vụ bên thứ ba (`DEC-122`).

## 2. Luồng End-To-End

```text
JobTrackerBoard (Client) blur ô Link
  -> guard ^https?:// + url khác lastReadLink[key]
  -> Server Action readJobLink(url)  [server/job-tracker/actions.ts]
  -> use-case read-job-link  [application]
       -> assertValidJobLink  [domain/rules/job-link-rule.ts]
       -> jobPlatformRepository.findAll()  [infrastructure]
       -> jobPostingFetcher.fetchJobPostingHtml(url)  [infrastructure]  (Node fetch, timeout 10s, chặn host nội bộ)
       -> jobPostingParser.parseJobPosting(html, url)  [infrastructure]  (JSON-LD JobPosting + OG/meta/title)
       -> jobLinkEnrichmentService.enrich({ url, parsed, platforms })  [domain/services]
            -> matchPlatformByHostname  [domain/rules/job-platform-match-rule.ts]  (BR-032)
            -> parseAbsoluteDeadline  [domain/rules/job-deadline-parse-rule.ts]  (BR-031/DEC-124)
       -> KHÔNG revalidatePath, KHÔNG ghi DB
  -> Client điền patch (chỉ ô trống) -> setDraft | (onChange + onCommit) ; hiện linkMessages
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry | `app/roadmap/page.tsx` | Server Component, `force-dynamic` — không đổi. Client `components/JobTrackerBoard.tsx` là nơi phát sinh gọi `readJobLink` |
| Auth | — | Single-user, không đăng nhập/phân quyền (`DEC-004`) |
| Validation | `server/job-tracker/domain/rules/job-link-rule.ts` | Tái dùng `assertValidJobLink` (chuỗi phải bắt đầu `http://`/`https://`) trước khi fetch |
| Application | `server/job-tracker/application/use-cases/read-job-link.ts` | **Mới** — `createReadJobLinkUseCase(deps)` orchestrate, không ghi DB |
| Domain | `server/job-tracker/domain/services/job-link-enrichment-service.ts` | **Mới** — quy trình nghiệp vụ "suy thông tin job từ nội dung trang" (R13.3/R13.4) |
| Domain | `server/job-tracker/domain/rules/job-platform-match-rule.ts`, `job-deadline-parse-rule.ts` | **Mới** — 2 rule thuần, test được không cần DB/mạng |
| Infrastructure | `server/job-tracker/infrastructure/job-posting-fetcher.ts`, `job-posting-parser.ts` | **Mới** — I/O mạng ngoài + bóc HTML; không import Prisma |
| Infrastructure | `server/job-tracker/infrastructure/repositories/job-platform-prisma-repository.ts` | Không đổi — dùng `findAll()` sẵn có |
| Data | `prisma/schema.prisma` | Không đổi (`DEC-113`). `JobApplication.deadline` đã là `DateTime?` (`DEC-119`) |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Page | `app/roadmap/page.tsx` | Server Component gọi `getJobTrackerSnapshot()`, render `DylanPlanApp activeTab="roadmap"` — không đổi |
| Server Action | `server/job-tracker/actions.ts` | Thêm export `readJobLink` + type `JobLinkReadResult`, `JobLinkField`; wiring composition |
| Component | `components/JobTrackerBoard.tsx` | Gọi `readJobLink` ở blur ô Link; điền ô trống; chỉ báo + thông báo nhẹ |
| Component | `components/DylanPlanApp.tsx` | Truyền props xuống `JobTrackerBoard` — không đổi |
| Use-case (Application) | `server/job-tracker/application/use-cases/read-job-link.ts` | **Mới** — orchestrate đọc link |
| Domain service | `server/job-tracker/domain/services/job-link-enrichment-service.ts` | **Mới** — `enrich()` gộp company + match platform + parse deadline + `missing[]` |
| Domain rule | `server/job-tracker/domain/rules/job-platform-match-rule.ts` | **Mới** — `matchPlatformByHostname` (`BR-032`) |
| Domain rule | `server/job-tracker/domain/rules/job-deadline-parse-rule.ts` | **Mới** — `parseAbsoluteDeadline` (`BR-031`/`DEC-124`) |
| Domain rule | `server/job-tracker/domain/rules/job-link-rule.ts` | Tái dùng `assertValidJobLink` — không đổi |
| Infrastructure | `server/job-tracker/infrastructure/job-posting-fetcher.ts` | **Mới** — fetch HTML có timeout, chặn host nội bộ |
| Infrastructure | `server/job-tracker/infrastructure/job-posting-parser.ts` | **Mới** — bóc `companyText`/`deadlineText` từ HTML |
| Repository | `server/job-tracker/infrastructure/repositories/job-platform-prisma-repository.ts` | `findAll()` — không đổi |
| Type | `server/job-tracker/application/use-cases/upsert-job-application.ts` | `UpsertJobApplicationInput` (`deadline?: string \| null`) — không đổi, client dùng để lưu sau khi điền |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `JobApplication` | `company`, `deadline` (`DateTime?` — `DEC-119`), `platformId`, `link` | `@@index([platformId])` | `platform JobPlatform @relation(onDelete: Restrict)` |
| `JobPlatform` | `id`, `name` | — | `jobApplications JobApplication[]` |

- Migration liên quan: **Không có cho US-021**. Migration nền `prisma/migrations/20260827150332_make_job_deadline_optional/` (thuộc `DEC-119`) đã áp vào `dev.db` (`prisma migrate status` → "up to date"), chưa commit.
- DBML đã đồng bộ: Có — `docs/db/schema.dbml` (đã cập nhật cho `DEC-119`).
- Lưu ý SQLite: `status` lưu dạng String (8 giá trị cố định trong `JOB_APPLICATION_STATUSES`); không đụng tới trong US-021.

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| `readJobLink(url: string)` (Server Action, bất đồng bộ) | Trả về `JobLinkReadResult`; validate link, fetch + parse + suy platform; không ghi DB, không revalidate | `components/JobTrackerBoard.tsx` |
| Type `JobLinkReadResult` | `{ company: string \| null; deadline: string \| null; platformId: string \| null; missing: JobLinkField[] }` (`deadline` dạng `YYYY-MM-DD`) | `components/JobTrackerBoard.tsx` |
| Type `JobLinkField` | `"company" \| "platform" \| "deadline"` | `components/JobTrackerBoard.tsx` |
| `getJobTrackerSnapshot`, `createJobApplication`, `updateJobApplication`, `deleteJobApplication`, `createJobPlatform`, `deleteJobPlatform` | Không đổi | `components/JobTrackerBoard.tsx` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-018` | Depends on | Bảng "Theo dõi CV ứng tuyển", các ô job, `server/job-tracker/**`, Server Actions job-tracker, `assertValidJobLink` |
| `US-020` | Impacts | `job-status-automation-service.ts` (`BR-025`) — Ngày hết hạn tự điền là đầu vào; không sửa file này |
| `DEC-119` (US-018) | Nền phụ thuộc | `JobApplication.deadline` nullable, `validateJobForm` không còn kiểm deadline — code đã có trên working tree, chưa commit |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — 0 lỗi | 2026-08-28 |
| `rtk next build` | Passed — Errors: 0, Warnings: 0 | 2026-08-28 |
| `rtk npx prisma validate` | Passed — schema hợp lệ (không đổi) | 2026-08-28 |
| `rtk lint` | N/A — dự án chưa có ESLint config hoạt động (`next lint` prompt cấu hình); hiện trạng có sẵn | 2026-08-28 |
| `rtk vitest run` | N/A — chưa cài framework test (`JDG-002`); thay bằng 27 smoke test thuần (`npx tsx`), PASS toàn bộ | 2026-08-28 |

Code thật đã viết (executor: Codex CLI 0.142.5, `ssr-dev` verify): 6 file mới (`domain/rules/job-platform-match-rule.ts`, `domain/rules/job-deadline-parse-rule.ts`, `domain/services/job-link-enrichment-service.ts` — chứa cả type `JobLinkReadResult`/`JobLinkField`, `infrastructure/job-posting-fetcher.ts`, `infrastructure/job-posting-parser.ts`, `application/use-cases/read-job-link.ts`); sửa `server/job-tracker/actions.ts` (+19, additive), `components/JobTrackerBoard.tsx` (state `readingLinkByKey`/`linkMessages`/`lastReadLinkRef`, hàm `readLinkFor`, prop threading, `JobLinkInput` render chỉ báo + thông báo), `app/globals.css` (+15, 2 class). `ssr-dev` sửa 1 sai lệch spec: chuỗi thông báo Platform → đúng spec AC-05.

`readJobLink` xác nhận không `revalidatePath`, không gọi `prisma.jobApplication.*`. `domain/` chỉ TS thuần. `fetch`+parse HTML ở `infrastructure/`.

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Fetch tới địa chỉ nội bộ (SSRF) | Trung bình | `job-posting-fetcher` chặn loopback/private/link-local; nếu vẫn lo, gỡ export `readJobLink` |
| Trang đổi cấu trúc → bóc sai dữ liệu âm thầm | Trung bình | Ưu tiên JSON-LD/OG; `parseAbsoluteDeadline` chỉ nhận ngày đầy đủ; chỉ điền ô trống nên Dylan luôn sửa được |
| LinkedIn chặn bot → đọc nội dung thất bại | Thấp (thiết kế) | `DEC-112` chấp nhận; Platform vẫn suy từ hostname |
| Phản hồi đọc cũ ghi đè phản hồi mới | Thấp | So `lastReadLink[key]` khi phản hồi về |
| Toàn bộ luồng US-021 | — | Xóa 6 file mới (`read-job-link.ts`, `job-link-enrichment-service.ts`, 2 rule, 2 infrastructure), revert `actions.ts` + `JobTrackerBoard.tsx` về trạng thái sau `DEC-119`; không có migration/schema để hoàn tác |
