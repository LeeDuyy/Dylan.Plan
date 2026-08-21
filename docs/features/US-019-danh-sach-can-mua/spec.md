# Danh sách items cần mua theo tháng tại bảng thu chi

Status: Ready for DEV
Feature: US-019
Created: 2026-08-14
Updated: 2026-08-14
Raw Source: `docs/kb/ba/raw/US-019-danh-sach-can-mua.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, khi Dylan nhớ ra có sản phẩm cần mua trong tháng, anh không có nơi nào trong bảng thu chi để ghi lại — phải nhớ trong đầu hoặc ghi ở nơi khác ngoài ứng dụng, dễ quên hoặc mua trùng/mua thiếu.

Sau thay đổi này, Dylan có một khu vực "Items cần mua" ngay trong bảng thu chi của từng tháng: ghi tên sản phẩm cần mua, giá dự kiến (nếu muốn), và đánh dấu rõ ràng sản phẩm nào đã mua/chưa mua bằng hai màu khác nhau. Khi bước sang tháng mới, những sản phẩm chưa kịp mua tự động được mang theo sang tháng mới, không phải chép tay lại. Khi xem lại một tháng cũ, danh sách vẫn còn nguyên để tra cứu nhưng không sửa được nữa, giữ đúng lịch sử.

Giá trị đo được: Dylan mở khu vực "Items cần mua" ở tháng hiện tại (tháng thực tế theo ngày hôm nay), thêm/sửa/xóa/đánh dấu đã mua được ngay; màu badge Pending (cam/vàng) và Purchased (xanh lá) phân biệt được bằng mắt thường không cần đọc chữ; khi tạo tháng mới (bằng "Tạo tháng" hoặc "Clone tháng đang xem"), toàn bộ item còn Pending của tháng nguồn biến mất khỏi tháng gốc và xuất hiện lại ở tháng mới; mở lại một tháng không phải tháng hiện tại (kể cả khi vừa chọn xem đúng tháng đó qua dropdown), danh sách hiển thị đầy đủ nhưng không còn nút thêm/sửa/xóa/đổi trạng thái nào bấm được.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md`](../../kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md) | Mục tiêu, phạm vi, luồng nghiệp vụ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-022-gia-item-khong-cong-ngan-sach.md`](../../kb/ba/wiki/knowledge/business-rule/BR-022-gia-item-khong-cong-ngan-sach.md) | Rule giá không cộng ngân sách |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md`](../../kb/ba/wiki/knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md) | Rule chuyển item sang tháng mới |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md`](../../kb/ba/wiki/knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md) | Rule chỉ thao tác được ở tháng đang chọn |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md`](../../kb/ba/wiki/knowledge/business-rule/BR-015-tao-thang-vs-clone-thang-dang-xem.md) | Hành vi hai nút "Tạo tháng"/"Clone tháng đang xem" đã có |
| [`docs/kb/ba/wiki/data/entity/ENT-006-item-can-mua.md`](../../kb/ba/wiki/data/entity/ENT-006-item-can-mua.md) | Định nghĩa thực thể Item cần mua |
| [`docs/kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md`](../../kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md) | Item cần mua gắn theo Tháng ngân sách |
| [`docs/kb/ba/wiki/knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md`](../../kb/ba/wiki/knowledge/epic/EPC-003-quan-ly-chu-ky-thang.md) | Mục tiêu epic, thuộc luồng F3 |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, M2, luồng F3 |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md` (lưu các quyết định đã chốt với user, gọi bằng mã DEC (viết tắt của "Decision") — cụ thể là `DEC-010`, `DEC-034`, `DEC-092` đến `DEC-098`, `DEC-105`, `DEC-106`, `DEC-107`), `glossary.md`.

## 3. Phạm Vi

- Thêm khu vực "Items cần mua" vào bảng thu chi của trang Quản lý chi tiêu (`/budget`), hiển thị theo tháng đang xem
- Cho Dylan thêm một item mới: tên sản phẩm (bắt buộc), giá dự kiến (tùy chọn) — chỉ khi tháng đang xem là tháng hiện tại (tháng thực tế theo ngày hôm nay, độc lập với việc Dylan đang chọn xem tháng nào qua dropdown "Chọn tháng xem" — `DEC-107`)
- Cho Dylan sửa tên sản phẩm và/hoặc giá của một item đã có, ngay tại dòng đó (inline) — chỉ khi tháng đang xem là tháng hiện tại
- Item mới mặc định trạng thái "Pending" (chưa mua), hiển thị màu cam/vàng
- Cho Dylan đánh dấu một item "Pending" chuyển thành "Purchased" (đã mua), hiển thị màu xanh lá — chỉ khi tháng đang xem là tháng hiện tại
- Cho Dylan xóa một item — chỉ khi tháng đang xem là tháng hiện tại
- Danh sách hiển thị cả item Pending lẫn Purchased của tháng đang xem, không lọc ẩn loại nào
- Khi Dylan bấm "Tạo tháng" hoặc "Clone tháng đang xem" để tạo một tháng mới, mọi item còn Pending của tháng hiện tại (tháng thực tế theo ngày lúc bấm nút — không phải tháng đang xem trên dropdown nếu hai giá trị này khác nhau) được chuyển hẳn sang tháng mới, không còn hiển thị ở tháng gốc
- Khi Dylan xem một tháng khác tháng hiện tại (kể cả khi vừa chọn xem đúng tháng đó qua dropdown "Chọn tháng xem"), khu vực "Items cần mua" hiển thị đầy đủ danh sách nhưng ở dạng chỉ xem — không có ô nhập, không có nút thêm/đánh dấu đã mua/xóa

## 4. Ngoài Phạm Vi

- Giá của item cộng vào Ngân sách/Chi thực tế/Số dư còn lại của tháng — không đổi số liệu ngân sách, chỉ là ghi chú tham khảo (`BR-022`)
- Tự động tạo tháng mới hoặc tự động chuyển item theo ngày hệ thống thực tế — việc chuyển chỉ xảy ra khi Dylan chủ động bấm nút tạo tháng mới, không có tiến trình chạy nền nào kiểm tra ngày
- Liên kết một item cần mua với một Danh mục ngân sách hoặc một Giao dịch chi tiêu — hai khái niệm độc lập với nhau
- Ghi lại thời điểm chính xác Dylan đánh dấu một item là đã mua — chỉ lưu trạng thái hiện tại (Pending/Purchased), không lưu mốc thời gian đổi trạng thái
- Giới hạn số lượng item tối đa trong một tháng — không có giới hạn nghiệp vụ nào được yêu cầu

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem item của bất kỳ tháng nào đang xem; thêm, sửa, xóa, đánh dấu đã mua item — chỉ khi tháng đang xem là tháng hiện tại (theo đồng hồ hệ thống, `DEC-107`) | Thêm, sửa, xóa, đánh dấu đã mua item của một tháng khác tháng hiện tại — chỉ được xem | `docs/memory/decisions.md#dec-096`, `docs/memory/decisions.md#dec-107` |

