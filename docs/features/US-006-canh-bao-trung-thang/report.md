# Cảnh báo trùng tháng khi tạo tháng mới (đã gộp US-013) — Delivery Report

Status: Delivered With Notes
Feature: US-006
Verdict: Pass With Notes
Created: 2026-08-10
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

Dylan không còn cách nào chọn được một kỳ tháng đã tồn tại để tạo tháng mới — ô "Tạo tháng mới" đổi từ nhập tự do thành combobox 13 kỳ tháng, kỳ đã có dữ liệu bị vô hiệu hóa. Khu vực xem tháng tách riêng, đổi tên "Chọn tháng" → "Chọn tháng xem"; nút "Clone tháng hiện tại" đổi tên thành "Clone tháng đang xem" và sửa đúng nguyên nhân gốc khiến nó trước đây cho kết quả giống hệt nút "Tạo tháng" — nay "Tạo tháng" luôn dùng danh mục mặc định, "Clone tháng đang xem" luôn sao chép cấu trúc danh mục từ tháng đang xem. Toàn bộ thay đổi nằm trong `components/BudgetApp.tsx` và `app/globals.css`, không chạm server/schema. 6/7 AC đã kiểm chứng trực tiếp bằng thao tác thật trên `next dev`; AC-05 (thông báo lỗi khi tạo trùng đồng thời 2 tab) chỉ xác nhận gián tiếp qua rà soát code do hết dữ liệu test trong phiên và một bug có sẵn không liên quan ở nút "Reset dữ liệu" (đã tách follow-up riêng).

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-006-canh-bao-trung-thang.md` + `docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md` (gộp, `status: Merged`) | Có |
| Spec | `spec.md` | Có — `Ready for DEV`, 7 AC |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md` | Có |
| Plan | `plan.md` | Có — `Implemented` |
| DEV wiki | `docs/kb/dev/wiki/US-006-canh-bao-trung-thang.md` | Có |
| Data model | `data-model.md` | Không áp dụng — không đổi schema |
| Task | `task.md` | Có — `Implemented` |
| Report | `report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 04:44 | Ready for DEV, 7 AC, po-expert Aligned, ba-expert sửa 6 điểm nhất quán |
| 2 | DEV | plan | `ssr-plan` | Passed | 07:41 | Ready for task-breakdown, schemaChangeRequired=false, chỉ chạm BudgetApp.tsx + globals.css |
| 3 | DEV | data | `ssr-data` | Skipped | 00:00 | không đổi cấu trúc dữ liệu — `MonthBudget.id` đã đủ |
| 4 | DEV | task | `ssr-breaker` | Passed | 01:34 | 4 task (TB-01..04), Ready, coverage đủ 7 AC |
| 5 | DEV | implement | `ssr-dev` | Passed | 18:41 | 4/4 task Done/Partial (TB-04: AC-05 gián tiếp qua code review); typecheck+build Passed |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 03:28 | Pass With Notes — 2 finding Medium/Low, không chặn |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 03:28 | typecheck+lint+build đều Passed |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | join=Pass With Notes, không cần fix round |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | Báo cáo này |

Kết quả join phase TEST: Pass With Notes

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | Sửa 6 điểm nhất quán nội bộ (nhãn "Chọn tháng xem" trong AC-02, mockup mục 8→8.2, liên kết AC-06/AC-07 vào EL-02/EL-03/EL-04, số AC ở mục 12/13) |
| `po-expert` | ba | Aligned |
| `swe-expert` | implement | Không dùng — `SSR_IMPLEMENT_EXECUTOR=codex`, giao Codex CLI (xem mục 4) |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-02` | Tách JSX 2 khối "Chọn tháng xem"/"Tạo tháng mới", đổi nhãn, wrapper CSS `.month-panels` | Done | `npx tsc --noEmit` 0 lỗi; DOM xác nhận 2 `article` tách biệt, đúng nhãn |
| `TB-01` | `buildMonthPeriods`/`pickDefaultPeriod`, combobox 13 kỳ với `disabled` | Done | DOM xác nhận đúng 13 option, 5/13 rồi 13/13 `disabled` đúng theo `months` |
| `TB-03` | Sửa `createNewMonth` rẽ nhánh `sourceMonthId` theo `cloneCurrent`, `try/catch`, `disabled` 2 nút | Done | 3 kịch bản thật (AC-02/AC-03/AC-07) khớp số liệu danh mục/ngân sách nguyên văn |
| `TB-04` | Verification tổng hợp + cập nhật DEV wiki | Partial | 6/7 AC Passed trực tiếp trên `next dev`; AC-05 xác nhận gián tiếp qua code (xem mục 7, F-01) |

