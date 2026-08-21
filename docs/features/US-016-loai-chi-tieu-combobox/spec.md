# Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định

Status: Ready for DEV
Feature: US-016
Created: 2026-08-11
Updated: 2026-08-11
Raw Source: `docs/kb/ba/raw/US-016-loai-chi-tieu-combobox.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-016-loai-chi-tieu-combobox.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, cột "Loại" trong bảng danh mục là một ô nhập chữ tự do — Dylan gõ tay, không có ràng buộc giá trị nào. Dữ liệu thật xác nhận rủi ro này đã xảy ra: một danh mục đang có Loại là "Linh s" — rõ ràng là kết quả gõ dở dang, không khớp bất kỳ nhãn nghiệp vụ nào đang dùng.

Sau thay đổi này, "Loại" chỉ còn nhận đúng 3 giá trị cố định — "Cố định", "Tích lũy", "Khác" — chọn qua một danh sách chọn (combobox). Dylan không còn gõ được ký tự tự do vào ô này. "Khác" thay thế hoàn toàn khái niệm "Linh hoạt" trước đây. Dylan không còn có thể vô tình tạo ra một giá trị Loại sai chính tả hay không có nghĩa.

Giá trị đo được: Sau khi triển khai, mọi danh mục trong hệ thống (cũ lẫn mới) chỉ mang đúng một trong 3 giá trị Loại hợp lệ — không còn danh mục nào có Loại ngoài "Cố định", "Tích lũy", "Khác".

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-016-loai-chi-tieu-combobox.md`](../../kb/ba/wiki/knowledge/feature/US-016-loai-chi-tieu-combobox.md) | Mục tiêu, phạm vi, luồng nghiệp vụ, business rule |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md`](../../kb/ba/wiki/knowledge/business-rule/BR-019-loai-danh-muc-combobox-co-dinh.md) | Nội dung rule: 3 giá trị cố định, quy tắc migrate dữ liệu cũ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md`](../../kb/ba/wiki/knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md) | "Chi tiêu khác" chỉ tự sinh khi cần — nơi US-016 đổi giá trị Loại mặc định được gán lúc tự sinh |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md`](../../kb/ba/wiki/knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md) | "Chi tiêu khác" khóa vĩnh viễn, chỉ xem — lý do Dylan không tự chọn Loại tay cho danh mục này |
| [`docs/kb/ba/wiki/data/entity/ENT-002-danh-muc.md`](../../kb/ba/wiki/data/entity/ENT-002-danh-muc.md) | Định nghĩa và ràng buộc hiện có của thực thể Danh mục |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, luồng F2, gap #14 |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`. Các quyết định liên quan mang mã DEC (viết tắt của "Decision", mã quyết định đã chốt với user): `DEC-004`, `DEC-056` (một phần bị thay bởi `DEC-073` — chỉ giá trị Loại mặc định của "Chi tiêu khác" đổi, các quyết định khác của `DEC-056` giữ nguyên), `DEC-073`. Các requirement khác được nhắc tới trong spec này dùng tiền tố US (viết tắt của "User Story") ghép số thứ tự, theo đúng quy ước đặt mã function của dự án.

## 3. Phạm Vi

- Đổi cách nhập "Loại" từ ô nhập chữ tự do sang danh sách chọn (combobox), đúng 3 lựa chọn: "Cố định", "Tích lũy", "Khác"
- Quy đổi một lần dữ liệu "Loại" đã có trước khi triển khai: "Cố định" và "Tích lũy" giữ nguyên; "Linh hoạt" và mọi giá trị không khớp 3 lựa chọn hợp lệ (kể cả dữ liệu lỗi như "Linh s") chuyển thành "Khác"
- Đổi giá trị Loại mặc định ở 3 nơi hệ thống tự gán khi tạo danh mục: danh mục mặc định lúc khởi tạo tháng, nút "Thêm danh mục", và danh mục "Chi tiêu khác" tự sinh — cả 3 nơi đổi từ mặc định "Linh hoạt" sang "Khác"
- Đổi tên và cách tính thẻ insight ở khu vực Phân tích: tên cũ "Chi linh hoạt" đổi thành "Chi khác", tính bằng tổng chi thực tế của các danh mục đang có Loại "Khác"

## 4. Ngoài Phạm Vi

