# Ràng buộc toàn vẹn danh mục + giao dịch không danh mục

Status: Ready for DEV
Feature: US-005
Created: 2026-08-06
Updated: 2026-08-06
Raw Source: `docs/kb/ba/raw/US-005-rang-buoc-toan-ven-danh-muc.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, xóa một danh mục đang có giao dịch không hoạt động đúng — hệ thống không xử lý được thao tác này và không cho Dylan biết chuyện gì đã xảy ra với những giao dịch của danh mục đó. Đồng thời, khi ghi nhận chi tiêu, Dylan luôn phải để một danh mục nào đó được chọn sẵn, kể cả khi nội dung gõ vào không thật sự khớp danh mục nào.

Sau thay đổi này, xóa một danh mục thường luôn thành công: nếu danh mục đó đang có giao dịch, toàn bộ giao dịch tự động chuyển sang một danh mục dự phòng tên "Chi tiêu khác", kèm thông báo rõ ràng cho Dylan biết đã chuyển bao nhiêu giao dịch. Khi ghi nhận chi tiêu mà nội dung không khớp danh mục nào, Dylan có thể ghi nhận ngay mà không bắt buộc chọn danh mục — giao dịch đó cũng tự vào "Chi tiêu khác". "Chi tiêu khác" luôn ở chế độ chỉ xem, chỉ xuất hiện trên bảng khi đang có giao dịch.

Giá trị đo được: Dylan xóa một danh mục đang có 3 giao dịch — thao tác xóa thành công, toast báo "Đã xóa 'X'. 3 giao dịch đã chuyển sang Chi tiêu khác.", và cả 3 giao dịch đó vẫn xem lại được đầy đủ dưới danh mục "Chi tiêu khác" — không giao dịch nào biến mất hay mất liên kết danh mục.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md`](../../kb/ba/wiki/knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md) | Mục tiêu, phạm vi, 5 business rule, luồng nghiệp vụ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-008-xoa-chuyen-chi-tieu-khac.md`](../../kb/ba/wiki/knowledge/business-rule/BR-008-xoa-chuyen-chi-tieu-khac.md) | Xóa danh mục thường chuyển giao dịch sang "Chi tiêu khác" |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md`](../../kb/ba/wiki/knowledge/business-rule/BR-009-chi-tieu-khac-tu-sinh.md) | "Chi tiêu khác" chỉ tự sinh khi cần |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md`](../../kb/ba/wiki/knowledge/business-rule/BR-010-chi-tieu-khac-khoa-vinh-vien.md) | "Chi tiêu khác" khóa vĩnh viễn, chỉ xem |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-011-bo-qua-danh-muc.md`](../../kb/ba/wiki/knowledge/business-rule/BR-011-bo-qua-danh-muc.md) | Ghi nhận cho phép bỏ qua chọn danh mục |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-012-an-khi-het-giao-dich.md`](../../kb/ba/wiki/knowledge/business-rule/BR-012-an-khi-het-giao-dich.md) | "Chi tiêu khác" ẩn khỏi giao diện khi hết giao dịch |
| [`docs/kb/ba/wiki/data/entity/ENT-002-danh-muc.md`](../../kb/ba/wiki/data/entity/ENT-002-danh-muc.md) | Ràng buộc của thực thể Danh mục |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, luồng F1-F2, gap #5 |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`.

## 3. Phạm Vi

- Xóa một danh mục thường (không khóa) đang có giao dịch → toàn bộ giao dịch của nó chuyển sang "Chi tiêu khác" (tự sinh nếu tháng đang chọn chưa có), rồi danh mục gốc bị xóa
- Xóa một danh mục thường không có giao dịch nào → xóa bình thường, không phát sinh "Chi tiêu khác"
- Sau khi xóa danh mục thành công, hiện thông báo: nêu rõ số giao dịch đã chuyển sang "Chi tiêu khác" nếu có; chỉ báo đã xóa nếu không có giao dịch nào
- Ghi nhận chi tiêu: khi nội dung gõ vào không khớp từ khóa của danh mục nào, ô chọn danh mục tự động để trống (không tự chọn sẵn một danh mục có sẵn); Dylan bấm "Ghi nhận" được ngay ở trạng thái này mà không cần chọn danh mục hay xác nhận gì thêm — giao dịch tự vào "Chi tiêu khác" (tự sinh nếu tháng chưa có)
- "Chi tiêu khác": khóa vĩnh viễn, hiển thị chỉ đọc trên bảng ngân sách (không ô nhập tên/loại/ngân sách, không nút xóa); chỉ xuất hiện trên bảng khi đang có ít nhất một giao dịch; ẩn khỏi bảng khi hết giao dịch (bản ghi vẫn giữ nguyên, không bị xóa)
- "Chi tiêu khác" khi tự sinh có Loại "Linh hoạt", Ngân sách khởi tạo 0đ

