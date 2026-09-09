---
status: Draft
feature: US-026
updated: 2026-09-10
plan: docs/features/US-026-tach-quan-ly-thu-va-chi/plan.md
ba_wiki: docs/kb/ba/wiki/knowledge/feature/US-026-tach-quan-ly-thu-va-chi.md
owner: ssr-plan
tags: [kb/dev/wiki]
aliases: ["US-026", "Tách Quản lý thu / Quản lý chi (DEV)"]
---

# US-026 — Tách "Ngân sách & nhập nhanh" thành "Quản lý thu" và "Quản lý chi" (DEV)

> BA wiki feature page chưa biên soạn (nợ `ssr-ingest`); nguồn nghiệp vụ là `docs/features/US-026-tach-quan-ly-thu-va-chi/spec.md` + `DEC-137`.

## 1. Tổng Quan Kỹ Thuật

Thuần tầng trình bày trong Next.js App Router. Không đổi Prisma schema, không migration.

- Nhóm điều hướng "Thu chi" (`navGroups` id `budget`) đổi từ 3 mục con sang 4: bỏ `/budget/control` ("Ngân sách & nhập nhanh"), thêm `/budget/income` ("Quản lý thu") + `/budget/expense` ("Quản lý chi").
- `components/BudgetApp.tsx` render theo prop `section`. Union đổi `"monthly" | "insight" | "control"` → `"monthly" | "insight" | "income" | "expense"`. Nhánh `control` (4 khối trên một trang) tách thành `income` (nguồn thu + khu "Khoản để dành" chỉ đọc) và `expense` (2 cột: nhập nhanh | bảng danh mục + cụm nút; "Items cần mua" trong `Drawer`).
- `NavPref` (model của bounded-context `config`, US-025) chỉ là dữ liệu `{ id, order, hidden }`. Hai mục con mới → 2 bản ghi seed mới; `leaf:/budget/control` cần dọn. Xử lý bằng bước reconcile idempotent ở tầng ứng dụng khi đọc `getNavConfig`, không phải migration.

## 2. Luồng End-To-End

```text
Điều hướng:
  Request /budget/*  ->  middleware.ts (chỉ gate host + email)
    ->  app/(app)/layout.tsx (force-dynamic)  ->  server/config/actions.ts::getNavConfig()
        ->  application/use-cases/get-nav-config.ts
            ->  domain/services/default-nav-prefs-service.ts::ensureDefaultNavPrefs() + reconcileNavPrefs(seeds)
                ->  infrastructure/repositories/nav-pref-prisma-repository.ts  ->  prisma.navPref (SQLite)
            ->  navPrefRepository.findAll()
    ->  AppShell::applyNavPrefs(navGroups, navPrefs)  ->  navTree (4 mục con "Thu chi")

Màn hình:
  /budget/income  -> app/(app)/budget/income/page.tsx (force-dynamic)
      -> server/budget/actions.ts::getBudgetSnapshot()  ->  BudgetApp section="income" (client)
  /budget/expense -> app/(app)/budget/expense/page.tsx  ->  BudgetApp section="expense"
  /budget/control -> app/(app)/budget/control/page.tsx  ->  redirect("/budget/expense")
```

