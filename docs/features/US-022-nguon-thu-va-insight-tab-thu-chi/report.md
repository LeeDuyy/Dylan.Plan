# Nguồn thu, sửa insight tiết kiệm, tháng mặc định và bỏ giới hạn tháng cho Item cần mua tại tab Thu chi — Delivery Report

Status: Delivered With Notes
Feature: US-022
Verdict: Pass With Notes
Created: 2026-09-07
Owner: ssr-pipeline

> Đây là **báo cáo duy nhất** của pipeline. Không có `review.md`, không có `fix-round-N.md`.

## 1. Tóm Tắt

Tab Thu chi (`/budget`) nay có phần thu: Dylan khai báo nhiều "nguồn thu" có tên cho từng tháng, và "Thu nhập tháng" bằng tổng các nguồn thu đó thay cho con số cố định 35.000.000 đồng không sửa được. Nhờ vậy "Số dư còn lại", "Tỷ lệ sử dụng thu nhập", "Tiết kiệm ròng" và "Tỷ lệ tiết kiệm" được tính đúng; insight tiết kiệm tách thành hai chỉ số riêng ("Tiết kiệm ròng" và "Đã phân bổ vào tích lũy"), và các mốc mục tiêu cố định (5M/7.5M/31.5M/30M/90%) đã gỡ khỏi giao diện. Tab khi mở chọn sẵn tháng hiện tại (hoặc tháng gần nhất). "Items cần mua" và bảng "Nguồn thu" thao tác được ở tháng hiện tại và tương lai, chỉ xem ở tháng đã kết thúc. 9 tháng dữ liệu cũ được chuyển sang một nguồn thu "Lương" = con số thu nhập cũ nên không tháng nào bị sai lệch. Rủi ro còn lại: cột `MonthBudget.income` giữ lại làm vestigial (JDG-035); chưa có test tự động (repo không có test suite).

## 2. Artifact Đã Tạo

| Loại | Path | Trạng thái |
| --- | --- | --- |
| Raw | `docs/kb/ba/raw/US-022-nguon-thu-va-insight-tab-thu-chi.md` | Có |
| Spec | `docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/spec.md` | Có (`Ready for DEV`, 13 AC) |
| BA wiki | `docs/kb/ba/wiki/knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md` | Có (`Active`, đã sync) |
| Plan | `docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/plan.md` | Có (`Ready for task-breakdown`) |
| DEV wiki | `docs/kb/dev/wiki/US-022-nguon-thu-va-insight-tab-thu-chi.md` | Có |
| Data model | `docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/data-model.md` | Có (`Applied`) |
| Task | `docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/task.md` | Có (`Implemented`, 12/12 Done) |
| Report | `docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/report.md` | Chính file này |

## 3. Trạng Thái Stage

| # | Phase | Stage | Skill | Kết quả | Thời lượng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | BA | ba | `ssr-ba` | Passed | 358:07 | spec `Ready for DEV`, 13 AC; `po-expert` `Aligned` (lần 2 — sau khi đồng bộ Business Flow); `schemaChangeRequired=true`; wiki synced |
| 2 | DEV | plan | `ssr-plan` | Passed | 06:30 | `planStatus=Ready for task-breakdown`; DEV wiki tạo; bản đồ 22 file |
| 3 | DEV | data | `ssr-data` | Passed | 05:39 | model `IncomeSource` + migration `20260907005635_add_income_source`; backfill "Lương" 9 tháng; DBML sync thủ công; `prisma validate` + `tsc` Passed |
| 4 | DEV | task | `ssr-breaker` | Passed | 02:02 | `readiness=Ready`; 12 task `TB-01..TB-12`; coverage phủ AC-01..AC-13 |
| 5 | DEV | implement | `ssr-dev` | Passed | 17:55 | executor=codex (`codex exec --yolo`); 7 file source mới + 10 sửa (chỉ `server/budget/` + `components/`); `tsc` exit 0; `next build` pass; 12/12 task Done |
| 6 | TEST | review ∥ | `ssr-review` | Passed | 02:34 | `Pass With Notes` — 13/13 AC đạt, EL-01..EL-24 đầy đủ; 2 finding `Low` |
| 7 | TEST | test ∥ | `ssr-pipeline` | Passed | 02:34 | `tsc` exit 0; `next build` pass; `prisma validate` pass; `vitest` N/A (repo không có test suite); `next lint` N/A (dự án chưa có eslint config) |
| 8 | TEST | fix | `ssr-fix` | Skipped | — | join = `Pass With Notes` (không `Fail`) → không chạy fix round; 2 finding `Low` được orchestrator vá thẳng (xem mục 8) |
| 9 | OUT | report | `ssr-pipeline` | Passed | — | file này |

