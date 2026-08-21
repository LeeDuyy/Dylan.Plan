---
status: Draft
updated: 2026-08-13
owner: ssr-ingest
tags: [kb/ba/wiki/data/entity]
aliases: ["ENT-005", "Platform tuyển dụng"]
---

# ENT-005 — Platform tuyển dụng

> Trang dùng lại được xuyên function. Tên entity là tên nghiệp vụ, không phải tên bảng — tên bảng thật nằm ở cột Model Prisma.

## 1. Định Nghĩa Entity

Danh sách các kênh/nền tảng tuyển dụng (vd ITViec, LinkedIn, VietNamWork) mà Dylan tự quản lý được — có thể thêm mới hoặc xóa option linh động. Khác với combobox "Loại" của `US-016` ([`BR-019`](../../knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md)) — đó là danh sách cố định 3 giá trị, không cho sửa. Mỗi [`Job ứng tuyển`](ENT-004-job-ung-tuyen.md) chọn đúng một Platform từ danh sách này.

## 2. Model Prisma

| Model Prisma | Ghi chú |
| --- | --- |
| Chưa có model — entity mới | Cần `ssr-data` thiết kế schema khi `ssr-plan` của `US-018` tới lượt (`DEC-080`) |

## 3. Function Sử Dụng

| Function | Cách dùng |
| --- | --- |
| [`US-018`](../../knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md) | Tạo, Sửa, Xóa option; [`ENT-004`](ENT-004-job-ung-tuyen.md) tham chiếu để chọn giá trị |

## 4. Ràng Buộc

| Ràng buộc | Nguồn |
| --- | --- |
| 3 option mặc định khởi tạo sẵn: "ITViec", "LinkedIn", "VietNamWork" | `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 2 |
| Không cho xóa option đang được ít nhất một Job ứng tuyển sử dụng — xem [`BR-021`](../../knowledge/business-rule/BR-021-chan-xoa-platform-dang-dung.md) | `docs/memory/decisions.md#dec-082` |
