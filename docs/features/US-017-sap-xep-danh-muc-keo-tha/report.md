# Sắp xếp vị trí danh mục bằng kéo thả (Drag-and-drop row reordering) — Delivery Report

Status: Delivered With Notes
Feature: US-017
Verdict: Pass With Notes
Created: 2026-08-20
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

Dylan giờ kéo thả trực tiếp một dòng danh mục trên bảng ngân sách để đổi vị trí hiển thị của nó. Thứ tự mới được lưu bền vững vào database (field `Category.order` mới, migration đã áp dụng kèm backfill 84/84 dòng cũ), giữ nguyên qua tải lại trang, và tự động đồng bộ sang cả 3 nơi dùng chung danh sách danh mục (bảng ngân sách, dropdown "Danh mục nhận diện", biểu đồ "Cơ cấu chi tiêu") vì cả 3 cùng đọc từ một nguồn `visibleCategories`. Danh mục khóa (vd "Tiền nhà") kéo thả được bình thường; "Chi tiêu khác" tiếp tục cố định ở cuối, không nhận thao tác kéo (chặn cả server lẫn client). Khi tạo tháng mới bằng "Clone tháng đang xem", danh mục ở tháng mới giữ đúng thứ tự tháng nguồn. Lỗi khi lưu (mất mạng) không làm mất thứ tự — bảng tự phục hồi đúng thứ tự trước khi kéo. BA/DEV/DEV wiki, data-model, task đều đã sẵn có từ trước (implement chạy qua Codex CLI); lượt này chỉ chạy phase TEST (review + test) và sinh report. 7/8 AC kiểm chứng trực tiếp trên `next dev`; AC-07 (Clone tháng giữ thứ tự) không kiểm chứng được trên UI thật vì không còn kỳ tháng trống nào trong cửa sổ hiện tại — đã đối chiếu thay thế bằng đọc code, xác nhận đúng logic thiết kế. Không có finding chặn nào; 2 ghi chú Low về gap tooling đã biết từ trước (ESLint chưa cấu hình, vitest chưa cài) không phải lỗi mới phát sinh từ US-017.

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-017-sap-xep-danh-muc-keo-tha.md` | Có |
| Spec | `spec.md` | Có — `Ready for DEV`, 8 AC, 6 Screen Element |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md` | Có |
| Plan | `plan.md` | Có — `Ready for task-breakdown` |
| DEV wiki | `docs/kb/dev/wiki/US-017-sap-xep-danh-muc-keo-tha.md` | Có |
| Data model | `data-model.md` | Có — `Applied` |
| Task | `task.md` | Có — `Implemented`, 10 task |
| Report | `report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 00:00 | Spec Ready for DEV — đã có sẵn từ trước, pipeline chỉ xác nhận lại |
| 2 | DEV | plan | `ssr-plan` | Passed | 00:00 | Plan Ready for task-breakdown, schemaChangeRequired=true — đã có sẵn |
| 3 | DEV | data | `ssr-data` | Passed | 00:00 | `Category.order` + index `(monthId, order)`, migration `20260812063115_add_category_order` đã áp dụng, backfill 84/84 dòng — đã có sẵn |
| 4 | DEV | task | `ssr-breaker` | Passed | 00:00 | 10 task (`TB-01`..`TB-10`), coverage đủ 8 AC — đã có sẵn |
| 5 | DEV | implement | `ssr-dev` | Passed | 00:00 | 10/10 task Done qua Codex CLI, verification đã chạy trước đó — đã có sẵn |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 04:23 | Pass With Notes — 7/8 AC đạt trực tiếp, AC-07 đạt qua đọc code; 6/6 element đúng |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 04:23 | typecheck/prisma validate/build (`npx next build`, 0 lỗi) Passed; lint/vitest = gap tooling đã biết, không phải lỗi mới |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | join = Pass With Notes, không cần fix round |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | Báo cáo này |

Kết quả join phase TEST: Pass With Notes

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | Không dùng ở lượt này — spec đã Ready for DEV từ phiên trước |
| `po-expert` | ba | Aligned (đã chốt ở phiên trước, `DEC-079`) |
| `swe-expert` | implement | Không dùng — `SSR_IMPLEMENT_EXECUTOR=codex`, đã giao Codex CLI ở phiên trước |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | Migration + backfill `Category.order` | Done | Migration Passed, backfill 84/84 dòng đúng thứ tự `rowid` cũ, `prisma validate` Passed |
| `TB-02` | `CategoryEntity` thêm `order: number` | Done | Đọc lại `server/budget/domain/entities/category.ts` — đúng field |
| `TB-03` | `CategoryRepository` thêm `reorder`, input types thêm `order?` | Done | Đọc lại `server/budget/domain/repositories/category-repository.ts` — đúng interface |
| `TB-04` | `category-reorder-rule.ts` mới — `assertReorderableCategories` | Done | Đọc lại file — chặn đúng 3 nhánh (id lạ, `isFallback`, tập id không khớp) |
| `TB-05` | `category-prisma-repository.ts`: `orderBy`, `create` tự tính order, `reorder` transaction | Done | Đọc lại file — `findAll`/`findByMonth` có `orderBy`, `reorder` dùng `$transaction` đúng thiết kế |
| `TB-06` | Use-case `reorder-categories.ts` mới | Done | Đọc lại file — validate input, gọi rule, gọi repository, `revalidatePath` |
| `TB-07` | `create-month.ts` gán `order` khi seed/Clone | Done | Đọc lại file — cả 2 nhánh map `order: index` đúng |
| `TB-08` | `actions.ts` export `reorderCategories` | Done | Đọc lại file — wiring + export + re-export type đúng |
| `TB-09` | UI kéo thả trên `BudgetApp.tsx` | Done | Đọc lại file — tay cầm chỉ render ở dòng không phải fallback, handler `onDragStart/onDragOver/onDrop` đúng pattern optimistic + `refreshSnapshot()` |
| `TB-10` | Verification tổng hợp + DEV wiki | Done | typecheck/prisma validate/build Passed; 7/8 AC kiểm chứng trên `next dev`; DEV wiki đã cập nhật |

Task thêm mới trong quá trình làm: Không có.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | `components/BudgetApp.tsx`; `server/budget/domain/entities/category.ts`; `server/budget/domain/repositories/category-repository.ts`; `server/budget/domain/rules/category-reorder-rule.ts` (mới); `server/budget/infrastructure/repositories/category-prisma-repository.ts`; `server/budget/application/use-cases/reorder-categories.ts` (mới); `server/budget/application/use-cases/create-month.ts`; `server/budget/actions.ts` |
| Prisma / migration | `prisma/schema.prisma`; `prisma/migrations/20260812063115_add_category_order/` |
| DBML | `docs/db/schema.dbml` |
| Knowledge base | `docs/kb/dev/wiki/US-017-sap-xep-danh-muc-keo-tha.md` |
| Memory | `docs/memory/decisions.md` (`DEC-074`..`DEC-079`) |
| Artifact feature | `docs/features/US-017-sap-xep-danh-muc-keo-tha/{spec.md,plan.md,task.md,data-model.md,report.md}` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — "TypeScript: No errors found" | 2026-08-20 |
| `rtk npx prisma validate` | Passed — "The schema at prisma\schema.prisma is valid" | 2026-08-20 |
| `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (gap đã biết từ US-001, `JDG-002`) | 2026-08-20 |
| `rtk lint` | Không áp dụng — dự án chưa có `eslint.config.*` (gap đã biết từ US-016, ghi trong `judgement-log.md`) | 2026-08-20 |
| `rtk next build` / `npx next build` | Passed — 6 route (`/`, `/_not-found`, `/budget`, `/freelance`, `/product`, `/roadmap`), 0 lỗi. `rtk next build` báo exit code 1 dù "Errors: 0" — quirk đã biết của wrapper `rtk` (`JDG-015`), xác nhận thật bằng `npx next build` trực tiếp trả exit 0 | 2026-08-20 |