## 4. Ngoài Phạm Vi

- Chặn trùng tên danh mục — thuộc requirement riêng khác, gọi bằng mã US (viết tắt của "User Story", cách đặt mã function của dự án) là `US-010`
- Cấu hình ngưỡng cảnh báo/mục tiêu chi — thuộc `US-009`
- Sửa/xóa từng giao dịch riêng lẻ, và mọi hành vi ghi nhận/sửa/xóa giao dịch ngoài phần liên quan tới danh mục — đã triển khai ở `US-004`, dùng đúng cơ chế liên kết theo mã nhận diện của `US-003`; không đổi ở phạm vi requirement này

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem, tạo, sửa, xóa danh mục thường; ghi nhận chi tiêu không chọn danh mục | Sửa tên/loại/ngân sách hoặc xóa "Chi tiêu khác" — khóa vĩnh viễn | `docs/memory/decisions.md#dec-027` |

## 6. Luồng Nghiệp Vụ

1. Dylan bấm nút xóa trên một danh mục thường (không khóa) đang có giao dịch — toàn bộ giao dịch của danh mục đó chuyển sang "Chi tiêu khác" (tự sinh nếu tháng đang chọn chưa có danh mục này); danh mục gốc biến mất khỏi bảng; toast hiện tên danh mục vừa xóa kèm số giao dịch đã chuyển, ví dụ "Đã xóa 'Giải trí / cafe'. 3 giao dịch đã chuyển sang Chi tiêu khác."
2. Dylan bấm nút xóa trên một danh mục thường không có giao dịch nào — danh mục biến mất khỏi bảng ngay; toast chỉ hiện tên danh mục vừa xóa, ví dụ "Đã xóa 'Dự phòng'."
3. Dylan gõ nội dung vào ô nhập nhanh mà không khớp từ khóa danh mục nào — ô chọn danh mục tự để trống; Dylan bấm "Ghi nhận" — giao dịch được lưu, tự gắn vào "Chi tiêu khác" (tự sinh nếu tháng chưa có).
4. Dylan xem bảng ngân sách theo danh mục — nếu "Chi tiêu khác" đang có giao dịch, dòng của nó hiển thị chỉ đọc (không có ô nhập tên/loại/ngân sách, không có nút xóa).
5. Giao dịch cuối cùng của "Chi tiêu khác" bị chuyển sang danh mục khác hoặc bị xóa (qua sửa/xóa giao dịch) — dòng "Chi tiêu khác" biến mất khỏi bảng ngân sách; bản ghi danh mục vẫn giữ nguyên trong dữ liệu.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Tháng đang chọn chưa có danh mục nào ngoài danh mục mặc định — bảng ngân sách không có dòng "Chi tiêu khác" nào |
| Không đủ quyền | Không áp dụng — hệ thống chỉ có một người dùng |
| Dữ liệu trùng | Xóa lần lượt nhiều danh mục có giao dịch trong cùng một tháng — tất cả đều gộp vào cùng một "Chi tiêu khác" duy nhất, không tạo nhiều bản ghi "Chi tiêu khác" khác nhau |
| Hệ thống lỗi | Bấm nút xóa trên danh mục bị khóa ("Tiền nhà", "Chi phí cố định khác", "Chi tiêu khác") — không xảy ra vì các danh mục này không hiển thị nút xóa |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Danh mục thường "Giải trí / cafe" của tháng đang chọn đang có 3 giao dịch, tháng đó chưa có danh mục "Chi tiêu khác" | Dylan bấm nút xóa trên danh mục "Giải trí / cafe" | Danh mục "Giải trí / cafe" biến mất khỏi bảng ngân sách; một dòng "Chi tiêu khác" mới xuất hiện với Loại "Linh hoạt", Ngân sách 0 đ, "Chi thực tế" bằng đúng tổng 3 giao dịch đó; toast hiện "Đã xóa 'Giải trí / cafe'. 3 giao dịch đã chuyển sang Chi tiêu khác."; đúng 3 giao dịch đó xuất hiện ở bảng chi tiết chi tiêu, mỗi giao dịch gắn nhãn danh mục "Chi tiêu khác" | Xem ASCII Mockup mục 8.2 |
| AC-02 | Danh mục thường "Dự phòng" của tháng đang chọn chưa có giao dịch nào | Dylan bấm nút xóa trên danh mục "Dự phòng" | Danh mục "Dự phòng" biến mất khỏi bảng ngân sách ngay; toast hiện "Đã xóa 'Dự phòng'."; không có dòng "Chi tiêu khác" nào xuất hiện thêm | Xem ASCII Mockup mục 8.2 |
| AC-03 | Tháng đang chọn chưa có danh mục "Chi tiêu khác"; Dylan gõ "sửa xe máy 200k" vào ô nhập nhanh — nội dung không khớp từ khóa của danh mục nào hiện có | Dylan xem ô chọn danh mục, rồi bấm "Ghi nhận" mà không chọn danh mục nào | Ô chọn danh mục tự hiển thị trạng thái trống, không có danh mục nào được chọn sẵn; nút "Ghi nhận" vẫn bấm được; sau khi bấm, giao dịch "sửa xe máy 200k" xuất hiện ở bảng chi tiết chi tiêu, gắn với danh mục "Chi tiêu khác" mới xuất hiện trên bảng ngân sách với Loại "Linh hoạt", Ngân sách 0 đ, "Chi thực tế" 200.000đ | Xem ASCII Mockup mục 8.1 |
| AC-04 | "Chi tiêu khác" của tháng đang chọn đang có giao dịch | Dylan xem dòng "Chi tiêu khác" trên bảng ngân sách theo danh mục | Dòng "Chi tiêu khác" hiển thị tên, "Chi thực tế" và "Còn lại" dạng chữ thường (không phải ô nhập); không có ô nhập cho tên/loại/ngân sách; không có nút xóa ở cuối dòng | Xem ASCII Mockup mục 8.2 |
| AC-05 | "Chi tiêu khác" của tháng đang chọn chỉ đang có đúng một giao dịch | Dylan xóa giao dịch duy nhất đó (ở bảng chi tiết chi tiêu) | Dòng "Chi tiêu khác" biến mất khỏi bảng ngân sách theo danh mục ngay sau khi xóa | Xem ASCII Mockup mục 8.2 |
| AC-06 | Danh mục thường "Ăn uống" của tháng đang chọn đang có 2 giao dịch, danh mục "Chi tiêu khác" trong tháng đó đã tồn tại sẵn (đang có 1 giao dịch khác từ trước) | Dylan bấm nút xóa trên danh mục "Ăn uống" | Danh mục "Ăn uống" biến mất; "Chi tiêu khác" (không tạo thêm bản ghi mới) tăng "Chi thực tế" lên đúng tổng 3 giao dịch (1 giao dịch cũ + 2 giao dịch vừa chuyển); toast hiện "Đã xóa 'Ăn uống'. 2 giao dịch đã chuyển sang Chi tiêu khác." | Xem ASCII Mockup mục 8.2 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì tham chiếu khối ASCII Mockup ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

