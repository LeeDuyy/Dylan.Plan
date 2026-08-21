# Chặn trùng tên danh mục

Status: Ready for DEV
Feature: US-010
Created: 2026-08-10
Updated: 2026-08-10
Raw Source: `docs/kb/ba/raw/US-010-chan-trung-ten-danh-muc.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-010-chan-trung-ten-danh-muc.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, bảng danh mục không kiểm tra trùng tên khi Dylan thêm mới hoặc sửa tên một danh mục — có thể tồn tại hai danh mục cùng tên trong một tháng (kể cả khi Dylan bấm nút "Thêm danh mục" nhiều lần liên tiếp mà chưa đổi tên, vì danh mục mới luôn được tạo với tên mặc định giống nhau). Việc này gây khó xác định khi ghi nhận chi tiêu bằng nhập nhanh nên gán giao dịch vào danh mục nào trong hai danh mục trùng tên.

Sau thay đổi này, hệ thống chặn và báo lỗi rõ ràng ngay khi Dylan cố tạo ra tên trùng — dù là do tự gõ tên khi sửa, hay do bấm "Thêm danh mục" trong khi tên mặc định đã trùng với một danh mục có sẵn. Dylan luôn biết ngay vì sao thao tác không thực hiện được và phải làm gì tiếp (đổi tên danh mục đang trùng).

Giá trị đo được: Tháng đang chọn đã có danh mục "Ăn uống". Dylan sửa tên một danh mục khác thành " ăn uống" (khác hoa/thường, có khoảng trắng thừa) — thao tác bị chặn ngay, hiện thông báo lỗi nêu rõ tên đã tồn tại, và bảng danh mục của tháng đó không bao giờ có hai dòng cùng tên (theo cách so sánh đã chuẩn hóa).

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-010-chan-trung-ten-danh-muc.md`](../../kb/ba/wiki/knowledge/feature/US-010-chan-trung-ten-danh-muc.md) | Mục tiêu, phạm vi, luồng nghiệp vụ, business rule |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-017-chan-trung-ten-danh-muc.md`](../../kb/ba/wiki/knowledge/business-rule/BR-017-chan-trung-ten-danh-muc.md) | Nội dung rule chặn trùng tên, ngoại lệ "Chi tiêu khác" |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md`](../../kb/ba/wiki/knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md) | "Chi tiêu khác" khóa vĩnh viễn, không có thao tác sửa tên |
| [`docs/kb/ba/wiki/data/entity/ENT-002-danh-muc.md`](../../kb/ba/wiki/data/entity/ENT-002-danh-muc.md) | Định nghĩa và ràng buộc hiện có của thực thể Danh mục |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, luồng F1-F2, gap #10 |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`. Các quyết định liên quan mang mã DEC (viết tắt của "Decision", mã quyết định đã chốt với user): `DEC-004`, `DEC-020`, `DEC-021`, `DEC-022`, `DEC-027`, `DEC-068`.

## 3. Phạm Vi

- Kiểm tra trùng tên khi Dylan sửa tên một danh mục đã có, ngay khi rời khỏi ô nhập tên
- Kiểm tra trùng tên khi Dylan bấm "Thêm danh mục" — kể cả khi tên trùng là tên mặc định do hệ thống tự đặt (chưa được Dylan đổi)
- So sánh chuẩn hóa: bỏ qua khác biệt hoa/thường, khoảng trắng thừa ở đầu/cuối chuỗi, và rút gọn mọi dãy khoảng trắng liên tiếp ở giữa chuỗi thành một khoảng trắng trước khi so sánh (`DEC-022`, `DEC-069`)
- Phạm vi kiểm tra: chỉ tính các danh mục khác trong cùng tháng đang chọn — hai danh mục cùng tên ở hai tháng khác nhau không bị chặn
- Khi phát hiện trùng: chặn thao tác, hiện thông báo lỗi rõ ràng nêu tên đang trùng; không tự động đổi tên hay thêm hậu tố phân biệt

