# Liên kết giao dịch theo danh mục bằng ID

Status: Ready for DEV
Feature: US-003
Created: 2026-08-05
Updated: 2026-08-05
Raw Source: `docs/kb/ba/raw/US-003-lien-ket-giao-dich-theo-id.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

> **Ghi chú provenance:** Requirement này đã được triển khai thật, cùng đợt với `US-001` (2026-08-03..05) — xem `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` (mục 3, AC-05) và `docs/features/US-001-luu-tru-chi-tieu-ben-vung/report.md`. Spec này được tổng hợp lại theo yêu cầu có đủ artifact riêng cho `US-003`; các tiêu chí chấp nhận dưới đây mô tả đúng hành vi đang chạy thật, không phải đề xuất mới.

## 1. Mục Tiêu Nghiệp Vụ

Trước đây, mỗi giao dịch chi tiêu chỉ ghi tên danh mục dưới dạng chữ tại thời điểm tạo. Khi Dylan đổi tên một danh mục sau đó, các giao dịch cũ không còn khớp đúng với danh mục đó nữa.

Sau thay đổi này, mỗi giao dịch được gắn với đúng một danh mục thông qua một mã nhận diện cố định của danh mục đó — gán một lần khi ghi nhận, không đổi sau này. Đổi tên danh mục không còn làm giao dịch cũ bị lệch hay mất liên kết.

Giá trị đo được: Sau khi Dylan đổi tên một danh mục đang có giao dịch, các giao dịch cũ của danh mục đó vẫn hiển thị đúng dưới tên mới và vẫn cộng đúng vào "Chi thực tế" của danh mục đó — không tách thành danh mục riêng, không biến mất khỏi tổng.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md`](../../kb/ba/wiki/knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md) | Mục tiêu, phạm vi, business rule, ghi chú provenance đã triển khai thật |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-007-danh-muc-theo-id.md`](../../kb/ba/wiki/knowledge/business-rule/BR-007-danh-muc-theo-id.md) | Giao dịch liên kết danh mục qua mã nhận diện cố định, không theo tên hiển thị |
| [`docs/kb/ba/wiki/data/entity/ENT-001-giao-dich.md`](../../kb/ba/wiki/data/entity/ENT-001-giao-dich.md) | Ràng buộc gắn với danh mục qua mã nhận diện cố định |
| [`docs/kb/ba/business-flow.md`](../../kb/ba/business-flow.md) | Mục tiêu M1, điểm chạm F1-F2, gap #4 (đã giải quyết) |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`.

## 3. Phạm Vi

- Mỗi giao dịch được gắn với đúng một danh mục thông qua mã nhận diện cố định của danh mục đó, gán một lần khi ghi nhận giao dịch.
- Tên danh mục hiển thị trên mọi giao dịch (kể cả giao dịch đã ghi từ trước) luôn tra theo tên hiện tại của danh mục đang gắn, không phải một chuỗi chữ lưu cứng từ lúc tạo.
- Đổi tên một danh mục không làm mất liên kết hay làm lệch "Chi thực tế" của các giao dịch đã gắn với danh mục đó từ trước.

## 4. Ngoài Phạm Vi

- Chặn trùng tên danh mục khi thêm hoặc sửa tên — thuộc requirement riêng (chặn trùng tên danh mục).
- Xử lý giao dịch khi danh mục của nó bị xóa (chuyển sang "Chi tiêu khác") — thuộc requirement riêng (ràng buộc toàn vẹn danh mục).
- Sửa hoặc xóa từng giao dịch riêng lẻ — thuộc requirement riêng (sửa/xóa từng giao dịch), đã triển khai và dùng đúng cơ chế liên kết của requirement này.

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Xem, ghi nhận chi tiêu, đổi tên danh mục | Không có vai trò thứ hai — hệ thống chỉ phục vụ một người dùng | `docs/memory/decisions.md#dec-004` |

## 6. Luồng Nghiệp Vụ