## 6. Luồng Nghiệp Vụ

1. Dylan mở trang Thu chi, tháng đang xem (mặc định là tháng hiện tại) hiển thị khu vực "Items cần mua" — liệt kê cả item Pending và Purchased của tháng đó.
2. Nếu tháng đang xem là tháng hiện tại (theo đồng hồ hệ thống — `DEC-107`), Dylan nhập tên sản phẩm vào ô "Tên sản phẩm" (bắt buộc), có thể nhập thêm giá dự kiến vào ô "Giá" (tùy chọn), rồi bấm "Thêm item".
3. Item mới xuất hiện ở cuối danh sách, trạng thái "Pending" hiển thị màu cam/vàng; nếu Dylan không nhập giá, dòng giá để trống, không hiển thị số 0.
4. Dylan bấm vào ô Tên sản phẩm hoặc ô Giá của một item đã có trong tháng hiện tại để sửa trực tiếp tại dòng đó (inline) — gõ giá trị mới rồi rời khỏi ô (hoặc nhấn Enter) để lưu; giá trị hiển thị cập nhật ngay.
5. Dylan bấm nút đánh dấu đã mua trên một item Pending của tháng hiện tại — item chuyển sang trạng thái "Purchased", màu badge đổi thành xanh lá.
6. Dylan bấm nút xóa trên một item của tháng hiện tại — item biến mất khỏi danh sách ngay, không cần xác nhận thêm.
7. Dylan bấm "Tạo tháng" hoặc "Clone tháng đang xem" để tạo một tháng mới (theo luồng đã có ở requirement mã US (viết tắt của "User Story", cách đặt mã function của dự án) [`US-006`](../US-006-canh-bao-trung-thang/spec.md)) — mọi item còn "Pending" của tháng hiện tại (theo đồng hồ hệ thống tại thời điểm bấm nút, không phải tháng Dylan đang xem qua dropdown "Chọn tháng xem" nếu hai giá trị này khác nhau) được chuyển sang tháng mới; các item này không còn hiển thị ở tháng gốc nữa. Item "Purchased" không bị chuyển, vẫn ở nguyên tháng gốc.
8. Dylan đổi sang xem một tháng khác tháng hiện tại (vd một tháng cũ, kể cả khi vừa chọn xem đúng tháng đó qua dropdown "Chọn tháng xem") — khu vực "Items cần mua" vẫn hiển thị đầy đủ danh sách của tháng đó, nhưng không còn ô nhập "Tên sản phẩm"/"Giá", không còn nút "Thêm item", các ô Tên sản phẩm/Giá không sửa được nữa, không còn nút đánh dấu đã mua hay nút xóa trên bất kỳ dòng nào.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Tháng chưa có item nào — danh sách hiển thị rỗng kèm dòng ghi chú; nếu là tháng hiện tại, ô nhập và nút "Thêm item" vẫn hiển thị bình thường |
| Tháng hiện tại chưa được tạo | Dylan chưa từng bấm "Tạo tháng"/"Clone tháng đang xem" cho kỳ tháng thực tế hiện tại — khu vực "Items cần mua" không có tháng nào để thêm mới cho tới khi Dylan tạo tháng đó |
| Không đủ quyền | Không áp dụng — hệ thống chỉ phục vụ một mình Dylan, không có phân quyền (`docs/memory/decisions.md#dec-004`) |
| Dữ liệu trùng | Không áp dụng — không có ràng buộc chặn trùng tên item, Dylan có thể thêm nhiều item cùng tên nếu muốn |
| Hệ thống lỗi | Bỏ trống tên sản phẩm rồi bấm "Thêm item" — nút bị vô hiệu hóa (mờ, không bấm được) cho tới khi Dylan nhập tên. Sửa ô Tên sản phẩm của một item đã có thành chuỗi rỗng rồi rời khỏi ô — không lưu, ô tự khôi phục lại tên cũ |

