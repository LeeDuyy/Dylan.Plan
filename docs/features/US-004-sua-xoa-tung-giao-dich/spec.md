# Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu

Status: Ready for DEV
Feature: US-004
Created: 2026-08-05
Updated: 2026-08-05
Raw Source: `docs/kb/ba/raw/US-004-sua-xoa-tung-giao-dich.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-004-sua-xoa-tung-giao-dich.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, khi Dylan ghi nhận sai một giao dịch chi tiêu (sai số tiền, sai danh mục, nhầm ngày...), cách duy nhất để sửa là bấm "Reset chi tháng này" — xóa sạch toàn bộ giao dịch của cả tháng rồi nhập lại từ đầu. Không có cách nào sửa hoặc xóa riêng một giao dịch.

Sau thay đổi này, Dylan sửa được đầy đủ nội dung, số tiền, danh mục và ngày của một giao dịch nhập sai, hoặc xóa riêng một giao dịch (có xác nhận trước), mà không ảnh hưởng tới các giao dịch khác trong tháng. "Chi thực tế" của danh mục liên quan luôn tự cập nhật đúng theo thay đổi vừa thực hiện.

Giá trị đo được: Dylan nhập sai số tiền của một giao dịch (vd gõ nhầm 45.000đ thay vì 54.000đ) → sửa lại đúng số tiền cho riêng giao dịch đó → "Chi thực tế" của danh mục đổi đúng theo phần chênh lệch, các giao dịch khác trong tháng không bị mất hay đổi giá trị.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-004-sua-xoa-tung-giao-dich.md`](../../kb/ba/wiki/knowledge/feature/US-004-sua-xoa-tung-giao-dich.md) | Mục tiêu, phạm vi, luồng nghiệp vụ, 5 business rule |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-001-sua-day-du-4-truong.md`](../../kb/ba/wiki/knowledge/business-rule/BR-001-sua-day-du-4-truong.md) | Sửa giao dịch cho phép đổi đầy đủ 4 trường |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-002-xoa-can-xac-nhan.md`](../../kb/ba/wiki/knowledge/business-rule/BR-002-xoa-can-xac-nhan.md) | Xóa giao dịch phải qua xác nhận trước |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-003-chi-thang-dang-chon.md`](../../kb/ba/wiki/knowledge/business-rule/BR-003-chi-thang-dang-chon.md) | Chỉ cho sửa/xóa giao dịch của tháng đang chọn |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-004-ngay-khong-tuong-lai.md`](../../kb/ba/wiki/knowledge/business-rule/BR-004-ngay-khong-tuong-lai.md) | Ngày giao dịch chỉ nhận giá trị ≤ hôm nay |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-005-khong-undo.md`](../../kb/ba/wiki/knowledge/business-rule/BR-005-khong-undo.md) | Không có tính năng khôi phục sau khi xóa |
| [`docs/kb/ba/wiki/data/entity/ENT-001-giao-dich.md`](../../kb/ba/wiki/data/entity/ENT-001-giao-dich.md) | Thực thể Giao dịch — đã có sẵn từ US-001, không cần tạo mới |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`.

## 3. Phạm Vi

- Sửa đầy đủ 4 trường của một giao dịch: nội dung, số tiền, danh mục, ngày (ngày chỉ nhận giá trị ≤ hôm nay)
- Xóa một giao dịch, có bước xác nhận trước khi xóa thật
- Chỉ áp dụng cho giao dịch thuộc tháng đang chọn trên màn hình
- "Chi thực tế" của danh mục cũ và danh mục mới (nếu đổi danh mục khi sửa) luôn tự tính lại đúng ngay sau khi sửa/xóa
- Danh sách giao dịch tại bảng chi tiết chi tiêu hiển thị đầy đủ toàn bộ giao dịch của tháng đang chọn (không còn giới hạn chỉ 8 giao dịch gần nhất như hiện tại), mới nhất lên đầu

## 4. Ngoài Phạm Vi

