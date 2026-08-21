# Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view

Status: Ready for DEV
Feature: US-015
Created: 2026-08-11
Updated: 2026-08-11
Raw Source: `docs/kb/ba/raw/US-015-quick-view-thang-lien-ke.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-015-quick-view-thang-lien-ke.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, khu vực "Lịch sử thu chi" trên trang Thu chi hiển thị **toàn bộ** các tháng ngân sách Dylan đã từng tạo, dưới dạng một dãy thẻ nối tiếp nhau, không giới hạn số lượng. Khi Dylan đã tạo nhiều tháng (ví dụ hơn chục tháng), khu vực này kéo dài thành một danh sách dài, Dylan phải cuộn qua rất nhiều thẻ mới thấy hết, dù mục đích ban đầu của khu vực này chỉ là xem nhanh (quick view) tình hình các tháng gần tháng đang xem.

Sau thay đổi này, khu vực "Lịch sử thu chi" chỉ còn hiển thị tối đa 3 thẻ: tháng liền trước, tháng đang xem, và tháng liền sau — tính theo vị trí trong danh sách các tháng Dylan **đã tạo** (bỏ qua những tháng chưa từng tạo, dù về mặt lịch chúng nằm giữa hai tháng đã tạo). Nếu tháng đang xem không có tháng liền trước hoặc liền sau trong danh sách đã tạo, thẻ tương ứng biến mất thay vì hiển thị ô trống. Muốn xem một tháng không nằm trong 3 thẻ này, Dylan dùng ô "Chọn tháng xem" đã có sẵn phía trên khu vực này.

Giá trị đo được: khu vực "Lịch sử thu chi" luôn hiển thị tối đa 3 thẻ, bất kể Dylan đã tạo bao nhiêu tháng — không còn phải cuộn qua danh sách dài để nắm nhanh tình hình các tháng liền kề tháng đang xem.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-015-quick-view-thang-lien-ke.md`](../../kb/ba/wiki/knowledge/feature/US-015-quick-view-thang-lien-ke.md) | Mục tiêu, phạm vi, luồng nghiệp vụ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-018-quick-view-3-the-thang.md`](../../kb/ba/wiki/knowledge/business-rule/BR-018-quick-view-3-the-thang.md) | Rule giới hạn 3 thẻ, cách tính tháng trước/sau, cách xử lý khi thiếu |
| [`docs/kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md`](../../kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md) | Ràng buộc của thực thể Tháng ngân sách |
| [`docs/kb/ba/wiki/knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md`](../../kb/ba/wiki/knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md) | Mục tiêu epic, thuộc luồng F3 |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M2, luồng F3, khoảng trống #13 |
| [`docs/po/review-2026-08-11-quick-view-thang.md`](../../po/review-2026-08-11-quick-view-thang.md) | Finding PO-02 — nguồn gốc đề xuất |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md` (lưu các quyết định đã chốt với user, gọi bằng mã DEC (viết tắt của "Decision") — cụ thể là `DEC-071`, `DEC-072`), `glossary.md`.

## 3. Phạm Vi

- Khu vực "Lịch sử thu chi" chỉ hiển thị tối đa 3 thẻ tháng: tháng liền trước, tháng đang xem, tháng liền sau
- "Tháng liền trước"/"tháng liền sau" tính theo vị trí của tháng đang xem trong danh sách các tháng **đã tạo**, sắp theo thứ tự kỳ tháng — bỏ qua tháng chưa tạo, kể cả khi tháng đó nằm giữa hai tháng đã tạo về mặt lịch (`BR-018`, `DEC-071`)
- Khi tháng đang xem không có tháng liền trước hoặc liền sau trong danh sách đã tạo, ẩn hẳn thẻ tương ứng — lưới quick view có thể chỉ còn 1 hoặc 2 thẻ thay vì luôn đủ 3 (`BR-018`, `DEC-072`)
- Giữ nguyên hành vi bấm vào một thẻ (tháng trước hoặc tháng sau) để chuyển tháng đang xem sang tháng đó, giống hành vi hiện tại
- Giữ nguyên cách hiển thị nội dung từng thẻ (kỳ tháng, số tiền còn lại, chi thực tế, % thu nhập) — chỉ đổi số lượng thẻ hiển thị, không đổi nội dung từng thẻ

## 4. Ngoài Phạm Vi