1. Dylan ghi nhận một giao dịch chi tiêu mới (nhập nhanh hoặc chọn danh mục thủ công) — giao dịch được gắn với đúng danh mục Dylan đã chọn tại thời điểm đó, thông qua mã nhận diện cố định của danh mục.
2. Dylan xem lại giao dịch ở bảng chi tiết chi tiêu hoặc bảng ngân sách theo danh mục — tên danh mục hiển thị trên giao dịch luôn là tên hiện tại của danh mục đang gắn.
3. Dylan đổi tên một danh mục đang có giao dịch — mọi giao dịch đã gắn với danh mục đó trước khi đổi tên vẫn hiển thị đúng, chỉ đổi sang tên mới; "Chi thực tế" của danh mục (tổng các giao dịch đang gắn) không đổi.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Danh mục chưa có giao dịch nào — "Chi thực tế" hiển thị 0đ |
| Không đủ quyền | Không áp dụng — hệ thống chỉ có một người dùng |
| Dữ liệu trùng | Không áp dụng cho requirement này — xem requirement riêng về chặn trùng tên danh mục |
| Hệ thống lỗi | Không áp dụng — việc gán mã nhận diện xảy ra cùng lúc với thao tác ghi nhận giao dịch, không có bước riêng có thể lỗi giữa chừng |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Danh mục "Ăn uống & đi chợ" của tháng đang chọn chưa có giao dịch nào | Dylan ghi nhận giao dịch "cafe" 45.000đ vào danh mục "Ăn uống & đi chợ" | Giao dịch xuất hiện ở bảng chi tiết chi tiêu, gắn đúng với danh mục "Ăn uống & đi chợ"; "Chi thực tế" của danh mục đổi thành 45.000đ | Xem ASCII Mockup mục 8.1 |
| AC-02 | Danh mục "Di chuyển" đang có 2 giao dịch: "grab" 80.000đ và "xăng xe" 50.000đ | Dylan mở bảng ngân sách theo danh mục của tháng đang chọn | Cột "Chi thực tế" của danh mục "Di chuyển" hiển thị đúng 130.000đ (tổng 2 giao dịch đang gắn với danh mục đó) | Xem ASCII Mockup mục 8.2 |
| AC-03 | Danh mục "Ăn uống" đang có một giao dịch "cafe" 45.000đ đã ghi nhận trước đó, "Chi thực tế" đang là 45.000đ | Dylan đổi tên danh mục "Ăn uống" thành "Ăn uống & đi chợ" | Giao dịch "cafe" 45.000đ vẫn hiển thị gắn với danh mục đó, dưới tên mới "Ăn uống & đi chợ", ở cả bảng chi tiết chi tiêu lẫn bảng ngân sách theo danh mục; "Chi thực tế" của danh mục vẫn giữ nguyên 45.000đ — không tách thành danh mục riêng, không giảm hay biến mất | Xem ASCII Mockup mục 8.2 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì tham chiếu khối ASCII Mockup ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

Liệt kê mọi thành phần màn hình mà requirement này chạm tới. Hai element cốt lõi (`EL-02`, `EL-03`) đã tồn tại và mô tả gốc ở spec của mã function US (viết tắt của "User Story", cách gọi mã function ở dự án này) `US-001` — mục này chỉ nêu lại phần hành vi liên quan trực tiếp tới liên kết theo mã nhận diện, không lặp lại toàn bộ mô tả.

