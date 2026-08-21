---
status: Active
feature: US-018
updated: 2026-08-13
spec: docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md
raw: docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-018", "Bảng theo dõi CV ứng tuyển"]
---

# US-018 — Bảng theo dõi CV ứng tuyển tại trang Roadmap

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Dylan không có nơi nào trong hệ thống để theo dõi tập trung các job đang quan tâm và trạng thái nộp CV (hồ sơ xin việc). Sau US-018, Dylan có một bảng ngay trên trang Roadmap để ghi lại từng job đang theo dõi (công ty, hạn nộp, kênh tuyển dụng, đường dẫn tin tuyển dụng, tiến độ ứng tuyển, ghi chú riêng), cập nhật tiến độ khi có phản hồi, không còn phải quản lý thủ công ở nơi khác.

Giá trị đo được: Dylan xem lại được toàn bộ danh sách job đang theo dõi cùng trạng thái mới nhất chỉ bằng một lượt mở trang Roadmap, kể cả sau khi đóng trình duyệt hoặc đổi máy (dữ liệu lưu bền vững).

## 2. Phạm Vi

Trong phạm vi:

- Bảng "Theo dõi CV ứng tuyển" trên trang Roadmap, ngay dưới khu vực "Lộ trình thực hiện" (`DEC-081`)
- Thêm, sửa ngay tại dòng (inline — `DEC-089`), xóa từng job: Công ty, Ngày hết hạn, Platform, Link, Trạng thái, Ghi chú
- Quản lý danh sách option Platform ngay trong ô chọn: thêm option mới, xóa option không còn dùng (chặn xóa nếu đang có job dùng — `BR-021`); khởi tạo sẵn 3 option mặc định "ITViec", "LinkedIn", "VietNamWork"
- Sắp xếp bảng theo cột bất kỳ bằng click vào tiêu đề cột (`DEC-083`)
- Lưu toàn bộ dữ liệu bền vững vào database (`DEC-080`)

Ngoài phạm vi:

- Cảnh báo/đổi màu tự động khi job sắp hoặc đã hết hạn
- Luồng chuyển trạng thái bắt buộc theo thứ tự — Dylan chọn tự do (`DEC-087`)
- Liên kết/đồng bộ dữ liệu thật với các nền tảng tuyển dụng bên ngoài — Platform chỉ là nhãn Dylan tự quản lý
- Xuất dữ liệu Job ứng tuyển ra file (requirement riêng nếu cần, tương tự `US-008`)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, Tạo, Sửa (inline), Xóa | Không được xóa option Platform đang được ít nhất một job sử dụng (`BR-021`); người dùng duy nhất, không đăng nhập/phân quyền (`DEC-004`) |

## 4. Luồng Nghiệp Vụ

1. Dylan mở trang Roadmap, thấy bảng "Theo dõi CV ứng tuyển" ngay dưới khu vực "Lộ trình thực hiện".
2. Dylan bấm "+ Thêm job": nhập Công ty, chọn Ngày hết hạn qua lịch chọn ngày, chọn Platform (hoặc thêm Platform mới ngay tại chỗ), nhập Link, giữ nguyên hoặc đổi Trạng thái (mặc định "Interested" — `DEC-084`), nhập Ghi chú, rồi lưu.
3. Dylan sửa ngay tại dòng (inline) các trường Công ty, Ngày hết hạn, Platform, Link, hoặc Ghi chú của một job đã tạo — bấm vào ô, sửa, xác nhận, không mở form riêng (`DEC-089`).
4. Dylan cập nhật Trạng thái bất kỳ lúc nào, chọn tự do trong 7 giá trị, không ràng buộc thứ tự (`DEC-087`).
5. Dylan xóa một job, xác nhận trong hộp thoại trước khi xóa thật.
6. Dylan quản lý danh sách Platform: thêm option mới, hoặc xóa option không còn dùng (chặn nếu đang dùng — `BR-021`).
7. Dylan click tiêu đề cột để sắp xếp bảng, click lại đảo chiều.

Ngoại lệ: bảng rỗng khi chưa có job nào; lưu lỗi hệ thống giữ nguyên dữ liệu trên form; thiếu trường bắt buộc (Công ty/Ngày hết hạn/Platform) hoặc Link sai định dạng thì chặn lưu và báo lỗi; xóa Platform đang dùng bị chặn (`BR-021`).

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-021` | Chặn xóa option Platform đang được ít nhất một job sử dụng | [`../business-rule/BR-021-chan-xoa-platform-dang-dung.md`](../business-rule/BR-021-chan-xoa-platform-dang-dung.md) | `docs/memory/decisions.md#dec-082` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Job ứng tuyển | [`../../data/entity/ENT-004-job-ung-tuyen.md`](../../data/entity/ENT-004-job-ung-tuyen.md) | Chưa có — entity mới, chờ `ssr-data` | Công ty, Ngày hết hạn, Link, Trạng thái, Ghi chú; tham chiếu Platform |
| Platform tuyển dụng | [`../../data/entity/ENT-005-platform-tuyen-dung.md`](../../data/entity/ENT-005-platform-tuyen-dung.md) | Chưa có — entity mới, chờ `ssr-data` | Danh sách option động, 3 giá trị mặc định |

Thuật ngữ mới phát sinh phải thêm vào `glossary.md`.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| Không có | — | US-018 độc lập với luồng F1-F4 của Business Flow "Hệ Thống Quản Lý Chi Tiêu" (`DEC-088`) |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` (`Ready for DEV`, 11 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-018-theo-doi-cv-ung-tuyen.md` |
| Raw | `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` |

## 9. Liên Kết Wiki

Không có Concept hoặc Workflow nào khớp ngữ nghĩa — US-018 là function đầu tiên của mảng "Roadmap/theo dõi việc làm" trong wiki.

Không gắn Epic: `docs/kb/ba/business-flow.md` chỉ phạm vi "Hệ Thống Quản Lý Chi Tiêu" (F1-F4) — Roadmap được chính Business Flow liệt kê là mục tách biệt (mục 1, M2). User đã xác nhận tường minh US-018 là tiện ích cá nhân tách biệt, không cần mở rộng Business Flow (`DEC-088`, `po-expert` xác nhận `Aligned` 2026-08-13).

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-018-theo-doi-cv-ung-tuyen.md`](../../delivery/pbi/US-018-theo-doi-cv-ung-tuyen.md) | Đã đồng bộ 2026-08-13 — 11 AC |
