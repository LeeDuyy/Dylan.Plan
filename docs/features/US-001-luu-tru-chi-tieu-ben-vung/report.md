# Lưu trữ chi tiêu bền vững và liên kết giao dịch theo danh mục cố định — Delivery Report

Status: Delivered With Notes
Feature: US-001
Verdict: Pass With Notes
Created: 2026-08-05
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

Chu trình này xử lý report của user: "nhập tiền nhà 50k → nhấn Ghi nhận thì không cộng vào Chi thực tế của Tiền nhà". Điều tra tìm ra **2 defect** trong hàm phân tích chuỗi nhập nhanh của `components/DylanPlanApp.tsx` (dùng chung cho mọi danh mục, có từ trước US-001, không phải lỗi mới phát sinh từ việc chuyển sang Prisma): (D-01) số tiền rút gọn kiểu "7tr5" bị mất phần thập phân; (D-02) — **đúng nguyên nhân user báo** — chữ tiếng Việt gõ ở dạng Unicode NFD (một số bàn phím/IME/hệ điều hành) không khớp từ khóa NFC trong code, khiến giao dịch bị lặng lẽ gán nhầm sang danh mục khác, nên "Chi thực tế" của danh mục đúng ("Tiền nhà") không tăng — đúng như user quan sát. Cả hai đã sửa bằng cách chuẩn hóa `.normalize("NFC")` trước khi so khớp. Không đổi spec, không đổi schema, không cần task mới — vá trực tiếp trong phạm vi đã giao ở `TB-05`/`TB-08`. Đã verify lại bằng typecheck, build, và tái hiện bug bằng dữ liệu NFD thật qua DOM trên `next dev`. Rủi ro còn lại: AC-01/AC-06/AC-08 (di trú dữ liệu cũ) vẫn chưa được kiểm chứng bằng thao tác thật với `localStorage` cũ giả lập (gap đã ghi nhận từ trước, không phát sinh từ chu trình này).

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-001-luu-tru-chi-tieu-ben-vung.md` | Có (từ trước) |
| Spec | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` | Có (không đổi trong chu trình này) |
| BA wiki | `docs/kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md` | Có (từ trước) |
| Plan | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/plan.md` | Có (không đổi trong chu trình này) |
| DEV wiki | `docs/kb/dev/wiki/US-001-luu-tru-chi-tieu-ben-vung.md` | Có — bổ sung mục 7 (defect D-01/D-02) |
| Data model | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/data-model.md` | Có (không đổi) |
| Task | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/task.md` | Có — bổ sung mục 8 (Defect Phát Hiện Sau Khi Done) |
| Report | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 00:00 | `spec.md` không đổi — AC-03 đã đúng yêu cầu ("Chi thực tế" cập nhật ngay khi ghi nhận), lỗi nằm ở code chưa chuẩn hóa Unicode, không phải khoảng trống trong spec |
| 2 | DEV | plan | `ssr-plan` | Skipped | 00:00 | Không đổi thiết kế kỹ thuật — vẫn đúng file `components/DylanPlanApp.tsx` đã có trong `plan.md` mục 8 |
| 3 | DEV | data | `ssr-data` | Skipped | 00:00 | Không đổi cấu trúc dữ liệu |
| 4 | DEV | task | `ssr-breaker` | Skipped | 00:00 | Không cần task mới — vá trực tiếp trong phạm vi `TB-05`/`TB-08` đã `Done`, ghi nhận defect ở `task.md` mục 8 |
| 5 | DEV | implement | `ssr-dev` | Passed | 00:08 | 3 điểm sửa trong `components/DylanPlanApp.tsx`: `safeNumber`, `extractAmount`, `inferredQuickCategory`, `onChange` ô nhập nhanh |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 00:14 | Đối chiếu AC-03, tái hiện D-01/D-02 trước và sau khi sửa |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 00:14 | `rtk tsc --noEmit`, `rtk next build` |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | Join = Pass — fix đã áp dụng trực tiếp trong lượt implement, không cần vòng fix riêng |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | File này |

Kết quả join phase TEST: **Pass**

Agent đã dùng: Không dùng (`ba-expert`/`po-expert`/`swe-expert`) — chu trình vá defect quy mô nhỏ, `ssr-dev` tự làm trực tiếp, dưới trần chạm 4 file.

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-05` | `recordQuickTransaction` và các use-case ghi khác | Done (không đổi ở chu trình này) | Xem `task.md` |
| `TB-08` | Nối thao tác ghi trong UI sang Server Action | Done (không đổi ở chu trình này) | Xem `task.md` |
| `D-01` (mới, mục 8 `task.md`) | "7tr5" mất phần thập phân khi phân tích số tiền — đã sửa | Done | `rtk tsc --noEmit` 0 lỗi; thao tác thủ công 3 case (7tr5/7tr/80k) |
| `D-02` (mới, mục 8 `task.md`) | Input tiếng Việt dạng NFD không khớp từ khóa NFC, giao dịch gán nhầm danh mục — đã sửa | Done | `rtk tsc --noEmit` 0 lỗi; `rtk next build` 0 lỗi; mô phỏng NFD qua DOM thật, "Chi thực tế" Tiền nhà tăng đúng 50k→100k |

