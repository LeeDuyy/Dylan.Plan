---
status: Active
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-023"]
---

# BR-023 — Item "chưa mua" được chuyển hẳn sang tháng mới khi Dylan tạo tháng mới, ẩn khỏi tháng gốc

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan chủ động tạo một tháng ngân sách mới (không phải tự động theo ngày hệ thống thực tế) — bằng bất kỳ nút nào trong hai nút "Tạo tháng" hoặc "Clone tháng đang xem" (xem [`BR-015`](BR-015-tao-thang-vs-clone-thang-dang-xem.md)) — mọi item đang ở trạng thái Pending của **tháng nguồn** được chuyển hẳn sang tháng mới — đổi hẳn tháng sở hữu, không tạo bản sao. "Tháng nguồn" ở đây là **tháng hiện tại theo đồng hồ hệ thống** tại thời điểm bấm nút (`DEC-107`) — cùng khái niệm "tháng hiện tại" chi phối quyền thêm/sửa/xóa item ở [`BR-024`](BR-024-item-chi-thao-tac-thang-dang-chon.md) — không phải tháng Dylan đang chọn xem qua dropdown "Chọn tháng xem" nếu hai giá trị này khác nhau lúc bấm nút. Sau khi chuyển, item đó không còn hiển thị ở tháng gốc; tại một thời điểm, một item Pending chỉ xuất hiện đúng ở một tháng. Item đã ở trạng thái Purchased không bị chuyển — vẫn giữ nguyên ở tháng nó được đánh dấu đã mua.

Đây là điểm khác biệt so với danh mục ngân sách: nút "Tạo tháng" không sao chép cấu trúc danh mục (giữ nguyên hành vi đã chốt ở `BR-015`), nhưng vẫn mang item cần mua còn Pending sang tháng mới — hai loại dữ liệu này không được xử lý giống hệt nhau khi bấm "Tạo tháng".

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-019`](../feature/US-019-danh-sach-can-mua.md) | Thời điểm Dylan bấm tạo tháng mới (dùng chung luồng với [`BR-015`](BR-015-tao-thang-vs-clone-thang-dang-xem.md)) |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Item đã Purchased | Không bị chuyển sang tháng mới, giữ nguyên ở tháng đã đánh dấu mua | `US-019` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt qua dialog khi ghi raw US-019 — item chưa mua ẩn khỏi tháng gốc sau khi chuyển | `docs/memory/decisions.md#dec-095` | Đã xác nhận từ knowledge |
| Quyết định user chốt qua dialog khi ghi raw US-019 — việc chuyển chỉ kích hoạt khi Dylan chủ động tạo tháng mới, không tự động theo ngày thực tế | `docs/memory/decisions.md#dec-097` | Đã xác nhận từ knowledge |
| Quyết định user chốt qua dialog trong `ssr-ba` — cả hai nút "Tạo tháng" và "Clone tháng đang xem" đều mang item Pending sang tháng mới, dù "Tạo tháng" không sao chép cấu trúc danh mục | `docs/memory/decisions.md#dec-098` | Đã xác nhận từ knowledge |
| Quyết định user chốt qua dialog trong `ssr-plan` — "tháng nguồn" là tháng hiện tại theo đồng hồ hệ thống, không phải tháng đang chọn xem trên dropdown | `docs/memory/decisions.md#dec-107` | Đã xác nhận từ knowledge |