## 4. Ngoài Phạm Vi

- Áp dụng ràng buộc này cho "Chi tiêu khác" — danh mục này khóa vĩnh viễn, không có thao tác sửa tên (`DEC-027`)
- Đổi cơ chế nút "Thêm danh mục" (vẫn tạo ngay với tên mặc định "Danh mục mới", không chuyển sang bắt Dylan nhập tên trước khi lưu — `DEC-068`)
- Cấu hình ngưỡng cảnh báo/mục tiêu chi — thuộc requirement riêng khác, gọi bằng mã US (viết tắt của "User Story", cách đặt mã function của dự án) là `US-009`
- Xóa danh mục, "Chi tiêu khác" tự sinh khi xóa/ghi nhận không chọn danh mục — đã triển khai ở `US-005`, không đổi ở phạm vi requirement này

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Thêm danh mục mới, sửa tên danh mục thường đã có | Tạo hoặc đổi tên một danh mục thành tên đã trùng (đã chuẩn hóa) với danh mục khác trong cùng tháng; sửa tên "Chi tiêu khác" | `docs/memory/decisions.md#dec-020`, `#dec-021`, `#dec-027` |

## 6. Luồng Nghiệp Vụ

1. Dylan gõ tên mới vào ô nhập tên của một danh mục đã có, rồi rời khỏi ô nhập (bấm sang chỗ khác hoặc sang trường khác).
2. Hệ thống chuẩn hóa tên vừa nhập (bỏ khoảng trắng thừa đầu/cuối, coi hoa/thường là như nhau) rồi so với tên của các danh mục khác trong cùng tháng đang chọn.
3. Không trùng — tên mới được lưu lại bình thường, không có thông báo gì thêm.
4. Trùng với một danh mục khác — thao tác sửa bị chặn: ô nhập tên trở lại đúng tên trước khi sửa; hiện thông báo lỗi nêu rõ tên đang trùng và yêu cầu Dylan đổi tên khác.
5. Dylan bấm nút "Thêm danh mục". Hệ thống kiểm tra tên mặc định "Danh mục mới" theo cách chuẩn hóa ở bước 2 với các danh mục hiện có trong tháng đang chọn.
6. Tên mặc định chưa trùng — danh mục mới xuất hiện ngay trên bảng với tên "Danh mục mới", sẵn sàng để Dylan sửa tên.
7. Tên mặc định đã trùng (còn một danh mục "Danh mục mới" khác chưa được đổi tên) — thao tác thêm bị chặn: không có danh mục mới nào xuất hiện; hiện thông báo lỗi yêu cầu Dylan đổi tên danh mục "Danh mục mới" đang có trước khi thêm cái mới.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Tháng đang chọn chỉ có một danh mục duy nhất — sửa tên danh mục đó thành bất kỳ tên nào cũng luôn lưu được ngay, vì không có danh mục khác nào để so sánh. Riêng thao tác bấm "Thêm danh mục" vẫn áp dụng đúng quy tắc so trùng bình thường với danh mục duy nhất đang có (xem bước 5-7 ở trên) — nếu danh mục duy nhất đó đang mang đúng tên mặc định "Danh mục mới" chưa đổi, bấm thêm vẫn bị chặn như AC-02 |
| Không đủ quyền | Không áp dụng — hệ thống chỉ có một người dùng |
| Dữ liệu trùng | Dylan sửa tên một danh mục nhưng giữ nguyên đúng tên cũ (không đổi ý nghĩa) — không bị coi là trùng với chính nó, lưu thành công |
| Hệ thống lỗi | Có lỗi khác xảy ra khi lưu (không liên quan tới trùng tên) — hiện thông báo lỗi chung đã có sẵn của ứng dụng, không phải thông báo trùng tên |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Tháng đang chọn đã có danh mục "Ăn uống" | Dylan sửa tên một danh mục khác ("Di chuyển") thành " ăn uống" (có khoảng trắng thừa đầu, chữ thường) rồi rời khỏi ô nhập | Ô nhập tên trở lại "Di chuyển" (tên trước khi sửa); thông báo lỗi hiện ra nêu rõ tên "ăn uống" đã tồn tại trong tháng này và yêu cầu đổi tên khác; danh mục "Di chuyển" không đổi tên trên bảng | Xem ASCII Mockup mục 8.1 |
| AC-02 | Tháng đang chọn đã có một danh mục tên "Danh mục mới" (vừa thêm, chưa đổi tên) | Dylan bấm nút "Thêm danh mục" một lần nữa | Không có dòng danh mục mới nào xuất hiện thêm trên bảng; thông báo lỗi hiện ra nêu rõ đã có danh mục "Danh mục mới" trong tháng này và yêu cầu đổi tên danh mục đó trước khi thêm mới | Xem ASCII Mockup mục 8.1 |
| AC-03 | Danh mục "Ăn uống" của tháng đang chọn đang hiển thị | Dylan bấm vào ô nhập tên của chính danh mục "Ăn uống", không đổi ký tự nào, rồi rời khỏi ô nhập | Ô nhập vẫn hiển thị "Ăn uống"; không có thông báo lỗi nào hiện ra trên màn hình | Xem ASCII Mockup mục 8.1 |
| AC-04 | Tháng đang chọn có danh mục "Ăn uống", chưa có danh mục tên "Giải trí" | Dylan sửa tên một danh mục khác thành "Giải trí" rồi rời khỏi ô nhập | Ô nhập hiển thị đúng "Giải trí" trên dòng danh mục đó; không có thông báo lỗi nào hiện ra trên màn hình | Xem ASCII Mockup mục 8.1 |
| AC-05 | Tháng 08/2026 đang có danh mục "Ăn uống"; tháng 09/2026 (khác tháng) cũng đang có danh mục "Ăn uống" | Dylan đang xem tháng 09/2026, thêm một danh mục mới rồi đổi tên nó thành "Ăn uống" | Ô nhập hiển thị đúng "Ăn uống" trên dòng danh mục vừa đổi tên ở tháng 09/2026; không có thông báo lỗi nào hiện ra trên màn hình, dù tháng 08/2026 đã có tên này | Xem ASCII Mockup mục 8.1 |
| AC-06 | Tháng đang chọn chỉ có duy nhất một danh mục "Ăn uống" (không có danh mục nào khác) | Dylan sửa tên danh mục đó thành "Chi tiêu vặt" rồi rời khỏi ô nhập | Ô nhập hiển thị đúng "Chi tiêu vặt"; lưu thành công ngay, không có thông báo lỗi nào hiện ra trên màn hình, vì không có danh mục khác trong tháng để so trùng | Xem ASCII Mockup mục 8.1 |
| AC-07 | Tháng đang chọn đã có danh mục "Ăn uống" (một khoảng trắng giữa hai từ) | Dylan sửa tên một danh mục khác thành "Ăn  uống" (hai khoảng trắng liền giữa hai từ) rồi rời khỏi ô nhập | Ô nhập tên trở lại tên trước khi sửa; thông báo lỗi hiện ra nêu rõ tên "Ăn uống" đã tồn tại trong tháng này và yêu cầu đổi tên khác — hai khoảng trắng liền được rút gọn thành một trước khi so sánh nên vẫn bị coi là trùng | Xem ASCII Mockup mục 8.1 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì tham chiếu khối ASCII Mockup ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

