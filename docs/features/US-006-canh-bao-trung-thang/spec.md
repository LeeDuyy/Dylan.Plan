# Cảnh báo trùng tháng khi tạo tháng mới

Status: Ready for DEV
Feature: US-006
Created: 2026-08-07
Updated: 2026-08-10
Raw Source: `docs/kb/ba/raw/US-006-canh-bao-trung-thang.md`
Raw Bổ Sung (gộp): `docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md` — nội dung của raw US-013 (đổi tên khu vực chọn tháng, tách bố cục, đổi tên và nghiệp vụ nút Clone) đã được gộp vào spec này thay vì tách spec riêng, vì cùng chạm một khu vực màn hình và US-006 chưa qua stage plan/task
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, khi Dylan chọn một kỳ tháng để tạo tháng mới (trống hoặc sao chép từ tháng đang xem) nhưng kỳ tháng đó đã có sẵn trong dữ liệu, bấm nút "Tạo tháng" hoặc "Clone tháng hiện tại" **không có chuyện gì xảy ra cả** — không tạo tháng mới, cũng không có thông báo nào giải thích vì sao. Dylan không biết là do trùng tháng hay do lỗi khác.

Sau thay đổi này, Dylan không còn cách nào chọn được một kỳ tháng đã tồn tại để tạo mới: ô chọn kỳ tháng chỉ cho phép chọn trong số các kỳ tháng chưa có dữ liệu; những kỳ tháng đã có sẵn hiển thị rõ ràng nhưng không bấm chọn được. Việc "trùng tháng" trở thành điều không thể xảy ra qua thao tác bình thường, thay vì một lỗi phải xử lý sau khi Dylan đã bấm nút.

Thêm vào đó, khu vực xem tháng (nhãn "Chọn tháng") và khu vực tạo tháng mới hiện đang nằm chung một chỗ trên màn hình, không có ranh giới rõ ràng — Dylan dễ nhầm giữa việc đang xem một tháng và việc đang tạo một tháng mới. Tên nút "Clone tháng hiện tại" cũng không nói rõ dữ liệu được sao chép từ tháng nào. Sau thay đổi này: nhãn khu vực xem tháng đổi thành "Chọn tháng xem"; khu vực tạo tháng mới (ô chọn kỳ tháng, nút "Tạo tháng", nút đổi tên thành "Clone tháng đang xem") tách thành một khối riêng biệt, dễ phân biệt với khu vực "Chọn tháng xem"; và nút "Clone tháng đang xem" luôn sao chép đúng cấu trúc danh mục của tháng đang được xem ở khu vực "Chọn tháng xem" sang tháng mới, trong khi "Tạo tháng" luôn dùng danh mục mặc định của hệ thống — hai nút cho hai kết quả khác nhau rõ ràng, đúng như tên gọi của từng nút.

Giá trị đo được: Dylan mở ô chọn kỳ tháng để tạo mới, nhìn thấy toàn bộ 13 kỳ tháng liền kề (6 tháng trước, tháng hiện tại, 6 tháng sau), trong đó các kỳ tháng đã có dữ liệu hiển thị mờ kèm ghi chú "Đã có dữ liệu" và không bấm chọn được; Dylan chỉ chọn được và tạo được những kỳ tháng còn trống. Không còn tình huống bấm "Tạo tháng"/"Clone tháng đang xem" mà không có chuyện gì xảy ra. Dylan nhìn vào màn hình thấy ngay hai khu vực tách biệt — "Chọn tháng xem" và khu vực tạo tháng mới; bấm "Clone tháng đang xem" luôn cho ra danh mục giống hệt tháng đang xem, bấm "Tạo tháng" luôn cho ra danh mục mặc định của hệ thống.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md`](../../kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md) | Mục tiêu, phạm vi, luồng nghiệp vụ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-014-canh-bao-trung-thang.md`](../../kb/ba/wiki/knowledge/business-rule/BR-014-canh-bao-trung-thang.md) | Rule ngăn tạo tháng trùng |
| [`docs/kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md`](../../kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md) | Ràng buộc của thực thể Tháng ngân sách |
| [`docs/kb/ba/wiki/knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md`](../../kb/ba/wiki/knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md) | Mục tiêu epic, thuộc luồng F3 |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M2, luồng F3, gap #6 |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md` (lưu các quyết định đã chốt với user, gọi bằng mã DEC (viết tắt của "Decision") — cụ thể là `DEC-034`, `DEC-061`, `DEC-062`, `DEC-063`, `DEC-064`), `glossary.md`.

