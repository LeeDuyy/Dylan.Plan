---
status: Active
updated: 2026-08-28
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-032"]
---

# BR-032 — Suy Platform tuyển dụng từ tên miền của link

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi tự điền một dòng job từ link (theo [`BR-031`](BR-031-tu-dien-job-tu-link.md)), hệ thống xác định Platform bằng cách so tên miền của đường dẫn với danh sách kênh Platform đang có. Nếu tên miền của đường dẫn **chứa** tên đúng một kênh trong danh sách (so **không phân biệt chữ hoa/thường** — ví dụ `careers.itviec.com` và `itviec.com.vn` đều khớp kênh "ITViec") thì tự chọn kênh đó cho dòng job (nếu ô Platform đang trống). Nếu tên miền **không chứa** tên kênh nào, hoặc **chứa tên nhiều kênh cùng lúc**, thì để trống ô Platform và hiện thông báo nhẹ "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới".

Hệ thống **không** tự tạo kênh Platform mới từ tên miền, và **không** gán vào một nhãn gộp như "Khác" (`DEC-118`, `DEC-124`). Việc suy Platform không phụ thuộc vào việc đọc được nội dung trang — chỉ cần đường dẫn hợp lệ là suy được, kể cả khi nội dung trang bị chặn.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-021`](../feature/US-021-tu-dien-thong-tin-job-link.md) | Bước tự điền trường Platform của dòng job trong bảng "Theo dõi CV ứng tuyển" |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Giữ nguyên ô Platform | Dylan đã tự chọn Platform cho dòng job đó | `US-021` |
| Để trống, không báo | Danh sách kênh Platform đang rỗng (chưa có kênh nào) | `US-021` |
| Để trống + báo nhẹ | Tên miền không chứa tên kênh nào, hoặc chứa tên nhiều kênh cùng lúc (`DEC-124`) | `US-021` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định chốt với user | `docs/memory/decisions.md#dec-113`, `#dec-118`, `#dec-124` | Đã xác nhận từ knowledge |
| Danh sách Platform động, 3 kênh mặc định, Dylan tự quản lý | `docs/kb/ba/wiki/data/entity/ENT-005-platform-tuyen-dung.md`, `docs/memory/decisions.md#dec-082` | Đã xác nhận từ knowledge |
| Nhận định về giá trị thực của việc suy Platform | `docs/memory/judgement-log.md#jdg-032` | Giả định hợp lý |
