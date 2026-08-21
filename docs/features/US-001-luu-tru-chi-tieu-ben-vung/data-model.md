# Lưu trữ chi tiêu bền vững và liên kết giao dịch theo danh mục cố định — Data Model Delta

Status: Applied
Feature: US-001
Prisma Schema: `prisma/schema.prisma`
DBML: `docs/db/schema.dbml`
Provider: sqlite
Created: 2026-08-03
Owner: ssr-data

## 1. Thay Đổi Model

| Model | Thay đổi | Lý do nghiệp vụ | AC liên quan |
| --- | --- | --- | --- |
| `MonthBudget` | Thêm model | Lưu bền vững một tháng ngân sách (trước đây chỉ ở state trình duyệt) | AC-01, AC-04, AC-07 |
| `Category` | Thêm model | Lưu bền vững danh mục, làm mục tiêu tham chiếu cho giao dịch qua khoá cố định | AC-02, AC-05 |
| `Transaction` | Thêm model | Lưu bền vững giao dịch, tham chiếu `Category` qua `categoryId` thay vì tên chuỗi (US-003) | AC-02, AC-03, AC-05 |
| `LegacyMigration` | Thêm model | Trạng thái di trú dữ liệu cũ dùng chung giữa các thiết bị (DEC-039, DEC-040) | AC-06, AC-07, AC-08 |

## 2. Prisma Schema Delta

```prisma
// Trước — không có model nào cho dữ liệu ngân sách

// Sau
model MonthBudget {
  id     String @id
  label  String
  income Int

  categories   Category[]
  transactions Transaction[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

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

model Transaction {
  id         String   @id @default(cuid())
  monthId    String
  categoryId String
  text       String
  amount     Int
  createdAt  DateTime @default(now())

  month    MonthBudget @relation(fields: [monthId], references: [id], onDelete: Cascade)
  category Category    @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@index([monthId])
  @@index([categoryId])
}

model LegacyMigration {
  id           String    @id @default("singleton")
  status       String    @default("Pending")
  startedAt    DateTime?
  completedAt  DateTime?
  errorMessage String?

  updatedAt DateTime @updatedAt
}
```

| Field | Kiểu Prisma | Kiểu SQLite | Nullable | Default | Unique/Index |
| --- | --- | --- | --- | --- | --- |
| `MonthBudget.id` | `String` | `TEXT` | Không | — (client cung cấp, dạng `YYYY-MM`) | PK |
| `MonthBudget.income` | `Int` | `INTEGER` | Không | — (client cung cấp, mặc định nghiệp vụ 35.000.000 xử lý ở `lib/budget-defaults.ts`) | — |
| `Category.id` | `String` | `TEXT` | Không | `cuid()` | PK |
| `Category.monthId` | `String` | `TEXT` | Không | — | `@@index([monthId])`, FK → `MonthBudget.id` |
| `Category.locked` | `Boolean` | `INTEGER` (0/1) | Không | `false` | — |
| `Transaction.id` | `String` | `TEXT` | Không | `cuid()` | PK |
| `Transaction.monthId` | `String` | `TEXT` | Không | — | `@@index([monthId])`, FK → `MonthBudget.id` |
| `Transaction.categoryId` | `String` | `TEXT` | Không | — | `@@index([categoryId])`, FK → `Category.id` |
| `Transaction.amount` | `Int` | `INTEGER` | Không | — | — |
| `LegacyMigration.id` | `String` | `TEXT` | Không | `"singleton"` | PK — cố định một dòng duy nhất vì hệ thống single-user (DEC-004) |
| `LegacyMigration.status` | `String` | `TEXT` | Không | `"Pending"` | Tập giá trị hợp lệ: `Pending`, `InProgress`, `Completed`, `Failed` (không có enum gốc trên SQLite) |

Không có cột `actual` trên `Category` — "Chi thực tế" luôn tính bằng `prisma.transaction.aggregate({ _sum: { amount: true }, where: { categoryId } })` tại thời điểm đọc (DEC-007, BR-01 trong BA wiki US-001). Không thêm `@@unique([monthId, name])` trên `Category` — để dành cho US-010 (chặn trùng tên) theo đúng phạm vi `plan.md` mục 9.

