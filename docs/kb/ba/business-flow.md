---
status: Agreed
updated: 2026-08-14
agreed_with: Dylan (user, chủ dự án)
owner: ssr-po
tags: [business-flow]
aliases: ["Business Flow", "Hệ Thống Quản Lý Chi Tiêu (Dylan Expense Manager)"]
---

# Business Flow — Hệ Thống Quản Lý Chi Tiêu (Dylan Expense Manager)

Status: Agreed
Updated: 2026-08-14
Chốt với: Dylan (user, chủ dự án)
Owner: ssr-po

> Tài liệu này mô tả **tổng thể** hệ thống làm gì và đi về đâu. Mọi spec đều phải quy chiếu về đây.
> Nội dung ở đây chỉ được ghi sau khi đã trao đổi và **chốt với user** — không suy đoán định hướng.
> Viết cho người đọc nghiệp vụ: không tên hàm, không tên bảng, không tên route.

## 1. Định Hướng Sản Phẩm

Hệ thống tồn tại để: giúp Dylan ghi nhận và kiểm soát chi tiêu cá nhân hằng tháng theo ngân sách từng danh mục, với dữ liệu được lưu trữ bền vững thay vì chỉ tồn tại trong trình duyệt.

| # | Mục tiêu | Đo bằng gì | Kỳ hạn | Đã chốt với user |
| --- | --- | --- | --- | --- |
| M1 | Dữ liệu chi tiêu (tháng, danh mục, giao dịch) được lưu trữ bền vững, không phụ thuộc trình duyệt | Dữ liệu vẫn còn sau khi xóa cache/đổi máy — kiểm chứng bằng cách đọc lại từ nguồn lưu trữ độc lập với `localStorage` | Chưa chốt mốc thời gian cụ thể | Có (DEC-001) |
| M2 | Trang quản lý chi tiêu tách khỏi các mục khác của Dylan Plan Dashboard (roadmap, freelance, sản phẩm) | Có route/module riêng, điều hướng độc lập trong cùng dự án Next.js | Chưa chốt mốc thời gian cụ thể | Có (DEC-002) |
| M3 | Hỗ trợ Dylan lên kế hoạch mua sắm theo tháng ngay trong bảng thu chi, giảm nguy cơ quên hoặc mua trùng đồ cần mua | Dylan mở bảng thu chi là thấy ngay danh sách sản phẩm cần mua của tháng đang xem, không cần ghi ở nơi khác ngoài ứng dụng; tách rõ khỏi M1 vì đây không phải dữ liệu chi tiêu thật (giá không cộng vào Ngân sách/Chi thực tế) | Chưa chốt mốc thời gian cụ thể | Có (DEC-105) |

Không theo đuổi (nêu rõ để chặn scope creep):

| # | Thứ không làm | Lý do |
| --- | --- | --- |
| 1 | Đăng nhập, phân quyền, nhiều tài khoản | User chốt hệ thống chỉ phục vụ một mình Dylan, không cần multi-user (DEC-004) |
| 2 | Chia sẻ ngân sách với người khác (gia đình, đồng sở hữu) | Không được chọn khi hỏi về vai trò người dùng chính (DEC-004) |
| 3 | Tự động hóa nhập liệu bằng OCR hóa đơn hoặc import sao kê ngân hàng | Không được chọn làm mục tiêu ưu tiên; có thể xem xét lại sau khi có nền tảng lưu trữ bền vững (DEC-001) |
| 4 | Tách thành dự án/ứng dụng hoàn toàn độc lập khỏi Dylan.Plan | User chọn "tách route riêng, dùng chung codebase", không chọn tách dự án riêng (DEC-002) |

## 2. Bối Cảnh Và Người Dùng

| Vai trò | Công việc hằng ngày | Đau ở đâu | Tần suất dùng |
| --- | --- | --- | --- |
| Dylan (chủ ngân sách, single-user) | Ghi nhận giao dịch chi tiêu, theo dõi ngân sách theo danh mục, xem tổng quan còn lại trong tháng | Dữ liệu chỉ lưu ở `localStorage` trình duyệt — mất khi đổi máy hoặc xóa cache; không sửa/xóa được từng giao dịch riêng lẻ, chỉ có "reset toàn bộ tháng" | Hằng ngày (nhập nhanh chi tiêu); hằng tuần (review ngân sách, theo quy tắc "Review mỗi Chủ nhật" đã có trong UI) |

Hệ thống bên ngoài có trao đổi dữ liệu:

| Hệ thống | Chiều | Dữ liệu | Ghi chú |
| --- | --- | --- | --- |
| Không có | — | — | Nút "Xuất JSON" hiện tại là tải file thủ công về máy người dùng, không phải tích hợp với hệ thống ngoài |

## 3. Bản Đồ Luồng Nghiệp Vụ

```mermaid
flowchart LR
    A[Mở trang Quản lý chi tiêu] --> B{Đã có tháng đang chọn?}
    B -->|Có| C[Xem tổng quan ngân sách tháng]
    B -->|Chưa có / cần tháng mới| D{Tạo tháng mới: trống hay sao chép?}
    D -->|Trống| E[Khởi tạo danh mục mặc định, chi thực tế = 0]
    D -->|Sao chép tháng trước| F[Sao chép danh mục + ngân sách, chi thực tế = 0]
    E --> Y1["Chuyển toàn bộ Items cần mua còn Pending của tháng nguồn sang tháng mới, ẩn khỏi tháng gốc"]
    F --> Y1
    Y1 --> C
    C --> Y2{Đang xem tháng đang chọn?}
    Y2 -->|Có| Y3[Xem/thêm/sửa/đánh dấu đã mua/xóa Items cần mua]
    Y2 -->|Không, tháng khác| Y4[Chỉ xem Items cần mua, không thao tác]
    C --> G[Nhập nhanh giao dịch chi tiêu]
    G --> G1{Nội dung có nhắc mốc thời gian?}
    G1 -->|Có, hợp lệ: quá khứ hoặc hôm nay| G2[Tính ngày giao dịch theo mốc thời gian, tách khỏi nội dung lưu]
    G1 -->|Không có / không nhận diện được / rơi vào tương lai| G3[Dùng thời điểm nhập hiện tại làm ngày giao dịch]
    G2 --> H{Nhận diện được danh mục từ từ khóa?}
    G3 --> H
    H -->|Có| I[Tự gán danh mục, cộng vào chi thực tế]
    H -->|Không khớp| J{Dylan chọn danh mục thủ công hay bỏ qua?}
    J -->|Chọn danh mục| J1[Gán theo danh mục Dylan chọn]
    J -->|Bỏ qua, không chọn| J2["Tự sinh 'Chi tiêu khác' nếu tháng chưa có, gán giao dịch vào đó"]
    I --> K[Cập nhật bảng ngân sách và insight]
    J1 --> K
    J2 --> K
    K --> X[Hiện toast xác nhận: số tiền + danh mục; nếu ngày bị đổi khác mốc thời gian đã gõ thì thêm ghi chú lý do; tự đóng sau vài giây]
    X --> L{Tổng chi ≥ 90% thu nhập?}
    L -->|Có| M[Hiển thị cảnh báo vượt ngân sách]
    L -->|Không| N[Trạng thái bình thường]
    C --> O[Điều chỉnh ngân sách / thêm-xóa danh mục]
    O --> O1{Xóa danh mục nào?}
    O1 -->|Danh mục khóa: Tiền nhà, Chi phí cố định khác, hoặc "Chi tiêu khác"| O4[Không cho xóa]
    O1 -->|Danh mục thường, không khóa| O2{"Chi tiêu khác" đã tồn tại trong tháng?}
    O2 -->|Chưa có| O2a["Tự sinh 'Chi tiêu khác' (khóa, chỉ xem)"]
    O2 -->|Đã có| O3[Chuyển toàn bộ giao dịch của danh mục sang "Chi tiêu khác"]
    O2a --> O3
    O3 --> O3b[Xóa danh mục, tính lại chi thực tế "Chi tiêu khác" từ tổng giao dịch]
    C --> P[Xem phân tích và xu hướng nhiều tháng]
    P --> P1[Mở mini dashboard, chọn khoảng 3/6/9/12 tháng gần đây]
    P1 --> P2[Biểu đồ tổng chi thực tế theo tháng, so với ngân sách/thu nhập, tính lùi từ tháng hiện tại]
    C --> Q[Mở bảng chi tiết chi tiêu]
    Q --> R{Giao dịch thuộc tháng đang chọn?}
    R -->|Không, tháng khác| S[Không cho sửa/xóa]
    R -->|Có| T{Sửa hay xóa?}
    T -->|Sửa| U[Cập nhật nội dung/số tiền/danh mục/ngày]
    U --> U1{Ngày mới ≤ hôm nay?}
    U1 -->|Không| U2[Chặn lưu, yêu cầu chọn lại ngày hợp lệ]
    U1 -->|Có| W[Tính lại chi thực tế danh mục cũ và mới từ tổng giao dịch]
    T -->|Xóa, sau khi xác nhận| V[Xóa giao dịch khỏi danh sách]
    V --> W
    W --> W1{"Chi tiêu khác" còn giao dịch nào không?}
    W1 -->|Không còn| W2[Ẩn "Chi tiêu khác" khỏi bảng danh mục]
    W1 -->|Còn| K
    W2 --> K
```

