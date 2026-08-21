---
status: Active
updated: 2026-08-05
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-007"]
---

# BR-007 — Giao dịch liên kết danh mục qua mã nhận diện cố định, không theo tên hiển thị

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Mỗi giao dịch chi tiêu gắn với đúng một danh mục thông qua một mã nhận diện cố định của danh mục đó (gán một lần khi ghi nhận giao dịch, không đổi sau này) — không gắn theo tên hiển thị của danh mục. Nhờ đó, khi Dylan đổi tên một danh mục, toàn bộ giao dịch trước đó vẫn hiển thị đúng dưới tên mới, không bị lệch hay mất liên kết.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-003`](../feature/US-003-lien-ket-giao-dich-theo-id.md) | Toàn bộ thiết kế liên kết Giao dịch → Danh mục |
| [`US-004`](../feature/US-004-sua-xoa-tung-giao-dich.md) | Sửa danh mục của một giao dịch — đổi đúng mã nhận diện, không đổi theo tên |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Gap gốc: giao dịch liên kết theo tên chuỗi, đổi tên danh mục làm lệch dữ liệu | `docs/kb/ba/business-flow.md#5-điểm-chạm-giữa-các-luồng`, mục 7 gap #4 (đã giải quyết) | Đã xác nhận từ knowledge |
| Thiết kế khóa ngoại `categoryId` trên `Transaction`, đã tạo và áp dụng cùng đợt với US-001 | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/data-model.md` | Đã xác nhận từ knowledge |
