---
status: Active
feature: US-027
updated: 2026-09-14
plan: (không có — implement trực tiếp trong phiên tương tác, không qua ssr-plan)
owner: session (interactive)
tags: [kb/dev/wiki]
aliases: ["US-027", "Chỉnh sửa trang (DEV)", "PageText", "PageBlock"]
---

# US-027 — Nút "Chỉnh sửa trang" cho Roadmap/Freelance/Sản phẩm (DEV)

> Không có BA raw/spec/plan/task riêng — yêu cầu đến trực tiếp từ user trong
> phiên tương tác, chốt kiến trúc qua `AskUserQuestion` (model DB riêng theo
> loại nội dung + làm cả 12 trang cùng lúc) rồi implement thẳng, không qua
> pipeline `ssr-*`.

## 1. Tổng Quan Kỹ Thuật

Cho phép sửa nội dung text của 12 trang tĩnh (Roadmap/Freelance/Sản phẩm) qua
nút "Chỉnh sửa trang" mở Drawer, không cần sửa code/JSX — layout giữ nguyên,
chỉ đổi dữ liệu hiển thị. Kiến trúc **2 model dùng chung mọi trang** (không phải
1 model/loại trang) — `page` (route rút gọn) là tham số phân biệt:

- `PageText` — field text đơn lẻ (tiêu đề, mô tả, số liệu lớn).
- `PageBlock` — danh sách item lặp lại, nhóm theo `section` khi 1 trang có
  nhiều danh sách (vd `freelance/strategy` có cả `ratio`, `principles`,
  `services`).

12 trang: `roadmap/{priorities,first-week,weekly-kpi,english,long-term}`,
`freelance/{strategy,process,kpi}`, `product/{positioning,scope,timeline,kpi}`.
Không áp dụng `roadmap/timeline` (đã DB-backed riêng từ US-025) và
`roadmap/jobs` (dữ liệu động, không phải nội dung tĩnh).

## 2. Luồng End-To-End

```text
Trang:
  GET /roadmap/priorities
    -> app/(app)/roadmap/priorities/page.tsx (force-dynamic)
       -> server/pages/actions.ts :: getPageContent("roadmap/priorities")
          -> application/get-page-content.ts
             -> domain/service.ts :: ensureDefaults(page)
                -> infrastructure/prisma-repository.ts :: createDefaultsIfEmpty
                   -> prisma.pageText / prisma.pageBlock (SQLite)
             -> repository.findByPage(page)
    -> lib/page-content-defaults.ts :: toPageContentView(page, entity)
       (merge DB với DEFAULT_PAGE_CONTENT làm nền — key/section thiếu vẫn có khung)
    -> PrioritySection({ content })  (client, components/PlanViews.tsx)
       -> PageEditButton (nút "Chỉnh sửa trang" + Drawer)
          -> PageContentEditor (form, suy field theo dữ liệu hiện có)
             -> upsertPageText / upsertPageBlock / deletePageBlock /
                reorderPageBlocks / resetPageContent (server/pages/actions.ts)
                -> revalidatePath(`/${page}`) -> router.refresh()
```

## 3. Bản Đồ Source

| Loại | File | Vai trò |
| --- | --- | --- |
| Data | `prisma/schema.prisma` model `PageText`, `PageBlock` | 2 bảng dùng chung 12 trang |
| Defaults | `lib/page-content-defaults.ts` | `DEFAULT_PAGE_CONTENT` (copy y hệt nội dung hardcode cũ), `EDITABLE_PAGE_KEYS`, `toPageContentView` (DB entity → view merge với default) |
| Domain | `server/pages/domain/{entities,repository,service}.ts` | Entity, interface repo, `ensureDefaults`/`resetPage` (seed lười + reset, qua `DEFAULT_PAGE_CONTENT`) |
| Infrastructure | `server/pages/infrastructure/prisma-repository.ts` | Hiện thực Prisma — seed idempotent trong `$transaction` (mẫu `NavPref`) |
| Application | `server/pages/application/*.ts` | 6 use-case: get/upsert-text/upsert-block/delete-block/reorder-block/reset — generic theo `page`, không phải 1 use-case/loại trang |
| Server Action | `server/pages/actions.ts` | Composition root, `revalidatePath(`/${page}`)` sau mỗi mutation |
| UI editor | `components/shared/PageContentEditor.tsx` | Form generic — suy field hiển thị (`badge/title/desc/value/weight/bullets`) từ chính dữ liệu section hiện có, không hardcode theo từng trang |
| UI trigger | `components/shared/PageEditButton.tsx` | Nút "Chỉnh sửa trang" + `Drawer` (`@vn-dylan/ui`) |
| Section components | `components/PlanViews.tsx` | 12 hàm Section đổi sang nhận `content: PageContentView` **bắt buộc** (không còn const hardcode + default nội bộ) |
| Page (Server Component) | `app/(app)/{roadmap,freelance,product}/*/page.tsx` (12 file) | `getPageContent(page)` → `toPageContentView` → prop `content` |

## 4. Prisma Schema Và Migration

Xem `docs/features/US-027-chinh-sua-noi-dung-trang/data-model.md`. Migration
`20260913164331_add_page_content`, thuần `CREATE TABLE` × 2 + index, không đổi
bảng có sẵn.

