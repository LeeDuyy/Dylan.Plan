# Bảng theo dõi CV ứng tuyển tại trang Roadmap — SE Plan

Status: Ready for task-breakdown
Feature: US-018
Spec: spec.md
Created: 2026-08-13
Updated: 2026-08-13
DEV Wiki: `docs/kb/dev/wiki/US-018-theo-doi-cv-ung-tuyen.md`
Owner: ssr-plan

## 1. Tóm Tắt Kỹ Thuật

Thêm một bounded context hoàn toàn mới `server/job-tracker/` (Light DDD 3 lớp, đúng khuôn `server/budget/` đã có), với 2 model Prisma mới (`JobApplication`, `JobPlatform`) chưa từng tồn tại. UI là một Client Component mới `components/JobTrackerBoard.tsx`, chèn vào `RoadmapSections()` trong `components/DylanPlanApp.tsx`. Vì `app/page.tsx` hiện là Server Component đồng bộ không lấy dữ liệu gì, phải chuyển thành `async` để gọi Server Action `getJobTrackerSnapshot()` (giống hệt mẫu `app/budget/page.tsx` → `getBudgetSnapshot()`) rồi truyền xuống qua props.

Điểm kỹ thuật khác biệt so với các function trước: cột "Platform" cần vừa chọn vừa thêm/xóa option ngay trong ô chọn (`EL-04`) — thẻ HTML `select`/`option` gốc (đang dùng cho "Loại" ở US-016) không hỗ trợ nút xóa cạnh từng option, nên phải tự dựng một dropdown tùy biến (`div`/`button`), không tái dùng được y nguyên pattern combobox cũ.

## 2. Ngữ Cảnh Đã Đọc

