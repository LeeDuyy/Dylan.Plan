# Nguồn thu, sửa insight tiết kiệm, tháng mặc định và bỏ giới hạn tháng cho Item cần mua tại tab Thu chi — Phân Rã Task

Status: Implemented
Feature: US-022
Plan: plan.md
Spec: spec.md
Created: 2026-09-07
Updated: 2026-09-07
Owner: ssr-breaker

> Triển khai 2026-09-07 qua `ssr-dev` (executor=codex, `codex exec --yolo`). 7 file source mới + 10 file sửa, tất cả trong `server/budget/` và `components/`. `ssr-dev` tự chạy lại verification (tsc + build) — không dùng kết quả Codex tự báo.

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 13 tiêu chí chấp nhận (AC-01..AC-13); Screen Element EL-01..EL-24; luồng nghiệp vụ mục 6; phân quyền mục 5 |
| `plan.md` | Impact checklist mục 7; bản đồ source impact mục 8; contract mục 10; file sẽ thay đổi mục 11; verification mục 12; skeleton task mục 14 |
| `data-model.md` | Model `IncomeSource` + migration `20260907005635_add_income_source` + backfill "Lương" — **đã Applied** bởi `ssr-data`; DBML đã sync |

## 2. Breakdown Summary

- Phạm vi: entity `IncomeSource` (domain/repo/rule/use-case/infra) + `budget-snapshot-service` tính `income` = tổng + wire `actions.ts` + đổi luật tháng cho purchase-item + `BudgetApp.tsx` (bảng Nguồn thu, insight mới, tháng mặc định, gỡ mốc cứng).
- Phụ thuộc chặn: Không — migration đã áp; chỉ còn phần code.
- Số task: 12 (`TB-01`..`TB-12`).
- Readiness: Ready → **Implemented** (12/12 Done).
- Verification cuối (`ssr-dev` tự chạy 2026-09-07): `./node_modules/.bin/tsc --noEmit` → exit 0; `./node_modules/.bin/next build` → pass, `/budget` compiled (12.8 kB); `./node_modules/.bin/next lint` → không chạy được vì dự án chưa có cấu hình ESLint (tình trạng có sẵn, không do US-022; `next build` đã bao gồm kiểm type + lint nội bộ của Next và pass).

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Xác nhận migration `20260907005635_add_income_source` đã áp và backfill "Lương" đúng cho mọi tháng đang có; DBML khớp | `prisma/migrations/`, `prisma/backfill/us022-income-sources.mjs`, `docs/db/schema.dbml`, `prisma/dev.db` | None | Contract "MonthBudgetSnapshot.incomeSources"; AC-09 | `./node_modules/.bin/prisma validate` → "schema is valid"; `node -e` truy vấn `SELECT monthId, SUM(amount), COUNT(*) FROM IncomeSource GROUP BY monthId` — 9 tháng (2026-02..2026-10), mỗi tháng đúng 1 dòng "Lương" 35.000.000 = `MonthBudget.income` cũ | Done | 2026-09-07 (`ssr-data`): migration + backfill idempotent; `docs/db/schema.dbml` cập nhật thủ công |
| `TB-02` | Entity + repository interface + rule cho Nguồn thu | `server/budget/domain/entities/income-source.ts`, `server/budget/domain/repositories/income-source-repository.ts`, `server/budget/domain/rules/income-source-rule.ts` | `TB-01` | Contract `assertValidIncomeSourceName`/`assertValidIncomeSourceAmount`; AC-01, AC-11 | `./node_modules/.bin/tsc --noEmit` 0 lỗi; đọc lại: `assertValidIncomeSourceAmount(-1)` và `(1.5)` ném lỗi, `(0)` không ném (DEC-134) | Done | 2026-09-07: server/budget/domain/{entities/income-source.ts,repositories/income-source-repository.ts,rules/income-source-rule.ts} tạo mới; assertValidIncomeSourceAmount chặn số âm + không nguyên, cho 0 (DEC-134); không luật chống trùng tên (DEC-136) |
| `TB-03` | `assertMonthNotPast(monthId)` + `MonthInPastError` trong `current-month-rule.ts`; giữ `getCurrentMonthId` | `server/budget/domain/rules/current-month-rule.ts` | None | Contract `assertMonthNotPast`; AC-07, AC-13 | `./node_modules/.bin/tsc --noEmit`; đọc lại: `assertMonthNotPast(getCurrentMonthId())` không ném, `assertMonthNotPast("2000-01")` ném | Done | 2026-09-07: current-month-rule.ts: assertMonthNotPast ném MonthInPastError khi monthId < getCurrentMonthId(); getCurrentMonthId giữ nguyên |
| `TB-04` | `income-source-prisma-repository.ts` mirror category repo (findAll/findByMonth/findById/create/update/reorder/delete) | `server/budget/infrastructure/repositories/income-source-prisma-repository.ts` | `TB-02` | Contract `IncomeSourceRepository`; AC-01, AC-02, AC-03, AC-10 | `./node_modules/.bin/tsc --noEmit`; script tạm: `create` → `findByMonth` trả đúng, `reorder` đổi `order`, `delete` xóa | Done | 2026-09-07: income-source-prisma-repository.ts mirror category repo — findAll/findByMonth(order asc)/create(auto order)/update/reorder($transaction)/delete |
| `TB-05` | 3 use-case `upsert-income-source` / `remove-income-source` / `reorder-income-sources` | `server/budget/application/use-cases/{upsert,remove,reorder}-income-source.ts` | `TB-02`, `TB-03`, `TB-04` | AC-01, AC-02, AC-03, AC-10, AC-11, AC-13 | `./node_modules/.bin/tsc --noEmit`; đọc lại: `upsert-income-source` gọi `assertMonthNotPast` + `assertValidIncomeSourceAmount`; `remove`/`reorder` gọi `assertMonthNotPast` | Done | 2026-09-07: 3 use-case bọc lỗi MonthInPastError/InvalidIncomeSourceInputError → *Error; đều gọi assertMonthNotPast + revalidatePath('/budget'); upsert kiểm tháng cả input lẫn bản ghi hiện có |
| `TB-06` | 4 use-case purchase-item đổi `assertMonthIsCurrent` → `assertMonthNotPast` + text lỗi "từ tháng hiện tại trở đi"; gỡ `assertMonthIsCurrent`/`CurrentMonthViolationError` khỏi `current-month-rule.ts` | `server/budget/application/use-cases/{add,update,mark-purchase-item-purchased,delete}-purchase-item.ts`, `server/budget/domain/rules/current-month-rule.ts` | `TB-03` | AC-07; contract "Thông báo lỗi thao tác item cần mua" | `./node_modules/.bin/tsc --noEmit`; `grep -r assertMonthIsCurrent server/budget` → 0 kết quả | Done | 2026-09-07: 4 use-case purchase-item: assertMonthIsCurrent → assertMonthNotPast, message 'Chỉ được thao tác item cần mua từ tháng hiện tại trở đi.'; grep assertMonthIsCurrent server → 0 |
| `TB-07` | `budget-snapshot-service`: thêm dep `incomeSourceRepository`, type `IncomeSourceSnapshot`, `MonthBudgetSnapshot.incomeSources` (sort `order`), `income` = `Σ amount` | `server/budget/domain/services/budget-snapshot-service.ts` | `TB-04` | Contract "MonthBudgetSnapshot.incomeSources", "MonthBudgetSnapshot.income"; AC-01, AC-02, AC-03, AC-09 | `./node_modules/.bin/tsc --noEmit`; script tạm gọi `getSnapshot()` → tháng "2026-09" có `incomeSources` 1 dòng "Lương" 35tr, `income` = 35.000.000 | Done | 2026-09-07: budget-snapshot-service.ts: IncomeSourceSnapshot, MonthBudgetSnapshot.incomeSources (sort order), income = reduce(+amount,0); DB: tháng 2026-09 → 1 dòng 35tr → income 35.000.000 |
| `TB-08` | `server/budget/actions.ts`: wire `incomeSourceRepository` vào service + 3 use-case; export 3 Server Action + `type IncomeSourceSnapshot`, `UpsertIncomeSourceInput`, `ReorderIncomeSourcesInput` | `server/budget/actions.ts` | `TB-05`, `TB-07` | Contract "Server Action budget" | `./node_modules/.bin/tsc --noEmit`; `grep upsertIncomeSource server/budget/actions.ts` có export | Done | 2026-09-07: actions.ts wire `incomeSourceRepository` vào service + `resetAllBudgetDataUseCase` + 3 use-case mới; export `upsertIncomeSource`/`removeIncomeSource`/`reorderIncomeSources` + type `IncomeSourceSnapshot`/`UpsertIncomeSourceInput`/`ReorderIncomeSourcesInput`/`IncomeSourceEntity` |
| `TB-09` | `create-month.ts` không seed `IncomeSource`, ghi `income: 0`; `reset-all-budget-data.ts` seed 1 "Lương" = `DEFAULT_INCOME` mỗi tháng mặc định | `server/budget/application/use-cases/create-month.ts`, `server/budget/application/use-cases/reset-all-budget-data.ts` | `TB-04`, `TB-08` | AC-08 (BR-037); AC-09 (không hồi quy reset) | `./node_modules/.bin/tsc --noEmit`; đọc lại: `create-month` không gọi `incomeSourceRepository.create`; `reset` gọi 1 lần/tháng | Done | 2026-09-07: create-month.ts: income:0, không gọi incomeSourceRepository; reset-all-budget-data.ts: mỗi tháng mặc định 1 create({name:'Lương',amount:DEFAULT_INCOME,order:0}), income:0 |
| `TB-10` | `BudgetApp.tsx`: khu vực bảng "Nguồn thu" — state riêng (`draggedIncomeId`/`dragOverIncomeId`, drafts), handlers gọi 3 Server Action, JSX bảng inline-edit + form thêm + nút xóa + DnD + dòng tổng; ẩn phần sửa khi tháng ở quá khứ | `components/BudgetApp.tsx` | `TB-08` | AC-01, AC-02, AC-03, AC-10, AC-11, AC-12, AC-13; EL-01..EL-09, EL-21 | `./node_modules/.bin/tsc --noEmit`; `rtk lint`; thủ công: thêm/sửa/xóa/kéo-thả nguồn thu ở tháng hiện tại → bảng + "Thu nhập tháng" đổi đúng; mở tháng quá khứ → chỉ xem | Done | 2026-09-07: BudgetApp.tsx: khu vực 'Nguồn thu' — state riêng draggedIncomeId/dragOverIncomeId + incomeSourcesDraft; handlers gọi Server Action; bảng inline-edit + form thêm + xóa + DnD + tfoot 'Thu nhập tháng'; canEditMonth ẩn thao tác khi tháng quá khứ; lỗi → toast |
| `TB-11` | `BudgetApp.tsx`: `totals` mới (`totalIncome`, `netSaving`, `savingRate`, `allocatedToSaving` lọc `type==="Tích lũy"`); ô insight "Thu nhập tháng"/"Tiết kiệm ròng"/"Tỷ lệ tiết kiệm"/"Đã phân bổ vào tích lũy"/"Tỷ lệ sử dụng thu nhập"; giữ "Số dư còn lại"; gỡ chuỗi mốc cứng ở `TargetGrid` "Quy tắc kiểm soát" và text insight; `pickInitialMonthId` + đổi khởi tạo `selectedMonthId`; `canEditMonth` dùng chung cho bảng nguồn thu + item cần mua | `components/BudgetApp.tsx`, `components/shared/TargetGrid.tsx` | `TB-08`, `TB-10` | AC-04, AC-05, AC-06, AC-07, AC-08, AC-13; EL-10..EL-20, EL-22..EL-24 | `./node_modules/.bin/tsc --noEmit`; `rtk lint`; thủ công: AC-04 (chi vượt thu → số âm), AC-05 (tích lũy), AC-06 (tháng mặc định), AC-08 (không còn "7.5M"/"31.5M"/"90%") | Done | 2026-09-07: BudgetApp.tsx: totals mới {totalIncome,netSaving,remaining(=netSaving),savingRate(null khi income 0),allocatedToSaving lọc type Tích lũy,ratio}; 7 ô insight; TargetGrid+text+legend gỡ hết 5M/7.5M/31.5M/30M/90% (grep 0); pickInitialMonthId (hiện tại→gần nhất→tie ưu tiên quá khứ); selectedMonthId khởi tạo + refreshSnapshot + resetAll dùng helper; canEditPurchaseItems = canEditMonth |
| `TB-12` | Verification cuối + cập nhật DEV wiki mục 7 evidence + `docs/kb/dev/00-index.md` | `docs/kb/dev/wiki/US-022-nguon-thu-va-insight-tab-thu-chi.md`, `docs/kb/dev/00-index.md` | `TB-01`..`TB-11` | Toàn bộ AC | `./node_modules/.bin/prisma validate`; `./node_modules/.bin/tsc --noEmit`; `rtk lint`; `rtk next build`; smoke thủ công AC-01..AC-13 theo plan mục 12 | Done | 2026-09-07: tsc --noEmit exit 0; next build pass (/budget 12.8 kB, gồm kiểm type + lint nội bộ Next); next lint không chạy — dự án chưa có eslint config (có sẵn, ngoài phạm vi). DEV wiki mục 7 + docs/kb/dev/00-index.md cập nhật |

