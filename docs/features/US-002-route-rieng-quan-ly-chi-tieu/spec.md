# Route/module riêng cho Quản lý chi tiêu

Status: Ready for DEV
Feature: US-002
Created: 2026-08-05
Updated: 2026-08-05
Raw Source: `docs/kb/ba/raw/US-002-route-rieng-quan-ly-chi-tieu.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-002-route-rieng-quan-ly-chi-tieu.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, khu vực Thu chi (quản lý ngân sách, danh mục, giao dịch) chỉ là một trong năm mục hiển thị trộn lẫn ngay trên trang chủ Dylan Plan Dashboard, cùng chỗ với Roadmap sự nghiệp, Freelance và Sản phẩm — chuyển qua lại giữa các mục chỉ đổi nội dung hiển thị tại chỗ, không đổi địa chỉ trang trên trình duyệt.

Sau thay đổi này, khu vực Thu chi có một địa chỉ trang riêng (`/budget`), tách hẳn khỏi các mục khác của Dylan Plan Dashboard. Dylan có thể vào thẳng trang Thu chi bằng địa chỉ riêng đó (kể cả gõ trực tiếp hoặc lưu làm bookmark), thay vì phải luôn đi qua trang chủ rồi chọn tab.

Giá trị đo được: Dylan mở địa chỉ `/budget` — dù bấm từ liên kết trên trang chủ hay gõ trực tiếp — đều thấy ngay đầy đủ nội dung quản lý Thu chi, độc lập hoàn toàn với Roadmap/Freelance/Sản phẩm.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-002-route-rieng-quan-ly-chi-tieu.md`](../../kb/ba/wiki/knowledge/feature/US-002-route-rieng-quan-ly-chi-tieu.md) | Mục tiêu, phạm vi, business rule |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-006-route-budget.md`](../../kb/ba/wiki/knowledge/business-rule/BR-006-route-budget.md) | Module Thu chi có địa chỉ trang riêng `/budget`, tách khỏi shell chung, dùng chung codebase |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M2 — trang Quản lý chi tiêu tách khỏi các mục khác của Dylan Plan Dashboard |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`.

## 3. Phạm Vi

- Địa chỉ trang riêng `/budget` hiển thị đầy đủ nội dung quản lý Thu chi hiện có: chọn/tạo tháng và lịch sử các tháng, ô nhập nhanh chi tiêu, bảng danh mục và ngân sách, bảng chi tiết chi tiêu, phân tích, quy tắc kiểm soát ngân sách (nội dung tĩnh), xuất dữ liệu, thông báo di trú dữ liệu cũ nếu có — nội dung bên trong giữ nguyên như hiện tại, chỉ đổi vị trí hiển thị
- Trên trang chủ Dylan Plan Dashboard, mục "Thu chi" trong thanh điều hướng và nút "Nhập thu chi" ở khu giới thiệu đầu trang đổi thành liên kết đưa Dylan sang `/budget`
- Trên trang chủ, khi Dylan chọn "Tổng quan", nội dung Thu chi không còn hiển thị cùng Roadmap/Freelance/Sản phẩm nữa; riêng thẻ "Còn lại tháng này" (tính từ số liệu Thu chi) cũng bị bỏ khỏi khối 4 thẻ tổng quan ở đầu trang, chỉ còn 3 thẻ: Mục tiêu offer, Thu nhập hiện tại, Chi phí cố định
- Trang `/budget` có một liên kết ở đầu trang để Dylan quay lại trang chủ Dylan Plan Dashboard
- Dylan vào được `/budget` trực tiếp (gõ địa chỉ, mở từ bookmark, mở tab mới) mà không bắt buộc phải đi qua trang chủ trước

## 4. Ngoài Phạm Vi

- Tách thành dự án/ứng dụng độc lập khỏi `Dylan.Plan` — vẫn dùng chung một codebase Next.js
- Đăng nhập, phân quyền
- Thay đổi nội dung hoặc hành vi nghiệp vụ bên trong khu vực Thu chi (nhập nhanh, sửa/xóa giao dịch, ràng buộc danh mục...) — những thay đổi đó thuộc các requirement riêng khác, gọi bằng mã US (viết tắt của "User Story", cách đặt mã function của dự án) như `US-001`, `US-004`; requirement này chỉ đổi vị trí hiển thị, không đổi cách Thu chi hoạt động bên trong
- Hiển thị bản tóm tắt rút gọn của Thu chi trong "Tổng quan" — không làm, Dylan phải mở `/budget` để xem Thu chi

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem, điều hướng qua lại giữa trang chủ và `/budget` | Không áp dụng — hệ thống chỉ phục vụ một mình Dylan, không có vai trò thứ hai | `docs/memory/decisions.md#dec-004` |

