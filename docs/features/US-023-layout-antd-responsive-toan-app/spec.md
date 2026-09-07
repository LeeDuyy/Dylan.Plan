# Chuẩn hóa layout toàn app bằng Ant Design, tận dụng không gian và responsive cho mobile/tablet

Status: Ready for DEV
Feature: US-023
Created: 2026-09-07
Updated: 2026-09-07
Raw Source: `docs/kb/ba/raw/US-023-layout-antd-responsive-toan-app.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-023-layout-antd-responsive-toan-app.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.

## 1. Mục Tiêu Nghiệp Vụ

Dylan là người dùng duy nhất của ứng dụng kế hoạch cá nhân (các tab Tổng quan, Roadmap, Thời gian biểu, Freelance, Sản phẩm, Thu chi). Giao diện hiện tại tự dựng bằng mã trình bày thủ công: trên màn hình rộng nội dung bị bó trong một khung hẹp cố định, trên điện thoại và máy tính bảng nhiều khu vực tràn ra ngoài hoặc phải cuộn ngang cả trang, và tab Thu chi lại có khung riêng khác với các tab còn lại.

Sau thay đổi này, toàn bộ ứng dụng dùng một khung màn hình chung dựng bằng bộ thành phần Ant Design, một bảng màu và một chế độ sáng/tối; nội dung dùng phần lớn bề ngang màn hình rộng; giao diện co gọn dùng được trên điện thoại và máy tính bảng; nội dung, số liệu và thao tác của từng tab giữ nguyên.

Giá trị đo được: mở lần lượt cả sáu tab ở ba bề ngang màn hình — điện thoại (khoảng 375 điểm ảnh), máy tính bảng (khoảng 768 điểm ảnh), màn hình rộng (khoảng 1440 điểm ảnh) — không tab nào bị cuộn ngang toàn trang; vùng chuyển tab bấm được ở cả ba; ở màn hình rộng vùng nội dung rộng hơn rõ so với khung khoảng 1220 điểm ảnh trước đây.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`../../kb/ba/wiki/knowledge/feature/US-023-layout-antd-responsive-toan-app.md`](../../kb/ba/wiki/knowledge/feature/US-023-layout-antd-responsive-toan-app.md) | Mục tiêu, phạm vi, luồng, rule của function |
| [`../../kb/ba/wiki/knowledge/business-rule/BR-038-layout-antd-responsive-toan-app.md`](../../kb/ba/wiki/knowledge/business-rule/BR-038-layout-antd-responsive-toan-app.md) | Khung dùng chung, co theo bề ngang thiết bị, một hệ thành phần cho mọi tab |
| [`../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md`](../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md) | Trạng thái mới nhất của tab Thu chi (bảng Nguồn thu, chỉ số insight, tháng mặc định) mà US-023 dựng lại giao diện trên nền đó |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`.

## 3. Phạm Vi

