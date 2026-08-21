# US-004 — Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu

Status: Draft
Feature: US-004
Updated: 2026-08-03
Spec: `docs/features/US-004-sua-xoa-tung-giao-dich/spec.md`
Raw: `docs/kb/ba/raw/US-004-sua-xoa-tung-giao-dich.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Cho phép Dylan sửa đầy đủ 4 trường hoặc xóa (có xác nhận) một giao dịch thuộc tháng đang chọn, thay vì chỉ có "reset toàn bộ tháng" như hiện tại; "Chi thực tế" của danh mục tính lại tự động sau mỗi lần sửa/xóa.

## 2. Phạm Vi

Trong phạm vi:

- Sửa nội dung, số tiền, danh mục, ngày của một giao dịch (ngày ≤ hôm nay — DEC-017)
- Xóa một giao dịch, có hộp xác nhận trước (DEC-009)
- Chỉ áp dụng cho giao dịch thuộc tháng đang chọn (DEC-010)
- Tính lại "Chi thực tế" của danh mục cũ/mới sau khi sửa/xóa (DEC-007)

Ngoài phạm vi:

- Khôi phục (undo) sau khi xóa (DEC-031)
- Sửa/xóa giao dịch của tháng khác tháng đang chọn (DEC-010)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Sửa, Xóa | Chỉ giao dịch thuộc tháng đang chọn (DEC-010) |

## 4. Luồng Nghiệp Vụ

Chưa xác định từ raw input.

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | Sửa giao dịch cho phép đổi đầy đủ 4 trường: nội dung, số tiền, danh mục, ngày | `docs/memory/decisions.md#dec-008` | Đã xác nhận từ knowledge |
| BR-02 | Xóa giao dịch phải qua hộp xác nhận trước | `docs/memory/decisions.md#dec-009` | Đã xác nhận từ knowledge |
| BR-03 | Chỉ cho sửa/xóa giao dịch của tháng đang chọn | `docs/memory/decisions.md#dec-010` | Đã xác nhận từ knowledge |
| BR-04 | Ngày giao dịch khi sửa chỉ nhận giá trị ≤ hôm nay | `docs/memory/decisions.md#dec-017`, `docs/memory/rules.md#p1-nghiệp-vụ` (P1.1) | Đã xác nhận từ knowledge |
| BR-05 | Không phát triển tính năng khôi phục (undo) sau khi xóa | `docs/memory/decisions.md#dec-031` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Model Prisma | Ghi chú |
| --- | --- | --- |
| Giao dịch | Chưa có (đề xuất `Transaction`, chưa qua `ssr-data`) | Sửa/xóa tác động trực tiếp |
| Chi thực tế | Không lưu cột riêng, tính từ tổng `Transaction` (DEC-007) | Tính lại sau mỗi lần sửa/xóa |

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-001 | Depends on | Cần data model bền vững và cơ chế tính "Chi thực tế" derived |
| US-003 | Depends on | Cần giao dịch liên kết danh mục theo ID để sửa đổi danh mục chính xác |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-004-sua-xoa-tung-giao-dich.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `components/DylanPlanApp.tsx` |
