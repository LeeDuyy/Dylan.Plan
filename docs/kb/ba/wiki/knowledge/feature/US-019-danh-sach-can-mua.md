---
status: Active
feature: US-019
updated: 2026-08-14
spec: docs/features/US-019-danh-sach-can-mua/spec.md
raw: docs/kb/ba/raw/US-019-danh-sach-can-mua.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-019", "Danh sách items cần mua"]
---

# US-019 — Danh sách items cần mua theo tháng tại bảng thu chi

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Cho Dylan ghi chú nhanh những sản phẩm cần mua ngay trong bảng thu chi, theo dõi rõ sản phẩm nào đã mua/chưa mua bằng màu sắc, mà không phải nhớ trong đầu hay ghi ở nơi khác ngoài ứng dụng. Phục vụ mục tiêu `M3` của Business Flow: "Hỗ trợ Dylan lên kế hoạch mua sắm theo tháng ngay trong bảng thu chi, giảm nguy cơ quên hoặc mua trùng đồ cần mua" (`docs/kb/ba/business-flow.md` mục 1, `DEC-105`).

## 2. Phạm Vi

Trong phạm vi:

- Thêm item mới (tên sản phẩm bắt buộc, giá tùy chọn) khi tháng đang xem là tháng hiện tại
- Sửa tên sản phẩm và/hoặc giá của một item đã có, ngay tại dòng đó (inline) — chỉ khi tháng đang xem là tháng hiện tại (`DEC-106`)
- Xóa một item — chỉ khi tháng đang xem là tháng hiện tại
- Đổi trạng thái một item giữa Pending (chưa mua, màu cam/vàng) và Purchased (đã mua, màu xanh lá)
- Xem danh sách item (cả Pending lẫn Purchased) của tháng đang xem, bất kể tháng nào
- Tự động chuyển các item còn Pending của tháng hiện tại sang tháng mới khi Dylan bấm "Tạo tháng" hoặc "Clone tháng đang xem", ẩn khỏi tháng gốc
- Chỉ xem (không thao tác) danh sách item của các tháng khác tháng hiện tại — kể cả khi tháng đó đang được chọn xem qua dropdown "Chọn tháng xem"

"Tháng hiện tại" là tháng thực tế theo đồng hồ hệ thống (`DEC-107`) — khái niệm tách biệt hoàn toàn khỏi "tháng đang được chọn xem" (giá trị dropdown dùng cho toàn bộ phần xem ngân sách/giao dịch còn lại của trang Thu chi).

Ngoài phạm vi:

- Giá của item không cộng vào Ngân sách/Chi thực tế/Số dư còn lại của tháng
- Tự động tạo tháng mới hoặc chuyển item theo ngày hệ thống thực tế (không có tiến trình chạy nền)
- Liên kết item cần mua với Danh mục hoặc Giao dịch
- Ghi lại mốc thời gian đánh dấu đã mua; giới hạn số lượng item tối đa mỗi tháng

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, Tạo, Sửa (inline), Xóa, Đổi trạng thái | Chỉ áp dụng Tạo/Sửa/Xóa/Đổi trạng thái khi tháng đang xem là tháng hiện tại (theo đồng hồ hệ thống — `DEC-107`); các tháng khác chỉ Xem ([`BR-024`](../business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md)) |

## 4. Luồng Nghiệp Vụ

1. Dylan mở bảng thu chi, xem khu vực "Items cần mua" của tháng đang xem — danh sách hiển thị cả item Pending và Purchased.
2. Nếu tháng đang xem là tháng hiện tại, Dylan thêm một item mới: nhập tên sản phẩm (bắt buộc), giá (tùy chọn).
3. Item mới mặc định ở trạng thái Pending, hiển thị màu cam/vàng.
4. Dylan bấm vào ô Tên sản phẩm hoặc Giá của một item đã có để sửa trực tiếp tại chỗ (inline) — chỉ khi tháng đang xem là tháng hiện tại.
5. Dylan đánh dấu một item Pending đã mua xong — item chuyển sang trạng thái Purchased, hiển thị màu xanh lá.
6. Dylan xóa một item không còn cần mua nữa.
7. Khi Dylan bấm "Tạo tháng" hoặc "Clone tháng đang xem" để tạo một tháng ngân sách mới, mọi item còn Pending của tháng hiện tại (tại thời điểm bấm nút) được chuyển hẳn sang tháng mới; các item đó không còn hiển thị ở tháng gốc. Item Purchased không bị chuyển.
8. Khi Dylan xem một tháng khác tháng hiện tại, danh sách item hiển thị dạng chỉ xem — không có nút thêm, ô Tên sản phẩm/Giá không sửa được, không có nút xóa/đổi trạng thái cho bất kỳ item nào.

