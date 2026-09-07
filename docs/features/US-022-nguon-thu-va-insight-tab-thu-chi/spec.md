# Nguồn thu, sửa insight tiết kiệm, tháng mặc định và bỏ giới hạn tháng cho Item cần mua tại tab Thu chi

Status: Ready for DEV
Feature: US-022
Created: 2026-09-07
Updated: 2026-09-07
Raw Source: `docs/kb/ba/raw/US-022-nguon-thu-va-insight-tab-thu-chi.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.

## 1. Mục Tiêu Nghiệp Vụ

Dylan là người dùng duy nhất của ứng dụng, quản lý thu chi cá nhân trong tab Thu chi. Hiện tab chỉ ghi được phần chi. Phần thu là một con số cố định 35.000.000 đồng gán sẵn cho mọi tháng và không có chỗ nào sửa được. Vì con số này không phải thu nhập thật, nên các ô "Số dư còn lại", "Tỷ lệ sử dụng thu nhập" và "Tiết kiệm / tích lũy" đều hiển thị sai so với tình hình thực tế của Dylan. Ngoài ra tab luôn mở vào tháng cuối cùng có dữ liệu chứ không phải tháng đang diễn ra, và danh sách "Items cần mua" chỉ cho thêm ở tháng hiện tại nên Dylan không ghi trước đồ cần mua cho tháng sau được.

Sau thay đổi này, Dylan tự khai báo các nguồn thu thật của từng tháng (Lương, Freelance, Thưởng…), thấy các chỉ số tiết kiệm được tính đúng và tách bạch, mở tab đúng vào tháng đang quan tâm, và ghi đồ cần mua cho cả các tháng sắp tới.

Giá trị đo được: với một tháng bất kỳ, "Thu nhập tháng", "Số dư còn lại", "Tiết kiệm ròng" và "Tỷ lệ tiết kiệm" hiển thị đúng bằng con số suy ra từ danh sách nguồn thu Dylan tự nhập cho tháng đó — không còn cố định 35.000.000 đồng. Khi mở tab, tháng được chọn sẵn là tháng hiện tại theo lịch, hoặc tháng gần hiện tại nhất khi tháng hiện tại chưa có dữ liệu.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`../../kb/ba/wiki/knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md`](../../kb/ba/wiki/knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Mục tiêu, phạm vi, luồng nghiệp vụ, danh sách rule của function |
| [`../../kb/ba/wiki/knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md`](../../kb/ba/wiki/knowledge/business-rule/BR-033-thu-nhap-thang-tong-nguon-thu.md) | Thu nhập tháng = tổng số tiền tất cả nguồn thu của tháng |
| [`../../kb/ba/wiki/knowledge/business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md`](../../kb/ba/wiki/knowledge/business-rule/BR-034-insight-tiet-kiem-rong-va-phan-bo-tich-luy.md) | Hai chỉ số tiết kiệm tách riêng, bỏ mốc mục tiêu cố định |
| [`../../kb/ba/wiki/knowledge/business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md`](../../kb/ba/wiki/knowledge/business-rule/BR-035-thang-mac-dinh-hien-tai-hoac-gan-nhat.md) | Tháng chọn sẵn khi mở tab |
| [`../../kb/ba/wiki/knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md`](../../kb/ba/wiki/knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md) | Thao tác item cần mua ở tháng hiện tại và tương lai, chặn tháng đã qua |
| [`../../kb/ba/wiki/knowledge/business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md`](../../kb/ba/wiki/knowledge/business-rule/BR-037-thang-moi-bat-dau-rong-nguon-thu.md) | Tháng tạo mới bắt đầu không có nguồn thu nào |
| [`../../kb/ba/wiki/data/entity/ENT-007-nguon-thu.md`](../../kb/ba/wiki/data/entity/ENT-007-nguon-thu.md) | Định nghĩa và ràng buộc của Nguồn thu |
| [`../../kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md`](../../kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md) | Hành vi hiện tại của khu vực "Items cần mua" mà spec này nới điều kiện tháng |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`.

## 3. Phạm Vi

