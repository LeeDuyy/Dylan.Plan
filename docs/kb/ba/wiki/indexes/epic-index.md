---
status: Draft
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/indexes]
---

# Wiki Epic Index

> Epic ánh xạ 1:1 với một "luồng" (F#) trong `docs/kb/ba/business-flow.md`. `ssr-ingest` chỉ đọc Business Flow để tạo/liên kết epic — không tự đặt định hướng.

## 1. Danh Sách Epic

| Mã | Tên epic | Luồng Business Flow | Trang | Số feature |
| --- | --- | --- | --- | --- |
| `EPC-001` | Ghi nhận chi tiêu | `F1` | [`../knowledge/epic/EPC-001-ghi-nhan-chi-tieu.md`](../knowledge/epic/EPC-001-ghi-nhan-chi-tieu.md) | 4 (US-001 legacy, US-003 `Ready for DEV`, US-004, US-012 `Ready for DEV`) |
| `EPC-002` | Lập và điều chỉnh ngân sách theo danh mục | `F2` | [`../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | 5 (US-005 `Ready for DEV`, US-010 `Ready for DEV`, US-014 `Ready for DEV`, US-016 `Ready for DEV`, US-017 `Ready for DEV`) |
| `EPC-003` | Quản lý theo chu kỳ tháng | `F3` | [`../knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md`](../knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md) | 3 (US-006 `Ready for DEV`, US-015 `Ready for DEV`, US-019 `Ready for DEV`) |

## 1b. Function Không Thuộc Epic Nào (Cross-cutting)

| Mã | Tên function | Lý do không gắn epic |
| --- | --- | --- |
| `US-002` | Route/module riêng cho Quản lý chi tiêu (spec `Ready for DEV`) | Hạ tầng route/điều hướng dùng chung cho cả 4 luồng (F1, F2, F3, F4) — không thuộc riêng một luồng nào theo mô hình ánh xạ 1:1 epic↔luồng hiện tại |

## 2. Epic Chưa Có Function

| Mã | Tên epic | Lý do chưa có function |
| --- | --- | --- |
| `EPC-004` (chưa tạo) | Phân tích và báo cáo chi tiêu (F4) | Chưa có US nào ingest vào cấu trúc nested cho luồng F4 — US-007/US-008/US-011 vẫn ở dạng phẳng |
