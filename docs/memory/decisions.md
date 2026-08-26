# decisions.md — Quyết định đã chốt của dự án

Updated: 2026-08-26
Scope: Dự án `DylanPlan`.

**Append-only.** Đảo quyết định = thêm bản ghi mới có `Thay thế: DEC-xxx`, đồng thời đổi bản cũ thành `Status: Superseded`.

Ghi vào đây khi: user chốt một lựa chọn, một mâu thuẫn giữa hai spec được xử lý, hoặc một đánh đổi kỹ thuật được duyệt.

Không ghi vào đây: nhận định chưa chốt (`judgement-log.md`), luật đã thành quy định (`rules.md`), chi tiết implement (function wiki).

---

### DEC-001 — Ưu tiên chuyển dữ liệu chi tiêu sang lưu trữ bền vững

- Ngày: 2026-07-28
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Tab "Thu chi" trong `DylanPlanApp.tsx` chỉ lưu dữ liệu ở `localStorage` trình duyệt, mất khi đổi máy hoặc xóa cache, dù `.ssr-kit.env` đã cấu hình sẵn Prisma + SQLite.
- Quyết định: Mục tiêu ưu tiên số 1 của hệ thống quản lý chi tiêu là chuyển dữ liệu (tháng, danh mục, giao dịch) sang lưu trữ bền vững thay vì `localStorage`.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Phân tích sâu hơn" — không giải quyết rủi ro mất dữ liệu; "Tự động hóa nhập liệu (OCR/import bank)" — phức tạp hơn, nên làm sau khi có nền tảng dữ liệu; "Chia sẻ ngân sách nhiều người" — kéo theo yêu cầu tài khoản/phân quyền không cần thiết.
- Hệ quả: Mọi requirement sau (sửa/xóa giao dịch, quản lý danh mục, quản lý tháng, phân tích) đều phụ thuộc vào việc có data model + migration Prisma/SQLite trước.
- Bằng chứng: `docs/kb/ba/business-flow.md#1-định-hướng-sản-phẩm`, `components/DylanPlanApp.tsx`

### DEC-002 — Tách route riêng cho Quản lý chi tiêu, dùng chung codebase

- Ngày: 2026-07-28
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Hiện tab "Thu chi" đang gộp chung shell/nav với roadmap sự nghiệp, freelance và sản phẩm trong cùng một trang `DylanPlanApp.tsx`.
- Quyết định: Hệ thống quản lý chi tiêu sẽ có route/module riêng trong cùng dự án Next.js (`Dylan.Plan`), tách khỏi các tab còn lại, nhưng không tách thành dự án độc lập.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Vẫn trong 1 app, chỉ nâng cấp tab hiện có" — không giải quyết được việc gộp chung điều hướng; "Tách hẳn dự án riêng" — quá nhiều việc thiết lập lại, không cần thiết ở giai đoạn này.
- Hệ quả: Cần một US riêng cho việc tạo route/module Quản lý chi tiêu tách khỏi shell chung; tên route cụ thể chưa chốt (xem Business Flow mục 9, "Cần user xác nhận").
- Bằng chứng: `docs/kb/ba/business-flow.md#1-định-hướng-sản-phẩm`, `app/page.tsx`, `components/DylanPlanApp.tsx`

### DEC-003 — Thứ tự ưu tiên: hoàn thành lưu trữ database trước các US khác

- Ngày: 2026-07-28
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Có nhiều khoảng trống được xác định trong tính năng Thu chi (sửa/xóa giao dịch, ràng buộc danh mục, cảnh báo trùng tháng, phân tích lịch sử...), cần thứ tự rõ ràng để tránh làm lại.
- Quyết định: Việc chuyển dữ liệu sang database (thay `localStorage`) phải hoàn thành trước khi làm các khoảng trống khác.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Sửa/xóa từng giao dịch trước" và "Báo cáo/thống kê nâng cao trước" — cả hai đều phải làm lại nếu làm trước khi có data model bền vững.
- Hệ quả: Roadmap đề xuất ở Business Flow mục 7 xếp US data model lên đầu tiên; các US phụ thuộc dữ liệu bền vững đứng sau.
- Bằng chứng: `docs/kb/ba/business-flow.md#7-khoảng-trống-và-ưu-tiên`

### DEC-004 — Hệ thống chỉ phục vụ một người dùng (Dylan), không cần đăng nhập/phân quyền

- Ngày: 2026-07-28
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Code hiện tại hard-code thu nhập mặc định 35M và danh mục cho một người, không có khái niệm tài khoản.
- Quyết định: Người dùng chính cần phục vụ trước là chỉ cá nhân Dylan; hệ thống không cần đăng nhập, phân quyền hay chia sẻ dữ liệu với người khác ở giai đoạn này.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Dylan + gia đình dùng chung" và "Nhiều người dùng độc lập (multi-tenant)" — cả hai kéo theo yêu cầu tài khoản/phân quyền không cần thiết ở giai đoạn hiện tại.
- Hệ quả: Data model và các US không cần thiết kế bảng User/quyền truy cập; nếu sau này mở rộng multi-user, đây sẽ là một quyết định mới thay thế DEC-004.
- Bằng chứng: `docs/kb/ba/business-flow.md#2-bối-cảnh-và-người-dùng`, `components/DylanPlanApp.tsx` (`DEFAULT_INCOME`, `defaultCategories`)

