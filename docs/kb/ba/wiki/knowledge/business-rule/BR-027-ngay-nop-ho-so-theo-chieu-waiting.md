---
status: Draft
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-027"]
---

# BR-027 — Ghi nhận và xoá mốc "Ngày nộp hồ sơ" theo chiều Interested ↔ Waiting

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi một job ứng tuyển chuyển từ trạng thái "Interested" sang "Waiting", hệ thống ghi nhận thời điểm chuyển đó là "Ngày nộp hồ sơ" (ngày giờ). Khi job đó chuyển ngược từ "Waiting" về lại "Interested", mốc "Ngày nộp hồ sơ" đã ghi trước đó bị xoá.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-020`](../feature/US-020-lich-su-trang-thai-job.md) | Thao tác đổi Trạng thái của một job trong bảng "Theo dõi CV ứng tuyển" (thuộc `US-018`) |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không xoá mốc | Job chuyển từ "Waiting" sang một trạng thái khác "Interested" (No Response, Response, Appointment, Cancel, Fail) — mốc "Ngày nộp hồ sơ" được giữ nguyên | `US-020` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt chỉ lưu một mốc "Ngày nộp hồ sơ", không lưu log đầy đủ mọi lần đổi trạng thái | `docs/memory/decisions.md#dec-099` | Đã xác nhận từ knowledge |
| Ví dụ gốc trong yêu cầu (ghi nhận khi Interested → Waiting, xoá khi chuyển ngược) | `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 2 | Đã xác nhận từ knowledge |
| Job chuyển từ Waiting sang trạng thái khác Interested không xoá mốc | `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 4 (Q5) | Giả định hợp lý |
