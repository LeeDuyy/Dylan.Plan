# US-009 — Cấu hình ngưỡng ngân sách

Status: Draft
Feature: US-009
Updated: 2026-08-03
Spec: `docs/features/US-009-cau-hinh-nguong-ngan-sach/spec.md`
Raw: `docs/kb/ba/raw/US-009-cau-hinh-nguong-ngan-sach.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Cho Dylan tự cấu hình 3 ngưỡng ngân sách (cảnh báo vượt ngân sách, mục tiêu tổng chi, quỹ linh hoạt) thay vì cố định trong code như hiện tại.

## 2. Phạm Vi

Trong phạm vi:

- Cấu hình ngưỡng cảnh báo vượt ngân sách (mặc định 90%)
- Cấu hình mục tiêu tổng chi (mặc định ≤ 30M)
- Cấu hình quỹ linh hoạt (mặc định 7.5M)
- Lưu 3 ngưỡng trên từng tháng ngân sách, kế thừa khi tạo tháng mới

Ngoài phạm vi:

- Bảng cấu hình chung (Settings) áp dụng mọi tháng (DEC-038 không chọn)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Sửa | Single-user (DEC-004) |

## 4. Luồng Nghiệp Vụ

Chưa xác định từ raw input.

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | Ba ngưỡng ngân sách phải cho Dylan tự cấu hình, không cố định trong code | `docs/memory/decisions.md#dec-006` | Đã xác nhận từ knowledge |
| BR-02 | Ba ngưỡng lưu trên từng tháng ngân sách, không phải bảng cấu hình chung | `docs/memory/decisions.md#dec-038` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Model Prisma | Ghi chú |
| --- | --- | --- |
| Ngưỡng cảnh báo vượt ngân sách | Chưa có (đề xuất field trên `MonthBudget`, chưa qua `ssr-data`) | Mặc định 90% |
| Mục tiêu tổng chi | Chưa có (đề xuất field trên `MonthBudget`) | Mặc định ≤ 30M |
| Quỹ linh hoạt | Chưa có (đề xuất field trên `MonthBudget`) | Mặc định 7.5M |

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-001 | Depends on | Cần bảng tháng ngân sách bền vững làm nơi lưu ngưỡng |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-009-cau-hinh-nguong-ngan-sach.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `components/DylanPlanApp.tsx` |
