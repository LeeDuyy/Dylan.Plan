---
status: Active
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-022"]
---

# BR-022 — Giá của item cần mua chỉ là ghi chú tham khảo, không cộng vào Ngân sách/Chi thực tế

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Trường giá của một item cần mua chỉ hiển thị như ghi chú tham khảo. Nó không cộng vào Ngân sách, Chi thực tế hay Số dư còn lại của tháng. Muốn tính một khoản mua sắm vào chi tiêu thật, Dylan vẫn phải ghi một giao dịch thu chi riêng như cách làm hiện nay ở khu vực nhập nhanh.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-019`](../feature/US-019-danh-sach-can-mua.md) | Trường "Giá" khi Dylan thêm hoặc sửa một item trong danh sách cần mua |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt qua dialog khi ghi raw US-019 | `docs/memory/decisions.md#dec-092` | Đã xác nhận từ knowledge |