- Khôi phục (undo) một giao dịch sau khi đã xóa — không phát triển tính năng này, hộp xác nhận trước khi xóa là lớp bảo vệ duy nhất
- Sửa hoặc xóa giao dịch của một tháng khác tháng đang chọn trên màn hình
- Tạo mới danh mục "Chi tiêu khác", và ràng buộc khi xóa một danh mục đang có giao dịch — thuộc requirement riêng (ràng buộc toàn vẹn danh mục, chưa triển khai). Vì "Chi thực tế" của mọi danh mục (kể cả "Chi tiêu khác" khi nó tồn tại) luôn được tính lại tự động từ tổng giao dịch chứ không xử lý riêng theo tên danh mục, việc sửa/xóa giao dịch ở requirement này không cần biết danh mục liên quan có phải "Chi tiêu khác" hay không — số hiển thị luôn đúng ngay cả khi requirement riêng đó triển khai sau. Việc ẩn dòng "Chi tiêu khác" khỏi bảng danh mục khi hết giao dịch (do sửa/xóa giao dịch làm nó mất giao dịch cuối cùng) là một bộ lọc hiển thị tại thời điểm vẽ bảng danh mục, thuộc requirement riêng đó, không phải việc requirement này phải chủ động kích hoạt
- Chặn trùng tên danh mục — thuộc requirement riêng
- Ghi nhận giao dịch mới bằng nhập nhanh — đã có, không đổi trong phạm vi này

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem, sửa, xóa giao dịch thuộc tháng đang chọn | Sửa/xóa giao dịch thuộc tháng khác tháng đang chọn; khôi phục giao dịch đã xóa | [`docs/kb/ba/wiki/knowledge/business-rule/BR-003-chi-thang-dang-chon.md`](../../kb/ba/wiki/knowledge/business-rule/BR-003-chi-thang-dang-chon.md), [`docs/kb/ba/wiki/knowledge/business-rule/BR-005-khong-undo.md`](../../kb/ba/wiki/knowledge/business-rule/BR-005-khong-undo.md) — hệ thống chỉ phục vụ một mình Dylan, không có vai trò thứ hai |

## 6. Luồng Nghiệp Vụ