### DEC-005 — Tên route module Quản lý chi tiêu: `/budget`

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: DEC-002 đã chốt tách route riêng cho module Quản lý chi tiêu nhưng chưa chốt tên route cụ thể.
- Quyết định: Route của module Quản lý chi tiêu là `/budget`, nhấn mạnh khía cạnh ngân sách theo danh mục thay vì chỉ giao dịch.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: `/expenses` — tên tiếng Anh chung chung, không nhấn trọng tâm ngân sách; `/chi-tieu` — tên tiếng Việt không dấu, không khớp quy ước đặt route tiếng Anh còn lại của dự án.
- Hệ quả: US "Route/module riêng cho Quản lý chi tiêu" (Business Flow mục 7 #2, `backlog.md` #2) dùng route `/budget` khi tạo raw/spec.
- Bằng chứng: `docs/kb/ba/business-flow.md#9-nguồn-bằng-chứng`, `docs/memory/decisions.md#dec-002`

### DEC-006 — Cho phép Dylan tự cấu hình các ngưỡng ngân sách thay vì cố định trong code

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: `components/DylanPlanApp.tsx` hiện hard-code ngưỡng cảnh báo vượt ngân sách (90% thu nhập), mục tiêu tổng chi (≤ 30M) và quỹ linh hoạt (7.5M) trực tiếp trong code.
- Quyết định: Khi chuyển sang lưu trữ bền vững, các ngưỡng này phải cho Dylan tự cấu hình thay vì để cố định trong code.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Giữ cố định trong code như hiện tại" — ít việc hơn nhưng không giải quyết được nhu cầu tùy chỉnh của Dylan.
- Hệ quả: Cần thêm một US mới "Cấu hình ngưỡng ngân sách" (Business Flow mục 7 #9, `backlog.md` #9), kéo theo data model phải có nơi lưu các ngưỡng này (khả năng trên `MonthBudget` hoặc bảng Settings riêng) — quyết định cụ thể để `ssr-data` xử lý khi tới lượt.
- Bằng chứng: `docs/kb/ba/business-flow.md#9-nguồn-bằng-chứng`, `docs/memory/glossary.md#4-chỉ-số-và-công-thức`, `components/DylanPlanApp.tsx`

### DEC-007 — "Chi thực tế" của danh mục là số suy ra (derived) từ tổng giao dịch, không lưu tay

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: `JDG-001` đã ghi nhận `BudgetCategory.actual` hiện là số độc lập, cộng dồn thủ công và có thể sửa tay trực tiếp, tách rời khỏi danh sách `transactions` — dễ lệch dữ liệu. Khi bổ sung khả năng sửa/xóa từng giao dịch (Business Flow mục 7 #3), phải quyết định cách "Chi thực tế" cập nhật theo.
- Quyết định: "Chi thực tế" của một danh mục luôn được tính lại tự động bằng tổng các giao dịch thuộc danh mục đó; bỏ hẳn khả năng sửa tay trực tiếp trường này.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Giữ cộng/trừ thủ công như hiện tại" — tiếp tục mang theo rủi ro lệch dữ liệu đã nêu ở `JDG-001`.
- Hệ quả: `JDG-001` được xác nhận và nâng thành quyết định này. Data model (`ssr-data`) không cần cột lưu `actual` độc lập, mà tính bằng tổng hợp (`sum`/aggregate) từ bảng giao dịch. F2 bước 2 không còn cho sửa tay "Chi thực tế" (Business Flow mục 4).
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`, `docs/memory/judgement-log.md#jdg-001`, `components/DylanPlanApp.tsx`

### DEC-008 — Sửa một giao dịch được đổi đầy đủ 4 trường: nội dung, số tiền, danh mục, ngày

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Business Flow mục 7 #3 cần bổ sung khả năng sửa từng giao dịch nhập sai tại bảng chi tiết chi tiêu; cần chốt phạm vi trường được phép sửa.
- Quyết định: Cho phép sửa đầy đủ nội dung, số tiền, danh mục và ngày của một giao dịch.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Chỉ cho sửa số tiền và danh mục" — không giải quyết hết trường hợp nhập sai nội dung hoặc ngày.
- Hệ quả: Form sửa giao dịch (khi tạo spec/US #3) phải có đủ 4 trường; sửa danh mục kéo theo tính lại "Chi thực tế" ở cả danh mục cũ và mới (DEC-007).
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-009 — Xóa một giao dịch phải qua hộp xác nhận trước khi xóa thật

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Xóa giao dịch tại bảng chi tiết chi tiêu là thao tác khó hoàn tác; cần chốt có cảnh báo trước khi xóa hay không.
- Quyết định: Bấm "Xóa" một giao dịch phải hiện hộp xác nhận, chỉ xóa thật sau khi Dylan xác nhận.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Xóa ngay khi bấm, không cần xác nhận" — nhanh hơn nhưng rủi ro xóa nhầm cao hơn.
- Hệ quả: Business Flow mục 9 còn để mở câu hỏi "có cần undo sau khi xóa không" — chưa hỏi, cần chốt riêng khi tạo spec.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-010 — Chỉ cho sửa/xóa giao dịch của tháng đang chọn, không cho sửa tháng đã qua

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: F4 (Phân tích và báo cáo) dùng dữ liệu nhiều tháng để so sánh xu hướng; nếu cho sửa/xóa tự do ở mọi tháng, số liệu lịch sử đã xem có thể bị lệch sau đó.
- Quyết định: Chỉ cho phép sửa/xóa giao dịch thuộc tháng đang được chọn trên UI; giao dịch của các tháng khác chỉ xem, không cho thao tác.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Cho phép sửa/xóa ở mọi tháng" — linh hoạt hơn nhưng có thể làm lệch báo cáo xu hướng đã xem trước đó (F4).
- Hệ quả: Bảng chi tiết chi tiêu (US #3) phải kiểm tra tháng của giao dịch trước khi hiện nút Sửa/Xóa hoặc chặn hành động.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-011 — Toast xác nhận ghi nhận thành công hiện ở mọi lần Ghi nhận, không chỉ khi tự động khớp danh mục

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: F1 bước 1-2 hiện không có phản hồi rõ ràng cho Dylan sau khi bấm "Ghi nhận"; cần chốt phạm vi hiển thị toast thông báo thành công chứa số tiền và danh mục.
- Quyết định: Toast thông báo thành công hiện ở mọi lần "Ghi nhận" thành công, bất kể danh mục được tự động gán theo từ khóa (bước 1) hay Dylan tự chọn tay (bước 2).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Chỉ hiện khi tự động khớp danh mục" — không phản hồi nhất quán cho trường hợp Dylan tự chọn tay danh mục.
- Hệ quả: Business Flow F1 bước 2 (mục 4) và bảng điều kiện rẽ nhánh F1 đã cập nhật để phản ánh toast áp dụng cho mọi nhánh ghi nhận thành công.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-012 — Toast xác nhận tự đóng sau vài giây, không cần Dylan bấm đóng thủ công

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Cần chốt hành vi đóng toast để không cản trở thao tác nhập nhanh hằng ngày.
- Quyết định: Toast tự đóng sau một khoảng thời gian ngắn (vài giây), Dylan không cần bấm đóng thủ công.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Cần bấm đóng thủ công" — có thể gây vướng khi Dylan nhập liên tục nhiều giao dịch.
- Hệ quả: Khi tạo spec/US cho phần ghi nhận chi tiêu, tiêu chí chấp nhận phải nêu rõ thời gian tự đóng cụ thể (chưa chốt số giây chính xác — để `ssr-ba` đề xuất và xác nhận khi viết spec).
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-013 — Mốc thời gian nhắc tới trong nội dung chỉ hợp lệ nếu là quá khứ hoặc hôm nay, không nhận ngày tương lai

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: F1 cần bổ sung khả năng nhận diện mốc thời gian trong nội dung nhập nhanh (vd "Thứ 2 cafe 25k", "ngày 23 mua gạo 50k") để tính ngày giao dịch theo mốc đó thay vì thời điểm nhập; cần chốt cách xử lý khi mốc thời gian suy ra rơi vào tương lai.
- Quyết định: Nếu ngày suy ra từ mốc thời gian trong nội dung rơi vào tương lai so với hôm nay, coi là không hợp lệ — không dùng ngày đó.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Vẫn tính là ngày đó dù ở tương lai trong tuần/tháng hiện tại" — user không chọn, ưu tiên tránh nhầm lẫn giữa "ghi nhận trước" và "chi tiêu đã xảy ra".
- Hệ quả: Khi mốc thời gian bị coi là không hợp lệ vì ở tương lai, áp dụng cùng cách xử lý với "không nhận diện được cú pháp" (DEC-014) — dùng thời điểm nhập làm ngày giao dịch. Còn để mở câu hỏi có cần báo riêng cho Dylan biết việc này không (Business Flow mục 9, câu hỏi #3).
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-014 — Cú pháp thời gian không hợp lệ thì bỏ qua, ghi nhận tại thời điểm nhập như hiện tại

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Nội dung nhập nhanh có thể chứa cú pháp thời gian sai hoặc không nhận diện được (vd "ngày 35", tên thứ sai chính tả); cần chốt hành vi khi đó.
- Quyết định: Nếu không nhận diện được cú pháp thời gian hợp lệ, bỏ qua phần thời gian, ghi nhận giao dịch tại thời điểm nhập như hành vi hiện tại — không chặn thao tác.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Chặn ghi nhận, báo lỗi yêu cầu sửa lại" — làm chậm thao tác nhập nhanh hằng ngày, không phù hợp mục tiêu M1 (thao tác nhanh).
- Hệ quả: Nhập nhanh không bao giờ bị chặn vì lý do cú pháp thời gian; cùng quy tắc áp dụng cho trường hợp ngày tương lai (DEC-013).
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-015 — Tách phần mô tả mốc thời gian ra khỏi nội dung giao dịch lưu trữ

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Khi nội dung nhập nhanh có nhắc mốc thời gian (vd "Thứ 2 cafe 25k"), cần chốt nội dung giao dịch lưu trữ có giữ nguyên cụm từ thời gian hay chỉ giữ phần mô tả chi tiêu.
- Quyết định: Tách phần mô tả mốc thời gian ra khỏi nội dung lưu trữ; nội dung giao dịch chỉ còn phần mô tả chi tiêu (vd "cafe"), ngày giao dịch được lưu riêng ở trường ngày.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Giữ nguyên toàn bộ nội dung gốc" — đơn giản hơn nhưng để lẫn cụm từ thời gian vào nội dung mô tả, gây nhiễu khi xem lại bảng chi tiết chi tiêu.
- Hệ quả: Cần logic tách chuỗi (parse) khi ghi nhận giao dịch — độ phức tạp cao hơn so với giữ nguyên nội dung; `ssr-ba`/`ssr-plan` cần thiết kế rõ quy tắc tách cho từng dạng cú pháp (DEC-016).
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-016 — Mở rộng cú pháp nhận diện thời gian: thêm "hôm qua/hôm nay" và ngày cụ thể dd/mm

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Yêu cầu gốc chỉ nêu 2 dạng cú pháp (thứ trong tuần, "ngày N" trong tháng); cần chốt phạm vi cú pháp hỗ trợ ngay từ vòng đầu.
- Quyết định: Ngoài 2 dạng đã nêu, hỗ trợ thêm "hôm qua"/"hôm nay" và ngày cụ thể dạng dd/mm ngay từ vòng đầu tiên.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Chỉ giới hạn đúng 2 dạng đã nêu" — user chọn phạm vi rộng hơn ngay từ đầu thay vì mở rộng dần.
- Hệ quả: Effort của US liên quan đến nhận diện mốc thời gian trong F1 tăng so với chỉ 2 dạng cú pháp ban đầu; `ssr-ba` cần liệt kê đầy đủ 4 dạng cú pháp trong tiêu chí chấp nhận khi viết spec.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-017 — Nguyên tắc chung: F1 chỉ ghi nhận/sửa giao dịch với ngày ≤ hôm nay, không có giao dịch tương lai

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: DEC-013 đã chốt việc bỏ qua mốc thời gian tương lai khi nhập nhanh (dùng thời điểm nhập thay thế). User xác nhận thêm đây là một nguyên tắc chung của cả bước ghi nhận: mục tiêu của F1 là chỉ ghi nhận các giao dịch **đã xảy ra**, từ hiện tại về quá khứ.
- Quyết định: Áp dụng ràng buộc "ngày giao dịch ≤ hôm nay" cho mọi đường ghi nhận/sửa ngày trong F1 — không chỉ khi mốc thời gian suy ra từ nội dung nhập nhanh (DEC-013), mà cả khi Dylan sửa trực tiếp trường "ngày" của một giao dịch đã có (DEC-008). Nếu mốc thời gian không hợp lệ hoặc ở tương lai, ngày giao dịch tự động dùng ngày hiện tại.
- Người chốt: User, qua `AskUserQuestion`/xác nhận trực tiếp trong `ssr-po mode=business-flow`.
- Phương án đã loại: Không có — đây là làm rõ/mở rộng phạm vi của DEC-013 sang cả luồng sửa giao dịch (DEC-008), không phải một lựa chọn giữa nhiều phương án.
- Hệ quả: Ghi thành luật P1.1 trong `docs/memory/rules.md` vì đây là ràng buộc nghiệp vụ bắt buộc, áp dụng xuyên suốt F1. Khi tạo spec cho US "Sửa/xóa từng giao dịch" (US #4, DEC-008), form sửa phải chặn việc chọn ngày tương lai cho trường "ngày".
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`, `docs/memory/rules.md#p1-nghiệp-vụ`

### DEC-018 — Báo cho Dylan trong toast khi mốc thời gian bị bỏ qua vì tương lai/không hợp lệ

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: DEC-013/DEC-017 đã chốt việc tự động dùng ngày hiện tại khi mốc thời gian trong nội dung ở tương lai hoặc không hợp lệ; Business Flow mục 9 để mở câu hỏi có cần báo riêng cho Dylan về việc này không.
- Quyết định: Khi ngày ghi nhận bị đổi khác với mốc thời gian Dylan đã gõ (vì ở tương lai hoặc không nhận diện được), toast xác nhận (DEC-011, DEC-012) hiện thêm ghi chú cho biết giao dịch đã được ghi theo ngày hiện tại và lý do ngắn gọn (vd mốc thời gian chưa tới).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Không cần báo, ghi nhận âm thầm" — Dylan có thể không nhận ra ngày thực tế khác với mốc thời gian đã gõ cho đến khi tự kiểm tra lại bảng chi tiết chi tiêu.
- Hệ quả: Toast (US thuộc F1) có hai dạng nội dung: dạng thường (chỉ số tiền + danh mục) khi ngày khớp đúng mốc thời gian hoặc không có mốc thời gian nào; dạng có ghi chú thêm khi ngày bị đổi vì mốc thời gian không hợp lệ/ở tương lai. Nội dung ghi chú cụ thể để `ssr-ba` soạn khi viết tiêu chí chấp nhận.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-019 — F2 bỏ cột Tỷ trọng, đổi tên cột "Chênh lệch" thành "Còn lại"

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Bảng danh mục ở F2 (`components/DylanPlanApp.tsx:1288-1324`) hiện có 4 cột số liệu: Ngân sách, Chi thực tế, Chênh lệch (`budget - actual`), Tỷ trọng (`actual / income`). User muốn đơn giản hóa bảng.
- Quyết định: Bỏ cột "Tỷ trọng"; đổi tên cột "Chênh lệch" thành "Còn lại". Bảng danh mục ở F2 chỉ còn 3 cột số liệu: Ngân sách, Chi thực tế, Còn lại.
- Người chốt: User, qua yêu cầu trực tiếp và `AskUserQuestion` xác nhận cách xử lý trùng tên trong `ssr-po mode=business-flow`.
- Phương án đã loại: Đổi tên cột thành "Còn lại (danh mục)" để tránh trùng với thuật ngữ "Số dư còn lại" (mức tổng cả tháng, `docs/memory/glossary.md` mục 4) — user không chọn, chấp nhận dùng chung tên "Còn lại", phân biệt qua ngữ cảnh hiển thị (trong bảng danh mục vs khu vực tổng quan tháng).
- Hệ quả: `glossary.md` cần thêm thuật ngữ "Còn lại" (mức từng danh mục) và ghi chú rõ khác với "Số dư còn lại" (mức tổng tháng) để không vi phạm quy tắc "mỗi thuật ngữ một định nghĩa".
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`, `components/DylanPlanApp.tsx:1288-1324`

### DEC-020 — Ràng buộc không trùng tên danh mục áp dụng cho cả thêm mới và sửa tên

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: F2 hiện không kiểm tra trùng tên khi thêm hoặc sửa danh mục; hai danh mục cùng tên trong một tháng gây khó xác định F1 nên gán giao dịch vào danh mục nào (điểm chạm F1-F2, Business Flow mục 5).
- Quyết định: Ràng buộc "không được trùng tên danh mục" áp dụng cho cả hai thao tác — thêm danh mục mới và sửa tên danh mục đã có — trong phạm vi tháng đang chọn (mỗi tháng có danh sách danh mục riêng).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Chỉ áp dụng khi thêm mới" — vẫn để lọt trường hợp tạo trùng tên qua thao tác sửa tên.
- Hệ quả: Business Flow mục 7 gap #10 (mới thêm) và mục 6 function "Thêm/sửa/xóa danh mục có ràng buộc toàn vẹn dữ liệu" đều phải bao gồm kiểm tra này ở cả hai thao tác.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`, `docs/kb/ba/business-flow.md#5-điểm-chạm-giữa-các-luồng`

### DEC-021 — Trùng tên danh mục thì chặn thao tác và báo lỗi rõ ràng

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Cần chốt hành vi cụ thể khi phát hiện trùng tên — chặn hẳn hay vẫn cho tạo nhưng tự đổi tên khác.
- Quyết định: Khi phát hiện trùng tên, chặn thao tác thêm/sửa, hiện thông báo lỗi rõ ràng yêu cầu Dylan đổi tên khác. Không tự động thêm hậu tố để tạo tên khác.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Tự động thêm hậu tố phân biệt (vd 'Ăn uống (2)')" — vẫn tạo được danh mục nhưng Dylan có thể không để ý tên đã bị đổi, gây nhầm lẫn về sau.
- Hệ quả: Form thêm/sửa danh mục (US #10) cần hiển thị thông báo lỗi inline, không tự ý đổi giá trị Dylan đã nhập.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-022 — So sánh trùng tên danh mục bỏ qua hoa/thường và khoảng trắng thừa đầu-cuối

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Cần chốt quy tắc chuẩn hóa khi so sánh tên để tránh lọt các biến thể gần giống (vd khác hoa/thường, khác khoảng trắng thừa).
- Quyết định: Khi so sánh trùng tên, bỏ qua khác biệt hoa/thường và khoảng trắng thừa ở đầu/cuối chuỗi trước khi so sánh.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "So sánh chính xác từng ký tự" — cho phép tồn tại đồng thời các biến thể gần giống như hai danh mục khác nhau, dễ gây nhầm lẫn khi hiển thị/chọn danh mục.
- Hệ quả: Logic kiểm tra trùng tên (US #10) phải chuẩn hóa chuỗi (trim + so sánh không phân biệt hoa/thường) trước khi so sánh với danh sách danh mục hiện có trong tháng.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-023 — Danh mục "Chi tiêu khác" là danh mục mặc định, luôn có sẵn trong mọi tháng, nhưng không khóa

- Ngày: 2026-07-29
- Status: Superseded — thay thế bởi `DEC-026` (2026-07-29): "Chi tiêu khác" không còn là danh mục mặc định có sẵn mọi tháng, mà chỉ sinh ra khi thật sự cần
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: `defaultCategories` (`components/DylanPlanApp.tsx:57-66`) hiện chưa có danh mục "Chi tiêu khác". Để làm nơi nhận giao dịch khi xóa danh mục khác (DEC-024), cần chốt danh mục này được tạo khi nào và có bị khóa như "Tiền nhà"/"Chi phí cố định khác" không.
- Quyết định: "Chi tiêu khác" là một danh mục mặc định, luôn có sẵn trong mọi tháng (tạo trống hoặc sao chép) ngay từ khi tạo tháng — không đợi đến lúc cần mới tạo. Không đặt cờ `locked` cho danh mục này; Dylan vẫn xóa được nếu muốn (có ràng buộc riêng, xem DEC-025).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Chỉ tạo khi lần đầu cần đến" — không chọn, ưu tiên luôn có sẵn để đơn giản hóa logic; "Khóa giống danh mục cố định" — không chọn, user muốn "Chi tiêu khác" vẫn xóa được như danh mục thường.
- Hệ quả: `defaultCategories` cần thêm một danh mục "Chi tiêu khác" (loại Linh hoạt, không `locked`) khi triển khai US #5/#10 liên quan; F3 (tạo/sao chép tháng) phải đảm bảo danh mục này luôn có mặt.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`, `components/DylanPlanApp.tsx:57-66`

### DEC-024 — Xóa một danh mục thường (không khóa) thì chuyển toàn bộ giao dịch của nó sang "Chi tiêu khác"

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Business Flow mục 7 gap #5 ghi nhận việc xóa danh mục hiện không kiểm tra giao dịch liên quan, để lại giao dịch "mồ côi" (danh mục không còn tồn tại). Cần chốt cách xử lý.
- Quyết định: Khi Dylan xóa một danh mục không khóa (khác chính "Chi tiêu khác"), toàn bộ giao dịch đang gán vào danh mục đó được chuyển sang danh mục "Chi tiêu khác" trước khi xóa danh mục gốc.
- Người chốt: User, yêu cầu trực tiếp trong `ssr-po mode=business-flow`.
- Phương án đã loại: Không có phương án khác được đưa ra — đây là yêu cầu trực tiếp của user, không phải lựa chọn giữa nhiều phương án.
- Hệ quả: Sau khi chuyển giao dịch, chi thực tế của "Chi tiêu khác" tăng lên tương ứng (tính lại từ tổng giao dịch theo DEC-007). Gap #5 (Business Flow mục 7) được coi là đã có hướng giải quyết, chờ triển khai. Cần xử lý thêm trường hợp xóa chính "Chi tiêu khác" (DEC-025).
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`, `docs/kb/ba/business-flow.md#7-khoảng-trống-và-ưu-tiên`

### DEC-025 — Chặn xóa "Chi tiêu khác" nếu nó đang có giao dịch

- Ngày: 2026-07-29
- Status: Superseded — thay thế bởi `DEC-027` (2026-07-29): "Chi tiêu khác" bị khóa vĩnh viễn, không bao giờ cho xóa (không chỉ khi còn giao dịch)
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Vì "Chi tiêu khác" không bị khóa (DEC-023) và là nơi nhận giao dịch từ các danh mục khác bị xóa (DEC-024), cần chốt điều gì xảy ra nếu Dylan xóa chính "Chi tiêu khác" trong khi nó đang giữ giao dịch — không còn danh mục nào khác để chuyển giao dịch đến.
- Quyết định: Chặn xóa "Chi tiêu khác" nếu nó đang có ít nhất một giao dịch (dù là giao dịch gốc của nó hay giao dịch được chuyển đến từ danh mục khác đã xóa); chỉ cho xóa khi nó không còn giao dịch nào.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Vẫn cho xóa, giao dịch trở thành không danh mục (mồ côi)" — chấp nhận mất liên kết dữ liệu, đi ngược lại mục tiêu M1 (dữ liệu bền vững, nhất quán).
- Hệ quả: Logic xóa danh mục (US #5/#10) cần một nhánh riêng cho trường hợp danh mục bị xóa là "Chi tiêu khác": kiểm tra còn giao dịch hay không thay vì luôn cho xóa như danh mục thường khác.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-026 — "Chi tiêu khác" chỉ tự sinh ra khi cần (lazy), không phải danh mục mặc định có sẵn mọi tháng

- Ngày: 2026-07-29
- Status: Active
- Thay thế: `DEC-023` (Superseded)
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: User yêu cầu đảo lại DEC-023 — "Chi tiêu khác" không nên có sẵn ngay từ đầu trong mọi tháng, mà chỉ nên xuất hiện khi thật sự phát sinh nhu cầu.
- Quyết định: "Chi tiêu khác" không được tạo sẵn khi khởi tạo tháng (trống hoặc sao chép). Hệ thống chỉ tự động sinh ra danh mục này (nếu tháng đó chưa có) tại đúng thời điểm phát sinh một trong hai trường hợp: (a) có giao dịch được ghi nhận mà không gán danh mục nào (DEC-028), hoặc (b) danh mục cha của một giao dịch đã bị xóa (DEC-024). Nếu trong một tháng không có giao dịch nào rơi vào hai trường hợp trên, tháng đó không có danh mục "Chi tiêu khác".
- Người chốt: User, xác nhận trực tiếp qua `AskUserQuestion` trong `ssr-po mode=business-flow` (đảo DEC-023).
- Phương án đã loại: "Vẫn luôn có sẵn như DEC-023 cũ" — user không chọn, muốn bảng danh mục gọn hơn khi tháng chưa có giao dịch mồ côi nào.
- Hệ quả: F3 (tạo/sao chép tháng) không còn cần đảm bảo "Chi tiêu khác" có mặt. Logic xóa danh mục (DEC-024) và ghi nhận không danh mục (DEC-028) phải tự kiểm tra và tạo "Chi tiêu khác" nếu tháng đó chưa có, trước khi gán giao dịch vào.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-027 — "Chi tiêu khác" bị khóa vĩnh viễn, chỉ xem, không cho sửa hay xóa

- Ngày: 2026-07-29
- Status: Active
- Thay thế: `DEC-025` (Superseded)
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: User yêu cầu đảo lại DEC-025 — "Chi tiêu khác" do hệ thống lưu trữ và quản lý, người dùng không có quyền xóa trong bất kỳ trường hợp nào, kể cả khi nó không còn giao dịch.
- Quyết định: "Chi tiêu khác" luôn bị khóa (`locked = true`) và ở chế độ chỉ xem đối với Dylan — không cho xóa (bất kể còn hay hết giao dịch), không cho sửa tên/loại/ngân sách trực tiếp trên bảng danh mục như các danh mục thường khác.
- Người chốt: User, xác nhận trực tiếp qua `AskUserQuestion` trong `ssr-po mode=business-flow` (đảo DEC-025).
- Phương án đã loại: "Chỉ chặn xóa khi còn giao dịch, cho xóa khi rỗng" (DEC-025 cũ) — user không chọn, muốn khóa tuyệt đối để đảm bảo luôn có nơi lưu chi tiêu mồ côi.
- Hệ quả: Trong bảng danh mục ở F2, dòng "Chi tiêu khác" (khi đã tồn tại) hiển thị dạng chỉ đọc — không có nút xóa, không có ô nhập cho tên/loại/ngân sách.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-028 — F1 cho phép ghi nhận giao dịch mà không cần chọn danh mục; giao dịch đó tự động vào "Chi tiêu khác"

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: F1 hiện tại luôn bắt buộc Dylan chọn danh mục thủ công nếu nội dung không khớp từ khóa nào (Business Flow mục 4, điều kiện rẽ nhánh). User muốn có khái niệm "chi tiêu không được gán danh mục" — cần nới luồng F1 để trường hợp này thực sự phát sinh được.
- Quyết định: F1 nới bước xác nhận danh mục (bước 2): Dylan có thể bỏ qua việc chọn danh mục khi ghi nhận (không bắt buộc khớp từ khóa hoặc chọn tay). Giao dịch được ghi nhận mà không có danh mục sẽ tự động được gán vào "Chi tiêu khác" (kích hoạt sinh danh mục này nếu tháng đó chưa có — DEC-026).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Chỉ phát sinh gián tiếp qua xóa danh mục cha, giữ nguyên F1 bắt buộc chọn danh mục" — user không chọn, muốn nới trực tiếp ở bước ghi nhận.
- Hệ quả: Form ghi nhận nhanh (F1 bước 2) cần thêm lựa chọn "Bỏ qua danh mục" hoặc cho phép để trống trường danh mục trước khi bấm "Ghi nhận". Business Flow mục 4 (F1) và điều kiện rẽ nhánh phải cập nhật để phản ánh nhánh mới này.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-029 — "Chi tiêu khác" chỉ hiển thị trên giao diện khi đang có giao dịch, ẩn khi không còn giao dịch nào

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: DEC-026 đã chốt "Chi tiêu khác" chỉ tự sinh khi cần (có giao dịch không danh mục, hoặc danh mục cha bị xóa). User bổ sung thêm quy tắc hiển thị: nếu sau đó "Chi tiêu khác" không còn giao dịch nào (vd Dylan sửa/xóa hết các giao dịch từng nằm trong đó), nó phải ẩn khỏi giao diện của end-user (Dylan), không hiển thị như một dòng trống trong bảng danh mục.
- Quyết định: "Chi tiêu khác" chỉ xuất hiện trên bảng danh mục (F2) khi đang có ít nhất một giao dịch được gán vào nó. Ngay khi giao dịch cuối cùng của nó bị chuyển đi hoặc bị xóa (qua sửa/xóa giao dịch ở F1), danh mục này ẩn khỏi giao diện end-user.
- Người chốt: User, yêu cầu trực tiếp trong `ssr-po mode=business-flow`.
- Phương án đã loại: Không có phương án khác được đưa ra — đây là yêu cầu trực tiếp của user, không phải lựa chọn giữa nhiều phương án.
- Hệ quả: Kết hợp với DEC-026, "Chi tiêu khác" hoạt động như một danh mục hoàn toàn ẩn/hiện theo tình trạng dữ liệu — Dylan không bao giờ thấy một "Chi tiêu khác" rỗng. Cách "ẩn" cụ thể (xóa hẳn bản ghi hay chỉ lọc khỏi hiển thị) đã được chốt ở `DEC-030`.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-030 — "Ẩn khỏi giao diện" của "Chi tiêu khác" là lọc khỏi màn hình hiển thị, không xóa bản ghi

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: DEC-029 chốt "Chi tiêu khác" ẩn khỏi giao diện khi hết giao dịch, nhưng chưa chốt đây là xóa hẳn bản ghi danh mục rồi tạo lại khi cần, hay giữ nguyên bản ghi và chỉ lọc khỏi màn hình hiển thị (Business Flow mục 9, câu hỏi #3).
- Quyết định: Việc "ẩn khỏi giao diện" chỉ là lọc khỏi màn hình hiển thị (client-side hoặc query hiển thị) — bản ghi danh mục "Chi tiêu khác" vẫn được giữ nguyên trong dữ liệu, không bị xóa, kể cả khi không còn giao dịch nào.
- Người chốt: User, trả lời trực tiếp câu hỏi mở ở Business Flow mục 9 trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Xóa hẳn bản ghi rồi tạo lại khi cần" — không chọn, tránh việc tạo/xóa lặp lại bản ghi danh mục mỗi khi giao dịch cuối cùng ra vào.
- Hệ quả: `ssr-data`/`ssr-plan` khi thiết kế data model có thể coi "Chi tiêu khác" là một danh mục tồn tại ổn định (được tạo một lần khi cần — DEC-026), và logic hiển thị bảng danh mục ở F2 chỉ cần lọc theo điều kiện "có giao dịch hay không" thay vì phải tạo/xóa bản ghi động.
- Bằng chứng: `docs/kb/ba/business-flow.md#9-nguồn-bằng-chứng`

### DEC-031 — Không phát triển tính năng khôi phục (undo) sau khi xóa giao dịch

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: DEC-009 đã chốt xóa giao dịch phải qua hộp xác nhận trước; Business Flow mục 9 để mở câu hỏi có cần thêm undo (khôi phục trong thời gian ngắn sau khi xóa) hay không.
- Quyết định: Không phát triển tính năng khôi phục (undo) sau khi xóa giao dịch. Hộp xác nhận trước khi xóa (DEC-009) là lớp bảo vệ duy nhất chống xóa nhầm.
- Người chốt: User, yêu cầu trực tiếp trong `ssr-po mode=business-flow`.
- Phương án đã loại: Không có phương án khác được đưa ra — đây là yêu cầu trực tiếp của user, không phải lựa chọn giữa nhiều phương án.
- Hệ quả: US "Sửa/xóa từng giao dịch" (US #4) không cần thiết kế cơ chế undo/khôi phục; giảm scope và effort so với khi có undo. Business Flow mục 9 câu hỏi #2 được đóng lại.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-032 — Mini dashboard 3/6/9/12 tháng là phần mở rộng của F4, không tách luồng riêng

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: User đề xuất một mini dashboard theo dõi chi tiêu 3/6/9/12 tháng gần đây. Cần chốt đây có phải một luồng nghiệp vụ mới (F5) hay chỉ là mở rộng của F4 (Phân tích và báo cáo chi tiêu) đã có.
- Quyết định: Mini dashboard là phần mở rộng của F4, không tách thành luồng riêng.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Tách thành luồng riêng (F5)" — không chọn, vì cùng mục tiêu "xem xu hướng nhiều tháng" đã có ở khoảng trống #7, tránh trùng lặp với biểu đồ xu hướng hiện có.
- Hệ quả: Business Flow mục 4 (F4) thêm bước mới thay vì tạo mục luồng F5 riêng; mục 6 thêm function mới nhưng vẫn gắn nhãn luồng F4.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-033 — Nội dung chính của mini dashboard: tổng chi theo tháng (xu hướng) so với ngân sách/thu nhập

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Cần chốt nội dung hiển thị chính của mini dashboard — biểu đồ tổng hợp hay breakdown chi tiết theo danh mục.
- Quyết định: Mini dashboard hiển thị chính: tổng chi thực tế theo từng tháng (xu hướng) trong khoảng 3/6/9/12 tháng đã chọn, so sánh với tổng ngân sách/thu nhập của tháng đó.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Breakdown chi tiết theo danh mục cho từng tháng" — không chọn, nhiều thông tin hơn mức cần thiết cho một dashboard "mini".
- Hệ quả: Không cần thiết kế bảng/biểu đồ breakdown theo danh mục nhiều tháng ở phiên bản đầu; có thể xem xét mở rộng sau nếu cần.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-034 — "3/6/9/12 tháng gần đây" tính từ tháng hiện tại theo đồng hồ hệ thống, lùi về trước

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Cần chốt mốc tính "gần đây" — theo tháng đang chọn trên UI hay theo thời gian thực tại.
- Quyết định: Khoảng "3/6/9/12 tháng gần đây" luôn tính từ tháng hiện tại theo đồng hồ hệ thống, lùi về trước — không phụ thuộc vào tháng Dylan đang xem trên UI.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Từ tháng Dylan đang chọn trên UI, lùi về trước" và "Chỉ tính trên các tháng đã có dữ liệu" — không chọn.
- Hệ quả: Mini dashboard luôn nhất quán phản ánh "N tháng gần nhất tính đến hôm nay", dù Dylan đang xem tháng nào trên UI. Cách xử lý khi có tháng trống trong khoảng (chưa có `MonthBudget`) chưa được hỏi cụ thể — ghi nhận là giả định hợp lý ở Business Flow mục 9.
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-035 — Mini dashboard phụ thuộc M1, chỉ làm sau khi có dữ liệu bền vững

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Cần chốt mini dashboard có thể làm ngay trên dữ liệu hiện tại (state trình duyệt, dễ mất khi đổi máy/xóa cache) hay phải chờ M1 (lưu trữ bền vững) hoàn thành trước.
- Quyết định: Mini dashboard phụ thuộc M1 — chỉ triển khai sau khi dữ liệu chi tiêu đã chuyển sang lưu trữ bền vững (Prisma/SQLite).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=business-flow`.
- Phương án đã loại: "Làm ngay trên dữ liệu hiện tại trong state trình duyệt" — không chọn, vì "N tháng gần đây" không có ý nghĩa đầy đủ nếu dữ liệu có thể mất bất cứ lúc nào trước khi có M1.
- Hệ quả: Business Flow mục 7 xếp gap #11 (mini dashboard) vào cùng nhóm với #7, #8 — chỉ triển khai sau khi #1 (M1) hoàn thành.
- Bằng chứng: `docs/kb/ba/business-flow.md#7-khoảng-trống-và-ưu-tiên`

### DEC-038 — Ngưỡng cấu hình ngân sách (US-009) lưu trên từng tháng ngân sách, không phải bảng Settings chung

- Ngày: 2026-08-03
- Status: Active
- Feature liên quan: US-009
- Bối cảnh: DEC-006 đã chốt cho Dylan tự cấu hình 3 ngưỡng (cảnh báo vượt ngân sách, mục tiêu tổng chi, quỹ linh hoạt) nhưng chưa chốt nơi lưu — Business Flow mục 9 để mở câu hỏi này.
- Quyết định: Ba ngưỡng cấu hình được lưu trên từng tháng ngân sách (không phải một bảng Settings chung áp dụng mọi tháng). Tháng mới tạo kế thừa ngưỡng của tháng gần nhất hoặc giá trị mặc định nếu chưa có tháng nào.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` khi tạo raw cho US-009.
- Phương án đã loại: "Lưu một bảng cấu hình chung (Settings) cho toàn hệ thống" — đơn giản hơn nhưng không cho phép ngưỡng khác nhau giữa các tháng.
- Hệ quả: Data model (`ssr-data`) đặt 3 trường ngưỡng trên bảng tháng ngân sách (`MonthBudget`), không tạo bảng `Settings` riêng cho US-009. Spec US-009 cần quy tắc kế thừa giá trị khi tạo tháng mới.
- Bằng chứng: `docs/kb/ba/raw/US-009-cau-hinh-nguong-ngan-sach.md#4-câu-hỏi-mở`

### DEC-042 — Trạng thái di trú dùng một dòng `LegacyMigration` cố định (`id="singleton"`), không theo thiết bị

- Ngày: 2026-08-03
- Status: Active
- Feature liên quan: US-001
- Bối cảnh: DEC-040 đã chốt việc di trú dùng "trạng thái dùng chung giữa các thiết bị". `ssr-data` cần một cách hiện thực cụ thể trên SQLite.
- Quyết định: Model `LegacyMigration` chỉ có đúng một dòng dữ liệu, khóa chính cố định là chuỗi `"singleton"` (không sinh tự động). Mọi thiết bị đọc/ghi cùng một dòng này để biết trạng thái di trú (`Pending`/`InProgress`/`Completed`/`Failed`).
- Người chốt: `ssr-data` tự quyết định cách hiện thực dựa trên DEC-040 và đặc điểm single-user (DEC-004) — không phải lựa chọn nghiệp vụ mới cần hỏi lại user.
- Phương án đã loại: Một dòng trạng thái theo từng thiết bị (cần định danh thiết bị) — phức tạp không cần thiết vì hệ thống chỉ phục vụ một người dùng, mục tiêu chỉ là tránh hai lần chạy di trú song song chứ không cần biết chính xác thiết bị nào.
- Hệ quả: `server/budget.ts#migrateLegacyData` (việc của `ssr-dev`) phải dùng đúng `id="singleton"` khi đọc/ghi trạng thái, không tạo dòng mới.
- Bằng chứng: `docs/features/US-001-luu-tru-chi-tieu-ben-vung/data-model.md` mục 2

### DEC-041 — Dùng layout thư mục thật của repo (`app/`, `components/`, `lib/`, `server/` ở gốc), không theo giá trị `src/*` trong `.ssr-kit.env`

- Ngày: 2026-08-03
- Status: Active
- Feature liên quan: US-001
- Bối cảnh: `.ssr-kit.env` khai `SSR_APP_DIR=src/app`, `SSR_COMPONENTS_DIR=src/components`, `SSR_SERVER_DIR=src/server`, nhưng repo thật không có thư mục `src/` — `app/` và `components/` nằm ở gốc dự án (`tsconfig.json` xác nhận alias `@/*` trỏ `./*`, không phải `./src/*`).
- Quyết định: `ssr-plan` dùng path thật của repo (`app/`, `components/`, `lib/`, và tạo mới `server/` ở gốc) khi lập kế hoạch và khi các stage sau triển khai, thay vì giá trị `src/*` đã lỗi thời trong `.ssr-kit.env`. Không tạo thư mục `src/` mới.
- Người chốt: `ssr-plan` tự quyết định dựa trên bằng chứng trực tiếp từ `tsconfig.json` và cấu trúc thư mục thật — không phải lựa chọn nghiệp vụ cần hỏi user.
- Phương án đã loại: "Tạo thư mục `src/app`, `src/components` mới theo đúng `.ssr-kit.env`" — sẽ phá vỡ toàn bộ import hiện có (`@/components/DylanPlanApp`) và tách rời code cũ khỏi code mới không cần thiết.
- Hệ quả: Toàn bộ US còn lại khi tới lượt `ssr-plan` cũng nên dùng path thật này. `.ssr-kit.env` nên được user cập nhật lại cho khớp thực tế khi thuận tiện (không thuộc phạm vi US-001).
- Bằng chứng: `docs/features/US-001-luu-tru-chi-tieu-ben-vung/plan.md` mục 2, 6

### DEC-039 — Di trú dữ liệu cũ tự động thử lại mỗi lần Dylan mở lại Quản lý chi tiêu

- Ngày: 2026-08-03
- Status: Active
- Feature liên quan: US-001
- Bối cảnh: `ba-expert` rà spec US-001 phát hiện chưa chốt cơ chế thử lại khi việc di trú dữ liệu cũ (DEC-037) bị gián đoạn giữa chừng — tự động hay cần Dylan bấm nút thủ công.
- Quyết định: Hệ thống tự động thử lại việc di trú mỗi lần Dylan mở lại Quản lý chi tiêu, không cần Dylan bấm nút thủ công.
- Người chốt: User, qua `AskUserQuestion` khi hoàn thiện spec US-001 (giai đoạn `ssr-ba`, agent `ba-expert` nêu câu hỏi).
- Phương án đã loại: "Có nút 'Thử lại' thủ công" — cho Dylan kiểm soát rõ hơn nhưng cần thêm thao tác và dễ bị quên bấm.
- Hệ quả: Spec US-001 AC-06/AC-07 và `EL-03` (thông báo di trú chưa hoàn tất) không cần thiết kế nút thao tác riêng; DEV chỉ cần gọi lại logic di trú mỗi khi màn hình được mở.
- Bằng chứng: `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` mục 14 (A3)

### DEC-040 — Di trú dữ liệu dùng cờ trạng thái dùng chung để tránh chạy trùng khi mở nhiều thiết bị

- Ngày: 2026-08-03
- Status: Active
- Feature liên quan: US-001
- Bối cảnh: `ba-expert` rà spec US-001 phát hiện chưa có quy tắc khi Dylan mở Quản lý chi tiêu trên hai thiết bị cùng lúc trong lúc di trú đang chạy — rủi ro cả hai thiết bị cùng di trú song song, tạo dữ liệu trùng.
- Quyết định: Việc di trú dùng một trạng thái "đang di trú" lưu trữ dùng chung (không riêng theo từng thiết bị). Thiết bị nào bắt đầu di trú trước sẽ đánh dấu trạng thái này; thiết bị mở sau thấy trạng thái đang chạy thì chỉ chờ, không tự di trú lại.
- Người chốt: User, qua `AskUserQuestion` khi hoàn thiện spec US-001 (giai đoạn `ssr-ba`, agent `ba-expert` nêu câu hỏi).
- Phương án đã loại: "Không cần xử lý đặc biệt" — chấp nhận rủi ro dữ liệu trùng, user không chọn vì đi ngược mục tiêu M1 (dữ liệu bền vững, nhất quán).
- Hệ quả: Spec US-001 cần bổ sung quy tắc rẽ nhánh cho trường hợp "đang di trú từ thiết bị khác"; thiết kế cờ trạng thái dùng chung là việc của `ssr-data`/`ssr-plan` khi tới lượt.
- Bằng chứng: `docs/features/US-001-luu-tru-chi-tieu-ben-vung/spec.md` mục 14 (A4)

### DEC-037 — US-001 phải di trú dữ liệu localStorage hiện có sang DB, không bắt đầu dữ liệu rỗng

- Ngày: 2026-08-03
- Status: Active
- Feature liên quan: US-001
- Bối cảnh: Khi chuyển từ `localStorage` sang Prisma + SQLite (US-001), cần chốt có giữ lại lịch sử dữ liệu Dylan đã ghi trước đó hay chấp nhận bắt đầu dữ liệu rỗng trên DB mới.
- Quyết định: Phải viết script di trú (migrate) một lần từ `localStorage` sang DB mới, giữ lại toàn bộ lịch sử các tháng/danh mục/giao dịch đã ghi trước đó.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` khi tạo raw cho US-001.
- Phương án đã loại: "Không cần, bắt đầu dữ liệu rỗng" — đơn giản hơn nhưng làm mất lịch sử chi tiêu Dylan đã ghi, đi ngược mục tiêu M1 (dữ liệu bền vững).
- Hệ quả: Spec US-001 (khi `ssr-ba` viết) phải có tiêu chí chấp nhận riêng cho bước di trú: định dạng nguồn, cách chạy, xử lý lỗi giữa chừng.
- Bằng chứng: `docs/kb/ba/raw/US-001-luu-tru-chi-tieu-ben-vung.md#4-câu-hỏi-mở`

### DEC-048 — US-004: xung đột sửa đồng thời từ nhiều tab/thiết bị thì chặn lưu, báo lỗi, không ghi đè và không tạo lại giao dịch đã xóa

- Ngày: 2026-08-05
- Status: Active
- Feature liên quan: US-004
- Bối cảnh: `ba-expert` rà spec US-004 phát hiện chưa có quy tắc khi Dylan mở hai tab/thiết bị cùng lúc, một giao dịch đang được sửa ở một tab bị sửa hoặc xóa từ tab khác trước khi tab đang sửa kịp bấm "Lưu".
- Quyết định: Nếu giao dịch đang sửa đã bị thay đổi (sửa hoặc xóa) từ nơi khác trước khi bấm "Lưu", hệ thống chặn lưu, báo "Giao dịch này vừa được thay đổi ở nơi khác, hãy tải lại để xem bản mới nhất" — không ghi đè âm thầm, không tạo lại giao dịch đã bị xóa.
- Người chốt: User, qua `AskUserQuestion` khi hoàn thiện spec US-004 (giai đoạn `ssr-ba`, đề xuất phát sinh từ `ba-expert`).
- Phương án đã loại: "Ghi đè, thao tác sau cùng thắng" — đơn giản hơn nhưng có rủi ro mất thao tác âm thầm không báo; "Không xử lý đặc biệt, chấp nhận rủi ro hiếm gặp" — user không chọn dù hệ thống single-user khiến tình huống này hiếm xảy ra, ưu tiên an toàn dữ liệu.
- Hệ quả: Spec US-004 thêm `AC-11` và một dòng ngoại lệ mới ở mục 6; `EL-12` (nút Lưu) mô tả thêm nhánh lỗi này. `ssr-plan`/`ssr-dev` của US-004 cần thiết kế cơ chế kiểm tra giao dịch còn tồn tại/khớp trạng thái trước khi ghi đè (vd kiểm tra bản ghi trước update, hoặc so `updatedAt`) khi tới lượt triển khai.
- Bằng chứng: `docs/features/US-004-sua-xoa-tung-giao-dich/spec.md` mục 6, 7 (AC-11), 8 (EL-12), 14 (A3).

### DEC-046 — US-004: form "Sửa giao dịch" và hộp xác nhận "Xóa giao dịch" hiển thị mở rộng ngay trong dòng bảng, không phải modal riêng

- Ngày: 2026-08-05
- Status: Active
- Feature liên quan: US-004
- Bối cảnh: Raw US-004 để ngỏ câu hỏi UI "Form sửa hiển thị inline trong bảng hay mở modal riêng?" (nhãn "Giả định hợp lý", chưa chốt). `ssr-ba` cần chốt trước khi viết Screen Element/ASCII Mockup.
- Quyết định: Bấm "Sửa" hoặc "Xóa" trên một giao dịch thì chính dòng đó trong bảng mở rộng ra thành các ô nhập (hoặc thông báo xác nhận), không mở modal/hộp thoại nổi riêng.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-004.
- Phương án đã loại: "Modal riêng" — nhất quán hơn với hộp xác nhận xóa đã có ở các quyết định trước (DEC-009), nhưng user không chọn, ưu tiên giữ ngữ cảnh trong bảng, nhất quán với cách sửa tên/loại/ngân sách danh mục hiện có (onBlur pattern).
- Hệ quả: Spec US-004 mục 8 thiết kế 16 Screen Element theo dạng dòng-mở-rộng (Input/Dropdown/Date picker/Button nằm ngay trong dòng), không có Element loại `Modal`.
- Bằng chứng: `docs/features/US-004-sua-xoa-tung-giao-dich/spec.md` mục 8, mục 14 (A1).

### DEC-047 — US-004: bảng chi tiết chi tiêu hiển thị toàn bộ giao dịch của tháng đang chọn, bỏ giới hạn 8 giao dịch gần nhất

- Ngày: 2026-08-05
- Status: Active
- Feature liên quan: US-004
- Bối cảnh: `components/DylanPlanApp.tsx` hiện giới hạn danh sách "Giao dịch gần đây" chỉ 8 giao dịch gần nhất (`slice(0, 8)`). Nếu giữ nguyên giới hạn này, Dylan không thể tìm và sửa/xóa một giao dịch cũ hơn nằm ngoài 8 giao dịch gần nhất trong cùng tháng.
- Quyết định: US-004 mở rộng danh sách hiển thị toàn bộ giao dịch của tháng đang chọn (không giới hạn 8), mới nhất lên đầu, cuộn khi danh sách dài.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-004.
- Phương án đã loại: "Giữ nguyên giới hạn 8, chỉ sửa/xóa được giao dịch đang hiển thị" — user không chọn, vì sẽ để lại một khoảng trống mới (không sửa được giao dịch cũ hơn) ngay trong chính US giải quyết vấn đề sửa/xóa giao dịch.
- Hệ quả: Spec US-004 AC-08 kiểm chứng riêng hành vi này. Đây là thay đổi hành vi so với `EL-02` trong spec US-001 (ghi "không đổi cách hiển thị so với hiện tại") — cần một lượt `ssr-ba` cập nhật lại `EL-02` của US-001 sau khi US-004 triển khai (xem `spec.md` US-004 mục 11).
- Bằng chứng: `docs/features/US-004-sua-xoa-tung-giao-dich/spec.md` mục 3, 7 (AC-08), 8 (EL-01), 14 (A2).

### DEC-043 — `lib/prisma.ts` dùng driver adapter `@prisma/adapter-better-sqlite3`, không đọc `url` tĩnh trong `schema.prisma`

- Ngày: 2026-08-05
- Status: Active
- Feature liên quan: US-001
- Bối cảnh: `schema.prisma` (do `ssr-data` tạo) không khai `url = env("DATABASE_URL")` trong block `datasource` — Prisma 7 với generator `prisma-client` bắt buộc truyền `adapter` (field required trong `PrismaClientOptions`) khi khởi tạo `PrismaClient` tại runtime, không tự đọc `.env` như các bản Prisma cũ.
- Quyết định: Thêm dependency `@prisma/adapter-better-sqlite3@^7.9.1` vào `package.json`; `lib/prisma.ts` tạo `PrismaClient` bằng adapter này, đọc `DATABASE_URL` qua `process.env`.
- Người chốt: `swe-expert` tự quyết định khi triển khai `TB-02`, dựa trên lỗi compile thực tế khi thiếu adapter — không phải lựa chọn nghiệp vụ cần hỏi user. Đã đối chiếu và chấp nhận bởi `ssr-dev` (`rtk tsc --noEmit`, `rtk next build`, và smoke test kết nối `prisma/dev.db` qua adapter đều Passed).
- Phương án đã loại: Không có — đây là yêu cầu bắt buộc của Prisma 7 khi `schema.prisma` không khai `url` tĩnh, không phải lựa chọn giữa nhiều phương án.
- Hệ quả: Mọi thay đổi sau này chạm `lib/prisma.ts` phải giữ nguyên cách khởi tạo qua adapter; không tự ý đổi lại sang `new PrismaClient()` không tham số.
- Bằng chứng: `lib/prisma.ts`, `package.json`, `docs/memory/judgement-log.md#jdg-003` (nhận định liên quan về Prisma 7).

### DEC-044 — `server/` tổ chức theo Light DDD 3 lớp (`domain/application/infrastructure`) trong thư mục `server/budget/`, không phải 1 file phẳng `server/budget.ts`

- Ngày: 2026-08-05
- Status: Active
- Feature liên quan: US-001
- Bối cảnh: `plan.md` mục 8 và `task.md` mô tả đích đến là một file phẳng duy nhất `server/budget.ts` chứa 8 Server Action — mô tả này được viết trước khi quy tắc kit-level R13 (kiến trúc DDD Light, `memory/rules.md` cập nhật 2026-08-04) yêu cầu code trong thư mục server phải chia 3 lớp khi nghiệp vụ đáng tách.
- Quyết định: Triển khai theo `server/budget/{domain,application,infrastructure}/` + `server/budget/actions.ts` làm composition root duy nhất mà `app/page.tsx`/`components/DylanPlanApp.tsx` được import. Domain service tách riêng cho "di trú dữ liệu cũ" (`legacy-migration-service.ts`) và tính "Chi thực tế" (`budget-snapshot-service.ts`) vì cả hai đều phối hợp ≥ 2 entity (R13.4); các thao tác CRUD thuần (`createMonth`, `clearMonthTransactions`...) thì use-case gọi thẳng repository, không ép tạo domain service riêng (R13.9).
- Người chốt: `swe-expert` tự quyết định khi triển khai `TB-03`..`TB-05`, áp dụng đúng R13.4/R13.9. Đã đối chiếu và chấp nhận bởi `ssr-dev` — xác nhận `domain/` không import Prisma, mọi Server Action chỉ gọi `application/use-cases`.
- Phương án đã loại: "Giữ nguyên 1 file phẳng `server/budget.ts` đúng như `plan.md`/`task.md` mô tả" — sẽ vi phạm R13.1/R13.3 (nghiệp vụ nằm lẫn trong hàm Server Action, không tách domain/infrastructure).
- Hệ quả: Tên file thực tế khác với mô tả gốc trong `plan.md` mục 8/11 và `task.md` cột "File / Khu vực" (ghi `server/budget.ts`). Các US sau (US-004, US-005, US-009, US-010, US-011 — đã ghi ở DEV wiki mục 6 là sẽ sửa tiếp) cần sửa đúng vị trí thật là `server/budget/**` khi tới lượt, không phải một file phẳng.
- Bằng chứng: `server/budget/**` (24 file), `docs/kb/dev/wiki/US-001-luu-tru-chi-tieu-ben-vung.md` mục 3.

### DEC-036 — Mini dashboard bỏ qua tháng chưa được tạo trong khoảng 3/6/9/12 tháng

- Ngày: 2026-07-29
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function)
- Bối cảnh: Trong khoảng 3/6/9/12 tháng gần đây (DEC-034), có thể có tháng Dylan chưa từng tạo (không có `MonthBudget`) — vd bỏ không dùng app một hai tháng. Business Flow mục 9 đã ghi đây là giả định hợp lý, chưa hỏi trực tiếp.
- Quyết định: Nếu một tháng trong khoảng đã chọn chưa được tạo, mini dashboard bỏ qua tháng đó — không hiển thị cột/điểm trống hay ép về 0.
- Người chốt: User, xác nhận trực tiếp trong `ssr-po mode=business-flow`.
- Phương án đã loại: Không có phương án khác được đưa ra — user xác nhận thẳng giả định đã nêu.
- Hệ quả: Giả định ở Business Flow mục 9 được nâng thành quyết định chính thức; gỡ khỏi danh sách "Giả định hợp lý/Cần user xác nhận".
- Bằng chứng: `docs/kb/ba/business-flow.md#4-chi-tiết-từng-luồng`

### DEC-049 — US-002: điều hướng sang `/budget` là menu chuyển hẳn trang, không còn hiển thị Thu chi tại chỗ trong shell chung

- Ngày: 2026-08-05
- Status: Active
- Feature liên quan: US-002
- Bối cảnh: Raw US-002 để ngỏ câu hỏi UI "Điều hướng từ Dylan Plan Dashboard sang `/budget` hiển thị dưới dạng gì?" (nhãn "Giả định hợp lý", chưa chốt cụ thể). Hiện trạng: nav chung của `DylanPlanApp.tsx` có 4 nút chuyển tab client-side (`activeTab` state: Roadmap, Freelance, Sản phẩm, Thu chi), không đổi URL, nội dung Thu chi hiển thị ngay tại `/`.
- Quyết định: Nav item "Thu chi" trong shell chung đổi thành liên kết điều hướng (Next.js `Link`) sang route `/budget` — bấm vào đổi URL, rời khỏi trang chủ. Nội dung Thu chi (bảng danh mục, nhập nhanh, bảng chi tiết chi tiêu...) không còn render tại chỗ trong `/` nữa, chỉ còn ở `/budget`.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-002.
- Phương án đã loại: "Giữ tab tại chỗ, thêm nút mở trang riêng" — vẫn hiển thị trùng nội dung ở hai nơi, không đúng tinh thần "tách độc lập" của `DEC-002`/M2; "Bỏ khỏi shell, chỉ vào qua URL" — mất lối điều hướng trực quan từ trang chủ.
- Hệ quả: Spec US-002 mục 6/7/8 mô tả nav item "Thu chi" là `Link` chuyển route, không phải tab đổi `activeTab`; `activeTab` trong `DylanPlanApp.tsx` mất giá trị `"budget"` (xử lý cụ thể để `ssr-plan` quyết định).
- Bằng chứng: `docs/features/US-002-route-rieng-quan-ly-chi-tieu/spec.md` mục 6, 7, 8; `components/DylanPlanApp.tsx` (nav-tabs, dòng ~520-538).

### DEC-050 — US-002: khu vực "Tổng quan" trên trang chủ không còn hiển thị nội dung Thu chi

- Ngày: 2026-08-05
- Status: Active
- Feature liên quan: US-002
- Bối cảnh: Khi `activeTab === "overview"`, `DylanPlanApp.tsx` hiện render gộp cả Roadmap, Freelance, Sản phẩm và Thu chi cùng lúc trên `/`. Sau khi Thu chi tách route riêng (`DEC-049`), cần chốt "Tổng quan" có còn hiển thị Thu chi hay không.
- Quyết định: "Tổng quan" chỉ còn gộp hiển thị Roadmap, Freelance, Sản phẩm; không còn hiển thị nội dung Thu chi. Xem Thu chi phải qua `/budget` riêng.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-002.
- Phương án đã loại: "Vẫn hiển thị tóm tắt Thu chi trong Tổng quan" — cần thêm thiết kế cho bản tóm tắt riêng biệt với bản đầy đủ ở `/budget`, không cần thiết ở phạm vi tách route lần này.
- Hệ quả: Spec US-002 mục 7/8 có AC/Element mô tả rõ "Tổng quan" sau khi đổi chỉ còn 3 khối nội dung (Roadmap, Freelance, Sản phẩm); nhánh render Thu chi trong "Tổng quan" bị gỡ khỏi `components/DylanPlanApp.tsx` khi triển khai.
- Bằng chứng: `docs/features/US-002-route-rieng-quan-ly-chi-tieu/spec.md` mục 6, 7, 8; `components/DylanPlanApp.tsx` (dòng ~595-622, nhánh `activeTab === "overview" || activeTab === "budget"`).

### DEC-051 — US-002: trang `/budget` có link/nút quay lại shell chung ở đầu trang

- Ngày: 2026-08-05
- Status: Active
- Feature liên quan: US-002
- Bối cảnh: Sau khi Thu chi tách hẳn route riêng (`DEC-049`), cần chốt Dylan có cách quay lại shell chung (Tổng quan/Roadmap/Freelance/Sản phẩm) từ `/budget` hay không, ngoài nút Back trình duyệt.
- Quyết định: Trang `/budget` có một link/nút rõ ràng ở đầu trang (vd "← Dylan Plan Dashboard") điều hướng quay lại `/`, không phụ thuộc nút Back trình duyệt.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-002.
- Phương án đã loại: "Không cần thêm, dùng nút Back trình duyệt" — user không chọn, ưu tiên lối quay lại rõ ràng ngay trên giao diện.
- Hệ quả: Spec US-002 mục 8 có Screen Element riêng cho link quay lại này ở trang `/budget`.
- Bằng chứng: `docs/features/US-002-route-rieng-quan-ly-chi-tieu/spec.md` mục 8.

### DEC-052 — US-002: bỏ thẻ "Còn lại tháng này" khỏi khối Tổng quan trên trang chủ, giữ 3 thẻ còn lại

- Ngày: 2026-08-05
- Status: Active
- Feature liên quan: US-002
- Bối cảnh: `ba-expert` rà spec US-002 phát hiện mâu thuẫn: khối 4 thẻ "Tổng quan" (`components/DylanPlanApp.tsx` dòng ~504-508) hiện hiển thị ở cả tab "Tổng quan" lẫn tab "Thu chi" (điều kiện render dòng ~595); thẻ "Còn lại tháng này" tính trực tiếp từ số liệu Thu chi (`totals.remaining` = Thu nhập - Tổng chi thực tế). `DEC-050` đã chốt "Tổng quan không còn hiển thị nội dung Thu chi", nhưng bản nháp spec vẫn giữ nguyên cả khối 4 thẻ này trong Tổng quan — chưa rõ thẻ "Còn lại tháng này" có tính là "nội dung Thu chi" phải bỏ hay không.
- Quyết định: Bỏ riêng thẻ "Còn lại tháng này" khỏi khối Tổng quan trên trang chủ; giữ 3 thẻ còn lại (Mục tiêu offer, Thu nhập hiện tại, Chi phí cố định) vì đều là số tĩnh không phụ thuộc dữ liệu Thu chi.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi hoàn thiện spec US-002 (đề xuất phát sinh từ `ba-expert`).
- Phương án đã loại: "Giữ nguyên cả 4 thẻ" — nới lại một phần `DEC-050`, chấp nhận Tổng quan vẫn còn một điểm dữ liệu suy ra từ Thu chi; user không chọn, ưu tiên nhất quán tuyệt đối với `DEC-050`.
- Hệ quả: Spec US-002 mục 3, 7 (AC-02), 8 (EL-03, mockup mục 8.1) cập nhật để phản ánh Tổng quan chỉ còn 3 thẻ; khi triển khai, `summaryCards` trong `components/DylanPlanApp.tsx` bỏ phần tử "Còn lại tháng này" khỏi nhánh hiển thị ở Tổng quan.
- Bằng chứng: `docs/features/US-002-route-rieng-quan-ly-chi-tieu/spec.md` mục 3, 7 (AC-02), 8 (EL-03, EL-06); `components/DylanPlanApp.tsx` (dòng ~504-508, ~595).

### DEC-053 — US-002: hiệu ứng di trú dữ liệu cũ chuyển sang chỉ chạy tại `/budget`, không còn chạy tại `/`

- Ngày: 2026-08-05
- Status: Active
- Feature liên quan: US-002
- Bối cảnh: `ssr-plan` khảo sát thấy hiệu ứng di trú dữ liệu cũ một lần (`DEC-039`, từ US-001) hiện chạy vô điều kiện mỗi khi `DylanPlanApp` mount tại `/`, không phụ thuộc tab nào đang chọn. Sau khi tách route (`DEC-049`), toàn bộ state/hiệu ứng Thu chi (bao gồm hiệu ứng di trú) phải chuyển sang component mới `BudgetApp` chỉ mount tại `/budget`, vì `/` không còn đọc dữ liệu Thu chi ở bất kỳ đâu.
- Quyết định: Chấp nhận hiệu ứng di trú dữ liệu cũ chỉ kích hoạt khi Dylan mở `/budget`, thay vì mỗi lần mở app (`/`) như trước. Không giữ lại một bản sao/kiểm tra nhẹ nào ở `DylanPlanApp.tsx` (shell) cho việc này.
- Người chốt: `ssr-plan` tự quyết định trong lúc khảo sát kỹ thuật, dựa trên việc `/budget` là nơi duy nhất còn ý nghĩa để trigger di trú (dữ liệu di trú xong thì cũng chỉ hiển thị ở `/budget`); không phải lựa chọn nghiệp vụ cần hỏi user.
- Phương án đã loại: "Giữ một kiểm tra `getMigrationStatus()` nhẹ ở shell để hiện banner nhắc dù chưa vào `/budget`" — không chọn vì tăng độ phức tạp (thêm gọi Server Action ở `/` dù `/` không còn liên quan Thu chi) cho một rủi ro thấp trong thực tế (US-001 đã Delivered và dùng thật từ 2026-08-03, dữ liệu cũ nhiều khả năng đã di trú xong; Dylan chắc chắn phải mở `/budget` để dùng tính năng chính nên hiệu ứng vẫn chạy, chỉ khác thời điểm).
- Hệ quả: `plan.md` US-002 mục 10 (Contract), mục 13 (Rủi ro) ghi rõ thay đổi này và hướng rollback nếu phát sinh vấn đề dữ liệu cũ chưa di trú.
- Bằng chứng: `docs/features/US-002-route-rieng-quan-ly-chi-tieu/plan.md` mục 4, 10, 13; `components/DylanPlanApp.tsx` (hiệu ứng dòng ~341-386, trước khi tách).

### DEC-054 — US-005: xóa danh mục có chuyển giao dịch thì toast báo rõ số giao dịch đã chuyển sang "Chi tiêu khác"

- Ngày: 2026-08-06
- Status: Active
- Feature liên quan: US-005
- Bối cảnh: Raw US-005 để ngỏ câu hỏi nội dung thông báo khi xóa danh mục có chuyển giao dịch (nhãn "Giả định hợp lý", chưa chốt). Đối chiếu source thật (`remove-category.ts`) xác nhận hiện tại xóa danh mục có giao dịch sẽ lỗi ràng buộc khóa ngoại (`Transaction.categoryId` `onDelete: Restrict`), không có xử lý hay phản hồi nào cho Dylan — đúng khớp gap gốc.
- Quyết định: Sau khi xóa một danh mục thành công, hiện toast xác nhận; nếu có giao dịch đã chuyển sang "Chi tiêu khác", toast nêu rõ số lượng (vd "Đã xóa 'Ăn uống'. 3 giao dịch đã chuyển sang Chi tiêu khác."); nếu không có giao dịch nào, toast chỉ báo đã xóa, không nhắc "Chi tiêu khác".
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-005.
- Phương án đã loại: "Chỉ báo chung đã xóa thành công" — không đủ minh bạch để Dylan biết dữ liệu đã đi đâu; "Không cần thông báo gì" — user không chọn, ưu tiên minh bạch cho thao tác khó hoàn tác.
- Hệ quả: Spec US-005 có AC riêng cho nội dung toast theo cả hai nhánh (có/không giao dịch chuyển).
- Bằng chứng: `docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md`.

### DEC-055 — US-005: khi nội dung nhập nhanh không khớp từ khóa danh mục nào, ô chọn danh mục tự để trống, Dylan bấm "Ghi nhận" thẳng không cần xác nhận thêm

- Ngày: 2026-08-06
- Status: Active
- Feature liên quan: US-005
- Bối cảnh: `DEC-028` đã chốt F1 cho phép ghi nhận không chọn danh mục, nhưng chưa chốt cơ chế UI cụ thể. Hiện tại ô chọn danh mục nhập nhanh luôn có sẵn một danh mục mặc định (`quickCategory` khởi tạo từ `defaultCategories[2]`), không có trạng thái trống.
- Quyết định: Khi nội dung Dylan gõ vào ô nhập nhanh không khớp từ khóa của bất kỳ danh mục nào, ô chọn danh mục tự động hiển thị ở trạng thái trống (không tự chọn sẵn một danh mục có sẵn nào) — đây là một lựa chọn hợp lệ trong danh sách, không phải lỗi. Dylan có thể bấm "Ghi nhận" ngay ở trạng thái này mà không cần chọn danh mục hay xác nhận gì thêm; giao dịch tự động vào "Chi tiêu khác".
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-005 (trả lời trực tiếp, không chọn 1 trong 2 phương án gợi ý ban đầu).
- Phương án đã loại: "Thêm nút/checkbox 'Bỏ qua danh mục' riêng cạnh ô chọn" — user không chọn, ưu tiên hành vi tự động theo kết quả nhận diện từ khóa, không cần thêm điều khiển UI mới.
- Hệ quả: Spec US-005 mô tả rõ dropdown danh mục nhập nhanh có thêm một lựa chọn trống, tự động chọn khi không khớp từ khóa; không có bước xác nhận/cảnh báo nào chặn "Ghi nhận" trong trường hợp này.
- Bằng chứng: `docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md`; `components/BudgetApp.tsx` (`inferredQuickCategory`, `quickCategory` — trước khi sửa).

### DEC-056 — US-005: "Chi tiêu khác" khi tự sinh có Loại là "Linh hoạt"

- Ngày: 2026-08-06
- Status: Active
- Feature liên quan: US-005
- Bối cảnh: Raw/wiki chưa chốt "Chi tiêu khác" thuộc Loại danh mục nào khi tự sinh — ảnh hưởng tới cách nó được tính vào các thẻ "Chi linh hoạt"/"Tiết kiệm / tích lũy" ở phần Phân tích (lọc theo `Category.type`).
- Quyết định: "Chi tiêu khác" khi tự sinh có Loại là "Linh hoạt", giống đa số danh mục chi tiêu không cố định khác. Giao dịch trong "Chi tiêu khác" được tính vào thẻ "Chi linh hoạt" ở phần Phân tích.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-005.
- Phương án đã loại: "Một Loại riêng 'Không phân loại'" — user không chọn, tránh phát sinh thêm một giá trị Loại mới chỉ phục vụ một danh mục đặc biệt.
- Hệ quả: Spec US-005 mục 6 (Dữ liệu nghiệp vụ) và mục 7 (AC liên quan tự sinh "Chi tiêu khác") ghi rõ Loại = "Linh hoạt".
- Bằng chứng: `docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md`.

### DEC-060 — US-012: khi so khớp gần đúng ra nhiều hơn một danh mục cùng khớp, chọn danh mục đầu tiên theo thứ tự hiển thị

- Ngày: 2026-08-06
- Status: Active
- Feature liên quan: US-012
- Bối cảnh: `BR-013` (so khớp gần đúng khi tên danh mục bị đổi) có thể trả về nhiều hơn một danh mục cùng khớp một nhóm từ khóa (vd hai danh mục cùng chứa cụm "Ăn uống"). Cần chốt cách chọn một trong số đó.
- Quyết định: Lấy danh mục đầu tiên theo đúng thứ tự hiển thị trên bảng ngân sách (thứ tự dữ liệu trả về từ danh sách danh mục của tháng đang chọn), không cố tính "khớp dài nhất" hay quy tắc phức tạp hơn.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-012.
- Phương án đã loại: "Khớp dài nhất" — chính xác hơn trong nhiều trường hợp nhưng user không chọn, ưu tiên cách đơn giản; "Rơi về Chi tiêu khác khi mơ hồ" — an toàn nhất nhưng user không chọn, chấp nhận rủi ro hiếm gặp (nhiều danh mục cùng khớp một nhóm từ khóa) đổi lấy cách làm đơn giản hơn.
- Hệ quả: Spec US-012 mô tả rõ quy tắc "khớp nhiều thì lấy cái đầu tiên theo thứ tự hiển thị" trong AC liên quan đến `BR-013`. Trường hợp này hiếm gặp trong thực tế (8 nhóm từ khóa mặc định hiếm khi trùng lặp cụm từ), nên độ đơn giản được ưu tiên hơn độ chính xác tuyệt đối.
- Bằng chứng: `docs/features/US-012-sua-loi-nhan-dien-danh-muc/spec.md`.

### DEC-059 — Sửa lỗi nhận diện danh mục nhập nhanh khi tên danh mục bị đổi: so khớp gần đúng trước, rồi mới rơi về "Chi tiêu khác"

- Ngày: 2026-08-06
- Status: Active
- Feature liên quan: Chưa có (phát hiện qua PO review, chưa cấp mã US)
- Bối cảnh: PO review `docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md` (PO-01) tái hiện thật: khi nội dung nhập nhanh khớp từ khóa của một danh mục (vd "ăn tối 300k" khớp rule "Ăn uống"), nhưng danh mục đó đã bị Dylan đổi tên (vd thành "Ăn uống & đi chợ"), hệ thống tra cứu theo tên chính xác thất bại và âm thầm không ghi nhận gì — không lưu, không báo lỗi, không rơi về "Chi tiêu khác" như trường hợp không khớp từ khóa nào (hành vi đã có từ US-005).
- Quyết định: Khi rule khớp từ khóa nhưng không tìm được danh mục đúng tên tuyệt đối, thử so khớp gần đúng (tên danh mục thật có chứa tên rule, hoặc ngược lại) trước khi kết luận không tìm thấy; nếu vẫn không xác định được, rơi về "Chi tiêu khác" giống hệt nhánh "không khớp từ khóa nào" — không bao giờ để giao dịch bị mất một cách im lặng.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=review`.
- Phương án đã loại: "Luôn rơi thẳng về Chi tiêu khác khi không khớp tên 100%" — đơn giản hơn nhưng làm mất đúng ý định phân loại ban đầu ngay cả khi có thể suy ra được; "Gắn mã cố định cho từng danh mục mặc định, nhận diện qua mã thay vì tên" — giải pháp bền vững hơn nhưng cần đổi schema, user chọn phương án nhanh hơn trước.
- Hệ quả: Cần một US mới sửa `components/BudgetApp.tsx` (`addQuickExpense`/`inferredQuickCategory`) để thêm bước so khớp gần đúng và fallback về "Chi tiêu khác" (tái dùng `fallbackCategoryService` từ US-005) khi so khớp gần đúng cũng thất bại. Không đổi schema.
- Bằng chứng: `docs/po/review-2026-08-06-nhap-nhanh-nhan-dien-danh-muc.md`.

### DEC-058 — US-005: phân biệt "Chi tiêu khác" với danh mục khóa khác bằng field mới `Category.isFallback`, không tái dùng `locked`

- Ngày: 2026-08-06
- Status: Active
- Feature liên quan: US-005
- Bối cảnh: `ssr-plan` khảo sát thấy `Category.locked` (từ US-001) đang dùng chung cho "Tiền nhà"/"Chi phí cố định khác" — hai danh mục này vẫn cho sửa tên/loại/ngân sách, chỉ chặn xóa. Spec US-005 (mục 13) yêu cầu "Chi tiêu khác" khóa nghiêm ngặt hơn: không cho sửa cả tên/loại/ngân sách, không chỉ chặn xóa (`DEC-027`). Tái dùng `locked` cho cả hai ý nghĩa sẽ làm mọi danh mục khóa hiện có (Tiền nhà, Chi phí cố định khác) bỗng bị khóa chỉ-đọc hoàn toàn — sai với hành vi đã Delivered ở US-001.
- Quyết định: Thêm field mới `Category.isFallback Boolean @default(false)`. Chỉ "Chi tiêu khác" có `isFallback=true` (kèm `locked=true`); các danh mục khóa khác giữ `locked=true, isFallback=false`. UI và use-case (`upsertCategory`) chặn sửa tên/loại/ngân sách khi `isFallback=true`, không đổi hành vi của các danh mục khóa khác.
- Người chốt: `ssr-plan` tự quyết định trong lúc khảo sát kỹ thuật, dựa trên đối chiếu trực tiếp `prisma/schema.prisma` và hành vi UI hiện tại — không phải lựa chọn nghiệp vụ cần hỏi user (nghiệp vụ đã chốt ở `DEC-027`, đây chỉ là cách hiện thực).
- Phương án đã loại: "Suy ra 'Chi tiêu khác' bằng so tên chuỗi cố định" — dễ vỡ nếu sau này có yêu cầu đổi nhãn hiển thị hoặc đa ngôn ngữ, và không tách bạch được ý định nghiệp vụ khỏi dữ liệu hiển thị.
- Hệ quả: `ssr-data` khi tới lượt phải thêm đúng field này vào `Category`; `data-model.md` của US-005 ghi rõ. Toàn bộ use-case/UI liên quan (`remove-category.ts`, `upsert-category.ts`, `create-month.ts`, bảng danh mục ở `components/BudgetApp.tsx`) đọc `isFallback` thay vì suy đoán qua tên.
- Bằng chứng: `docs/features/US-005-rang-buoc-toan-ven-danh-muc/plan.md` mục 1, 9.

### DEC-057 — US-005: "Chi tiêu khác" khi tự sinh có Ngân sách mặc định 0đ

- Ngày: 2026-08-06
- Status: Active
- Feature liên quan: US-005
- Bối cảnh: Cần chốt giá trị Ngân sách (mức dự kiến chi) ban đầu khi "Chi tiêu khác" tự sinh — không có căn cứ nào để suy đoán một con số cụ thể thay Dylan.
- Quyết định: "Chi tiêu khác" khi tự sinh có Ngân sách mặc định 0đ, khớp cách các danh mục linh hoạt khác được tạo thủ công (nút "Thêm danh mục" cũng khởi tạo Ngân sách 0). Dylan có thể tự sửa Ngân sách sau nếu muốn, giống mọi danh mục thường khác — riêng "Chi tiêu khác" thì không, vì bị khóa vĩnh viễn (`BR-010`/`DEC-027`).
- Người chốt: `ssr-ba` tự quyết định — không phải lựa chọn nghiệp vụ có nhiều phương án hợp lý, chỉ là giá trị mặc định nhất quán với hành vi đã có.
- Phương án đã loại: Không có — chỉ một phương án hợp lý (không bịa một con số ước lượng thay Dylan).
- Hệ quả: Spec US-005 mục 7 (AC tự sinh "Chi tiêu khác") ghi Ngân sách khởi tạo 0đ.
- Bằng chứng: `docs/features/US-005-rang-buoc-toan-ven-danh-muc/spec.md`; `components/BudgetApp.tsx` (`addCategory` — `budget: 0` khi tạo danh mục mới thủ công).

### DEC-061 — US-006: ngăn trùng tháng bằng cách disable ngay trong ô chọn kỳ tháng, không phải báo lỗi sau khi bấm tạo

- Ngày: 2026-08-07
- Status: Active
- Feature liên quan: US-006
- Bối cảnh: Raw US-006 hỏi (Q1) khi trùng tháng nên chặn hoàn toàn hay cho chuyển sang xem tháng đã tồn tại — đề xuất ban đầu là báo lỗi/thông báo sau khi Dylan bấm "Tạo tháng"/"Clone tháng hiện tại".
- Quyết định: Không xử lý ở bước bấm nút. Thay ô "Tạo tháng mới" (hiện là `<input type="month">` chọn tự do) bằng một combobox liệt kê từng kỳ tháng cụ thể; kỳ tháng nào đã có dữ liệu (`MonthBudget` đã tồn tại) hiển thị mờ, không chọn được. Dylan chỉ có thể chọn được các kỳ tháng chưa tồn tại — trùng tháng trở thành trạng thái không thể xảy ra qua UI thay vì một lỗi phải báo sau.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-006.
- Phương án đã loại: "Chỉ hiện thông báo, không tự chuyển" và "Báo và tự động chuyển focus sang tháng đã tồn tại" — cả hai vẫn để Dylan bấm được vào trạng thái trùng rồi mới xử lý hậu quả; "Chặn nút, không cho bấm" — gần với phương án được chọn nhưng vẫn để lộ danh sách chọn tự do thay vì rõ ràng từng kỳ tháng khả dụng.
- Hệ quả: Đổi từ `<input type="month">` sang một dropdown/combobox liệt kê kỳ tháng theo khoảng đã chốt ở `DEC-062`; `ssr-plan` cần thiết kế lại đúng một phần UI này, đổi state `newMonth` từ tự do nhập sang chọn trong danh sách đã lọc. Nâng độ phức tạp so với ước lượng "Quick win" ban đầu trong `backlog.md`, nhưng vẫn không cần đổi cấu trúc dữ liệu (`MonthBudget.id` vẫn là khóa chính duy nhất như cũ).
- Bằng chứng: `docs/kb/ba/raw/US-006-canh-bao-trung-thang.md` mục 4 (Q1), `components/BudgetApp.tsx:640` (ô `input type="month"` hiện tại)

### DEC-062 — US-006: combobox chọn kỳ tháng mới liệt kê 6 tháng trước đến 6 tháng sau tháng hiện tại

- Ngày: 2026-08-07
- Status: Active
- Feature liên quan: US-006
- Bối cảnh: Sau `DEC-061`, cần chốt khoảng kỳ tháng cụ thể hiển thị trong combobox chọn "Tạo tháng mới" — không có căn cứ nào để tự suy đoán một con số.
- Quyết định: Combobox liệt kê 13 kỳ tháng liên tục: 6 tháng trước tháng hiện tại (theo đồng hồ hệ thống) đến 6 tháng sau, bao gồm cả tháng hiện tại. Kỳ tháng đã có `MonthBudget` hiển thị mờ, không chọn được (`DEC-061`); kỳ tháng còn lại chọn được bình thường.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-006.
- Phương án đã loại: "12 trước — 12 sau" (25 tháng, đề xuất mặc định của `ssr-ba`) và "Từ tháng sớm nhất đã có đến 12 tháng sau" — user chọn khoảng hẹp hơn (6-6) thay vì hai phương án rộng hơn.
- Hệ quả: Spec US-006 mục 7-8 dùng đúng khoảng 6 tháng trước/sau khi mô tả combobox và Screen Element; "tháng hiện tại" tính theo cùng quy tắc đồng hồ hệ thống đã dùng ở `DEC-034` (mini dashboard) để nhất quán toàn dự án.
- Bằng chứng: `docs/kb/ba/raw/US-006-canh-bao-trung-thang.md` mục 4 (Q1), `docs/memory/decisions.md#dec-034`

### DEC-063 — US-013: "Tạo tháng" dùng danh mục mặc định, không còn sao chép từ tháng đang xem

- Ngày: 2026-08-10
- Status: Active
- Feature liên quan: US-013
- Bối cảnh: Code hiện tại (`components/BudgetApp.tsx`, hàm `createNewMonth`) khiến nút "Tạo tháng" và "Clone tháng hiện tại" chạy đúng một logic — tham số `cloneCurrent` bị bỏ qua, cả hai đều sao chép cấu trúc danh mục từ tháng đang chọn. Raw US-013 đổi tên "Clone tháng hiện tại" thành "Clone tháng đang xem" và định nghĩa lại nghiệp vụ của nó, nhưng không nói rõ "Tạo tháng" (nút còn lại) nên làm gì sau khi tách bạch.
- Quyết định: "Tạo tháng" luôn tạo danh mục theo bộ mặc định của hệ thống (`defaultCategories`), không sao chép bất kỳ gì từ tháng đang xem. Việc sao chép cấu trúc danh mục từ tháng đang xem chỉ còn thuộc về "Clone tháng đang xem" (xem `DEC-064`).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` khi ghi raw US-013.
- Phương án đã loại: "Giữ nguyên hành vi sao chép như hiện tại cho cả hai nút" (giữ nguyên bug hai nút giống hệt nhau); "Tạo tháng trống hoàn toàn, không có danh mục nào" (không chọn, vì mất tính tiện dụng có sẵn danh mục mặc định).
- Hệ quả: `create-month.ts` cần thêm nhánh rẽ theo `cloneCurrent`/nguồn sao chép thay vì luôn ưu tiên `sourceMonthId` khi có; spec US-013 phải mô tả rõ hai nhánh nghiệp vụ khác nhau cho hai nút.
- Bằng chứng: `docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md` mục 4 (Q1)

### DEC-064 — US-013: "Clone tháng đang xem" chỉ sao chép cấu trúc danh mục, không gồm thu nhập/giao dịch/"Chi tiêu khác"

- Ngày: 2026-08-10
- Status: Active
- Feature liên quan: US-013
- Bối cảnh: Raw US-013 yêu cầu "khi xác nhận clone tháng đang xem thì sẽ clone dữ liệu của tháng đang xem qua tháng mới đang tạo" nhưng không nói rõ phạm vi "dữ liệu" — có gồm thu nhập, giao dịch, hay danh mục "Chi tiêu khác" hay không.
- Quyết định: "Clone tháng đang xem" chỉ sao chép cấu trúc danh mục (tên, loại, hạn mức ngân sách, trạng thái khóa) của tháng đang xem — đúng cơ chế sao chép danh mục đã có sẵn trong `create-month.ts`. Không sao chép thu nhập (tháng mới vẫn dùng thu nhập mặc định `DEFAULT_INCOME`), không sao chép giao dịch, không sao chép danh mục "Chi tiêu khác" (giữ nguyên quy tắc `DEC-026`).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` khi ghi raw US-013.
- Phương án đã loại: "Gồm cả thu nhập" và "Gồm cả giao dịch" — user chọn phạm vi hẹp nhất, giữ nguyên kiến trúc "Chi thực tế" luôn tính bằng aggregate, không carry-over giao dịch.
- Hệ quả: `create-month.ts` không cần đổi phần tính thu nhập/giao dịch, chỉ cần thêm điều kiện bật/tắt việc lấy `sourceCategories` theo đúng nút được bấm. Spec US-013 nêu rõ AC cho "Clone tháng đang xem" chỉ khẳng định danh mục giống tháng nguồn, không khẳng định thu nhập/giao dịch giống nhau.
- Bằng chứng: `docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md` mục 4 (Q2), `docs/memory/decisions.md#dec-026`

### DEC-065 — Gộp raw US-013 vào spec US-006 thay vì tách spec riêng

- Ngày: 2026-08-10
- Status: Active
- Feature liên quan: US-006, US-013
- Bối cảnh: Raw `US-013` (đổi nhãn "Chọn tháng" → "Chọn tháng xem", tách khu vực tạo tháng mới, đổi tên và nghiệp vụ nút "Clone tháng hiện tại" → "Clone tháng đang xem") chạm đúng khu vực màn hình mà `US-006` (spec đã `Ready for DEV` nhưng chưa qua stage plan/task) mô tả — ô "Tạo tháng mới", nút "Tạo tháng", nút "Clone...". Đối chiếu cho thấy spec `US-006` (AC-02/AC-03 bản gốc) đã ngầm giả định đúng nghiệp vụ mà `US-013` yêu cầu (Tạo tháng dùng mặc định, Clone sao chép từ tháng đang xem). User yêu cầu đánh giá impact và gộp nếu scope không cao.
- Quyết định: Gộp toàn bộ nội dung raw `US-013` thẳng vào spec `docs/features/US-006-canh-bao-trung-thang/spec.md` (mục 1, 3, 4, 6, 7, 8, 10, 11, 12, 14) — không tạo thư mục `docs/features/US-013-khu-vuc-chon-thang-clone/`, không tách spec/plan/task/report riêng cho `US-013`. Raw `US-013` giữ nguyên trên đĩa với `status: Merged`, dùng làm bằng chứng lịch sử, không xóa.
- Người chốt: User, yêu cầu trực tiếp trong hội thoại ("đánh giá impact, nếu scope không cao hãy gộp US 13 và US 6").
- Phương án đã loại: "Giữ hai spec riêng, US-013 dẫn chiếu US-006" — không chọn vì cả hai cùng sửa chung một Screen Element (khu vực tạo tháng mới), tách riêng sẽ tạo rủi ro một spec đi trước dùng tên nút cũ ("Clone tháng hiện tại") rồi spec sau phải sửa lại đúng cùng vùng JSX, gây làm lại việc.
- Hệ quả: `docs/requirements-index.md` và `docs/kb/ba/00-index.md` ghi `US-013` trỏ về spec của `US-006`, không có cột Spec/Plan/Task/Report riêng. Khi `ssr-plan`/`ssr-breaker`/`ssr-dev` tới lượt xử lý `US-006`, phạm vi công việc đã bao gồm cả 3 thay đổi của `US-013`.
- Bằng chứng: `docs/kb/ba/raw/US-013-khu-vuc-chon-thang-clone.md`, `docs/features/US-006-canh-bao-trung-thang/spec.md` mục 10-11

### DEC-066 — US-014: "Chi tiêu khác luôn ở cuối" áp dụng cả 3 nơi dùng chung danh sách danh mục, không sắp xếp lại các danh mục khác

- Ngày: 2026-08-10
- Status: Active
- Feature liên quan: US-014
- Bối cảnh: Raw US-014 chỉ nói "chi tiêu khác luôn nằm cuối bảng danh mục", không nói rõ có áp dụng cho ô chọn danh mục ở khu nhập nhanh và biểu đồ "Cơ cấu chi tiêu" hay không (cả ba cùng dùng lại một danh sách danh mục ở phía client), và không nói rõ các danh mục còn lại có cần sắp xếp lại theo tiêu chí nào khác không.
- Quyết định: Áp dụng ràng buộc "luôn ở cuối" cho cả 3 nơi (bảng ngân sách, dropdown "Danh mục nhận diện", biểu đồ "Cơ cấu chi tiêu") vì cùng dùng chung một danh sách danh mục. Các danh mục còn lại (không phải "Chi tiêu khác") giữ nguyên thứ tự tương đối hiện có — không sắp xếp lại theo tiêu chí nào khác.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-014.
- Phương án đã loại: "Chỉ áp dụng cho bảng ngân sách, giữ nguyên thứ tự ở dropdown/biểu đồ" — không chọn, vì sẽ tạo bất nhất giữa 3 nơi hiển thị cùng một danh sách; "Sắp xếp lại toàn bộ danh mục theo tiêu chí khác" — không chọn, ngoài phạm vi yêu cầu ban đầu.
- Hệ quả: Spec US-014 mô tả 3 Screen Element (`EL-01` bảng, `EL-02` dropdown, `EL-03` biểu đồ) đều mang ràng buộc thứ tự mới; cách hiện thực dự kiến là sắp xếp lại ngay tại nguồn danh sách danh mục dùng chung ở client, để 3 nơi tự động nhất quán.
- Bằng chứng: `docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md` mục 4 (Q1, Q2), `docs/features/US-014-chi-tieu-khac-cuoi-bang/spec.md` mục 3, 8, 14

### DEC-067 — Làm US-014 trước US-010 dù US-010 cùng tier ưu tiên và giải quyết rủi ro toàn vẹn dữ liệu cao hơn

- Ngày: 2026-08-10
- Status: Active
- Feature liên quan: US-014, US-010
- Bối cảnh: `po-expert` khi rà spec US-014 (`ssr-ba`) phát hiện US-010 ("Chặn trùng tên danh mục") cùng tier ưu tiên đã công bố ở `docs/kb/ba/business-flow.md` mục 7 với US-004/US-005/US-006 (đều đã Delivered), nhưng US-010 vẫn chưa có raw/spec trong khi US-014 (chỉnh hiển thị thứ tự bảng, giá trị thấp hơn) đang được xử lý trước. Verdict `po-expert`: `Needs Adjustment`, đưa câu hỏi thứ tự cho user quyết.
- Quyết định: Tiếp tục xử lý US-014 ngay trong phiên này — đúng yêu cầu trực tiếp user vừa đưa ra. US-010 giữ nguyên trong backlog (`Raw`, chưa có spec), làm sau.
- Người chốt: User, qua `AskUserQuestion` khi `ssr-pipeline` dừng ở điểm dừng tương tác duy nhất (stage `ba`) để đưa quyết định của `po-expert` ra hỏi.
- Phương án đã loại: "Dừng US-014, chuyển sang US-010 trước" — đúng thứ tự ưu tiên đã công bố nhưng không được chọn.
- Hệ quả: Không đổi phạm vi/nội dung spec US-014 — po-expert gọi lại chỉ để xác nhận `Aligned` sau khi câu hỏi thứ tự đã được user trả lời trực tiếp, không cần sửa spec. US-010 vẫn là nợ backlog đã biết, nên nhắc lại khi lập kế hoạch các đợt tiếp theo.
- Bằng chứng: `docs/kb/ba/business-flow.md` mục 7, `docs/requirements-index.md` (US-010 Missing)

### DEC-068 — US-010: Áp BR-017 (chặn trùng tên) luôn cho cả nút "Thêm danh mục" mang tên mặc định cố định

- Ngày: 2026-08-10
- Status: Active
- Feature liên quan: US-010
- Bối cảnh: Khi viết spec `US-010`, `ssr-ba` phát hiện nút "Thêm danh mục" hiện tại (`components/BudgetApp.tsx` — `addCategory`) luôn tạo danh mục với tên cố định "Danh mục mới", không cho Dylan nhập tên trước khi lưu. Raw `US-010` và `DEC-020`/`DEC-021`/`DEC-022` chỉ nói chung "thêm mới hoặc sửa tên", không nói rõ có áp dụng cho trường hợp tên do hệ thống tự đặt (không phải Dylan tự gõ) hay không — nếu áp dụng, lần bấm "Thêm danh mục" thứ hai trong cùng tháng (khi danh mục đầu chưa đổi tên) sẽ luôn bị chặn.
- Quyết định: Áp dụng đúng `BR-017` cho cả nút "Thêm danh mục" — không phân biệt tên do Dylan tự gõ hay do hệ thống tự đặt mặc định. Bấm "Thêm danh mục" khi tên mặc định "Danh mục mới" đã trùng (theo chuẩn hóa hoa/thường, khoảng trắng thừa) với một danh mục khác trong tháng đang chọn → chặn, báo lỗi rõ ràng yêu cầu Dylan đổi tên danh mục đang trùng trước khi thêm mới. Không sửa cơ chế nút "Thêm danh mục" hiện tại (vẫn tạo ngay với tên mặc định, không chuyển sang nhập tên trước khi lưu).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-010.
- Phương án đã loại: "Đổi cách nút Thêm danh mục hoạt động (để tên trống, buộc nhập tên trước khi lưu)" — ngoài phạm vi raw mô tả, thay đổi cơ chế UI hiện có; "Miễn kiểm tra trùng tên cho tên mặc định do hệ thống tự đặt" — không chọn, vì để lại đúng vấn đề US-010 muốn ngăn (nhiều danh mục cùng tên mặc định chưa đổi).
- Hệ quả: Spec US-010 mục 4 (Luồng nghiệp vụ) và mục 7 (AC) phải có một tình huống riêng cho việc bấm "Thêm danh mục" khi tên mặc định đã trùng, không chỉ nói về sửa tên.
- Bằng chứng: `components/BudgetApp.tsx` (`addCategory`, dòng 401-404), `docs/memory/decisions.md#dec-020`, `#dec-021`

### DEC-069 — US-010: Mở rộng quy tắc chuẩn hóa so trùng tên danh mục — rút gọn cả khoảng trắng lặp ở giữa chuỗi

- Ngày: 2026-08-10
- Status: Active
- Feature liên quan: US-010
- Bối cảnh: `ba-expert` khi rà spec `US-010` phát hiện `DEC-022` chỉ chuẩn hóa bằng cách bỏ khoảng trắng thừa ở đầu/cuối chuỗi và khác biệt hoa/thường — không rút gọn khoảng trắng lặp ở giữa chuỗi. Ví dụ "Ăn  uống" (hai khoảng trắng liền giữa hai từ) và "Ăn uống" (một khoảng trắng) vẫn được coi là hai tên khác nhau theo quy tắc cũ, có thể lọt lại đúng vấn đề `US-010` muốn ngăn (hai danh mục trông giống nhau cùng tồn tại, gây khó xác định gán giao dịch ở nhập nhanh).
- Quyết định: Mở rộng quy tắc chuẩn hóa khi so trùng tên danh mục — ngoài bỏ khoảng trắng thừa đầu/cuối và khác biệt hoa/thường (`DEC-022`), rút gọn mọi dãy khoảng trắng liên tiếp ở giữa chuỗi thành một khoảng trắng trước khi so sánh. "Ăn  uống" và "Ăn uống" nay được coi là trùng.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` khi viết spec US-010, theo đề xuất của `ba-expert`.
- Phương án đã loại: "Giữ nguyên như `DEC-022`, chỉ bỏ khoảng trắng đầu/cuối" — không chọn, vì để lọt lại đúng vấn đề `US-010` muốn ngăn.
- Hệ quả: Mở rộng `BR-017` (trang wiki) và spec `US-010` mục 3 (Phạm vi), mục 8 (`EL-01`, `EL-02`), thêm `AC-07` minh họa trường hợp khoảng trắng lặp ở giữa.
- Bằng chứng: `docs/features/US-010-chan-trung-ten-danh-muc/spec.md` mục 14 (A5, do `ba-expert` phát hiện), `docs/memory/decisions.md#dec-022`

### DEC-070 — US-010: Dùng một mẫu thông báo lỗi chung cho cả thêm mới và sửa tên trùng, không tách hai chuỗi riêng

- Ngày: 2026-08-10
- Status: Active
- Feature liên quan: US-010
- Bối cảnh: `ssr-plan` khảo sát thấy nút "Thêm danh mục" và ô sửa tên đều gọi chung đúng một use-case `upsertCategory` — thêm một điều kiện kiểm tra trùng tên vào use-case này tự động bảo vệ cả hai luồng. Spec mục 8 (`EL-03`) đưa ví dụ hai câu thông báo lỗi khác nhau cho hai luồng (một câu nhấn "yêu cầu đổi tên khác", một câu nhấn "trước khi thêm mới"), nhưng đó là ví dụ minh họa ý nghĩa quan sát được, không phải chuỗi bắt buộc từng chữ.
- Quyết định: Dùng một mẫu thông báo lỗi duy nhất cho cả hai luồng: `Tên danh mục "<tên>" đã tồn tại trong tháng này. Vui lòng đổi tên khác.` — nội suy tên thật vào chỗ trống. Không tạo hai chuỗi lỗi riêng biệt theo luồng gọi.
- Người chốt: `ssr-plan` tự quyết định trong lúc khảo sát kỹ thuật — không phải lựa chọn nghiệp vụ cần hỏi user (nội dung quan sát được ở AC-01/AC-02 đều được đáp ứng bằng một mẫu chung), chỉ là cách hiện thực gọn hơn khi cả hai luồng cùng đi qua một use-case.
- Phương án đã loại: "Hai chuỗi lỗi riêng biệt theo luồng gọi (thêm mới vs sửa tên)" — không chọn, vì `upsertCategory` không tự phân biệt được mình đang được gọi từ luồng nào (chỉ biết có `id` hay không, không biết UI phía trên là nút hay ô nhập), thêm cờ phân biệt sẽ làm phức tạp contract mà không đổi giá trị quan sát được cho Dylan.
- Hệ quả: `ssr-review` khi đối chiếu AC-01/AC-02 với implementation cần hiểu wording là ví dụ minh họa, không phải chuỗi bắt buộc từng chữ — chỉ cần toast nêu đúng tên đang trùng và yêu cầu đổi tên.
- Bằng chứng: `docs/features/US-010-chan-trung-ten-danh-muc/plan.md` mục 10, `server/budget/application/use-cases/upsert-category.ts`

### DEC-071 — US-015: "Tháng trước/tháng sau" trong khu vực quick view tính theo danh sách tháng đã tạo, không theo lịch

- Ngày: 2026-08-11
- Status: Active
- Feature liên quan: US-015
- Bối cảnh: `ssr-po` phát hiện khu vực "Lịch sử thu chi" hiển thị không giới hạn số thẻ tháng (PO-02), user chỉ đạo giới hạn còn 3 thẻ (trước/đang xem/sau). Cần chốt "trước/sau" tính theo lịch (liên tiếp theo mã tháng, kể cả tháng chưa tạo) hay theo thứ tự trong danh sách tháng đã tạo.
- Quyết định: Tính theo thứ tự trong danh sách tháng ĐÃ TẠO, bỏ qua tháng chưa tạo. Nếu giữa tháng đang xem và tháng liền kề gần nhất có tháng chưa tạo bị bỏ qua, thẻ "trước"/"sau" vẫn lấy tháng đã tạo gần nhất theo hướng đó, không nhảy đúng một tháng lịch.
- Người chốt: User, qua `AskUserQuestion` trong phiên `ssr-po mode=review` (2026-08-11).
- Phương án đã loại: "Theo lịch (liên tiếp theo mã tháng)" — không chọn, vì có thể hiển thị ô trống/không có dữ liệu khi tháng liền kề theo lịch chưa được tạo.
- Hệ quả: Spec `US-015` phải định nghĩa rõ "tháng trước/tháng sau" dựa trên vị trí trong mảng `months` đã sắp xếp theo mã tháng tăng dần, không phải phép cộng/trừ 1 tháng theo lịch.
- Bằng chứng: `docs/po/review-2026-08-11-quick-view-thang.md` mục 4, `docs/kb/ba/raw/US-015-quick-view-thang-lien-ke.md` mục 4 (Q1)

### DEC-072 — US-015: Ẩn ô thẻ tháng khi không có tháng trước/sau tương ứng

- Ngày: 2026-08-11
- Status: Active
- Feature liên quan: US-015
- Bối cảnh: Cùng phiên với `DEC-071` — khi tháng đang xem là tháng đầu tiên hoặc cuối cùng trong danh sách tháng đã tạo, không có tháng trước hoặc tháng sau để hiển thị.
- Quyết định: Ẩn ô thẻ tháng tương ứng khi không có dữ liệu — lưới quick view có thể chỉ còn 1 hoặc 2 thẻ thay vì luôn cố định 3 thẻ.
- Người chốt: User, qua `AskUserQuestion` trong phiên `ssr-po mode=review` (2026-08-11).
- Phương án đã loại: "Placeholder rỗng dạng mờ 'Chưa có dữ liệu'" — không chọn, vì không cần giữ bố cục luôn đủ 3 cột.
- Hệ quả: Spec `US-015` không cần định nghĩa nội dung placeholder cho ô thiếu; UI chỉ render số thẻ thực có (1-3).
- Bằng chứng: `docs/po/review-2026-08-11-quick-view-thang.md` mục 4, `docs/kb/ba/raw/US-015-quick-view-thang-lien-ke.md` mục 4 (Q2)

### DEC-073 — "Loại" chi tiêu (danh mục) chuyển từ ô nhập chữ tự do sang combobox cố định 3 giá trị: Cố định / Tích lũy / Khác (thay cho "Linh hoạt")

- Ngày: 2026-08-11
- Status: Active
- Feature liên quan: Không (thuộc Business Flow, chưa có function — xem `docs/po/review-2026-08-11-loai-chi-tieu-combobox.md`)
- Bối cảnh: Cột "Loại" trong bảng danh mục (F2, `components/BudgetApp.tsx:984-990`) hiện là ô nhập chữ tự do, không ràng buộc giá trị. Dữ liệu thật (`prisma/dev.db`, bảng `Category`) xác nhận rủi ro đã xảy ra: 1 danh mục có `type = "Linh s"` (dữ liệu lỗi do gõ dở dang), bên cạnh 3 nhãn đang dùng thật là "Cố định" (22), "Linh hoạt" (43), "Tích lũy" (18).
- Quyết định: Đổi "Loại" thành combobox/select, chỉ cho chọn đúng 3 giá trị cố định — "Cố định", "Tích lũy", "Khác" — không còn cho gõ chữ tự do. "Khác" thay thế hoàn toàn vai trò "Linh hoạt" cũ (không giữ "Linh hoạt" làm một trong 3 lựa chọn).
- Người chốt: User, yêu cầu trực tiếp qua 2 lượt lệnh `/dylan-ssrkit:ssr-po` (2026-08-11) — lượt 1 đề xuất 3 giá trị "Cố định/Linh hoạt/Khác", lượt 2 tự sửa lại thành "Cố định/Tích lũy/Khác (thay cho linh hoạt)".
- Phương án đã loại: Giữ "Linh hoạt" là 1 trong 3 lựa chọn (đề xuất ban đầu ở lượt 1) — user tự đổi ý ở lượt 2, chọn "Tích lũy" làm giá trị chính thức thứ hai và để "Khác" đảm nhận vai trò "Linh hoạt" cũ.
- Hệ quả: (1) Migrate dữ liệu cũ — 43 dòng "Linh hoạt" chuyển thành "Khác"; "Cố định" (22) và "Tích lũy" (18) giữ nguyên; dòng dữ liệu lỗi "Linh s" (1) cũng chuyển thành "Khác" — user xác nhận trực tiếp (2026-08-11, lượt 3: "Linh s sẽ đổi thành khác"). (2) Đồng bộ 3 nơi hard-code `"Linh hoạt"`: seed 4 danh mục mặc định (`lib/budget-defaults.ts:18-21`), nút "Thêm danh mục" (`components/BudgetApp.tsx:416`), "Chi tiêu khác" tự sinh (`server/budget/domain/services/fallback-category-service.ts:9`, supersede một phần DEC-056 — chỉ đổi giá trị `type`, không đổi các quyết định khác của DEC-056). (3) Thẻ insight "Chi linh hoạt" (F4, so khớp `linh` trên `type`) không còn khớp giá trị nào sau migrate — đổi điều kiện sang so `type === "Khác"`, đồng thời đổi tên nhãn hiển thị thành "Chi khác" — user xác nhận trực tiếp (2026-08-11, lượt 4: "Đổi thành Chi khác"). (4) `docs/memory/glossary.md` mục "Loại danh mục" cập nhật lại 3 giá trị mới.
- Bằng chứng: `docs/po/review-2026-08-11-loai-chi-tieu-combobox.md`, `prisma/dev.db` (query trực tiếp 2026-08-11), `components/BudgetApp.tsx:330-335,416,984-990,1061-1062`, `lib/budget-defaults.ts:15-22`, `server/budget/domain/services/fallback-category-service.ts:9`

### DEC-074 — US-017: Thứ tự danh mục sau kéo thả phải lưu vào database, không chỉ đổi tạm trên client

- Ngày: 2026-08-12
- Status: Active
- Feature liên quan: US-017
- Bối cảnh: Model `Category` hiện không có cột thứ tự; `findByMonth` không có `orderBy`, hiển thị theo thứ tự tạo/rowid SQLite. Yêu cầu kéo thả sắp xếp lại vị trí danh mục trên bảng cần quyết định thứ tự đó có bền vững qua các lần tải lại trang/đổi tháng hay không.
- Quyết định: Thứ tự sau khi kéo thả phải được lưu vào database — cần thêm một cột thứ tự (vd `order`/`sortOrder`) vào model `Category`, cập nhật khi kéo thả, giữ nguyên qua các lần tải lại, đổi tháng, đăng nhập lại.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-12).
- Phương án đã loại: "Chỉ đổi tạm trên client, không đổi schema" — không chọn, vì thứ tự sẽ mất ngay khi tải lại trang hoặc chuyển tháng khác, gây khó chịu vì công sức kéo thả không được giữ lại.
- Hệ quả: `ssr-data` cần thêm cột thứ tự vào `prisma/schema.prisma` và migration tương ứng khi lập kế hoạch kỹ thuật cho US-017; `findByMonth` cần đổi sang `orderBy` theo cột mới.
- Bằng chứng: `docs/kb/ba/raw/US-017-sap-xep-danh-muc-keo-tha.md` mục 4 (Q1), `prisma/schema.prisma:27-43`, `server/budget/infrastructure/repositories/category-prisma-repository.ts:38-41`

### DEC-075 — US-017: Danh mục "khóa" (`locked`) vẫn được phép kéo thả đổi vị trí

- Ngày: 2026-08-12
- Status: Active
- Feature liên quan: US-017
- Bối cảnh: Danh mục có `locked=true` (vd "Tiền nhà") hiện chỉ bị ẩn nút xóa, không ràng buộc gì về vị trí hiển thị. Kéo thả sắp xếp lại vị trí có thể bị hiểu nhầm là một dạng khóa khác cần loại trừ danh mục khóa.
- Quyết định: Danh mục khóa vẫn kéo thả đổi vị trí bình thường như danh mục khác — `locked` chỉ tiếp tục mang nghĩa chặn xóa, không mở rộng sang chặn đổi vị trí.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-12).
- Phương án đã loại: "Không cho kéo thả, giữ cố định vị trí" — không chọn, vì sẽ khiến `locked` mang thêm một nghĩa mới, đòi hỏi UI phân biệt danh mục kéo được/không kéo được mà không có lý do nghiệp vụ rõ ràng.
- Hệ quả: UI kéo thả áp dụng đồng đều cho mọi danh mục thường (không phân biệt `locked`), trừ "Chi tiêu khác" (xem `DEC-076`).
- Bằng chứng: `docs/kb/ba/raw/US-017-sap-xep-danh-muc-keo-tha.md` mục 4 (Q2), `components/BudgetApp.tsx:1013-1017`

### DEC-076 — US-017: "Chi tiêu khác" (`isFallback`) tiếp tục cố định ở cuối bảng, không tham gia kéo thả

- Ngày: 2026-08-12
- Status: Active
- Feature liên quan: US-017
- Bối cảnh: `DEC-066` (US-014) đã chốt danh mục `isFallback` luôn bị đẩy xuống cuối ở cả 3 nơi dùng chung danh sách danh mục, bất kể thứ tự các danh mục khác. Tính năng kéo thả mới cần xác nhận có giữ nguyên luật này không.
- Quyết định: "Chi tiêu khác" tiếp tục luôn cố định ở vị trí cuối bảng, không xuất hiện trong danh sách có thể kéo thả — các danh mục khác kéo thả tự do ở phía trên nó.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-12).
- Phương án đã loại: "Cho phép kéo luôn cả 'Chi tiêu khác'" — không chọn, vì sẽ đảo ngược `DEC-066` đã chốt, ảnh hưởng ngược lại cả 2 nơi dùng chung danh sách (dropdown nhận diện, biểu đồ cơ cấu chi tiêu).
- Hệ quả: `DEC-066` giữ nguyên hiệu lực, không bị supersede. Spec `US-017` cần mô tả rõ "Chi tiêu khác" không nằm trong vùng kéo thả được của bảng.
- Bằng chứng: `docs/kb/ba/raw/US-017-sap-xep-danh-muc-keo-tha.md` mục 4 (Q3), `docs/memory/decisions.md#dec-066`

### DEC-077 — US-017: Thứ tự kéo thả trên bảng danh mục đồng bộ sang cả dropdown "Danh mục nhận diện" và biểu đồ "Cơ cấu chi tiêu"

- Ngày: 2026-08-12
- Status: Active
- Feature liên quan: US-017
- Bối cảnh: `visibleCategories` là nguồn dữ liệu dùng chung cho 3 nơi: bảng ngân sách, dropdown "Danh mục nhận diện" ở khu nhập nhanh, và biểu đồ "Cơ cấu chi tiêu". Kéo thả trên bảng cần xác nhận có lan sang 2 nơi kia không.
- Quyết định: Thứ tự sau khi kéo thả trên bảng ngân sách đồng bộ sang cả 3 nơi, vì cả 3 cùng dùng chung một danh sách nguồn — nhất quán với cách `DEC-066`/US-014 đã xử lý cho "Chi tiêu khác".
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-12).
- Phương án đã loại: "Chỉ áp dụng cho bảng ngân sách, giữ nguyên thứ tự ở dropdown/biểu đồ" — không chọn, vì sẽ tách riêng nguồn dữ liệu cho bảng, phức tạp hơn và có thể gây thứ tự khác nhau giữa các nơi hiển thị cùng danh mục.
- Hệ quả: Sắp xếp lại ngay tại nguồn danh sách danh mục dùng chung ở client (hoặc theo cột thứ tự mới từ server, xem `DEC-074`), để cả 3 nơi tự động nhất quán, không cần đồng bộ thủ công riêng từng nơi.
- Bằng chứng: `docs/kb/ba/raw/US-017-sap-xep-danh-muc-keo-tha.md` mục 4 (Q4), `components/BudgetApp.tsx:342-345,808-811,1088`, `docs/memory/decisions.md#dec-066`

### DEC-078 — US-017: Clone tháng giữ nguyên thứ tự danh mục theo tháng nguồn

- Ngày: 2026-08-12
- Status: Active
- Feature liên quan: US-017
- Bối cảnh: `BR-020` mục 4 để ngỏ một điểm (nhãn `Cần user xác nhận`, do `ssr-raw` chỉ đưa ra giả định hợp lý chứ chưa hỏi trực tiếp): khi Dylan tạo tháng mới bằng nút "Clone tháng đang xem" (sao chép danh mục từ tháng nguồn, `US-006`), thứ tự danh mục ở tháng mới có giữ theo đúng thứ tự (đã kéo thả) của tháng nguồn hay không.
- Quyết định: Giữ nguyên thứ tự danh mục theo đúng tháng nguồn khi Clone — nhất quán với cách các thuộc tính khác của danh mục (tên, loại, ngân sách, khóa) đã được sao chép nguyên vẹn ở nghiệp vụ Clone hiện có.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-12).
- Phương án đã loại: "Không giữ — xếp lại theo thứ tự mặc định ở tháng mới" — không chọn, vì bắt Dylan phải kéo thả sắp xếp lại từ đầu mỗi khi tạo tháng mới, và cần thêm một quy tắc thứ tự mặc định riêng không có cơ sở nghiệp vụ nào yêu cầu.
- Hệ quả: Spec `US-017` mục 8.4 mô tả nút "Clone tháng đang xong" (`EL-04` của `US-006`) có thêm ràng buộc thứ tự; `docs/features/US-006-canh-bao-trung-thang/spec.md` cần được cập nhật bổ sung dòng ràng buộc này ở lượt sửa tiếp theo (follow-up, không sửa ngay theo ranh giới `ssr-ba` — không được sửa spec của feature khác).
- Bằng chứng: `docs/kb/ba/wiki/knowledge/business-rule/BR-020-thu-tu-danh-muc-keo-tha.md` mục 4, `server/budget/application/use-cases/create-month.ts:49-57`

### DEC-079 — Làm US-017 trước US-007/US-009/US-011 dù 3 khoảng trống đó cùng tier ưu tiên và đã có sẵn thiết kế nghiệp vụ (DEC)

- Ngày: 2026-08-12
- Status: Active
- Feature liên quan: US-017, US-007, US-009, US-011
- Bối cảnh: `po-expert` khi rà spec US-017 (`ssr-ba`) phát hiện US-017 không nằm trong danh sách "Khoảng Trống Và Ưu Tiên" (mục 7) của Business Flow — là một ask hoàn toàn mới, không xuất phát từ gap đã chốt hay từ PO review. Trong khi đó mục 7 còn 3 khoảng trống cùng mức ưu tiên "Trung bình", có sẵn thiết kế nghiệp vụ qua các `DEC` đã chốt, vẫn chưa có spec: US-007 (phân tích xu hướng lịch sử, effort "Quick win"), US-009 (cấu hình ngưỡng ngân sách, `DEC-006`), US-011 (mini dashboard nhiều tháng, `DEC-032`..`DEC-036`, phụ thuộc M1 nay đã xong). Verdict `po-expert`: `Needs Adjustment`, đưa câu hỏi thứ tự cho user quyết.
- Quyết định: Tiếp tục xử lý US-017 ngay trong phiên này — đúng yêu cầu trực tiếp user vừa đưa ra. US-007, US-009, US-011 giữ nguyên trong backlog (`Raw`/`Missing`, chưa có spec), làm sau.
- Người chốt: User, qua `AskUserQuestion` khi `ssr-ba` đưa quyết định của `po-expert` ra hỏi (2026-08-12).
- Phương án đã loại: "Dừng US-017, chuyển sang US-007 trước" — effort thấp hơn (Quick win) và đúng thứ tự ưu tiên gợi ý nhưng không được chọn.
- Hệ quả: Không đổi phạm vi/nội dung spec US-017 — `po-expert` gọi lại chỉ để xác nhận `Aligned` sau khi câu hỏi thứ tự đã được user trả lời trực tiếp, không cần sửa spec. US-007, US-009, US-011 vẫn là nợ backlog đã biết, nên nhắc lại khi lập kế hoạch các đợt tiếp theo.
- Bằng chứng: `docs/kb/ba/business-flow.md` mục 6-7, `docs/requirements-index.md` (US-007, US-008, US-009, US-011 Missing)

### DEC-080 — US-018: Bảng theo dõi CV ứng tuyển lưu bền vững vào database, theo mô hình US-001

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: `ssr-raw` hỏi Dylan danh sách job đang quan tâm (Công ty, Ngày hết hạn, Platform, Link, Trạng thái, Ghi chú) nên lưu bền vững qua database hay chỉ lưu tạm trong trình duyệt (localStorage) — trang Roadmap hiện tại (`components/DylanPlanApp.tsx:27-58`) toàn bộ là dữ liệu tĩnh, chưa có tiền lệ lưu trữ nào trên trang này.
- Quyết định: Lưu bền vững vào database (Prisma + SQLite), theo đúng mô hình đã dùng ở US-001 (Lưu trữ chi tiêu bền vững).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-13).
- Phương án đã loại: "Chỉ lưu tạm trong trình duyệt (localStorage)" — triển khai nhanh hơn, không cần backend, nhưng không được chọn vì mất dữ liệu khi đổi máy/xóa cache, không đồng bộ đa thiết bị.
- Hệ quả: Cần thêm model Prisma mới (job ứng tuyển + option Platform) và migration — thay đổi schema phải đi qua `ssr-data` trước khi `ssr-dev` triển khai, tương tự luồng US-001.
- Bằng chứng: `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 4 (Q1), `docs/kb/ba/raw/US-001-luu-tru-chi-tieu-ben-vung.md`

### DEC-081 — US-018: Bảng theo dõi CV ứng tuyển đặt ngay dưới "Lộ trình thực hiện" trên trang Roadmap

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: Trang Roadmap hiện có section "Ưu tiên hiện tại", section "Lộ trình thực hiện" (timeline `roadmapPhases`), hai `TargetGrid`, `TimetableSection`, `EnglishInterviewSections` (`components/DylanPlanApp.tsx:299-377`). Cần xác định vị trí chèn section bảng job mới.
- Quyết định: Thêm section mới ngay dưới "Lộ trình thực hiện" (timeline hiện có), trước hai `TargetGrid`.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-13).
- Phương án đã loại: "Đầu trang Roadmap, trước 'Ưu tiên hiện tại'" và "Cuối trang Roadmap, sau lịch English/Interview" — không chọn.
- Hệ quả: `ssr-plan` xác định vị trí chèn JSX cụ thể trong `RoadmapSections()` là ngay sau section `id="roadmap"` (dòng 327-359) và trước cặp `TargetGrid` (dòng 361-372).
- Bằng chứng: `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 4 (Q2), `components/DylanPlanApp.tsx:299-377`

### DEC-082 — US-018: Chặn xoá option Platform đang được job sử dụng

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: Platform là combobox cho phép Dylan thêm/xoá option linh động (khác US-016 — combobox cố định 3 giá trị không cho thêm/xoá). Cần xác định hành vi khi xoá một option đang được ít nhất một job dùng.
- Quyết định: Chặn xoá, báo cho Dylan biết đang có job dùng option đó.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-13).
- Phương án đã loại: "Cho xoá option, job cũ vẫn giữ nguyên giá trị text cũ" — không chọn, vì gây lệch giữa danh sách option hiện có và giá trị đã lưu trên job cũ.
- Hệ quả: `ssr-ba` cần viết tiêu chí chấp nhận cho thông báo chặn xoá; `ssr-plan`/`ssr-data` cần đảm bảo ràng buộc này ở tầng ứng dụng (đếm job đang tham chiếu option trước khi cho xoá).
- Bằng chứng: `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 4 (Q3), `docs/kb/ba/raw/US-016-loai-chi-tieu-combobox.md`

### DEC-083 — US-018: Bảng theo dõi CV ứng tuyển cho Dylan tự sắp xếp theo cột bất kỳ (click-to-sort)

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: Cần xác định thứ tự sắp xếp mặc định của bảng job — theo Ngày hết hạn gần nhất, theo mới thêm gần đây nhất, hay cho Dylan tự chọn cột sắp xếp.
- Quyết định: Cho Dylan tự sắp xếp bảng theo cột bất kỳ (click-to-sort trên từng cột), không cố định một tiêu chí mặc định duy nhất.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-13).
- Phương án đã loại: "Ngày hết hạn gần nhất trước" và "Job vừa thêm mới nhất lên đầu" — không chọn làm mặc định cố định.
- Hệ quả: `ssr-ba` cần viết tiêu chí chấp nhận cho hành vi click-to-sort (thứ tự tăng/giảm khi click lại cùng cột, trạng thái sắp xếp mặc định khi bảng chưa có tương tác) — tăng phạm vi kỹ thuật so với sắp xếp tĩnh một chiều.
- Bằng chứng: `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 4 (Q4)

### DEC-084 — US-018: Trạng thái mặc định khi thêm job mới là "Interested"

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: Raw `US-018` để ngỏ giả định hợp lý (chưa hỏi trực tiếp): khi Dylan thêm một job mới, Trạng thái mặc định là gì trong 7 giá trị (Interested/Waiting/No Response/Response/Appointment/Cancel/Fail). `ssr-ba` gom câu hỏi này vào dialog trước khi viết spec.
- Quyết định: Trạng thái mặc định là "Interested" — trạng thái đầu tiên trong danh sách, phản ánh bước quan tâm ban đầu trước khi nộp CV.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-13).
- Phương án đã loại: "Để trống, bắt Dylan chọn tay mỗi lần thêm" — không chọn, vì thêm một bước thao tác không cần thiết mỗi lần thêm job.
- Hệ quả: Spec `US-018` mục 6 (luồng thêm job) và mục 8 (`EL` của ô Trạng thái) ghi rõ giá trị mặc định "Interested".
- Bằng chứng: `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 4 (Q6)

### DEC-085 — US-018: Ô nhập Ngày hết hạn dùng lịch chọn ngày (date picker)

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: Raw yêu cầu định dạng hiển thị `DD/MM/YYYY` cho Ngày hết hạn nhưng không nói rõ loại control nhập liệu — cần `ssr-ba` làm rõ trước khi viết Screen Element.
- Quyết định: Dùng lịch chọn ngày (date picker), tránh gõ sai định dạng.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-13).
- Phương án đã loại: "Ô nhập chữ theo khuôn DD/MM/YYYY" — không chọn, vì dễ gõ sai định dạng nếu không có validate chặt.
- Hệ quả: Spec `US-018` mục 8 mô tả element Ngày hết hạn là `Date picker`, hiển thị giá trị đã chọn theo định dạng `DD/MM/YYYY`.
- Bằng chứng: `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 5 (ghi chú BA)

### DEC-086 — US-018: Chặn lưu nếu Link tuyển dụng không phải đường dẫn hợp lệ

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: Raw chưa nói rõ có validate "Link" là URL hợp lệ trước khi lưu hay không — cần `ssr-ba` làm rõ.
- Quyết định: Có — chặn lưu nếu Link không bắt đầu bằng `http://` hoặc `https://`.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-13).
- Phương án đã loại: "Không, cho nhập tự do bất kỳ nội dung gì" — không chọn, vì chấp nhận rủi ro lưu nhầm text không phải link.
- Hệ quả: Spec `US-018` mục 7 có AC riêng cho trường hợp Link không hợp lệ; mục 8 ghi rõ ràng buộc và thông báo lỗi của ô Link.
- Bằng chứng: `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 5 (ghi chú BA)

### DEC-087 — US-018: Cho chọn tự do bất kỳ Trạng thái nào tại mọi thời điểm, không bắt buộc tuần tự

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: Raw liệt kê 7 trạng thái theo một thứ tự cố định nhưng không nói rõ đây có phải luồng chuyển trạng thái bắt buộc tuần tự hay không — cần `ssr-ba` làm rõ trước khi viết luồng nghiệp vụ.
- Quyết định: Dylan được chọn tự do bất kỳ trạng thái nào trong 7 giá trị tại mọi thời điểm, không bị ràng buộc phải đi đúng tuần tự.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-13).
- Phương án đã loại: "Bắt buộc đi tuần tự đúng thứ tự liệt kê" — không chọn, vì cứng nhắc và không khớp thực tế (Cancel/Fail có thể xảy ra bất cứ lúc nào, không theo tuần tự).
- Hệ quả: Spec `US-018` mục 6 và mục 8 (ô Trạng thái) mô tả combobox cho chọn tự do, không có ràng buộc thứ tự chuyển trạng thái.
- Bằng chứng: `docs/kb/ba/raw/US-018-theo-doi-cv-ung-tuyen.md` mục 5 (ghi chú BA)

### DEC-088 — US-018: Xác nhận là tiện ích cá nhân tách biệt, không thuộc Business Flow "Hệ Thống Quản Lý Chi Tiêu"

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: `po-expert` khi đối chiếu spec `US-018` với `docs/kb/ba/business-flow.md` trả verdict `Blocked` — Business Flow hiện tại chỉ chốt định hướng cho "Hệ Thống Quản Lý Chi Tiêu" (mục 1: M1, M2), và chính mục 1 (M2) liệt kê Roadmap là khu vực **tách biệt** khỏi trang Quản lý chi tiêu. US-018 nằm trên trang Roadmap, thêm hẳn 2 model dữ liệu mới, nhưng chưa từng có phiên `ssr-po` nào chốt mở rộng định hướng sản phẩm sang khu vực này — yêu cầu gốc chỉ là tin nhắn chat trực tiếp của Dylan.
- Quyết định: US-018 là một tiện ích cá nhân tách biệt trên trang Roadmap, không cần thuộc Business Flow "Hệ Thống Quản Lý Chi Tiêu" và không cần một phiên `ssr-po mode=business-flow` riêng để mở rộng phạm vi trước khi tiếp tục. Spec tiếp tục tiến tới `Ready for DEV` như một function độc lập, ngoài phạm vi Business Flow hiện có.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-13), sau khi `po-expert` nêu vấn đề định hướng.
- Phương án đã loại: "Mở rộng Business Flow trước" (tạm dừng US-018 ở `Draft`, chạy `ssr-po mode=business-flow` để chốt thêm mục tiêu mới cho khu vực Roadmap và xếp ưu tiên so với các khoảng trống còn lại của hệ Quản lý chi tiêu) — không chọn.
- Hệ quả: `po-expert` được gọi lại để xác nhận verdict cuối cùng dựa trên quyết định tường minh này; Business Flow (`docs/kb/ba/business-flow.md`) không cần cập nhật gì cho US-018 — mục 9 của Business Flow có thể ghi chú tham chiếu quyết định này nếu cần tra cứu sau.
- Bằng chứng: `docs/kb/ba/business-flow.md` mục 1 (M2), `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` mục 2, 10

### DEC-089 — US-018: Sửa các trường của job (ngoài Trạng thái) theo cách sửa ngay tại dòng (inline)

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: `ba-expert` khi rà spec `US-018` phát hiện mục 3 (Phạm vi) cam kết sửa được cả 6 trường (Công ty, Ngày hết hạn, Platform, Link, Trạng thái, Ghi chú), nhưng mục 6 và mục 7 chỉ mô tả/kiểm chứng việc sửa riêng Trạng thái — chưa có bước luồng hay AC nào cho việc sửa lại 5 trường còn lại của một job đã tạo. Cách sửa hoạt động thế nào (sửa ngay tại dòng, hay mở lại form) là quyết định UX chưa có `DEC` nào chốt.
- Quyết định: Sửa ngay tại dòng (inline) — Dylan bấm vào ô nào của job đã tạo thì sửa trực tiếp ô đó, cùng cách thao tác đã áp dụng cho việc đổi Trạng thái.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-13).
- Phương án đã loại: "Mở lại form giống lúc thêm job, sửa xong bấm Lưu" — không chọn, vì thêm một bước thao tác (mở/đóng form) không cần thiết mỗi lần sửa.
- Hệ quả: Spec `US-018` mục 6 bổ sung bước sửa inline cho 5 trường còn lại; mục 7 bổ sung AC kiểm chứng; mục 8 (EL-02, EL-03, EL-04, EL-05, EL-07) ghi rõ ràng buộc "sửa ngay tại dòng, không cần mở form riêng".
- Bằng chứng: `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` mục 3, 6, 14 (A7 trước khi chốt)

### DEC-090 — US-018: Mô hình hóa `JobApplication.status` bằng `String` + validate tầng ứng dụng, `platformId` có `onDelete: Restrict` làm lớp bảo vệ dự phòng cho `BR-021`

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: `ssr-data` soạn delta schema cho `JobApplication`/`JobPlatform` (`data-model.md`). SQLite không có kiểu `enum` gốc, và cần một cơ chế chặn xóa `JobPlatform` đang được `JobApplication` tham chiếu (`BR-021`).
- Quyết định: (1) `status` dùng `String` với `@default("Interested")`, ràng buộc đúng 7 giá trị hợp lệ ở tầng ứng dụng — đúng mẫu đã dùng cho `Category.type` (`BR-019`), không phải quyết định mới, chỉ áp dụng lại tiền lệ. (2) Quan hệ `JobApplication.platform` khai báo `onDelete: Restrict` (đúng mẫu `Transaction.category`) làm lớp bảo vệ dự phòng ở DB, nhưng đường xử lý chính cho `BR-021` là domain service `job-platform-guard-service.ts` kiểm tra trước bằng `countByPlatform()` để trả lỗi nghiệp vụ thân thiện thay vì để Prisma ném lỗi FK thô.
- Người chốt: `ssr-data`, quyết định kỹ thuật thuần túy dựa trên tiền lệ đã có trong dự án (`DEC-073`/`BR-019` cho mẫu 1, `Transaction.category` cho mẫu 2) — không cần hỏi user.
- Phương án đã loại: Không đặt `onDelete: Restrict` (chỉ dựa hoàn toàn vào guard-service ở tầng ứng dụng) — không chọn, vì mất lớp bảo vệ dự phòng nếu một đường gọi tương lai vô tình bỏ qua guard-service.
- Hệ quả: `prisma/schema.prisma` đã thêm 2 model theo đúng thiết kế này; `server/job-tracker/domain/services/job-platform-guard-service.ts` (do `ssr-dev` triển khai) phải luôn được gọi trước mọi lệnh xóa `JobPlatform`.
- Bằng chứng: `docs/features/US-018-theo-doi-cv-ung-tuyen/data-model.md` mục 2, 4; `docs/memory/decisions.md#dec-073`; `prisma/schema.prisma` (model `Transaction.category`, `Category.type`)

### DEC-091 — US-018: `ensureDefaultJobPlatforms` phải chèn 3 option mặc định bằng một Prisma transaction atomic (đếm + chèn cùng lúc), không phải `count()` rồi `create()` rời rạc

- Ngày: 2026-08-13
- Status: Active
- Feature liên quan: US-018
- Bối cảnh: `ssr-dev` (thực thi qua Codex CLI, theo `TB-05`) viết `ensureDefaultJobPlatforms()` theo đúng thiết kế ban đầu ở `plan.md`/`data-model.md`: gọi `count()`, nếu bằng 0 thì lặp `create()` 3 lần. Khi kiểm chứng thật bằng nhiều lượt tải trang gần như đồng thời (dev server compile lần đầu chậm khiến trình duyệt gửi lại nhiều `HEAD`/`GET` chồng lấp), phát hiện **thật** 7 lượt gọi đồng thời đều đọc `count() === 0` trước khi lượt nào kịp ghi xong, tạo ra 21 dòng (7× "ITViec", 7× "LinkedIn", 7× "VietNamWork") thay vì 3 — đúng y hệt rủi ro đã nêu giả định ở `JDG-023` nhưng lúc đó chưa kiểm chứng được.
- Quyết định: Thêm phương thức `createDefaultsIfEmpty(names)` vào `JobPlatformRepository`, implement bằng `prisma.$transaction(async (tx) => { đếm + createMany trong cùng transaction })`. SQLite (qua adapter `better-sqlite3`) chỉ cho một transaction ghi chạy tại một thời điểm, nên transaction thứ hai chỉ thấy `count() > 0` sau khi transaction đầu đã commit — loại bỏ race. `default-job-platforms-service.ts` gọi thẳng phương thức này thay vì tự lặp `create()`.
- Người chốt: `ssr-dev`, phát hiện và sửa ngay trong lúc kiểm chứng (không cần hỏi user — đây là lỗi kỹ thuật thuần túy, không đổi hành vi nghiệp vụ nào đã chốt).
- Phương án đã loại: Thêm ràng buộc unique cho `JobPlatform.name` ở tầng DB — không chọn, vì spec đã xác nhận tường minh "Dữ liệu trùng: Không áp dụng — không có ràng buộc chặn trùng tên Platform" (mục 6 spec); ràng buộc unique sẽ mâu thuẫn với quyết định nghiệp vụ đó (Dylan có thể cố ý đặt 2 Platform trùng tên nếu muốn).
- Hệ quả: Đã xóa 21 dòng dữ liệu rác tạo ra trong lúc test (script `node` qua `better-sqlite3`, không có `JobApplication` nào tham chiếu tới nên an toàn); test lại bằng 8 request đồng thời sau khi sửa — chỉ còn đúng 3 dòng, ổn định qua nhiều lượt thử.
- Bằng chứng: `server/job-tracker/infrastructure/repositories/job-platform-prisma-repository.ts` (`createDefaultsIfEmpty`), `server/job-tracker/domain/repositories/job-platform-repository.ts`, `server/job-tracker/domain/services/default-job-platforms-service.ts`; `docs/memory/judgement-log.md#jdg-025`

### DEC-092 — US-019: Giá của item cần mua chỉ là ghi chú tham khảo, không cộng vào Ngân sách/Chi thực tế

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: Raw yêu cầu danh sách "items cần mua" có trường giá không bắt buộc, nhưng không nói rõ giá này có ảnh hưởng tới số liệu ngân sách của tháng hay không — cần chốt trước khi `ssr-ba` viết spec, vì ảnh hưởng tới thiết kế data model (có liên kết `Transaction` hay không).
- Quyết định: Giá của một item cần mua chỉ hiển thị như ghi chú tham khảo trên danh sách, không cộng vào Ngân sách, Chi thực tế hay Số dư còn lại của tháng đó. Muốn tính vào chi tiêu thật thì Dylan vẫn phải ghi một giao dịch thu chi riêng như cách làm hiện nay.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-14).
- Phương án đã loại: "Tự tạo giao dịch khi đánh dấu Đã mua, cộng vào Chi thực tế của một danh mục" — không chọn, vì phức tạp hơn (cần thêm bước chọn danh mục cho từng item) và không phải nhu cầu chính của Dylan (chỉ muốn ghi chú cần mua gì, không phải thay thế luồng ghi nhận chi tiêu).
- Hệ quả: Model dữ liệu mới cho "Item cần mua" không cần liên kết `Category`/`Transaction`; chỉ lưu tên, giá (tùy chọn), trạng thái, gắn theo `monthId`.
- Bằng chứng: `docs/kb/ba/raw/US-019-danh-sach-can-mua.md` mục 4 (Q1)

### DEC-093 — US-019: Hai trạng thái item cần mua là "Pending" (cam/vàng) và "Purchased" (xanh lá)

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: Raw yêu cầu 2 trạng thái chưa mua/đã mua bằng tiếng Anh, phân biệt rõ bằng màu sắc, nhưng không nêu tên cụ thể — cần chốt trước khi viết Screen Element.
- Quyết định: Item mới mặc định trạng thái "Pending" (hiển thị màu cam/vàng); khi Dylan đánh dấu đã mua thì chuyển "Purchased" (hiển thị màu xanh lá).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-14).
- Phương án đã loại: "Not Bought" (đỏ nhạt) / "Bought" (xanh lá) — không chọn, vì màu đỏ cho trạng thái chưa mua dễ gây cảm giác lỗi/nguy hiểm thay vì đang chờ xử lý.
- Hệ quả: Spec `US-019` dùng đúng 2 nhãn "Pending"/"Purchased" và 2 màu cam-vàng/xanh lá khi mô tả Screen Element và tiêu chí chấp nhận.
- Bằng chứng: `docs/kb/ba/raw/US-019-danh-sach-can-mua.md` mục 4 (Q2)

