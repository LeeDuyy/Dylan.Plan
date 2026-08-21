# Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục

Status: Ready for DEV
Feature: US-014
Created: 2026-08-10
Updated: 2026-08-10
Raw Source: `docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Hiện tại, danh mục "Chi tiêu khác" (danh mục dự phòng, tự sinh khi Dylan bỏ qua chọn danh mục hoặc khi danh mục cha của một giao dịch bị xóa) hiển thị theo đúng thời điểm nó được tạo ra — không có vị trí cố định. Vì "Chi tiêu khác" thường được tạo ra giữa vòng đời một tháng, nếu Dylan thêm danh mục mới sau thời điểm đó, danh mục mới sẽ xuất hiện sau "Chi tiêu khác" trong danh sách, khiến "Chi tiêu khác" không nằm ở cuối như một danh mục dự phòng nên có.

Sau thay đổi này, "Chi tiêu khác" (khi đang hiển thị — tức đang có ít nhất một giao dịch gán vào nó) luôn nằm ở vị trí cuối cùng trong danh sách danh mục, bất kể nó được tạo ra vào lúc nào. Các danh mục còn lại giữ nguyên thứ tự tương đối đã có với nhau.

Giá trị đo được: Dylan mở trang Thu chi ở một tháng đang có "Chi tiêu khác" hiển thị và vừa thêm một danh mục mới — danh mục mới nằm trước "Chi tiêu khác" trong bảng, "Chi tiêu khác" vẫn ở dòng cuối cùng. Không còn tình huống "Chi tiêu khác" nằm giữa các danh mục khác.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md`](../../kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md) | Mục tiêu, phạm vi, luồng nghiệp vụ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md`](../../kb/ba/wiki/knowledge/business-rule/BR-016-chi-tieu-khac-cuoi-bang.md) | Rule sắp xếp "Chi tiêu khác" luôn ở cuối |
| [`docs/kb/ba/wiki/data/entity/ENT-002-danh-muc.md`](../../kb/ba/wiki/data/entity/ENT-002-danh-muc.md) | Ràng buộc của thực thể Danh mục, gồm "Chi tiêu khác" |
| [`docs/kb/ba/wiki/knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md`](../../kb/ba/wiki/knowledge/epic/EPC-002-lap-dieu-chinh-ngan-sach.md) | Mục tiêu epic, thuộc luồng F2 |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, luồng F2 |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md` (lưu các quyết định đã chốt với user, gọi bằng mã DEC (viết tắt của "Decision") — cụ thể là `DEC-004`, `DEC-007`, `DEC-026`, `DEC-027`, `DEC-029`, `DEC-066`), `glossary.md`.

## 3. Phạm Vi

- "Chi tiêu khác" (khi đang hiển thị) luôn nằm ở dòng cuối cùng trong bảng danh mục ở trang Thu chi, bất kể thời điểm nó được tạo
- Áp dụng nhất quán ở mọi nơi hiển thị lại đúng danh sách danh mục đó: bảng ngân sách, ô chọn danh mục ở khu nhập nhanh, và biểu đồ "Cơ cấu chi tiêu" (hệ quả tự nhiên vì cả ba nơi cùng dùng lại một danh sách danh mục duy nhất)
- Các danh mục còn lại (không phải "Chi tiêu khác") giữ nguyên thứ tự tương đối đã có với nhau

## 4. Ngoài Phạm Vi

- Sắp xếp lại các danh mục còn lại theo bất kỳ tiêu chí nào khác (tên, loại, ngân sách...) — không thuộc yêu cầu này
- Đổi thời điểm sinh, điều kiện ẩn/hiện, hay quyền chỉnh sửa của "Chi tiêu khác" — giữ nguyên như đã có (mã function của dự án dùng tiền tố US (viết tắt của "User Story") ghép số thứ tự; hành vi này đã chốt ở `US-005`)

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem danh sách danh mục với "Chi tiêu khác" luôn ở cuối khi đang hiển thị | Không có ràng buộc riêng — không đổi phân quyền | `docs/memory/decisions.md#dec-004` |

## 6. Luồng Nghiệp Vụ

