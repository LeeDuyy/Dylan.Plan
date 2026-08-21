# US-005 — Ràng buộc toàn vẹn danh mục + giao dịch không danh mục

Status: Draft
Feature: US-005
Updated: 2026-08-03
Spec: `docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md`
Raw: `docs/kb/ba/raw/US-005-rang-buoc-toan-ven-danh-muc.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Đảm bảo không có giao dịch "mồ côi" khi xóa danh mục hoặc khi Dylan bỏ qua chọn danh mục lúc ghi nhận — mọi giao dịch không có danh mục hợp lệ đều tự động vào danh mục dự phòng "Chi tiêu khác".

## 2. Phạm Vi

Trong phạm vi:

- Xóa danh mục thường → chuyển giao dịch sang "Chi tiêu khác" (tự sinh nếu tháng chưa có)
- F1 cho phép ghi nhận không chọn danh mục → tự vào "Chi tiêu khác"
- "Chi tiêu khác" khóa vĩnh viễn, chỉ xem, ẩn khi hết giao dịch

Ngoài phạm vi:

- Chặn trùng tên danh mục (thuộc US-010)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, Tạo, Sửa, Xóa danh mục thường | Không sửa/xóa "Chi tiêu khác" (khóa vĩnh viễn — DEC-027) |

## 4. Luồng Nghiệp Vụ

Chưa xác định từ raw input.

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | Xóa danh mục thường (không khóa) chuyển toàn bộ giao dịch của nó sang "Chi tiêu khác" | `docs/memory/decisions.md#dec-024` | Đã xác nhận từ knowledge |
| BR-02 | "Chi tiêu khác" chỉ tự sinh khi cần (có giao dịch không danh mục, hoặc danh mục cha bị xóa), không có sẵn mặc định mọi tháng | `docs/memory/decisions.md#dec-026` | Đã xác nhận từ knowledge |
| BR-03 | "Chi tiêu khác" khóa vĩnh viễn, không cho sửa/xóa | `docs/memory/decisions.md#dec-027` | Đã xác nhận từ knowledge |
| BR-04 | F1 cho phép ghi nhận không chọn danh mục, tự động vào "Chi tiêu khác" | `docs/memory/decisions.md#dec-028` | Đã xác nhận từ knowledge |
| BR-05 | "Chi tiêu khác" ẩn khỏi giao diện khi hết giao dịch, nhưng bản ghi vẫn giữ nguyên trong dữ liệu | `docs/memory/decisions.md#dec-029`, `#dec-030` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Model Prisma | Ghi chú |
| --- | --- | --- |
| Chi tiêu khác | Chưa có (đề xuất một bản ghi `Category` đặc biệt với cờ khóa, chưa qua `ssr-data`) | Xem `docs/memory/glossary.md` |

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-001 | Depends on | Cần data model bền vững để lưu và tính lại "Chi tiêu khác" |
| US-003 | Depends on | Cần liên kết theo ID để chuyển giao dịch giữa danh mục chính xác |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-005-rang-buoc-toan-ven-danh-muc.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `components/DylanPlanApp.tsx` |
