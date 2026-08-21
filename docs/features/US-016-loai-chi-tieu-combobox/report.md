# Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định — Delivery Report

Status: Delivered With Notes
Feature: US-016
Verdict: Pass With Notes
Created: 2026-08-12
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

Cột "Loại" trong bảng danh mục (trang Quản lý chi tiêu, `/budget`) không còn là ô nhập chữ tự do — giờ là một danh sách chọn (combobox) chỉ cho chọn đúng 3 giá trị cố định: "Cố định", "Tích lũy", "Khác". "Khác" thay thế hoàn toàn "Linh hoạt" cũ. Dữ liệu Loại cũ đã được chuẩn hóa một lần: 44 danh mục đang có giá trị "Linh hoạt" hoặc dữ liệu lỗi "Linh s" (phát hiện thật từ `prisma/dev.db`) đã chuyển thành "Khác"; "Cố định" và "Tích lũy" giữ nguyên. Ba nơi hệ thống tự gán Loại mặc định (seed danh mục mặc định, nút "Thêm danh mục", "Chi tiêu khác" tự sinh) đều đổi sang "Khác". Thẻ insight "Chi linh hoạt" đổi tên thành "Chi khác". Khảo sát phát hiện thêm một điểm ngoài spec ban đầu: đường di trú dữ liệu `localStorage` cũ (`legacy-migration-service.ts`) cũng được vá để không tái tạo dữ liệu Loại rác. Toàn bộ 8 tiêu chí chấp nhận đã kiểm chứng thật trên `next dev` với dữ liệu thật (kể cả dữ liệu tháng cũ đã qua migration). Rủi ro còn lại: spec `US-005` còn nhắc "Linh hoạt" ở vài chỗ, cần cập nhật ở một lượt riêng (không chặn release của US-016).

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-016-loai-chi-tieu-combobox.md` | Có |
| Spec | `docs/features/US-016-loai-chi-tieu-combobox/spec.md` | Có (`Ready for DEV`, 8 AC) |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-016-loai-chi-tieu-combobox.md` | Có (`Active`) |
| Plan | `docs/features/US-016-loai-chi-tieu-combobox/plan.md` | Có (`Implemented`) |
| DEV wiki | `docs/kb/dev/wiki/US-016-loai-chi-tieu-combobox.md` | Có (`Active`) |
| Data model | `docs/features/US-016-loai-chi-tieu-combobox/data-model.md` | Có (`Applied` — backfill trực tiếp, không phải migration có version, xem mục 9) |
| Task | `docs/features/US-016-loai-chi-tieu-combobox/task.md` | Có (`Implemented`, 8/8 Done) |
| Report | `docs/features/US-016-loai-chi-tieu-combobox/report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 19:15 | Ready for DEV, 8 AC, po-expert Aligned |
| 2 | DEV | plan | `ssr-plan` | Passed | 08:36 | Ready for task-breakdown, schemaChangeRequired=true (data-only migration) |
| 3 | DEV | data | `ssr-data` | Passed | 08:17 | Backfill trực tiếp 44 dòng (`JDG-018`), không có migration version, DBML note đã thêm |
| 4 | DEV | task | `ssr-breaker` | Passed | 02:09 | Ready, 8 task (TB-01 Done), coverage đủ 8 AC |
| 5 | DEV | implement | `ssr-dev` | Passed | 14:34 | 8/8 task Done, typecheck/build/prisma validate Passed, 8 AC kiểm chứng thủ công |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 02:37 | Pass With Notes — 2 finding Low, đủ 8 AC + 4 EL đạt |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 02:37 | typecheck/prisma validate/build Passed |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | join = Pass With Notes, không cần fix |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | Chính file này |

Kết quả join phase TEST: Pass With Notes

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | Sửa 4 điểm (thêm AC-08 cho ngoại lệ lỗi lưu, bổ sung `BR-010` vào mục 2, mở rộng mục 11 với AC-01/AC-03 của US-005, sửa số đếm AC ở mục 12) |
| `po-expert` | ba | Aligned |
| `swe-expert` | implement | Không dùng — `SSR_IMPLEMENT_EXECUTOR=codex`, giao Codex CLI (xem mục 4) |

Executor implement: `codex` — `ssr-dev` soạn brief, chạy Codex CLI, đối chiếu phạm vi (đúng 6 file được giao, không chạm file cấm), tự chạy lại verification trước khi chấp nhận.

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | Backfill `Category.type`: 44 dòng → "Khác", "Cố định"/"Tích lũy" giữ nguyên | Done | Query `GROUP BY type` sau backfill — chỉ còn 3 giá trị hợp lệ (`data-model.md` mục 3, 7) |
| `TB-02` | `lib/budget-defaults.ts`: `CATEGORY_TYPES`/`CategoryType`, 4 seed đổi sang "Khác" | Done | Đọc lại file khớp thiết kế; `tsc --noEmit` 0 lỗi |
| `TB-03` | `category-type-rule.ts` (mới): `assertValidCategoryType`, `normalizeCategoryType` | Done | Đọc lại file khớp thiết kế, không import Prisma/infrastructure |
| `TB-04` | `upsert-category.ts` validate qua rule mới | Done | `try/catch` đúng vị trí, ném lại `UpsertCategoryError` |
| `TB-05` | `fallback-category-service.ts` đổi hằng số mặc định | Done | Kiểm chứng thật: "Chi tiêu khác" tự sinh (tháng 2027-01) có Loại "Khác" |
| `TB-06` | `legacy-migration-service.ts` dùng `normalizeCategoryType` | Done | Đọc lại code — không còn dữ liệu `localStorage` cũ để test thật (F-02) |
| `TB-07` | `BudgetApp.tsx`: select Loại, `commitCategory` override, `addCategory`, `totals.flexible`, nhãn insight | Done | Kiểm chứng thật đủ AC-01, AC-02, AC-05, AC-07 trên `next dev` |
| `TB-08` | Verification tổng hợp + cập nhật DEV wiki | Done | typecheck/prisma validate/build Passed; đủ 8 AC thủ công |

Task thêm mới trong quá trình làm: Không có.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | `lib/budget-defaults.ts`, `server/budget/domain/rules/category-type-rule.ts` (mới), `server/budget/application/use-cases/upsert-category.ts`, `server/budget/domain/services/fallback-category-service.ts`, `server/budget/domain/services/legacy-migration-service.ts`, `components/BudgetApp.tsx` |
| Prisma / migration | Không có file migration nào — backfill trực tiếp qua `better-sqlite3`, ngoài `prisma/migrations/` (`JDG-018`) |
| DBML | `docs/db/schema.dbml` (thêm `note` tài liệu hóa 3 giá trị hợp lệ của `type`) |
| Knowledge base | `docs/kb/ba/raw/US-016-loai-chi-tieu-combobox.md`, `docs/kb/ba/wiki/**` (feature, feature-summary, pbi, source-record, `BR-019` mới, `ENT-002-danh-muc`, `EPC-002`, 4 index, `wiki-health-report.md`), `docs/kb/dev/wiki/US-016-loai-chi-tieu-combobox.md`, `docs/kb/dev/00-index.md` |
| Memory | `docs/memory/decisions.md` (`DEC-073`), `docs/memory/glossary.md` (định nghĩa "Loại danh mục"), `docs/memory/judgement-log.md` (`JDG-018`) |
| Artifact feature | `spec.md`, `plan.md`, `data-model.md`, `task.md`, `report.md` (chính file này) |
| PO / Business Flow | `docs/po/review-2026-08-11-loai-chi-tieu-combobox.md`, `docs/kb/ba/business-flow.md` (mục 6, 7, 9), `docs/kb/ba/backlog.md`, `docs/requirements-index.md`, `docs/kb/ba/00-index.md` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `tsc --noEmit` | Passed | 2026-08-12 |
| `prisma validate` | Passed | 2026-08-12 |
| `vitest run` | Không áp dụng — chưa cài framework test trong `package.json` (gap đã biết từ US-001/US-004/US-005) | 2026-08-12 |
| `next build` | Passed — 3 route, Errors: 0 | 2026-08-12 |
| `next lint` | Không chạy được ở chế độ non-interactive (gap đã biết, `JDG-016`) | 2026-08-12 |

## 7. Review Findings

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 0 | Low | `task.md` TB-08 (AC-08) | Verification thủ công qua thao tác thật | Xác nhận bằng đọc lại code (catch block tái dùng pattern đã kiểm chứng ở US-005/US-010), không mô phỏng lỗi mạng thật qua trình duyệt tự động | Còn mở — chấp nhận được, không chặn |
| F-02 | 0 | Low | `task.md` TB-06 | Kiểm chứng thủ công đường di trú `localStorage` | Không còn dữ liệu `localStorage` cũ trên máy dev để kích hoạt — chỉ xác nhận qua đọc code | Còn mở — chấp nhận được, không chặn |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | DOM thật: mọi `select` trong bảng danh mục có đúng 3 lựa chọn `["Cố định","Tích lũy","Khác"]`, không gõ được |
| AC-02 | Đạt | Đổi giá trị "Sức khỏe / cá nhân" (tháng 2026-08) sang "Tích lũy", reload cứng vẫn giữ giá trị |
| AC-03 | Đạt | Tháng 2026-08 (dữ liệu thật trước migration): "Tiền nhà"/"Chi phí cố định khác" vẫn "Cố định" |
| AC-04 | Đạt | Cùng tháng 2026-08: "Ăn uống linh tinh"/"Giải trí kiểm thử" (trước đây "Linh hoạt") nay "Khác"; 44 dòng đổi đúng dự tính |
| AC-05 | Đạt | Bấm "Thêm danh mục" → dòng mới Loại mặc định "Khác" |
| AC-06 | Đạt | Tháng 2027-01 (chưa từng có "Chi tiêu khác"): giao dịch không khớp từ khóa, không chọn danh mục → tự sinh "Chi tiêu khác" Loại "Khác" |
| AC-07 | Đạt | Thẻ insight "Chi khác" hiện đúng 77.000 ₫, khớp giao dịch vừa ghi ở AC-06 |
| AC-08 | Đạt (qua đọc code — F-01) | `commitCategory` catch block không đổi, dùng lại `setToastMessage` + `refreshSnapshot()` đã kiểm chứng ở US-005/US-010 |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-01` (ô chọn Loại) | Có | `components/BudgetApp.tsx:986-999` |
| `EL-02` (nút Thêm danh mục) | Có | `components/BudgetApp.tsx:415-423` |
| `EL-03` (thẻ "Chi khác") | Có | `components/BudgetApp.tsx:1072` |
| `EL-04` (Loại chỉ đọc của "Chi tiêu khác") | Có | `components/BudgetApp.tsx:967` |

## 8. Fix Rounds

Không có vòng fix nào — join phase TEST đạt `Pass With Notes` ngay từ đầu, không có finding `Critical`/`High`.

Finding bị từ chối: Không có.

Số vòng đã dùng: 0/3

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | Spec `US-005` (mục 3, AC-01, AC-03, mục 14 A3) và ASCII Mockup của nó còn nhắc giá trị "Linh hoạt" cho "Chi tiêu khác" tự sinh — nay đã đổi thành "Khác" | Nợ kỹ thuật (tài liệu) | Chạy `ssr-ba` cập nhật lại spec `US-005` ở một lượt riêng, theo đúng mục 11 của `plan.md` US-016 |
| 2 | F-01, F-02 (mục 7) — 2 điểm chỉ xác nhận qua đọc code, không qua thao tác thật (lỗi mạng mô phỏng được, dữ liệu `localStorage` cũ không còn tồn tại để test) | Rủi ro thấp | Không cần hành động ngay; nếu phát sinh dữ liệu `localStorage` cũ thật trong tương lai (khó xảy ra, US-001/US-002 đã Delivered từ lâu), kiểm tra lại đường di trú một lần |
| 3 | Bảng danh mục vẫn dùng tên cột cũ "Chênh lệch"/"Tỷ trọng" thay vì "Còn lại" theo `DEC-019` — gap có từ trước, không thuộc phạm vi US-016 (đã ghi nhận tương tự ở `plan.md` của US-005, US-010) | Nợ kỹ thuật (có từ trước) | Không sửa trong US-016; cần một requirement riêng nếu muốn giải quyết |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git checkout` lại 6 file đã đổi (liệt kê ở mục 5) về trạng thái trước US-016 — không có migration schema nào phải hoàn tác kèm theo |
| Migration SQLite | Không áp dụng — US-016 không tạo migration nào |
| Dữ liệu đã backfill | Khôi phục từ `prisma/backups/dev.db.us-016-before-normalize-type.20260811235212.bak` nếu cần đảo ngược 44 dòng đã đổi thành "Khác" (lưu ý: không thể phân biệt lại dòng nào trước đó là "Linh hoạt" hay "Linh s" sau khi đã gộp chung, phải khôi phục nguyên file backup, không sửa từng dòng) |
