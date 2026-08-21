---
status: Active
updated: 2026-08-06
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-012"]
---

# BR-012 — "Chi tiêu khác" ẩn khỏi giao diện khi hết giao dịch, nhưng bản ghi vẫn giữ nguyên trong dữ liệu

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Danh mục "Chi tiêu khác" chỉ xuất hiện trên bảng ngân sách theo danh mục khi đang có ít nhất một giao dịch gán vào nó. Ngay khi giao dịch cuối cùng của nó bị chuyển đi hoặc bị xóa, danh mục này ẩn khỏi giao diện của Dylan. "Ẩn" chỉ là lọc khỏi màn hình hiển thị — bản ghi danh mục vẫn được giữ nguyên trong dữ liệu, không bị xóa.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-005`](../feature/US-005-rang-buoc-toan-ven-danh-muc.md) | Điều kiện hiển thị dòng "Chi tiêu khác" trong bảng ngân sách theo danh mục |
| `US-004` | Sửa/xóa giao dịch có thể làm "Chi tiêu khác" mất giao dịch cuối cùng, kích hoạt điều kiện ẩn này |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định chỉ hiển thị khi còn giao dịch | `docs/memory/decisions.md#dec-029` | Đã xác nhận từ knowledge |
| Quyết định "ẩn" là lọc hiển thị, không xóa bản ghi | `docs/memory/decisions.md#dec-030` | Đã xác nhận từ knowledge |