- Thêm một nguồn thu vào tháng đang xem, gồm tên nguồn (bắt buộc) và số tiền (bắt buộc, từ 0 trở lên).
- Sửa tên hoặc số tiền của một nguồn thu đã có, ngay tại dòng đó.
- Xóa một nguồn thu khỏi tháng đang xem.
- Kéo-thả để đổi thứ tự các dòng nguồn thu.
- Thêm, sửa, xóa, sắp xếp nguồn thu chỉ khi tháng đang xem là tháng hiện tại hoặc bất kỳ tháng nào sau tháng hiện tại; giữ bảng nguồn thu ở chế độ chỉ xem khi tháng đang xem đã kết thúc (cùng quy tắc tháng với danh sách "Items cần mua").
- Hiển thị "Thu nhập tháng" bằng tổng số tiền các nguồn thu của tháng, cập nhật ngay mỗi khi danh sách nguồn thu đổi.
- Tính lại "Số dư còn lại", "Tỷ lệ sử dụng thu nhập", "Tiết kiệm ròng", "Tỷ lệ tiết kiệm" theo "Thu nhập tháng" mới.
- Hiển thị hai chỉ số tiết kiệm tách riêng trong khu vực insight: "Tiết kiệm ròng" (Thu nhập tháng trừ Tổng chi thực tế) và "Đã phân bổ vào tích lũy" (tổng Chi thực tế của các danh mục có Loại là "Tích lũy"), kèm "Tỷ lệ tiết kiệm".
- Bỏ khỏi giao diện các câu chữ nhắc mốc mục tiêu cố định (5.000.000đ, 7.500.000đ, 31.500.000đ, 30.000.000đ, 90%) trong khu vực insight và khu vực "Quy tắc kiểm soát".
- Khi mở tab Thu chi, chọn sẵn tháng hiện tại theo lịch; nếu tháng hiện tại chưa có dữ liệu thì chọn tháng có khoảng cách theo số tháng tới tháng hiện tại là nhỏ nhất; nếu hai tháng cách đều thì chọn tháng ở quá khứ.
- Cho phép thêm, sửa, đánh dấu đã mua và xóa item cần mua khi tháng đang xem là tháng hiện tại hoặc bất kỳ tháng nào sau tháng hiện tại; giữ danh sách item ở chế độ chỉ xem khi tháng đang xem đã kết thúc.
- Khi tạo tháng mới (kể cả khi chọn sao chép kế hoạch từ tháng đang xem), danh sách nguồn thu của tháng mới bắt đầu trống.
- Chuyển dữ liệu một lần: mỗi tháng đã tồn tại trước khi tính năng ra mắt được tạo sẵn một nguồn thu tên "Lương" bằng đúng con số thu nhập cũ của tháng đó.

## 4. Ngoài Phạm Vi

- Đổi bố cục tab, dùng bộ giao diện Ant Design, làm responsive cho điện thoại và máy tính bảng — thuộc một yêu cầu riêng về giao diện, hiện ở dạng ghi chú yêu cầu thô, không nằm trong spec này.
- Cho Dylan tự đặt các mốc ngưỡng cảnh báo — thuộc yêu cầu cấu hình ngưỡng ngân sách riêng, không nằm trong spec này.
- Phân loại nguồn thu theo tính chất (thu cố định / thu biến động).
- Thay đổi cách các item còn "chưa mua" tự chuyển sang tháng mới khi tạo tháng — giữ nguyên như hiện nay.

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem nguồn thu của mọi tháng; thêm, sửa, xóa, sắp xếp nguồn thu khi tháng đang xem là tháng hiện tại hoặc tháng tương lai | Thêm/sửa/xóa/sắp xếp nguồn thu khi tháng đang xem đã kết thúc — chỉ được xem | [`../../kb/ba/wiki/knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md`](../../kb/ba/wiki/knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md) |
| Dylan | Thêm, sửa, đánh dấu đã mua, xóa item cần mua khi tháng đang xem là tháng hiện tại hoặc tháng tương lai | Thực hiện các thao tác trên khi tháng đang xem đã kết thúc — chỉ được xem | [`../../kb/ba/wiki/knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md`](../../kb/ba/wiki/knowledge/business-rule/BR-036-item-can-mua-thang-khong-qua-khu.md) |

## 6. Luồng Nghiệp Vụ

