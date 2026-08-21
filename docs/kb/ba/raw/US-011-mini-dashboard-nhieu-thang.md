# Raw Requirement — Mini dashboard 3/6/9/12 tháng gần đây

Status: Raw
Feature: US-011
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Trung bình
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-011 |
| Slug | mini-dashboard-nhieu-thang |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-011-mini-dashboard-nhieu-thang/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-011-mini-dashboard-nhieu-thang.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Mini dashboard 3/6/9/12 tháng gần đây | Mở rộng F4: biểu đồ tổng chi thực tế theo tháng so với ngân sách/thu nhập, chọn khoảng 3/6/9/12 tháng tính từ tháng hiện tại theo đồng hồ hệ thống lùi về trước, bỏ qua tháng chưa được tạo (DEC-032, DEC-033, DEC-034, DEC-036); phụ thuộc M1 (DEC-035)

(docs/kb/ba/backlog.md, US #11)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #11): Chưa có mini dashboard theo dõi tổng chi 3/6/9/12 tháng gần đây so với ngân sách/thu nhập; phụ thuộc M1 để có đủ dữ liệu nhiều tháng.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Luồng ảnh hưởng | F4 (mở rộng, không tách luồng riêng) | DEC-032 | Đã xác nhận |
| Ưu tiên / Effort | Trung bình / Medium | `docs/kb/ba/backlog.md` US #11 | Đã xác nhận |
| Nội dung chính | Tổng chi thực tế theo tháng, so với tổng ngân sách/thu nhập tháng đó | DEC-033 | Đã xác nhận |
| Mốc tính khoảng thời gian | Từ tháng hiện tại theo đồng hồ hệ thống, lùi về trước — không phụ thuộc tháng đang xem trên UI | DEC-034 | Đã xác nhận |
| Phụ thuộc M1 | Chỉ triển khai sau khi US-001 hoàn thành | DEC-035 | Đã xác nhận |
| Tháng chưa được tạo trong khoảng | Bỏ qua, không hiển thị cột/điểm trống | DEC-036 | Đã xác nhận |

## 4. Câu Hỏi Mở

Không còn câu hỏi chặn spec — mọi khía cạnh cốt lõi (phạm vi F4, nội dung hiển thị, mốc tính, phụ thuộc M1, xử lý tháng trống) đã được `ssr-po` hỏi và chốt dứt khoát (DEC-032 → DEC-036).

## 5. Ghi Chú BA

- US-011 phải xếp sau US-001 trong thứ tự triển khai thực tế (DEC-035), dù raw được tạo cùng đợt với các US khác.
- Khác với US-007 (phân tích toàn bộ lịch sử): US-011 có khoảng thời gian giới hạn cố định (3/6/9/12 tháng), là một khối UI "mini dashboard" riêng biệt trong F4.
