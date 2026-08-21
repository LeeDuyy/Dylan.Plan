# Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi

Status: Ready for DEV
Feature: US-012
Created: 2026-08-06
Updated: 2026-08-06
Raw Source: `docs/kb/ba/raw/US-012-sua-loi-nhan-dien-danh-muc.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, khi Dylan gõ nội dung nhập nhanh khớp đúng một nhóm chi tiêu quen thuộc (ví dụ "ăn tối 300k" nhận diện đúng nhóm "Ăn uống"), nhưng danh mục thật trong tháng đã bị Dylan đổi tên (ví dụ đổi thành "Ăn uống & đi chợ"), hệ thống **âm thầm không ghi nhận gì cả** — không lưu giao dịch, không hiện lỗi. Dylan tưởng đã ghi nhận xong nhưng thực ra mất trắng một giao dịch, chỉ phát hiện ra khi xem lại tổng chi và thấy thiếu.

Sau thay đổi này, hệ thống luôn ghi nhận được giao dịch trong tình huống trên: ưu tiên tìm đúng danh mục Dylan đã đổi tên (dựa vào việc tên danh mục có chứa cụm từ của nhóm chi tiêu đã nhận diện), nếu vẫn không tìm ra thì tự động chuyển sang danh mục dự phòng "Chi tiêu khác" — giống hệt cách xử lý khi nội dung không khớp nhóm nào cả (đã có từ trước). Không còn tình huống nào giao dịch bị mất mà Dylan không hay biết.

Giá trị đo được: Dylan đổi tên danh mục "Ăn uống" thành "Ăn uống & đi chợ", sau đó gõ "ăn tối 300k" và bấm "Ghi nhận" — giao dịch xuất hiện ngay trong danh sách giao dịch của tháng, gắn đúng danh mục "Ăn uống & đi chợ", và "Chi thực tế" của danh mục đó tăng thêm 300.000đ. Không còn trường hợp bấm "Ghi nhận" mà không có chuyện gì xảy ra.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md`](../../kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md) | Mục tiêu, phạm vi, luồng nghiệp vụ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-013-so-khop-gan-dung-danh-muc.md`](../../kb/ba/wiki/knowledge/business-rule/BR-013-so-khop-gan-dung-danh-muc.md) | So khớp gần đúng trước khi coi là không xác định được |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-011-bo-qua-danh-muc.md`](../../kb/ba/wiki/knowledge/business-rule/BR-011-bo-qua-danh-muc.md) | Không xác định được thì tự vào "Chi tiêu khác" (đã có từ US-005) |
| [`docs/kb/ba/wiki/data/entity/ENT-002-danh-muc.md`](../../kb/ba/wiki/data/entity/ENT-002-danh-muc.md) | Ràng buộc của thực thể Danh mục |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, luồng F1, gap #12 |
| [`docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md`](../../po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md) | Bằng chứng tái hiện defect thật (PO-01, PO-02) |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md` (lưu các quyết định đã chốt với user, gọi bằng mã DEC (viết tắt của "Decision") — cụ thể là `DEC-059`, `DEC-060`), `glossary.md`.

## 3. Phạm Vi

- Khi nội dung nhập nhanh khớp từ khóa của một nhóm chi tiêu, nhưng không có danh mục nào trong tháng đang chọn mang đúng tên gốc của nhóm đó (vì đã bị Dylan đổi tên), hệ thống thử tìm một danh mục mà tên của nó có chứa tên nhóm, hoặc tên nhóm có chứa tên danh mục — tìm thấy thì tự động chọn đúng danh mục đó
- Ô chọn danh mục hiển thị đúng danh mục vừa tìm được ở bước trên (không còn hiển thị sai thành "Chưa xác định" trong khi thực ra đã nhận diện được)
- Nếu có nhiều hơn một danh mục cùng khớp theo cách trên, chọn danh mục đầu tiên theo đúng thứ tự đang hiển thị trên bảng ngân sách
- Nếu không tìm ra danh mục nào theo cách trên (kể cả sau khi thử so khớp), giao dịch tự động chuyển sang "Chi tiêu khác" — giữ nguyên đúng hành vi đã có khi nội dung không khớp nhóm nào cả
- Trường hợp tên danh mục chưa từng bị đổi (vẫn khớp đúng tên gốc) — hành vi giữ nguyên như hiện tại, không đổi gì

## 4. Ngoài Phạm Vi

- Đổi danh sách nhóm chi tiêu hoặc từ khóa nhận diện hiện có — không thuộc requirement này
- Chặn hoặc cảnh báo Dylan khi đổi tên một danh mục mặc định — không yêu cầu, Dylan vẫn đổi tên tự do như hiện tại
- Sửa/xóa từng giao dịch riêng lẻ — đã triển khai ở requirement mã US (viết tắt của "User Story", cách đặt mã function của dự án) `US-004`, không đổi ở phạm vi requirement này
- Cơ chế tự sinh và ẩn/hiện "Chi tiêu khác" — đã triển khai ở `US-005`, dùng lại nguyên trạng

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Ghi nhận chi tiêu qua ô nhập nhanh, luôn được ghi nhận thành công dù có đổi tên danh mục hay không | Không áp dụng — hệ thống chỉ một người dùng | `docs/memory/decisions.md#dec-004` |