## 3. Migration SQLite

Lệnh sinh migration: `npx prisma migrate dev --name init_budget_persistence`

- Thư mục sinh ra: `prisma/migrations/20260803064029_init_budget_persistence/`
- KHÔNG sửa tay `migration.sql`. Muốn đổi thì sửa `schema.prisma` rồi sinh lại.

| Bước | Nội dung | An toàn với dữ liệu cũ |
| --- | --- | --- |
| 1 | Tạo 4 bảng mới (`MonthBudget`, `Category`, `Transaction`, `LegacyMigration`) cùng index và khoá ngoại | Có — đây là migration khởi tạo đầu tiên trên một database SQLite hoàn toàn trống, không có bảng nào tồn tại trước đó để mất dữ liệu |

## 4. Ràng Buộc SQLite

Đối chiếu từng mục — SQLite không hỗ trợ đầy đủ như Postgres:

| Ràng buộc | Áp dụng | Xử lý |
| --- | --- | --- |
| Không có native `enum` | Có | `LegacyMigration.status` dùng `String` + validate tập giá trị (`Pending`/`InProgress`/`Completed`/`Failed`) ở tầng ứng dụng (`server/budget.ts`); tập giá trị đã ghi vào `glossary.md` |
| `ALTER TABLE` hạn chế (đổi kiểu/drop constraint phải tạo bảng mới) | Không | Migration này chỉ tạo bảng mới, không đổi kiểu cột có sẵn |
| Thêm cột `NOT NULL` phải có default hoặc backfill | Không | Không có bảng cũ nào để backfill — mọi cột `NOT NULL` mới đều thuộc bảng mới tạo, dữ liệu di trú (Server Action `migrateLegacyData`, thuộc `ssr-dev`) sẽ cung cấp đủ giá trị khi ghi |
| Không có `citext`, so sánh chuỗi phân biệt hoa thường | Không | Chưa có truy vấn so sánh tên không phân biệt hoa/thường ở US-001 — sẽ áp dụng ở US-010 (chặn trùng tên) khi tới lượt |
| Ghi đồng thời bị khóa toàn DB | Có | Ghi nhận rủi ro: `migrateLegacyData` và `recordQuickTransaction` đều là ghi; vì hệ thống single-user (DEC-004) và di trú chỉ chạy một lần, rủi ro tranh chấp ghi thấp — không thiết kế job nền ghi nặng chạy song song |
| Không có native array/JSON type | Không | Không có field nào cần lưu mảng/JSON ở US-001 |

## 5. Đồng Bộ DBML

- Nguồn sự thật: `schema.prisma`. DBML là bản dẫn xuất, không sửa ngược.
- Lệnh sinh: `npx prisma generate` — dự án **chưa cài generator DBML** (không có `prisma-dbml-generator` hay tương đương trong `package.json`).
- **Cập nhật thủ công** `docs/db/schema.dbml` đúng delta bên dưới (không phải sinh tự động).

```dbml
Table MonthBudget {
  id text [pk, note: 'Dạng YYYY-MM, client cung cấp']
  label text [not null]
  income integer [not null]
  createdAt timestamp [not null]
  updatedAt timestamp [not null]
}

Table Category {
  id text [pk]
  monthId text [not null, ref: > MonthBudget.id]
  name text [not null]
  type text [not null]
  budget integer [not null]
  locked boolean [not null, default: false]
  createdAt timestamp [not null]
  updatedAt timestamp [not null]

  note: 'Chi thực tế không lưu ở đây — tính bằng aggregate trên Transaction (DEC-007)'
}

Table Transaction {
  id text [pk]
  monthId text [not null, ref: > MonthBudget.id]
  categoryId text [not null, ref: > Category.id]
  text text [not null]
  amount integer [not null]
  createdAt timestamp [not null]
}

Table LegacyMigration {
  id text [pk, note: 'Cố định "singleton" — single-user (DEC-004)']
  status text [not null, default: 'Pending', note: 'Pending | InProgress | Completed | Failed']
  startedAt timestamp
  completedAt timestamp
  errorMessage text

  updatedAt timestamp [not null]
}
```

