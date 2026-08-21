---
status: Active
feature: US-006
updated: 2026-08-10
spec: docs/features/US-006-canh-bao-trung-thang/spec.md
raw: docs/kb/ba/raw/US-006-canh-bao-trung-thang.md; docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md (gộp)
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-006", "Cảnh báo trùng tháng khi tạo tháng mới", "US-013"]
---

# US-006 — Cảnh báo trùng tháng khi tạo tháng mới

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này. Trang này cũng là nguồn tri thức cho raw `US-013` — nội dung của `US-013` đã gộp thẳng vào spec `US-006` (`docs/memory/decisions.md#dec-065`), không có trang feature riêng.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, khi Dylan chọn một kỳ tháng để tạo tháng mới nhưng kỳ tháng đó đã có sẵn trong dữ liệu, bấm "Tạo tháng" hoặc "Clone tháng hiện tại" không có chuyện gì xảy ra cả — không tạo, không báo. Thêm vào đó, khu vực xem tháng và khu vực tạo tháng mới hiện nằm chung một chỗ, không phân biệt rõ; tên nút "Clone tháng hiện tại" không nói rõ sao chép dữ liệu của tháng nào.

Sau thay đổi này: (1) Dylan không còn cách nào chọn được một kỳ tháng đã tồn tại để tạo mới — ô "Tạo tháng mới" đổi thành danh sách liệt kê từng kỳ tháng, kỳ đã có dữ liệu hiển thị mờ và không chọn được, trùng tháng trở thành điều không thể xảy ra qua thao tác bình thường; (2) nhãn khu vực xem tháng đổi thành "Chọn tháng xem", tách thành khối riêng biệt khỏi khu vực tạo tháng mới; (3) nút "Clone tháng hiện tại" đổi tên thành "Clone tháng đang xem" và luôn sao chép đúng cấu trúc danh mục của tháng đang xem, trong khi "Tạo tháng" luôn dùng danh mục mặc định — hai nút cho hai kết quả khác nhau rõ ràng.

## 2. Phạm Vi

Trong phạm vi:

- Đổi ô "Tạo tháng mới" từ ô chọn ngày tháng tự do thành combobox liệt kê 13 kỳ tháng liên tục (6 tháng trước — tháng hiện tại — 6 tháng sau)
- Kỳ tháng đã có dữ liệu hiển thị mờ, không chọn được; kỳ tháng chưa có dữ liệu chọn được bình thường
- Lớp bảo vệ dự phòng: báo lỗi rõ ràng nếu kỳ tháng vừa chọn bị tạo bởi thao tác khác đúng lúc bấm nút
- Đổi nhãn khu vực xem tháng từ "Chọn tháng" thành "Chọn tháng xem"; tách khu vực tạo tháng mới (ô "Tạo tháng mới", nút "Tạo tháng", nút "Clone tháng đang xem") thành khối riêng biệt
- Đổi tên nút "Clone tháng hiện tại" thành "Clone tháng đang xem"; chốt rõ nghiệp vụ khác nhau giữa hai nút (xem `BR-015`)

Ngoài phạm vi:

- Sao chép thu nhập hoặc giao dịch khi bấm "Clone tháng đang xem" — chỉ cấu trúc danh mục được sao chép
- Mở rộng khoảng 6 tháng trước/sau, hay cho sửa/gộp/xóa tháng đã tạo — không thuộc requirement này
- Đổi cách hoạt động của việc chọn một tháng đã có để xem — không đổi, chỉ đổi tên nhãn

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Chọn một kỳ tháng chưa có dữ liệu để tạo tháng mới | Single-user (`DEC-004`) — không áp dụng phân quyền |

## 4. Luồng Nghiệp Vụ

