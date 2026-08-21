# Raw Requirement — Ràng buộc toàn vẹn danh mục + giao dịch không danh mục

Status: Raw
Feature: US-005
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Trung bình
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-005 |
| Slug | rang-buoc-toan-ven-danh-muc |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-005-rang-buoc-toan-ven-danh-muc.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Ràng buộc toàn vẹn danh mục + giao dịch không danh mục | Xóa một danh mục thường chuyển giao dịch sang "Chi tiêu khác" (tự sinh khi tháng chưa có, khóa vĩnh viễn, chỉ xem — DEC-024, DEC-026, DEC-027); F1 nới để Dylan bỏ qua chọn danh mục khi ghi nhận, giao dịch đó tự vào "Chi tiêu khác" (DEC-028); "Chi tiêu khác" tự ẩn khỏi giao diện khi hết giao dịch (DEC-029)

(docs/kb/ba/backlog.md, US #5)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #5): Xóa danh mục không kiểm tra giao dịch liên quan, không có cảnh báo.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Luồng ảnh hưởng | F2, F1 | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |
| Ưu tiên / Effort | Trung bình / Medium | `docs/kb/ba/backlog.md` US #5 | Đã xác nhận |
| Xóa danh mục thường chuyển giao dịch sang "Chi tiêu khác" | DEC-024 | `docs/memory/decisions.md#dec-024` | Đã xác nhận |
| "Chi tiêu khác" chỉ tự sinh khi cần, không có sẵn mọi tháng | DEC-026 (thay thế DEC-023) | `docs/memory/decisions.md#dec-026` | Đã xác nhận |
| "Chi tiêu khác" khóa vĩnh viễn, chỉ xem | DEC-027 (thay thế DEC-025) | `docs/memory/decisions.md#dec-027` | Đã xác nhận |
| F1 cho phép bỏ qua chọn danh mục, tự vào "Chi tiêu khác" | DEC-028 | `docs/memory/decisions.md#dec-028` | Đã xác nhận |
| "Chi tiêu khác" ẩn khỏi giao diện khi hết giao dịch (chỉ lọc hiển thị, không xóa bản ghi) | DEC-029, DEC-030 | `docs/memory/decisions.md#dec-029`, `#dec-030` | Đã xác nhận |

## 4. Câu Hỏi Mở

Không còn câu hỏi chặn spec — toàn bộ hành vi của "Chi tiêu khác" (sinh khi nào, khóa ra sao, ẩn/hiện thế nào) đã qua 2 lần đảo quyết định và được chốt dứt khoát (DEC-023/025 → Superseded, thay bằng DEC-026/027).

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Toast/thông báo khi xóa danh mục có cần báo rõ "N giao dịch đã chuyển sang Chi tiêu khác" không? | Chưa có bằng chứng — Business Flow chỉ mô tả hành vi dữ liệu, chưa mô tả nội dung thông báo cụ thể cho hành động xóa danh mục (khác với toast ghi nhận ở F1, đã có DEC-011/012/018). Để `ssr-ba` đề xuất khi viết spec. | Giả định hợp lý |

## 5. Ghi Chú BA

- US-005 phụ thuộc US-001/US-003 (data model bền vững + liên kết theo ID) để việc chuyển giao dịch sang "Chi tiêu khác" và tính lại "Chi thực tế" (DEC-007) chính xác.
- Cần đảm bảo spec mô tả rõ 2 con đường sinh "Chi tiêu khác": (a) xóa danh mục cha, (b) F1 bỏ qua chọn danh mục — cả hai đều dùng chung logic "tự sinh nếu tháng chưa có".