| Luồng | Tên | Vai trò chính | Đầu vào | Kết quả |
| --- | --- | --- | --- | --- |
| F1 | Ghi nhận chi tiêu | Dylan | Nội dung + số tiền giao dịch | Giao dịch được lưu, chi thực tế của danh mục cập nhật |
| F2 | Lập và điều chỉnh ngân sách theo danh mục | Dylan | Danh mục, số tiền ngân sách | Bảng ngân sách theo danh mục được cập nhật |
| F3 | Quản lý theo chu kỳ tháng | Dylan | Chọn tháng mới / tháng hiện có | Dữ liệu tháng (ngân sách, giao dịch, danh sách sản phẩm cần mua) sẵn sàng để thao tác |
| F4 | Phân tích và báo cáo chi tiêu | Dylan | Dữ liệu các tháng đã có | Insight (danh mục chi nhiều nhất, tiết kiệm, xu hướng) và file xuất dữ liệu |

## 4. Chi Tiết Từng Luồng

### F1 — Ghi nhận chi tiêu

Mục tiêu phục vụ: `M1`

| Bước | Ai làm | Làm gì | Kết quả | Function |
| --- | --- | --- | --- | --- |
| 1 | Dylan | Gõ nội dung tự nhiên (vd "cafe 45k", "Thứ 2 cafe 25k", "ngày 23 mua gạo 50k") vào ô nhập nhanh | Hệ thống tách được số tiền và gợi ý danh mục; nếu nội dung có nhắc mốc thời gian hợp lệ (thứ trong tuần, "ngày N", "hôm qua/hôm nay", ngày cụ thể dd/mm — DEC-016) thì tính ngày giao dịch theo mốc đó thay vì thời điểm nhập, và tách phần thời gian ra khỏi nội dung lưu (DEC-015) | Chưa có |
| 2 | Dylan | Xác nhận hoặc đổi danh mục gợi ý, hoặc bỏ qua không chọn danh mục nào, bấm "Ghi nhận" | Giao dịch mới được lưu; nếu Dylan bỏ qua không chọn danh mục, giao dịch tự động gán vào "Chi tiêu khác" (tự sinh danh mục này nếu tháng chưa có — DEC-026, DEC-028); hệ thống hiện toast thông báo thành công chứa số tiền và danh mục vừa ghi nhận, tự đóng sau vài giây (DEC-011, DEC-012); nếu ngày ghi nhận bị đổi khác mốc thời gian Dylan đã gõ (vì ở tương lai hoặc không hợp lệ), toast có thêm ghi chú lý do (DEC-018) | Chưa có |
| 3 | Dylan | Xem lại danh sách giao dịch gần đây tại bảng chi tiết chi tiêu | Nắm được lịch sử chi tiêu trong tháng | Chưa có |
| 4 | Dylan | Chọn "Sửa" trên một giao dịch nhập sai tại bảng chi tiết chi tiêu | Form sửa hiển thị đầy đủ nội dung, số tiền, danh mục, ngày để chỉnh lại (DEC-008: cho sửa đầy đủ 4 trường); trường ngày chỉ nhận giá trị ≤ hôm nay (DEC-017) | Chưa có |
| 5 | Dylan | Lưu giao dịch đã sửa | Nếu ngày hợp lệ (≤ hôm nay): giao dịch được cập nhật, chi thực tế của danh mục cũ và danh mục mới (nếu đổi danh mục) được tính lại từ tổng giao dịch (DEC-007); nếu ngày ở tương lai: chặn lưu, yêu cầu chọn lại ngày hợp lệ (DEC-017) | Chưa có |
| 6 | Dylan | Chọn "Xóa" trên một giao dịch tại bảng chi tiết chi tiêu, xác nhận trong hộp thoại (DEC-009) | Giao dịch bị xóa khỏi danh sách; chi thực tế của danh mục được tính lại từ tổng giao dịch còn lại (DEC-007) | Chưa có |

Điều kiện rẽ nhánh:

| Điều kiện | Đi tiếp tới | Ghi chú |
| --- | --- | --- |
| Từ khóa trong nội dung khớp một danh mục đã định nghĩa | Tự gán danh mục, không cần chọn tay | Danh sách từ khóa cố định trong code (`quickRules`) |
| Không khớp từ khóa nào | Dylan có thể chọn danh mục thủ công, hoặc bỏ qua không chọn | Không còn bắt buộc phải chọn danh mục trước khi ghi nhận (DEC-028) |
| Dylan bỏ qua không chọn danh mục nào | Giao dịch tự động gán vào "Chi tiêu khác"; tự sinh danh mục này nếu tháng đang chọn chưa có | DEC-026, DEC-028 |
| Không tách được số tiền hợp lệ từ nội dung | Chặn nút "Ghi nhận", không tạo giao dịch | — |
| Ghi nhận thành công (dù tự gán theo từ khóa hay Dylan tự chọn tay) | Hiện toast xác nhận chứa số tiền + danh mục, tự đóng sau vài giây | DEC-011, DEC-012 |
| Nội dung chứa "Thứ 2".."Thứ 7"/"Chủ nhật" | Tính ngày tương ứng trong tuần hiện tại, tách khỏi nội dung lưu | DEC-015, DEC-016 |
| Nội dung chứa "ngày N" | Tính ngày N của tháng hiện tại, tách khỏi nội dung lưu | DEC-015, DEC-016 |
| Nội dung chứa "hôm qua" / "hôm nay" | Tính ngày tương ứng, tách khỏi nội dung lưu | DEC-016 |
| Nội dung chứa ngày cụ thể dạng "dd/mm" | Tính ngày cụ thể trong năm hiện tại, tách khỏi nội dung lưu | DEC-016 |
| Ngày suy ra từ mốc thời gian rơi vào tương lai so với hôm nay | Coi là không hợp lệ, bỏ qua mốc thời gian, dùng thời điểm nhập làm ngày giao dịch như bình thường; toast xác nhận thêm ghi chú lý do | DEC-013, DEC-018 |
| Không nhận diện được cú pháp thời gian hợp lệ nào trong nội dung | Bỏ qua, dùng thời điểm nhập làm ngày giao dịch như bình thường; toast xác nhận thêm ghi chú lý do | DEC-014, DEC-018 |
| Giao dịch thuộc tháng đang chọn | Cho phép sửa/xóa tại bảng chi tiết chi tiêu | DEC-010 — chỉ giới hạn tháng đang chọn |
| Giao dịch thuộc tháng khác (không phải tháng đang chọn) | Không cho sửa/xóa | DEC-010 — tránh làm lệch số liệu lịch sử đã dùng cho F4 |
| Sửa giao dịch có đổi danh mục | Trừ khỏi chi thực tế danh mục cũ, cộng vào chi thực tế danh mục mới, cả hai đều tính lại từ tổng giao dịch | DEC-007, DEC-008 |
| Sửa giao dịch, đổi trường "ngày" sang một ngày ở tương lai | Chặn lưu, yêu cầu Dylan chọn lại ngày hợp lệ (≤ hôm nay) | DEC-017 — cùng nguyên tắc với DEC-013, áp dụng cho cả luồng sửa |
| Bấm "Xóa" một giao dịch | Hiện hộp xác nhận trước, chỉ xóa thật sau khi Dylan xác nhận | DEC-009 |

