# Bảng theo dõi CV ứng tuyển tại trang Roadmap

Status: Ready for DEV
Feature: US-018
Created: 2026-08-13
Updated: 2026-08-13
Raw Source: `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại Dylan không có nơi nào trong hệ thống để theo dõi tập trung các job đang quan tâm và trạng thái nộp CV (hồ sơ xin việc) — trang Roadmap chỉ có lộ trình chiến lược tĩnh, không có danh sách job cụ thể nào.

Sau thay đổi này, Dylan có một bảng ngay trên trang Roadmap để ghi lại từng job đang theo dõi (công ty, hạn nộp, kênh tuyển dụng, đường dẫn tin tuyển dụng, tiến độ ứng tuyển, ghi chú riêng), cập nhật tiến độ khi có phản hồi, và không còn phải nhớ hoặc quản lý thủ công ở nơi khác.

Giá trị đo được: Dylan xem lại được toàn bộ danh sách job đang theo dõi cùng trạng thái mới nhất chỉ bằng một lượt mở trang Roadmap, kể cả sau khi đóng trình duyệt hoặc đổi máy (dữ liệu lưu bền vững).

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md`](../../kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md) | Mục tiêu, phạm vi, luồng nghiệp vụ, business rule |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-021-chan-xoa-platform-dang-dung.md`](../../kb/ba/wiki/knowledge/business-rule/BR-021-chan-xoa-platform-dang-dung.md) | Nội dung rule: chặn xóa option Platform đang được job dùng |
| [`docs/kb/ba/wiki/data/entity/ENT-004-job-ung-tuyen.md`](../../kb/ba/wiki/data/entity/ENT-004-job-ung-tuyen.md) | Định nghĩa và ràng buộc của thực thể Job ứng tuyển |
| [`docs/kb/ba/wiki/data/entity/ENT-005-platform-tuyen-dung.md`](../../kb/ba/wiki/data/entity/ENT-005-platform-tuyen-dung.md) | Định nghĩa và ràng buộc của thực thể Platform tuyển dụng |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Xác nhận trang Roadmap nằm ngoài phạm vi Business Flow "Hệ Thống Quản Lý Chi Tiêu" hiện có (mục 1, M2) — US-018 không thuộc luồng F1-F4 nào; user xác nhận tường minh US-018 là tiện ích cá nhân tách biệt, không cần mở rộng Business Flow (`DEC-088`) |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`. Các quyết định liên quan mang mã DEC (viết tắt của "Decision", mã quyết định đã chốt với user): `DEC-004`, `DEC-080`, `DEC-081`, `DEC-082`, `DEC-083`, `DEC-084`, `DEC-085`, `DEC-086`, `DEC-087`. Các requirement khác được nhắc tới trong spec này dùng tiền tố US (viết tắt của "User Story") ghép số thứ tự, theo đúng quy ước đặt mã function của dự án.

## 3. Phạm Vi

- Thêm bảng "Theo dõi CV ứng tuyển" trên trang Roadmap, ngay dưới khu vực "Lộ trình thực hiện" (`DEC-081`)
- Thêm, sửa, xóa từng job trong bảng, gồm: Công ty, Ngày hết hạn, Platform, Link, Trạng thái, Ghi chú
- Quản lý danh sách option Platform ngay trong ô chọn: thêm option mới, xóa option không còn dùng (chặn xóa nếu đang có job dùng — `BR-021`); khởi tạo sẵn 3 option mặc định "ITViec", "LinkedIn", "VietNamWork"
- Sắp xếp bảng theo cột bất kỳ bằng cách click vào tiêu đề cột (`DEC-083`)
- Lưu toàn bộ dữ liệu (job và danh sách Platform) bền vững vào database, không phụ thuộc trình duyệt (`DEC-080`)

## 4. Ngoài Phạm Vi