1. Dylan mở bảng chi tiết chi tiêu của tháng đang chọn, xem toàn bộ giao dịch của tháng đó, mới nhất lên đầu; mỗi giao dịch có nút "Sửa" và nút "Xóa".
2. Dylan bấm "Sửa" trên một giao dịch — dòng giao dịch đó mở rộng ngay tại chỗ thành các ô nhập đã điền sẵn giá trị hiện tại: nội dung, số tiền, danh mục, ngày.
3. Dylan chỉnh sửa giá trị cần thiết rồi bấm "Lưu" — nếu ngày hợp lệ (≤ hôm nay): giao dịch được cập nhật, dòng trở lại hiển thị bình thường với giá trị mới, "Chi thực tế" của danh mục liên quan cập nhật ngay; nếu ngày ở tương lai: hệ thống chặn lưu, báo lỗi ngay tại ô ngày, giữ nguyên giá trị cũ cho tới khi Dylan sửa lại ngày hợp lệ.
4. Dylan bấm "Hủy" trong lúc đang sửa — dòng trở lại hiển thị bình thường, không có gì thay đổi.
5. Dylan bấm "Xóa" trên một giao dịch — dòng đó chuyển sang trạng thái xác nhận, hỏi Dylan có chắc muốn xóa.
6. Dylan bấm xác nhận — giao dịch bị xóa khỏi danh sách, "Chi thực tế" của danh mục liên quan cập nhật ngay. Dylan bấm hủy thay vì xác nhận — dòng trở lại hiển thị bình thường, giao dịch không bị xóa.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Tháng đang chọn chưa có giao dịch nào — danh sách trống, không có nút "Sửa"/"Xóa" nào để bấm |
| Không đủ quyền | Không áp dụng — hệ thống chỉ có một người dùng, không có khái niệm phân quyền |
| Dữ liệu trùng | Không áp dụng cho requirement này |
| Hệ thống lỗi | Nếu Dylan chọn ngày ở tương lai khi sửa, hệ thống chặn lưu ngay tại ô ngày và báo lỗi rõ ràng, không tạo ra bản ghi sai; giao dịch giữ nguyên giá trị trước khi sửa cho tới khi Dylan chọn lại ngày hợp lệ |
| Giao dịch bị đổi/xóa từ nơi khác trong lúc đang sửa | Nếu Dylan mở hai tab/thiết bị cùng lúc, một giao dịch đang được sửa ở một tab bị sửa hoặc xóa từ tab khác trước khi tab đang sửa bấm "Lưu" — hệ thống chặn lưu, báo "Giao dịch này vừa được thay đổi ở nơi khác, hãy tải lại để xem bản mới nhất", không lưu đè và không tạo lại giao dịch đã bị xóa |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Tháng đang chọn có giao dịch "cafe" 45.000đ, danh mục "Giải trí / cafe", ghi ngày hôm nay | Dylan bấm nút "Sửa" trên giao dịch đó | Dòng giao dịch mở rộng thành 4 ô nhập đã điền sẵn: nội dung "cafe", số tiền 45.000, danh mục "Giải trí / cafe", ngày hôm nay | Xem ASCII Mockup mục 8.1 |
| AC-02 | Dòng giao dịch "cafe" 45.000đ đang ở chế độ sửa; danh mục "Giải trí / cafe" đang có "Chi thực tế" là 45.000đ | Dylan đổi ô số tiền thành 55.000 và bấm "Lưu" | Giao dịch hiển thị lại với số tiền 55.000đ; "Chi thực tế" của danh mục "Giải trí / cafe" đổi thành 55.000đ (tăng đúng phần chênh lệch 10.000đ) | Xem ASCII Mockup mục 8.1 |
| AC-03 | Giao dịch "grab" 80.000đ đang gắn danh mục "Di chuyển" (Chi thực tế 80.000đ); danh mục "Ăn uống" đang có "Chi thực tế" 200.000đ | Dylan mở sửa giao dịch đó, đổi danh mục thành "Ăn uống", bấm "Lưu" | "Chi thực tế" của "Di chuyển" giảm còn 0đ; "Chi thực tế" của "Ăn uống" tăng thành 280.000đ; giao dịch hiển thị gắn với danh mục "Ăn uống" | Xem ASCII Mockup mục 8.1 |
| AC-04 | Dòng một giao dịch đang ở chế độ sửa, ô ngày hiện đang là hôm nay | Dylan chọn một ngày ở tương lai (vd ngày mai) rồi bấm "Lưu" | Hệ thống chặn lưu, hiện thông báo lỗi ngay tại ô ngày yêu cầu chọn ngày không ở tương lai; giao dịch vẫn giữ nguyên giá trị ngày cũ, dòng vẫn ở chế độ sửa | Xem ASCII Mockup mục 8.1 |
| AC-05 | Tháng đang chọn có giao dịch "taxi" 60.000đ | Dylan bấm nút "Xóa" trên giao dịch đó | Dòng hiện câu hỏi "Bạn có chắc muốn xóa giao dịch này?" kèm hai nút "Xác nhận xóa" và "Hủy"; giao dịch "taxi" 60.000đ vẫn còn nguyên trong danh sách, chưa bị xóa. Nếu Dylan bấm "Hủy": câu hỏi và hai nút biến mất, dòng hiện lại đúng như trước khi bấm "Xóa" (nội dung "taxi", số tiền 60.000đ, nút "Sửa"/"Xóa") | Xem ASCII Mockup mục 8.1 |
| AC-06 | Dòng giao dịch "taxi" 60.000đ đang ở trạng thái xác nhận xóa; danh mục "Di chuyển" đang có "Chi thực tế" 60.000đ | Dylan bấm "Xác nhận xóa" | Giao dịch "taxi" biến mất khỏi danh sách; "Chi thực tế" của danh mục "Di chuyển" giảm còn 0đ | Xem ASCII Mockup mục 8.1 |
| AC-07 | Dòng giao dịch "cafe" 45.000đ đang ở chế độ sửa, Dylan đã đổi số tiền thành 99.000 nhưng chưa lưu | Dylan bấm "Hủy" thay vì "Lưu" | 4 ô nhập biến mất, dòng hiện lại đúng nội dung "cafe" và số tiền 45.000đ (giá trị 99.000 vừa gõ không được lưu), kèm nút "Sửa"/"Xóa" như trước khi bấm "Sửa"; "Chi thực tế" của danh mục giữ nguyên, không đổi | Xem ASCII Mockup mục 8.1 |
| AC-08 | Tháng đang chọn có 10 giao dịch (nhiều hơn 8) | Dylan mở bảng chi tiết chi tiêu của tháng đang chọn | Đếm được đúng 10 dòng giao dịch trong danh sách (không dừng ở 8 dòng như trước), sắp theo thứ tự giao dịch mới nhất ở trên cùng; mỗi dòng đều có đủ nút "Sửa" và "Xóa" | Xem ASCII Mockup mục 8.1 |
| AC-09 | Tháng đang chọn chưa có giao dịch nào | Dylan mở bảng chi tiết chi tiêu của tháng đang chọn | Danh sách hiển thị trống, không có dòng giao dịch nào; không có nút "Sửa" hay "Xóa" nào xuất hiện trên màn hình vì không có giao dịch nào để thao tác | Xem ASCII Mockup mục 8.1 |
| AC-10 | Dòng giao dịch "cafe" 45.000đ đang ở chế độ sửa | Dylan xóa trắng ô nội dung, hoặc sửa ô số tiền thành 0 hoặc một số âm | Nút "Lưu" chuyển sang trạng thái tắt (không bấm được) ngay khi ô nội dung rỗng hoặc số tiền không hợp lệ; giao dịch chưa bị thay đổi; nút "Lưu" chỉ bật lại khi Dylan nhập lại nội dung không rỗng và số tiền hợp lệ | Xem ASCII Mockup mục 8.1 |
| AC-11 | Giao dịch "taxi" 60.000đ đang mở ở chế độ sửa trên một tab; cùng giao dịch đó vừa bị xóa từ một tab/thiết bị khác trước khi tab đang sửa kịp lưu | Dylan bấm "Lưu" trên tab đang sửa | Hệ thống chặn lưu, hiện thông báo "Giao dịch này vừa được thay đổi ở nơi khác, hãy tải lại để xem bản mới nhất"; danh sách không tạo lại giao dịch "taxi" đã bị xóa từ tab kia | Xem ASCII Mockup mục 8.1 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì tham chiếu khối ASCII Mockup ở mục 8.1.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