## 7. Tiêu Chí Chấp Nhận

Mỗi dòng là một tiêu chí kiểm chứng được bằng thao tác thật trên màn hình.

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Hôm nay theo đồng hồ hệ thống là một ngày trong tháng "2026-08"; Dylan đang xem tháng "2026-08" — đúng tháng hiện tại; khu vực "Items cần mua" chưa có item nào | Dylan nhập "Mua chuột không dây" vào ô "Tên sản phẩm", để trống ô "Giá", bấm "Thêm item" | Danh sách hiển thị 1 dòng: tên "Mua chuột không dây", cột Giá để trống, badge trạng thái "Pending" màu cam/vàng | Xem ASCII Mockup mục 8.1 |
| AC-02 | Đang ở tình huống AC-01, Ngân sách và Chi thực tế của tháng "2026-08" trước đó lần lượt là 30.000.000đ và 12.000.000đ | Dylan nhập "Mua bàn phím cơ", nhập giá "1tr5" vào ô "Giá", bấm "Thêm item" | Danh sách có thêm dòng "Mua bàn phím cơ" hiển thị giá 1.500.000đ, trạng thái "Pending"; Ngân sách và Chi thực tế của tháng vẫn giữ nguyên 30.000.000đ và 12.000.000đ, không đổi | Xem ASCII Mockup mục 8.1 |
| AC-03 | Đang ở tình huống AC-02, item "Mua bàn phím cơ" đang ở trạng thái Pending | Dylan bấm nút đánh dấu đã mua trên dòng "Mua bàn phím cơ" | Badge trạng thái của dòng đó đổi từ "Pending" (cam/vàng) sang "Purchased" (xanh lá); các dòng khác không đổi | Xem ASCII Mockup mục 8.1 |
| AC-04 | Đang ở tình huống AC-03, danh sách có 2 item: "Mua chuột không dây" (Pending), "Mua bàn phím cơ" (Purchased) | Dylan bấm nút xóa trên dòng "Mua chuột không dây" | Dòng "Mua chuột không dây" biến mất khỏi danh sách ngay lập tức; chỉ còn lại "Mua bàn phím cơ" (Purchased) | Xem ASCII Mockup mục 8.1 |
| AC-05 | Hôm nay theo đồng hồ hệ thống là một ngày trong tháng "2026-08" — "2026-08" là tháng hiện tại; tháng "2026-07" đã có 2 item: "Mua quà sinh nhật" (Pending), "Mua sách" (Purchased) | Dylan đổi ô "Chọn tháng xem" sang "2026-07" | Khu vực "Items cần mua" hiển thị đủ 2 dòng "Mua quà sinh nhật" và "Mua sách" với đúng trạng thái đã lưu; không có ô nhập "Tên sản phẩm"/"Giá", không có nút "Thêm item", không có nút đánh dấu đã mua hay nút xóa trên cả hai dòng — vì "2026-07" không phải tháng hiện tại, dù đang được chọn xem | Xem ASCII Mockup mục 8.2 |
| AC-06 | Hôm nay theo đồng hồ hệ thống là một ngày trong tháng "2026-08" — "2026-08" là tháng hiện tại, đang có 2 item: "Mua chuột không dây" (Pending), "Mua bàn phím cơ" (Purchased); kỳ tháng "2026-09" chưa có dữ liệu; Dylan đang xem tháng "2026-08" | Dylan chọn "2026-09" ở ô "Tạo tháng mới", bấm "Tạo tháng" (không phải "Clone tháng đang xem") | Tháng "2026-09" được tạo; khu vực "Items cần mua" của "2026-09" có đúng 1 item "Mua chuột không dây" (Pending); quay lại xem tháng "2026-08", danh sách chỉ còn "Mua bàn phím cơ" (Purchased) — "Mua chuột không dây" không còn hiển thị ở "2026-08" nữa | Xem ASCII Mockup mục 8.1 |
| AC-07 | Đang ở tình huống AC-06 nhưng Dylan bấm "Clone tháng đang xem" thay vì "Tạo tháng" | Dylan bấm "Clone tháng đang xem" | Kết quả giống hệt AC-06 đối với item cần mua: tháng "2026-09" có "Mua chuột không dây" (Pending), tháng "2026-08" chỉ còn "Mua bàn phím cơ" (Purchased) — không phụ thuộc vào việc "Clone tháng đang xem" có sao chép thêm cấu trúc danh mục ngân sách hay không | Xem ASCII Mockup mục 8.1 |
| AC-08 | Dylan đang xem đúng tháng hiện tại, ô "Tên sản phẩm" đang để trống | Dylan không nhập gì vào ô "Tên sản phẩm", quan sát nút "Thêm item" | Nút "Thêm item" hiển thị ở trạng thái vô hiệu hóa (mờ, không bấm được) cho tới khi Dylan nhập ít nhất một ký tự vào ô "Tên sản phẩm" | Xem ASCII Mockup mục 8.1 |
| AC-09 | Đang ở tháng hiện tại, item "Mua chuột không dây" đang có giá để trống | Dylan bấm vào ô Tên sản phẩm của dòng đó, sửa thành "Mua chuột Logitech", rời khỏi ô | Tên hiển thị trên dòng đó đổi ngay thành "Mua chuột Logitech"; giá và trạng thái của dòng không đổi | Xem ASCII Mockup mục 8.1 |
| AC-10 | Đang ở tháng hiện tại, item "Mua bàn phím cơ" đang có giá 1.500.000đ | Dylan bấm vào ô Giá của dòng đó, sửa thành "2tr", rời khỏi ô | Giá hiển thị trên dòng đó đổi ngay thành 2.000.000đ; tên và trạng thái của dòng không đổi; Ngân sách/Chi thực tế của tháng vẫn không đổi | Xem ASCII Mockup mục 8.1 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì ghi rõ lý do.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