## 7. Review Findings

Không có finding Critical/High/Medium. 2 ghi chú Low, cả hai đều là gap tooling cấp dự án đã biết từ trước US-017, không phải lỗi mới:

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 0 | Low | `.ssr-kit.env` (`SSR_CMD_LINT`) | `rtk lint` chạy được | Chưa có `eslint.config.*` trong dự án — gap đã biết từ US-016, không phát sinh do US-017 | Còn mở (nợ kỹ thuật cấp dự án) |
| F-02 | 0 | Low | `package.json` | `rtk vitest run` chạy được | Chưa cài framework test — gap đã biết từ US-001 (`JDG-002`), không phát sinh do US-017 | Còn mở (nợ kỹ thuật cấp dự án) |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | Tháng `2027-02`: kéo "Di chuyển" (vị trí 4) lên vị trí 1 — bảng đổi thứ tự ngay |
| AC-02 | Đạt | Tải lại trang cứng (`navigate force`) — thứ tự vẫn giữ "Di chuyển" ở đầu |
| AC-03 | Đạt | Dropdown "Danh mục nhận diện" đọc qua DOM — đúng thứ tự mới |
| AC-04 | Đạt | Biểu đồ "Cơ cấu chi tiêu" đọc nhãn cột qua DOM — đúng thứ tự mới |
| AC-05 | Đạt | Danh mục khóa "Tiền nhà" có tay cầm kéo thả, kéo thành công |
| AC-06 | Đạt | Tháng `2026-08` (có "Chi tiêu khác" hiển thị): dòng fallback không có tay cầm kéo thả (`hasHandle: false`), luôn ở cuối; đồng thời chặn ở tầng server qua `assertReorderableCategories` |
| AC-07 | Đạt (qua đọc code) | Không kiểm chứng được trên UI thật — không còn kỳ tháng trống trong cửa sổ 13 tháng quanh 2026-08-12 để bấm "Clone tháng đang xem". Xác nhận bằng đọc code: `create-month.ts` map `order: index` từ `findByMonth(sourceMonthId)` đã đúng thứ tự nhờ `orderBy` ở repository — không có bước nào làm xáo trộn thứ tự giữa lúc đọc và lúc tạo |
| AC-08 | Đạt | Mô phỏng lỗi mạng bằng cách chặn 1 lần gọi `fetch` đầu (`reorderCategories`) — toast lỗi hiện đúng, thứ tự phục hồi y hệt trước khi kéo (`before` === `afterRecovery`) |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-01` (Tay cầm kéo thả) | Có | `components/BudgetApp.tsx` — icon `GripVertical` chỉ render ở dòng không phải `isFallback`, `draggable` + `onDragStart` gắn đúng |
| `EL-02` (Dòng danh mục thường/khóa) | Có | Thứ tự dòng theo `visibleCategories`, cập nhật ngay khi thả, bền vững qua `order` ở DB |
| `EL-03` (Dòng "Chi tiêu khác") | Có | Không có tay cầm, không nhận `draggable`; luôn ở cuối |
| `EL-04` (Dropdown Danh mục nhận diện) | Có | Không sửa dòng code nào — tự đồng bộ qua `visibleCategories` dùng chung |
| `EL-05` (Biểu đồ Cơ cấu chi tiêu) | Có | Tương tự `EL-04` — tự đồng bộ |
| `EL-06` (Nút Clone tháng đang xem) | Có (qua đọc code) | `create-month.ts` gán `order` đúng thứ tự tháng nguồn khi Clone |

## 8. Fix Rounds

Không có vòng fix nào — join phase TEST = `Pass With Notes`, không đạt điều kiện chạy `ssr-fix`.

Số vòng đã dùng: 0/2

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | AC-07 (Clone tháng giữ thứ tự) chưa được kiểm chứng trên UI thật vì hết kỳ tháng trống để test | Rủi ro thấp | Khi có kỳ tháng trống mới (hoặc xóa một tháng test), chạy lại thao tác Clone một lần để xác nhận trực quan; logic đã xác nhận đúng qua đọc code |
| 2 | Dự án chưa cấu hình ESLint (`eslint.config.*`) — `rtk lint` không chạy được, gap đã biết từ US-016 | Nợ kỹ thuật cấp dự án (không phải của US-017) | Cần user quyết định cấu hình ESLint (Strict/Base) ở một lượt riêng, không phải quyết định trong phạm vi sửa lỗi của một feature |
| 3 | Dự án chưa cài framework test (`vitest`) — `rtk vitest run` không chạy được, gap đã biết từ US-001 (`JDG-002`) | Nợ kỹ thuật cấp dự án (không phải của US-017) | Cân nhắc cài `vitest` khi khối lượng logic domain/rule tăng đủ để cần test tự động, đặc biệt các rule như `category-reorder-rule.ts` |
| 4 | `docs/features/US-006-canh-bao-trung-thang/spec.md` mục 8 (`EL-04`) chưa được bổ sung dòng ràng buộc thứ tự do US-017 tạo ra (đã ghi ở `plan.md` mục 11, `DEC-078`) | Follow-up | Bổ sung ở lượt cập nhật tiếp theo của US-006, không sửa ngay trong US-017 (đúng ranh giới `ssr-ba`) |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git checkout -- components/BudgetApp.tsx server/budget` (hiện chưa commit — có thể revert trực tiếp về trạng thái trước khi chạy pipeline này) |
| Migration SQLite | Xóa field `order` khỏi `schema.prisma`, chạy `prisma migrate dev --name remove_category_order` để sinh migration `DROP COLUMN` |
| Dữ liệu đã backfill | Khôi phục từ `prisma/backups/dev.db.us-017-before-order-backfill.20260812133105.bak` nếu cần hoàn tác riêng phần dữ liệu |
