---
status: Draft
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-038"]
---

# BR-038 — Khung giao diện dùng chung, co theo bề ngang thiết bị, một hệ thành phần Ant Design cho mọi tab

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Mọi tab của ứng dụng (Tổng quan, Roadmap, Thời gian biểu, Freelance, Sản phẩm, Thu chi) dùng chung một khung màn hình: thanh tiêu đề + vùng chuyển tab + vùng nội dung + chân trang. Khung này và các thành phần bên trong (nút, thẻ, bảng, ô chọn, nhãn trạng thái...) dựng bằng bộ thành phần Ant Design, thống nhất một bảng màu và một chế độ sáng/tối cho toàn ứng dụng.

Giao diện co theo bề ngang thiết bị:

- **Điện thoại** (bề ngang nhỏ): vùng chuyển tab thu vào một nút, mở ra bảng trượt; nội dung xếp một cột; bảng rộng cuộn ngang trong khung riêng, không làm cả trang cuộn ngang.
- **Máy tính bảng** (bề ngang vừa): nội dung xếp một đến hai cột tùy khu vực; vùng chuyển tab có thể rút gọn.
- **Màn hình rộng**: vùng chuyển tab hiển thị đầy đủ theo hàng ngang; nội dung dùng phần lớn bề ngang (không bị bó ở một khung hẹp cố định), các khu vực bảng và biểu đồ trải rộng.

Nội dung, số liệu và luồng nghiệp vụ của từng tab **không đổi** — chỉ đổi cách trình bày.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-023`](../feature/US-023-layout-antd-responsive-toan-app.md) | Toàn bộ khung layout + thành phần giao diện của mọi tab |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Biểu đồ tròn cơ cấu chi tiêu và biểu đồ cột xu hướng ở tab Thu chi giữ cách vẽ hiện tại (không chuyển sang thành phần biểu đồ của thư viện) | Chỉ khoác lại vỏ ngoài (thẻ, tiêu đề) theo Ant Design | `US-023` |
| Trang đăng nhập (`/signin`) và trang chân dung ở tên miền gốc | Ngoài phạm vi "ứng dụng kế hoạch" — không thuộc khung tab dùng chung | `US-023` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt — áp Ant Design cho toàn bộ app, giữ nhận diện màu hiện tại | `docs/memory/decisions.md#dec-132` | Đã xác nhận từ knowledge |
| Yêu cầu nguyên văn — "tận dụng đầy đủ khoảng không gian", "responsive cho mobile và tablet" | `docs/kb/ba/raw/US-023-layout-antd-responsive-toan-app.md` mục 2 | Đã xác nhận từ knowledge |
