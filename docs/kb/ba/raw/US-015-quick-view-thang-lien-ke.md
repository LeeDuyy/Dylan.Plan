---
status: Raw
feature: US-015
created: 2026-08-11
source: PO Review
requester: Dylan
priority: Trung bình
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-015"]
---

# Raw Requirement — Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-015 |
| Slug | quick-view-thang-lien-ke |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-015-quick-view-thang-lien-ke/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-015-quick-view-thang-lien-ke.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
khu vực này chỉ hiển thị 3 tháng: tháng trước tháng đang xem, tháng đang xem, tháng sau tháng đang xem. Nếu user muốn xem các tháng xa hơn thì sẽ chọn tháng xem ở bên trên. Khu vực này chỉ quick view
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Màn hình liên quan | Khu vực thẻ tháng "Lịch sử thu chi" tại trang Quản lý chi tiêu (`/budget`) | `components/BudgetApp.tsx:741-759` | Đã xác nhận |
| Hành vi hiện tại | Hiển thị toàn bộ tháng đã tạo (không giới hạn), sắp giảm dần theo mã tháng | `components/BudgetApp.tsx:742` | Đã xác nhận |
| Cách xem tháng khác đã có sẵn | Dropdown "Chọn tháng xem" liệt kê toàn bộ tháng đã tạo | `components/BudgetApp.tsx:686-695` | Đã xác nhận |
| Nguồn đề xuất | PO review PO-02, khoảng trống #13 của Business Flow, đề xuất #13 của Backlog | `docs/po/review-2026-08-11-quick-view-thang.md`, `docs/kb/ba/business-flow.md#7-khoảng-trống-và-ưu-tiên`, `docs/kb/ba/backlog.md` | Đã xác nhận |
| Luồng nghiệp vụ liên quan | F3 — Quản lý theo chu kỳ tháng | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | "Tháng trước"/"tháng sau" tính theo lịch (liên tiếp theo mã tháng) hay theo thứ tự trong danh sách tháng ĐÃ TẠO (bỏ qua tháng chưa tạo)? | Theo thứ tự trong danh sách tháng đã tạo, bỏ qua tháng chưa tạo | Đã xác nhận từ knowledge (user chọn qua `AskUserQuestion` trong phiên `ssr-po mode=review`, 2026-08-11 — xem `docs/po/review-2026-08-11-quick-view-thang.md` mục 4, `DEC-071`) |
| Q2 | Khi không có tháng trước hoặc tháng sau tương ứng (ở đầu/cuối danh sách đã tạo), ô đó nên hiển thị thế nào? | Ẩn ô đó — lưới có thể chỉ còn 1-2 thẻ thay vì luôn 3 | Đã xác nhận từ knowledge (user chọn qua `AskUserQuestion` trong phiên `ssr-po mode=review`, 2026-08-11 — xem `docs/po/review-2026-08-11-quick-view-thang.md` mục 4, `DEC-072`) |
| Q3 | Thẻ tháng trước/sau có còn giữ hành vi bấm-để-chọn (đổi tháng đang xem) như hiện tại không? | Có, không có lý do nghiệp vụ nào để bỏ hành vi này | Giả định hợp lý — `ba-expert`/`ssr-ba` xác nhận lại khi viết spec nếu cần |

## 5. Ghi Chú BA

- Hành vi hiện tại (`components/BudgetApp.tsx:741-759`) hiển thị toàn bộ tháng đã tạo trong mảng `months`, không giới hạn — cần đổi sang lọc còn tối đa 3 thẻ theo vị trí tương đối (trước/đang xem/sau) trong danh sách đó.
- Khi viết spec, cần làm rõ "thứ tự trong danh sách tháng đã tạo" là thứ tự theo mã tháng (`month.id`, dạng `YYYY-MM`) sau khi sắp xếp tăng dần theo thời gian — không phải thứ tự tạo bản ghi trong database.
- Không phát hiện mâu thuẫn với `DEC` nào đã có trong `docs/memory/decisions.md`.
- Đây là opportunity UI/UX (PO-02), không phải defect — hành vi hiện tại không sai dữ liệu.