Liệt kê mọi thành phần màn hình mà requirement này chạm tới. Cột cuối mỗi bảng dưới đây dùng ký hiệu PBI (đơn vị công việc nhỏ nhất chuyển giao được, viết tắt của "Product Backlog Item") và US (viết tắt của "User Story", cách gọi mã function ở dự án này) để ghi function khác cùng dùng chung element đó — chỉ điền khi có, không thì ghi "Không".

### 8.1. Bảng chi tiết chi tiêu — `Tab "Thu chi" trong Dylan Plan Dashboard, khu vực "Nhập nhanh chi tiêu"`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Danh sách giao dịch | Table | Giao dịch gần đây | Toàn bộ giao dịch của tháng đang chọn | Hiển thị toàn bộ giao dịch của tháng đang chọn, mới nhất lên đầu, cuộn khi danh sách dài; danh sách trống khi tháng chưa có giao dịch nào — **đổi hành vi so với hiện tại**: trước đây chỉ hiển thị tối đa 8 giao dịch gần nhất | Dylan | AC-08, AC-09 | [`US-001` EL-02](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) — cùng một khu vực hiển thị, đổi giới hạn số dòng |
| EL-02 | Cột Nội dung | Column | (không có tiêu đề cột riêng, hiển thị đậm) | `Transaction.text` | Text, thứ tự đầu tiên trong dòng | Dylan | AC-01, AC-08 | Không |
| EL-03 | Cột Danh mục | Column | (hiển thị nhỏ, kèm thời điểm) | Tên danh mục qua `categoryId` | Text, tra cứu theo `categoryId` hiện tại của giao dịch | Dylan | AC-01, AC-03, AC-08 | Không |
| EL-04 | Cột Thời điểm | Column | (hiển thị nhỏ, kèm danh mục) | `Transaction.createdAt` | Định dạng ngày giờ Việt Nam | Dylan | AC-01, AC-08 | Không |
| EL-05 | Cột Số tiền | Column | (hiển thị số tiền âm) | `Transaction.amount` | Số tiền, định dạng tiền Việt Nam | Dylan | AC-01, AC-02, AC-08 | Không |
| EL-06 | Nút "Sửa" | Button | Sửa | — | Luôn bật cho mọi giao dịch hiển thị trong danh sách — danh sách chỉ chứa giao dịch thuộc tháng đang chọn (xem Nguồn dữ liệu ở EL-01), nên không có dòng nào thuộc tháng khác để phải ẩn nút; **mới thêm** — trước đây danh sách không có nút thao tác nào; bấm vào chuyển dòng sang chế độ sửa | Dylan | AC-01, AC-08 | Không |
| EL-07 | Nút "Xóa" | Button | Xóa | — | Luôn bật cho mọi giao dịch hiển thị trong danh sách — cùng lý do với EL-06; **mới thêm** — trước đây danh sách không có nút thao tác nào; bấm vào chuyển dòng sang trạng thái xác nhận xóa | Dylan | AC-05, AC-08 | Không |
| EL-08 | Ô nhập Nội dung (chế độ sửa) | Input | Nội dung chi tiêu | `Transaction.text` hiện tại | Bắt buộc, không được để trống; giá trị mặc định là nội dung hiện tại của giao dịch | Dylan | AC-01, AC-07, AC-10 | Không |
| EL-09 | Ô nhập Số tiền (chế độ sửa) | Input | Số tiền | `Transaction.amount` hiện tại | Bắt buộc, chỉ nhận số dương; giá trị mặc định là số tiền hiện tại | Dylan | AC-01, AC-02, AC-07, AC-10 | Không |
| EL-10 | Dropdown Danh mục (chế độ sửa) | Dropdown | Danh mục | Danh sách danh mục của tháng đang chọn | Tập giá trị là toàn bộ danh mục của tháng đang chọn; giá trị mặc định là danh mục hiện tại của giao dịch | Dylan | AC-01, AC-03 | Không |
| EL-11 | Ô chọn Ngày (chế độ sửa) | Date picker | Ngày | `Transaction.createdAt` hiện tại | Bắt buộc, chỉ nhận giá trị ≤ hôm nay; báo lỗi "Ngày giao dịch không được sau ngày hôm nay" nếu chọn ngày tương lai; giá trị mặc định là ngày hiện tại của giao dịch | Dylan | AC-01, AC-04 | Không |
| EL-12 | Nút "Lưu" | Button | Lưu | — | Bật khi nội dung không rỗng và số tiền hợp lệ, tắt (không bấm được) khi một trong hai điều kiện đó sai; bấm vào lưu thay đổi nếu ngày hợp lệ và giao dịch chưa bị đổi/xóa từ nơi khác; báo lỗi tại ô ngày nếu ngày ở tương lai; báo lỗi "Giao dịch này vừa được thay đổi ở nơi khác, hãy tải lại để xem bản mới nhất" và không lưu nếu giao dịch đã bị sửa/xóa từ một tab/thiết bị khác trước đó | Dylan | AC-02, AC-03, AC-04, AC-10, AC-11 | Không |
| EL-13 | Nút "Hủy" (chế độ sửa) | Button | Hủy | — | Luôn bật trong chế độ sửa; bấm vào thoát chế độ sửa, không lưu thay đổi, khôi phục hiển thị giá trị cũ | Dylan | AC-07 | Không |
| EL-14 | Thông báo xác nhận xóa | Toast | Bạn có chắc muốn xóa giao dịch này? | — | Chỉ hiện khi dòng đang ở trạng thái xác nhận xóa (sau khi bấm "Xóa"); khác với toast xác nhận ghi nhận giao dịch ở nhập nhanh (toast đó tự đóng sau vài giây) — thông báo này hiện cố định ngay trong dòng, không tự đóng theo thời gian, chỉ biến mất khi Dylan bấm "Xác nhận xóa" hoặc "Hủy" | Dylan | AC-05 | Không |
| EL-15 | Nút "Xác nhận xóa" | Button | Xác nhận xóa | — | Chỉ hiện khi dòng đang ở trạng thái xác nhận xóa; bấm vào xóa thật giao dịch | Dylan | AC-05, AC-06 | Không |
| EL-16 | Nút "Hủy" (chế độ xác nhận xóa) | Button | Hủy | — | Chỉ hiện khi dòng đang ở trạng thái xác nhận xóa; bấm vào thoát trạng thái xác nhận, giao dịch không bị xóa | Dylan | AC-05 | Không |

