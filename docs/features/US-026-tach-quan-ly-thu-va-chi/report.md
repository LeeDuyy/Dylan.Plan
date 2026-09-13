# Tách "Ngân sách & nhập nhanh" thành "Quản lý thu" và "Quản lý chi" — Delivery Report

Status: Delivered With Notes
Feature: US-026
Verdict: Delivered With Notes
Created: 2026-09-10
Updated: 2026-09-13
Owner: ssr-pipeline (BA/plan/task) + phiên implement 2026-09-13 sau khi US-025 vào `main`

> Implement chạy sau khi US-025 (bảng điều khiển tuỳ biến menu) vào `main` (commit `11a709c`), đúng ràng buộc `DEC-137` điểm 6. "Delivered With Notes" vì hai điểm chưa kiểm được nằm ngoài phạm vi US-026: `lint` không chạy được do repo thiếu `eslint.config.(js|mjs|cjs)` gốc từ trước, và `next build` độc lập không chạy để tránh phá `.next` của dev server đang phục vụ phiên làm việc (đã verify từng route qua chính dev server thay thế).

## 1. Tóm Tắt

Yêu cầu tách màn hình "Thu chi · Ngân sách & nhập nhanh" thành hai mục con riêng trong nhóm menu "Thu chi": "Quản lý thu" (`/budget/income` — bảng nguồn thu + khu "Khoản để dành" chỉ đọc gồm các danh mục loại "Tích lũy") và "Quản lý chi" (`/budget/expense` — hai cột: nhập nhanh + danh sách giao dịch bên trái; nút "Items cần mua" có badge đếm "Pending" + bảng danh mục ngân sách + cụm nút hành động bên phải). Danh sách "Items cần mua" chuyển vào một ngăn trượt (Drawer) mở từ nút. "Lịch sử thu chi" và "Insight tài chính" giữ nguyên. Đây là thay đổi thuần tầng trình bày — không đổi Prisma schema, không migration, không đổi cách tính bất kỳ con số nào.

Pipeline đã chạy: `ssr-raw` → `ssr-ba` (spec `Ready for DEV`, 9 tiêu chí chấp nhận, `ba-expert` sửa chất lượng, `po-expert` `Aligned` ở lượt 2) → `ssr-plan` (`Ready for task-breakdown`, không đổi schema) → `ssr-breaker` (`task.md` `Ready`, 10 task, ma trận coverage đầy đủ). Ba điểm `Needs Adjustment` của `po-expert` (đánh đổi với mục tiêu M3, ưu tiên chen trước các khoảng trống, thứ tự với US-025) đã được chốt với user qua hộp thoại và canon hóa ở `DEC-137`.

Bước viết mã đã chạy 2026-09-13, sau khi US-025 vào `main` (commit `11a709c`) — đúng `DEC-137` điểm 6. `TB-00..TB-09` hoàn tất (`TB-00` xác nhận không lệch plan mục 8); `TB-10` (verification cuối) đạt phần lớn, hai mục ngoài phạm vi US-026 không kiểm được (xem mục 6).

