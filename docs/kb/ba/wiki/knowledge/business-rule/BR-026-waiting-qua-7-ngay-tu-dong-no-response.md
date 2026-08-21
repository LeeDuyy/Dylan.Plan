---
status: Draft
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-026"]
---

# BR-026 — Waiting quá 7 ngày tự động chuyển "No Response"

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi một job ứng tuyển đang ở trạng thái "Waiting" và đã quá 7 ngày kể từ "Ngày nộp hồ sơ" (xem [`BR-027`](BR-027-ngay-nop-ho-so-theo-chieu-waiting.md)) mà Dylan chưa đổi sang trạng thái khác, hệ thống tự động cập nhật trạng thái của job đó thành "No Response". Việc kiểm tra và cập nhật diễn ra ngay tại thời điểm dữ liệu bảng "Theo dõi CV ứng tuyển" được tải hoặc làm mới.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-020`](../feature/US-020-lich-su-trang-thai-job.md) | Toàn bộ danh sách job mỗi khi bảng "Theo dõi CV ứng tuyển" (thuộc `US-018`) tải hoặc làm mới dữ liệu |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không tự chuyển "No Response" | Dylan đã tự tay đổi job sang một trạng thái khác trong vòng 7 ngày kể từ "Ngày nộp hồ sơ" | `US-020` |
| Không áp dụng khi chưa có mốc | Job chưa từng có "Ngày nộp hồ sơ" (chưa từng chuyển qua Waiting từ Interested) thì không có mốc để tính 7 ngày | `US-020` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt cơ chế kiểm tra khi tải dữ liệu (không cần tiến trình chạy nền) | `docs/memory/decisions.md#dec-100` | Đã xác nhận từ knowledge |
| Ví dụ gốc trong yêu cầu (mốc 7 ngày) | `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 2 | Đã xác nhận từ knowledge |