| Bước | File | Ghi chú |
| --- | --- | --- |
| Entry (điều hướng) | `app/(app)/layout.tsx` | Server Component, `force-dynamic`, gọi `getNavConfig()` |
| Entry (trang) | `app/(app)/budget/income/page.tsx`, `app/(app)/budget/expense/page.tsx` | Server Component mới; `getBudgetSnapshot()` + `BudgetApp` |
| Entry (redirect) | `app/(app)/budget/control/page.tsx` | `redirect("/budget/expense")` |
| Auth | `middleware.ts` | Gate theo host + email allowlist; không phụ thuộc path con `/budget/*` |
| Application | `server/config/application/use-cases/get-nav-config.ts` | Thêm gọi reconcile trước `findAll()` |
| Domain | `server/config/domain/services/default-nav-prefs-service.ts` + `domain/repositories/nav-pref-repository.ts` | `reconcileNavPrefs(seeds)`: chèn seed thiếu, xóa id không thuộc `ALL_NAV_PREF_IDS` |
| Infrastructure | `server/config/infrastructure/repositories/nav-pref-prisma-repository.ts` | `createMany({ skipDuplicates: true })` + `deleteMany({ where: { id: { notIn } } })` trong `$transaction` |
| Data | `prisma/schema.prisma` model `NavPref` | Không đổi |
| UI | `components/BudgetApp.tsx` | Tách nhánh `section`; `Drawer` + `Badge` cho "Items cần mua"; khu "Khoản để dành" chỉ đọc |

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Page | `app/(app)/budget/income/page.tsx` (mới) | Render "Quản lý thu" |
| Page | `app/(app)/budget/expense/page.tsx` (mới) | Render "Quản lý chi" |
| Page | `app/(app)/budget/control/page.tsx` | Redirect-only → `/budget/expense` |
| Nav registry (nội dung) | `components/shared/nav.ts` | `navGroups` mục `budget.children` 4 leaf mới |
| Nav registry (id/thứ tự) | `lib/nav-registry.ts` | `NAV_CHILD_HREFS.budget` 4 href; `defaultNavPrefSeeds`/`resolveReorderScope`/`ALL_NAV_PREF_IDS` tự suy |
| Component | `components/BudgetApp.tsx` | `BudgetSection` union; nhánh `income`/`expense`; `Drawer`; khu "Khoản để dành" |
| Style | `app/globals.css` | Bố cục 2 cột màn "Quản lý chi" + responsive; nút + badge "Items cần mua" |
| Use-case (Application) | `server/config/application/use-cases/get-nav-config.ts` | Gọi reconcile khi đọc nav config |
| Domain service | `server/config/domain/services/default-nav-prefs-service.ts` | `reconcileNavPrefs(seeds)` |
| Domain repo interface | `server/config/domain/repositories/nav-pref-repository.ts` | `insertMissing` + `deleteByIdsNotIn` |
| Repository (Infrastructure) | `server/config/infrastructure/repositories/nav-pref-prisma-repository.ts` | Hiện thực 2 method reconcile |
| Type | `components/BudgetApp.tsx` export `BudgetSection` | Consumer: 3+2 trang `app/(app)/budget/*/page.tsx` |

## 4. Prisma Schema Và Migration

| Model | Field liên quan | Index | Quan hệ |
| --- | --- | --- | --- |
| `NavPref` | `id`, `order`, `hidden`, `updatedAt` | `@@index([order])` | Không có FK |

- Migration liên quan: **Không có** — US-026 không đổi cấu trúc bảng. Bảng `NavPref` do US-025 tạo (`prisma/migrations/20260909141127_add_nav_pref/`).
- DBML đã đồng bộ: N/A (không đổi schema) — `docs/db/schema.dbml`.
- Lưu ý SQLite: reconcile `NavPref` dùng `createMany` + `deleteMany` trong `$transaction` (SQLite serialize writer — an toàn với nhiều request layout gần đồng thời, cùng lý do `createDefaultsIfEmpty` bọc transaction).

## 5. Contract

