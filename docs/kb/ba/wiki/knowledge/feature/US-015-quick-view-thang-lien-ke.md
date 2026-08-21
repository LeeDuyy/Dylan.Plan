---
status: Active
feature: US-015
updated: 2026-08-11
spec: docs/features/US-015-quick-view-thang-lien-ke/spec.md
raw: docs/kb/ba/raw/US-015-quick-view-thang-lien-ke.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-015", "Quick view thẻ tháng liền kề"]
---

# US-015 — Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, khu vực "Lịch sử thu chi" tại trang Thu chi hiển thị **toàn bộ** tháng ngân sách đã tạo dưới dạng thẻ, không giới hạn số lượng — khi Dylan đã tạo nhiều tháng, khu vực này kéo dài thành một danh sách dài, không còn đúng vai trò "xem nhanh" (quick view) các tháng liền kề tháng đang xem.

Sau thay đổi này: khu vực "Lịch sử thu chi" chỉ còn hiển thị tối đa 3 thẻ tháng — tháng trước, tháng đang xem, tháng sau, tính theo vị trí trong danh sách các tháng **đã tạo** — để Dylan nắm nhanh tình hình 3 tháng gần tháng đang xem mà không phải cuộn qua danh sách dài. Muốn xem một tháng khác, Dylan dùng "Chọn tháng xem" đã có sẵn phía trên.

## 2. Phạm Vi

Trong phạm vi:

- Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị tối đa 3 thẻ tháng: tháng trước, tháng đang xem, tháng sau
- "Tháng trước"/"tháng sau" tính theo vị trí trong danh sách các tháng **đã tạo**, bỏ qua tháng chưa tạo (`BR-018`, `DEC-071`)
- Ẩn thẻ tháng trước hoặc sau khi không có tháng tương ứng trong danh sách đã tạo (`BR-018`, `DEC-072`)
- Giữ nguyên hành vi bấm vào thẻ để chuyển tháng đang xem (như hiện tại)

Ngoài phạm vi:

- Đổi cách hoạt động của "Chọn tháng xem" (dropdown) — không đổi, vẫn liệt kê toàn bộ tháng đã tạo
- Thêm tùy chọn cho Dylan tự chỉnh số lượng thẻ hiển thị (luôn cố định tối đa 3, theo raw)
- Đổi cách tạo tháng mới hay logic tính "Chi thực tế" của từng tháng — không thay đổi

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem tối đa 3 thẻ tháng liền kề tháng đang xem trong khu vực "Lịch sử thu chi"; bấm vào thẻ trước/sau để đổi tháng đang xem | Single-user (`DEC-004`) — không áp dụng phân quyền |

## 4. Luồng Nghiệp Vụ

1. Dylan mở trang Thu chi; hệ thống xác định tháng đang xem hiện tại (mặc định hoặc do Dylan chọn trước đó).
2. Khu vực "Lịch sử thu chi" xác định vị trí của tháng đang xem trong danh sách các tháng đã tạo (sắp theo thứ tự kỳ tháng).
3. Hệ thống hiển thị thẻ của tháng liền trước (nếu có), thẻ của tháng đang xem, thẻ của tháng liền sau (nếu có) — tối đa 3 thẻ.
4. Dylan bấm vào thẻ tháng trước hoặc thẻ tháng sau → tháng đang xem đổi sang tháng đó; khu vực "Lịch sử thu chi" tự cập nhật lại, hiển thị 3 thẻ mới quanh tháng vừa chọn.
5. Dylan muốn xem một tháng không nằm trong 3 thẻ đang hiển thị → dùng ô "Chọn tháng xem" phía trên để chọn trực tiếp tháng đó.

Ngoại lệ: [`BR-018`](../business-rule/BR-018-quick-view-3-the-thang.md) — tháng đang xem không có tháng trước hoặc tháng sau trong danh sách đã tạo (là tháng đầu tiên/cuối cùng, hoặc là tháng duy nhất đã tạo) → ẩn thẻ tương ứng, lưới còn 1-2 thẻ.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-018` | Khu vực "Lịch sử thu chi" chỉ hiển thị tối đa 3 thẻ tháng (trước/đang xem/sau) theo danh sách tháng đã tạo, ẩn ô thiếu | [`../business-rule/BR-018-quick-view-3-the-thang.md`](../business-rule/BR-018-quick-view-3-the-thang.md) | `docs/memory/decisions.md#dec-071`, `docs/memory/decisions.md#dec-072` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Tháng ngân sách | [`../../data/entity/ENT-003-thang-ngan-sach.md`](../../data/entity/ENT-003-thang-ngan-sach.md) | `MonthBudget` | Không đổi cấu trúc — chỉ đổi cách lọc danh sách tháng hiển thị ở một khu vực UI |

Không có thuật ngữ nghiệp vụ mới phát sinh.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-006`](../../../../features/US-006-canh-bao-trung-thang/spec.md) | Related only | Cùng luồng F3, cùng khu vực trang Thu chi (khu vực "Chọn tháng xem"/tạo tháng mới), nhưng US-015 chỉ đổi khu vực "Lịch sử thu chi" — không đổi logic tạo/chọn tháng của US-006 |
| [`US-001`](../../../../features/US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Depends on | Cần danh sách tháng ngân sách đã lưu bền vững (`MonthBudget`) để xác định thứ tự "đã tạo" |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-015-quick-view-thang-lien-ke/spec.md` (`Ready for DEV`, 6 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-015-quick-view-thang-lien-ke.md` |
| Raw | `docs/kb/ba/raw/US-015-quick-view-thang-lien-ke.md` |
| PO review phát hiện khoảng trống | `docs/po/review-2026-08-11-quick-view-thang.md` |
| Business Flow (F3, gap #13) | `docs/kb/ba/business-flow.md` |
| Hành vi hiện tại (hiển thị toàn bộ tháng, không giới hạn) | `components/BudgetApp.tsx:741-759` |
| Cách xem tháng khác đã có sẵn ("Chọn tháng xem") | `components/BudgetApp.tsx:686-695` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-003-quan-ly-chu-ky-thang.md`](../epic/EPC-003-quan-ly-chu-ky-thang.md) | Epic | Thuộc luồng F3 (Quản lý theo chu kỳ tháng) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-015-quick-view-thang-lien-ke.md`](../../delivery/pbi/US-015-quick-view-thang-lien-ke.md) | Đã đồng bộ 2026-08-11 — đủ 6 AC |