1. Dylan mở tab Thu chi. Hệ thống chọn sẵn tháng hiện tại theo lịch; nếu tháng đó chưa có dữ liệu, chọn tháng gần hiện tại nhất.
2. Dylan xem bảng "Nguồn thu" của tháng: mỗi dòng có tên nguồn và số tiền; một dòng tổng hiển thị "Thu nhập tháng".
3. Dylan thêm một nguồn thu mới bằng cách nhập tên nguồn và số tiền rồi xác nhận. Dòng mới xuất hiện ở cuối danh sách. "Thu nhập tháng" và các chỉ số tổng trong khu vực insight cập nhật ngay.
4. Dylan sửa tên hoặc số tiền của một dòng nguồn thu ngay tại chỗ, hoặc kéo-thả để đổi thứ tự, hoặc xóa một dòng. Các chỉ số tổng cập nhật theo.
5. Dylan xem khu vực "Insight tài chính": thấy "Thu nhập tháng", "Tổng chi", "Tiết kiệm ròng" kèm "Tỷ lệ tiết kiệm", "Đã phân bổ vào tích lũy" và các chỉ số chi khác — tất cả tính trên "Thu nhập tháng" thật, không kèm câu chữ mục tiêu cố định.
6. Dylan chuyển sang một tháng sau tháng hiện tại và thêm vài nguồn thu và item cần mua cho tháng đó. Khi Dylan mở một tháng đã kết thúc, cả bảng "Nguồn thu" lẫn danh sách item của tháng đó chỉ để xem.
7. Dylan tạo một tháng ngân sách mới. Bảng "Nguồn thu" của tháng mới trống; Dylan tự thêm các nguồn thu.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Tháng chưa có nguồn thu nào: bảng "Nguồn thu" trống, "Thu nhập tháng" hiển thị 0đ, "Tỷ lệ tiết kiệm" hiển thị dấu gạch ngang. Chưa có tháng ngân sách nào: màn hình ở trạng thái trống như hiện tại. |
| Không đủ quyền | Không áp dụng — Dylan là người dùng duy nhất và có toàn quyền. Với tháng đã kết thúc, cả bảng "Nguồn thu" lẫn danh sách "Items cần mua" chỉ hiển thị để xem: không có nút thêm, ô nhập không sửa được, không có nút xóa/đánh dấu đã mua. |
| Dữ liệu trùng | Hai nguồn thu cùng tên trong một tháng vẫn được lưu bình thường (ví dụ hai dòng "Thưởng"); "Thu nhập tháng" cộng cả hai. |
| Hệ thống lỗi | Khi lưu một nguồn thu hoặc một thao tác item cần mua không thành công, hệ thống hiện một thông báo ngắn "Có lỗi xảy ra, vui lòng thử lại." và giữ nguyên giá trị trước đó trên màn hình. |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Dylan đang xem tháng "2026-09" có 2 nguồn thu tổng 30.000.000đ và bảng "Nguồn thu" đang hiển thị | Dylan nhập tên "Thưởng dự án" và số tiền 5.000.000, bấm "Thêm nguồn thu" | Một dòng "Thưởng dự án — 5.000.000đ" xuất hiện ở cuối bảng; dòng tổng "Thu nhập tháng" đổi thành 35.000.000đ; ô "Thu nhập tháng" trong khu vực insight cũng hiển thị 35.000.000đ | Xem ASCII Mockup mục 8.1 |
| AC-02 | Dylan đang xem tháng "2026-09" có nguồn thu "Lương" 25.000.000đ, "Thu nhập tháng" là 25.000.000đ, "Tổng chi" là 20.000.000đ | Dylan sửa số tiền dòng "Lương" thành 28.000.000 và rời khỏi ô nhập | Dòng tổng "Thu nhập tháng" đổi thành 28.000.000đ; ô "Số dư còn lại" đổi thành 8.000.000đ; ô "Tiết kiệm ròng" đổi thành 8.000.000đ | Xem ASCII Mockup mục 8.1 |
| AC-03 | Dylan đang xem tháng "2026-09" chỉ còn 1 nguồn thu "Lương" 25.000.000đ | Dylan xóa dòng "Lương" | Bảng "Nguồn thu" trống; dòng tổng "Thu nhập tháng" hiển thị 0đ; ô "Tỷ lệ tiết kiệm" hiển thị dấu gạch ngang thay cho phần trăm | Xem ASCII Mockup mục 8.1 |
| AC-04 | Dylan đang xem tháng "2026-09" có "Thu nhập tháng" 20.000.000đ và "Tổng chi" 23.000.000đ | Dylan mở khu vực "Insight tài chính" | Ô "Tiết kiệm ròng" hiển thị số âm 3.000.000đ (ví dụ "-3.000.000đ" hoặc "Vượt thu nhập 3.000.000đ"); ô "Số dư còn lại" cũng hiển thị -3.000.000đ; ô "Tỷ lệ tiết kiệm" hiển thị -15,0%; ô "Tỷ lệ sử dụng thu nhập" hiển thị 115,0%; không có câu chữ nào nhắc mốc mục tiêu 30.000.000đ hay 90% | Xem ASCII Mockup mục 8.2 |
| AC-05 | Dylan đang xem tháng "2026-09"; các danh mục Loại "Tích lũy" có tổng Chi thực tế 6.000.000đ, các danh mục khác không thuộc Loại "Tích lũy" có phát sinh chi | Dylan mở khu vực "Insight tài chính" | Ô "Đã phân bổ vào tích lũy" hiển thị 6.000.000đ — đúng bằng tổng Chi thực tế của riêng các danh mục Loại "Tích lũy", không phụ thuộc tên danh mục | Xem ASCII Mockup mục 8.2 |
| AC-06 | Hôm nay theo lịch là tháng "2026-09"; dữ liệu có các tháng "2026-06", "2026-07" và "2026-11" nhưng chưa có tháng "2026-09" | Dylan mở tab Thu chi | Ô "Chọn tháng xem" hiển thị sẵn "2026-07" và nội dung tab hiển thị dữ liệu tháng "2026-07". Lý do: "2026-07" cách tháng hiện tại 2 tháng, "2026-11" cũng cách 2 tháng, "2026-06" cách 3 tháng; khi hai tháng "2026-07" và "2026-11" cách đều thì chọn tháng ở quá khứ | Xem ASCII Mockup mục 8.3 |
| AC-07 | Hôm nay theo lịch là tháng "2026-09"; dữ liệu có tháng "2026-11" (tương lai) và tháng "2026-06" (đã kết thúc) | Dylan chọn xem tháng "2026-11", thêm một item "Bàn phím" giá 1.200.000; sau đó Dylan chọn xem tháng "2026-06" | Ở tháng "2026-11": item "Bàn phím" được thêm vào danh sách, có ô nhập và nút thao tác. Ở tháng "2026-06": danh sách item hiển thị nhưng không có nút thêm, ô tên/giá không sửa được, không có nút đánh dấu đã mua hay nút xóa | Xem ASCII Mockup mục 8.4 |
| AC-08 | Dylan đang xem một tháng có nhiều nguồn thu | Dylan tạo một tháng ngân sách mới bằng nút "Clone tháng đang xem" và chuyển sang xem tháng vừa tạo | Bảng "Nguồn thu" của tháng mới trống; dòng tổng "Thu nhập tháng" hiển thị 0đ; khu vực "Quy tắc kiểm soát" và khu vực insight không hiển thị câu chữ nào nêu mốc 7.500.000đ hay 31.500.000đ | Xem ASCII Mockup mục 8.1 |
| AC-09 | Tháng "2026-05" đã tồn tại từ trước khi tính năng nguồn thu ra mắt, có "Thu nhập tháng" cố định 35.000.000đ và chưa có dòng nguồn thu nào | Việc chuyển dữ liệu một lần được chạy khi tính năng ra mắt | Tháng "2026-05" có đúng một dòng nguồn thu tên "Lương" số tiền 35.000.000đ; dòng tổng "Thu nhập tháng" vẫn hiển thị 35.000.000đ; "Số dư còn lại", "Tiết kiệm ròng" và "Tỷ lệ tiết kiệm" của tháng giữ nguyên như trước khi chuyển | Xem ASCII Mockup mục 8.1 |
| AC-10 | Dylan đang xem tháng "2026-09" có 3 nguồn thu theo thứ tự "Lương", "Freelance", "Thưởng"; "Thu nhập tháng" là 33.000.000đ | Dylan kéo dòng "Thưởng" lên vị trí đầu tiên rồi thả | Thứ tự hiển thị đổi thành "Thưởng", "Lương", "Freelance"; dòng tổng "Thu nhập tháng" vẫn là 33.000.000đ; sau khi rời tab và mở lại tháng "2026-09", thứ tự vẫn là "Thưởng", "Lương", "Freelance" | Xem ASCII Mockup mục 8.1 |
| AC-11 | Dylan đang xem tháng "2026-09" đã có một nguồn thu tên "Thưởng" số tiền 2.000.000đ; "Thu nhập tháng" là 2.000.000đ | Dylan nhập tên "Thưởng" và số tiền 3.000.000, bấm "Thêm nguồn thu" | Bảng "Nguồn thu" hiển thị hai dòng "Thưởng" riêng biệt (một 2.000.000đ, một 3.000.000đ); dòng tổng "Thu nhập tháng" đổi thành 5.000.000đ | Xem ASCII Mockup mục 8.1 |
| AC-12 | Dylan đang xem tháng "2026-09", đã nhập tên "Thưởng" và số tiền 1.000.000 vào ô thêm nguồn thu; bảng đang có "Thu nhập tháng" 30.000.000đ | Dylan bấm "Thêm nguồn thu" nhưng thao tác lưu không thành công | Màn hình hiện thông báo ngắn "Có lỗi xảy ra, vui lòng thử lại."; bảng "Nguồn thu" không có dòng mới và dòng tổng "Thu nhập tháng" vẫn là 30.000.000đ | Xem ASCII Mockup mục 8.1 |
| AC-13 | Hôm nay theo lịch là tháng "2026-09"; dữ liệu có tháng "2026-06" (đã kết thúc) với 2 nguồn thu "Lương" 25.000.000đ và "Freelance" 4.000.000đ | Dylan chọn xem tháng "2026-06" | Bảng "Nguồn thu" hiển thị đúng hai dòng "Lương" 25.000.000đ và "Freelance" 4.000.000đ; không có ô "Thêm nguồn thu"; bấm vào ô tên hoặc ô số tiền của một dòng không cho gõ sửa; không có nút xóa ở cuối dòng; kéo một dòng không làm đổi vị trí | Xem ASCII Mockup mục 8.1 |

