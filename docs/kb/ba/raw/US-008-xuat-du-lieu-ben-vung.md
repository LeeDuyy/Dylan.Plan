# Raw Requirement — Xuất dữ liệu từ nguồn lưu trữ bền vững

Status: Raw
Feature: US-008
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Thấp
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-008 |
| Slug | xuat-du-lieu-ben-vung |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-008-xuat-du-lieu-ben-vung/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-008-xuat-du-lieu-ben-vung.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Xuất dữ liệu từ nguồn lưu trữ bền vững | Xuất JSON đọc từ database thay vì chỉ từ state trình duyệt hiện tại

(docs/kb/ba/backlog.md, US #8)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #8): Xuất dữ liệu (JSON) chưa đọc từ nguồn lưu trữ bền vững.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Luồng ảnh hưởng | F4 | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |
| Ưu tiên / Effort | Thấp / Quick win | `docs/kb/ba/backlog.md` US #8 | Đã xác nhận |
| Hiện trạng | Nút "Xuất JSON" hiện tại là tải file thủ công về máy người dùng, không phải tích hợp với hệ thống ngoài; đọc dữ liệu từ state trình duyệt | `docs/kb/ba/business-flow.md#2-bối-cảnh-và-người-dùng` | Đã xác nhận |
| Không có hệ thống ngoài trao đổi dữ liệu | Xác nhận trong Business Flow mục 2 | `docs/kb/ba/business-flow.md#2-bối-cảnh-và-người-dùng` | Đã xác nhận |

## 4. Câu Hỏi Mở

Không còn câu hỏi chặn spec — đây chỉ là đổi nguồn đọc dữ liệu (từ state sang DB) cho tính năng xuất JSON đã có sẵn, không đổi định dạng hay hành vi tải file.

## 5. Ghi Chú BA

- US-008 phụ thuộc US-001 hoàn thành để có dữ liệu bền vững làm nguồn xuất; effort thấp vì chỉ đổi nguồn đọc, giữ nguyên hành vi tải file JSON hiện có.
