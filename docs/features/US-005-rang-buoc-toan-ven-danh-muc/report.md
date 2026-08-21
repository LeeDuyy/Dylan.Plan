# Ràng buộc toàn vẹn danh mục + giao dịch không danh mục — Delivery Report

Status: Delivered With Notes
Feature: US-005
Verdict: Pass With Notes
Created: 2026-08-06
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

Dylan giờ xóa được một danh mục thường đang có giao dịch mà không còn gặp lỗi ràng buộc dữ liệu: toàn bộ giao dịch của nó tự động chuyển sang danh mục dự phòng "Chi tiêu khác" (tự sinh nếu tháng chưa có), kèm toast báo rõ số giao dịch đã chuyển. Ghi nhận chi tiêu qua ô nhập nhanh không còn bắt buộc chọn danh mục — khi nội dung không khớp từ khóa nào, ô chọn tự về trạng thái trống và Dylan vẫn bấm "Ghi nhận" được ngay, giao dịch tự vào "Chi tiêu khác". "Chi tiêu khác" luôn ở chế độ chỉ xem (không sửa được tên/loại/ngân sách, không xóa được) và chỉ hiện trên bảng khi đang có giao dịch. Để phân biệt "Chi tiêu khác" với các danh mục khóa khác (Tiền nhà, Chi phí cố định khác — vẫn sửa được 3 trường này), đã thêm field `Category.isFallback` vào data model. Cả 6 tiêu chí chấp nhận đã kiểm chứng bằng thao tác thật trên `next dev`. Rủi ro còn lại: một gap trong `lib/budget-defaults.ts` (so khớp từ khóa kiểu chuỗi con, có từ US-001) khiến đúng ví dụ chữ trong spec AC-03 không tái hiện y hệt — không ảnh hưởng hành vi thật, chỉ ảnh hưởng ví dụ minh họa; và gap môi trường có từ trước (thiếu `eslint.config.js`, chưa cài `vitest`) không thuộc phạm vi sửa của US-005.

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-005-rang-buoc-toan-ven-danh-muc.md` | Có (từ trước) |
| Spec | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md` | Có — `Ready for DEV`, 6 AC |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md` | Có — `Active`, đã sync |
| Plan | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/plan.md` | Có — `Implemented` |
| DEV wiki | `docs/kb/dev/wiki/US-005-rang-buoc-toan-ven-danh-muc.md` | Có — `Active` |
| Data model | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/data-model.md` | Có — `Applied` |
| Task | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/task.md` | Có — `Implemented`, 12/12 task Done |
| Report | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 08:56 | Ready for DEV, 6 AC, po-expert Aligned, ba-expert sửa nhỏ mục 10 |
| 2 | DEV | plan | `ssr-plan` | Passed | 10:04 | Ready for task-breakdown, schemaChangeRequired=true (Category.isFallback) |
| 3 | DEV | data | `ssr-data` | Passed | 03:07 | Category.isFallback, migration 20260806083443, DBML đồng bộ, tsc Passed |
| 4 | DEV | task | `ssr-breaker` | Passed | 01:42 | 12 task, TB-01 Done, coverage đủ 6 AC |
| 5 | DEV | implement | `ssr-dev` | Passed | 22:46 | 12/12 task Done, build+typecheck sạch, 6 AC kiểm chứng thật |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 04:37 | Pass With Notes, 6/6 AC đạt, 4/4 EL đạt, 5 finding Low |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 01:56 | typecheck/build/prisma Passed; lint+vitest chưa cấu hình (gap có từ trước, không do US-005) |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | join = Pass With Notes, không cần fix round |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | Báo cáo này |

Kết quả join phase TEST: Pass With Notes

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | 1 thay đổi đã sửa (bổ sung phụ thuộc `US-004` ở mục 10 spec) |
| `po-expert` | ba | Aligned |
| `swe-expert` | implement | Không dùng — `ssr-dev` tự triển khai (12 task, không task nào chạm ≥ 4 file hoặc khu vực rủi ro cao đủ ngưỡng giao agent) |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | Thêm `Category.isFallback`, migration, đồng bộ DBML | Done | `data-model.md` mục 7 — `prisma validate`/`tsc` Passed |
| `TB-02` | `CategoryEntity`/`CategoryRepository`/`TransactionRepository` thêm field & phương thức mới | Done | `tsc --noEmit` Passed |
| `TB-03` | Domain service `fallback-category-service.ts` | Done | `tsc --noEmit` Passed |
| `TB-04` | `remove-category.ts` chuyển giao dịch trước khi xóa | Done | `tsc --noEmit` Passed; xác nhận qua AC-01/02/06 |
| `TB-05` | `record-quick-transaction.ts` cho `categoryId` optional | Done | `tsc --noEmit` Passed; xác nhận qua AC-03 |
| `TB-06` | `upsert-category.ts` chặn sửa `isFallback`; `create-month.ts` lọc `isFallback` khi sao chép | Done | `tsc --noEmit` Passed |
| `TB-07` | 2 repository Prisma hiện thực phương thức mới | Done | `tsc --noEmit` Passed |
| `TB-08` | `actions.ts` nối dep, export `RemoveCategoryResult` | Done | `tsc --noEmit` Passed |
| `TB-09` | Component `Toast` + tích hợp `removeCategory` wrapper | Done | Thao tác thật xác nhận toast đúng nội dung |
| `TB-10` | Dropdown nhập nhanh có lựa chọn trống | Done | Thao tác thật xác nhận AC-03 |
| `TB-11` | Bảng danh mục ẩn/đọc-chỉ dòng `isFallback` | Done | Thao tác thật xác nhận AC-04/AC-05 |
| `TB-12` | Verification tổng hợp | Done | `tsc`/`build`/`prisma validate` Passed, đủ 6 AC thủ công |