## 3. Phạm Vi

- Ô "Tạo tháng mới" đổi từ ô chọn ngày tháng tự do thành ô chọn kiểu danh sách xổ xuống (combobox), liệt kê 13 kỳ tháng liên tục: 6 tháng trước tháng hiện tại, tháng hiện tại, và 6 tháng sau (theo đồng hồ hệ thống)
- Trong danh sách đó, kỳ tháng nào đã có dữ liệu (đã từng được tạo trước đây) hiển thị mờ, kèm ghi chú "Đã có dữ liệu", không bấm chọn được
- Kỳ tháng nào chưa có dữ liệu thì chọn được bình thường; Dylan chọn xong bấm "Tạo tháng" (trống) hoặc "Clone tháng đang xem" để tạo
- Nếu vì lý do bất thường (ví dụ Dylan mở hai cửa sổ cùng lúc) mà kỳ tháng vừa chọn bị một thao tác khác tạo trước đúng lúc Dylan bấm nút, hệ thống vẫn phải báo lỗi rõ ràng thay vì im lặng — đây là lớp bảo vệ dự phòng, không phải luồng chính
- Đổi nhãn hiển thị của khu vực xem tháng từ "Chọn tháng" thành "Chọn tháng xem" — chỉ đổi tên, không đổi cách hoạt động của việc chọn tháng để xem
- Tách khu vực tạo tháng mới (ô "Tạo tháng mới", nút "Tạo tháng", nút "Clone tháng đang xem") thành một khối riêng biệt trên giao diện, tách khỏi khu vực "Chọn tháng xem", để Dylan phân biệt rõ đâu là xem tháng, đâu là tạo tháng mới
- Đổi tên nút "Clone tháng hiện tại" thành "Clone tháng đang xem"
- Chốt rõ nghiệp vụ khác nhau giữa hai nút: "Tạo tháng" luôn tạo danh mục theo bộ mặc định của hệ thống, không sao chép bất kỳ gì từ tháng đang xem; "Clone tháng đang xem" luôn sao chép cấu trúc danh mục (tên, loại, hạn mức ngân sách, trạng thái khóa) của tháng đang được xem ở khu vực "Chọn tháng xem" — không sao chép thu nhập, không sao chép giao dịch, không sao chép danh mục "Chi tiêu khác"

## 4. Ngoài Phạm Vi

- Cho sửa kỳ tháng của một tháng đã tạo, hoặc gộp/xóa tháng — không thuộc requirement này (mã function của dự án dùng tiền tố US (viết tắt của "User Story") ghép số thứ tự, ví dụ `US-013`)
- Mở rộng khoảng 6 tháng trước/sau thành khoảng khác, hoặc cho tạo tháng ngoài khoảng đó — không yêu cầu ở phạm vi này
- Đổi cách hoạt động của việc chọn một tháng đã có để xem (vẫn là danh sách các tháng đã tồn tại, chọn xong hiển thị dữ liệu tháng đó) — không đổi, phạm vi này chỉ đổi tên nhãn hiển thị thành "Chọn tháng xem"
- Sao chép thu nhập hoặc giao dịch khi bấm "Clone tháng đang xem" — chỉ cấu trúc danh mục được sao chép, thu nhập của tháng mới vẫn dùng giá trị mặc định và chi thực tế luôn bắt đầu ở 0

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Chọn một kỳ tháng chưa có dữ liệu để tạo tháng mới (trống hoặc sao chép) | Không chọn được kỳ tháng đã có dữ liệu để tạo trùng | `docs/memory/decisions.md#dec-004` |

## 6. Luồng Nghiệp Vụ

