# Lịch sử thay đổi trạng thái job ứng tuyển

Status: Ready for DEV
Feature: US-020
Created: 2026-08-14
Updated: 2026-08-14
Raw Source: `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Bảng "Theo dõi CV (hồ sơ xin việc) ứng tuyển" hiện chỉ ghi trạng thái hiện tại của mỗi job — không có mốc thời gian nào cho biết Dylan đã nộp hồ sơ từ khi nào, và không tự phát hiện khi một job đã quá hạn nộp mà Dylan chưa kịp nộp, hay đã nộp nhưng bên tuyển dụng im lặng quá lâu. Dylan phải tự nhớ hoặc tự tính tay từng ngày để biết job nào cần chú ý.

Sau thay đổi này, mỗi job giữ lại mốc "Ngày nộp hồ sơ" (thời điểm chuyển sang trạng thái "Waiting"), và hệ thống tự động cập nhật Trạng thái cho hai tình huống thời gian cụ thể: job còn "Interested" (quan tâm nhưng chưa nộp) mà đã quá hạn nộp thì chuyển "Expired"; job đang "Waiting" (đã nộp, chờ phản hồi) mà im lặng quá 7 ngày thì chuyển "No Response".

Giá trị đo được: Dylan mở bảng "Theo dõi CV ứng tuyển" thấy ngay job nào đã quá hạn (Expired) hoặc đã im lặng quá 7 ngày (No Response) mà không cần tự nhớ hay tính tay từng ngày hết hạn/ngày nộp hồ sơ.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md`](../../kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md) | Mục tiêu, phạm vi, luồng nghiệp vụ, 3 business rule |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md`](../../kb/ba/wiki/knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md) | Nội dung rule: Interested quá hạn tự động chuyển "Expired" |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-026-waiting-qua-7-ngay-tu-dong-no-response.md`](../../kb/ba/wiki/knowledge/business-rule/BR-026-waiting-qua-7-ngay-tu-dong-no-response.md) | Nội dung rule: Waiting quá 7 ngày kể từ Ngày nộp hồ sơ tự động chuyển "No Response" |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-027-ngay-nop-ho-so-theo-chieu-waiting.md`](../../kb/ba/wiki/knowledge/business-rule/BR-027-ngay-nop-ho-so-theo-chieu-waiting.md) | Nội dung rule: ghi nhận/xoá mốc "Ngày nộp hồ sơ" theo chiều Interested ↔ Waiting |
| [`docs/kb/ba/wiki/data/entity/ENT-004-job-ung-tuyen.md`](../../kb/ba/wiki/data/entity/ENT-004-job-ung-tuyen.md) | Định nghĩa và ràng buộc mở rộng của thực thể Job ứng tuyển (mốc "Ngày nộp hồ sơ", trạng thái "Expired") |
| [`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) | Bảng "Theo dõi CV ứng tuyển" gốc, 7 giá trị Trạng thái ban đầu, các cột đã có (Công ty, Ngày hết hạn, Platform, Link, Ghi chú) |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Xác nhận trang Roadmap nằm ngoài phạm vi Business Flow "Hệ Thống Quản Lý Chi Tiêu" hiện có (mục 1, M2) — US-020 mở rộng trực tiếp US-018 nên áp dụng cùng lý do, cùng tiền lệ `DEC-088` |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`. Các quyết định liên quan mang mã DEC (viết tắt của "Decision", mã quyết định đã chốt với user): `DEC-004`, `DEC-088`, `DEC-099`, `DEC-100`, `DEC-101`, `DEC-102`, `DEC-103`, `DEC-104`. Các requirement khác được nhắc tới trong spec này dùng tiền tố US (viết tắt của "User Story") ghép số thứ tự, theo đúng quy ước đặt mã function của dự án.

## 3. Phạm Vi

- Ghi nhận mốc "Ngày nộp hồ sơ" khi một job chuyển đúng từ "Interested" sang "Waiting" (`BR-027`, `DEC-103`)
- Xoá mốc "Ngày nộp hồ sơ" khi job đó chuyển ngược từ "Waiting" về lại "Interested" (`BR-027`)
- Thêm trạng thái mới "Expired" vào danh sách Trạng thái (mở rộng từ 7 lên 8 giá trị); Dylan vẫn tự chọn/đổi tay được "Expired" như các trạng thái khác, bất kỳ lúc nào (`DEC-102`)
- Tự động chuyển Trạng thái một job thành "Expired" khi job đó đang "Interested" và Ngày hết hạn đã qua so với hôm nay (`BR-025`, `DEC-101`)
- Tự động chuyển Trạng thái một job thành "No Response" khi job đó đang "Waiting" và đã quá 7 ngày kể từ "Ngày nộp hồ sơ" mà Dylan chưa đổi sang trạng thái khác (`BR-026`)
- Cả hai luật tự động ở trên đều được kiểm tra và cập nhật lại ngay tại thời điểm dữ liệu bảng "Theo dõi CV ứng tuyển" được tải hoặc làm mới, không cần một tiến trình chạy nền riêng (`DEC-100`)

## 4. Ngoài Phạm Vi

- Lưu lại lịch sử đầy đủ mọi lần đổi trạng thái dạng nhiều dòng (log) — chỉ lưu đúng một mốc "Ngày nộp hồ sơ" (`DEC-099`)
- Áp dụng luật "Expired" cho các trạng thái khác ngoài "Interested" khi quá hạn (vd Waiting, No Response quá hạn vẫn giữ nguyên, không tự chuyển "Expired") (`DEC-101`)
- Xây dựng cơ chế chạy nền/lịch định kỳ độc lập với việc mở hoặc làm mới trang — luật tự động chỉ tính lại khi có người mở/làm mới bảng (`DEC-100`)
- Ghi/ghi đè mốc "Ngày nộp hồ sơ" khi job vào "Waiting" từ một trạng thái khác "Interested" (vd "No Response" → "Waiting") — chỉ đúng luồng Interested → Waiting mới ghi mốc (`DEC-103`)
- Tự động phục hồi trạng thái trước đó khi job đã "Expired" được sửa Ngày hết hạn sang tương lai — Dylan tự đổi tay nếu cần (`DEC-104`)
- Thay đổi các cột hoặc hành vi khác đã có của bảng "Theo dõi CV ứng tuyển" ngoài phạm vi Trạng thái và mốc "Ngày nộp hồ sơ" nêu trên (thuộc `US-018`)

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem mốc "Ngày nộp hồ sơ" và trạng thái "Expired"; tự đổi Trạng thái bất kỳ lúc nào, kể cả tự chọn "Expired" | Không tự nhập hay sửa tay mốc "Ngày nộp hồ sơ" — mốc này chỉ do hệ thống ghi/xoá theo `BR-027` | `docs/memory/decisions.md#dec-004`, `#dec-099`, `#dec-102` |

