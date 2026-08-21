# Sắp xếp vị trí danh mục bằng kéo thả — Data Model Delta

Status: Applied
Feature: US-017
Prisma Schema: `prisma/schema.prisma`
DBML: `docs/db/schema.dbml`
Provider: sqlite
Created: 2026-08-12
Owner: ssr-data

## 1. Thay Đổi Model

| Model | Thay đổi | Lý do nghiệp vụ | AC liên quan |
| --- | --- | --- | --- |
| `Category` | Thêm field `order`; thêm index `@@index([monthId, order])` | Lưu bền vững vị trí hiển thị sau khi Dylan kéo thả sắp xếp lại danh mục — hiện không có cột nào lưu thứ tự (`docs/features/US-017-sap-xep-danh-muc-keo-tha/plan.md` mục 9) | AC-01, AC-02, AC-05, AC-07, AC-08 |

## 2. Prisma Schema Delta

```prisma
// Trước
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

// Sau
model Category {
  id         String  @id @default(cuid())
  monthId    String
  name       String
  type       String
  budget     Int
  locked     Boolean @default(false)
  isFallback Boolean @default(false)
  order      Int     @default(0)

  month        MonthBudget   @relation(fields: [monthId], references: [id], onDelete: Cascade)
  transactions Transaction[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([monthId])
  @@index([monthId, order])
}
```

| Field | Kiểu Prisma | Kiểu SQLite | Nullable | Default | Unique/Index |
| --- | --- | --- | --- | --- | --- |
| `order` | `Int` | `INTEGER` | Không | `0` | `@@index([monthId, order])` (đọc theo thứ tự trong từng tháng) |

## 3. Migration SQLite

Lệnh sinh migration: `npx prisma migrate dev --name add_category_order`

- Thư mục sinh ra: `prisma/migrations/20260812063115_add_category_order/` — đã áp dụng thành công (2026-08-12).
- KHÔNG sửa tay `migration.sql`. Muốn đổi thì sửa `schema.prisma` rồi sinh lại.
- **Thực tế Prisma sinh ra**: khác với dự tính ban đầu (`ALTER TABLE ADD COLUMN` đơn giản), engine chọn chiến lược "RedefineTables" (tạo `new_Category`, `INSERT ... SELECT` toàn bộ cột cũ, `DROP TABLE Category`, `RENAME new_Category -> Category`) — đây vẫn là SQL do chính Prisma suy luận từ schema diff thật, không phải viết tay; chiến lược này an toàn tương đương vì `INSERT ... SELECT` không liệt kê cột `order` nên SQLite tự điền `DEFAULT 0` cho mọi dòng, không mất dữ liệu ở các cột khác (xác nhận bằng đếm dòng trước/sau ở mục 6).

| Bước | Nội dung | An toàn với dữ liệu cũ |
| --- | --- | --- |
| 1 | Tạo `new_Category` với đủ cột cũ + `order INTEGER NOT NULL DEFAULT 0`, `INSERT ... SELECT` toàn bộ dòng cũ (không liệt kê `order` → nhận default `0`), `DROP TABLE Category`, `RENAME new_Category` (Prisma tự sinh) | Có — đã chạy thật, xác nhận 84/84 dòng còn nguyên sau migration, mọi cột khác giữ nguyên giá trị; `order = 0` cho toàn bộ dòng **tạm thời** cho tới khi backfill ở mục 6 chạy |
| 2 | `CREATE INDEX "Category_monthId_idx"` (tái tạo lại do rebuild bảng) và `CREATE INDEX "Category_monthId_order_idx" ON "Category"("monthId", "order")` (Prisma tự sinh) | Có — chỉ tạo index, không đổi dữ liệu |

## 4. Ràng Buộc SQLite

Đối chiếu từng mục — SQLite không hỗ trợ đầy đủ như Postgres:

| Ràng buộc | Áp dụng | Xử lý |
| --- | --- | --- |
| Không có native `enum` | Không | `order` là `Int` thuần, không phải tập giá trị cố định |
| `ALTER TABLE` hạn chế (đổi kiểu/drop constraint phải tạo bảng mới) | Không | Chỉ **thêm cột mới có default hằng số** — đúng thao tác SQLite hỗ trợ trực tiếp qua `ALTER TABLE ADD COLUMN`, không đổi kiểu cột nào có sẵn |
| Thêm cột `NOT NULL` phải có default hoặc backfill | **Có** | Có `@default(0)` để migration chạy được, nhưng vì SQLite không đảm bảo thứ tự ổn định giữa các dòng cùng `order = 0`, **bắt buộc backfill ngay sau migration** — xem mục 6, không dừng lại ở default tĩnh |
| Không có `citext`, so sánh chuỗi phân biệt hoa thường | Không | `order` không phải chuỗi |
| Ghi đồng thời bị khóa toàn DB | Không | Single-user (`DEC-004`), bảng `Category` nhỏ (84 dòng tính tới 2026-08-11 theo `docs/features/US-016-loai-chi-tieu-combobox/data-model.md`), migration + backfill chạy một lần, không có job ghi song song |
| Không có native array/JSON type | Không | Không áp dụng |

## 5. Đồng Bộ DBML