Task thêm mới trong quá trình làm: Không có.

Triển khai qua **Codex CLI** (`SSR_IMPLEMENT_EXECUTOR=codex`): soạn brief tạm `.codex-brief.md` (đã xoá sau khi chạy), chạy `codex exec --yolo`, đối chiếu phạm vi bằng `git status --untracked-files=all` + md5 trước/sau — xác nhận chỉ 2 file đổi, `prisma/schema.prisma`/`docs/db/schema.dbml` không bị chạm. `ssr-dev` tự chạy lại toàn bộ verification (không dùng kết quả Codex tự báo).

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | `components/BudgetApp.tsx` (hàm `buildMonthPeriods`, `pickDefaultPeriod`, `MonthPeriod`; JSX 2 khối; sửa `createNewMonth`) |
| Source (style) | `app/globals.css` (thêm `.month-panels`; gỡ `.budget-tools` khỏi 2 grid rule) |
| Prisma / migration | Không có |
| DBML | Không có |
| Knowledge base | `docs/kb/dev/wiki/US-006-canh-bao-trung-thang.md`; `docs/kb/dev/00-index.md`; `docs/kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md`; `docs/kb/ba/wiki/knowledge/feature-summary/US-006-canh-bao-trung-thang.md`; `docs/kb/ba/wiki/delivery/pbi/US-006-canh-bao-trung-thang.md`; `docs/kb/ba/wiki/knowledge/business-rule/BR-014-canh-bao-trung-thang.md`; `docs/kb/ba/wiki/knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md` (mới); `docs/kb/ba/wiki/ingestion/source-record/US-006-canh-bao-trung-thang.md`; 4 index wiki + `wiki-health-report.md` |
| Memory | `docs/memory/decisions.md` (`DEC-063`..`DEC-065`); `docs/memory/judgement-log.md` (`JDG-012`, `JDG-013`) |
| Artifact feature | `docs/features/US-006-canh-bao-trung-thang/{spec.md,plan.md,task.md,report.md}`; `docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md` (status: Merged); `docs/requirements-index.md`; `docs/kb/ba/00-index.md` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — "No errors found" | 2026-08-10 |
| `rtk prisma validate` | Không áp dụng — không chạm schema | — |
| `rtk vitest run` | Không áp dụng — chưa có framework test (gap đã biết từ US-001), thay bằng thủ công đủ 7 AC | — |
| `rtk next lint` | Passed — Errors: 0, Warnings: 0 | 2026-08-10 |
| `rtk next build` | Passed — 1 route, Errors: 0, Warnings: 0 | 2026-08-10 |