| File | Lý do đọc |
| --- | --- |
| `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` | Nguồn yêu cầu — mục 6, 7, 8, 9, 13 |
| `docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md` | Đối chiếu tri thức BA đã tổng hợp |
| `docs/kb/ba/wiki/delivery/pbi/US-018-theo-doi-cv-ung-tuyen.md` | Đối chiếu AC đã đồng bộ |
| `app/page.tsx` | Entry hiện tại của trang Roadmap — Server Component đồng bộ, chưa lấy dữ liệu gì |
| `app/budget/page.tsx` | Mẫu Server Component `async` gọi Server Action rồi truyền props — dùng làm khuôn cho `app/page.tsx` |
| `components/DylanPlanApp.tsx` | Toàn bộ — xác định vị trí chèn UI mới (`RoadmapSections()`, dòng 327-359 section `id="roadmap"`, trước `TargetGrid` dòng 361-372) |
| `components/BudgetApp.tsx` (đoạn 219-500, 730-770, 1190-1290) | Mẫu inline edit (`updateCategoryLocal`/`commitCategory`), mẫu xác nhận xóa qua state `confirm-delete` (giao dịch), mẫu kéo thả, mẫu combobox `select` cho "Loại", input `type="date"` cho form sửa giao dịch |
| `components/shared/Toast.tsx` | Mẫu toast lỗi/thành công dùng lại |
| `prisma/schema.prisma` | Xác nhận chưa có model nào cho Job/Platform; mẫu quan hệ `onDelete: Restrict` (`Transaction.category`) dùng làm tham chiếu cho ràng buộc `BR-021` |
| `lib/prisma.ts` | Cách khởi tạo Prisma Client (Prisma 7 + `better-sqlite3` adapter) |
| `server/budget/actions.ts` | Mẫu composition root Server Action — nối repository → domain service → use-case → export hàm |
| `server/budget/application/use-cases/upsert-category.ts` | Mẫu use-case validate inline + `revalidatePath` |
| `server/budget/domain/repositories/category-repository.ts` | Mẫu interface repository, `UpdateCategoryInput = Partial<Pick<...>>` |
| `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Mẫu implementation Prisma repository |
| `server/budget/domain/rules/category-type-rule.ts` | Mẫu rule đơn giản dạng hàm thuần (assert + normalize) |
| `server/budget/domain/entities/category.ts` | Mẫu định nghĩa entity phẳng (type alias) |
| `lib/budget-defaults.ts` | Xác nhận dữ liệu mặc định (danh mục, hằng số) được seed bằng logic ứng dụng, không qua `prisma/seed.ts` (không tồn tại file này) |
| `docs/memory/judgement-log.md` (`JDG-002`, `JDG-016`, `JDG-018`) | Xác nhận: dự án chưa có framework test, `lint` không chạy non-interactive được, và hook chặn sửa tay `migration.sql` cho thay đổi data-only |
| `docs/features/US-016-loai-chi-tieu-combobox/plan.md`, `docs/kb/dev/wiki/US-016-loai-chi-tieu-combobox.md` | Tham chiếu format plan/DEV wiki đã qua review, và tiền lệ xử lý migration data-only bị hook chặn |

## 3. Hành Vi Hiện Tại

Trang Roadmap (`app/page.tsx` → `components/DylanPlanApp.tsx`) hoàn toàn tĩnh: `RoadmapSections()` chỉ render các mảng hằng số khai báo sẵn trong file (`roadmapPhases`, `priorities`, `firstWeekTargets`, `weeklyKpis`). Không có Server Action, không có bounded context `server/job-tracker/`, không có model `JobApplication`/`JobPlatform` nào trong `prisma/schema.prisma`. `app/page.tsx` là Server Component nhưng không `async`, không gọi lấy dữ liệu nào.

## 4. Hành Vi Mục Tiêu

`app/page.tsx` trở thành `async`, gọi `getJobTrackerSnapshot()` (Server Action mới) lấy toàn bộ job + platform, truyền xuống `DylanPlanApp` qua prop `initialJobTracker`. `DylanPlanApp` truyền tiếp xuống `RoadmapSections`, nơi chèn component `JobTrackerBoard` (nhận prop `initialJobs`, `initialPlatforms`) ngay dưới section `id="roadmap"` (`DEC-081`). `JobTrackerBoard` là Client Component tự quản lý state cục bộ (giống `BudgetApp`): thêm/sửa inline/xóa job, thêm/xóa option Platform, sắp xếp bảng theo cột — mọi mutation gọi Server Action rồi `refreshSnapshot()` lại từ server (đúng pattern `commitCategory`/`refreshSnapshot` của `BudgetApp`).

Dữ liệu mặc định 3 Platform ("ITViec", "LinkedIn", "VietNamWork") được đảm bảo tồn tại bằng một bước "ensure-default" ở tầng application (`get-job-tracker-snapshot.ts` gọi kiểm tra `JobPlatform` rỗng thì tự chèn 3 dòng trước khi trả về) — **không** qua migration data-only, vì hook `guard-artifact-path` đã từng chặn sửa tay `migration.sql` cho thay đổi loại này ở US-016 (`JDG-018`), và bảng `JobPlatform` là bảng hoàn toàn mới nên không có rủi ro ghi đè dữ liệu cũ khi ensure-default chạy lại nhiều lần (idempotent bằng kiểm tra `count() === 0`).

## 5. Luồng End-To-End

```text
[Thêm job mới — AC-01]
components/JobTrackerBoard.tsx (submit form "+ Thêm job")
  -> server/job-tracker/actions.ts#createJobApplication()
  -> application/use-cases/upsert-job-application.ts
       -> validate company/deadline/platformId không rỗng (inline, giống upsert-category.ts)
       -> domain/rules/job-link-rule.ts assertValidJobLink(link) [throw nếu sai định dạng — AC-08]
       -> domain/repositories/job-application-repository.ts create()
  -> infrastructure/repositories/job-application-prisma-repository.ts -> lib/prisma.ts -> SQLite
  -> revalidatePath("/") -> JobTrackerBoard gọi lại getJobTrackerSnapshot(), cập nhật state