Quy tắc: mọi ngoại lệ ở mục 6 có ít nhất một tiêu chí tương ứng — "Không có dữ liệu" qua AC-03, "Không đủ quyền" (item cần mua ở tháng đã kết thúc) qua AC-07 và (nguồn thu ở tháng đã kết thúc) qua AC-13, "Dữ liệu trùng" qua AC-11, "Hệ thống lỗi" qua AC-12; AC-04 phủ thêm trường hợp chi vượt thu nhập.

## 8. Screen Element

### 8.1. Tab Thu chi — khu vực Nguồn thu — `/budget`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Bảng nguồn thu | Table | Nguồn thu | Danh sách nguồn thu của tháng đang xem | Sắp xếp mặc định theo thứ tự Dylan đã kéo-thả; kéo-thả một dòng để đổi thứ tự; thứ tự được giữ lại sau khi rời và mở lại tab. Ở tháng đã kết thúc: hiển thị chỉ xem — không ô thêm, không sửa được ô, không nút xóa, không kéo-thả | Dylan | AC-01, AC-02, AC-03, AC-08, AC-09, AC-10, AC-11, AC-12, AC-13 | Không |
| EL-02 | Cột tên nguồn | Column | Tên nguồn | Tên của từng nguồn thu | Cột thứ nhất; sửa trực tiếp tại ô; để trống thì không lưu, khôi phục tên cũ | Dylan | AC-01, AC-02 | Không |
| EL-03 | Cột số tiền | Column | Số tiền | Số tiền của từng nguồn thu | Cột thứ hai; sửa trực tiếp tại ô; nhận số nguyên đồng từ 0 trở lên, không nhận số âm; nhập không hợp lệ thì không lưu, khôi phục giá trị cũ | Dylan | AC-01, AC-02 | Không |
| EL-04 | Cột hành động | Column | (không nhãn) | — | Cột thứ ba; chứa nút xóa cho từng dòng; ẩn khi tháng đang xem đã kết thúc | Dylan | AC-03, AC-13 | Không |
| EL-05 | Ô nhập tên nguồn mới | Input | Tên nguồn | — | Bắt buộc; rỗng thì nút "Thêm nguồn thu" không bấm được; cho phép trùng tên với nguồn thu đã có trong tháng; cả khu vực thêm ẩn khi tháng đang xem đã kết thúc | Dylan | AC-01, AC-11, AC-13 | Không |
| EL-06 | Ô nhập số tiền mới | Input | Số tiền | — | Bắt buộc; nhận số nguyên đồng từ 0 trở lên, không nhận số âm; rỗng hoặc số âm thì nút "Thêm nguồn thu" không bấm được | Dylan | AC-01 | Không |
| EL-07 | Nút thêm nguồn thu | Button | Thêm nguồn thu | — | Bật khi tên không rỗng và số tiền là số từ 0 trở lên; bấm thì thêm một dòng vào cuối bảng và cập nhật "Thu nhập tháng"; nếu lưu không thành công thì hiện EL-21 và không thêm dòng; ẩn khi tháng đang xem đã kết thúc | Dylan | AC-01, AC-11, AC-12, AC-13 | Không |
| EL-08 | Nút xóa nguồn thu | Button | (biểu tượng thùng rác) | — | Mỗi dòng một nút; bấm thì xóa dòng đó và cập nhật "Thu nhập tháng"; ẩn khi tháng đang xem đã kết thúc | Dylan | AC-03, AC-13 | Không |
| EL-09 | Dòng tổng thu nhập tháng | Badge | Thu nhập tháng | Tổng số tiền các nguồn thu của tháng | Chỉ đọc; đổi ngay khi danh sách nguồn thu đổi; hiển thị 0đ khi không có nguồn thu | Dylan | AC-01, AC-02, AC-03, AC-08, AC-09, AC-11, AC-12 | Không |
| EL-21 | Thông báo lỗi thao tác | Toast | Có lỗi xảy ra, vui lòng thử lại. | — | Hiện khi lưu một nguồn thu hoặc một thao tác item cần mua không thành công; tự ẩn sau vài giây; mọi giá trị trên màn hình giữ nguyên như trước thao tác | Dylan | AC-12 | Không |

