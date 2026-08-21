---
status: Active
feature: US-014
updated: 2026-08-10
spec: docs/features/US-014-chi-tieu-khac-cuoi-bang/spec.md
raw: docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-014", "Chi tiêu khác luôn cuối bảng danh mục"]
---

# US-014 — Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại danh mục "Chi tiêu khác" hiển thị theo đúng thứ tự nó được tạo ra trong dữ liệu — vì nó được sinh lười biếng (chỉ khi lần đầu cần dùng, giữa vòng đời tháng), nếu Dylan thêm danh mục mới sau thời điểm đó, danh mục mới sẽ xuất hiện sau "Chi tiêu khác" trong bảng, không có vị trí cố định. Sau thay đổi này, "Chi tiêu khác" (khi đang hiển thị) luôn nằm ở dòng cuối cùng trong danh sách danh mục, bất kể thời điểm nó được tạo.

## 2. Phạm Vi

Trong phạm vi:

- Đưa "Chi tiêu khác" xuống cuối danh sách danh mục tại nguồn dữ liệu dùng chung, để nhất quán ở mọi nơi hiển thị (bảng ngân sách, ô chọn danh mục khi ghi nhận nhanh, biểu đồ cơ cấu chi tiêu)
- Giữ nguyên thứ tự tương đối giữa các danh mục còn lại

Ngoài phạm vi:

- Sắp xếp lại các danh mục còn lại theo bất kỳ tiêu chí nào khác (tên, loại, ngân sách...) — không thuộc yêu cầu này
- Thay đổi thời điểm sinh, điều kiện ẩn/hiện, hay quyền chỉnh sửa của "Chi tiêu khác" — giữ nguyên như đã có (`BR-009`, `BR-010`, `BR-012`)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem danh sách danh mục với "Chi tiêu khác" luôn ở cuối (khi đang hiển thị) | Single-user (`DEC-004`) — không áp dụng phân quyền |

## 4. Luồng Nghiệp Vụ

1. Dylan mở trang Thu chi, đang xem một tháng có "Chi tiêu khác" đang hiển thị (còn giao dịch gán vào nó) và ít nhất một danh mục khác.
2. Hệ thống hiển thị danh sách danh mục: các danh mục thường theo đúng thứ tự tương đối đã có, "Chi tiêu khác" luôn ở dòng cuối cùng.
3. Dylan thêm một danh mục mới (dù đã có "Chi tiêu khác" từ trước) → danh mục mới chèn vào trước "Chi tiêu khác" trong danh sách, "Chi tiêu khác" vẫn ở cuối.

Ngoại lệ: Tháng chưa từng phát sinh nhu cầu dùng "Chi tiêu khác" (chưa có giao dịch nào cần gán vào nó) → không có dòng "Chi tiêu khác" nào trong danh sách, không có gì để sắp xếp.

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-016` | "Chi tiêu khác" (khi đang hiển thị) luôn nằm ở cuối danh sách danh mục, các danh mục còn lại giữ nguyên thứ tự tương đối | [`../business-rule/BR-016-chi-tieu-khac-cuoi-bang.md`](../business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) | `docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Danh mục | [`../../data/entity/ENT-002-danh-muc.md`](../../data/entity/ENT-002-danh-muc.md) | `Category` | Không đổi cấu trúc — chỉ đổi thứ tự hiển thị, không đổi dữ liệu lưu trữ |

Không có thuật ngữ nghiệp vụ mới phát sinh.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-005`](../../../../features/US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Related only | Đã định nghĩa hành vi sinh/ẩn-hiện "Chi tiêu khác" — US-014 chỉ đổi thứ tự hiển thị, không đổi lại các hành vi đó |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Raw | `docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md` |
| Business Flow (F2) | `docs/kb/ba/business-flow.md` |
| Source (hành vi hiện tại — không có `orderBy`) | `server/budget/infrastructure/repositories/category-prisma-repository.ts` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Thuộc luồng F2 (Lập và điều chỉnh ngân sách theo danh mục) |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-014-chi-tieu-khac-cuoi-bang.md`](../../delivery/pbi/US-014-chi-tieu-khac-cuoi-bang.md) | Đã đồng bộ 2026-08-10 — đủ 5 AC |
