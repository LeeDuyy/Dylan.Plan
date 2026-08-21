---
status: Active
feature: US-020
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-020"]
---

# US-020 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-020-lich-su-trang-thai-job.md`](../feature/US-020-lich-su-trang-thai-job.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Mở rộng bảng "Theo dõi CV ứng tuyển" (`US-018`) với mốc thời gian "Ngày nộp hồ sơ" và hai luật tự động đổi trạng thái theo thời gian. Dành cho Dylan. Job đang "Interested" mà quá Ngày hết hạn tự chuyển "Expired" (trạng thái mới, vẫn chọn tay được); job đang "Waiting" quá 7 ngày kể từ "Ngày nộp hồ sơ" mà không đổi trạng thái khác tự chuyển "No Response". Cả hai luật tính lại mỗi khi bảng được tải/làm mới, không cần tiến trình chạy nền. Giá trị đo được: Dylan thấy ngay job nào cần chú ý mà không phải tự tính tay từng ngày.

## 2. Rule Cốt Lõi

- `BR-025` Interested + quá hạn → tự động "Expired" (chỉ từ Interested)
- `BR-026` Waiting quá 7 ngày kể từ Ngày nộp hồ sơ, không đổi trạng thái → tự động "No Response"
- `BR-027` Interested → Waiting ghi "Ngày nộp hồ sơ"; Waiting → Interested xoá mốc đó

## 3. Phụ Thuộc Chính

- `US-018` Depends on — mở rộng trực tiếp entity Job ứng tuyển và bảng đã có, không triển khai độc lập được
