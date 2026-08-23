---
status: Active
updated: 2026-08-21
flow: F4
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/epic]
aliases: ["EPC-004"]
---

# EPC-004 — Phân tích và báo cáo chi tiêu

> Ánh xạ 1:1 với luồng `F4` trong [`docs/kb/ba/business-flow.md`](../../../business-flow.md). Không tự đặt định hướng — mọi mục tiêu ở đây trích từ Business Flow.

## 1. Mục Tiêu Epic

Cho Dylan nắm nhanh tình hình tài chính qua các thẻ insight (danh mục chi nhiều nhất, tiết kiệm, chi linh hoạt), biểu đồ cơ cấu chi theo danh mục, xu hướng chi qua các tháng, mini dashboard 3/6/9/12 tháng gần đây, và xuất dữ liệu ra file — phục vụ mục tiêu `M1` (dữ liệu bền vững, chính xác) của Business Flow.

## 2. Actor

| Vai trò | Vai trò trong epic này |
| --- | --- |
| Dylan | Xem toàn bộ insight, biểu đồ, mini dashboard; xuất dữ liệu |

## 3. Phạm Vi

- Thẻ insight (danh mục chi nhiều nhất, tiết kiệm, chi linh hoạt)
- Biểu đồ cơ cấu chi theo danh mục và xu hướng chi qua các tháng
- Mini dashboard 3/6/9/12 tháng gần đây
- Xuất dữ liệu ra file JSON

## 4. Danh Sách Feature

| Mã | Tên function | Trạng thái | Trang |
| --- | --- | --- | --- |
| `US-007` | Phân tích xu hướng trên toàn bộ lịch sử đã lưu | Active | [`../feature/US-007-phan-tich-xu-huong-lich-su.md`](../feature/US-007-phan-tich-xu-huong-lich-su.md) |
| `US-008` | Xuất dữ liệu từ nguồn lưu trữ bền vững | Active | [`../feature/US-008-xuat-du-lieu-ben-vung.md`](../feature/US-008-xuat-du-lieu-ben-vung.md) |
