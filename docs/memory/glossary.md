# glossary.md — Từ điển thuật ngữ của dự án

Updated: 2026-08-14
Scope: Dự án `DylanPlan`.
Kế thừa: `${CLAUDE_PLUGIN_ROOT}/memory/glossary.md` (thuật ngữ kit + Next.js + Prisma + SQLite).

Quy tắc: mỗi thuật ngữ có **đúng một** định nghĩa. Nếu một từ đang mang hai nghĩa trong hệ thống, đó là finding — phải tách tên, không ghi hai dòng.

---

## 1. Thuật ngữ nghiệp vụ

| Thuật ngữ | Định nghĩa | Model Prisma | Nhãn hiển thị | Không nhầm với |
| --- | --- | --- | --- | --- |
| Danh mục | Nhóm chi tiêu dùng để phân loại giao dịch và đặt ngân sách (vd Ăn uống, Di chuyển) | `Category` | "Danh mục" | Loại danh mục |
| Loại danh mục | Phân nhóm danh mục theo tính chất — combobox cố định đúng 3 giá trị, không nhập tự do: Cố định, Tích lũy, Khác (DEC-073, 2026-08-11; "Khác" thay thế hoàn toàn "Linh hoạt" cũ) | `Category.type` | "Loại" | Danh mục |
| Ngân sách | Số tiền dự kiến chi cho một danh mục trong một tháng | `Category.budget` | "Ngân sách" | Chi thực tế |
| Chi thực tế | Tổng số tiền đã chi cho một danh mục trong tháng — số suy ra (derived) từ tổng giao dịch của danh mục đó, không lưu tay (DEC-007) | Không có cột riêng — tính bằng `prisma.transaction.aggregate({ _sum: { amount: true }, where: { categoryId } })` tại thời điểm đọc | "Chi thực tế" | Ngân sách |
| Giao dịch | Một lần ghi nhận chi tiêu gồm nội dung, số tiền, danh mục, thời điểm | `Transaction` | "Giao dịch" | Danh mục |
| Tháng ngân sách | Tập hợp thu nhập, danh mục và giao dịch của một tháng cụ thể | `MonthBudget` | "Tháng" | Giao dịch |
| Nhập nhanh | Nhập một dòng văn bản tự nhiên (vd "cafe 45k") để hệ thống tự tách số tiền và gợi ý danh mục | Không có model riêng — là hành vi UI | "Nhập nhanh chi tiêu" | Giao dịch |
| Còn lại (theo danh mục) | Ngân sách trừ Chi thực tế của **một danh mục** trong tháng (DEC-019, trước đây gọi là "Chênh lệch") | Không lưu riêng, tính khi hiển thị từ `Category.budget` trừ tổng `aggregate` của `Transaction` | "Còn lại" (cột trong bảng danh mục ở F2) | "Số dư còn lại" — đó là mức **tổng cả tháng** (Thu nhập - Tổng chi thực tế), xem mục 4; hai chỉ số cùng tên nhưng khác phạm vi, phân biệt qua ngữ cảnh hiển thị |
| Chi tiêu khác | Danh mục dự phòng, **không** có sẵn mặc định — chỉ tự sinh khi tháng đang chọn lần đầu phát sinh giao dịch không có danh mục (Dylan bỏ qua chọn danh mục ở F1 — DEC-028) hoặc danh mục cha của một giao dịch bị xóa (DEC-024). Khóa vĩnh viễn — chỉ xem, không cho sửa/xóa (DEC-027). Chỉ **hiển thị** trên giao diện khi đang có ít nhất một giao dịch; khi hết giao dịch thì bản ghi vẫn giữ nguyên trong dữ liệu, chỉ bị lọc khỏi màn hình hiển thị (DEC-029, DEC-030) | `Category` (bản ghi thường, không có field đánh dấu riêng — nhận diện qua `locked=true` và không nằm trong seed mặc định; chưa triển khai, thuộc US-005) | "Chi tiêu khác" | Danh mục thường khác và các danh mục khóa cố định ("Tiền nhà", "Chi phí cố định khác") — "Chi tiêu khác" khóa nhưng không phải danh mục mặc định có sẵn/luôn hiển thị như hai danh mục kia |
| Di trú dữ liệu cũ | Việc chuyển một lần dữ liệu tháng/danh mục/giao dịch Dylan đã ghi trong `localStorage` sang lưu trữ bền vững (US-001); tự động thử lại khi bị gián đoạn, dùng trạng thái dùng chung giữa các thiết bị để tránh chạy trùng (DEC-039, DEC-040) | `LegacyMigration` (một dòng duy nhất, `id="singleton"`, `status`: `Pending`/`InProgress`/`Completed`/`Failed`) | "Di trú dữ liệu" | Không nhầm với việc di trú cấu trúc dữ liệu (kỹ thuật) — đây là di trú **dữ liệu người dùng**, một lần duy nhất |
| Job ứng tuyển | Một job/vị trí tuyển dụng Dylan đang quan tâm và theo dõi trạng thái nộp CV (hồ sơ xin việc) — gồm Công ty, Ngày hết hạn, Platform, Link, Trạng thái, Ghi chú. Thuộc trang Roadmap, độc lập với Hệ Thống Quản Lý Chi Tiêu (US-018, DEC-088) | Chưa có model — entity mới, chờ `ssr-data` (`ENT-004`) | "Theo dõi CV ứng tuyển" (tên bảng trên trang Roadmap) | Danh mục, Giao dịch — thuộc hệ Quản lý chi tiêu, không liên quan |
| Platform (tuyển dụng) | Danh sách kênh/nền tảng tuyển dụng (vd ITViec, LinkedIn, VietNamWork) Dylan tự quản lý cho mỗi Job ứng tuyển — cho thêm/xóa option linh động, khác combobox cố định của "Loại danh mục" (US-018, ENT-005) | Chưa có model — entity mới, chờ `ssr-data` (`ENT-005`) | "Platform" (cột trong bảng Theo dõi CV ứng tuyển) | Loại danh mục — đó là combobox cố định 3 giá trị, không cho thêm/xóa; Platform cho thêm/xóa option tự do |
| Item cần mua | Một dòng trong danh sách mua sắm gắn theo tháng, gồm tên sản phẩm, giá (tùy chọn, chỉ tham khảo — không cộng vào Ngân sách/Chi thực tế, DEC-092) và trạng thái Pending/Purchased. Khi tạo tháng mới, item còn Pending của tháng nguồn được chuyển hẳn sang tháng mới (không giữ bản gốc, DEC-095); tháng khác tháng đang chọn xem chỉ xem, không thêm/sửa/xóa (DEC-094, DEC-096) (US-019) | Chưa có model — entity mới, chờ `ssr-data` | "Items cần mua" (khu vực trong bảng thu chi) | Danh mục, Giao dịch — không liên kết `Category`/`Transaction`, chỉ gắn theo `MonthBudget` |
| Ngày nộp hồ sơ | Mốc thời gian ghi nhận khi một Job ứng tuyển chuyển từ Interested sang Waiting; dùng làm mốc tính luật tự động "quá 7 ngày ở Waiting mà không đổi trạng thái khác → tự chuyển No Response". Bị xoá khi job chuyển ngược từ Waiting về Interested (US-020, DEC-099) | Chưa có cột — chờ `ssr-data` mở rộng `JobApplication` | "Ngày nộp hồ sơ" (mốc mới trong bảng Theo dõi CV ứng tuyển) | Ngày hết hạn — đó là hạn chót tuyển dụng do nhà tuyển dụng đặt ra, không phải thời điểm Dylan nộp CV |

