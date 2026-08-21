---
status: Active
feature: US-020
updated: 2026-08-14
spec: docs/features/US-020-lich-su-trang-thai-job/spec.md
raw: docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-020", "Lịch sử thay đổi trạng thái job ứng tuyển"]
---

# US-020 — Lịch sử thay đổi trạng thái job ứng tuyển

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Bảng "Theo dõi CV ứng tuyển" (`US-018`) hiện chỉ ghi trạng thái hiện tại của mỗi job, không có mốc thời gian nào cho biết Dylan đã nộp CV từ khi nào, và không tự phát hiện khi một job đã quá hạn nộp hoặc đã im lặng quá lâu sau khi nộp. Sau `US-020`, mỗi job giữ lại mốc "Ngày nộp hồ sơ" (thời điểm chuyển sang Waiting), và hệ thống tự động cập nhật Trạng thái cho hai tình huống thời gian cụ thể: quá hạn mà chưa nộp (→ Expired) và đã nộp nhưng im lặng quá lâu (→ No Response).

Giá trị đo được: Dylan mở bảng "Theo dõi CV ứng tuyển" thấy ngay job nào đã quá hạn (Expired) hoặc đã im lặng quá 7 ngày (No Response) mà không cần tự nhớ hay tính tay từng ngày hết hạn/ngày nộp hồ sơ.

## 2. Phạm Vi

Trong phạm vi:

- Ghi nhận mốc "Ngày nộp hồ sơ" khi một job chuyển từ Interested sang Waiting; xoá mốc khi chuyển ngược Waiting → Interested (`BR-027`)
- Thêm trạng thái mới "Expired" vào danh sách trạng thái (7 → 8 giá trị), Dylan vẫn chọn/đổi tay được như các trạng thái khác (`DEC-102`)
- Tự động chuyển "Expired" khi job đang "Interested" mà Ngày hết hạn đã qua (`BR-025`)
- Tự động chuyển "No Response" khi job đang "Waiting" quá 7 ngày kể từ "Ngày nộp hồ sơ" mà chưa đổi sang trạng thái khác (`BR-026`)
- Cả hai luật tự động đều tính lại ngay tại thời điểm dữ liệu bảng "Theo dõi CV ứng tuyển" được tải hoặc làm mới, không cần tiến trình chạy nền (`DEC-100`)

Ngoài phạm vi:

- Lưu log đầy đủ mọi lần đổi trạng thái dạng lịch sử nhiều dòng — chỉ lưu đúng một mốc "Ngày nộp hồ sơ" (`DEC-099`)
- Áp dụng luật "Expired" cho các trạng thái khác ngoài "Interested" khi quá hạn (`DEC-101`)
- Cơ chế chạy nền/lịch định kỳ độc lập với việc tải dữ liệu (`DEC-100`)
- Thay đổi các cột hoặc hành vi khác đã có của bảng "Theo dõi CV ứng tuyển" ngoài phạm vi trạng thái/mốc thời gian nêu trên (thuộc `US-018`)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem (mốc "Ngày nộp hồ sơ", trạng thái "Expired"), Sửa (Trạng thái, bao gồm tự chọn "Expired") | Không tự tạo/sửa mốc "Ngày nộp hồ sơ" bằng tay — chỉ hệ thống ghi/xoá theo `BR-027`; người dùng duy nhất, không đăng nhập/phân quyền (`DEC-004`) |

## 4. Luồng Nghiệp Vụ

1. Dylan mở hoặc làm mới bảng "Theo dõi CV ứng tuyển" trên trang Roadmap.
2. Hệ thống kiểm tra từng job: nếu đang "Interested" và Ngày hết hạn đã qua so với hôm nay → tự động chuyển Trạng thái thành "Expired" (`BR-025`).
3. Hệ thống kiểm tra từng job: nếu đang "Waiting" và đã quá 7 ngày kể từ "Ngày nộp hồ sơ" mà chưa đổi sang trạng thái khác → tự động chuyển Trạng thái thành "No Response" (`BR-026`).
4. Dylan đổi Trạng thái một job từ "Interested" sang "Waiting" → hệ thống ghi nhận thời điểm đó là "Ngày nộp hồ sơ" (`BR-027`).
5. Dylan đổi Trạng thái một job từ "Waiting" ngược về "Interested" → hệ thống xoá mốc "Ngày nộp hồ sơ" đã ghi trước đó (`BR-027`).
6. Dylan vẫn có thể tự chọn "Expired" trong danh sách Trạng thái bất kỳ lúc nào, giống các trạng thái khác (`DEC-102`).

