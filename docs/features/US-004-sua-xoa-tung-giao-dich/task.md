# Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu — Phân Rã Task

Status: Ready
Feature: US-004
Plan: plan.md
Spec: spec.md
Created: 2026-08-05
Updated: 2026-08-05
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 11 tiêu chí chấp nhận (AC-01..AC-11), Screen Element mục 8, Handoff mục 13 |
| `plan.md` | Bản đồ Source Impact (mục 8), Impact Checklist (mục 7), Contract (mục 10), đề xuất task sơ bộ (mục 14) |
| `data-model.md` | Không áp dụng — `plan.md` mục 9 xác nhận không đổi schema |

## 2. Breakdown Summary

- Phạm vi: thêm `findById`/`update`/`delete` vào `TransactionRepository`, 2 use-case mới (`updateTransaction`, `deleteTransaction`), nối UI (nút Sửa/Xóa inline, bỏ giới hạn 8 dòng, xử lý lỗi xung đột đồng thời).
- Phụ thuộc chặn: Không — `US-001`/`US-003` đã Delivered, không cần chờ.
- Số task: 11
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | `TransactionRepository`: thêm `findById(id)`, `update(id, patch)`, `delete(id)` vào interface domain; implementation Prisma tương ứng | `server/budget/domain/repositories/transaction-repository.ts`, `server/budget/infrastructure/repositories/transaction-prisma-repository.ts` | None | Nền tảng cho AC-02, AC-03, AC-04, AC-06, AC-07, AC-10, AC-11 | `rtk tsc --noEmit` | Done | `ssr-dev` chạy lại `rtk tsc --noEmit` → 0 lỗi (2026-08-05). Code đối chiếu đúng khuôn mẫu `category-repository.ts` |
| `TB-02` | `application/use-cases/update-transaction.ts`: validate 4 trường (tái dùng `transaction-input-rule.ts`), kiểm tra `categoryId` thuộc đúng tháng, kiểm tra xung đột đồng thời bằng so khớp `expected` với giá trị hiện tại (`DEC-048`), gọi repository, `revalidatePath` | `server/budget/application/use-cases/update-transaction.ts` | `TB-01` | AC-02, AC-03, AC-04, AC-10, AC-11 | `rtk tsc --noEmit`; thao tác thủ công qua UI đã nối ở `TB-06`/`TB-08` | Done | `rtk tsc --noEmit` → 0 lỗi; thao tác thủ công qua `next dev` (2026-08-05): sửa số tiền "tiền nhà 50k" từ 50.000đ→60.000đ, Chi thực tế "Tiền nhà" 50.000→110.000đ (đúng, cộng với giao dịch gốc 50.000) — AC-02. Đổi danh mục giao dịch từ "Giải trí / cafe" sang "Di chuyển", amount di chuyển đúng giữa 2 danh mục theo aggregate — AC-03. Chọn ngày 2026-08-10 (tương lai) → chặn lưu, báo "Ngày giao dịch không được sau ngày hôm nay." — AC-04 |
| `TB-03` | `application/use-cases/delete-transaction.ts`: xóa một giao dịch, idempotent nếu đã không còn, `revalidatePath` | `server/budget/application/use-cases/delete-transaction.ts` | `TB-01` | AC-06 | `rtk tsc --noEmit`; thao tác thủ công qua UI đã nối ở `TB-07` | Done | `rtk tsc --noEmit` → 0 lỗi; thao tác thủ công: bấm Xác nhận xóa, giao dịch biến mất khỏi danh sách, Chi thực tế danh mục giảm đúng (110.000→50.000đ) — AC-06 (2026-08-05) |
| `TB-04` | `server/budget/actions.ts`: export Server Action `updateTransaction`, `deleteTransaction`, cùng type `UpdateTransactionInput` | `server/budget/actions.ts` | `TB-02`, `TB-03` | Hạ tầng cho mọi AC sửa/xóa | `rtk tsc --noEmit` | Done | `rtk tsc --noEmit` → 0 lỗi; `rtk next build` → `Errors: 0, Warnings: 0` (2026-08-05) |
| `TB-05` | `components/DylanPlanApp.tsx`: bỏ `.slice(0, 8)` ở khu vực "Giao dịch gần đây" — hiển thị toàn bộ giao dịch của tháng đang chọn, mới nhất lên đầu | `components/DylanPlanApp.tsx` | None | AC-08, AC-09 | `rtk tsc --noEmit`; thao tác thủ công: tạo tháng có >8 giao dịch, xác nhận hiển thị đủ; tháng trống hiển thị đúng danh sách rỗng | Done | Thao tác thủ công (2026-08-05): tạo 9 giao dịch (tổng 10 giao dịch trong tháng), danh sách hiển thị đủ 10 dòng, mới nhất lên đầu — không dừng ở 8 (AC-08). Sau khi "Reset chi tháng này", danh sách hiện đúng trạng thái rỗng "Chưa có giao dịch nhập nhanh trong tháng này." (AC-09) |
| `TB-06` | `components/DylanPlanApp.tsx`: nút "Sửa" mỗi dòng, form sửa inline 4 ô nhập (nội dung/số tiền/danh mục/ngày) điền sẵn giá trị hiện tại, nút Lưu (tắt khi nội dung rỗng hoặc số tiền không hợp lệ)/Hủy, gọi `updateTransaction` trong `try/catch`, hiển thị lỗi tại chỗ (trừ lỗi xung đột — xem `TB-08`) | `components/DylanPlanApp.tsx` | `TB-04`, `TB-05` | AC-01, AC-02, AC-03, AC-04, AC-07, AC-10 | `rtk tsc --noEmit`; thao tác thủ công: mở form sửa xác nhận đủ 4 trường (AC-01); sửa số tiền lưu thành công, Chi thực tế cập nhật (AC-02); đổi danh mục, Chi thực tế 2 bên đúng (AC-03); chọn ngày tương lai bị chặn (AC-04); bấm Hủy giữ nguyên giá trị cũ (AC-07); xóa trắng nội dung/số tiền âm thì nút Lưu tắt (AC-10) | Done | Thao tác thủ công (2026-08-05): bấm Sửa → form hiện đủ 4 trường đúng giá trị hiện tại qua DOM thật (AC-01). Xóa trắng ô nội dung → nút Lưu chuyển `disabled: true` (AC-10). Bấm Hủy sau khi gõ ngày tương lai bị lỗi → panel biến mất, giao dịch "an trua 65k" giữ nguyên 65.000đ/ngày cũ (AC-07) |
| `TB-07` | `components/DylanPlanApp.tsx`: nút "Xóa" mỗi dòng, chuyển dòng sang trạng thái xác nhận (thông báo + nút Xác nhận xóa/Hủy), gọi `deleteTransaction` khi xác nhận | `components/DylanPlanApp.tsx` | `TB-04`, `TB-05` | AC-05, AC-06 | `rtk tsc --noEmit`; thao tác thủ công: bấm Xóa hiện đúng hộp xác nhận, bấm Hủy giữ nguyên giao dịch (AC-05); bấm Xác nhận xóa thì giao dịch mất, Chi thực tế giảm đúng (AC-06) | Done | Thao tác thủ công (2026-08-05): bấm Xóa → hiện đúng "Bạn có chắc muốn xóa giao dịch này?" + 2 nút; bấm Hủy → giao dịch "tiền nhà 50k -60.000đ" vẫn còn nguyên trong danh sách (AC-05). Bấm lại Xóa → Xác nhận xóa → giao dịch biến mất, Chi thực tế "Tiền nhà" giảm đúng 110.000→50.000đ (AC-06) |
| `TB-08` | `components/DylanPlanApp.tsx`: bắt lỗi xung đột đồng thời từ `updateTransaction` (khi giao dịch đã bị đổi/xóa từ nơi khác), hiển thị đúng thông báo "Giao dịch này vừa được thay đổi ở nơi khác, hãy tải lại để xem bản mới nhất", không ghi đè | `components/DylanPlanApp.tsx` | `TB-06` | AC-11 | `rtk tsc --noEmit`; thao tác thủ công: mở form sửa một giao dịch, ở một script/tab khác gọi `deleteTransaction` cho cùng id, rồi bấm Lưu ở form đang mở — xác nhận báo đúng lỗi, không tạo lại giao dịch đã xóa | Done | Thao tác thủ công giả lập đa thiết bị thật (2026-08-05): mở form Sửa cho "an trua 65k" trên `next dev`, đồng thời chạy script Prisma xóa thẳng bản ghi đó trong `prisma/dev.db` (mô phỏng thiết bị khác vừa xóa), rồi bấm "Lưu" trên form đang mở → hiện đúng nguyên văn "Giao dịch này vừa được thay đổi ở nơi khác, hãy tải lại để xem bản mới nhất."; xác nhận lại bằng truy vấn DB — bản ghi KHÔNG bị tạo lại (`findFirst` trả `null`) — AC-11 đạt, `JDG-006` được xác nhận đứng vững với cách implement thật |
| `TB-09` | Cập nhật DEV function wiki mục 7 (Verification) với kết quả lệnh thật; đánh dấu `Status: Active` khi mọi task khác `Done` | `docs/kb/dev/wiki/US-004-sua-xoa-tung-giao-dich.md` | `TB-08` | Không áp dụng | Đọc lại file, xác nhận không còn placeholder | Done | Đã cập nhật `Status: Active`, mục 7 với 4 lệnh + 5 dòng thủ công đủ 11 AC (2026-08-05) |
| `TB-10` | Ghi memory: quyết định/nhận định phát sinh trong lúc code (nếu có, đặc biệt xác nhận lại `JDG-006` về cách phát hiện xung đột) vào `decisions.md`/`judgement-log.md`; xác nhận `glossary.md` không cần thêm thuật ngữ mới | `docs/memory/decisions.md`, `docs/memory/judgement-log.md`, `docs/memory/glossary.md` | `TB-08` | Không áp dụng | Đọc lại 3 file, xác nhận nhất quán với code đã viết | Done | `JDG-006` nâng từ "Active (chưa kiểm chứng)" lên "Confirmed" với bằng chứng thật (giả lập đa thiết bị). Không có quyết định kỹ thuật mới phát sinh trong lúc code (đúng như plan đã thiết kế). `glossary.md` không cần thêm thuật ngữ mới (2026-08-05) |
| `TB-11` | Verification cuối: chạy đủ lệnh ở `plan.md` mục 12 (`typecheck`, `prisma validate`, `build`; `test` ghi nhận gap đã biết) và kiểm chứng thủ công đủ 11 AC bằng thao tác thật trên UI | Toàn bộ file đã đổi | `TB-09`, `TB-10` | AC-01..AC-11 | `rtk tsc --noEmit`, `rtk npx prisma validate`, `rtk next build`; kiểm chứng thủ công theo `plan.md` mục 12 | Done | `rtk tsc --noEmit` → 0 lỗi; `rtk npx prisma validate` → hợp lệ; `rtk next build` → `Errors: 0, Warnings: 0`; `rtk vitest run` → gap đã biết (không cài). Toàn bộ 11 AC kiểm chứng bằng thao tác thật trên `next dev` (xem evidence từng TB ở trên) — AC-11 kiểm chứng bằng giả lập đa thiết bị thật qua script Prisma, không phải suy đoán (2026-08-05) |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — không áp dụng, `plan.md` mục 9 xác nhận không đổi schema.
- Cập nhật BA/DEV function wiki — `TB-09` (DEV wiki; BA wiki đã `Active` từ stage `ba`).
- Cập nhật memory — `TB-10`.
- Verification cuối — `TB-11`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (mở form sửa hiện đủ 4 trường) | `TB-06`, `TB-11` | |
| AC-02 (sửa số tiền → Chi thực tế cập nhật) | `TB-01`, `TB-02`, `TB-04`, `TB-06`, `TB-11` | |
| AC-03 (sửa danh mục → Chi thực tế 2 bên đúng) | `TB-01`, `TB-02`, `TB-04`, `TB-06`, `TB-11` | |
| AC-04 (chọn ngày tương lai → chặn lưu) | `TB-01`, `TB-02`, `TB-04`, `TB-06`, `TB-11` | Tái dùng `assertTransactionDateNotInFuture` |
| AC-05 (bấm Xóa → xác nhận hiện; Hủy → không đổi) | `TB-07`, `TB-11` | |
| AC-06 (Xác nhận xóa → giao dịch mất, Chi thực tế giảm) | `TB-01`, `TB-03`, `TB-04`, `TB-07`, `TB-11` | |
| AC-07 (Hủy sửa → giữ giá trị cũ) | `TB-06`, `TB-11` | |
| AC-08 (hiển thị toàn bộ tháng, không giới hạn 8) | `TB-05`, `TB-11` | Backend đã sẵn (`findAll` không giới hạn) — chỉ sửa UI |
| AC-09 (tháng trống → danh sách rỗng, không nút thao tác) | `TB-05`, `TB-11` | |
| AC-10 (nội dung rỗng/số tiền không hợp lệ → nút Lưu tắt) | `TB-06`, `TB-11` | Validate client-side, gương domain rule |
| AC-11 (xung đột sửa đồng thời → chặn lưu, báo lỗi) | `TB-01`, `TB-02`, `TB-08`, `TB-11` | `DEC-048`, `JDG-006` |
| Plan mục 7 — Server Action: Yes | `TB-04` | |
| Plan mục 7 — Caching/revalidate: Yes | `TB-02`, `TB-03` | `revalidatePath("/")` trong từng use-case |
| Plan mục 7 — Knowledge base/memory: Yes | `TB-09`, `TB-10` | |
| Contract — `TransactionRepository` thêm `findById`/`update`/`delete` | `TB-01` | |
| Contract — `server/budget/actions.ts` thêm 2 export | `TB-04` | |
| Contract — hành vi mutate có bắt lỗi hiển thị tại chỗ | `TB-06`, `TB-07`, `TB-08` | |