- Đổi cách hoạt động của ô "Chọn tháng xem" (dropdown phía trên) — không đổi, vẫn liệt kê toàn bộ tháng đã tạo để Dylan chọn xem bất kỳ tháng nào
- Cho Dylan tự chỉnh số lượng thẻ hiển thị — số lượng luôn cố định tối đa 3, theo yêu cầu gốc
- Đổi cách tạo tháng mới, cách tính "Chi thực tế", hay bất kỳ logic nào của khu vực "Chọn tháng xem"/"Tạo tháng mới" — những phần này thuộc một function khác của dự án, mã function dùng tiền tố US (viết tắt của "User Story") ghép số thứ tự, cụ thể là `US-006` — không thay đổi ở requirement này

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem tối đa 3 thẻ tháng liền kề tháng đang xem trong khu vực "Lịch sử thu chi"; bấm vào thẻ trước/sau để đổi tháng đang xem | Không còn thấy toàn bộ tháng đã tạo trong khu vực này — phải dùng "Chọn tháng xem" để xem tháng khác | [`docs/memory/decisions.md#dec-004`](../../memory/decisions.md) |

## 6. Luồng Nghiệp Vụ

1. Dylan mở trang Thu chi; hệ thống xác định tháng đang xem hiện tại (mặc định hoặc do Dylan chọn trước đó).
2. Khu vực "Lịch sử thu chi" xác định vị trí của tháng đang xem trong danh sách các tháng đã tạo (sắp theo thứ tự kỳ tháng).
3. Hệ thống hiển thị thẻ của tháng liền trước (nếu có trong danh sách đã tạo), thẻ của tháng đang xem, và thẻ của tháng liền sau (nếu có) — tối đa 3 thẻ.
4. Dylan bấm vào thẻ tháng trước hoặc thẻ tháng sau → tháng đang xem đổi sang tháng đó; khu vực "Lịch sử thu chi" tự cập nhật lại, hiển thị 3 thẻ mới quanh tháng vừa chọn.
5. Dylan muốn xem một tháng không nằm trong 3 thẻ đang hiển thị → dùng ô "Chọn tháng xem" phía trên để chọn trực tiếp tháng đó.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Tháng đang xem là tháng đầu tiên trong danh sách các tháng đã tạo (không có tháng liền trước) | Chỉ hiển thị 2 thẻ: tháng đang xem và tháng liền sau |
| Tháng đang xem là tháng cuối cùng trong danh sách các tháng đã tạo (không có tháng liền sau) | Chỉ hiển thị 2 thẻ: tháng liền trước và tháng đang xem |
| Chỉ có đúng một tháng đã được tạo (chính là tháng đang xem) | Chỉ hiển thị 1 thẻ — thẻ của tháng đang xem |
| Tháng nằm giữa hai tháng đã tạo theo lịch nhưng bản thân chưa từng được tạo | Không xuất hiện trong khu vực này; hai tháng đã tạo gần nhất về hai phía vẫn được coi là "liền trước"/"liền sau" |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Các tháng đã tạo (theo thứ tự): "2026-05", "2026-06", "2026-08", "2026-09", "2026-11" (chưa từng tạo "2026-07" và "2026-10"); tháng đang xem là "2026-08" | Dylan mở trang Thu chi | Khu vực "Lịch sử thu chi" hiển thị đúng 3 thẻ: "2026-06" (tháng trước), "2026-08" (đang xem, có dấu hiệu nổi bật), "2026-09" (tháng sau) — không hiển thị "2026-07" vì tháng đó chưa từng được tạo | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.1 |
| AC-02 | Cùng danh sách tháng đã tạo như AC-01; tháng đang xem là "2026-05" (tháng đầu tiên trong danh sách đã tạo) | Dylan mở trang Thu chi | Khu vực "Lịch sử thu chi" chỉ hiển thị 2 thẻ: "2026-05" (đang xem) và "2026-06" (tháng sau) — không có thẻ nào ở vị trí "tháng trước" | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.1 |
| AC-03 | Cùng danh sách tháng đã tạo như AC-01; tháng đang xem là "2026-11" (tháng cuối cùng trong danh sách đã tạo) | Dylan mở trang Thu chi | Khu vực "Lịch sử thu chi" chỉ hiển thị 2 thẻ: "2026-09" (tháng trước) và "2026-11" (đang xem) — không có thẻ nào ở vị trí "tháng sau" | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.1 |
| AC-04 | Dylan mới bắt đầu dùng hệ thống, chỉ có đúng một tháng đã được tạo: "2026-08" (chính là tháng đang xem) | Dylan mở trang Thu chi | Khu vực "Lịch sử thu chi" chỉ hiển thị 1 thẻ duy nhất: "2026-08" (đang xem) | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.1 |
| AC-05 | Đang ở tình huống AC-01 (đang xem "2026-08", 3 thẻ hiển thị: "2026-06", "2026-08", "2026-09") | Dylan bấm vào thẻ "2026-09" (thẻ tháng sau) | Tháng đang xem đổi thành "2026-09"; khu vực "Lịch sử thu chi" cập nhật lại, hiển thị 3 thẻ mới: "2026-08" (tháng trước), "2026-09" (đang xem, có dấu hiệu nổi bật), "2026-11" (tháng sau) | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.1 |
| AC-06 | Đang ở tình huống AC-01 (đang xem "2026-08"); Dylan muốn xem tháng "2026-05" — tháng này không nằm trong 3 thẻ đang hiển thị | Dylan mở ô "Chọn tháng xem" phía trên khu vực "Lịch sử thu chi" và chọn "2026-05" | Tháng đang xem đổi thành "2026-05" ngay lập tức, không cần bấm qua từng thẻ liền kề; khu vực "Lịch sử thu chi" cập nhật lại theo tháng "2026-05" (xem AC-02) | Chưa có mockup ảnh/design thật; xem ASCII Mockup mục 8.2 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì tham chiếu khối ASCII Mockup tương ứng ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