- Cảnh báo hoặc đổi màu tự động khi job sắp hoặc đã hết hạn — raw chỉ yêu cầu cột dữ liệu Ngày hết hạn, chưa yêu cầu hành vi cảnh báo
- Luồng chuyển trạng thái bắt buộc theo thứ tự — Dylan được chọn tự do bất kỳ trạng thái nào (`DEC-087`), không có khái niệm "bước tiếp theo" bị khóa
- Liên kết hoặc đồng bộ với các nền tảng tuyển dụng bên ngoài (ITViec, LinkedIn, VietNamWork...) — Platform chỉ là một nhãn Dylan tự quản lý, không có tích hợp dữ liệu thật với các nền tảng đó
- Xuất dữ liệu Job ứng tuyển ra file — chưa được yêu cầu; nếu cần, đây sẽ là requirement riêng tương tự `US-008` (xuất dữ liệu chi tiêu)

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem, thêm, sửa, xóa job; thêm/xóa option Platform; sắp xếp bảng theo cột bất kỳ | Xóa một option Platform đang được ít nhất một job sử dụng (`BR-021`) | `docs/memory/decisions.md#dec-004`, `#dec-082` |

Hệ thống chỉ phục vụ một mình Dylan — không có vai trò nào khác, không đăng nhập/phân quyền (`DEC-004`).

## 6. Luồng Nghiệp Vụ