**ASCII Mockup**

```text
+--------------------------------------------------------------+
| Nguồn thu                                                    |
+------------------------+------------------+------------------+
| Tên nguồn              | Số tiền          |                  |
+------------------------+------------------+------------------+
| Lương                  | 25.000.000       |   [xóa]          |
| Freelance              | 5.000.000        |   [xóa]          |
+------------------------+------------------+------------------+
| [ Tên nguồn...]  [ Số tiền...]        [ + Thêm nguồn thu ]   |
+--------------------------------------------------------------+
| Thu nhập tháng: 30.000.000đ                                  |
+--------------------------------------------------------------+
```

### 8.2. Tab Thu chi — khu vực Insight tài chính — `/budget`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-10 | Ô Thu nhập tháng | Badge | Thu nhập tháng | Tổng các nguồn thu của tháng | Chỉ đọc | Dylan | AC-01 | Không |
| EL-11 | Ô Tiết kiệm ròng | Badge | Tiết kiệm ròng | Thu nhập tháng trừ Tổng chi thực tế | Chỉ đọc; hiển thị số âm rõ ràng khi chi vượt thu; cùng công thức với "Số dư còn lại" (EL-23, xem mục 14 A6) | Dylan | AC-02, AC-04 | Không |
| EL-12 | Ô Tỷ lệ tiết kiệm | Badge | Tỷ lệ tiết kiệm | Tiết kiệm ròng chia Thu nhập tháng | Chỉ đọc; hiển thị dấu gạch ngang khi Thu nhập tháng bằng 0; hiển thị phần trăm âm khi Tiết kiệm ròng âm | Dylan | AC-03, AC-04 | Không |
| EL-13 | Ô Đã phân bổ vào tích lũy | Badge | Đã phân bổ vào tích lũy | Tổng Chi thực tế của các danh mục Loại "Tích lũy" | Chỉ đọc; xác định theo Loại danh mục, không theo tên | Dylan | AC-05 | [`US-016`](../US-016-loai-chi-tieu-combobox/spec.md) — dùng trường Loại của danh mục |
| EL-14 | Khu vực Quy tắc kiểm soát | Table | Quy tắc kiểm soát | — | Đổi hành vi so với hiện tại: bỏ các dòng nêu mốc cố định 5.000.000đ / 7.500.000đ / 31.500.000đ / 30.000.000đ / 90%; giữ lại nội dung không nêu con số cứng, hoặc ẩn khu vực nếu không còn dòng nào | Dylan | AC-04, AC-08 | Không |
| EL-15 | Câu chú thích mốc mục tiêu ở insight | Badge | (văn bản chú thích) | — | Đổi hành vi so với hiện tại: bỏ các câu như "Mục tiêu nên giữ quanh 7.5M" và "Cảnh báo: đã dùng hơn 90% thu nhập" | Dylan | AC-04 | Không |
| EL-22 | Ô Tổng chi | Badge | Tổng chi | Tổng Chi thực tế của mọi danh mục trong tháng | Chỉ đọc; không phụ thuộc Thu nhập tháng | Dylan | AC-02, AC-04 | Không |
| EL-23 | Ô Số dư còn lại | Badge | Số dư còn lại | Thu nhập tháng trừ Tổng chi thực tế | Chỉ đọc; hiển thị số âm rõ ràng khi chi vượt thu; cùng công thức với "Tiết kiệm ròng" (EL-11, xem mục 14 A6) | Dylan | AC-02, AC-04 | Không |
| EL-24 | Ô Tỷ lệ sử dụng thu nhập | Badge | Tỷ lệ sử dụng thu nhập | Tổng chi thực tế chia Thu nhập tháng | Chỉ đọc; hiển thị dấu gạch ngang khi Thu nhập tháng bằng 0 | Dylan | AC-04 | Không |

