# Danh sách items cần mua theo tháng tại bảng thu chi — Delivery Report

Status: Delivered With Notes
Feature: US-019
Verdict: Pass With Notes
Created: 2026-08-21
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.
> Toàn bộ findings và các vòng fix được gộp vào mục 7 và 8 của file này.

## 1. Tóm Tắt

Dylan giờ có khu vực "Items cần mua" ngay trong bảng thu chi của từng tháng: ghi tên sản phẩm, giá dự kiến (tùy chọn), đánh dấu Pending (cam/vàng)/Purchased (xanh lá) bằng badge màu. Giá item chỉ là ghi chú tham khảo, không cộng vào Ngân sách/Chi thực tế/Số dư còn lại. Thêm/sửa (inline)/xóa/đánh dấu đã mua chỉ thực hiện được ở **tháng hiện tại theo đồng hồ hệ thống** — khác với cách "tháng đang chọn" hoạt động cho giao dịch/danh mục — ràng buộc này được chặn thật ở tầng server (`assertMonthIsCurrent`), không chỉ ẩn ở UI. Khi Dylan bấm "Tạo tháng" hoặc "Clone tháng đang xem", toàn bộ item còn Pending của tháng hiện tại tự động chuyển sang tháng mới bằng một câu `updateMany`, biến mất khỏi tháng gốc; item Purchased không bị chuyển. Xem một tháng khác tháng hiện tại chỉ hiển thị danh sách ở chế độ chỉ đọc (không ô nhập, không nút hành động). BA/DEV/data/task đều đã sẵn có từ trước (implement qua Codex CLI, 2026-08-19); lượt này pipeline chạy phase TEST và sinh report. 10/10 AC kiểm chứng trực tiếp qua thao tác thật trên `next dev` (bằng chứng đã ghi ở `task.md` `TB-08`), 13/13 Screen Element đúng spec. Không có finding chặn nào; 1 ghi chú Low về memory hygiene (một `DEC` cũ chưa được đánh dấu `Superseded` dù đã bị một `DEC` sau đó thay đổi nội dung) không ảnh hưởng tới code đã giao.

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-019-danh-sach-can-mua.md` | Có |
| Spec | `spec.md` | Có — `Ready for DEV`, 10 AC, 13 Screen Element |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md` | Có |
| Plan | `plan.md` | Có — `Ready for task-breakdown` |
| DEV wiki | `docs/kb/dev/wiki/US-019-danh-sach-can-mua.md` | Có |
| Data model | `data-model.md` | Có — `Applied` |
| Task | `task.md` | Có — `Implemented`, 9 task |
| Report | `report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 00:00 | Spec Ready for DEV — đã có sẵn từ trước, pipeline chỉ xác nhận lại |
| 2 | DEV | plan | `ssr-plan` | Passed | 00:00 | Plan Ready for task-breakdown, schemaChangeRequired=true — đã có sẵn |
| 3 | DEV | data | `ssr-data` | Passed | 00:00 | Model `PurchaseItem` + quan hệ `MonthBudget`, migration `20260819080706_add_purchase_item` đã áp — đã có sẵn |
| 4 | DEV | task | `ssr-breaker` | Passed | 00:00 | 9 task (`TB-01`..`TB-09`), coverage đủ 10 AC — đã có sẵn |
| 5 | DEV | implement | `ssr-dev` | Passed | 00:00 | 9/9 task Done qua Codex CLI, verification đã chạy trước đó (2026-08-19) — đã có sẵn |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 01:50 | Pass With Notes — 10/10 AC đạt, 13/13 element đúng |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 01:50 | typecheck/prisma validate/build (`npx next build`, exit 0, 8 static page) Passed; lint/vitest = gap tooling đã biết |
| 8 | TEST | fix | `ssr-fix` | Skipped | 00:00 | join = Pass With Notes, không cần fix round |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | Báo cáo này |

Kết quả join phase TEST: Pass With Notes

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | Không dùng ở lượt này — spec đã Ready for DEV từ phiên trước, nêu rõ trong `spec.md` mục 14 (`DEC-106` sau khi `ba-expert` phát hiện mâu thuẫn "sửa") |
| `po-expert` | ba | Blocked lần đầu (thiếu trong Business Flow) → user chốt `DEC-105` mở rộng `M3`/F3 → Aligned (đã chốt ở phiên trước) |
| `swe-expert` | implement | Không dùng — `SSR_IMPLEMENT_EXECUTOR=codex`, đã giao Codex CLI ở phiên trước |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | Model `PurchaseItem` + migration + DBML | Done | Migration Passed, `prisma validate` Passed |
| `TB-02` | Domain: entity, 2 rule file, repository interface | Done | Đọc lại 4 file — không import Prisma (R13.2), đúng thiết kế |
| `TB-03` | Infrastructure: `purchase-item-prisma-repository.ts` | Done | Đọc lại file — `transferPendingToMonth` dùng 1 câu `updateMany`, `findAll`/`findByMonth` có `orderBy` |
| `TB-04` | Application: 4 use-case add/update/mark-purchased/delete | Done | Đọc lại 4 file — mỗi use-case gọi `assertMonthIsCurrent`, ném đúng lỗi riêng, `markPurchaseItemPurchased` no-op khi đã Purchased |
| `TB-05` | `create-month.ts` nối bước chuyển item; `budget-snapshot-service.ts` thêm `purchaseItems` | Done | Đọc lại `create-month.ts` — gọi `transferPendingToMonth(getCurrentMonthId(), monthId)` sau khi tạo danh mục; `budget-snapshot-service.ts` gộp đúng `purchaseItems` theo `monthId` |
| `TB-06` | `actions.ts` export 4 Server Action mới | Done | Đọc lại file — wiring + export + re-export type đầy đủ |
| `TB-07` | UI khu vực "Items cần mua" trong `BudgetApp.tsx` | Done | Đọc lại file — `canEditPurchaseItems` đúng công thức, badge màu đúng, disabled nút Thêm item đúng, colSpan đúng |
| `TB-08` | Verification tổng hợp, đủ 10 AC | Done | typecheck/prisma validate/build Passed; 10/10 AC có evidence DOM cụ thể trong `task.md` |
| `TB-09` | Cập nhật DEV wiki + memory | Done | DEV wiki mục 2,3,5,7 đã cập nhật khớp code thật |

Task thêm mới trong quá trình làm: Không có.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source | `components/BudgetApp.tsx`; `server/budget/domain/entities/purchase-item.ts` (mới); `server/budget/domain/repositories/purchase-item-repository.ts` (mới); `server/budget/domain/rules/purchase-item-rule.ts` (mới); `server/budget/domain/rules/current-month-rule.ts` (mới); `server/budget/domain/services/budget-snapshot-service.ts`; `server/budget/infrastructure/repositories/purchase-item-prisma-repository.ts` (mới); `server/budget/application/use-cases/{add,update,mark-purchase-item-purchased,delete}-purchase-item.ts` (mới); `server/budget/application/use-cases/create-month.ts`; `server/budget/actions.ts` |
| Prisma / migration | `prisma/schema.prisma`; `prisma/migrations/20260819080706_add_purchase_item/` |
| DBML | `docs/db/schema.dbml` |
| Knowledge base | `docs/kb/dev/wiki/US-019-danh-sach-can-mua.md` |
| Memory | `docs/memory/decisions.md` (`DEC-092`..`DEC-098`, `DEC-105`..`DEC-108`) |
| Artifact feature | `docs/features/US-019-danh-sach-can-mua/{spec.md,plan.md,task.md,data-model.md,report.md}` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `rtk tsc --noEmit` | Passed — "TypeScript: No errors found" | 2026-08-21 |
| `rtk npx prisma validate` | Passed — "The schema at prisma\schema.prisma is valid" | 2026-08-21 |
| `rtk vitest run` | Không áp dụng — dự án chưa cài framework test (gap đã biết từ US-001, `JDG-002`) | 2026-08-21 |
| `rtk lint` | Không áp dụng — dự án chưa có `eslint.config.*` (gap đã biết từ US-016) | 2026-08-21 |
| `npx next build` | Passed — exit code 0, "Compiled successfully", 8 static page sinh thành công, 0 lỗi | 2026-08-21 |

## 7. Review Findings

Không có finding Critical/High/Medium. 1 ghi chú Low:

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 0 | Low | `docs/memory/decisions.md` (`DEC-094`) | `DEC-094` ("tháng cũ" = khác `selectedMonthId`) nên được đánh dấu `Superseded` sau khi `DEC-107` đổi định nghĩa "tháng hiện tại" cho Items cần mua sang theo đồng hồ hệ thống | `DEC-094` vẫn `Status: Active`, không có trường `Thay thế`/`Superseded`, dù nội dung đã bị `DEC-107` ghi đè cho phạm vi US-019 | Còn mở — không ảnh hưởng code đã giao (code triển khai đúng theo `DEC-107`), chỉ là nợ vệ sinh memory |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | Thêm "Mua chuột không dây" không giá → badge Pending (cam/vàng), giá để trống |
| AC-02 | Đạt | Thêm "Mua bàn phím cơ" giá "1tr5" → 1.500.000đ; Ngân sách/Chi thực tế tháng không đổi (26.950.000đ trước/sau) |
| AC-03 | Đạt | Đánh dấu đã mua → badge đổi Purchased (xanh lá) |
| AC-04 | Đạt | Xóa item → biến mất ngay khỏi danh sách |
| AC-05 | Đạt | Đổi dropdown sang "2026-07" → nhãn "Danh sách mua sắm chỉ xem", không ô nhập, bảng chỉ 3 cột (không có "Hành động") |
| AC-06 | Đạt | Bấm "Tạo tháng" tạo "2026-09" → item Pending chuyển sang tháng mới, biến mất khỏi tháng gốc |
| AC-07 | Đạt | Bấm "Clone tháng đang xem" tạo "2026-10" → item Pending chuyển tương tự AC-06 |
| AC-08 | Đạt | Để trống ô Tên sản phẩm → nút "Thêm item" `disabled: true` |
| AC-09 | Đạt | Sửa tên inline "Mua chuột không dây" → "Mua chuột Logitech" — lưu đúng |
| AC-10 | Đạt | Sửa giá inline "1.500.000" → "2tr" → hiển thị 2.000.000đ; Ngân sách/Số dư không đổi |

Đối chiếu Screen Element:

| Element | Đã hiện thực | Bằng chứng |
| --- | --- | --- |
| `EL-01` (Bảng Items cần mua) | Có | Sắp theo `createdAt` tăng dần (repository `orderBy`), hiển thị cả Pending lẫn Purchased |
| `EL-02` (Cột Tên sản phẩm) | Có | Inline edit khi `canEditPurchaseItems`; để trống thì `restorePurchaseItemLocal` khôi phục tên cũ |
| `EL-03` (Cột Giá) | Có | Để trống nếu không nhập, inline edit khi tháng hiện tại |
| `EL-04` (Cột Trạng thái) | Có | Badge `var(--warning)`/`var(--success)` phân biệt rõ Pending/Purchased |
| `EL-05` (Cột Hành động) | Có | Chỉ hiện khi `canEditPurchaseItems`, chứa `EL-07`/`EL-08` |
| `EL-06` (Input Tên sản phẩm) | Có | Bắt buộc, chỉ hiện ở tháng hiện tại |
| `EL-07` (Nút Đánh dấu đã mua) | Có | Chỉ hiện trên dòng Pending |
| `EL-08` (Nút Xóa item) | Có | Hiện trên mọi dòng khi tháng hiện tại |
| `EL-09` (Input Giá) | Có | Không bắt buộc, chỉ hiện ở tháng hiện tại |
| `EL-10` (Nút Thêm item) | Có | `disabled={!newPurchaseName.trim()}` |
| `EL-11` (Bảng chỉ xem — tháng khác) | Có | Bỏ cột Hành động, không ô nhập, không nút nào |
| `EL-12` (Nút Tạo tháng, dùng chung US-006) | Có | `create-month.ts` gọi `transferPendingToMonth` sau khi tạo danh mục |
| `EL-13` (Nút Clone tháng đang xem, dùng chung US-006) | Có | Dùng chung logic `create-month.ts` với `EL-12` — không rẽ nhánh theo `sourceMonthId` cho bước chuyển item |

## 8. Fix Rounds

Không có vòng fix nào — join phase TEST = `Pass With Notes`, không đạt điều kiện chạy `ssr-fix`.

Số vòng đã dùng: 0/2

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | `DEC-094` (Active) chưa được đánh dấu `Superseded` dù `DEC-107` đã đổi định nghĩa "tháng cũ"/"tháng hiện tại" cho phạm vi Items cần mua | Nợ vệ sinh memory | Thêm bản ghi `Status: Superseded — thay thế bởi DEC-107` vào `DEC-094` ở lượt cập nhật memory tiếp theo, không ảnh hưởng code đã giao |
| 2 | Dự án chưa cấu hình ESLint (`eslint.config.*`) — `rtk lint` không chạy được | Nợ kỹ thuật cấp dự án (không phải của US-019) | Cần user quyết định cấu hình ESLint ở một lượt riêng |
| 3 | Dự án chưa cài framework test (`vitest`) — `rtk vitest run` không chạy được | Nợ kỹ thuật cấp dự án (không phải của US-019) | Cân nhắc cài `vitest` khi khối lượng logic domain/rule tăng đủ lớn, đặc biệt các rule như `current-month-rule.ts`/`purchase-item-rule.ts` |
| 4 | 2 tháng dữ liệu dev thừa ("2026-09", "2026-10") tạo ra trong lúc kiểm thử `TB-08` không có cách xóa qua UI (đúng thiết kế — không có tính năng xóa tháng) | Dữ liệu dev thừa, không phải lỗi chức năng | Không cần xử lý — chỉ ảnh hưởng dữ liệu môi trường dev cục bộ, không phải rủi ro production |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git checkout -- components/BudgetApp.tsx server/budget` (hiện chưa commit — có thể revert trực tiếp về trạng thái trước khi chạy pipeline này) |
| Migration SQLite | Xóa migration `add_purchase_item`, revert `schema.prisma`/`docs/db/schema.dbml`; nếu đã áp, chạy `DROP TABLE "PurchaseItem"` thủ công — không có dữ liệu nghiệp vụ nào khác phụ thuộc bảng này |
| Dữ liệu đã backfill | Không áp dụng — bảng mới hoàn toàn, không backfill dữ liệu nào |