- Ràng buộc ở tầng cấu trúc dữ liệu (kiểu liệt kê cố định hay kiểm tra ràng buộc khi lưu) — đây là lựa chọn kỹ thuật cụ thể, để bước lập kế hoạch kỹ thuật quyết định, không phải yêu cầu bắt buộc của spec này
- Thay đổi khác của danh mục "Chi tiêu khác" ngoài giá trị Loại mặc định — vẫn khóa vĩnh viễn, vẫn chỉ tự sinh khi cần, vẫn ẩn khỏi giao diện khi hết giao dịch, đúng như đã chốt trước đây (`DEC-026`, `DEC-027`, `DEC-029`)
- Thẻ insight "Tiết kiệm / tích lũy" — không đổi, vì thẻ này tính dựa trên khớp tên danh mục ("tiết", "đầu tư"...), không phụ thuộc giá trị Loại

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Chọn một trong 3 giá trị Loại cho danh mục thường qua danh sách chọn | Gõ ký tự tự do vào ô Loại; để trống ô Loại; sửa Loại của "Chi tiêu khác" (chỉ đọc, `BR-010`) | `docs/memory/decisions.md#dec-004`, `#dec-073` |

## 6. Luồng Nghiệp Vụ

1. Dylan mở bảng danh mục tại trang Quản lý chi tiêu.
2. Ở cột "Loại" của một danh mục thường (không phải "Chi tiêu khác"), Dylan bấm vào ô — một danh sách chọn hiện ra đúng 3 lựa chọn: "Cố định", "Tích lũy", "Khác".
3. Dylan chọn một trong 3 giá trị.
4. Giá trị vừa chọn hiển thị ngay trên ô Loại và được lưu lại cho danh mục đó, không cần thao tác lưu riêng.
5. Khi Dylan bấm nút "Thêm danh mục", danh mục mới xuất hiện với Loại mặc định là "Khác", sẵn sàng để Dylan đổi lại nếu muốn.
6. Khi hệ thống tự sinh danh mục "Chi tiêu khác" (theo quy tắc tự sinh đã có — `BR-009`), Loại của nó là "Khác".
7. Tại khu vực Phân tích, thẻ insight trước đây tên "Chi linh hoạt" đổi tên thành "Chi khác", hiển thị tổng chi thực tế của các danh mục đang có Loại "Khác".