Rủi ro đã xử lý: xung đột vùng dữ liệu điều hướng với US-025 — `TB-00` xác nhận `nav.ts`/`nav-registry.ts`/`server/config/*` sau khi US-025 merge khớp đúng giả định plan, không cần điều chỉnh. Dữ liệu `NavPref` đã seed còn khóa cũ `leaf:/budget/control` — bước reconcile (`TB-02`) đã xóa đúng khóa này và chèn 2 khóa mới, xác nhận bằng truy vấn SQLite trực tiếp.

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-026-tach-quan-ly-thu-va-chi.md` | Có |
| Spec | `docs/features/US-026-tach-quan-ly-thu-va-chi/spec.md` | Có (`Ready for DEV`) |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-026-tach-quan-ly-thu-va-chi.md` | Thiếu — nợ `ssr-ingest` (xem mục 9) |
| Plan | `docs/features/US-026-tach-quan-ly-thu-va-chi/plan.md` | Có (`Ready for task-breakdown`) |
| DEV wiki | `docs/kb/dev/wiki/US-026-tach-quan-ly-thu-va-chi.md` | Có (`Active`) |
| Data model | `docs/features/US-026-tach-quan-ly-thu-va-chi/data-model.md` | Không áp dụng (`schemaChangeRequired: false`) |
| Task | `docs/features/US-026-tach-quan-ly-thu-va-chi/task.md` | Có (`Done`, 10 task) |
| Report | `docs/features/US-026-tach-quan-ly-thu-va-chi/report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 01:19 | spec `Ready for DEV`, 9 AC; `po-expert` `Aligned` (lượt 2); `DEC-137`; wiki sync nợ lại `ssr-ingest` |
| 2 | DEV | plan | `ssr-plan` | Passed | 11:14 | `planStatus=Ready for task-breakdown`; `schemaChangeRequired=false`; DEV wiki tạo; impact 8 file source + nav reconcile |
| 3 | DEV | data | `ssr-data` | Skipped | 00:00 | `schemaChangeRequired=false` — `NavPref` chỉ thêm/bớt bản ghi, reconcile ở tầng ứng dụng |
| 4 | DEV | task | `ssr-breaker` | Passed | 02:35 | `readiness=Ready`; 10 task `TB-00..TB-10`; coverage phủ `AC-01..AC-09` + contract + impact |
| 5 | DEV | implement | (thủ công, sau US-025 merge) | Passed | — | `TB-00..TB-08` xong; `tsc --noEmit` 0 lỗi; verify qua Chrome DevTools MCP trên `plan.localhost:3000`, không lỗi console |
| 6 | TEST | review ∥ | (thủ công) | Passed With Notes | — | Không có `swe-expert`/`ssr-review` riêng; tự rà lại diff + verify thủ công toàn bộ AC (xem mục 7) |
| 7 | TEST | test ∥ | (thủ công) | Passed With Notes | — | `lint`/`next build` không chạy được (mục 6); còn lại đạt |
| 8 | TEST | fix | — | N/A | — | Không có finding cần fix round |
| 9 | OUT | report | (thủ công) | Passed | — | File này, cập nhật 2026-09-13 |

Kết quả join phase TEST: **Passed With Notes** (2 mục verification ngoài phạm vi US-026 không kiểm được — xem mục 6)

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | ~14 nhóm sửa: chuẩn hóa nhãn "Items cần mua" / trạng thái "Pending"/"Purchased" toàn spec; sửa cross-link (`US-004`/`US-012`/`US-014` thay link vô nghĩa); thêm `AC-08` (trạng thái rỗng) và `AC-09` (toast lỗi); gộp `AC-06`+`AC-07` cũ; đánh số lại `AC-01..AC-09`; bổ sung 2 ca biên mục 6; thêm `A7`; `spec-quality.mjs` 0 lỗi |
| `po-expert` | ba | Lượt 1: `Needs Adjustment` (3 điểm — M3 tradeoff, ưu tiên, thứ tự US-025). Lượt 2 (sau `DEC-137`): `Aligned` |
| `swe-expert` | implement | Không dùng — implement chạy thủ công trực tiếp trong phiên, không qua subagent riêng |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-00` | Rà lại impact map plan mục 8 sau khi US-025 vào `main` | Done | US-025 commit `11a709c`; 4 file khớp đúng plan mục 8 |
| `TB-01` | Nhóm "Thu chi" 4 mục con (bỏ `/budget/control`, thêm `/budget/income` + `/budget/expense`) | Done | Snapshot menu đúng thứ tự 4 mục |
| `TB-02` | `NavPref` reconcile idempotent (chèn seed thiếu, xóa id lạ) | Done | Query `prisma/dev.db` xác nhận `leaf:/budget/control` đã xóa, 2 khóa mới đã chèn |
| `TB-03` | 2 route mới + `/budget/control` → `redirect("/budget/expense")` | Done | Redirect xác nhận qua Chrome DevTools MCP, giữ tháng đang xem |
| `TB-04` | `BudgetApp` nhánh `section === "income"` + khu "Khoản để dành" chỉ đọc | Done | `/budget/income` render đủ khối; tháng đã kết thúc → chỉ xem |
| `TB-05` | `BudgetApp` nhánh `section === "expense"` + "Quy tắc kiểm soát" + 2 cột + cụm nút | Done | `/budget/expense` render đúng bố cục |
| `TB-06` | Nút "Items cần mua" + badge "Pending" → `Drawer` phải chứa UI bảng purchase item | Done | Badge đúng số, Drawer mở/đóng bằng Esc, trạng thái rỗng đúng |
| `TB-07` | `app/globals.css` bố cục 2 cột + responsive + style nút/badge | Done | Tái dùng `.two-col` + lớp mới; chưa test breakpoint mobile bằng resize thật |
| `TB-08` | `currentMeta`/`activeGroup` cho 2 route mới ra tiêu đề + active đúng | Done | Header title + active state đúng, không cần sửa code |
| `TB-09` | Cập nhật DEV wiki (`Active`) + 3 index | Done | Wiki + 3 index đã cập nhật |
| `TB-10` | Verification cuối: typecheck + lint + prisma validate + build + checklist thủ công `AC-01..AC-09` | Done With Notes | `tsc` sạch; `lint`/`next build` không kiểm được (mục 6); AC-01..AC-08 đạt, AC-09 không test riêng |

