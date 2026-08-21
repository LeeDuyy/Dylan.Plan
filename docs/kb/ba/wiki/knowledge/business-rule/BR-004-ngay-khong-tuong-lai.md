---
status: Active
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-004", "P1.1"]
---

# BR-004 — Ngày giao dịch chỉ nhận giá trị ≤ hôm nay

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Một giao dịch chi tiêu chỉ được ghi nhận hoặc sửa với ngày ≤ hôm nay — hệ thống chỉ ghi nhận các giao dịch đã xảy ra từ hiện tại về quá khứ, không cho phép ngày giao dịch ở tương lai dưới bất kỳ hình thức nào.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-004`](../feature/US-004-sua-xoa-tung-giao-dich.md) | Trường "ngày" trong form sửa giao dịch — chặn lưu nếu chọn ngày tương lai |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Luật dự án P1.1 — áp dụng cho mọi đường ghi nhận/sửa ngày | `docs/memory/rules.md#p1-nghiệp-vụ`, `docs/memory/decisions.md#dec-017` | Đã xác nhận từ knowledge |
