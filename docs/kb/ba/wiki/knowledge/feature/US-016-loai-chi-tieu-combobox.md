---
status: Active
feature: US-016
updated: 2026-08-11
spec: docs/features/US-016-loai-chi-tieu-combobox/spec.md
raw: docs/kb/ba/raw/US-016-loai-chi-tieu-combobox.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-016", "Loại chi tiêu combobox"]
---

# US-016 — Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, cột "Loại" trong bảng danh mục là một ô nhập chữ tự do — Dylan gõ tay, không có ràng buộc giá trị nào. Dữ liệu thật xác nhận rủi ro này đã xảy ra: một danh mục có Loại là "Linh s", rõ ràng là kết quả gõ dở dang, không khớp bất kỳ nhãn nghiệp vụ nào đang dùng. Sau thay đổi này, "Loại" chỉ còn nhận đúng 3 giá trị cố định — "Cố định", "Tích lũy", "Khác" — chọn qua một danh sách chọn (combobox), Dylan không còn gõ được ký tự tự do. "Khác" thay thế hoàn toàn khái niệm "Linh hoạt" trước đây. Việc này chặn từ gốc khả năng phát sinh giá trị Loại rác, giữ bảng danh mục nhất quán, phục vụ mục tiêu M1 (dữ liệu chi tiêu chính xác, nhất quán) của Business Flow.

## 2. Phạm Vi

Trong phạm vi:

- Đổi cách nhập "Loại" từ ô nhập chữ tự do sang danh sách chọn (combobox), đúng 3 lựa chọn: "Cố định", "Tích lũy", "Khác"
- Quy đổi một lần dữ liệu "Loại" đã có: "Cố định" và "Tích lũy" giữ nguyên; "Linh hoạt" và mọi giá trị không khớp 3 lựa chọn hợp lệ (kể cả dữ liệu lỗi như "Linh s") chuyển thành "Khác"
- Đồng bộ giá trị "Loại" mặc định ở 3 nơi hệ thống tự gán khi tạo danh mục: seed danh mục mặc định lúc khởi tạo tháng, nút "Thêm danh mục", và danh mục "Chi tiêu khác" tự sinh — cả 3 nơi đổi từ mặc định "Linh hoạt" sang "Khác"
- Đổi cách tính và đổi tên thẻ insight ở khu vực Phân tích: tên cũ "Chi linh hoạt" đổi thành "Chi khác", tính bằng tổng chi thực tế của các danh mục có Loại "Khác"

Ngoài phạm vi:

- Ràng buộc ở tầng cấu trúc dữ liệu (kiểu liệt kê cố định hay kiểm tra ràng buộc khi lưu) — đây là quyết định kỹ thuật, để bước lập kế hoạch kỹ thuật đề xuất cụ thể, không phải nội dung nghiệp vụ của spec này
- Thay đổi khác của danh mục "Chi tiêu khác" ngoài giá trị "Loại" mặc định (vẫn khóa vĩnh viễn, vẫn tự sinh khi cần, vẫn ẩn khi hết giao dịch — giữ nguyên như đã chốt trước đây)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Chọn "Loại" cho danh mục thường qua combobox | Single-user, không đăng nhập/phân quyền (`DEC-004`) |

## 4. Luồng Nghiệp Vụ

1. Dylan mở bảng danh mục tại trang Quản lý chi tiêu.
2. Ở cột "Loại" của một danh mục thường (không phải "Chi tiêu khác"), Dylan bấm vào ô — một danh sách chọn hiện ra đúng 3 lựa chọn: "Cố định", "Tích lũy", "Khác".
3. Dylan chọn một trong 3 giá trị — không gõ được ký tự nào, không để trống được.
4. Giá trị vừa chọn được lưu lại ngay cho danh mục đó.
5. Khi Dylan bấm nút "Thêm danh mục", danh mục mới được tạo với "Loại" mặc định là "Khác".
6. Khi hệ thống tự sinh danh mục "Chi tiêu khác" (theo quy tắc tự sinh đã có), "Loại" của nó là "Khác".
7. Tại khu vực Phân tích, thẻ insight trước đây tên "Chi linh hoạt" đổi tên thành "Chi khác", hiển thị tổng chi thực tế của các danh mục đang có "Loại" là "Khác".

