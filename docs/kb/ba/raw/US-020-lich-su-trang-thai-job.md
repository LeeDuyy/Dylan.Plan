---
status: Raw
feature: US-020
created: 2026-08-14
source: Chat
requester: Dylan
priority: Trung bình
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-020"]
---

# Raw Requirement — Lịch sử thay đổi trạng thái job ứng tuyển

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-020 |
| Slug | lich-su-trang-thai-job |
| Workflow mong muốn | Raw → BA |
| Điểm dừng | Chưa xác định |
| Cần report | Chưa xác định |
| Spec dự kiến | `docs/features/US-020-lich-su-trang-thai-job/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
Tôi muốn lưu lịch sử tháy đổi trạng thái để có thể xem thời gian
Ví dụ:
Nếu như đã qua ngày hết hạn mà job vẫn ở trạng thái Interested -> Cập nhật trạng thái job là Expired(sinh thêm 1 trạng thái mới)
interested -> Waiting = Ghi nhận ngày nộp hồ sơ là DD/MM/YYYY HH:MM. Nếu chuyển ngược từ Waiting sang intereted thì xoá dòng ngày ghi nhận đó
Kể từ chuyển sang Waiting, nếu trong vòng 7 ngày user không thay đổi trạng thái khác -> hệ thống tự cập nhật sang trạng thái No ressponse
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Trạng thái job hiện có | 7 giá trị cố định: Interested, Waiting, No Response, Response, Appointment, Cancel, Fail | `server/job-tracker/domain/entities/job-application.ts:1-18` | Đã xác nhận |
| Model dữ liệu JobApplication | `status` lưu dạng `String` (SQLite không có enum gốc), `deadline` là `DateTime`; chưa có cột lưu mốc thời gian chuyển trạng thái | `prisma/schema.prisma:81-96` | Đã xác nhận |
| Cách tải dữ liệu bảng CV | `getJobTrackerSnapshot()` chạy mỗi khi trang Roadmap tải hoặc bảng được làm mới (`refreshSnapshot`); app không có tiến trình chạy nền | `server/job-tracker/actions.ts:42-44`; `components/JobTrackerBoard.tsx` (hàm `refreshSnapshot`) | Đã xác nhận |
| Tiền lệ "không cơ chế chạy nền" trong dự án | US-019 đã chốt nguyên tắc tương tự: không có tiến trình chạy nền/lịch định kỳ, mọi việc "tự động theo thời gian" chỉ tính khi có thao tác/tải dữ liệu | `docs/memory/decisions.md#dec-097` | Đã xác nhận |
| Feature gốc | US-018 đã định nghĩa bảng "Theo dõi CV ứng tuyển" (cột Công ty/Ngày hết hạn/Platform/Link/Trạng thái/Ghi chú, 7 trạng thái); US-020 mở rộng nghiệp vụ trạng thái, không đổi các cột đã có | `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Lịch sử trạng thái nên lưu và xem được ở mức nào? | User chọn qua dialog: chỉ lưu riêng mốc "ngày nộp hồ sơ" (thời điểm chuyển Interested → Waiting), không lưu log đầy đủ mọi lần đổi trạng thái (`DEC-099`) | Đã xác nhận từ knowledge |
| Q2 | Cơ chế tự động chuyển Expired/No Response nên chạy khi nào, khi app không có tiến trình chạy nền? | User chọn qua dialog: kiểm tra và cập nhật ngay mỗi khi dữ liệu bảng CV được tải hoặc làm mới (`DEC-100`) | Đã xác nhận từ knowledge |
| Q3 | "Expired" áp dụng cho những trạng thái nguồn nào khi quá hạn? | User chọn qua dialog: chỉ áp dụng khi job đang ở "Interested" (`DEC-101`) | Đã xác nhận từ knowledge |
| Q4 | "Expired" có xuất hiện trong danh sách trạng thái để Dylan tự chọn tay không? | User chọn qua dialog: có, thêm vào danh sách thành 8 trạng thái, Dylan vẫn chọn/đổi tay được như bình thường (`DEC-102`) | Đã xác nhận từ knowledge |
| Q5 | Khi job tự động chuyển "No Response" (do quá 7 ngày ở Waiting), mốc "ngày nộp hồ sơ" đã ghi trước đó có bị xoá không? | Chưa hỏi user; suy luận hợp lý: KHÔNG xoá — raw chỉ nêu rõ xoá mốc khi "chuyển ngược từ Waiting sang Interested", không nhắc tới No Response | Giả định hợp lý |
| Q6 | Nếu Dylan tự tay chuyển một job từ trạng thái khác Interested sang Waiting (vd No Response → Waiting) thì mốc "ngày nộp hồ sơ" có được ghi/ghi đè lại không? | Chưa hỏi user; suy luận hợp lý: CÓ ghi/ghi đè mốc mới — "ngày nộp hồ sơ" gắn với thời điểm job bắt đầu chờ phản hồi ở Waiting, và cũng là mốc bắt buộc để luật "quá 7 ngày → No Response" hoạt động đúng cho mọi lần vào Waiting, không chỉ riêng lần đầu từ Interested | Giả định hợp lý |
| Q7 | Job đã "Expired" mà Dylan sửa "Ngày hết hạn" sang một ngày tương lai — hệ thống có tự phục hồi trạng thái trước đó không? | Chưa hỏi user; suy luận hợp lý: KHÔNG tự phục hồi — theo `DEC-102`, Expired là trạng thái chọn tay được như các trạng thái khác, Dylan tự đổi lại nếu cần; hệ thống không có cơ chế "hoàn tác tự động" nào khác | Giả định hợp lý |

## 5. Ghi Chú BA

- Q5–Q7 chỉ là suy luận hợp lý (`Giả định hợp lý`), chưa qua `AskUserQuestion` trực tiếp với user — `ssr-ba` nên xác nhận lại khi viết tiêu chí chấp nhận nếu thấy ảnh hưởng lớn tới luồng nghiệp vụ, đặc biệt Q6 (mốc "ngày nộp hồ sơ" khi vào Waiting từ trạng thái khác Interested).
- Vì cần thêm cột dữ liệu mới trên `JobApplication` (mốc "ngày nộp hồ sơ") và mở rộng danh sách trạng thái từ 7 lên 8 giá trị, thay đổi phải đi qua `ssr-data` trước khi `ssr-dev` triển khai.
- `DEC-100` xác định điểm nối kỹ thuật là use-case `getJobTrackerSnapshot` — `ssr-plan` cần khảo sát cụ thể nơi chèn logic tự động cập nhật (Expired / No Response) trước khi trả dữ liệu, tuân theo Light DDD (R13): logic nghiệp vụ nên nằm ở `domain/services`, không viết trực tiếp trong use-case.
- Định dạng "DD/MM/YYYY HH:MM" trong ví dụ raw là định dạng hiển thị; `ssr-ba` cần làm rõ có cần hiển thị giờ:phút hay chỉ cần ngày (khớp định dạng `DD/MM/YYYY` đã dùng cho "Ngày hết hạn" ở US-018) khi viết tiêu chí chấp nhận.
- Chưa rõ nhãn hiển thị chính xác cho mốc mới trên giao diện (vd cột riêng "Ngày nộp hồ sơ", hay chỉ hiện khi hover/mở chi tiết dòng) — cần `ssr-ba` thiết kế Screen Element cụ thể.
- Có thể tham khảo cách US-006/US-019 xử lý "tự động theo thời gian không cần chạy nền" (`DEC-097`, `BR` liên quan) khi thiết kế luật nghiệp vụ domain service cho US-020.