1. Dylan mở trang Thu chi, đang xem một tháng đã có "Chi tiêu khác" hiển thị (còn giao dịch gán vào nó) và có sẵn một số danh mục thường khác.
2. Hệ thống hiển thị danh sách danh mục: các danh mục thường theo đúng thứ tự tương đối đã có, "Chi tiêu khác" luôn ở vị trí cuối cùng.
3. Dylan bấm "Thêm danh mục" để thêm một danh mục mới.
4. Danh mục mới xuất hiện ngay trước "Chi tiêu khác" trong danh sách — "Chi tiêu khác" vẫn giữ nguyên vị trí cuối cùng.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Tháng đang xem chưa từng phát sinh nhu cầu dùng "Chi tiêu khác" (chưa có giao dịch nào cần gán vào nó) | Không có dòng "Chi tiêu khác" nào trong danh sách; thứ tự các danh mục còn lại không đổi so với trước |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Tháng đang xem có "Chi tiêu khác" đang hiển thị (còn giao dịch) và có 3 danh mục thường khác | Dylan mở bảng ngân sách theo danh mục | "Chi tiêu khác" hiển thị ở dòng cuối cùng của bảng; 3 danh mục thường còn lại theo đúng thứ tự tương đối đã có trước đó | Chưa có mockup ảnh/design thật; xem ASCII mockup minh họa đúng trạng thái này ở mục 8.1 |
| AC-02 | Đang ở tình huống AC-01 | Dylan bấm "Thêm danh mục" để thêm một danh mục mới tên "Danh mục mới" | Danh mục "Danh mục mới" xuất hiện ngay trước "Chi tiêu khác" trong bảng; "Chi tiêu khác" vẫn ở dòng cuối cùng | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-03 | Tháng đang xem chưa từng phát sinh nhu cầu dùng "Chi tiêu khác" — không có giao dịch nào gán vào nó | Dylan mở bảng ngân sách theo danh mục | Không có dòng "Chi tiêu khác" nào trong bảng; thứ tự các danh mục còn lại giữ nguyên như trước khi có thay đổi này | Chưa có — xem mô tả hành vi ở mục 6 |
| AC-04 | Đang ở tình huống AC-01 | Dylan mở ô "Danh mục nhận diện" ở khu nhập nhanh chi tiêu | "Chi tiêu khác" xuất hiện ở cuối danh sách lựa chọn trong ô này, sau 3 danh mục thường | Chưa có mockup ảnh/design thật; xem ASCII mockup minh họa đúng trạng thái này ở mục 8.2 |
| AC-05 | Đang ở tình huống AC-01 | Dylan xem biểu đồ "Cơ cấu chi tiêu" | Danh mục "Chi tiêu khác" nằm ở vị trí cuối cùng trong biểu đồ, sau 3 danh mục thường còn lại | Chưa có — xem mô tả hành vi ở mục 8.3 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì ghi rõ lý do.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

### 8.1. Bảng ngân sách theo danh mục — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Dòng danh mục "Chi tiêu khác" | Table | Chi tiêu khác | Danh mục dự phòng của tháng đang chọn | **Bổ sung ràng buộc thứ tự so với hiện tại**: khi đang hiển thị (còn giao dịch gán vào nó), luôn là dòng cuối cùng trong bảng, không phụ thuộc thời điểm được tạo — trước đây không có ràng buộc thứ tự nào. Các hành vi khác (chỉ đọc, không nút xóa, tự ẩn khi hết giao dịch) giữ nguyên như đã có | Dylan | AC-01, AC-02, AC-03 | [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) — cùng element `EL-02` |

**ASCII Mockup**

```text
+--------------------------------------------------------------+
| Danh mục          Loại      Ngân sách   Chi thực tế  Còn lại  |
| Tiền nhà          Cố định   7.500.000   7.500.000    0        |
| Ăn uống           Linh hoạt 4.000.000   3.200.000    800.000  |
| Di chuyển         Linh hoạt 1.500.000   900.000      600.000  |
| Chi tiêu khác     —         —           250.000      —        |  <- luôn ở cuối
+--------------------------------------------------------------+
```

Mockup minh họa đúng AC-01/AC-02: dù "Chi tiêu khác" được tạo ra ở thời điểm nào, nó luôn nằm ở dòng cuối cùng; các danh mục thường giữ nguyên thứ tự tương đối.