### 8.1. Bảng chi tiết chi tiêu — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Cột Danh mục (bảng chi tiết chi tiêu) | Column | (hiển thị nhỏ, kèm thời điểm) | Tên hiện tại của danh mục, tra theo mã nhận diện đã gắn với giao dịch | Text; tra cứu theo mã nhận diện cố định của giao dịch, không phải chuỗi chữ lưu cứng — đổi tên danh mục cập nhật ngay trên mọi giao dịch cũ | Dylan | AC-01 | [`US-001` EL-02 mục 8.1](../US-001-luu-tru-chi-tieu-ben-vung/spec.md), [`US-004` EL-03 mục 8.1](../US-004-sua-xoa-tung-giao-dich/spec.md) — cùng bảng/cột hiển thị giao dịch gần đây |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| Giao dịch gần đây                                               |
+----------------------------------------------------------------+
| cafe                                          -45.000 đ         |
| Ăn uống & đi chợ · 14:45 5/8/2026                                |
+----------------------------------------------------------------+
```

### 8.2. Bảng ngân sách theo danh mục — `Trang Thu chi (/budget từ US-002)`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-02 | Cột Danh mục (bảng ngân sách) | Column | Danh mục | Tên hiện tại của danh mục | Text; đổi tên danh mục không làm mất liên kết với giao dịch cũ | Dylan | AC-03 | [`US-001` EL-05 mục 8.2](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) — cùng element, mô tả gốc ở đó |
| EL-03 | Cột Chi thực tế | Column | Chi thực tế | Tổng số tiền các giao dịch đang gắn với danh mục (tra theo mã nhận diện) trong tháng đang chọn | Chỉ đọc — tính tự động bằng tổng giao dịch gắn với danh mục qua mã nhận diện cố định, không theo tên | Dylan | AC-02, AC-03 | [`US-001` EL-06 mục 8.2](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) — cùng element, mô tả gốc ở đó |

**ASCII Mockup**

```text
+----------------------------------------------------------------+
| Danh mục            Ngân sách    Chi thực tế   Còn lại          |
+----------------------------------------------------------------+
| Di chuyển           1.500.000    130.000       1.370.000        |
| Ăn uống & đi chợ     4.000.000    45.000         3.955.000       |
+----------------------------------------------------------------+
```

Quy tắc:

- Với `Column`: nêu rõ nguồn dữ liệu và cách tra cứu.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác. Không có thì ghi `Không`.
- Element bị **xóa** hoặc **đổi hành vi** so với hiện tại phải ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Giao dịch → Danh mục | Liên kết qua mã nhận diện cố định thay vì tên — đã triển khai cùng đợt `US-001` | Có | Giữ vĩnh viễn, không đổi khi danh mục đổi tên |
| Xuất dữ liệu JSON | Không đổi ở phạm vi requirement này | Không | Thuộc requirement riêng (xuất dữ liệu) |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Dữ liệu | Không (đã triển khai chung một đợt) | Delivered With Notes |

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`US-001`](../US-001-luu-tru-chi-tieu-ben-vung/spec.md) | Mục 7 AC-05 mô tả cùng hành vi (đổi tên danh mục giữ liên kết giao dịch) | `EL-05`, `EL-06` mục 8.2 | Không (ngoài phạm vi ssr-ba đang chạy cho US-003 — không được sửa spec của feature khác) | Không cần sửa — hai spec mô tả cùng một hành vi đã triển khai, nhất quán với nhau, không có mâu thuẫn |
| [`US-004`](../US-004-sua-xoa-tung-giao-dich/spec.md) | Mục 6 bước 3, mục 7 AC-03 (sửa danh mục của một giao dịch) | `EL-10` (Dropdown Danh mục, chế độ sửa) | Không | Không cần sửa — US-004 đã dùng đúng cơ chế liên kết theo mã nhận diện của requirement này khi đổi danh mục một giao dịch |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md`](../../kb/ba/wiki/knowledge/feature/US-003-lien-ket-giao-dich-theo-id.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-003-lien-ket-giao-dich-theo-id.md`](../../kb/ba/wiki/delivery/pbi/US-003-lien-ket-giao-dich-theo-id.md) | Điền đầy đủ User Story và 3 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory cần ghi: Không có quyết định mới phát sinh — mọi hành vi mô tả trong spec này đã được chốt và triển khai từ đợt `US-001`, ghi tại mã DEC (viết tắt của "Decision", mã quyết định đã chốt với user) `DEC-007` trong `decisions.md`, không phát sinh mã DEC mới. Không có thuật ngữ nghiệp vụ mới phát sinh ngoài những gì đã có trong `glossary.md`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Không có — chỉ xác nhận lại hành vi đã có tại bảng chi tiết chi tiêu và bảng ngân sách theo danh mục (trang Thu chi) |
| Thực thể dữ liệu nào bị chạm | Giao dịch → Danh mục (đã có sẵn từ US-001, không cần đổi) |
| Cần thay đổi cấu trúc dữ liệu | Không — mã nhận diện liên kết giao dịch với danh mục đã tồn tại và áp dụng từ US-001 |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Toàn bộ hành vi mô tả trong spec này (AC-01..AC-03) đã triển khai và đang chạy thật, cùng đợt với `US-001` — spec này chỉ tổng hợp lại thành artifact riêng, không phải đề xuất mới cần triển khai | Đã xác nhận từ knowledge — đối chiếu `docs/features/US-001-luu-tru-chi-tieu-ben-vung/report.md` và `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` (AC-05) | Nếu sai (vd hành vi thật khác mô tả), `ssr-plan`/`ssr-dev` sẽ phát hiện lệch khi đối chiếu source thật ở stage kế tiếp |
