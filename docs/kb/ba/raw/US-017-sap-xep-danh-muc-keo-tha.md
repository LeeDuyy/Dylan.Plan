---
status: Raw
feature: US-017
created: 2026-08-12
source: Chat
requester: Dylan (user)
priority: Trung bình
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-017"]
---

# Raw Requirement — Sắp xếp vị trí danh mục bằng kéo thả (Drag-and-drop row reordering)

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-017 |
| Slug | sap-xep-danh-muc-keo-tha |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-017-sap-xep-danh-muc-keo-tha/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Tôi muốn thao tác sắp xếp vị trí danh mục trên bảng bằng Drag-and-drop row reordering
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Vị trí bảng danh mục | Bảng danh mục ở trang Thu chi (`/budget`), cột: Danh mục, Loại, Ngân sách, Chi thực tế, Chênh lệch, Tỷ trọng, kèm nút xóa | `components/BudgetApp.tsx:944-1035` | Đã xác nhận |
| Nguồn dữ liệu dùng chung 3 nơi | `visibleCategories` là danh sách dùng chung cho bảng ngân sách, dropdown "Danh mục nhận diện" (khu nhập nhanh), và biểu đồ "Cơ cấu chi tiêu" | `components/BudgetApp.tsx:342-345,808-811,1088` | Đã xác nhận |
| Chưa có cột lưu thứ tự | Model `Category` trong Prisma hiện không có trường thứ tự (order/sortOrder); `findByMonth` không có `orderBy`, trả về đúng thứ tự tạo/rowid trong SQLite | `prisma/schema.prisma:27-43`, `server/budget/infrastructure/repositories/category-prisma-repository.ts:38-41` | Đã xác nhận |
| "Chi tiêu khác" luôn ở cuối bảng | `DEC-066` (US-014) đã chốt: danh mục `isFallback` luôn bị đẩy xuống cuối ở cả 3 nơi dùng chung danh sách, các danh mục còn lại giữ nguyên thứ tự tương đối, không sắp xếp lại theo tiêu chí nào khác | `docs/memory/decisions.md#dec-066` | Đã xác nhận |
| Danh mục "khóa" (`locked`) hiện tại | `locked=true` chỉ ẩn nút xóa (`Trash2`), không ảnh hưởng tới vị trí hiển thị hay khả năng sửa tên/loại/ngân sách | `components/BudgetApp.tsx:1013-1017` | Đã xác nhận |
| Chưa có thư viện kéo thả trong dự án | `package.json` chưa có `dnd-kit`/`react-beautiful-dnd`/thư viện sortable nào — lựa chọn thư viện thuộc phạm vi `ssr-plan` | `package.json` | Đã xác nhận |
| Danh mục thuộc về từng tháng | Mỗi `Category` gắn với một `monthId` cụ thể; khi tạo tháng mới bằng Clone (`create-month.ts`), các thuộc tính danh mục (tên, loại, ngân sách, `locked`) được sao chép sang tháng mới | `server/budget/application/use-cases/create-month.ts:49-57` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Thứ tự danh mục sau khi kéo thả có cần lưu vào database (giữ nguyên khi tải lại trang / mở lại tháng đó), hay chỉ đổi tạm trên giao diện trong phiên hiện tại? | User chọn: **Lưu vào database** — cần thêm một cột thứ tự (vd `order`/`sortOrder`) vào model `Category` và cập nhật khi kéo thả | Đã xác nhận từ knowledge |
| Q2 | Danh mục đã "khóa" (`locked=true`, ví dụ "Tiền nhà") có được phép kéo thả đổi vị trí không? | User chọn: **Cho phép kéo thả bình thường** — `locked` hiện chỉ chặn xóa, không liên quan tới vị trí hiển thị | Đã xác nhận từ knowledge |
| Q3 | Danh mục "Chi tiêu khác" (`isFallback`) hiện luôn bị đẩy xuống cuối bảng theo `DEC-066`/US-014, bất kể thứ tự các danh mục khác. Kéo thả có nên giữ nguyên luật này không? | User chọn: **Vẫn luôn cố định ở cuối, không kéo được** — nhất quán với `DEC-066` đã chốt | Đã xác nhận từ knowledge |
| Q4 | Bảng danh mục (`visibleCategories`) dùng chung cho 3 nơi: bảng ngân sách, dropdown "Danh mục nhận diện", biểu đồ "Cơ cấu chi tiêu". Thứ tự sau khi kéo thả trên bảng có cần đồng bộ sang cả 2 nơi kia không? | User chọn: **Đồng bộ cả 3 nơi** — nhất quán với cách US-014 đã xử lý cùng một danh sách nguồn dùng chung | Đã xác nhận từ knowledge |

## 5. Ghi Chú BA

- Cần thêm một cột thứ tự (vd `order`/`sortOrder` kiểu Int) vào model `Category` — đây là thay đổi schema, thuộc phạm vi `ssr-data` khi lập kế hoạch kỹ thuật; `ssr-raw` không quyết định tên hay kiểu cột cụ thể.
- Giả định hợp lý (chưa hỏi riêng user): khi tạo tháng mới bằng Clone từ tháng nguồn (`create-month.ts`), thứ tự danh mục nên được giữ theo đúng thứ tự của tháng nguồn, vì đây là một thuộc tính đi kèm mỗi danh mục được sao chép giống các thuộc tính khác (tên, loại, ngân sách, `locked`) — cần `ssr-ba`/`ssr-plan` xác nhận chính thức khi tới lượt.
- Thư viện kéo thả cụ thể (vd `dnd-kit`) là quyết định kỹ thuật, để `ssr-plan` chọn khi lập kế hoạch — không thuộc phạm vi raw.
- Không có `DEC` nào đang `Active` mâu thuẫn với 4 quyết định user vừa chốt (lưu DB, danh mục khóa vẫn kéo được, "Chi tiêu khác" cố định cuối, đồng bộ 3 nơi) — `DEC-066` được giữ nguyên, không bị đảo ngược, chỉ được mở rộng sang tương tác kéo thả mới.
