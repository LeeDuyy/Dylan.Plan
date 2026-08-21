# Raw Requirement — Chặn trùng tên danh mục

Status: Raw
Feature: US-010
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Trung bình
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-010 |
| Slug | chan-trung-ten-danh-muc |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-010-chan-trung-ten-danh-muc/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-010-chan-trung-ten-danh-muc.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Chặn trùng tên danh mục | Khi thêm mới hoặc sửa tên danh mục, chặn và báo lỗi nếu tên trùng (không phân biệt hoa/thường, bỏ khoảng trắng thừa) với một danh mục khác trong cùng tháng (DEC-020, DEC-021, DEC-022)

(docs/kb/ba/backlog.md, US #10)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #10): Thêm/sửa tên danh mục không kiểm tra trùng tên — có thể tồn tại hai danh mục cùng tên trong một tháng, gây khó xác định nhập nhanh (F1) nên gán vào danh mục nào.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Luồng ảnh hưởng | F2, F1 | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |
| Ưu tiên / Effort | Trung bình / Quick win | `docs/kb/ba/backlog.md` US #10 | Đã xác nhận |
| Áp dụng cho cả thêm mới và sửa tên, trong phạm vi tháng đang chọn | DEC-020 | `docs/memory/decisions.md#dec-020` | Đã xác nhận |
| Trùng tên: chặn thao tác, báo lỗi rõ ràng, không tự đổi tên | DEC-021 | `docs/memory/decisions.md#dec-021` | Đã xác nhận |
| So sánh bỏ qua hoa/thường và khoảng trắng thừa đầu-cuối | DEC-022 | `docs/memory/decisions.md#dec-022` | Đã xác nhận |
| Không áp dụng cho "Chi tiêu khác" (chỉ xem, không sửa tên) | DEC-027 | `docs/memory/decisions.md#dec-027` | Đã xác nhận |

## 4. Câu Hỏi Mở

Không còn câu hỏi chặn spec — phạm vi áp dụng, cách xử lý khi trùng, và quy tắc chuẩn hóa so sánh đã được chốt dứt khoát (DEC-020, DEC-021, DEC-022).

## 5. Ghi Chú BA

- US-010 có thể triển khai song song US-004 (sửa/xóa giao dịch) và US-005 (ràng buộc danh mục) vì cùng thao tác trên bảng danh mục F2; nên phối hợp cùng một spec/plan nếu `ssr-plan` thấy hợp lý để tránh sửa cùng vùng code nhiều lần.
- Cần lưu ý dữ liệu di trú từ localStorage (US-001) có thể đã tồn tại danh mục trùng tên trước khi ràng buộc này có hiệu lực — xem ghi chú Q2 ở raw US-003.