Liệt kê mọi thành phần màn hình mà requirement này chạm tới.

### 8.1. Ô nhập nhanh chi tiêu — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Dropdown Danh mục nhận diện (nhập nhanh) | Dropdown | Danh mục nhận diện | Danh sách danh mục của tháng đang chọn, cộng một lựa chọn trống | **Đổi hành vi so với hiện tại**: trước đây luôn có một danh mục được chọn sẵn (không có lựa chọn trống); nay khi nội dung không khớp từ khóa danh mục nào, tự động chọn trạng thái trống — Dylan vẫn bấm "Ghi nhận" được ở trạng thái này | Dylan | AC-03 | Không |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| Nhập nhanh chi tiêu                                              |
| Nội dung: [sửa xe máy 200k___]  Danh mục: [— Chưa xác định — v] |
|                                                    [Ghi nhận]    |
+----------------------------------------------------------------+
```

### 8.2. Bảng ngân sách theo danh mục — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-02 | Dòng danh mục "Chi tiêu khác" | Table | Chi tiêu khác | Danh mục dự phòng của tháng đang chọn | **Mới thêm** — chỉ xuất hiện trên bảng khi đang có ít nhất một giao dịch gán vào nó; hiển thị dạng chữ thường (không ô nhập) cho tên, không có ô nhập cho Loại/Ngân sách, không có nút xóa ở cuối dòng; tự ẩn khỏi bảng khi hết giao dịch, bản ghi vẫn giữ nguyên trong dữ liệu | Dylan | AC-04, AC-05, AC-06 | Không |
| EL-03 | Nút "Xóa danh mục" | Button | (icon thùng rác) | — | Chỉ hiện trên danh mục thường (không khóa); bấm vào xóa ngay, không cần xác nhận thêm; nếu danh mục đang có giao dịch, toàn bộ giao dịch chuyển sang "Chi tiêu khác" trước khi xóa | Dylan | AC-01, AC-02, AC-06 | Không |
| EL-04 | Thông báo xác nhận xóa danh mục | Toast | Tên danh mục vừa xóa, kèm số giao dịch đã chuyển nếu có (vd "Đã xóa 'Giải trí / cafe'. 3 giao dịch đã chuyển sang Chi tiêu khác.") | Kết quả thao tác xóa danh mục vừa thực hiện | **Mới thêm** — hiện tại chưa có thông báo dạng toast nào trong ứng dụng; đây là toast đầu tiên, hiện ngay sau khi xóa danh mục thành công; nêu rõ số giao dịch đã chuyển nếu có, chỉ báo đã xóa nếu không có giao dịch nào; tự đóng sau vài giây mà không cần Dylan thao tác gì thêm | Dylan | AC-01, AC-02 | Không |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| Danh mục         Loại       Ngân sách   Chi thực tế  Còn lại    |
+----------------------------------------------------------------+
| [Ăn uống_____]  [Linh hoạt] [4,000,000]  0 đ          4.000.000 [🗑]
| [Di chuyển___]  [Linh hoạt] [1,500,000]  30.000 đ     1.470.000 [🗑]
| Chi tiêu khác    Linh hoạt   0 đ         200.000 đ    -200.000
+----------------------------------------------------------------+
| ✓ Đã xóa 'Giải trí / cafe'. 3 giao dịch đã chuyển sang          |
|   Chi tiêu khác.                                                |
+----------------------------------------------------------------+
```