Áp dụng một lần khi triển khai (không phải thao tác Dylan làm trên giao diện): mọi danh mục đang có Loại "Cố định" hoặc "Tích lũy" giữ nguyên; danh mục đang có Loại "Linh hoạt" hoặc bất kỳ giá trị nào khác không khớp "Cố định"/"Tích lũy" (kể cả giá trị lỗi như "Linh s") được chuyển thành "Khác".

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Tháng đang chọn chỉ có "Chi tiêu khác" hoặc chưa có danh mục nào — không có ô Loại nào để chọn (bảng trống hoặc chỉ có dòng "Chi tiêu khác" chỉ đọc) |
| Không đủ quyền | Không áp dụng — hệ thống chỉ có một người dùng |
| Dữ liệu trùng | Không áp dụng — thay đổi này không liên quan tới việc trùng lặp dữ liệu |
| Hệ thống lỗi | Dylan chọn một giá trị nhưng việc lưu bị lỗi (mất kết nối, lỗi máy chủ) — hiện thông báo lỗi chung đã có sẵn của ứng dụng; ô Loại giữ nguyên giá trị trước khi chọn cho tới khi Dylan thử lại thành công |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Danh mục "Ăn uống" trong tháng đang chọn đang có Loại "Cố định" | Dylan bấm vào ô Loại của danh mục "Ăn uống" | Một danh sách chọn hiện ra đúng 3 lựa chọn: "Cố định", "Tích lũy", "Khác"; ô này không cho gõ ký tự nào | Xem ASCII Mockup mục 8.1 |
| AC-02 | Ô Loại của danh mục "Ăn uống" đang mở danh sách chọn (AC-01) | Dylan chọn "Tích lũy" | Ô Loại hiển thị ngay "Tích lũy"; giá trị được lưu lại cho danh mục "Ăn uống", không cần thao tác lưu riêng | Xem ASCII Mockup mục 8.1 |
| AC-03 | Trước khi tính năng này triển khai, danh mục "Tiền nhà" có Loại "Cố định" và danh mục "Tiết kiệm / đầu tư" có Loại "Tích lũy" | Dylan mở bảng danh mục sau khi tính năng này đã triển khai xong | Ô Loại của "Tiền nhà" vẫn hiển thị "Cố định"; ô Loại của "Tiết kiệm / đầu tư" vẫn hiển thị "Tích lũy" — không đổi | Xem ASCII Mockup mục 8.1 |
| AC-04 | Trước khi tính năng này triển khai, danh mục "Ăn uống" có Loại "Linh hoạt" và một danh mục khác có Loại "Linh s" (dữ liệu lỗi do gõ dở dang) | Dylan mở bảng danh mục sau khi tính năng này đã triển khai xong | Ô Loại của cả "Ăn uống" và danh mục kia đều hiển thị "Khác" | Xem ASCII Mockup mục 8.1 |
| AC-05 | Dylan đang xem bảng danh mục của tháng hiện tại | Dylan bấm nút "Thêm danh mục" | Một dòng danh mục mới xuất hiện với Loại mặc định là "Khác" | Xem ASCII Mockup mục 8.1 |
| AC-06 | Tháng đang chọn chưa có danh mục "Chi tiêu khác"; Dylan ghi nhận một giao dịch mà không chọn danh mục nào | Giao dịch được ghi nhận, kích hoạt tự sinh "Chi tiêu khác" theo quy tắc đã có | Danh mục "Chi tiêu khác" xuất hiện trên bảng danh mục với Loại là "Khác" | Xem ASCII Mockup mục 8.1 |
| AC-07 | Tháng đang chọn có tổng chi thực tế của các danh mục Loại "Khác" là 3.000.000đ | Dylan xem khu vực Phân tích | Thẻ insight hiển thị tên "Chi khác" (không còn "Chi linh hoạt") với giá trị 3.000.000đ | Xem ASCII Mockup mục 8.2 |
| AC-08 | Danh mục "Ăn uống" đang có Loại "Cố định"; Dylan đã mở danh sách chọn ở ô Loại (AC-01) | Dylan chọn "Tích lũy" nhưng việc lưu bị lỗi (mất kết nối hoặc lỗi máy chủ) | Ứng dụng hiện thông báo lỗi chung đã có sẵn; ô Loại của "Ăn uống" vẫn hiển thị "Cố định" cho tới khi Dylan chọn lại và lưu thành công | Xem ASCII Mockup mục 8.1 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì tham chiếu khối ASCII Mockup ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

Liệt kê mọi thành phần màn hình mà requirement này chạm tới.

