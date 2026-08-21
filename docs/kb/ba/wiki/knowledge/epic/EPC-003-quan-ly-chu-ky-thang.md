---
status: Active
updated: 2026-08-11
flow: F3
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/epic]
aliases: ["EPC-003"]
---

# EPC-003 — Quản lý theo chu kỳ tháng

> Ánh xạ 1:1 với luồng `F3` trong [`docs/kb/ba/business-flow.md`](../../../business-flow.md). Không tự đặt định hướng — mọi mục tiêu ở đây trích từ Business Flow.

## 1. Mục Tiêu Epic

Cho Dylan chọn một tháng đã có để thao tác, hoặc tạo một tháng ngân sách mới (trống hoặc sao chép cấu trúc danh mục từ tháng hiện tại) — phục vụ mục tiêu M2, đặt nền cho toàn bộ dữ liệu ghi nhận/điều chỉnh của tháng đó ở F1 và F2. Đồng thời phục vụ mục tiêu M3 (`DEC-105`): quản lý danh sách sản phẩm cần mua theo tháng, tự động mang sản phẩm chưa mua sang tháng mới khi Dylan tạo tháng.

## 2. Actor

| Vai trò | Vai trò trong epic này |
| --- | --- |
| Dylan | Người dùng duy nhất — chọn tháng, tạo tháng mới |

## 3. Phạm Vi

- Chọn một tháng đã có từ danh sách để xem/thao tác
- Tạo tháng mới: trống (dùng danh mục mặc định) hoặc sao chép cấu trúc danh mục từ tháng đang chọn
- Kiểm tra và cảnh báo khi kỳ tháng được chọn để tạo đã tồn tại

## 4. Danh Sách Feature

| Mã | Tên function | Trạng thái | Trang |
| --- | --- | --- | --- |
| `US-006` | Cảnh báo trùng tháng khi tạo tháng mới | Active | [`../feature/US-006-canh-bao-trung-thang.md`](../feature/US-006-canh-bao-trung-thang.md) |
| `US-015` | Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view | Active | [`../feature/US-015-quick-view-thang-lien-ke.md`](../feature/US-015-quick-view-thang-lien-ke.md) |
| `US-019` | Danh sách items cần mua theo tháng tại bảng thu chi | Active | [`../feature/US-019-danh-sach-can-mua.md`](../feature/US-019-danh-sach-can-mua.md) |
