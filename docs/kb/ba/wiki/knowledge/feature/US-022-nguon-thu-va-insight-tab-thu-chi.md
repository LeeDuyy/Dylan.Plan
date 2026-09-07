---
status: Active
feature: US-022
updated: 2026-09-07
spec: docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/spec.md
raw: docs/kb/ba/raw/US-022-nguon-thu-va-insight-tab-thu-chi.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-022", "Nguồn thu và insight tab Thu chi"]
---

# US-022 — Nguồn thu, sửa insight tiết kiệm, tháng mặc định và bỏ giới hạn tháng cho Item cần mua tại tab Thu chi

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Tab Thu chi hiện chỉ ghi được phần chi. Phần thu là một con số cố định 35.000.000 đồng gán sẵn và không sửa được, khiến các chỉ số "còn lại", "tỷ lệ dùng thu nhập" và "tiết kiệm" hiển thị sai so với thực tế của Dylan. Function này cho Dylan khai báo và điều chỉnh các nguồn thu thật của từng tháng (Lương, Freelance, Thưởng…), tính lại các chỉ số tiết kiệm cho đúng và tách bạch, mở tab đúng vào tháng đang quan tâm, và ghi danh sách đồ cần mua cho cả các tháng sắp tới chứ không chỉ tháng hiện tại.

Giá trị đo được: sau thay đổi, "Thu nhập tháng", "Số dư còn lại", "Tiết kiệm ròng" và "Tỷ lệ tiết kiệm" của một tháng khớp với tổng nguồn thu Dylan tự nhập cho tháng đó (không còn cố định 35.000.000 đồng); tab Thu chi khi vừa mở hiển thị tháng hiện tại (hoặc tháng gần hiện tại nhất khi tháng hiện tại chưa có dữ liệu).

## 2. Phạm Vi

Trong phạm vi:

- Thêm, sửa tên, sửa số tiền, xóa và sắp xếp thứ tự các nguồn thu của tháng đang xem, trong một bảng riêng đối xứng với bảng danh mục chi
- Hiển thị "Thu nhập tháng" là tổng số tiền các nguồn thu của tháng ([`BR-033`](../business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md))
- Tính lại "Số dư còn lại", "Tỷ lệ sử dụng thu nhập", "Tiết kiệm ròng", "Tỷ lệ tiết kiệm" theo Thu nhập tháng mới
- Hiển thị hai chỉ số tiết kiệm tách riêng: "Tiết kiệm ròng" và "Đã phân bổ vào tích lũy", kèm "Tỷ lệ tiết kiệm" ([`BR-034`](../business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md))
- Gỡ các mốc mục tiêu cố định (5.000.000đ, 7.500.000đ, 31.500.000đ, 30.000.000đ, 90%) khỏi khu vực insight và khu vực "Quy tắc kiểm soát"
- Khi mở tab Thu chi, chọn sẵn tháng hiện tại theo đồng hồ hệ thống, hoặc tháng gần hiện tại nhất nếu tháng hiện tại chưa có dữ liệu ([`BR-035`](../business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md))
- Cho thêm/sửa/đánh dấu đã mua/xóa item cần mua ở tháng hiện tại và mọi tháng tương lai; chặn thao tác ở tháng đã kết thúc ([`BR-036`](../business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md))
- Tháng được tạo mới bắt đầu không có nguồn thu nào ([`BR-037`](../business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md))
- Chuyển dữ liệu một lần: mỗi tháng đã tồn tại được tạo sẵn một nguồn thu "Lương" bằng đúng con số thu nhập cũ

Ngoài phạm vi:

- Đổi layout tab, dùng Ant Design, làm responsive cho điện thoại/máy tính bảng — thuộc [`US-023`](US-023-layout-antd-responsive-toan-app.md)
- Cho Dylan tự cấu hình các mốc ngưỡng cảnh báo — thuộc [`US-009`](US-009-cau-hinh-nguong-ngan-sach.md)
- Phân loại nguồn thu theo tính chất (cố định/biến động)
- Thay đổi hành vi tự chuyển item Pending sang tháng mới ([`BR-023`](../business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md) giữ nguyên)

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem nguồn thu mọi tháng; Tạo, Sửa, Xóa, Sắp xếp nguồn thu | Thao tác chỉ khi tháng đang xem không ở quá khứ ([`BR-036`](../business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md), `DEC-133`); số tiền là số nguyên đồng từ 0 trở lên (`DEC-134`) |
| Dylan | Xem, Tạo, Sửa, Đánh dấu đã mua, Xóa item cần mua | Chỉ khi tháng đang xem không ở quá khứ ([`BR-036`](../business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md)) |