- Thêm bộ thành phần Ant Design vào ứng dụng, kèm phần tương thích cho phiên bản thư viện giao diện đang dùng và phần trích xuất kiểu phía máy chủ để giao diện không nháy khi tải trang.
- Dựng lại khung màn hình chung: thanh tiêu đề (biểu trưng + tên + nút đổi giao diện + menu đăng xuất), vùng chuyển tab, vùng nội dung, chân trang.
- Đưa tab Thu chi vào dùng chung khung màn hình này (bỏ khung riêng hiện tại của nó); tab Thu chi giữ route riêng.
- Vùng chuyển tab co theo bề ngang: máy tính bảng và màn hình rộng hiển thị đầy đủ sáu tab theo hàng ngang (trên máy tính bảng thu nhỏ cỡ chữ và khoảng cách cho vừa); chỉ trên điện thoại (bề ngang nhỏ) thu vào một nút, bấm nút mở một bảng trượt để chọn tab. Nút đổi giao diện trên điện thoại nằm trong bảng trượt này thay vì thanh tiêu đề.
- Nới bề ngang vùng nội dung để dùng phần lớn màn hình rộng; trên màn hình siêu rộng giữ một trần khoảng 2000 điểm ảnh và căn giữa để dòng chữ không dài quá mức khó đọc.
- Chuyển các thành phần giao diện của mọi tab sang thành phần Ant Design tương ứng — nút, thẻ, bảng, ô chọn một giá trị, ô chọn nhiều giá trị, ô nhập, nhãn trạng thái, thanh tiến độ, dòng thời gian, các bước, hộp thoại xác nhận, thông báo nổi — giữ nguyên nhãn hiển thị và nội dung.
- Giữ bảng màu và chế độ sáng/tối hiện tại: ánh xạ các màu đang dùng vào bảng màu của bộ thành phần; gom logic bật/tắt sáng/tối đang lặp ở nhiều nơi về một nơi.
- Trên điện thoại: mỗi khu vực nội dung xếp một cột; bảng rộng cuộn ngang bên trong khung riêng của nó, không làm cả trang cuộn ngang.
- Trên máy tính bảng: khu vực nội dung xếp một đến hai cột tùy khu vực.

## 4. Ngoài Phạm Vi

- Thay đổi bất kỳ số liệu, nội dung, nhãn, hay luồng nghiệp vụ nào của các tab.
- Thay đổi cấu trúc dữ liệu, thao tác lưu, hay luồng lưu trữ.
- Trang đăng nhập và trang chân dung ở tên miền gốc.
- Chuyển biểu đồ tròn cơ cấu chi tiêu và biểu đồ cột xu hướng ở tab Thu chi sang thành phần biểu đồ của thư viện — giữ cách vẽ hiện tại, chỉ khoác vỏ thẻ và tiêu đề bên ngoài.
- Thêm tab mới, đổi thứ tự tab, hay đổi tên tab.

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem và dùng mọi tab như hiện tại, trên mọi thiết bị | — (không đổi quyền; chỉ đổi cách trình bày) | [`../../memory/glossary.md`](../../memory/glossary.md) (mục 2, vai trò Dylan) |

## 6. Luồng Nghiệp Vụ