### DEC-094 — US-019: "Tháng cũ" (chỉ xem) là mọi tháng khác tháng đang được chọn xem trên UI

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: Raw yêu cầu khi quay về "tháng cũ" thì chỉ xem, không thêm/sửa item — nhưng không nói rõ "tháng cũ" xác định theo ngày hệ thống thực tế hay theo tháng đang được chọn xem trên UI. Vì dự án đã có tiền lệ tương tự cho giao dịch chi tiêu (`DEC-010`: chỉ sửa/xóa được giao dịch của tháng đang chọn, tháng khác chỉ xem), suy luận này được dùng làm giả định ban đầu khi ghi raw, chưa hỏi lại user trực tiếp cho riêng tính năng này.
- Quyết định (giả định, áp theo tiền lệ DEC-010): "Tháng cũ" là bất kỳ tháng nào khác tháng đang được Dylan chọn xem hiện tại trên UI (`selectedMonthId`), không xác định theo ngày hệ thống thực tế.
- Người chốt: Suy từ tiền lệ `DEC-010` khi ghi raw (`ssr-raw`, 2026-08-14) — chưa hỏi lại user trực tiếp; `ssr-ba` cần xác nhận lại qua dialog nếu phát sinh tình huống biên chưa rõ (vd tháng tương lai còn trống trong danh sách chọn tháng).
- Phương án đã loại: Không có — đây là giả định suy luận, chưa có phương án khác được đối chiếu với user.
- Hệ quả: Nếu về sau user xác nhận khác đi, quyết định này cần được thay thế bằng một `DEC` mới, đổi `Status` sang `Superseded`.
- Bằng chứng: `docs/kb/ba/raw/US-019-danh-sach-can-mua.md` mục 4 (Q3), `docs/memory/decisions.md#dec-010`