### 8.1. Khu vực "Lịch sử thu chi" — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Lưới thẻ tháng "Lịch sử thu chi" | Table | Lịch sử thu chi | Danh sách các tháng đã tạo (`MonthBudget`), lọc còn tối đa 3 mục quanh tháng đang xem | **Đổi hành vi so với hiện tại**: trước đây hiển thị toàn bộ tháng đã tạo không giới hạn; nay chỉ hiển thị tối đa 3 thẻ (trước/đang xem/sau) theo `BR-018`, ẩn thẻ nào không có tháng tương ứng trong danh sách đã tạo. Bấm vào một thẻ (trừ thẻ đang xem) sẽ đổi tháng đang xem sang tháng đó | Dylan | AC-01, AC-02, AC-03, AC-04, AC-05 | Không |
| EL-02 | Cột Kỳ tháng | Column | (mã tháng, ví dụ "2026-08") | `MonthBudget.id`, thứ tự sắp xếp mặc định theo kỳ tháng tăng dần trong 3 thẻ hiển thị | Thẻ của tháng đang xem có dấu hiệu nổi bật (viền/nền khác) để phân biệt với thẻ tháng trước/sau — không đổi so với cách đánh dấu tháng đang xem hiện tại | Dylan | AC-01, AC-02, AC-03, AC-04, AC-05 | Không |
| EL-03 | Cột Số tiền còn lại | Column | Ví dụ "8.500.000đ còn lại" (số tiền thật nội suy vào chỗ số) | Thu nhập tháng trừ tổng chi thực tế của tháng đó | Không đổi cách tính so với hiện tại — chỉ đổi số thẻ hiển thị chứa cột này | Dylan | AC-01 | Không |
| EL-04 | Cột Chi thực tế và % thu nhập | Column | Ví dụ "Chi 11.500.000đ · 57% thu nhập" (số tiền và phần trăm thật nội suy vào chỗ số) | Tổng chi thực tế của tháng đó; tỷ lệ so với thu nhập tháng | Không đổi cách tính so với hiện tại — chỉ đổi số thẻ hiển thị chứa cột này | Dylan | AC-01 | Không |

**ASCII Mockup**

```text
+---------------------------------------------------------------+
| Lịch sử thu chi                                                |
+---------------------------------------------------------------+
| +-------------+  +===============+  +-------------+           |
| | 2026-06     |  # 2026-08       #  | 2026-09     |           |
| | 12.000.000đ |  # 8.500.000đ    #  | 15.000.000đ |           |
| | còn lại     |  # còn lại       #  | còn lại     |           |
| | Chi 8tr ·   |  # Chi 11,5tr ·  #  | Chi 5tr ·   |           |
| | 40% thu nhập|  # 57% thu nhập  #  | 25% thu nhập|           |
| +-------------+  +===============+  +-------------+           |
|   (tháng trước)   (đang xem, nổi bật)  (tháng sau)             |
+---------------------------------------------------------------+
```

Mockup minh họa AC-01: đúng 3 thẻ, thẻ giữa (đang xem) có viền đôi để nổi bật. Khi đang xem là tháng đầu tiên hoặc cuối cùng trong danh sách đã tạo (AC-02, AC-03), thẻ tương ứng phía thiếu biến mất, lưới chỉ còn 2 thẻ liền nhau; khi chỉ có đúng một tháng đã tạo (AC-04), lưới chỉ còn 1 thẻ.

