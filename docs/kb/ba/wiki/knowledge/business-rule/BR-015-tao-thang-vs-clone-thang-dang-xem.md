---
status: Active
updated: 2026-08-10
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-015"]
---

# BR-015 — "Tạo tháng" dùng danh mục mặc định, "Clone tháng đang xem" sao chép cấu trúc danh mục từ tháng đang xem

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan tạo một tháng ngân sách mới, hai nút cho hai kết quả khác nhau rõ ràng:

- **"Tạo tháng"** luôn tạo danh mục theo bộ mặc định của hệ thống, không sao chép bất kỳ gì từ tháng đang xem.
- **"Clone tháng đang xem"** luôn sao chép cấu trúc danh mục (tên, loại, hạn mức ngân sách, trạng thái khóa) của tháng đang được xem ở khu vực "Chọn tháng xem" sang tháng mới. Không sao chép thu nhập (tháng mới vẫn dùng thu nhập mặc định), không sao chép giao dịch, không sao chép danh mục "Chi tiêu khác".

Chi thực tế của mọi danh mục trong tháng mới, dù tạo theo cách nào, luôn bắt đầu ở 0 vì được tính bằng tổng hợp giao dịch thật tại thời điểm đọc, không lưu tay/carry-over.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-006`](../feature/US-006-canh-bao-trung-thang.md) | Khu vực tạo tháng mới của trang Thu chi — hành vi của nút "Tạo tháng" và nút "Clone tháng đang xem" sau khi Dylan chọn kỳ tháng hợp lệ |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt qua dialog khi ghi raw US-013 (đã gộp vào US-006) | `docs/memory/decisions.md#dec-063`, `docs/memory/decisions.md#dec-064` | Đã xác nhận từ knowledge |
| Quy tắc "Chi tiêu khác" không được sao chép khi tạo tháng | `docs/memory/decisions.md#dec-026` | Đã xác nhận từ knowledge |
