# US-010 — Chặn trùng tên danh mục

Status: Draft
Feature: US-010
Updated: 2026-08-03
Spec: `docs/features/US-010-chan-trung-ten-danh-muc/spec.md`
Raw: `docs/kb/ba/raw/US-010-chan-trung-ten-danh-muc.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Chặn và báo lỗi khi Dylan cố thêm mới hoặc sửa tên danh mục thành tên trùng với một danh mục khác trong cùng tháng, tránh nhập nhanh (F1) không xác định được gán vào danh mục nào.

## 2. Phạm Vi

Trong phạm vi:

- Kiểm tra trùng tên khi thêm mới danh mục
- Kiểm tra trùng tên khi sửa tên danh mục đã có
- So sánh chuẩn hóa: bỏ qua hoa/thường, khoảng trắng thừa đầu-cuối
- Phạm vi kiểm tra: trong cùng tháng đang chọn

Ngoài phạm vi:

- Áp dụng cho "Chi tiêu khác" (chỉ xem, không sửa tên — DEC-027)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Thêm, Sửa danh mục | Single-user (DEC-004) |

## 4. Luồng Nghiệp Vụ

Chưa xác định từ raw input.

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | Ràng buộc không trùng tên áp dụng cho cả thêm mới và sửa tên, trong phạm vi tháng đang chọn | `docs/memory/decisions.md#dec-020` | Đã xác nhận từ knowledge |
| BR-02 | Trùng tên thì chặn thao tác, hiện thông báo lỗi rõ ràng, không tự đổi tên | `docs/memory/decisions.md#dec-021` | Đã xác nhận từ knowledge |
| BR-03 | So sánh trùng tên bỏ qua khác biệt hoa/thường và khoảng trắng thừa đầu/cuối | `docs/memory/decisions.md#dec-022` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Model Prisma | Ghi chú |
| --- | --- | --- |
| Danh mục | Chưa có (đề xuất `Category`, chưa qua `ssr-data`) | Cần ràng buộc duy nhất (tên chuẩn hóa, tháng) |

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-001 | Depends on | Cần data model bền vững để áp ràng buộc duy nhất |
| US-005 | Related only | Cùng thao tác trên bảng danh mục F2 |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-010-chan-trung-ten-danh-muc.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `components/DylanPlanApp.tsx` |