### DEC-095 — US-019: Item "chưa mua" bị clone sang tháng mới thì ẩn khỏi tháng gốc, chỉ còn ở tháng mới

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: Raw nêu "các sản phẩm clone tại 1 thời điểm chỉ hiển thị tại 1 tháng, không được trùng nhau" nhưng chưa xác nhận nghĩa cụ thể là ẩn khỏi tháng gốc hay vẫn giữ ở cả hai tháng.
- Quyết định: Sau khi một item "chưa mua" được sao chép sang tháng mới, item đó ẩn khỏi tháng gốc — chỉ còn hiển thị ở tháng mới nhất. Tại một thời điểm, một item chưa mua chỉ xuất hiện đúng ở 1 tháng.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-14).
- Phương án đã loại: "Vẫn hiển thị ở cả hai tháng, chỉ đánh dấu đã chuyển tiếp" — không chọn, vì dễ gây hiểu nhầm là hai item độc lập, không khớp đúng nghĩa "không được trùng nhau" Dylan đã nêu.
- Hệ quả: Cơ chế clone (khi tạo tháng mới) phải chuyển hẳn item sang tháng mới (đổi `monthId` hoặc tương đương), không phải tạo bản sao còn giữ bản gốc.
- Bằng chứng: `docs/kb/ba/raw/US-019-danh-sach-can-mua.md` mục 4 (Q4)