Kết quả join phase TEST: **Pass With Notes**

Agent đã dùng:

| Agent | Stage | Kết quả |
| --- | --- | --- |
| `ba-expert` | ba | Sửa 12+ điểm (chuẩn hoá nhãn theo glossary, thêm EL-21..EL-24, thêm AC-09..AC-13, sửa lỗi số học ASCII mockup 8.2, cross-link); nêu 3 điểm cần user quyết → chốt thành DEC-133/134/135 |
| `po-expert` | ba | Lần 1 `Needs Adjustment` (epic + Business Flow chưa sync) → xử lý xong → lần 2 `Aligned` |
| `swe-expert` | implement | Không dùng — executor=codex |

## 4. Task Summary

| ID | Outcome | Status cuối | Evidence |
| --- | --- | --- | --- |
| `TB-01` | Xác nhận migration + backfill "Lương" + DBML | Done | `prisma validate` pass; DB: 9 tháng (2026-02..2026-10) mỗi tháng 1 dòng "Lương" 35.000.000 = `income` cũ; backfill idempotent |
| `TB-02` | Entity + repo interface + rule Nguồn thu | Done | 3 file domain mới; `assertValidIncomeSourceAmount` chặn âm + không nguyên, cho 0 (DEC-134); không luật chống trùng tên (DEC-136) |
| `TB-03` | `assertMonthNotPast` + `MonthInPastError` | Done | `current-month-rule.ts`: ném khi `monthId < getCurrentMonthId()`; `getCurrentMonthId` giữ nguyên |
| `TB-04` | `income-source-prisma-repository.ts` | Done | mirror `category-prisma-repository.ts` |
| `TB-05` | 3 use-case upsert/remove/reorder income source | Done | đều gọi `assertMonthNotPast` + `revalidatePath("/budget")`; reorder có guard khớp tập id (vá F-01) |
| `TB-06` | 4 use-case purchase-item → `assertMonthNotPast` | Done | `grep assertMonthIsCurrent server` → 0; message "Chỉ được thao tác item cần mua từ tháng hiện tại trở đi." |
| `TB-07` | `budget-snapshot-service` `income` = tổng | Done | `income = incomeSources.reduce(+amount, 0)`; `incomeSources` sort `order` |
| `TB-08` | Wire `actions.ts` + export Server Action + types | Done | `upsertIncomeSource`/`removeIncomeSource`/`reorderIncomeSources` + type re-export |
| `TB-09` | `create-month` (income:0, không seed) + `reset` (seed "Lương") | Done | đọc lại code xác nhận |
| `TB-10` | `BudgetApp.tsx` bảng "Nguồn thu" | Done | state DnD riêng; inline edit + form thêm + xóa + DnD + tfoot "Thu nhập tháng"; `canEditMonth` ẩn thao tác tháng quá khứ; lỗi → toast |
| `TB-11` | `BudgetApp.tsx` insight + tháng mặc định + gỡ mốc cứng | Done | `totals` mới; 7 ô insight; `grep 5M/7.5M/31.5M/30M/90%` → 0; `pickInitialMonthId`; runtime: `/budget` chọn sẵn `2026-09` (tháng hiện tại) |
| `TB-12` | Verification cuối + DEV wiki | Done | `tsc` exit 0; `next build` pass; smoke runtime `/budget` HTTP 200 |

Task thêm mới trong quá trình làm: Không có.

## 5. File Đã Thay Đổi

