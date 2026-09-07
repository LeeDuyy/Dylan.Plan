# Nguồn thu, sửa insight tiết kiệm — Data Model Delta

Status: Applied
Feature: US-022
Prisma Schema: `prisma/schema.prisma`
DBML: `docs/db/schema.dbml`
Provider: sqlite
Created: 2026-09-07
Owner: ssr-data

## 1. Thay Đổi Model

| Model | Thay đổi | Lý do nghiệp vụ | AC liên quan |
| --- | --- | --- | --- |
| `IncomeSource` | Thêm model | Một dòng thu nhập gắn theo tháng ngân sách (tên + số tiền + thứ tự); "Thu nhập tháng" = tổng các dòng này (BR-033, ENT-007) | AC-01, AC-02, AC-03, AC-08, AC-09, AC-10, AC-11, AC-13 |
| `MonthBudget` | Thêm quan hệ `incomeSources IncomeSource[]` | Một tháng có nhiều nguồn thu | AC-01..AC-13 |
| `MonthBudget.income` | Không đổi (giữ cột) | Sau US-022 cột trở thành vestigial — UI đọc "Thu nhập tháng" từ tổng `IncomeSource.amount`, nhưng migration cần cột này để backfill; drop-column trên SQLite qua Prisma là table-rebuild, rủi ro không tương xứng (JDG-035) | — |

## 2. Prisma Schema Delta

```prisma
// Trước
model MonthBudget {
  id     String @id
  label  String
  income Int

  categories    Category[]
  transactions  Transaction[]
  purchaseItems PurchaseItem[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Sau
model MonthBudget {
  id     String @id
  label  String
  income Int

  categories    Category[]
  transactions  Transaction[]
  purchaseItems PurchaseItem[]
  incomeSources IncomeSource[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model IncomeSource {
  id      String @id @default(cuid())
  monthId String
  name    String
  amount  Int
  order   Int    @default(0)

  month MonthBudget @relation(fields: [monthId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([monthId])
  @@index([monthId, order])
}
```

| Field | Kiểu Prisma | Kiểu SQLite | Nullable | Default | Unique/Index |
| --- | --- | --- | --- | --- | --- |
| `id` | `String @id @default(cuid())` | `TEXT` PRIMARY KEY | Không | cuid | PK |
| `monthId` | `String` | `TEXT` | Không | — | `@@index([monthId])`, `@@index([monthId, order])`, FK → `MonthBudget.id` |
| `name` | `String` | `TEXT` | Không | — | — |
| `amount` | `Int` | `INTEGER` | Không | — | Ràng buộc `>= 0` ở tầng ứng dụng (DEC-134), không phải CHECK constraint DB |
| `order` | `Int @default(0)` | `INTEGER` | Không | `0` | Vị trí hiển thị — Dylan kéo-thả sắp xếp (BR-035/AC-10) |
| `createdAt` | `DateTime @default(now())` | `DATETIME` | Không | `CURRENT_TIMESTAMP` | — |
| `updatedAt` | `DateTime @updatedAt` | `DATETIME` | Không | (Prisma set) | — |

## 3. Migration SQLite

Lệnh sinh migration: `rtk npx prisma migrate dev --name add_income_source`

- Thư mục sinh ra: `prisma/migrations/20260907005635_add_income_source/`
- KHÔNG sửa tay `migration.sql`. Backfill dữ liệu chạy bằng script riêng (mục 6) — không nhét vào `migration.sql` (chuẩn skill ssr-data: chỉ Prisma sinh file này).

| Bước | Nội dung | An toàn với dữ liệu cũ |
| --- | --- | --- |
| 1 | `CREATE TABLE "IncomeSource" (...)` + 2 index | Có — bảng mới, không đụng dữ liệu hiện có |
| 2 | Backfill: mỗi `MonthBudget` → 1 `IncomeSource` name='Lương', amount=`MonthBudget.income`, order=0 | Có — chỉ INSERT vào bảng mới; cột `MonthBudget.income` giữ nguyên |
| 3 | Không drop cột `MonthBudget.income` | Có — giữ cột |

## 4. Ràng Buộc SQLite

| Ràng buộc | Áp dụng | Xử lý |
| --- | --- | --- |
| Không có native `enum` | Không | `IncomeSource` không có field enum |
| `ALTER TABLE` hạn chế (đổi kiểu/drop constraint phải tạo bảng mới) | Không | Chỉ thêm bảng mới + quan hệ; không đổi kiểu cột nào, không drop cột |
| Thêm cột `NOT NULL` phải có default hoặc backfill | Không | Không thêm cột `NOT NULL` vào bảng đang có dữ liệu (`IncomeSource` là bảng mới; `MonthBudget.incomeSources` là quan hệ ảo, không sinh cột) |
| Không có `citext`, so sánh chuỗi phân biệt hoa thường | Không | `IncomeSource.name` cho phép trùng, không cần so sánh không phân biệt hoa thường (khác `Category` — BR-017) |
| Ghi đồng thời bị khóa toàn DB | Có | Backfill chạy một lần, ứng dụng single-user (DEC-004), không có job ghi nặng song song — không rủi ro |
| Không có native array/JSON type | Không | Nhiều nguồn thu mô hình bằng bảng phụ `IncomeSource` (1 row/nguồn), không dùng JSON |