### DEC-096 — US-019: Cho xóa item ở tháng đang hoạt động; chặn hoàn toàn ở tháng cũ

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: Raw nêu tháng cũ "không được thêm mới hoặc chỉnh sửa thông tin gì" nhưng không nói rõ hành động xóa item có được phép ở tháng đang hoạt động hay không, và có bị chặn ở tháng cũ cùng các hành động khác hay không.
- Quyết định: Cho phép xóa item ở tháng đang hoạt động (tháng đang được chọn xem). Chặn hoàn toàn việc xóa (cũng như thêm/sửa) ở tháng cũ — khớp nguyên tắc đã áp dụng cho giao dịch chi tiêu (`DEC-010`).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-14).
- Phương án đã loại: "Không cho xóa item nào, chỉ cho đổi trạng thái" — không chọn, vì không giải quyết được trường hợp Dylan thêm nhầm hoặc không còn cần item đó nữa.
- Hệ quả: Spec `US-019` cần tiêu chí chấp nhận riêng cho hành động xóa item ở tháng đang hoạt động, và một AC xác nhận nút xóa bị ẩn/vô hiệu ở tháng cũ.
- Bằng chứng: `docs/kb/ba/raw/US-019-danh-sach-can-mua.md` mục 4 (Q5)

### DEC-097 — US-019: Clone item chưa mua sang tháng mới chỉ kích hoạt khi Dylan chủ động tạo tháng mới, không tự động theo ngày thực tế

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: Raw mô tả "khi qua tháng mới sẽ mặc định clone..." có thể hiểu là tự động theo lịch thực tế (cần tiến trình chạy nền) hoặc chỉ khi Dylan chủ động thao tác tạo tháng mới trên UI (giống cơ chế "Clone tháng đang xem" đã có cho danh mục ngân sách, US-006) — ảnh hưởng lớn tới kiến trúc nên cần chốt sớm.
- Quyết định: Việc "clone sản phẩm chưa mua sang tháng mới" chỉ xảy ra khi Dylan chủ động tạo tháng mới (bấm nút tương đương "Tạo tháng"/"Clone tháng đang xem"). Không có tiến trình chạy nền hay cơ chế tự động theo ngày hệ thống thực tế để tự sinh tháng mới và clone item.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-14).
- Phương án đã loại: "Tự động theo ngày thực tế khi sang tháng dương lịch mới" — không chọn, vì phức tạp hơn nhiều (cần kiểm tra ngày mỗi lần mở app hoặc chạy nền), không khớp cách các tháng ngân sách đang được tạo thủ công hiện nay.
- Hệ quả: `ssr-plan` khảo sát điểm nối cụ thể vào luồng tạo tháng hiện có (`createNewMonth`/`createMonthAction` trong `BudgetApp.tsx`/`server/budget/actions.ts`) thay vì thiết kế cơ chế chạy nền mới.
- Bằng chứng: `docs/kb/ba/raw/US-019-danh-sach-can-mua.md` mục 4 (Q6)