| Nhóm | File |
| --- | --- |
| Source (mới) | `server/budget/domain/entities/income-source.ts`, `server/budget/domain/repositories/income-source-repository.ts`, `server/budget/domain/rules/income-source-rule.ts`, `server/budget/infrastructure/repositories/income-source-prisma-repository.ts`, `server/budget/application/use-cases/upsert-income-source.ts`, `server/budget/application/use-cases/remove-income-source.ts`, `server/budget/application/use-cases/reorder-income-sources.ts` |
| Source (sửa) | `components/BudgetApp.tsx`, `server/budget/actions.ts`, `server/budget/domain/rules/current-month-rule.ts`, `server/budget/domain/services/budget-snapshot-service.ts`, `server/budget/application/use-cases/add-purchase-item.ts`, `update-purchase-item.ts`, `mark-purchase-item-purchased.ts`, `delete-purchase-item.ts`, `create-month.ts`, `reset-all-budget-data.ts` |
| Prisma / migration | `prisma/schema.prisma`, `prisma/migrations/20260907005635_add_income_source/migration.sql`, `prisma/backfill/us022-income-sources.mjs`, `prisma/dev.db` (backup: `prisma/backups/dev.db.us-022-before-income-source.20260907075606.bak`) |
| DBML | `docs/db/schema.dbml` |
| Knowledge base | `docs/kb/ba/raw/US-022-*.md`, `docs/kb/ba/wiki/**` (feature, feature-summary, pbi, source-record, ENT-007, BR-033..BR-037, BR-024 → Superseded, ENT-003/ENT-006 cập nhật, 4 index, wiki-health-report), `docs/kb/dev/wiki/US-022-*.md`, `docs/kb/dev/00-index.md`, `docs/kb/ba/business-flow.md`, `docs/requirements-index.md` |
| Memory | `docs/memory/decisions.md` (DEC-127..DEC-136), `docs/memory/judgement-log.md` (JDG-034, JDG-035), `docs/memory/glossary.md` |
| Artifact feature | `spec.md`, `plan.md`, `data-model.md`, `task.md`, `report.md` |

## 6. Verification

| Lệnh | Kết quả | Lần chạy cuối |
| --- | --- | --- |
| `./node_modules/.bin/tsc --noEmit` | Passed (exit 0) | 2026-09-07 |
| `./node_modules/.bin/prisma validate` | Passed | 2026-09-07 |
| `./node_modules/.bin/next build` | Passed (`/budget` compiled) | 2026-09-07 |
| Smoke runtime `curl -H "Host: plan.localhost" /budget` | Passed (HTTP 200; "Nguồn thu"/"Tiết kiệm ròng"/"Đã phân bổ vào tích lũy"/"Tỷ lệ tiết kiệm" render; ô "Chọn tháng xem" chọn sẵn 2026-09; không còn "7.5M"/"31.5M"/"90% thu nhập") | 2026-09-07 |
| `vitest` | N/A — repo không có test suite (không do US-022) | — |
| `next lint` | N/A — dự án chưa có cấu hình ESLint (tình trạng có sẵn; `next build` đã bao gồm kiểm type + lint nội bộ và pass) | — |

## 7. Review Findings

| ID | Vòng | Severity | File:Line | Kỳ vọng | Thực tế | Trạng thái cuối |
| --- | --- | --- | --- | --- | --- | --- |
| F-01 | 0 | Low | `server/budget/application/use-cases/reorder-income-sources.ts` | Giống `reorder-categories` — verify `orderedIds` khớp chính xác tập nguồn thu của tháng trước khi `$transaction` | Không verify; client gửi id lệch có thể update nhầm | Đã sửa — thêm guard so tập id với `repository.findByMonth(monthId)` |
| F-02 | 0 | Low | `components/BudgetApp.tsx` (`formatIncomeAmountInput`, 2 ô nhập số tiền) | Nhất quán với ô "Ngân sách" danh mục (`toLocaleString` + phân cách nghìn, `type="text"`) | `String(amount)` + `type="number"` — số lớn không có phân cách | Đã sửa — `toLocaleString("en-US")` + `type="text" inputMode="numeric"` + parse bỏ dấu phẩy |

Đối chiếu tiêu chí chấp nhận:

