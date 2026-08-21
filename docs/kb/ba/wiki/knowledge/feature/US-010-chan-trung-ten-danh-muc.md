---
status: Active
feature: US-010
updated: 2026-08-10
spec: docs/features/US-010-chan-trung-ten-danh-muc/spec.md
raw: docs/kb/ba/raw/US-010-chan-trung-ten-danh-muc.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-010", "Chặn trùng tên danh mục"]
---

# US-010 — Chặn trùng tên danh mục

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, bảng danh mục không kiểm tra trùng tên khi Dylan thêm mới hoặc sửa tên một danh mục — có thể tồn tại hai danh mục cùng tên trong một tháng (kể cả khi Dylan bấm nút "Thêm danh mục" nhiều lần liên tiếp mà chưa đổi tên, vì danh mục mới luôn được tạo với tên mặc định giống nhau). Việc này gây khó xác định khi ghi nhận chi tiêu bằng nhập nhanh nên gán giao dịch vào danh mục nào trong hai danh mục trùng tên. Sau thay đổi này, hệ thống chặn và báo lỗi rõ ràng ngay khi Dylan cố tạo ra tên trùng — dù là do tự gõ tên khi sửa, hay do bấm "Thêm danh mục" trong khi tên mặc định đã trùng với một danh mục có sẵn — giúp bảng danh mục luôn có tên riêng biệt, phục vụ mục tiêu M1 (dữ liệu chi tiêu chính xác, nhất quán) của Business Flow.

## 2. Phạm Vi

Trong phạm vi:

- Kiểm tra trùng tên khi Dylan sửa tên một danh mục đã có, ngay khi rời khỏi ô nhập tên
- Kiểm tra trùng tên khi Dylan bấm "Thêm danh mục" — kể cả khi tên trùng là tên mặc định do hệ thống tự đặt (chưa được Dylan đổi)
- So sánh chuẩn hóa: bỏ qua khác biệt hoa/thường, khoảng trắng thừa đầu/cuối, và rút gọn khoảng trắng lặp ở giữa chuỗi
- Phạm vi kiểm tra: chỉ tính các danh mục khác trong cùng tháng đang chọn

Ngoài phạm vi:

- Áp dụng ràng buộc này cho "Chi tiêu khác" — danh mục này khóa vĩnh viễn, chỉ xem, không có thao tác sửa tên (`DEC-027`)
- Đổi cơ chế nút "Thêm danh mục" sang bắt Dylan nhập tên trước khi lưu (`DEC-068` loại phương án này)
- Tự động đổi tên hoặc thêm hậu tố phân biệt khi phát hiện trùng (`DEC-021` loại phương án này)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Thêm, sửa tên danh mục | Single-user, không đăng nhập/phân quyền (`DEC-004`) |

## 4. Luồng Nghiệp Vụ

1. Dylan gõ tên mới vào ô nhập tên của một danh mục đã có, rồi rời khỏi ô nhập.
2. Hệ thống chuẩn hóa tên vừa nhập (bỏ khoảng trắng thừa đầu/cuối, coi hoa/thường là như nhau, rút gọn khoảng trắng lặp ở giữa) rồi so với tên của các danh mục khác trong cùng tháng đang chọn.
3. Không trùng — tên mới được lưu lại bình thường.
4. Trùng — hệ thống chặn thao tác sửa, ô nhập trở lại tên trước khi sửa, hiện thông báo lỗi rõ ràng yêu cầu Dylan đổi tên khác.
5. Dylan bấm nút "Thêm danh mục" — hệ thống kiểm tra tên mặc định "Danh mục mới" theo cùng quy tắc chuẩn hóa.
6. Tên mặc định chưa trùng — thêm ngay danh mục mới tên "Danh mục mới".
7. Tên mặc định đã trùng — chặn thêm, không có danh mục mới nào xuất hiện, hiện thông báo lỗi yêu cầu Dylan đổi tên danh mục "Danh mục mới" đang có trước.

Ngoại lệ: Dylan sửa tên một danh mục nhưng giữ nguyên tên cũ (không đổi) — không bị coi là trùng với chính nó.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-017` | Chặn trùng tên danh mục khi thêm mới hoặc sửa tên (kể cả tên mặc định "Danh mục mới"), so sánh chuẩn hóa hoa/thường, khoảng trắng thừa đầu/cuối, và khoảng trắng lặp ở giữa | [`../business-rule/BR-017-chan-trung-ten-danh-muc.md`](../business-rule/BR-017-chan-trung-ten-danh-muc.md) | `docs/memory/decisions.md#dec-020`, `#dec-021`, `#dec-022`, `#dec-068`, `#dec-069` | Đã xác nhận từ knowledge |
| `BR-010` | "Chi tiêu khác" khóa vĩnh viễn, chỉ xem — không có thao tác sửa tên để áp ràng buộc này | [`../business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md`](../business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md) | `docs/memory/decisions.md#dec-027` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Danh mục | [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | `Category` | Kiểm tra trùng tên (đã chuẩn hóa) thực hiện được bằng so sánh ở tầng ứng dụng, không bắt buộc đổi cấu trúc dữ liệu (spec mục 13) |

Không có thuật ngữ nghiệp vụ mới phát sinh ngoài "Danh mục" đã có sẵn trong `docs/memory/glossary.md`.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-001`](../../../../features/US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Depends on | Cần data model bền vững (`Category`) để áp ràng buộc trùng tên |
| [`US-005`](../../../../features/US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Depends on | Cần dòng "Chi tiêu khác" đã hiển thị dạng chỉ đọc để việc loại trừ nó khỏi kiểm tra trùng tên có ý nghĩa |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-010-chan-trung-ten-danh-muc/spec.md` (`Status: Ready for DEV`, 7 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-010-chan-trung-ten-danh-muc.md` |
| Raw | `docs/kb/ba/raw/US-010-chan-trung-ten-danh-muc.md` |
| Business Flow (M1, F1-F2, gap #10) | `docs/kb/ba/business-flow.md` |
| Trang wiki phẳng trước đây (legacy) | `docs/kb/ba/wiki/US-010-chan-trung-ten-danh-muc.md` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Thuộc luồng F2 (Lập và điều chỉnh ngân sách theo danh mục) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-010-chan-trung-ten-danh-muc.md`](../../delivery/pbi/US-010-chan-trung-ten-danh-muc.md) | Đã đồng bộ 2026-08-10 — đủ 7 AC |
