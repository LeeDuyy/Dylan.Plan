# Phân tích xu hướng trên toàn bộ lịch sử đã lưu

Status: Ready for DEV
Feature: US-007
Created: 2026-08-21
Updated: 2026-08-21
Raw Source: `docs/kb/ba/raw/US-007-phan-tich-xu-huong-lich-su.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-007-phan-tich-xu-huong-lich-su.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, biểu đồ "Xu hướng" (tổng chi qua các tháng) ở trang Thu chi có nguy cơ chỉ phản ánh đúng các tháng đang có sẵn trong bộ nhớ tạm của trình duyệt tại thời điểm Dylan mở trang, thay vì toàn bộ lịch sử tháng đã từng lưu bền vững trong hệ thống. Nếu dữ liệu từng bị mất hoặc trình duyệt bị đổi/xóa cache, biểu đồ có thể không còn đúng với lịch sử thật. Sau thay đổi này, biểu đồ "Xu hướng" luôn hiển thị đầy đủ mọi tháng ngân sách đã từng được tạo và lưu bền vững trong hệ thống, không giới hạn theo thời gian hay theo bộ nhớ tạm của trình duyệt.

Giá trị đo được: Dylan xóa cache trình duyệt (hoặc mở trang Thu chi trên một máy/trình duyệt khác chưa từng truy cập), rồi mở lại trang Thu chi — biểu đồ "Xu hướng" vẫn hiển thị đủ đúng số cột bằng đúng số tháng ngân sách đã từng được tạo trong hệ thống, không thiếu tháng nào. Mã function của dự án dùng tiền tố US (viết tắt của "User Story") ghép số thứ tự; mọi quyết định user chốt được ghi lại bằng mã DEC (viết tắt của "Decision") trong nhật ký quyết định của dự án.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-007-phan-tich-xu-huong-lich-su.md`](../../kb/ba/wiki/knowledge/feature/US-007-phan-tich-xu-huong-lich-su.md) | Mục tiêu, phạm vi, luồng nghiệp vụ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md`](../../kb/ba/wiki/knowledge/business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md) | Rule nguồn dữ liệu tính xu hướng phải là toàn bộ lịch sử đã lưu bền vững |
| [`docs/kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md`](../../kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md) | Ràng buộc của thực thể Tháng ngân sách |
| [`docs/kb/ba/wiki/knowledge/epic/EPC-004-phan-tich-bao-cao-chi-tieu.md`](../../kb/ba/wiki/knowledge/epic/EPC-004-phan-tich-bao-cao-chi-tieu.md) | Mục tiêu epic, thuộc luồng F4 |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, luồng F4 |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md` (`DEC-109`), `glossary.md`.

## 3. Phạm Vi

- Biểu đồ "Xu hướng" (tổng chi qua các tháng) ở trang Thu chi hiển thị đủ mọi tháng ngân sách đã từng được tạo và lưu bền vững trong hệ thống, không giới hạn số tháng tối đa (`DEC-109`)
- Dữ liệu hiển thị trên biểu đồ giữ nguyên đầy đủ qua các lần tải lại trang, đổi trình duyệt, hoặc xóa cache trình duyệt — vì nguồn dữ liệu là cơ sở dữ liệu bền vững, không phải bộ nhớ tạm của trình duyệt

## 4. Ngoài Phạm Vi

- Mini dashboard xem chi tiêu 3/6/9/12 tháng gần đây — thuộc `US-011`, có giới hạn khoảng thời gian riêng theo thiết kế đã chốt (`DEC-032`..`DEC-036`), không phải "toàn bộ lịch sử"
- Các thẻ insight (danh mục chi nhiều nhất, chi linh hoạt, tiết kiệm/tích lũy) và biểu đồ "Cơ cấu chi tiêu" — cả hai vốn chỉ mô tả đúng một tháng Dylan đang xem, không mang tính chất "nhiều tháng lịch sử" nên không thuộc phạm vi mở rộng nguồn dữ liệu của yêu cầu này
- Thêm giới hạn số tháng tối đa vì lý do hiệu năng — Dylan đã xác nhận không cần ở giai đoạn hiện tại (`DEC-109`)

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem biểu đồ "Xu hướng" với đầy đủ mọi tháng đã lưu bền vững | Không có ràng buộc riêng — hệ thống chỉ phục vụ một mình Dylan | `docs/memory/decisions.md#dec-004` |