### DEC-098 — US-019: Cả hai nút "Tạo tháng" và "Clone tháng đang xem" đều mang item Pending sang tháng mới

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: Khu vực tạo tháng mới có 2 nút riêng biệt với nghiệp vụ khác nhau đã chốt ở `BR-015`/`US-006`: "Tạo tháng" luôn tạo tháng trống, không sao chép bất kỳ gì từ tháng đang xem; "Clone tháng đang xem" sao chép cấu trúc danh mục. Raw `US-019` mô tả việc mang item chưa mua sang tháng mới mang tính mặc định khi "qua tháng mới", không phân biệt rõ theo nút — cần chốt việc mang item Pending có áp dụng cho cả 2 nút hay chỉ nút "Clone tháng đang xem" trước khi viết spec, vì ảnh hưởng trực tiếp tới luồng nghiệp vụ và Screen Element của cả `US-019` lẫn khu vực nút đã có ở `US-006`.
- Quyết định: Cả hai nút — "Tạo tháng" (trống) và "Clone tháng đang xem" — đều mang các item còn Pending của tháng nguồn sang tháng mới, ẩn khỏi tháng gốc (theo `BR-023`/`DEC-095`). Đây là ngoại lệ riêng cho Item cần mua so với danh mục ngân sách: "Tạo tháng" vẫn không sao chép cấu trúc danh mục (giữ nguyên hành vi đã chốt ở `DEC-063`), nhưng có mang item Pending — hai loại dữ liệu (danh mục ngân sách và item cần mua) không còn xử lý giống hệt nhau khi bấm "Tạo tháng".
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-14).
- Phương án đã loại: "Chỉ khi bấm Clone tháng đang xem" — khớp đúng pattern nhất quán hiện có của danh mục ngân sách, nhưng không chọn vì user muốn khớp sát nghĩa đen của raw (mang item Pending mặc định mỗi khi có tháng mới, không phân biệt theo nút).
- Hệ quả: Spec `US-019` mục 6 (Luồng nghiệp vụ) và Screen Element (nút "Tạo tháng"/"Clone tháng đang xem") phải ghi rõ cả hai nút đều kích hoạt việc chuyển item Pending; `BR-023` cập nhật xóa nhãn `Cần user xác nhận`.
- Bằng chứng: `docs/kb/ba/wiki/knowledge/business-rule/BR-023-item-chuyen-thang-khi-tao-thang-moi.md` mục 4 (câu hỏi phát sinh khi `ssr-ingest` biên soạn wiki)

