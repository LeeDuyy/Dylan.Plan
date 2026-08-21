# US-001 — Lưu trữ chi tiêu bền vững (data model + migration)

Status: Active
Feature: US-001
Updated: 2026-08-03
Spec: `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md`
Raw: `docs/kb/ba/raw/US-001-luu-tru-chi-tieu-ben-vung.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Chuyển dữ liệu chi tiêu (tháng, danh mục, giao dịch) từ `localStorage` trình duyệt sang lưu trữ bền vững (Prisma + SQLite), để dữ liệu không mất khi xóa cache hoặc đổi máy. Phục vụ mục tiêu M1 của Business Flow.

## 2. Phạm Vi

Trong phạm vi:

- Data model cho tháng ngân sách, danh mục, giao dịch
- Migration Prisma tạo schema thật trên SQLite
- Di trú (migrate) một lần dữ liệu hiện có trong `localStorage` của Dylan sang DB mới
- "Chi thực tế" của danh mục là giá trị tính toán từ tổng giao dịch, không lưu cột riêng (DEC-007)

Ngoài phạm vi:

- Đăng nhập, phân quyền, nhiều tài khoản (DEC-004)
- Nơi lưu ngưỡng cấu hình (cảnh báo, mục tiêu chi, quỹ linh hoạt) — thuộc US riêng (US #9 trong backlog, chưa tạo raw)
- Route/module riêng `/budget` — thuộc US-002

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, Tạo, Sửa, Xóa | Single-user, không có khái niệm tài khoản/quyền (DEC-004) |

## 4. Luồng Nghiệp Vụ

1. Lần đầu Dylan mở Quản lý chi tiêu sau khi hệ thống chuyển sang lưu trữ bền vững, toàn bộ tháng/danh mục/giao dịch trong trình duyệt được chuyển vào nơi lưu trữ bền vững một lần, giữ nguyên nội dung.
2. Dylan ghi nhận giao dịch mới; giao dịch lưu bền vững và gắn với danh mục qua mã nhận diện cố định.
3. Dylan mở lại ứng dụng sau khi xóa dữ liệu trình duyệt hoặc trên thiết bị khác; toàn bộ dữ liệu trước đó vẫn còn.
4. Bảng ngân sách theo danh mục hiển thị "Chi thực tế" tính tự động từ tổng giao dịch, không còn ô nhập tay.

Ngoại lệ: quá trình di trú dữ liệu cũ bị gián đoạn giữa chừng → hiện thông báo rõ ràng, giữ nguyên dữ liệu cũ trong trình duyệt cho tới khi di trú thành công (xem `spec.md` mục 6, AC-06).

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | "Chi thực tế" của một danh mục luôn tính lại tự động từ tổng giao dịch thuộc danh mục đó, không lưu tay; ô nhập tay hiện có bị bỏ | `docs/memory/decisions.md#dec-007`, `spec.md` mục 8 (EL-06) | Đã xác nhận từ knowledge |
| BR-02 | Dữ liệu hiện có trong `localStorage` phải được di trú một lần sang lưu trữ bền vững, không bắt đầu từ dữ liệu rỗng | `docs/memory/decisions.md#dec-037` | Đã xác nhận từ knowledge |
| BR-03 | Nếu di trú dữ liệu cũ bị gián đoạn giữa chừng, dữ liệu cũ trong trình duyệt phải giữ nguyên cho tới khi di trú thành công, kèm thông báo rõ ràng cho Dylan | `spec.md` mục 6 (trường hợp ngoại lệ), mục 14 (A2 — giả định hợp lý) | Giả định hợp lý |
| BR-04 | Di trú dữ liệu cũ tự động thử lại mỗi lần Dylan mở lại Quản lý chi tiêu, không có nút thao tác thủ công | `docs/memory/decisions.md#dec-039` | Đã xác nhận từ knowledge |
| BR-05 | Di trú dùng một trạng thái "đang di trú" dùng chung giữa các thiết bị; thiết bị mở sau thấy trạng thái đang chạy thì chỉ chờ, không tự di trú lại | `docs/memory/decisions.md#dec-040` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Model Prisma | Ghi chú |
| --- | --- | --- |
| Tháng ngân sách | Chưa có (đề xuất `MonthBudget`, chưa qua `ssr-data`) | `docs/memory/glossary.md` |
| Danh mục | Chưa có (đề xuất `Category`, chưa qua `ssr-data`) | `docs/memory/glossary.md` |
| Giao dịch | Chưa có (đề xuất `Transaction`, chưa qua `ssr-data`) | `docs/memory/glossary.md` |

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-003 | Depends on (song song) | Gộp chung một spec — xem `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` |
| Raw | `docs/kb/ba/raw/US-001-luu-tru-chi-tieu-ben-vung.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `components/DylanPlanApp.tsx` |
