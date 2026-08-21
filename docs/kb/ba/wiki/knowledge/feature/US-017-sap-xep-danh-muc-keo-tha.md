---
status: Active
feature: US-017
updated: 2026-08-12
spec: docs/features/US-017-sap-xep-danh-muc-keo-tha/spec.md
raw: docs/kb/ba/raw/US-017-sap-xep-danh-muc-keo-tha.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-017", "Sắp xếp danh mục kéo thả"]
---

# US-017 — Sắp xếp vị trí danh mục bằng kéo thả (Drag-and-drop row reordering)

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, thứ tự các danh mục trong bảng ngân sách hoàn toàn thụ động — Dylan không có cách nào tự sắp xếp lại vị trí hiển thị, thứ tự chỉ phản ánh đúng lúc từng danh mục được tạo ra. Sau thay đổi này, Dylan kéo thả trực tiếp một dòng danh mục trên bảng để đổi vị trí của nó, giúp nhóm hoặc sắp xếp các danh mục theo mức độ quan trọng hay thói quen theo dõi cá nhân, thay vì bị ràng buộc theo thứ tự tạo.

Giá trị đo được: Dylan kéo dòng "Ăn uống" từ vị trí thứ ba lên vị trí đầu tiên trên bảng ngân sách, tải lại trang — "Ăn uống" vẫn ở vị trí đầu tiên, dropdown "Danh mục nhận diện" và biểu đồ "Cơ cấu chi tiêu" đều hiển thị đúng thứ tự mới đó.

## 2. Phạm Vi

Trong phạm vi:

- Kéo thả một dòng danh mục trong bảng ngân sách để đổi vị trí hiển thị của nó so với các danh mục khác
- Lưu thứ tự mới bền vững — giữ nguyên qua các lần tải lại trang, đổi tháng, mở lại sau này
- Áp dụng đồng bộ thứ tự mới cho cả 3 nơi dùng chung danh sách danh mục: bảng ngân sách, dropdown "Danh mục nhận diện", biểu đồ "Cơ cấu chi tiêu"
- Danh mục "khóa" (ví dụ "Tiền nhà") vẫn kéo thả đổi vị trí được bình thường
- Khi tạo tháng mới bằng nút "Clone tháng đang xem", thứ tự danh mục ở tháng mới giữ nguyên đúng theo thứ tự của tháng nguồn

Ngoài phạm vi:

- Danh mục "Chi tiêu khác" không tham gia kéo thả — tiếp tục luôn cố định ở vị trí cuối bảng
- Đổi tên cột, đổi công thức tính, hay bất kỳ thay đổi nào khác của bảng ngân sách ngoài vị trí hiển thị của các dòng
- Chọn thư viện kéo thả cụ thể và thiết kế cột lưu thứ tự trong schema — thuộc phạm vi lập kế hoạch kỹ thuật (`ssr-plan`/`ssr-data`)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Kéo thả đổi vị trí danh mục thường và danh mục khóa; không kéo thả được "Chi tiêu khác" | Single-user, không đăng nhập/phân quyền (`DEC-004`) |

## 4. Luồng Nghiệp Vụ

1. Dylan mở bảng danh mục tại trang Thu chi.
2. Dylan nhấn giữ vào một dòng danh mục (trừ "Chi tiêu khác") và kéo tới vị trí mới trong bảng.
3. Dylan thả dòng — thứ tự các danh mục trong bảng cập nhật ngay theo vị trí mới.
4. Thứ tự mới được lưu bền vững; dropdown "Danh mục nhận diện" và biểu đồ "Cơ cấu chi tiêu" tự động phản ánh đúng thứ tự mới.
5. Nếu "Chi tiêu khác" đang hiển thị, nó tiếp tục nằm ở dòng cuối cùng, không bị xáo trộn bởi thao tác kéo thả của các danh mục khác.
6. Khi Dylan bấm nút "Clone tháng đang xem" để tạo tháng mới, các danh mục ở tháng mới xuất hiện theo đúng thứ tự đã có ở tháng nguồn.

