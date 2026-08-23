---
status: Draft
updated: 2026-08-22
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-030"]
---

# BR-030 — Ba ngưỡng ngân sách (cảnh báo vượt, mục tiêu tổng chi, quỹ linh hoạt) cấu hình được theo từng tháng, không cố định trong code

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Ba ngưỡng — ngưỡng cảnh báo vượt ngân sách (mặc định 90% thu nhập), mục tiêu tổng chi (mặc định ≤ 30 triệu đồng), và quỹ linh hoạt (mặc định 7,5 triệu đồng) — được lưu riêng cho từng tháng ngân sách, Dylan tự đổi được cho từng tháng, không còn cố định cứng trong code như trước. Khi Dylan tạo một tháng mới, ba ngưỡng của tháng mới kế thừa từ tháng ngân sách gần nhất đã có, hoặc dùng giá trị mặc định nếu đây là tháng đầu tiên chưa từng có tháng nào.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-009`](../feature/US-009-cau-hinh-nguong-ngan-sach.md) | Toàn bộ 3 ngưỡng và quy tắc kế thừa khi tạo tháng mới |

## 3. Ngoại Lệ

Không có.

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định cho Dylan tự cấu hình ngưỡng thay vì cố định trong code | `docs/memory/decisions.md#dec-006` | Đã xác nhận từ knowledge |
| Quyết định nơi lưu — theo từng tháng, kế thừa tháng gần nhất | `docs/memory/decisions.md#dec-038` | Đã xác nhận từ knowledge |
| Raw requirement | `docs/kb/ba/raw/US-009-cau-hinh-nguong-ngan-sach.md` | Đã xác nhận từ knowledge |
