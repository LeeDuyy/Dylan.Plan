---
status: Active
feature: US-023
updated: 2026-09-07
spec: docs/features/US-023-layout-antd-responsive-toan-app/spec.md
raw: docs/kb/ba/raw/US-023-layout-antd-responsive-toan-app.md
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/feature]
aliases: ["US-023", "Layout Ant Design responsive toàn app"]
---

# US-023 — Chuẩn hóa layout toàn app bằng Ant Design, tận dụng không gian và responsive cho mobile/tablet

> Trang tri thức chính của function này. `ssr-ingest` tạo bản nháp từ raw (mode `ingest`) và nạp lại từ spec đã `Ready for DEV` (mode `sync`). `ssr-ba` chỉ đọc, không tự sửa trang này.

## 1. Mục Tiêu Nghiệp Vụ

Ứng dụng hiện dùng giao diện tự dựng bằng CSS thuần: nội dung bị bó trong một khung hẹp cố định kể cả trên màn hình rộng, không co gọn tốt trên điện thoại/máy tính bảng, và tab Thu chi còn có khung riêng tách khỏi khung chung của các tab khác. Dylan muốn một giao diện gọn gàng, tận dụng bề ngang màn hình, dùng được thoải mái trên điện thoại và máy tính bảng, và nhất quán giữa mọi tab.

Sau thay đổi này, toàn bộ ứng dụng dùng một khung màn hình chung dựng bằng bộ thành phần Ant Design, một bảng màu và một chế độ sáng/tối; giao diện co theo bề ngang thiết bị; nội dung và luồng nghiệp vụ của từng tab giữ nguyên.

Giá trị đo được: mở mọi tab ở ba bề ngang (điện thoại ~375px, máy tính bảng ~768px, màn hình rộng ~1440px) — không tab nào bị cuộn ngang toàn trang, vùng chuyển tab dùng được ở cả ba, nội dung trên màn hình rộng dùng phần lớn bề ngang thay vì bó ở khung ~1220px như trước.

## 2. Phạm Vi

Trong phạm vi:

- Thêm bộ thành phần Ant Design vào ứng dụng (kèm phần tương thích cho phiên bản React đang dùng và phần trích xuất kiểu phía máy chủ để không nháy giao diện khi tải).
- Dựng lại khung màn hình chung (`AppShell`) bằng thành phần bố cục của Ant Design: thanh tiêu đề, vùng chuyển tab, vùng nội dung, chân trang; đưa tab Thu chi vào dùng chung khung này.
- Vùng chuyển tab responsive: hàng ngang đầy đủ trên màn hình rộng, thu vào nút mở bảng trượt trên điện thoại.
- Nới bề ngang vùng nội dung để dùng phần lớn màn hình rộng; các khu vực bảng/biểu đồ trải rộng.
- Chuyển các thành phần giao diện của mọi tab (nút, thẻ, bảng, ô chọn, nhãn trạng thái, thanh tiến độ, dòng thời gian, các bước...) sang thành phần Ant Design tương ứng, giữ nguyên nhãn hiển thị và nội dung.
- Giữ bảng màu và chế độ sáng/tối hiện tại: ánh xạ các biến màu đang có vào bảng màu của Ant Design; gom logic bật/tắt sáng/tối đang lặp về một nơi.
- Làm giao diện co theo bề ngang thiết bị cho mọi tab ([`BR-038`](../business-rule/BR-038-layout-antd-responsive-toan-app.md)).

Ngoài phạm vi:

- Thay đổi bất kỳ số liệu, nội dung, nhãn hay luồng nghiệp vụ nào của các tab.
- Thay đổi cấu trúc dữ liệu, Server Action, hay luồng lưu trữ.
- Trang đăng nhập và trang chân dung ở tên miền gốc.
- Chuyển biểu đồ tròn/biểu đồ cột ở tab Thu chi sang thành phần biểu đồ của thư viện (giữ cách vẽ hiện tại, chỉ khoác vỏ ngoài).

## 3. Người Dùng Và Phân Quyền

| Vai trò | Quyền | Ghi chú |
| --- | --- | --- |
| Dylan | Xem, dùng mọi tab như hiện tại | Không đổi quyền — chỉ đổi cách trình bày |

## 4. Luồng Nghiệp Vụ

