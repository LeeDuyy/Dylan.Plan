---
status: Draft
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/data/entity]
aliases: ["ENT-004", "Job ứng tuyển"]
---

# ENT-004 — Job ứng tuyển

> Trang dùng lại được xuyên function. Tên entity là tên nghiệp vụ, không phải tên bảng — tên bảng thật nằm ở cột Model Prisma.

## 1. Định Nghĩa Entity

Một job/vị trí tuyển dụng mà Dylan đang quan tâm và theo dõi trạng thái nộp CV — gồm Công ty, Ngày hết hạn, Platform đăng tin, Link tin tuyển dụng, Trạng thái ứng tuyển, Ghi chú, và (từ `US-020`) mốc "Ngày nộp hồ sơ". Thuộc trang Roadmap (`components/DylanPlanApp.tsx`, tab `"roadmap"`) — nằm ngoài phạm vi Business Flow "Hệ Thống Quản Lý Chi Tiêu" hiện có (`docs/kb/ba/business-flow.md`), vốn chỉ mô tả F1-F4 của tính năng chi tiêu.

## 2. Model Prisma

| Model Prisma | Ghi chú |
| --- | --- |
| Chưa có model — entity mới | Cần `ssr-data` thiết kế schema khi `ssr-plan` của `US-018` tới lượt (`DEC-080`); `US-020` mở rộng thêm mốc "Ngày nộp hồ sơ" khi tới lượt `ssr-plan`/`ssr-data` của chính nó |

## 3. Function Sử Dụng

| Function | Cách dùng |
| --- | --- |
| [`US-018`](../../knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md) | Tạo, Sửa, Xóa, Đọc |
| [`US-020`](../../knowledge/feature/US-020-lich-su-trang-thai-job.md) | Mở rộng: thêm mốc "Ngày nộp hồ sơ", thêm trạng thái "Expired", tự động cập nhật Trạng thái theo `BR-025`/`BR-026` |

## 4. Ràng Buộc

| Ràng buộc | Nguồn |
| --- | --- |
| Trạng thái nhận đúng 1 trong 8 giá trị cố định: Interested/Waiting/No Response/Response/Appointment/Cancel/Fail/Expired (Expired thêm từ `US-020`, vẫn chọn tay được như 7 giá trị còn lại) | `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 2; `docs/memory/decisions.md#dec-101`, `#dec-102` |
| Ngày hết hạn hiển thị theo định dạng `DD/MM/YYYY` | `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 2 |
| Platform tham chiếu tới danh sách option động — xem [`ENT-005`](ENT-005-platform-tuyen-dung.md) | `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 2, `docs/memory/decisions.md#dec-082` |
| "Ngày nộp hồ sơ" chỉ có giá trị khi job đã từng chuyển Interested → Waiting; bị xoá khi chuyển ngược Waiting → Interested; là mốc để tính luật "quá 7 ngày → No Response" (`BR-026`, `BR-027`) | `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 2; `docs/memory/decisions.md#dec-099` |
| Trạng thái "Expired" chỉ tự động gán khi job đang "Interested" và Ngày hết hạn đã qua; kiểm tra lại mỗi khi dữ liệu bảng được tải/làm mới (`BR-025`) | `docs/memory/decisions.md#dec-100`, `#dec-101` |