- Nguồn sự thật: `schema.prisma`. DBML là bản dẫn xuất, không sửa ngược.
- Lệnh sinh: `npx prisma generate` — dự án chưa cài generator DBML (`prisma-dbml-generator`), như `docs/db/schema.dbml` dòng 1 đã ghi từ trước.
- Không có generator: cập nhật thủ công đúng delta bên dưới.

```dbml
Table Category {
  id text [pk]
  monthId text [not null, ref: > MonthBudget.id]
  name text [not null]
  type text [not null, note: 'Chỉ 1 trong 3 giá trị: "Cố định" | "Tích lũy" | "Khác" — ràng buộc ở tầng ứng dụng (BR-019, DEC-073), không phải CHECK constraint của DB']
  budget integer [not null]
  locked boolean [not null, default: false]
  isFallback boolean [not null, default: false, note: '"Chi tiêu khác" khi true — khóa hoàn toàn, không cho sửa tên/loại/ngân sách (DEC-027, DEC-058)']
  order integer [not null, default: 0, note: 'Vị trí hiển thị trong bảng danh mục — Dylan tự sắp xếp bằng kéo thả (US-017, BR-020). "Chi tiêu khác" (isFallback=true) vẫn có giá trị order như dòng khác nhưng tầng ứng dụng luôn hiển thị nó ở cuối bất kể giá trị này (BR-016), không phải CHECK constraint của DB']
  createdAt timestamp [not null]
  updatedAt timestamp [not null]

  note: 'Chi thực tế không lưu ở đây — tính bằng aggregate trên Transaction (DEC-007)'

  indexes {
    (monthId, order)
  }
}
```

| Kiểm tra | Kết quả |
| --- | --- |
| DBML có đủ model mới | Đạt — thêm field `order` và index `(monthId, order)` cho `Category` |
| Quan hệ (`Ref:`) khớp với Prisma | Đạt — không đổi quan hệ nào |
| Ghi chú field khớp thuật ngữ trong `glossary.md` | Đạt — không phát sinh thuật ngữ nghiệp vụ mới, `order` chỉ là chi tiết lưu trữ nội bộ, không xuất hiện làm nhãn hiển thị |

## 6. Backfill Và Rollback

| Hạng mục | Nội dung |
| --- | --- |
| Backfill cần thiết | Có — đã chạy trực tiếp bằng `better-sqlite3` (driver adapter dự án đã dùng sẵn, `lib/prisma.ts`, `DEC-043`) qua Node script tạm ở gốc dự án (xóa ngay sau khi chạy). Gán `order` tuần tự (0, 1, 2, ...) cho từng `Category`, sắp theo `rowid ASC` **trong từng `monthId`** — dùng `rowid` thay vì `createdAt` (chính xác hơn, không có rủi ro trùng mốc thời gian) vì `rowid` chính là thứ tự SQLite thực sự đang trả về khi chưa có `orderBy`, đúng thứ tự hiển thị hiện tại của Dylan (xác nhận ở `docs/features/US-017-sap-xep-danh-muc-keo-tha/plan.md` mục 3). Theo đúng tiền lệ `JDG-018`: migration ở mục 3 đã có schema diff thật để Prisma tự sinh SQL; phần backfill giá trị này không có diff cấu trúc nào để theo dõi nên chạy ngoài `prisma/migrations/`, giống cách US-016 đã xử lý |
| Dữ liệu có thể mất | Không — chỉ ghi giá trị cho cột mới thêm (`order`), không đụng cột nào khác. Idempotent theo tháng: chạy lại sẽ tính lại đúng thứ tự `rowid` hiện có, không phụ thuộc giá trị `order` cũ. Kết quả thật (2026-08-12): 84/84 dòng được gán `order`, chia đều 11 tháng (`2026-02`..`2027-02`, từ 5 đến 9 danh mục/tháng) — khớp đúng tổng 84 dòng đã biết trước đó (`docs/features/US-016-loai-chi-tieu-combobox/data-model.md`) |
| Rollback | Nếu cần hoàn tác cấu trúc: xóa field `order` khỏi `schema.prisma`, chạy `prisma migrate dev --name remove_category_order` để sinh migration `DROP COLUMN`. Nếu chỉ cần hoàn tác dữ liệu: khôi phục từ file backup (dòng dưới) |
| Đã backup file SQLite | Có — `prisma/backups/dev.db.us-017-before-order-backfill.20260812133105.bak` (chụp trước khi chạy migration + backfill, xác nhận bằng `ls` trước/sau) |

## 7. Verification

| Bước | Lệnh | Kết quả |
| --- | --- | --- |
| Format schema | `npx prisma format` | Passed — "Formatted prisma\schema.prisma" |
| Validate schema | `npx prisma validate` | Passed — "The schema at prisma\schema.prisma is valid" |
| Áp migration | `npx prisma migrate dev --name add_category_order` | Passed — "Your database is now in sync with your schema", migration `20260812063115_add_category_order` đã áp dụng |
| Backfill dữ liệu | Node script dùng `better-sqlite3` | Passed — 84 dòng, 11 tháng, xác nhận thứ tự đúng bằng query trực tiếp (vd tháng `2026-08`: 0..5 khớp thứ tự hiển thị cũ) |
| Sinh client | `npx prisma generate` | Passed — "Generated Prisma Client (7.9.1) to .\generated\prisma" |
| Typecheck sau khi client đổi | `npx tsc --noEmit` | Passed — không có lỗi |