## 4. Luồng Nghiệp Vụ

1. Dylan mở tab Thu chi. Hệ thống chọn sẵn tháng hiện tại (hoặc tháng gần hiện tại nhất nếu tháng hiện tại chưa có dữ liệu).
2. Dylan xem bảng "Nguồn thu" của tháng: mỗi dòng có tên nguồn và số tiền; dòng tổng hiển thị "Thu nhập tháng".
3. Dylan thêm một nguồn thu: nhập tên (bắt buộc) và số tiền (bắt buộc). Dòng mới xuất hiện, Thu nhập tháng và các chỉ số tổng cập nhật ngay.
4. Dylan sửa tên hoặc số tiền một nguồn thu tại chỗ, hoặc kéo-thả để đổi thứ tự, hoặc xóa một nguồn thu. Các chỉ số tổng cập nhật theo.
5. Dylan xem khu vực "Insight tài chính": thấy "Thu nhập tháng", "Tổng chi", "Tiết kiệm ròng" (kèm "Tỷ lệ tiết kiệm"), "Đã phân bổ vào tích lũy", và các chỉ số chi khác — tất cả tính trên Thu nhập tháng thật, không còn mốc mục tiêu cố định.
6. Dylan chuyển sang một tháng tương lai và thêm item cần mua cho tháng đó; với một tháng đã kết thúc, danh sách item chỉ xem.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Tháng chưa có nguồn thu nào | Bảng "Nguồn thu" trống, Thu nhập tháng hiển thị 0đ; "Tỷ lệ tiết kiệm" hiển thị "—" |
| Thu nhập tháng bằng 0 | "Tỷ lệ tiết kiệm" hiển thị "—"; "Tiết kiệm ròng" hiển thị số âm bằng đúng tổng chi (hoặc 0 nếu chưa chi) |
| Xóa nguồn thu cuối cùng của tháng | Thu nhập tháng về 0đ, các chỉ số tổng cập nhật theo |
| Tháng đang xem ở quá khứ | Khu vực item cần mua chỉ xem; bảng nguồn thu vẫn xem được |
| Chưa có tháng ngân sách nào | Màn hình ở trạng thái trống như hiện tại |

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-033` | Thu nhập tháng = tổng số tiền tất cả nguồn thu của tháng | [`../business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md`](../business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md) | `docs/memory/decisions.md#dec-127` | Đã xác nhận từ knowledge |
| `BR-034` | Insight tiết kiệm tách hai chỉ số: Tiết kiệm ròng và Đã phân bổ vào tích lũy; bỏ mốc cứng | [`../business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md`](../business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md) | `docs/memory/decisions.md#dec-128`, `#dec-131` | Đã xác nhận từ knowledge |
| `BR-035` | Tab Thu chi mặc định mở tháng hiện tại, không có thì tháng gần hiện tại nhất | [`../business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md`](../business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md) | `docs/memory/decisions.md#dec-129` | Đã xác nhận từ knowledge |
| `BR-036` | Dữ liệu nhập tay theo tháng (Item cần mua, Nguồn thu) thao tác được ở tháng hiện tại và tương lai, chặn tháng đã qua (thay `BR-024`) | [`../business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md`](../business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md) | `docs/memory/decisions.md#dec-130`, `#dec-133` | Đã xác nhận từ knowledge |
| `BR-037` | Tháng được tạo mới bắt đầu không có nguồn thu nào | [`../business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md`](../business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md) | `docs/memory/decisions.md#dec-131` | Đã xác nhận từ knowledge |
| (số tiền nguồn thu) | Số tiền một nguồn thu là số nguyên đồng từ 0 trở lên, không cho số âm | — (quyết định, chưa tách trang rule riêng) | `docs/memory/decisions.md#dec-134` | Đã xác nhận từ knowledge |
| (hai ô cùng công thức) | Khu vực insight giữ đồng thời "Số dư còn lại" và "Tiết kiệm ròng" dù cùng công thức | — | `docs/memory/decisions.md#dec-135` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