## 6. Luồng Nghiệp Vụ

1. Dylan mở trang chủ Dylan Plan Dashboard, thấy thanh điều hướng có các mục Tổng quan, Roadmap, Freelance, Sản phẩm, Thu chi.
2. Dylan bấm mục "Thu chi" trên thanh điều hướng, hoặc bấm nút "Nhập thu chi" ở khu giới thiệu đầu trang — trình duyệt chuyển hẳn sang địa chỉ trang `/budget`.
3. Trang `/budget` tải xong, hiển thị đầy đủ nội dung quản lý Thu chi (giống hệt nội dung trước đây từng nằm trong tab "Thu chi" của trang chủ) và một liên kết ở đầu trang để quay lại trang chủ.
4. Dylan bấm liên kết quay lại — trình duyệt chuyển về trang chủ Dylan Plan Dashboard.
5. (Cách vào khác) Dylan gõ trực tiếp địa chỉ `/budget` vào trình duyệt, hoặc mở từ bookmark đã lưu trước đó — trang Thu chi hiển thị đầy đủ ngay, không bắt buộc phải mở trang chủ trước.
6. Khi Dylan ở trang chủ và chọn tab "Tổng quan", chỉ còn thấy nội dung Roadmap, Freelance, Sản phẩm — không còn thấy nội dung Thu chi trong khối này nữa.

Ngoại lệ: Không có — đây là thay đổi cấu trúc điều hướng, không có nhánh dữ liệu rỗng, trùng lặp hay lỗi hệ thống phát sinh riêng cho requirement này.

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Dylan đang ở trang chủ Dylan Plan Dashboard, bất kể tab nào đang chọn | Dylan bấm mục "Thu chi" trên thanh điều hướng, hoặc bấm nút "Nhập thu chi" ở khu giới thiệu đầu trang | Địa chỉ trang trên trình duyệt đổi thành `/budget`; trang mới hiển thị đúng 7 khối theo thứ tự: chọn/tạo tháng và lịch sử tháng, ô nhập nhanh chi tiêu, bảng danh mục và ngân sách, bảng chi tiết chi tiêu, phân tích, quy tắc kiểm soát ngân sách, nút xuất dữ liệu — không thiếu khối nào so với trước đây từng nằm trong tab "Thu chi" của trang chủ | Xem ASCII Mockup mục 8.1 |
| AC-02 | Dylan đang ở trang chủ, tab "Tổng quan" đang chọn | Dylan xem nội dung trang chủ | Chỉ thấy các khối Roadmap, Freelance, Sản phẩm; khối tổng quan ở đầu trang chỉ còn đúng 3 thẻ: Mục tiêu offer, Thu nhập hiện tại, Chi phí cố định — không còn thẻ "Còn lại tháng này", không còn bảng danh mục, ô nhập nhanh, hay bất kỳ nội dung Thu chi nào khác trên trang chủ | Xem ASCII Mockup mục 8.1 |
| AC-03 | Dylan đang ở trang `/budget` | Dylan bấm liên kết quay lại ở đầu trang | Trình duyệt chuyển về địa chỉ trang chủ, hiển thị lại Dylan Plan Dashboard (mặc định tab "Tổng quan") | Xem ASCII Mockup mục 8.2 |
| AC-04 | Trước khi có thay đổi này, Dylan đã có sẵn dữ liệu Thu chi (tháng, danh mục, giao dịch đã lưu) hiển thị trong tab "Thu chi" của trang chủ | Dylan mở `/budget` lần đầu sau khi thay đổi này có hiệu lực | Bảng danh mục hiển thị đúng số dòng, đúng số tiền ngân sách và Chi thực tế như trước; bảng chi tiết chi tiêu liệt kê đúng số giao dịch đã có trước đó, không thiếu hay thừa dòng nào so với khi còn hiển thị trong tab "Thu chi" của trang chủ | Xem ASCII Mockup mục 8.2 |
| AC-05 | Dylan chưa mở trang chủ trong phiên làm việc hiện tại | Dylan gõ trực tiếp địa chỉ `/budget` vào trình duyệt, hoặc mở từ bookmark đã lưu | Trang tải xong hiển thị ngay đúng 7 khối liệt kê ở AC-01 (mục 3) — không có bước chuyển hướng trung gian nào về trang chủ trước khi hiển thị các khối này | Xem ASCII Mockup mục 8.2 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì tham chiếu khối ASCII Mockup ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