0. Trang Thu chi hiển thị hai khu vực tách biệt cạnh nhau: "Chọn tháng xem" (đang xem tháng nào) và khu vực tạo tháng mới (ô "Tạo tháng mới", nút "Tạo tháng", nút "Clone tháng đang xem").
1. Dylan mở ô "Tạo tháng mới" (danh sách xổ xuống) trong khu vực tạo tháng mới.
2. Hệ thống hiển thị 13 kỳ tháng: 6 tháng trước tháng hiện tại, tháng hiện tại, 6 tháng sau — kỳ tháng nào đã có dữ liệu hiển thị mờ kèm ghi chú "Đã có dữ liệu", không chọn được.
3. Dylan chọn một kỳ tháng còn trống (chưa có dữ liệu).
4. Dylan bấm "Tạo tháng" hoặc "Clone tháng đang xem".
5. Tháng mới được tạo với danh mục tương ứng: bấm "Tạo tháng" → danh mục mặc định của hệ thống, không sao chép gì; bấm "Clone tháng đang xem" → sao chép cấu trúc danh mục (tên, loại, hạn mức ngân sách, trạng thái khóa) của tháng đang xem ở khu vực "Chọn tháng xem", không sao chép thu nhập/giao dịch/"Chi tiêu khác". Chi thực tế của mọi danh mục trong tháng mới luôn bắt đầu ở 0.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Toàn bộ 13 kỳ tháng trong khoảng đều đã có dữ liệu | Không còn kỳ tháng nào chọn được trong danh sách; nút "Tạo tháng" và "Clone tháng đang xem" bị vô hiệu hóa (mờ, không bấm được), kèm ghi chú giải thích không còn kỳ tháng trống trong khoảng 6 tháng trước/sau |
| Kỳ tháng vừa chọn bị tạo bởi một thao tác khác đúng lúc Dylan bấm nút (ví dụ hai cửa sổ trình duyệt cùng lúc) | Hiện thông báo lỗi rõ ràng "Tháng này đã tồn tại", không tạo trùng, danh sách tự cập nhật lại để kỳ tháng đó chuyển sang trạng thái mờ |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Tháng hiện tại theo đồng hồ hệ thống là "2026-08"; đã có dữ liệu cho các tháng "2026-06", "2026-07", "2026-08" | Dylan mở ô "Tạo tháng mới" | Danh sách hiển thị đủ 13 kỳ tháng từ "2026-02" đến "2027-02"; ba dòng "2026-06", "2026-07", "2026-08" hiển thị mờ kèm ghi chú "Đã có dữ liệu" và không bấm chọn được; 10 kỳ tháng còn lại hiển thị rõ nét và bấm chọn được | Chưa có mockup ảnh/design thật; xem ASCII mockup minh họa đúng trạng thái này ở mục 8.2 |
| AC-02 | Đang ở tình huống AC-01, kỳ tháng "2026-09" chưa có dữ liệu | Dylan chọn "2026-09" trong ô "Tạo tháng mới", rồi bấm "Tạo tháng" | Tháng "2026-09" được tạo thành công với danh mục mặc định, chi thực tế bằng 0; ô "Chọn tháng xem" giờ có thêm lựa chọn "2026-09"; ô "Tạo tháng mới" cập nhật lại danh sách, "2026-09" chuyển sang trạng thái mờ "Đã có dữ liệu" | Chưa có mockup ảnh/design thật; xem ASCII mockup minh họa đúng lựa chọn "2026-09" trước khi bấm "Tạo tháng" ở mục 8.2 |
| AC-03 | Đang ở tình huống AC-01, kỳ tháng "2026-10" chưa có dữ liệu, tháng đang xem là "2026-08" có sẵn danh mục "Ăn uống" (ngân sách 3.000.000đ) | Dylan chọn "2026-10" trong ô "Tạo tháng mới", rồi bấm "Clone tháng đang xem" | Tháng "2026-10" được tạo thành công, có danh mục "Ăn uống" với ngân sách 3.000.000đ sao chép từ tháng "2026-08" (tháng đang xem ở khu vực "Chọn tháng xem"), chi thực tế của danh mục này bằng 0; thu nhập của tháng "2026-10" là giá trị mặc định, không sao chép từ tháng "2026-08" | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-04 | Tháng hiện tại là "2026-08"; toàn bộ 13 kỳ tháng từ "2026-02" đến "2027-02" đều đã có dữ liệu | Dylan mở ô "Tạo tháng mới" | Không có kỳ tháng nào trong danh sách chọn được (tất cả hiển thị mờ); nút "Tạo tháng" và "Clone tháng đang xem" bị vô hiệu hóa, kèm ghi chú "Không còn kỳ tháng trống trong 6 tháng trước/sau" | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-05 | Đang ở tình huống AC-01, Dylan đã chọn "2026-09" (chưa có dữ liệu) trong ô "Tạo tháng mới" trên một cửa sổ trình duyệt; ngay trước khi Dylan bấm "Tạo tháng", một cửa sổ trình duyệt khác đã tạo xong tháng "2026-09" | Dylan bấm "Tạo tháng" trên cửa sổ đầu tiên (dữ liệu hiển thị lúc đó chưa biết "2026-09" vừa được tạo ở nơi khác) | Hệ thống không tạo tháng trùng; hiện thông báo lỗi rõ ràng "Tháng này đã tồn tại"; ô "Tạo tháng mới" tự cập nhật, "2026-09" chuyển sang trạng thái mờ "Đã có dữ liệu" | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-06 | Dylan đang mở trang Thu chi, tháng đang xem là "2026-08" | Dylan nhìn vào khu vực xem tháng và khu vực tạo tháng mới | Tiêu đề khu vực xem tháng hiển thị đúng chữ "Chọn tháng xem" (không còn chữ "Chọn tháng"); khu vực tạo tháng mới (ô "Tạo tháng mới", nút "Tạo tháng", nút "Clone tháng đang xem") hiển thị thành một khối tách biệt rõ ràng khỏi khu vực "Chọn tháng xem", không nằm lẫn trong cùng một khối như trước | Xem ASCII Mockup mục 8.1 và 8.2 |
| AC-07 | Đang ở tình huống AC-01, tháng đang xem "2026-08" có một danh mục đã bị Dylan đổi tên/ngân sách khác với bộ danh mục mặc định của hệ thống; kỳ tháng "2026-11" chưa có dữ liệu | Dylan chọn "2026-11" trong ô "Tạo tháng mới", rồi bấm "Tạo tháng" (không phải "Clone tháng đang xem") | Tháng "2026-11" được tạo với đúng bộ danh mục mặc định của hệ thống; danh mục đã tùy chỉnh của tháng "2026-08" không xuất hiện trong tháng "2026-11" — kết quả khác với khi bấm "Clone tháng đang xem" (AC-03) | Chưa có — xem mô tả hành vi ở mục 6 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì ghi rõ lý do.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

