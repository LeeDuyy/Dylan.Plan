# US-007 — Phân tích xu hướng trên toàn bộ lịch sử đã lưu

Status: Draft
Feature: US-007
Updated: 2026-08-03
Spec: `docs/features/US-007-phan-tich-xu-huong-lich-su/spec.md`
Raw: `docs/kb/ba/raw/US-007-phan-tich-xu-huong-lich-su.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Tính insight và biểu đồ xu hướng (F4) từ toàn bộ dữ liệu bền vững trong DB, thay vì chỉ các tháng đang có trong state trình duyệt hiện tại.

## 2. Phạm Vi

Trong phạm vi:

- Đọc dữ liệu tính insight/biểu đồ từ DB thay vì state trình duyệt

Ngoài phạm vi:

- Mini dashboard 3/6/9/12 tháng (thuộc US-011, có giới hạn khoảng thời gian riêng)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem | Single-user (DEC-004) |

## 4. Luồng Nghiệp Vụ

Chưa xác định từ raw input.

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | Insight và biểu đồ xu hướng F4 phải tính từ toàn bộ dữ liệu bền vững, không chỉ từ state trình duyệt hiện tại | `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng` (F4) | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

Không thêm bảng mới — chỉ đổi nguồn truy vấn cho các insight/biểu đồ đã có trong F4 sang DB.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-001 | Depends on | Chỉ có ý nghĩa sau khi dữ liệu nhiều tháng đã được lưu bền vững |
| US-011 | Related only | Cùng thuộc F4 nhưng phạm vi khác (toàn bộ lịch sử vs 3/6/9/12 tháng) |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-007-phan-tich-xu-huong-lich-su.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `components/DylanPlanApp.tsx` |
