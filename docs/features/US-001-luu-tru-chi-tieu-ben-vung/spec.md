# Lưu trữ chi tiêu bền vững và liên kết giao dịch theo danh mục cố định

Status: Ready for DEV
Feature: US-001
Created: 2026-08-03
Updated: 2026-08-03
Raw Source: `docs/kb/ba/raw/US-001-luu-tru-chi-tieu-ben-vung.md`
BA Wiki: `docs/kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

> **Gộp phạm vi:** Spec này gộp chung hai requirement — `US-001` (Lưu trữ chi tiêu bền vững) và [`US-003`](../../kb/ba/raw/US-003-lien-ket-giao-dich-theo-id.md) (Liên kết giao dịch theo danh mục bằng ID) — vì theo [`docs/kb/ba/backlog.md`](../../kb/ba/backlog.md), hai yêu cầu này phải thiết kế chung một cấu trúc dữ liệu; làm riêng sẽ phải xây dựng lại. US-003 không có thư mục feature riêng; toàn bộ tiêu chí chấp nhận liên quan tới US-003 nằm trong bảng mục 7 của spec này (AC-05).

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại Dylan ghi nhận và theo dõi chi tiêu (tháng, danh mục, giao dịch) chỉ trong bộ nhớ của trình duyệt đang dùng. Khi Dylan xóa dữ liệu trình duyệt hoặc chuyển sang máy khác, toàn bộ lịch sử chi tiêu biến mất và Dylan phải nhập lại từ đầu. Đồng thời, mỗi giao dịch hiện chỉ ghi tên danh mục dưới dạng chữ tại thời điểm tạo, nên khi Dylan đổi tên danh mục sau này, các giao dịch cũ không còn khớp đúng với danh mục đó.

Sau thay đổi này, dữ liệu chi tiêu của Dylan được lưu trữ bền vững, không phụ thuộc vào trình duyệt hay thiết bị cụ thể, và mỗi giao dịch được gắn chắc chắn vào đúng một danh mục thông qua một mã nhận diện cố định của danh mục đó — đổi tên danh mục không còn làm giao dịch cũ bị lệch hay mất liên kết.

Giá trị đo được: Sau khi Dylan xóa dữ liệu trình duyệt (xóa cache/site data) hoặc mở Quản lý chi tiêu trên một thiết bị khác, toàn bộ tháng, danh mục và giao dịch đã ghi trước đó vẫn hiển thị đúng như trước; và sau khi đổi tên một danh mục, các giao dịch cũ của danh mục đó vẫn cộng đúng vào tổng "Chi thực tế" dưới tên mới.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md`](../../kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md) | Mục tiêu M1, phạm vi lưu trữ bền vững, quy tắc "Chi thực tế" là số tính tự động (BR-01), yêu cầu di trú dữ liệu cũ (BR-02) |
| [`docs/kb/ba/wiki/US-003-lien-ket-giao-dich-theo-id.md`](../../kb/ba/wiki/US-003-lien-ket-giao-dich-theo-id.md) | Yêu cầu giao dịch tham chiếu danh mục qua mã nhận diện cố định thay vì tên chuỗi (BR-01) |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, luồng F1 (Ghi nhận chi tiêu) và F2 (Ngân sách theo danh mục) |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`.

## 3. Phạm Vi

- Toàn bộ dữ liệu tháng ngân sách, danh mục và giao dịch của Dylan được lưu trữ bền vững, không mất khi xóa dữ liệu trình duyệt hoặc đổi thiết bị.
- Dữ liệu Dylan đã ghi nhận trước đây trong trình duyệt được chuyển sang nơi lưu trữ bền vững một lần duy nhất, giữ nguyên nội dung, số tiền, danh mục và ngày của từng giao dịch.
- Mỗi giao dịch được gắn với đúng một danh mục thông qua mã nhận diện cố định của danh mục đó, không còn theo tên hiển thị tại thời điểm tạo.
- "Chi thực tế" của mỗi danh mục luôn bằng tổng các giao dịch đang gắn với danh mục đó tại thời điểm xem; ô nhập tay hiện có trên bảng ngân sách theo danh mục cho cột này bị bỏ, Dylan không còn sửa số này trực tiếp được nữa.

## 4. Ngoài Phạm Vi

- Sửa hoặc xóa từng giao dịch riêng lẻ sau khi đã ghi nhận — thuộc requirement riêng (sửa/xóa từng giao dịch).
- Ràng buộc chuyển giao dịch khi xóa một danh mục, và danh mục dự phòng cho giao dịch không có danh mục — thuộc requirement riêng (ràng buộc toàn vẹn danh mục).
- Chặn trùng tên danh mục khi thêm hoặc sửa tên — thuộc requirement riêng (chặn trùng tên danh mục).
- Cho Dylan tự cấu hình ngưỡng cảnh báo, mục tiêu chi và quỹ linh hoạt — thuộc requirement riêng (cấu hình ngưỡng ngân sách).
- Tách Quản lý chi tiêu ra một khu vực điều hướng riêng của Dylan Plan Dashboard — thuộc requirement riêng (route/module riêng).
- Đăng nhập, phân quyền hoặc chia sẻ dữ liệu với người khác — hệ thống chỉ phục vụ một mình Dylan.

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem, ghi nhận chi tiêu, xem lại lịch sử tháng cũ ở bất kỳ thời điểm hoặc thiết bị nào | Không có vai trò thứ hai — hệ thống chỉ phục vụ một người dùng, không có khái niệm tài khoản | [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) |

## 6. Luồng Nghiệp Vụ

1. Lần đầu Dylan mở Quản lý chi tiêu sau khi hệ thống chuyển sang lưu trữ bền vững, toàn bộ tháng, danh mục và giao dịch Dylan đã ghi trước đó (đang nằm trong trình duyệt) được chuyển vào nơi lưu trữ bền vững một lần, giữ nguyên nội dung, số tiền, danh mục và ngày của từng giao dịch.
2. Dylan ghi nhận một giao dịch chi tiêu mới bằng cách gõ nội dung và xác nhận danh mục (theo luồng nhập nhanh hiện có); giao dịch được lưu bền vững và gắn với đúng một danh mục qua mã nhận diện cố định của danh mục đó, không theo tên đang hiển thị.
3. Dylan mở lại Quản lý chi tiêu vào một thời điểm sau đó — kể cả sau khi xóa dữ liệu trình duyệt hoặc trên một thiết bị khác; toàn bộ tháng, danh mục và giao dịch trước đó xuất hiện lại đúng như trước.
4. Dylan xem bảng ngân sách theo danh mục của tháng đang chọn; cột "Chi thực tế" hiển thị tổng các giao dịch đang gắn với danh mục đó, tự tính lại ngay khi có giao dịch mới, không còn ô để Dylan gõ tay vào cột này.
5. Dylan đổi tên một danh mục đã có giao dịch; các giao dịch đã ghi nhận trước khi đổi tên vẫn hiển thị đúng dưới tên mới của danh mục và vẫn được cộng đúng vào "Chi thực tế" của danh mục đó.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Tháng vừa tạo chưa có giao dịch nào — mọi danh mục hiển thị "Chi thực tế" bằng 0đ |
| Không đủ quyền | Không áp dụng — hệ thống chỉ có một người dùng, không có khái niệm phân quyền |
| Dữ liệu trùng | Không thuộc phạm vi requirement này — xem requirement riêng về cảnh báo trùng tháng và chặn trùng tên danh mục |
| Hệ thống lỗi | Nếu quá trình chuyển dữ liệu cũ sang lưu trữ bền vững bị gián đoạn giữa chừng, Dylan thấy thông báo rõ ràng rằng việc chuyển dữ liệu chưa hoàn tất, và dữ liệu cũ trong trình duyệt vẫn còn nguyên cho tới khi chuyển thành công; hệ thống tự động thử lại vào lần Dylan mở lại Quản lý chi tiêu kế tiếp, Dylan không cần bấm nút nào (DEC-039) |
| Di trú đã hoàn tất trước đó | Nếu Dylan mở lại Quản lý chi tiêu sau khi dữ liệu cũ đã được chuyển thành công ở lần mở trước, hệ thống không chuyển lại lần nữa và không tạo thêm bản ghi trùng cho các tháng/danh mục/giao dịch đã có — đúng với nguyên tắc "một lần duy nhất" ở mục 3 |
| Di trú đang chạy từ thiết bị khác | Nếu Dylan mở Quản lý chi tiêu trên một thiết bị trong lúc việc di trú đang chạy từ một thiết bị khác, thiết bị đang mở chỉ hiển thị thông báo đang chờ, không tự chạy di trú song song, tránh tạo dữ liệu trùng (DEC-040) |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Dylan đã có 2 tháng dữ liệu (tháng 04/2026 và 05/2026) lưu trong trình duyệt trước khi hệ thống chuyển sang lưu trữ bền vững | Dylan mở lại Quản lý chi tiêu lần đầu sau khi hệ thống nâng cấp | Cả 2 tháng đó xuất hiện trong danh sách chọn tháng, với đúng số danh mục và đúng số giao dịch như trước khi nâng cấp | Chưa có — kế thừa giao diện Quản lý chi tiêu hiện có, chưa có bản vẽ riêng cho màn hình này |
| AC-02 | Tháng đang chọn có 3 giao dịch cùng gắn vào danh mục "Ăn uống" với số tiền 45.000đ, 65.000đ và 120.000đ | Dylan mở bảng ngân sách theo danh mục của tháng đang chọn | Cột "Chi thực tế" của danh mục "Ăn uống" hiển thị đúng 230.000đ (tổng 3 giao dịch), và cột này không còn ô để Dylan gõ số khác vào | Chưa có — kế thừa giao diện bảng ngân sách hiện có, chưa có bản vẽ riêng |
| AC-03 | Danh mục "Di chuyển" của tháng đang chọn đang có "Chi thực tế" là 200.000đ | Dylan ghi nhận thành công một giao dịch mới 50.000đ vào danh mục "Di chuyển" | Cột "Chi thực tế" của danh mục "Di chuyển" đổi thành 250.000đ ngay sau khi giao dịch được lưu, không cần Dylan làm thêm thao tác nào khác | Chưa có — kế thừa giao diện nhập nhanh hiện có, chưa có bản vẽ riêng |
| AC-04 | Dylan đã xóa toàn bộ dữ liệu trình duyệt (cache/site data) sau khi hệ thống đã chuyển sang lưu trữ bền vững | Dylan mở lại Quản lý chi tiêu trên cùng thiết bị hoặc thiết bị khác | Danh sách chọn tháng vẫn liệt kê đúng các tháng đã có trước khi xóa dữ liệu trình duyệt, với đúng số giao dịch của từng danh mục như trước đó | Chưa có — kế thừa giao diện Quản lý chi tiêu hiện có, chưa có bản vẽ riêng |
| AC-05 | Danh mục "Ăn uống" đang có một giao dịch 45.000đ đã ghi nhận trước đó | Dylan đổi tên danh mục "Ăn uống" thành "Ăn uống & đi chợ" | Giao dịch 45.000đ đó vẫn hiển thị gắn với danh mục, dưới tên mới "Ăn uống & đi chợ", và vẫn được cộng vào "Chi thực tế" của danh mục đó — không tách thành danh mục riêng và không biến mất khỏi tổng | Chưa có — thao tác đổi tên kế thừa giao diện bảng danh mục hiện có, chưa có bản vẽ riêng |
| AC-06 | Quá trình chuyển dữ liệu cũ từ trình duyệt sang lưu trữ bền vững bị gián đoạn giữa chừng (ví dụ mất kết nối mạng) | Dylan mở lại Quản lý chi tiêu trong lúc vẫn mất kết nối, rồi mở lại thêm một lần nữa sau khi kết nối đã ổn định | Lần mở đầu: Dylan thấy thông báo việc chuyển dữ liệu chưa hoàn tất, dữ liệu cũ trong trình duyệt vẫn còn nguyên. Lần mở sau: hệ thống tự hoàn tất việc di trú mà không cần Dylan bấm nút nào, thông báo biến mất, toàn bộ tháng/danh mục/giao dịch cũ xuất hiện | Chưa có — chưa có bản vẽ cho thông báo này |
| AC-07 | Dữ liệu cũ trong trình duyệt đã được chuyển thành công sang lưu trữ bền vững ở lần Dylan mở Quản lý chi tiêu trước đó (2 tháng, đúng số danh mục và giao dịch như ở AC-01) | Dylan mở lại Quản lý chi tiêu thêm một lần nữa | Số tháng, số danh mục và số giao dịch hiển thị giữ nguyên như ngay sau lần chuyển đầu tiên — không có tháng, danh mục hay giao dịch nào bị nhân đôi | Chưa có — kế thừa giao diện Quản lý chi tiêu hiện có, chưa có bản vẽ riêng |
| AC-08 | Việc di trú đang chạy trên thiết bị A (đã đánh dấu trạng thái "đang di trú" dùng chung) | Dylan mở Quản lý chi tiêu trên thiết bị B trong lúc thiết bị A đang di trú | Thiết bị B không tự chạy di trú song song — chỉ hiển thị thông báo đang chờ, không tạo thêm tháng/danh mục/giao dịch trùng với dữ liệu thiết bị A đang chuyển | Chưa có — chưa có bản vẽ cho thông báo chờ đa thiết bị |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thì ghi rõ `Chưa có` kèm lý do ngắn, không để trống.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

Liệt kê mọi thành phần màn hình mà requirement này chạm tới.

### 8.1. Quản lý chi tiêu — khu vực chọn tháng — `Tab "Thu chi" trong Dylan Plan Dashboard`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Chọn tháng | Dropdown | Chọn tháng | Danh sách các tháng đã lưu trữ bền vững | Liệt kê toàn bộ tháng đã lưu, kể cả tháng ghi trước khi hệ thống chuyển sang lưu trữ bền vững; giá trị mặc định là tháng gần nhất | Dylan | AC-01, AC-04, AC-07 | Không |
| EL-02 | Danh sách giao dịch gần đây | Table | Giao dịch gần đây | Giao dịch của tháng đang chọn | Hiển thị các giao dịch đã ghi nhận, mới nhất lên đầu; không đổi cách hiển thị so với hiện tại | Dylan | AC-03 | Không |
| EL-03 | Thông báo di trú dữ liệu chưa hoàn tất | Toast | "Việc chuyển dữ liệu cũ sang lưu trữ mới chưa hoàn tất, dữ liệu cũ của bạn vẫn còn nguyên" | Trạng thái di trú dữ liệu cũ (dùng chung giữa các thiết bị — DEC-040) | Chỉ hiện khi quá trình chuyển dữ liệu cũ bị gián đoạn, chưa hoàn tất, hoặc đang chạy từ một thiết bị khác; tự động thử lại mỗi lần Dylan mở lại màn hình, không có nút thao tác riêng (DEC-039); biến mất khi di trú hoàn tất thành công; **khác với toast xác nhận ghi nhận giao dịch ở F1 (DEC-012)**: toast này không tự đóng theo thời gian, chỉ biến mất khi di trú thực sự hoàn tất | Dylan | AC-06, AC-08 | Không |

### 8.2. Quản lý chi tiêu — bảng ngân sách theo danh mục — `Tab "Thu chi" trong Dylan Plan Dashboard`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-04 | Bảng ngân sách theo danh mục | Table | Bảng danh mục | Danh sách danh mục của tháng đang chọn | Hiển thị mọi danh mục của tháng đang chọn | Dylan | AC-02 | Không |
| EL-05 | Cột Danh mục | Column | Danh mục | Tên hiện tại của danh mục | Text; đổi tên danh mục không làm mất liên kết với giao dịch cũ | Dylan | AC-05 | Không |
| EL-06 | Cột Chi thực tế | Column | Chi thực tế | Tổng số tiền các giao dịch đang gắn với danh mục trong tháng đang chọn | Chỉ đọc — tính tự động bằng tổng giao dịch gắn với danh mục; **đổi hành vi so với hiện tại**: trước đây là ô nhập cho Dylan gõ tay số, nay bỏ hẳn khả năng gõ tay, số luôn do hệ thống tính | Dylan | AC-02, AC-03, AC-05 | Không |

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Button`: nêu rõ điều kiện bật/tắt và điều gì xảy ra sau khi bấm.
- Với `Input`: nêu rõ bắt buộc hay không, định dạng, thông báo lỗi khi nhập sai.
- Cột **Liên kết PBI/US** chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Tháng ngân sách | Thêm — chuyển từ chỉ lưu trong trình duyệt sang lưu trữ bền vững | Có | Giữ vĩnh viễn, không giới hạn thời gian |
| Danh mục | Thêm — chuyển sang lưu trữ bền vững, gắn mã nhận diện cố định | Có | Giữ vĩnh viễn |
| Giao dịch | Thêm — chuyển sang lưu trữ bền vững; gắn với danh mục qua mã nhận diện cố định thay vì tên | Có | Giữ vĩnh viễn |
| Trạng thái di trú dữ liệu cũ | Thêm — cần lưu lại (không chỉ giữ trong phiên làm việc hiện tại) để hệ thống biết đã chuyển xong hay chưa mỗi khi Dylan mở lại ứng dụng, phục vụ EL-03 và AC-06, AC-07 | Có | Giữ tới khi di trú hoàn tất; không cần giữ tiếp sau đó |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng (xuất dữ liệu từ nguồn lưu trữ bền vững) |