### DEC-105 — US-019: Mở rộng Business Flow, thêm mục tiêu mới M3, gắn US-019 vào luồng F3

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: `po-expert` trả verdict `Blocked` khi đối chiếu spec `US-019` với Business Flow — US-019 không nằm trong mục tiêu M1 (lưu trữ chi tiêu bền vững) hay M2 (tách route), cũng không có trong Bản Đồ Function (mục 6) hay Khoảng Trống (mục 7) của `docs/kb/ba/business-flow.md`. Tình huống giống hệt cấu trúc câu hỏi đã gặp ở `US-018` (`DEC-088`), nơi user chọn "tiện ích độc lập, không mở rộng Business Flow".
- Quyết định: Lần này user chọn hướng ngược lại — mở rộng Business Flow: (1) thêm mục tiêu sản phẩm mới `M3` ("Hỗ trợ Dylan lên kế hoạch mua sắm theo tháng ngay trong bảng thu chi, giảm nguy cơ quên hoặc mua trùng đồ cần mua"); (2) gắn `US-019` chính thức vào luồng `F3` (Quản lý theo chu kỳ tháng) trong Bản Đồ Function (mục 6), vì tính năng nằm ngay trong trang Thu chi (không tách trang riêng như `US-018`/Roadmap) và dùng chung cơ chế tạo tháng mới (`BR-015`).
- Người chốt: User, qua `AskUserQuestion` trong phiên `ssr-ba` (US-019) → chuyển tiếp `ssr-po mode=business-flow` để ghi chính thức, 2026-08-14.
- Phương án đã loại: "Tiện ích phụ trợ độc lập, không cần mở rộng Business Flow" — theo đúng tiền lệ `DEC-088` của `US-018` — không được chọn lần này vì user muốn US-019 được công nhận là một phần chính thức của hệ thống quản lý chi tiêu, không phải tiện ích ngoài lề.
- Hệ quả: `docs/kb/ba/business-flow.md` cập nhật mục 1 (thêm `M3`), mục 3 (mermaid thêm nhánh chuyển item + xem/thao tác theo tháng đang chọn), mục 4 (F3 thêm bước 4 + 2 điều kiện rẽ nhánh, mục tiêu phục vụ đổi thành `M2, M3`), mục 6 (thêm dòng US-019), mục 7 (thêm khoảng trống #15), mục 8 (dòng quyết định này), mục 9 (bằng chứng). `docs/kb/ba/backlog.md` thêm dòng #15 tương ứng. `po-expert` được gọi lại để xác nhận verdict cuối cùng dựa trên Business Flow đã cập nhật.
- Bằng chứng: `docs/kb/ba/business-flow.md` mục 1, 6, 7, 8, 9; hội thoại phiên `ssr-ba`/`ssr-po` 2026-08-14

### DEC-106 — US-019: Bổ sung khả năng sửa tên/giá của một item đã tạo, sửa tại chỗ (inline), chỉ ở tháng đang chọn

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: `ba-expert` khi rà spec `US-019` phát hiện mâu thuẫn nội bộ: mục 5 (Người Dùng Và Phân Quyền) của chính spec, cùng trang wiki `knowledge/business-rule/BR-024-item-chi-thao-tac-thang-dang-chon.md`, `knowledge/feature/US-019-danh-sach-can-mua.md` và `glossary.md` mục "Item cần mua" đều dùng chữ "sửa" khi mô tả quyền của Dylan ở tháng đang chọn, nhưng bản nháp spec (mục 3, 6, 7, 8) chỉ định nghĩa Thêm/Đánh dấu đã mua/Xóa — không có luồng, tiêu chí hay Screen Element nào cho việc đổi tên/giá một item đã tồn tại.
- Quyết định: Bổ sung khả năng sửa: Dylan bấm vào ô Tên sản phẩm hoặc ô Giá của một item đã có (chỉ ở tháng đang được chọn) để sửa trực tiếp tại dòng đó (inline) — cùng kiểu thao tác đã dùng cho việc sửa tên/loại/ngân sách danh mục ở bảng ngân sách (F2) và sửa job ứng tuyển (`DEC-089`, `US-018`). Sửa tên thành chuỗi rỗng thì không lưu, ô tự khôi phục tên cũ.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-14), sau khi `ba-expert` nêu mâu thuẫn nội bộ.
- Phương án đã loại: "Không cần — chỉ Thêm/Đánh dấu đã mua/Xóa, giữ phạm vi tối giản đúng raw ban đầu" — không được chọn; nếu chọn phương án này thì các trang wiki/glossary đang dùng chữ "sửa" sẽ phải sửa lại cho khớp phạm vi hẹp hơn.
- Hệ quả: Spec `US-019` mục 3 (Phạm Vi), mục 6 (Luồng, thêm bước 4 và ngoại lệ "sửa thành rỗng"), mục 7 (AC-09, AC-10), mục 8 (`EL-02`, `EL-03` ghi rõ hành vi inline) đều đã cập nhật. Tổng số AC tăng từ 8 lên 10 (cảnh báo `Small` của `spec-quality.mjs`, không chặn — cùng mức với `US-018` từng có 11 AC).
- Bằng chứng: `docs/features/US-019-danh-sach-can-mua/spec.md` mục 14 (A7 trước khi chốt), `docs/memory/decisions.md#dec-089`

### DEC-107 — US-019: "Tháng được phép thêm/sửa/xóa Items cần mua" là tháng hiện tại theo đồng hồ hệ thống, độc lập với dropdown "Chọn tháng xem"

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: `ssr-plan` khi khảo sát kỹ thuật phát hiện mâu thuẫn nội bộ thật trong spec: AC-05 mô tả khi Dylan đổi dropdown "Chọn tháng xem" sang một tháng cũ, danh sách Items cần mua của tháng đó phải chuyển thành chỉ xem. Nhưng "tháng đang được chọn" trong toàn bộ ứng dụng vốn được định nghĩa chính là giá trị đang chọn ở dropdown "Chọn tháng xem" (`selectedMonthId`) — nếu Dylan vừa đổi dropdown sang tháng đó, nó lập tức trở thành "tháng đang được chọn", nên theo `BR-024` (bản trước khi sửa) lẽ ra phải vẫn sửa được, mâu thuẫn trực tiếp với AC-05.
- Quyết định: Tháng được phép thêm/sửa/xóa/đánh dấu đã mua Items cần mua là **tháng hiện tại theo đồng hồ hệ thống** (ví dụ hôm nay là 2026-08-14 thì luôn là tháng "2026-08"), hoàn toàn độc lập với việc Dylan đang xem tháng nào qua dropdown "Chọn tháng xem". Đây là khái niệm tách biệt khỏi "tháng đang được chọn xem" (dùng cho toàn bộ phần xem ngân sách/giao dịch còn lại của trang Thu chi) — chỉ áp dụng riêng cho Items cần mua. Cùng cách tính "tháng hiện tại theo đồng hồ hệ thống" đã dùng cho mini dashboard (`DEC-034`), không phải khái niệm mới trong dự án.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-plan` (2026-08-14).
- Phương án đã loại: "Tháng có kỳ lớn nhất đã tồn tại" — độc lập đồng hồ hệ thống nhưng phức tạp hơn để giải thích và không khớp nghĩa đen "tháng hiện tại" của raw gốc; "Bỏ chống phân biệt, luôn sửa được ở tháng đang xem" — đơn giản nhất nhưng đi ngược yêu cầu gốc "tháng cũ chỉ xem, không thêm/sửa".
- Hệ quả: Spec `US-019` (mục 3, 5, 6, 7, 8, 14), `BR-024`, trang `feature/US-019` và `business-flow.md` (mục 4, F3) cần đổi thuật ngữ nhất quán: dùng "tháng hiện tại" (theo đồng hồ hệ thống) khi nói tới phạm vi mutable, tách rõ khỏi "tháng đang được chọn xem" (dropdown). Khác với `DEC-010` (giao dịch chi tiêu — mutable theo dropdown `selectedMonthId`), Items cần mua áp dụng quy tắc khác: mutable theo đồng hồ hệ thống, không theo dropdown. Nếu tháng hiện tại theo đồng hồ hệ thống chưa được Dylan tạo (`MonthBudget` chưa tồn tại), Items cần mua chưa có nơi để thêm cho tới khi Dylan tạo tháng đó. Đồng thời, "tháng nguồn" của việc chuyển item Pending khi tạo tháng mới (`BR-023`, `DEC-098`) cũng phải đổi theo cùng khái niệm này — là **tháng hiện tại theo đồng hồ hệ thống** tại thời điểm bấm nút, không phải tháng đang chọn xem trên dropdown lúc đó (dropdown có thể đang hiển thị một tháng cũ khác hoàn toàn), để nhất quán với việc chỉ tháng hiện tại mới có thể có item Pending mutable/hợp lệ để chuyển đi.
- Bằng chứng: `docs/features/US-019-danh-sach-can-mua/spec.md` mục 7 (AC-05), hội thoại `ssr-plan` 2026-08-14, `docs/memory/decisions.md#dec-034`

### DEC-108 — US-019: Mô hình hóa `PurchaseItem.status` bằng `String` + `@default("Pending")`, validate 2 giá trị ở tầng ứng dụng

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-019
- Bối cảnh: `ssr-data` soạn delta schema cho model mới `PurchaseItem` (`data-model.md`). SQLite không có kiểu `enum` gốc.
- Quyết định: `status` dùng `String` với `@default("Pending")`, ràng buộc đúng 2 giá trị hợp lệ ("Pending"/"Purchased") ở tầng ứng dụng — đúng mẫu đã dùng cho `Category.type` (`BR-019`, `DEC-073`) và `JobApplication.status` (`DEC-090`), không phải quyết định mới, chỉ áp dụng lại tiền lệ đã có trong dự án.
- Người chốt: `ssr-data`, quyết định kỹ thuật thuần túy dựa trên tiền lệ đã có trong dự án — không cần hỏi user.
- Phương án đã loại: Không có — không có phương án nào khác hợp lý hơn khi SQLite thiếu enum gốc và dự án đã có tiền lệ rõ ràng.
- Hệ quả: `prisma/schema.prisma` đã thêm model `PurchaseItem` theo đúng thiết kế này (migration `20260819080706_add_purchase_item`); `server/budget/domain/rules/purchase-item-rule.ts` (do `ssr-dev` triển khai theo `plan.md`) phải validate đúng 2 giá trị trước khi ghi.
- Bằng chứng: `docs/features/US-019-danh-sach-can-mua/data-model.md` mục 2, 4; `docs/memory/decisions.md#dec-073`, `docs/memory/decisions.md#dec-090`; `prisma/schema.prisma` (model `PurchaseItem`)

### DEC-099 — US-020: Lịch sử trạng thái chỉ lưu mốc "ngày nộp hồ sơ" (Interested → Waiting), không lưu log đầy đủ mọi lần đổi trạng thái

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-020
- Bối cảnh: Raw mô tả "lưu lịch sử thay đổi trạng thái để xem thời gian" có thể hiểu theo nghĩa rộng (ghi lại mọi lần đổi trạng thái kèm thời gian, dạng log nhiều dòng) hoặc nghĩa hẹp đúng như ví dụ cụ thể duy nhất trong raw (chỉ một mốc "ngày nộp hồ sơ" khi Interested → Waiting) — ảnh hưởng trực tiếp tới việc có cần thêm bảng lịch sử riêng (1-N) hay chỉ một cột thời gian trên chính job.
- Quyết định: Chỉ lưu đúng một mốc thời gian — "ngày nộp hồ sơ", ghi nhận khi job chuyển từ Interested sang Waiting; không lưu log đầy đủ các lần đổi trạng thái khác.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-14).
- Phương án đã loại: "Lưu đầy đủ mọi lần đổi trạng thái dạng log nhiều dòng" — không chọn vì vượt quá phạm vi cụ thể mà raw yêu cầu, kéo theo thiết kế dữ liệu và màn hình phức tạp hơn nhiều (cần bảng lịch sử riêng, khu vực xem log).
- Hệ quả: `ssr-data` chỉ cần thêm một cột thời gian (vd `submittedAt`) trên bảng job hiện có, không cần bảng lịch sử mới; `ssr-ba` thiết kế tiêu chí chấp nhận và Screen Element xoay quanh một mốc thời gian hiển thị, không phải danh sách log.
- Bằng chứng: `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 4 (Q1)

### DEC-100 — US-020: Trạng thái tự động (Expired, No Response) tính lại mỗi khi dữ liệu bảng CV được tải/làm mới, không cần tiến trình chạy nền

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-020
- Bối cảnh: App hiện không có hạ tầng tiến trình chạy nền/lịch định kỳ (cùng nguyên tắc đã chốt ở `DEC-097` cho US-019); raw yêu cầu 2 quy tắc tự động theo thời gian thực (quá hạn → Expired, quá 7 ngày ở Waiting → No Response) nhưng không nói rõ cơ chế kích hoạt.
- Quyết định: Hệ thống kiểm tra và cập nhật trạng thái đủ điều kiện (quá hạn ở Interested, hoặc quá 7 ngày ở Waiting) ngay tại thời điểm dữ liệu bảng "Theo dõi CV ứng tuyển" được tải hoặc làm mới (vd mở trang Roadmap, bấm làm mới sau khi lưu job) — không có tiến trình chạy nền độc lập với việc tải dữ liệu.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-14).
- Phương án đã loại: "Cần tiến trình chạy nền định kỳ, không phụ thuộc việc mở trang" — không chọn vì đòi hỏi hạ tầng mới ngoài phạm vi kỹ thuật hiện có của app (Next.js không có cron sẵn), giống lý do đã loại ở `DEC-097`.
- Hệ quả: `ssr-plan` khảo sát điểm nối vào use-case `getJobTrackerSnapshot` (nơi duy nhất đọc lại toàn bộ danh sách job) để chèn logic kiểm tra/tự cập nhật trước khi trả dữ liệu, thay vì thiết kế job chạy nền mới.
- Bằng chứng: `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 4 (Q2); `docs/memory/decisions.md#dec-097`

### DEC-101 — US-020: "Expired" chỉ áp dụng khi job đang ở "Interested" và đã quá ngày hết hạn

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-020
- Bối cảnh: Raw chỉ nêu ví dụ cụ thể cho trạng thái nguồn "Interested"; chưa rõ có áp dụng luôn cho các trạng thái "chưa có phản hồi" khác (Waiting, No Response) khi quá hạn hay không — ảnh hưởng phạm vi luật tự động và tiêu chí chấp nhận.
- Quyết định: "Expired" chỉ tự động gán khi job đang ở đúng trạng thái "Interested" và đã qua ngày hết hạn. Các trạng thái khác (Waiting, No Response, Response, Appointment, Cancel, Fail) không tự chuyển "Expired" dù đã quá hạn.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-14).
- Phương án đã loại: "Áp dụng cho mọi trạng thái chưa có phản hồi (Interested, Waiting, No Response)" — không chọn vì mở rộng ngoài đúng ví dụ raw đã nêu, cần thêm giả định về "chưa có phản hồi" không có trong raw gốc.
- Hệ quả: Tiêu chí chấp nhận và luật nghiệp vụ ở `ssr-ba` chỉ kiểm tra điều kiện `status == "Interested" && deadline < hôm nay`; không mở rộng sang Waiting/No Response.
- Bằng chứng: `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 4 (Q3)

### DEC-102 — US-020: "Expired" là trạng thái thứ 8 trong danh sách chọn tay, Dylan vẫn tự đổi được như các trạng thái khác

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-020
- Bối cảnh: Chưa rõ "Expired" có nên là trạng thái ẩn/chỉ do hệ thống gán (không cho Dylan chọn tay trong dropdown), hay được thêm bình thường vào danh sách 7 trạng thái hiện có.
- Quyết định: "Expired" được thêm làm trạng thái thứ 8 trong danh sách trạng thái, xuất hiện trong dropdown chọn trạng thái như 7 trạng thái hiện có (Interested, Waiting, No Response, Response, Appointment, Cancel, Fail); Dylan vẫn tự chọn/đổi tay được bình thường.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-14).
- Phương án đã loại: "Chỉ hệ thống tự gán, ẩn khỏi dropdown" — không chọn vì thiếu nhất quán với cách các trạng thái khác hoạt động, và không cho Dylan cách thoát/xử lý thủ công khi cần.
- Hệ quả: `STATUS_OPTIONS`/`JOB_APPLICATION_STATUSES` (`server/job-tracker/domain/entities/job-application.ts`) mở rộng từ 7 lên 8 giá trị; UI màu trạng thái (`STATUS_CLASS` ở `components/JobTrackerBoard.tsx`) cần thêm màu cho "Expired".
- Bằng chứng: `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 4 (Q4)