## 2. Vai trò người dùng

| Vai trò | Định nghĩa | Quyền cốt lõi | Nguồn |
| --- | --- | --- | --- |
| Dylan | Chủ sở hữu ngân sách cá nhân, người dùng duy nhất của hệ thống (không đăng nhập/phân quyền — DEC-004) | Toàn quyền xem, nhập, sửa, xóa dữ liệu chi tiêu | `components/DylanPlanApp.tsx`, `docs/memory/decisions.md#dec-004` |

## 3. Trạng thái nghiệp vụ

Tính năng chi tiêu (F1-F4) chưa có trạng thái nghiệp vụ dạng workflow — mỗi tháng chỉ đơn giản là "đang chọn" hoặc "chưa được chọn" trên UI, không phải trạng thái dữ liệu.

Item cần mua (US-019) có đúng 2 trạng thái: `Pending` (màu cam/vàng, mặc định khi tạo mới) và `Purchased` (màu xanh lá, khi Dylan đánh dấu đã mua) — xem `docs/memory/decisions.md#dec-093`.

Job ứng tuyển (US-018, mở rộng US-020) có 8 trạng thái: Interested (mặc định khi thêm mới), Waiting, No Response, Response, Appointment, Cancel, Fail, và Expired (mới, US-020) — Dylan chọn/đổi tay được cả 8 (DEC-102). Hai luật tự động, tính lại mỗi khi dữ liệu bảng được tải (DEC-100): (1) job đang Interested mà quá Ngày hết hạn → tự chuyển Expired, chỉ áp dụng từ Interested (DEC-101); (2) job đang Waiting quá 7 ngày kể từ Ngày nộp hồ sơ mà không đổi sang trạng thái khác → tự chuyển No Response.

## 4. Chỉ số và công thức

| Chỉ số | Công thức | Đơn vị | Nguồn dữ liệu |
| --- | --- | --- | --- |
| Tỷ lệ sử dụng thu nhập | Tổng chi thực tế / Thu nhập tháng | % | `MonthBudget.income`, tổng `Category.actual` |
| Số dư còn lại (mức tổng tháng — không nhầm với "Còn lại" theo từng danh mục ở mục 1) | Thu nhập tháng - Tổng chi thực tế | VND | `MonthBudget.income`, tổng `Category.actual` |
| Ngưỡng cảnh báo vượt ngân sách | Tỷ lệ sử dụng thu nhập ≥ giá trị ngưỡng (mặc định 90%) | % | Hiện cố định trong code (`components/DylanPlanApp.tsx`); sẽ chuyển thành giá trị Dylan tự cấu hình được (DEC-006, chưa qua `ssr-data`) |

## 5. Viết tắt

| Viết tắt | Đầy đủ | Ngữ cảnh |
| --- | --- | --- |
| US | User Story | Mã function của dự án, `US-###-<slug>` (`SSR_FEATURE_CODE_PREFIX=US`) |
| DEC | Decision | Mã quyết định trong `docs/memory/decisions.md` |