1. Dylan mở ứng dụng. Khung màn hình chung hiển thị: thanh tiêu đề trên cùng, vùng chuyển tab, vùng nội dung của tab đang mở, chân trang.
2. Trên màn hình rộng: vùng chuyển tab là một hàng ngang hiện đủ mọi tab; vùng nội dung dùng phần lớn bề ngang, giữ trần khoảng 2000 điểm ảnh trên màn hình siêu rộng.
3. Trên máy tính bảng: khung màn hình hiển thị đủ; vùng chuyển tab vẫn là hàng ngang đủ sáu tab (thu nhỏ cỡ chữ và khoảng cách cho vừa); các khu vực nhiều cột rút xuống một đến hai cột.
4. Trên điện thoại: vùng chuyển tab thu vào một nút ở thanh tiêu đề; Dylan bấm nút, một bảng trượt mở ra liệt kê mọi tab và cả nút đổi giao diện; Dylan chọn một tab, bảng trượt đóng lại và nội dung tab đó hiển thị.
5. Dylan chuyển giữa các tab — mỗi tab giữ nguyên nội dung, số liệu và thao tác như trước, chỉ khác cách trình bày.
6. Dylan bấm nút đổi giao diện (ở thanh tiêu đề trên máy tính bảng/màn hình rộng, hoặc trong bảng trượt trên điện thoại) — toàn bộ khung và mọi thành phần chuyển giữa chế độ sáng và tối một cách nhất quán, giữ đúng bảng màu quen thuộc.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Từng tab giữ nguyên cách hiển thị "chưa có dữ liệu" như hiện tại, chỉ khoác vỏ Ant Design |
| Không đủ quyền | Không áp dụng — Dylan là người dùng duy nhất |
| Dữ liệu trùng | Không áp dụng — US-023 không chạm dữ liệu |
| Hệ thống lỗi | Từng tab giữ nguyên cách báo lỗi và thông báo như hiện tại, chỉ khoác vỏ Ant Design |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Dylan đang dùng ứng dụng trên màn hình rộng | Dylan mở lần lượt cả sáu tab (Tổng quan, Roadmap, Thời gian biểu, Freelance, Sản phẩm, Thu chi) | Cả sáu tab đều hiển thị trong cùng một khung: cùng thanh tiêu đề trên cùng, cùng vùng chuyển tab, cùng chân trang; tab Thu chi không còn thanh tiêu đề riêng khác các tab kia | Xem ASCII Mockup mục 8.1 |
| AC-02 | Dylan đang xem một tab bất kỳ trên màn hình rộng khoảng 1440 điểm ảnh, và một lần nữa trên màn hình siêu rộng khoảng 2560 điểm ảnh | Dylan quan sát vùng nội dung | Ở khoảng 1440 điểm ảnh: vùng nội dung rộng hơn rõ so với khung khoảng 1220 điểm ảnh trước đây (dùng phần lớn bề ngang, chỉ chừa lề hai bên). Ở khoảng 2560 điểm ảnh: vùng nội dung dừng ở khoảng 2000 điểm ảnh và được căn giữa, không kéo dài hết bề ngang cửa sổ | Xem ASCII Mockup mục 8.1 |
| AC-03 | Dylan mở ứng dụng trên bề ngang khoảng 375 điểm ảnh | Dylan quan sát và bấm nút mở vùng chuyển tab | Vùng chuyển tab thu vào một nút ở thanh tiêu đề; bấm nút mở một bảng trượt liệt kê đủ sáu tab và nút đổi giao diện; chọn một tab thì bảng trượt đóng và nội dung tab đó hiện ra; toàn trang không cuộn ngang, mọi khu vực xếp một cột | Xem ASCII Mockup mục 8.2 |
| AC-04 | Dylan mở ứng dụng trên bề ngang khoảng 768 điểm ảnh | Dylan mở tab Tổng quan và tab Thu chi, rồi chuyển qua lại giữa hai tab bằng vùng chuyển tab | Khung màn hình hiện cả bốn phần (thanh tiêu đề, vùng chuyển tab, vùng nội dung, chân trang); vùng chuyển tab hiện cả sáu nhãn tab trên một hàng ngang (cỡ chữ và khoảng cách nhỏ hơn so với màn hình rộng), không thu vào nút; bấm một nhãn tab thì nội dung đổi sang tab đó; các khu vực nội dung vốn hai cột trở lên trên màn hình rộng rút xuống một đến hai cột; thanh cuộn ngang của cả trang không xuất hiện | Xem ASCII Mockup mục 8.2 |
| AC-05 | Dylan mở tab Thu chi (bảng danh mục chi) và tab Roadmap (bảng theo dõi CV ứng tuyển) trên bề ngang khoảng 375 điểm ảnh | Dylan cuộn ngang trong khu vực bảng | Bảng cuộn ngang bên trong khung riêng của nó để xem đủ các cột; phần còn lại của trang và thanh tiêu đề không bị đẩy hay cuộn theo | Xem ASCII Mockup mục 8.2 |
| AC-06 | Dylan đang ở chế độ sáng trên một tab bất kỳ | Dylan bấm nút đổi giao diện, rồi đóng và mở lại ứng dụng | Thanh tiêu đề, vùng chuyển tab, mọi thẻ, bảng, nút và nhãn trên tab đều chuyển sang chế độ tối cùng lúc, dùng đúng các màu nền/chữ/nhấn quen thuộc của ứng dụng; sau khi mở lại ứng dụng vẫn ở chế độ tối; bấm nút lần nữa thì quay về chế độ sáng | Xem ASCII Mockup mục 8.1 |
| AC-07 | Dylan đang xem tab Thu chi và tab Roadmap sau khi đổi giao diện | Dylan thêm một nguồn thu ở tab Thu chi; thêm một job ở bảng theo dõi CV ứng tuyển ở tab Roadmap | Cả hai thao tác lưu thành công và hiển thị kết quả đúng như trước khi đổi giao diện — nội dung, số liệu và luồng nghiệp vụ không thay đổi | Xem ASCII Mockup mục 8.1 |
| AC-08 | Dylan đang xem một tab đang có dữ liệu và một tab chưa có dữ liệu sau thay đổi | Dylan quan sát các nút, thẻ, bảng, menu người dùng, hộp thoại xác nhận (mở một thao tác xóa rồi hủy) và vùng "chưa có dữ liệu" | Tất cả là thành phần của bộ Ant Design (dáng vẻ và hành vi nhất quán của bộ đó — nút có hiệu ứng khi rê chuột, bảng có phần đầu bảng cố định, khối trống và hộp thoại kiểu bộ đó); vùng "chưa có dữ liệu" và câu chữ hộp thoại giữ nguyên nội dung như trước; không còn thành phần tự dựng rời rạc như trước | Xem ASCII Mockup mục 8.1 |

