---
status: Active
feature: US-007
updated: 2026-08-21
spec: docs/features/US-007-phan-tich-xu-huong-lich-su/spec.md
raw: docs/kb/ba/raw/US-007-phan-tich-xu-huong-lich-su.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-007", "Phân tích xu hướng toàn bộ lịch sử"]
---

# US-007 — Phân tích xu hướng trên toàn bộ lịch sử đã lưu

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Cho Dylan xem đúng biểu đồ "Xu hướng" (tổng chi qua các tháng) ở luồng F4, được tính từ toàn bộ tháng ngân sách đã lưu bền vững trong cơ sở dữ liệu, không giới hạn theo thời gian hay phụ thuộc bộ nhớ tạm của trình duyệt. Phục vụ mục tiêu `M1` của Business Flow — dữ liệu bền vững, chính xác.

## 2. Phạm Vi

Trong phạm vi:

- Biểu đồ "Xu hướng" (tổng chi qua các tháng) hiển thị đủ mọi tháng ngân sách đã từng được tạo và lưu bền vững, không giới hạn số tháng tối đa (`DEC-109`)

Ngoài phạm vi (`DEC-110`):

- Mini dashboard 3/6/9/12 tháng gần đây — thuộc `US-011`, có giới hạn khoảng thời gian riêng
- Các thẻ insight (danh mục chi nhiều nhất, tiết kiệm, chi linh hoạt) và biểu đồ "Cơ cấu chi tiêu" — cả hai chỉ mô tả đúng một tháng Dylan đang xem, không có khái niệm "lịch sử nhiều tháng" để mở rộng

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem | Single-user, không có phân quyền riêng (`DEC-004`) |

## 4. Luồng Nghiệp Vụ

1. Dylan mở trang Thu chi, xem biểu đồ "Xu hướng" (tổng chi qua các tháng) ở khu vực phân tích (F4).
2. Biểu đồ hiển thị một cột cho mỗi tháng ngân sách đã từng được tạo và lưu bền vững trong cơ sở dữ liệu, theo đúng thứ tự thời gian, không bỏ sót tháng nào dù tháng đó đã cũ hay trình duyệt vừa bị xóa cache.

Ngoại lệ: Chưa có tháng nào được tạo — biểu đồ hiển thị trạng thái rỗng, giống hành vi hiện có khi chưa có dữ liệu.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-028` | Biểu đồ "Xu hướng" (F4) tính từ toàn bộ tháng ngân sách đã lưu bền vững, không giới hạn số tháng, không phụ thuộc bộ nhớ tạm trình duyệt | [`../business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md`](../business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md) | `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng` (F4) | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Tháng ngân sách | [`../../data/entity/ENT-003-thang-ngan-sach.md`](../../data/entity/ENT-003-thang-ngan-sach.md) | `MonthBudget` | Không thêm bảng mới — chỉ đảm bảo nguồn tính biểu đồ Xu hướng là toàn bộ `MonthBudget` đã lưu, không giới hạn (`DEC-109`) |

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| `US-001` | Depends on | Chỉ có ý nghĩa sau khi dữ liệu nhiều tháng đã được lưu bền vững — đã `Delivered With Notes` |
| `US-011` | Related only | Cùng thuộc luồng F4 nhưng phạm vi khác (toàn bộ lịch sử vs 3/6/9/12 tháng gần đây) |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-007-phan-tich-xu-huong-lich-su/spec.md` (`Ready for DEV`, 4 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-007-phan-tich-xu-huong-lich-su.md` |
| Raw | `docs/kb/ba/raw/US-007-phan-tich-xu-huong-lich-su.md` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-004-phan-tich-bao-cao-chi-tieu.md`](../epic/EPC-004-phan-tich-bao-cao-chi-tieu.md) | Epic | Thuộc epic F4 (Phân tích và báo cáo chi tiêu) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-007-phan-tich-xu-huong-lich-su.md`](../../delivery/pbi/US-007-phan-tich-xu-huong-lich-su.md) | Đã đồng bộ 2026-08-21 — 4 AC |