Ngoại lệ: Dylan thử kéo dòng "Chi tiêu khác" — dòng này không phản hồi thao tác kéo, vẫn giữ nguyên ở vị trí cuối cùng. Nếu lưu thứ tự mới gặp lỗi, bảng giữ nguyên thứ tự trước khi kéo thả cho tới khi Dylan thử lại thành công.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-020` | Thứ tự danh mục sau kéo thả lưu bền vững, đồng bộ 3 nơi dùng chung danh sách; danh mục khóa vẫn kéo thả được; Clone tháng giữ nguyên thứ tự theo tháng nguồn | [`../business-rule/BR-020-thu-tu-danh-muc-keo-tha.md`](../business-rule/BR-020-thu-tu-danh-muc-keo-tha.md) | `docs/memory/decisions.md#dec-074`, `#dec-075`, `#dec-077`, `#dec-078` | Đã xác nhận từ knowledge |
| `BR-016` | "Chi tiêu khác" luôn ở cuối bảng — kéo thả không thay đổi luật này | [`../business-rule/BR-016-chi-tieu-khac-cuoi-bang.md`](../business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) | `docs/memory/decisions.md#dec-076`, `docs/memory/decisions.md#dec-066` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Danh mục | [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | `Category` | Cần thêm một thuộc tính lưu vị trí hiển thị; tên cột và kiểu cụ thể do `ssr-data` quyết định khi lập kế hoạch kỹ thuật |

Không phát sinh thuật ngữ nghiệp vụ mới.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-001`](../../../../features/US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Depends on | Cần data model `Category` bền vững trong database thật để lưu thứ tự sau kéo thả |
| [`US-014`](../../../../features/US-014-chi-tieu-khac-cuoi-bang/spec.md) | Related only | US-017 phải tôn trọng luật "Chi tiêu khác" luôn ở cuối đã chốt ở đây, không đổi ý định của US-014 |
| [`US-005`](../../../../features/US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Related only | Dùng chung Screen Element dropdown "Danh mục nhận diện" và dòng "Chi tiêu khác", không đổi hành vi chọn/gán danh mục đã mô tả ở đó |
| [`US-006`](../../../../features/US-006-canh-bao-trung-thang/spec.md) | Impacts | Nút "Clone tháng đang xem" (`EL-04` của US-006) có thêm ràng buộc thứ tự — cần bổ sung dòng ràng buộc này vào spec US-006 ở lượt cập nhật tiếp theo (follow-up, `DEC-078`) |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-017-sap-xep-danh-muc-keo-tha/spec.md` |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-017-sap-xep-danh-muc-keo-tha.md` |
| Quyết định | `docs/memory/decisions.md#dec-074`, `#dec-075`, `#dec-076`, `#dec-077`, `#dec-078`, `#dec-079` |
| Business Flow (M1, F2) | `docs/kb/ba/business-flow.md` |
| Bảng danh mục hiện tại | `components/BudgetApp.tsx:944-1035` |
| Nguồn dữ liệu dùng chung 3 nơi | `components/BudgetApp.tsx:342-345,808-811,1088` |
| Chưa có cột thứ tự, chưa có `orderBy` | `prisma/schema.prisma:27-43`, `server/budget/infrastructure/repositories/category-prisma-repository.ts:38-41` |
| Nghiệp vụ Clone tháng sao chép thuộc tính danh mục | `server/budget/application/use-cases/create-month.ts:49-57` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Thuộc luồng F2 (Lập và điều chỉnh ngân sách theo danh mục) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-017-sap-xep-danh-muc-keo-tha.md`](../../delivery/pbi/US-017-sap-xep-danh-muc-keo-tha.md) | Đã đồng bộ 2026-08-12 — đủ 8 AC |