0. Trang Thu chi hiển thị hai khu vực tách biệt: "Chọn tháng xem" và khu vực tạo tháng mới.
1. Dylan mở ô "Tạo tháng mới" (danh sách xổ xuống) trong khu vực tạo tháng mới.
2. Hệ thống hiển thị 13 kỳ tháng (6 trước — tháng hiện tại — 6 sau); kỳ đã có dữ liệu hiển thị mờ, không chọn được.
3. Dylan chọn một kỳ tháng còn trống, bấm "Tạo tháng" hoặc "Clone tháng đang xem".
4. Tháng mới được tạo với danh mục tương ứng: "Tạo tháng" → danh mục mặc định; "Clone tháng đang xem" → sao chép cấu trúc danh mục từ tháng đang xem ở khu vực "Chọn tháng xem" (xem `BR-015`). Chi thực tế luôn = 0.

Ngoại lệ: Toàn bộ 13 kỳ tháng đều đã có dữ liệu → hai nút tạo tháng bị vô hiệu hóa. Kỳ tháng vừa chọn bị tạo bởi thao tác khác đúng lúc bấm nút (ví dụ hai cửa sổ trình duyệt) → [`BR-014`](../business-rule/BR-014-canh-bao-trung-thang.md), báo lỗi rõ ràng, không tạo trùng.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-014` | Ngăn trùng tháng bằng cách disable kỳ tháng đã có dữ liệu ngay trong combobox chọn kỳ tháng, kèm lớp bảo vệ dự phòng báo lỗi khi có tạo trùng đồng thời | [`../business-rule/BR-014-canh-bao-trung-thang.md`](../business-rule/BR-014-canh-bao-trung-thang.md) | `docs/memory/decisions.md#dec-061`, `docs/memory/decisions.md#dec-062` | Đã xác nhận từ knowledge |
| `BR-015` | "Tạo tháng" luôn dùng danh mục mặc định; "Clone tháng đang xem" luôn sao chép cấu trúc danh mục từ tháng đang xem — không sao chép thu nhập/giao dịch/"Chi tiêu khác" | [`../business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md`](../business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md) | `docs/memory/decisions.md#dec-063`, `docs/memory/decisions.md#dec-064` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Tháng ngân sách | [`../../data/entity/ENT-003-thang-ngan-sach.md`](../../data/entity/ENT-003-thang-ngan-sach.md) | `MonthBudget` | Không đổi cấu trúc — `id` (kỳ tháng) đã là khóa chính duy nhất; chỉ đổi cách giao diện ngăn Dylan chọn trùng |

Không có thuật ngữ nghiệp vụ mới phát sinh.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-001`](../../../../features/US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Related only | Đã có bảng tháng bền vững (`MonthBudget`) và logic tạo tháng — US-006 chỉ đổi cách chọn kỳ tháng, không viết lại logic tạo |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-006-canh-bao-trung-thang.md`, `docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md` (gộp) |
| Business Flow (F3, gap #6) | `docs/kb/ba/business-flow.md` |
| Quyết định hướng sửa (dialog `ssr-ba`) | `docs/memory/decisions.md#dec-061`, `docs/memory/decisions.md#dec-062` |
| Quyết định nghiệp vụ Tạo tháng/Clone tháng đang xem (dialog `ssr-raw` khi ghi US-013) | `docs/memory/decisions.md#dec-063`, `docs/memory/decisions.md#dec-064` |
| Quyết định gộp US-013 vào US-006 | `docs/memory/decisions.md#dec-065` |
| Source (hành vi hiện tại — âm thầm không làm gì khi trùng; "Tạo tháng"/"Clone tháng hiện tại" chạy chung một logic) | `components/BudgetApp.tsx:379-389` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-003-quan-ly-chu-ky-thang.md`](../epic/EPC-003-quan-ly-chu-ky-thang.md) | Epic | Thuộc luồng F3 (Quản lý theo chu kỳ tháng) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-006-canh-bao-trung-thang.md`](../../delivery/pbi/US-006-canh-bao-trung-thang.md) | Đã đồng bộ 2026-08-10 — đủ 7 AC (gồm AC-06, AC-07 gộp từ US-013) |
