---
status: Active
updated: 2026-08-12
flow: F2
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/epic]
aliases: ["EPC-002"]
---

# EPC-002 — Lập và điều chỉnh ngân sách theo danh mục

> Ánh xạ 1:1 với luồng `F2` trong [`docs/kb/ba/business-flow.md`](../../../business-flow.md). Không tự đặt định hướng — mọi mục tiêu ở đây trích từ Business Flow.

## 1. Mục Tiêu Epic

Cho Dylan xem và điều chỉnh ngân sách theo từng danh mục (thêm, sửa tên/loại/ngân sách, xóa), với "Chi thực tế" luôn tính tự động từ tổng giao dịch — phục vụ mục tiêu M1 (dữ liệu chi tiêu chính xác, nhất quán).

## 2. Actor

| Vai trò | Vai trò trong epic này |
| --- | --- |
| Dylan | Người dùng duy nhất — xem, thêm, sửa, xóa danh mục thường; chỉ xem "Chi tiêu khác" |

## 3. Phạm Vi

- Xem bảng ngân sách theo danh mục (Ngân sách, Chi thực tế, Còn lại)
- Thêm danh mục mới, sửa tên/loại/ngân sách danh mục đã có
- Xóa một danh mục thường — chuyển giao dịch sang "Chi tiêu khác"
- "Chi tiêu khác" tự sinh khi cần, khóa vĩnh viễn, ẩn khi hết giao dịch

## 4. Danh Sách Feature

| Mã | Tên function | Trạng thái | Trang |
| --- | --- | --- | --- |
| `US-005` | Ràng buộc toàn vẹn danh mục + giao dịch không danh mục | Active | [`../feature/US-005-rang-buoc-toan-ven-danh-muc.md`](../feature/US-005-rang-buoc-toan-ven-danh-muc.md) |
| `US-010` | Chặn trùng tên danh mục | Active | [`../feature/US-010-chan-trung-ten-danh-muc.md`](../feature/US-010-chan-trung-ten-danh-muc.md) |
| `US-014` | Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục | Draft | [`../feature/US-014-chi-tieu-khac-cuoi-bang.md`](../feature/US-014-chi-tieu-khac-cuoi-bang.md) |
| `US-016` | Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định | Active | [`../feature/US-016-loai-chi-tieu-combobox.md`](../feature/US-016-loai-chi-tieu-combobox.md) |
| `US-017` | Sắp xếp vị trí danh mục bằng kéo thả (drag-and-drop row reordering) | Active | [`../feature/US-017-sap-xep-danh-muc-keo-tha.md`](../feature/US-017-sap-xep-danh-muc-keo-tha.md) |