## 6. Luồng Nghiệp Vụ

1. Dylan mở trang Thu chi.
2. Biểu đồ "Xu hướng" hiển thị một cột cho mỗi tháng ngân sách đã từng được tạo và lưu bền vững trong hệ thống, theo đúng thứ tự thời gian, không bỏ sót tháng nào dù tháng đó đã cũ hay Dylan vừa xóa cache trình duyệt.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Chưa có tháng ngân sách nào được tạo trong hệ thống — biểu đồ "Xu hướng" không có cột nào, giữ nguyên hành vi trống hiện có |
| Không đủ quyền | Không áp dụng — Dylan là người dùng duy nhất của hệ thống, không có ràng buộc phân quyền riêng cho việc xem biểu đồ |
| Dữ liệu trùng | Không áp dụng — yêu cầu này chỉ đổi phạm vi dữ liệu tính toán, không tạo hay đổi tên tháng nào |
| Hệ thống lỗi | Không áp dụng — yêu cầu này không đổi cách trang xử lý lỗi tải dữ liệu hiện có |

## 7. Tiêu Chí Chấp Nhận

Mỗi dòng là một tiêu chí kiểm chứng được bằng thao tác thật trên màn hình.

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Hệ thống đã có 5 tháng ngân sách được tạo và lưu bền vững | Dylan mở trang Thu chi và xem biểu đồ "Xu hướng" | Biểu đồ hiển thị đủ 5 cột, mỗi cột tương ứng một tháng đã lưu, không thiếu tháng nào | Xem ASCII Mockup mục 8.1 |
| AC-02 | Hệ thống đã có nhiều hơn 12 tháng ngân sách được tạo và lưu bền vững (ví dụ 15 tháng) | Dylan mở trang Thu chi và xem biểu đồ "Xu hướng" | Biểu đồ hiển thị đủ toàn bộ 15 cột — không bị cắt bớt hay chỉ hiển thị một số tháng gần nhất | Xem ASCII Mockup mục 8.1 |
| AC-03 | Hệ thống đã có 5 tháng ngân sách được tạo và lưu bền vững; Dylan đã xóa cache trình duyệt (hoặc mở trang Thu chi trên một máy/trình duyệt khác chưa từng truy cập trang này) | Dylan mở lại trang Thu chi | Biểu đồ "Xu hướng" vẫn hiển thị đủ 5 cột — đúng bằng số tháng đã từng được tạo và lưu trong hệ thống, không mất tháng nào vì lý do xóa cache | Xem ASCII Mockup mục 8.1 |
| AC-04 | Hệ thống chưa có tháng ngân sách nào được tạo (dữ liệu trống) | Dylan mở trang Thu chi và xem biểu đồ "Xu hướng" | Biểu đồ không hiển thị cột nào, giữ nguyên trạng thái trống hiện có — không báo lỗi, không hiển thị cột giả | Xem ASCII Mockup mục 8.1 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup ảnh/design thật cho requirement này — mọi dòng đều tham chiếu khối ASCII Mockup tương ứng ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

### 8.1. Biểu đồ Xu hướng — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Biểu đồ Xu hướng (một cột cho mỗi tháng) | Table | Xu hướng — Tổng chi qua các tháng | Toàn bộ tháng ngân sách đã tạo và lưu bền vững trong hệ thống | **Bổ sung ràng buộc so với hiện tại**: phải hiển thị đủ mọi tháng đã lưu, không giới hạn số tháng tối đa (`DEC-109`), không phụ thuộc bộ nhớ tạm của trình duyệt — trước đây có nguy cơ chỉ phản ánh tháng đang có sẵn trong bộ nhớ tạm tại thời điểm mở trang. Khi chưa có tháng ngân sách nào, giữ nguyên trạng thái trống hiện có (AC-04). Về hình thức đây là biểu đồ cột chứ không phải bảng dữ liệu; Loại được gán tạm là `Table` vì bảng "Loại hợp lệ" hiện có của kit chưa có mục dành riêng cho biểu đồ | Dylan | AC-01, AC-02, AC-03, AC-04 | Không |

**ASCII Mockup**

```text
+--------------------------------------------------------+
| Xu hướng                                                 |
| Tổng chi qua các tháng                                   |
|                                                            |
|  █     █     █     █     █     █     █     █             |
|  █  █  █  █  █  █  █  █  █  █  █  █  █  █  █  ...         |
| 01/26 02/26 03/26 04/26 05/26 06/26 07/26 08/26 ... (đủ mọi tháng đã lưu) |
+--------------------------------------------------------+
```

