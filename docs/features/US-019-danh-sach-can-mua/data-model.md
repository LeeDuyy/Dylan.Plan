# Danh sách items cần mua theo tháng tại bảng thu chi — Data Model Delta

Status: Applied
Feature: US-019
Prisma Schema: `prisma/schema.prisma`
DBML: `docs/db/schema.dbml`
Provider: sqlite
Created: 2026-08-14
Owner: ssr-data

## 1. Thay Đổi Model

| Model | Thay đổi | Lý do nghiệp vụ | AC liên quan |
| --- | --- | --- | --- |
| `PurchaseItem` | Thêm model | Lưu từng sản phẩm cần mua Dylan ghi trong khu vực "Items cần mua" — tên, giá tham khảo tùy chọn, trạng thái Pending/Purchased, gắn theo tháng ngân sách | AC-01 đến AC-10 |
| `MonthBudget` | Thêm quan hệ | Một tháng ngân sách có nhiều Item cần mua | AC-01, AC-05 |

## 2. Prisma Schema Delta

```prisma
// Trước
model MonthBudget {
  id     String @id
  label  String
  income Int

  categories   Category[]
  transactions Transaction[]

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

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PurchaseItem {
  id      String @id @default(cuid())
  monthId String
  name    String
  price   Int?
  status  String @default("Pending")

  month MonthBudget @relation(fields: [monthId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([monthId])
}
```

| Field | Kiểu Prisma | Kiểu SQLite | Nullable | Default | Unique/Index |
| --- | --- | --- | --- | --- | --- |
| `PurchaseItem.id` | `String` | `TEXT` | Không | `cuid()` | `@id` |
| `PurchaseItem.monthId` | `String` | `TEXT` | Không | — | `@@index([monthId])`, FK → `MonthBudget.id` |
| `PurchaseItem.name` | `String` | `TEXT` | Không | — | — |
| `PurchaseItem.price` | `Int?` | `INTEGER` | Có | `null` | — |
| `PurchaseItem.status` | `String` | `TEXT` | Không | `"Pending"` | — (đúng 2 giá trị hợp lệ `"Pending"`/`"Purchased"`, ràng buộc ở tầng ứng dụng — `domain/rules/purchase-item-rule.ts`) |
| `PurchaseItem.createdAt` | `DateTime` | `DATETIME` | Không | `now()` | Dùng để sắp xếp danh sách theo thứ tự thêm vào (EL-01) |
| `PurchaseItem.updatedAt` | `DateTime` | `DATETIME` | Không | `@updatedAt` | — |
| `MonthBudget.purchaseItems` | `PurchaseItem[]` | — (quan hệ ngược) | — | — | — |

## 3. Migration SQLite

Lệnh sinh migration: `rtk npx prisma migrate dev --name add_purchase_item`

- Thư mục sinh ra: `prisma/migrations/20260819080706_add_purchase_item/`
- KHÔNG sửa tay `migration.sql`. Muốn đổi thì sửa `schema.prisma` rồi sinh lại.

| Bước | Nội dung | An toàn với dữ liệu cũ |
| --- | --- | --- |
| 1 | `CREATE TABLE "PurchaseItem"` với các cột ở mục 2, khóa ngoại `monthId` → `MonthBudget.id` (`ON DELETE CASCADE`) | Có — bảng hoàn toàn mới, không đụng dữ liệu hiện có của `MonthBudget`/`Category`/`Transaction` |
| 2 | `CREATE INDEX` trên `monthId` | Có — chỉ thêm index, không đổi dữ liệu |

## 4. Ràng Buộc SQLite

Đối chiếu từng mục — SQLite không hỗ trợ đầy đủ như Postgres:

| Ràng buộc | Áp dụng | Xử lý |
| --- | --- | --- |
| Không có native `enum` | Có | `status` dùng `String` + `@default("Pending")`, ràng buộc đúng 2 giá trị hợp lệ ở tầng ứng dụng — đúng mẫu đã dùng cho `Category.type` (`BR-019`, `DEC-073`) và `JobApplication.status` (`DEC-090`), không phải quyết định mới, chỉ áp dụng lại tiền lệ đã có trong dự án |
| `ALTER TABLE` hạn chế (đổi kiểu/drop constraint phải tạo bảng mới) | Không | Chỉ `CREATE TABLE` mới, không đổi kiểu cột nào đã tồn tại |
| Thêm cột `NOT NULL` phải có default hoặc backfill | Không | Không thêm cột `NOT NULL` nào lên bảng đã có dữ liệu — `PurchaseItem` là bảng mới hoàn toàn; field quan hệ `purchaseItems` trên `MonthBudget` không sinh cột thật (chỉ là quan hệ ngược phía Prisma) |
| Không có `citext`, so sánh chuỗi phân biệt hoa thường | Không | Không có yêu cầu chặn trùng tên item (spec mục 6: "không có ràng buộc chặn trùng tên item") — không cần so sánh chuẩn hóa |
| Ghi đồng thời bị khóa toàn DB | Có | `transferPendingToMonth` (chuyển item Pending sang tháng mới) dùng một câu `UPDATE ... WHERE` duy nhất (không phải vòng lặp nhiều lệnh ghi), giữ thời gian khóa ngắn nhất có thể, đúng mẫu `reorder` của `CategoryRepository` |
| Không có native array/JSON type | Không | Không có field nào cần array/JSON |

## 5. Đồng Bộ DBML

- Nguồn sự thật: `schema.prisma`. DBML là bản dẫn xuất, không sửa ngược.
- Lệnh sinh: `rtk npx prisma generate` — dự án **không có generator DBML cài sẵn** (đã ghi nhận từ trước ở `docs/db/schema.dbml` dòng 1: "không có generator DBML cài sẵn trong dự án").
- Cập nhật thủ công đúng delta bên dưới.

```dbml
Table PurchaseItem {
  id text [pk]
  monthId text [not null, ref: > MonthBudget.id]
  name text [not null]
  price integer [note: 'Giá tham khảo, không bắt buộc — không cộng vào Ngân sách/Chi thực tế của MonthBudget (BR-022)']
  status text [not null, default: 'Pending', note: 'Chỉ 1 trong 2 giá trị: Pending | Purchased — ràng buộc ở tầng ứng dụng, không phải CHECK constraint của DB (BR-024)']
  createdAt timestamp [not null]
  updatedAt timestamp [not null]

  note: 'Item cần mua — độc lập với Category/Transaction (BR-022); chỉ tháng hiện tại theo đồng hồ hệ thống mới ghi được (BR-024, DEC-107)'

  indexes {
    monthId
  }
}
```

| Kiểm tra | Kết quả |
| --- | --- |
| DBML có đủ model mới | Đạt |
| Quan hệ (`Ref:`) khớp với Prisma | Đạt — `PurchaseItem.monthId > MonthBudget.id`, cùng kiểu quan hệ với `Category`/`Transaction` |
| Ghi chú field khớp thuật ngữ trong `glossary.md` | Đạt — dùng đúng thuật ngữ "Item cần mua" đã có trong `docs/memory/glossary.md` mục 1 |

## 6. Backfill Và Rollback

| Hạng mục | Nội dung |
| --- | --- |
| Backfill cần thiết | Không — bảng mới hoàn toàn, không có dữ liệu cũ cần chuyển vào |
| Dữ liệu có thể mất | Không — migration chỉ thêm bảng và index mới, không đổi/xóa gì trên `MonthBudget`/`Category`/`Transaction`/`LegacyMigration`/`JobPlatform`/`JobApplication` |
| Rollback | Xóa thư mục migration `add_purchase_item` (nếu chưa deploy nơi khác) và revert `schema.prisma`/`docs/db/schema.dbml` về bản trước; nếu đã áp migration, chạy `DROP TABLE "PurchaseItem"` thủ công hoặc migration nghịch đảo — không có dữ liệu nghiệp vụ nào khác phụ thuộc bảng này nên rollback an toàn |
| Đã backup file SQLite | Không cần — thay đổi chỉ thêm bảng mới (additive), rủi ro mất dữ liệu bằng 0; `prisma/dev.db` là dữ liệu dev cục bộ, không phải môi trường chia sẻ |

## 7. Verification

| Bước | Lệnh | Kết quả |
| --- | --- | --- |
| Format schema | `rtk npx prisma format` | Passed — "Formatted prisma\schema.prisma" |
| Validate schema | `rtk npx prisma validate` | Passed — "The schema at prisma\schema.prisma is valid" |
| Áp migration | `rtk npx prisma migrate dev --name add_purchase_item` | Passed — tạo `prisma/migrations/20260819080706_add_purchase_item/migration.sql`, "Your database is now in sync with your schema" |
| Sinh client | `rtk npx prisma generate` | Passed — "Prisma Client generated" |
| Typecheck sau khi client đổi | `rtk tsc --noEmit` | Passed — "No errors found" |