### DEC-103 — US-020: Mốc "Ngày nộp hồ sơ" chỉ được ghi khi job chuyển đúng từ Interested sang Waiting, không ghi/ghi đè khi vào Waiting từ trạng thái khác

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-020
- Bối cảnh: Raw chỉ mô tả cụ thể luồng Interested → Waiting; chưa rõ khi Dylan tự tay chuyển một job từ trạng thái khác (vd No Response → Waiting) thì mốc "Ngày nộp hồ sơ" có được ghi/ghi đè mới hay không — ảnh hưởng trực tiếp tới việc `BR-026` (tự động No Response sau 7 ngày) có mốc để tính hay không cho các job vào Waiting theo đường khác.
- Quyết định: Chỉ đúng luồng Interested → Waiting mới ghi mốc "Ngày nộp hồ sơ". Job vào Waiting từ bất kỳ trạng thái nào khác Interested (No Response, Response, Appointment, Cancel, Fail) không được ghi hay ghi đè mốc mới — mốc cũ (nếu có từ lần Interested → Waiting trước đó) vẫn giữ nguyên, và nếu job chưa từng có mốc thì tiếp tục không có.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-14).
- Phương án đã loại: "Ghi mốc mới mỗi lần vào Waiting bất kể xuất phát từ đâu" — không chọn vì user muốn bám sát đúng nghĩa đen luồng cụ thể mà raw mô tả (chỉ Interested → Waiting), chấp nhận hệ quả `BR-026` có thể không có mốc mới hoặc dùng mốc cũ cho các job vào Waiting theo đường khác.
- Hệ quả: `BR-027` giữ nguyên đúng phạm vi ban đầu (chỉ Interested → Waiting ghi, chỉ Waiting → Interested xoá); `BR-026` khi đánh giá job đang Waiting mà không có mốc thì bỏ qua (không tự chuyển No Response); nếu có mốc cũ từ lần Interested → Waiting trước, luật vẫn tính theo mốc cũ đó cho tới khi job rời khỏi Waiting về Interested (bị xoá) — đây là hệ quả người dùng đã chấp nhận tường minh.
- Bằng chứng: `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 4 (Q6, ban đầu ghi "Giả định hợp lý", nay chốt qua dialog `ssr-ba`)

### DEC-104 — US-020: Job đã "Expired" mà sửa Ngày hết hạn sang tương lai không tự phục hồi trạng thái trước đó

- Ngày: 2026-08-14
- Status: Active
- Feature liên quan: US-020
- Bối cảnh: Raw không đề cập trường hợp nhà tuyển dụng gia hạn tin (Ngày hết hạn được sửa sang một ngày tương lai) sau khi job đã tự động chuyển "Expired" — chưa rõ hệ thống có nên tự phục hồi trạng thái trước đó hay không.
- Quyết định: Hệ thống không tự phục hồi trạng thái khi Ngày hết hạn của một job đã "Expired" được sửa sang tương lai. Job giữ nguyên "Expired" cho tới khi Dylan tự tay đổi sang trạng thái khác — đúng theo nguyên tắc "Expired vẫn chọn tay được" đã chốt ở `DEC-102`.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-14).
- Phương án đã loại: "Tự động chuyển lại Interested khi hạn mới ở tương lai" — không chọn vì thêm một luật tự động nữa ngoài phạm vi ví dụ raw đã nêu, tăng độ phức tạp không cần thiết.
- Hệ quả: `BR-025` không cần thêm điều kiện phục hồi; spec `US-020` không cần AC riêng cho việc gia hạn tin, chỉ cần nêu rõ đây là hành vi không làm (ngoài phạm vi).
- Bằng chứng: `docs/kb/ba/raw/US-020-lich-su-trang-thai-job.md` mục 4 (Q7, ban đầu ghi "Giả định hợp lý", nay chốt qua dialog `ssr-ba`)

### DEC-109 — US-007: Không giới hạn số tháng khi tính xu hướng chi tiêu trên toàn bộ lịch sử đã lưu

- Ngày: 2026-08-21
- Status: Active
- Feature liên quan: US-007
- Bối cảnh: Raw để mở câu hỏi có cần giới hạn số tháng tối đa khi tính "toàn bộ lịch sử" hay không, vì lý do hiệu năng khi dữ liệu tăng dần theo thời gian (`docs/kb/ba/raw/US-007-phan-tich-xu-huong-lich-su.md` mục 4, Q1).
- Quyết định: Không giới hạn số tháng — luôn tính xu hướng chi tiêu từ toàn bộ dữ liệu đã lưu bền vững, quét hết mọi tháng đã tạo.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-21).
- Phương án đã loại: "Giới hạn 24 tháng gần nhất" và "Giới hạn 36 tháng gần nhất" — không chọn, vì dữ liệu hiện tại còn nhỏ (chưa tới 1 năm, vài chục danh mục/tháng), thêm giới hạn tạo phức tạp không cần thiết ở giai đoạn này; nếu dữ liệu lớn lên nhiều, có thể bổ sung giới hạn ở một US riêng sau này.
- Hệ quả: Spec `US-007` không cần AC hay Screen Element nào cho việc cắt bớt dữ liệu theo thời gian; `ssr-plan` xác nhận nguồn dữ liệu hiện có (`monthBudgetRepository.findAll()`) đã không giới hạn, không cần đổi.
- Bằng chứng: `docs/kb/ba/raw/US-007-phan-tich-xu-huong-lich-su.md` mục 4 (Q1)

### DEC-110 — US-007: Chỉ thu hẹp phạm vi đúng biểu đồ "Xu hướng", không mở rộng sang thẻ insight và biểu đồ "Cơ cấu chi tiêu"

- Ngày: 2026-08-21
- Status: Active
- Feature liên quan: US-007
- Bối cảnh: Raw nói chung chung "tính insight/biểu đồ xu hướng từ dữ liệu bền vững (DB)"; rule `BR-028` và trang wiki feature `US-007` (bản ingest ban đầu) mô tả phạm vi rộng hơn spec — gồm cả thẻ insight (danh mục chi nhiều nhất, tiết kiệm, chi linh hoạt) và biểu đồ "Cơ cấu chi tiêu". `ba-expert` phát hiện mâu thuẫn này khi rà spec và đề xuất cần user xác nhận việc thu hẹp, vì hai nhóm màn hình đó chỉ mô tả đúng một tháng Dylan đang xem, không có khái niệm "lịch sử nhiều tháng" để mở rộng.
- Quyết định: Đồng ý thu hẹp phạm vi US-007 chỉ đúng biểu đồ "Xu hướng" (tổng chi qua các tháng). Các thẻ insight và biểu đồ "Cơ cấu chi tiêu" giữ nguyên không đổi, không cần AC hay Screen Element riêng.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-ba` (2026-08-21), sau đề xuất của `ba-expert`.
- Phương án đã loại: "Mở rộng: cả thẻ insight và biểu đồ Cơ cấu chi tiêu cũng phải xác nhận rõ nguồn dữ liệu" — không chọn, vì hai thành phần này vốn luôn chỉ xem đúng một tháng đang chọn (dù đọc từ DB hay không), không có rủi ro "chỉ còn trong bộ nhớ tạm" như biểu đồ Xu hướng (vốn cần dữ liệu nhiều tháng cùng lúc); mở rộng sẽ làm spec rườm rà không thêm giá trị thực chất.
- Hệ quả: `spec.md` giữ nguyên phạm vi hiện tại (chỉ `EL-01` — biểu đồ Xu hướng). `BR-028` và trang wiki feature `US-007` cần đồng bộ lại đúng phạm vi này khi `ssr-ingest mode=sync` chạy sau khi spec đạt `Ready for DEV`.
- Bằng chứng: `docs/features/US-007-phan-tich-xu-huong-lich-su/spec.md` mục 14 (A2, trước khi chốt)

### DEC-111 — Bảng "Theo dõi CV ứng tuyển": tính năng "đọc link → tự điền" là phần mở rộng của US-018, giữ ngoài Business Flow

- Ngày: 2026-08-26
- Status: Active
- Feature liên quan: US-018 (mở rộng)
- Bối cảnh: User yêu cầu trực tiếp "tại danh sách job, tôi muốn khi nhập link vào, hệ thống phải tự truy cập vào link và điền các thông tin còn lại vào danh sách". `ssr-po mode=review` (`docs/po/review-2026-08-26-tu-dien-thong-tin-job-tu-link.md`) nêu vấn đề định vị: US-018 đã chốt là tiện ích tách biệt ngoài Business Flow (`DEC-088`), nhưng US-019 thì user lại muốn đưa vào làm mục tiêu chính (`M3`, `DEC-105`) — hai tiền lệ trái nhau.
- Quyết định: Coi tính năng này là phần mở rộng của bảng "Theo dõi CV ứng tuyển" (US-018), giữ **ngoài** Business Flow "Hệ Thống Quản Lý Chi Tiêu" theo đúng tiền lệ `DEC-088`. Không cần chạy `ssr-po mode=business-flow` để dựng khu vực định hướng cho mảng Roadmap/tuyển dụng trước khi làm.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=review` (2026-08-26).
- Phương án đã loại: "Nâng 'Theo dõi tuyển dụng' thành khu vực chính thức trong Business Flow (thêm mục tiêu mới, luồng riêng)" — không chọn; "Chưa chốt phạm vi, chỉ ghi đánh giá + backlog ưu tiên thấp" — không chọn.
- Hệ quả: `docs/kb/ba/business-flow.md` không cần cập nhật. Raw/spec của tính năng này đi theo function độc lập (giống US-018, US-020). `po-expert` khi đối chiếu spec sau này áp dụng cùng tiền lệ `DEC-088`, không trả `Blocked` vì thiếu liên kết Business Flow.
- Bằng chứng: `docs/po/review-2026-08-26-tu-dien-thong-tin-job-tu-link.md` mục 4 (#1); `docs/memory/decisions.md#dec-088`; `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` mục 2

### DEC-112 — Bảng "Theo dõi CV ứng tuyển": đọc link từ mọi nền tảng kể cả LinkedIn, chấp nhận tỷ lệ thất bại cao

- Ngày: 2026-08-26
- Status: Active
- Feature liên quan: US-018 (mở rộng)
- Bối cảnh: 3 Platform mặc định là ITViec, LinkedIn, VietNamWork (`components/JobTrackerBoard.tsx:24-33`). Thực tế kỹ thuật: LinkedIn chặn truy cập tự động từ máy chủ và thường yêu cầu đăng nhập nên phần đọc nội dung gần như luôn thất bại; ITViec và VietnamWorks để trang tuyển dụng đọc công khai dễ hơn nhiều. `ssr-po` hỏi nên giới hạn nguồn link hay thử đọc tất cả.
- Quyết định: Hệ thống **thử đọc mọi link**, không giới hạn theo nền tảng. Chấp nhận tỷ lệ thất bại cao với link LinkedIn (và một số nền tảng khác), và chấp nhận rủi ro việc truy cập tự động có thể vi phạm điều khoản dịch vụ của nền tảng. Khi đọc nội dung thất bại, vẫn suy Platform từ tên miền link và rơi về nhập tay các trường còn lại (`DEC-114`).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=review` (2026-08-26).
- Phương án đã loại: "Chỉ nền tảng cho đọc công khai (ITViec, VietnamWorks...), link LinkedIn báo không đọc được" — không chọn; "Chỉ hỗ trợ đúng 1 nền tảng Dylan dùng nhiều nhất" — không chọn.
- Hệ quả: Spec không giới hạn danh sách nền tảng nguồn. `ssr-plan` thiết kế luồng gọi mạng ngoài phải có timeout ngắn và xử lý thất bại êm (không văng lỗi chặn thao tác). Rủi ro điều khoản dịch vụ đã được user chấp nhận tường minh — không cần chặn ở tầng sản phẩm.
- Bằng chứng: `docs/po/review-2026-08-26-tu-dien-thong-tin-job-tu-link.md` mục 7 (#1, #2); `components/JobTrackerBoard.tsx:24-33`

### DEC-113 — Bảng "Theo dõi CV ứng tuyển": đọc link tự điền đúng 3 trường (Công ty, Platform, Ngày hết hạn), không thêm cột mới

- Ngày: 2026-08-26
- Status: Active
- Feature liên quan: US-018 (mở rộng)
- Bối cảnh: Bảng job hiện có các cột Công ty, Ngày hết hạn, Platform, Link, Trạng thái, Ngày nộp hồ sơ, Ghi chú — không có cột chức danh/vị trí ứng tuyển. `ssr-po` hỏi khi đọc được link thì tự điền trường nào.
- Quyết định: Tự điền **Công ty** + **Platform** (suy từ tên miền link) + **Ngày hết hạn** (chỉ khi trang tuyển dụng có ghi rõ dạng ngày). Trạng thái và Ghi chú luôn do Dylan tự nhập. **Không** thêm cột mới "Vị trí ứng tuyển".
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=review` (2026-08-26).
- Phương án đã loại: "Chỉ Công ty + Platform (bỏ Ngày hết hạn vì dễ điền sai)" — không chọn; "Thêm cột mới 'Vị trí ứng tuyển' và tự điền chức danh" — không chọn.
- Hệ quả: Không cần `ssr-data`/migration — các cột hiện có đủ dùng. `ssr-ba` cần chốt cách xử lý khi trang ghi hạn nộp kiểu "còn N ngày" hoặc không có ngày rõ ràng (điểm mờ mục 4 #8 của PO review). Ngày hết hạn đọc sai có thể kích hoạt luật `BR-025` (US-020) tự chuyển "Expired" sai — `ssr-plan` lưu ý.
- Bằng chứng: `docs/po/review-2026-08-26-tu-dien-thong-tin-job-tu-link.md` mục 4 (#3, #8), mục 7 (#5); `docs/features/US-020-lich-su-trang-thai-job/spec.md`

### DEC-114 — Bảng "Theo dõi CV ứng tuyển": đọc link thất bại/thiếu dữ liệu vẫn cho lưu job, chỉ báo nhẹ

- Ngày: 2026-08-26
- Status: Active
- Feature liên quan: US-018 (mở rộng)
- Bối cảnh: Hiện tại thiếu trường bắt buộc (Công ty/Ngày hết hạn/Platform) hoặc Link sai định dạng thì chặn lưu (`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` mục 6, `DEC-086`). `ssr-po` hỏi khi đọc link không ra đủ dữ liệu thì hành vi nên là gì.
- Quyết định: Khi đọc link thất bại hoặc chỉ lấy được một phần, **vẫn lưu job** với link và phần thông tin đọc được; hiện thông báo nhẹ "chưa lấy được [tên trường] — mời nhập tay"; **không chặn** thao tác. Tính năng đọc link là tiện ích hỗ trợ, không thay đổi bản thân luật bắt buộc nhập của US-018 (Dylan vẫn phải có đủ Công ty/Ngày hết hạn/Platform trước khi dòng job được coi là hoàn chỉnh, nhưng việc đọc link không được là rào chắn thêm).
- Người chốt: User, qua `AskUserQuestion` trong `ssr-po mode=review` (2026-08-26).
- Phương án đã loại: "Chặn lưu tới khi Dylan điền đủ trường bắt buộc" — không chọn; "Hiện bản xem trước để Dylan xác nhận từng trường rồi mới lưu" — không chọn (thêm một bước thao tác).
- Hệ quả: `ssr-ba` chốt: (a) đọc link xảy ra lúc nào — ngay khi rời ô Link hay sau khi lưu; (b) có ghi đè giá trị Dylan đã gõ tay không (nghiêng về chỉ điền ô trống). Cách hiển thị thông báo nhẹ dùng chung cơ chế toast/thông báo lỗi ngay dưới ô đã có ở US-018.
- Bằng chứng: `docs/po/review-2026-08-26-tu-dien-thong-tin-job-tu-link.md` mục 4 (#4, #5, #6), mục 9; `docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md` mục 6

### DEC-115 — US-021: Đọc link để tự điền xảy ra ngay khi Dylan rời ô Link

- Ngày: 2026-08-26
- Status: Active
- Feature liên quan: US-021
- Bối cảnh: Raw US-021 để mở câu hỏi việc đọc link xảy ra vào lúc nào — ngay khi rời ô Link, sau khi bấm Lưu (làm giàu nền), hay chỉ khi bấm một nút riêng.
- Quyết định: Hệ thống đọc link ngay khi Dylan dán/gõ xong và rời ô Link. Trong lúc đọc hiện chỉ báo "Đang lấy thông tin..."; điền xong thì các ô của dòng job cập nhật tại chỗ, Dylan xem và sửa lại được trước khi lưu.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-26).
- Phương án đã loại: "Sau khi Dylan bấm Lưu job (điền thêm ở nền, làm mới bảng)" — không chọn vì các ô tự nhảy giá trị sau khi đã lưu dễ gây bất ngờ; "Chỉ khi bấm nút riêng 'Lấy thông tin từ link'" — không chọn (thêm một thao tác bấm mỗi lần).
- Hệ quả: Spec US-021 có Screen Element cho chỉ báo trạng thái đọc link tại dòng đang nhập. `ssr-plan` thiết kế luồng gọi mạng ngoài chạy được đồng bộ với thao tác rời ô, có timeout để không treo ô nhập (`DEC-114`, và xem Q10 của raw). Với job đã lưu, cơ chế đọc lại vẫn để `ssr-ba` chốt (Q9 của raw).
- Bằng chứng: `docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md` mục 4 (Q5); `docs/po/review-2026-08-26-tu-dien-thong-tin-job-tu-link.md` mục 6 (#1)

### DEC-116 — US-021: Tự điền chỉ vào ô đang trống, không ghi đè giá trị Dylan đã nhập

- Ngày: 2026-08-26
- Status: Active
- Feature liên quan: US-021
- Bối cảnh: Raw US-021 để mở câu hỏi xử lý thế nào khi đọc link ra giá trị khác với ô Dylan đã tự gõ.
- Quyết định: Hệ thống chỉ điền vào các ô đang để trống. Ô Dylan đã nhập giá trị thì giữ nguyên, không đụng tới, kể cả khi đọc link ra giá trị khác.
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-26).
- Phương án đã loại: "Luôn ghi đè bằng giá trị từ link kể cả ô Dylan đã nhập" — không chọn vì đè mất phần Dylan cố ý gõ khác; "Ghi đè nhưng báo ô nào vừa đổi và giá trị cũ" — không chọn (thêm thông báo cần thiết kế, và vẫn có rủi ro đè nhầm).
- Hệ quả: AC của US-021 mô tả rõ tự điền là thao tác "điền ô trống", không phải "đồng bộ". Nếu Dylan gõ sai một trường rồi mới dán link, hệ thống không tự sửa giúp — đây là đánh đổi đã chấp nhận. Áp dụng cho cả 3 trường tự điền (`DEC-113`).
- Bằng chứng: `docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md` mục 4 (Q6)

### DEC-117 — US-021: Chỉ tự điền Ngày hết hạn khi trang tuyển dụng có ngày ở dạng tuyệt đối, rõ ràng

- Ngày: 2026-08-26
- Status: Active
- Feature liên quan: US-021
- Bối cảnh: Raw US-021 để mở câu hỏi xử lý Ngày hết hạn khi trang tuyển dụng ghi kiểu mập mờ ("còn 5 ngày", "tuyển gấp") hoặc không có mục hạn nộp. Rủi ro: Ngày hết hạn sai kích hoạt luật `BR-025` (US-020) tự chuyển job đang "Interested" sang "Expired".
- Quyết định: Hệ thống chỉ tự điền Ngày hết hạn khi trang có ngày ở dạng tuyệt đối, rõ ràng (vd 30/09/2026). Mọi kiểu mập mờ — đếm ngược "còn N ngày", "tuyển gấp", không có mục hạn nộp — đều để trống Ngày hết hạn và báo nhẹ "chưa lấy được Ngày hết hạn — mời chọn tay".
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-26).
- Phương án đã loại: "Quy đổi cả kiểu tương đối ('còn 5 ngày' → hôm nay + 5 ngày) rồi điền" — không chọn vì dễ lệch 1–2 ngày và kích hoạt luật Expired sai; "Điền mọi trường hợp đoán được nhưng đánh dấu ô 'cần xác nhận', tạm hoãn luật Expired cho job đó" — không chọn (thêm một trạng thái ô cần thiết kế).
- Hệ quả: AC của US-021 phân biệt rõ "trang có ngày tuyệt đối" (điền) và "mọi kiểu khác" (để trống + báo nhẹ theo `DEC-114`). `ssr-ba` cần định nghĩa "ngày ở dạng tuyệt đối, rõ ràng" cụ thể hơn khi viết spec.
- Bằng chứng: `docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md` mục 4 (Q7); `docs/kb/ba/wiki/knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md`

### DEC-118 — US-021: Tên miền link không khớp Platform nào đang có → để trống Platform, báo nhẹ

- Ngày: 2026-08-26
- Status: Active
- Feature liên quan: US-021
- Bối cảnh: Raw US-021 để mở câu hỏi tự điền Platform thế nào khi tên miền của link không khớp option Platform nào đang có (vd trang careers riêng của công ty). Platform là danh sách động Dylan tự quản lý, chặn xóa option đang có job dùng (`BR-021`, `DEC-082`).
- Quyết định: Khi tên miền không khớp Platform nào đang có, để trống ô Platform và báo nhẹ "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới". Hệ thống không tự tạo option Platform mới, không gán vào một nhãn "Khác".
- Người chốt: User, qua `AskUserQuestion` trong `ssr-raw` (2026-08-26).
- Phương án đã loại: "Tự tạo Platform option mới lấy tên từ tên miền" — không chọn vì danh sách Platform dễ phình nhiều option ít dùng và `BR-021` chặn xóa khi đang có job dùng; "Gán vào một option cố định tên 'Khác'" — không chọn vì gộp nhiều nguồn khác nhau vào một nhãn, khó lọc/sắp xếp theo Platform.
- Hệ quả: Việc suy Platform chỉ thành công khi tên miền khớp một option đang có (khớp thế nào — theo tên miền chính xác hay chứa từ khóa — để `ssr-ba`/`ssr-plan` chốt). Không khớp thì rơi về nhập tay như `DEC-114`. Danh sách Platform vẫn hoàn toàn do Dylan kiểm soát.
- Bằng chứng: `docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md` mục 4 (Q8); `docs/kb/ba/wiki/data/entity/ENT-005-platform-tuyen-dung.md`; `docs/memory/decisions.md#dec-082`
