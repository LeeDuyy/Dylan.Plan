---
status: Draft
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-034"]
---

# BR-034 — Insight tiết kiệm tách hai chỉ số: Tiết kiệm ròng và Đã phân bổ vào tích lũy

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khu vực insight của tab Thu chi hiển thị hai chỉ số tiết kiệm **riêng biệt**, không gộp:

1. **Tiết kiệm ròng** = Thu nhập tháng − Tổng chi thực tế của tháng. Được phép âm khi chi vượt thu; khi âm hiển thị rõ là số âm (ví dụ "Vượt thu nhập 2.000.000đ").
2. **Đã phân bổ vào tích lũy** = tổng Chi thực tế của các danh mục có Loại là "Tích lũy". Xác định bằng đúng trường Loại của danh mục, không dò theo từ khóa trong tên danh mục.

Kèm theo: **Tỷ lệ tiết kiệm** = Tiết kiệm ròng chia Thu nhập tháng, hiển thị phần trăm. Khi Thu nhập tháng bằng 0, hiển thị "—" thay cho phần trăm (không chia cho 0).

Các mốc mục tiêu cố định trước đây (5.000.000đ, 7.500.000đ, 31.500.000đ, 30.000.000đ, 90%) bị gỡ khỏi giao diện — insight chỉ hiển thị số thực tế, không kèm câu chữ mục tiêu cứng. Việc cấu hình ngưỡng do [`US-009`](../feature/US-009-cau-hinh-nguong-ngan-sach.md) đảm nhận.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-022`](../feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Khu vực "Insight tài chính" và khu vực "Quy tắc kiểm soát" trong tab Thu chi |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Tỷ lệ tiết kiệm hiển thị "—" thay cho phần trăm | Thu nhập tháng bằng 0 | `US-022` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt qua dialog khi ghi raw US-022 — hai chỉ số tách riêng, kèm tỷ lệ tiết kiệm | `docs/memory/decisions.md#dec-128` | Đã xác nhận từ knowledge |
| Quyết định user chốt qua dialog — bỏ hẳn số mục tiêu cứng khỏi giao diện | `docs/memory/decisions.md#dec-131` | Đã xác nhận từ knowledge |
| Định nghĩa chỉ số trong từ điển dự án | `docs/memory/glossary.md` (mục 4) | Đã xác nhận từ knowledge |
