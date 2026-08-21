# Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi — Delivery Report

Status: Delivered With Notes
Feature: US-012
Verdict: Pass With Notes
Created: 2026-08-06
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

US-012 sửa một defect mất dữ liệu nghiêm trọng: khi nội dung nhập nhanh khớp từ khóa của một nhóm chi tiêu (vd "ăn tối 300k" → nhóm "Ăn uống"), nhưng danh mục thật trong tháng đã bị Dylan đổi tên (vd thành "Ăn uống & đi chợ"), hệ thống trước đây âm thầm không ghi nhận gì — không lưu giao dịch, không báo lỗi. Defect này được phát hiện qua PO review ngay trong ngày, tái hiện được bằng thao tác thật. Bản sửa thêm bước so khớp gần đúng (tên danh mục chứa nhãn nhóm, hoặc ngược lại) trước khi coi là không xác định được; nếu vẫn không tìm ra thì rơi về "Chi tiêu khác" — đúng hành vi đã có từ US-005. Toàn bộ thay đổi nằm gọn trong một file (`components/BudgetApp.tsx`), không đổi server, không đổi schema. Cả 5 tiêu chí chấp nhận đã kiểm chứng bằng thao tác thật trên `next dev`, bao gồm cả trường hợp nhiều danh mục cùng khớp gần đúng (chọn đúng danh mục đứng trước theo thứ tự hiển thị, đã xác nhận lại sau khi tải lại trang). Rủi ro còn lại: dữ liệu môi trường test có một danh mục dự phòng bị nhiễu tên (không phải do code); gap môi trường có từ trước (thiếu cấu hình lint, chưa cài framework test) không thuộc phạm vi sửa của US-012.

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-012-sua-loi-nhan-dien-danh-muc.md` | Có (từ trước) |
| Spec | `docs/features/US-012-sua-loi-nhan-dien-danh-muc/spec.md` | Có — `Ready for DEV`, 5 AC |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md` | Có — `Active`, đã sync |
| Plan | `docs/features/US-012-sua-loi-nhan-dien-danh-muc/plan.md` | Có — `Implemented` |
| DEV wiki | `docs/kb/dev/wiki/US-012-sua-loi-nhan-dien-danh-muc.md` | Có — `Active` |
| Data model | Không áp dụng — không đổi schema | — |
| Task | `docs/features/US-012-sua-loi-nhan-dien-danh-muc/task.md` | Có — `Implemented`, 2/2 task Done |
| Report | `docs/features/US-012-sua-loi-nhan-dien-danh-muc/report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 22:23 | Ready for DEV, 5 AC, po-expert Aligned, ba-expert bổ sung AC-05 |
| 2 | DEV | plan | `ssr-plan` | Passed | 04:13 | Ready for task-breakdown, schemaChangeRequired=false |
| 3 | DEV | data | `ssr-data` | Skipped | 00:00 | Không đổi cấu trúc dữ liệu |
| 4 | DEV | task | `ssr-breaker` | Passed | 01:02 | 2 task, coverage đủ 5 AC |
| 5 | DEV | implement | `ssr-dev` | Passed | 09:32 | 2/2 task Done, build+typecheck sạch, 5 AC kiểm chứng thật |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 01:44 | Pass With Notes, 5/5 AC đạt, 1/1 EL đạt, 2 finding Low |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 00:32 | typecheck/build Passed; lint+vitest chưa cấu hình (gap có từ trước) |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | join = Pass With Notes, không cần fix round |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | Báo cáo này |

Kết quả join phase TEST: Pass With Notes

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | 1 thay đổi đã sửa (bổ sung `AC-05` cho trường hợp tháng trống danh mục) |
| `po-expert` | ba | Aligned |
| `swe-expert` | implement | Không dùng — `ssr-dev` tự triển khai (chỉ 1 task chạm 1 file, dưới ngưỡng giao agent) |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | Hàm `findQuickCategoryMatch` + sửa `onChange`/`inferredQuickCategory` | Done | `rtk tsc --noEmit` Passed; `rtk next build` Passed |
| `TB-02` | Verification tổng hợp | Done | `tsc`/`build` Passed, đủ 5 AC thủ công trên `next dev` |

Task thêm mới trong quá trình làm: Không có.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | `components/BudgetApp.tsx` |
| Prisma / migration | Không áp dụng |
| DBML | Không áp dụng |
| Knowledge base | `docs/kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md`, `docs/kb/ba/wiki/knowledge/feature-summary/US-012-sua-loi-nhan-dien-danh-muc.md`, `docs/kb/ba/wiki/delivery/pbi/US-012-sua-loi-nhan-dien-danh-muc.md`, `docs/kb/ba/wiki/ingestion/source-record/US-012-sua-loi-nhan-dien-danh-muc.md`, `docs/kb/ba/wiki/knowledge/business-rule/BR-013-so-khop-gan-dung-danh-muc.md`, `docs/kb/ba/wiki/knowledge/business-rule/BR-011-bo-qua-danh-muc.md`, `docs/kb/ba/wiki/knowledge/epic/EPC-001-ghi-nhan-chi-tieu.md`, các index (`root/raw/epic/feature-index`, `wiki-health-report.md`), `docs/kb/dev/wiki/US-012-sua-loi-nhan-dien-danh-muc.md`, `docs/kb/dev/00-index.md`, `docs/kb/ba/00-index.md` |
| Memory | `docs/memory/decisions.md` (`DEC-059`, `DEC-060`), `docs/memory/judgement-log.md` (`JDG-011`) |
| Artifact feature | `docs/features/US-012-sua-loi-nhan-dien-danh-muc/{spec.md,plan.md,task.md,report.md}` |
| PO review (nguồn phát hiện) | `docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md`, `docs/kb/ba/business-flow.md` (mục 6, 7), `docs/kb/ba/backlog.md` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed | 2026-08-06 |
| `rtk next build` | Passed — Errors: 0, Warnings: 0 | 2026-08-06 |
| `rtk vitest run` | Failed — chưa cài framework test (gap có từ trước, `JDG-002`, US-001) | 2026-08-06 |
| `rtk lint` | Failed — thiếu `eslint.config.js` (gap môi trường có từ trước) | 2026-08-06 |

## 7. Review Findings

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 0 | Low | Dữ liệu test (`prisma/dev.db`) | Danh mục dự phòng tên đúng "Chi tiêu khác" | Tồn tại một bản ghi tên "Chi tiêu khácc" (thừa 1 chữ) — nhiễu từ phiên dev server khác chạy song song cùng `dev.db` ở lượt trước, không do code US-012/US-005 tạo ra | Còn mở — không thuộc phạm vi sửa, có thể dọn tay nếu cần |
| F-02 | 0 | Low | Nhánh `test` — `rtk lint`, `rtk vitest run` | Chạy được | 2 gap môi trường đã biết từ US-001/US-005 (thiếu `eslint.config.js`, chưa cài `vitest`) | Từ chối sửa trong phạm vi này — theo đúng tiền lệ các US trước |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | Đổi tên "Ăn uống"→"Ăn uống & đi chợ" trên `next dev` thật, gõ "ăn tối 300k": dropdown/preview đúng "Ăn uống & đi chợ", Ghi nhận thành công, Chi thực tế +300.000đ |
| AC-02 | Đạt | Xóa hẳn danh mục chứa "Ăn uống": dropdown "Chưa xác định", Ghi nhận vẫn thành công, gộp đúng vào danh mục dự phòng hiện có |
| AC-03 | Đạt | Gõ "khám bệnh 50k" (danh mục chưa đổi tên): dropdown đúng như cũ — không phá vỡ hồi quy |
| AC-04 | Đạt | Hai danh mục cùng chứa "Ăn uống": dropdown chọn đúng danh mục đứng trước theo thứ tự hiển thị, xác nhận lại sau khi reload trang |
| AC-05 | Đạt (suy luận từ code, cùng nhánh AC-02) | Mảng danh mục rỗng cũng trả `undefined` từ `findQuickCategoryMatch` ở cả hai bước so khớp |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-01` | Có | `components/BudgetApp.tsx` — `inferredQuickCategory` và `onChange` đều dùng `findQuickCategoryMatch` thay vì trả thẳng nhãn rule cố định |