| Khái niệm nghiệp vụ | Trang entity | Model Prisma | Ghi chú |
| --- | --- | --- | --- |
| Nguồn thu | [`../../data/entity/ENT-007-nguon-thu.md`](../../data/entity/ENT-007-nguon-thu.md) | Chưa có model — entity mới, chờ `ssr-data` (dự kiến `IncomeSource`) | Gắn theo tháng ngân sách; nhiều nguồn thu một tháng |
| Tháng ngân sách | [`../../data/entity/ENT-003-thang-ngan-sach.md`](../../data/entity/ENT-003-thang-ngan-sach.md) | `MonthBudget` | Thu nhập tháng chuyển từ một con số cố định sang tổng các nguồn thu |
| Item cần mua | [`../../data/entity/ENT-006-item-can-mua.md`](../../data/entity/ENT-006-item-can-mua.md) | Chưa có model — entity mới (US-019) | Nới điều kiện tháng được thao tác từ `BR-024` sang `BR-036` |

Thuật ngữ mới đã thêm vào `docs/memory/glossary.md`: "Nguồn thu", "Thu nhập tháng", "Tiết kiệm ròng", "Đã phân bổ vào tích lũy", "Tỷ lệ tiết kiệm".

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-019`](US-019-danh-sach-can-mua.md) | Impacts | Nới điều kiện tháng được thao tác item cần mua từ "đúng tháng hiện tại" (`BR-024`) sang "tháng không ở quá khứ" (`BR-036`); wiki US-019 cần cập nhật khi sync |
| [`US-007`](US-007-phan-tich-xu-huong-lich-su.md) | Related only | Cùng khu vực phân tích của tab Thu chi; US-022 sửa nền tảng con số thu nhập mà các chỉ số phân tích dựa vào |
| [`US-009`](US-009-cau-hinh-nguong-ngan-sach.md) | Related only | US-022 gỡ mốc cứng khỏi giao diện; việc cấu hình ngưỡng thuộc US-009 |
| [`US-006`](US-006-canh-bao-trung-thang.md) | Depends on | Dùng chung luồng "Tạo tháng"/"Clone tháng đang xem"; `BR-037` bám vào luồng đó để khởi tạo nguồn thu rỗng |
| [`US-023`](US-023-layout-antd-responsive-toan-app.md) | Impacts | US-023 dựng lại giao diện tab Thu chi trên nền các thay đổi của US-022 (bảng nguồn thu, chỉ số insight mới, tháng mặc định); phải làm sau US-022 |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/spec.md` |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-022-nguon-thu-va-insight-tab-thu-chi.md` |
| Raw | `docs/kb/ba/raw/US-022-nguon-thu-va-insight-tab-thu-chi.md` |
| Quyết định | `docs/memory/decisions.md` (DEC-127 → DEC-131) |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| [`../epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Epic | Cross-cutting (không gắn 1 epic): phần khai báo/điều chỉnh nguồn thu thuộc luồng F2, phục vụ mục tiêu `M4` |
| [`../epic/EPC-003-quan-ly-chu-ky-thang.md`](../epic/EPC-003-quan-ly-chu-ky-thang.md) | Epic | Cross-cutting: tháng mặc định (`DEC-129`) và nới giới hạn tháng cho item cần mua (`DEC-130`) thuộc luồng F3 |
| [`../epic/EPC-004-phan-tich-bao-cao-chi-tieu.md`](../epic/EPC-004-phan-tich-bao-cao-chi-tieu.md) | Epic | Cross-cutting: phần sửa insight tiết kiệm (`DEC-128`) thuộc luồng F4 |
| [`../../data/entity/ENT-007-nguon-thu.md`](../../data/entity/ENT-007-nguon-thu.md) | Entity | Entity mới do function này sinh ra |

Business Flow đã đồng bộ ngày 2026-09-07 theo `DEC-127`..`DEC-131` (thêm mục tiêu `M4`; F2 bước 5; F3 bước 1, 3, 4; F4 bước 1; mục 5 điểm chạm #4; mục 6 bản đồ function). US-022 là function cross-cutting ba luồng, xử lý như tiền lệ `US-002` — không gắn đúng một epic.

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-022-nguon-thu-va-insight-tab-thu-chi.md`](../../delivery/pbi/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Đã đồng bộ 2026-09-07 — 13 AC |
