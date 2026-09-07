---
status: Draft
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-036"]
---

# BR-036 — Dữ liệu nhập tay theo tháng (Item cần mua, Nguồn thu) thao tác được ở tháng hiện tại và tương lai, chặn tháng đã qua

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Dylan được thêm mới, sửa tại chỗ, sắp xếp và xóa các bản ghi nhập tay gắn theo tháng — cụ thể là **Item cần mua** (thêm/sửa tên sản phẩm/giá/đánh dấu đã mua/xóa) và **Nguồn thu** (thêm/sửa tên/số tiền/sắp xếp/xóa) — khi tháng đang xem trên giao diện là **tháng hiện tại theo đồng hồ hệ thống hoặc bất kỳ tháng nào sau tháng hiện tại**. Khi tháng đang xem là một tháng đã kết thúc (trước tháng hiện tại), các khu vực này hiển thị dạng chỉ xem — không nút thêm, không ô nhập, các ô không sửa được, không nút xóa/đánh dấu/kéo-thả, kể cả với item đã Purchased.

Rule này **thay thế** [`BR-024`](BR-024-item-chi-thao-tac-thang-dang-chon.md) (chỉ cho thao tác đúng tháng hiện tại) trong phạm vi hành vi "tháng nào được thao tác": nới từ "đúng tháng hiện tại" thành "tháng không ở quá khứ". Hành vi tự chuyển item còn Pending sang tháng mới khi tạo tháng ([`BR-023`](BR-023-item-chuyen-thang-khi-tao-thang-moi.md)) giữ nguyên.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-019`](../feature/US-019-danh-sach-can-mua.md) | Khu vực "Items cần mua" — điều kiện bật/tắt thao tác đổi từ `BR-024` sang `BR-036` |
| [`US-022`](../feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Nới giới hạn tháng cho khu vực "Items cần mua"; áp cùng quy tắc tháng cho bảng "Nguồn thu" trong tab Thu chi |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Danh sách item / bảng nguồn thu ở chế độ chỉ xem | Tháng đang xem là tháng trước tháng hiện tại | `US-019`, `US-022` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt qua dialog khi ghi raw US-022 — "Hiện tại + tương lai, chặn tháng đã qua" | `docs/memory/decisions.md#dec-130` | Đã xác nhận từ knowledge |
| Quyết định user chốt qua dialog trong `ssr-ba` — áp cùng quy tắc tháng cho bảng "Nguồn thu" | `docs/memory/decisions.md#dec-133` | Đã xác nhận từ knowledge |
| Rule bị thay thế và các quyết định gốc của US-019 | `docs/memory/decisions.md#dec-094`, `#dec-096`, [`BR-024`](BR-024-item-chi-thao-tac-thang-dang-chon.md) | Đã xác nhận từ knowledge |