[Sửa một trường inline — AC-05, AC-11]
JobTrackerBoard.tsx (bấm vào ô, đổi giá trị, blur/xác nhận)
  -> actions.ts#updateJobApplication(id, patch)
  -> application/use-cases/upsert-job-application.ts (nhánh có id -> update)
  -> repository update() -> SQLite -> revalidatePath("/")

[Xóa một job — AC-06]
JobTrackerBoard.tsx (bấm nút xóa -> state "confirm-delete" theo dòng, giống confirm-delete của giao dịch trong BudgetApp -> xác nhận)
  -> actions.ts#deleteJobApplication(id)
  -> application/use-cases/delete-job-application.ts -> repository delete() -> SQLite -> revalidatePath("/")

[Thêm option Platform — AC-02]
JobTrackerBoard.tsx (gõ tên vào ô "+ Thêm platform mới" trong dropdown, xác nhận)
  -> actions.ts#createJobPlatform(name)
  -> application/use-cases/create-job-platform.ts -> repository create() -> SQLite -> revalidatePath("/")

[Xóa option Platform — AC-03 (cho phép) / AC-04 (bị chặn, BR-021)]
JobTrackerBoard.tsx (bấm biểu tượng xóa cạnh option)
  -> actions.ts#deleteJobPlatform(id)
  -> application/use-cases/delete-job-platform.ts
       -> domain/services/job-platform-guard-service.ts assertJobPlatformNotInUse(id)
            [đếm qua job-application-repository.countByPlatform(id); >0 thì throw lỗi nghiệp vụ thân thiện]
       -> repository delete() (chỉ chạy nếu guard không throw)
  -> SQLite -> revalidatePath("/")

[Đọc dữ liệu ban đầu — mọi lượt mở trang Roadmap]
app/page.tsx (Server Component async)
  -> server/job-tracker/actions.ts#getJobTrackerSnapshot()
  -> application/use-cases/get-job-tracker-snapshot.ts
       -> domain/services/default-job-platforms-service.ts ensureDefaultJobPlatforms()
            [job-platform-repository.count() === 0 thì tạo 3 dòng mặc định]
       -> job-application-repository.findAll() + job-platform-repository.findAll()
  -> trả JobTrackerSnapshot -> props xuống DylanPlanApp -> RoadmapSections -> JobTrackerBoard