### 8.1. Khu vực chọn tháng xem — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Dropdown Chọn tháng xem | Dropdown | Chọn tháng xem | Danh sách các tháng đã có dữ liệu (`MonthBudget`), sắp xếp theo kỳ tháng | **Đổi nhãn hiển thị so với hiện tại**: trước đây nhãn là "Chọn tháng", nay đổi thành "Chọn tháng xem"; tập giá trị và hành vi chọn (đổi tháng đang xem trên toàn trang) giữ nguyên, không đổi. Nằm trong khối riêng, tách biệt khỏi khu vực tạo tháng mới ở mục 8.2 | Dylan | AC-06 | Không |

**ASCII Mockup**

```text
+--------------------------------------+
| Chọn tháng xem   [ 2026-08       v ] |
+--------------------------------------+
```

Mockup minh họa AC-06: khu vực xem tháng chỉ còn nhãn "Chọn tháng xem" và dropdown chọn tháng, tách hẳn khỏi khối tạo tháng mới ở mục 8.2.

### 8.2. Khu vực tạo tháng mới — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-02 | Combobox Tạo tháng mới | Dropdown | Tạo tháng mới | 13 kỳ tháng liên tục (6 trước — tháng hiện tại — 6 sau, tính theo đồng hồ hệ thống), đối chiếu với danh sách tháng đã có dữ liệu | **Đổi hành vi so với hiện tại**: trước đây là ô nhập ngày tháng tự do (`input type="month"`), cho chọn bất kỳ kỳ tháng nào kể cả đã tồn tại; nay là danh sách liệt kê đúng 13 kỳ tháng, kỳ đã có dữ liệu hiển thị mờ kèm ghi chú "Đã có dữ liệu" và không chọn được; giá trị mặc định là kỳ tháng gần tháng hiện tại nhất mà chưa có dữ liệu (ưu tiên tháng hiện tại nếu còn trống) — đây là **giả định chưa được user xác nhận trực tiếp**, xem `A3` ở mục 14. Nằm trong khối tạo tháng mới, tách biệt khỏi khu vực "Chọn tháng xem" ở mục 8.1 | Dylan | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-07 | Không |
| EL-03 | Nút Tạo tháng | Button | Tạo tháng | — | Bật khi ô `EL-02` đang chọn một kỳ tháng hợp lệ (chưa có dữ liệu); tắt (mờ, không bấm được) khi không còn kỳ tháng nào chọn được trong danh sách; bấm khi đang bật sẽ tạo tháng mới với danh mục theo bộ mặc định của hệ thống, **không sao chép bất kỳ gì** từ tháng đang xem | Dylan | AC-02, AC-04, AC-05, AC-06, AC-07 | Không |
| EL-04 | Nút Clone tháng đang xem | Button | Clone tháng đang xem | — | **Đổi tên so với hiện tại**: trước đây nhãn là "Clone tháng hiện tại", nay đổi thành "Clone tháng đang xem". Cùng điều kiện bật/tắt với `EL-03`; bấm khi đang bật sẽ tạo tháng mới sao chép cấu trúc danh mục (tên, loại, hạn mức ngân sách, trạng thái khóa) của tháng đang được xem ở khu vực "Chọn tháng xem" (`EL-01`); không sao chép thu nhập, không sao chép giao dịch, không sao chép danh mục "Chi tiêu khác"; chi thực tế của mọi danh mục bắt đầu ở 0 | Dylan | AC-03, AC-04, AC-06, AC-07 | Không |
| EL-05 | Thông báo lỗi tạo tháng | Toast | (nội dung: "Tháng này đã tồn tại.") | Kết quả thao tác tạo tháng khi bị từ chối do trùng | Chỉ xuất hiện ở tình huống dự phòng: kỳ tháng vừa chọn bị tạo bởi nơi khác đúng lúc Dylan bấm nút (`EL-03`/`EL-04`); không xuất hiện trong luồng chính vì `EL-02` đã ngăn chọn trùng từ trước | Dylan | AC-05 | Không |

