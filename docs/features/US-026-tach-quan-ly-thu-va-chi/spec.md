# Tách "Ngân sách & nhập nhanh" thành "Quản lý thu" và "Quản lý chi"

Status: Ready for DEV
Feature: US-026
Created: 2026-09-09
Updated: 2026-09-09
Raw Source: `docs/kb/ba/raw/US-026-tach-quan-ly-thu-va-chi.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-026-tach-quan-ly-thu-va-chi.md` (chưa biên soạn — xem mục 12)
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.

## 1. Mục Tiêu Nghiệp Vụ

Dylan là người dùng duy nhất của ứng dụng. Trong nhóm menu "Thu chi" hiện có một mục con tên "Ngân sách & nhập nhanh" gom rất nhiều việc vào một màn hình dài: khai báo nguồn thu, nhập nhanh từng khoản chi, danh sách "Items cần mua", và bảng ngân sách theo danh mục. Vì mọi thứ nằm chồng trên một trang, Dylan phải cuộn nhiều và khó tách bạch "phần thu" với "phần chi" khi xem lại hằng tuần.

Sau thay đổi này, mục "Ngân sách & nhập nhanh" được tách thành hai mục con riêng trong cùng nhóm "Thu chi":

- "Quản lý thu": nơi Dylan xem và khai báo tất cả nguồn thu của tháng, và xem nhanh các khoản đang để dành (các danh mục thuộc loại tích lũy).
- "Quản lý chi": nơi Dylan nhập nhanh các khoản chi ở cột bên trái, xem và chỉnh bảng danh mục ngân sách ở cột bên phải, và mở danh sách "Items cần mua" trong một ngăn trượt ra từ cạnh phải màn hình thay vì để nó chiếm chỗ cố định trên trang. ("Items cần mua" là nhãn hiển thị sẵn có của màn danh sách cần mua hiện tại; mỗi dòng có một trong hai trạng thái "Pending" — chưa mua — hoặc "Purchased" — đã mua.)

