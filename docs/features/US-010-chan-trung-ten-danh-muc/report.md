# Chặn trùng tên danh mục — Delivery Report

Status: Delivered With Notes
Feature: US-010
Verdict: Pass With Notes
Created: 2026-08-10
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

Dylan không còn tạo được hai danh mục cùng tên (đã chuẩn hóa hoa/thường, khoảng trắng thừa đầu/cuối, khoảng trắng lặp ở giữa) trong cùng một tháng — kể cả khi trùng với tên mặc định "Danh mục mới" do hệ thống tự đặt lúc bấm "Thêm danh mục". Khi phát hiện trùng, hệ thống chặn thao tác, ô nhập trở lại tên trước khi sửa (nếu là sửa tên), và hiện thông báo lỗi rõ ràng nêu tên đang trùng cùng yêu cầu đổi tên khác. Không đổi cấu trúc dữ liệu. Rủi ro còn lại thấp: 3 finding mức Low (2 là gap công cụ có từ trước US-010 — ESLint chưa cấu hình, quirk exit code của `rtk next build`; 1 là một tiêu chí chấp nhận chỉ kiểm chứng được bằng đọc code, không dựng lại bằng UI thật để tránh làm bẩn dữ liệu test).

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-010-chan-trung-ten-danh-muc.md` | Có |
| Spec | `docs/features/US-010-chan-trung-ten-danh-muc/spec.md` | Có — `Ready for DEV`, 7 AC |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-010-chan-trung-ten-danh-muc.md` | Có — `Active`, đã sync |
| Plan | `docs/features/US-010-chan-trung-ten-danh-muc/plan.md` | Có — `Implemented` |
| DEV wiki | `docs/kb/dev/wiki/US-010-chan-trung-ten-danh-muc.md` | Có — `Active` |
| Data model | `data-model.md` | Không áp dụng — không đổi cấu trúc dữ liệu |
| Task | `docs/features/US-010-chan-trung-ten-danh-muc/task.md` | Có — `Implemented`, 4/4 task Done |
| Report | `report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 17:48 | `Ready for DEV`, 7 AC, `po-expert` Aligned, wikiSynced |
| 2 | DEV | plan | `ssr-plan` | Passed | 145:35 | `Ready for task-breakdown`, `schemaChangeRequired=false` |
| 3 | DEV | data | `ssr-data` | Skipped | 00:00 | Không đổi cấu trúc dữ liệu |
| 4 | DEV | task | `ssr-breaker` | Passed | 01:39 | 4 task, `Ready`, không vòng lặp |
| 5 | DEV | implement | `ssr-dev` | Passed | 28:20 | 4/4 task Done, 7 AC kiểm chứng thủ công, `tsc`/`build`/`prisma` Passed |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 03:30 | Chạy song song với stage test — `Pass With Notes`, 3 finding Low |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 03:30 | Chạy song song với stage review — typecheck/build/prisma Passed, lint+vitest gap đã biết |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | Skipped khi join = `Pass With Notes` |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | Báo cáo này |

Kết quả join phase TEST: **Pass With Notes**

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | Sửa 4 điểm (ngoại lệ "không có dữ liệu" mâu thuẫn nội bộ, AC-03 kiểm chứng hành vi UI không tồn tại, thiếu AC cho danh mục duy nhất, thiếu liên kết phụ thuộc `US-005`); phát hiện 1 điểm cần user quyết (A5 — mở rộng chuẩn hóa khoảng trắng giữa, chốt thành `DEC-069`) |
| `po-expert` | ba | Aligned |
| `swe-expert` | implement | Không dùng — `SSR_IMPLEMENT_EXECUTOR=codex`, giao Codex CLI cho `TB-01..TB-03` |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | Domain rule `category-name-rule.ts` tạo mới | Done | Codex CLI tạo file; `ssr-dev` đối chiếu phạm vi và tự chạy lại `rtk tsc --noEmit` → 0 lỗi |
| `TB-02` | `upsert-category.ts` gọi rule mới trước khi ghi | Done | Đọc lại code xác nhận 3 validation cũ giữ nguyên, `rtk tsc --noEmit` → 0 lỗi |
| `TB-03` | `commitCategory`/`addCategory` có `try/catch` đúng mẫu `createNewMonth` | Done | Đọc lại code xác nhận đúng mẫu, `rtk tsc --noEmit` → 0 lỗi |
| `TB-04` | Verification tổng hợp + cập nhật DEV wiki | Done | typecheck/build/prisma Passed; 6/7 AC qua UI thật + reload cứng, 1/7 (AC-06) qua đọc code |

Task thêm mới trong quá trình làm: Không có.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source (mới) | `server/budget/domain/rules/category-name-rule.ts` |
| Source (sửa) | `server/budget/application/use-cases/upsert-category.ts` |
| Source (sửa) | `components/BudgetApp.tsx` |
| Prisma / migration | Không có — không đổi cấu trúc dữ liệu |
| DBML | Không có |
| Knowledge base | `docs/kb/ba/wiki/knowledge/feature/US-010-chan-trung-ten-danh-muc.md`, `.../feature-summary/US-010-...md`, `.../business-rule/BR-017-chan-trung-ten-danh-muc.md`, `.../delivery/pbi/US-010-...md`, `.../ingestion/source-record/US-010-...md`, `docs/kb/ba/wiki/indexes/*`, `docs/kb/ba/wiki/reports/wiki-health-report.md`, `docs/kb/ba/00-index.md`, `docs/kb/dev/wiki/US-010-chan-trung-ten-danh-muc.md`, `docs/kb/dev/00-index.md`, `docs/requirements-index.md` |
| Memory | `docs/memory/decisions.md` (`DEC-068`, `DEC-069`, `DEC-070`), `docs/memory/judgement-log.md` (`JDG-014`, `JDG-015`, `JDG-016`) |
| Artifact feature | `docs/features/US-010-chan-trung-ten-danh-muc/spec.md`, `plan.md`, `task.md`, `report.md` (chính file này) |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — 0 lỗi | 2026-08-10 |
| `rtk npx prisma validate` | Passed — hợp lệ, không đổi | 2026-08-10 |
| `rtk vitest run` | Không áp dụng — chưa có framework test cài đặt (gap đã biết từ US-001/US-004/US-005) | 2026-08-10 |
| `rtk next build` | `rtk next build` trả exit 1 dù in "Errors: 0 \| Warnings: 0"; `npx next build` trực tiếp → exit 0, Errors: 0, Warnings: 0. Kết luận Passed (quirk wrapper, ghi `JDG-015`) | 2026-08-10 |
| `rtk lint` | Không áp dụng — ESLint chưa cấu hình, `next lint` cần chọn cấu hình tương tác (gap đã biết, ghi `JDG-016`) | 2026-08-10 |

## 7. Review Findings

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 0 | Low | `plan.md` mục 12, `task.md` `TB-04` | `SSR_CMD_LINT` chạy được | ESLint chưa cấu hình trong dự án — gap có từ trước US-010 | Còn mở — không thuộc phạm vi sửa của US-010, đã ghi `JDG-016` |
| F-02 | 0 | Low | `rtk next build` | Exit code phản ánh đúng kết quả build | Exit 1 dù nội dung in đúng "Errors: 0 \| Warnings: 0"; `npx next build` trực tiếp cho exit 0 | Còn mở — quirk wrapper, đã ghi `JDG-015` |
| F-03 | 0 | Low | `task.md` `TB-04`, AC-06 | AC-06 kiểm chứng bằng thao tác UI thật | Chỉ xác nhận bằng đọc code để tránh làm bẩn dữ liệu test (`dev.db`) | Còn mở — không chặn merge |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | Server log thật: `Error: Tên danh mục "ăn uống linh tinh" đã tồn tại trong tháng này. Vui lòng đổi tên khác.`; ô nhập trở lại tên cũ, xác nhận qua reload cứng |
| AC-02 | Đạt | Bấm "Thêm danh mục" khi đã có "Danh mục mới" → không có dòng mới; toast xác nhận qua DOM: `Tên danh mục "Danh mục mới" đã tồn tại trong tháng này. Vui lòng đổi tên khác.` |
| AC-03 | Đạt | Giữ nguyên tên "Ăn uống & đi chợ" → POST 200 sạch, không lỗi |
| AC-04 | Đạt | Đổi "Ăn uống & đi chợ" → "Giải trí kiểm thử" → lưu bền vững, xác nhận qua reload cứng |
| AC-05 | Đạt | Đổi "Di chuyển" (tháng 2026-07) → "Ăn uống linh tinh" (đã tồn tại ở tháng 2026-08) → lưu bền vững, không bị chặn |
| AC-06 | Không kiểm được qua UI — xác nhận bằng đọc code | `siblings` rỗng sau loại trừ `excludeId` → `Array.prototype.some` luôn `false` (`category-name-rule.ts:21-25`) |
| AC-07 | Đạt | Sửa tên thành "Ăn uống  linh tinh" (hai khoảng trắng giữa) → server log xác nhận rút gọn đúng, chặn như AC-01 |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-01` (Ô nhập "Tên danh mục") | Có | `commitCategory` (`BudgetApp.tsx:372-388`) |
| `EL-02` (Nút "Thêm danh mục") | Có | `addCategory` (`BudgetApp.tsx:406-414`) |
| `EL-03` (Toast lỗi trùng tên) | Có | Tái dùng `components/shared/Toast.tsx`, nội dung xác nhận qua DOM thật |

## 8. Fix Rounds

Không có vòng fix nào — join phase TEST đạt `Pass With Notes` ngay từ round 0.

Số vòng đã dùng: 0/2

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | Dự án chưa cấu hình ESLint — `next lint`/`rtk lint` không chạy được ở chế độ không tương tác | Nợ kỹ thuật | User tự chạy `next lint` một lần, chọn cấu hình ("Strict" khuyến nghị), rồi commit file cấu hình sinh ra |
| 2 | `rtk next build` trả exit code sai (1) dù build thật thành công (0 lỗi, 0 cảnh báo) | Nợ kỹ thuật (công cụ `rtk`, ngoài phạm vi dự án) | Ghi nhận, dùng `npx next build` trực tiếp để xác nhận khi nghi ngờ exit code của `rtk` |
| 3 | AC-06 (tháng chỉ có một danh mục) chưa kiểm bằng UI thật | Rủi ro thấp | Nếu cần, tạo một tháng test riêng chỉ có 1 danh mục để kiểm trực tiếp |
| 4 | 5 US khác (US-001, US-007, US-008, US-009, US-011) vẫn ở dạng trang wiki phẳng, chưa migrate sang cấu trúc nested | Nợ kỹ thuật (đã biết từ trước, không thuộc phạm vi US-010) | Xem `docs/memory/judgement-log.md#jdg-005` |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git checkout -- server/budget/domain/rules/category-name-rule.ts server/budget/application/use-cases/upsert-category.ts components/BudgetApp.tsx` (hoặc xóa file mới, revert 2 file sửa) — không có breaking contract, an toàn hoàn tác |
| Migration SQLite | Không áp dụng — không có migration nào được tạo |
| Dữ liệu đã backfill | Không áp dụng — không backfill dữ liệu nào |