**ASCII Mockup**

```text
+--------------------------------------------------------------------+
| Tạo tháng mới   [2026-09                v]                         |
|                   2026-02                                          |
|                   2026-03                                          |
|                   ...                                              |
|                   2026-06  (mờ) Đã có dữ liệu                      |
|                   2026-07  (mờ) Đã có dữ liệu                      |
|                   2026-08  (mờ) Đã có dữ liệu                      |
|                   2026-09  <- đang chọn                             |
|                   ...                                              |
|                   2027-02                                          |
|                                                                      |
|  [ Tạo tháng ]   [ Clone tháng đang xem ]                          |
+--------------------------------------------------------------------+
```

Mockup minh họa đúng AC-01/AC-02/AC-06/AC-07: danh sách 13 kỳ tháng, ba kỳ đã có dữ liệu hiển thị mờ không chọn được, Dylan đang chọn "2026-09" (còn trống) để tạo; khối này tách biệt khỏi khối "Chọn tháng xem" ở mục 8.1, và nút "Clone tháng đang xem" đã đổi tên so với "Clone tháng hiện tại" trước đây.

Quy tắc:

- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Tháng ngân sách | Không đổi cấu trúc — kỳ tháng vẫn là khóa chính duy nhất như hiện có; chỉ đổi cách giao diện ngăn Dylan chọn trùng | Không | Không lưu thêm dữ liệu nào |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — cần bảng tháng ngân sách bền vững và logic tạo tháng đã có sẵn | Implemented |
| `docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md` | Raw đã gộp | Không — nội dung raw này đã được đưa thẳng vào spec US-006 (mục 1, 3, 6, 7, 8) thay vì tách thành spec riêng, do cùng chạm khu vực màn hình "Tạo tháng mới"/"Chọn tháng" và US-006 chưa qua stage plan/task | Gộp vào US-006 |

## 11. Tác Động Tới Spec Khác