Ngoại lệ: job chưa từng có mốc "Ngày nộp hồ sơ" (chưa từng chuyển đúng từ Interested sang Waiting) thì luật ở bước 3 không áp dụng; job đang ở trạng thái khác "Interested" dù đã quá hạn thì luật ở bước 2 không áp dụng; job vào Waiting từ trạng thái khác Interested (vd No Response → Waiting) không được ghi mốc mới, mốc cũ (nếu có) vẫn giữ nguyên (`DEC-103`); job đã "Expired" mà Ngày hết hạn được sửa sang tương lai không tự phục hồi trạng thái trước đó, Dylan tự đổi tay nếu cần (`DEC-104`).

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-025` | Quá hạn tự động chuyển "Expired", chỉ áp dụng khi đang "Interested" | [`../business-rule/BR-025-het-han-tu-dong-chuyen-expired.md`](../business-rule/BR-025-het-han-tu-dong-chuyen-expired.md) | `docs/memory/decisions.md#dec-101` | Đã xác nhận từ knowledge |
| `BR-026` | Waiting quá 7 ngày kể từ Ngày nộp hồ sơ tự động chuyển "No Response" | [`../business-rule/BR-026-waiting-qua-7-ngay-tu-dong-no-response.md`](../business-rule/BR-026-waiting-qua-7-ngay-tu-dong-no-response.md) | `docs/memory/decisions.md#dec-100` | Đã xác nhận từ knowledge |
| `BR-027` | Ghi nhận và xoá mốc "Ngày nộp hồ sơ" theo chiều Interested ↔ Waiting | [`../business-rule/BR-027-ngay-nop-ho-so-theo-chieu-waiting.md`](../business-rule/BR-027-ngay-nop-ho-so-theo-chieu-waiting.md) | `docs/memory/decisions.md#dec-099` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Job ứng tuyển | [`../../data/entity/ENT-004-job-ung-tuyen.md`](../../data/entity/ENT-004-job-ung-tuyen.md) | Chưa có — mở rộng model đã có từ `US-018`, chờ `ssr-data` khi `ssr-plan` của `US-020` tới lượt | Thêm mốc "Ngày nộp hồ sơ"; Trạng thái mở rộng từ 7 lên 8 giá trị (thêm "Expired") |

Thuật ngữ mới phát sinh phải thêm vào `glossary.md`.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-018`](US-018-theo-doi-cv-ung-tuyen.md) | Depends on | `US-020` mở rộng trực tiếp entity Job ứng tuyển và bảng "Theo dõi CV ứng tuyển" mà `US-018` đã tạo — không triển khai độc lập được |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-020-lich-su-trang-thai-job/spec.md` (`Ready for DEV`, 9 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-020-lich-su-trang-thai-job.md` |
| Raw | `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` |

## 9. Liên Kết Wiki

Không có Concept hoặc Workflow nào khớp ngữ nghĩa.

Không gắn Epic: cùng lý do đã áp dụng cho `US-018` (`DEC-088`) — `docs/kb/ba/business-flow.md` chỉ phạm vi "Hệ Thống Quản Lý Chi Tiêu" (F1-F4); trang Roadmap là mục tách biệt (mục 1, M2). `US-020` là phần mở rộng trực tiếp của `US-018` trên cùng entity và cùng trang, nên áp dụng cùng tiền lệ — `po-expert` xác nhận `Aligned` (2026-08-14): mở rộng cùng entity/cùng trang không mở thêm phạm vi mới so với những gì `DEC-088` đã chấp nhận, không cần một phiên `ssr-po mode=business-flow` mới.

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-020-lich-su-trang-thai-job.md`](../../delivery/pbi/US-020-lich-su-trang-thai-job.md) | Đã đồng bộ 2026-08-14 — 9 AC |
