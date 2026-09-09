# Tách "Ngân sách & nhập nhanh" thành "Quản lý thu" và "Quản lý chi" — Delivery Report

Status: Blocked
Feature: US-026
Verdict: Blocked
Created: 2026-09-10
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> "Blocked" ở đây là **dừng có chủ đích theo quyết định `DEC-137`**, không phải thất bại kỹ thuật: toàn bộ phase BA và phần lập kế hoạch + phân rã task đã hoàn tất và đạt chuẩn; chỉ riêng bước viết mã được hoãn tới khi yêu cầu US-025 vào nhánh `main`.

## 1. Tóm Tắt

Yêu cầu tách màn hình "Thu chi · Ngân sách & nhập nhanh" thành hai mục con riêng trong nhóm menu "Thu chi": "Quản lý thu" (`/budget/income` — bảng nguồn thu + khu "Khoản để dành" chỉ đọc gồm các danh mục loại "Tích lũy") và "Quản lý chi" (`/budget/expense` — hai cột: nhập nhanh + danh sách giao dịch bên trái; nút "Items cần mua" có badge đếm "Pending" + bảng danh mục ngân sách + cụm nút hành động bên phải). Danh sách "Items cần mua" chuyển vào một ngăn trượt (Drawer) mở từ nút. "Lịch sử thu chi" và "Insight tài chính" giữ nguyên. Đây là thay đổi thuần tầng trình bày — không đổi Prisma schema, không migration, không đổi cách tính bất kỳ con số nào.

Pipeline đã chạy: `ssr-raw` → `ssr-ba` (spec `Ready for DEV`, 9 tiêu chí chấp nhận, `ba-expert` sửa chất lượng, `po-expert` `Aligned` ở lượt 2) → `ssr-plan` (`Ready for task-breakdown`, không đổi schema) → `ssr-breaker` (`task.md` `Ready`, 10 task, ma trận coverage đầy đủ). Ba điểm `Needs Adjustment` của `po-expert` (đánh đổi với mục tiêu M3, ưu tiên chen trước các khoảng trống, thứ tự với US-025) đã được chốt với user qua hộp thoại và canon hóa ở `DEC-137`.

Bước viết mã **chưa chạy**: `DEC-137` điểm 6 — user chốt code US-026 chỉ bắt đầu sau khi yêu cầu US-025 (bảng điều khiển tùy biến menu, đang làm dở, chạm cùng `components/shared/nav.ts` + `lib/nav-registry.ts` + `server/config/*`) vào `main`. `task.md` để trạng thái `Ready`, sẵn sàng giao cho `ssr-dev` ngay khi điều kiện đó đạt.