Trường hợp hỏng:

| Tình huống | Hệ quả nghiệp vụ | Cách xử lý hiện tại |
| --- | --- | --- |
| Nhập nhầm số tiền hoặc danh mục | Chi thực tế của danh mục bị sai | Sẽ có: sửa trực tiếp giao dịch tại bảng chi tiết chi tiêu (đủ 4 trường), chi thực tế tính lại tự động từ tổng giao dịch (DEC-007, DEC-008) — thiết kế đã chốt, chưa triển khai, xem mục 7 #3 |
| Nhắc mốc thời gian tương lai trong nội dung (vd hôm nay Thứ 4, gõ "Thứ 6 ăn trưa 50k") | Mốc thời gian bị bỏ qua theo DEC-013, giao dịch ghi tại thời điểm nhập | Đã xử lý: toast xác nhận thêm ghi chú lý do khi ngày bị đổi (DEC-018), Dylan biết ngay để tự sửa lại nếu cần |
| Xóa nhầm một giao dịch | Mất giao dịch đã ghi nhận, không thể khôi phục | Giảm rủi ro bằng hộp xác nhận trước khi xóa (DEC-009); không phát triển tính năng khôi phục (undo) sau khi xóa (DEC-031) — hộp xác nhận là lớp bảo vệ duy nhất |
| Đổi tên một danh mục sau khi đã có giao dịch | Giao dịch cũ lưu tên danh mục dạng chuỗi văn bản tại thời điểm tạo, không tự cập nhật theo tên mới | Chưa có — đây là khoảng trống (mục 7, #4) |

### F2 — Lập và điều chỉnh ngân sách theo danh mục

Mục tiêu phục vụ: `M1`

| Bước | Ai làm | Làm gì | Kết quả | Function |
| --- | --- | --- | --- | --- |
| 1 | Dylan | Xem bảng danh mục với cột Ngân sách, Chi thực tế, Còn lại | Nắm tổng quan phân bổ ngân sách tháng; bỏ cột Tỷ trọng, đổi tên cột "Chênh lệch" thành "Còn lại" (DEC-019); danh mục "Chi tiêu khác" chỉ xuất hiện trong bảng khi đang có ít nhất một giao dịch gán vào nó, hiển thị dạng chỉ đọc — không có ô nhập tên/loại/ngân sách, không có nút xóa (DEC-027, DEC-029) | Chưa có |
| 2 | Dylan | Sửa trực tiếp tên, loại hoặc ngân sách của một danh mục | Bảng và các số tổng cập nhật ngay; riêng "Chi thực tế" không còn sửa tay được — luôn tính lại từ tổng giao dịch (DEC-007); nếu tên mới trùng (không phân biệt hoa/thường, đã bỏ khoảng trắng thừa) với một danh mục khác trong cùng tháng, chặn lưu và báo lỗi (DEC-020, DEC-021, DEC-022); không áp dụng cho "Chi tiêu khác" vì dòng này chỉ đọc (DEC-027) | Chưa có |
| 3 | Dylan | Thêm danh mục mới | Danh mục trống được thêm vào bảng; nếu tên trùng (theo cùng quy tắc chuẩn hóa) với một danh mục đã có trong tháng đang chọn, chặn thêm và báo lỗi (DEC-020, DEC-021, DEC-022) | Chưa có |
| 4 | Dylan | Xóa một danh mục không khóa (`locked`) | Toàn bộ giao dịch của danh mục chuyển sang danh mục "Chi tiêu khác" (tự sinh và hiện ra trên bảng nếu tháng chưa có — DEC-026, DEC-029); danh mục vừa xóa biến mất khỏi bảng, chi thực tế "Chi tiêu khác" tính lại từ tổng giao dịch (DEC-024, DEC-007). Riêng "Chi tiêu khác" luôn bị khóa vĩnh viễn, không hiện nút xóa trong mọi trường hợp (DEC-027); nếu sau đó giao dịch cuối cùng của nó cũng bị chuyển đi/xóa, nó tự ẩn khỏi bảng (DEC-029) | Chưa có |

Điều kiện rẽ nhánh:

| Điều kiện | Đi tiếp tới | Ghi chú |
| --- | --- | --- |
| Danh mục có cờ `locked` (vd Tiền nhà, Chi phí cố định khác, hoặc "Chi tiêu khác") | Không cho xóa | "Chi tiêu khác" luôn khóa vĩnh viễn dù còn hay hết giao dịch (DEC-027) |
| Xóa danh mục thường (không khóa) đang có giao dịch liên kết | Toàn bộ giao dịch của danh mục đó chuyển sang danh mục "Chi tiêu khác"; nếu tháng chưa có "Chi tiêu khác" thì tự sinh và hiện ra trên bảng; chi thực tế "Chi tiêu khác" tính lại từ tổng giao dịch | DEC-024, DEC-026, DEC-029, DEC-007 |
| "Chi tiêu khác" mất giao dịch cuối cùng (do giao dịch bị sửa sang danh mục khác hoặc bị xóa ở F1) | Ẩn khỏi bảng danh mục trên giao diện end-user, không hiển thị dòng rỗng | DEC-029 |
| Thêm mới hoặc sửa tên danh mục trùng với danh mục khác trong cùng tháng (so sánh không phân biệt hoa/thường, bỏ khoảng trắng thừa đầu-cuối) | Chặn thao tác, hiện thông báo lỗi yêu cầu Dylan đổi tên khác | DEC-020, DEC-021, DEC-022 |

Trường hợp hỏng:

| Tình huống | Hệ quả nghiệp vụ | Cách xử lý hiện tại |
| --- | --- | --- |
| Sửa tay "Chi thực tế" khác với tổng giao dịch thật | Số hiển thị không còn khớp danh sách giao dịch chi tiết | Hiện chưa có ràng buộc — cho phép sửa tự do; sẽ được giải quyết bằng cách bỏ hẳn ô sửa tay, tính "Chi thực tế" là số suy ra từ tổng giao dịch (DEC-007), xem mục 7 #3 |
| Hai danh mục cùng tên trong một tháng (hiện có thể xảy ra vì chưa có ràng buộc) | Nhập nhanh (F1) không xác định được nên gán giao dịch vào danh mục nào trong hai danh mục trùng tên | Sẽ được ngăn chặn từ gốc bằng ràng buộc không cho trùng tên (DEC-020, DEC-021, DEC-022), xem mục 7 |

### F3 — Quản lý theo chu kỳ tháng

Mục tiêu phục vụ: `M2`, `M3`

| Bước | Ai làm | Làm gì | Kết quả | Function |
| --- | --- | --- | --- | --- |
| 1 | Dylan | Chọn một tháng đã có từ danh sách | Bảng ngân sách và giao dịch của tháng đó hiển thị | Chưa có |
| 2 | Dylan | Chọn kỳ tháng mới cần tạo | Hệ thống kiểm tra tháng đó đã tồn tại chưa | Chưa có |
| 3 | Dylan | Chọn "Tạo tháng" (trống) hoặc "Clone tháng hiện tại" | Tháng mới được tạo với danh mục tương ứng; toàn bộ sản phẩm còn "chưa mua" trong danh sách "Items cần mua" của tháng hiện tại (tháng thực tế theo đồng hồ hệ thống tại thời điểm bấm nút — `DEC-107`) được chuyển sang tháng mới | US-019 (phần chuyển sản phẩm cần mua); phần tạo danh mục: Chưa có |
| 4 | Dylan | Xem, thêm, sửa, đánh dấu đã mua, hoặc xóa sản phẩm trong danh sách "Items cần mua" của tháng hiện tại | Danh sách sản phẩm cần mua cập nhật ngay; ở tháng khác tháng hiện tại (kể cả khi đang được chọn xem qua dropdown "Chọn tháng xem") thì chỉ xem, không thao tác được — độc lập với khái niệm "tháng đang được chọn xem" dùng cho phần ngân sách/giao dịch (`DEC-107`) | US-019 |

Điều kiện rẽ nhánh:

| Điều kiện | Đi tiếp tới | Ghi chú |
| --- | --- | --- |
| Tháng mới trùng với tháng đã tồn tại | Không tạo, không báo lỗi rõ ràng cho người dùng | Khoảng trống UX — nên có thông báo |
| Chọn "Clone tháng hiện tại" | Sao chép nguyên danh mục + ngân sách, chi thực tế = 0 | — |
| Chọn "Tạo tháng" (trống) | Dùng danh mục mặc định của hệ thống, chi thực tế = 0 | — |
| Tạo tháng mới (dù "Tạo tháng" hay "Clone tháng hiện tại") | Toàn bộ sản phẩm còn "chưa mua" (Pending) trong "Items cần mua" của tháng hiện tại (theo đồng hồ hệ thống, không phải tháng đang chọn xem trên dropdown nếu khác nhau — `DEC-107`) chuyển hẳn sang tháng mới, ẩn khỏi tháng gốc; sản phẩm đã mua (Purchased) không bị chuyển | US-019 |
| Xem một tháng khác tháng hiện tại (kể cả khi tháng đó đang được chọn xem qua dropdown "Chọn tháng xem") | Danh sách "Items cần mua" của tháng đó hiển thị đầy đủ nhưng chỉ xem — không thêm/sửa/xóa/đánh dấu đã mua | US-019 |

Trường hợp hỏng:

| Tình huống | Hệ quả nghiệp vụ | Cách xử lý hiện tại |
| --- | --- | --- |
| Mất dữ liệu do xóa cache trình duyệt trước khi chuyển sang lưu trữ bền vững | Toàn bộ lịch sử tháng bị mất | Đây chính là lý do M1 được chốt làm ưu tiên số 1 |

### F4 — Phân tích và báo cáo chi tiêu

Mục tiêu phục vụ: `M1`

| Bước | Ai làm | Làm gì | Kết quả | Function |
| --- | --- | --- | --- | --- |
| 1 | Dylan | Xem các thẻ insight (danh mục chi nhiều nhất, tiết kiệm, chi linh hoạt) | Nắm nhanh tình hình tài chính tháng | Chưa có |
| 2 | Dylan | Xem biểu đồ cơ cấu chi theo danh mục và xu hướng chi qua các tháng đang có trong bộ nhớ | So sánh chi tiêu giữa các danh mục và giữa các tháng | Chưa có |
| 3 | Dylan | Mở mini dashboard, chọn khoảng thời gian 3/6/9/12 tháng gần đây (DEC-032, DEC-033) | Xem biểu đồ tổng chi thực tế theo từng tháng trong khoảng đã chọn, so sánh với tổng ngân sách/thu nhập tháng đó; khoảng thời gian tính từ tháng hiện tại theo đồng hồ hệ thống, lùi về trước (DEC-034) | Chưa có |
| 4 | Dylan | Xuất dữ liệu ra file JSON | Có bản sao dữ liệu tải về máy | Chưa có |

Điều kiện rẽ nhánh:

| Điều kiện | Đi tiếp tới | Ghi chú |
| --- | --- | --- |
| Tổng chi ≥ 90% thu nhập tháng | Hiển thị cảnh báo màu cảnh báo trên thanh tiến độ | Ngưỡng cố định trong code |
| Trong khoảng 3/6/9/12 tháng gần đây có tháng chưa được tạo (không có `MonthBudget`) | Bỏ qua tháng đó trên biểu đồ, không hiển thị cột/điểm trống | DEC-036 |

Trường hợp hỏng:

| Tình huống | Hệ quả nghiệp vụ | Cách xử lý hiện tại |
| --- | --- | --- |
| Xu hướng nhiều tháng chỉ tính trên các tháng đang có trong state hiện tại của trình duyệt | Không phản ánh đúng lịch sử dài hạn nếu dữ liệu từng bị mất/reset | Sẽ được giải quyết cùng M1 (lưu trữ bền vững) |
| Mini dashboard 3/6/9/12 tháng (bước 3) cần dữ liệu nhiều tháng liên tục | Nếu làm trước khi có M1, chỉ xem được các tháng đang có trong state trình duyệt hiện tại — không đúng nghĩa "12 tháng gần đây" | Phụ thuộc M1 hoàn thành trước, xem mục 7 (DEC-035) |

## 5. Điểm Chạm Giữa Các Luồng

Nơi hai luồng dùng chung dữ liệu hoặc chặn nhau — đây là chỗ hay sinh lỗi khi làm từng function riêng lẻ.

| # | Luồng A | Luồng B | Dùng chung / phụ thuộc | Rủi ro nếu đổi một bên |
| --- | --- | --- | --- | --- |
| 1 | F1 (Ghi nhận chi tiêu) | F2 (Ngân sách theo danh mục) | Giao dịch được gán vào danh mục theo tên hiển thị; "chi thực tế" trên bảng ngân sách sẽ là số tính lại tự động từ tổng giao dịch (DEC-007), không còn ô sửa tay riêng | Đổi tên hoặc xóa danh mục ở F2 có thể làm giao dịch cũ ở F1 mất liên kết hoặc số liệu không còn khớp nhau; sửa/xóa giao dịch ở F1 (mục 7 #3) phải trừ/cộng đúng danh mục để bảng ngân sách ở F2 luôn khớp |
| 2 | F3 (Quản lý theo chu kỳ tháng) | F1 + F2 | Việc tạo tháng mới (trống hay clone) quyết định trạng thái ban đầu của danh mục và ngân sách cho toàn bộ thao tác ghi nhận/điều chỉnh trong tháng đó | Nếu logic tạo tháng thay đổi (vd đổi danh mục mặc định) mà không đồng bộ, dữ liệu giữa các tháng sẽ không nhất quán |
| 3 | F4 (Phân tích) | F1 + F2 + F3 | Toàn bộ số liệu insight và biểu đồ được tính lại từ dữ liệu của tất cả các tháng đang có | Nếu F1-F3 chuyển sang lưu trữ bền vững (DB) mà F4 vẫn đọc từ state cũ, insight sẽ sai lệch với dữ liệu thật |

## 6. Bản Đồ Function

| Function | Tên | Luồng | Mục tiêu | Trạng thái |
| --- | --- | --- | --- | --- |
| US-001 | Lưu trữ chi tiêu bền vững (data model + migration) | F1, F2, F3, F4 | M1 | Delivered With Notes |
| US-002 | Route/module riêng cho Quản lý chi tiêu | F1, F2, F3, F4 | M2 | Delivered With Notes |
| US-004 | Sửa/xóa từng giao dịch | F1 | M1 | Delivered With Notes (2026-08-05) |
| US-003 | Liên kết giao dịch theo danh mục bằng ID, không theo tên | F1, F2 | M1 | Delivered (artifact riêng từ 2026-08-06, hành vi đã triển khai cùng đợt US-001) |
| US-005 | Ràng buộc toàn vẹn danh mục + giao dịch không danh mục | F2, F1 | M1 | Delivered With Notes (2026-08-06) |
| US-010 | Chặn trùng tên danh mục | F2, F1 | M1 | Raw |
| US-006 | Tạo/sao chép tháng ngân sách trên dữ liệu bền vững (cảnh báo trùng tháng) | F3 | M1, M2 | Raw |
| US-007, US-008 | Phân tích và xuất dữ liệu chi tiêu từ dữ liệu bền vững | F4 | M1 | Raw |
| US-009 | Cấu hình ngưỡng ngân sách (cảnh báo, mục tiêu chi, quỹ linh hoạt) | F2, F4 | M1 | Raw |
| US-011 | Mini dashboard theo dõi chi tiêu 3/6/9/12 tháng gần đây | F4 | M1 | Raw |
| US-012 | Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi (defect PO-01) | F1 | M1 | Delivered With Notes (2026-08-06) |
| US-015 | Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view (opportunity PO-02) | F3 | M2 | Delivered With Notes (2026-08-11) |
| US-016 | Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định (defect + opportunity PO-03) | F2 | M1 | Raw (2026-08-11) |
| US-019 | Danh sách items cần mua theo tháng tại bảng thu chi | F3 | M3 (mục tiêu mới, `DEC-105`) | Spec đang hoàn thiện (2026-08-14) |

Trạng thái `Raw`: `ssr-raw` đã cấp mã và tạo raw + BA wiki stub cho toàn bộ 11 US (2026-08-03, sau khi user duyệt "DUYỆT TẠO CHO 11 US"). Tính đến 2026-08-06, US-001, US-002, US-003, US-004, US-005 đã đi hết pipeline (`ba → plan → data (khi cần) → task → implement → review/test → report`), đều verdict `Pass`/`Pass With Notes` — xem `report.md` tương ứng trong `docs/features/`. 6 US còn lại (US-006 đến US-011, trừ US-010 đã liệt kê ở trên) vẫn dừng ở `Raw`, chưa có spec. Chi tiết từng mã xem `docs/requirements-index.md`.

## 7. Khoảng Trống Và Ưu Tiên

| # | Khoảng trống | Luồng ảnh hưởng | Ai chịu thiệt | Ưu tiên | Effort |
| --- | --- | --- | --- | --- | --- |
| 1 | ~~Dữ liệu chỉ lưu ở `localStorage`, không có backend/database dù kit đã cấu hình Prisma + SQLite~~ — **Đã giải quyết bởi US-001** (2026-08-05), xem `docs/features/US-001-luu-tru-chi-tieu-ben-vung/report.md` | F1, F2, F3, F4 | Dylan | Cao | Medium |
| 2 | ~~Trang Quản lý chi tiêu chưa tách khỏi shell chung của Dylan Plan Dashboard~~ — **Đã giải quyết bởi US-002** (2026-08-05), xem `docs/features/US-002-route-rieng-quan-ly-chi-tieu/report.md` | F1, F2, F3, F4 | Dylan | Trung bình | Medium |
| 3 | ~~Không sửa/xóa được từng giao dịch riêng lẻ tại bảng chi tiết chi tiêu, chỉ có reset toàn bộ tháng~~ — **Đã giải quyết bởi US-004** (2026-08-05), xem `docs/features/US-004-sua-xoa-tung-giao-dich/report.md` | F1, F2 | Dylan | Cao | Medium |
| 4 | ~~Giao dịch liên kết với danh mục theo tên chuỗi, không theo ID — đổi tên danh mục làm lệch dữ liệu~~ — **Đã giải quyết bởi US-003, gộp chung triển khai US-001** (2026-08-05) | F1, F2 | Dylan | Trung bình | Quick win |
| 5 | ~~Xóa danh mục không kiểm tra giao dịch liên quan, không có cảnh báo~~ — **Đã giải quyết bởi US-005** (2026-08-06), xem `docs/features/US-005-rang-buoc-toan-ven-danh-muc/report.md` | F2, F1 | Dylan | Trung bình | Medium |
| 6 | Tạo tháng mới không cảnh báo khi trùng tháng đã có | F3 | Dylan | Thấp | Quick win |
| 7 | Phân tích/xu hướng chỉ tính trên các tháng đang có trong bộ nhớ hiện tại, không phải toàn bộ lịch sử đã lưu | F4 | Dylan | Trung bình | Quick win |
| 8 | Xuất dữ liệu (JSON) chưa đọc từ nguồn lưu trữ bền vững | F4 | Dylan | Thấp | Quick win |
| 9 | Ngưỡng cảnh báo vượt ngân sách (90% thu nhập), mục tiêu tổng chi (≤ 30M) và quỹ linh hoạt (7.5M) đang cố định trong code, Dylan không tự đổi được | F2, F4 | Dylan | Trung bình | Medium |
| 10 | Thêm/sửa tên danh mục không kiểm tra trùng tên — có thể tồn tại hai danh mục cùng tên trong một tháng, gây khó xác định nhập nhanh (F1) nên gán vào danh mục nào | F2, F1 | Dylan | Trung bình | Quick win |
| 11 | Chưa có mini dashboard theo dõi tổng chi 3/6/9/12 tháng gần đây so với ngân sách/thu nhập (DEC-032, DEC-033, DEC-034); phụ thuộc M1 để có đủ dữ liệu nhiều tháng (DEC-035) | F4 | Dylan | Trung bình | Medium |
| 12 | **Defect** — khi nội dung nhập nhanh khớp từ khóa của một danh mục nhưng danh mục đó đã bị Dylan đổi tên (khác tên cố định trong `quickRules`), hệ thống âm thầm không ghi nhận giao dịch nào — không lưu, không báo lỗi, không rơi về "Chi tiêu khác" như trường hợp không khớp từ khóa nào; tái hiện thật 2026-08-06, xem `docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md` (PO-01) | F1 | Dylan | Cao | Quick win |
| 13 | ~~Khu vực "Lịch sử thu chi" (thẻ tháng quick view, `/budget`) hiển thị không giới hạn số thẻ tháng thay vì chỉ tháng liền kề tháng đang xem~~ — **Đã giải quyết bởi US-015** (2026-08-11), xem `docs/features/US-015-quick-view-thang-lien-ke/report.md`; nguồn gốc `docs/po/review-2026-08-11-quick-view-thang.md` (PO-02) | F3 | Dylan | Trung bình | Quick win |
| 14 | **Defect + opportunity** — cột "Loại" trong bảng danh mục (F2) là ô nhập chữ tự do, không ràng buộc giá trị; dữ liệu thật xác nhận đã sinh ra giá trị rác ("Linh s", 1 dòng) thay vì một nhãn nghiệp vụ hợp lệ; user chỉ đạo trực tiếp đổi thành combobox cố định 3 giá trị (Cố định/Tích lũy/Khác — "Khác" thay "Linh hoạt"), xem `docs/po/review-2026-08-11-loai-chi-tieu-combobox.md` (PO-03), `DEC-073` | F2 | Dylan | Cao | Quick win |
| 15 | Không có nơi nào trong bảng thu chi để Dylan ghi lại sản phẩm cần mua theo tháng (tên, giá tham khảo, trạng thái mua/chưa mua) — yêu cầu trực tiếp của user, không phải phát hiện qua audit; mở rộng mục tiêu sản phẩm mới `M3` (`DEC-105`), gắn vào luồng F3 vì dùng chung cơ chế tạo tháng mới, xem `US-019` | F3 | Dylan | Trung bình | Medium |

Thứ tự làm đề xuất, kèm lý do phụ thuộc:

1. #1 — Lưu trữ chi tiêu bền vững (data model + migration) — nền tảng bắt buộc, mọi khoảng trống khác đều phụ thuộc vào việc có dữ liệu thật trong database (DEC-001, DEC-003).
2. #2 — Route/module riêng cho Quản lý chi tiêu, tại `/budget` — cần tách trước hoặc song song với #1 vì đây là nơi UI sẽ gọi vào dữ liệu bền vững (DEC-002, DEC-005).
3. #4 — Liên kết giao dịch theo danh mục bằng ID — phải làm cùng lúc với #1 vì đây là một phần thiết kế data model, làm sau sẽ phải migrate lại.
4. #3, #5, #6, #10 — Sửa/xóa giao dịch, ràng buộc khi xóa danh mục, cảnh báo trùng tháng, chặn trùng tên danh mục — các thao tác hằng ngày, làm ngay sau khi có nền tảng dữ liệu bền vững.
5. #9 — Cấu hình ngưỡng ngân sách — làm sau khi có data model bền vững vì cần nơi lưu trữ ngưỡng theo từng tháng/người dùng (DEC-006).
6. #7, #8, #11 — Phân tích lịch sử đầy đủ, xuất dữ liệu từ DB, và mini dashboard 3/6/9/12 tháng — chỉ có ý nghĩa sau khi dữ liệu nhiều tháng đã được lưu bền vững (DEC-035).

## 8. Quyết Định Đã Chốt Với User

Chỉ ghi những gì user đã xác nhận tường minh. Suy đoán thuộc mục 7, không thuộc mục này.

| # | Câu hỏi đã hỏi | Phương án user chọn | Ngày | Ghi vào `decisions.md` |
| --- | --- | --- | --- | --- |
| 1 | Hệ thống quản lý chi tiêu nên ưu tiên mục tiêu nào trong giai đoạn tới? | Lưu trữ bền vững: chuyển dữ liệu từ `localStorage` sang database thật (Prisma/SQLite) | 2026-07-28 | `DEC-001` |
| 2 | Hệ thống quản lý chi tiêu có nên tách khỏi Dylan Plan Dashboard hay không? | Tách route riêng, dùng chung codebase Next.js hiện tại | 2026-07-28 | `DEC-002` |
| 3 | Trong các khoảng trống hiện tại, cái nào cần làm trước? | Lưu database thay vì `localStorage` trước tiên | 2026-07-28 | `DEC-003` |
| 4 | Ai là người dùng chính cần được phục vụ trước? | Chỉ cá nhân Dylan (single-user, không cần đăng nhập/phân quyền) | 2026-07-28 | `DEC-004` |
| 5 | Tên route cụ thể cho module Quản lý chi tiêu là gì? | `/budget` | 2026-07-29 | `DEC-005` |
| 6 | Các ngưỡng cố định (cảnh báo 90%, mục tiêu chi ≤ 30M, quỹ linh hoạt 7.5M) nên giữ cố định hay cho cấu hình? | Cho Dylan tự cấu hình từng ngưỡng | 2026-07-29 | `DEC-006` |
| 7 | Khi sửa/xóa một giao dịch, "Chi thực tế" của danh mục nên cập nhật thế nào? | Tính lại tự động = tổng giao dịch của danh mục (derived), không còn lưu tay | 2026-07-29 | `DEC-007` |
| 8 | Sửa một giao dịch được phép đổi những trường nào? | Đầy đủ: nội dung, số tiền, danh mục, ngày | 2026-07-29 | `DEC-008` |
| 9 | Xóa một giao dịch có cần xác nhận trước khi xóa không? | Có, hiện hộp xác nhận trước khi xóa | 2026-07-29 | `DEC-009` |
| 10 | Có giới hạn chỉ được sửa/xóa giao dịch của tháng đang chọn hay cho phép cả các tháng đã qua? | Chỉ tháng đang chọn | 2026-07-29 | `DEC-010` |
| 11 | Toast thông báo thành công (chứa số tiền + danh mục) nên hiện trong trường hợp nào? | Mọi lần Ghi nhận thành công, dù danh mục tự gán theo từ khóa hay Dylan tự chọn tay | 2026-07-29 | `DEC-011` |
| 12 | Toast nên tự đóng sau một khoảng thời gian hay cần Dylan bấm đóng thủ công? | Tự đóng sau vài giây | 2026-07-29 | `DEC-012` |
| 13 | Nếu ngày/thứ được nhắc tới rơi vào tương lai so với hôm nay, hệ thống nên xử lý thế nào? | Chỉ chấp nhận ngày quá khứ hoặc hôm nay; ngày tương lai coi là không hợp lệ | 2026-07-29 | `DEC-013` |
| 14 | Nếu không nhận diện được cú pháp thời gian hợp lệ trong nội dung, hệ thống nên xử lý thế nào? | Bỏ qua, ghi nhận tại thời điểm nhập như hiện tại | 2026-07-29 | `DEC-014` |
| 15 | Phần thời gian được nhắc tới có nên giữ lại trong nội dung giao dịch lưu hay tách riêng? | Tách phần thời gian ra khỏi nội dung lưu, chỉ giữ phần mô tả chi tiêu | 2026-07-29 | `DEC-015` |
| 16 | Có cần hỗ trợ thêm các cách viết thời gian khác ngay từ đầu không? | Mở rộng thêm "hôm qua/hôm nay" và ngày cụ thể dạng dd/mm, ngoài thứ trong tuần và ngày trong tháng | 2026-07-29 | `DEC-016` |
| 17 | Khi mốc thời gian ở tương lai/không hợp lệ, ngày ghi nhận nên là gì? Mục tiêu của bước ghi nhận là gì? | Cập nhật ngày ghi nhận là ngày hiện tại; F1 chỉ ghi nhận các giao dịch đã xảy ra (từ hiện tại về quá khứ), áp dụng cho cả nhập mới lẫn sửa trường ngày | 2026-07-29 | `DEC-017` |
| 18 | Khi mốc thời gian bị bỏ qua vì tương lai/không hợp lệ, Dylan có cần được báo riêng về việc này không? | Có, báo trong cùng toast xác nhận (thêm ghi chú lý do) | 2026-07-29 | `DEC-018` |
| 19 | Bảng danh mục ở F2 có cần cột Tỷ trọng không, và cột Chênh lệch nên gọi là gì? | Bỏ cột Tỷ trọng; đổi tên "Chênh lệch" thành "Còn lại", dùng chung tên với "Số dư còn lại" (tổng tháng), phân biệt qua ngữ cảnh | 2026-07-29 | `DEC-019` |
| 20 | Kiểm tra trùng tên danh mục có áp dụng khi sửa tên hay chỉ khi thêm mới? | Áp dụng cho cả thêm mới và sửa tên, trong phạm vi tháng đang chọn | 2026-07-29 | `DEC-020` |
| 21 | Khi Dylan cố thêm/sửa thành tên trùng, hệ thống nên xử lý thế nào? | Chặn thao tác, hiện thông báo lỗi rõ ràng | 2026-07-29 | `DEC-021` |
| 22 | So sánh trùng tên có nên bỏ qua hoa/thường và khoảng trắng thừa không? | Có, bỏ qua hoa/thường và khoảng trắng thừa đầu-cuối | 2026-07-29 | `DEC-022` |
| 23 | ~~Danh mục "Chi tiêu khác" nên được tạo khi nào, và có bị khóa không?~~ | ~~Luôn có sẵn trong mọi tháng như danh mục mặc định; không khóa~~ — **Superseded bởi `DEC-026`, xem dòng 26** | 2026-07-29 | `DEC-023` (Superseded) |
| 24 | Khi xóa một danh mục không khóa, giao dịch của danh mục đó nên xử lý thế nào? | Chuyển toàn bộ giao dịch sang danh mục "Chi tiêu khác" | 2026-07-29 | `DEC-024` |
| 25 | ~~Nếu Dylan xóa chính "Chi tiêu khác" trong khi nó đang có giao dịch, hệ thống nên xử lý thế nào?~~ | ~~Chặn xóa nếu "Chi tiêu khác" đang có giao dịch~~ — **Superseded bởi `DEC-027`, xem dòng 27** | 2026-07-29 | `DEC-025` (Superseded) |
| 26 | (Đảo DEC-023) "Chi tiêu khác" nên có sẵn mặc định mọi tháng hay chỉ sinh khi cần? | Chỉ tự sinh khi cần: có giao dịch không danh mục, hoặc danh mục cha bị xóa | 2026-07-29 | `DEC-026` |
| 27 | (Đảo DEC-025) "Chi tiêu khác" nên khóa vĩnh viễn hay chỉ chặn xóa khi còn giao dịch? | Khóa vĩnh viễn, chỉ xem, không bao giờ cho xóa | 2026-07-29 | `DEC-027` |
| 28 | "Chi tiêu không được gán danh mục nào" nên phát sinh từ đâu — có cần nới F1 để cho bỏ qua chọn danh mục không? | Nới F1: cho phép ghi nhận mà không cần chọn danh mục, tự động vào "Chi tiêu khác" | 2026-07-29 | `DEC-028` |
| 29 | "Chi tiêu khác" có nên luôn hiển thị trên giao diện hay chỉ khi có giao dịch? | Chỉ hiển thị khi đang có giao dịch; ẩn khỏi giao diện end-user khi không còn giao dịch nào | 2026-07-29 | `DEC-029` |
| 30 | "Ẩn khỏi giao diện" (DEC-029) là xóa hẳn bản ghi danh mục hay chỉ lọc khỏi màn hình hiển thị? | Chỉ lọc khỏi màn hình hiển thị; bản ghi danh mục vẫn được giữ nguyên trong dữ liệu | 2026-07-29 | `DEC-030` |
| 31 | Sau khi xóa một giao dịch (đã xác nhận qua hộp thoại — DEC-009), có cần tính năng khôi phục (undo) không? | Không phát triển undo | 2026-07-29 | `DEC-031` |
| 32 | Mini dashboard theo dõi chi tiêu 3/6/9/12 tháng nên là phần mở rộng của F4 hay luồng riêng? | Mở rộng F4, không tách luồng riêng | 2026-07-29 | `DEC-032` |
| 33 | Mini dashboard nên hiển thị nội dung gì là chính? | Tổng chi theo tháng (xu hướng) + so sánh với ngân sách/thu nhập tháng đó | 2026-07-29 | `DEC-033` |
| 34 | "3/6/9/12 tháng gần đây" nên tính từ đâu? | Từ tháng hiện tại theo đồng hồ hệ thống, lùi về trước | 2026-07-29 | `DEC-034` |
| 35 | Mini dashboard có phụ thuộc vào M1 (lưu trữ bền vững) hay làm được trên dữ liệu hiện tại? | Phụ thuộc M1, làm sau khi có dữ liệu bền vững | 2026-07-29 | `DEC-035` |
| 36 | Khi trong khoảng 3/6/9/12 tháng có tháng chưa được tạo, mini dashboard nên xử lý thế nào? | Bỏ qua tháng đó, không hiển thị cột/điểm trống | 2026-07-29 | `DEC-036` |
| 37 | `po-expert` trả `Blocked` cho spec `US-019` (Items cần mua) vì không nằm trong mục tiêu (M1/M2) hay Bản Đồ Function của Business Flow — nên mở rộng Business Flow hay coi là tiện ích độc lập giống `US-018`/`DEC-088`? | Mở rộng Business Flow: thêm mục tiêu mới `M3`, gắn `US-019` vào luồng F3 | 2026-08-14 | `DEC-105` |
| 38 | Mục tiêu `M3` mới nên diễn đạt cụ thể ra sao? | "Hỗ trợ Dylan lên kế hoạch mua sắm theo tháng ngay trong bảng thu chi, giảm nguy cơ quên hoặc mua trùng đồ cần mua" | 2026-08-14 | `DEC-105` |
| 39 | "Tháng được phép thêm/sửa/xóa Items cần mua" nên xác định thế nào — theo tháng đang chọn xem trên dropdown, theo tháng có kỳ lớn nhất đã tồn tại, hay theo đồng hồ hệ thống? | Theo đồng hồ hệ thống — luôn là tháng thực tế hiện tại, độc lập với dropdown "Chọn tháng xem" | 2026-08-14 | `DEC-107` |

Còn chờ user quyết: không còn câu hỏi chặn ở mức Business Flow — câu hỏi #1 (dưới đây) đã được user trả lời "DUYỆT TẠO CHO 11 US" (2026-08-03), `ssr-raw` đã tạo raw cho toàn bộ 11 US. Câu hỏi mở còn lại nằm ở từng raw file riêng lẻ (xem mục 4 của từng `docs/kb/ba/raw/US-###-*.md`), sẽ do `ssr-ba` xử lý khi viết spec.

| # | Câu hỏi | Trạng thái |
| --- | --- | --- |
| 1 | Trong 11 đề xuất User Story ở mục 7 (`docs/kb/ba/backlog.md`), đề xuất nào được duyệt để tạo raw requirement (`ssr-raw`) và triển khai trước? | Đã trả lời — user duyệt cả 11 US (`DEC` liên quan: DEC-037, DEC-038 phát sinh khi tạo raw) |

## 9. Nguồn Bằng Chứng

| Bằng chứng | Path | Dùng cho mục nào |
| --- | --- | --- |
| Component chính chứa toàn bộ UI/logic Thu chi hiện tại | `components/DylanPlanApp.tsx` | Mục 1, 2, 3, 4, 5, 7 |
| Trang gốc render component | `app/page.tsx` | Mục 2 |
| Cấu hình dự án, xác nhận kit đã trỏ Prisma/SQLite nhưng chưa có schema thật | `.ssr-kit.env`, thư mục `prisma/` không tồn tại | Mục 1 (M1), mục 7 (#1) |
| Chưa có function/spec nào được tạo trước đây | `docs/kb/ba/00-index.md`, `docs/kb/dev/00-index.md`, `docs/requirements-index.md` | Mục 6 |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-28) | Hội thoại phiên 2026-07-28 | Mục 1, 8 |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 1) — chốt tên route và cách xử lý ngưỡng cố định | Hội thoại phiên 2026-07-29 | Mục 7 (#9), 8 |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 2) — chốt cách tính chi thực tế, phạm vi sửa, xác nhận xóa, phạm vi tháng cho F1 | Hội thoại phiên 2026-07-29 | Mục 3, 4 (F1, F2), 7 (#3), 8 |
| Nhận định JDG-001 (đã có trước, được xác nhận thành DEC-007 ở lượt này) | `docs/memory/judgement-log.md#jdg-001` | Mục 8 (DEC-007) |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 3) — chốt toast xác nhận ghi nhận thành công cho F1 bước 1-2 | Hội thoại phiên 2026-07-29 | Mục 3, 4 (F1), 8 |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 4) — chốt cách nhận diện mốc thời gian ("Thứ N", "ngày N", "hôm qua/hôm nay", dd/mm) trong nội dung nhập nhanh của F1 | Hội thoại phiên 2026-07-29 | Mục 3, 4 (F1), 8, 9 |
| Xác nhận của user trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 5) — chốt nguyên tắc F1 chỉ ghi nhận giao dịch đã xảy ra (ngày ≤ hôm nay), áp dụng cho cả nhập mới và sửa giao dịch | Hội thoại phiên 2026-07-29 | Mục 3, 4 (F1), 8, `docs/memory/rules.md` P1.1 |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 6) — chốt có báo cho Dylan trong toast khi ngày bị đổi vì mốc thời gian không hợp lệ/tương lai | Hội thoại phiên 2026-07-29 | Mục 3, 4 (F1), 8 |
| Component chứa bảng danh mục F2 (cột Ngân sách/Chi thực tế/Chênh lệch/Tỷ trọng) | `components/DylanPlanApp.tsx:1288-1324` | Mục 4 (F2), 8 (DEC-019) |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 7) — chốt bỏ cột Tỷ trọng, đổi tên Chênh lệch thành Còn lại ở F2 | Hội thoại phiên 2026-07-29 | Mục 4 (F2), 8 |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 8) — chốt ràng buộc không cho trùng tên danh mục ở F2 (phạm vi, cách xử lý, chuẩn hóa so sánh) | Hội thoại phiên 2026-07-29 | Mục 4 (F2), 7 (#10), 8 |
| Danh mục mặc định hiện tại, xác nhận chưa có "Chi tiêu khác" | `components/DylanPlanApp.tsx:57-66` (`defaultCategories`) | Mục 4 (F2), 8 (DEC-023) |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 9) — chốt xử lý xóa danh mục: chuyển giao dịch sang "Chi tiêu khác", quy tắc riêng khi xóa chính "Chi tiêu khác" | Hội thoại phiên 2026-07-29 | Mục 3, 4 (F2), 7 (#5), 8 |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 10) — đảo `DEC-023`/`DEC-025`: "Chi tiêu khác" chỉ sinh khi cần và khóa vĩnh viễn; nới F1 cho bỏ qua chọn danh mục | Hội thoại phiên 2026-07-29 | Mục 3, 4 (F1, F2), 7 (#5), 8 |
| Yêu cầu trực tiếp của user (2026-07-29, lượt 11) — "Chi tiêu khác" chỉ hiển thị khi còn giao dịch, ẩn khỏi giao diện end-user khi không còn | Hội thoại phiên 2026-07-29 | Mục 3, 4 (F1, F2), 8 (DEC-029) |
| Trả lời trực tiếp của user (2026-07-29, lượt 12) — "ẩn khỏi giao diện" chỉ là lọc khỏi màn hình hiển thị, không xóa bản ghi danh mục | Hội thoại phiên 2026-07-29 | Mục 8 (DEC-030), 9 |
| Yêu cầu trực tiếp của user (2026-07-29, lượt 13) — không phát triển undo khi xóa giao dịch | Hội thoại phiên 2026-07-29 | Mục 4 (F1), 8 (DEC-031), 9 |
| Trả lời của user qua `AskUserQuestion` trong phiên làm việc `ssr-po mode=business-flow` (2026-07-29, lượt 14) — chốt mini dashboard 3/6/9/12 tháng: mở rộng F4, nội dung chính, mốc tính tháng, phụ thuộc M1 | Hội thoại phiên 2026-07-29 | Mục 3, 4 (F4), 6, 7 (#11), 8 |
| Xác nhận trực tiếp của user (2026-07-29, lượt 15) — mini dashboard bỏ qua tháng chưa được tạo trong khoảng 3/6/9/12 tháng | Hội thoại phiên 2026-07-29 | Mục 4 (F4), 8 (DEC-036), 9 |
| Yêu cầu trực tiếp của user (2026-08-03) — "DUYỆT TẠO CHO 11 US"; `ssr-raw` tạo raw + BA wiki cho US-001..US-011, kèm 2 câu hỏi mở mới được chốt qua `AskUserQuestion` (di trú dữ liệu US-001 → DEC-037, nơi lưu ngưỡng US-009 → DEC-038) | Hội thoại phiên 2026-08-03 (`ssr-po mode=intake` → `ssr-raw`) | Mục 6, 8, `docs/requirements-index.md`, `docs/kb/ba/raw/US-001-*.md`, `docs/kb/ba/raw/US-009-*.md` |
| PO review phát hiện defect khi nhận diện danh mục nhập nhanh: rule khớp từ khóa nhưng danh mục đã đổi tên khiến ghi nhận âm thầm thất bại — tái hiện thật trên `next dev` | `docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md` | Mục 6 (US-004/US-005 cập nhật trạng thái Delivered), mục 7 (#3, #5 đã giải quyết; #12 mới) |
| PO review + ảnh chụp màn hình do user cung cấp (2026-08-11): khu vực "Lịch sử thu chi" hiển thị không giới hạn số thẻ tháng; user chỉ đạo trực tiếp giới hạn còn 3 thẻ (trước/đang xem/sau); chốt qua `AskUserQuestion` cách tính tháng liền kề (theo danh sách đã tạo) và cách xử lý ô thiếu (ẩn ô) | `docs/po/review-2026-08-11-quick-view-thang.md`, `components/BudgetApp.tsx:741-759` | Mục 7 (#13 mới) |
| PO review + chỉ đạo trực tiếp của user qua 2 lượt `ssr-po` (2026-08-11): cột "Loại" (F2) đổi từ ô nhập chữ tự do sang combobox cố định 3 giá trị (Cố định/Tích lũy/Khác); dữ liệu thật (`prisma/dev.db`) xác nhận có giá trị rác "Linh s" | `docs/po/review-2026-08-11-loai-chi-tieu-combobox.md` (PO-03), `docs/memory/decisions.md#dec-073`, `components/BudgetApp.tsx:330-335,416,984-990,1061-1062`, `lib/budget-defaults.ts:15-22` | Mục 7 (#14 mới), 8 |

Phần suy ra từ source hoặc wiki mà **chưa** được user xác nhận phải ghi rõ ở đây kèm nhãn `Giả định hợp lý` hoặc `Cần user xác nhận`.

| Nội dung | Nhãn |
| --- | --- |
| Tên và số lượng function đề xuất ở mục 6, 7 (data model, route riêng, sửa/xóa giao dịch, liên kết theo ID, ràng buộc khi xóa danh mục, cảnh báo trùng tháng, phân tích lịch sử, xuất dữ liệu, cấu hình ngưỡng, mini dashboard) | Giả định hợp lý — rút từ khoảng trống quan sát được trong code hoặc yêu cầu trực tiếp của user, chưa được user duyệt để tạo raw |
| Thứ tự triển khai đề xuất ở mục 7 | Giả định hợp lý — dựa trên phụ thuộc kỹ thuật (dữ liệu bền vững phải có trước) |
| Nơi lưu trữ cụ thể cho các ngưỡng cấu hình được (trên `MonthBudget` hay bảng Settings riêng) | Cần user xác nhận — DEC-006 mới chốt "cho cấu hình", chưa chốt thiết kế lưu trữ; để `ssr-data` đề xuất khi tới lượt |

| Bằng chứng | Path | Dùng cho mục nào |
| --- | --- | --- |
| Trả lời của user qua `AskUserQuestion` trong phiên `ssr-ba` cho `US-019` (2026-08-14), sau khi `po-expert` trả `Blocked` — chốt mở rộng Business Flow (thêm `M3`) thay vì coi `US-019` là tiện ích độc lập như tiền lệ `US-018`/`DEC-088` | Hội thoại phiên 2026-08-14 (`ssr-ba US-019` → `ssr-po mode=business-flow`) | Mục 1 (M3), 3, 4 (F3), 6, 7 (#15), 8 (`DEC-105`) |