```

Sắp xếp bảng theo cột (`AC-07`) hoàn toàn phía client trong `JobTrackerBoard.tsx` (state `{ column, direction }`, sắp lại mảng `jobs` đang có trong state) — không có lệnh Prisma nào, không cần cột `order` lưu trữ vì đây không phải thứ tự tùy chỉnh bền vững như `Category.order` (US-017), mà là sắp xếp tạm thời theo dữ liệu đã tải.

## 6. Phụ Thuộc Và Thứ Tự

| Phụ thuộc | Đã verify ở đâu | Chặn | Thứ tự bắt buộc |
| --- | --- | --- | --- |
| Không có | Đã đọc `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` mục 10 (đã tự rà 12 spec hiện có) và tự khảo sát `app/page.tsx`, `components/DylanPlanApp.tsx` — không phát hiện function nào (`US-001`..`US-017`) mà US-018 dùng chung dữ liệu, route, hay bounded context; `server/job-tracker/` hoàn toàn tách biệt khỏi `server/budget/` | Không | — |

## 7. Impact Checklist

| Khu vực | Ảnh hưởng | Ghi chú |
| --- | --- | --- |
| App Router page / layout | Yes | `app/page.tsx` chuyển thành `async`, gọi `getJobTrackerSnapshot()` |
| Server Action | Yes | `server/job-tracker/actions.ts` mới — 5 hàm export (get/create/update/delete job, create/delete platform) |
| Route Handler (`app/api`) | N/A | Không cần — dùng Server Action, đúng pattern hiện có |
| Auth / middleware / permission | N/A | Không có đăng nhập/phân quyền (`DEC-004`) |
| Prisma schema | Yes | 2 model mới: `JobApplication`, `JobPlatform` — giao `ssr-data` |
| Migration SQLite | Yes | Migration tạo bảng mới — giao `ssr-data` |
| DBML | Yes | Thêm 2 model mới vào `docs/db/schema.dbml` — giao `ssr-data` |
| Seed data | Yes | 3 option Platform mặc định — xử lý bằng "ensure-default" ở application layer (mục 4), không qua seed script/migration |
| Caching / revalidate | Yes | `revalidatePath("/")` sau mọi mutation (route Roadmap là `/`, khác `/budget`) |
| Export / báo cáo | N/A | Ngoài phạm vi spec mục 4 |
| Mail / webhook / job nền | N/A | Không có |
| Knowledge base / memory | Yes | DEV wiki mới (`docs/kb/dev/wiki/US-018-...md`), `docs/kb/dev/00-index.md` cập nhật |

## 8. Bản Đồ Source Impact

| Tầng | File | Thay đổi dự kiến |
| --- | --- | --- |
| Entry | `app/page.tsx` | Chuyển `async`, gọi `getJobTrackerSnapshot()`, truyền prop `initialJobTracker` xuống `DylanPlanApp` |
| Entry (UI) | `components/DylanPlanApp.tsx` | Nhận prop `initialJobTracker`; `RoadmapSections` nhận và truyền tiếp; chèn component `JobTrackerBoard` sau section `id="roadmap"`, trước cặp `TargetGrid` |
| Entry (UI, mới) | `components/JobTrackerBoard.tsx` | Toàn bộ UI bảng: form thêm job, ô inline-edit từng cột, dropdown Platform tùy biến (chọn + thêm + xóa option), nút xóa job có xác nhận, click-to-sort tiêu đề cột |
| Application (use-case, mới) | `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts` | Đọc toàn bộ job + platform, gọi ensure-default trước |
| Application (use-case, mới) | `server/job-tracker/application/use-cases/upsert-job-application.ts` | Tạo mới hoặc sửa từng trường (dùng chung cho AC-01, AC-05, AC-11), validate required fields + `job-link-rule` |
| Application (use-case, mới) | `server/job-tracker/application/use-cases/delete-job-application.ts` | Xóa một job |
| Application (use-case, mới) | `server/job-tracker/application/use-cases/create-job-platform.ts` | Tạo option Platform mới |
| Application (use-case, mới) | `server/job-tracker/application/use-cases/delete-job-platform.ts` | Gọi guard trước khi xóa option Platform |
| Domain rule (mới) | `server/job-tracker/domain/rules/job-link-rule.ts` | `assertValidJobLink` — Link phải bắt đầu `http://`/`https://` (`DEC-086`) |
| Domain service (mới) | `server/job-tracker/domain/services/job-platform-guard-service.ts` | Phối hợp `JobApplicationRepository` + `JobPlatformRepository` để chặn xóa option đang dùng (`BR-021`) |
| Domain service (mới) | `server/job-tracker/domain/services/default-job-platforms-service.ts` | Ensure-default 3 option mặc định khi bảng `JobPlatform` rỗng |
| Repository interface (domain, mới) | `server/job-tracker/domain/repositories/job-application-repository.ts` | `findAll`, `create`, `update`, `delete`, `countByPlatform` |
| Repository interface (domain, mới) | `server/job-tracker/domain/repositories/job-platform-repository.ts` | `findAll`, `create`, `delete`, `count` |
| Repository implementation (infrastructure, mới) | `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` | Implement bằng Prisma Client |
| Repository implementation (infrastructure, mới) | `server/job-tracker/infrastructure/repositories/job-platform-prisma-repository.ts` | Implement bằng Prisma Client |
| Data | `prisma/schema.prisma` | Thêm model `JobApplication`, `JobPlatform` — giao `ssr-data`, `ssr-plan` không tự sửa |
| UI (shared) | `components/shared/Toast.tsx` | Tái dùng nguyên trạng cho thông báo lỗi (không sửa) |
| Consumer | Không có | Không có file nào khác đang import các model/type sắp thêm |

