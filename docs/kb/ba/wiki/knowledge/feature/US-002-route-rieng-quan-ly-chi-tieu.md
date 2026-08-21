---
status: Active
feature: US-002
updated: 2026-08-05
spec: docs/features/US-002-route-rieng-quan-ly-chi-tieu/spec.md
raw: docs/kb/ba/raw/US-002-route-rieng-quan-ly-chi-tieu.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-002", "Route/module riêng cho Quản lý chi tiêu"]
---

# US-002 — Route/module riêng cho Quản lý chi tiêu

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Khu vực Thu chi (quản lý ngân sách, danh mục, giao dịch) hiện chỉ là một trong năm mục hiển thị trộn lẫn ngay trên trang chủ Dylan Plan Dashboard, cùng chỗ với Roadmap sự nghiệp, Freelance và Sản phẩm — chuyển tab chỉ đổi nội dung tại chỗ, không đổi địa chỉ trang. Sau thay đổi này, Thu chi có địa chỉ trang riêng (`/budget`), tách hẳn khỏi các mục khác, vào được trực tiếp (gõ địa chỉ, bookmark) mà không bắt buộc qua trang chủ. Phục vụ mục tiêu M2 của Business Flow.

## 2. Phạm Vi

Trong phạm vi:

- Địa chỉ trang riêng `/budget` hiển thị đầy đủ nội dung quản lý Thu chi hiện có (chọn/tạo tháng, nhập nhanh, bảng danh mục và ngân sách, bảng chi tiết chi tiêu, phân tích, quy tắc kiểm soát ngân sách, xuất dữ liệu, thông báo di trú dữ liệu cũ) — nội dung bên trong giữ nguyên, chỉ đổi vị trí hiển thị
- Trên trang chủ, mục "Thu chi" trên thanh điều hướng và nút "Nhập thu chi" đổi thành liên kết sang `/budget` (`DEC-049`)
- Trên trang chủ, tab "Tổng quan" không còn hiển thị nội dung Thu chi, kể cả thẻ "Còn lại tháng này" trong khối 4 thẻ tổng quan (`DEC-050`, `DEC-052`)
- Trang `/budget` có liên kết quay lại trang chủ ở đầu trang (`DEC-051`)

Ngoài phạm vi:

- Tách thành dự án/ứng dụng độc lập khỏi `Dylan.Plan` (`DEC-002`)
- Đăng nhập, phân quyền (`DEC-004`)
- Thay đổi nội dung/hành vi nghiệp vụ bên trong khu vực Thu chi — thuộc các function riêng khác (`US-001`, `US-004`...)
- Bản tóm tắt rút gọn của Thu chi trong "Tổng quan" — không làm (`DEC-050`)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, điều hướng qua lại giữa trang chủ và `/budget` | Single-user, không đăng nhập/phân quyền (`DEC-004`) |

## 4. Luồng Nghiệp Vụ

1. Dylan mở trang chủ, thấy thanh điều hướng có 5 mục: Tổng quan, Roadmap, Freelance, Sản phẩm, Thu chi.
2. Dylan bấm mục "Thu chi" hoặc nút "Nhập thu chi" — trình duyệt chuyển hẳn sang địa chỉ `/budget`.
3. Trang `/budget` tải xong, hiển thị đầy đủ nội dung Thu chi và một liên kết quay lại đầu trang.
4. Dylan bấm liên kết quay lại — trình duyệt chuyển về trang chủ.
5. (Cách vào khác) Dylan gõ trực tiếp `/budget` hoặc mở từ bookmark — trang Thu chi hiển thị ngay, không cần qua trang chủ trước.
6. Khi Dylan chọn "Tổng quan" trên trang chủ, chỉ còn thấy Roadmap, Freelance, Sản phẩm và 3 thẻ tổng quan tĩnh (không còn thẻ "Còn lại tháng này").

Ngoại lệ: Không có — thay đổi cấu trúc điều hướng thuần túy.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-006` | Module Quản lý chi tiêu có route riêng `/budget`, tách khỏi shell chung, dùng chung codebase | [`../business-rule/BR-006-route-budget.md`](../business-rule/BR-006-route-budget.md) | `docs/memory/decisions.md#dec-002`, `docs/memory/decisions.md#dec-005` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

Không thay đổi data model — US-002 là thay đổi cấu trúc route/điều hướng, không phải khái niệm nghiệp vụ mới. Nội dung hiển thị bên trong `/budget` (tháng, danh mục, giao dịch) phụ thuộc data model đã có từ `US-001`.

Không có thuật ngữ nghiệp vụ mới phát sinh ngoài những gì đã có trong `docs/memory/glossary.md`.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-001`](../../../../features/US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Related only | Nội dung hiển thị bên trong `/budget` phụ thuộc dữ liệu bền vững của US-001 để hoàn chỉnh, nhưng route tự nó không đòi hỏi thay đổi dữ liệu — không chặn triển khai (US-001 đã Delivered) |
| [`US-004`](../../../../features/US-004-sua-xoa-tung-giao-dich/spec.md) | Related only | Mô tả vị trí màn hình trong spec US-004 (mục 8.1: "Tab Thu chi trong Dylan Plan Dashboard") cần cập nhật thành "Trang riêng `/budget`" ở một lượt `ssr-ba` sau, theo spec US-002 mục 11 |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-002-route-rieng-quan-ly-chi-tieu/spec.md` (`Status: Ready for DEV`, 5 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-002-route-rieng-quan-ly-chi-tieu.md` |
| Raw | `docs/kb/ba/raw/US-002-route-rieng-quan-ly-chi-tieu.md` |
| Business Flow (M2, F1-F4) | `docs/kb/ba/business-flow.md` |
| Trang wiki phẳng trước đây (legacy, trước khi migrate sang cấu trúc nested) | `docs/kb/ba/wiki/US-002-route-rieng-quan-ly-chi-tieu.md` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| Không có | — | US-002 là hạ tầng route/điều hướng dùng chung cho cả 4 luồng nghiệp vụ (F1, F2, F3, F4 — xem `docs/kb/ba/business-flow.md` mục 6), không thuộc riêng một luồng nào theo mô hình ánh xạ 1:1 epic↔luồng hiện tại (`EPC-001` chỉ đại diện F1). Không tự tạo epic mới cho trường hợp cross-cutting này. |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-002-route-rieng-quan-ly-chi-tieu.md`](../../delivery/pbi/US-002-route-rieng-quan-ly-chi-tieu.md) | Đã đồng bộ 2026-08-05 — đủ 5 AC |
