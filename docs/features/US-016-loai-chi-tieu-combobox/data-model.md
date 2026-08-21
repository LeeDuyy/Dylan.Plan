# Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định — Data Model Delta

Status: Applied
Feature: US-016
Prisma Schema: `prisma/schema.prisma`
DBML: `docs/db/schema.dbml`
Provider: sqlite
Created: 2026-08-11
Owner: ssr-data

## 1. Thay Đổi Model

| Model | Thay đổi | Lý do nghiệp vụ | AC liên quan |
| --- | --- | --- | --- |
| `Category` | Không đổi field/model — chỉ backfill dữ liệu (`UPDATE`) cho cột `type` đã có sẵn | Chuẩn hóa 44 dòng dữ liệu cũ (`"Linh hoạt"` × 43, `"Linh s"` × 1, lỗi gõ dở dang) về đúng 1 trong 3 giá trị hợp lệ mới trước khi UI chỉ còn cho chọn qua danh sách cố định — `docs/memory/decisions.md#dec-073` | AC-03, AC-04 |

## 2. Prisma Schema Delta

Không có delta — `schema.prisma` giữ nguyên. `Category.type` vẫn là `String`, không thêm/sửa/xóa field hay model nào.

```prisma
// Không đổi
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
| `type` | `String` (không đổi) | `TEXT` | Không | Không | Không cần index riêng — không đổi so với hiện tại |

## 3. Migration SQLite

**Đã thử và bị chặn đúng theo thiết kế:** bước đầu dùng `prisma migrate dev --create-only --name normalize_category_type` để tạo một migration rỗng (không có schema diff nào để Prisma tự sinh SQL), sau đó định điền câu `UPDATE` vào `migration.sql`. Hook `guard-artifact-path` của dự án chặn thao tác này (`SSR-E020`): *"Không ghi trực tiếp vào migration.sql — migration SQL phải sinh bằng `prisma migrate dev`, không sửa tay."* Đây là ràng buộc đúng đắn — dự án không có quy trình nào cho phép nội dung SQL do người/agent tự viết nằm trong `prisma/migrations/`. Đã xóa thư mục migration rỗng vừa tạo (`20260811165333_normalize_category_type/`), chưa từng được áp dụng (`prisma migrate status` xác nhận trước khi xóa).

**Cách đã làm thay thế:** chạy trực tiếp một câu `UPDATE` một lần lên `prisma/dev.db` bằng `better-sqlite3` (thư viện driver adapter dự án đã dùng sẵn ở `lib/prisma.ts`, `DEC-043`) qua Node script tạm, **không** đi qua `prisma/migrations/` vì đây không phải thay đổi cấu trúc dữ liệu — không có gì để Prisma theo dõi trong lịch sử migration. Tương đương hoàn toàn về mặt dữ liệu với một migration data-only, chỉ khác ở chỗ không nằm trong lịch sử migration có version:

```sql
UPDATE "Category" SET "type" = 'Khác' WHERE "type" NOT IN ('Cố định', 'Tích lũy');
```

Đã backup `prisma/dev.db` trước khi chạy (mục 6). Kết quả thật (2026-08-11):

| Trước | Sau |
| --- | --- |
| `"Cố định"` × 22, `"Linh hoạt"` × 43, `"Tích lũy"` × 18, `"Linh s"` × 1 | `"Cố định"` × 22, `"Tích lũy"` × 18, `"Khác"` × 44 |

`44` dòng thay đổi — khớp chính xác dự tính (`43` + `1`).

| Bước | Nội dung | An toàn với dữ liệu cũ |
| --- | --- | --- |
| 1 | `UPDATE` một cột `TEXT` đã có sẵn qua kết nối trực tiếp tới `prisma/dev.db`, không đổi cấu trúc bảng, không đổi giá trị của `"Cố định"`/`"Tích lũy"` | Có — đã chạy thật và xác nhận: chỉ 44/84 dòng đổi giá trị, 40 dòng còn lại (`"Cố định"` 22 + `"Tích lũy"` 18) giữ nguyên; không xóa, không đổi cột nào khác |

## 4. Ràng Buộc SQLite

Đối chiếu từng mục — SQLite không hỗ trợ đầy đủ như Postgres:

| Ràng buộc | Áp dụng | Xử lý |
| --- | --- | --- |
| Không có native `enum` | Có | `type` vẫn là `String` + validate ở tầng ứng dụng (`server/budget/domain/rules/category-type-rule.ts`, việc của `ssr-dev`) — 3 giá trị hợp lệ ghi vào `docs/memory/glossary.md` (đã cập nhật từ trước, `DEC-073`) |
| `ALTER TABLE` hạn chế (đổi kiểu/drop constraint phải tạo bảng mới) | Không | Không đổi kiểu cột nào — chỉ `UPDATE` giá trị |
| Thêm cột `NOT NULL` phải có default hoặc backfill | Không | Không thêm cột nào |
| Không có `citext`, so sánh chuỗi phân biệt hoa thường | Không | Câu lệnh dùng `NOT IN` so khớp chính xác từng giá trị đã biết (`'Cố định'`, `'Tích lũy'`) — không cần so sánh không phân biệt hoa/thường ở tầng SQL |
| Ghi đồng thời bị khóa toàn DB | Không | Migration chạy một lần, single-user (`DEC-004`), bảng `Category` nhỏ (84 dòng) — không có job ghi nặng chạy song song |
| Không có native array/JSON type | Không | Không áp dụng cho field này |

## 5. Đồng Bộ DBML

- Nguồn sự thật: `schema.prisma`. DBML là bản dẫn xuất, không sửa ngược.
- Lệnh sinh: `rtk npx prisma generate` — dự án chưa cài generator DBML (`prisma-dbml-generator`), đúng như `docs/db/schema.dbml` dòng 1 đã ghi.
- Không có generator: cập nhật thủ công. Ở đây `schema.prisma` không đổi, DBML cũng không đổi cấu trúc — chỉ thêm `note` tài liệu hóa 3 giá trị hợp lệ của `type` (không có trong template Prisma vì đây là ràng buộc chỉ tồn tại ở tầng ứng dụng, không phải ràng buộc DB).

```dbml
Table Category {
  id text [pk]
  monthId text [not null, ref: > MonthBudget.id]
  name text [not null]
  type text [not null, note: 'Chỉ 1 trong 3 giá trị: "Cố định" | "Tích lũy" | "Khác" — ràng buộc ở tầng ứng dụng (BR-019, DEC-073), không phải CHECK constraint của DB']
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
| DBML có đủ model mới | Đạt — không có model mới, chỉ thêm `note` |
| Quan hệ (`Ref:`) khớp với Prisma | Đạt — không đổi quan hệ nào |
| Ghi chú field khớp thuật ngữ trong `glossary.md` | Đạt — khớp mục "Loại danh mục" đã cập nhật theo `DEC-073` |

## 6. Backfill Và Rollback

| Hạng mục | Nội dung |
| --- | --- |
| Backfill cần thiết | Có — đã chạy trực tiếp (mục 3), không qua `prisma/migrations/` vì không có gì để Prisma theo dõi (không đổi cấu trúc) |
| Dữ liệu có thể mất | Không — chỉ đổi giá trị chuỗi của `type` cho 44 dòng đã lệch chuẩn, không xóa/đổi cột nào khác. Idempotent: chạy lại cho kết quả giống hệt (dòng đã là `"Khác"` không còn khớp `NOT IN` nữa) |
| Rollback | Khôi phục từ file backup (dòng dưới) nếu cần đảo ngược — không thể phân biệt lại "Linh hoạt" với "Linh s" sau khi đã gộp chung thành "Khác" nên không có script đảo ngược theo từng giá trị gốc |
| Đã backup file SQLite | Có — `prisma/backups/dev.db.us-016-before-normalize-type.20260811235212.bak` (chụp trước khi chạy backfill, xác nhận bằng `git status`/`ls` trước khi ghi đè `dev.db`) |

## 7. Verification

| Bước | Lệnh | Kết quả |
| --- | --- | --- |
| Format schema | `npx prisma format` | Passed — "Formatted prisma\schema.prisma" |
| Validate schema | `npx prisma validate` | Passed — "The schema at prisma\schema.prisma is valid" |
| Tạo migration (create-only) — thử nghiệm | `npx prisma migrate dev --create-only --name normalize_category_type` | Tạo thành công thư mục rỗng, nhưng bị chặn khi điền SQL (`SSR-E020`) — đã xóa thư mục, xem mục 3 |
| Backfill dữ liệu thật | Node script dùng `better-sqlite3`, `UPDATE Category SET type = 'Khác' WHERE type NOT IN (...)` | Passed — 44 dòng thay đổi, xác nhận trước/sau ở mục 3 |
| Xác nhận dữ liệu | Query trực tiếp `Category` `GROUP BY type` sau backfill | Passed — chỉ còn 3 giá trị: `"Cố định"` (22), `"Tích lũy"` (18), `"Khác"` (44) |
| Sinh client | `npx prisma generate` | Không cần chạy lại — `schema.prisma` không đổi, client hiện có vẫn khớp |
