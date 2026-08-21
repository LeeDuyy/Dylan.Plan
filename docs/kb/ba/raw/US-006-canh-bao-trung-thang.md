# Raw Requirement — Cảnh báo trùng tháng khi tạo tháng mới

Status: Raw
Feature: US-006
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Thấp
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-006 |
| Slug | canh-bao-trung-thang |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-006-canh-bao-trung-thang/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-006-canh-bao-trung-thang.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Cảnh báo trùng tháng khi tạo tháng mới | Thông báo rõ ràng khi người dùng tạo một tháng đã tồn tại

(docs/kb/ba/backlog.md, US #6)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #6): Tạo tháng mới không cảnh báo khi trùng tháng đã có.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Luồng ảnh hưởng | F3 | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |
| Ưu tiên / Effort | Thấp / Quick win | `docs/kb/ba/backlog.md` US #6 | Đã xác nhận |
| Hiện trạng | Tháng mới trùng với tháng đã tồn tại: không tạo, không báo lỗi rõ ràng cho người dùng | `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng` (F3, điều kiện rẽ nhánh) | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Khi trùng tháng, hệ thống nên chặn hoàn toàn hay cho chuyển sang xem tháng đã tồn tại đó? | Chưa có bằng chứng — Business Flow chỉ ghi nhận đây là khoảng trống UX, chưa chốt hành vi cụ thể. Đề xuất hợp lý: hiện thông báo trùng và chuyển focus sang tháng đã tồn tại (nhất quán với nguyên tắc không để mất dữ liệu), nhưng cần `ssr-ba` xác nhận khi viết spec vì đây là quyết định hành vi, không chỉ UI. | Cần user xác nhận |

## 5. Ghi Chú BA

- Effort thấp, không phụ thuộc US-001 để triển khai phần thông báo (kiểm tra trùng tháng có thể làm trên state hiện tại), nhưng nên làm sau khi có bảng tháng bền vững để tránh viết lại logic kiểm tra khi đổi nguồn dữ liệu.
- `ssr-ba` cần hỏi lại Q1 khi viết spec nếu không tự suy luận đủ chắc từ business-flow.