Giá trị đo được: sau thay đổi, nhóm menu "Thu chi" có đúng bốn mục con là "Lịch sử thu chi", "Insight tài chính", "Quản lý thu", "Quản lý chi"; không còn mục "Ngân sách & nhập nhanh". Mở "Quản lý thu" chỉ thấy phần thu (bảng nguồn thu và khu tổng hợp khoản để dành). Mở "Quản lý chi" thấy màn hình chia hai cột với nhập nhanh bên trái và bảng danh mục bên phải, và danh sách "Items cần mua" chỉ hiện ra khi Dylan bấm nút mở ngăn trượt. Mọi con số và hành vi của nguồn thu, nhập nhanh, danh mục, "Items cần mua" giữ nguyên như trước khi tách.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`../../kb/ba/raw/US-026-tach-quan-ly-thu-va-chi.md`](../../kb/ba/raw/US-026-tach-quan-ly-thu-va-chi.md) | Nội dung yêu cầu gốc và các lựa chọn Dylan đã chốt qua hộp thoại ngày 2026-09-09 (đối chiếu metadata) |
| [`../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md`](../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md) | Hành vi và ràng buộc tháng của bảng nguồn thu, cách tính "Thu nhập tháng", hai chỉ số tiết kiệm |
| [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) | Hành vi hiện tại của danh sách "Items cần mua": trạng thái, ràng buộc tháng, giá không cộng vào ngân sách |
| [`../US-016-loai-chi-tieu-combobox/spec.md`](../US-016-loai-chi-tieu-combobox/spec.md) | Loại danh mục là danh sách cố định ba giá trị (Cố định, Tích lũy, Khác) |
| [`../../kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Luồng F2 (lập và điều chỉnh ngân sách theo danh mục, quản lý nguồn thu), F3 (quản lý theo chu kỳ tháng), mục tiêu M2, M3, M4 |
| [`../../memory/glossary.md`](../../memory/glossary.md) | Định nghĩa Nguồn thu, Thu nhập tháng, Loại danh mục, Item cần mua, Nhập nhanh, Đã phân bổ vào tích lũy |
| [`../US-004-sua-xoa-tung-giao-dich/spec.md`](../US-004-sua-xoa-tung-giao-dich/spec.md) | Hành vi sửa/xóa từng dòng giao dịch trong bảng danh sách khoản chi |
| [`../US-012-sua-loi-nhan-dien-danh-muc/spec.md`](../US-012-sua-loi-nhan-dien-danh-muc/spec.md) | Quy tắc nhận diện danh mục từ nội dung nhập nhanh |
| [`../US-014-chi-tieu-khac-cuoi-bang/spec.md`](../US-014-chi-tieu-khac-cuoi-bang/spec.md) | Danh mục "Chi tiêu khác" nhận khoản chi chưa xác định danh mục |
| [`../../memory/decisions.md`](../../memory/decisions.md) | DEC-005 (route module quản lý chi tiêu là `/budget`), DEC-073 (ba loại danh mục), DEC-092 (giá item cần mua chỉ tham khảo), DEC-130 (ràng buộc tháng của item cần mua), DEC-133 (ràng buộc tháng của nguồn thu), DEC-137 (chốt định hướng US-026: tách màn hình, "Items cần mua" vào ngăn trượt, function trình bày ngoài Business Flow, code sau khi US-025 xong) |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`.

## 3. Phạm Vi

- Đổi nhóm menu "Thu chi" để mục con "Ngân sách & nhập nhanh" được thay bằng hai mục con mới: "Quản lý thu" và "Quản lý chi". Hai mục con "Lịch sử thu chi" và "Insight tài chính" giữ nguyên tên, vị trí và nội dung.
- Màn hình "Quản lý thu" gồm: bộ chọn tháng đang xem; bảng nguồn thu (thêm, sửa, xóa, kéo-thả sắp xếp, dòng tổng "Thu nhập tháng") giữ nguyên hành vi và ràng buộc tháng như hiện nay; và một khu tổng hợp chỉ để xem, liệt kê các danh mục có loại "Tích lũy" của tháng đang xem kèm số đã chi thực tế của từng danh mục và một dòng tổng "Đã phân bổ vào tích lũy".
- Màn hình "Quản lý chi" chia hai cột. Cột bên trái: ô nhập nhanh khoản chi (tự nhận diện số tiền và danh mục), ô danh mục nhận diện, nút ghi nhận, và danh sách các khoản chi đã nhập trong tháng với chức năng sửa và xóa từng dòng. Cột bên phải: một nút mở danh sách "Items cần mua" có kèm số đếm; bảng danh mục ngân sách (thêm danh mục, sửa tên, đổi loại, sửa số ngân sách, xóa danh mục thường, kéo-thả sắp xếp, dòng tổng cộng) giữ nguyên hành vi hiện nay; và cụm nút "Thêm danh mục", "Reset chi tháng này", "Xuất tập tin dữ liệu", "Xóa toàn bộ dữ liệu".
- Đầu màn hình "Quản lý chi" giữ khối "Quy tắc kiểm soát" gồm bốn thẻ nguyên tắc và bộ chọn tháng đang xem.
- Nút mở danh sách "Items cần mua" nằm ở đầu cột bên phải, phía trên bảng danh mục. Nút hiển thị số item còn ở trạng thái "Pending" (chưa mua) của tháng đang xem. Bấm nút mở một ngăn trượt ra từ cạnh phải màn hình.
- Ngăn trượt chứa toàn bộ chức năng danh sách "Items cần mua" như hiện nay: thêm một dòng (tên sản phẩm bắt buộc, giá tùy chọn), sửa tên và giá từng dòng, đánh dấu một dòng là "Purchased" (đã mua), xóa một dòng, và cùng ràng buộc tháng như hiện nay (chỉ thao tác được khi tháng đang xem là tháng hiện tại hoặc tháng sau, tháng đã kết thúc thì chỉ xem).
- Đóng ngăn trượt bằng nút đóng trong ngăn hoặc bằng cách bấm ra vùng nền mờ bên ngoài ngăn. Sau khi đóng, số đếm trên nút mở phản ánh đúng danh sách vừa chỉnh.
- Địa chỉ trang cũ của mục "Ngân sách & nhập nhanh" khi được mở trực tiếp sẽ đưa người dùng tới màn hình "Quản lý chi", giữ nguyên tháng đang xem.
- Tháng đang xem được giữ chung khi Dylan chuyển qua lại giữa "Quản lý thu", "Quản lý chi" và các mục con khác của nhóm "Thu chi", đúng như cách tháng đang xem hiện được giữ khi chuyển giữa các mục con.

## 4. Ngoài Phạm Vi

- Thêm khu nhập tay "kế hoạch chi tiêu dài hạn" (danh sách mục tiêu dài hạn kèm số tiền). Yêu cầu gốc có nhắc ý này nhưng Dylan chốt chưa dựng màn hình cho nó ở lần này; sẽ tách thành yêu cầu riêng.
- Thay đổi cách tính bất kỳ con số nào: "Thu nhập tháng", "Số dư còn lại", "Tiết kiệm ròng", "Tỷ lệ tiết kiệm", "Đã phân bổ vào tích lũy", số đã chi theo danh mục — tất cả giữ nguyên công thức hiện có.
- Thay đổi ràng buộc tháng của nguồn thu, của nhập nhanh, hoặc của item cần mua.
- Thay đổi hành vi tự chuyển các item cần mua ở trạng thái "Pending" sang tháng mới khi tạo tháng.
- Đổi bộ giao diện hay làm lại responsive cho điện thoại và máy tính bảng — thuộc yêu cầu giao diện riêng.
- Đổi nội dung hoặc vị trí hai mục con "Lịch sử thu chi" và "Insight tài chính".
- Cho Dylan tự sắp xếp lại thứ tự hoặc ẩn/hiện hai mục con mới (việc này thuộc bảng điều khiển tùy biến menu, là một yêu cầu khác).

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Mở "Quản lý thu" và "Quản lý chi"; khai báo và chỉnh nguồn thu; nhập nhanh và chỉnh các khoản chi; chỉnh bảng danh mục ngân sách; mở ngăn trượt và chỉnh danh sách "Items cần mua" theo đúng ràng buộc tháng hiện có | Không có thao tác nào bị chặn thêm so với hiện nay; các giới hạn theo tháng giữ nguyên | [`../../memory/glossary.md`](../../memory/glossary.md) — mục Vai trò người dùng; [`../../memory/decisions.md`](../../memory/decisions.md) — DEC-004 (một người dùng, không đăng nhập phân quyền) |

## 6. Luồng Nghiệp Vụ

1. Dylan mở ứng dụng và bấm vào nhóm "Thu chi" ở thanh điều hướng bên trái.
2. Nhóm "Thu chi" mở ra bốn mục con: "Lịch sử thu chi", "Insight tài chính", "Quản lý thu", "Quản lý chi".
3. Dylan bấm "Quản lý thu". Màn hình hiện bộ chọn tháng đang xem, bảng nguồn thu của tháng đó, và khu tổng hợp các khoản để dành (danh mục loại "Tích lũy") chỉ để xem.
4. Dylan thêm, sửa, xóa hoặc kéo-thả sắp xếp các nguồn thu. Dòng "Thu nhập tháng" ở cuối bảng cập nhật ngay theo tổng các nguồn thu.
5. Dylan bấm "Quản lý chi". Màn hình hiện khối "Quy tắc kiểm soát" bốn thẻ, bộ chọn tháng đang xem, rồi một vùng chia hai cột.
6. Ở cột bên trái, Dylan gõ một dòng mô tả khoản chi (ví dụ "cà phê 45k"). Hệ thống tự nhận ra số tiền và gợi ý danh mục. Dylan bấm ghi nhận; khoản chi được thêm vào danh sách bên dưới và cộng vào số đã chi của danh mục.
7. Dylan sửa hoặc xóa một khoản chi đã nhập ngay tại dòng của nó.
8. Ở cột bên phải, Dylan xem bảng danh mục ngân sách, chỉnh tên, loại, số ngân sách, thêm hoặc xóa danh mục, và dùng cụm nút bên dưới bảng khi cần.
9. Dylan bấm nút mở danh sách "Items cần mua" ở đầu cột bên phải. Một ngăn trượt ra từ cạnh phải màn hình, che một phần bên phải và làm mờ phần còn lại.
10. Trong ngăn trượt, Dylan thêm, sửa, đánh dấu "Purchased" (đã mua) hoặc xóa các item, theo đúng giới hạn tháng hiện có.
11. Dylan đóng ngăn trượt. Số đếm trên nút mở cập nhật theo số item còn ở trạng thái "Pending".

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | "Quản lý thu": bảng nguồn thu hiện dòng "Tháng này chưa có nguồn thu nào", "Thu nhập tháng" hiện 0 đồng; khu khoản để dành hiện "Chưa có danh mục để dành nào trong tháng này". "Quản lý chi": danh sách khoản chi hiện "Chưa có giao dịch nhập nhanh trong tháng này"; ngăn trượt "Items cần mua" hiện "Tháng này chưa có item cần mua nào"; số đếm trên nút mở hiện 0. (AC-08) |
| Không đủ quyền | Không áp dụng — chỉ có một người dùng, một phiên làm việc, không phân quyền. |
| Dữ liệu trùng | Không phát sinh trùng mới do thay đổi này; quy tắc trùng tên danh mục và trùng tháng giữ nguyên như hiện nay. |
| Hai thao tác gần như đồng thời | Không áp dụng — một người dùng, một phiên; không có tình huống hai người sửa cùng lúc. Nếu Dylan mở ứng dụng ở hai tab, tab còn lại thấy số liệu cũ cho tới khi tải lại, đúng như hành vi hiện nay. |
| Danh sách rất dài | Cột trái, cột phải và ngăn trượt mỗi vùng cuộn độc lập; bố cục hai cột của "Quản lý chi" và ngăn trượt không vỡ khi có rất nhiều nguồn thu, danh mục, khoản chi hoặc item cần mua. |
| Hệ thống lỗi | Khi một thao tác lưu không thành công (thêm nguồn thu, chỉnh danh mục, chỉnh item cần mua), màn hình hiện thông báo "Có lỗi xảy ra, vui lòng thử lại." và tự ẩn sau vài giây; mọi giá trị trên màn hình giữ nguyên như trước thao tác. (AC-09) |
| Tháng đang xem đã kết thúc | "Quản lý thu": bảng nguồn thu chuyển sang chỉ xem (không ô thêm, không sửa được ô, không nút xóa, không kéo-thả). "Quản lý chi": nút mở "Items cần mua" vẫn bấm được nhưng ngăn trượt chuyển sang chỉ xem (không ô thêm, không nút đánh dấu đã mua, không nút xóa, các ô không sửa được); nhập nhanh và bảng danh mục giữ nguyên hành vi hiện có cho tháng đã qua. (AC-03) |
| Mở địa chỉ trang cũ "Ngân sách & nhập nhanh" | Người dùng được đưa thẳng tới màn hình "Quản lý chi", giữ nguyên tháng đang xem. (AC-07) |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Dylan đang ở ứng dụng, thanh điều hướng bên trái có nhóm "Thu chi" | Dylan bấm mở nhóm "Thu chi" | Nhóm bung ra đúng bốn mục con theo thứ tự: "Lịch sử thu chi", "Insight tài chính", "Quản lý thu", "Quản lý chi"; không còn mục "Ngân sách & nhập nhanh" | Xem ASCII Mockup mục 8.1 |
| AC-02 | Nhóm "Thu chi" đang mở, tháng đang xem là 2026-09 và có ít nhất một nguồn thu và một danh mục loại "Tích lũy" | Dylan bấm "Quản lý thu" | Màn hình chỉ hiện phần thu: bộ chọn tháng "2026-09", bảng nguồn thu với dòng "Thu nhập tháng" bằng tổng các nguồn thu, và khu "Khoản để dành" liệt kê từng danh mục loại "Tích lũy" kèm số đã chi và một dòng "Đã phân bổ vào tích lũy" bằng tổng các số đó; không có ô nhập nhanh, không có bảng danh mục ngân sách | Xem ASCII Mockup mục 8.2 |
| AC-03 | Tháng đang xem là một tháng đã kết thúc; tháng đó có sẵn vài nguồn thu và vài item cần mua | Dylan mở "Quản lý thu" nhìn bảng nguồn thu, rồi mở "Quản lý chi" và bấm nút "Items cần mua" | Bảng nguồn thu ở chế độ chỉ xem: không có ô thêm nguồn thu, các ô tên và số tiền không sửa được, không có nút xóa, không kéo-thả được. Ngăn trượt "Items cần mua" vẫn mở được nhưng ở chế độ chỉ xem: không có ô thêm, không có nút "Thêm item", không có nút đánh dấu đã mua, không có nút xóa, các ô tên và giá không sửa được | Xem ASCII Mockup mục 8.2 và 8.4 |
| AC-04 | Nhóm "Thu chi" đang mở, tháng đang xem có sẵn danh mục và vài khoản chi | Dylan bấm "Quản lý chi" | Màn hình hiện khối "Quy tắc kiểm soát" bốn thẻ và bộ chọn tháng ở trên; bên dưới chia hai cột: cột trái có ô nhập nhanh, ô danh mục nhận diện, nút ghi nhận và danh sách khoản chi; cột phải có nút "Items cần mua" ở trên cùng, rồi bảng danh mục ngân sách, rồi cụm nút "Thêm danh mục", "Reset chi tháng này", "Xuất tập tin dữ liệu", "Xóa toàn bộ dữ liệu" | Xem ASCII Mockup mục 8.3 |
| AC-05 | Đang ở "Quản lý chi", tháng đang xem là tháng hiện tại, có danh mục "Ăn uống" | Dylan gõ "ăn trưa 65k" vào ô nhập nhanh, chọn "Ăn uống" ở ô danh mục nhận diện (nếu hệ thống chưa tự chọn), rồi bấm "Ghi nhận" | Một dòng khoản chi mới xuất hiện trong danh sách bên dưới với nội dung "ăn trưa 65k" và số tiền 65.000 đồng, gắn danh mục "Ăn uống"; số đã chi của danh mục "Ăn uống" tăng thêm đúng 65.000 đồng; ô nhập nhanh được xóa trống | Xem ASCII Mockup mục 8.3 |
| AC-06 | Đang ở "Quản lý chi", tháng đang xem là tháng hiện tại, có ba item cần mua ở trạng thái "Pending" và một item ở trạng thái "Purchased" | Dylan nhìn nút "Items cần mua" ở đầu cột phải, rồi bấm mở ngăn trượt, thêm một item mới tên "Bàn phím", rồi bấm nút đóng ngăn trượt | Trước khi mở: nút hiển thị số đếm "3" (chỉ đếm item ở trạng thái "Pending" của tháng đang xem). Khi bấm mở: ngăn trượt hiện ra từ cạnh phải màn hình, chứa danh sách "Items cần mua" kèm ô thêm mới. Sau khi thêm "Bàn phím" (trạng thái "Pending") và đóng ngăn: ngăn biến mất, số đếm trên nút chuyển thành "4" | Xem ASCII Mockup mục 8.3 và 8.4 |
| AC-07 | Dylan đang ở "Quản lý thu" với tháng đang xem là 2026-07; Dylan mở địa chỉ trang cũ của mục "Ngân sách & nhập nhanh" trên trình duyệt | Trình duyệt tải địa chỉ trang cũ | Màn hình hiển thị là "Quản lý chi", và tháng đang xem vẫn là 2026-07 | Xem ASCII Mockup mục 8.3 |
| AC-08 | Nhóm "Thu chi" đang mở, tháng đang xem chưa có nguồn thu, chưa có danh mục loại "Tích lũy", chưa có giao dịch nhập nhanh và chưa có item cần mua nào | Dylan mở lần lượt "Quản lý thu" rồi "Quản lý chi", và bấm mở ngăn trượt "Items cần mua" | "Quản lý thu": bảng nguồn thu hiện "Tháng này chưa có nguồn thu nào", "Thu nhập tháng" hiện 0 đồng, khu khoản để dành hiện "Chưa có danh mục để dành nào trong tháng này". "Quản lý chi": danh sách khoản chi hiện "Chưa có giao dịch nhập nhanh trong tháng này", số đếm trên nút "Items cần mua" hiện "0", ngăn trượt hiện "Tháng này chưa có item cần mua nào" | Xem ASCII Mockup mục 8.2 và 8.4 |
| AC-09 | Đang ở "Quản lý thu", tháng đang xem là tháng hiện tại, bảng nguồn thu đang có hai dòng; hệ thống tạm thời không lưu được | Dylan thêm một nguồn thu mới rồi bấm "Thêm nguồn thu" | Màn hình hiện thông báo "Có lỗi xảy ra, vui lòng thử lại." rồi tự ẩn sau vài giây; bảng nguồn thu vẫn đúng hai dòng như trước, "Thu nhập tháng" không đổi | Xem ASCII Mockup mục 8.2 |

Quy tắc:

- Given nêu vai trò người dùng và dữ liệu có sẵn.
- Then là thứ nhìn thấy hoặc đo được.
- Chưa có tập tin mockup thật (ảnh/thiết kế); cột Mockup trỏ về khối ASCII Mockup tương ứng ở mục 8.

## 8. Screen Element

### 8.1. Thanh điều hướng bên trái — nhóm menu "Thu chi"

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Nhóm menu Thu chi | Tab | Thu chi | Cấu trúc điều hướng | Bấm để bung/thu danh sách mục con; là mục cha, không phải trang riêng | Dylan | AC-01 | Không |
| EL-02 | Mục con Lịch sử thu chi | Link | Lịch sử thu chi | Cấu trúc điều hướng | Mục con thứ nhất; giữ nguyên đích đến và nội dung hiện có | Dylan | AC-01 | Không |
| EL-03 | Mục con Insight tài chính | Link | Insight tài chính | Cấu trúc điều hướng | Mục con thứ hai; giữ nguyên đích đến và nội dung hiện có | Dylan | AC-01 | Không |
| EL-04 | Mục con Quản lý thu | Link | Quản lý thu | Cấu trúc điều hướng | Mục con thứ ba; mới; dẫn tới màn hình "Quản lý thu" | Dylan | AC-01, AC-02 | Không |
| EL-05 | Mục con Quản lý chi | Link | Quản lý chi | Cấu trúc điều hướng | Mục con thứ tư; mới; dẫn tới màn hình "Quản lý chi" | Dylan | AC-01, AC-04 | Không |
| EL-06 | Mục con Ngân sách & nhập nhanh | Link | Ngân sách & nhập nhanh | Cấu trúc điều hướng | Bị xóa khỏi menu; địa chỉ trang cũ của nó nếu mở trực tiếp thì đưa tới "Quản lý chi" | Dylan | AC-01, AC-07 | Không |

**ASCII Mockup**

```text
+---------------------------+
|  Dylan Plan               |
+---------------------------+
|  Tổng quan                |
|  Roadmap               v  |
|  Thời gian biểu           |
|  Freelance             v  |
|  Sản phẩm              v  |
|  Thu chi               ^  |
|    Lịch sử thu chi        |
|    Insight tài chính      |
|    Quản lý thu            |
|    Quản lý chi            |
+---------------------------+
```

### 8.2. Màn hình "Quản lý thu"

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-10 | Bộ chọn tháng đang xem | Dropdown | Tháng đang xem | Danh sách các tháng đã có dữ liệu | Giá trị mặc định là tháng đang xem chung của nhóm "Thu chi"; đổi ở đây thì các mục con khác cũng theo | Dylan | AC-02 | [`../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md`](../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md) — bộ chọn tháng đang xem |
| EL-11 | Bảng nguồn thu | Table | Nguồn thu | Danh sách nguồn thu của tháng đang xem | Giữ nguyên toàn bộ hành vi hiện có: sắp xếp theo thứ tự Dylan đã kéo-thả; ở tháng đã kết thúc thì chỉ xem | Dylan | AC-02, AC-03 | [`../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md`](../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md) — bảng nguồn thu (EL-01) |
| EL-12 | Cột tên nguồn | Column | Tên nguồn | Tên của từng nguồn thu | Cột thứ nhất; sửa trực tiếp tại ô; để trống thì không lưu, khôi phục tên cũ | Dylan | AC-02, AC-03 | Không |
| EL-13 | Cột số tiền | Column | Số tiền | Số tiền của từng nguồn thu | Cột thứ hai; sửa trực tiếp tại ô; nhận số nguyên đồng từ 0 trở lên | Dylan | AC-02, AC-03 | Không |
| EL-14 | Cột hành động nguồn thu | Column | (không nhãn) | — | Cột thứ ba; chứa nút xóa từng dòng và tay nắm kéo-thả; ẩn khi tháng đã kết thúc | Dylan | AC-03 | Không |
| EL-15 | Ô nhập nguồn thu mới | Input | Tên nguồn / Số tiền | — | Tên bắt buộc, số tiền bắt buộc và từ 0 trở lên; cả khu vực thêm ẩn khi tháng đã kết thúc | Dylan | AC-02, AC-03 | Không |
| EL-16 | Nút thêm nguồn thu | Button | Thêm nguồn thu | — | Bật khi tên không rỗng và số tiền hợp lệ; bấm thì thêm một dòng vào cuối bảng và cập nhật "Thu nhập tháng"; khi lưu không thành công thì hiện EL-22 và giữ nguyên bảng; ẩn khi tháng đã kết thúc | Dylan | AC-02, AC-03, AC-09 | Không |
| EL-17 | Dòng tổng thu nhập tháng | Badge | Thu nhập tháng | Tổng số tiền các nguồn thu của tháng | Chỉ xem; đổi ngay khi danh sách nguồn thu đổi; hiện 0 đồng khi không có nguồn thu | Dylan | AC-02, AC-08, AC-09 | Không |
| EL-18 | Khu khoản để dành | Table | Khoản để dành | Các danh mục có loại "Tích lũy" của tháng đang xem | Chỉ xem, không thêm/sửa/xóa ở đây; xác định theo loại danh mục, không theo tên; khi không có danh mục loại "Tích lũy" thì hiện dòng trống "Chưa có danh mục để dành nào trong tháng này" | Dylan | AC-02, AC-08 | [`../US-016-loai-chi-tieu-combobox/spec.md`](../US-016-loai-chi-tieu-combobox/spec.md) — trường Loại của danh mục |
| EL-19 | Cột tên danh mục để dành | Column | Danh mục | Tên danh mục loại "Tích lũy" | Cột thứ nhất của khu khoản để dành; sắp theo thứ tự hiển thị của danh mục trong tháng | Dylan | AC-02, AC-08 | Không |
| EL-20 | Cột số đã để dành | Column | Đã để dành | Số đã chi thực tế của danh mục loại "Tích lũy" đó | Cột thứ hai; chỉ xem | Dylan | AC-02 | Không |
| EL-21 | Dòng tổng đã phân bổ vào tích lũy | Badge | Đã phân bổ vào tích lũy | Tổng số đã chi của mọi danh mục loại "Tích lũy" trong tháng | Chỉ xem; cùng con số với ô cùng tên ở mục "Insight tài chính" | Dylan | AC-02 | [`../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md`](../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md) — ô "Đã phân bổ vào tích lũy" |
| EL-22 | Thông báo lỗi thao tác | Toast | Có lỗi xảy ra, vui lòng thử lại. | — | Hiện khi lưu một nguồn thu không thành công; tự ẩn sau vài giây; giá trị trên màn hình giữ nguyên | Dylan | AC-09 | Không |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| Quản lý thu                                                     |
| [ Tháng đang xem: 2026-09  v ]                                  |
+----------------------------------------------------------------+
| Nguồn thu                                                       |
+----------------------+------------------+----------------------+
| Tên nguồn            | Số tiền          |                      |
+----------------------+------------------+----------------------+
| Lương                | 35.000.000       |  [::] [xóa]           |
| Freelance            | 5.000.000        |  [::] [xóa]           |
+----------------------+------------------+----------------------+
| [ Tên nguồn... ] [ Số tiền... ]        [ + Thêm nguồn thu ]     |
+----------------------------------------------------------------+
| Thu nhập tháng: 40.000.000đ                                     |
+----------------------------------------------------------------+
| Khoản để dành (chỉ xem)                                         |
+----------------------------------+-----------------------------+
| Danh mục                         | Đã để dành                  |
+----------------------------------+-----------------------------+
| Quỹ dự phòng                     | 3.000.000đ                  |
| Đầu tư                           | 2.000.000đ                  |
+----------------------------------+-----------------------------+
| Đã phân bổ vào tích lũy: 5.000.000đ                             |
+----------------------------------------------------------------+
```

Mockup minh họa tháng đang xem còn thao tác được. Khi tháng đã kết thúc (AC-03): ẩn dòng "[ Tên nguồn... ] ... [ + Thêm nguồn thu ]", ẩn cột "[::] [xóa]", các ô Tên nguồn / Số tiền không sửa được. Khi tháng chưa có dữ liệu (AC-08): bảng nguồn thu thay bằng dòng "Tháng này chưa có nguồn thu nào", khu "Khoản để dành" thay bằng dòng "Chưa có danh mục để dành nào trong tháng này".

### 8.3. Màn hình "Quản lý chi"

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-30 | Khối Quy tắc kiểm soát | Table | Quy tắc kiểm soát | Bốn nguyên tắc cố định | Chuyển từ màn hình "Ngân sách & nhập nhanh" cũ sang đây; nội dung bốn thẻ giữ nguyên | Dylan | AC-04 | Không |
| EL-31 | Bộ chọn tháng đang xem | Dropdown | Tháng đang xem | Danh sách các tháng đã có dữ liệu | Cùng giá trị tháng đang xem chung với "Quản lý thu" và các mục con khác | Dylan | AC-04, AC-07 | [`../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md`](../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md) — bộ chọn tháng đang xem |
| EL-32 | Cột trái — vùng nhập nhanh | Table | Nhập nhanh chi tiêu | Ô nhập của Dylan | Nằm ở nửa trái màn hình trên màn hình rộng; giữ nguyên hành vi nhập nhanh hiện có | Dylan | AC-04, AC-05 | Không |
| EL-33 | Ô nhập nội dung khoản chi | Input | Nội dung chi tiêu | — | Tự nhận diện số tiền và gợi ý danh mục khi Dylan gõ; nhấn phím xuống dòng để ghi nhận nhanh | Dylan | AC-05 | [`../US-012-sua-loi-nhan-dien-danh-muc/spec.md`](../US-012-sua-loi-nhan-dien-danh-muc/spec.md) — quy tắc nhận diện danh mục từ nội dung |
| EL-34 | Ô danh mục nhận diện | Dropdown | Danh mục nhận diện | Danh sách danh mục của tháng đang xem cộng lựa chọn "— Chưa xác định —" | Giá trị mặc định là danh mục hệ thống đoán ra từ nội dung; "— Chưa xác định —" nghĩa là để hệ thống tự xếp vào "Chi tiêu khác" | Dylan | AC-05 | [`../US-014-chi-tieu-khac-cuoi-bang/spec.md`](../US-014-chi-tieu-khac-cuoi-bang/spec.md) — danh mục "Chi tiêu khác" nhận khoản chi không xác định |
| EL-35 | Nút ghi nhận khoản chi | Button | Ghi nhận | — | Bật khi ô nội dung có chữ và có số tiền nhận diện được; bấm thì thêm khoản chi và cộng vào số đã chi của danh mục | Dylan | AC-05 | Không |
| EL-36 | Danh sách khoản chi trong tháng | Table | Giao dịch trong tháng | Các khoản chi đã nhập của tháng đang xem | Mỗi dòng có nút "Sửa" và nút "Xóa"; sửa mở ô chỉnh nội dung, số tiền, danh mục, ngày; giữ nguyên hành vi hiện có; khi tháng đang xem chưa có giao dịch nhập nhanh nào thì hiện dòng trống "Chưa có giao dịch nhập nhanh trong tháng này" | Dylan | AC-05, AC-08 | [`../US-004-sua-xoa-tung-giao-dich/spec.md`](../US-004-sua-xoa-tung-giao-dich/spec.md) — sửa/xóa từng giao dịch tại bảng chi tiết |
| EL-37 | Nút mở danh sách Items cần mua | Button | Items cần mua | Số item ở trạng thái "Pending" của tháng đang xem | Nằm ở đầu cột phải, trên bảng danh mục; luôn bấm được kể cả tháng đã kết thúc; bấm thì mở ngăn trượt EL-40 | Dylan | AC-03, AC-04, AC-06 | [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) — danh sách Items cần mua |
| EL-38 | Số đếm trên nút Items cần mua | Badge | (con số) | Số item ở trạng thái "Pending" của tháng đang xem | Hiện ngay cạnh nhãn nút; bằng 0 thì vẫn hiện số 0; cập nhật lại sau khi đóng ngăn trượt | Dylan | AC-06, AC-08 | Không |
| EL-39 | Bảng danh mục ngân sách | Table | (bảng danh mục) | Danh mục của tháng đang xem | Nằm ở cột phải, dưới nút Items cần mua; giữ nguyên toàn bộ hành vi hiện có: sửa tên, đổi loại, sửa ngân sách, xóa danh mục thường, dòng tổng cộng, kéo-thả sắp xếp | Dylan | AC-04 | [`../US-016-loai-chi-tieu-combobox/spec.md`](../US-016-loai-chi-tieu-combobox/spec.md) — cột Loại của danh mục |
| EL-40 | Ngăn trượt Items cần mua | Modal | Items cần mua | Danh sách Items cần mua của tháng đang xem | Trượt ra từ cạnh phải màn hình; che một phần bên phải và phủ mờ phần màn hình còn lại; đóng bằng nút đóng trong ngăn (EL-41) hoặc bấm vào vùng nền mờ bên ngoài ngăn; cả hai cách đóng đều cập nhật lại EL-38; ở tháng đã kết thúc thì nội dung ngăn chỉ xem | Dylan | AC-06, AC-03 | [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) — danh sách Items cần mua |
| EL-41 | Nút đóng ngăn trượt | Button | (biểu tượng đóng) | — | Nằm ở góc trên ngăn trượt; bấm thì đóng ngăn và cập nhật EL-38 | Dylan | AC-06 | Không |
| EL-42 | Cụm nút hành động | Button | Thêm danh mục / Reset chi tháng này / Xuất tập tin dữ liệu / Xóa toàn bộ dữ liệu | — | Chuyển từ màn hình cũ sang đây, đặt dưới bảng danh mục; "Xuất tập tin dữ liệu" và "Xóa toàn bộ dữ liệu" tác động toàn bộ dữ liệu mọi tháng, không chỉ phần chi | Dylan | AC-04 | Không |

**ASCII Mockup**

```text
+------------------------------------------------------------------------+
| Quản lý chi     [ Tháng đang xem: 2026-09  v ]                          |
+------------------------------------------------------------------------+
| Quy tắc kiểm soát: [01 ...] [02 ...] [03 ...] [04 ...]                  |
+---------------------------------+------------------------------------+
| Nhập nhanh chi tiêu             |  [ Items cần mua  (3) ]             |
| [ Nội dung chi tiêu......... ]  |  +------------------------------+  |
| [ Danh mục nhận diện     v ]    |  | Danh mục | Loại | Ngân sách | Đã chi | |
| [ Ghi nhận ]                    |  | Ăn uống  | Khác |    ...    |  ...   | |
|                                 |  | Đi lại   | Khác |    ...    |  ...   | |
| Giao dịch trong tháng:          |  +------------------------------+  |
|  - ăn trưa 65k   -65.000 [S][X]|  [ + Thêm danh mục ] [ Reset chi ] |
|  - grab 80k      -80.000 [S][X]|  [ Xuất tập tin dữ liệu ]          |
|                                 |  [ Xóa toàn bộ dữ liệu ]           |
+---------------------------------+------------------------------------+
```

Ký hiệu: `[S]` = nút "Sửa", `[X]` = nút "Xóa" trên từng dòng giao dịch. Nút "Items cần mua (3)" là EL-37 kèm số đếm EL-38; bấm nút này mới mở ngăn trượt mục 8.4. Khi tháng chưa có giao dịch nhập nhanh (AC-08): vùng "Giao dịch trong tháng" thay bằng dòng "Chưa có giao dịch nhập nhanh trong tháng này".

### 8.4. Ngăn trượt "Items cần mua" (mở từ màn hình "Quản lý chi")

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-50 | Bảng Items cần mua | Table | Items cần mua | Danh sách Items cần mua của tháng đang xem | Giữ nguyên toàn bộ hành vi của danh sách hiện có; ở tháng đã kết thúc thì chỉ xem; khi tháng đang xem chưa có item nào thì hiện dòng trống "Tháng này chưa có item cần mua nào" | Dylan | AC-03, AC-06, AC-08 | [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) — bảng Items cần mua |
| EL-51 | Cột tên sản phẩm | Column | Tên sản phẩm | Tên từng item cần mua | Cột thứ nhất; bắt buộc; sửa trực tiếp tại ô; không sửa được khi tháng đã kết thúc | Dylan | AC-03, AC-06 | Không |
| EL-52 | Cột giá | Column | Giá | Giá tham khảo của từng item | Cột thứ hai; tùy chọn; không cộng vào ngân sách hay số đã chi; không sửa được khi tháng đã kết thúc | Dylan | AC-03, AC-06 | [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) — giá chỉ tham khảo |
| EL-53 | Cột trạng thái | Column | Trạng thái | Trạng thái "Pending" hoặc "Purchased" | Cột thứ ba; mặc định "Pending" khi thêm mới; chỉ đổi sang "Purchased" qua nút ở EL-54 | Dylan | AC-03, AC-06 | [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) — hai trạng thái Pending/Purchased |
| EL-54 | Cột hành động Items cần mua | Column | Hành động | — | Cột thứ tư; chứa nút "Đánh dấu đã mua" (chỉ hiện khi đang "Pending") và nút xóa; ẩn khi tháng đã kết thúc; hành vi đánh dấu đã mua và xóa giữ nguyên như hiện nay | Dylan | AC-03, AC-06 | [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) — đánh dấu đã mua, xóa item |
| EL-55 | Ô thêm item cần mua | Input | Tên sản phẩm / Giá | — | Tên bắt buộc, giá tùy chọn; ẩn khi tháng đã kết thúc | Dylan | AC-03, AC-06 | Không |
| EL-56 | Nút thêm item cần mua | Button | Thêm item | — | Bật khi tên không rỗng; bấm thì thêm một dòng trạng thái "Pending"; ẩn khi tháng đã kết thúc | Dylan | AC-03, AC-06 | Không |

**ASCII Mockup**

```text
                         +--------------------------------------+
   (nền mờ phần còn lại) | Items cần mua                  [ X ] |
                         +------------------+---------+---------+
                         | Tên sản phẩm     | Giá     | T.thái  |
                         +------------------+---------+---------+
                         | Màn hình 27"     | 6.000.000 | Pending  [✓][X] |
                         | Bàn phím         |  1.200.000| Pending  [✓][X] |
                         | Chuột            |     -     | Purchased   [X] |
                         +------------------+---------+---------+
                         | [ Tên sản phẩm... ] [ Giá... ] [ +Thêm item ] |
                         +--------------------------------------+
```

Mockup minh họa tháng đang xem còn thao tác được. Khi tháng đã kết thúc (AC-03): ẩn dòng "[ Tên sản phẩm... ] ... [ +Thêm item ]", ẩn nút "[✓]" và "[X]" trên mọi dòng, các ô Tên sản phẩm / Giá không sửa được. Khi tháng chưa có item nào (AC-08): thay bảng bằng dòng "Tháng này chưa có item cần mua nào".

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Nguồn thu | Không đổi | Không | Không đổi cách lưu; chỉ đổi màn hình hiển thị |
| Danh mục ngân sách | Không đổi | Không | Không đổi cách lưu |
| Khoản chi (giao dịch nhập nhanh) | Không đổi | Không | Không đổi cách lưu |
| Item cần mua | Không đổi | Không | Không đổi cách lưu; chỉ chuyển nơi hiển thị vào ngăn trượt |
| Cấu trúc điều hướng (danh sách mục con nhóm "Thu chi") | Sửa | Có | Mục "Ngân sách & nhập nhanh" bị thay bằng "Quản lý thu" và "Quản lý chi"; nếu hệ thống có lưu thứ tự và trạng thái ẩn/hiện các mục menu thì phần lưu cho mục cũ cần được thay bằng phần lưu cho hai mục mới |
| Tập tin xuất dữ liệu (nút "Xuất tập tin dữ liệu") | Không đổi | Không | Nội dung và định dạng tập tin xuất giữ nguyên |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md`](../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md) | Quy tắc nghiệp vụ | Không | Implemented |
| [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) | Quy tắc nghiệp vụ | Không | Implemented |
| [`../US-016-loai-chi-tieu-combobox/spec.md`](../US-016-loai-chi-tieu-combobox/spec.md) | Dữ liệu | Không | Implemented |
| [`../US-004-sua-xoa-tung-giao-dich/spec.md`](../US-004-sua-xoa-tung-giao-dich/spec.md) | Quy tắc nghiệp vụ | Không | Implemented |
| [`../US-012-sua-loi-nhan-dien-danh-muc/spec.md`](../US-012-sua-loi-nhan-dien-danh-muc/spec.md) | Quy tắc nghiệp vụ | Không | Implemented |
| [`../US-014-chi-tieu-khac-cuoi-bang/spec.md`](../US-014-chi-tieu-khac-cuoi-bang/spec.md) | Quy tắc nghiệp vụ | Không | Implemented |
| Yêu cầu US-025 — bảng điều khiển tùy biến menu (chưa có spec, đang code) | Thứ tự | Có — chỉ chặn phần viết mã, không chặn phần lập kế hoạch/tài liệu (`DEC-137`) | Draft |