Liệt kê mọi thành phần màn hình mà requirement này chạm tới.

### 8.1. Bảng ngân sách theo danh mục — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Ô nhập "Tên danh mục" | Input | (ô nhập trực tiếp trên dòng danh mục, không có nhãn riêng) | `Tên` của danh mục thường | **Đổi hành vi so với hiện tại**: khi Dylan rời khỏi ô nhập (đã đổi tên), hệ thống so tên mới (đã chuẩn hóa hoa/thường, khoảng trắng thừa đầu/cuối, và rút gọn khoảng trắng lặp ở giữa — `DEC-022`, `DEC-069`) với các danh mục khác trong cùng tháng; trùng thì chặn lưu, ô nhập trở lại tên trước khi sửa, hiện `EL-03`; không trùng hoặc giữ nguyên tên cũ thì lưu bình thường, không hiện gì thêm. Không áp dụng cho "Chi tiêu khác" — ô này không hiển thị trên dòng của nó (`BR-010`) | Dylan | AC-01, AC-03, AC-04, AC-05, AC-06, AC-07 | Không |
| EL-02 | Nút "Thêm danh mục" | Button | "Thêm danh mục" | — | **Đổi hành vi so với hiện tại**: trước khi thêm, hệ thống so tên mặc định "Danh mục mới" (đã chuẩn hóa cùng quy tắc với `EL-01`) với các danh mục khác trong cùng tháng; trùng thì chặn thêm, không có dòng mới nào xuất hiện, hiện `EL-03`; không trùng thì thêm ngay một dòng danh mục mới tên "Danh mục mới" như hiện tại | Dylan | AC-02 | Không |
| EL-03 | Thông báo lỗi trùng tên danh mục | Toast | Tên danh mục đang trùng, kèm yêu cầu đổi tên khác (vd "Tên 'ăn uống' đã tồn tại trong tháng này. Vui lòng đổi tên khác." hoặc "Đã có danh mục 'Danh mục mới' trong tháng này. Hãy đổi tên danh mục đó trước khi thêm mới.") | Kết quả kiểm tra trùng tên của thao tác sửa tên (`EL-01`) hoặc thêm mới (`EL-02`) vừa thực hiện | **Mới thêm** — dùng lại đúng cơ chế toast đã có sẵn trong ứng dụng (như toast báo kết quả xóa danh mục); hiện ngay sau khi thao tác bị chặn; tự đóng sau vài giây mà không cần Dylan thao tác gì thêm | Dylan | AC-01, AC-02 | Không |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| Danh mục         Loại       Ngân sách   Chi thực tế  Còn lại    |
+----------------------------------------------------------------+
| [Di chuyển___]  [Linh hoạt] [1,500,000]  30.000 đ     1.470.000 [🗑]
| [Ăn uống_____]  [Linh hoạt] [4,000,000]  0 đ          4.000.000 [🗑]
| Chi tiêu khác    Linh hoạt   0 đ         200.000 đ    -200.000
+----------------------------------------------------------------+
|                                                [+ Thêm danh mục] |
+----------------------------------------------------------------+
| ✕ Tên 'ăn uống' đã tồn tại trong tháng này. Vui lòng đổi tên     |
|   khác.                                                          |
+----------------------------------------------------------------+
```

Nội dung toast trong mockup này minh họa trường hợp sửa tên bị chặn ở AC-01. Trường hợp bấm "Thêm danh mục" bị chặn ở AC-02 dùng cùng vị trí toast, nội dung khác — xem cột Then của AC-02.

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Button`: nêu rõ điều kiện bật/tắt và điều gì xảy ra sau khi bấm.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Danh mục | Thêm ràng buộc: không được trùng tên (đã chuẩn hóa hoa/thường và khoảng trắng thừa) với danh mục khác trong cùng tháng | Có | Không đổi cách lưu trữ hiện có — chỉ thêm bước kiểm tra trước khi ghi |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng (`US-008`) |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — cần data model bền vững để áp ràng buộc | Implemented |
| [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Hành vi màn hình | Không (đã Delivered) — cần dòng "Chi tiêu khác" đã hiển thị dạng chỉ đọc (không có ô nhập tên) để việc loại trừ nó khỏi phạm vi kiểm tra trùng tên (`EL-01`) có ý nghĩa | Implemented |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Không có AC nào bị đổi — US-005 không thao tác sửa tên hay thêm danh mục | Dùng chung màn hình bảng danh mục (mục 8.2 của US-005) nhưng không chung element cụ thể nào | Không | Không cần sửa — nút "Xóa danh mục" (`EL-03` của US-005) và dòng "Chi tiêu khác" (`EL-02` của US-005) không bị ràng buộc trùng tên này chi phối |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-010-chan-trung-ten-danh-muc.md`](../../kb/ba/wiki/knowledge/feature/US-010-chan-trung-ten-danh-muc.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-010-chan-trung-ten-danh-muc.md`](../../kb/ba/wiki/delivery/pbi/US-010-chan-trung-ten-danh-muc.md) | Điền đầy đủ User Story và 7 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory cần ghi: 2 quyết định user chốt qua dialog (áp dụng ràng buộc trùng tên cho cả tên mặc định của nút "Thêm danh mục"; mở rộng quy tắc chuẩn hóa rút gọn khoảng trắng lặp ở giữa) → đã ghi thành `DEC-068`, `DEC-069` vào `decisions.md`. Không có thuật ngữ nghiệp vụ mới phát sinh ngoài những gì đã có trong `glossary.md`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi (`/budget`) — bảng ngân sách theo danh mục (ô nhập tên danh mục, nút "Thêm danh mục") |
| Thực thể dữ liệu nào bị chạm | Danh mục (thêm điều kiện kiểm tra trước khi ghi tên) |
| Cần thay đổi cấu trúc dữ liệu | Không — kiểm tra trùng tên (đã chuẩn hóa) thực hiện được bằng cách so với danh sách danh mục hiện có của tháng, không cần thêm cột hay bảng mới. Nếu `ssr-plan` thấy cần một ràng buộc chặt hơn ở tầng lưu trữ thì đó là lựa chọn kỹ thuật, không phải yêu cầu bắt buộc của spec này |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Ràng buộc trùng tên áp dụng cho cả thêm mới và sửa tên, trong phạm vi tháng đang chọn | Đã xác nhận từ knowledge — `docs/memory/decisions.md#dec-020` | Nếu sai, cần thu hẹp hoặc mở rộng phạm vi kiểm tra ở mục 3, AC-05 |
| A2 | Khi trùng tên: chặn thao tác, báo lỗi rõ ràng, không tự động đổi tên hay thêm hậu tố | Đã xác nhận từ knowledge — `docs/memory/decisions.md#dec-021` | Nếu sai, cần đổi cách xử lý ở mục 6, mục 8.1 EL-03 |
| A3 | So sánh trùng tên bỏ qua khác biệt hoa/thường, khoảng trắng thừa đầu/cuối, và rút gọn khoảng trắng lặp ở giữa chuỗi | Đã xác nhận từ knowledge — `docs/memory/decisions.md#dec-022`, `#dec-069` | Nếu sai, cần đổi cách chuẩn hóa ở mục 3, AC-01, AC-07 |
| A4 | Nút "Thêm danh mục" áp dụng đúng ràng buộc trùng tên cho cả tên mặc định "Danh mục mới", không đổi cơ chế nút này sang bắt nhập tên trước khi lưu | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-10 (`DEC-068`) | Nếu sai, cần thiết kế lại luồng thêm danh mục ở mục 6 bước 5-7, mục 8.1 EL-02, AC-02 |
| A5 | Ngoài bỏ khoảng trắng thừa đầu/cuối và khác biệt hoa/thường (`DEC-022`), quy tắc chuẩn hóa còn rút gọn mọi dãy khoảng trắng liên tiếp ở giữa chuỗi thành một khoảng trắng trước khi so sánh — "Ăn  uống" (hai khoảng trắng liền) và "Ăn uống" được coi là trùng | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-10 (`DEC-069`), theo đề xuất của `ba-expert` | Nếu sai, cần bỏ quy tắc rút gọn khoảng trắng giữa ở mục 3, mục 8.1 EL-01/EL-02, AC-07 |