## 5. Thứ Tự Dependency

1. `TB-01`
2. `TB-02`, `TB-03` (song song, cùng phụ thuộc `TB-01`)
3. `TB-04` (phụ thuộc `TB-02`, `TB-03`)
4. `TB-05` (độc lập, không phụ thuộc tầng server)
5. `TB-06`, `TB-07` (song song, cùng phụ thuộc `TB-04`, `TB-05`)
6. `TB-08` (phụ thuộc `TB-06`)
7. `TB-09`, `TB-10` (song song, cùng phụ thuộc `TB-08`)
8. `TB-11` (phụ thuộc `TB-09`, `TB-10`)

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task (`TB-04` Server Action, `TB-02`/`TB-03` Caching/revalidate, `TB-09`/`TB-10` Knowledge base/memory).
- [x] Mọi tiêu chí chấp nhận đều map tới ít nhất một task.
- [x] Dependency có thứ tự và không vòng lặp.
- [x] Mỗi task có cách verification riêng.
- [x] Cập nhật knowledge base, memory và verification cuối là task tường minh (`TB-09`, `TB-10`, `TB-11`).
- [x] Không task nào gộp các thay đổi cần verify độc lập (repository/use-case/wiring/UI-sửa/UI-xóa/UI-xung đột tách riêng `TB-01`/`TB-02`+`TB-03`/`TB-04`/`TB-06`/`TB-07`/`TB-08`).
- [x] Không task nào cần đọc source mới hiểu được kết quả mong đợi.

## 7. Blocker Và Câu Hỏi Mở

- Không có blocker chặn bắt đầu. Gap đã biết (không chặn `Ready`, giống US-001): `vitest` chưa cài trong `package.json` — `TB-11` xác nhận lại bằng thao tác thủ công thay vì lệnh `SSR_CMD_TEST`.
- Lưu ý kỹ thuật cho `ssr-dev`: `JDG-006` (cách phát hiện xung đột đồng thời bằng so khớp toàn giá trị, không cần cột `updatedAt`) chưa được kiểm chứng bằng code thật — `TB-02`/`TB-08` là nơi xác nhận lại nhận định này, cập nhật `Status` của `JDG-006` trong `TB-10` nếu cần.
