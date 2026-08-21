---
status: Active
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-006"]
---

# BR-006 — Module Quản lý chi tiêu có route riêng, tách khỏi shell chung

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Module Quản lý chi tiêu (ngân sách, danh mục, giao dịch) hiển thị và điều hướng độc lập tại route riêng `/budget`, tách khỏi các mục khác của Dylan Plan Dashboard (roadmap sự nghiệp, freelance, sản phẩm), nhưng vẫn dùng chung một codebase Next.js với các mục đó — không tách thành dự án/ứng dụng riêng.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-002`](../feature/US-002-route-rieng-quan-ly-chi-tieu.md) | Toàn bộ trang Quản lý chi tiêu — chuyển từ hiển thị chung trong `DylanPlanApp.tsx` sang route `/budget` riêng |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định tách route, dùng chung codebase | `docs/memory/decisions.md#dec-002` | Đã xác nhận từ knowledge |
| Quyết định tên route cụ thể `/budget` | `docs/memory/decisions.md#dec-005` | Đã xác nhận từ knowledge |
