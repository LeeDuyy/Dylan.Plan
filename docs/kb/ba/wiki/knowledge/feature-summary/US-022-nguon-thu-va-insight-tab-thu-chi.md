---
status: Active
feature: US-022
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-022"]
---

# US-022 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-022-nguon-thu-va-insight-tab-thu-chi.md`](../feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Tab Thu chi được bổ sung phần thu: Dylan khai báo nhiều nguồn thu có tên (Lương, Freelance…) cho từng tháng, và "Thu nhập tháng" thành tổng các nguồn thu thay cho con số cố định 35.000.000 đồng không sửa được trước đây. Nhờ đó các chỉ số "Số dư còn lại", "Tỷ lệ sử dụng thu nhập", "Tiết kiệm ròng", "Tỷ lệ tiết kiệm" được tính đúng. Insight tiết kiệm tách thành hai chỉ số riêng — "Tiết kiệm ròng" (Thu nhập − Tổng chi) và "Đã phân bổ vào tích lũy" (tổng chi của danh mục Loại "Tích lũy") — và các mốc mục tiêu cố định bị gỡ khỏi giao diện. Tab khi mở chọn sẵn tháng hiện tại hoặc tháng gần nhất. Danh sách "Item cần mua" cho thao tác ở tháng hiện tại và tương lai, chặn tháng đã qua. Giá trị đo được: mọi chỉ số tổng của một tháng khớp với tổng nguồn thu Dylan tự nhập cho tháng đó.

## 2. Rule Cốt Lõi

- `BR-033` Thu nhập tháng = tổng số tiền tất cả nguồn thu của tháng
- `BR-034` Insight tách "Tiết kiệm ròng" và "Đã phân bổ vào tích lũy"; bỏ mốc cứng khỏi giao diện
- `BR-035` Tab Thu chi mặc định mở tháng hiện tại, không có thì tháng gần hiện tại nhất
- `BR-036` Item cần mua thao tác được ở tháng hiện tại và tương lai, chặn tháng đã qua (thay `BR-024`)
- `BR-037` Tháng được tạo mới bắt đầu không có nguồn thu nào

## 3. Phụ Thuộc Chính

- `US-006` Depends on — dùng chung luồng "Tạo tháng"/"Clone tháng đang xem"
- `US-019` Impacts — nới điều kiện tháng thao tác item cần mua (`BR-024` → `BR-036`)
- `US-023` Impacts — phần dựng lại giao diện tab Thu chi phải làm sau US-022