### 8.1. Khu vực Items cần mua — tháng hiện tại — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Bảng Items cần mua | Table | Items cần mua | Danh sách item cần mua của tháng đang xem, sắp xếp theo thứ tự thêm vào (item mới nhất ở cuối) | Hiển thị cả item Pending lẫn Purchased, không lọc ẩn loại nào; khi tháng đang xem chưa có item nào, thay bảng bằng một dòng ghi chú trống (xem ngoại lệ "Không có dữ liệu" ở mục 6) | Dylan | AC-01, AC-03, AC-04 | Không |
| EL-02 | Cột Tên sản phẩm | Column | Tên sản phẩm | Tên item Dylan đã nhập | Cột đầu tiên của bảng; văn bản tự do, không giới hạn ký tự cụ thể; khi tháng đang xem là tháng hiện tại (`DEC-107`), bấm vào ô để sửa trực tiếp tại chỗ (inline) — để trống rồi rời khỏi ô thì không lưu, tự khôi phục tên cũ | Dylan | AC-01, AC-09 | Không |
| EL-03 | Cột Giá | Column | Giá | Giá item Dylan đã nhập (nếu có) | Cột thứ hai; để trống nếu Dylan không nhập giá lúc thêm, không hiển thị số 0; không cộng vào Ngân sách/Chi thực tế/Số dư còn lại (`BR-022`); khi tháng đang xem là tháng hiện tại (`DEC-107`), bấm vào ô để sửa trực tiếp tại chỗ (inline), nhận cùng định dạng rút gọn với `EL-09` (vd "1tr5", "250k") | Dylan | AC-02, AC-10 | Không |
| EL-04 | Cột Trạng thái | Column | Trạng thái | Trạng thái item: "Pending" hoặc "Purchased" | Cột thứ ba; hiển thị dạng badge màu — "Pending" nền cam/vàng, "Purchased" nền xanh lá; hai màu phải phân biệt rõ bằng mắt thường | Dylan | AC-01, AC-03 | Không |
| EL-05 | Cột Hành động | Column | Hành động | — | Cột cuối, chứa nút đánh dấu đã mua (`EL-07`) và nút xóa (`EL-08`) trên từng dòng; chỉ hiển thị hai nút này khi tháng đang xem là tháng hiện tại (`BR-024`, `DEC-107`) — ở tháng khác, cột này để trống, không có nút nào | Dylan | AC-05 | Không |
| EL-06 | Input Tên sản phẩm | Input | Tên sản phẩm | — | Bắt buộc nhập ít nhất một ký tự; chỉ hiển thị khi tháng đang xem là tháng hiện tại (`BR-024`, `DEC-107`); để trống thì nút "Thêm item" (`EL-10`) bị vô hiệu hóa | Dylan | AC-01, AC-08 | Không |
| EL-07 | Nút Đánh dấu đã mua | Button | (icon/nút đổi trạng thái, trên từng dòng Pending) | — | Chỉ hiển thị trên dòng đang ở trạng thái "Pending" và chỉ khi tháng đang xem là tháng hiện tại; bấm sẽ đổi trạng thái dòng đó sang "Purchased" | Dylan | AC-03 | Không |
| EL-08 | Nút Xóa item | Button | (icon/nút xóa, trên từng dòng) | — | Hiển thị trên mọi dòng (cả Pending lẫn Purchased) nhưng chỉ khi tháng đang xem là tháng hiện tại; bấm sẽ xóa ngay dòng đó khỏi danh sách, không cần hộp xác nhận | Dylan | AC-04 | Không |
| EL-09 | Input Giá | Input | Giá | — | Không bắt buộc; nhận số tiền theo cùng định dạng rút gọn đã dùng ở ô nhập nhanh chi tiêu (vd "1tr5", "250k"); chỉ hiển thị khi tháng đang xem là tháng hiện tại (`BR-024`, `DEC-107`) | Dylan | AC-02 | Không |
| EL-10 | Nút Thêm item | Button | Thêm item | — | Bật khi `EL-06` có ít nhất một ký tự; tắt (mờ, không bấm được) khi `EL-06` đang trống; bấm khi đang bật sẽ thêm item mới vào cuối bảng `EL-01` với trạng thái mặc định "Pending"; chỉ hiển thị khi tháng đang xem là tháng hiện tại (`BR-024`, `DEC-107`) | Dylan | AC-01, AC-08 | Không |
| EL-12 | Nút Tạo tháng (dùng chung với US-006) | Button | Tạo tháng | — | **Đổi hành vi so với hiện tại**: ngoài việc tạo tháng trống theo danh mục mặc định như đã mô tả ở US-006, bấm nút này còn kích hoạt chuyển toàn bộ item "Pending" của tháng đang xem sang tháng mới (`BR-023`) | Dylan | AC-06 | [`US-006`](../US-006-canh-bao-trung-thang/spec.md) — `EL-03` (mở rộng thêm hành vi chuyển item cần mua) |
| EL-13 | Nút Clone tháng đang xem (dùng chung với US-006) | Button | Clone tháng đang xem | — | **Đổi hành vi so với hiện tại**: ngoài việc sao chép cấu trúc danh mục như đã mô tả ở US-006, bấm nút này cũng kích hoạt chuyển toàn bộ item "Pending" của tháng đang xem sang tháng mới (`BR-023`) | Dylan | AC-07 | [`US-006`](../US-006-canh-bao-trung-thang/spec.md) — `EL-04` (mở rộng thêm hành vi chuyển item cần mua) |

