---
status: Active
updated: 2026-08-28
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-031"]
---

# BR-031 — Tự điền thông tin job từ link tin tuyển dụng

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi Dylan nhập xong đường dẫn vào ô Link của một dòng job trong bảng "Theo dõi CV ứng tuyển", rời khỏi ô đó, **và giá trị vừa nhập khác với giá trị đã đọc lần gần nhất cho dòng job đó**, hệ thống tự truy cập đường dẫn một lần và điền các trường Công ty, Platform và Ngày hết hạn của dòng job — **chỉ điền vào ô đang để trống**, không ghi đè giá trị Dylan đã tự nhập. Đọc được trường nào điền trường đó; trường không lấy được thì hiện thông báo nhẹ "chưa lấy được [tên trường] — mời nhập tay" và **không chặn** việc lưu job.

Điều kiện chi tiết:

- Đọc chạy ngay khi Dylan rời ô Link (`DEC-115`); áp dụng cả lúc thêm job mới và lúc sửa Link của job đã có (`DEC-120`).
- Chỉ kích hoạt khi giá trị ô Link thực sự thay đổi so với lần đọc gần nhất; bấm vào ô rồi rời đi mà không sửa gì thì không đọc lại, không hiện "Đang lấy thông tin..." (`DEC-125`).
- Trong lúc đọc hiện chỉ báo "Đang lấy thông tin...". Thời gian chờ khoảng 10 giây, thử 1 lần; quá hạn hoặc lỗi thì coi như đọc thất bại (`DEC-121`).
- Chỉ điền vào ô trống — ô Dylan đã có giá trị thì giữ nguyên kể cả khi đọc ra giá trị khác (`DEC-116`).
- Ngày hết hạn chỉ được điền khi trang ghi một ngày **đầy đủ ngày-tháng-năm**, đọc được chắc chắn (vd "30/09/2026", "2026-09-30", "Hạn nộp: 30 tháng 9, 2026"). Kiểu đếm ngược ("còn N ngày"), "tuyển gấp", chỉ có tháng/năm, hoặc không có mục hạn nộp thì để trống và báo nhẹ (`DEC-117`, `DEC-124`). Ngày đầy đủ nhưng đã ở quá khứ vẫn được điền (`DEC-126`).
- Platform được suy từ tên miền của link theo [`BR-032`](BR-032-suy-platform-tu-ten-mien.md).
- Hệ thống thử đọc mọi đường dẫn, kể cả các nền tảng thường chặn truy cập tự động như LinkedIn; đọc thất bại thì rơi về nhập tay, không báo lỗi chặn (`DEC-112`, `DEC-114`).
- Máy chủ của ứng dụng tự truy cập và đọc phần công khai của trang; không gửi đường dẫn hay nội dung tới dịch vụ bên thứ ba (`DEC-122`).

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-021`](../feature/US-021-tu-dien-thong-tin-job-link.md) | Toàn bộ luồng nghiệp vụ — thao tác nhập/sửa Link ở dòng job của bảng "Theo dõi CV ứng tuyển" |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không đọc link | Ô Link không bắt đầu bằng `http://` hoặc `https://` — validate sẵn có của `US-018` chặn lưu trước khi tới bước đọc | `US-021` |
| Không đọc lại | Giá trị ô Link không thay đổi so với lần đọc gần nhất (`DEC-125`) | `US-021` |
| Không điền trường nào từ nội dung trang | Đọc đường dẫn thất bại hoàn toàn (quá 10 giây, trang chặn, không đọc được) — vẫn suy Platform từ tên miền theo `BR-032`, các trường khác báo nhẹ | `US-021` |
| Giữ nguyên ô | Ô Công ty / Platform / Ngày hết hạn đã có giá trị Dylan tự nhập | `US-021` |
| Không tự điền Ngày hết hạn | Trang không ghi ngày ở dạng đầy đủ ngày-tháng-năm rõ ràng | `US-021` |
| Điền Ngày hết hạn đã ở quá khứ | Trang ghi một ngày đầy đủ nhưng đã qua — vẫn điền; job "Interested" có thể bị `BR-025` tự chuyển "Expired" (`DEC-126`) | `US-021`, `US-020` (qua `BR-025`) |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Yêu cầu gốc của user | `docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md` mục 2 | Đã xác nhận từ knowledge |
| Quyết định chốt với user | `docs/memory/decisions.md#dec-112`, `#dec-114`, `#dec-115`, `#dec-116`, `#dec-117`, `#dec-120`, `#dec-121`, `#dec-124`, `#dec-125`, `#dec-126` | Đã xác nhận từ knowledge |
| Spec đã Ready for DEV | `docs/features/US-021-tu-dien-thong-tin-job-link/spec.md` mục 6, 7 | Đã xác nhận từ knowledge |
| Hiện trạng validate Link | `components/JobTrackerBoard.tsx:132-136` | Đã xác nhận từ knowledge |
