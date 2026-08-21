---
status: Raw
feature: US-014
created: 2026-08-10
source: Chat
requester: Dylan (user)
priority: Trung bình
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-014"]
---

# Raw Requirement — Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-014 |
| Slug | chi-tieu-khac-cuoi-bang |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-014-chi-tieu-khac-cuoi-bang/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
cập nhật "chi tiêu khác" luôn nằm cuối bảng danh mục
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Vị trí bảng danh mục | Bảng danh mục ở trang Thu chi (`/budget`, từ US-002), hiển thị danh sách `visibleCategories` — dùng chung cho cả bảng ngân sách, dropdown "Danh mục nhận diện" ở nhập nhanh, và biểu đồ "Cơ cấu chi tiêu" | `components/BudgetApp.tsx` (biến `visibleCategories`, dòng ~334, dùng lại ở 3 nơi) | Đã xác nhận |
| Thứ tự hiển thị hiện tại | Không có sắp xếp tường minh — hiển thị đúng thứ tự trả về từ truy vấn `findByMonth` (không có `orderBy`), tức theo thứ tự tạo/rowid trong SQLite | `server/budget/infrastructure/repositories/category-prisma-repository.ts` (`findByMonth`) | Đã xác nhận |
| Vì sao "Chi tiêu khác" có thể không ở cuối hiện tại | Danh mục "Chi tiêu khác" được tạo lười biếng (chỉ sinh khi lần đầu cần, giữa vòng đời tháng — `DEC-026`); nếu Dylan bấm "Thêm danh mục" sau thời điểm đó, danh mục mới sẽ được tạo sau và xuất hiện sau "Chi tiêu khác" trong bảng — vị trí hiện tại không được đảm bảo luôn ở cuối | `components/BudgetApp.tsx` (hàm `addCategory`), `docs/memory/decisions.md#dec-026` | Đã xác nhận |
| "Chi tiêu khác" chỉ có tối đa 1 bản ghi mỗi tháng | `findFallbackByMonth` dùng `findFirst`, chỉ tạo một lần khi cần | `server/budget/infrastructure/repositories/category-prisma-repository.ts` | Đã xác nhận |
| "Chi tiêu khác" chỉ hiển thị khi đang có giao dịch | Ẩn khỏi giao diện khi không còn giao dịch nào gán vào nó (`DEC-029`), lọc ngay trong `visibleCategories` (`!(item.isFallback && item.actual === 0)`) | `components/BudgetApp.tsx` (dòng ~334-335), `docs/memory/decisions.md#dec-029` | Đã xác nhận |
| "Chi tiêu khác" là chỉ đọc | Không có ô nhập tên/loại/ngân sách, không nút xóa — khác các danh mục khóa khác (vd "Tiền nhà") vẫn cho sửa 3 trường này | `components/BudgetApp.tsx` (chú thích tại nhánh `item.isFallback` trong bảng danh mục) | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | "Luôn nằm cuối" áp dụng cho những nơi hiển thị nào? | `visibleCategories` là nguồn dữ liệu dùng chung cho cả bảng ngân sách, dropdown "Danh mục nhận diện", và biểu đồ "Cơ cấu chi tiêu" — sắp xếp lại ngay tại nguồn dùng chung này để nhất quán ở cả 3 nơi, không cần hỏi riêng từng nơi vì không có lý do nghiệp vụ nào để 3 nơi hiển thị thứ tự khác nhau | Giả định hợp lý — suy từ việc `visibleCategories` là danh sách duy nhất được 3 UI dùng lại, tách riêng thứ tự cho từng nơi sẽ tạo bất nhất không có căn cứ |
| Q2 | Các danh mục còn lại (không phải "Chi tiêu khác") có cần sắp xếp lại theo quy tắc nào khác không? | Không — yêu cầu chỉ nói về vị trí của "Chi tiêu khác", không đề cập sắp xếp danh mục khác; giữ nguyên thứ tự tương đối hiện có giữa các danh mục còn lại, chỉ đưa riêng "Chi tiêu khác" (nếu đang hiển thị) xuống cuối | Giả định hợp lý — suy trực tiếp từ phạm vi câu chữ của yêu cầu, không mở rộng thêm |

## 5. Ghi Chú BA

- Đây là một thay đổi nhỏ, thuần hiển thị (sắp xếp lại thứ tự phần tử trong một mảng đã có sẵn ở client) — nhiều khả năng không cần đổi schema, không cần truy vấn mới, để `ssr-plan` xác nhận chính thức khi tới lượt.
- Phạm vi sửa dự kiến nằm gọn trong `components/BudgetApp.tsx`, tại nơi tính `visibleCategories` (dòng ~334-335) — thêm bước sắp xếp đưa phần tử `isFallback` (nếu có) xuống cuối mảng, giữ nguyên thứ tự các phần tử còn lại.
- Không có DEC nào đang Active mâu thuẫn với yêu cầu này — các DEC liên quan tới "Chi tiêu khác" (`DEC-026`, `DEC-027`, `DEC-029`, `DEC-030`) đều nói về thời điểm sinh/ẩn-hiện, không nói về thứ tự hiển thị, nên không xung đột.