## 9. Thay Đổi Data Model

Cần đổi schema: **Có**.

- Bắt buộc có `data-model.md` do `ssr-data` tạo, và task breakdown phải có task riêng cho migration.

| Model | Loại thay đổi | Nullable | Default | Index | Ảnh hưởng dữ liệu cũ |
| --- | --- | --- | --- | --- | --- |
| `JobApplication` (mới) | Thêm model — field `id`, `company`, `deadline`, `platformId` (FK → `JobPlatform`, `onDelete: Restrict`), `link`, `status`, `note`, `createdAt`, `updatedAt` | `note` nullable; các field còn lại không | `status` mặc định `"Interested"` (`DEC-084`) | `@@index([platformId])` (phục vụ `countByPlatform` của `BR-021`) | Không có — bảng hoàn toàn mới |
| `JobPlatform` (mới) | Thêm model — field `id`, `name`, `createdAt` | Không | Không | Không cần thêm (bảng nhỏ, không cần lọc theo cột khác ngoài `id`) | Không có — bảng hoàn toàn mới; 3 dòng mặc định được tạo bằng ensure-default ở application layer (mục 4), không phải seed migration |

## 10. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `app/page.tsx` (Server Component) | Đồng bộ, không props, không lấy dữ liệu | `async`, gọi `getJobTrackerSnapshot()`, truyền `initialJobTracker` xuống `DylanPlanApp` | Không (chỉ thêm) |
| `DylanPlanApp` props | Không nhận prop nào | Nhận thêm `initialJobTracker: JobTrackerSnapshot` | Không (thêm prop bắt buộc, nhưng chỉ một nơi gọi — `app/page.tsx` — cùng đổi trong cùng lượt) |
| `JobTrackerSnapshot` (type mới, `server/job-tracker/actions.ts`) | Chưa tồn tại | `{ jobs: JobApplicationEntity[], platforms: JobPlatformEntity[] }` | Không (mới hoàn toàn) |
| `server/job-tracker/actions.ts` (Server Action, mới) | Chưa tồn tại | 6 hàm export: `getJobTrackerSnapshot`, `createJobApplication`, `updateJobApplication`, `deleteJobApplication`, `createJobPlatform`, `deleteJobPlatform` | Không (mới hoàn toàn) |

## 11. File Sẽ Thay Đổi

| File | Ý định thay đổi |
| --- | --- |
| `app/page.tsx` | Chuyển thành `async function Home()`, gọi `getJobTrackerSnapshot()`, truyền `initialJobTracker` làm prop cho component `DylanPlanApp` |
| `components/DylanPlanApp.tsx` | Thêm prop `initialJobTracker` cho `DylanPlanApp` và `RoadmapSections`; chèn component `JobTrackerBoard` (nhận prop `initialJobs`, `initialPlatforms`) sau section `id="roadmap"` |
| `components/JobTrackerBoard.tsx` (mới) | Toàn bộ Client Component bảng "Theo dõi CV ứng tuyển" — state, inline edit, dropdown Platform tùy biến, xác nhận xóa, click-to-sort |
| `server/job-tracker/actions.ts` (mới) | Composition root Server Action — nối repository → domain service → use-case → export |
| `server/job-tracker/domain/entities/job-application.ts` (mới) | `JobApplicationEntity` |
| `server/job-tracker/domain/entities/job-platform.ts` (mới) | `JobPlatformEntity` |
| `server/job-tracker/domain/repositories/job-application-repository.ts` (mới) | Interface repository |
| `server/job-tracker/domain/repositories/job-platform-repository.ts` (mới) | Interface repository |
| `server/job-tracker/domain/rules/job-link-rule.ts` (mới) | `assertValidJobLink` |
| `server/job-tracker/domain/services/job-platform-guard-service.ts` (mới) | `assertJobPlatformNotInUse` (`BR-021`) |
| `server/job-tracker/domain/services/default-job-platforms-service.ts` (mới) | `ensureDefaultJobPlatforms` |
| `server/job-tracker/infrastructure/repositories/job-application-prisma-repository.ts` (mới) | Implementation Prisma |
| `server/job-tracker/infrastructure/repositories/job-platform-prisma-repository.ts` (mới) | Implementation Prisma |
| `server/job-tracker/application/use-cases/get-job-tracker-snapshot.ts` (mới) | Use-case đọc snapshot |
| `server/job-tracker/application/use-cases/upsert-job-application.ts` (mới) | Use-case tạo/sửa job |
| `server/job-tracker/application/use-cases/delete-job-application.ts` (mới) | Use-case xóa job |
| `server/job-tracker/application/use-cases/create-job-platform.ts` (mới) | Use-case tạo option Platform |
| `server/job-tracker/application/use-cases/delete-job-platform.ts` (mới) | Use-case xóa option Platform (gọi guard) |
| `prisma/schema.prisma` | Thêm model `JobApplication`, `JobPlatform` — **do `ssr-data` thực hiện**, không phải `ssr-dev` |
| `docs/db/schema.dbml` | Đồng bộ 2 model mới — **do `ssr-data` thực hiện** |
| `docs/kb/dev/00-index.md` | Thêm dòng `US-018` trỏ tới DEV wiki mới |

