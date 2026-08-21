# Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục — Delivery Report

Status: Delivered
Feature: US-014
Verdict: Pass
Created: 2026-08-10
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

Danh mục "Chi tiêu khác" (khi đang hiển thị — còn giao dịch gán vào nó) giờ luôn nằm ở vị trí cuối cùng trong danh sách danh mục, bất kể thời điểm nó được tạo ra. Áp dụng nhất quán ở cả 3 nơi dùng chung một danh sách: bảng ngân sách, dropdown "Danh mục nhận diện" khi nhập nhanh, và biểu đồ "Cơ cấu chi tiêu". Các danh mục khác giữ nguyên thứ tự tương đối. Toàn bộ thay đổi nằm gọn trong đúng một hàm (`visibleCategories`) ở `components/BudgetApp.tsx`, không chạm server/schema. Cả 5 AC đã kiểm chứng trực tiếp trên `next dev`, kèm bằng chứng before/after rõ ràng (tháng test có sẵn dữ liệu cho thấy "Chi tiêu khác" từng ở vị trí giữa bảng trước khi sửa, nay luôn ở cuối). Không có finding nào — verdict `Pass` tuyệt đối.

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md` | Có |
| Spec | `spec.md` | Có — `Ready for DEV`, 5 AC |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md` | Có |
| Plan | `plan.md` | Có — `Implemented` |
| DEV wiki | `docs/kb/dev/wiki/US-014-chi-tieu-khac-cuoi-bang.md` | Có |
| Data model | `data-model.md` | Không áp dụng — không đổi schema |
| Task | `task.md` | Có — `Implemented` |
| Report | `report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 02:51 | Ready for DEV, 5 AC, po-expert Aligned (sau khi user chốt thứ tự ưu tiên qua `DEC-067`) |
| 2 | DEV | plan | `ssr-plan` | Passed | 02:21 | Ready for task-breakdown, schemaChangeRequired=false, chỉ chạm `BudgetApp.tsx` |
| 3 | DEV | data | `ssr-data` | Skipped | 00:00 | không đổi cấu trúc dữ liệu — chỉ đổi thứ tự hiển thị |
| 4 | DEV | task | `ssr-breaker` | Passed | 00:48 | 2 task (`TB-01`, `TB-02`), Ready, coverage đủ 5 AC |
| 5 | DEV | implement | `ssr-dev` | Passed | 06:23 | 2/2 task Done; typecheck+build Passed; 5 AC kiểm chứng trực tiếp trên `next dev` |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 01:44 | Pass — 5/5 AC đạt, không finding |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 01:44 | typecheck+lint+build đều Passed |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | join=Pass, không cần fix round |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | Báo cáo này |

Kết quả join phase TEST: Pass

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | Sửa 2 điểm (mặc định dropdown `EL-02`; ghi chú gán tạm `Loại: Table` cho `EL-03` vì kit chưa có Loại "Chart") |
| `po-expert` | ba | Lần 1: `Needs Adjustment` (câu hỏi thứ tự ưu tiên với `US-010`) → user quyết qua dialog (`DEC-067`) → Lần 2: `Aligned` |
| `swe-expert` | implement | Không dùng — `SSR_IMPLEMENT_EXECUTOR=codex`, giao Codex CLI (xem mục 4) |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | Sửa `visibleCategories` để đưa danh mục `isFallback` xuống cuối | Done | `npx tsc --noEmit` 0 lỗi; diff đúng thiết kế plan mục 5 |
| `TB-02` | Verification tổng hợp + cập nhật DEV wiki | Done | typecheck+build Passed; 5 AC có evidence DOM cụ thể trên `next dev`, gồm bằng chứng before/after cho AC-01 |

Task thêm mới trong quá trình làm: Không có.

Triển khai qua **Codex CLI** (`SSR_IMPLEMENT_EXECUTOR=codex`): soạn brief tạm `.codex-brief.md` (đã xoá sau khi chạy), chạy `codex exec --yolo`, đối chiếu phạm vi bằng `git status --untracked-files=all` + md5 trước/sau — xác nhận chỉ 1 file đổi (`components/BudgetApp.tsx`), `prisma/schema.prisma`/`docs/db/schema.dbml` không bị chạm. `ssr-dev` tự chạy lại toàn bộ verification (không dùng kết quả Codex tự báo).

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | `components/BudgetApp.tsx` (hàm `visibleCategories`, dòng 334-338 — đưa danh mục `isFallback` xuống cuối mảng sau khi lọc) |
| Prisma / migration | Không có |
| DBML | Không có |
| Knowledge base | `docs/kb/dev/wiki/US-014-chi-tieu-khac-cuoi-bang.md`; `docs/kb/dev/00-index.md`; `docs/kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md`; `docs/kb/ba/wiki/knowledge/feature-summary/US-014-chi-tieu-khac-cuoi-bang.md`; `docs/kb/ba/wiki/delivery/pbi/US-014-chi-tieu-khac-cuoi-bang.md`; `docs/kb/ba/wiki/knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md` (mới); `docs/kb/ba/wiki/data/entity/ENT-002-danh-muc.md`; `docs/kb/ba/wiki/knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md`; `docs/kb/ba/wiki/ingestion/source-record/US-014-chi-tieu-khac-cuoi-bang.md`; 4 index wiki + `wiki-health-report.md` |
| Memory | `docs/memory/decisions.md` (`DEC-066`, `DEC-067`) |
| Artifact feature | `docs/features/US-014-chi-tieu-khac-cuoi-bang/{spec.md,plan.md,task.md,report.md}`; `docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md`; `docs/requirements-index.md`; `docs/kb/ba/00-index.md` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — "No errors found" | 2026-08-10 |
| `rtk prisma validate` | Không áp dụng — không chạm schema | — |
| `rtk vitest run` | Không áp dụng — chưa có framework test (gap đã biết từ US-001), thay bằng thủ công đủ 5 AC | — |
| `rtk next lint` | Passed — Errors: 0, Warnings: 0 | 2026-08-10 |
| `rtk next build` | Passed — 1 route, Errors: 0, Warnings: 0 | 2026-08-10 |

## 7. Review Findings

Không có finding nào — verdict `Pass` tuyệt đối.

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | Tháng "2026-08" (đã có sẵn "Chi tiêu khácc" hiển thị): "Chi tiêu khác" ở dòng cuối bảng — bằng chứng before/after (trước sửa từng ở vị trí 4/6, cùng dữ liệu) |
| AC-02 | Đạt | Bấm "Thêm danh mục" → "Danh mục mới" chèn ngay trước "Chi tiêu khác", "Chi tiêu khác" vẫn ở cuối |
| AC-03 | Đạt | Tháng "2026-09" (8 danh mục mặc định, chưa từng cần "Chi tiêu khác") → không có dòng "Chi tiêu khác", thứ tự các danh mục khác không đổi |
| AC-04 | Đạt | Dropdown "Danh mục nhận diện": "Chi tiêu khác" là lựa chọn cuối cùng |
| AC-05 | Đạt | Biểu đồ "Cơ cấu chi tiêu": cột "Chi tiêu khác" ở vị trí cuối cùng |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-01` (dòng "Chi tiêu khác" trong bảng) | Có | `visibleCategories` áp dụng tại bảng ngân sách (`components/BudgetApp.tsx:937`) |
| `EL-02` (dropdown "Danh mục nhận diện") | Có | Áp dụng tại `components/BudgetApp.tsx:791` |
| `EL-03` (biểu đồ "Cơ cấu chi tiêu") | Có | Áp dụng tại `components/BudgetApp.tsx:1059` |

