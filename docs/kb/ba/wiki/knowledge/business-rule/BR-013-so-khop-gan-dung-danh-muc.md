---
status: Active
updated: 2026-08-06
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-013"]
---

# BR-013 — Khi từ khóa khớp một danh mục nhưng tên danh mục đã đổi, so khớp gần đúng trước khi coi là không xác định được

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi nội dung nhập nhanh khớp từ khóa của một nhóm chi tiêu (vd "ăn", "tối" → nhóm "Ăn uống"), nhưng không còn danh mục nào trong tháng đang chọn mang đúng tên gốc của nhóm đó (vì Dylan đã đổi tên), hệ thống phải thử so khớp gần đúng: tìm một danh mục mà tên của nó có chứa tên nhóm, hoặc tên nhóm có chứa tên danh mục. Tìm được thì gán giao dịch vào đúng danh mục đó. Chỉ khi so khớp gần đúng cũng không tìm ra, hệ thống mới coi là "không xác định được" và áp dụng [`BR-011`](BR-011-bo-qua-danh-muc.md) (tự động vào "Chi tiêu khác"). Không bao giờ được để giao dịch bị mất một cách im lặng chỉ vì tên danh mục không khớp tuyệt đối.

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-012`](../feature/US-012-sua-loi-nhan-dien-danh-muc.md) | Bước nhận diện danh mục khi ghi nhận nhanh chi tiêu (F1 bước 1-2), ngay trước bước fallback "Chi tiêu khác" |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Có nhiều hơn một danh mục cùng khớp gần đúng | Lấy danh mục đầu tiên theo thứ tự hiển thị trên bảng ngân sách (`DEC-060`) | `US-012` |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Defect tái hiện thật (PO-01) và hướng sửa user đã chọn qua dialog | `docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md`, `docs/memory/decisions.md#dec-059` | Đã xác nhận từ knowledge |
| Cách chọn khi nhiều danh mục cùng khớp gần đúng | `docs/memory/decisions.md#dec-060` | Đã xác nhận từ knowledge |