### 8.1. Bảng ngân sách theo danh mục — `Trang Thu chi (/budget)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Ô chọn "Loại" | Dropdown | (ô chọn trực tiếp trên dòng danh mục, không có nhãn riêng) | `Loại` của danh mục thường | **Đổi hành vi so với hiện tại**: trước đây là ô nhập chữ tự do, nay là danh sách chọn đúng 3 giá trị cố định — "Cố định", "Tích lũy", "Khác" — không cho gõ ký tự, không để trống. Giá trị mặc định khi tạo danh mục mới (`EL-02`) là "Khác". Nếu việc lưu giá trị vừa chọn bị lỗi, ô giữ nguyên giá trị trước đó cho tới khi Dylan thử lại thành công. Không áp dụng cho "Chi tiêu khác" — dòng này chỉ hiển thị chữ Loại dạng chỉ đọc, không có ô chọn (`BR-010`) | Dylan | AC-01, AC-02, AC-03, AC-04, AC-05, AC-08 | Không |
| EL-02 | Nút "Thêm danh mục" | Button | "Thêm danh mục" | — | Không đổi cách hoạt động hiện có (luôn thêm ngay một dòng mới); chỉ đổi giá trị Loại mặc định được gán cho dòng mới, từ "Linh hoạt" thành "Khác" | Dylan | AC-05 | Không |
| EL-04 | Cột "Loại" (chỉ đọc) trên dòng "Chi tiêu khác" | Column | (hiển thị chữ, không có nhãn riêng) | `Loại` của danh mục "Chi tiêu khác" | Không có ô chọn — chỉ hiển thị giá trị dạng chữ, không cho sửa (`BR-010`); giá trị hiển thị là "Khác" khi "Chi tiêu khác" tự sinh theo `BR-009`, thay vì "Linh hoạt" như trước | Dylan | AC-06 | Không |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| Danh mục         Loại        Ngân sách   Chi thực tế  Còn lại  |
+----------------------------------------------------------------+
| [Tiền nhà____]  [Cố định ▾] [7,500,000]  7.500.000đ   0đ        |
| [Ăn uống_____]  [Khác    ▾] [4,000,000]  1.200.000đ   2.800.000đ|
| [Tiết kiệm...]  [Tích lũy▾] [5,000,000]  5.000.000đ   0đ        |
| Chi tiêu khác    Khác        0đ          150.000đ    -150.000đ  |
+----------------------------------------------------------------+
|                                                [+ Thêm danh mục] |
+----------------------------------------------------------------+
```

Ô `[Khác ▾]` ở dòng "Ăn uống" minh họa combobox đang đóng, hiển thị giá trị đã chọn kèm mũi tên mở danh sách (`▾`). Khi Dylan bấm vào ô, danh sách 3 lựa chọn "Cố định / Tích lũy / Khác" hiện ra để chọn (AC-01).

### 8.2. Khu vực Insight tài chính — `Trang Thu chi (/budget)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-03 | Thẻ chỉ số "Chi khác" | Badge | "Chi khác" (trước đây "Chi linh hoạt") | Tổng chi thực tế của các danh mục đang có Loại "Khác" trong tháng đang chọn | **Đổi hành vi so với hiện tại**: đổi tên hiển thị từ "Chi linh hoạt" thành "Chi khác"; đổi cách tính từ so khớp chữ "linh" trong Loại sang tính tổng đúng các danh mục có Loại "Khác". Danh sách Loại chuẩn của kit chưa có loại "thẻ chỉ số" (stat card) — gán tạm `Badge` vì đây là thành phần hiển thị một giá trị tổng hợp, gần nghĩa nhất trong danh sách Loại hợp lệ | Dylan | AC-07 | Không |

**ASCII Mockup**

```text
+------------------------+  +------------------------+  +------------------------+
| Chi nhiều nhất         |  | Tiết kiệm / tích lũy   |  | Chi khác               |
| Ăn uống                |  | 5.000.000đ             |  | 3.000.000đ             |
| 1.200.000đ             |  | 14.3% thu nhập         |  | Mục tiêu quanh 7.5M    |
+------------------------+  +------------------------+  +------------------------+
```