## 12. Kế Hoạch Verification

| Bước | Lệnh | Kỳ vọng | Kết quả thật (2026-08-13) |
| --- | --- | --- | --- |
| Typecheck | `rtk tsc --noEmit` | 0 lỗi | 2 lỗi, cả hai ở `components/BudgetApp.tsx:911` — có sẵn trước US-018, không liên quan (`JDG-024`); không lỗi nào ở code mới |
| Prisma | `rtk npx prisma validate` | schema hợp lệ (sau khi `ssr-data` thêm 2 model) | Passed — "The schema at prisma\schema.prisma is valid" |
| Prisma generate | `rtk npx prisma generate` | client sinh lại thành công sau migration | Passed (đã chạy ở stage `data`) |
| Test | `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (`JDG-002`, vẫn đúng tới nay) | Không áp dụng |
| Build | `rtk next build` | pass, không lỗi biên dịch | **Failed** — cùng lỗi có sẵn ở `BudgetApp.tsx:911` chặn build production của toàn app (`rtk next build` báo "Errors: 0" không đáng tin — `JDG-015`; `npx next build` trực tiếp báo đúng "Errors: 1"). Đã tách task riêng ngoài phạm vi US-018 để sửa (`task_8ec82b68`) |
| Thủ công AC-01 | Thêm một job đầy đủ thông tin trên `next dev` | Dòng mới xuất hiện đúng dữ liệu, Trạng thái "Interested" | Passed |
| Thủ công AC-02/AC-03/AC-04 | Thêm option Platform mới; xóa một option không dùng; thử xóa option đang dùng | Thêm/xóa thành công tương ứng; xóa option đang dùng bị chặn kèm thông báo | Passed — toast đúng "Không thể xóa Platform \"LinkedIn\" vì đang có job sử dụng." |
| Thủ công AC-05/AC-11 | Đổi Trạng thái một job bất kỳ giá trị; sửa Công ty inline | Cả hai lưu ngay, không cần mở form riêng | Passed |
| Thủ công AC-06 | Xóa một job | Hiện hộp xác nhận trước, chỉ mất dòng sau khi xác nhận | Passed |
| Thủ công AC-07 | Click tiêu đề cột "Ngày hết hạn" hai lần | Sắp tăng dần rồi đảo giảm dần | Passed |
| Thủ công AC-08/AC-10 | Bỏ trống Công ty; nhập Link sai định dạng | Cả hai bị chặn lưu, thông báo lỗi đúng ô | Passed |
| Thủ công AC-09 | Ngắt mạng tạm thời rồi thêm job | Thông báo lỗi chung, dữ liệu vừa nhập không mất khỏi form | Passed — mô phỏng lỗi mạng bằng cách chặn đúng 1 lần gọi `fetch` đầu tiên; dữ liệu giữ nguyên trên form, thử lại sau khi phục hồi mạng thì lưu thành công |
| Phát sinh ngoài kế hoạch | — | — | **Race condition thật** ở `ensureDefaultJobPlatforms` (`TB-05`): 7 request tải trang đồng thời tạo 21 dòng `JobPlatform` thay vì 3. Đã sửa bằng `prisma.$transaction` atomic (`DEC-091`), xác nhận lại bằng 8 request đồng thời sau khi sửa — đúng 3 dòng, ổn định (`JDG-025`) |

## 13. Rủi Ro Và Rollback

| Rủi ro | Mức | Giảm thiểu | Rollback |
| --- | --- | --- | --- |
| Thẻ `select` gốc không hỗ trợ nút xóa cạnh option — phải tự dựng dropdown tùy biến (`div`/`button`), khác hẳn combobox "Loại" đã có ở US-016 | Trung bình | Bám sát ASCII Mockup mục 8.1 của spec; giữ hành vi bàn phím cơ bản (Tab, Enter, Escape) khi tự dựng | Xóa `components/JobTrackerBoard.tsx`, revert `app/page.tsx` và `components/DylanPlanApp.tsx` về bản trước |
| Chỉ dựa vào ràng buộc FK `onDelete: Restrict` ở DB để chặn xóa Platform đang dùng sẽ trả lỗi Prisma thô, không đúng thông báo nghiệp vụ mà `AC-04` yêu cầu | Trung bình | `job-platform-guard-service.ts` kiểm tra `countByPlatform()` trước, ném lỗi nghiệp vụ rõ ràng trước khi chạm Prisma — `onDelete: Restrict` chỉ là lớp bảo vệ dự phòng ở DB, không phải đường xử lý chính | Không cần — validate trước khi ghi, không có gì để hoàn tác |
| Ensure-default 3 Platform chạy ở tầng application (không qua migration) có thể tạo trùng nếu bị gọi đồng thời trước khi dòng đầu tiên kịp ghi | Thấp | Ứng dụng chỉ có một người dùng, không có traffic đồng thời thật (`DEC-004`); kiểm tra `count() === 0` trước khi insert giảm gần hết rủi ro trong thực tế sử dụng | Xóa tay các dòng trùng qua Prisma Studio nếu phát hiện |

## 14. Phân Rã Task

Canonical task file: `task.md`

| ID | Outcome | Status |
| --- | --- | --- |
| `TB-01` | Migration `add_job_tracker` áp dụng, DBML đồng bộ | Done |
| `TB-02` | `JobApplicationEntity`, `JobPlatformEntity` | Pending |
| `TB-03` | Interface `JobApplicationRepository`, `JobPlatformRepository` | Pending |
| `TB-04` | `assertValidJobLink` (`job-link-rule.ts`) | Pending |
| `TB-05` | `assertJobPlatformNotInUse`, `ensureDefaultJobPlatforms` | Pending |
| `TB-06` | Implementation Prisma cho 2 repository | Pending |
| `TB-07` | 5 use-case (get/upsert/delete job, create/delete platform) | Pending |
| `TB-08` | `server/job-tracker/actions.ts` — composition root | Pending |
| `TB-09` | `app/page.tsx` → `async`, gọi `getJobTrackerSnapshot()` | Pending |
| `TB-10` | `DylanPlanApp`/`RoadmapSections` nhận và truyền prop `initialJobTracker` | Pending |
| `TB-11` | `components/JobTrackerBoard.tsx` — UI đầy đủ | Pending |
| `TB-12` | Verification tổng hợp + cập nhật DEV wiki | Pending |

Readiness: Ready — phân rã đầy đủ tại `task.md` (`ssr-breaker`, 2026-08-13).
