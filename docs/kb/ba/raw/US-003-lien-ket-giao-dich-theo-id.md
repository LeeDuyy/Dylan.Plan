# Raw Requirement — Liên kết giao dịch theo danh mục bằng ID

Status: Raw
Feature: US-003
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Trung bình
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-003 |
| Slug | lien-ket-giao-dich-theo-id |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-003-lien-ket-giao-dich-theo-id/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-003-lien-ket-giao-dich-theo-id.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Liên kết giao dịch theo danh mục bằng ID | Giao dịch tham chiếu danh mục qua ID thay vì tên chuỗi, tránh lệch dữ liệu khi đổi tên danh mục

(docs/kb/ba/backlog.md, US #3)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #4): Giao dịch liên kết với danh mục theo tên chuỗi, không theo ID — đổi tên danh mục làm lệch dữ liệu.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Luồng ảnh hưởng | F1, F2 | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |
| Ưu tiên / Effort | Trung bình / Quick win | `docs/kb/ba/backlog.md` US #3 | Đã xác nhận |
| Phải làm cùng lúc với US-001 | Backlog ghi rõ: "phải làm cùng lúc với #1, thuộc thiết kế data model, làm sau sẽ phải migrate lại" | `docs/kb/ba/backlog.md#thứ-tự-triển-khai-đề-xuất` | Đã xác nhận |
| Trùng tên là điểm chạm F1-F2 đã ghi nhận | "Giao dịch được gán vào danh mục theo tên hiển thị" hiện là rủi ro khi đổi/xóa danh mục | `docs/kb/ba/business-flow.md#5-điểm-chạm-giữa-các-luồng` | Đã xác nhận |
| Hiện trạng: giao dịch lưu tên danh mục dạng chuỗi tại thời điểm tạo, không tự cập nhật theo tên mới | `components/DylanPlanApp.tsx` | source | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | US-003 có tách raw riêng khỏi US-001 hay nên gộp làm một requirement? | Giữ tách theo đúng cấu trúc 11 US trong `backlog.md` mà user đã duyệt ("DUYỆT TẠO CHO 11 US") — nhưng ghi rõ liên kết "Depends on / cùng lúc" với US-001 để `ssr-plan` gộp phạm vi thiết kế khi lập kế hoạch kỹ thuật, tránh migrate lại schema. | Đã xác nhận từ knowledge |
| Q2 | Giao dịch cũ (nếu có, di trú từ US-001) đang tham chiếu danh mục theo tên — khi chuyển sang ID thì ánh xạ thế nào nếu có nhiều danh mục trùng tên trong dữ liệu localStorage cũ? | Chưa có bằng chứng — vì trước US-010 (chặn trùng tên) dữ liệu cũ có thể chứa danh mục trùng tên trong cùng tháng. Đây là rủi ro kỹ thuật cho bước di trú (US-001) + thiết kế ID (US-003), cần `ssr-plan`/`ssr-ba` xử lý khi viết spec/plan, không chặn việc tạo raw. | Giả định hợp lý — cần user xác nhận khi ssr-ba viết spec nếu phát hiện dữ liệu thật có trùng tên |

## 5. Ghi Chú BA

- US-003 là một phần thiết kế data model của US-001 (không phải tính năng UI độc lập) — `ssr-plan` nên lập kế hoạch kỹ thuật gộp cả hai để tránh migrate schema hai lần.
- Khi viết spec, cần làm rõ hành vi UI: chọn danh mục vẫn hiển thị theo tên, nhưng lưu trữ/so khớp nội bộ dùng ID.