## 10. Phụ Thuộc

Không có phụ thuộc bên ngoài chặn triển khai. Đây là requirement nền tảng đầu tiên của hệ thống Quản lý chi tiêu — mọi requirement khác (route riêng, sửa/xóa giao dịch, ràng buộc danh mục, cấu hình ngưỡng, phân tích và xuất dữ liệu, mini dashboard) phụ thuộc ngược lại vào requirement này để có dữ liệu bền vững làm nền. Phạm vi đã tìm: toàn bộ raw và BA wiki hiện có trong `docs/kb/ba/raw/` và `docs/kb/ba/wiki/` — không có spec nào khác đã tồn tại (`Ready for DEV` hay `Implemented`) tại thời điểm viết spec này.

## 11. Tác Động Tới Spec Khác

Chưa có spec nào khác tồn tại để đối chiếu tại thời điểm viết spec này — toàn bộ 10 requirement còn lại trong hệ thống Quản lý chi tiêu mới ở trạng thái Raw, chưa có spec. Follow-up: khi viết spec cho các requirement còn lại (sửa/xóa giao dịch, ràng buộc danh mục, chặn trùng tên danh mục, cấu hình ngưỡng, phân tích và xuất dữ liệu, mini dashboard, route riêng), các spec đó phải dùng đúng hai nguyên tắc đã xác lập ở đây: (1) giao dịch luôn gắn với danh mục qua mã nhận diện cố định, không theo tên; (2) "Chi thực tế" luôn là số tính tự động từ tổng giao dịch, không có ô nhập tay.

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md`](../../kb/ba/wiki/US-001-luu-tru-chi-tieu-ben-vung.md) | Nâng `Status` lên `Active`, thêm luồng nghiệp vụ đầy đủ và các `BR-##` đã xác nhận |
| [`docs/kb/ba/wiki/US-003-lien-ket-giao-dich-theo-id.md`](../../kb/ba/wiki/US-003-lien-ket-giao-dich-theo-id.md) | Nâng `Status` lên `Active`, ghi rõ đã gộp triển khai cùng US-001 trong spec này |