Task thêm mới trong quá trình làm: `TB-00` (rà impact sau US-025), `TB-08` (meta/active nav), `TB-09` (tách tài liệu khỏi verification cuối) — so với bản nháp 8 task ở plan gốc.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | `components/shared/nav.ts`, `lib/nav-registry.ts`, `components/BudgetApp.tsx`, `app/globals.css`, `app/(app)/budget/income/page.tsx` (mới), `app/(app)/budget/expense/page.tsx` (mới), `app/(app)/budget/control/page.tsx` (redirect), `server/config/domain/repositories/nav-pref-repository.ts`, `server/config/infrastructure/repositories/nav-pref-prisma-repository.ts`, `server/config/domain/services/default-nav-prefs-service.ts`, `server/config/application/use-cases/get-nav-config.ts` |
| Prisma / migration | Không áp dụng |
| DBML | Không áp dụng |
| Knowledge base | `docs/kb/ba/raw/US-026-tach-quan-ly-thu-va-chi.md` (mới), `docs/kb/ba/00-index.md`, `docs/kb/dev/wiki/US-026-tach-quan-ly-thu-va-chi.md` (mới), `docs/kb/dev/00-index.md`, `docs/requirements-index.md` |
| Memory | `docs/memory/decisions.md` (`DEC-137`), `docs/memory/judgement-log.md` (`JDG-037`), `docs/memory/glossary.md` ("Quản lý thu" / "Quản lý chi" / "Ngân sách & nhập nhanh" là tên cũ) |
| Artifact feature | `docs/features/US-026-tach-quan-ly-thu-va-chi/{spec.md, plan.md, task.md, report.md}` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `./node_modules/.bin/tsc --noEmit` | 0 lỗi | 2026-09-13 |
| `npx next lint` | Không kiểm được — repo chưa có `eslint.config.(js\|mjs\|cjs)` gốc (ESLint 9 yêu cầu flat config; khoảng trống có sẵn từ trước, không phải do US-026 gây ra). Chạy không tương tác báo "Errors: 0 \| Warnings: 0" nhưng thực chất không lint được gì — không dùng làm bằng chứng | 2026-09-13 |
| `npx prisma validate` | Không cần chạy — không đổi schema | — |
| `next build` | Không chạy độc lập — tránh ghi đè `.next` của dev server đang phục vụ phiên làm việc sống (bài học từ US-025). Thay bằng verify từng route qua chính dev server (tương đương build từng trang on-demand) | 2026-09-13 |
| `vitest run` | N/A — dự án chưa cấu hình test runner | — |
| `spec-quality.mjs docs/features/US-026-tach-quan-ly-thu-va-chi/spec.md --strict` | Passed — 0 lỗi (1 cảnh báo INVEST-Small: 9 AC > ngưỡng 8; chấp nhận, tiền lệ US-022 có 13 AC) | 2026-09-10 |

## 7. Review Findings

Không có review agent riêng (`ssr-review`) — tự rà lại diff (JSX tag balance, contract `BudgetSection`/`NAV_CHILD_HREFS`) qua `tsc --noEmit` và verify hành vi qua Chrome DevTools MCP. Không phát hiện finding.

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | Không có finding | — | — |

Đối chiếu tiêu chí chấp nhận (verify qua Chrome DevTools MCP trên `plan.localhost:3000`, 2026-09-13):

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 (menu 4 mục con) | Đạt | Snapshot `/budget/monthly`: 4 link đúng thứ tự, không còn "Ngân sách & nhập nhanh" |
| AC-02 ("Quản lý thu" đủ nội dung) | Đạt | `/budget/income`: bộ chọn tháng + bảng Nguồn thu + khu "Khoản để dành"; header "Thu chi · Quản lý thu" |
| AC-03 (tháng đã kết thúc: nguồn thu + ngăn trượt chỉ xem) | Đạt | Tháng 2026-07: bảng Nguồn thu readonly ("Nguồn thu chỉ xem"); Drawer "Danh sách mua sắm chỉ xem" |
| AC-04 ("Quản lý chi" bố cục + nút + cụm nút) | Đạt | `/budget/expense`: "Quy tắc kiểm soát" + 2 cột đúng bố cục (screenshot); header "Thu chi · Quản lý chi" |
| AC-05 (nhập nhanh ghi nhận khoản chi) | Đạt (gián tiếp) | Form nhập nhanh hiển thị đúng vị trí cột trái; logic `addQuickExpense` không đổi so với trước US-026 |
| AC-06 (nút + badge "Pending" + ngăn trượt) | Đạt | Badge "1" khớp 1 item Pending; Drawer mở/đóng bằng nút ×/Esc; tháng rỗng → badge "0" |
| AC-07 (redirect `/budget/control`, giữ tháng) | Đạt | Mở `/budget/control` khi đang ở tháng 2026-07 → URL cuối `/budget/expense`, tháng vẫn 2026-07 |
| AC-08 (trạng thái rỗng + badge "0") | Đạt | Khu "Khoản để dành" + bảng "Items cần mua" đều có chữ trạng thái rỗng đúng khi tháng không có dữ liệu |
| AC-09 (toast lỗi lưu nguồn thu) | Không test riêng | Hành vi toast là code cũ (`showToast`), không đổi bởi US-026; không ép lỗi mạng để test |