Liệt kê mọi thành phần màn hình mà requirement này chạm tới. Cột cuối mỗi bảng dưới đây dùng ký hiệu PBI (đơn vị công việc nhỏ nhất chuyển giao được, viết tắt của "Product Backlog Item") và US (viết tắt của "User Story", cách gọi mã function ở dự án này) để ghi function khác cùng dùng chung element đó — chỉ điền khi có, không thì ghi "Không".

### 8.1. Trang chủ — Dylan Plan Dashboard (địa chỉ trang `/`)

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Mục "Thu chi" trên thanh điều hướng | Link | Thu chi | — | **Đổi hành vi so với hiện tại**: trước đây là nút chuyển nội dung tại chỗ, không đổi địa chỉ trang; nay là liên kết điều hướng — bấm vào rời khỏi trang chủ, chuyển hẳn sang `/budget` | Dylan | AC-01 | Không |
| EL-02 | Nút "Nhập thu chi" (khu giới thiệu đầu trang) | Link | Nhập thu chi | — | **Đổi hành vi so với hiện tại**: cùng thay đổi như EL-01 — trước chuyển nội dung tại chỗ, nay điều hướng sang `/budget` | Dylan | AC-01 | Không |
| EL-03 | Tab "Tổng quan" | Tab | Tổng quan | Roadmap, Freelance, Sản phẩm | **Đổi hành vi so với hiện tại**: trước đây khi chọn, hiển thị gộp cả Roadmap, Freelance, Sản phẩm và Thu chi; nay chỉ còn gộp Roadmap, Freelance, Sản phẩm — không còn hiển thị nội dung Thu chi | Dylan | AC-02 | Không |
| EL-06 | Thẻ "Còn lại tháng này" (khối 4 thẻ tổng quan ở đầu trang) | Badge | Còn lại tháng này | Số liệu Thu chi (Thu nhập trừ Tổng chi thực tế) | **Bị xóa khỏi trang chủ** — trước đây hiển thị cùng 3 thẻ Mục tiêu offer/Thu nhập hiện tại/Chi phí cố định ở cả tab "Tổng quan" lẫn tab "Thu chi"; nay bỏ hẳn khỏi trang chủ vì lấy số liệu trực tiếp từ Thu chi, không còn dữ liệu Thu chi tại chỗ để tính; xem số liệu tương đương tại `/budget` | Dylan | AC-02 | Không |

**ASCII Mockup**

Trang chủ sau khi thay đổi — thanh điều hướng vẫn còn đủ 5 mục, nhưng "Thu chi" giờ là liên kết rời trang; tab "Tổng quan" không còn khối Thu chi:

```text
+------------------------------------------------------------------+
| D  Dylan Plan Dashboard      [Tổng quan][Roadmap][Freelance]     |
|                               [Sản phẩm][Thu chi ->]              |
+------------------------------------------------------------------+
| Kế hoạch sự nghiệp, sản phẩm và thu chi                          |
|  [Xem roadmap]   [Nhập thu chi ->]                                |
+------------------------------------------------------------------+
| Tổng quan: Mục tiêu offer | Thu nhập hiện tại | Chi phí cố định       |
+------------------------------------------------------------------+
| Roadmap sự nghiệp ...                                            |
+------------------------------------------------------------------+
| Freelance ...                                                    |
+------------------------------------------------------------------+
| Sản phẩm ...                                                     |
+------------------------------------------------------------------+
| (Không còn khối Thu chi ở đây — xem tại /budget)                 |
+------------------------------------------------------------------+
```

Bấm "Thu chi" hoặc "Nhập thu chi ->" đưa Dylan sang trang riêng ở mục 8.2.