## 5. Đồng Bộ DBML

- Nguồn sự thật: `prisma/schema.prisma`. DBML là bản dẫn xuất.
- Lệnh sinh: không có generator DBML trong dự án → **cập nhật thủ công**.

```dbml
Table IncomeSource {
  id text [pk]
  monthId text [not null, ref: > MonthBudget.id]
  name text [not null, note: 'Tên nguồn thu (Lương, Freelance, Thưởng...) — cho phép trùng tên trong cùng tháng (khác Category)']
  amount integer [not null, note: 'Số nguyên đồng >= 0 — ràng buộc ở tầng ứng dụng (DEC-134), không phải CHECK constraint của DB']
  order integer [not null, default: 0, note: 'Vị trí hiển thị — Dylan kéo-thả sắp xếp (BR-035)']
  createdAt timestamp [not null]
  updatedAt timestamp [not null]

  note: 'Nguồn thu — "Thu nhập tháng" của MonthBudget = tổng amount các dòng này (BR-033). Chỉ thao tác được ở tháng hiện tại/tương lai (BR-036, DEC-133). Không đụng Ngân sách/Chi thực tế (DEC-127). Cột MonthBudget.income sau US-022 là vestigial (JDG-035)'

  indexes {
    monthId
    (monthId, order)
  }
}
```

| Kiểm tra | Kết quả |
| --- | --- |
| DBML có đủ model mới | Đạt (thêm `Table IncomeSource` + `incomeSources` note trên `MonthBudget`) |
| Quan hệ (`Ref:`) khớp với Prisma | Đạt (`monthId` ref > `MonthBudget.id`) |
| Ghi chú field khớp thuật ngữ trong `glossary.md` | Đạt ("Nguồn thu", "Thu nhập tháng") |

## 6. Backfill Và Rollback

| Hạng mục | Nội dung |
| --- | --- |
| Backfill cần thiết | Có — script `prisma/backfill/us022-income-sources.mjs` (dùng `better-sqlite3` trực tiếp): `INSERT INTO IncomeSource (id, monthId, name, amount, order, createdAt, updatedAt) SELECT lower(hex(randomblob(16))), id, 'Lương', income, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM MonthBudget`. Chạy một lần ngay sau khi migration áp. Idempotent-guard: chỉ chèn cho `MonthBudget` chưa có `IncomeSource` nào |
| Dữ liệu có thể mất | Không — chỉ INSERT vào bảng mới; không UPDATE/DELETE dữ liệu cũ |
| Rollback | Xóa thư mục migration `add_income_source` chưa deploy, khôi phục `prisma/dev.db` từ backup, `prisma generate`, revert `schema.prisma` + `docs/db/schema.dbml` |
| Đã backup file SQLite | Có — `prisma/backups/dev.db.us-022-before-income-source.20260907075606.bak` |

## 7. Verification

| Bước | Lệnh | Kết quả |
| --- | --- | --- |
| Format schema | `./node_modules/.bin/prisma format` | Passed (2026-09-07) — `rtk`/`npx` không resolve được `prisma` trên PATH, dùng binary cục bộ |
| Validate schema | `./node_modules/.bin/prisma validate` | Passed (2026-09-07) — "The schema at prisma\schema.prisma is valid 🚀" |
| Áp migration | `./node_modules/.bin/prisma migrate dev --name add_income_source` | Passed (2026-09-07) — tạo + áp `prisma/migrations/20260907005635_add_income_source/`; "Your database is now in sync" |
| Sinh client | `./node_modules/.bin/prisma generate` | Passed (2026-09-07) — Prisma Client 7.9.1 → `./generated/prisma` |
| Backfill | `node prisma/backfill/us022-income-sources.mjs` | Passed (2026-09-07) — chèn 9 dòng "Lương" cho 9 tháng (2026-02..2026-10), mỗi dòng amount=35.000.000, order=0; chạy lại lần 2 chèn 0 dòng (idempotent) |
| Typecheck sau khi client đổi | `./node_modules/.bin/tsc --noEmit` | Passed (2026-09-07) — exit 0 |
| Backup SQLite | — | `prisma/backups/dev.db.us-022-before-income-source.20260907075606.bak` |
