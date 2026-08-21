# US-003 — Liên kết giao dịch theo danh mục bằng ID

Status: Active
Feature: US-003
Updated: 2026-08-03
Spec: `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` (gộp chung với US-001, xem ghi chú đầu spec)
Raw: `docs/kb/ba/raw/US-003-lien-ket-giao-dich-theo-id.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Giao dịch tham chiếu danh mục qua khóa ID thay vì tên chuỗi, để đổi tên danh mục không làm lệch dữ liệu giao dịch đã ghi trước đó.

## 2. Phạm Vi

Trong phạm vi:

- Thiết kế quan hệ giao dịch → danh mục bằng khóa ngoại (ID)

Ngoài phạm vi:

- Chặn trùng tên danh mục (thuộc US-010)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, Tạo, Sửa, Xóa | Single-user (DEC-004) |

## 4. Luồng Nghiệp Vụ

Xem `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` mục 6 (Luồng Nghiệp Vụ, bước 2 và 5) — giao dịch gắn với danh mục qua mã nhận diện cố định ngay từ khi ghi nhận, và giữ nguyên liên kết khi danh mục được đổi tên.

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | Giao dịch phải tham chiếu danh mục qua mã nhận diện cố định, không qua tên chuỗi | `docs/kb/ba/business-flow.md#5-điểm-chạm-giữa-các-luồng`, `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` (AC-05) | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Model Prisma | Ghi chú |
| --- | --- | --- |
| Giao dịch → Danh mục | Chưa có (đề xuất khóa ngoại `categoryId` trên `Transaction`, chưa qua `ssr-data`) | Phải thiết kế cùng lúc với US-001 |

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-001 | Depends on (song song) | Cùng thuộc thiết kế data model, phải làm chung để tránh migrate lại schema |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec (gộp chung với US-001) | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` |
| Raw | `docs/kb/ba/raw/US-003-lien-ket-giao-dich-theo-id.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `components/DylanPlanApp.tsx` |
