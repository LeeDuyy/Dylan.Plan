---
status: Active
updated: 2026-08-12
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-020"]
---

# BR-020 — Thứ tự danh mục sau kéo thả lưu bền vững và đồng bộ 3 nơi dùng chung danh sách

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan kéo thả để đổi vị trí một danh mục trong bảng ngân sách, thứ tự mới được lưu bền vững (không mất khi tải lại trang, đổi tháng, hoặc mở lại sau này) và áp dụng đồng bộ cho cả 3 nơi dùng chung một nguồn danh sách danh mục — bảng ngân sách, dropdown "Danh mục nhận diện" ở khu nhập nhanh, và biểu đồ "Cơ cấu chi tiêu". Danh mục đã "khóa" (`locked = true`, ví dụ "Tiền nhà") vẫn tham gia kéo thả đổi vị trí bình thường như danh mục khác — `locked` chỉ tiếp tục mang nghĩa chặn xóa, không mở rộng sang chặn đổi vị trí.

Khi Dylan tạo tháng mới bằng nút "Clone tháng đang xem" (sao chép danh mục từ tháng nguồn), thứ tự danh mục ở tháng mới giữ nguyên đúng theo thứ tự của tháng nguồn — nhất quán với cách các thuộc tính khác (tên, loại, ngân sách, khóa) đã được sao chép nguyên vẹn.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-017`](../feature/US-017-sap-xep-danh-muc-keo-tha.md) | Thao tác kéo thả trên bảng danh mục ở trang Thu chi; đồng bộ sang dropdown "Danh mục nhận diện" và biểu đồ "Cơ cấu chi tiêu"; áp dụng cho cả nghiệp vụ Clone tháng (`EL-06`) |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| "Chi tiêu khác" (`isFallback`) không tham gia kéo thả | Luôn cố định ở vị trí cuối bảng bất kể thao tác kéo thả — xem [`BR-016`](BR-016-chi-tieu-khac-cuoi-bang.md), không bị đảo ngược bởi rule này | `US-017` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định lưu bền vững vào database | `docs/memory/decisions.md#dec-074` | Đã xác nhận từ knowledge |
| Quyết định danh mục khóa vẫn kéo thả được | `docs/memory/decisions.md#dec-075` | Đã xác nhận từ knowledge |
| Quyết định "Chi tiêu khác" tiếp tục cố định cuối bảng | `docs/memory/decisions.md#dec-076` | Đã xác nhận từ knowledge |
| Quyết định đồng bộ 3 nơi dùng chung danh sách | `docs/memory/decisions.md#dec-077` | Đã xác nhận từ knowledge |
| Khi tạo tháng mới bằng Clone từ tháng nguồn, thứ tự danh mục giữ theo tháng nguồn | `docs/memory/decisions.md#dec-078` — user xác nhận qua dialog `AskUserQuestion` trong `ssr-ba` (2026-08-12) | Đã xác nhận từ knowledge |