**ASCII Mockup**

Khu vực "Giao dịch gần đây" hiển thị toàn bộ giao dịch của tháng đang chọn (không còn giới hạn 8 dòng như trước):

```text
+----------------------------------------------------------------+
| Giao dịch gần đây                                               |
+----------------------------------------------------------------+
| cafe                                          -55.000 đ         |
| Giải trí / cafe · 14:45 5/8/2026        [Sửa] [Xóa]             |
+----------------------------------------------------------------+
| >> Đang sửa:                                                    |
|   Nội dung: [cafe______]  Số tiền: [55.000___]                 |
|   Danh mục: [Giải trí / cafe v]  Ngày: [05/08/2026]             |
|                                          [Lưu]  [Hủy]            |
+----------------------------------------------------------------+
| taxi                                          -60.000 đ         |
| Di chuyển · 09:10 5/8/2026               [Sửa] [Xóa]            |
+----------------------------------------------------------------+
| >> Bạn có chắc muốn xóa giao dịch này?                          |
|                                  [Xác nhận xóa]  [Hủy]           |
+----------------------------------------------------------------+
| grab                                          -80.000 đ         |
| Di chuyển · 08:02 5/8/2026               [Sửa] [Xóa]            |
+----------------------------------------------------------------+
| ... (cuộn để xem thêm giao dịch trong tháng)                    |
+----------------------------------------------------------------+
```

