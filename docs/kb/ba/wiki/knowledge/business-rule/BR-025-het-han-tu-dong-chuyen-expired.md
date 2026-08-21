---
status: Draft
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-025"]
---

# BR-025 — Quá hạn tự động chuyển "Expired" (chỉ từ Interested)

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi một job ứng tuyển đang ở trạng thái "Interested" và Ngày hết hạn của job đó đã qua so với ngày hiện tại, hệ thống tự động cập nhật trạng thái của job đó thành "Expired". Việc kiểm tra và cập nhật diễn ra ngay tại thời điểm dữ liệu bảng "Theo dõi CV ứng tuyển" được tải hoặc làm mới.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-020`](../feature/US-020-lich-su-trang-thai-job.md) | Toàn bộ danh sách job mỗi khi bảng "Theo dõi CV ứng tuyển" (thuộc `US-018`) tải hoặc làm mới dữ liệu |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không tự chuyển "Expired" | Job đang ở trạng thái khác "Interested" (Waiting, No Response, Response, Appointment, Cancel, Fail) dù Ngày hết hạn đã qua — giữ nguyên trạng thái hiện tại | `US-020` |
| "Expired" vẫn chọn/đổi tay được | Dylan có thể tự đổi trạng thái một job đã "Expired" sang bất kỳ trạng thái nào khác, giống các trạng thái còn lại | `US-020` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt phạm vi áp dụng chỉ từ "Interested" | `docs/memory/decisions.md#dec-101` | Đã xác nhận từ knowledge |
| Quyết định user chốt cơ chế kiểm tra khi tải dữ liệu (không cần tiến trình chạy nền) | `docs/memory/decisions.md#dec-100` | Đã xác nhận từ knowledge |
| Quyết định user chốt "Expired" vẫn chọn tay được trong danh sách trạng thái | `docs/memory/decisions.md#dec-102` | Đã xác nhận từ knowledge |
| Ví dụ gốc trong yêu cầu | `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 2 | Đã xác nhận từ knowledge |