Rủi ro còn lại: xung đột vùng dữ liệu điều hướng với US-025 (giảm thiểu bằng chính ràng buộc thứ tự này + task `TB-00` rà lại impact map sau khi US-025 merge); dữ liệu `NavPref` đã seed trên máy đang chạy còn khóa cũ `leaf:/budget/control` (giảm thiểu bằng bước reconcile idempotent ở tầng ứng dụng, task `TB-02`).

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-026-tach-quan-ly-thu-va-chi.md` | Có |
| Spec | `docs/features/US-026-tach-quan-ly-thu-va-chi/spec.md` | Có (`Ready for DEV`) |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-026-tach-quan-ly-thu-va-chi.md` | Thiếu — nợ `ssr-ingest` (xem mục 9) |
| Plan | `docs/features/US-026-tach-quan-ly-thu-va-chi/plan.md` | Có (`Ready for task-breakdown`) |
| DEV wiki | `docs/kb/dev/wiki/US-026-tach-quan-ly-thu-va-chi.md` | Có (`Draft` — chuyển `Active` sau implement, task `TB-09`) |
| Data model | `docs/features/US-026-tach-quan-ly-thu-va-chi/data-model.md` | Không áp dụng (`schemaChangeRequired: false`) |
| Task | `docs/features/US-026-tach-quan-ly-thu-va-chi/task.md` | Có (`Ready`, 10 task) |
| Report | `docs/features/US-026-tach-quan-ly-thu-va-chi/report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 01:19 | spec `Ready for DEV`, 9 AC; `po-expert` `Aligned` (lượt 2); `DEC-137`; wiki sync nợ lại `ssr-ingest` |
| 2 | DEV | plan | `ssr-plan` | Passed | 11:14 | `planStatus=Ready for task-breakdown`; `schemaChangeRequired=false`; DEV wiki tạo; impact 8 file source + nav reconcile |
| 3 | DEV | data | `ssr-data` | Skipped | 00:00 | `schemaChangeRequired=false` — `NavPref` chỉ thêm/bớt bản ghi, reconcile ở tầng ứng dụng |
| 4 | DEV | task | `ssr-breaker` | Passed | 02:35 | `readiness=Ready`; 10 task `TB-00..TB-10`; coverage phủ `AC-01..AC-09` + contract + impact |
| 5 | DEV | implement | `ssr-dev` | Blocked | 00:00 | `DEC-137` điểm 6: code US-026 chờ US-025 vào `main`. `task.md` `Ready` sẵn sàng giao. Pipeline không chạy `ssr-dev` lượt này |
| 6 | TEST | review ∥ | `ssr-review` | Skipped | 00:00 | Chưa có code để review — implement đang chờ US-025 |
| 7 | TEST | test ∥ | `ssr-pipeline` | Skipped | 00:00 | Chưa có code để test |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | Không có finding — chưa implement |
| 9 | OUT | report | `ssr-pipeline` | Passed | 00:20 | File này |

Kết quả join phase TEST: **Blocked** (không chạy — implement bị hoãn theo `DEC-137`)

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | ~14 nhóm sửa: chuẩn hóa nhãn "Items cần mua" / trạng thái "Pending"/"Purchased" toàn spec; sửa cross-link (`US-004`/`US-012`/`US-014` thay link vô nghĩa); thêm `AC-08` (trạng thái rỗng) và `AC-09` (toast lỗi); gộp `AC-06`+`AC-07` cũ; đánh số lại `AC-01..AC-09`; bổ sung 2 ca biên mục 6; thêm `A7`; `spec-quality.mjs` 0 lỗi |
| `po-expert` | ba | Lượt 1: `Needs Adjustment` (3 điểm — M3 tradeoff, ưu tiên, thứ tự US-025). Lượt 2 (sau `DEC-137`): `Aligned` |
| `swe-expert` | implement | Không dùng — stage implement chưa chạy |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-00` | Rà lại impact map plan mục 8 sau khi US-025 vào `main` | Pending | Chờ US-025 merge |
| `TB-01` | Nhóm "Thu chi" 4 mục con (bỏ `/budget/control`, thêm `/budget/income` + `/budget/expense`) | Pending | — |
| `TB-02` | `NavPref` reconcile idempotent (chèn seed thiếu, xóa id lạ) | Pending | — |
| `TB-03` | 2 route mới + `/budget/control` → `redirect("/budget/expense")` | Pending | — |
| `TB-04` | `BudgetApp` nhánh `section === "income"` + khu "Khoản để dành" chỉ đọc | Pending | — |
| `TB-05` | `BudgetApp` nhánh `section === "expense"` + "Quy tắc kiểm soát" + 2 cột + cụm nút | Pending | — |
| `TB-06` | Nút "Items cần mua" + badge "Pending" → `Drawer` phải chứa UI bảng purchase item | Pending | — |
| `TB-07` | `app/globals.css` bố cục 2 cột + responsive + style nút/badge | Pending | — |
| `TB-08` | `currentMeta`/`activeGroup` cho 2 route mới ra tiêu đề + active đúng | Pending | — |
| `TB-09` | Cập nhật DEV wiki (`Active`) + 3 index | Pending | — |
| `TB-10` | Verification cuối: typecheck + lint + prisma validate + build + checklist thủ công `AC-01..AC-09` | Pending | — |

Task thêm mới trong quá trình làm: `TB-00` (rà impact sau US-025), `TB-08` (meta/active nav), `TB-09` (tách tài liệu khỏi verification cuối) — so với bản nháp 8 task ở plan gốc.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | Chưa có — implement chưa chạy. Danh sách file dự kiến: `components/shared/nav.ts`, `lib/nav-registry.ts`, `components/BudgetApp.tsx`, `app/globals.css`, `app/(app)/budget/income/page.tsx` (mới), `app/(app)/budget/expense/page.tsx` (mới), `app/(app)/budget/control/page.tsx`, `server/config/domain/repositories/nav-pref-repository.ts`, `server/config/infrastructure/repositories/nav-pref-prisma-repository.ts`, `server/config/domain/services/default-nav-prefs-service.ts`, `server/config/application/use-cases/get-nav-config.ts` (plan mục 11) |
| Prisma / migration | Không áp dụng |
| DBML | Không áp dụng |
| Knowledge base | `docs/kb/ba/raw/US-026-tach-quan-ly-thu-va-chi.md` (mới), `docs/kb/ba/00-index.md`, `docs/kb/dev/wiki/US-026-tach-quan-ly-thu-va-chi.md` (mới), `docs/kb/dev/00-index.md`, `docs/requirements-index.md` |
| Memory | `docs/memory/decisions.md` (`DEC-137`), `docs/memory/judgement-log.md` (`JDG-037`), `docs/memory/glossary.md` ("Quản lý thu" / "Quản lý chi" / "Ngân sách & nhập nhanh" là tên cũ) |
| Artifact feature | `docs/features/US-026-tach-quan-ly-thu-va-chi/{spec.md, plan.md, task.md, report.md}` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Chưa chạy — implement bị hoãn | — |
| `rtk npx prisma validate` | Chưa chạy | — |
| `rtk vitest run` | N/A — dự án chưa cấu hình test runner (`package.json` không có script `test`, không có `vitest`) | — |
| `rtk next build` | Chưa chạy | — |
| `spec-quality.mjs docs/features/US-026-tach-quan-ly-thu-va-chi/spec.md --strict` | Passed — 0 lỗi (1 cảnh báo INVEST-Small: 9 AC > ngưỡng 8; chấp nhận, tiền lệ US-022 có 13 AC) | 2026-09-10 |