### 8.2. Ô nhập nhanh chi tiêu — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-02 | Dropdown Danh mục nhận diện | Dropdown | Danh mục nhận diện | Danh sách danh mục của tháng đang chọn, cộng một lựa chọn trống | **Bổ sung ràng buộc thứ tự so với hiện tại**: "Chi tiêu khác" (khi đang hiển thị) luôn là lựa chọn cuối cùng trong danh sách, sau lựa chọn trống và mọi danh mục thường — trước đây không có ràng buộc thứ tự nào. Hành vi chọn/gán danh mục giữ nguyên như đã có: giá trị mặc định là lựa chọn trống khi nội dung nhập nhanh không khớp từ khóa danh mục nào (đã chốt ở `US-005` `EL-01`), US-014 không đổi hành vi này | Dylan | AC-04 | [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) — cùng element `EL-01` |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| Nội dung: [ăn tối 300k________]  Danh mục: [Ăn uống          v]|
|                                              — Chưa xác định —  |
|                                              Tiền nhà            |
|                                              Ăn uống             |
|                                              Di chuyển            |
|                                              Chi tiêu khác  <- cuối|
|                                                    [Ghi nhận]     |
+----------------------------------------------------------------+
```

Mockup minh họa đúng AC-04: "Chi tiêu khác" luôn là lựa chọn cuối cùng trong danh sách dropdown.

### 8.3. Biểu đồ cơ cấu chi tiêu — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-03 | Biểu đồ Cơ cấu chi tiêu theo danh mục | Table | Cơ cấu chi tiêu | Cùng danh sách danh mục dùng ở `EL-01`/`EL-02` | **Bổ sung ràng buộc thứ tự so với hiện tại**: "Chi tiêu khác" (khi đang hiển thị) luôn ở vị trí cuối cùng trong biểu đồ — trước đây không có ràng buộc thứ tự nào. Chưa có mô tả spec nào khác cho biểu đồ này trước US-014. Về hình thức, đây là biểu đồ cột chứ không phải bảng dữ liệu; Loại được gán tạm là `Table` vì bảng "Loại hợp lệ" hiện có của kit chưa có mục dành cho biểu đồ — đây là lựa chọn gần đúng nhất trong danh sách hiện có | Dylan | AC-05 | Không |

**ASCII Mockup**

```text
+--------------------------------------------------------+
| Cơ cấu chi tiêu                                          |
| [Tiền nhà] [Ăn uống] [Di chuyển] [Chi tiêu khác] <- cuối |
+--------------------------------------------------------+
```

Mockup minh họa đúng AC-05: cột/thanh của "Chi tiêu khác" luôn nằm cuối cùng trong biểu đồ.

Quy tắc:

- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Danh mục | Không đổi cấu trúc lưu trữ — chỉ đổi thứ tự hiển thị trên giao diện | Không | Không lưu thêm dữ liệu nào |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) | Dữ liệu + Screen Element dùng chung (`EL-01`, `EL-02` của US-005) | Không (đã `Ready for DEV`) — cần hành vi sinh/ẩn-hiện "Chi tiêu khác" đã có sẵn | Ready for DEV |

## 11. Tác Động Tới Spec Khác

[`US-005`](../US-005-rang-buoc-toan-ven-danh-muc/spec.md) mục 8 mô tả `EL-01` (dropdown Danh mục nhận diện) và `EL-02` (dòng "Chi tiêu khác" trong bảng) — US-014 bổ sung ràng buộc thứ tự cho đúng hai element này, không đổi các ràng buộc khác đã mô tả ở US-005. Không có spec nào khác mô tả biểu đồ "Cơ cấu chi tiêu" trước US-014.

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md`](../../kb/ba/wiki/knowledge/feature/US-014-chi-tieu-khac-cuoi-bang.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-014-chi-tieu-khac-cuoi-bang.md`](../../kb/ba/wiki/delivery/pbi/US-014-chi-tieu-khac-cuoi-bang.md) | Điền đầy đủ User Story và 5 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory cần ghi: không có quyết định mới cần dialog với user (raw đã tự trả lời đủ 2 câu hỏi mở bằng "Giả định hợp lý", `ba-expert`/`po-expert` xác nhận không phát sinh thêm). Không có thuật ngữ nghiệp vụ mới phát sinh.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Thu chi (`/budget`) — bảng ngân sách theo danh mục, ô "Danh mục nhận diện" ở khu nhập nhanh, biểu đồ "Cơ cấu chi tiêu" |
| Thực thể dữ liệu nào bị chạm | Không đổi cấu trúc — chỉ đổi thứ tự hiển thị danh sách danh mục đã tải sẵn |
| Cần thay đổi cấu trúc dữ liệu | Không |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Ràng buộc thứ tự áp dụng nhất quán ở cả 3 nơi hiển thị danh sách danh mục (bảng, dropdown, biểu đồ) vì cả ba cùng dùng lại một danh sách duy nhất | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-10 | Nếu sai, cần tách quy tắc thứ tự riêng cho từng nơi hiển thị — ảnh hưởng AC-04, AC-05, `EL-02`, `EL-03` |
| A2 | Chỉ "Chi tiêu khác" bị đưa xuống cuối; các danh mục còn lại giữ nguyên thứ tự tương đối, không sắp xếp lại theo tiêu chí nào khác | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-10 | Nếu sai, cần chốt lại tiêu chí sắp xếp cho toàn bộ danh sách — ảnh hưởng AC-01, AC-02 |