Áp dụng một lần khi triển khai (không phải hành động Dylan thao tác): toàn bộ danh mục đang có "Loại" là "Cố định" hoặc "Tích lũy" giữ nguyên; danh mục đang có "Loại" là "Linh hoạt" hoặc bất kỳ giá trị nào khác không khớp "Cố định"/"Tích lũy" (kể cả giá trị lỗi như "Linh s") được chuyển thành "Khác".

Ngoại lệ: nếu Dylan chọn một giá trị Loại mới nhưng việc lưu bị lỗi (mất kết nối, lỗi máy chủ), ô Loại giữ nguyên giá trị trước đó cho tới khi Dylan thử lại thành công — không có danh mục nào bị mất giá trị Loại vì lỗi lưu.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-019` | "Loại" danh mục giới hạn đúng 3 giá trị cố định (Cố định/Tích lũy/Khác), chọn qua combobox, không nhập tự do; "Khác" thay thế "Linh hoạt" | [`../business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md`](../business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md) | `docs/memory/decisions.md#dec-073` | Đã xác nhận từ knowledge |
| `BR-009` | "Chi tiêu khác" chỉ tự sinh khi cần — US-016 đổi giá trị "Loại" mặc định mà rule này gán lúc tự sinh, từ "Linh hoạt" sang "Khác" | [`../business-rule/BR-009-chi-tieu-khac-tu-sinh.md`](../business-rule/BR-009-chi-tieu-khac-tu-sinh.md) | `docs/memory/decisions.md#dec-026`, `docs/memory/decisions.md#dec-073` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Danh mục | [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | `Category` | Trường "Loại" (`Category.type`) giới hạn đúng 3 giá trị hợp lệ; có cần đổi kiểu cột hay chỉ ràng buộc ở tầng ứng dụng là quyết định của bước lập kế hoạch kỹ thuật (spec mục 13) |

Thuật ngữ "Loại danh mục" đã có sẵn trong `docs/memory/glossary.md`, vừa được cập nhật lại định nghĩa theo `DEC-073` (3 giá trị: Cố định, Tích lũy, Khác) — không phát sinh thuật ngữ mới.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-001`](../../../../features/US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Depends on | Cần data model `Category` bền vững trong database thật để chạy migrate dữ liệu "Loại" |
| [`US-005`](../../../../features/US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Impacts | Đổi giá trị "Loại" mặc định của "Chi tiêu khác" khi tự sinh — từ "Linh hoạt" (đã chốt ở `US-005`, `DEC-056`) sang "Khác" |
| [`US-014`](../../../../features/US-014-chi-tieu-khac-cuoi-bang/spec.md) | Related only | Cùng thao tác trên bảng danh mục nhưng khác trường (thứ tự hiển thị vs "Loại") — không phụ thuộc nhau |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-016-loai-chi-tieu-combobox.md` |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-016-loai-chi-tieu-combobox.md` |
| PO review (PO-03) | `docs/po/review-2026-08-11-loai-chi-tieu-combobox.md` |
| Quyết định | `docs/memory/decisions.md#dec-073` |
| Business Flow (M1, F2, gap #14) | `docs/kb/ba/business-flow.md` |
| Dữ liệu thật (Category.type) | `prisma/dev.db`, bảng `Category`, `GROUP BY type` (2026-08-11) |
| Ô nhập "Loại" hiện tại | `components/BudgetApp.tsx:984-990` |
| 3 nơi hard-code "Linh hoạt" | `lib/budget-defaults.ts:18-21`, `components/BudgetApp.tsx:416`, `server/budget/domain/services/fallback-category-service.ts:9` |
| Thẻ insight bị ảnh hưởng | `components/BudgetApp.tsx:330-335,1061-1062` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Thuộc luồng F2 (Lập và điều chỉnh ngân sách theo danh mục) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-016-loai-chi-tieu-combobox.md`](../../delivery/pbi/US-016-loai-chi-tieu-combobox.md) | Đã đồng bộ 2026-08-11 — đủ 8 AC |