## 7. Review Findings

Chưa có vòng review nào (implement chưa chạy).

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | Không có finding — chưa có code | — | — |

Đối chiếu tiêu chí chấp nhận (kế hoạch kiểm chứng — chưa thực thi):

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 (menu 4 mục con) | Chưa kiểm được | Kế hoạch: `TB-01`+`TB-02`, thủ công 1 |
| AC-02 ("Quản lý thu" đủ nội dung) | Chưa kiểm được | Kế hoạch: `TB-03`/`TB-04`/`TB-08`, thủ công 2 |
| AC-03 (tháng đã kết thúc: nguồn thu + ngăn trượt chỉ xem) | Chưa kiểm được | Kế hoạch: `TB-04`/`TB-06`, thủ công 6 |
| AC-04 ("Quản lý chi" bố cục + nút + cụm nút) | Chưa kiểm được | Kế hoạch: `TB-03`/`TB-05`/`TB-07`/`TB-08`, thủ công 3 |
| AC-05 (nhập nhanh ghi nhận khoản chi) | Chưa kiểm được | Kế hoạch: `TB-05` |
| AC-06 (nút + badge "Pending" + ngăn trượt) | Chưa kiểm được | Kế hoạch: `TB-06`, thủ công 4 |
| AC-07 (redirect `/budget/control`, giữ tháng) | Chưa kiểm được | Kế hoạch: `TB-03`, thủ công 5 |
| AC-08 (trạng thái rỗng + badge "0") | Chưa kiểm được | Kế hoạch: `TB-04`/`TB-06` |
| AC-09 (toast lỗi lưu nguồn thu) | Chưa kiểm được | Kế hoạch: `TB-04` |

Đối chiếu Screen Element: `EL-01..EL-56` (spec mục 8.1–8.4) — chưa hiện thực; `ssr-review` đối chiếu ở lượt chạy sau implement.

## 8. Fix Rounds

Không có vòng fix nào.

| Vòng | Finding nhận | Nguyên nhân gốc | Thay đổi | Verification |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |

Finding bị từ chối: Không có.

Số vòng đã dùng: 0/2

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | Code US-026 chờ yêu cầu US-025 (bảng điều khiển tùy biến menu) vào `main` — hai bên cùng sửa `components/shared/nav.ts`, `lib/nav-registry.ts`, `server/config/*` | Blocker (có chủ đích — `DEC-137` điểm 6) | Khi US-025 merge: chạy `TB-00` (rà impact map) rồi giao `task.md` cho `ssr-dev` chạy `TB-01..TB-10` |
| 2 | Trang BA wiki feature `docs/kb/ba/wiki/knowledge/feature/US-026-tach-quan-ly-thu-va-chi.md` chưa được biên soạn; `ssr-ba` chưa gọi `ssr-ingest mode=ingest`/`mode=sync` | Nợ kỹ thuật | Chạy `ssr-ingest` cho US-026 (cùng cảnh với US-022/US-023 đang nợ). Không chặn implement |
| 3 | Business Flow (`docs/kb/ba/business-flow.md`) chưa cập nhật theo `DEC-137`: M3 vẫn ghi "thấy ngay danh sách", mô tả F2/F3 chưa phản ánh tách màn hình | Nợ tài liệu | `ssr-po` cập nhật mô tả F2/F3 + ghi chú M3 (badge thay danh sách) — `DEC-137` "Điều chỉnh canon" |
| 4 | Spec có 9 AC (> ngưỡng INVEST-Small 8) | Rủi ro nhẹ | Chấp nhận — tiền lệ US-022 (13 AC); nếu implement thấy quá tải có thể tách "Quản lý chi + Drawer" thành US con |
| 5 | `NavPref` đã seed trên máy đang chạy còn khóa `leaf:/budget/control`; nếu bước reconcile (`TB-02`) lỗi, 2 mục mới nhận thứ tự/hiển thị mặc định thay vì giá trị user chỉnh | Rủi ro | `applyNavPrefs` đã tолерantе pref orphan; có nút "Reset nav" (US-025) khôi phục seed chuẩn; `TB-02` yêu cầu kiểm idempotent |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Tài liệu (raw/spec/plan/task/report/wiki/memory) | `git revert` commit tài liệu US-026, hoặc xóa thư mục `docs/features/US-026-tach-quan-ly-thu-va-chi/` + gỡ các dòng US-026 khỏi `docs/kb/ba/00-index.md`, `docs/kb/dev/00-index.md`, `docs/requirements-index.md`; gỡ `DEC-137`, `JDG-037` và các dòng glossary US-026 nếu muốn hủy hẳn định hướng |
| Source | Chưa có — không cần rollback |
| Migration SQLite | Không áp dụng |
| Dữ liệu đã backfill | Không áp dụng |
