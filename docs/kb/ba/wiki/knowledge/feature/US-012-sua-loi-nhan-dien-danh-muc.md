---
status: Active
feature: US-012
updated: 2026-08-06
spec: docs/features/US-012-sua-loi-nhan-dien-danh-muc/spec.md
raw: docs/kb/ba/raw/US-012-sua-loi-nhan-dien-danh-muc.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-012", "Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi"]
---

# US-012 — Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Khi Dylan gõ nội dung nhập nhanh khớp từ khóa của một nhóm chi tiêu, nhưng danh mục thật trong tháng đã bị đổi tên (khác tên gốc dùng để so khớp trong code), hệ thống hiện đang âm thầm không ghi nhận gì — không lưu giao dịch, không báo lỗi. Function này sửa để giao dịch luôn được ghi nhận: ưu tiên vẫn vào đúng danh mục nếu suy ra được bằng so khớp gần đúng, nếu không thì rơi về "Chi tiêu khác" — không bao giờ mất một giao dịch một cách im lặng.

## 2. Phạm Vi

Trong phạm vi:

- Khi rule từ khóa khớp nhưng không tìm được danh mục đúng tên tuyệt đối, thử so khớp gần đúng (tên danh mục thật chứa tên nhóm, hoặc ngược lại) trước khi kết luận không xác định được
- Không tìm được kể cả so khớp gần đúng → giao dịch tự động vào "Chi tiêu khác" (tự sinh nếu tháng chưa có), giống nhánh "không khớp từ khóa nào"

Ngoài phạm vi:

- Đổi danh sách từ khóa nhận diện hoặc thêm nhóm chi tiêu mới — không thuộc requirement này
- Chặn hoặc cảnh báo Dylan khi đổi tên một danh mục mặc định — không yêu cầu
- Sửa/xóa từng giao dịch riêng lẻ (đã có từ US-004), cơ chế tự sinh/ẩn "Chi tiêu khác" (đã có từ US-005) — dùng lại nguyên trạng, không đổi

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Ghi nhận chi tiêu qua ô nhập nhanh | Không áp dụng phân quyền — hệ thống chỉ một người dùng |

## 4. Luồng Nghiệp Vụ

1. Dylan gõ nội dung tự nhiên vào ô nhập nhanh.
2. Nội dung khớp từ khóa của một nhóm chi tiêu.
3. Hệ thống tìm danh mục đúng tên tuyệt đối trong tháng đang chọn — không thấy.
4. Hệ thống thử so khớp gần đúng — thấy một danh mục có tên chứa (hoặc bị chứa bởi) tên nhóm đó.
5. Giao dịch được gán vào đúng danh mục tìm được ở bước 4.

Ngoại lệ: So khớp gần đúng cũng không tìm ra → áp dụng đúng hành vi đã có của [`BR-011`](../business-rule/BR-011-bo-qua-danh-muc.md) — giao dịch tự vào "Chi tiêu khác".

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-013` | So khớp gần đúng trước khi coi là không xác định được; nhiều kết quả khớp thì lấy cái đầu theo thứ tự hiển thị | [`../business-rule/BR-013-so-khop-gan-dung-danh-muc.md`](../business-rule/BR-013-so-khop-gan-dung-danh-muc.md) | `docs/memory/decisions.md#dec-059`, `docs/memory/decisions.md#dec-060` | Đã xác nhận từ knowledge |
| `BR-011` | Không xác định được thì tự vào "Chi tiêu khác" | [`../business-rule/BR-011-bo-qua-danh-muc.md`](../business-rule/BR-011-bo-qua-danh-muc.md) | `docs/memory/decisions.md#dec-028` | Đã xác nhận từ knowledge (đã có từ US-005, dùng lại) |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Danh mục | [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | `Category` | Không đổi cấu trúc — chỉ đổi cách so khớp tên khi nhận diện |

Không có thuật ngữ nghiệp vụ mới phát sinh.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-005`](../../../../features/US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Depends on | Dùng lại cơ chế tự sinh "Chi tiêu khác" khi không xác định được danh mục |
| [`US-001`](../../../../features/US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Depends on | Cần data model bền vững và danh mục lưu trong DB để so khớp |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-012-sua-loi-nhan-dien-danh-muc.md` |
| PO review (tái hiện defect thật) | `docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md` |
| Business Flow (F1, gap #12) | `docs/kb/ba/business-flow.md` |
| Quyết định hướng sửa | `docs/memory/decisions.md#dec-059` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-001-ghi-nhan-chi-tieu.md`](../epic/EPC-001-ghi-nhan-chi-tieu.md) | Epic | Thuộc luồng F1 (Ghi nhận chi tiêu) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-012-sua-loi-nhan-dien-danh-muc.md`](../../delivery/pbi/US-012-sua-loi-nhan-dien-danh-muc.md) | Đã đồng bộ 2026-08-06 — đủ 5 AC |
