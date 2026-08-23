---
status: Draft
feature: US-009
updated: 2026-08-22
spec: docs/features/US-009-cau-hinh-nguong-ngan-sach/spec.md
raw: docs/kb/ba/raw/US-009-cau-hinh-nguong-ngan-sach.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-009", "Cấu hình ngưỡng ngân sách"]
---

# US-009 — Cấu hình ngưỡng ngân sách

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Cho Dylan tự đổi ba ngưỡng ngân sách — ngưỡng cảnh báo vượt ngân sách (mặc định 90% thu nhập), mục tiêu tổng chi (mặc định ≤ 30 triệu đồng), quỹ linh hoạt (mặc định 7,5 triệu đồng) — cho từng tháng, thay vì cố định cứng trong code như hiện tại. Phục vụ mục tiêu `M1` của Business Flow (`DEC-006`).

## 2. Phạm Vi

Trong phạm vi:

- Cho Dylan xem và sửa ba ngưỡng của tháng đang xem: ngưỡng cảnh báo (%), mục tiêu tổng chi (số tiền), quỹ linh hoạt (số tiền)
- Ba ngưỡng lưu riêng cho từng tháng ngân sách
- Khi tạo tháng mới, ba ngưỡng kế thừa từ tháng gần nhất đã có, hoặc mặc định nếu chưa có tháng nào (`DEC-038`)
- Mọi nơi hiện đang dùng ba giá trị cố định (thanh cảnh báo vượt ngân sách, các dòng mô tả mục tiêu/quỹ linh hoạt) đổi sang đọc đúng giá trị đã cấu hình của tháng đang xem

Ngoài phạm vi:

- Đổi công thức tính "Chi thực tế", "Còn lại", hay bất kỳ chỉ số nào khác ngoài 3 ngưỡng này
- Áp dụng ngưỡng khác nhau cho từng danh mục — 3 ngưỡng này ở cấp độ toàn tháng

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, Sửa 3 ngưỡng của tháng đang xem | Single-user, không có phân quyền riêng (`DEC-004`) |

## 4. Luồng Nghiệp Vụ

1. Dylan mở trang Thu chi, xem 3 ngưỡng hiện tại của tháng đang xem.
2. Dylan sửa một hoặc nhiều ngưỡng, giá trị mới được lưu lại cho đúng tháng đó.
3. Thanh cảnh báo vượt ngân sách, và các dòng mô tả mục tiêu tổng chi/quỹ linh hoạt tự cập nhật theo giá trị mới.
4. Khi Dylan tạo tháng mới, 3 ngưỡng của tháng mới kế thừa từ tháng gần nhất đã có, hoặc mặc định nếu chưa có tháng nào.

Ngoại lệ: Chưa có tháng nào được tạo — chưa áp dụng, vì đây là tháng đầu tiên sẽ dùng giá trị mặc định.

Có một điểm chưa rõ cần xác nhận trước khi viết spec: khi Dylan bấm nút "Clone tháng đang xem" (sao chép danh mục từ một tháng nguồn cụ thể, có thể không phải tháng gần nhất), 3 ngưỡng của tháng mới có kế thừa đúng từ **tháng nguồn** đó, hay vẫn luôn lấy từ tháng gần nhất theo quy tắc chung (`DEC-038`) bất kể tháng nguồn là tháng nào — **Cần user xác nhận** (`docs/kb/ba/raw/US-009-cau-hinh-nguong-ngan-sach.md` mục 5).

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-030` | Ba ngưỡng ngân sách cấu hình được theo từng tháng, kế thừa tháng gần nhất khi tạo tháng mới | [`../business-rule/BR-030-nguong-ngan-sach-cau-hinh-theo-thang.md`](../business-rule/BR-030-nguong-ngan-sach-cau-hinh-theo-thang.md) | `docs/memory/decisions.md#dec-006`, `docs/memory/decisions.md#dec-038` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Tháng ngân sách | [`../../data/entity/ENT-003-thang-ngan-sach.md`](../../data/entity/ENT-003-thang-ngan-sach.md) | `MonthBudget` | Cần thêm 3 trường mới lưu ngưỡng — chờ `ssr-data` |

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| `US-001` | Depends on | Cần cấu trúc dữ liệu tháng ngân sách bền vững — đã `Delivered With Notes` |
| `US-006` | Depends on | Dùng chung luồng tạo tháng mới ("Tạo tháng"/"Clone tháng đang xem") để áp quy tắc kế thừa ngưỡng |
| `US-019` | Related only | Cùng dùng chung luồng tạo tháng mới, nhưng đổi đối tượng khác (item cần mua, không phải ngưỡng) |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | Chưa có — chờ `ssr-ba` |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-009-cau-hinh-nguong-ngan-sach.md` |
| Raw | `docs/kb/ba/raw/US-009-cau-hinh-nguong-ngan-sach.md` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Thuộc epic F2 (Lập và điều chỉnh ngân sách theo danh mục) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-009-cau-hinh-nguong-ngan-sach.md`](../../delivery/pbi/US-009-cau-hinh-nguong-ngan-sach.md) | Rỗng — chờ `ssr-ingest mode=sync` sau khi spec `Ready for DEV` |
