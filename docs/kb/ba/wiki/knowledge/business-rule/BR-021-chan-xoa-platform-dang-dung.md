---
status: Draft
updated: 2026-08-13
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-021"]
---

# BR-021 — Chặn xóa option Platform đang được job sử dụng

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan cố xóa một option Platform đang được ít nhất một job ứng tuyển sử dụng, hệ thống chặn thao tác xóa và báo cho Dylan biết đang có job dùng option đó.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-018`](../feature/US-018-theo-doi-cv-ung-tuyen.md) | Thao tác quản lý option Platform trong combobox của bảng "Theo dõi CV ứng tuyển" |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Cho xóa bình thường | Option Platform không được job nào sử dụng | `US-018` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt chặn xóa option Platform đang dùng | `docs/memory/decisions.md#dec-082` | Đã xác nhận từ knowledge |
