# Raw Requirement — Cấu hình ngưỡng ngân sách

Status: Raw
Feature: US-009
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Trung bình
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-009 |
| Slug | cau-hinh-nguong-ngan-sach |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-009-cau-hinh-nguong-ngan-sach/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-009-cau-hinh-nguong-ngan-sach.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Cấu hình ngưỡng ngân sách | Cho Dylan tự cấu hình ngưỡng cảnh báo vượt ngân sách (mặc định 90%), mục tiêu tổng chi (mặc định ≤ 30M) và quỹ linh hoạt (mặc định 7.5M) thay vì cố định trong code (DEC-006)

(docs/kb/ba/backlog.md, US #9)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #9): Ngưỡng cảnh báo vượt ngân sách (90% thu nhập), mục tiêu tổng chi (≤ 30M) và quỹ linh hoạt (7.5M) đang cố định trong code, Dylan không tự đổi được.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Luồng ảnh hưởng | F2, F4 | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |
| Ưu tiên / Effort | Trung bình / Medium | `docs/kb/ba/backlog.md` US #9 | Đã xác nhận |
| Cho Dylan tự cấu hình ngưỡng thay vì cố định trong code | DEC-006 | `docs/memory/decisions.md#dec-006` | Đã xác nhận |
| Giá trị mặc định hiện tại | Cảnh báo 90% thu nhập, mục tiêu tổng chi ≤ 30M, quỹ linh hoạt 7.5M | `docs/memory/glossary.md#4-chỉ-số-và-công-thức`, `components/DylanPlanApp.tsx` | Đã xác nhận |
| Nên làm sau khi có data model bền vững | Backlog xếp US #9 sau nhóm US #1-#6/#10 vì cần nơi lưu ngưỡng theo tháng | `docs/kb/ba/backlog.md#thứ-tự-triển-khai-đề-xuất` | Đã xác nhận |
| Nơi lưu 3 ngưỡng | Lưu trên từng tháng ngân sách; tháng mới kế thừa từ tháng gần nhất hoặc mặc định | DEC-038 | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Ba ngưỡng cấu hình được lưu ở đâu — theo từng tháng hay một bảng cấu hình chung? | Lưu trên từng tháng ngân sách; tháng mới tạo kế thừa ngưỡng của tháng gần nhất hoặc giá trị mặc định nếu chưa có tháng nào. | Đã xác nhận từ knowledge (user chọn qua `AskUserQuestion`, ghi `DEC-038`) |

## 5. Ghi Chú BA

- Cần data model bền vững (US-001) hoàn thành trước để có bảng tháng ngân sách làm nơi lưu ngưỡng (DEC-038).
- Spec cần định nghĩa rõ quy tắc kế thừa giá trị khi tạo tháng mới (trống hay clone) — DEC-038 mới chốt hướng chung, chưa chốt chi tiết clone có copy ngưỡng theo hay luôn lấy mặc định.