| AC | Đạt | Bằng chứng |
| --- | --- | --- |
| AC-01 | Đạt | `addIncomeSource`→`create`; `income = Σ amount`; tfoot + EL-10 dùng `selectedMonth.income` |
| AC-02 | Đạt | `commitIncomeSourceAmount`→`update`; `remaining`/`netSaving` = `totalIncome - totalActual` |
| AC-03 | Đạt | xóa hết → `Σ[] = 0`; `savingRate = totalIncome>0 ? … : null` → EL render "—" |
| AC-04 | Đạt | `netSaving`/`ratio`/`savingRate` tính trên `totalIncome` thật; `grep` mốc cứng → 0 |
| AC-05 | Đạt | `allocatedToSaving = categories.filter(c => c.type === "Tích lũy").reduce(+actual)` |
| AC-06 | Đạt | `pickInitialMonthId` (current→nearest→tie ưu tiên quá khứ); runtime: `/budget` chọn sẵn `2026-09` |
| AC-07 | Đạt | `assertMonthNotPast` ở 4 use-case purchase-item; `canEditPurchaseItems = selectedMonth.id >= currentMonthId` |
| AC-08 | Đạt | `create-month` không seed IncomeSource, `income: 0`; mốc cứng gỡ khỏi `TargetGrid` items + legend |
| AC-09 | Đạt | DB: 9 tháng backfill "Lương" = `income` cũ; `income` snapshot khớp |
| AC-10 | Đạt | `dropIncomeSource`→`reorder` set `order` theo index; `findByMonth`/snapshot sort `order` |
| AC-11 | Đạt | không luật chống trùng tên (DEC-136) |
| AC-12 | Đạt | catch→`showToast("Có lỗi xảy ra, vui lòng thử lại.")` + `refreshSnapshot()` |
| AC-13 | Đạt | `canEditMonth` false → `readOnly`, ẩn form/nút xóa/drag handle |

Đối chiếu Screen Element: EL-01..EL-09 (bảng Nguồn thu), EL-10..EL-13 + EL-22..EL-24 (insight badge), EL-14/EL-15 (Quy tắc kiểm soát / chú thích — mốc cứng gỡ), EL-16 (ô chọn tháng — giá trị mặc định), EL-17..EL-20 (Items cần mua — điều kiện tháng), EL-21 (toast lỗi) — **tất cả Có, đúng loại/nhãn/điều kiện**.

## 8. Fix Rounds

Pipeline không chạy fix round (`ssr-fix`) vì join = `Pass With Notes`. Hai finding `Low` (F-01, F-02) được orchestrator vá thẳng ngay sau review — không phải finding chặn, sửa để mã khớp pattern có sẵn của repo và giữ tiêu chuẩn "không bug" user yêu cầu.

| Vòng | Finding nhận | Nguyên nhân gốc | Thay đổi | Verification |
| --- | --- | --- | --- | --- |
| — (vá trực tiếp) | F-01 | Codex bỏ bước guard tập id mà `reorder-categories` có | `reorder-income-sources.ts` thêm kiểm `orderedIds` khớp `findByMonth(monthId)` | `tsc` exit 0, `next build` pass |
| — (vá trực tiếp) | F-02 | Codex dùng `type="number"` + `String()` thay vì pattern `toLocaleString` của ô Ngân sách | `BudgetApp.tsx` `formatIncomeAmountInput` + 2 ô nhập | `tsc` exit 0, `next build` pass |

Finding bị từ chối: Không có.

Số vòng đã dùng: 0/2.

## 9. Blocker Và Follow-up

| # | Nội dung | Loại | Đề xuất |
| --- | --- | --- | --- |
| 1 | Cột `MonthBudget.income` giữ lại làm vestigial (không có đường ghi/đọc từ UI) | Nợ kỹ thuật | Sau khi US-022 chạy ổn định vài chu kỳ, một migration riêng có thể drop cột (JDG-035) |
| 2 | Repo không có test suite (`vitest` chưa cài, không có `tests/`) | Nợ kỹ thuật | Cân nhắc một requirement riêng thêm test cho các use-case bounded-context `budget` |
| 3 | `next lint` không chạy được (dự án chưa có cấu hình ESLint) | Nợ kỹ thuật | Ngoài phạm vi US-022; thêm `eslint.config.mjs` nếu muốn cổng lint |
| 4 | US-023 (layout Ant Design + responsive toàn app) sẽ dựng lại giao diện tab Thu chi trên nền US-022 | Thứ tự | Làm tiếp US-023 (DEC-132) |

## 10. Rollback

| Hạng mục | Cách hoàn tác |
| --- | --- |
| Source | `git checkout -- components/BudgetApp.tsx server/budget/` + xóa 7 file mới; revert `server/budget/actions.ts` |
| Migration SQLite | Xóa `prisma/migrations/20260907005635_add_income_source/`, khôi phục `prisma/dev.db` từ `prisma/backups/dev.db.us-022-before-income-source.20260907075606.bak`, `./node_modules/.bin/prisma generate`, revert `prisma/schema.prisma` |
| Dữ liệu đã backfill | Nằm trong backup db ở trên; hoặc `DELETE FROM IncomeSource` (cột `MonthBudget.income` vẫn còn giá trị gốc) |
| DBML | Revert `docs/db/schema.dbml` |