Phạm vi đã tìm: toàn bộ thư mục yêu cầu trong `docs/features` và tài liệu luồng nghiệp vụ `docs/kb/ba/business-flow.md`. Có một yêu cầu đang làm dở mang mã dạng US (viết tắt của "User Story", cách dự án đánh mã yêu cầu), cụ thể là US-025, về bảng điều khiển tùy biến menu; yêu cầu đó đụng cùng vùng dữ liệu điều hướng. Dylan chốt (ghi ở quyết định số DEC (viết tắt của "Decision") 137 trong `decisions.md`, tức `DEC-137`): phần lập kế hoạch, phân rã công việc và tài liệu của yêu cầu này làm được ngay, nhưng phần viết mã chỉ bắt đầu **sau khi US-025 hoàn tất** để hai bên thống nhất danh sách mục con và phần lưu tùy chọn menu, tránh xung đột. Đây là ràng buộc thứ tự triển khai, không phải điểm chặn nghiệp vụ.

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md`](../US-022-nguon-thu-va-insight-tab-thu-chi/spec.md) | Mục 8 — màn hình chứa bảng nguồn thu | Bảng nguồn thu chuyển từ mục "Ngân sách & nhập nhanh" sang màn hình "Quản lý thu" | Không | Khi cập nhật wiki, ghi chú bảng nguồn thu nay nằm ở "Quản lý thu" |
| [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) | Mục 8 — nơi hiển thị bảng "Items cần mua" (EL-01 của US-019) | Bảng "Items cần mua" chuyển vào ngăn trượt mở từ "Quản lý chi"; ô nhập và các nút giữ nguyên hành vi | Không | Khi cập nhật wiki, ghi chú danh sách nay nằm trong ngăn trượt, mở bằng nút có số đếm "Pending" |
| [`../../kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục 3 — mô tả luồng F2 và F3 | F2 nay tách phần nguồn thu và phần ngân sách theo danh mục sang hai màn hình | Không | Đề nghị `ssr-po` cập nhật mô tả F2/F3 để phản ánh việc tách màn hình (không đổi bản chất nghiệp vụ) |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| `docs/kb/ba/wiki/knowledge/feature/US-026-tach-quan-ly-thu-va-chi.md` (chưa có, cần tạo) | Cần biên soạn trang feature mới: mục tiêu tách màn hình, phạm vi, luồng, danh sách rule; nêu rõ đây là thay đổi trình bày, không đổi nghiệp vụ hay cách lưu dữ liệu |
| [`../../kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Ghi chú F2/F3: phần nguồn thu ở màn hình "Quản lý thu", phần ngân sách theo danh mục và nhập nhanh ở màn hình "Quản lý chi", danh sách "Items cần mua" trong ngăn trượt |
| [`../../memory/glossary.md`](../../memory/glossary.md) | Thêm hai nhãn hiển thị màn hình: "Quản lý thu", "Quản lý chi"; ghi chú "Ngân sách & nhập nhanh" là tên cũ đã bỏ; ghi chú danh sách "Items cần mua" nay hiển thị trong ngăn trượt mở từ "Quản lý chi", nhãn và trạng thái Pending/Purchased giữ nguyên |

Memory đã ghi: `DEC-137` trong `decisions.md` chốt định hướng tách màn hình, "Items cần mua" vào ngăn trượt, đánh đổi với M3, ưu tiên và thứ tự triển khai sau US-025. Còn cần ghi: nhận định về ranh giới với yêu cầu bảng điều khiển tùy biến menu vào `judgement-log.md`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Thanh điều hướng bên trái (nhóm "Thu chi"); màn hình "Quản lý thu" (mới); màn hình "Quản lý chi" (mới); ngăn trượt "Items cần mua" (mới); màn hình "Ngân sách & nhập nhanh" (bị bỏ) |
| Thực thể dữ liệu nào bị chạm | Cấu trúc điều hướng (danh sách mục con nhóm "Thu chi"); nếu hệ thống lưu thứ tự và trạng thái ẩn/hiện mục menu thì phần lưu cho mục cũ cần thay bằng phần lưu cho hai mục mới. Nguồn thu, danh mục, khoản chi, item cần mua: không đổi |
| Cần thay đổi cấu trúc dữ liệu | Không — không thêm bảng hay cột mới. Chỉ cần rà và cập nhật dữ liệu tùy chọn menu đã lưu cho mục con cũ (nếu có), việc này do bước lập kế hoạch kỹ thuật và bước dữ liệu quyết định cách xử lý |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không — nội dung và định dạng tập tin xuất giữ nguyên |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Nhóm menu cha giữ tên "Thu chi"; "Quản lý thu" và "Quản lý chi" là hai mục con thay cho mục con "Ngân sách & nhập nhanh"; "Lịch sử thu chi" và "Insight tài chính" giữ nguyên | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-09) | Nếu sai thì cấu trúc menu sau khi làm không đúng ý Dylan |
| A2 | "Quản lý thu" ngoài bảng nguồn thu chỉ bổ sung một khu tổng hợp chỉ xem các danh mục loại "Tích lũy"; phần "kế hoạch chi tiêu dài hạn" chưa dựng màn hình ở lần này | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-09) | Nếu sai thì thiếu hoặc thừa nội dung ở "Quản lý thu" |
| A3 | Địa chỉ trang cũ của mục "Ngân sách & nhập nhanh" khi mở trực tiếp thì đưa tới "Quản lý chi", để không hỏng liên kết đã lưu; địa chỉ hai màn hình mới do bước lập kế hoạch kỹ thuật đặt | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-09 về việc bỏ trang cũ và tách hai trang mới) | Nếu sai thì mở liên kết cũ báo lỗi không tìm thấy trang |
| A4 | Khối "Quy tắc kiểm soát" bốn thẻ và cụm nút "Thêm danh mục", "Reset chi tháng này", "Xuất tập tin dữ liệu", "Xóa toàn bộ dữ liệu" chuyển hết sang "Quản lý chi" | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-09) | Nếu sai thì Dylan không tìm thấy các nút này ở nơi mong đợi |
| A5 | Nút mở danh sách "Items cần mua" đặt ở đầu cột phải và hiển thị số item còn ở trạng thái "Pending" của tháng đang xem | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-09) | Nếu sai thì vị trí nút hoặc con số đếm không đúng ý Dylan |
| A6 | Bộ giao diện dùng chung của ứng dụng có sẵn thành phần ngăn trượt, hoặc dựng được ngăn trượt bằng phần trình bày trong dự án mà không cần thêm thư viện ngoài | Giả định hợp lý | Nếu sai thì bước lập kế hoạch kỹ thuật phải chọn cách dựng ngăn trượt khác, không ảnh hưởng nghiệp vụ |
| A9 | Đưa danh sách "Items cần mua" vào ngăn trượt làm Dylan không còn thấy sẵn cả danh sách khi mở "Quản lý chi" — chỉ thấy số item "Pending" trên nút. Dylan chấp nhận đánh đổi này | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-09; ghi tại `DEC-137`) | Nếu sai thì phải giữ danh sách "Items cần mua" ở dạng hiển thị trực tiếp thay vì ngăn trượt |
| A10 | US-026 được ưu tiên làm ngay, chen trước các khoảng trống nghiệp vụ còn ở dạng yêu cầu thô; phần viết mã bắt đầu sau khi yêu cầu US-025 (bảng điều khiển tùy biến menu) hoàn tất | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-09; ghi tại `DEC-137`) | Nếu sai thì thứ tự giao hàng lệch, hoặc hai yêu cầu xung đột vùng dữ liệu điều hướng khi cùng sửa |
| A7 | Nút mở ngăn trượt và tiêu đề ngăn dùng đúng nhãn hiển thị sẵn có "Items cần mua", và trạng thái từng dòng vẫn hiển thị "Pending" / "Purchased" như hiện nay — spec giữ nguyên các nhãn này, không đổi | Giả định hợp lý (bám nhãn hiện có trong glossary và màn danh sách cần mua) | Nếu Dylan muốn nhân dịp này đổi nhãn sang tiếng Việt ("Chưa mua" / "Đã mua") thì phải mở một yêu cầu đổi nhãn riêng, áp dụng đồng bộ cả màn danh sách cần mua hiện có |
| A8 | Phân quyền giữ nguyên: ứng dụng một người dùng (Dylan), không có vai trò nào bị chặn thêm; phần "không đăng nhập" của mô hình cũ đã được thay bằng đăng nhập theo danh sách email cho phép, nằm ngoài phạm vi US-026 | Đã xác nhận từ knowledge (`decisions.md`) | Nếu sai thì mục 5 mô tả sai mô hình quyền |