### 8.2. Ô "Chọn tháng xem" — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-05 | Dropdown Chọn tháng xem | Dropdown | Chọn tháng xem | Toàn bộ các tháng đã tạo (`MonthBudget`), sắp xếp theo kỳ tháng | Không đổi tập giá trị hay hành vi so với hiện tại — vẫn liệt kê toàn bộ tháng đã tạo; là cách duy nhất để Dylan xem một tháng không nằm trong 3 thẻ của khu vực "Lịch sử thu chi" (mục 8.1) | Dylan | AC-06 | [`US-006`](../US-006-canh-bao-trung-thang/spec.md) — cùng chính ô `EL-01` của `US-006`, không đổi hành vi ở requirement này |

**ASCII Mockup**

```text
+----------------------------------------+
| Chọn tháng xem   [ 2026-08         v ] |
+----------------------------------------+
```

Mockup minh họa AC-06: Dylan mở dropdown đã có sẵn để chọn trực tiếp một tháng không nằm trong 3 thẻ quick view ở mục 8.1.

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Tháng ngân sách | Không đổi cấu trúc — chỉ đổi cách lọc danh sách tháng hiển thị trong một khu vực UI, không đổi cách lưu | Không | Không lưu thêm dữ liệu nào |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng (US-008) |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — cần danh sách tháng ngân sách đã lưu bền vững để xác định thứ tự "đã tạo" | Delivered With Notes |
| [`US-006`](../US-006-canh-bao-trung-thang/spec.md) | Giao kèo | Không — chỉ dùng chung ô "Chọn tháng xem" (`EL-01` của US-006) ở mục 8.2, không đổi hành vi ô đó | Delivered With Notes |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`US-006`](../US-006-canh-bao-trung-thang/spec.md) | Mục 8.1 (tham chiếu, không đổi nội dung) | `EL-01` của US-006 (dropdown "Chọn tháng xem") | Không | Không có — requirement này chỉ tham chiếu, không thay đổi hành vi hay nội dung của element đó |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-015-quick-view-thang-lien-ke.md`](../../kb/ba/wiki/knowledge/feature/US-015-quick-view-thang-lien-ke.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-015-quick-view-thang-lien-ke.md`](../../kb/ba/wiki/delivery/pbi/US-015-quick-view-thang-lien-ke.md) | Điền đầy đủ User Story và 6 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory cần ghi: không phát sinh quyết định mới trong lúc viết spec này — hai điểm mờ của raw đã được chốt trước đó thành `DEC-071`, `DEC-072`. Không có thuật ngữ nghiệp vụ mới phát sinh.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi (`/budget`) — khu vực "Lịch sử thu chi" (giới hạn còn tối đa 3 thẻ); ô "Chọn tháng xem" không đổi, chỉ được dùng chung |
| Thực thể dữ liệu nào bị chạm | Tháng ngân sách — chỉ đọc và lọc lại danh sách đã có, không đổi cấu trúc |
| Cần thay đổi cấu trúc dữ liệu | Không |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | "Tháng liền trước"/"tháng liền sau" tính theo vị trí trong danh sách các tháng đã tạo, bỏ qua tháng chưa tạo — không tính theo lịch | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` trong phiên `ssr-po mode=review` ngày 2026-08-11 (`DEC-071`) | Nếu sai, cần đổi lại toàn bộ cách xác định thẻ trước/sau, ảnh hưởng AC-01, AC-05, AC-06 và `EL-01`, `EL-02` |
| A2 | Khi không có tháng liền trước/sau tương ứng, ẩn hẳn thẻ đó thay vì hiển thị ô trống/placeholder | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` trong phiên `ssr-po mode=review` ngày 2026-08-11 (`DEC-072`) | Nếu sai, cần thêm placeholder cho ô thiếu, ảnh hưởng AC-02, AC-03, AC-04 và `EL-01` |
| A3 | Thẻ tháng trước/sau vẫn giữ hành vi bấm-để-chọn (đổi tháng đang xem) như cách hoạt động hiện tại của khu vực này | Giả định hợp lý — raw không đề cập bỏ hành vi này, và đây là cách duy nhất hiện có để đổi tháng đang xem từ khu vực thẻ | Nếu sai (Dylan muốn thẻ chỉ hiển thị, không bấm được), cần đổi `EL-01` thành hiển thị thuần túy — ảnh hưởng AC-05 |
| A4 | "Danh sách các tháng đã tạo" sắp xếp theo thứ tự kỳ tháng (mã tháng dạng "YYYY-MM") tăng dần, không phải theo thứ tự bản ghi được tạo trong dữ liệu | Giả định hợp lý — suy từ ngữ nghĩa "tháng trước/tháng sau", nhất quán với cách khu vực "Chọn tháng xem" (US-006) đã sắp xếp | Nếu sai, cần đổi nguồn sắp xếp dùng để xác định thẻ trước/sau — ảnh hưởng toàn bộ AC |