**ASCII Mockup**

```text
+----------------------+----------------------+------------------------+
| Thu nhập tháng       | Tổng chi             | Số dư còn lại          |
| 20.000.000đ          | 23.000.000đ          | -3.000.000đ            |
+----------------------+----------------------+------------------------+
| Tiết kiệm ròng       | Tỷ lệ tiết kiệm      | Tỷ lệ sử dụng thu nhập |
| -3.000.000đ          | -15,0%               | 115,0%                 |
+----------------------+----------------------+------------------------+
| Đã phân bổ vào tích lũy: 6.000.000đ                                 |
+--------------------------------------------------------------------+
| Quy tắc kiểm soát: (không còn dòng nêu mốc tiền cố định)            |
+--------------------------------------------------------------------+
```

### 8.3. Tab Thu chi — ô chọn tháng xem — `/budget`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-16 | Ô chọn tháng xem | Dropdown | Chọn tháng xem | Danh sách các tháng đã có dữ liệu | Tập giá trị: các tháng đã có dữ liệu. Giá trị chọn sẵn khi tab vừa mở: tháng hiện tại theo lịch nếu có dữ liệu, nếu không thì tháng có khoảng cách số tháng tới tháng hiện tại nhỏ nhất; hai tháng cách đều thì chọn tháng ở quá khứ. Không có tháng nào thì không chọn gì | Dylan | AC-06 | [`US-015`](../US-015-quick-view-thang-lien-ke/spec.md) — cùng ô "Chọn tháng xem"; US-022 chỉ đổi giá trị chọn sẵn khi tab vừa mở, không đổi tập giá trị hay cách bấm chọn |

