---
status: Active
feature: US-021
updated: 2026-08-28
spec: docs/features/US-021-tu-dien-thong-tin-job-link/spec.md
raw: docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-021", "Tự điền thông tin job từ link"]
---

# US-021 — Tự điền thông tin job từ link tin tuyển dụng

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Khi thêm một job vào bảng "Theo dõi CV ứng tuyển" (`US-018`) trên trang Roadmap, Dylan phải gõ tay toàn bộ Công ty, Ngày hết hạn, Platform, Link — kể cả khi phần lớn thông tin đó đã có sẵn trong tin tuyển dụng mà Link trỏ tới. Sau `US-021`, khi Dylan dán link tin tuyển dụng vào ô Link của một dòng job và rời khỏi ô, hệ thống tự truy cập link và điền Công ty, Platform (suy từ tên miền), và Ngày hết hạn (khi trang ghi một ngày đầy đủ) vào các ô đang trống của dòng đó.

Giá trị đo được: với một link tin tuyển dụng từ kênh cho xem công khai (vd ITViec, VietNamWork), sau khi Dylan dán Link và rời ô, ba ô Công ty / Platform / Ngày hết hạn hiển thị giá trị mà không cần Dylan gõ thêm chữ nào vào ba ô đó.

## 2. Phạm Vi

Trong phạm vi:

- Khi Dylan rời ô Link của một dòng job (thêm mới hoặc sửa) và **giá trị ô Link vừa thay đổi so với lần đọc gần nhất**, hệ thống tự truy cập đường dẫn một lần và điền Công ty, Platform, Ngày hết hạn vào các ô đang trống ([`BR-031`](../business-rule/BR-031-tu-dien-job-tu-link.md), `DEC-125`)
- Suy Platform từ tên miền của link: tên miền *chứa* tên một kênh đang có (không phân biệt hoa/thường) thì tự chọn kênh đó; không khớp kênh nào, hoặc khớp nhiều kênh cùng lúc, thì để trống ([`BR-032`](../business-rule/BR-032-suy-platform-tu-ten-mien.md), `DEC-124`)
- Chỉ điền Ngày hết hạn khi trang ghi một ngày đầy đủ ngày-tháng-năm, đọc được chắc chắn; kiểu đếm ngược ("còn N ngày"), "tuyển gấp", chỉ có tháng/năm, hoặc không có mục hạn nộp thì để trống + báo nhẹ (`DEC-117`, `DEC-124`). Ngày đầy đủ nhưng đã ở quá khứ vẫn được điền (`DEC-126`)
- Thử đọc mọi đường dẫn, kể cả LinkedIn (`DEC-112`)
- Chỉ báo "Đang lấy thông tin..." trong lúc đọc; thời gian chờ khoảng 10 giây, thử 1 lần (`DEC-121`)
- Với mỗi ô không điền được, hiện một thông báo nhẹ, không chặn việc lưu job (`DEC-114`)
- Máy chủ của ứng dụng tự đọc trang; không gửi đường dẫn hay nội dung tới dịch vụ bên thứ ba (`DEC-122`)

Ngoài phạm vi:

- Thêm cột mới cho bảng (vd "Vị trí ứng tuyển") — chỉ điền các cột đã có (`DEC-113`)
- Đổi cấu trúc lưu trữ Job ứng tuyển hoặc Platform tuyển dụng (`DEC-113`)
- Ghi đè giá trị Dylan đã tự nhập (`DEC-116`)
- Tự tạo kênh Platform mới từ tên miền, hoặc dùng nhãn "Khác" (`DEC-118`)
- Viết lại đường dẫn Dylan đã nhập vào ô Link
- Đăng nhập vào kênh tuyển dụng, lấy dữ liệu sau lớp đăng nhập
- Gửi đường dẫn/nội dung tới một dịch vụ trích xuất bên ngoài (`DEC-121`)
- Ghi lại/hiển thị dấu vết "ô này được điền tự động từ link" (`DEC-122`)
- Đưa mảng theo dõi tuyển dụng vào Business Flow "Hệ Thống Quản Lý Chi Tiêu" (`DEC-111`)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, Sửa (các ô được tự điền), giữ hoặc xóa giá trị hệ thống vừa điền | Người dùng duy nhất, không đăng nhập/phân quyền (`DEC-004`). Không có quyền nào mới so với `US-018` — tính năng chỉ điền hộ các ô Dylan vốn đã tự sửa được |

## 4. Luồng Nghiệp Vụ

1. Dylan bấm "+ Thêm job" (hoặc bấm vào ô Link của một job đã có để sửa), dán đường dẫn tin tuyển dụng vào ô Link rồi rời khỏi ô.
2. Nếu giá trị ô Link vừa thay đổi so với lần đọc gần nhất, dòng job hiện "Đang lấy thông tin..." và hệ thống tự truy cập đường dẫn một lần. Nếu Dylan chỉ bấm vào ô rồi rời đi mà không sửa gì, hệ thống bỏ qua bước này (`DEC-125`).
3. Hệ thống suy Platform từ tên miền: tên miền chứa tên một kênh đang có thì tự chọn kênh đó (nếu ô Platform đang trống); không khớp kênh nào hoặc khớp nhiều kênh thì để trống ([`BR-032`](../business-rule/BR-032-suy-platform-tu-ten-mien.md)).
4. Hệ thống đọc phần thông tin công khai của trang: điền Công ty nếu lấy được; điền Ngày hết hạn nếu trang ghi một ngày đầy đủ ngày-tháng-năm đọc được chắc chắn. Chỉ điền vào ô đang trống ([`BR-031`](../business-rule/BR-031-tu-dien-job-tu-link.md)).
5. Với mỗi trường không lấy được, hệ thống hiện một thông báo nhẹ "chưa lấy được [tên trường] — mời nhập tay".
6. Dylan xem lại các ô vừa được điền, sửa nếu cần, bổ sung các ô còn trống, chọn Trạng thái, rồi lưu job như quy trình `US-018`.