**ASCII Mockup**

```text
+---------------------------------------------------------------------+
| Items cần mua                                                        |
+---------------------------------------------------------------------+
| Tên sản phẩm [___________]  Giá [_______]  [ Thêm item ]            |
+---------------------------------------------------------------------+
| Tên sản phẩm         | Giá        | Trạng thái   | Hành động        |
|-----------------------------------------------------------------------|
| Mua chuột không dây   |            | [Pending]    | (đánh dấu) (xóa) |
| Mua bàn phím cơ       | 1.500.000đ | [Purchased]  | (xóa)            |
+---------------------------------------------------------------------+
```

Mockup minh họa AC-01 đến AC-04 và AC-08 đến AC-10: ô nhập + nút "Thêm item" chỉ hiện khi tháng đang xem là tháng hiện tại; badge "Pending" (cam/vàng) và "Purchased" (xanh lá) phân biệt rõ; cột Hành động có nút đánh dấu đã mua (chỉ trên dòng Pending) và nút xóa (trên mọi dòng); hai ô "Tên sản phẩm" và "Giá" trên từng dòng bấm vào để sửa trực tiếp tại chỗ (inline) khi tháng đang xem là tháng hiện tại.

### 8.2. Khu vực Items cần mua — tháng khác tháng hiện tại (chỉ xem) — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-11 | Bảng Items cần mua (chỉ xem) | Table | Items cần mua | Danh sách item cần mua của tháng đang xem (không phải tháng hiện tại — kể cả khi tháng đó đang được chọn xem qua dropdown "Chọn tháng xem") | Cùng cấu trúc cột với `EL-01` (Tên sản phẩm, Giá, Trạng thái) nhưng **bỏ hẳn** cột Hành động, không có nút đánh dấu đã mua hay nút xóa nào; không có ô nhập `EL-06`/`EL-09`, không có nút `EL-10` phía trên bảng; ô Tên sản phẩm/Giá không sửa được tại chỗ (`BR-024`, `DEC-107`); khi tháng đang xem chưa có item nào, thay bảng bằng một dòng ghi chú trống (xem ngoại lệ "Không có dữ liệu" ở mục 6) | Dylan | AC-05 | Không |

