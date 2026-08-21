# US-006 — Cảnh báo trùng tháng khi tạo tháng mới

Status: Draft
Feature: US-006
Updated: 2026-08-03
Spec: `docs/features/US-006-canh-bao-trung-thang/spec.md`
Raw: `docs/kb/ba/raw/US-006-canh-bao-trung-thang.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Thông báo rõ ràng cho Dylan khi cố tạo một tháng ngân sách đã tồn tại, thay vì im lặng không tạo như hiện tại.

## 2. Phạm Vi

Trong phạm vi:

- Kiểm tra trùng tháng khi tạo tháng mới
- Hiển thị thông báo rõ ràng khi phát hiện trùng

Ngoài phạm vi:

- Hành vi chính xác khi trùng (chặn hẳn hay chuyển sang xem tháng đã có) — cần xác nhận ở bước viết spec (Q1 trong raw)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Tạo tháng | Single-user (DEC-004) |

## 4. Luồng Nghiệp Vụ

Chưa xác định từ raw input.

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | Tạo tháng đã tồn tại phải hiện thông báo rõ ràng cho Dylan | `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng` (F3) | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Model Prisma | Ghi chú |
| --- | --- | --- |
| Tháng ngân sách | Chưa có (đề xuất `MonthBudget`, chưa qua `ssr-data`) | Cần khóa duy nhất theo kỳ tháng |

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-001 | Related only | Nên làm sau khi có bảng tháng bền vững để tránh viết lại logic kiểm tra |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-006-canh-bao-trung-thang.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `components/DylanPlanApp.tsx` |