Hệ thống chỉ phục vụ một mình Dylan — không có vai trò nào khác, không đăng nhập/phân quyền (`DEC-004`).

## 6. Luồng Nghiệp Vụ

1. Dylan mở hoặc làm mới bảng "Theo dõi CV ứng tuyển" trên trang Roadmap.
2. Hệ thống kiểm tra từng job đang "Interested": nếu Ngày hết hạn đã qua so với hôm nay, Trạng thái job tự động đổi thành "Expired" (`BR-025`).
3. Hệ thống kiểm tra từng job đang "Waiting": nếu đã quá 7 ngày kể từ "Ngày nộp hồ sơ" của job đó mà chưa đổi sang trạng thái khác, Trạng thái job tự động đổi thành "No Response" (`BR-026`).
4. Dylan đổi Trạng thái một job đúng từ "Interested" sang "Waiting" → hệ thống ghi nhận thời điểm đổi là "Ngày nộp hồ sơ" của job đó (`BR-027`).
5. Dylan đổi Trạng thái một job từ "Waiting" ngược về "Interested" → hệ thống xoá mốc "Ngày nộp hồ sơ" đã ghi trước đó cho job này (`BR-027`).
6. Dylan vẫn có thể tự chọn "Expired" trong danh sách Trạng thái cho bất kỳ job nào, vào bất kỳ lúc nào, giống các trạng thái khác (`DEC-102`).

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Job đang ở trạng thái khác "Interested" (vd Waiting, No Response) dù Ngày hết hạn đã qua | Trạng thái giữ nguyên, không tự chuyển "Expired" (`DEC-101`) |
| Job chưa từng có mốc "Ngày nộp hồ sơ" (chưa từng chuyển đúng từ Interested sang Waiting) | Luật tự động "quá 7 ngày → No Response" không áp dụng cho job này, kể cả khi job đang "Waiting" |
| Dylan tự tay đổi Trạng thái sang khác trước khi đủ 7 ngày kể từ "Ngày nộp hồ sơ" | Job giữ đúng trạng thái Dylan vừa chọn, không bị hệ thống tự đổi thành "No Response" |
| Dylan đổi Trạng thái một job sang "Waiting" từ trạng thái khác "Interested" (vd No Response → Waiting) | Mốc "Ngày nộp hồ sơ" không được ghi mới cho lần chuyển này; nếu job từng có mốc cũ từ một lần Interested → Waiting trước đó, mốc cũ vẫn giữ nguyên cho tới khi job chuyển về "Interested" (`DEC-103`) |
| Job đã "Expired" được Dylan sửa Ngày hết hạn sang một ngày tương lai | Trạng thái vẫn giữ "Expired", hệ thống không tự đổi lại; Dylan tự chọn tay Trạng thái mới nếu muốn (`DEC-104`) |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Job "Nova Tech" đang có Trạng thái "Interested", Ngày hết hạn là một ngày đã qua so với hôm nay | Dylan mở trang Roadmap (hoặc làm mới dữ liệu bảng "Theo dõi CV ứng tuyển") | Trạng thái job "Nova Tech" hiển thị "Expired" | Xem ASCII Mockup mục 8.1 |
| AC-02 | Job "Beta Ltd" đang có Trạng thái "Waiting", Ngày hết hạn là một ngày đã qua so với hôm nay | Dylan mở trang Roadmap (hoặc làm mới dữ liệu bảng "Theo dõi CV ứng tuyển") | Trạng thái job "Beta Ltd" vẫn hiển thị "Waiting", không đổi thành "Expired" | Xem ASCII Mockup mục 8.1 |
| AC-03 | Job "Tech Corp" đang có Trạng thái "Interested", chưa có giá trị nào ở cột "Ngày nộp hồ sơ" | Dylan mở ô chọn Trạng thái của job "Tech Corp" và chọn "Waiting" | Trạng thái job đổi ngay thành "Waiting"; cột "Ngày nộp hồ sơ" của job đó hiển thị đúng thời điểm vừa đổi (ngày và giờ) | Xem ASCII Mockup mục 8.1 |
| AC-04 | Job "Tech Corp" đang có Trạng thái "Waiting", cột "Ngày nộp hồ sơ" đang hiển thị "10/08/2026 09:15" | Dylan mở ô chọn Trạng thái của job "Tech Corp" và chọn "Interested" | Trạng thái job đổi ngay thành "Interested"; cột "Ngày nộp hồ sơ" của job đó trống, không còn hiển thị giá trị cũ | Xem ASCII Mockup mục 8.1 |
| AC-05 | Job "Global Soft" đang có Trạng thái "Waiting", cột "Ngày nộp hồ sơ" hiển thị một thời điểm đã hơn 7 ngày trước so với hôm nay, chưa từng đổi trạng thái nào khác kể từ đó | Dylan mở trang Roadmap (hoặc làm mới dữ liệu bảng "Theo dõi CV ứng tuyển") | Trạng thái job "Global Soft" hiển thị "No Response" | Xem ASCII Mockup mục 8.1 |
| AC-06 | Job "Global Soft" đang có Trạng thái "Waiting", cột "Ngày nộp hồ sơ" hiển thị một thời điểm cách đây chưa tới 7 ngày | Dylan mở trang Roadmap (hoặc làm mới dữ liệu bảng "Theo dõi CV ứng tuyển") | Trạng thái job "Global Soft" vẫn hiển thị "Waiting", không đổi thành "No Response" | Xem ASCII Mockup mục 8.1 |
| AC-07 | Job "Delta Inc" đang có Trạng thái "No Response", đã từng có mốc "Ngày nộp hồ sơ" từ lần "Interested → Waiting" trước đó | Dylan mở ô chọn Trạng thái của job "Delta Inc" và chọn "Waiting" | Trạng thái job đổi ngay thành "Waiting"; cột "Ngày nộp hồ sơ" của job đó vẫn giữ nguyên giá trị cũ, không đổi thành thời điểm vừa thao tác | Xem ASCII Mockup mục 8.1 |
| AC-08 | Job "Beta Ltd" đang có Trạng thái bất kỳ (vd "No Response") | Dylan mở ô chọn Trạng thái của job "Beta Ltd" và chọn "Expired" | Trạng thái job "Beta Ltd" đổi ngay thành "Expired", được chấp nhận như mọi lựa chọn thủ công khác, không bị chặn | Xem ASCII Mockup mục 8.1 |
| AC-09 | Job "Omega Corp" đang có Trạng thái "Waiting" nhưng chưa từng chuyển đúng từ "Interested" sang "Waiting" (vd được tạo mới sẵn ở "Waiting", hoặc vào "Waiting" từ một trạng thái khác "Interested"), cột "Ngày nộp hồ sơ" đang trống | Dylan mở trang Roadmap (hoặc làm mới dữ liệu bảng "Theo dõi CV ứng tuyển") | Trạng thái job "Omega Corp" vẫn hiển thị "Waiting", không tự động đổi thành "No Response" dù đã ở trạng thái này bao lâu; cột "Ngày nộp hồ sơ" vẫn trống | Xem ASCII Mockup mục 8.1 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì tham chiếu khối ASCII Mockup ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

