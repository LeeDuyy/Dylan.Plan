# Lịch sử thay đổi trạng thái job ứng tuyển — Data Model Delta

Status: Applied
Feature: US-020
Prisma Schema: `prisma/schema.prisma`
DBML: `docs/db/schema.dbml`
Provider: sqlite
Created: 2026-08-14
Owner: ssr-data

## 1. Thay Đổi Model

| Model | Thay đổi | Lý do nghiệp vụ | AC liên quan |
| --- | --- | --- | --- |
| `JobApplication` | Thêm field `submittedAt` | Lưu mốc "Ngày nộp hồ sơ" — ghi khi job chuyển đúng từ Interested sang Waiting, xoá khi chuyển ngược (`BR-027`); dùng làm mốc tính luật "quá 7 ngày → No Response" (`BR-026`) | AC-03, AC-04, AC-05, AC-06, AC-07, AC-09 |

Không đổi kiểu cột `status` (vẫn `String @default("Interested")`) — chỉ mở rộng tập giá trị hợp lệ ở tầng ứng dụng (7 → 8, thêm `"Expired"`, `AC-01`, `AC-02`, `AC-08`), không phải thay đổi cấu trúc dữ liệu.

## 2. Prisma Schema Delta

```prisma
// Trước
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

// Sau
model JobApplication {
  id          String    @id @default(cuid())
  company     String
  deadline    DateTime
  platformId  String
  link        String
  status      String    @default("Interested")
  note        String?
  submittedAt DateTime?

  platform JobPlatform @relation(fields: [platformId], references: [id], onDelete: Restrict)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([platformId])
}
```

| Field | Kiểu Prisma | Kiểu SQLite | Nullable | Default | Unique/Index |
| --- | --- | --- | --- | --- | --- |
| `submittedAt` | `DateTime?` | `TEXT` (Prisma lưu `DateTime` dạng ISO 8601, giống cách `deadline`/`createdAt`/`updatedAt` hiện có) | Có | Không có (mặc định `NULL`) | Không — không dùng để lọc/join/sắp xếp ở tầng DB |

## 3. Migration SQLite

Lệnh sinh migration: `rtk npx prisma migrate dev --name add_job_submitted_at`

- Thư mục sinh ra: `prisma/migrations/20260814095134_add_job_submitted_at/` — đã áp dụng (2026-08-14)
- KHÔNG sửa tay `migration.sql`. Muốn đổi thì sửa `schema.prisma` rồi sinh lại.

| Bước | Nội dung | An toàn với dữ liệu cũ |
| --- | --- | --- |
| 1 | `ALTER TABLE "JobApplication" ADD COLUMN "submittedAt" DATETIME;` (nội dung `migration.sql` thật, xác nhận đúng như dự kiến) | Có — cột nullable, không `NOT NULL`, SQLite hỗ trợ trực tiếp `ADD COLUMN` không cần dựng lại bảng; các dòng đã có tự nhận `NULL` |

## 4. Ràng Buộc SQLite

Đối chiếu từng mục — SQLite không hỗ trợ đầy đủ như Postgres:

| Ràng buộc | Áp dụng | Xử lý |
| --- | --- | --- |
| Không có native `enum` | Có (gián tiếp — cột `status` mở rộng 7 → 8 giá trị, không phải delta của lần này) | Giữ nguyên `String` + validate ở tầng ứng dụng (đã áp dụng từ `US-018`), mở rộng danh sách hợp lệ trong `assertValidStatus` (`upsert-job-application.ts`) và `glossary.md` |
| `ALTER TABLE` hạn chế (đổi kiểu/drop constraint phải tạo bảng mới) | Không | Chỉ thêm cột mới nullable — SQLite hỗ trợ `ALTER TABLE ... ADD COLUMN` trực tiếp, không cần chiến lược tạo bảng mới + copy dữ liệu |
| Thêm cột `NOT NULL` phải có default hoặc backfill | Không | `submittedAt` là `DateTime?` (nullable), không `NOT NULL` — không cần default hay backfill; dòng cũ hợp lệ với `NULL` |
| Không có `citext`, so sánh chuỗi phân biệt hoa thường | Không | `submittedAt` là kiểu ngày giờ, không phải chuỗi so sánh; không liên quan tới delta này |
| Ghi đồng thời bị khóa toàn DB | Có, ở mức nhẹ | `getJobTrackerSnapshot()` (US-020) có thể ghi nhiều `update` riêng lẻ theo từng job đủ điều kiện tự động đổi trạng thái trong cùng một lượt đọc; mỗi update độc lập theo `id` riêng (không cần atomic all-or-nothing giữa các job), và khối lượng job cho một single-user (`DEC-004`) rất nhỏ nên không cần transaction bọc quanh — khác với rủi ro race-condition đã gặp ở `ensureDefaultJobPlatforms` (`JDG-025`), vì ở đây không có nhiều request ghi cùng một dòng đồng thời |
| Không có native array/JSON type | Không | Không dùng JSON/array trong delta này |

