---
status: Active
feature: US-004
updated: 2026-08-05
spec: docs/features/US-004-sua-xoa-tung-giao-dich/spec.md
raw: docs/kb/ba/raw/US-004-sua-xoa-tung-giao-dich.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-004", "Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu"]
---

# US-004 — Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Cho phép Dylan sửa đầy đủ 4 trường hoặc xóa (có xác nhận) một giao dịch thuộc tháng đang chọn, thay vì chỉ có "reset toàn bộ tháng" như hiện tại; "Chi thực tế" của danh mục tính lại tự động sau mỗi lần sửa/xóa.

## 2. Phạm Vi

Trong phạm vi:

- Sửa nội dung, số tiền, danh mục, ngày của một giao dịch (ngày ≤ hôm nay — [`BR-004`](../business-rule/BR-004-ngay-khong-tuong-lai.md))
- Xóa một giao dịch, có hộp xác nhận trước ([`BR-002`](../business-rule/BR-002-xoa-can-xac-nhan.md))
- Chỉ áp dụng cho giao dịch thuộc tháng đang chọn ([`BR-003`](../business-rule/BR-003-chi-thang-dang-chon.md))
- Tính lại "Chi thực tế" của danh mục cũ/mới sau khi sửa/xóa (derived từ tổng giao dịch)
- Danh sách giao dịch hiển thị toàn bộ tháng đang chọn, bỏ giới hạn 8 giao dịch gần nhất (`DEC-047`)
- Form Sửa và hộp xác nhận Xóa mở rộng ngay trong dòng bảng, không phải modal (`DEC-046`)
- Chặn lưu và báo lỗi nếu giao dịch đang sửa đã bị đổi/xóa từ một tab/thiết bị khác (`DEC-048`)

Ngoài phạm vi:

- Khôi phục (undo) sau khi xóa ([`BR-005`](../business-rule/BR-005-khong-undo.md))
- Sửa/xóa giao dịch của tháng khác tháng đang chọn ([`BR-003`](../business-rule/BR-003-chi-thang-dang-chon.md))
- Tạo mới danh mục "Chi tiêu khác" và ẩn nó khỏi bảng danh mục khi hết giao dịch — thuộc requirement riêng (`US-005`, chưa có spec); "Chi thực tế" luôn tính tổng quát theo `categoryId` nên US-004 không cần biết danh mục có phải "Chi tiêu khác" hay không

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Sửa, Xóa | Chỉ giao dịch thuộc tháng đang chọn ([`BR-003`](../business-rule/BR-003-chi-thang-dang-chon.md)) — hệ thống single-user, không có vai trò thứ hai |

## 4. Luồng Nghiệp Vụ

1. Dylan xem lại danh sách giao dịch gần đây tại bảng chi tiết chi tiêu, nắm được lịch sử chi tiêu trong tháng đang chọn.
2. Dylan chọn "Sửa" trên một giao dịch nhập sai — form sửa hiển thị đầy đủ 4 trường: nội dung, số tiền, danh mục, ngày ([`BR-001`](../business-rule/BR-001-sua-day-du-4-truong.md)); trường ngày chỉ nhận giá trị ≤ hôm nay ([`BR-004`](../business-rule/BR-004-ngay-khong-tuong-lai.md)).
3. Dylan lưu giao dịch đã sửa — nếu ngày hợp lệ: giao dịch cập nhật, "Chi thực tế" của danh mục cũ và danh mục mới (nếu đổi danh mục) tính lại từ tổng giao dịch; nếu ngày ở tương lai: chặn lưu, yêu cầu chọn lại.
4. Dylan chọn "Xóa" trên một giao dịch — hộp xác nhận hiện ra trước ([`BR-002`](../business-rule/BR-002-xoa-can-xac-nhan.md)).
5. Dylan xác nhận xóa — giao dịch bị xóa khỏi danh sách; "Chi thực tế" của danh mục tính lại từ tổng giao dịch còn lại.

Ngoại lệ:

- Giao dịch thuộc tháng khác tháng đang chọn → không cho sửa/xóa ([`BR-003`](../business-rule/BR-003-chi-thang-dang-chon.md)).
- Sửa ngày sang tương lai → chặn lưu tại chỗ, không tạo bản ghi sai ([`BR-004`](../business-rule/BR-004-ngay-khong-tuong-lai.md)).
- Xóa nhầm → không có khôi phục, hộp xác nhận là lớp bảo vệ duy nhất ([`BR-005`](../business-rule/BR-005-khong-undo.md)).
- Tháng đang chọn chưa có giao dịch nào → danh sách trống, không có nút "Sửa"/"Xóa" nào để bấm.
- Nội dung để trống hoặc số tiền không hợp lệ khi sửa → nút "Lưu" tắt, không bấm được.
- Giao dịch bị đổi/xóa từ một tab/thiết bị khác trong lúc đang sửa → chặn lưu, báo lỗi, không ghi đè và không tạo lại giao dịch đã xóa (`DEC-048`).

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-001` | Sửa giao dịch cho phép đổi đầy đủ 4 trường | [`../business-rule/BR-001-sua-day-du-4-truong.md`](../business-rule/BR-001-sua-day-du-4-truong.md) | `docs/memory/decisions.md#dec-008` | Đã xác nhận từ knowledge |
| `BR-002` | Xóa giao dịch phải qua hộp xác nhận trước | [`../business-rule/BR-002-xoa-can-xac-nhan.md`](../business-rule/BR-002-xoa-can-xac-nhan.md) | `docs/memory/decisions.md#dec-009` | Đã xác nhận từ knowledge |
| `BR-003` | Chỉ cho sửa/xóa giao dịch của tháng đang chọn | [`../business-rule/BR-003-chi-thang-dang-chon.md`](../business-rule/BR-003-chi-thang-dang-chon.md) | `docs/memory/decisions.md#dec-010` | Đã xác nhận từ knowledge |
| `BR-004` | Ngày giao dịch khi sửa chỉ nhận giá trị ≤ hôm nay | [`../business-rule/BR-004-ngay-khong-tuong-lai.md`](../business-rule/BR-004-ngay-khong-tuong-lai.md) | `docs/memory/rules.md#p1-nghiệp-vụ`, `docs/memory/decisions.md#dec-017` | Đã xác nhận từ knowledge |
| `BR-005` | Không phát triển tính năng khôi phục (undo) sau khi xóa | [`../business-rule/BR-005-khong-undo.md`](../business-rule/BR-005-khong-undo.md) | `docs/memory/decisions.md#dec-031` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Giao dịch | [`../../data/entity/ENT-001-giao-dich.md`](../../data/entity/ENT-001-giao-dich.md) | `Transaction` | Model đã tồn tại (US-001) — US-004 chỉ thêm thao tác sửa/xóa một bản ghi, không đổi cấu trúc bảng |

Không có thuật ngữ nghiệp vụ mới phát sinh ngoài những gì đã có trong `docs/memory/glossary.md`.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| `US-001` | Depends on | Cần data model bền vững (`Transaction`, `Category`) và cơ chế tính "Chi thực tế" derived đã có sẵn |
| `US-003` | Depends on | Cần giao dịch liên kết danh mục theo `categoryId` để đổi danh mục khi sửa chính xác, không lệch theo tên |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-004-sua-xoa-tung-giao-dich/spec.md` (`Status: Ready for DEV`, 11 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-004-sua-xoa-tung-giao-dich.md` |
| Raw | `docs/kb/ba/raw/US-004-sua-xoa-tung-giao-dich.md` |
| Business Flow (F1, bước 3-6) | `docs/kb/ba/business-flow.md` |
| Trang wiki phẳng trước đây (legacy, trước khi migrate sang cấu trúc nested) | `docs/kb/ba/wiki/US-004-sua-xoa-tung-giao-dich.md` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-001-ghi-nhan-chi-tieu.md`](../epic/EPC-001-ghi-nhan-chi-tieu.md) | Epic | Thuộc luồng F1 (Ghi nhận chi tiêu) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-004-sua-xoa-tung-giao-dich.md`](../../delivery/pbi/US-004-sua-xoa-tung-giao-dich.md) | Đã đồng bộ 2026-08-05 — đủ 11 AC |
