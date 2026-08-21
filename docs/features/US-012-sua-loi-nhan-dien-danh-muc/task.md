# Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi — Phân Rã Task

Status: Implemented
Feature: US-012
Plan: plan.md
Spec: spec.md
Created: 2026-08-06
Updated: 2026-08-06
Owner: ssr-breaker

## 1. Input Nguồn

| File | Đã dùng để làm gì |
| --- | --- |
| `spec.md` | 5 tiêu chí chấp nhận (AC-01..AC-05), Screen Element `EL-01` |
| `plan.md` | Mục 5 (luồng end-to-end), mục 8 (bản đồ source impact — chỉ 1 file), mục 10 (contract nội bộ), mục 11 (file sẽ thay đổi), mục 14 (phân rã đề xuất) |
| `data-model.md` | Không áp dụng — plan mục 9 xác nhận không đổi schema |

## 2. Breakdown Summary

- Phạm vi: Sửa hàm nhận diện danh mục khi nhập nhanh trong `components/BudgetApp.tsx` — thêm so khớp gần đúng khi tên danh mục đã bị đổi, để không còn ghi nhận âm thầm thất bại.
- Phụ thuộc chặn: Không — `US-001`/`US-005` đã Delivered, không cần chờ gì thêm.
- Số task: 2
- Readiness: Ready

## 3. Task Checklist

| ID | Outcome | File / Khu vực | Depends On | AC / Contract | Verification | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TB-01` | Hàm thuần `findQuickCategoryMatch` thêm vào `components/BudgetApp.tsx`; `onChange` ô nhập nội dung và `inferredQuickCategory` dùng hàm này để so khớp gần đúng với danh mục thật thay vì trả thẳng nhãn rule cố định | `components/BudgetApp.tsx` | None | AC-01, AC-02, AC-03, AC-04, AC-05; Contract `inferredQuickCategory` (plan mục 10) | `rtk tsc --noEmit` | Done | `rtk tsc --noEmit` → 0 lỗi, 2026-08-06; `rtk next build` → Errors: 0, Warnings: 0 |
| `TB-02` | Verification tổng hợp: typecheck, build, đủ 5 AC kiểm chứng thủ công trên `next dev`; cập nhật DEV wiki mục 5/7 với kết quả thật | `docs/kb/dev/wiki/US-012-sua-loi-nhan-dien-danh-muc.md` | `TB-01` | AC-01..AC-05 | `rtk tsc --noEmit`, `rtk next build`, thao tác thủ công đủ 5 AC | Done | `rtk tsc --noEmit` → 0 lỗi; `rtk next build` → Errors: 0, Warnings: 0. Thủ công trên `next dev`: AC-01 đổi tên "Ăn uống"→"Ăn uống & đi chợ", gõ "ăn tối 300k" → dropdown/preview đúng "Ăn uống & đi chợ" (trước đây hiện sai "Chưa xác định"), Ghi nhận thành công, Chi thực tế 300.000đ; AC-02 xóa hẳn danh mục đó, gõ lại "ăn tối 300k" → dropdown "Chưa xác định", Ghi nhận vẫn thành công, gộp vào danh mục dự phòng hiện có (không tạo bản ghi mới, Chi thực tế cộng dồn đúng); AC-03 gõ "khám bệnh 50k" (danh mục "Sức khỏe / cá nhân" chưa đổi tên) → dropdown đúng như cũ, Ghi nhận thành công — không phá vỡ hồi quy; AC-04 tạo 2 danh mục cùng chứa "Ăn uống" ("Ăn uống linh tinh" đứng trước "Ăn uống & đi chợ"), gõ "ăn tối 300k" → dropdown chọn đúng "Ăn uống linh tinh" (đầu tiên theo thứ tự hiển thị), xác nhận lại sau khi reload trang (server-persisted) — đúng danh mục đó có Chi thực tế 300.000đ; AC-05 xác nhận qua cùng nhánh code với AC-02 (mảng danh mục rỗng cũng trả `undefined` từ `findQuickCategoryMatch`, không dựng riêng được kịch bản tháng trống hoàn toàn qua UI vì danh mục dự phòng bị khóa không xóa được — đúng như rủi ro đã ghi ở `plan.md` mục 13). Ghi chú môi trường (không phải defect của US-012): dữ liệu test có sẵn một danh mục dự phòng tên "Chi tiêu khácc" (thừa một chữ "c") do nhiễu từ phiên dev server khác chạy song song cùng `dev.db` trong các lượt trước — đã xác nhận vẫn `isFallback=true` (không có input, không nút xóa), không ảnh hưởng tính đúng đắn của fix này. |

Task bắt buộc phải có (khi áp dụng):

- Migration Prisma + đồng bộ DBML — Không áp dụng, `data` stage đã `skipped`.
- Cập nhật BA/DEV function wiki — DEV wiki đã tạo ở stage `plan`; `TB-02` cập nhật lại với kết quả triển khai thật.
- Cập nhật memory — `DEC-059`, `DEC-060` đã ghi ở stage `ba`; không phát sinh quyết định mới ở breakdown này.
- Verification cuối — `TB-02`.

## 4. Ma Trận Coverage

| AC / contract / khu vực ảnh hưởng | Task IDs | Ghi chú |
| --- | --- | --- |
| AC-01 | `TB-01`, `TB-02` | Danh mục đổi tên, so khớp gần đúng thành công |
| AC-02 | `TB-01`, `TB-02` | Không danh mục nào khớp (kể cả gần đúng) → "Chi tiêu khác" |
| AC-03 | `TB-01`, `TB-02` | Danh mục chưa đổi tên — hồi quy, không phá vỡ hành vi cũ |
| AC-04 | `TB-01`, `TB-02` | Nhiều danh mục cùng khớp gần đúng — lấy cái đầu theo thứ tự hiển thị |
| AC-05 | `TB-01`, `TB-02` | Tháng trống danh mục — vẫn ghi nhận được, vào "Chi tiêu khác" |
| Contract `inferredQuickCategory` (plan mục 10) | `TB-01` | Đổi ý nghĩa nội bộ, không breaking vì không có consumer khác |
| Knowledge base / memory (impact checklist) | `TB-02` | Cập nhật DEV wiki cuối cùng |

## 5. Thứ Tự Dependency

1. `TB-01`
2. `TB-02`

## 6. Cổng Sẵn Sàng

- [x] Mọi khu vực trong impact checklist đều có task.
- [x] Mọi tiêu chí chấp nhận đều map tới ít nhất một task.
- [x] Dependency có thứ tự và không vòng lặp.
- [x] Mỗi task có cách verification riêng.
- [x] Cập nhật knowledge base, memory và verification cuối là task tường minh.
- [x] Không task nào gộp các thay đổi cần verify độc lập.
- [x] Không task nào cần đọc source mới hiểu được kết quả mong đợi.

## 7. Blocker Và Câu Hỏi Mở

- Không có.
