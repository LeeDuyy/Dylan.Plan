---
status: Raw
feature: US-018
created: 2026-08-13
source: Chat
requester: Dylan
priority: Trung bình
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-018"]
---

# Raw Requirement — Bảng theo dõi CV ứng tuyển tại trang Roadmap

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-018 |
| Slug | theo-doi-cv-ung-tuyen |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
tại trang roadmap, tôi muốn bổ sung danh sách các job mà tôi đang quan tâm và trạng thái nộp CV. Trình bày dạng bảng với các cột sau: 

* Công ty (text)
* Ngày hết hạn (DD/MM/YYYY)
* Platform (Combobox): tạo sẵn các option "ITViec" "LinkedIn" "VietNamWork", user có thể thêm mới hoặc xoá các option linh động
* Link: Link tuyển dụng
* Trạng thái: Gồm các trạng thái: Interested/Waiting/No Response/Response/Appointment/Cancel/Fail
* Ghi chú(Text)
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Trang Roadmap | Tab `"roadmap"` hiển thị qua `RoadmapSections()`, gồm: section "Ưu tiên hiện tại", section "Lộ trình thực hiện" (timeline `roadmapPhases`), hai `TargetGrid` (Tuần đầu, KPI), `TimetableSection`, `EnglishInterviewSections` | `components/DylanPlanApp.tsx:299-377` | Đã xác nhận |
| Nội dung Roadmap hiện tại | Toàn bộ là dữ liệu tĩnh khai báo trong component (`roadmapPhases`, `priorities`, `firstWeekTargets`, `weeklyKpis`) — chưa có bảng dữ liệu động hay lưu trữ bền vững nào trên trang này trước US-018 | `components/DylanPlanApp.tsx:27-58` | Đã xác nhận |
| Tiền lệ lưu trữ bền vững | Dự án đã có US-001 (Lưu trữ chi tiêu bền vững) dùng Prisma + SQLite; user chọn áp dụng cùng mô hình lưu trữ cho US-018 | `docs/kb/ba/raw/US-001-luu-tru-chi-tieu-ben-vung.md` | Đã xác nhận |
| Vai trò người dùng | Dylan là chủ sở hữu duy nhất của hệ thống, không đăng nhập/phân quyền (DEC-004) — là người duy nhất thao tác bảng job này | `docs/memory/glossary.md` mục 2; `docs/memory/decisions.md#dec-004` | Đã xác nhận |
| Tiền lệ combobox cố định | US-016 chuẩn hóa "Loại chi tiêu" thành combobox cố định đúng 3 giá trị, KHÔNG cho thêm/xoá tự do — khác với Platform combobox của US-018 (cho phép thêm/xoá option linh động) | `docs/kb/ba/raw/US-016-loai-chi-tieu-combobox.md`; `docs/memory/glossary.md` dòng "Loại danh mục" | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Danh sách job này nên lưu trữ ra sao? | User chọn qua dialog: Lưu bền vững vào database (Prisma + SQLite), theo mô hình US-001 (`DEC-080`) | Đã xác nhận từ knowledge |
| Q2 | Bảng job nên đặt ở đâu trong trang Roadmap? | User chọn qua dialog: Thêm section mới ngay dưới "Lộ trình thực hiện" (timeline `roadmapPhases` hiện có) (`DEC-081`) | Đã xác nhận từ knowledge |
| Q3 | Khi Dylan xoá một option Platform đang được ít nhất một job dùng thì xử lý thế nào? | User chọn qua dialog: Chặn xoá, báo đang có job đang dùng option đó (`DEC-082`) | Đã xác nhận từ knowledge |
| Q4 | Bảng job mặc định sắp xếp theo tiêu chí nào? | User chọn qua dialog: Cho Dylan tự sắp xếp theo cột bất kỳ (click-to-sort trên từng cột) (`DEC-083`) | Đã xác nhận từ knowledge |
| Q5 | Ai được thêm/sửa/xoá job trong bảng này? | Tự trả lời: chỉ Dylan — hệ thống không có đăng nhập/phân quyền (DEC-004) | Đã xác nhận từ knowledge |
| Q6 | Trạng thái mặc định khi Dylan thêm một job mới là gì? | Chưa hỏi user; suy luận hợp lý: "Interested" — trạng thái đầu tiên trong danh sách 7 trạng thái user liệt kê, phản ánh bước quan tâm ban đầu trước khi nộp CV | Giả định hợp lý |

## 5. Ghi Chú BA

- Chưa rõ input control cho "Ngày hết hạn": date picker hay ô text theo mask `DD/MM/YYYY` — cần `ssr-ba` làm rõ khi viết tiêu chí chấp nhận.
- Chưa rõ có cần cảnh báo/đổi màu trực quan khi job sắp hết hạn hoặc đã hết hạn hay không — user chỉ yêu cầu cột dữ liệu, chưa yêu cầu hành vi cảnh báo.
- Chưa rõ có cần validate "Link" là URL hợp lệ trước khi lưu hay không.
- Danh sách 7 trạng thái (Interested/Waiting/No Response/Response/Appointment/Cancel/Fail) được chép nguyên văn theo yêu cầu; chưa rõ đây có phải luồng chuyển trạng thái tuần tự bắt buộc hay Dylan có thể chọn tự do bất kỳ trạng thái nào tại mọi thời điểm — cần `ssr-ba` làm rõ.
- Vì cần thêm model Prisma mới (bảng job + option Platform), theo Least Privilege của kit, thay đổi schema phải đi qua `ssr-data` (không phải `ssr-raw` hay `ssr-ba`) trước khi `ssr-dev` triển khai — tương tự luồng đã áp dụng cho US-001.
- Có thể tham khảo pattern xoá-có-xác-nhận đã dùng ở US-004 (Sửa/xoá từng giao dịch) khi thiết kế thao tác xoá một dòng job.