## 6. Luồng Nghiệp Vụ

1. Dylan gõ nội dung tự nhiên vào ô nhập nhanh (ví dụ "ăn tối 300k").
2. Nội dung khớp từ khóa của một nhóm chi tiêu quen thuộc (ví dụ nhóm "Ăn uống").
3. Hệ thống tìm trong tháng đang chọn một danh mục mang đúng tên nhóm — không thấy (vì Dylan đã đổi tên danh mục đó thành "Ăn uống & đi chợ").
4. Hệ thống thử so khớp gần đúng: tìm danh mục có tên chứa cụm "Ăn uống" — tìm thấy "Ăn uống & đi chợ".
5. Ô chọn danh mục tự động hiển thị "Ăn uống & đi chợ" (không phải "Chưa xác định").
6. Dylan bấm "Ghi nhận" — giao dịch được lưu, gắn đúng danh mục "Ăn uống & đi chợ", "Chi thực tế" của danh mục đó tăng đúng số tiền.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| So khớp gần đúng cũng không tìm ra danh mục nào | Ô chọn danh mục hiển thị "Chưa xác định"; Dylan vẫn bấm "Ghi nhận" được, giao dịch tự vào "Chi tiêu khác" — đúng hành vi đã có từ trước (không khớp nhóm nào) |
| So khớp gần đúng tìm ra nhiều hơn một danh mục cùng khớp | Chọn danh mục đầu tiên theo đúng thứ tự đang hiển thị trên bảng ngân sách |
| Tên danh mục chưa từng bị đổi | Không có gì thay đổi — hệ thống tìm thấy ngay danh mục đúng tên tuyệt đối như trước giờ |
| Không có dữ liệu | Tháng đang chọn chưa có danh mục nào — ô chọn danh mục hiển thị "Chưa xác định", ghi nhận vẫn thành công vào "Chi tiêu khác" |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Tháng đang chọn có danh mục tên "Ăn uống & đi chợ" (đã đổi tên từ "Ăn uống"), chưa có giao dịch nào trong danh mục này | Dylan gõ "ăn tối 300k" vào ô nhập nhanh, xem ô chọn danh mục, rồi bấm "Ghi nhận" | Ô chọn danh mục tự động hiển thị "Ăn uống & đi chợ" (không phải "Chưa xác định"); sau khi bấm "Ghi nhận", giao dịch "ăn tối 300k" xuất hiện trong danh sách giao dịch của tháng, gắn danh mục "Ăn uống & đi chợ"; "Chi thực tế" của "Ăn uống & đi chợ" tăng thêm 300.000đ | Chưa có — chưa có mockup ảnh/design cho ô nhập nhanh, xem mô tả hành vi ở mục 6 |
| AC-02 | Tháng đang chọn không còn danh mục nào có tên chứa "Ăn uống" (Dylan đã xóa hẳn danh mục đó, giao dịch cũ nếu có đã chuyển sang "Chi tiêu khác" theo `US-005`) | Dylan gõ "ăn tối 300k" vào ô nhập nhanh, rồi bấm "Ghi nhận" mà không tự chọn danh mục nào | Ô chọn danh mục hiển thị "Chưa xác định"; bấm "Ghi nhận" vẫn tạo giao dịch thành công, gắn vào danh mục "Chi tiêu khác" (tự sinh nếu tháng chưa có) — không có trường hợp nào không ghi nhận được gì | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-03 | Tháng đang chọn có danh mục "Di chuyển" (chưa từng đổi tên) | Dylan gõ "grab 20k" vào ô nhập nhanh, rồi bấm "Ghi nhận" | Ô chọn danh mục hiển thị đúng "Di chuyển" như trước giờ; giao dịch được ghi nhận đúng vào "Di chuyển" — xác nhận việc sửa lỗi không làm hỏng trường hợp tên danh mục chưa bị đổi | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-04 | Tháng đang chọn có cả hai danh mục "Ăn uống linh tinh" và "Ăn uống & đi chợ" (cùng chứa cụm "Ăn uống"), "Ăn uống linh tinh" đứng trước trên bảng ngân sách | Dylan gõ "ăn tối 300k" vào ô nhập nhanh, rồi bấm "Ghi nhận" | Ô chọn danh mục tự động hiển thị "Ăn uống linh tinh" (danh mục đứng trước theo thứ tự hiển thị trong hai danh mục cùng khớp), không phải "Ăn uống & đi chợ"; giao dịch được ghi nhận vào đúng danh mục đó | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-05 | Tháng đang chọn chưa có danh mục nào cả (danh sách danh mục rỗng), kể cả "Chi tiêu khác" | Dylan gõ "ăn tối 300k" vào ô nhập nhanh, rồi bấm "Ghi nhận" mà không tự chọn danh mục nào | Ô chọn danh mục hiển thị "Chưa xác định" (không có danh mục nào để so khớp); bấm "Ghi nhận" vẫn tạo giao dịch thành công — hệ thống tự sinh danh mục "Chi tiêu khác" và gắn giao dịch vào đó, không có trường hợp ghi nhận thất bại chỉ vì tháng đang trống danh mục | Chưa có — xem mô tả hành vi ở mục 6 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì ghi rõ lý do.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