Liệt kê mọi thành phần màn hình mà requirement này chạm tới.

### 8.1. Bảng theo dõi CV ứng tuyển — `Trang Roadmap`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-06 | Cột "Trạng thái" | Column | "Trạng thái" | Trạng thái (Job ứng tuyển) | **Đổi hành vi so với `US-018`**. Ô chọn mở rộng từ 7 lên 8 giá trị cố định: Interested/Waiting/No Response/Response/Appointment/Cancel/Fail/Expired; Dylan vẫn chọn tự do bất kỳ giá trị nào tại mọi thời điểm, không ràng buộc thứ tự (kế thừa từ `US-018`); riêng "Expired" còn được hệ thống tự động gán theo `BR-025`, và "No Response" còn được tự động gán theo `BR-026` — cả hai chỉ tính lại khi bảng được tải/làm mới | Dylan | AC-01, AC-02, AC-05, AC-06, AC-07, AC-08, AC-09 | [`US-018`](../US-018-theo-doi-cv-ung-tuyen/spec.md) — mở rộng `EL-06` gốc (7 giá trị) |
| EL-10 | Cột "Ngày nộp hồ sơ" | Column | "Ngày nộp hồ sơ" | Mốc Ngày nộp hồ sơ (Job ứng tuyển) | **Element mới**. Chỉ đọc — Dylan không tự nhập/sửa tay được; hệ thống tự ghi giá trị (ngày và giờ) khi job chuyển đúng từ "Interested" sang "Waiting" (`BR-027`); tự xoá (hiển thị trống) khi job chuyển ngược từ "Waiting" về "Interested"; khi job vào "Waiting" từ trạng thái khác "Interested" thì giữ nguyên giá trị đang có (mới hoặc trống), không ghi đè (`DEC-103`) | Dylan | AC-03, AC-04, AC-07, AC-09 | Không |