**ASCII Mockup**

```text
+--------------------------------------------------+
| Chọn tháng xem:  [ 2026-07  v ]                  |
|   (hôm nay 2026-09, chưa có tháng 2026-09,       |
|    2026-07 gần nhất trong quá khứ)               |
+--------------------------------------------------+
```

### 8.4. Tab Thu chi — khu vực Items cần mua — `/budget`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-17 | Khu vực nhập item cần mua | Input | Tên sản phẩm, Giá | — | Đổi hành vi so với hiện tại: hiển thị và cho nhập khi tháng đang xem là tháng hiện tại **hoặc tháng sau tháng hiện tại**; ẩn khi tháng đang xem đã kết thúc | Dylan | AC-07 | [`US-019`](../US-019-danh-sach-can-mua/spec.md) — khu vực "Items cần mua", điều kiện tháng đổi từ `BR-024` sang `BR-036` |
| EL-18 | Bảng item cần mua | Table | Items cần mua | Danh sách item của tháng đang xem | Cột theo thứ tự: Tên sản phẩm, Giá, Trạng thái, Hành động. Cột "Hành động" và các ô sửa được chỉ hiển thị khi tháng đang xem không ở quá khứ | Dylan | AC-07 | [`US-019`](../US-019-danh-sach-can-mua/spec.md) — cùng bảng, điều kiện tháng đổi |
| EL-19 | Nút đánh dấu đã mua | Button | (biểu tượng đã mua) | — | Đổi hành vi so với hiện tại: bật khi tháng đang xem là tháng hiện tại hoặc tương lai; ẩn khi tháng đã kết thúc | Dylan | AC-07 | [`US-019`](../US-019-danh-sach-can-mua/spec.md) |
| EL-20 | Nút xóa item | Button | (biểu tượng thùng rác) | — | Đổi hành vi so với hiện tại: hiển thị khi tháng đang xem là tháng hiện tại hoặc tương lai; ẩn khi tháng đã kết thúc | Dylan | AC-07 | [`US-019`](../US-019-danh-sach-can-mua/spec.md) |

**ASCII Mockup**