**ASCII Mockup**

```text
+---------------------------------------------------------------------+
| Items cần mua (chỉ xem — tháng khác tháng hiện tại)                  |
+---------------------------------------------------------------------+
| Tên sản phẩm         | Giá        | Trạng thái                      |
|-----------------------------------------------------------------------|
| Mua quà sinh nhật     |            | [Pending]                       |
| Mua sách              | 120.000đ   | [Purchased]                     |
+---------------------------------------------------------------------+
```

Mockup minh họa AC-05: không còn ô nhập, nút "Thêm item", nút đánh dấu đã mua hay nút xóa nào trên màn hình.

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Button`: nêu rõ điều kiện bật/tắt và điều gì xảy ra sau khi bấm.
- Với `Input`: nêu rõ bắt buộc hay không, định dạng, thông báo lỗi khi nhập sai.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Phải là link tới spec của function đó, kèm tên element bị ảnh hưởng. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.
- Mỗi màn hình (`### 8.x`) bắt buộc có khối **ASCII Mockup** ngay dưới bảng element — wireframe vẽ bằng ký tự ASCII, thể hiện đúng bố cục và nhãn hiển thị của các `EL-##` trong bảng, không phải hình trang trí chung chung.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Item cần mua | Thêm — thực thể hoàn toàn mới, gắn theo Tháng ngân sách | Có | Lưu bền vững cùng cơ chế lưu trữ hiện có của Tháng ngân sách/Danh mục/Giao dịch (`DEC-001`); không liên kết Danh mục hay Giao dịch |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng (US-008) |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-006`](../US-006-canh-bao-trung-thang/spec.md) | Quy tắc nghiệp vụ | Không — nút "Tạo tháng"/"Clone tháng đang xem" đã tồn tại và hoạt động; `US-019` chỉ nối thêm hành vi chuyển item vào đúng thời điểm hai nút này được bấm | Implemented (Delivered With Notes) |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — cần nền tảng lưu trữ bền vững (Prisma/SQLite) đã có sẵn để thêm bảng Item cần mua | Implemented |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`US-006`](../US-006-canh-bao-trung-thang/spec.md) | Mục 6 (luồng bấm "Tạo tháng"/"Clone tháng đang xem"), `EL-03`, `EL-04` | Nút "Tạo tháng" (`EL-03` của US-006), nút "Clone tháng đang xem" (`EL-04` của US-006) | Không — hành vi nút với danh mục ngân sách giữ nguyên như đã `Ready for DEV`, chỉ nối thêm bước xử lý item cần mua song song, không đổi kết quả đã mô tả ở US-006 | Khi triển khai, cần đảm bảo bước chuyển item cần mua (US-019) và bước tạo/sao chép danh mục (US-006) cùng chạy trong một lần bấm nút, không tách thành hai thao tác riêng của Dylan |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md`](../../kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-019-danh-sach-can-mua.md`](../../kb/ba/wiki/delivery/pbi/US-019-danh-sach-can-mua.md) | Điền đầy đủ User Story và 10 AC từ spec này (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md`](../../kb/ba/wiki/knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md) | Đã xóa nhãn "Cần user xác nhận" — chốt cả hai nút đều mang item Pending sang tháng mới (`DEC-098`); "tháng nguồn" đổi định nghĩa thành tháng hiện tại theo đồng hồ hệ thống, không phải tháng đang xem trên dropdown (`DEC-107`) |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md`](../../kb/ba/wiki/knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md) | Bổ sung rõ "sửa" nghĩa là sửa tên/giá tại chỗ (inline), chỉ ở tháng hiện tại (`DEC-106`, `DEC-107`); "tháng đang chọn" đổi thành "tháng hiện tại theo đồng hồ hệ thống", tách khỏi dropdown "Chọn tháng xem" |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Đã cập nhật ở bước `ssr-po mode=business-flow` trước khi viết tiếp phần này — thêm mục tiêu `M3`, gắn `US-019` vào luồng F3 (`DEC-105`); mục 4 (F3) cần đối chiếu lại thuật ngữ "tháng hiện tại" theo `DEC-107` khi `ssr-plan` cập nhật |

