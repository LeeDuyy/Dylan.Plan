# Raw Requirement — Lưu trữ chi tiêu bền vững (data model + migration)

Status: Raw
Feature: US-001
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Cao
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-001 |
| Slug | luu-tru-chi-tieu-ben-vung |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Lưu trữ chi tiêu bền vững (data model + migration) | Chuyển dữ liệu tháng/danh mục/giao dịch từ localStorage sang Prisma + SQLite

(docs/kb/ba/backlog.md, US #1)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #1): Dữ liệu chỉ lưu ở localStorage, không có backend/database dù kit đã cấu hình Prisma + SQLite.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích US này ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Mục tiêu phục vụ | M1 — Dữ liệu chi tiêu được lưu trữ bền vững, không phụ thuộc trình duyệt | `docs/kb/ba/business-flow.md#1-định-hướng-sản-phẩm` | Đã xác nhận |
| Luồng ảnh hưởng | F1, F2, F3, F4 (toàn bộ) | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |
| Ưu tiên / Effort | Cao / Medium | `docs/kb/ba/backlog.md` US #1 | Đã xác nhận |
| Thứ tự triển khai | Làm đầu tiên, nền tảng cho mọi US khác; phải làm cùng lúc với US #3 (liên kết giao dịch theo ID) vì cùng thuộc thiết kế data model | `docs/kb/ba/backlog.md#thứ-tự-triển-khai-đề-xuất` | Đã xác nhận |
| Ưu tiên chuyển sang DB trước các US khác | DEC-003 | `docs/memory/decisions.md#dec-003` | Đã xác nhận |
| Single-user, không cần bảng User/quyền | DEC-004 | `docs/memory/decisions.md#dec-004` | Đã xác nhận |
| "Chi thực tế" là số suy ra (derived) từ tổng giao dịch, không lưu cột riêng | DEC-007 | `docs/memory/decisions.md#dec-007` | Đã xác nhận |
| Ngưỡng cấu hình (cảnh báo 90%, mục tiêu chi, quỹ linh hoạt) cần nơi lưu trên DB mới, thiết kế cụ thể chưa chốt | DEC-006 | `docs/memory/decisions.md#dec-006` | Đã xác nhận — thiết kế cụ thể để `ssr-data` xử lý |
| Kit đã cấu hình sẵn Prisma + SQLite nhưng chưa có schema/migration thật | `.ssr-kit.env` (`SSR_PRISMA_SCHEMA=prisma/schema.prisma`), thư mục `prisma/` chưa tồn tại | `.ssr-kit.env`, cấu trúc thư mục dự án | Đã xác nhận |
| State hiện tại của dữ liệu (tháng, danh mục, giao dịch) nằm trong React state + `localStorage` | `components/DylanPlanApp.tsx` | `components/DylanPlanApp.tsx` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | US này có cần di trú (migrate) dữ liệu hiện có trong `localStorage` của Dylan sang database mới không? | Cần viết script di trú một lần từ `localStorage` sang DB — không chấp nhận bắt đầu dữ liệu rỗng, phải giữ lại lịch sử các tháng đã ghi trước đó. | Đã xác nhận từ knowledge (user chọn qua `AskUserQuestion`) |
| Q2 | Data model cụ thể (tên bảng, quan hệ, kiểu dữ liệu) sẽ do stage nào thiết kế? | Theo quy trình kit, `ssr-plan`/`ssr-data` đảm nhận thiết kế schema chi tiết khi tới lượt; raw chỉ ghi nhận yêu cầu nghiệp vụ, không tự thiết kế bảng. | Đã xác nhận từ knowledge |
| Q3 | Nơi lưu trữ cụ thể cho các ngưỡng cấu hình được (trên bảng tháng hay bảng Settings riêng)? | Chưa chốt — DEC-006 mới chốt "cho cấu hình", chưa chốt thiết kế lưu trữ; để `ssr-data` đề xuất khi tới lượt. Không thuộc phạm vi bắt buộc của US-001 (US-001 chỉ cần data model cho tháng/danh mục/giao dịch); US #9 (chưa tạo raw ở lượt này) sẽ xử lý phần ngưỡng. | Giả định hợp lý |

## 5. Ghi Chú BA

- US-001 phải triển khai **cùng lúc** với US-003 (liên kết giao dịch theo danh mục bằng ID) — đây là quyết định kỹ thuật đã ghi trong `backlog.md`, không phải một lựa chọn tùy chọn. `ssr-ba`/`ssr-plan` nên cân nhắc gộp phạm vi thiết kế data model của hai US này để tránh migrate lại schema.
- Vì cần script di trú dữ liệu cũ (Q1), spec cần làm rõ: định dạng dữ liệu nguồn (`localStorage` key nào, cấu trúc JSON hiện tại trong `components/DylanPlanApp.tsx`), cách chạy di trú (một lần, thủ công hay tự động khi vào app lần đầu), và cách xử lý nếu di trú thất bại giữa chừng.
- "Chi thực tế" (DEC-007) phải được thiết kế là giá trị tính toán (aggregate/sum trên bảng giao dịch), không lưu cột `actual` riêng trên bảng danh mục — tránh lặp lại lỗi thiết kế đã ghi ở `JDG-001`.
