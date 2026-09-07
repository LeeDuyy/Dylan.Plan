---
status: Draft
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-037"]
---

# BR-037 — Tháng được tạo mới bắt đầu không có nguồn thu nào

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan tạo một tháng ngân sách mới — kể cả khi chọn "Clone tháng đang xem" để sao chép danh mục — danh sách nguồn thu của tháng mới bắt đầu trống. Dylan tự thêm từng nguồn thu. Trước khi Dylan thêm nguồn thu nào, Thu nhập tháng của tháng mới bằng 0.

Việc sao chép chỉ áp dụng cho danh mục chi (theo [`BR-015`](BR-015-tao-thang-vs-clone-thang-dang-xem.md)); nguồn thu không được sao chép.

Các tháng đã tồn tại **trước** khi tính năng nguồn thu ra mắt được giữ lại một nguồn thu tên "Lương" bằng đúng số Thu nhập tháng cũ, để không làm sai lệch chỉ số của các tháng lịch sử — đây là việc chuyển dữ liệu một lần, không phải hành vi lặp lại khi tạo tháng.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-022`](../feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Luồng tạo tháng mới / clone tháng đang xem — phần khởi tạo nguồn thu |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Tháng có sẵn một nguồn thu "Lương" | Tháng được tạo trước khi tính năng nguồn thu ra mắt (chuyển dữ liệu một lần) | `US-022` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định user chốt qua dialog khi ghi raw US-022 — "Luôn bắt đầu rỗng" | `docs/memory/decisions.md#dec-131` | Đã xác nhận từ knowledge |
| Cơ chế tạo tháng vs clone tháng đang xem hiện có | [`BR-015`](BR-015-tao-thang-vs-clone-thang-dang-xem.md) | Đã xác nhận từ knowledge |