Memory cần ghi: 4 quyết định mới chốt trong `ssr-ba`/`ssr-po`/`ssr-plan` (cả hai nút tạo tháng đều mang item Pending; mở rộng Business Flow thêm `M3` và gắn F3; bổ sung khả năng sửa tên/giá inline; "tháng hiện tại theo đồng hồ hệ thống" là tháng mutable, độc lập dropdown) → đã ghi `DEC-098`, `DEC-105`, `DEC-106`, `DEC-107` vào `decisions.md`. Thuật ngữ "Item cần mua" đã ghi vào `glossary.md` từ bước `ssr-raw`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi (`/budget`) — thêm khu vực "Items cần mua" mới, có 2 trạng thái hiển thị: đầy đủ thao tác (tháng đang được chọn) và chỉ xem (tháng khác) |
| Thực thể dữ liệu nào bị chạm | Item cần mua (thực thể mới) — gắn theo Tháng ngân sách |
| Cần thay đổi cấu trúc dữ liệu | Có |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Có |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Giá của item cần mua chỉ là ghi chú tham khảo, không cộng vào Ngân sách/Chi thực tế/Số dư còn lại | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` khi ghi raw US-019 (`DEC-092`) | Nếu sai, cần thêm bước chọn danh mục cho từng item và thay đổi cách tính Chi thực tế — ảnh hưởng AC-02, `EL-09`, mục 9 |
| A2 | Hai trạng thái là "Pending" (cam/vàng) và "Purchased" (xanh lá) | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` khi ghi raw US-019 (`DEC-093`) | Nếu sai, cần đổi tên nhãn và màu badge — ảnh hưởng AC-01, AC-03, `EL-04` |
| A3 | "Tháng hiện tại" (mutable — cho phép thêm/sửa/xóa/đánh dấu đã mua) là tháng thực tế theo đồng hồ hệ thống, hoàn toàn độc lập với tháng Dylan đang chọn xem qua dropdown "Chọn tháng xem" — khác với cách xác định "tháng đang chọn" đã dùng cho giao dịch chi tiêu (`DEC-010`, dựa theo dropdown) | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` trong `ssr-plan` ngày 2026-08-14 (`DEC-107`), sau khi phát hiện mâu thuẫn nội bộ giữa AC-05 (đổi dropdown sang tháng cũ vẫn phải thành chỉ xem) và định nghĩa "tháng đang chọn" ban đầu (= giá trị dropdown) | Nếu sai, cần đổi lại cách xác định "tháng cũ" ở AC-05, `EL-05`/`EL-06`/`EL-07`/`EL-08`/`EL-09`/`EL-10`/`EL-11`, và cách server kiểm tra quyền thêm/sửa/xóa item |
| A4 | Item còn "Pending" được chuyển sang tháng mới khi Dylan bấm **cả hai** nút "Tạo tháng" và "Clone tháng đang xem", dù "Tạo tháng" không sao chép cấu trúc danh mục; "tháng nguồn" của việc chuyển là tháng hiện tại theo đồng hồ hệ thống tại thời điểm bấm nút (`A3`/`DEC-107`), không phải tháng Dylan đang xem qua dropdown nếu hai giá trị này khác nhau | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` trong `ssr-ba` ngày 2026-08-14 (`DEC-098`), phần "tháng nguồn" theo tháng hiện tại được làm rõ thêm cùng `DEC-107` trong `ssr-plan` để nhất quán với `A3` | Nếu sai, cần giới hạn lại chỉ nút "Clone tháng đang xem" mới chuyển item, hoặc đổi "tháng nguồn" thành tháng đang xem trên dropdown — ảnh hưởng AC-06, AC-07, `EL-10`/`EL-12`/`EL-13` |
| A5 | Item đã "Purchased" không bị chuyển khi tạo tháng mới, luôn ở lại tháng đã đánh dấu mua | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` khi ghi raw US-019 (`DEC-095`) | Nếu sai, cần chuyển toàn bộ item bất kể trạng thái — ảnh hưởng AC-06, AC-07 |
| A6 | Cho phép xóa item khi tháng đang xem là tháng hiện tại; chặn hoàn toàn xóa (và thêm/sửa/đánh dấu đã mua) ở tháng khác — kể cả khi tháng khác đó đang được chọn xem qua dropdown | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` khi ghi raw US-019 (`DEC-096`), làm rõ thêm cùng `A3`/`DEC-107` | Nếu sai, cần mở lại quyền thao tác ở tháng cũ hoặc đổi cách xác định tháng được phép xóa — ảnh hưởng AC-04, AC-05, `EL-08` |
| A7 | Dylan sửa được tên sản phẩm và/hoặc giá của một item đã tạo, ngay tại dòng đó (inline: bấm vào ô, gõ giá trị mới, rời khỏi ô để lưu) — chỉ ở tháng đang được chọn | Đã xác nhận từ knowledge — user chọn qua `AskUserQuestion` trong `ssr-ba` ngày 2026-08-14 (`DEC-106`), sau khi `ba-expert` phát hiện mâu thuẫn nội bộ: mục 5 (phân quyền), `BR-024`, trang wiki `feature/US-019` và `glossary.md` đều dùng chữ "sửa" nhưng bản nháp spec trước đó chưa có luồng/AC/element nào cho việc này | Nếu sai, cần bỏ khả năng sửa tại chỗ và sửa lại các trang kia cho khớp phạm vi tối giản (chỉ Thêm/Đánh dấu đã mua/Xóa) — ảnh hưởng AC-09, AC-10, `EL-02`, `EL-03` |
| A9 | Sửa ô Tên sản phẩm của một item đã có thành chuỗi rỗng rồi rời khỏi ô — không lưu, ô tự khôi phục lại tên cũ (cùng nguyên tắc bắt buộc nhập tên khi thêm mới) | Giả định hợp lý — suy trực tiếp từ ràng buộc "tên sản phẩm bắt buộc" đã áp dụng cho lúc thêm mới (`EL-06`), áp dụng nhất quán sang lúc sửa; chưa có xác nhận trực tiếp từ user cho riêng tình huống sửa thành rỗng | Nếu sai (ví dụ cho phép lưu tên rỗng), cần đổi lại thông báo lỗi hoặc ràng buộc khác khi sửa — ảnh hưởng `EL-02`, mục 6 (trường hợp ngoại lệ) |
| A8 | Khi bấm "Tạo tháng"/"Clone tháng đang xem" nhưng bước tạo tháng thất bại do trùng kỳ tháng (tình huống dự phòng đã mô tả ở `US-006` AC-05, ví dụ mở hai cửa sổ trình duyệt cùng lúc), item Pending của tháng nguồn **không** bị chuyển đi — vẫn giữ nguyên ở tháng gốc, chỉ chuyển khi tháng mới được tạo thành công | Giả định hợp lý — suy trực tiếp từ mục 11 ("bước chuyển item cần mua và bước tạo/sao chép danh mục cùng chạy trong một lần bấm nút, không tách thành hai thao tác riêng"): nếu thao tác gộp đó thất bại, không có phần nào của nó xảy ra; chưa có xác nhận trực tiếp từ user cho riêng tình huống dự phòng này | Nếu sai (ví dụ item vẫn bị chuyển dù tháng mới tạo thất bại), Dylan sẽ mất item Pending khỏi tháng gốc mà không có tháng mới nào chứa nó — ảnh hưởng bước triển khai nối `US-019` vào luồng tạo tháng của `US-006` |
