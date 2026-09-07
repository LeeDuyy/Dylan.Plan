---
status: Draft
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-033"]
---

# BR-033 — Thu nhập tháng là tổng số tiền tất cả nguồn thu của tháng

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

"Thu nhập tháng" của một tháng ngân sách bằng tổng số tiền của tất cả các nguồn thu thuộc tháng đó. Khi Dylan thêm, sửa số tiền hoặc xóa một nguồn thu, Thu nhập tháng được tính lại ngay và mọi chỉ số phụ thuộc (Số dư còn lại, Tỷ lệ sử dụng thu nhập, Tiết kiệm ròng, Tỷ lệ tiết kiệm) đổi theo. Một tháng không có nguồn thu nào thì Thu nhập tháng bằng 0.

Trước tính năng này, Thu nhập tháng là một con số cố định 35.000.000 đồng gán sẵn khi tạo tháng và không sửa được — đó là nguyên nhân khiến các chỉ số tiết kiệm/thu nhập hiển thị sai.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-022`](../feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Bảng "Nguồn thu" và mọi ô hiển thị chỉ số tổng trong tab Thu chi |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt qua dialog khi ghi raw US-022 — nhiều nguồn thu có tên, Thu nhập tháng = tổng | `docs/memory/decisions.md#dec-127` | Đã xác nhận từ knowledge |
| Định nghĩa chỉ số trong từ điển dự án | `docs/memory/glossary.md` (mục 4, "Thu nhập tháng") | Đã xác nhận từ knowledge |