Task thêm mới trong quá trình làm: Không có.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | `server/budget/domain/entities/category.ts`, `server/budget/domain/repositories/category-repository.ts`, `server/budget/domain/repositories/transaction-repository.ts`, `server/budget/domain/services/fallback-category-service.ts` (mới), `server/budget/domain/services/budget-snapshot-service.ts`, `server/budget/domain/services/legacy-migration-service.ts`, `server/budget/infrastructure/repositories/category-prisma-repository.ts`, `server/budget/infrastructure/repositories/transaction-prisma-repository.ts`, `server/budget/application/use-cases/remove-category.ts`, `server/budget/application/use-cases/record-quick-transaction.ts`, `server/budget/application/use-cases/upsert-category.ts`, `server/budget/application/use-cases/create-month.ts`, `server/budget/actions.ts`, `components/shared/Toast.tsx` (mới), `components/BudgetApp.tsx` |
| Prisma / migration | `prisma/schema.prisma`, `prisma/migrations/20260806083443_add_category_is_fallback/` |
| DBML | `docs/db/schema.dbml` |
| Knowledge base | `docs/kb/ba/wiki/knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md`, `docs/kb/ba/wiki/delivery/pbi/US-005-rang-buoc-toan-ven-danh-muc.md`, `docs/kb/ba/wiki/ingestion/source-record/US-005-rang-buoc-toan-ven-danh-muc.md`, `docs/kb/dev/wiki/US-005-rang-buoc-toan-ven-danh-muc.md`, `docs/kb/dev/00-index.md` |
| Memory | `docs/memory/decisions.md` (DEC-058), `docs/memory/judgement-log.md` (JDG-010, JDG-011) |
| Artifact feature | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/{spec.md,plan.md,data-model.md,task.md,report.md}` |
| Dev tooling (ngoài phạm vi nghiệp vụ) | `.claude/launch.json` (thêm `autoPort: true` để chạy verification thủ công) |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed | 2026-08-06 |
| `rtk npx prisma validate` | Passed | 2026-08-06 |
| `rtk vitest run` | Failed — chưa cài framework test (gap có từ trước, `JDG-002`, US-001) | 2026-08-06 |
| `rtk next build` | Passed — Errors: 0, Warnings: 0 | 2026-08-06 |
| `rtk lint` | Failed — thiếu `eslint.config.js` (gap môi trường có từ trước) | 2026-08-06 |

## 7. Review Findings

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 0 | Low | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/data-model.md:66` | Mô tả đúng SQL migration Prisma thực sự sinh ra | Ban đầu ghi giả định `ALTER TABLE ADD COLUMN`, thực tế Prisma chọn `RedefineTables` (tạo lại bảng) | Đã sửa |
| F-02 | 0 | Low | `server/budget/domain/services/legacy-migration-service.ts:85-93` | Plan mục 11 liệt kê đủ file sẽ đổi | Thiếu file này trong danh sách — phải sửa vì `isFallback` giờ bắt buộc trong `CategoryRepository.upsert` | Đã sửa (thêm `isFallback: false` cho dữ liệu di trú cũ) |
| F-03 | 0 | Low | `.claude/launch.json` | Không nằm trong phạm vi US-005 | Thêm `autoPort: true` để verification thủ công chạy được (dev server khác đang chiếm cổng 3000) | Chấp nhận — chỉ cấu hình dev tooling, không ảnh hưởng production |
| F-04 | 0 | Low | Nhánh `test` — `rtk lint`, `rtk vitest run` | Chạy được | Lỗi do thiếu cấu hình/cài đặt — gap môi trường có từ trước US-005 | Từ chối sửa trong phạm vi này — theo đúng tiền lệ US-001/US-002/US-004 |
| F-05 | 0 | Low | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md` mục 7 (AC-03) | Ví dụ "sửa xe máy 200k" không khớp danh mục nào | Câu này thực ra khớp từ khóa "xe" của "Di chuyển" (`lib/budget-defaults.ts`, so khớp chuỗi con có từ US-001) — xem `JDG-011` | Còn mở — follow-up cho `ssr-ba` đổi ví dụ ở lượt sau; hành vi AC-03 đã kiểm chứng đúng bằng câu khác |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | Xóa "Di chuyển" (2 giao dịch) trên `next dev` thật: toast "Đã xóa 'Di chuyển'. 2 giao dịch đã chuyển sang Chi tiêu khác."; "Chi tiêu khác" mới: Linh hoạt, 0đ, Chi thực tế 30.000đ đúng tổng |
| AC-02 | Đạt | Xóa "Tiết kiệm / đầu tư" (0 giao dịch): toast "Đã xóa 'Tiết kiệm / đầu tư'.", không tạo "Chi tiêu khác" |
| AC-03 | Đạt | Nội dung không khớp keyword → dropdown về `""` ("— Chưa xác định —"), nút "Ghi nhận" không disable, giao dịch gắn "Chi tiêu khác" mới, Chi thực tế 200.000đ |
| AC-04 | Đạt | DOM xác nhận dòng "Chi tiêu khác": không `input`, không nút xóa |
| AC-05 | Đạt | Xóa giao dịch duy nhất của "Chi tiêu khác" → dòng biến mất khỏi bảng ngay |
| AC-06 | Đạt | Xóa "Giải trí / cafe / trà sữa" (1 giao dịch) khi "Chi tiêu khác" đã có 30.000đ → gộp vào cùng 1 dòng, Chi thực tế 75.000đ, không tạo bản ghi mới |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-01` | Có | Dropdown có option trống, tự chọn khi không khớp từ khóa |
| `EL-02` | Có | Dòng "Chi tiêu khác" chữ thường, ẩn khi `actual === 0` |
| `EL-03` | Có | Nút xóa giữ nguyên pattern cũ, tự loại trừ `isFallback` vì luôn `locked` |
| `EL-04` | Có | Toast mới, tự đóng sau 4 giây, nội dung đúng theo `movedCount` |