Quy tắc: ngoại lệ "Không có dữ liệu" và "Hệ thống lỗi" ở mục 6 được phủ qua AC-08 (khối trống, hộp thoại xác nhận và thông báo nổi đều dùng thành phần Ant Design, giữ nguyên câu chữ như trước — xem EL-17, EL-19); hai ngoại lệ còn lại không áp dụng vì Dylan là người dùng duy nhất và thay đổi này không chạm dữ liệu. AC-03/AC-04/AC-05 phủ hành vi co theo bề ngang thiết bị.

## 8. Screen Element

### 8.1. Khung màn hình chung — mọi tab

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Khung màn hình chung | Tab | (không nhãn) | — | Bao mọi tab kể cả Thu chi; gồm thanh tiêu đề + vùng chuyển tab + vùng nội dung + chân trang; dựng bằng thành phần bố cục Ant Design | Dylan | AC-01 | [`US-002`](../US-002-route-rieng-quan-ly-chi-tieu/spec.md) — tab Thu chi nay dùng chung khung này |
| EL-02 | Vùng nội dung | Tab | (không nhãn) | Nội dung tab đang mở | Nới bề ngang: dùng phần lớn bề ngang màn hình rộng (không bó ở khung ~1220 điểm ảnh); một cột trên điện thoại | Dylan | AC-02, AC-03, AC-04 | Không |
| EL-03 | Vùng chuyển tab | Tab | Tổng quan / Roadmap / Thời gian biểu / Freelance / Sản phẩm / Thu chi | Danh sách sáu tab | Màn hình rộng: hàng ngang đầy đủ ngay dưới thanh tiêu đề, tab đang mở được đánh dấu. Máy tính bảng: vẫn hàng ngang đầy đủ sáu tab, cỡ chữ và khoảng cách nhỏ hơn cho vừa. Điện thoại: thu vào EL-04 | Dylan | AC-01, AC-03, AC-04 | Không |
| EL-04 | Nút mở vùng chuyển tab (điện thoại) | Button | (biểu tượng menu) | — | Chỉ hiển thị khi bề ngang nhỏ (điện thoại); nằm ở thanh tiêu đề; bấm thì mở EL-05 | Dylan | AC-03 | Không |
| EL-05 | Bảng trượt chọn tab (điện thoại) | Modal | Chuyển tab | Danh sách sáu tab + nút đổi giao diện | Mở từ EL-04; liệt kê đủ sáu tab và chứa nút đổi giao diện (EL-06); chọn một tab thì điều hướng và đóng bảng | Dylan | AC-03, AC-06 | Không |
| EL-06 | Nút đổi giao diện | Button | (biểu tượng mặt trời / mặt trăng) | Trạng thái sáng/tối | Trên máy tính bảng và màn hình rộng: nằm ở thanh tiêu đề. Trên điện thoại: nằm trong bảng trượt chọn tab (EL-05), không ở thanh tiêu đề. Bấm thì toàn bộ khung + mọi thành phần đổi chế độ sáng/tối, giữ bảng màu hiện tại; trạng thái được nhớ giữa các lần mở ứng dụng | Dylan | AC-06 | Không |
| EL-07 | Chân trang | Link | (dòng ghi chú mốc thời gian) | — | Giữ nội dung hiện tại, khoác vỏ Ant Design | Dylan | AC-01 | Không |
| EL-08 | Biểu trưng và tên ứng dụng | Link | [D] Dylan Plan Dashboard | — | Nằm bên trái thanh tiêu đề trên mọi bề ngang; giữ nguyên biểu trưng, tên và hành vi bấm hiện tại, khoác vỏ Ant Design | Dylan | AC-01 | Không |
| EL-09 | Menu người dùng | Dropdown | (nhãn / ảnh đại diện hiện tại) | Các mục menu hiện có | Nằm bên phải thanh tiêu đề trên mọi bề ngang; giữ nguyên các mục và hành vi hiện tại, hiển thị bằng menu thả xuống của Ant Design | Dylan | AC-01, AC-08 | Không |