## 7. Review Findings

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 0 | Medium | `task.md` TB-03/TB-04; `components/BudgetApp.tsx:422-435` | AC-05/EL-05 kiểm chứng bằng thao tác race 2 tab thật | Chỉ xác nhận gián tiếp qua rà soát code (pattern `try/catch` khớp `saveEditTransaction`; `create-month.ts` không đổi vẫn ném đúng "Tháng này đã tồn tại.") — hết kỳ tháng trống sau khi kiểm AC-04, "Reset dữ liệu" gặp lỗi có sẵn không liên quan (`JDG-013`) | Còn mở — follow-up mục 9, không chặn merge |
| F-02 | 0 | Low | `components/BudgetApp.tsx:108,214,310` | Spec mục 14 (A4) ghi "tháng hiện tại" tính theo đồng hồ hệ thống **máy chủ** | `buildMonthPeriods(new Date(), ...)` chạy trong Client Component → dùng đồng hồ **trình duyệt**; không có implementation nào khác trong repo (US-011 chưa triển khai) để đối chiếu | Còn mở — ghi nhận cho US-011 sau này, không chặn |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | DOM: đúng 13 option, 5/13 `disabled` khớp `months` hiện có, mặc định "2026-09" |
| AC-02 | Đạt | Tạo "2026-09" với 8 danh mục mặc định (tổng 36.000.000đ = đúng `defaultCategories`); "Chọn tháng xem" có thêm lựa chọn |
| AC-03 | Đạt | "2026-10" sao chép đúng 5 danh mục (tên+ngân sách nguyên văn) từ "2026-08", loại trừ danh mục fallback, thu nhập mặc định |
| AC-04 | Đạt | Lấp đủ 13/13 kỳ → `newMonth=""`, 2 nút `disabled=true`, hiện "Không còn kỳ tháng trống" |
| AC-05 | Không kiểm được trực tiếp | Xem F-01 — xác nhận gián tiếp qua code, logic đúng nhưng chưa live-test |
| AC-06 | Đạt | 2 `article` tách biệt trong `.month-panels`, nhãn "Chọn tháng xem" đúng |
| AC-07 | Đạt | "Tạo tháng" trên tháng có danh mục tùy chỉnh vẫn ra đúng bộ mặc định, không mang theo tùy chỉnh |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-01` | Có | `BudgetApp.tsx:675-684` — nhãn "Chọn tháng xem", giữ nguyên tập giá trị/hành vi |
| `EL-02` | Có | `BudgetApp.tsx:690-701` — combobox 13 kỳ, `disabled` + "(Đã có dữ liệu)", mặc định qua `pickDefaultPeriod` |
| `EL-03` | Có | `BudgetApp.tsx:705-708` — `disabled={!newMonth}`, không kèm `sourceMonthId` |
| `EL-04` | Có | `BudgetApp.tsx:709-712` — nhãn "Clone tháng đang xem", kèm `sourceMonthId` |
| `EL-05` | Có (chưa live-trigger) | Code path đúng (`catch` → `setToastMessage` → `Toast` có sẵn), xem F-01 |

## 8. Fix Rounds

Không có vòng fix nào — join phase TEST = `Pass With Notes`, không đạt điều kiện chạy `ssr-fix`.

Số vòng đã dùng: 0/2

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | AC-05 (thông báo lỗi khi tạo trùng tháng đồng thời) chưa được live-test bằng race 2 tab thật | Rủi ro | Verify lại thủ công khi có dữ liệu test sạch (sau khi follow-up #2 được sửa) — mở 2 tab, tạo cùng kỳ tháng gần như đồng thời, xác nhận toast "Tháng này đã tồn tại." |
| 2 | Nút "Reset dữ liệu" (`resetAllBudgetData`) báo lỗi 500 (`PrismaClientKnownRequestError` — vi phạm khóa ngoại) — bug có sẵn, không do US-006 gây ra | Nợ kỹ thuật | Đã tách task riêng qua `spawn_task` (task_id `task_57582784`, title "Fix FK violation in resetAllBudgetData"); ghi tại `docs/memory/judgement-log.md#jdg-013` |
| 3 | "Tháng hiện tại" trong `buildMonthPeriods` tính theo đồng hồ trình duyệt (client), không phải server như spec A4 giả định | Rủi ro thấp | Không cần sửa ngay (single-user, rủi ro thấp) — khi US-011 (mini dashboard nhiều tháng) triển khai, thống nhất một nguồn tính "tháng hiện tại" cho toàn dự án |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git checkout -- components/BudgetApp.tsx app/globals.css` (cả hai hiện chưa commit — có thể revert trực tiếp về trạng thái trước khi chạy pipeline này) |
| Migration SQLite | Không áp dụng — không có migration mới |
| Dữ liệu đã backfill | Không áp dụng — không backfill dữ liệu nào. Dữ liệu test đã tạo trong lúc kiểm chứng (các tháng 2026-02..2027-02) nằm trong `prisma/dev.db` cục bộ, không ảnh hưởng production |
