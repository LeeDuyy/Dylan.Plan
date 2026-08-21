# US-002 — Route/module riêng cho Quản lý chi tiêu

Status: Draft
Feature: US-002
Updated: 2026-08-03
Spec: `docs/features/US-002-route-rieng-quan-ly-chi-tieu/spec.md`
Raw: `docs/kb/ba/raw/US-002-route-rieng-quan-ly-chi-tieu.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Tách trang Quản lý chi tiêu ra route riêng `/budget`, độc lập điều hướng khỏi các mục khác của Dylan Plan Dashboard (roadmap, freelance, sản phẩm), dùng chung codebase Next.js hiện tại. Phục vụ mục tiêu M2 của Business Flow.

## 2. Phạm Vi

Trong phạm vi:

- Route `/budget` trong Next.js App Router
- Điều hướng từ shell chung sang `/budget`

Ngoài phạm vi:

- Tách thành dự án/ứng dụng độc lập khỏi `Dylan.Plan` (DEC-002)
- Đăng nhập, phân quyền (DEC-004)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, Tạo, Sửa, Xóa | Single-user (DEC-004) |

## 4. Luồng Nghiệp Vụ

Chưa xác định từ raw input.

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | Route của module Quản lý chi tiêu là `/budget` | `docs/memory/decisions.md#dec-005` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

Không thay đổi data model — US-002 là thay đổi cấu trúc route/điều hướng.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-001 | Related only | Nội dung hiển thị bên trong `/budget` phụ thuộc dữ liệu bền vững của US-001 để hoàn chỉnh |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-002-route-rieng-quan-ly-chi-tieu.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `app/page.tsx`, `components/DylanPlanApp.tsx` |
