---
status: Draft
updated: 2026-08-21
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-029"]
---

# BR-029 — Xuất dữ liệu JSON đọc từ nguồn lưu trữ bền vững, không chỉ từ bộ nhớ tạm của trình duyệt

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan bấm nút "Xuất JSON" ở trang Thu chi, file tải về phải chứa dữ liệu lấy từ toàn bộ nguồn lưu trữ bền vững trong cơ sở dữ liệu (mọi tháng, danh mục, giao dịch, item cần mua đã lưu), không chỉ từ dữ liệu đang có sẵn trong bộ nhớ tạm của trình duyệt tại thời điểm bấm nút.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-008`](../feature/US-008-xuat-du-lieu-ben-vung.md) | Nguồn dữ liệu của nút "Xuất JSON" |

## 3. Ngoại Lệ

Không có.

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Business Flow ghi nhận nút "Xuất JSON" hiện là tải file thủ công, đọc từ state trình duyệt | `docs/kb/ba/business-flow.md#2-bối-cảnh-và-người-dùng` | Đã xác nhận từ knowledge |
| Raw requirement | `docs/kb/ba/raw/US-008-xuat-du-lieu-ben-vung.md` | Đã xác nhận từ knowledge |