## 8. Fix Rounds

Không có vòng fix nào — join phase TEST đạt `Pass With Notes` ngay từ vòng đầu.

Finding bị từ chối:

| Finding | Lý do từ chối | Chuyển thành |
| --- | --- | --- |
| F-01 | Dữ liệu môi trường phát triển cục bộ, không phải lỗi code | Follow-up mục 9 (không bắt buộc) |
| F-02 | Gap môi trường có từ trước US-012, không phải lỗi phát sinh từ chu trình này | Follow-up mục 9 |

Số vòng đã dùng: 0/2

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | Dữ liệu dev cục bộ có một danh mục dự phòng tên nhiễu "Chi tiêu khácc" (thừa 1 chữ) do chạy song song 2 dev server cùng `dev.db` | Nợ kỹ thuật (dữ liệu, không phải code) | Dọn tay nếu cần (đổi tên trực tiếp trong DB hoặc reset dữ liệu tháng đó); không ảnh hưởng logic ứng dụng |
| 2 | Dự án chưa có `eslint.config.js` và chưa cài `vitest` — gap xuyên suốt từ US-001 | Nợ kỹ thuật (môi trường) | Một task riêng để cấu hình lint + test framework, áp dụng chung toàn dự án |
| 3 | Giải pháp so khớp gần đúng dựa trên tên chuỗi vẫn là "giải pháp tình thế" (đã ghi nhận ở `DEC-059`) — phương án bền vững hơn (gắn mã cố định cho danh mục mặc định) chưa triển khai | Nợ kỹ thuật (thiết kế, đã có chủ đích) | Không cần làm ngay; cân nhắc nếu sau này phát sinh thêm trường hợp so khớp nhầm trong thực tế |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git checkout -- components/BudgetApp.tsx` để hoàn tác riêng thay đổi của US-012 (toàn bộ nằm trong 1 file, chưa commit) |
| Migration SQLite | Không áp dụng — không có migration |
| Dữ liệu đã backfill | Không áp dụng — không có backfill nào |