Ngoại lệ:

- Đường dẫn Link không hợp lệ (thiếu `http://`/`https://`) → validate sẵn có của `US-018` chặn lưu, chưa tới bước đọc.
- Đọc đường dẫn thất bại (quá 10 giây, trang chặn) → không điền Công ty/Ngày hết hạn, **vẫn suy Platform từ tên miền** (bước này không cần mở trang), báo nhẹ; Dylan nhập tay các trường còn lại và vẫn lưu được job.
- Trang không ghi ngày hết hạn đầy đủ → để trống ô Ngày hết hạn, báo nhẹ.
- Trang ghi một ngày hết hạn đầy đủ nhưng đã ở quá khứ → vẫn điền; job "Interested" có thể bị `BR-025` tự chuyển "Expired" ở lần bảng tải lại kế tiếp, Dylan tự đổi lại nếu vẫn muốn theo dõi (`DEC-126`).
- Ô Công ty/Platform/Ngày hết hạn đã có giá trị Dylan nhập → giữ nguyên, không ghi đè (`DEC-116`).

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-031` | Tự điền Công ty/Platform/Ngày hết hạn từ link khi giá trị ô Link đổi; chỉ điền ô trống; không chặn khi thiếu; thời gian chờ ~10 giây | [`../business-rule/BR-031-tu-dien-job-tu-link.md`](../business-rule/BR-031-tu-dien-job-tu-link.md) | `docs/memory/decisions.md#dec-114`, `#dec-115`, `#dec-116`, `#dec-117`, `#dec-120`, `#dec-121`, `#dec-124`, `#dec-125`, `#dec-126` | Đã xác nhận từ knowledge |
| `BR-032` | Suy Platform từ tên miền link — tên miền chứa tên kênh (không phân biệt hoa/thường); không khớp hoặc khớp nhiều kênh thì để trống + báo nhẹ; không tự tạo kênh | [`../business-rule/BR-032-suy-platform-tu-ten-mien.md`](../business-rule/BR-032-suy-platform-tu-ten-mien.md) | `docs/memory/decisions.md#dec-113`, `#dec-118`, `#dec-124` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Job ứng tuyển | [`../../data/entity/ENT-004-job-ung-tuyen.md`](../../data/entity/ENT-004-job-ung-tuyen.md) | `JobApplication` (đã có từ `US-018`; `deadline` không bắt buộc từ `DEC-119`) | Không thêm/sửa trường nào — chỉ điền sẵn giá trị cho Công ty, Platform (tham chiếu), Ngày hết hạn (`DEC-113`) |
| Platform tuyển dụng | [`../../data/entity/ENT-005-platform-tuyen-dung.md`](../../data/entity/ENT-005-platform-tuyen-dung.md) | `JobPlatform` (đã có từ `US-018`) | Đọc danh sách kênh để so khớp tên miền; không tạo kênh mới tự động |

Thuật ngữ mới phát sinh phải thêm vào `glossary.md`.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-018`](US-018-theo-doi-cv-ung-tuyen.md) | Depends on | `US-021` mở rộng trực tiếp bảng "Theo dõi CV ứng tuyển" và các ô job mà `US-018` đã tạo. Giữ nguyên validate Link, ràng buộc trường bắt buộc (Công ty/Platform/Link), và cách sửa inline của `US-018` |
| [`US-020`](US-020-lich-su-trang-thai-job.md) | Impacts | Ngày hết hạn được tự điền là đầu vào của luật `BR-025` (`US-020`) — quá hạn ở "Interested" thì tự chuyển "Expired". `DEC-117`/`DEC-124` (chỉ điền ngày đầy đủ) và `DEC-119` (ngày hết hạn không bắt buộc) giảm rủi ro đổi trạng thái nhầm; ngày quá khứ vẫn điền là có chủ đích (`DEC-126`) |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-021-tu-dien-thong-tin-job-link/spec.md` (`Ready for DEV`, 8 AC) |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-021-tu-dien-thong-tin-job-link.md` |
| Raw | `docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md` |
| PO review | `docs/po/review-2026-08-27-tu-dien-thong-tin-job-tu-link.md` |

## 9. Liên Kết Wiki

Không có Concept hoặc Workflow nào khớp ngữ nghĩa — `US-021` là function thứ ba của mảng "Roadmap/theo dõi việc làm" trong wiki, sau `US-018` và `US-020`.

Không gắn Epic: `docs/kb/ba/business-flow.md` chỉ phạm vi "Hệ Thống Quản Lý Chi Tiêu" (F1–F4). User xác nhận tường minh `US-021` giữ ngoài Business Flow, theo tiền lệ `DEC-088` của `US-018` (`DEC-111`, chốt qua `ssr-po mode=review` 2026-08-27). `po-expert` xác nhận `Aligned` (2026-08-28), áp dụng cùng tiền lệ.

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-021-tu-dien-thong-tin-job-link.md`](../../delivery/pbi/US-021-tu-dien-thong-tin-job-link.md) | Đã đồng bộ 2026-08-28 — 8 AC |
