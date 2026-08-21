# Raw Requirement — Route/module riêng cho Quản lý chi tiêu

Status: Raw
Feature: US-002
Created: 2026-08-03
Source: PO Review
Requester: Dylan (user)
Priority: Trung bình
Owner: ssr-raw

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-002 |
| Slug | route-rieng-quan-ly-chi-tieu |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-002-route-rieng-quan-ly-chi-tieu/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/US-002-route-rieng-quan-ly-chi-tieu.md` |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Route/module riêng cho Quản lý chi tiêu | Tách route riêng tại /budget (DEC-005) khỏi shell chung Dylan Plan Dashboard, dùng chung codebase Next.js

(docs/kb/ba/backlog.md, US #2)

Gap gốc (docs/kb/ba/business-flow.md mục 7 #2): Trang Quản lý chi tiêu chưa tách khỏi shell chung của Dylan Plan Dashboard.

Duyệt tạo raw: user xác nhận trực tiếp trong chat — "DUYỆT TẠO CHO 11 US" (2026-08-03), sau khi ssr-po hỏi và giải thích ở mode business-flow.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Mục tiêu phục vụ | M2 — Trang quản lý chi tiêu tách khỏi các mục khác của Dylan Plan Dashboard | `docs/kb/ba/business-flow.md#1-định-hướng-sản-phẩm` | Đã xác nhận |
| Tên route cụ thể | `/budget` | `docs/memory/decisions.md#dec-005` | Đã xác nhận |
| Tách route, dùng chung codebase (không tách dự án riêng) | DEC-002 | `docs/memory/decisions.md#dec-002` | Đã xác nhận |
| Có thể làm trước hoặc song song với US-001 | `docs/kb/ba/backlog.md#thứ-tự-triển-khai-đề-xuất` | `docs/kb/ba/backlog.md` | Đã xác nhận |
| Hiện trạng: tab "Thu chi" gộp chung shell/nav với roadmap, freelance, sản phẩm trong `DylanPlanApp.tsx` | `components/DylanPlanApp.tsx`, `app/page.tsx` | source | Đã xác nhận |
| Router dự án | Next.js App Router (`SSR_NEXT_ROUTER=app`) | `.ssr-kit.env` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Điều hướng từ Dylan Plan Dashboard sang `/budget` hiển thị dưới dạng gì (menu item, tab, link trong shell chung)? | Chưa có bằng chứng cụ thể trong Business Flow hay decisions — đây là chi tiết UI, để `ssr-ba` đề xuất mockup khi viết spec, không chặn việc tạo raw. | Giả định hợp lý |
| Q2 | Route `/budget` có phụ thuộc dữ liệu bền vững từ US-001 hay có thể triển khai độc lập trên state hiện tại trước? | Backlog cho phép làm trước hoặc song song US-001 (route là vỏ UI/điều hướng, không tự nó yêu cầu DB) — nhưng nội dung bên trong route (bảng ngân sách, giao dịch) vẫn cần dữ liệu bền vững nếu muốn hoàn chỉnh. `ssr-plan` sẽ quyết định thứ tự thực thi cụ thể. | Đã xác nhận từ knowledge |

## 5. Ghi Chú BA

- US-002 chủ yếu là thay đổi cấu trúc route/điều hướng (Next.js App Router), không phải thay đổi data model — có thể phối hợp song song với US-001 nhưng nội dung hiển thị bên trong `/budget` phụ thuộc dữ liệu bền vững của US-001 để hoàn chỉnh cuối cùng.
- Cần `ssr-ba` làm rõ mockup vị trí liên kết `/budget` trong shell chung (Q1) khi viết spec.