Không có spec nào khác mô tả khu vực "Tạo tháng mới"/"Chọn tháng xem" của trang Thu chi. Raw US-013 (dự tính ban đầu là một function riêng) đã được gộp thẳng vào spec này — xem mục 10.

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md`](../../kb/ba/wiki/knowledge/feature/US-006-canh-bao-trung-thang.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-006-canh-bao-trung-thang.md`](../../kb/ba/wiki/delivery/pbi/US-006-canh-bao-trung-thang.md) | Điền đầy đủ User Story và 7 AC từ spec này (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-014-canh-bao-trung-thang.md`](../../kb/ba/wiki/knowledge/business-rule/BR-014-canh-bao-trung-thang.md) | Cập nhật nội dung rule cho khớp cách hiện thực đã chốt (ngăn chọn trùng qua combobox, không phải báo lỗi sau khi bấm), xóa nhãn "Cần user xác nhận" đã được giải quyết |

Memory cần ghi: 2 quyết định user chốt qua dialog (cách ngăn trùng tháng, khoảng thời gian hiển thị trong combobox) → đã ghi thành `DEC-061`, `DEC-062` vào `decisions.md`. Thêm 2 quyết định chốt khi ghi raw US-013 (nghiệp vụ khác nhau giữa "Tạo tháng" và "Clone tháng đang xem") → đã ghi thành `DEC-063`, `DEC-064`. Không có thuật ngữ nghiệp vụ mới phát sinh.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi (`/budget`) — khu vực "Chọn tháng xem" (đổi nhãn) và khu vực tạo tháng mới (ô "Tạo tháng mới", nút "Tạo tháng", nút "Clone tháng đang xem"), tách thành hai khối riêng biệt trên giao diện |
| Thực thể dữ liệu nào bị chạm | Không thay đổi cấu trúc — chỉ đọc thêm danh sách kỳ tháng đã tồn tại (đã có sẵn qua danh sách tháng hiện có) để tính trạng thái mờ/chọn được cho từng kỳ tháng trong combobox |
| Cần thay đổi cấu trúc dữ liệu | Không |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Ngăn trùng tháng bằng cách disable kỳ tháng đã có dữ liệu ngay trong combobox "Tạo tháng mới", không phải báo lỗi sau khi bấm nút | Đã xác nhận từ knowledge — user xác nhận qua dialog trong `ssr-ba` ngày 2026-08-07 (`DEC-061`) | Nếu sai, cần thiết kế lại toàn bộ hướng sửa, ảnh hưởng AC-01 đến AC-05 và toàn bộ `EL-01` |
| A2 | Combobox liệt kê đúng 13 kỳ tháng: 6 tháng trước — tháng hiện tại — 6 tháng sau | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-07 (`DEC-062`) | Nếu sai, cần đổi lại số lượng/khoảng kỳ tháng hiển thị, ảnh hưởng AC-01, AC-04 |
| A3 | Giá trị mặc định của combobox khi mở trang là kỳ tháng gần tháng hiện tại nhất mà chưa có dữ liệu (ưu tiên chính tháng hiện tại nếu còn trống) | Giả định hợp lý — không có bằng chứng trực tiếp, suy từ nguyên tắc thao tác nhanh (M1) và tránh Dylan phải tự cuộn tìm kỳ tháng gần nhất; không ảnh hưởng luồng ngăn trùng (`A1`) vì đây chỉ là giá trị khởi tạo, Dylan vẫn đổi được sang kỳ tháng khác trong danh sách | Nếu sai, chỉ cần đổi giá trị mặc định ban đầu — rủi ro thấp, không ảnh hưởng tới việc ngăn trùng tháng |
| A4 | "Tháng hiện tại" tính theo đồng hồ hệ thống của máy chủ, cùng quy tắc đã dùng cho mini dashboard (`DEC-034`) | Đã xác nhận từ knowledge — nhất quán với quy tắc đã chốt ở nơi khác trong dự án | Nếu sai, cần đổi nguồn tính "tháng hiện tại" — ảnh hưởng khoảng hiển thị ở AC-01, AC-04 |
| A5 | "Tạo tháng" luôn dùng danh mục mặc định của hệ thống, không sao chép gì từ tháng đang xem — tạo khác biệt rõ ràng với "Clone tháng đang xem" | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` khi ghi raw US-013 (`DEC-063`) | Nếu sai, hai nút quay lại cho kết quả giống nhau như hành vi lỗi hiện tại — ảnh hưởng AC-02, AC-07, `EL-03` |
| A6 | "Clone tháng đang xem" chỉ sao chép cấu trúc danh mục (tên/loại/hạn mức/khóa), không sao chép thu nhập, giao dịch, hay danh mục "Chi tiêu khác" | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` khi ghi raw US-013 (`DEC-064`, nhất quán với `DEC-026`) | Nếu sai, cần mở rộng phạm vi sao chép — ảnh hưởng AC-03, `EL-04` |
