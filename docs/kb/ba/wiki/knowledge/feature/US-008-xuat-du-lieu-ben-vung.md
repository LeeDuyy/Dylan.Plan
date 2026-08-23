---
status: Active
feature: US-008
updated: 2026-08-21
spec: docs/features/US-008-xuat-du-lieu-ben-vung/spec.md
raw: docs/kb/ba/raw/US-008-xuat-du-lieu-ben-vung.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-008", "Xuất dữ liệu bền vững"]
---

# US-008 — Xuất dữ liệu từ nguồn lưu trữ bền vững

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Cho Dylan tải file JSON chứa đúng dữ liệu đã lưu bền vững trong cơ sở dữ liệu (mọi tháng, danh mục, giao dịch, item cần mua), thay vì chỉ dữ liệu đang có sẵn trong bộ nhớ tạm của trình duyệt tại thời điểm bấm nút "Xuất JSON". Phục vụ mục tiêu `M1` của Business Flow — dữ liệu bền vững, chính xác.

## 2. Phạm Vi

Trong phạm vi:

- Nút "Xuất JSON" đã có sẵn ở trang Thu chi tải file chứa dữ liệu lấy từ toàn bộ nguồn lưu trữ bền vững, không giới hạn hay lọc bớt

Ngoài phạm vi:

- Đổi định dạng file, cấu trúc dữ liệu trong file, hay cách Dylan tải file (vẫn tải thủ công về máy, không tích hợp hệ thống ngoài)
- Xuất sang định dạng khác ngoài JSON

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xuất dữ liệu | Single-user, không có phân quyền riêng (`DEC-004`) |

## 4. Luồng Nghiệp Vụ

1. Dylan mở trang Thu chi, bấm nút "Xuất JSON".
2. File JSON tải về máy chứa dữ liệu lấy từ toàn bộ nguồn lưu trữ bền vững trong cơ sở dữ liệu tại thời điểm bấm nút.

Ngoại lệ: Chưa có dữ liệu nào được lưu — file tải về chứa cấu trúc rỗng, giống hành vi hiện có khi chưa có dữ liệu.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-029` | Xuất dữ liệu JSON đọc từ nguồn lưu trữ bền vững, không chỉ từ bộ nhớ tạm của trình duyệt | [`../business-rule/BR-029-xuat-json-tu-du-lieu-ben-vung.md`](../business-rule/BR-029-xuat-json-tu-du-lieu-ben-vung.md) | `docs/kb/ba/business-flow.md#2-bối-cảnh-và-người-dùng` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Tháng ngân sách | [`../../data/entity/ENT-003-thang-ngan-sach.md`](../../data/entity/ENT-003-thang-ngan-sach.md) | `MonthBudget` | Không thêm bảng mới — chỉ đảm bảo nguồn xuất là toàn bộ dữ liệu bền vững đã lưu |

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| `US-001` | Depends on | Chỉ có ý nghĩa sau khi dữ liệu đã được lưu bền vững — đã `Delivered With Notes` |
| `US-007` | Related only | Cùng thuộc luồng F4, cùng dạng gap "state trình duyệt vs DB" nhưng khác Screen Element |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-008-xuat-du-lieu-ben-vung/spec.md` (`Ready for DEV`, 4 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-008-xuat-du-lieu-ben-vung.md` |
| Raw | `docs/kb/ba/raw/US-008-xuat-du-lieu-ben-vung.md` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-004-phan-tich-bao-cao-chi-tieu.md`](../epic/EPC-004-phan-tich-bao-cao-chi-tieu.md) | Epic | Thuộc epic F4 (Phân tích và báo cáo chi tiêu) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-008-xuat-du-lieu-ben-vung.md`](../../delivery/pbi/US-008-xuat-du-lieu-ben-vung.md) | Đã đồng bộ 2026-08-21 — 4 AC |