### 8.2. Trang Thu chi riêng (địa chỉ trang `/budget`)

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-04 | Liên kết quay lại trang chủ | Link | ← Dylan Plan Dashboard | — | **Mới thêm** — nằm cố định ở đầu trang `/budget`; bấm vào điều hướng về trang chủ | Dylan | AC-03 | Không |
| EL-05 | Khối nội dung quản lý Thu chi | Table | (giữ nguyên nhãn như trước khi chuyển vị trí) | Dữ liệu ngân sách tháng đang chọn (tháng, danh mục, giao dịch — đã có từ `US-001`) | Toàn bộ nội dung (chọn/tạo tháng và lịch sử tháng, nhập nhanh, bảng danh mục và ngân sách, bảng chi tiết chi tiêu, phân tích, quy tắc kiểm soát ngân sách, xuất dữ liệu, thông báo di trú dữ liệu cũ) hiển thị đầy đủ, hành vi bên trong không đổi so với trước — chỉ đổi từ hiển thị tại trang chủ sang hiển thị tại `/budget`; truy cập được cả khi vào trực tiếp bằng địa chỉ trang, không chỉ khi điều hướng từ trang chủ | Dylan | AC-01, AC-04, AC-05 | [`US-001` mục 8](../US-001-luu-tru-chi-tieu-ben-vung/spec.md), [`US-004` mục 8](../US-004-sua-xoa-tung-giao-dich/spec.md) — Screen Element chi tiết bên trong khối này đã mô tả đầy đủ ở hai spec đó, không lặp lại ở đây |

**ASCII Mockup**

Trang `/budget` — nội dung Thu chi giữ nguyên như trước, chỉ thêm liên kết quay lại ở đầu trang:

```text
+------------------------------------------------------------------+
| <- Dylan Plan Dashboard                                          |
+------------------------------------------------------------------+
| Theo tháng — chọn tháng / tạo tháng mới / lịch sử các tháng      |
+------------------------------------------------------------------+
| Thu chi — Ngân sách theo danh mục                                |
+------------------------------------------------------------------+
| Nhập nhanh: [____________________]  [Ghi nhận]                   |
+------------------------------------------------------------------+
| Danh mục        Ngân sách   Chi thực tế   Còn lại                |
| Tiền nhà        7.500.000   7.500.000     0                      |
| ...                                                               |
+------------------------------------------------------------------+
| Giao dịch gần đây                                                 |
| cafe    -55.000đ   [Sửa][Xóa]                                    |
| ...                                                                |
+------------------------------------------------------------------+
| [Xuất JSON]                                                       |
+------------------------------------------------------------------+
| Phân tích — chi nhiều nhất / tiết kiệm / xu hướng theo tháng     |
+------------------------------------------------------------------+
| Quy tắc kiểm soát ngân sách (nội dung tĩnh)                       |
+------------------------------------------------------------------+
```

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Link`: nêu rõ nơi dẫn tới và thời điểm hiển thị.
- Với `Tab`: nêu rõ nội dung nào gộp hiển thị khi tab được chọn.
- Cột **Liên kết PBI/US** chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Tháng ngân sách, Danh mục, Giao dịch | Không đổi cấu trúc dữ liệu | Không | Chỉ đổi vị trí hiển thị (trang), không đổi cách lưu trữ |
| Xuất dữ liệu JSON | Không đổi — nút xuất dữ liệu vẫn hoạt động y như cũ, chỉ đổi vị trí sang `/budget` | Không | Thuộc requirement riêng (`US-008`), không đổi ở phạm vi này |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — nội dung bên trong `/budget` cần dữ liệu bền vững đã có từ US-001 để hiển thị đầy đủ, nhưng route tự nó không đòi hỏi thay đổi dữ liệu | Implemented |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Mục 8 — mô tả vị trí màn hình ("Tab Thu chi trong Dylan Plan Dashboard") | Toàn bộ Screen Element mục 8 của US-001 | Không (ngoài phạm vi ssr-ba đang chạy cho US-002 — không được sửa spec của feature khác) | Cần một lượt `ssr-ba` riêng rà lại `spec.md` của US-001 sau khi US-002 triển khai xong, cập nhật mô tả vị trí màn hình từ "Tab Thu chi trong Dylan Plan Dashboard" thành "Trang riêng `/budget`" |
| [`US-004`](../US-004-sua-xoa-tung-giao-dich/spec.md) | Mục 8.1 — dòng tiêu đề màn hình `Tab "Thu chi" trong Dylan Plan Dashboard, khu vực "Nhập nhanh chi tiêu"` | `EL-01`..`EL-16` (tiêu đề khu vực) | Không (ngoài phạm vi ssr-ba đang chạy cho US-002 — không được sửa spec của feature khác) | Cần một lượt `ssr-ba` riêng rà lại `spec.md` của US-004 sau khi US-002 triển khai xong, đổi mô tả vị trí màn hình sang "Trang riêng `/budget`" |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-002-route-rieng-quan-ly-chi-tieu.md`](../../kb/ba/wiki/knowledge/feature/US-002-route-rieng-quan-ly-chi-tieu.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-002-route-rieng-quan-ly-chi-tieu.md`](../../kb/ba/wiki/delivery/pbi/US-002-route-rieng-quan-ly-chi-tieu.md) | Điền đầy đủ User Story và 5 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory cần ghi: 3 quyết định user chốt qua dialog (cách điều hướng, Tổng quan bỏ Thu chi, liên kết quay lại) → đã ghi thành các mã DEC (viết tắt của "Decision", mã quyết định đã chốt với user) là `DEC-049`, `DEC-050`, `DEC-051` vào `decisions.md`. Không có thuật ngữ nghiệp vụ mới phát sinh ngoài những gì đã có trong `glossary.md`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang chủ Dylan Plan Dashboard (bỏ nav item/nút Hero và nội dung Thu chi khỏi "Tổng quan", đổi 2 điểm điều hướng thành liên kết); trang mới cho Thu chi (toàn bộ nội dung Thu chi chuyển sang đây, thêm liên kết quay lại) |
| Thực thể dữ liệu nào bị chạm | Không có — đây là thay đổi cấu trúc điều hướng/hiển thị, không đổi Tháng ngân sách/Danh mục/Giao dịch |
| Cần thay đổi cấu trúc dữ liệu | Không |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không — xuất dữ liệu JSON giữ nguyên hành vi, chỉ đổi vị trí trang chứa nút xuất |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Mục "Thu chi" trên thanh điều hướng và nút "Nhập thu chi" ở khu giới thiệu đầu trang chủ đổi thành liên kết điều hướng hẳn sang trang riêng (đổi địa chỉ trang), không còn hiển thị nội dung Thu chi tại chỗ trên trang chủ | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-05 (`DEC-049`) | Nếu sai, cần giữ nội dung Thu chi hiển thị song song tại trang chủ, chỉ thêm lối vào phụ tới trang riêng, ảnh hưởng mục 6, 7 (AC-01), 8 (EL-01, EL-02) |
| A2 | Khi Dylan chọn "Tổng quan" trên trang chủ, khối nội dung Thu chi không còn hiển thị cùng Roadmap/Freelance/Sản phẩm | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-05 (`DEC-050`) | Nếu sai, cần thiết kế thêm một bản tóm tắt Thu chi riêng cho "Tổng quan", ảnh hưởng mục 6, 7 (AC-02), 8 (EL-03) |
| A3 | Trang Thu chi riêng có một liên kết cố định ở đầu trang để quay lại trang chủ, không chỉ dựa vào nút Back của trình duyệt | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-05 (`DEC-051`) | Nếu sai, cần bỏ `EL-04` khỏi mục 8.2 và `AC-03`, Dylan chỉ dùng nút Back trình duyệt hoặc gõ lại địa chỉ để quay về trang chủ |
| A4 | Thẻ "Còn lại tháng này" (tính trực tiếp từ số liệu Thu chi) bị bỏ khỏi khối 4 thẻ tổng quan ở đầu trang chủ; chỉ còn 3 thẻ Mục tiêu offer, Thu nhập hiện tại, Chi phí cố định | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-05 (`DEC-052`), sau khi `ba-expert` phát hiện mâu thuẫn giữa `DEC-050` và bản nháp spec giữ nguyên cả 4 thẻ | Nếu sai, cần khôi phục thẻ "Còn lại tháng này" trong khối tổng quan, ảnh hưởng mục 3, 7 (AC-02), 8 (EL-03, EL-06 — bỏ EL-06, sửa lại ràng buộc của EL-03) |
