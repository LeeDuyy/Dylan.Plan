# Raw Requirement — Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu

Status: Raw
Feature: US-004
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Cao
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-004 |
| Slug | sua-xoa-tung-giao-dich |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-004-sua-xoa-tung-giao-dich/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-004-sua-xoa-tung-giao-dich.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu | Cho sửa đầy đủ 4 trường (nội dung, số tiền, danh mục, ngày — ngày chỉ nhận giá trị ≤ hôm nay theo DEC-017) hoặc xóa (có xác nhận) một giao dịch của tháng đang chọn; "Chi thực tế" tính lại tự động từ tổng giao dịch thay vì lưu tay (DEC-007, DEC-008, DEC-009, DEC-010, DEC-017)

(docs/kb/ba/backlog.md, US #4)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #3): Không sửa/xóa được từng giao dịch riêng lẻ tại bảng chi tiết chi tiêu, chỉ có reset toàn bộ tháng.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Luồng ảnh hưởng | F1, F2 | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |
| Ưu tiên / Effort | Cao / Medium | `docs/kb/ba/backlog.md` US #4 | Đã xác nhận |
| Sửa đầy đủ 4 trường: nội dung, số tiền, danh mục, ngày | DEC-008 | `docs/memory/decisions.md#dec-008` | Đã xác nhận |
| Xóa phải qua hộp xác nhận trước | DEC-009 | `docs/memory/decisions.md#dec-009` | Đã xác nhận |
| Chỉ cho sửa/xóa giao dịch của tháng đang chọn | DEC-010 | `docs/memory/decisions.md#dec-010` | Đã xác nhận |
| "Chi thực tế" tính lại tự động từ tổng giao dịch | DEC-007 | `docs/memory/decisions.md#dec-007` | Đã xác nhận |
| Ngày sửa chỉ nhận giá trị ≤ hôm nay | DEC-017 (luật P1.1) | `docs/memory/decisions.md#dec-017`, `docs/memory/rules.md#p1-nghiệp-vụ` | Đã xác nhận |
| Không phát triển tính năng khôi phục (undo) sau khi xóa | DEC-031 | `docs/memory/decisions.md#dec-031` | Đã xác nhận |
| Phụ thuộc dữ liệu bền vững | Đứng sau US-001/US-003 trong thứ tự triển khai | `docs/kb/ba/backlog.md#thứ-tự-triển-khai-đề-xuất` | Đã xác nhận |

## 4. Câu Hỏi Mở

Không còn câu hỏi chặn spec — toàn bộ hành vi cốt lõi (phạm vi sửa, xác nhận xóa, ràng buộc ngày, tính lại chi thực tế, phạm vi tháng, không undo) đã được `ssr-po` hỏi và chốt với user ở `docs/memory/decisions.md` (DEC-007 → DEC-010, DEC-017, DEC-031). Chi tiết UI cụ thể (vị trí nút Sửa/Xóa, dạng form) để `ssr-ba` đề xuất mockup khi viết spec.

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Form sửa hiển thị inline trong bảng hay mở modal riêng? | Chưa có bằng chứng cụ thể — chi tiết UI, để `ssr-ba` đề xuất mockup khi viết spec. | Giả định hợp lý |

## 5. Ghi Chú BA

- US-004 phụ thuộc data model bền vững của US-001/US-003 để tính lại "Chi thực tế" đúng theo DEC-007; nên xếp sau hai US đó trong thứ tự triển khai thực tế dù đã tạo raw song song.
- Khi viết spec, cần tiêu chí chấp nhận riêng cho nhánh chặn ngày tương lai (DEC-017) và nhánh chặn sửa/xóa giao dịch không thuộc tháng đang chọn (DEC-010).