**ASCII Mockup**

```text
+-----------------------------------------------------------------------------------------------------------------------------+
| Theo dõi CV ứng tuyển                                                                                                         |
+-----------------------------------------------------------------------------------------------------------------------------+
| Công ty    | Ngày hết hạn v| Platform  v | Link                | Trạng thái    v| Ngày nộp hồ sơ    | Ghi chú     |     |
+-----------------------------------------------------------------------------------------------------------------------------+
| Tech Corp  | 30/09/2026    | LinkedIn    | linkedin.../123      | [Waiting    v] | 10/08/2026 09:15  | Giới thiệu  |  X  |
| Nova Tech  | 01/08/2026    | ITViec      | itviec.../456        | [Expired    v] | -                 | -           |  X  |
| Beta Ltd   | 20/09/2026    | VietNamWork | vietnamworks.../789  | [No Response v]| 01/08/2026 14:30  | -           |  X  |
+-----------------------------------------------------------------------------------------------------------------------------+
|                                                                                                          [+ Thêm job]         |
+-----------------------------------------------------------------------------------------------------------------------------+

Ô chọn Trạng thái khi mở ra (8 giá trị):
+----------------+
| Interested     |
| Waiting        |
| No Response    |
| Response       |
| Appointment    |
| Cancel         |
| Fail           |
| Expired        |
+----------------+
```

