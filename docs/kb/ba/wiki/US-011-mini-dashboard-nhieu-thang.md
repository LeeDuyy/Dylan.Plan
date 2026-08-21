# US-011 — Mini dashboard 3/6/9/12 tháng gần đây

Status: Draft
Feature: US-011
Updated: 2026-08-03
Spec: `docs/features/US-011-mini-dashboard-nhieu-thang/spec.md`
Raw: `docs/kb/ba/raw/US-011-mini-dashboard-nhieu-thang.md`
Owner: ssr-ba

## 1. Mục Tiêu Nghiệp Vụ

Mở rộng F4 với một mini dashboard cho Dylan chọn khoảng 3/6/9/12 tháng gần đây, xem biểu đồ tổng chi thực tế theo tháng so với ngân sách/thu nhập.

## 2. Phạm Vi

Trong phạm vi:

- Chọn khoảng 3/6/9/12 tháng gần đây, tính từ tháng hiện tại theo đồng hồ hệ thống lùi về trước
- Biểu đồ tổng chi thực tế theo tháng so với tổng ngân sách/thu nhập
- Bỏ qua tháng chưa được tạo trong khoảng đã chọn

Ngoài phạm vi:

- Breakdown chi tiết theo danh mục cho từng tháng (DEC-033 không chọn)
- Tách thành luồng riêng F5 (DEC-032 không chọn)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem | Single-user (DEC-004) |

## 4. Luồng Nghiệp Vụ

Chưa xác định từ raw input.

## 5. Business Rules

| ID | Rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| BR-01 | Mini dashboard là phần mở rộng của F4, không tách luồng riêng | `docs/memory/decisions.md#dec-032` | Đã xác nhận từ knowledge |
| BR-02 | Nội dung chính: tổng chi theo tháng so với ngân sách/thu nhập | `docs/memory/decisions.md#dec-033` | Đã xác nhận từ knowledge |
| BR-03 | Khoảng 3/6/9/12 tháng tính từ tháng hiện tại theo đồng hồ hệ thống, lùi về trước | `docs/memory/decisions.md#dec-034` | Đã xác nhận từ knowledge |
| BR-04 | Chỉ triển khai sau khi US-001 hoàn thành | `docs/memory/decisions.md#dec-035` | Đã xác nhận từ knowledge |
| BR-05 | Tháng chưa được tạo trong khoảng thì bỏ qua, không hiển thị cột/điểm trống | `docs/memory/decisions.md#dec-036` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

Không thêm bảng mới — truy vấn tổng hợp trên bảng tháng ngân sách đã có từ US-001.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| US-001 | Depends on | Chỉ triển khai sau khi dữ liệu bền vững hoàn thành (DEC-035) |
| US-007 | Related only | Cùng thuộc F4 nhưng phạm vi khác (3/6/9/12 tháng vs toàn bộ lịch sử) |
| US-009 | Related only | Biểu đồ so sánh cần đọc ngưỡng/ngân sách đã cấu hình theo tháng |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-011-mini-dashboard-nhieu-thang.md` |
| Business Flow | `docs/kb/ba/business-flow.md` |
| Source | `components/DylanPlanApp.tsx` |