Trạng thái trống (AC-09, tháng đang chọn chưa có giao dịch nào):

```text
+----------------------------------------------------------------+
| Giao dịch gần đây                                               |
+----------------------------------------------------------------+
| (Chưa có giao dịch nào trong tháng này)                         |
+----------------------------------------------------------------+
```

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
| Giao dịch | Sửa — cho phép cập nhật đầy đủ 4 trường của một bản ghi đã có | Có | Giữ vĩnh viễn sau khi sửa, như các giao dịch khác |
| Giao dịch | Xóa — cho phép xóa hẳn một bản ghi (sau xác nhận) | Có | Không giữ lại sau khi xóa — không có tính năng khôi phục ([`BR-005`](../../kb/ba/wiki/knowledge/business-rule/BR-005-khong-undo.md)) |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng (US-008) |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) | Implemented |
| [`US-003`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered, gộp chung US-001) | Implemented |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Mục 8.1, `EL-02` (Danh sách giao dịch gần đây) | `EL-02` — mô tả hiện tại ghi "không đổi cách hiển thị so với hiện tại", nay US-004 đổi giới hạn 8 dòng thành hiển thị toàn bộ tháng | Không (ngoài phạm vi ssr-ba đang chạy cho US-004 — không được sửa spec của feature khác) | Cần một lượt `ssr-ba` riêng rà lại `spec.md` của US-001 sau khi US-004 triển khai xong, cập nhật đúng mô tả `EL-02` cho khớp hành vi mới |
| `US-005` (chưa có spec — [raw](../../kb/ba/raw/US-005-rang-buoc-toan-ven-danh-muc.md)) | Khi US-005 triển khai "Chi tiêu khác" (tự sinh, khóa, chỉ ẩn/hiện theo còn hay hết giao dịch — `DEC-026`, `DEC-027`, `DEC-029`) | Bảng danh mục F2, dòng "Chi tiêu khác" | Không (US-005 chưa có spec, chưa tới lượt triển khai) | Khi viết spec US-005: xác nhận rõ việc ẩn "Chi tiêu khác" khi hết giao dịch là bộ lọc hiển thị tại thời điểm vẽ bảng danh mục (áp dụng bất kể giao dịch cuối cùng mất đi do US-004 sửa/xóa, hay do US-005 tự xóa danh mục khác) — không cần US-004 gọi riêng một hành động nào |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-004-sua-xoa-tung-giao-dich.md`](../../kb/ba/wiki/knowledge/feature/US-004-sua-xoa-tung-giao-dich.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-004-sua-xoa-tung-giao-dich.md`](../../kb/ba/wiki/delivery/pbi/US-004-sua-xoa-tung-giao-dich.md) | Điền đầy đủ User Story và 11 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory cần ghi: quyết định user chốt qua dialog (dạng hiển thị Sửa/Xóa, phạm vi hiển thị danh sách) → `decisions.md`; không có thuật ngữ nghiệp vụ mới phát sinh ngoài những gì đã có trong `glossary.md`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Bảng chi tiết chi tiêu (khu vực "Giao dịch gần đây" trong tab Thu chi) |
| Thực thể dữ liệu nào bị chạm | Giao dịch (đã có sẵn, không thêm bảng mới) |
| Cần thay đổi cấu trúc dữ liệu | Không — `Transaction` đã đủ trường (`text`, `amount`, `categoryId`, `createdAt`), chỉ thêm thao tác sửa/xóa trên bản ghi đã có |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không — xuất dữ liệu JSON thuộc requirement riêng (US-008) |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Form "Sửa giao dịch" và hộp xác nhận "Xóa giao dịch" hiển thị mở rộng ngay trong dòng bảng, không phải modal riêng | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-05 | Nếu sai, cần thiết kế lại giao diện dạng modal, ảnh hưởng mục 8 và ASCII Mockup |
| A2 | Danh sách giao dịch tại bảng chi tiết chi tiêu hiển thị toàn bộ giao dịch của tháng đang chọn thay vì giới hạn 8 giao dịch gần nhất như hiện tại | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-05 | Nếu sai, cần giữ giới hạn 8 dòng và tách một US riêng cho việc mở rộng xem toàn bộ tháng |
| A3 | Khi Dylan mở hai tab/thiết bị cùng lúc trên cùng tháng và một giao dịch bị sửa/xóa từ nơi này trong khi nơi khác đang sửa chính giao dịch đó rồi bấm "Lưu": hệ thống chặn lưu, báo giao dịch vừa đổi ở nơi khác, không ghi đè và không tạo lại giao dịch đã xóa | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-05 | Nếu sai, cần đổi lại thành ghi đè (thao tác sau cùng thắng) hoặc bỏ hẳn cơ chế kiểm tra, ảnh hưởng AC-11, EL-12, và mục 6 (Trường hợp ngoại lệ) |
