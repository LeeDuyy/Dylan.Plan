---
status: Active
updated: 2026-08-11
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-019"]
---

# BR-019 — "Loại" danh mục giới hạn đúng 3 giá trị cố định, chọn qua combobox

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Trường "Loại" của một danh mục chỉ nhận đúng 3 giá trị cố định: "Cố định", "Tích lũy", "Khác". Dylan chọn giá trị qua một danh sách chọn (combobox) — không được gõ ký tự tự do và không được để trống. "Khác" thay thế hoàn toàn khái niệm "Linh hoạt" trước đây: mọi nơi trước đây gán mặc định "Linh hoạt" khi tạo danh mục (seed 4 danh mục mặc định, nút "Thêm danh mục", danh mục "Chi tiêu khác" tự sinh) đổi sang gán mặc định "Khác". Dữ liệu "Loại" đã có từ trước được quy đổi một lần khi triển khai: "Cố định" và "Tích lũy" giữ nguyên; "Linh hoạt" và mọi giá trị không khớp đúng 3 lựa chọn hợp lệ (kể cả dữ liệu lỗi do gõ tự do trước đây, ví dụ "Linh s") chuyển thành "Khác".

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-016`](../feature/US-016-loai-chi-tieu-combobox.md) | Toàn bộ — cách nhập "Loại" trên bảng danh mục (F2), quy tắc migrate dữ liệu cũ, và giá trị mặc định khi tạo danh mục mới |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có ngoại lệ về phạm vi áp dụng | Rule áp dụng cho mọi danh mục, kể cả "Chi tiêu khác" — chỉ khác ở chỗ giá trị "Loại" của "Chi tiêu khác" luôn do hệ thống tự gán khi tự sinh (`BR-009`), Dylan không tự chọn tay cho danh mục này vì nó chỉ đọc (`BR-010`) | `US-005`, `US-016` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Quyết định 3 giá trị cố định, "Khác" thay thế "Linh hoạt" | `docs/memory/decisions.md#dec-073` | Đã xác nhận từ knowledge |
| Dữ liệu thật xác nhận rủi ro gõ tự do (giá trị lỗi "Linh s") | `docs/po/review-2026-08-11-loai-chi-tieu-combobox.md` mục 1, 2 | Đã xác nhận từ knowledge |
| Quy tắc migrate 4 giá trị cũ sang 3 giá trị mới | `docs/kb/ba/raw/US-016-loai-chi-tieu-combobox.md` mục 3 | Đã xác nhận từ knowledge |
| 3 nơi hard-code "Linh hoạt" cần đồng bộ giá trị mặc định mới | `lib/budget-defaults.ts:18-21`, `components/BudgetApp.tsx:416`, `server/budget/domain/services/fallback-category-service.ts:9` | Đã xác nhận |
