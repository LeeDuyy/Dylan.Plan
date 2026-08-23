# Xuất dữ liệu từ nguồn lưu trữ bền vững

Status: Ready for DEV
Feature: US-008
Created: 2026-08-21
Updated: 2026-08-21
Raw Source: `docs/kb/ba/raw/US-008-xuat-du-lieu-ben-vung.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-008-xuat-du-lieu-ben-vung.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, nút Xuất JSON (JSON là một định dạng file văn bản dùng để lưu dữ liệu có cấu trúc, mở được bằng trình soạn thảo văn bản thường) ở trang Thu chi có nguy cơ chỉ đóng gói dữ liệu đang có sẵn trong bộ nhớ tạm của trình duyệt tại thời điểm Dylan bấm nút, thay vì toàn bộ dữ liệu đã lưu bền vững trong hệ thống. Nếu bộ nhớ tạm đó chưa đồng bộ đủ hoặc trình duyệt gặp sự cố, file xuất ra có thể thiếu hoặc sai lệch so với dữ liệu thật. Sau thay đổi này, file JSON tải về luôn chứa đúng toàn bộ dữ liệu (mọi tháng, danh mục, giao dịch, item cần mua) đã lưu bền vững trong hệ thống tại thời điểm bấm nút, không phụ thuộc bộ nhớ tạm của trình duyệt. Mã function của dự án dùng tiền tố US (viết tắt của "User Story") ghép số thứ tự; mọi quyết định user chốt được ghi lại bằng mã DEC (viết tắt của "Decision") trong nhật ký quyết định của dự án.

Giá trị đo được: Dylan bấm "Xuất JSON" ngay sau khi tải lại trang Thu chi (không thao tác gì thêm) — file JSON tải về chứa đầy đủ đúng số tháng, danh mục, giao dịch và item cần mua đã lưu trong hệ thống, khớp 100% với dữ liệu Dylan xem được trên các bảng của trang.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-008-xuat-du-lieu-ben-vung.md`](../../kb/ba/wiki/knowledge/feature/US-008-xuat-du-lieu-ben-vung.md) | Mục tiêu, phạm vi, luồng nghiệp vụ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-029-xuat-json-tu-du-lieu-ben-vung.md`](../../kb/ba/wiki/knowledge/business-rule/BR-029-xuat-json-tu-du-lieu-ben-vung.md) | Rule nguồn dữ liệu xuất JSON phải là toàn bộ dữ liệu bền vững |
| [`docs/kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md`](../../kb/ba/wiki/data/entity/ENT-003-thang-ngan-sach.md) | Ràng buộc của thực thể Tháng ngân sách |
| [`docs/kb/ba/wiki/knowledge/epic/EPC-004-phan-tich-bao-cao-chi-tieu.md`](../../kb/ba/wiki/knowledge/epic/EPC-004-phan-tich-bao-cao-chi-tieu.md) | Mục tiêu epic, thuộc luồng F4 |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, luồng F4 |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`.

## 3. Phạm Vi

- Nút "Xuất JSON" ở trang Thu chi tải file chứa dữ liệu lấy từ toàn bộ nguồn lưu trữ bền vững đã lưu trong hệ thống (mọi tháng, danh mục, giao dịch, item cần mua), tại thời điểm bấm nút
- Giữ nguyên hành vi tải file thủ công về máy hiện có, giữ nguyên định dạng JSON

## 4. Ngoài Phạm Vi

- Đổi cấu trúc dữ liệu trong file JSON, đổi tên file, hay đổi cách Dylan tải file
- Xuất sang định dạng khác ngoài JSON
- Tích hợp gửi dữ liệu tới một hệ thống ngoài — Dylan vẫn tự tải file thủ công về máy như hiện tại

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xuất dữ liệu JSON chứa toàn bộ dữ liệu đã lưu bền vững | Không có ràng buộc riêng — hệ thống chỉ phục vụ một mình Dylan | `docs/memory/decisions.md#dec-004` |

## 6. Luồng Nghiệp Vụ

1. Dylan mở trang Thu chi.
2. Dylan bấm nút "Xuất JSON".
3. File JSON tải về máy chứa dữ liệu lấy từ toàn bộ nguồn lưu trữ bền vững trong hệ thống tại thời điểm bấm nút — không thiếu tháng, danh mục, giao dịch hay item cần mua nào đã lưu.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Chưa có tháng ngân sách nào được tạo trong hệ thống — file JSON tải về vẫn có cấu trúc hợp lệ, chỉ chứa danh sách tháng rỗng |
| Không đủ quyền | Không áp dụng — Dylan là người dùng duy nhất của hệ thống, không có ràng buộc phân quyền riêng cho việc xuất dữ liệu |
| Dữ liệu trùng | Không áp dụng — yêu cầu này chỉ đổi nguồn dữ liệu xuất, không tạo hay đổi tên bản ghi nào |
| Hệ thống lỗi | Không áp dụng — yêu cầu này không đổi cách trang xử lý lỗi tải dữ liệu hiện có |

## 7. Tiêu Chí Chấp Nhận