1. Dylan mở trang Roadmap, thấy bảng "Theo dõi CV ứng tuyển" ngay dưới khu vực "Lộ trình thực hiện".
2. Dylan bấm "+ Thêm job": nhập Công ty, chọn Ngày hết hạn qua lịch chọn ngày, chọn Platform (hoặc thêm một Platform mới ngay tại chỗ nếu chưa có trong danh sách), nhập Link, giữ nguyên hoặc đổi Trạng thái (mặc định "Interested" — `DEC-084`), nhập Ghi chú, rồi lưu.
3. Dylan sửa ngay tại dòng (inline) các trường Công ty, Ngày hết hạn, Platform, Link, hoặc Ghi chú của một job đã tạo: bấm vào ô cần sửa, ô chuyển sang chế độ chỉnh sửa, Dylan nhập/chọn giá trị mới rồi xác nhận — không cần mở form riêng (`DEC-089`).
4. Dylan cập nhật Trạng thái của một job bất kỳ lúc nào có tiến triển, chọn tự do trong 7 giá trị (Interested/Waiting/No Response/Response/Appointment/Cancel/Fail) mà không bị ràng buộc phải theo đúng thứ tự (`DEC-087`).
5. Dylan xóa một job không còn theo dõi, xác nhận trong hộp thoại trước khi job bị xóa thật.
6. Dylan quản lý danh sách Platform ngay trong ô chọn: gõ tên mới vào ô "+ Thêm platform mới" ở cuối danh sách để tạo option, hoặc bấm biểu tượng xóa cạnh một option để xóa option đó.
7. Dylan click vào tiêu đề một cột bất kỳ để sắp xếp toàn bộ bảng theo cột đó (tăng dần); click lại vào cùng tiêu đề để đảo thành giảm dần.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Bảng "Theo dõi CV ứng tuyển" chỉ có dòng tiêu đề và nút "+ Thêm job" — chưa có job nào cho tới khi Dylan thêm job đầu tiên |
| Không đủ quyền | Không áp dụng — hệ thống chỉ có một người dùng (`DEC-004`) |
| Dữ liệu trùng | Không áp dụng — không có ràng buộc chặn trùng Công ty hay trùng tên Platform |
| Hệ thống lỗi | Lưu job mới hoặc cập nhật job bị lỗi (mất kết nối, lỗi máy chủ) — ứng dụng hiện thông báo lỗi chung; dữ liệu Dylan vừa nhập vẫn giữ nguyên trên form tới khi thử lại thành công |
| Xóa Platform đang được job dùng | Thao tác xóa bị chặn, thông báo cho biết đang có job dùng option đó (`BR-021`) |
| Link không hợp lệ | Thao tác lưu bị chặn, thông báo lỗi định dạng hiện ngay dưới ô Link (`DEC-086`) |
| Thiếu trường bắt buộc | Dylan bấm lưu khi Công ty, Ngày hết hạn, hoặc Platform còn để trống — thao tác lưu bị chặn, thông báo lỗi hiện ngay dưới ô còn thiếu yêu cầu nhập/chọn giá trị, cùng cách hiển thị lỗi như ô Link |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Bảng "Theo dõi CV ứng tuyển" đang rỗng (chưa có job nào); Platform có sẵn 3 option mặc định "ITViec", "LinkedIn", "VietNamWork" | Dylan bấm "+ Thêm job", nhập Công ty "Tech Corp", chọn Ngày hết hạn 30/09/2026 qua lịch chọn ngày, chọn Platform "LinkedIn", nhập Link "https://linkedin.com/jobs/123", giữ nguyên Trạng thái mặc định, nhập Ghi chú "Đã nộp CV qua giới thiệu", rồi lưu | Một dòng mới xuất hiện trên bảng đúng với dữ liệu vừa nhập; cột Trạng thái hiển thị "Interested" | Xem ASCII Mockup mục 8.1 |
| AC-02 | Dylan đang mở ô chọn Platform khi thêm/sửa một job; danh sách hiện có 3 option mặc định | Dylan gõ "TopCV" vào ô "+ Thêm platform mới" ở cuối danh sách rồi xác nhận | Option "TopCV" xuất hiện trong danh sách Platform và được chọn ngay cho job đang thao tác | Xem ASCII Mockup mục 8.1 |
| AC-03 | Option Platform "TopCV" không được job nào sử dụng | Dylan bấm biểu tượng xóa cạnh "TopCV" trong ô chọn Platform | Option "TopCV" biến mất khỏi danh sách Platform | Xem ASCII Mockup mục 8.1 |
| AC-04 | Option Platform "LinkedIn" đang được ít nhất một job sử dụng | Dylan bấm biểu tượng xóa cạnh "LinkedIn" trong ô chọn Platform | Thao tác xóa bị chặn; thông báo hiện ra cho biết đang có job dùng "LinkedIn"; option "LinkedIn" vẫn còn trong danh sách | Xem ASCII Mockup mục 8.1 |
| AC-05 | Job "Tech Corp" đang có Trạng thái "Waiting" | Dylan mở ô chọn Trạng thái của job "Tech Corp" và chọn thẳng "Fail" | Trạng thái của job "Tech Corp" đổi ngay thành "Fail", không có cảnh báo hay chặn nào về việc bỏ qua các trạng thái ở giữa | Xem ASCII Mockup mục 8.1 |
| AC-06 | Bảng đang có job "Tech Corp" | Dylan bấm nút xóa (biểu tượng thùng rác) trên dòng "Tech Corp", rồi xác nhận trong hộp thoại hiện ra | Job "Tech Corp" biến mất khỏi bảng | Xem ASCII Mockup mục 8.1 |
| AC-07 | Bảng đang có nhiều job với Ngày hết hạn khác nhau, chưa từng được sắp xếp | Dylan click vào tiêu đề cột "Ngày hết hạn" | Toàn bộ job trên bảng được sắp xếp lại theo Ngày hết hạn tăng dần; click lại lần nữa vào tiêu đề "Ngày hết hạn" thì thứ tự đảo thành giảm dần | Xem ASCII Mockup mục 8.1 |
| AC-08 | Dylan đang thêm hoặc sửa một job | Dylan nhập vào ô Link giá trị "linkedin.com/jobs/123" (thiếu `http://` hoặc `https://`) rồi bấm lưu | Thao tác lưu bị chặn; thông báo lỗi hiện ngay dưới ô Link yêu cầu nhập đúng định dạng đường dẫn | Xem ASCII Mockup mục 8.1 |
| AC-09 | Dylan đã điền đầy đủ thông tin hợp lệ cho một job mới và bấm lưu | Việc lưu bị lỗi do mất kết nối hoặc lỗi máy chủ | Ứng dụng hiện thông báo lỗi chung; dữ liệu Dylan vừa nhập vẫn còn nguyên trên form, chưa có dòng nào được thêm vào bảng, cho tới khi Dylan thử lưu lại thành công | Xem ASCII Mockup mục 8.1 |
| AC-10 | Dylan đang thêm một job mới, đã nhập Link và Ghi chú nhưng để trống Công ty | Dylan bấm lưu mà chưa nhập Công ty | Thao tác lưu bị chặn; thông báo lỗi hiện ngay dưới ô Công ty yêu cầu nhập tên công ty; chưa có dòng nào được thêm vào bảng | Xem ASCII Mockup mục 8.1 |
| AC-11 | Job "Tech Corp" đang có Công ty "Tech Corp", Ngày hết hạn 30/09/2026, Platform "LinkedIn" | Dylan bấm vào ô Công ty của job "Tech Corp", sửa thành "Tech Corp Vietnam", rồi xác nhận | Ô Công ty của job đó hiển thị ngay "Tech Corp Vietnam"; giá trị được lưu lại cho job đó, không cần mở form riêng | Xem ASCII Mockup mục 8.1 |

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
| EL-01 | Bảng "Theo dõi CV ứng tuyển" | Table | "Theo dõi CV ứng tuyển" | Danh sách Job ứng tuyển | **Element mới**. Mỗi dòng là một job. Tiêu đề mỗi cột click được để sắp xếp toàn bảng theo cột đó (tăng dần); click lại vào cùng tiêu đề đảo thành giảm dần. Khi chưa có tương tác sắp xếp nào, bảng giữ nguyên thứ tự job được thêm gần đây nhất lên trên (`DEC-083`) | Dylan | AC-07 | Không |
| EL-02 | Cột "Công ty" | Column | "Công ty" | Công ty (Job ứng tuyển) | **Element mới**. Ô nhập chữ tự do, bắt buộc; để trống thì chặn lưu, thông báo lỗi hiện ngay dưới ô. Sửa ngay tại dòng (inline) cho job đã tạo — bấm vào ô để chỉnh sửa, không cần mở form riêng (`DEC-089`) | Dylan | AC-01, AC-10, AC-11 | Không |
| EL-03 | Cột "Ngày hết hạn" | Column | "Ngày hết hạn" | Ngày hết hạn (Job ứng tuyển) | **Element mới**. Chọn qua lịch chọn ngày, hiển thị theo định dạng `DD/MM/YYYY` (`DEC-085`); bắt buộc, để trống thì chặn lưu, thông báo lỗi hiện ngay dưới ô. Sửa ngay tại dòng (inline) cho job đã tạo — bấm vào ô để mở lại lịch chọn ngày, không cần mở form riêng (`DEC-089`) | Dylan | AC-01, AC-07 | Không |
| EL-04 | Cột "Platform" | Column | "Platform" | Platform (tham chiếu Platform tuyển dụng) | **Element mới**. Ô chọn (combobox), bắt buộc, để trống thì chặn lưu và hiện thông báo lỗi ngay dưới ô; có sẵn 3 option mặc định "ITViec", "LinkedIn", "VietNamWork"; có mục "+ Thêm platform mới" ở cuối danh sách để tạo option ngay tại chỗ, option mới tạo được chọn ngay cho job đang thao tác; mỗi option kèm biểu tượng xóa, xóa bị chặn nếu đang có job dùng (`BR-021`). Sửa ngay tại dòng (inline) cho job đã tạo — bấm vào ô để mở lại danh sách chọn, không cần mở form riêng (`DEC-089`) | Dylan | AC-01, AC-02, AC-03, AC-04 | Không |
| EL-05 | Cột "Link" | Column | "Link" | Link (Job ứng tuyển) | **Element mới**. Ô nhập chữ, bắt buộc, phải bắt đầu bằng `http://` hoặc `https://` (`DEC-086`); sai định dạng thì chặn lưu và hiện thông báo lỗi ngay dưới ô. Sửa ngay tại dòng (inline) cho job đã tạo — bấm vào ô để chỉnh sửa, không cần mở form riêng (`DEC-089`) | Dylan | AC-01, AC-08 | Không |
| EL-06 | Cột "Trạng thái" | Column | "Trạng thái" | Trạng thái (Job ứng tuyển) | **Element mới**. Ô chọn cố định 7 giá trị: Interested/Waiting/No Response/Response/Appointment/Cancel/Fail; mặc định "Interested" khi thêm job mới (`DEC-084`); Dylan chọn tự do bất kỳ giá trị nào tại mọi thời điểm, không ràng buộc thứ tự (`DEC-087`); sửa ngay tại dòng (inline), không cần mở form riêng (`DEC-089`) | Dylan | AC-01, AC-05 | Không |
| EL-07 | Cột "Ghi chú" | Column | "Ghi chú" | Ghi chú (Job ứng tuyển) | **Element mới**. Ô nhập chữ tự do, không bắt buộc. Sửa ngay tại dòng (inline) cho job đã tạo — bấm vào ô để chỉnh sửa, không cần mở form riêng (`DEC-089`) | Dylan | AC-01 | Không |
| EL-08 | Nút "Thêm job" | Button | "+ Thêm job" | — | **Element mới**. Luôn bật; bấm vào tạo một dòng mới với Trạng thái mặc định "Interested", các trường còn lại rỗng chờ Dylan điền; nếu lưu bị lỗi hệ thống, dữ liệu vừa nhập vẫn giữ nguyên trên form để Dylan thử lại | Dylan | AC-01, AC-09 | Không |
| EL-09 | Nút xóa job (từng dòng) | Button | biểu tượng thùng rác trên mỗi dòng | — | **Element mới**. Bấm vào hiện hộp thoại xác nhận trước; job chỉ bị xóa thật sau khi Dylan xác nhận | Dylan | AC-06 | Không |

