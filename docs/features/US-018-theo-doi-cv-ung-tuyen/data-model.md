# Bảng theo dõi CV ứng tuyển tại trang Roadmap — Data Model Delta

Status: Applied
Feature: US-018
Prisma Schema: `prisma/schema.prisma`
DBML: `docs/db/schema.dbml`
Provider: sqlite
Created: 2026-08-13
Owner: ssr-data

## 1. Thay Đổi Model

| Model | Thay đổi | Lý do nghiệp vụ | AC liên quan |
| --- | --- | --- | --- |
| `JobApplication` | Thêm model | Lưu bền vững từng job Dylan đang theo dõi: Công ty, Ngày hết hạn, Platform, Link, Trạng thái, Ghi chú (`DEC-080`) | AC-01, AC-05, AC-06, AC-08, AC-09, AC-10, AC-11 |
| `JobPlatform` | Thêm model | Danh sách option Platform Dylan tự thêm/xóa, tham chiếu bởi `JobApplication` (`DEC-080`, `BR-021`) | AC-02, AC-03, AC-04 |

## 2. Prisma Schema Delta

```prisma
// Trước
// (không có model nào cho JobApplication / JobPlatform)

// Sau
model JobPlatform {
  id   String @id @default(cuid())
  name String

  jobApplications JobApplication[]

  createdAt DateTime @default(now())
}

model JobApplication {
  id         String   @id @default(cuid())
  company    String
  deadline   DateTime
  platformId String
  link       String
  status     String   @default("Interested")
  note       String?

  platform JobPlatform @relation(fields: [platformId], references: [id], onDelete: Restrict)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([platformId])
}
```

| Field | Kiểu Prisma | Kiểu SQLite | Nullable | Default | Unique/Index |
| --- | --- | --- | --- | --- | --- |
| `JobPlatform.id` | `String` | `TEXT` | Không | `cuid()` | `@id` |
| `JobPlatform.name` | `String` | `TEXT` | Không | Không | Không — trùng tên được phép (spec mục 6, "Dữ liệu trùng: Không áp dụng") |
| `JobPlatform.createdAt` | `DateTime` | `TEXT` (ISO 8601, theo quy ước Prisma+SQLite hiện có trong dự án) | Không | `now()` | Không |
| `JobApplication.id` | `String` | `TEXT` | Không | `cuid()` | `@id` |
| `JobApplication.company` | `String` | `TEXT` | Không | Không | Không |
| `JobApplication.deadline` | `DateTime` | `TEXT` | Không | Không | Không |
| `JobApplication.platformId` | `String` | `TEXT` | Không | Không | `@@index([platformId])`, FK → `JobPlatform.id` |
| `JobApplication.link` | `String` | `TEXT` | Không | Không | Không |
| `JobApplication.status` | `String` | `TEXT` | Không | `"Interested"` (`DEC-084`) | Không — 7 giá trị hợp lệ ràng buộc ở tầng ứng dụng, không phải CHECK constraint của DB (đúng mẫu `Category.type`, `BR-019`) |
| `JobApplication.note` | `String?` | `TEXT` | Có | Không | Không |
| `JobApplication.createdAt` | `DateTime` | `TEXT` | Không | `now()` | Không |
| `JobApplication.updatedAt` | `DateTime` | `TEXT` | Không | `@updatedAt` | Không |

## 3. Migration SQLite

Lệnh sinh migration: `rtk npx prisma migrate dev --name add_job_tracker`

- Thư mục sinh ra: `prisma/migrations/` — Prisma tự đặt tên thư mục theo thời điểm chạy lệnh, hậu tố `add_job_tracker` (mẫu đặt tên đã dùng cho các migration trước, vd `20260812063115_add_category_order`)
- KHÔNG sửa tay `migration.sql`. Muốn đổi thì sửa `schema.prisma` rồi sinh lại.

| Bước | Nội dung | An toàn với dữ liệu cũ |
| --- | --- | --- |
| 1 | `CREATE TABLE "JobPlatform"` (id, name, createdAt) | Có — bảng hoàn toàn mới, không có dữ liệu cũ nào bị chạm |
| 2 | `CREATE TABLE "JobApplication"` (id, company, deadline, platformId, link, status, note, createdAt, updatedAt) + khóa ngoại `platformId` → `JobPlatform.id` (`ON DELETE RESTRICT`) | Có — bảng hoàn toàn mới |
| 3 | `CREATE INDEX` trên `JobApplication(platformId)` | Có |

Không cần seed 3 option Platform mặc định ("ITViec", "LinkedIn", "VietNamWork") trong migration này — theo `JDG-023`, việc này do tầng application đảm nhiệm (`ensureDefaultJobPlatforms()`, kiểm tra `count() === 0` trước khi chèn), tránh lặp lại tình huống hook `guard-artifact-path` từng chặn sửa tay `migration.sql` để chèn dữ liệu (`JDG-018`, US-016).

## 4. Ràng Buộc SQLite

Đối chiếu từng mục — SQLite không hỗ trợ đầy đủ như Postgres:

