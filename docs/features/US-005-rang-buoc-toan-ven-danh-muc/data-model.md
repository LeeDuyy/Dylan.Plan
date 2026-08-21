# Ràng buộc toàn vẹn danh mục + giao dịch không danh mục — Data Model Delta

Status: Applied
Feature: US-005
Prisma Schema: `prisma/schema.prisma`
DBML: `docs/db/schema.dbml`
Provider: sqlite
Created: 2026-08-06
Owner: ssr-data

## 1. Thay Đổi Model

| Model | Thay đổi | Lý do nghiệp vụ | AC liên quan |
| --- | --- | --- | --- |
| `Category` | Thêm field `isFallback` | Phân biệt danh mục dự phòng "Chi tiêu khác" (khóa hoàn toàn — không cho sửa tên/loại/ngân sách, chỉ chặn xóa như danh mục khóa khác) — DEC-058, DEC-027, BR-010 | AC-01, AC-02, AC-03, AC-04, AC-06 |

## 2. Prisma Schema Delta

```prisma
// Trước
model Category {
  id      String  @id @default(cuid())
  monthId String
  name    String
  type    String
  budget  Int
  locked  Boolean @default(false)

  month        MonthBudget   @relation(fields: [monthId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([monthId])
}

// Sau
model Category {
  id         String  @id @default(cuid())
  monthId    String
  name       String
  type       String
  budget     Int
  locked     Boolean @default(false)
  isFallback Boolean @default(false)

  month        MonthBudget   @relation(fields: [monthId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([monthId])
}
```

| Field | Kiểu Prisma | Kiểu SQLite | Nullable | Default | Unique/Index |
| --- | --- | --- | --- | --- | --- |
| `isFallback` | `Boolean` | `INTEGER` (0/1, quy ước Boolean của Prisma trên SQLite) | Không | `false` | Không cần index riêng — bảng `Category` nhỏ, luôn lọc kèm `monthId` (đã có index) |

## 3. Migration SQLite

Lệnh sinh migration: `rtk npx prisma migrate dev --name add_category_is_fallback`

- Thư mục sinh ra: `prisma/migrations/20260806083443_add_category_is_fallback/`
- KHÔNG sửa tay `migration.sql`. Muốn đổi thì sửa `schema.prisma` rồi sinh lại.

| Bước | Nội dung | An toàn với dữ liệu cũ |
| --- | --- | --- |
| 1 | Prisma tự chọn chiến lược `RedefineTables` (không phải `ALTER TABLE ADD COLUMN` đơn giản như dự kiến ban đầu): tạo bảng `new_Category` có thêm cột `isFallback BOOLEAN NOT NULL DEFAULT false`, copy toàn bộ dữ liệu từ `Category` cũ (9 cột gốc, không chọn `isFallback` vì chưa tồn tại nên nhận default), `DROP TABLE Category`, đổi tên `new_Category` → `Category`, tạo lại `CREATE INDEX Category_monthId_idx` | Có — đây là mẫu rebuild-bảng chuẩn của Prisma cho SQLite (áp dụng cả khi chỉ thêm 1 cột có default), không mất dữ liệu; toàn bộ danh mục hiện có tự động nhận `isFallback=false` qua default khi insert lại, đúng ý nghĩa vì chưa danh mục nào từng là "Chi tiêu khác" trước US-005. Xem SQL thật tại `prisma/migrations/20260806083443_add_category_is_fallback/migration.sql` |

## 4. Ràng Buộc SQLite

Đối chiếu từng mục — SQLite không hỗ trợ đầy đủ như Postgres:

| Ràng buộc | Áp dụng | Xử lý |
| --- | --- | --- |
| Không có native `enum` | Không | Field là `Boolean`, không phải enum |
| `ALTER TABLE` hạn chế (đổi kiểu/drop constraint phải tạo bảng mới) | Không | Chỉ thêm cột mới, không đổi kiểu cột nào có sẵn — `ADD COLUMN` được SQLite hỗ trợ trực tiếp |
| Thêm cột `NOT NULL` phải có default hoặc backfill | Có | Đã có `@default(false)` — không cần script backfill riêng, giá trị mặc định đúng ý nghĩa nghiệp vụ cho toàn bộ dữ liệu cũ |
| Không có `citext`, so sánh chuỗi phân biệt hoa thường | Không | Field `Boolean`, không liên quan so sánh chuỗi |
| Ghi đồng thời bị khóa toàn DB | Không | Migration chỉ thêm cột, chạy một lần, single-user (DEC-004) — không có job ghi nặng chạy song song |
| Không có native array/JSON type | Không | Không áp dụng cho field này |

## 5. Đồng Bộ DBML

- Nguồn sự thật: `schema.prisma`. DBML là bản dẫn xuất, không sửa ngược.
- Lệnh sinh: `rtk npx prisma generate` — dự án chưa cài generator DBML (`prisma-dbml-generator`), xác nhận lại đúng như `docs/db/schema.dbml` dòng 1 đã ghi ("không có generator DBML cài sẵn").
- Không có generator: đã cập nhật thủ công đúng delta bên dưới vào `docs/db/schema.dbml`.

```dbml
Table Category {
  id text [pk]
  monthId text [not null, ref: > MonthBudget.id]
  name text [not null]
  type text [not null]
  budget integer [not null]
  locked boolean [not null, default: false]
  isFallback boolean [not null, default: false, note: '"Chi tiêu khác" khi true — khóa hoàn toàn, không cho sửa tên/loại/ngân sách (DEC-027, DEC-058)']
  createdAt timestamp [not null]
  updatedAt timestamp [not null]

  note: 'Chi thực tế không lưu ở đây — tính bằng aggregate trên Transaction (DEC-007)'
}
```

| Kiểm tra | Kết quả |
| --- | --- |
| DBML có đủ model mới | Đạt |
| Quan hệ (`Ref:`) khớp với Prisma | Đạt — không đổi quan hệ nào |
| Ghi chú field khớp thuật ngữ trong `glossary.md` | Đạt — khớp mục "Chi tiêu khác" trong `docs/memory/glossary.md` |

## 6. Backfill Và Rollback

| Hạng mục | Nội dung |
| --- | --- |
| Backfill cần thiết | Không — `@default(false)` tự áp dụng đúng ý nghĩa cho toàn bộ dòng cũ |
| Dữ liệu có thể mất | Không — chỉ thêm cột, không đổi/xóa cột nào có sẵn |
| Rollback | Xóa thư mục migration `prisma/migrations/20260806083443_add_category_is_fallback/` (chưa deploy lên môi trường khác ngoài máy phát triển), bỏ field `isFallback` khỏi `schema.prisma`, chạy lại `prisma migrate dev` để đồng bộ; hoặc phục hồi từ file backup nếu cần |
| Đã backup file SQLite | Có — `prisma/backups/dev.db.us-005-before-isfallback.20260806133300.bak` (chụp trước khi chạy migration) |

## 7. Verification

| Bước | Lệnh | Kết quả |
| --- | --- | --- |
| Format schema | `rtk npx prisma format` | Passed |
| Validate schema | `rtk npx prisma validate` | Passed |
| Áp migration | `rtk npx prisma migrate dev --name add_category_is_fallback` | Passed |
| Sinh client | `rtk npx prisma generate` | Passed (chạy kèm trong `migrate dev`) |
| Typecheck sau khi client đổi | `rtk tsc --noEmit` | Passed |