| Kiểm tra | Kết quả |
| --- | --- |
| DBML có đủ model mới | Đạt |
| Quan hệ (`ref:`) khớp với Prisma | Đạt |
| Ghi chú field khớp thuật ngữ trong `glossary.md` | Đạt |

## 6. Backfill Và Rollback

| Hạng mục | Nội dung |
| --- | --- |
| Backfill cần thiết | Không — đây là migration khởi tạo trên database trống, không có dữ liệu cũ trong SQLite cần backfill. Việc "di trú" dữ liệu `localStorage` sang DB là một luồng nghiệp vụ riêng (Server Action `migrateLegacyData`, thuộc phạm vi `ssr-dev`), không phải backfill schema |
| Dữ liệu có thể mất | Không — chưa từng có bảng nào tồn tại trước migration này |
| Rollback | Xoá thư mục `prisma/migrations/20260803064029_init_budget_persistence/` và file `prisma/dev.db`, sau đó chạy lại `prisma migrate dev` từ `schema.prisma` rỗng nếu cần huỷ hoàn toàn (chỉ áp dụng trong môi trường dev cục bộ — chưa deploy) |
| Đã backup file SQLite | Không cần — `prisma/dev.db` mới được tạo trong chính migration này, chưa có dữ liệu thật của Dylan (dữ liệu thật vẫn đang ở `localStorage` cho tới khi luồng di trú chạy) |

## 7. Verification

| Bước | Lệnh | Kết quả |
| --- | --- | --- |
| Validate schema | `npx prisma validate` | Passed |
| Format schema | `npx prisma format` | Passed |
| Sinh client | `npx prisma generate` | Passed — Prisma Client 7.9.1 sinh vào `generated/prisma` |
| Áp migration | `npx prisma migrate dev --name init_budget_persistence` | Passed — `prisma/dev.db` tạo tại đúng vị trí `SSR_SQLITE_FILE` sau khi sửa `DATABASE_URL` trong `.env` (xem Ghi Chú Kỹ Thuật) |
| Typecheck sau khi client đổi | `npx tsc --noEmit` | Passed — 0 lỗi |

### Ghi Chú Kỹ Thuật (ngoài 7 mục chuẩn)

- Prisma 7 dùng `prisma.config.ts` (không còn đọc `.env` tự động) và generator mặc định `prisma-client` (không phải `prisma-client-js` cũ), output tại `generated/prisma` (thư mục mới ở gốc dự án, ngoài `prisma/`). `lib/prisma.ts` (việc của `ssr-dev`) cần import từ `../generated/prisma` (hoặc alias `@/generated/prisma`), không phải `@prisma/client`.
- File `.env` gốc do `npx prisma init` sinh có `DATABASE_URL="file:./dev.db"`, khi chạy sẽ tạo `dev.db` tại **gốc dự án** thay vì `prisma/dev.db` như `SSR_SQLITE_FILE` yêu cầu — vì `prisma.config.ts` resolve `file:` URL tương đối theo thư mục làm việc (project root), không theo vị trí `schema.prisma` như các phiên bản Prisma cũ. Đã sửa `DATABASE_URL` thành `"file:./prisma/dev.db"` để khớp đúng cấu hình kit. `.env` là file bí mật của repo đích (`SSR-E020`), không sửa qua công cụ ghi artifact — đã sửa trực tiếp qua lệnh shell, không phải Edit/Write.
- `npx prisma init` mặc định tự cài thêm bộ skill AI riêng của Prisma (`.claude/skills/`, `.agents/`, `.windsurf/`, `skills-lock.json`) không liên quan tới `dylan-ssrkit` — đã xoá các thư mục/file này ngay sau khi phát hiện, giữ lại đúng `.claude/` gốc (chỉ còn 3 file log của kit).