## 8. Fix Rounds

Không có vòng fix nào — join phase TEST = `Pass`, không đạt điều kiện chạy `ssr-fix`.

Số vòng đã dùng: 0/2

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | Kit (`ssr-ba`) chưa có Loại "Chart" trong bảng "Loại hợp lệ" của Screen Element — `EL-03` (biểu đồ cột) phải gán tạm `Loại: Table` | Nợ kỹ thuật (cấp kit, không phải của US-014) | Nếu về sau có nhiều spec khác cần mô tả biểu đồ, cân nhắc bổ sung Loại "Chart" vào kit `dylan-ssrkit` |
| 2 | US-010 ("Chặn trùng tên danh mục") vẫn chưa có raw/spec, cùng tier ưu tiên đã công bố với các US đã Delivered | Nợ backlog đã biết (`DEC-067`) | Ưu tiên xử lý US-010 ở đợt tiếp theo — giải quyết rủi ro toàn vẹn dữ liệu (gán giao dịch nhập nhanh khi có 2 danh mục trùng tên) |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git checkout -- components/BudgetApp.tsx` (hiện chưa commit — có thể revert trực tiếp về trạng thái trước khi chạy pipeline này) |
| Migration SQLite | Không áp dụng — không có migration mới |
| Dữ liệu đã backfill | Không áp dụng — không backfill dữ liệu nào |
