---
status: Raw
feature: US-012
created: 2026-08-06
source: PO Review
requester: Dylan (user)
priority: Cao
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-012"]
---

# Raw Requirement — Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-012 |
| Slug | sua-loi-nhan-dien-danh-muc |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Có |
| Spec dự kiến | `docs/features/US-012-sua-loi-nhan-dien-danh-muc/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi: khi nội dung nhập nhanh khớp từ khóa của một danh mục nhưng danh mục đó đã bị Dylan đổi tên (không còn khớp tên gốc dùng để so khớp trong code), hệ thống hiện đang âm thầm không ghi nhận gì — không lưu giao dịch, không báo lỗi. Cần sửa để: (1) thử so khớp gần đúng giữa tên rule và tên danh mục thật trước (vd "Ăn uống" khớp gần đúng với "Ăn uống & đi chợ"), giữ đúng ý định phân loại ban đầu nếu suy ra được; (2) nếu vẫn không xác định được, giao dịch tự động rơi về danh mục "Chi tiêu khác" giống hệt nhánh "không khớp từ khóa nào" (đã có từ US-005) — không bao giờ để mất giao dịch một cách im lặng. Nguồn: PO review docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md (PO-01, Critical), quyết định hướng sửa DEC-059.
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Bằng chứng tái hiện defect | Gõ "ăn tối 300k" khi danh mục "Ăn uống" đã đổi tên thành "Ăn uống & đi chợ" → preview hiện đúng "→ Ăn uống", nhưng bấm "Ghi nhận" không tạo giao dịch nào, không báo lỗi | `docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md` (PO-01), tái hiện thật trên `next dev` 2026-08-06 | Đã xác nhận |
| Danh sách từ khóa nhận diện hiện có | `quickRules` gồm 8 rule, mỗi rule có `category` là chuỗi tên cố định (vd "Ăn uống", "Giải trí / cafe") | `lib/budget-defaults.ts` | Đã xác nhận |
| Cơ chế tra cứu hiện tại | So khớp **tên chính xác** giữa `inferredQuickCategory` và `Category.name` trong tháng đang chọn; không khớp và tên không rỗng → không làm gì (silent no-op) | `components/BudgetApp.tsx` (`addQuickExpense`) | Đã xác nhận |
| Cơ chế fallback "Chi tiêu khác" đã có sẵn | Khi ô chọn danh mục để trống (không khớp từ khóa nào), giao dịch tự động vào "Chi tiêu khác" (tự sinh nếu tháng chưa có) qua `fallbackCategoryService` | `server/budget/domain/services/fallback-category-service.ts`, `docs/features/US-005-rang-buoc-toan-ven-danh-muc/report.md` | Đã xác nhận |
| Hướng sửa đã chốt với user | Thử so khớp gần đúng (tên danh mục chứa tên rule hoặc ngược lại) trước; không tìm được thì rơi về "Chi tiêu khác" — không đổi schema | `docs/memory/decisions.md#dec-059`, hội thoại `AskUserQuestion` trong `ssr-po mode=review` (2026-08-06) | Đã xác nhận |
| Chuẩn hóa chuỗi tiếng Việt khi so khớp | Mọi so khớp chuỗi có dấu tiếng Việt do người dùng gõ phải `.normalize("NFC")` trước khi so sánh, tránh lỗi lặng lẽ với input dạng NFD | `docs/memory/judgement-log.md#jdg-004` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Khi rule khớp từ khóa nhưng không tìm được danh mục đúng tên tuyệt đối, nên xử lý thế nào? | So khớp gần đúng trước (tên danh mục thật chứa tên rule, hoặc ngược lại); không tìm được thì rơi về "Chi tiêu khác" — user chọn qua `AskUserQuestion` trong `ssr-po mode=review`, không chọn phương án "luôn rơi thẳng Chi tiêu khác" hay "gắn mã cố định cho danh mục" (`DEC-059`) | Đã xác nhận từ knowledge |
| Q2 | So khớp gần đúng có cần phân biệt hoa/thường và chuẩn hóa Unicode (NFC/NFD) không? | Có — áp dụng cùng quy tắc chuẩn hóa đã dùng cho mọi so khớp chuỗi tiếng Việt khác trong dự án (`JDG-004`), tránh lặp lại đúng lớp lỗi đã từng xảy ra ở US-001 | Giả định hợp lý — suy từ `JDG-004`, chưa hỏi user trực tiếp câu này |
| Q3 | Khi so khớp gần đúng trả về nhiều hơn một danh mục cùng khớp (vd hai danh mục cùng chứa từ "ăn"), nên chọn danh mục nào? | Chưa có câu trả lời từ knowledge — cần `ssr-ba`/`ba-expert` xử lý khi viết spec, có thể ưu tiên khớp dài nhất hoặc rơi về "Chi tiêu khác" nếu mơ hồ | Cần user xác nhận |

## 5. Ghi Chú BA

- Đây là một **defect fix**, không phải tính năng mới — không đổi mục tiêu M1/M2 của Business Flow, chỉ sửa đúng hành vi F1 bước 1-2 đã có chủ đích (xem `docs/kb/ba/business-flow.md` mục 7 #12).
- Phạm vi sửa dự kiến nằm gọn trong `components/BudgetApp.tsx` (`inferredQuickCategory`, `addQuickExpense`) và tái dùng `fallbackCategoryService` đã có từ US-005 — nhiều khả năng không cần đổi schema, nhưng để `ssr-plan` xác nhận chính thức khi tới lượt.
- Q3 (nhiều danh mục cùng khớp gần đúng) nên được `ssr-ba` gom lại hỏi user cùng lúc với việc viết tiêu chí chấp nhận, tránh mở thêm một vòng dialog riêng.