Thẻ "Chi khác" (bên phải) thay thế đúng vị trí thẻ "Chi linh hoạt" cũ, chỉ đổi tên và cách tính — không đổi vị trí hay bố cục.

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Button`: nêu rõ điều kiện bật/tắt và điều gì xảy ra sau khi bấm.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Danh mục | Giới hạn giá trị Loại đúng 3 lựa chọn; migrate một lần dữ liệu cũ theo quy tắc đã chốt | Có | Không đổi cách lưu trữ hiện có (vẫn là chuỗi) — chỉ thêm ràng buộc giá trị hợp lệ và chạy migrate một lần |
| Xuất dữ liệu JSON | Không đổi cấu trúc — Loại vẫn xuất ra đúng giá trị chuỗi hiện có của danh mục tại thời điểm xuất (nay là một trong 3 giá trị mới) | Không | Thuộc requirement riêng khác (`US-008`) |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — cần data model `Category` bền vững trong database thật để chạy migrate dữ liệu Loại | Implemented |
| [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Quy tắc nghiệp vụ | Không (đã Delivered) — cần quy tắc tự sinh "Chi tiêu khác" đã có để đổi giá trị Loại mặc định của nó | Implemented |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Mục 3 (dòng "Chi tiêu khác khi tự sinh có Loại 'Linh hoạt'"), AC-01 và AC-03 (cột Then nêu "Chi tiêu khác" tự sinh có Loại "Linh hoạt"), mục 14 giả định A3 — tất cả đều khẳng định giá trị Loại mặc định là "Linh hoạt", nay đổi thành "Khác" theo `DEC-073` | Dòng minh họa "Linh hoạt" trong ASCII Mockup mục 8.2 của `US-005` (dòng "Chi tiêu khác" trên bảng ngân sách theo danh mục) | Có | Cập nhật mục 3, AC-01, AC-03 và mục 14 (A3) của spec `US-005` từ "Linh hoạt" thành "Khác"; sửa lại giá trị minh họa trong ASCII Mockup cho khớp — việc này thuộc quyền của `ssr-ba` khi cập nhật spec `US-005`, không thuộc phạm vi spec này |
| [`US-010`](../US-010-chan-trung-ten-danh-muc/spec.md) | Không có AC nào bị đổi — `US-010` chỉ kiểm tra trùng tên, không liên quan giá trị Loại | Giá trị minh họa "Linh hoạt" trong ASCII Mockup mục 8.1 của `US-010` chỉ mang tính ví dụ, không phải hành vi được đặc tả | Không | Không bắt buộc — có thể cập nhật ví dụ trong mockup cho nhất quán ở lần sửa spec `US-010` tiếp theo, không cấp thiết |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-016-loai-chi-tieu-combobox.md`](../../kb/ba/wiki/knowledge/feature/US-016-loai-chi-tieu-combobox.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-016-loai-chi-tieu-combobox.md`](../../kb/ba/wiki/delivery/pbi/US-016-loai-chi-tieu-combobox.md) | Điền đầy đủ User Story và 8 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory: quyết định cốt lõi (3 giá trị cố định, "Khác" thay "Linh hoạt", quy tắc migrate, đổi tên thẻ insight) đã ghi thành `DEC-073` trước khi vào `ssr-ba` — không phát sinh quyết định mới trong lúc viết spec này. Không có thuật ngữ nghiệp vụ mới phát sinh ngoài "Loại danh mục" đã cập nhật định nghĩa trong `glossary.md`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi (`/budget`) — bảng ngân sách theo danh mục (ô Loại, nút "Thêm danh mục") và khu vực Insight tài chính (thẻ "Chi khác") |
| Thực thể dữ liệu nào bị chạm | Danh mục (giới hạn giá trị Loại, migrate dữ liệu cũ) |
| Cần thay đổi cấu trúc dữ liệu | Không — Loại vẫn là một chuỗi, chỉ giới hạn tập giá trị hợp lệ và chạy migrate dữ liệu một lần; nếu `ssr-plan`/`ssr-data` thấy nên ràng buộc chặt hơn ở tầng lưu trữ (kiểu liệt kê, kiểm tra khi lưu) thì đó là lựa chọn kỹ thuật, không phải yêu cầu bắt buộc của spec này |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không — Xuất JSON không đổi cấu trúc, chỉ đổi giá trị Loại theo dữ liệu đã migrate |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | 3 giá trị combobox cố định là "Cố định", "Tích lũy", "Khác"; "Khác" thay thế hoàn toàn "Linh hoạt" | Đã xác nhận từ knowledge — `docs/memory/decisions.md#dec-073` | Nếu sai, cần đổi lại toàn bộ tập giá trị ở mục 3, 6, 7, 8.1 |
| A2 | Dữ liệu Loại "Linh hoạt" và biến thể lỗi "Linh s" đều migrate thành "Khác" | Đã xác nhận từ knowledge — user xác nhận trực tiếp (`docs/memory/decisions.md#dec-073`, "Linh s sẽ đổi thành khác") | Nếu sai, cần đổi lại quy tắc migrate ở mục 6, AC-04 |
| A3 | Thẻ insight "Chi linh hoạt" đổi tên thành "Chi khác" | Đã xác nhận từ knowledge — user xác nhận trực tiếp (`docs/memory/decisions.md#dec-073`, "Đổi thành Chi khác") | Nếu sai, cần giữ nguyên tên nhãn ở mục 8.2, EL-03, AC-07 |
| A4 | Ràng buộc ở tầng cấu trúc dữ liệu (enum/kiểm tra khi lưu) không thuộc phạm vi spec này, để bước lập kế hoạch kỹ thuật quyết định | Giả định hợp lý — đây là lựa chọn kỹ thuật thuần túy, không đổi kết quả nghiệp vụ dù chọn cách nào | Nếu sai (cần quyết định nghiệp vụ trước), cần bổ sung câu hỏi cho user trước khi `ssr-plan`/`ssr-data` triển khai |