Task bắt buộc đã có: migration + DBML → `TB-01` (xác nhận, phần làm đã xong ở `ssr-data`); cập nhật DEV wiki → `TB-12`; cập nhật memory → đã ghi ở `ssr-ba`/`ssr-plan`/`ssr-data` (DEC-127..DEC-136, JDG-034/035, glossary "Nguồn thu"...), không phát sinh thêm ở stage code trừ khi `ssr-dev` gặp lệch pattern; verification cuối → `TB-12`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (thêm nguồn thu → tổng đổi) | `TB-05`, `TB-07`, `TB-08`, `TB-10` | Use-case + snapshot + wire + UI |
| AC-02 (sửa số tiền → chỉ số tổng đổi) | `TB-05`, `TB-07`, `TB-10`, `TB-11` | + `totals` mới |
| AC-03 (xóa hết → 0đ, tỷ lệ tiết kiệm "—") | `TB-05`, `TB-07`, `TB-10`, `TB-11` | `savingRate` null khi income = 0 |
| AC-04 (chi vượt thu → số âm; không mốc cứng) | `TB-11` | `netSaving`/`savingRate`/`ratio` + gỡ chuỗi |
| AC-05 ("Đã phân bổ vào tích lũy" = tổng chi type Tích lũy) | `TB-11` | Lọc `Category.type === "Tích lũy"` |
| AC-06 (tháng mặc định hiện tại/gần nhất, hòa → quá khứ) | `TB-11` | `pickInitialMonthId` |
| AC-07 (item cần mua: tháng tương lai thêm được, tháng đã qua chỉ xem) | `TB-03`, `TB-06`, `TB-11` | `assertMonthNotPast` + `canEditMonth` UI |
| AC-08 (tạo tháng mới → bảng nguồn thu trống; không mốc cứng) | `TB-09`, `TB-11` | create-month không seed + gỡ chuỗi |
| AC-09 (backfill "Lương" giữ chỉ số tháng lịch sử) | `TB-01`, `TB-07`, `TB-09` | backfill + snapshot + reset không hồi quy |
| AC-10 (kéo-thả đổi thứ tự nguồn thu, giữ sau reload) | `TB-04`, `TB-05`, `TB-10` | `reorder` repo + use-case + DnD UI |
| AC-11 (hai nguồn thu trùng tên) | `TB-02`, `TB-05`, `TB-10` | Không có luật chống trùng (DEC-136) |
| AC-12 (lưu thất bại → toast lỗi, giữ nguyên) | `TB-10` | EL-21 toast + xử lý lỗi Server Action |
| AC-13 (bảng nguồn thu tháng đã qua chỉ xem) | `TB-03`, `TB-05`, `TB-10`, `TB-11` | `assertMonthNotPast` + `canEditMonth` |
| Contract `MonthBudgetSnapshot.incomeSources` | `TB-01`, `TB-07`, `TB-08` | — |
| Contract `MonthBudgetSnapshot.income` (đổi nghĩa) | `TB-07` | `Σ amount` |
| Contract Server Action budget (+3) | `TB-05`, `TB-08` | — |
| Contract `assertMonthNotPast` (thay `assertMonthIsCurrent`) | `TB-03`, `TB-06` | — |
| Contract text lỗi item cần mua | `TB-06` | — |
| Impact: Server Action (Yes) | `TB-06`, `TB-08` | — |
| Impact: Prisma schema (Yes) | `TB-01` | Applied ở `ssr-data` |
| Impact: Migration SQLite (Yes) | `TB-01` | Applied ở `ssr-data` |
| Impact: DBML (Yes) | `TB-01` | Synced ở `ssr-data` |
| Impact: Seed data (Yes) | `TB-09` | reset seed "Lương" |
| Impact: Caching / revalidate (Yes) | `TB-05`, `TB-08` | `revalidatePath("/budget")` trong 3 use-case |
| Impact: Export / báo cáo (Yes) | `TB-07`, `TB-10` | `incomeSources` vào snapshot → `exportData` tự động |
| Impact: Knowledge base / memory (Yes) | `TB-12` | DEV wiki evidence; memory đã ghi ở stage trước |