| Contract | Định nghĩa | Người dùng lại |
| --- | --- | --- |
| Route `/budget/income` | Trang "Quản lý thu" (mới) | Menu `navGroups`, người dùng |
| Route `/budget/expense` | Trang "Quản lý chi" (mới) | Menu `navGroups`, người dùng |
| Route `/budget/control` | Redirect 307 → `/budget/expense` | Liên kết/bookmark cũ |
| `BudgetSection` (`components/BudgetApp.tsx`) | `"monthly" | "insight" | "income" | "expense"` | `app/(app)/budget/{monthly,insight,income,expense}/page.tsx` |
| `NAV_CHILD_HREFS.budget` (`lib/nav-registry.ts`) | 4 href mục con nhóm "Thu chi" | `defaultNavPrefSeeds`, `resolveReorderScope`, `applyNavPrefs`, `NavConfigEditor` (US-025) |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-025` | Depends on (thứ tự — DEC-137) | `components/shared/nav.ts`, `lib/nav-registry.ts`, `server/config/*`, `NavConfigEditor`/`ConfigDrawer`; US-026 code sau khi US-025 vào `main` |
| `US-022` | Related only | Bảng "Nguồn thu", `IncomeSource`, `totals.allocatedToSaving` — dùng lại nguyên trạng ở màn "Quản lý thu" |
| `US-019` | Related only | Bảng "Items cần mua", `PurchaseItem`, ràng buộc tháng — dùng lại nguyên trạng bên trong `Drawer` |
| `US-016` | Related only | `Category.type = "Tích lũy"` — lọc cho khu "Khoản để dành" |
| `US-024` | Related only | `@vn-dylan/ui` `Drawer` / `Badge` |

## 7. Verification

| Lệnh | Kết quả gần nhất | Ngày |
| --- | --- | --- |
| `rtk tsc --noEmit` | Chưa chạy (implement dừng chờ US-025) | 2026-09-10 |
| `rtk lint` | Chưa chạy | 2026-09-10 |
| `rtk npx prisma validate` | Chưa chạy | 2026-09-10 |
| `rtk next build` | Chưa chạy | 2026-09-10 |
| `rtk vitest run` | N/A — dự án chưa cấu hình test runner | 2026-09-10 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Xung đột với US-025 ở registry điều hướng | Cao | DEC-137: code sau US-025; revert commit US-026 |
| DB đã seed `NavPref` còn orphan/thiếu nếu reconcile lỗi | Trung bình | `resetNavConfig()` dựng lại toàn bộ theo seed mới |
| Sót chỗ truyền `section="control"` | Thấp | `rtk tsc --noEmit` bắt hết (union type) |
| `Drawer` không hợp bố cục danh sách dài | Thấp | Phương án lùi: bảng "Items cần mua" hiển thị trực tiếp cột phải (spec A9) |

## 9. Kiến Trúc Áp Dụng

- Bounded context: `budget` (`server/budget/`) cho phần màn hình thu/chi; `config` (`server/config/`) cho phần `NavPref`. Cả hai theo Light DDD per context (domain / application / infrastructure + composition root `actions.ts`). Chưa có trang `architecture/bounded-context` riêng cho dự án (`architecture/` chưa khởi tạo — xem `docs/memory/judgement-log.md#jdg-005`), bounded-context được mô tả tại DEV wiki US-001/US-005 (budget) và US-025 (config).

| Pattern | Dùng ở lớp/lát cắt nào | Lệch pattern (lý do) |
| --- | --- | --- |
| "Server Component page mỏng gọi `getBudgetSnapshot()` rồi truyền vào `BudgetApp` với prop section tương ứng" (US-002) | Entry page | Không — thêm 2 trang cùng khuôn |
| "Seed lười idempotent qua `$transaction`" (`createDefaultsIfEmpty`, mẫu US-018/US-025) | domain service + infrastructure repo | Không — mở rộng thêm `reconcileNavPrefs` cùng khuôn (chèn thiếu + dọn orphan), vẫn idempotent |
| "Reorder = mảng id đã sắp → `order = index` trong `$transaction`" (US-017/US-025) | không sửa code, chỉ đổi dữ liệu `NAV_CHILD_HREFS.budget` | Không |
| "Drawer của `@vn-dylan/ui` cho panel phụ" (US-024/US-025 `ConfigDrawer`, `AppShell`) | UI component | Không — dùng lại cho "Items cần mua" |