Task thêm mới trong quá trình làm: `D-01`, `D-02` (ghi ở `task.md` mục 8, không phải `TB-##` mới vì không đổi phạm vi AC/data model).

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | `components/DylanPlanApp.tsx` (`safeNumber`, `extractAmount`, `inferredQuickCategory`, `onChange` ô nhập nhanh) |
| Prisma / migration | Không đổi |
| DBML | Không đổi |
| Knowledge base | `docs/kb/dev/wiki/US-001-luu-tru-chi-tieu-ben-vung.md` (mục 7) |
| Memory | `docs/memory/judgement-log.md` (`JDG-004`) |
| Artifact feature | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/task.md` (mục 8), `report.md` (file này) |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed | 2026-08-05 |
| `rtk npx prisma validate` | Không áp dụng (không đổi schema) | — |
| `rtk vitest run` | Không chạy — gap đã biết, `vitest` chưa cài (xem `plan.md` mục 6/13) | — |
| `rtk next build` | Passed — `Errors: 0, Warnings: 0` | 2026-08-05 |

## 7. Review Findings

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| D-01 | 0 | Medium | `components/DylanPlanApp.tsx` (`safeNumber`/`extractAmount`) | "7tr5" nhận diện 7.500.000đ (7 triệu rưỡi) | Chỉ nhận diện 7.000.000đ, phần "5" bị bỏ qua | Đã sửa |
| D-02 | 0 | High | `components/DylanPlanApp.tsx` (`inferredQuickCategory`, `extractAmount`) | Ghi nhận "tiền nhà 50k" cộng đúng vào "Chi thực tế" của "Tiền nhà" (AC-03) | Với input tiếng Việt dạng NFD, giao dịch bị gán nhầm sang danh mục khác đang chọn trước đó — "Chi thực tế" của "Tiền nhà" không đổi | Đã sửa |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-02 | Đạt | "Chi thực tế" tính đúng tổng giao dịch, chỉ đọc (đã verify ở lần triển khai `TB-12` trước, không đổi ở chu trình này) |
| AC-03 | Đạt (sau khi sửa D-02) | Ghi nhận "tiền nhà 50k" dạng NFD → "Chi thực tế" Tiền nhà tăng đúng ngay (50k→100k trong phiên test cộng dồn) |
| AC-05 | Đạt | Không đổi ở chu trình này (đã verify ở lần triển khai trước) |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-06` (cột Chi thực tế) | Có | Tính đúng qua `aggregate`, phản ánh đúng sau khi sửa D-02 |

## 8. Fix Rounds

| Vòng | Finding nhận | Nguyên nhân gốc | Thay đổi | Verification |
| --- | --- | --- | --- | --- |
| 1 | D-01 | Regex `extractAmount`/`safeNumber` không xử lý chữ số dính liền sau đơn vị "tr" | Thêm nhánh regex + parse riêng cho dạng "N tr D" trong `components/DylanPlanApp.tsx` | Passed |
| 1 | D-02 | So khớp từ khóa tiếng Việt bằng `.includes()` không chuẩn hóa Unicode — input NFD không khớp từ khóa NFC | Thêm `.normalize("NFC")` tại 3 điểm so khớp trong `components/DylanPlanApp.tsx` | Passed |

Finding bị từ chối: Không có.

Số vòng đã dùng: 1/2 (`SSR_FIX_ROUND_LIMIT`) — thực chất là sửa trực tiếp trong lượt implement, không qua `ssr-fix` chính thức vì phát hiện và sửa cùng một lượt điều tra.

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | AC-01/AC-06/AC-08 (di trú dữ liệu cũ, banner đa thiết bị) chưa kiểm chứng bằng thao tác thật trên UI với dữ liệu `localStorage` cũ giả lập | Nợ kỹ thuật (gap có từ lần triển khai `TB-12` trước) | Test thủ công ở lần review kế tiếp: giả lập `localStorage` có `months` cũ, mở app, xác nhận banner `EL-03` và migration chạy đúng |
| 2 | `vitest` chưa cài trong `package.json` | Nợ kỹ thuật (gap có từ đầu dự án) | Cài đặt framework test khi có task riêng, ngoài phạm vi US-001 |
| 3 | Các function tương lai có so khớp chuỗi tiếng Việt tự do (tìm kiếm, chặn trùng tên ở US-010...) nên áp dụng `.normalize("NFC")` ngay từ đầu | Rủi ro (bug class đã xác nhận, `JDG-004`) | `ssr-plan`/`ssr-dev` của các US sau nên đọc `docs/memory/judgement-log.md#jdg-004` trước khi viết logic so khớp chuỗi có dấu |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git diff components/DylanPlanApp.tsx` — revert 3 đoạn `.normalize("NFC")` và nhánh `shorthandMillion` nếu cần, không ảnh hưởng file nào khác |
| Migration SQLite | Không áp dụng — không đổi schema |
| Dữ liệu đã backfill | Không áp dụng |