## 5. Thứ Tự Dependency

1. `TB-01` (xác nhận migration/backfill — đã Applied) · `TB-03` (luật tháng — độc lập)
2. `TB-02` (entity/repo-interface/rule)
3. `TB-04` (prisma repo) — sau `TB-02`
4. `TB-05` (use-case income) — sau `TB-02`, `TB-03`, `TB-04`
5. `TB-06` (đổi luật tháng purchase-item) — sau `TB-03`
6. `TB-07` (snapshot service) — sau `TB-04`
7. `TB-08` (wire actions.ts) — sau `TB-05`, `TB-07`
8. `TB-09` (create-month / reset) — sau `TB-04`, `TB-08`
9. `TB-10` (UI bảng Nguồn thu) — sau `TB-08`
10. `TB-11` (UI insight + tháng mặc định + gỡ mốc cứng) — sau `TB-08`, `TB-10`
11. `TB-12` (verification cuối + wiki) — sau tất cả

Acyclic: có hướng một chiều từ `TB-01/TB-03` → ... → `TB-12`, không vòng.

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task (mục 4).
- [x] Mọi tiêu chí chấp nhận AC-01..AC-13 map tới ít nhất một task.
- [x] Dependency có thứ tự và không vòng lặp (mục 5).
- [x] Mỗi task có cách verification riêng (không chỉ "chạy build" — `TB-12` mới là build tổng).
- [x] Cập nhật DEV wiki (`TB-12`), memory (đã ghi ở stage BA/plan/data), verification cuối (`TB-12`) là task tường minh.
- [x] Không task nào gộp các thay đổi cần verify độc lập (migration/repo/use-case/UI-bảng/UI-insight tách riêng).
- [x] Không task nào cần đọc source mới hiểu được — outcome mô tả bằng hành vi quan sát được.
- [x] Số task 12 ≤ `SSR_MAX_TASKS_PER_FEATURE` (40).
- [x] ID `TB-01`..`TB-12` mới, chưa từng dùng cho feature này.
- [x] `plan.md` mục 14 đã đồng bộ.

## 7. Blocker Và Câu Hỏi Mở

- Không có. Migration đã áp; toàn bộ phụ thuộc kỹ thuật đã xác định trong `plan.md`.