Mỗi dòng là một tiêu chí kiểm chứng được bằng thao tác thật trên màn hình.

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Hệ thống đã lưu bền vững nhiều tháng ngân sách, mỗi tháng có danh mục và giao dịch riêng | Dylan mở trang Thu chi, bấm "Xuất JSON" | File JSON tải về chứa đủ đúng số tháng, danh mục, và giao dịch đã lưu trong hệ thống, khớp 100% với dữ liệu hiển thị trên các bảng của trang | Xem ASCII Mockup mục 8.1 |
| AC-02 | Tháng hiện tại đang có item cần mua (cả Pending lẫn Purchased) | Dylan bấm "Xuất JSON" | File JSON tải về có chứa đủ danh sách item cần mua của tháng đó, đúng tên, giá, trạng thái đã lưu | Xem ASCII Mockup mục 8.1 |
| AC-03 | Dylan vừa tải lại trang Thu chi (chưa thao tác gì khác), hệ thống đang có 5 tháng ngân sách đã lưu bền vững, trong đó có tháng không phải tháng hiện tại cũng đang có item cần mua | Dylan bấm ngay "Xuất JSON" | File JSON tải về chứa đúng cả 5 tháng đã lưu, kể cả item cần mua của những tháng không phải tháng hiện tại — không thiếu tháng, danh mục, giao dịch hay item cần mua nào, không phụ thuộc việc Dylan đã thao tác gì trước đó trên trang | Xem ASCII Mockup mục 8.1 |
| AC-04 | Hệ thống chưa có tháng ngân sách nào được tạo (dữ liệu trống) | Dylan bấm "Xuất JSON" | File JSON vẫn tải về thành công, có cấu trúc hợp lệ, chỉ chứa danh sách tháng rỗng — không báo lỗi | Xem ASCII Mockup mục 8.1 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup ảnh/design thật cho requirement này — mọi dòng đều tham chiếu khối ASCII Mockup tương ứng ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

### 8.1. Nút Xuất JSON — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Nút Xuất JSON | Button | Xuất JSON | Toàn bộ tháng ngân sách, danh mục, giao dịch, item cần mua đã lưu bền vững trong hệ thống | **Bổ sung ràng buộc so với hiện tại**: file tải về phải chứa dữ liệu lấy từ toàn bộ nguồn lưu trữ bền vững, không chỉ dữ liệu có sẵn trong bộ nhớ tạm của trình duyệt tại thời điểm bấm; giữ nguyên hành vi tải file JSON thủ công về máy đã có | Dylan | AC-01, AC-02, AC-03, AC-04 | Không |

**ASCII Mockup**

```text
+----------------------------------------------------------+
| [ Thêm danh mục ]  [ Reset chi tháng này ]  [ Xuất JSON ] |
+----------------------------------------------------------+
  Bấm "Xuất JSON" -> tải về file .json chứa toàn bộ dữ liệu
  đã lưu bền vững (mọi tháng, danh mục, giao dịch, item cần
  mua) — không chỉ dữ liệu đang có trong bộ nhớ tạm trình
  duyệt (AC-01, AC-02, AC-03, AC-04)
```

Mockup minh họa đúng AC-01 đến AC-04: nút "Xuất JSON" nằm cùng khu vực hành động của bảng ngân sách, bấm vào tải về file chứa toàn bộ dữ liệu bền vững, kể cả khi vừa tải lại trang hoặc khi chưa có dữ liệu nào.

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Button`: nêu rõ điều kiện bật/tắt và điều gì xảy ra sau khi bấm.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Xuất dữ liệu JSON | Sửa — đổi nguồn dữ liệu đóng gói sang toàn bộ dữ liệu bền vững, giữ nguyên định dạng và cách tải file | Có | File tải về máy Dylan, không lưu lại phía hệ thống |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — cần cấu trúc dữ liệu bền vững để có nguồn xuất đầy đủ | Delivered With Notes |

## 11. Tác Động Tới Spec Khác

Không có phụ thuộc — đã tìm trong toàn bộ spec đã có (`US-001`..`US-020`) theo từ vựng "xuất", "JSON", "export": không có spec nào khác mô tả hoặc dùng chung Screen Element `EL-01` của requirement này.

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-008-xuat-du-lieu-ben-vung.md`](../../kb/ba/wiki/knowledge/feature/US-008-xuat-du-lieu-ben-vung.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-008-xuat-du-lieu-ben-vung.md`](../../kb/ba/wiki/delivery/pbi/US-008-xuat-du-lieu-ben-vung.md) | Điền đầy đủ User Story và 4 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory cần ghi: Không có quyết định mới cần ghi — raw không còn câu hỏi mở nào chặn spec. Không phát sinh thuật ngữ nghiệp vụ mới — `glossary.md` không cần cập nhật.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi — nút "Xuất JSON" |
| Thực thể dữ liệu nào bị chạm | Tháng ngân sách, danh mục, giao dịch, item cần mua — chỉ đọc |
| Cần thay đổi cấu trúc dữ liệu | Không |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Có — đây chính là yêu cầu về export |

## 14. Giả Định Và Câu Hỏi Mở

Không có — raw không còn câu hỏi mở nào chặn spec (mục 4 raw: "Không còn câu hỏi chặn spec — đây chỉ là đổi nguồn đọc dữ liệu, từ bộ nhớ tạm trình duyệt sang cơ sở dữ liệu bền vững, cho tính năng xuất JSON đã có sẵn, không đổi định dạng hay hành vi tải file").