## 5. Đồng Bộ DBML

- Nguồn sự thật: `schema.prisma`. DBML là bản dẫn xuất, không sửa ngược.
- Lệnh sinh: Không có generator DBML cài sẵn trong dự án — cập nhật thủ công đúng delta.

```dbml
Table JobApplication {
  id text [pk]
  company text [not null]
  deadline timestamp [not null]
  platformId text [not null, ref: > JobPlatform.id]
  link text [not null, note: 'Phải bắt đầu http:// hoặc https:// — ràng buộc ở tầng ứng dụng (DEC-086)']
  status text [not null, default: 'Interested', note: 'Chỉ 1 trong 8 giá trị: Interested | Waiting | No Response | Response | Appointment | Cancel | Fail | Expired — ràng buộc ở tầng ứng dụng, không phải CHECK constraint của DB (DEC-084, DEC-087, DEC-101, DEC-102)']
  note text
  submittedAt timestamp [note: '"Ngày nộp hồ sơ" — ghi khi chuyển Interested → Waiting, xoá khi chuyển ngược Waiting → Interested (BR-027, DEC-099, DEC-103); mốc để tính luật "quá 7 ngày → No Response" (BR-026)']
  createdAt timestamp [not null]
  updatedAt timestamp [not null]

  note: 'Độc lập với MonthBudget/Category/Transaction — trang Roadmap, ngoài phạm vi Hệ Thống Quản Lý Chi Tiêu (DEC-088)'

  indexes {
    platformId
  }
}
```

| Kiểm tra | Kết quả |
| --- | --- |
| DBML có đủ model mới | Đạt — cập nhật `Table JobApplication` hiện có, thêm dòng `submittedAt`, không tạo bảng mới |
| Quan hệ (`Ref:`) khớp với Prisma | Đạt — không đổi quan hệ với `JobPlatform` |
| Ghi chú field khớp thuật ngữ trong `glossary.md` | Đạt — "Ngày nộp hồ sơ" đã có trong `glossary.md` mục 1 (thêm ở `ssr-raw`) |

## 6. Backfill Và Rollback

| Hạng mục | Nội dung |
| --- | --- |
| Backfill cần thiết | Không — cột mới nullable, dòng cũ tự nhận `NULL`, đúng nghĩa nghiệp vụ "chưa từng có mốc Ngày nộp hồ sơ" (khớp `AC-09`) |
| Dữ liệu có thể mất | Không có — chỉ thêm cột, không đổi/xóa cột nào hiện có |
| Rollback | Xóa thư mục migration `add_job_submitted_at` nếu chưa deploy; nếu đã deploy, tạo migration mới `DROP COLUMN` (SQLite hỗ trợ từ bản Prisma dùng `ALTER TABLE ... DROP COLUMN` khi không có ràng buộc phụ thuộc) — không sửa tay `migration.sql` |
| Đã backup file SQLite | Có — `prisma/backups/dev.db.us-020-before-submitted-at.20260814165055.bak` (backup trước khi áp migration, theo đúng tiền lệ `US-018`) |

## 7. Verification

| Bước | Lệnh | Kết quả |
| --- | --- | --- |
| Format schema | `rtk npx prisma format` | Passed (2026-08-14) |
| Validate schema | `rtk npx prisma validate` | Passed (2026-08-14) |
| Áp migration | `rtk npx prisma migrate dev --name add_job_submitted_at` | Passed (2026-08-14) — migration `20260814095134_add_job_submitted_at` đã áp dụng, database "in sync with schema" |
| Sinh client | `rtk npx prisma generate` | Passed (2026-08-14) — Prisma Client 7.9.1 |
| Typecheck sau khi client đổi | `rtk tsc --noEmit` | Passed (2026-08-14) — 0 lỗi |
