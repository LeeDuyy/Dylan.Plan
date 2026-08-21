---
status: Raw
feature: US-016
created: 2026-08-11
source: PO Review
requester: Dylan
priority: Cao
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-016"]
---

# Raw Requirement — Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-016 |
| Slug | loai-chi-tieu-combobox |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-016-loai-chi-tieu-combobox/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-016-loai-chi-tieu-combobox.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
cập nhật lại loại chi tiêu là combobox gồm các option: cố định, linh hoạt, khác. User chọn 1 trong 3 opt này, không được typing kí tự
```

```text
gồm Cố định - Tích luỹ - Khác(thay cho linh hoạt)
```

```text
Linh s sẽ đổi thành khác, tạo req chính thức
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Màn hình liên quan | Cột "Loại" trong bảng danh mục, F2 — Lập và điều chỉnh ngân sách theo danh mục (`/budget`) | `components/BudgetApp.tsx:984-990` | Đã xác nhận |
| Hành vi hiện tại | "Loại" là phần tử input dạng text tự do, không ràng buộc giá trị | `components/BudgetApp.tsx:984-990` | Đã xác nhận |
| Dữ liệu thật đang có | `Category.type` có 4 giá trị: "Cố định" (22 dòng), "Linh hoạt" (43 dòng), "Tích lũy" (18 dòng), "Linh s" (1 dòng — lỗi gõ dở dang) | Query trực tiếp `prisma/dev.db`, bảng `Category`, `GROUP BY type` (2026-08-11) | Đã xác nhận |
| Quyết định giá trị combobox | 3 giá trị cố định: "Cố định", "Tích lũy", "Khác" — "Khác" thay thế hoàn toàn "Linh hoạt" cũ | `docs/memory/decisions.md#dec-073` | Đã xác nhận |
| Quy tắc migrate dữ liệu cũ | "Cố định" → giữ nguyên; "Tích lũy" → giữ nguyên; "Linh hoạt" → "Khác"; "Linh s" (lỗi gõ dở dang) → "Khác" | `docs/memory/decisions.md#dec-073`, xác nhận trực tiếp của user (2026-08-11: "Linh s sẽ đổi thành khác") | Đã xác nhận |
| Nơi khác đang hard-code "Linh hoạt" cần đồng bộ | Seed 4 danh mục mặc định (`food`, `transport`, `coffee`, `health`); nút "Thêm danh mục"; danh mục "Chi tiêu khác" tự sinh (theo `DEC-056`, chỉ đổi giá trị `type`, không đổi các quyết định khác của `DEC-056`) | `lib/budget-defaults.ts:18-21`, `components/BudgetApp.tsx:416`, `server/budget/domain/services/fallback-category-service.ts:9` | Đã xác nhận |
| Insight bị ảnh hưởng gián tiếp | Thẻ "Chi linh hoạt" (F4) so khớp chữ "linh" trên `type` — sẽ không còn khớp giá trị nào sau khi migrate; thẻ "Tiết kiệm / tích lũy" KHÔNG bị ảnh hưởng vì so khớp cả `name` lẫn `type`, danh mục mặc định "Tiết kiệm / đầu tư" vẫn khớp qua tên | `components/BudgetApp.tsx:330-335,1061-1062` | Đã xác nhận (đọc trực tiếp từ code) |
| Nguồn đề xuất | PO review PO-03, khoảng trống #14 của Business Flow, đề xuất #14 của Backlog | `docs/po/review-2026-08-11-loai-chi-tieu-combobox.md`, `docs/kb/ba/business-flow.md#7-khoảng-trống-và-ưu-tiên`, `docs/kb/ba/backlog.md` | Đã xác nhận |
| Luồng nghiệp vụ liên quan | F2 — Lập và điều chỉnh ngân sách theo danh mục | `docs/kb/ba/business-flow.md#3-bản-đồ-luồng-nghiệp-vụ` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Cách tính thẻ insight "Chi khác" (trước đây tên "Chi linh hoạt") nên đổi thế nào sau khi không còn giá trị "Linh hoạt"? | So khớp `type === "Khác"` thay cho regex chữ "linh" — suy ra trực tiếp từ `DEC-073` ("Khác" thay thế "Linh hoạt") | Giả định hợp lý — `ssr-ba` xác nhận lại khi viết spec |
| Q2 | Thẻ insight "Chi linh hoạt" có nên đổi tên hiển thị cho khớp thuật ngữ mới, hay giữ nguyên tên cũ? | Có — đổi tên thành "Chi khác" | Đã xác nhận từ user (2026-08-11, trực tiếp: "Đổi thành Chi khác") |
| Q3 | Có cần ràng buộc ở tầng schema (Prisma enum hoặc CHECK constraint) để chặn giá trị ngoài 3 lựa chọn, hay chỉ ràng buộc ở UI (combobox không cho gõ)? | Không tự trả lời được — là quyết định kỹ thuật, thuộc phạm vi `ssr-plan`/`ssr-data` khi khảo sát, không phải quyết định sản phẩm cấp raw | Giả định hợp lý — để `ssr-plan` đề xuất khi tới lượt, không chặn raw hay spec |

## 5. Ghi Chú BA

- Đây là defect (dữ liệu rác "Linh s" đã có thật) + opportunity (chuẩn hóa để chặn từ gốc), không phải nghiệp vụ mới — không đổi luồng nghiệp vụ F2, chỉ đổi cách nhập liệu và tập giá trị hợp lệ của một trường.
- Khi viết spec, `ssr-ba` cần liệt kê rõ 3 tiêu chí chấp nhận tách biệt: (1) hành vi combobox trên UI (không cho gõ, chỉ chọn), (2) quy tắc migrate dữ liệu cũ (bảng ánh xạ 4 giá trị cũ → 3 giá trị mới, đã có sẵn ở mục 3), (3) đồng bộ 3 nơi hard-code "Linh hoạt" liệt kê ở mục 3 để tránh tái phát sinh giá trị không hợp lệ.
- Không phát hiện mâu thuẫn với `DEC` nào khác đã có trong `docs/memory/decisions.md`, ngoại trừ việc đổi giá trị mặc định của "Chi tiêu khác" (trước đây "Linh hoạt" theo `DEC-056`) — đây không phải đảo `DEC-056`, chỉ là giá trị `type` cụ thể đổi theo `DEC-073`; các quyết định khác của `DEC-056` (khóa, tự sinh, ẩn khi hết giao dịch...) giữ nguyên.
- Q2 (tên nhãn insight) ban đầu user bỏ qua dialog `AskUserQuestion` 2 lần trong phiên (một lần ở `ssr-po mode=review`, một lần ở `ssr-raw`); sau khi được giải thích lại bằng văn xuôi (ví dụ cụ thể cách tính và hệ quả), user xác nhận trực tiếp: đổi tên thẻ "Chi linh hoạt" thành "Chi khác". Không còn câu hỏi mở nào chặn việc viết spec.
