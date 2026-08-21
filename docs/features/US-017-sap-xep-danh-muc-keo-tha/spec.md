# Sắp xếp vị trí danh mục bằng kéo thả (Drag-and-drop row reordering)

Status: Ready for DEV
Feature: US-017
Created: 2026-08-12
Updated: 2026-08-12
Raw Source: `docs/kb/ba/raw/US-017-sap-xep-danh-muc-keo-tha.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, thứ tự các danh mục trong bảng ngân sách hoàn toàn thụ động — Dylan không có cách nào tự sắp xếp lại vị trí hiển thị, thứ tự chỉ phản ánh đúng lúc từng danh mục được tạo ra. Sau thay đổi này, Dylan kéo thả trực tiếp một dòng danh mục trên bảng để đổi vị trí của nó, giúp nhóm hoặc sắp xếp các danh mục theo mức độ quan trọng hay thói quen theo dõi cá nhân, thay vì bị ràng buộc theo thứ tự tạo. Mã function của dự án dùng tiền tố US (viết tắt của "User Story") ghép số thứ tự; mọi quyết định user chốt được ghi lại bằng mã DEC (viết tắt của "Decision") trong nhật ký quyết định của dự án.

Giá trị đo được: Dylan kéo dòng "Ăn uống" từ vị trí thứ ba lên vị trí đầu tiên trên bảng ngân sách, sau đó tải lại trang — "Ăn uống" vẫn hiển thị ở vị trí đầu tiên, và dropdown "Danh mục nhận diện" cũng như biểu đồ "Cơ cấu chi tiêu" đều hiển thị đúng thứ tự mới đó.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md`](../../kb/ba/wiki/knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md) | Mục tiêu, phạm vi, luồng nghiệp vụ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md`](../../kb/ba/wiki/knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md) | Rule thứ tự kéo thả lưu bền vững, đồng bộ 3 nơi, danh mục khóa vẫn kéo thả được |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md`](../../kb/ba/wiki/knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) | Rule "Chi tiêu khác" luôn ở cuối — kéo thả không đổi luật này |
| [`docs/kb/ba/wiki/data/entity/ENT-002-danh-muc.md`](../../kb/ba/wiki/data/entity/ENT-002-danh-muc.md) | Ràng buộc của thực thể Danh mục |
| [`docs/kb/ba/wiki/knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../../kb/ba/wiki/knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Mục tiêu epic, thuộc luồng F2 |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, luồng F2 |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md` (`DEC-004`, `DEC-066`, `DEC-074`, `DEC-075`, `DEC-076`, `DEC-077`, `DEC-078`), `glossary.md`.

## 3. Phạm Vi

- Dylan kéo thả một dòng danh mục trong bảng ngân sách để đổi vị trí hiển thị của nó so với các danh mục khác
- Thứ tự mới được lưu lại và giữ nguyên qua các lần tải lại trang, đổi tháng, mở lại sau này
- Thứ tự mới áp dụng đồng bộ cho cả 3 nơi dùng chung danh sách danh mục: bảng ngân sách, dropdown "Danh mục nhận diện" ở khu nhập nhanh, và biểu đồ "Cơ cấu chi tiêu"
- Danh mục "khóa" (ví dụ "Tiền nhà") vẫn kéo thả đổi vị trí được bình thường như danh mục khác
- Khi Dylan tạo tháng mới bằng nút "Clone tháng đang xem" (sao chép danh mục từ tháng nguồn), thứ tự danh mục ở tháng mới giữ nguyên đúng theo thứ tự của tháng nguồn

## 4. Ngoài Phạm Vi

- Danh mục "Chi tiêu khác" không tham gia kéo thả — tiếp tục luôn cố định ở vị trí cuối bảng, không đổi so với quy định đã có
- Đổi tên cột, đổi công thức tính, hay bất kỳ thay đổi nào khác của bảng ngân sách ngoài vị trí hiển thị của các dòng
- Chọn công cụ hoặc cách hiện thực kéo thả cụ thể, và thiết kế chỗ lưu thứ tự trong cấu trúc dữ liệu — thuộc phạm vi lập kế hoạch kỹ thuật, không phải nội dung nghiệp vụ của spec này
- Cập nhật lại mô tả nút "Clone tháng đang xem" trong spec riêng của nghiệp vụ tạo tháng — chỉ ghi nhận là việc cần làm tiếp theo ở mục 11, không sửa trực tiếp spec đó trong lượt này

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Kéo thả đổi vị trí danh mục thường và danh mục khóa | Không kéo thả được dòng "Chi tiêu khác" | `docs/memory/decisions.md#dec-004`, `docs/memory/decisions.md#dec-076` |

## 6. Luồng Nghiệp Vụ

1. Dylan mở bảng danh mục tại trang Thu chi.
2. Dylan nhấn giữ vào một dòng danh mục (trừ "Chi tiêu khác") và kéo tới vị trí mới trong bảng.
3. Dylan thả dòng — thứ tự các danh mục trong bảng cập nhật ngay theo vị trí mới.
4. Thứ tự mới được lưu lại; dropdown "Danh mục nhận diện" và biểu đồ "Cơ cấu chi tiêu" tự động hiển thị đúng thứ tự mới.
5. Nếu "Chi tiêu khác" đang hiển thị, nó tiếp tục nằm ở dòng cuối cùng, không bị xáo trộn bởi thao tác kéo thả của các danh mục khác.
6. Khi Dylan bấm nút "Clone tháng đang xem" để tạo tháng mới sao chép từ tháng đang xem, các danh mục ở tháng mới xuất hiện theo đúng thứ tự đã có ở tháng nguồn.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Dylan thử kéo dòng "Chi tiêu khác" | Dòng này không phản hồi thao tác kéo thả, vẫn giữ nguyên ở vị trí cuối cùng |
| Không đủ quyền | Không áp dụng — Dylan là người dùng duy nhất của hệ thống, không có ràng buộc phân quyền riêng cho thao tác này |
| Dữ liệu trùng | Không áp dụng — kéo thả chỉ đổi vị trí, không tạo hay đổi tên danh mục nào |
| Hệ thống lỗi khi lưu thứ tự mới | Bảng giữ nguyên thứ tự trước khi kéo thả cho tới khi Dylan thử lại thành công — không có danh mục nào bị mất vị trí vì lỗi lưu |

## 7. Tiêu Chí Chấp Nhận

Mỗi dòng là một tiêu chí kiểm chứng được bằng thao tác thật trên màn hình.

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Bảng ngân sách của tháng đang xem có 4 danh mục thường theo thứ tự: "Tiền nhà", "Ăn uống", "Di chuyển", "Giải trí" | Dylan kéo dòng "Di chuyển" lên vị trí đầu tiên và thả | Bảng hiển thị ngay thứ tự mới: "Di chuyển", "Tiền nhà", "Ăn uống", "Giải trí" | Xem ASCII Mockup mục 8.1 |
| AC-02 | Đang ở tình huống AC-01, vừa kéo thả xong | Dylan tải lại trang Thu chi | Bảng vẫn hiển thị đúng thứ tự vừa kéo thả: "Di chuyển", "Tiền nhà", "Ăn uống", "Giải trí" — không quay về thứ tự cũ | Xem ASCII Mockup mục 8.1 |
| AC-03 | Đang ở tình huống AC-01, vừa kéo thả xong | Dylan mở dropdown "Danh mục nhận diện" ở khu nhập nhanh chi tiêu | Danh sách lựa chọn trong dropdown hiển thị đúng thứ tự mới: "Di chuyển", "Tiền nhà", "Ăn uống", "Giải trí" | Xem ASCII Mockup mục 8.2 |
| AC-04 | Đang ở tình huống AC-01, vừa kéo thả xong | Dylan xem biểu đồ "Cơ cấu chi tiêu" | Thứ tự các danh mục trong biểu đồ khớp đúng thứ tự mới: "Di chuyển", "Tiền nhà", "Ăn uống", "Giải trí" | Xem ASCII Mockup mục 8.3 |
| AC-05 | Bảng ngân sách có danh mục "Tiền nhà" đang ở trạng thái khóa (không có nút xóa) | Dylan kéo dòng "Tiền nhà" tới một vị trí khác trong bảng và thả | Dòng "Tiền nhà" đổi sang vị trí mới thành công, giống như kéo thả một danh mục thường | Xem ASCII Mockup mục 8.1 |
| AC-06 | Tháng đang xem có "Chi tiêu khác" đang hiển thị (còn giao dịch) ở dòng cuối cùng, cộng 3 danh mục thường phía trên | Dylan thử nhấn giữ và kéo dòng "Chi tiêu khác" | Dòng "Chi tiêu khác" không di chuyển theo thao tác kéo, vẫn giữ nguyên ở vị trí cuối cùng | Xem ASCII Mockup mục 8.1 |
| AC-07 | Tháng nguồn đang xem có 3 danh mục theo thứ tự đã kéo thả: "Di chuyển", "Tiền nhà", "Ăn uống" | Dylan bấm nút "Clone tháng đang xem" để tạo tháng mới | Tháng mới được tạo với 3 danh mục xuất hiện đúng theo thứ tự của tháng nguồn: "Di chuyển", "Tiền nhà", "Ăn uống" | Xem ASCII Mockup mục 8.4 |
| AC-08 | Bảng ngân sách đang hiển thị đúng thứ tự hiện tại của các danh mục, và lần lưu thứ tự kế tiếp sẽ gặp lỗi (ví dụ mất kết nối tạm thời) | Dylan kéo một dòng danh mục sang vị trí mới và thả | Bảng vẫn hiển thị đúng thứ tự trước khi kéo thả — không danh mục nào bị mất vị trí; thứ tự chỉ đổi khi Dylan thử kéo thả lại và lưu thành công | Xem ASCII Mockup mục 8.1 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup ảnh/design thật cho requirement này — mọi dòng đều tham chiếu khối ASCII Mockup tương ứng ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

### 8.1. Bảng ngân sách theo danh mục — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Tay cầm kéo thả | Column | (không có chữ, chỉ biểu tượng kéo) | Không có — chỉ tương tác giao diện | **Thành phần mới**: xuất hiện ở đầu mỗi dòng danh mục thường và danh mục khóa; không xuất hiện ở dòng "Chi tiêu khác". Dylan giữ và kéo biểu tượng này để đổi vị trí dòng đó | Dylan | AC-01, AC-05, AC-06 | Không |
| EL-02 | Dòng danh mục thường/khóa | Table | (tên danh mục hiện có, ví dụ "Tiền nhà") | Danh sách danh mục của tháng đang chọn | **Bổ sung ràng buộc thứ tự so với hiện tại**: thứ tự dòng phản ánh đúng thứ tự Dylan đã kéo thả gần nhất, cập nhật ngay khi thả xong, giữ nguyên qua các lần tải lại trang — trước đây thứ tự chỉ theo đúng thời điểm tạo, không đổi được | Dylan | AC-01, AC-02, AC-05, AC-08 | Không — `US-014` (`EL-01`) và `US-005` (`EL-02`) chỉ mô tả riêng dòng "Chi tiêu khác" (xem `EL-03` bên dưới), không phải dòng danh mục thường/khóa |
| EL-03 | Dòng danh mục "Chi tiêu khác" | Table | Chi tiêu khác | Danh mục dự phòng của tháng đang chọn | **Bổ sung ràng buộc so với hiện tại**: không có Tay cầm kéo thả (`EL-01`) ở dòng này, không phản hồi thao tác kéo; tiếp tục luôn ở vị trí cuối cùng khi đang hiển thị, không đổi so với quy định đã có | Dylan | AC-06 | [`US-014`](../US-014-chi-tieu-khac-cuoi-bang/spec.md) — cùng element `EL-01`, [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) — cùng element `EL-02` |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| ⠿ Danh mục          Loại      Ngân sách   Chi thực tế  Còn lại  |
| ⠿ Di chuyển         Cố định   1.500.000   900.000      600.000  |  <- kéo lên đây (AC-01)
| ⠿ Tiền nhà          Cố định   7.500.000   7.500.000    0        |
| ⠿ Ăn uống           Linh hoạt 4.000.000   3.200.000    800.000  |
|   Chi tiêu khác     —         —           250.000      —        |  <- không có tay cầm (AC-06)
+----------------------------------------------------------------+
```

Mockup minh họa đúng AC-01/AC-02/AC-05/AC-06: biểu tượng "⠿" ở đầu mỗi dòng là Tay cầm kéo thả (`EL-01`), xuất hiện ở mọi danh mục thường và danh mục khóa nhưng không xuất hiện ở dòng "Chi tiêu khác".

### 8.2. Ô nhập nhanh chi tiêu — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-04 | Dropdown Danh mục nhận diện | Dropdown | Danh mục nhận diện | Danh sách danh mục của tháng đang chọn, cộng một lựa chọn trống | **Bổ sung ràng buộc thứ tự so với hiện tại**: thứ tự các lựa chọn phản ánh đúng thứ tự đã kéo thả trên bảng ngân sách (`EL-02`); "Chi tiêu khác" vẫn luôn là lựa chọn cuối cùng (đã chốt ở `US-014`). Hành vi chọn/gán danh mục và giá trị mặc định giữ nguyên như đã có | Dylan | AC-03 | [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) — cùng element `EL-01`, [`US-014`](../US-014-chi-tieu-khac-cuoi-bang/spec.md) — cùng element `EL-02` |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| Nội dung: [xe buýt 20k________]  Danh mục: [Di chuyển        v]|
|                                              — Chưa xác định —  |
|                                              Di chuyển           |
|                                              Tiền nhà             |
|                                              Ăn uống              |
|                                              Chi tiêu khác  <- cuối|
|                                                    [Ghi nhận]     |
+----------------------------------------------------------------+
```

Mockup minh họa đúng AC-03: thứ tự các lựa chọn trong dropdown khớp đúng thứ tự vừa kéo thả trên bảng.

### 8.3. Biểu đồ cơ cấu chi tiêu — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-05 | Biểu đồ Cơ cấu chi tiêu theo danh mục | Table | Cơ cấu chi tiêu | Cùng danh sách danh mục dùng ở `EL-02`/`EL-04` | **Bổ sung ràng buộc thứ tự so với hiện tại**: thứ tự cột/thanh phản ánh đúng thứ tự đã kéo thả trên bảng ngân sách; "Chi tiêu khác" vẫn luôn ở cuối (đã chốt ở `US-014`). Về hình thức, đây là biểu đồ cột chứ không phải bảng dữ liệu; Loại được gán tạm là `Table` vì bảng "Loại hợp lệ" hiện có của kit chưa có mục dành cho biểu đồ | Dylan | AC-04 | [`US-014`](../US-014-chi-tieu-khac-cuoi-bang/spec.md) — cùng element `EL-03` |

**ASCII Mockup**

```text
+--------------------------------------------------------+
| Cơ cấu chi tiêu                                          |
| [Di chuyển] [Tiền nhà] [Ăn uống] [Chi tiêu khác] <- cuối |
+--------------------------------------------------------+
```

Mockup minh họa đúng AC-04: thứ tự cột trong biểu đồ khớp đúng thứ tự vừa kéo thả trên bảng.

### 8.4. Khu vực tạo tháng mới — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-06 | Nút Clone tháng đang xem | Button | Clone tháng đang xem | Không có | **Bổ sung hành vi so với hiện tại**: khi tạo tháng mới bằng nút này, các danh mục ở tháng mới xuất hiện đúng theo thứ tự của tháng nguồn — trước đây chỉ sao chép tên/loại/ngân sách/trạng thái khóa, chưa có khái niệm thứ tự riêng để sao chép. Điều kiện bật/tắt và các hành vi khác của nút giữ nguyên như đã có | Dylan | AC-07 | [`US-006`](../US-006-canh-bao-trung-thang/spec.md) — cùng element `EL-04` |

**ASCII Mockup**

```text
+----------------------------------------------------------+
| Tạo tháng mới                                             |
| Kỳ tháng: [2026-09              v]                        |
| [ Tạo tháng ]   [ Clone tháng đang xem ]                  |
+----------------------------------------------------------+
   Bấm "Clone tháng đang xem" -> tháng mới có danh mục theo
   đúng thứ tự đã kéo thả ở tháng nguồn (AC-07)
```

Mockup minh họa đúng AC-07: bấm "Clone tháng đang xem" tạo tháng mới với thứ tự danh mục giữ nguyên theo tháng nguồn.

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định.
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Button`: nêu rõ điều kiện bật/tắt và điều gì xảy ra sau khi bấm.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Danh mục | Sửa — cần thêm một thuộc tính lưu vị trí hiển thị của mỗi danh mục trong tháng đang thuộc về | Có | Giá trị vị trí cập nhật mỗi lần Dylan kéo thả; tên và kiểu dữ liệu cụ thể của thuộc tính này do bước lập kế hoạch kỹ thuật quyết định |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng (US-008), chưa triển khai |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã Delivered) — cần cấu trúc dữ liệu Danh mục bền vững để lưu vị trí sau kéo thả | Delivered With Notes |
| [`US-014`](../US-014-chi-tieu-khac-cuoi-bang/spec.md) | Quy tắc nghiệp vụ | Không (đã Ready for DEV) — US-017 phải tôn trọng luật "Chi tiêu khác" luôn ở cuối đã chốt ở đây | Ready for DEV |
| [`US-006`](../US-006-canh-bao-trung-thang/spec.md) | Quy tắc nghiệp vụ + Screen Element dùng chung (`EL-04`) | Không (đã Ready for DEV) — AC-07 phụ thuộc nút "Clone tháng đang xem" đã có sẵn | Ready for DEV |
| [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Screen Element dùng chung (`EL-01`, `EL-02`) | Không (đã Ready for DEV) | Ready for DEV |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Mục 8 | `EL-01`, `EL-02` | Không | Không — US-017 chỉ đổi thứ tự hiển thị, không đổi hành vi chọn/gán danh mục đã mô tả ở đó |
| [`US-014`](../US-014-chi-tieu-khac-cuoi-bang/spec.md) | Mục 8 | `EL-01`, `EL-02`, `EL-03` | Không | Không — US-017 chỉ bổ sung khả năng Dylan tự sắp xếp các danh mục thường, không đổi ý định "Chi tiêu khác" luôn ở cuối đã chốt ở đó |
| [`US-006`](../US-006-canh-bao-trung-thang/spec.md) | Mục 8 | `EL-04` | Không | Cần bổ sung dòng ràng buộc thứ tự vào mục 8 (`EL-04`) của spec đó ở lượt cập nhật tiếp theo — `ssr-ba` không sửa trực tiếp spec của feature khác trong lượt này (`DEC-078`) |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md`](../../kb/ba/wiki/knowledge/feature/US-017-sap-xep-danh-muc-keo-tha.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-017-sap-xep-danh-muc-keo-tha.md`](../../kb/ba/wiki/delivery/pbi/US-017-sap-xep-danh-muc-keo-tha.md) | Điền đầy đủ User Story và 8 AC từ spec này (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md`](../../kb/ba/wiki/knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md) | Xóa nhãn `Cần user xác nhận` ở mục 4 — đã chốt bằng `DEC-078` |