Mockup minh họa đúng AC-01/AC-02/AC-03: mỗi cột ứng với một tháng đã lưu bền vững, số cột luôn khớp đúng số tháng đã tạo trong hệ thống, không bị cắt bớt hay mất khi xóa cache trình duyệt. Trường hợp AC-04 (chưa có tháng nào), biểu đồ hiển thị trạng thái trống — không có cột nào trong khối mockup trên.

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Button`: nêu rõ điều kiện bật/tắt và điều gì xảy ra sau khi bấm.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Tháng ngân sách (dùng để tính biểu đồ Xu hướng) | Không đổi cấu trúc — chỉ đảm bảo nguồn tính toán bao gồm toàn bộ tháng đã lưu bền vững, không lọc bớt | Không | Không thêm bảng hay trường dữ liệu mới |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng (US-008), chưa triển khai |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — cần cấu trúc dữ liệu bền vững cho tháng ngân sách để có nguồn tính "toàn bộ lịch sử" | Delivered With Notes |

## 11. Tác Động Tới Spec Khác

Không có phụ thuộc — đã tìm trong toàn bộ spec đã có (`US-001`..`US-020`) theo từ vựng "xu hướng", "biểu đồ", "phân tích": không có spec nào khác mô tả hoặc dùng chung Screen Element `EL-01` của requirement này. `US-011` (mini dashboard) có phạm vi và Screen Element riêng, không trùng với biểu đồ "Xu hướng" của F4.

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-007-phan-tich-xu-huong-lich-su.md`](../../kb/ba/wiki/knowledge/feature/US-007-phan-tich-xu-huong-lich-su.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV`; xóa dòng "Cần user xác nhận" ở mục 6 — đã chốt bằng `DEC-109`; thu hẹp mục 1/2 đúng phạm vi biểu đồ "Xu hướng" — đã chốt bằng `DEC-110` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-007-phan-tich-xu-huong-lich-su.md`](../../kb/ba/wiki/delivery/pbi/US-007-phan-tich-xu-huong-lich-su.md) | Điền đầy đủ User Story và 4 AC từ spec này (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md`](../../kb/ba/wiki/knowledge/business-rule/BR-028-xu-huong-tinh-tu-toan-bo-lich-su-db.md) | Thu hẹp mục "Nội Dung Rule" đúng phạm vi biểu đồ "Xu hướng", bỏ phần nhắc chung tới "insight và biểu đồ" — đã chốt bằng `DEC-110` (qua `ssr-ingest mode=sync`) |

Memory cần ghi: quyết định "không giới hạn số tháng" đã ghi vào `decisions.md` (`DEC-109`); quyết định thu hẹp phạm vi chỉ đúng biểu đồ Xu hướng đã ghi `DEC-110`. Không phát sinh thuật ngữ nghiệp vụ mới — `glossary.md` không cần cập nhật.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi — khu vực biểu đồ "Xu hướng" (phần phân tích F4) |
| Thực thể dữ liệu nào bị chạm | Tháng ngân sách — chỉ đọc, xác nhận nguồn tính toán không giới hạn theo thời gian |
| Cần thay đổi cấu trúc dữ liệu | Không |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Không giới hạn số tháng khi tính biểu đồ Xu hướng — luôn quét toàn bộ tháng đã lưu bền vững | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-21 (`DEC-109`) | Nếu sai (dữ liệu tăng lên nhiều gây chậm), cần bổ sung giới hạn số tháng ở một requirement riêng sau này — ảnh hưởng AC-02, `EL-01` |
| A2 | Phạm vi US-007 chỉ đúng biểu đồ "Xu hướng" (tổng chi qua các tháng), không mở rộng sang thẻ insight (danh mục chi nhiều nhất, tiết kiệm, chi linh hoạt) hay biểu đồ "Cơ cấu chi tiêu" — hai nhóm màn hình đó chỉ mô tả đúng một tháng Dylan đang xem, không có khái niệm "lịch sử nhiều tháng" để mở rộng | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-21 (`DEC-110`), sau đề xuất của `ba-expert` | Nếu sai, cần bổ sung AC và Screen Element riêng cho thẻ insight và biểu đồ "Cơ cấu chi tiêu" — ảnh hưởng mục 3, 4, 7, 8 của spec này |