**ASCII Mockup**

```text
Màn hình rộng (~1440):
+------------------------------------------------------------------------+
| [D] Dylan Plan Dashboard                                    [☾]  [▾]   |  <- thanh tiêu đề
+------------------------------------------------------------------------+
| [Tổng quan][Roadmap][Thời gian biểu][Freelance][Sản phẩm][Thu chi]     |  <- vùng chuyển tab
+------------------------------------------------------------------------+
|                                                                        |
|   [ Vùng nội dung tab — dùng phần lớn bề ngang, lề hai bên hẹp ]        |
|                                                                        |
+------------------------------------------------------------------------+
| Bắt đầu 22/06/2026 · Chuyển việc · Buy to Build · ...                   |  <- chân trang
+------------------------------------------------------------------------+
```

### 8.2. Khung màn hình chung — điện thoại và máy tính bảng

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-10 | Khu vực nội dung một cột (điện thoại) | Tab | (không nhãn) | Nội dung tab | Trên bề ngang nhỏ, mọi khu vực nội dung vốn nhiều cột xếp thành một cột dọc; không có phần tử nào tràn ra ngoài bề ngang trang | Dylan | AC-03 | Không |
| EL-11 | Khung cuộn ngang cho bảng rộng | Table | (không nhãn) | Bảng của tab (danh mục chi, theo dõi CV ứng tuyển, thời gian biểu...) | Bảng rộng hơn bề ngang trang được đặt trong một khung cuộn ngang riêng; cuộn khung này không làm trang hay thanh tiêu đề cuộn theo | Dylan | AC-05 | [`US-018`](../US-018-theo-doi-cv-ung-tuyen/spec.md) — bảng "Theo dõi CV ứng tuyển" đặt trong khung cuộn ngang |
| EL-12 | Khu vực nội dung một đến hai cột (máy tính bảng) | Tab | (không nhãn) | Nội dung tab | Trên bề ngang vừa, các khu vực nội dung nhiều cột rút xuống một đến hai cột | Dylan | AC-04 | Không |

**ASCII Mockup**