Memory cần ghi: quyết định Clone tháng giữ thứ tự theo tháng nguồn đã ghi vào `decisions.md` (`DEC-078`) trong lúc mở dialog bước 14. Không phát sinh thuật ngữ nghiệp vụ mới — `glossary.md` không cần cập nhật.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi — bảng ngân sách theo danh mục, ô "Danh mục nhận diện" ở khu nhập nhanh, biểu đồ "Cơ cấu chi tiêu", khu vực tạo tháng mới (nút "Clone tháng đang xem") |
| Thực thể dữ liệu nào bị chạm | Danh mục — cần thêm một thuộc tính lưu vị trí hiển thị |
| Cần thay đổi cấu trúc dữ liệu | Có |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Có |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Thứ tự sau khi kéo thả lưu lại vào dữ liệu, không chỉ đổi tạm trên giao diện | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-12 (`DEC-074`) | Nếu sai, thứ tự sẽ mất khi tải lại trang — ảnh hưởng AC-02 |
| A2 | Danh mục khóa vẫn kéo thả đổi vị trí được như danh mục thường | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-12 (`DEC-075`) | Nếu sai, cần thêm giao diện phân biệt danh mục kéo được/không kéo được — ảnh hưởng AC-05, `EL-01` |
| A3 | "Chi tiêu khác" tiếp tục luôn cố định ở cuối, không tham gia kéo thả | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-12 (`DEC-076`) | Nếu sai, sẽ đảo ngược quy tắc đã chốt ở US-014 — ảnh hưởng AC-06, `EL-01`, `EL-03` |
| A4 | Thứ tự sau kéo thả đồng bộ sang cả 3 nơi dùng chung danh sách danh mục | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-12 (`DEC-077`) | Nếu sai, cần tách riêng nguồn dữ liệu cho từng nơi hiển thị — ảnh hưởng AC-03, AC-04, `EL-04`, `EL-05` |
| A5 | Khi tạo tháng mới bằng "Clone tháng đang xem", thứ tự danh mục giữ nguyên theo tháng nguồn | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-12 (`DEC-078`) | Nếu sai, Dylan phải kéo thả sắp xếp lại từ đầu mỗi khi tạo tháng mới bằng Clone — ảnh hưởng AC-07, `EL-06` |