Liệt kê mọi thành phần màn hình mà requirement này chạm tới. Không có element mới — chỉ đổi hành vi của một element đã có sẵn từ `US-005`.

### 8.1. Ô nhập nhanh chi tiêu — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Dropdown Danh mục nhận diện (nhập nhanh) | Dropdown | Danh mục nhận diện | Danh sách danh mục của tháng đang chọn, cộng một lựa chọn trống "Chưa xác định" | **Đổi hành vi so với hiện tại**: trước đây khi rule khớp nhưng tên danh mục đã đổi, dropdown sai lệch hiển thị "Chưa xác định" dù đã nhận diện được; nay hiển thị đúng danh mục thật đã so khớp gần đúng (BR-013); vẫn giữ nguyên hành vi hiển thị "Chưa xác định" khi thật sự không khớp gì (BR-011, từ `US-005`) | Dylan | AC-01, AC-02, AC-03, AC-04, AC-05 | [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) — cùng một element `EL-01`, requirement này chỉ sửa đúng phần hành vi khi tên danh mục bị đổi |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| Nhập nhanh chi tiêu                                              |
| Nội dung: [ăn tối 300k____]     Danh mục: [Ăn uống & đi chợ  v] |
|                                                    [Ghi nhận]    |
+----------------------------------------------------------------+
```

Mockup minh họa đúng AC-01: nội dung khớp nhóm "Ăn uống" nhưng danh mục thật đã đổi tên — dropdown hiển thị đúng "Ăn uống & đi chợ" thay vì "Chưa xác định".

Quy tắc:

- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Danh mục | Không đổi cấu trúc — chỉ đổi cách so khớp tên khi nhận diện | Không | Không lưu thêm dữ liệu nào |
| Giao dịch | Không đổi cấu trúc | Không | Giao dịch vẫn gắn `categoryId` như hiện có |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — cần data model bền vững | Implemented |
| [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Dữ liệu | Không (đã Delivered) — cần cơ chế tự sinh "Chi tiêu khác" để dùng lại khi so khớp gần đúng cũng thất bại | Implemented |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Mục 8 (`EL-01`) — mô tả dropdown chỉ nói tới trường hợp không khớp từ khóa nào | `EL-01` | Không | Follow-up: khi thuận tiện, `US-005` nên bổ sung ghi chú trỏ sang `US-012` cho trường hợp rule khớp nhưng tên danh mục đã đổi — không bắt buộc vì không làm sai lệch nội dung hiện có của `US-005` |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md`](../../kb/ba/wiki/knowledge/feature/US-012-sua-loi-nhan-dien-danh-muc.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-012-sua-loi-nhan-dien-danh-muc.md`](../../kb/ba/wiki/delivery/pbi/US-012-sua-loi-nhan-dien-danh-muc.md) | Điền đầy đủ User Story và 5 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory cần ghi: 1 quyết định user chốt qua dialog (cách chọn khi nhiều danh mục cùng khớp gần đúng) → đã ghi thành `DEC-060` vào `decisions.md`. Không có thuật ngữ nghiệp vụ mới phát sinh.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi (`/budget`) — khu vực nhập nhanh chi tiêu (đổi cách nhận diện danh mục và hiển thị dropdown) |
| Thực thể dữ liệu nào bị chạm | Không thay đổi cấu trúc — chỉ đọc thêm danh sách danh mục của tháng để so khớp gần đúng, dữ liệu đã có sẵn |
| Cần thay đổi cấu trúc dữ liệu | Không |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Khi rule khớp từ khóa nhưng không tìm được danh mục đúng tên tuyệt đối, hệ thống thử so khớp gần đúng trước khi coi là không xác định được; không tìm được thì rơi về "Chi tiêu khác" | Đã xác nhận từ knowledge — user xác nhận qua dialog trong `ssr-po mode=review` ngày 2026-08-06 (`DEC-059`) | Nếu sai, cần thiết kế lại toàn bộ hướng sửa, ảnh hưởng AC-01, AC-02 |
| A2 | Khi so khớp gần đúng ra nhiều hơn một danh mục cùng khớp, chọn danh mục đầu tiên theo thứ tự hiển thị trên bảng ngân sách | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-06 (`DEC-060`) | Nếu sai, cần đổi lại quy tắc chọn (vd khớp dài nhất), ảnh hưởng AC-04 |
| A3 | So khớp gần đúng chuẩn hóa Unicode (NFC) và không phân biệt hoa/thường trước khi so sánh, cùng quy tắc đã áp dụng cho mọi so khớp chuỗi tiếng Việt khác trong dự án | Giả định hợp lý — suy từ `docs/memory/judgement-log.md#jdg-004`, tránh lặp lại đúng lớp lỗi đã từng xảy ra ở US-001; không ảnh hưởng tới nội dung AC vì đây là chi tiết chuẩn hóa chuỗi, không phải quyết định nghiệp vụ | Nếu sai, cần bỏ bước chuẩn hóa — rủi ro thấp vì đây chỉ là biện pháp phòng ngừa thêm, không phải yêu cầu cốt lõi |