Ngoại lệ: tháng chưa có item nào — danh sách hiển thị rỗng; nếu đây là tháng hiện tại, nút thêm item vẫn hiển thị bình thường. Sửa tên sản phẩm thành chuỗi rỗng — không lưu, tự khôi phục tên cũ. Tháng hiện tại chưa từng được tạo — chưa có nơi để thêm item cho tới khi Dylan tạo tháng đó.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-022` | Giá của item cần mua chỉ là ghi chú tham khảo, không cộng vào Ngân sách/Chi thực tế | [`../business-rule/BR-022-gia-item-khong-cong-ngan-sach.md`](../business-rule/BR-022-gia-item-khong-cong-ngan-sach.md) | `docs/memory/decisions.md#dec-092` | Đã xác nhận từ knowledge |
| `BR-023` | Item "chưa mua" của tháng hiện tại được chuyển hẳn sang tháng mới khi Dylan bấm "Tạo tháng" hoặc "Clone tháng đang xem", ẩn khỏi tháng gốc | [`../business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md`](../business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md) | `docs/memory/decisions.md#dec-095`, `docs/memory/decisions.md#dec-097`, `docs/memory/decisions.md#dec-098`, `docs/memory/decisions.md#dec-107` | Đã xác nhận từ knowledge |
| `BR-024` | Chỉ thêm/sửa (inline)/xóa/đổi trạng thái item khi tháng đang xem là tháng hiện tại; tháng khác chỉ xem | [`../business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md`](../business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md) | `docs/memory/decisions.md#dec-096`, `docs/memory/decisions.md#dec-106`, `docs/memory/decisions.md#dec-107` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Item cần mua | [`../../data/entity/ENT-006-item-can-mua.md`](../../data/entity/ENT-006-item-can-mua.md) | Chưa có model — entity mới, chờ `ssr-data` | Gắn theo tháng ngân sách, không liên kết Danh mục/Giao dịch |
| Tháng ngân sách | [`../../data/entity/ENT-003-thang-ngan-sach.md`](../../data/entity/ENT-003-thang-ngan-sach.md) | `MonthBudget` | Item cần mua thuộc về đúng một tháng ngân sách tại một thời điểm |

Thuật ngữ mới phát sinh phải thêm vào `glossary.md` — đã thêm "Item cần mua" tại `docs/memory/glossary.md` mục 1.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| `US-006` | Depends on | Dùng chung nút "Tạo tháng"/"Clone tháng đang xem" (`BR-015`) để kích hoạt việc chuyển item Pending sang tháng mới; US-006 đã `Implemented` nên không chặn triển khai US-019, nhưng bước chuyển item cần mua phải nối vào đúng luồng bấm nút đó |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-019-danh-sach-can-mua/spec.md` (`Ready for DEV`, 10 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-019-danh-sach-can-mua.md` |
| Raw | `docs/kb/ba/raw/US-019-danh-sach-can-mua.md` |
| Business Flow | `docs/kb/ba/business-flow.md` mục 1 (`M3`), mục 4 (F3, bước 3-4), mục 6, mục 7 (#15), mục 8 (`DEC-105`) |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-003-quan-ly-chu-ky-thang.md`](../epic/EPC-003-quan-ly-chu-ky-thang.md) | Epic | Chính thức thuộc epic F3 (Quản lý theo chu kỳ tháng) — xác nhận qua `DEC-105`, `po-expert` `Aligned` |
| [`../business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md`](../business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md) | Business rule | Luồng tạo tháng mới mà `BR-023` dùng chung |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-019-danh-sach-can-mua.md`](../../delivery/pbi/US-019-danh-sach-can-mua.md) | Đã đồng bộ 2026-08-14 — 10 AC |
