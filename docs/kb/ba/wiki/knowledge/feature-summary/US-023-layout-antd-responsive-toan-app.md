---
status: Active
feature: US-023
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature-summary]
aliases: ["US-023"]
---

# US-023 — Tóm Tắt

> Bản tóm tắt ngắn cho AI đọc nhanh trước khi mở [`../feature/US-023-layout-antd-responsive-toan-app.md`](../feature/US-023-layout-antd-responsive-toan-app.md) đầy đủ. Không chứa thông tin mới — chỉ cô đọng.

## 1. Tóm Tắt Một Đoạn

Chuẩn hóa toàn bộ giao diện ứng dụng bằng Ant Design: một khung màn hình chung (thanh tiêu đề + vùng chuyển tab + nội dung + chân trang) cho mọi tab kể cả Thu chi, một bảng màu và chế độ sáng/tối thống nhất (ánh xạ từ các biến màu hiện có). Nội dung dùng phần lớn bề ngang màn hình rộng thay vì bó ở khung ~1220px. Giao diện co theo bề ngang thiết bị: điện thoại thu vùng chuyển tab vào bảng trượt, nội dung một cột, bảng rộng cuộn trong khung riêng. Nội dung, số liệu và luồng nghiệp vụ của mọi tab giữ nguyên — chỉ đổi tầng trình bày. Giá trị đo được: mở mọi tab ở ~375px / ~768px / ~1440px không tab nào bị cuộn ngang toàn trang.

## 2. Rule Cốt Lõi

- `BR-038` Khung dùng chung, co theo bề ngang thiết bị, một hệ thành phần Ant Design cho mọi tab; nội dung/nghiệp vụ không đổi

## 3. Phụ Thuộc Chính

- `US-022` Depends on — dựng lại giao diện tab Thu chi trên nền US-022, làm sau
- `US-018` Impacts — bảng "Theo dõi CV ứng tuyển" chuyển sang bảng Ant Design, giữ cột/hành vi