Cột "Ngày nộp hồ sơ" (`EL-10`) hiển thị ngày giờ khi job đã từng chuyển Interested → Waiting (hàng "Tech Corp", "Beta Ltd"), và để trống (`-`) khi chưa từng có mốc đó (hàng "Nova Tech" — job này quá hạn ngay từ "Interested" nên tự chuyển "Expired" mà chưa từng qua "Waiting"). Ô chọn Trạng thái (`EL-06`) minh họa đủ 8 giá trị, gồm "Expired" mới thêm ở cuối danh sách.

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Button`: nêu rõ điều kiện bật/tắt và điều gì xảy ra sau khi bấm.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Job ứng tuyển | Sửa (mở rộng: thêm mốc "Ngày nộp hồ sơ", thêm giá trị Trạng thái "Expired") | Có | Lưu bền vững vào database, kế thừa cách lưu trữ đã có từ `US-018` |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) | Dữ liệu, Phạm vi | Không | `Ready for DEV` |

`US-020` mở rộng trực tiếp entity Job ứng tuyển và bảng "Theo dõi CV ứng tuyển" mà `US-018` đã tạo — không triển khai độc lập được, nhưng `US-018` đã `Ready for DEV` nên không chặn tiến độ của `US-020`. Đã rà toàn bộ 14 spec hiện có trong `docs/features/` (`US-001` đến `US-019`, trừ `US-007`, `US-008`, `US-009`, `US-011` chưa có spec và `US-013` đã gộp vào `US-006`) — không có phụ thuộc nào khác ngoài `US-018` (`US-019` quản lý "Item cần mua" gắn theo tháng ngân sách, không liên quan tới Job ứng tuyển hay trang Roadmap).

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) | Mục 6 (luồng nghiệp vụ, bước 4), mục 7 (AC-05), mục 8.1 (`EL-06`) | `EL-06` | Không | `EL-06` của `US-018` mô tả Trạng thái có 7 giá trị — sau khi `US-020` triển khai, nên ghi chú bổ sung ở đó rằng danh sách nay có 8 giá trị (đã mở rộng bởi `US-020`), để người đọc `US-018` không nhầm là danh sách vẫn chỉ có 7. Không chặn triển khai `US-020` vì đây chỉ là cập nhật tài liệu tham chiếu, không đổi hành vi của `US-018` |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md`](../../kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-020-lich-su-trang-thai-job.md`](../../kb/ba/wiki/delivery/pbi/US-020-lich-su-trang-thai-job.md) | Điền đầy đủ User Story và 9 AC từ spec này (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/data/entity/ENT-004-job-ung-tuyen.md`](../../kb/ba/wiki/data/entity/ENT-004-job-ung-tuyen.md) | Đã cập nhật ở bước ingest (mốc "Ngày nộp hồ sơ", trạng thái "Expired") — xác nhận đúng khi sync |

