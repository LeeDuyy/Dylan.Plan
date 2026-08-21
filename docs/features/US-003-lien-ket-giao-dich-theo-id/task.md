# Liên kết giao dịch theo danh mục bằng ID — Phân Rã Task

Status: Implemented
Feature: US-003
Plan: plan.md
Spec: spec.md
Created: 2026-08-05
Updated: 2026-08-05
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 3 tiêu chí chấp nhận (AC-01..AC-03), Screen Element mục 8, Handoff mục 13 |
| `plan.md` | Xác nhận không có file nào cần sửa (mục 11); Bản Đồ Source Impact (mục 8) toàn "Không đổi"; Kế hoạch Verification (mục 12) |
| `data-model.md` | Không áp dụng — `plan.md` mục 9 xác nhận `Cần đổi schema: Không`, stage `data` bị bỏ qua |

## 2. Breakdown Summary

- Phạm vi: xác nhận lại bằng thao tác thật rằng hành vi liên kết giao dịch theo `categoryId` (đã triển khai cùng `US-001`) khớp đúng 3 AC của spec — không viết code mới.
- Phụ thuộc chặn: Không — `US-001` đã Delivered With Notes, đang chạy tốt.
- Số task: 6
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Kiểm chứng AC-01: ghi giao dịch mới vào danh mục trống, xác nhận gắn đúng danh mục và "Chi thực tế" cập nhật đúng | Không đổi source — chỉ thao tác qua UI thật (`/budget`) | None | AC-01 | Thao tác thủ công: ghi một giao dịch nhập nhanh vào danh mục chưa có giao dịch nào, xác nhận giao dịch hiện đúng ở bảng chi tiết chi tiêu và "Chi thực tế" đổi đúng số tiền | Done | Thao tác thật qua `next dev` (`localhost:3000/budget`, 2026-08-06): gõ "cafe 45k" vào ô nhập nhanh (danh mục "Giải trí / cafe" đang 0đ), bấm "Ghi nhận" → giao dịch "cafe 45k" xuất hiện ở bảng chi tiết chi tiêu gắn đúng "Giải trí / cafe"; "Chi thực tế" của danh mục đổi từ 0đ → 45.000đ, Chênh lệch đổi 1.500.000đ → 1.455.000đ |
| `TB-02` | Kiểm chứng AC-02: "Chi thực tế" của danh mục có ≥ 2 giao dịch bằng đúng tổng các giao dịch đó | Không đổi source | `TB-01` | AC-02 | Thao tác thủ công: mở bảng ngân sách theo danh mục của một danh mục đang có ≥ 2 giao dịch, đối chiếu số hiển thị với tổng cộng tay | Done | Danh mục "Di chuyển" đã có sẵn giao dịch "10k di chuyển" (-10.000đ) từ trước; ghi thêm "grab 20k" (-20.000đ) → bảng ngân sách hiện "Chi thực tế" = 30.000đ, đúng bằng 10.000 + 20.000 |
| `TB-03` | Kiểm chứng AC-03: đổi tên một danh mục đang có giao dịch, xác nhận giao dịch cũ vẫn hiển thị đúng dưới tên mới và "Chi thực tế" không đổi | Không đổi source | `TB-01` | AC-03 | Thao tác thủ công: đổi tên một danh mục đang có giao dịch, xác nhận bảng chi tiết chi tiêu và bảng ngân sách đều hiện đúng tên mới, "Chi thực tế" giữ nguyên | Done | Đổi tên "Giải trí / cafe" (đang có giao dịch "cafe 45k") thành "Giải trí / cafe / trà sữa" (onBlur) → giao dịch "cafe 45k" ở bảng chi tiết chi tiêu tự đổi hiển thị đúng tên mới ngay; "Chi thực tế" giữ nguyên 45.000đ, Chênh lệch giữ nguyên 1.455.000đ — không tách danh mục, không mất giao dịch |
| `TB-04` | Cập nhật DEV function wiki mục 7 (Verification) với kết quả lệnh và thao tác thật; đặt `Status: Active` khi mọi task khác `Done` | `docs/kb/dev/wiki/US-003-lien-ket-giao-dich-theo-id.md` | `TB-01`, `TB-02`, `TB-03` | Không áp dụng | Đọc lại file, xác nhận không còn placeholder | Done | Đã cập nhật mục 7 với kết quả lệnh + 3 thao tác thật; `Status: Active` |
| `TB-05` | Ghi memory nếu phát sinh nhận định/quyết định mới trong lúc xác nhận; xác nhận `glossary.md` không cần thêm thuật ngữ | `docs/memory/decisions.md`, `docs/memory/judgement-log.md`, `docs/memory/glossary.md` | `TB-01`, `TB-02`, `TB-03` | Không áp dụng | Đọc lại 3 file, xác nhận nhất quán | Done | Phát sinh `JDG-009` (bác bỏ `JDG-008`): nguyên nhân thật của lỗi kiểm chứng browser automation ở US-002 là dev server cũ đã treo, không phải giới hạn công cụ với React 19 — đã ghi vào `judgement-log.md`. Không có quyết định mới. `glossary.md` không cần thêm thuật ngữ |
| `TB-06` | Verification cuối: chạy đủ lệnh ở `plan.md` mục 12 (`typecheck`, `prisma validate`, `build`; `test` ghi nhận gap đã biết) | Toàn bộ — xác nhận trạng thái ổn định | `TB-04`, `TB-05` | AC-01..AC-03 | `rtk tsc --noEmit`, `rtk npx prisma validate`, `rtk next build` | Done | `rtk tsc --noEmit` → "No errors found"; `rtk npx prisma validate` → schema hợp lệ; `rtk next build` → `Errors: 0, Warnings: 0`; `rtk vitest run` → gap đã biết, không cài, thay bằng 3 thao tác thủ công ở TB-01..TB-03 (2026-08-06) |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Không áp dụng (`plan.md` mục 9 xác nhận không đổi schema).
- Cập nhật BA/DEV function wiki — `TB-04` (DEV wiki; BA wiki đã đồng bộ ở stage `ba`).
- Cập nhật memory — `TB-05`.
- Verification cuối — `TB-06`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 (ghi giao dịch mới gắn đúng danh mục) | `TB-01`, `TB-06` | |
| AC-02 ("Chi thực tế" đúng tổng giao dịch) | `TB-02`, `TB-06` | |
| AC-03 (đổi tên danh mục giữ liên kết giao dịch cũ) | `TB-03`, `TB-06` | |
| Plan mục 7 — Knowledge base/memory: Yes | `TB-04`, `TB-05` | |
| Plan mục 10 — Contract `Transaction.categoryId` | `TB-01`, `TB-03` | |
| Plan mục 10 — Contract `TransactionSnapshot.categoryId` | `TB-01` | |

## 5. Thứ Tự Dependency

1. `TB-01`
2. `TB-02`, `TB-03` (song song, cùng phụ thuộc `TB-01` vì cần ít nhất một giao dịch đã ghi để kiểm AC-02/AC-03)
3. `TB-04`, `TB-05` (song song, cùng phụ thuộc `TB-01`, `TB-02`, `TB-03`)
4. `TB-06` (phụ thuộc `TB-04`, `TB-05`)

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task (toàn "No"/"N/A" nên không cần task riêng, chỉ verification cuối `TB-06` bao quát).
- [x] Mọi tiêu chí chấp nhận đều map tới ít nhất một task.
- [x] Dependency có thứ tự và không vòng lặp.
- [x] Mỗi task có cách verification riêng.
- [x] Cập nhật knowledge base, memory và verification cuối là task tường minh (`TB-04`, `TB-05`, `TB-06`).
- [x] Không task nào gộp các thay đổi cần verify độc lập (3 AC tách 3 task riêng).
- [x] Không task nào cần đọc source mới hiểu được kết quả mong đợi.

## 7. Blocker Và Câu Hỏi Mở

Không có.