1. Dylan mở ứng dụng trên một thiết bị bất kỳ. Khung màn hình chung hiển thị: thanh tiêu đề, vùng chuyển tab, vùng nội dung, chân trang.
2. Trên màn hình rộng: vùng chuyển tab là một hàng ngang đầy đủ; nội dung dùng phần lớn bề ngang.
3. Trên điện thoại: vùng chuyển tab thu vào một nút; Dylan bấm nút mở bảng trượt để chọn tab; nội dung xếp một cột; bảng rộng cuộn ngang trong khung riêng.
4. Dylan chuyển giữa các tab — mỗi tab giữ nguyên nội dung, số liệu và thao tác như trước, chỉ khác cách trình bày.
5. Dylan bật/tắt chế độ tối — toàn bộ khung và mọi thành phần đổi màu nhất quán.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Từng tab giữ nguyên cách hiển thị "chưa có dữ liệu" như hiện tại, chỉ khoác vỏ Ant Design |
| Không đủ quyền | Không áp dụng — Dylan là người dùng duy nhất |
| Dữ liệu trùng | Không áp dụng — US-023 không chạm dữ liệu |
| Hệ thống lỗi | Từng tab giữ nguyên cách báo lỗi/thông báo như hiện tại, chỉ khoác vỏ Ant Design |

## 5. Business Rules

| ID | Rule | Trang business-rule | Nguồn | Độ tin cậy |
| --- | --- | --- | --- | --- |
| `BR-038` | Khung giao diện dùng chung, co theo bề ngang thiết bị, một hệ thành phần Ant Design cho mọi tab | [`../business-rule/BR-038-layout-antd-responsive-toan-app.md`](../business-rule/BR-038-layout-antd-responsive-toan-app.md) | `docs/memory/decisions.md#dec-132` | Đã xác nhận từ knowledge |

## 6. Dữ Liệu Nghiệp Vụ

Không có. US-023 thuần tầng trình bày — không thêm/sửa thực thể, không đụng cấu trúc dữ liệu.

## 7. Liên Kết Function

| Function | Quan hệ | Mô tả |
| --- | --- | --- |
| [`US-022`](US-022-nguon-thu-va-insight-tab-thu-chi.md) | Depends on | US-023 dựng lại giao diện tab Thu chi trên nền US-022 (bảng Nguồn thu, chỉ số insight mới, tháng mặc định) — làm sau US-022 (`DEC-132`) |
| [`US-002`](US-002-route-rieng-quan-ly-chi-tieu.md) | Related only | US-002 tách route Thu chi; US-023 gộp tab Thu chi vào khung `AppShell` chung |
| [`US-018`](US-018-theo-doi-cv-ung-tuyen.md) | Impacts | Bảng "Theo dõi CV ứng tuyển" ở tab Roadmap chuyển sang thành phần bảng Ant Design, giữ nguyên cột và hành vi |

## 8. Nguồn Bằng Chứng

| Bằng chứng | Path |
| --- | --- |
| Spec | `docs/features/US-023-layout-antd-responsive-toan-app/spec.md` |
| Source record | `docs/kb/ba/wiki/ingestion/source-record/US-023-layout-antd-responsive-toan-app.md` |
| Raw | `docs/kb/ba/raw/US-023-layout-antd-responsive-toan-app.md` |
| Quyết định | `docs/memory/decisions.md#dec-132` |

## 9. Liên Kết Wiki

| Trang | Loại | Quan hệ |
| --- | --- | --- |
| — | Epic | **Không gắn epic, không neo `M1`–`M4`.** US-023 là hạng mục cross-cutting UX/kỹ thuật cho **toàn bộ Dylan Plan app** (6 tab). Business Flow "Hệ Thống Quản Lý Chi Tiêu" chỉ mô tả `/budget` (F1–F4) — không đủ thẩm quyền phê duyệt hướng cho 5 tab sự nghiệp/freelance/sản phẩm. Căn cứ định hướng là `DEC-132` do user chốt tường minh (`AskUserQuestion` 2026-09-07 × 2), cùng tiền lệ `DEC-088` |
| [`../business-rule/BR-038-layout-antd-responsive-toan-app.md`](../business-rule/BR-038-layout-antd-responsive-toan-app.md) | Business rule | Rule chính của function |
| [`../feature/US-002-route-rieng-quan-ly-chi-tieu.md`](US-002-route-rieng-quan-ly-chi-tieu.md) | Feature | `DEC-132` nới lại phần "tách shell/nav" của `DEC-002`/`M2`: `/budget` giữ route riêng nhưng dùng chung `AppShell` + thanh chuyển tab |

## 10. Liên Kết PBI

| Trang PBI | Trạng thái AC |
| --- | --- |
| [`../../delivery/pbi/US-023-layout-antd-responsive-toan-app.md`](../../delivery/pbi/US-023-layout-antd-responsive-toan-app.md) | Đã đồng bộ 2026-09-07 — 8 AC |
