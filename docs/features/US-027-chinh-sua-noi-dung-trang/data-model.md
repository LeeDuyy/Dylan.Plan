# Nút "Chỉnh sửa trang" — Data Model Delta

Status: Applied
Feature: US-027-chinh-sua-noi-dung-trang
Prisma Schema: prisma/schema.prisma (PageText, PageBlock)
DBML: docs/db/schema.dbml

Migration: `20260913164331_add_page_content`.

## 1. Thay Đổi Model

Thêm **hai** model mới, dùng chung cho mọi trang (không phải 1 model/loại trang):

- `PageText` — từng trường text đơn lẻ (tiêu đề Card, mô tả, số liệu lớn...), khoá
  `(page, key)`.
- `PageBlock` — danh sách item lặp lại (thẻ ưu tiên, mục tiêu, dịch vụ, gạch đầu
  dòng...), nhóm theo `(page, section, order)`.

`page` là khoá ổn định do app đặt = route rút gọn không có `/` đầu (vd
`"roadmap/priorities"`), validate ở tầng ứng dụng qua `EDITABLE_PAGE_KEYS`
(`lib/page-content-defaults.ts`) — không FK tới bảng nào khác (không có bảng
"Page").

12 trang áp dụng: Roadmap (priorities, first-week, weekly-kpi, english,
long-term), Freelance (strategy, process, kpi), Sản phẩm (positioning, scope,
timeline, kpi). Không áp dụng cho `roadmap/timeline` (đã có model riêng
`RoadmapPhase`/`RoadmapDeliverable` từ US-025) và `roadmap/jobs` (dữ liệu động —
`JobApplication`, không phải nội dung tĩnh).

## 2. Prisma Schema Delta

```prisma
model PageText {
  id    String @id @default(cuid())
  page  String
  key   String
  value String
  updatedAt DateTime @updatedAt
  @@unique([page, key])
  @@index([page])
}

model PageBlock {
  id      String @id @default(cuid())
  page    String
  section String @default("default")
  order   Int    @default(0)
  badge   String?
  title   String?
  desc    String?
  value   String?
  weight  Int?
  variant String?
  bullets String?
  updatedAt DateTime @updatedAt
  @@index([page, section, order])
}
```

## 3. Migration SQLite

Thuần `CREATE TABLE` + `CREATE INDEX` (không rebuild bảng nào có sẵn):

```sql
CREATE TABLE "PageText" (...);
CREATE TABLE "PageBlock" (...);
CREATE INDEX "PageText_page_idx" ON "PageText"("page");
CREATE UNIQUE INDEX "PageText_page_key_key" ON "PageText"("page", "key");
CREATE INDEX "PageBlock_page_section_order_idx" ON "PageBlock"("page", "section", "order");
```

Lệnh: `./node_modules/.bin/prisma migrate dev --name add_page_content` →
`prisma generate`. **Lưu ý bắt buộc:** sau khi generate lại client, phải
**restart tiến trình `next dev` đang chạy** — Node giữ Prisma Client cũ trong bộ
nhớ, không tự nhận model mới dù file đã generate lại (gặp lỗi runtime
`Cannot read properties of undefined (reading 'count')` khi gọi
`tx.pageText.count` nếu quên bước này).

## 4. Ràng Buộc SQLite

- Không enum/CHECK cho `page`: chỉ nhận giá trị thuộc `EDITABLE_PAGE_KEYS` nhờ
  luật tầng ứng dụng (`isEditablePageKey` — `upsertPageText`/`upsertPageBlock`/
  `resetPageContent` đều throw nếu `page` lạ).
- `bullets` lưu mảng chuỗi dạng JSON-encode trong 1 cột `String?` — SQLite không
  có kiểu mảng gốc; parse/stringify ở `lib/page-content-defaults.ts`
  (`toPageContentView`) và `server/pages/application/upsert-page-block.ts`.
- `section` không FK — chỉ là nhãn nhóm tự do trong phạm vi 1 `page`, danh sách
  section hợp lệ của từng trang nằm trong `DEFAULT_PAGE_CONTENT[page].blocks`
  (vd `"roadmap/english"` có 3 section: `topics`, `rounds`, `scorecard`).
- `weight` (Int?) chỉ dùng cho item có thanh Progress (`Category.type` không
  liên quan — đừng nhầm với field cùng tên ở model khác nếu có).

## 5. Đồng Bộ DBML

Đã thêm `Table PageText` + `Table PageBlock` vào `docs/db/schema.dbml` + cập
nhật dòng "Cập nhật lần cuối".

## 6. Backfill Và Rollback

- **Seed**: lười, tầng ứng dụng — `getPageContent(page)` gọi
  `defaultPageContentService.ensureDefaults(page)` trước khi đọc; repository
  `createDefaultsIfEmpty` bọc đếm + chèn trong 1 `$transaction` (mẫu
  `JobPlatform`/`NavPref`, tránh race khi nhiều request đọc cùng trang gần đồng
  thời). Nội dung mặc định = copy y hệt bản hardcode cũ trong
  `components/PlanViews.tsx` trước US-027, đặt ở `lib/page-content-defaults.ts`
  (`DEFAULT_PAGE_CONTENT`) — chuyển sang DB không đổi bất kỳ chữ nào hiển thị.
- **Reset về mặc định**: nút "Khôi phục mặc định" trong Drawer → `resetPageContent(page)`
  → xoá hết `PageText`/`PageBlock` của `page` rồi chèn lại đúng seed, trong 1
  `$transaction`.
- **Rollback migration**: `DROP TABLE "PageText"`, `DROP TABLE "PageBlock"` + gỡ
  2 model. Component `PlanViews.tsx` các hàm Section đều nhận `content` là prop
  **bắt buộc** (không có default nội bộ nữa — nội dung mặc định giờ chỉ còn ở
  `lib/page-content-defaults.ts`), nên rollback migration bắt buộc phải rollback
  cùng lúc code (`page.tsx` 12 file quay lại gọi Section không props, Section bỏ
  đọc `content`) — không rollback được DB đơn lẻ mà giữ nguyên code.
- Backup trước migration: `prisma/backups/dev.db.US-027-add-page-content.20260913234256.bak`.

## 7. Verification

| Kiểm tra | Kết quả |
| --- | --- |
| `prisma format` / `validate` | Pass |
| `prisma migrate dev --name add_page_content` | Applied `20260913164331_add_page_content` |
| `prisma generate` | OK (7.9.1) — phải restart `next dev` sau đó (xem mục 3) |
| `tsc --noEmit` | 0 lỗi |
| Seed lần đầu (cả 12 trang) | Qua Chrome DevTools MCP: mở từng route, nội dung khớp 100% bản hardcode cũ (so từng đoạn text đặc trưng), không lỗi console |
| Round-trip editor | `roadmap/priorities`: sửa tiêu đề 1 thẻ → blur → reload → còn nguyên trên trang public; khôi phục lại giá trị gốc |
| Trang không thuộc phạm vi | `/`, `roadmap/timeline`, `roadmap/jobs` — không lỗi console, không đổi hành vi |
| Mobile (390px) | Không tràn ngang, không lỗi console |