```text
+-----------------------------------------------------------+
| Items cần mua  (tháng 2026-11 — tương lai, cho nhập)      |
+-------------------+----------+-------------+--------------+
| Tên sản phẩm      | Giá      | Trạng thái  | Hành động    |
+-------------------+----------+-------------+--------------+
| Bàn phím          | 1.200.000| Pending     | [đã mua][xóa]|
+-------------------+----------+-------------+--------------+
| [ Tên sản phẩm...] [ Giá...]        [ + Thêm item ]      |
+---------------------------------------------------------+

+---------------------------------------------------------+
| Items cần mua  (tháng 2026-06 — đã kết thúc, chỉ xem)   |
+-------------------+----------+-------------+
| Tên sản phẩm      | Giá      | Trạng thái  |
+-------------------+----------+-------------+
| Sạc dự phòng      | 500.000  | Purchased   |
+-------------------+----------+-------------+
```

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Nguồn thu | Thêm | Có | Thực thể mới, gắn theo tháng ngân sách; lưu bền vững cùng nơi với các dữ liệu thu chi khác |
| Tháng ngân sách | Sửa | Có | "Thu nhập tháng" chuyển từ một con số cố định sang con số suy ra từ tổng nguồn thu |
| Item cần mua | Không đổi | Không | Chỉ nới điều kiện tháng được thao tác, cấu trúc dữ liệu không đổi |
| Sơ đồ dữ liệu (DBML) | Sửa | Có | Cần bổ sung thực thể "Nguồn thu" vào sơ đồ |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`../US-006-canh-bao-trung-thang/spec.md`](../US-006-canh-bao-trung-thang/spec.md) | Thứ tự | Không | Ready for DEV (đã Implemented) |
| [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) | Quy tắc nghiệp vụ | Không | Ready for DEV (đã Implemented) |
| [`../US-016-loai-chi-tieu-combobox/spec.md`](../US-016-loai-chi-tieu-combobox/spec.md) | Dữ liệu | Không | Ready for DEV (đã Implemented) |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`../US-019-danh-sach-can-mua/spec.md`](../US-019-danh-sach-can-mua/spec.md) | Mục 3, mục 5, mục 6 (điều kiện tháng được thao tác item cần mua) | Khu vực "Items cần mua", nút thêm/sửa/xóa/đánh dấu đã mua | Không | Khi spec US-022 đạt `Ready for DEV`, cập nhật wiki feature US-019 và các trang liên quan để phản ánh `BR-036` thay `BR-024`; không viết lại spec US-019 |
| [`../US-007-phan-tich-xu-huong-lich-su/spec.md`](../US-007-phan-tich-xu-huong-lich-su/spec.md) | Không có mục cụ thể | Không | Không | Chỉ chung khu vực phân tích; con số nền tảng "Thu nhập tháng" nay chính xác hơn, có lợi cho US-007 |
| [`../US-015-quick-view-thang-lien-ke/spec.md`](../US-015-quick-view-thang-lien-ke/spec.md) | Mục 6 bước 1 (tháng đang xem "mặc định") | Ô "Chọn tháng xem" — giá trị chọn sẵn khi mở tab | Không | Bước 1 luồng US-015 nói "mặc định" nhưng không định nghĩa; nay `BR-035` định nghĩa rõ. Khi US-022 đạt `Ready for DEV`, cập nhật wiki US-015 để trỏ tới `BR-035`; không viết lại spec US-015 |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`../../kb/ba/wiki/knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md`](../../kb/ba/wiki/knowledge/feature/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Nạp lại từ spec này sau khi đạt `Ready for DEV` |
| [`../../kb/ba/wiki/delivery/pbi/US-022-nguon-thu-va-insight-tab-thu-chi.md`](../../kb/ba/wiki/delivery/pbi/US-022-nguon-thu-va-insight-tab-thu-chi.md) | Điền User Story và bảng tiêu chí chấp nhận từ mục 1 và mục 7 |
| [`../../kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md`](../../kb/ba/wiki/knowledge/feature/US-019-danh-sach-can-mua.md) | Cập nhật điều kiện tháng được thao tác item cần mua |

Memory cần ghi: các quyết định của lần làm rõ này đã ghi vào `decisions.md`; nhận định rút ra ghi vào `judgement-log.md`; thuật ngữ mới đã ghi vào `glossary.md`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Tab Thu chi (`/budget`): khu vực Nguồn thu (mới), khu vực Insight tài chính, khu vực Quy tắc kiểm soát, ô chọn tháng xem, khu vực Items cần mua |
| Thực thể dữ liệu nào bị chạm | Nguồn thu (mới), Tháng ngân sách (đổi cách tính thu nhập), Item cần mua (đổi điều kiện tháng thao tác) |
| Cần thay đổi cấu trúc dữ liệu | Có |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Có |
| Có ảnh hưởng báo cáo/export | Không trực tiếp; con số "Thu nhập tháng" trong dữ liệu xuất ra sẽ phản ánh tổng nguồn thu thật thay vì con số cố định |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Khi hai tháng cách đều tháng hiện tại, ưu tiên chọn tháng ở quá khứ | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-07) | Tháng chọn sẵn khác kỳ vọng khi Dylan có dữ liệu cả hai phía |
| A2 | Khi "Thu nhập tháng" bằng 0, "Tỷ lệ tiết kiệm" hiển thị dấu gạch ngang thay cho phần trăm | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-07) | Hiển thị một con số vô nghĩa hoặc lỗi chia cho 0 |
| A3 | Các tháng đã tồn tại được tạo sẵn một nguồn thu "Lương" bằng con số thu nhập cũ; chỉ tháng tạo mới sau khi tính năng ra mắt mới bắt đầu trống | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-07) | Các chỉ số của tháng lịch sử về 0 sai lệch, hoặc tháng mới có sẵn nguồn thu không mong muốn |
| A4 | Nguồn thu chỉ thêm/sửa/xóa/sắp xếp được khi tháng đang xem là tháng hiện tại hoặc tháng tương lai; tháng đã kết thúc chỉ xem — cùng quy tắc tháng với "Items cần mua" | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-07) | Nếu áp sai, Dylan sửa nhầm nguồn thu của tháng lịch sử và làm lệch số liệu dùng cho biểu đồ xu hướng |
| A5 | Số tiền của một nguồn thu là số nguyên đồng từ 0 trở lên; ô nhập không nhận số âm (được nhận số 0 để tạo dòng nháp) | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-07) | Nếu cho số âm, Dylan có thể vô tình làm âm Thu nhập tháng; nếu chặn cả số 0 thì không tạo được dòng nháp |
| A6 | Khu vực insight giữ đồng thời hai ô "Số dư còn lại" và "Tiết kiệm ròng" dù cùng một công thức (Thu nhập tháng trừ Tổng chi thực tế) | Đã xác nhận từ knowledge (user xác nhận qua dialog ngày 2026-09-07 — chọn "Giữ cả hai ô") | Nếu sau này chốt gộp về một nhãn, cần bỏ một ô khỏi mục 8.2 và các AC tham chiếu |