Memory: 4 quyết định chốt qua dialog trong `ssr-raw` (`DEC-099`..`DEC-102`, 2026-08-14) và 2 quyết định chốt qua dialog trong `ssr-ba` (`DEC-103`, `DEC-104`, 2026-08-14). Thuật ngữ nghiệp vụ mới "Ngày nộp hồ sơ" đã thêm vào `glossary.md` ở bước `ssr-raw`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Roadmap — bảng "Theo dõi CV ứng tuyển" đã có từ `US-018`: mở rộng cột "Trạng thái" (7 → 8 giá trị) và thêm cột mới "Ngày nộp hồ sơ" |
| Thực thể dữ liệu nào bị chạm | Job ứng tuyển (mở rộng — thêm mốc "Ngày nộp hồ sơ", thêm giá trị Trạng thái "Expired") |
| Cần thay đổi cấu trúc dữ liệu | Có — thêm một trường lưu mốc thời gian "Ngày nộp hồ sơ" trên cấu trúc Job ứng tuyển đã có từ `US-018`; giao `ssr-data` khi `ssr-plan` tới lượt |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Có |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Lịch sử trạng thái chỉ lưu đúng một mốc "Ngày nộp hồ sơ", không lưu log đầy đủ mọi lần đổi trạng thái | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-14 (`docs/memory/decisions.md#dec-099`) | Nếu sai, cần thiết kế lại mục 6, 7, 8, 9 theo hướng lưu log nhiều dòng thay vì một mốc |
| A2 | Luật tự động (Expired, No Response) tính lại mỗi khi dữ liệu bảng được tải/làm mới, không cần một tiến trình chạy nền riêng | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-14 (`docs/memory/decisions.md#dec-100`) | Nếu sai, cần thiết kế thêm cơ chế chạy nền — vượt phạm vi kỹ thuật hiện có của ứng dụng |
| A3 | "Expired" chỉ tự động áp dụng khi job đang "Interested"; các trạng thái khác dù quá hạn vẫn giữ nguyên | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-14 (`docs/memory/decisions.md#dec-101`) | Nếu sai, cần mở rộng `BR-025`, AC-02 cho Waiting/No Response quá hạn |
| A4 | "Expired" vẫn xuất hiện trong danh sách Trạng thái để Dylan tự chọn tay, không bị ẩn | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-14 (`docs/memory/decisions.md#dec-102`) | Nếu sai, cần ẩn "Expired" khỏi `EL-06`, bỏ AC-08 |
| A5 | Mốc "Ngày nộp hồ sơ" chỉ được ghi/ghi đè khi job chuyển đúng từ "Interested" sang "Waiting"; vào Waiting từ trạng thái khác không ghi mới, mốc cũ (nếu có) vẫn giữ nguyên | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-14 (`docs/memory/decisions.md#dec-103`) | Nếu sai, `BR-026`/`BR-027` cần đổi để ghi mốc mới cho mọi lần vào Waiting bất kể xuất phát từ đâu — ảnh hưởng mục 6, `EL-10`, AC-07 |
| A6 | Job đã "Expired" mà Dylan sửa "Ngày hết hạn" sang một ngày tương lai thì hệ thống không tự phục hồi trạng thái trước đó — Dylan tự đổi tay nếu cần | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-14 (`docs/memory/decisions.md#dec-104`) | Nếu sai, cần thêm luật tự động phục hồi trạng thái ở `BR-025`, mục 6 |
| A7 | Khi job chuyển từ "Waiting" sang một trạng thái khác "Interested" (No Response, Response, Appointment, Cancel, Fail), mốc "Ngày nộp hồ sơ" được giữ nguyên, không bị xoá | Giả định hợp lý — raw chỉ nêu rõ xoá mốc khi chuyển ngược về "Interested" (`docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 4, Q5), chưa hỏi trực tiếp trường hợp này | Nếu sai, cần mở rộng điều kiện xoá mốc ở `BR-027`, mục 6, `EL-10` |
| A8 | Mốc "Ngày nộp hồ sơ" hiển thị đầy đủ ngày và giờ (định dạng tương tự `DD/MM/YYYY HH:mm`), khác với "Ngày hết hạn" chỉ có ngày | Giả định hợp lý — theo đúng ví dụ nguyên văn trong raw (`docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 2: "DD/MM/YYYY HH:MM") | Nếu sai (chỉ cần ngày, không cần giờ), cần đổi định dạng hiển thị ở `EL-10`, AC-03, AC-04, AC-07 |