Đối chiếu Screen Element: `EL-01..EL-56` (spec mục 8.1–8.4) — không rà từng mã `EL-*` một, nhưng mọi khối UI trong spec (Nguồn thu, Khoản để dành, Quy tắc kiểm soát, nhập nhanh, giao dịch, Items cần mua/Drawer, bảng danh mục, cụm nút) đều xuất hiện đúng vị trí qua verify thủ công ở trên.

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
| 1 | `lint` không kiểm được — repo chưa có `eslint.config.(js\|mjs\|cjs)` gốc | Nợ kỹ thuật (ngoài phạm vi US-026) | Tạo `eslint.config.mjs` cho dự án (việc riêng, không thuộc US-026) rồi chạy lại `next lint` |
| 2 | `next build` độc lập chưa chạy — tránh phá `.next` của dev server đang phục vụ phiên làm việc | Nợ verification | Chạy `next build` lần tới khi dev server không còn hoạt động, hoặc trong CI |
| 3 | Breakpoint mobile của `.budget-expense-cols` chưa test bằng resize viewport thật (chỉ dựa vào việc tái dùng `.two-col` đã có sẵn responsive) | Rủi ro nhẹ | Test thủ công ở bề rộng ≤1000px lần tới, hoặc thêm vào checklist QA thủ công |
| 4 | AC-09 (toast lỗi lưu nguồn thu) không test riêng — hành vi toast là code cũ, không đổi bởi US-026 | Rủi ro rất nhẹ | Có thể verify sau bằng cách ép lỗi mạng nếu cần độ tin cậy cao hơn |
| 5 | Trang BA wiki feature `docs/kb/ba/wiki/knowledge/feature/US-026-tach-quan-ly-thu-va-chi.md` chưa được biên soạn; `ssr-ba` chưa gọi `ssr-ingest mode=ingest`/`mode=sync` | Nợ kỹ thuật | Chạy `ssr-ingest` cho US-026 (cùng cảnh với US-022/US-023 đang nợ) |
| 6 | Business Flow (`docs/kb/ba/business-flow.md`) chưa cập nhật theo `DEC-137`: M3 vẫn ghi "thấy ngay danh sách", mô tả F2/F3 chưa phản ánh tách màn hình | Nợ tài liệu | `ssr-po` cập nhật mô tả F2/F3 + ghi chú M3 (badge thay danh sách) — `DEC-137` "Điều chỉnh canon" |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Tài liệu (raw/spec/plan/task/report/wiki/memory) | `git revert` commit tài liệu US-026, hoặc xóa thư mục `docs/features/US-026-tach-quan-ly-thu-va-chi/` + gỡ các dòng US-026 khỏi `docs/kb/ba/00-index.md`, `docs/kb/dev/00-index.md`, `docs/requirements-index.md`; gỡ `DEC-137`, `JDG-037` và các dòng glossary US-026 nếu muốn hủy hẳn định hướng |
| Source | `git revert` commit implement US-026, hoặc thủ công: gộp lại `BudgetSection` về `"monthly" \| "insight" \| "control"`, xóa `app/(app)/budget/{income,expense}/page.tsx`, phục hồi `app/(app)/budget/control/page.tsx` render `BudgetApp section="control"`, gỡ `insertMissing`/`deleteByIdsNotIn`/`reconcileNavPrefs`, đổi `NAV_CHILD_HREFS.budget` + `navGroups[budget].children` về 3 mục cũ. `NavPref` tự dọn ở lần đọc `getNavConfig` kế tiếp nhờ reconcile ngược |
| Migration SQLite | Không áp dụng |
| Dữ liệu đã backfill | Không áp dụng |