Memory cần ghi: quyết định về xử lý khi di trú dữ liệu bị gián đoạn (nếu user xác nhận khác giả định ở mục 14) → `decisions.md`; không có thuật ngữ nghiệp vụ mới phát sinh ngoài những gì đã có trong `glossary.md`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Quản lý chi tiêu — khu vực chọn tháng (xem lịch sử) và khu vực bảng ngân sách theo danh mục |
| Thực thể dữ liệu nào bị chạm | Tháng ngân sách, Danh mục, Giao dịch, Trạng thái di trú dữ liệu cũ |
| Cần thay đổi cấu trúc dữ liệu | Có |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Có |
| Có ảnh hưởng báo cáo/export | Không — xuất dữ liệu JSON thuộc requirement riêng |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | US-001 và US-003 dùng chung một spec vì phải thiết kế cấu trúc dữ liệu cùng lúc, theo `docs/kb/ba/backlog.md` | Đã xác nhận từ knowledge | Nếu tách riêng sau này sẽ phải xây dựng lại cấu trúc dữ liệu |
| A2 | Khi quá trình di trú dữ liệu cũ bị gián đoạn giữa chừng, dữ liệu cũ trong trình duyệt được giữ nguyên cho tới khi di trú thành công, kèm thông báo rõ ràng cho Dylan (AC-06) | Giả định hợp lý | Nếu sai, Dylan có thể mất dữ liệu khi việc di trú bị lỗi giữa chừng — nên xác nhận lại với Dylan trước khi triển khai thật |
| A3 | Hệ thống tự động thử lại việc di trú mỗi lần Dylan mở lại Quản lý chi tiêu, không cần Dylan bấm nút thủ công (AC-06) | Đã xác nhận từ knowledge (`DEC-039`) | Nếu sai, Dylan có thể phải tự làm mới trang nhiều lần mà không rõ vì sao |
| A4 | Việc di trú dùng một trạng thái "đang di trú" dùng chung giữa các thiết bị; thiết bị mở sau thấy trạng thái đang chạy thì chỉ chờ, không tự di trú lại (AC-08) | Đã xác nhận từ knowledge (`DEC-040`) | Nếu sai, có rủi ro tạo dữ liệu trùng khi Dylan mở nhiều thiết bị cùng lúc trong lúc di trú đang chạy |