| Ràng buộc | Áp dụng | Xử lý |
| --- | --- | --- |
| Không có native `enum` | Có | `JobApplication.status` dùng `String` + validate đúng 7 giá trị (Interested/Waiting/No Response/Response/Appointment/Cancel/Fail) ở tầng ứng dụng (`server/job-tracker/domain/...`), đúng mẫu `Category.type`/`BR-019`. 7 giá trị đã ghi vào `glossary.md` qua entity "Job ứng tuyển" |
| `ALTER TABLE` hạn chế (đổi kiểu/drop constraint phải tạo bảng mới) | Không | Cả 2 model đều **mới hoàn toàn** — migration chỉ có `CREATE TABLE`/`CREATE INDEX`, không có `ALTER TABLE` nào đổi kiểu hay drop constraint |
| Thêm cột `NOT NULL` phải có default hoặc backfill | Không | Không có cột nào thêm vào bảng đã có dữ liệu — cả 2 bảng đều mới, không cần backfill |
| Không có `citext`, so sánh chuỗi phân biệt hoa thường | Không | Không có yêu cầu tìm kiếm/so sánh không phân biệt hoa thường cho `company`, `name`, hay `status` trong spec US-018 |
| Ghi đồng thời bị khóa toàn DB | Có (đặc điểm chung của SQLite, không riêng US-018) | Không thiết kế job ghi nặng chạy song song — ứng dụng single-user (`DEC-004`), mọi mutation là thao tác rời rạc do Dylan tự bấm, không có batch job nền nào ghi `JobApplication`/`JobPlatform` |
| Không có native array/JSON type | Không | Không có field nào cần lưu mảng/JSON — `status` là 1 giá trị chuỗi đơn, không phải danh sách |

## 5. Đồng Bộ DBML

- Nguồn sự thật: `schema.prisma`. DBML là bản dẫn xuất, không sửa ngược.
- Lệnh sinh: `rtk npx prisma generate` — dự án **không có generator DBML** cài sẵn (đúng ghi chú đầu file `docs/db/schema.dbml`: "Đồng bộ thủ công... không có generator DBML cài sẵn trong dự án").
- Cập nhật thủ công đúng delta bên dưới.

```dbml
Table JobPlatform {
  id text [pk]
  name text [not null]
  createdAt timestamp [not null]
}

Table JobApplication {
  id text [pk]
  company text [not null]
  deadline timestamp [not null]
  platformId text [not null, ref: > JobPlatform.id]
  link text [not null]
  status text [not null, default: 'Interested', note: 'Chỉ 1 trong 7 giá trị: Interested | Waiting | No Response | Response | Appointment | Cancel | Fail — ràng buộc ở tầng ứng dụng, không phải CHECK constraint của DB (DEC-084, DEC-087)']
  note text
  createdAt timestamp [not null]
  updatedAt timestamp [not null]

  indexes {
    platformId
  }
}
```

| Kiểm tra | Kết quả |
| --- | --- |
| DBML có đủ model mới | Đạt |
| Quan hệ (`Ref:`) khớp với Prisma | Đạt — `JobApplication.platformId > JobPlatform.id`, khớp `onDelete: Restrict` (ghi chú relation trong Prisma; DBML không có cú pháp `onDelete` riêng nên chỉ thể hiện qua `ref: >`) |
| Ghi chú field khớp thuật ngữ trong `glossary.md` | Đạt — "Job ứng tuyển" và "Platform (tuyển dụng)" đã có trong `glossary.md` (thêm khi `ssr-ba` hoàn tất) |

## 6. Backfill Và Rollback

| Hạng mục | Nội dung |
| --- | --- |
| Backfill cần thiết | Không — 2 bảng hoàn toàn mới, không có dữ liệu cũ nào cần chuyển đổi. 3 option Platform mặc định được tạo lười (lazy) bởi tầng application khi trang Roadmap được tải lần đầu sau khi triển khai (`JDG-023`), không phải một bước backfill migration |
| Dữ liệu có thể mất | Không — migration chỉ tạo bảng mới, không đụng tới `MonthBudget`/`Category`/`Transaction`/`LegacyMigration` hiện có |
| Rollback | Xóa thư mục migration `add_job_tracker` chưa deploy (nếu phát hiện lỗi trước khi áp dụng thật); nếu đã áp dụng, tạo migration mới `DROP TABLE "JobApplication"`, `DROP TABLE "JobPlatform"` qua `prisma migrate dev` (không xóa tay) |
| Đã backup file SQLite | Có — `prisma/backups/dev.db.us-018-before-job-tracker.20260813180307.bak` (trước khi chạy `prisma migrate dev`) |

## 7. Verification

| Bước | Lệnh | Kết quả |
| --- | --- | --- |
| Validate schema | `rtk npx prisma validate` | Passed — "The schema at prisma\schema.prisma is valid" |
| Format schema | `rtk npx prisma format` | Passed — "Formatted prisma\schema.prisma" |
| Sinh client | `rtk npx prisma generate` | Passed — "Prisma Client generated" |
| Áp migration | `rtk npx prisma migrate dev --name add_job_tracker` | Passed — `prisma/migrations/20260813110324_add_job_tracker/migration.sql` sinh đúng 2 `CREATE TABLE` + 1 `CREATE INDEX`, không có `RedefineTables` (bảng mới, không có dữ liệu cũ) |
| Typecheck sau khi client đổi | `rtk tsc --noEmit` | Failed — nhưng lỗi **không liên quan** US-018: `components/BudgetApp.tsx:911` (`Icon` trong mảng insight bị suy kiểu rộng ra `string \| boolean \| ComponentType`, lỗi có sẵn trước khi US-018 chạm tới file này — xác nhận bằng `git diff HEAD -- components/BudgetApp.tsx` rỗng). Không có lỗi nào liên quan tới `JobApplication`/`JobPlatform` hay `@/generated/prisma/client` |
