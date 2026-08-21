---
status: Active
updated: 2026-08-06
flow: F1
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/epic]
aliases: ["EPC-001"]
---

# EPC-001 — Ghi nhận chi tiêu

> Ánh xạ 1:1 với luồng `F1` trong [`docs/kb/ba/business-flow.md`](../../../business-flow.md). Không tự đặt định hướng — mọi mục tiêu ở đây trích từ Business Flow.

## 1. Mục Tiêu Epic

Cho Dylan ghi nhận nhanh một giao dịch chi tiêu (nội dung tự nhiên + số tiền), tự nhận diện danh mục, và sau đó xem lại/sửa/xóa giao dịch đã ghi nhận khi cần — phục vụ mục tiêu M1 (dữ liệu chi tiêu lưu trữ bền vững, chính xác).

## 2. Actor

| Vai trò | Vai trò trong epic này |
| --- | --- |
| Dylan | Người dùng duy nhất — ghi nhận, xem lại, sửa, xóa giao dịch chi tiêu của mình |

## 3. Phạm Vi

- Nhập nhanh một giao dịch bằng nội dung tự nhiên, tự tách số tiền và gợi ý danh mục
- Xem lại danh sách giao dịch gần đây tại bảng chi tiết chi tiêu
- Sửa đầy đủ 4 trường hoặc xóa (có xác nhận) một giao dịch của tháng đang chọn
- "Chi thực tế" của danh mục luôn tính lại tự động từ tổng giao dịch sau mỗi thay đổi

## 4. Danh Sách Feature

| Mã | Tên function | Trạng thái | Trang |
| --- | --- | --- | --- |
| `US-001` | Lưu trữ chi tiêu bền vững (data model + migration) | Active | Chưa migrate sang cấu trúc wiki nested — xem `docs/kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md` (legacy) |
| `US-003` | Liên kết giao dịch theo danh mục bằng ID | Active | [`../feature/US-003-lien-ket-giao-dich-theo-id.md`](../feature/US-003-lien-ket-giao-dich-theo-id.md) |
| `US-004` | Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu | Draft | [`../feature/US-004-sua-xoa-tung-giao-dich.md`](../feature/US-004-sua-xoa-tung-giao-dich.md) |
| `US-012` | Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi | Active | [`../feature/US-012-sua-loi-nhan-dien-danh-muc.md`](../feature/US-012-sua-loi-nhan-dien-danh-muc.md) |
