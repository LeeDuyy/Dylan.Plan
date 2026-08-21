# Raw Requirement — Phân tích xu hướng trên toàn bộ lịch sử đã lưu

Status: Raw
Feature: US-007
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Trung bình
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-007 |
| Slug | phan-tich-xu-huong-lich-su |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-007-phan-tich-xu-huong-lich-su/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-007-phan-tich-xu-huong-lich-su.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Phân tích xu hướng trên toàn bộ lịch sử đã lưu | Tính insight/biểu đồ xu hướng từ dữ liệu bền vững (DB) thay vì chỉ các tháng đang có trong state trình duyệt

(docs/kb/ba/backlog.md, US #7)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #7): Phân tích/xu hướng chỉ tính trên các tháng đang có trong bộ nhớ hiện tại, không phải toàn bộ lịch sử đã lưu.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Luồng ảnh hưởng | F4 | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |
| Ưu tiên / Effort | Trung bình / Quick win | `docs/kb/ba/backlog.md` US #7 | Đã xác nhận |
| Phụ thuộc US-001 (M1) | Chỉ có ý nghĩa sau khi dữ liệu nhiều tháng đã được lưu bền vững | `docs/kb/ba/backlog.md#thứ-tự-triển-khai-đề-xuất` | Đã xác nhận |
| Hiện trạng | Xu hướng nhiều tháng chỉ tính trên các tháng đang có trong state hiện tại của trình duyệt, không phản ánh đúng lịch sử dài hạn nếu dữ liệu từng bị mất/reset | `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng` (F4, trường hợp hỏng) | Đã xác nhận |
| Nội dung F4 hiện có | Thẻ insight (danh mục chi nhiều nhất, tiết kiệm, chi linh hoạt), biểu đồ cơ cấu chi theo danh mục và xu hướng | `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng` | Đã xác nhận |

## 4. Câu Hỏi Mở

Không còn câu hỏi chặn spec ở mức raw — đây là mở rộng nguồn dữ liệu (từ state sang DB) cho các insight đã có sẵn trong F4, không đổi hành vi nghiệp vụ.

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Có giới hạn số tháng tối đa khi tính xu hướng "toàn bộ lịch sử" không, hay luôn quét hết? | Chưa có bằng chứng cụ thể — US-011 (mini dashboard) đã có giới hạn riêng (3/6/9/12 tháng, DEC-032..036); US-007 là "toàn bộ lịch sử" nên khác phạm vi. Để `ssr-ba` xác nhận với user nếu cần giới hạn vì lý do hiệu năng khi viết spec. | Cần user xác nhận |

## 5. Ghi Chú BA

- US-007 phụ thuộc chặt vào US-001 hoàn thành — không có ý nghĩa nếu chạy trước khi dữ liệu multi-tháng được lưu bền vững.
- Khác với US-011 (mini dashboard 3/6/9/12 tháng): US-007 là mở rộng phạm vi tính toán của các insight/biểu đồ đã có trong F4 sang toàn bộ lịch sử, không phải một khối UI mới.
