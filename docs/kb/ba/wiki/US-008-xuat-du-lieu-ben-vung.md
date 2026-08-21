# US-008 — Xuất dữ liệu từ nguồn lưu trữ bền vững

Status: Draft
Feature: US-008
Updated: 2026-08-03
Spec: `docs/features/US-008-xuat-du-lieu-ben-vung/spec.md`
Raw: `docs/kb/ba/raw/US-008-xuat-du-lieu-ben-vung.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Xuất file JSON đọc dữ liệu từ database bền vững thay vì chỉ từ state trình duyệt hiện tại, giữ nguyên hành vi tải file thủ công hiện có.

## 2. Phạm Vi

Trong phạm vi:

- Đổi nguồn đọc dữ liệu cho tính năng xuất JSON sang DB

Ngoài phạm vi:

- Tích hợp với hệ thống ngoài (không có hệ thống ngoài trao đổi dữ liệu — Business Flow mục 2)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xuất dữ liệu | Single-user (DEC-004) |

## 4. Luồng Nghiệp Vụ

Chưa xác định từ raw input.

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | Xuất JSON phải đọc dữ liệu từ database, không chỉ từ state trình duyệt hiện tại | `docs/kb/ba/business-flow.md#7-khoảng-trống-và-ưu-tiên` (#8) | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

Không thêm bảng mới — chỉ đổi nguồn truy vấn cho tính năng xuất JSON đã có.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-001 | Depends on | Cần dữ liệu bền vững làm nguồn xuất |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-008-xuat-du-lieu-ben-vung.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `components/DylanPlanApp.tsx` |
