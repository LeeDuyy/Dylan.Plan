---
status: Active
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-024"]
---

# BR-024 — Chỉ thêm/sửa/xóa item cần mua ở tháng hiện tại; tháng khác chỉ xem

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Dylan chỉ được thêm item mới, sửa tên sản phẩm/giá, đổi trạng thái hoặc xóa item khi tháng đang xem trên giao diện là **tháng hiện tại** — tháng thực tế theo đồng hồ hệ thống (ví dụ hôm nay là 2026-08-14 thì luôn là tháng "2026-08"), hoàn toàn độc lập với việc Dylan đang chọn xem tháng nào qua dropdown "Chọn tháng xem" (`DEC-107`). "Sửa" nghĩa là bấm vào ô Tên sản phẩm hoặc ô Giá của một item đã có để sửa trực tiếp tại chỗ (inline), không mở form riêng (`DEC-106`). Khi xem một tháng khác tháng hiện tại (kể cả khi tháng đó đang được chọn xem qua dropdown), danh sách item hiển thị dạng chỉ xem — không có nút thêm, không có ô nhập, ô Tên sản phẩm/Giá không sửa được, không có nút đổi trạng thái hay nút xóa cho bất kỳ item nào, kể cả item đã Purchased.

Khác với quy tắc đã áp dụng cho giao dịch chi tiêu ([`BR-003`](BR-003-chi-thang-dang-chon.md), dựa theo tháng đang chọn xem trên dropdown), Items cần mua dùng "tháng hiện tại theo đồng hồ hệ thống" làm ranh giới — hai khái niệm khác nhau, không nhầm lẫn.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-019`](../feature/US-019-danh-sach-can-mua.md) | Khu vực "Items cần mua" trong bảng thu chi — ẩn/vô hiệu mọi thao tác khi tháng đang xem khác tháng hiện tại |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt qua dialog khi ghi raw US-019 — cho xóa ở tháng đang hoạt động, chặn hoàn toàn ở tháng cũ | `docs/memory/decisions.md#dec-096` | Đã xác nhận từ knowledge |
| Quyết định user chốt qua dialog trong `ssr-ba` — bổ sung khả năng sửa tên/giá tại chỗ (inline), chỉ ở tháng hiện tại | `docs/memory/decisions.md#dec-106` | Đã xác nhận từ knowledge |
| Quyết định user chốt qua dialog trong `ssr-plan` — "tháng hiện tại" (mutable) là tháng theo đồng hồ hệ thống, độc lập với dropdown "Chọn tháng xem"; khác cách tính của `BR-003`/`DEC-010` | `docs/memory/decisions.md#dec-107` | Đã xác nhận từ knowledge |