**Cạm bẫy đã gặp**: sau `prisma generate`, tiến trình `next dev` đang chạy giữ
Prisma Client cũ trong bộ nhớ Node — không tự nhận model mới, ném
`TypeError: Cannot read properties of undefined (reading 'count')` khi gọi
`tx.pageText.count`. Phải **kill + khởi động lại `next dev`** sau mỗi lần
generate schema mới (đã làm: `taskkill` PID cũ → `pnpm dev` nền → verify
`curl` 200 trước khi mở trình duyệt lại).

## 5. Contract

| Contract | Trước | Sau | Breaking |
| --- | --- | --- | --- |
| `PrioritySection`, `FirstWeekSection`, ... (12 hàm, `components/PlanViews.tsx`) | Không nhận prop, đọc const module-level | Nhận `{ content: PageContentView }` **bắt buộc** | Có — nội bộ, consumer duy nhất là 12 `page.tsx` tương ứng (đã cập nhật cùng lúc) |
| `EDITABLE_PAGE_KEYS` (`lib/page-content-defaults.ts`) | Không tồn tại | 12 giá trị cố định | Route mới cần nội dung sửa được phải thêm vào đây + `DEFAULT_PAGE_CONTENT` + tạo `page.tsx` gọi `getPageContent` |

## 6. Liên Kết Function

| Function | Quan hệ | Vùng dùng chung |
| --- | --- | --- |
| `US-025` | Related only | Mẫu `Drawer` (`@vn-dylan/ui`), CSS `.config-drawer`/`.plan-config-*` tái dùng nguyên cho `PageContentEditor`; mẫu seed lười `createDefaultsIfEmpty` (`NavPref`) |
| `US-026` | Related only | Không chạm — US-027 không đụng `components/BudgetApp.tsx` hay `server/budget/*` |

## 7. Verification

| Lệnh / Kiểm tra | Kết quả | Ngày |
| --- | --- | --- |
| `tsc --noEmit` | 0 lỗi | 2026-09-13 |
| `next lint` | Không kiểm được — repo chưa có `eslint.config.(js\|mjs\|cjs)` gốc (nợ có sẵn từ trước, xem `docs/kb/dev/wiki/US-026-tach-quan-ly-thu-va-chi.md` mục 7) | — |
| `next build` | Không chạy độc lập (tránh phá `.next` của dev server sống) — verify từng route qua dev server thật | — |
| Thủ công (Chrome DevTools MCP) | Mở cả 12 route: nội dung khớp 100% bản hardcode cũ, không lỗi console; round-trip sửa/lưu/reload trên `roadmap/priorities` đúng, khôi phục lại giá trị gốc; trang ngoài phạm vi (`/`, `roadmap/timeline`, `roadmap/jobs`) không bị ảnh hưởng; mobile 390px không tràn ngang | 2026-09-13/14 |

## 8. Rủi Ro Và Rollback

| Rủi ro | Mức | Rollback |
| --- | --- | --- |
| Quên restart `next dev` sau khi đổi schema | Trung bình (đã xảy ra 1 lần) | Restart process — không mất dữ liệu, chỉ là cache Node |
| Section component nhận `content` bắt buộc — rollback migration một mình sẽ vỡ trang | Cao nếu rollback nửa vời | Rollback cả code (12 `page.tsx` + `PlanViews.tsx`) cùng lúc với `DROP TABLE`, không tách rời |
| `PageContentEditor` suy field hiển thị từ dữ liệu hiện có — nếu 1 section bị xoá hết item, form fallback về `title+desc` (có thể không đúng shape gốc) | Thấp | Nút "Khôi phục mặc định" mỗi trang dựng lại đúng seed |

## 9. Kiến Trúc Áp Dụng

- Bounded context mới `server/pages/` — theo Light DDD per context (domain /
  application / infrastructure + composition root `actions.ts`), cùng khuôn
  `server/config/`.
- **Lệch pattern có chủ đích**: `server/config/` tách 1 use-case/thao tác/loại
  entity (vd `upsert-roadmap-phase.ts` riêng, `upsert-deliverable.ts` riêng).
  `server/pages/` dùng **6 use-case generic cho mọi trang** (tham số hoá bằng
  `page`) thay vì 1 bộ use-case/trang × 12 — vì PageText/PageBlock là 2 bảng
  dùng chung, không phải 12 cặp bảng riêng. Lý do: 12 trang × use-case riêng sẽ
  ra ~70 file gần như giống hệt nhau, không có lợi ích tách biệt thật sự (khác
  Roadmap/Timetable, vốn 2 loại entity có shape khác nhau thật).
- `PageContentEditor` là **1 component form generic** dùng cho cả 12 trang,
  không phải 12 editor riêng như `RoadmapConfigEditor`/`TimetableConfigEditor` —
  suy tập field cần hiển thị (`sectionFields()`) từ chính dữ liệu section thay
  vì hardcode theo từng trang. Đánh đổi: labels ít "đặt tên tay" hơn (vd
  "Số liệu"/"Độ dài thanh (%)" dùng chung mọi trang thay vì tên riêng từng chỗ)
  để đổi lấy không phải viết + bảo trì 12 form riêng.