**ASCII Mockup**

```text
+---------------------------------------------------------------------------------------------------+
| Theo dõi CV ứng tuyển                                                                                |
+---------------------------------------------------------------------------------------------------+
| Công ty      | Ngày hết hạn v| Platform    v | Link                  | Trạng thái   v| Ghi chú     | |
+---------------------------------------------------------------------------------------------------+
| Tech Corp    | 30/09/2026    | LinkedIn      | linkedin.com/jobs/123 | [Interested v]| Giới thiệu | X|
| ACME Inc     | 15/09/2026    | ITViec        | itviec.com/jobs/456   | [Waiting   v] | -          | X|
+---------------------------------------------------------------------------------------------------+
|                                                                                    [+ Thêm job]      |
+---------------------------------------------------------------------------------------------------+

Ô chọn Platform khi mở ra:
+----------------------+
| ITViec            [x]|
| LinkedIn          [x]|
| VietNamWork       [x]|
| TopCV             [x]|
+----------------------+
| [+ Thêm platform mới]|
+----------------------+
```

Tiêu đề cột có ký hiệu `v` (`Ngày hết hạn v`, `Platform v`, `Trạng thái v`) minh họa click được để sắp xếp (`EL-01`). Biểu tượng `[x]` cuối mỗi dòng là nút xóa job (`EL-09`). Ô chọn Platform hiển thị bên dưới minh họa 4 option kèm biểu tượng xóa `[x]` từng option, và ô "+ Thêm platform mới" ở cuối để tạo option mới (`EL-04`).

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Button`: nêu rõ điều kiện bật/tắt và điều gì xảy ra sau khi bấm.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Job ứng tuyển | Thêm | Có | Lưu bền vững vào database, không giới hạn thời gian lưu |
| Platform tuyển dụng | Thêm | Có | Lưu bền vững vào database; khởi tạo sẵn 3 option mặc định khi triển khai |

## 10. Phụ Thuộc

Không có phụ thuộc. Đã rà toàn bộ 12 spec hiện có trong `docs/features/` (`US-001` đến `US-017`, trừ `US-007`, `US-008`, `US-009`, `US-011` chưa có spec và `US-013` đã gộp vào `US-006`) cùng `docs/kb/ba/business-flow.md` — US-018 không dùng chung dữ liệu, màn hình, hay quy tắc nghiệp vụ nào với các function hiện có; độc lập với luồng F1-F4 của Business Flow "Hệ Thống Quản Lý Chi Tiêu".

## 11. Tác Động Tới Spec Khác

Không có spec nào bị ảnh hưởng. Đã rà toàn bộ 12 spec hiện có (`US-001` đến `US-017`, trừ `US-007`, `US-008`, `US-009`, `US-011` chưa có spec và `US-013` đã gộp vào `US-006`) — không phát hiện chồng lấn dữ liệu, màn hình, hay quy tắc nào với US-018.

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md`](../../kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-018-theo-doi-cv-ung-tuyen.md`](../../kb/ba/wiki/delivery/pbi/US-018-theo-doi-cv-ung-tuyen.md) | Điền đầy đủ User Story và 11 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory: 6 quyết định chốt qua dialog trong `ssr-ba` (2026-08-13) đã ghi thành `DEC-084` (Trạng thái mặc định "Interested"), `DEC-085` (Ngày hết hạn dùng date picker), `DEC-086` (validate Link hợp lệ), `DEC-087` (chuyển Trạng thái tự do, không tuần tự), `DEC-088` (US-018 là tiện ích cá nhân tách biệt, không thuộc Business Flow "Hệ Thống Quản Lý Chi Tiêu"), `DEC-089` (sửa các trường job ngay tại dòng — inline). Thuật ngữ nghiệp vụ mới "Job ứng tuyển" và "Platform tuyển dụng" cần thêm vào `glossary.md` — chưa có trong bản hiện tại, cần bổ sung cùng đợt `ssr-ingest mode=sync` khi spec đạt `Ready for DEV`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Roadmap — bảng mới "Theo dõi CV ứng tuyển" (ngay dưới khu vực "Lộ trình thực hiện") |
| Thực thể dữ liệu nào bị chạm | Job ứng tuyển (mới), Platform tuyển dụng (mới) |
| Cần thay đổi cấu trúc dữ liệu | Có — cần tạo mới hoàn toàn cấu trúc lưu trữ cho Job ứng tuyển và Platform tuyển dụng, hiện chưa có gì tồn tại; giao cho `ssr-data` khi `ssr-plan` tới lượt |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Có |
| Có ảnh hưởng báo cáo/export | Không — Job ứng tuyển và Platform tuyển dụng không thuộc phạm vi xuất dữ liệu hiện có (`US-008` chỉ xuất dữ liệu chi tiêu) |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Trạng thái mặc định khi thêm job mới là "Interested" | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-13 (`docs/memory/decisions.md#dec-084`) | Nếu sai, cần đổi giá trị mặc định ở mục 6, 7 (AC-01), 8.1 (EL-06, EL-08) |
| A2 | Ngày hết hạn nhập qua lịch chọn ngày (date picker), không phải ô nhập chữ tự do | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-13 (`docs/memory/decisions.md#dec-085`) | Nếu sai, cần đổi loại element ở mục 8.1 (EL-03) và cách mô tả thao tác ở AC-01 |
| A3 | Link phải bắt đầu bằng `http://` hoặc `https://`, chặn lưu nếu sai định dạng | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-13 (`docs/memory/decisions.md#dec-086`) | Nếu sai, cần bỏ AC-08 và ràng buộc validate ở EL-05 |
| A4 | Dylan được chọn tự do bất kỳ Trạng thái nào tại mọi thời điểm, không bị ràng buộc thứ tự | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-13 (`docs/memory/decisions.md#dec-087`) | Nếu sai, cần thêm ràng buộc thứ tự chuyển trạng thái ở mục 6, AC-05, EL-06 |
| A5 | Xóa một job cần hộp thoại xác nhận trước khi xóa thật | Giả định hợp lý — theo đúng pattern đã chuẩn hóa nhất quán cho mọi thao tác xóa trong toàn ứng dụng (xem [`BR-002`](../../kb/ba/wiki/knowledge/business-rule/BR-002-xoa-can-xac-nhan.md) của `US-004`, `docs/memory/decisions.md#dec-009`) | Nếu sai (Dylan muốn xóa ngay không cần xác nhận), cần bỏ bước xác nhận ở mục 6, AC-06, EL-09 |
| A6 | Khi bảng chưa có tương tác sắp xếp nào, job hiển thị theo thứ tự thêm gần đây nhất lên trên; click tiêu đề cột lần đầu sắp tăng dần, click lại đảo thành giảm dần | Giả định hợp lý — hành vi click-to-sort tiêu chuẩn phổ biến, chưa được user xác nhận chi tiết chiều sắp xếp mặc định | Nếu sai, cần đổi mô tả thứ tự mặc định và chiều sắp xếp ở mục 6, AC-07, EL-01 |
| A7 | Sửa các trường Công ty, Ngày hết hạn, Platform, Link, Ghi chú của một job đã tạo theo cách sửa ngay tại dòng (inline) — bấm vào ô để chỉnh sửa trực tiếp, không mở form riêng | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-13 (`docs/memory/decisions.md#dec-089`) | Nếu sai (Dylan muốn mở form riêng để sửa), cần đổi lại bước 3 ở mục 6, AC-11, và ràng buộc ở EL-02, EL-03, EL-04, EL-05, EL-07 |
| A8 | US-018 là tiện ích cá nhân tách biệt trên trang Roadmap, không thuộc Business Flow "Hệ Thống Quản Lý Chi Tiêu" (`docs/kb/ba/business-flow.md`) và không cần một phiên `ssr-po mode=business-flow` riêng để mở rộng phạm vi trước khi tiếp tục | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-13, sau khi `po-expert` nêu vấn đề định hướng (`docs/memory/decisions.md#dec-088`) | Nếu sai, US-018 cần tạm dừng ở `Draft` chờ một phiên `ssr-po mode=business-flow` chốt mục tiêu mới cho khu vực Roadmap trước khi tiếp tục |