Số liệu trong mockup này chỉ minh họa bố cục dòng "Chi tiêu khác" (ô chữ thường, không nút xóa) và hình dạng toast — không phải số chính xác của riêng một AC nào (dòng "Chi tiêu khác" mượn số 200.000đ từ ví dụ AC-03, toast mượn nội dung từ ví dụ AC-01). Số thật của từng AC xem ở cột Then tương ứng.

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Button`: nêu rõ điều kiện bật/tắt và điều gì xảy ra sau khi bấm.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Danh mục | Thêm khả năng phân biệt "Chi tiêu khác" (khóa, chỉ đọc hoàn toàn) với danh mục khóa khác (Tiền nhà, Chi phí cố định khác — vẫn cho sửa tên/loại/ngân sách, chỉ chặn xóa) | Có | Giữ vĩnh viễn kể cả khi không còn giao dịch (chỉ ẩn khỏi giao diện) |
| Giao dịch | Xóa danh mục chuyển `categoryId` của giao dịch liên quan sang "Chi tiêu khác" | Có | Không mất giao dịch nào |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — cần data model bền vững | Implemented |
| [`US-003`](../US-003-lien-ket-giao-dich-theo-id/spec.md) | Dữ liệu | Không (đã Delivered) — cần liên kết theo mã nhận diện để chuyển giao dịch giữa danh mục chính xác | Implemented |
| [`US-004`](../US-004-sua-xoa-tung-giao-dich/spec.md) | Thứ tự | Không (đã Delivered) — AC-05 minh họa bằng thao tác xóa một giao dịch ở bảng chi tiết chi tiêu, cần nút xóa giao dịch của `US-004` đã có sẵn để kiểm chứng | Implemented |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`US-004`](../US-004-sua-xoa-tung-giao-dich/spec.md) | Mục 6 (sửa/xóa giao dịch có thể làm "Chi tiêu khác" mất giao dịch cuối cùng) | Không có element cụ thể — hành vi ẩn dòng đã mô tả ở `BR-012`, US-004 không cần chủ động gọi gì thêm | Không | Không cần sửa — US-004 mục 4 (Ngoài phạm vi) đã ghi đúng: việc ẩn "Chi tiêu khác" là bộ lọc hiển thị tại thời điểm vẽ bảng danh mục, không phải việc US-004 phải chủ động kích hoạt |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md`](../../kb/ba/wiki/knowledge/feature/US-005-rang-buoc-toan-ven-danh-muc.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-005-rang-buoc-toan-ven-danh-muc.md`](../../kb/ba/wiki/delivery/pbi/US-005-rang-buoc-toan-ven-danh-muc.md) | Điền đầy đủ User Story và 6 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory cần ghi: 4 quyết định user chốt qua dialog (nội dung toast xóa danh mục, cơ chế bỏ qua danh mục ở nhập nhanh, Loại và Ngân sách mặc định của "Chi tiêu khác") → đã ghi thành các mã DEC (viết tắt của "Decision", mã quyết định đã chốt với user) là `DEC-054`, `DEC-055`, `DEC-056`, `DEC-057` vào `decisions.md`. Không có thuật ngữ nghiệp vụ mới phát sinh ngoài những gì đã có trong `glossary.md`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi (`/budget`) — khu vực nhập nhanh chi tiêu (thêm lựa chọn trống ở dropdown danh mục) và bảng ngân sách theo danh mục (dòng "Chi tiêu khác" chỉ đọc, toast khi xóa) |
| Thực thể dữ liệu nào bị chạm | Danh mục (cần phân biệt "Chi tiêu khác" với danh mục khóa khác), Giao dịch (đổi `categoryId` khi danh mục cha bị xóa) |
| Cần thay đổi cấu trúc dữ liệu | Có — hiện tại chỉ có một cờ `locked` dùng chung cho mọi danh mục khóa (Tiền nhà, Chi phí cố định khác), nhưng "Chi tiêu khác" cần hành vi khóa nghiêm ngặt hơn (không cho sửa cả tên/loại/ngân sách, không chỉ chặn xóa) — cần cách phân biệt "Chi tiêu khác" với danh mục khóa khác |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Có — nếu thêm trường/cách đánh dấu mới cho "Chi tiêu khác" |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Sau khi xóa danh mục thành công, toast nêu rõ số giao dịch đã chuyển sang "Chi tiêu khác" nếu có, chỉ báo đã xóa nếu không có giao dịch nào | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-06 (`DEC-054`) | Nếu sai, cần đổi nội dung toast ở AC-01/AC-02/AC-06, mục 8.2 EL-04 |
| A2 | Khi nội dung nhập nhanh không khớp từ khóa danh mục nào, ô chọn danh mục tự để trống (không tự chọn sẵn danh mục có sẵn); Dylan bấm "Ghi nhận" được ngay không cần xác nhận thêm | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-06 (`DEC-055`) | Nếu sai, cần thiết kế lại cơ chế bỏ qua danh mục (vd thêm nút riêng), ảnh hưởng AC-03, mục 8.1 EL-01 |
| A3 | "Chi tiêu khác" khi tự sinh có Loại "Linh hoạt" | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-06 (`DEC-056`) | Nếu sai, ảnh hưởng cách tính thẻ "Chi linh hoạt" ở phần Phân tích cho giao dịch trong "Chi tiêu khác" |
| A4 | "Chi tiêu khác" khi tự sinh có Ngân sách khởi tạo 0đ | Đã xác nhận từ knowledge — mặc định nhất quán với cách tạo danh mục mới thủ công (`DEC-057`) | Nếu sai, cần chọn một giá trị Ngân sách khởi tạo khác cho "Chi tiêu khác" |
