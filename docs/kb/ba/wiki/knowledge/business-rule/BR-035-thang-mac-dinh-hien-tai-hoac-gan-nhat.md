---
status: Draft
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-035"]
---

# BR-035 — Tab Thu chi mặc định mở tháng hiện tại, không có thì tháng gần hiện tại nhất

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan mở tab Thu chi, tháng được chọn xem sẵn được xác định như sau:

1. Nếu tháng hiện tại theo đồng hồ hệ thống đã có dữ liệu (đã được tạo), chọn tháng đó.
2. Nếu chưa, chọn tháng đã có dữ liệu có khoảng cách tính bằng số tháng tới tháng hiện tại là nhỏ nhất.
3. Nếu có hai tháng cách đều tháng hiện tại (một ở quá khứ, một ở tương lai), chọn tháng ở quá khứ.
4. Nếu chưa có tháng nào, không chọn tháng nào (màn hình ở trạng thái trống như hiện tại).

Trước tính năng này, tab luôn mở tháng cuối cùng có dữ liệu, không liên quan tới đồng hồ hệ thống.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-022`](../feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Ô "Chọn tháng xem" trong tab Thu chi — giá trị chọn sẵn khi tab vừa mở |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không chọn tháng nào | Chưa có tháng ngân sách nào được tạo | `US-022` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Yêu cầu nêu trực tiếp trong raw US-022 và chốt qua dialog | `docs/memory/decisions.md#dec-129` | Đã xác nhận từ knowledge |
| Cách xác định "tháng hiện tại theo đồng hồ hệ thống" đã dùng ở rule khác | [`BR-024`](BR-024-item-chi-thao-tac-thang-dang-chon.md), `docs/memory/decisions.md#dec-107` | Đã xác nhận từ knowledge |