## 8. Fix Rounds

Không có vòng fix nào — join phase TEST đạt `Pass With Notes` ngay từ vòng đầu.

Finding bị từ chối:

| Finding | Lý do từ chối | Chuyển thành |
| --- | --- | --- |
| F-04 | Gap môi trường có từ trước US-005 (thiếu `eslint.config.js`, chưa cài `vitest`), không phải lỗi phát sinh từ chu trình này | Follow-up mục 9 |
| F-05 | Sửa ví dụ trong spec ngoài quyền `ssr-review`; hành vi thật đã đúng | Follow-up mục 9 |

Số vòng đã dùng: 0/2

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | Ví dụ "sửa xe máy 200k" ở spec AC-03 khớp nhầm từ khóa "xe" (Di chuyển) do so khớp kiểu chuỗi con trong `lib/budget-defaults.ts` | Nợ kỹ thuật (spec) | `ssr-ba` đổi ví dụ trong một lượt cập nhật spec sau; không chặn triển khai |
| 2 | Dự án chưa có `eslint.config.js` (ESLint v9) và chưa cài `vitest` — gap xuyên suốt từ US-001 | Nợ kỹ thuật (môi trường) | Một US/task riêng để cấu hình lint + test framework, áp dụng chung toàn dự án, ngoài phạm vi một US nghiệp vụ đơn lẻ |
| 3 | `components/BudgetApp.tsx` bảng danh mục vẫn dùng tên cột cũ "Chênh lệch"/"Tỷ trọng" thay vì "Còn lại" theo `DEC-019` | Nợ kỹ thuật (đã biết từ US-002/US-004) | Không thuộc phạm vi US-005 — theo dõi tiếp ở US liên quan tới bảng danh mục khi tới lượt |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git checkout` lại các file liệt kê ở mục 5 (nhóm Source) — toàn bộ thay đổi chưa commit, có thể revert từng file hoặc toàn bộ working tree |
| Migration SQLite | Xóa `prisma/migrations/20260806083443_add_category_is_fallback/`, bỏ field `isFallback` khỏi `prisma/schema.prisma`, chạy lại `rtk npx prisma migrate dev`; hoặc phục hồi từ backup `prisma/backups/dev.db.us-005-before-isfallback.20260806133300.bak` |
| Dữ liệu đã backfill | Không có backfill thủ công — `@default(false)` tự áp dụng, không cần script riêng để hoàn tác |