```text
Điện thoại (~375):
+---------------------------+
| [D] Dylan Plan     [≡][▾] |   <- [≡] mở bảng trượt (6 tab + nút đổi giao diện), [▾] menu đăng xuất
+---------------------------+
| [ Khu vực nội dung 1 — 1 cột ]|
+---------------------------+
| [ Khu vực nội dung 2 — 1 cột ]|
+---------------------------+
| [ Bảng rộng: (cuộn ngang trong khung riêng) ]     |
+---------------------------+
| [ chân trang ]            |
+---------------------------+

Bảng trượt (khi bấm [≡]):
+---------------------------+
| Chuyển tab           [x] |
| • Tổng quan               |
| • Roadmap                 |
| • Thời gian biểu          |
| • Freelance               |
| • Sản phẩm                |
| • Thu chi                 |
| ------------------------- |
| [☾] Đổi giao diện          |
+---------------------------+
```

### 8.3. Thành phần bên trong các tab

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-13 | Nút bấm trong mọi tab | Button | (giữ nhãn hiện tại từng nút) | — | Đổi vỏ so với hiện tại: dùng nút của bộ Ant Design; giữ nguyên nhãn, điều kiện bật/tắt và hệ quả khi bấm | Dylan | AC-08 | Không |
| EL-14 | Thẻ nội dung trong mọi tab | Badge | (giữ tiêu đề hiện tại từng thẻ) | — | Đổi vỏ so với hiện tại: dùng thẻ của bộ Ant Design; giữ nguyên tiêu đề và nội dung bên trong | Dylan | AC-08 | Không |
| EL-15 | Bảng dữ liệu trong mọi tab | Table | (giữ tiêu đề và các cột hiện tại) | Dữ liệu của từng bảng | Đổi vỏ so với hiện tại: dùng bảng của bộ Ant Design; giữ nguyên các cột, thứ tự cột, thứ tự dòng mặc định và mọi thao tác trên dòng (sửa tại chỗ, kéo-thả, xóa...). Giữ đúng cách phân trang hiện tại — bảng nào hiện không phân trang thì không tự thêm phân trang. Giữ đúng kiểu sắp xếp hiện tại (bảng dùng sắp xếp hai chiều tăng/giảm khi bấm tiêu đề cột thì giữ nguyên, không đổi sang chu kỳ ba trạng thái của bảng Ant Design) | Dylan | AC-07, AC-08 | [`US-017`](../US-017-sap-xep-danh-muc-keo-tha/spec.md) — kéo-thả sắp xếp danh mục giữ nguyên; [`US-019`](../US-019-danh-sach-can-mua/spec.md) — bảng Items cần mua giữ nguyên; [`US-018`](../US-018-theo-doi-cv-ung-tuyen/spec.md) — bảng "Theo dõi CV ứng tuyển" giữ sắp xếp hai chiều và thứ tự mặc định "job mới nhất lên đầu" |
| EL-16 | Ô chọn, ô nhập, nhãn trạng thái trong mọi tab | Dropdown | (giữ nhãn và tập giá trị hiện tại) | — | Đổi vỏ so với hiện tại: dùng thành phần tương ứng của bộ Ant Design; giữ nguyên tập giá trị, giá trị mặc định và thông báo lỗi khi nhập sai | Dylan | AC-07, AC-08 | Không |
| EL-17 | Hộp thoại xác nhận và thông báo nổi trong mọi tab | Toast | (giữ nguyên câu chữ hiện tại) | — | Đổi vỏ so với hiện tại: dùng hộp thoại xác nhận và thông báo nổi của bộ Ant Design; giữ nguyên câu chữ, thời điểm xuất hiện, và hành vi xác nhận/hủy. Áp cho cả thông báo lỗi hệ thống ở từng tab (ngoại lệ mục 6) | Dylan | AC-07, AC-08 | Không |
| EL-18 | Thanh tiến độ, dòng thời gian, các bước trong mọi tab | Badge | (giữ nhãn và mốc hiện tại) | Dữ liệu của từng tab | Đổi vỏ so với hiện tại: dùng thanh tiến độ / dòng thời gian / các bước của bộ Ant Design; giữ nguyên giá trị, mốc và nhãn hiển thị | Dylan | AC-08 | Không |
| EL-19 | Trạng thái chưa có dữ liệu trong mọi tab | Badge | (giữ nguyên câu thông báo hiện tại) | — | Đổi vỏ so với hiện tại: dùng khối trống của bộ Ant Design; giữ nguyên câu thông báo "chưa có dữ liệu" của từng tab (ngoại lệ mục 6) | Dylan | AC-08 | Không |

**ASCII Mockup**

```text
+------------------------------------------+
| [Card Ant Design]                        |
|  Tiêu đề khu vực                          |
|  +------------------------------------+   |
|  | Table Ant Design (đầu bảng cố định)|   |
|  | Cột A | Cột B | Cột C | ...        |   |
|  +------------------------------------+   |
|  [ Button ]  [ Dropdown ▾ ]  [ Input ]    |
+------------------------------------------+
```

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| (không có) | Không đổi | Không | US-023 thuần tầng trình bày — không chạm dữ liệu, báo cáo hay export |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md`](../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md) | Thứ tự | Có | Spec `Ready for DEV`, phần triển khai đã `Delivered With Notes` — US-023 dựng lại giao diện tab Thu chi trên nền US-022 (bảng Nguồn thu, chỉ số insight mới, tháng mặc định), phải làm sau |
| [`../US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) | Giao kèo | Không | Spec `Ready for DEV`, task đã `Implemented` — bảng theo dõi CV ứng tuyển chuyển sang bảng Ant Design, giữ cột và mọi hành vi (kể cả sắp xếp hai chiều, thứ tự mặc định) |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`../US-017-sap-xep-danh-muc-keo-tha/spec.md`](../US-017-sap-xep-danh-muc-keo-tha/spec.md) | Screen Element (bảng danh mục) | Bảng danh mục chi | Không | Kéo-thả sắp xếp danh mục giữ nguyên hành vi, chỉ đổi vỏ bảng; không viết lại spec US-017 |
| [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) | Screen Element (bảng Items cần mua) | Bảng Items cần mua | Không | Giữ nguyên hành vi, chỉ đổi vỏ bảng |
| [`../US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) | Screen Element 8.1 (EL-01 bảng theo dõi CV ứng tuyển) | Bảng "Theo dõi CV ứng tuyển" | Không | Chuyển sang bảng Ant Design, giữ cột, thao tác trên dòng, kiểu sắp xếp hai chiều tăng/giảm khi bấm tiêu đề cột và thứ tự mặc định "job mới nhất lên đầu"; không viết lại spec US-018 |
| [`../US-002-route-rieng-quan-ly-chi-tieu/spec.md`](../US-002-route-rieng-quan-ly-chi-tieu/spec.md) | Screen Element 8.2 (EL-04 liên kết quay lại trang chủ) | Liên kết "← Dylan Plan Dashboard" ở đầu trang `/budget` | Không | Tab Thu chi bỏ khung riêng, dùng chung khung `AppShell` (thanh tiêu đề + vùng chuyển tab chung), nên liên kết quay lại riêng của trang `/budget` không còn cần thiết. Cập nhật mục 8.2 spec US-002 sau khi US-023 `Ready for DEV`; không viết lại spec US-002 ngay |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`../../kb/ba/wiki/knowledge/feature/US-023-layout-antd-responsive-toan-app.md`](../../kb/ba/wiki/knowledge/feature/US-023-layout-antd-responsive-toan-app.md) | Nạp lại từ spec này sau khi đạt `Ready for DEV` |
| [`../../kb/ba/wiki/delivery/pbi/US-023-layout-antd-responsive-toan-app.md`](../../kb/ba/wiki/delivery/pbi/US-023-layout-antd-responsive-toan-app.md) | Điền User Story và bảng tiêu chí chấp nhận |

Memory cần ghi: quyết định vào `decisions.md`; nhận định vào `judgement-log.md`; thuật ngữ mới vào `glossary.md`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Khung màn hình chung (mọi tab) + nội dung sáu tab: Tổng quan (`/`), Roadmap (`/roadmap`), Thời gian biểu (`/timetable`), Freelance (`/freelance`), Sản phẩm (`/product`), Thu chi (`/budget`) |
| Thực thể dữ liệu nào bị chạm | Không có |
| Cần thay đổi cấu trúc dữ liệu | Không |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Giữ nguyên bảng màu và chế độ sáng/tối hiện tại (ánh xạ vào bảng màu của bộ thành phần), không đổi màu nhận diện | Đã xác nhận từ knowledge (`docs/memory/decisions.md#dec-132`) | Nếu đổi màu, giao diện lạ mắt so với hiện tại |
| A2 | Bộ thành phần dùng là Ant Design (theo yêu cầu nguyên văn của Dylan trong raw) | Đã xác nhận từ knowledge (raw mục 2, `docs/memory/decisions.md#dec-132`) | Dùng bộ khác thì toàn bộ công việc phải làm lại |
| A3 | Các mốc bề ngang phân chia điện thoại / máy tính bảng / màn hình rộng theo hệ mốc mặc định của bộ thành phần Ant Design | Giả định hợp lý (dùng luôn hệ mốc của bộ đã chọn thay vì tự định nghĩa) | Nếu Dylan có mốc mong muốn khác, một số khu vực đổi bố cục ở ngưỡng không như ý |
| A4 | Biểu đồ tròn và biểu đồ cột ở tab Thu chi giữ cách vẽ hiện tại, chỉ khoác vỏ thẻ Ant Design bên ngoài | Giả định hợp lý (chuyển sang thư viện biểu đồ là việc lớn, không nằm trong yêu cầu) | Nếu Dylan muốn biểu đồ dạng thư viện, cần một requirement riêng |
| A5 | Biểu trưng, tên ứng dụng (EL-08) và menu đăng xuất (EL-09) ở thanh tiêu đề giữ nguyên nội dung và hành vi hiện có — chỉ khoác vỏ Ant Design. Menu đăng xuất là menu hiện có (`components/shared/UserMenu.tsx`): email đang đăng nhập + nút đăng xuất, không phải khái niệm tài khoản mới | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-07; `docs/memory/decisions.md#dec-132`) | Nếu cần đổi nội dung menu đăng xuất, đó là requirement riêng |
| A6 | Trên điện thoại, nút đổi giao diện (EL-06) nằm trong bảng trượt chọn tab (EL-05), không ở thanh tiêu đề; trên máy tính bảng và màn hình rộng nút này ở thanh tiêu đề | Đã xác nhận từ knowledge (user chọn "Dồn vào bảng trượt chuyển tab" qua dialog ngày 2026-09-07) | Nếu áp sai, thanh tiêu đề điện thoại chật hoặc thao tác đổi giao diện khó tìm |
| A7 | Trên màn hình siêu rộng (bề ngang trên khoảng 1440 điểm ảnh): vùng nội dung giãn tới trần khoảng 2000 điểm ảnh rồi dừng và căn giữa | Đã xác nhận từ knowledge (user chọn "Giãn gần toàn bộ (trần ~2000px)" qua dialog ngày 2026-09-07) | Nếu không đặt trần, dòng chữ và bảng quá dài khó đọc; nếu trần quá thấp thì không tận dụng được không gian |
| A8 | Trên máy tính bảng (khoảng 768–992 điểm ảnh), vùng chuyển tab vẫn là hàng ngang đủ sáu tab với cỡ chữ và khoảng cách nhỏ hơn — không thu vào bảng trượt như điện thoại | Đã xác nhận từ knowledge (user chọn "Hiện hàng ngang đầy đủ, thu nhỏ chữ/khoảng cách" qua dialog ngày 2026-09-07) | Nếu thu vào bảng trượt ở máy tính bảng, Dylan phải bấm thêm một bước dù màn đủ rộng |
