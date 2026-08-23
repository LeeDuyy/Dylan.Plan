# judgement-log.md — Nhận định và kết luận sau phân tích

Updated: 2026-08-14 (JDG-029)
Scope: Dự án `DylanPlan`.

**Append-only.** Nhận định bị bác bỏ thì đổi `Status: Refuted` và thêm bản ghi mới trỏ ngược lại.

Ghi vào đây khi: kết thúc một lượt điều tra, review, hoặc phân tích hiệu năng — và rút ra được kết luận có thể tái sử dụng cho requirement sau.

Khác `decisions.md`: nhận định **có thể sai**. Một nhận định được xác nhận đủ chắc thì nâng thành `DEC-###` bên `decisions.md`.

---

### JDG-029 — Ràng buộc "chỉ thao tác được ở tháng hiện tại" (US-019) nên chặn thật ở server, chặt hơn tiền lệ DEC-010 (giao dịch chi tiêu chỉ chặn ở UI)

- Ngày: 2026-08-14
- Status: Applied — đã áp dụng vào `docs/features/US-019-danh-sach-can-mua/plan.md` mục 4, 5, 8
- Độ tin cậy: Giả định hợp lý — kết luận kỹ thuật của `ssr-plan`, chưa hỏi lại user, nhưng rủi ro thấp vì chỉ làm chặt hơn (an toàn hơn), không nới lỏng gì
- Feature liên quan: US-019
- Bối cảnh: Khi khảo sát `server/budget/application/use-cases/update-transaction.ts` và `delete-transaction.ts` (US-004, `DEC-010` — "chỉ sửa/xóa giao dịch tháng đang chọn"), phát hiện ràng buộc này **không** được chặn ở server — hai use-case chỉ kiểm tra danh mục có thuộc đúng `monthId` được truyền vào hay không, không kiểm tra `monthId` đó có phải "tháng đang chọn" hay không. Lý do khả dĩ: `selectedMonthId` là state chỉ tồn tại ở client, server không có cách nào biết "tháng đang chọn" là tháng nào tại thời điểm nhận request, nên ràng buộc DEC-010 trong thực tế chỉ được thực thi bằng cách UI ẩn/vô hiệu nút Sửa/Xóa cho giao dịch không thuộc `selectedMonth` đang render.
- Nhận định: Với `US-019`, tình huống khác hẳn — "tháng hiện tại" (`DEC-107`) được định nghĩa là tháng theo đồng hồ hệ thống, một giá trị mà **server tự tính được độc lập với client** (`getCurrentMonthId()`, không cần client gửi lên). Vì vậy, khác với giao dịch chi tiêu, ràng buộc "chỉ tháng hiện tại mới ghi được" của Items cần mua hoàn toàn có thể và nên được chặn thật ở tầng use-case (domain rule `assertMonthIsCurrent`), không chỉ dựa vào UI ẩn nút — tránh trường hợp client cũ (cache, tab đang mở từ tháng trước) gửi request sửa/xóa một item không còn thuộc tháng hiện tại.
- Hệ quả: 4 use-case ghi mới của `US-019` (`add`/`update`/`mark-purchased`/`delete-purchase-item`) đều gọi `assertMonthIsCurrent` trước khi ghi. Nếu sau này `US-004`/`DEC-010` được làm chặt lại tương tự, có thể tái dùng đúng pattern `current-month-rule.ts` này làm mẫu (dù `DEC-010` dùng "tháng đang chọn" theo dropdown chứ không phải "tháng hiện tại" theo đồng hồ — cần một rule riêng nếu áp dụng, không dùng chung file).
- Bằng chứng: `server/budget/application/use-cases/update-transaction.ts:54-57`, `server/budget/application/use-cases/delete-transaction.ts`, `docs/features/US-019-danh-sach-can-mua/plan.md` mục 4, 5, 8

### JDG-028 — Job có mốc "Ngày nộp hồ sơ" cũ đã quá 7 ngày, khi chuyển sang Waiting từ trạng thái khác Interested, tự động quay lại "No Response" ngay ở lượt tải kế tiếp — tái hiện thật, đúng theo `DEC-103`

- Ngày: 2026-08-14
- Status: Confirmed — đã tái hiện thật trên `next dev`, đúng hệ quả đã ghi nhận trước ở `DEC-103`
- Độ tin cậy: Đã xác nhận từ knowledge (thao tác thật qua Browser tool, đọc lại giá trị cột "Trạng thái"/"Ngày nộp hồ sơ" sau mỗi thao tác)
- Feature liên quan: US-020 (`BR-026`, `BR-027`, `DEC-103`)
- Bằng chứng: Job test "TEST-AC05-NoResponseAuto" ban đầu `Waiting` với `submittedAt` 8 ngày trước → tự động chuyển "No Response" (đúng `BR-026`). Đổi tay job này sang "Waiting" (từ "No Response", không phải từ "Interested") — theo `DEC-103`, mốc "Ngày nộp hồ sơ" KHÔNG được ghi mới, vẫn giữ giá trị cũ 8 ngày trước. Do mốc cũ đó vẫn thỏa điều kiện "quá 7 ngày" của `BR-026`, ngay lượt `getJobTrackerSnapshot()` kế tiếp (do `refreshSnapshot()` gọi sau khi lưu), job tự động quay lại "No Response" — quan sát được `status` giữ nguyên "No Response" thay vì "Waiting" như vừa chọn tay.
- Lập luận: Đây không phải defect — là hệ quả đã được `DEC-103` ghi nhận tường minh trước khi code: "nếu có mốc cũ từ lần Interested → Waiting trước, luật vẫn tính theo mốc cũ đó cho tới khi job rời khỏi Waiting về Interested". Việc tái hiện được thật xác nhận cả `BR-026` lẫn `BR-027` hoạt động đúng theo đặc tả, và xác nhận thứ tự "ghi rồi tự động tính lại ngay" (`get-job-tracker-snapshot.ts` chạy domain service ngay sau khi `upsertJobApplication` gọi `revalidatePath`/`refreshSnapshot`) tạo ra hiệu ứng "tự sửa lại ngay" dễ gây hiểu lầm là lỗi nếu không biết trước `DEC-103`.
- Hệ quả nếu đúng: Khi review hoặc hỗ trợ Dylan trong tương lai, không nên coi hiện tượng "chọn Waiting nhưng job vẫn hiện No Response" là bug — cần kiểm tra mốc "Ngày nộp hồ sơ" hiện tại của job đó trước. Nếu Dylan muốn một job thực sự "chờ phản hồi mới" sau khi đã No Response, cách đúng theo thiết kế hiện tại là chuyển qua "Interested" trước (xoá mốc cũ theo `BR-027`) rồi mới chuyển sang "Waiting" (ghi mốc mới) — không có đường tắt "No Response → Waiting" để reset đồng hồ 7 ngày.
- Cái gì sẽ chứng minh nó sai: Nếu user phản hồi rằng hành vi này gây khó chịu trong thực tế sử dụng (không phải chỉ lý thuyết), cần quay lại `DEC-103` và cân nhắc đảo quyết định — cho phép ghi mốc mới khi vào Waiting từ bất kỳ trạng thái nào, không chỉ từ Interested.

### JDG-027 — Một function mở rộng trực tiếp cùng entity/cùng trang của một function đã được miễn Business Flow (`DEC-088`-style) áp dụng lại tiền lệ đó, không cần một phiên `ssr-po mode=business-flow` mới mỗi lần

- Ngày: 2026-08-14
- Status: Confirmed — `po-expert` xác nhận `Aligned` cho `US-020` dựa trên lập luận này
- Độ tin cậy: Đã xác nhận từ knowledge (verdict `po-expert` khi review `US-020`)
- Feature liên quan: US-018 (nguồn `DEC-088`), US-020 (áp dụng lại); áp dụng chung cho mọi function tương lai mở rộng trực tiếp một function đã có tiền lệ tách biệt khỏi Business Flow
- Bằng chứng: `docs/features/US-020-lich-su-trang-thai-job/spec.md` mục 2 (viện dẫn `DEC-088`); verdict `po-expert` (2026-08-14): "nếu mỗi lần mở rộng trực tiếp một tiện ích đã được miễn Business Flow lại phải quay về hỏi user y hệt câu đã hỏi, thì tiền lệ trở nên vô nghĩa"
- Lập luận: `DEC-088` (chốt cho `US-018`) xác nhận một function là "tiện ích cá nhân tách biệt" ngoài phạm vi Business Flow hiện có, không cần mở phiên `ssr-po mode=business-flow` mới để tiếp tục. `US-020` không mở thêm phạm vi mới nào so với những gì `DEC-088` đã chấp nhận — cùng entity (Job ứng tuyển), cùng trang (Roadmap), cùng bảng, không đổi mô hình người dùng, không cần hạ tầng mới. `po-expert` kết luận ranh giới hợp lý để tái áp dụng tiền lệ là: mở rộng cùng entity/cùng trang → áp dụng lại; tạo entity/trang/route hoàn toàn mới và tách biệt → mới cần một phiên `ssr-po` mới để chốt định hướng.
- Hệ quả nếu đúng: Khi một function tương lai (vd US-02x) mở rộng trực tiếp `US-018`/`US-020` (cùng "Job ứng tuyển", cùng trang Roadmap) mà không thêm entity/route mới, `ssr-ba` có thể viện dẫn lại `DEC-088` trong spec mục 2 và để `po-expert` xác nhận, không cần bắt user trả lời lại đúng câu hỏi định hướng đã chốt. Nếu function tương lai tạo một trang/entity hoàn toàn mới trên Roadmap (không mở rộng `US-018`/`US-020`), tiền lệ này KHÔNG áp dụng — cần một phiên `ssr-po mode=business-flow` mới hoặc quyết định tương đương.
- Cái gì sẽ chứng minh nó sai: Nếu một `po-expert` tương lai từ chối áp dụng lại tiền lệ cho một function chỉ mở rộng nhỏ (khiến user phải trả lời lại câu hỏi định hướng đã chốt), hoặc nếu user tự phản đối cách suy luận này khi được hỏi trực tiếp, nhận định này cần bị bác bỏ và thay bằng quy tắc chặt hơn (mỗi function mới đều cần xác nhận riêng dù nhỏ tới đâu).

### JDG-026 — Kiểm chứng UI bằng accessibility tree (`read_page`) không phát hiện được lỗi bị cắt hình ảnh (CSS `overflow` clipping) — cần ảnh chụp màn hình thật hoặc `getBoundingClientRect()` cho các phần tử `position: absolute`/`fixed`

- Ngày: 2026-08-13
- Status: Confirmed — đã tái hiện thật và đã sửa
- Độ tin cậy: Đã xác nhận từ knowledge (ảnh chụp màn hình do user cung cấp, đối chiếu `getBoundingClientRect()` trước/sau khi sửa)
- Feature liên quan: US-018 (dropdown Platform, `EL-04`); áp dụng chung cho mọi dropdown/menu/tooltip dùng `position: absolute` bên trong một khung có `overflow-x: auto` hoặc `overflow-y: auto` trong dự án
- Bằng chứng: Toàn bộ 11 AC của `US-018` đã kiểm chứng "Passed" bằng `read_page` (accessibility tree) + đọc `prisma/dev.db` trực tiếp — không phát hiện gì bất thường, vì cây accessibility liệt kê đầy đủ các nút "ITViec"/"LinkedIn"/"VietNamWork" bất kể chúng có bị cắt hình ảnh (`overflow: hidden`/clip bởi ancestor) hay không. User gửi ảnh chụp màn hình thật cho thấy menu chỉ hiện được một phần "ITViec" trước khi bị viền khung bảng cắt ngang. Nguyên nhân: `.platform-menu` dùng `position: absolute` bên trong `.platform-picker` (positioning context), nằm trong `.budget-table-wrap` — class này có `overflow-x: auto` nhưng không khai báo `overflow-y`, và theo đặc tả CSS, khi một trục overflow khác `visible` thì trục còn lại tự động thành `auto` (không phải `visible`) — khiến trình duyệt cắt mọi phần tử `position: absolute` vượt khỏi khung bảng theo cả 2 trục.
- Lập luận: `read_page`/`find` (dựa trên accessibility tree) xác nhận được **sự tồn tại và khả năng tương tác** của phần tử (đúng cho hầu hết AC dạng "bấm được"/"nhập được"/"lưu được") nhưng **không** xác nhận được phần tử có **thực sự hiển thị đầy đủ trong khung nhìn** hay không — accessibility tree không mô hình hóa `overflow`/`clip-path`/`z-index` che khuất. Đây là khoảng mù cố hữu của kiểm chứng qua accessibility tree, không phải lỗi của quy trình kiểm chứng nói chung.
- Hệ quả nếu đúng: Với mọi phần tử `position: absolute`/`fixed` mới (dropdown, tooltip, popover, menu ngữ cảnh) lồng trong một khung có `overflow-x`/`overflow-y` khác `visible`, nên: (a) ưu tiên dùng `createPortal` render ra `document.body` ngay từ đầu thay vì `position: absolute` trong container có thể cuộn, hoặc (b) nếu không dùng portal, phải kiểm chứng bằng `computer{action:"screenshot"}` hoặc `getBoundingClientRect()` đối chiếu `window.innerHeight`/`innerWidth`, không chỉ dựa vào `read_page`.
- Cái gì sẽ chứng minh nó sai: Nếu một dropdown tương lai dùng `position: absolute` trong container có `overflow: auto` mà vẫn hiển thị đúng (vì container đó đủ cao để chứa toàn bộ menu, không có phần nào vượt biên), thì rủi ro này không xảy ra — nhưng vẫn nên kiểm chứng bằng ảnh chụp màn hình thay vì giả định an toàn.

### JDG-025 — Rủi ro race condition dự đoán ở `JDG-023` đã tái hiện thật: 7 request tải trang gần như đồng thời tạo 21 dòng `JobPlatform` thay vì 3, đã sửa bằng transaction atomic (`DEC-091`)

- Ngày: 2026-08-13
- Status: Confirmed — đã tái hiện thật và đã sửa, xác nhận lại bằng stress test 8 request đồng thời sau khi sửa
- Độ tin cậy: Đã xác nhận từ knowledge (đọc trực tiếp bảng `JobPlatform` qua `better-sqlite3` trước và sau khi sửa)
- Feature liên quan: US-018; áp dụng chung cho mọi "ensure-default"/lazy-seed tương lai đọc-rồi-ghi mà không dùng transaction
- Bằng chứng: Lần đầu tải trang `/` sau khi Codex triển khai xong `TB-02`..`TB-11`, log dev server cho thấy nhiều `HEAD`/`GET /` chồng lấp trong lúc route đang compile lần đầu (13.8s); truy vấn trực tiếp `prisma/dev.db` cho thấy 21 dòng `JobPlatform` (7× mỗi tên) với `createdAt` chênh nhau chỉ vài trăm mili-giây (11:34:06.953 → 11:34:07.205). Sau khi đổi `ensureDefaultJobPlatforms` sang gọi `createDefaultsIfEmpty` (đếm + `createMany` trong cùng `prisma.$transaction`, `DEC-091`), chạy `Promise.all` 8 request `fetch("/")` đồng thời — bảng vẫn giữ đúng 3 dòng.
- Lập luận: `JDG-023` (viết lúc lập plan) đã đúng khi cảnh báo rủi ro này nhưng đánh giá "Thấp — single-user, không có traffic đồng thời thật" — đánh giá đó **sai trong thực tế phát triển**: dev server compile lần đầu chậm (Next.js Fast Refresh biên dịch route theo yêu cầu) khiến trình duyệt tự gửi lại nhiều request cho cùng một trang trong lúc chờ, tạo ra đúng kiểu concurrency mà JDG-023 cho là hiếm. Đây không phải kịch bản "nhiều người dùng thật" nhưng là kịch bản "nhiều request cùng route" hoàn toàn có thể xảy ra ở cả dev lẫn production (double-click, F5 nhanh, hoặc trình duyệt prefetch).
- Hệ quả nếu đúng: Mọi ensure-default/lazy-seed kiểu "đếm rồi chèn nếu rỗng" trong dự án này (nếu có ở function tương lai) nên mặc định bọc trong `prisma.$transaction` ngay từ đầu thay vì coi race là rủi ro lý thuyết có thể bỏ qua cho ứng dụng single-user — chi phí thêm transaction gần như bằng 0, trong khi chi phí sửa sau khi dữ liệu đã bẩn (phải viết script dọn tay) cao hơn hẳn.
- Cái gì sẽ chứng minh nó sai: Nếu sau khi triển khai thật (không phải dev server) mà never thấy dòng trùng nào phát sinh trong nhiều tháng sử dụng thực tế, có thể hạ mức độ ưu tiên áp dụng transaction cho các ensure-default tương lai tương tự — nhưng vẫn nên giữ làm mặc định vì chi phí thấp.

### JDG-024 — `components/BudgetApp.tsx:911` có lỗi kiểu TypeScript có sẵn (`Icon` trong mảng insight bị suy kiểu rộng thành `string | boolean | ComponentType`), không liên quan tới US-018

- Ngày: 2026-08-13
- Status: Confirmed — đã chạy thật
- Độ tin cậy: Đã xác nhận từ knowledge (`rtk tsc --noEmit` sau migration `US-018`, đối chiếu `git diff HEAD -- components/BudgetApp.tsx` rỗng — xác nhận file không bị đụng tới trong phiên này)
- Feature liên quan: Không thuộc US-018 — lỗi tồn tại độc lập trong `components/BudgetApp.tsx`, khu vực khu vực Insight tài chính (mảng dữ liệu render 3 thẻ `Chi nhiều nhất`/`Chi khác`/`Tiết kiệm-tích lũy`, dòng 898-908)
- Bằng chứng: `rtk tsc --noEmit` báo `TS2604`/`TS2786` tại dòng 911 (`<Icon size={21} />`) — mảng literal trộn kiểu `string | number | ComponentType | boolean` khiến TypeScript suy ra kiểu phần tử thứ 4 (`Icon`) rộng ra gồm cả `boolean` (lẫn từ phần tử thứ 5 `maskable`), làm `Icon` không còn hợp lệ làm JSX component
- Lập luận: Đây là lỗi kiểu do khai báo mảng heterogenous (`[title, value, desc, Icon, maskable]`) không có kiểu tường minh (`as const` hoặc type annotation) cho từng cột — TypeScript suy luận kiểu theo union của toàn bộ phần tử trong mảng thay vì theo đúng vị trí cột. Không phải lỗi runtime (code chạy đúng vì JS không kiểm tra kiểu), chỉ là `tsc --noEmit` báo do thiếu khai báo kiểu tường minh.
- Hệ quả nếu đúng: `ssr-data`/`ssr-plan` khi chạy `tsc --noEmit` cho các US khác chạm `BudgetApp.tsx` sẽ vẫn thấy 2 lỗi này — không phải regression do thay đổi của mình, không cần điều tra lại. Nên tách thành một finding/spawn_task riêng để `ssr-dev`/`ssr-fix` sửa (thêm type annotation tường minh cho mảng, hoặc tách từng thẻ insight thành object có kiểu rõ ràng thay vì tuple/array).
- Cái gì sẽ chứng minh nó sai: Nếu một lượt `git blame` trên dòng 898-911 cho thấy đoạn này được sửa gần đây trong cùng phiên làm việc khác (không phải trước US-018), hoặc nếu lỗi biến mất mà không ai sửa `BudgetApp.tsx` (gợi ý do đổi phiên bản TypeScript/lucide-react), cần xem lại kết luận "có sẵn, không liên quan".

### JDG-023 — Dữ liệu tham chiếu mặc định cho một bảng hoàn toàn mới (không có dữ liệu cũ) nên seed bằng "ensure-default" ở tầng application, không qua migration data-only, kể cả khi bảng chưa từng tồn tại

- Ngày: 2026-08-13
- Status: Confirmed — quyết định kỹ thuật khi lập `plan.md` cho US-018, chưa chạy thật (chờ `ssr-dev`)
- Độ tin cậy: Giả định hợp lý — suy ra từ tiền lệ `JDG-018` (hook `guard-artifact-path` chặn sửa tay `migration.sql` cho thay đổi data-only ở US-016), chưa tự kiểm chứng riêng cho trường hợp bảng mới hoàn toàn
- Feature liên quan: US-018 (3 option Platform mặc định "ITViec"/"LinkedIn"/"VietNamWork"), và mọi function tương lai cần seed dữ liệu tham chiếu ban đầu cho một model mới
- Bằng chứng: `docs/features/US-018-theo-doi-cv-ung-tuyen/plan.md` mục 4, 9; `lib/budget-defaults.ts` (danh mục mặc định của US-001 cũng được seed bằng logic ứng dụng khi tạo tháng mới, không qua `prisma/seed.ts` — file này không tồn tại trong dự án); `docs/memory/judgement-log.md#jdg-018`
- Lập luận: `JDG-018` xác nhận hook chặn sửa tay `migration.sql` khi migration đó chỉnh dữ liệu (data-only) trên một bảng **đã có** dữ liệu thật. Với một bảng **hoàn toàn mới** (`JobPlatform`), về lý thuyết Prisma có thể sinh sẵn câu `INSERT` ngay trong `migration.sql` tự động (không cần sửa tay) — nhưng `prisma migrate dev` không hỗ trợ khai báo seed data trực tiếp trong `schema.prisma`, và cách duy nhất để tự động hóa việc này qua Prisma là `prisma/seed.ts` (dự án chưa có file này, và `defaultCategories` của `US-001` cũng cố tình không dùng cơ chế này). Vì dự án đã có tiền lệ nhất quán "seed dữ liệu mặc định bằng logic ứng dụng, không bằng seed script/migration", US-018 tiếp tục tiền lệ này thay vì giới thiệu một cơ chế mới (seed script) chỉ cho một tính năng.
- Hệ quả nếu đúng: `ssr-data` khi tạo migration cho `JobPlatform` chỉ cần `CREATE TABLE`, không cần chèn dữ liệu mẫu; `ssr-dev` phải đảm bảo `get-job-tracker-snapshot.ts` gọi `ensureDefaultJobPlatforms()` (kiểm tra `count() === 0`) trước khi trả dữ liệu, mỗi lần trang Roadmap được tải.
- Cái gì sẽ chứng minh nó sai: Nếu `ssr-data` xác nhận được rằng migration tạo bảng mới (chưa có dữ liệu, không phải data-only trên bảng cũ) **không** bị hook `guard-artifact-path` chặn khi thêm `INSERT` tay vào cùng migration, thì cách "ensure-default ở application layer" là lựa chọn thận trọng hơn mức cần thiết — vẫn không sai, nhưng có thể đơn giản hóa bằng cách seed ngay trong migration cho các tính năng sau này.

### JDG-022 — `po-expert` `Blocked` khi một requirement nằm hoàn toàn ngoài phạm vi Business Flow hiện có tự giải quyết được bằng một quyết định user tường minh, không nhất thiết cần một phiên `ssr-po mode=business-flow` riêng

- Ngày: 2026-08-13
- Status: Confirmed — đã áp dụng thật
- Độ tin cậy: Đã xác nhận từ knowledge (verdict `po-expert` thật, hai lượt liên tiếp trong cùng phiên)
- Feature liên quan: US-018 (và mọi requirement tương lai nằm ngoài phạm vi Business Flow đã Agreed, ví dụ các mục khác của Dylan Plan Dashboard — freelance, sản phẩm — nếu sau này có tính năng riêng)
- Bằng chứng: `po-expert` lượt 1 trả `Blocked` cho spec `US-018` vì Business Flow (`docs/kb/ba/business-flow.md`) chỉ chốt định hướng cho "Hệ Thống Quản Lý Chi Tiêu" và tự liệt kê Roadmap là khu vực tách biệt (mục 1, M2) — chưa có quyết định tường minh nào của user về việc US-018 có nên thuộc Business Flow đó không. `ssr-ba` mở dialog `AskUserQuestion` hỏi thẳng user, ghi lựa chọn "tiện ích cá nhân tách biệt" thành `DEC-088`. Gọi lại **chỉ** `po-expert` (không chạy `ssr-po mode=business-flow`) — verdict đổi thành `Aligned` ngay, vì đã có quyết định tường minh giải thích tại sao requirement này không cần đối chiếu Business Flow.
- Lập luận: Mục đích của `po-expert` là đảm bảo mọi spec có **cơ sở quyết định rõ ràng** cho việc thuộc hay không thuộc Business Flow — không phải bắt buộc mọi requirement phải thuộc Business Flow. Một quyết định tường minh "cố ý đứng ngoài phạm vi" (ghi thành `DEC`, có lý do, có phương án đã loại) thỏa mãn yêu cầu này y hệt như một quyết định "mở rộng phạm vi" — cả hai đều là câu trả lời hợp lệ cho câu hỏi "user có biết và đồng ý việc này không thuộc Business Flow không".
- Hệ quả nếu đúng: Khi `po-expert` trả `Blocked` vì lý do phạm vi (không phải vì mâu thuẫn với một `DEC` Active hay vi phạm quy tắc nghiệp vụ), `ssr-ba` nên thử hỏi user một câu trực tiếp về phạm vi trước khi tự động đề nghị chạy `ssr-po mode=business-flow` — chỉ đề nghị chạy `ssr-po` khi user chọn "muốn mở rộng Business Flow", không phải mặc định cho mọi trường hợp `Blocked` kiểu này.
- Cái gì sẽ chứng minh nó sai: Nếu một `po-expert` review tương lai vẫn trả `Blocked` dù đã có `DEC` tường minh xác nhận đứng ngoài phạm vi (vì phát hiện thêm vấn đề khác, ví dụ mâu thuẫn dữ liệu thật với luồng hiện có), thì "quyết định tường minh về phạm vi" không đủ để tự động unblock — cần phân biệt rõ hơn giữa `Blocked` do thiếu quyết định phạm vi và `Blocked` do lý do khác.

### JDG-021 — Prisma 7 + SQLite chọn chiến lược "RedefineTables" (tạo bảng mới, copy dữ liệu, đổi tên) ngay cả cho một thay đổi tưởng chừng đơn giản (thêm 1 cột có default + 1 index)

- Ngày: 2026-08-12
- Status: Confirmed — đã chạy thật
- Độ tin cậy: Đã xác nhận từ knowledge (chạy lệnh thật, đọc `migration.sql` do Prisma sinh)
- Feature liên quan: US-017 (và mọi migration tương lai thêm field cho model đã có dữ liệu trong dự án này)
- Bằng chứng: `prisma migrate dev --name add_category_order` cho model `Category` (thêm `order Int @default(0)` + `@@index([monthId, order])`) sinh ra `migration.sql` dùng chiến lược "RedefineTables": `CREATE TABLE new_Category (...)`, `INSERT INTO new_Category (...) SELECT (...) FROM Category` (không liệt kê cột `order` mới), `DROP TABLE Category`, `ALTER TABLE new_Category RENAME TO Category`, rồi mới `CREATE INDEX` — không phải một câu `ALTER TABLE Category ADD COLUMN "order" ...` đơn giản như tài liệu SQLite chuẩn cho phép.
- Lập luận: Prisma's schema engine cho SQLite có vẻ ưu tiên chiến lược rebuild-toàn-bảng khi có nhiều thay đổi cùng lúc (thêm field + thêm index) thay vì tách thành các câu `ALTER TABLE`/`CREATE INDEX` rời rạc, kể cả khi từng thay đổi riêng lẻ đều nằm trong tập `ALTER TABLE` mà SQLite hỗ trợ trực tiếp. Đây là hành vi của engine, không phải lỗi hay rủi ro — `INSERT ... SELECT` không liệt kê cột mới nên SQLite tự điền giá trị `DEFAULT`, dữ liệu cũ được bảo toàn nguyên vẹn (xác nhận 84/84 dòng còn nguyên sau migration).
- Hệ quả nếu đúng: `ssr-data` không nên giả định trước migration nào sẽ là `ALTER TABLE ADD COLUMN` đơn giản hay `RedefineTables` khi soạn `data-model.md` mục 3 — nên viết mục đó ở dạng dự tính, rồi **cập nhật lại đúng theo SQL Prisma thực sự sinh ra** sau khi chạy `prisma migrate dev`, thay vì giữ nguyên dự đoán ban đầu. Không ảnh hưởng tới cách viết `schema.prisma` hay cách gọi lệnh — chỉ ảnh hưởng nội dung tài liệu hóa.
- Cái gì sẽ chứng minh nó sai: Nếu một migration tương lai chỉ thêm đúng 1 field (không kèm index mới) và Prisma sinh ra `ALTER TABLE ADD COLUMN` đơn giản, giả thuyết "luôn rebuild khi có ≥ 2 thay đổi cùng lúc" sẽ được củng cố thêm; ngược lại nếu một migration nhiều thay đổi vẫn ra `ALTER TABLE` rời rạc, cần xem lại điều kiện thực sự khiến engine chọn rebuild.

### JDG-020 — Không thêm thư viện kéo thả (drag-and-drop) — dùng thẳng HTML5 Drag and Drop API của trình duyệt cho US-017

- Ngày: 2026-08-12
- Status: Active
- Độ tin cậy: Giả định hợp lý (quyết định kỹ thuật của `ssr-plan`, không cần user xác nhận theo phạm vi quyền của stage này)
- Feature liên quan: US-017
- Bằng chứng: `package.json` chỉ có 4 dependency runtime (`@prisma/adapter-better-sqlite3`, `@prisma/client`, `lucide-react`, `next`, `react`, `react-dom`) và 5 devDependency — không có `dnd-kit`, `react-beautiful-dnd`, hay bất kỳ thư viện kéo thả nào; dự án đến giờ chưa từng thêm dependency UI ngoài `lucide-react` (icon) kể từ khi khởi tạo.
- Lập luận: Yêu cầu kéo thả của US-017 chỉ cần đổi vị trí phần tử trong một danh sách một chiều (không cần kéo thả giữa nhiều container, không cần animation phức tạp, không cần hỗ trợ cảm ứng/mobile theo phạm vi spec hiện tại) — HTML5 Drag and Drop API (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) đủ đáp ứng mà không phải thêm dependency mới, giữ đúng phong cách tối giản hiện có của dự án.
- Hệ quả nếu đúng: `components/BudgetApp.tsx` triển khai kéo thả bằng thuộc tính `draggable` trên `<tr>`/tay cầm, không import thư viện ngoài. Nếu sau này yêu cầu mở rộng sang cảm ứng/mobile hoặc kéo thả phức tạp hơn (nhiều bảng, animation mượt), nên xét lại và có thể cần thêm thư viện chuyên dụng — đó là quyết định của US riêng khi phát sinh yêu cầu đó.
- Cái gì sẽ chứng minh nó sai: Nếu `ssr-dev` khi triển khai thực tế phát hiện HTML5 Drag and Drop API không đáp ứng đủ (vd hành vi không nhất quán giữa các trình duyệt Dylan dùng), cần quay lại đánh giá thêm thư viện — ghi finding vào `report.md` của US-017 thay vì âm thầm đổi.

### JDG-019 — Thứ tự hiển thị danh mục trong `BudgetApp.tsx` thực ra do `categoryRepository.findAll()` (gọi từ `budget-snapshot-service.ts`) quyết định, không phải `findByMonth()`

- Ngày: 2026-08-12
- Status: Active
- Độ tin cậy: Đã xác nhận từ knowledge (đọc source thật)
- Feature liên quan: US-017 (và mọi function tương lai cần đổi thứ tự hiển thị danh mục)
- Bằng chứng: `server/budget/domain/services/budget-snapshot-service.ts` mục `getSnapshot()` dựng `categoriesByMonth` bằng cách lặp qua kết quả của `deps.categoryRepository.findAll()` (không phải `findByMonth()`) rồi nhóm theo `monthId`, giữ nguyên thứ tự mảng gốc; `MonthBudgetSnapshot.categories` ở mỗi tháng chính là mảng con này, và `components/BudgetApp.tsx` (`selectedMonth.categories`, `visibleCategories`) dùng thẳng thứ tự đó.
- Lập luận: `findByMonth(monthId)` chỉ được các use-case khác gọi để lấy danh sách kiểm tra ràng buộc (trùng tên, tồn tại, v.v.), không phải nguồn dữ liệu cho UI — nguồn dữ liệu UI đi qua `getBudgetSnapshot()` (Server Component) gọi `budget-snapshot-service.ts`, luôn dùng `findAll()`. Nhầm giữa hai hàm này sẽ khiến việc chỉ sửa `orderBy` ở `findByMonth()` không có tác dụng gì lên thứ tự hiển thị thực tế.
- Hệ quả nếu đúng: Bất kỳ thay đổi nào ảnh hưởng thứ tự hiển thị danh mục trong tương lai đều phải sửa `orderBy` ở cả `findAll()` lẫn `findByMonth()` (US-017 sửa cả hai để nhất quán, dù chỉ `findAll()` thực sự chi phối UI hiện tại) — ghi rõ trong `plan.md` mục 8 để `ssr-dev` không bỏ sót.
- Cái gì sẽ chứng minh nó sai: Nếu `budget-snapshot-service.ts` được refactor sau này để gọi `findByMonth()` theo từng tháng thay vì `findAll()` một lần, nhận định này cần cập nhật lại theo cấu trúc mới.

### JDG-018 — Migration data-only (không đổi schema) không có đường hợp lệ qua `prisma migrate dev --create-only` trong dự án này — hook chặn sửa tay `migration.sql`; phải backfill trực tiếp qua `better-sqlite3` ngoài `prisma/migrations/`

- Ngày: 2026-08-11
- Status: Active
- Độ tin cậy: Đã xác nhận từ knowledge (thử thật, bị chặn thật)
- Feature liên quan: US-016 (phát hiện ở stage `data`)
- Bằng chứng: `prisma migrate dev --create-only --name normalize_category_type` tạo migration rỗng thành công (không có schema diff nào để Prisma tự sinh SQL), nhưng dùng `Edit` để điền câu `UPDATE` vào `migration.sql` bị hook `guard-artifact-path` chặn với `SSR-E020` ("migration SQL phải sinh bằng `prisma migrate dev`, không sửa tay").
- Lập luận: Quy ước của dự án (và template `data-model.md`) chỉ chấp nhận SQL do chính Prisma suy luận từ một schema diff thật — không có cơ chế nào cho phép nội dung SQL tự viết tồn tại trong `prisma/migrations/`, kể cả qua đường `--create-only` vốn được Prisma chính thức tài liệu hóa cho use-case data migration. Với thay đổi không đổi cấu trúc bảng (chỉ backfill giá trị), cách hợp lệ duy nhất trong dự án này là chạy trực tiếp qua driver đã có sẵn (`better-sqlite3`, `lib/prisma.ts`, `DEC-043`) bằng một lệnh một lần, ngoài thư mục `prisma/migrations/`, có backup trước khi chạy.
- Hệ quả nếu đúng: Mọi yêu cầu backfill dữ liệu tương lai không kèm thay đổi cấu trúc (không thêm/sửa/xóa field) nên bỏ qua bước `prisma migrate dev --create-only` ngay từ đầu — không mất công thử rồi bị chặn — và ghi rõ trong `data-model.md` đây là backfill trực tiếp, không phải migration có version.
- Cái gì sẽ chứng minh nó sai: Nếu một phiên bản kit sau này nới lỏng hook `guard-artifact-path` để cho phép nội dung tự viết trong migration rỗng (`--create-only`), nhận định này không còn đúng — nên ưu tiên dùng migration có version khi đó vì có lịch sử/rollback tốt hơn backfill rời rạc.

### JDG-017 — `months` trả về từ `getBudgetSnapshot()` đã sắp tăng dần theo `id` sẵn — mọi logic "tháng liền trước/liền sau" có thể dùng thẳng vị trí mảng, không cần tự sắp lại

- Ngày: 2026-08-11
- Status: Active
- Độ tin cậy: Đã xác nhận từ knowledge (đọc source thật)
- Feature liên quan: US-015 (phát hiện ở stage `plan`)
- Bằng chứng: `server/budget/domain/services/budget-snapshot-service.ts:95` — `monthSnapshots` được `.sort((a, b) => a.id.localeCompare(b.id))` (tăng dần theo kỳ tháng `YYYY-MM`) trước khi trả về trong `BudgetSnapshot.months`. `components/BudgetApp.tsx` giữ nguyên thứ tự này trong state `months` (chỉ đảo cục bộ bằng `[...months].reverse()` ở nơi cần hiển thị mới nhất trước, không đổi thứ tự gốc).
- Lập luận: Vì thứ tự đã đảm bảo tăng dần, mọi tính năng cần "tháng liền kề theo thời gian đã tạo" (như `US-015` — `getQuickViewMonths`) chỉ cần dùng `findIndex` + `index ± 1` trên chính mảng `months`, không cần viết lại logic sắp xếp hay so sánh chuỗi kỳ tháng.
- Hệ quả nếu đúng: Các requirement tương lai chạm tới danh sách tháng (lịch sử, biểu đồ xu hướng, mini dashboard `US-011`) có thể tái dùng bất biến này thay vì tự `sort()` lại — giảm rủi ro sai lệch nếu chỉ một nơi sort còn nơi khác quên.
- Cái gì sẽ chứng minh nó sai: Nếu một thay đổi tương lai ở `budget-snapshot-service.ts` đổi hướng sort hoặc bỏ sort, mọi logic dựa trên bất biến này (kể cả `getQuickViewMonths`) sẽ sai theo — cần rà lại khi sửa file đó.

### JDG-016 — Dự án chưa cấu hình ESLint; `SSR_CMD_LINT` (`rtk lint` / `next lint`) không chạy được ở chế độ không tương tác

- Ngày: 2026-08-10
- Status: Active
- Độ tin cậy: Đã xác nhận từ knowledge (chạy lệnh thật)
- Feature liên quan: US-010 (phát hiện ở stage `test` của `ssr-pipeline`, không phải lỗi do US-010 gây ra)
- Bằng chứng: `rtk lint` trả exit 2 với lỗi "JSON parse failed: EOF while parsing a value". Chạy `npx next lint` trực tiếp cho thấy nguyên nhân: `next lint` (đã deprecated, sẽ gỡ ở Next.js 16) mở dialog tương tác hỏi "How would you like to configure ESLint?" vì dự án chưa có file cấu hình ESLint (`.eslintrc*`/`eslint.config.*`) nào — ở chế độ không tương tác, dialog này không trả lời được nên lệnh thoát exit 1 ngay tại bước hỏi, và `rtk lint` không parse được output dạng dialog này thành JSON.
- Lập luận: Giống `JDG-002` (chưa cài Prisma/vitest lúc bắt đầu US-001), đây là một công cụ verification mà `.ssr-kit.env` đã khai (`SSR_CMD_LINT`) nhưng dự án `DylanPlan` thực tế chưa từng hoàn tất cấu hình — không có US nào trước đó (US-001 đến US-014) chạy `rtk lint` trong plan/task của mình, nên gap này chưa bị phát hiện tới giờ.
- Hệ quả nếu đúng: Task nào có bước verification `SSR_CMD_LINT` sẽ phải ghi "Chưa cấu hình ESLint (gap đã biết)" thay vì `Passed`/`Failed`, giống cách `SSR_CMD_TEST` đã được xử lý — không tự ý chọn "Strict" hay "Base" để hoàn tất dialog thay user, vì đó là quyết định cấu hình dự án cần user xác nhận, không phải một phần phạm vi sửa lỗi của feature đang làm.
- Cái gì sẽ chứng minh nó sai: Nếu user (hoặc một feature tương lai) tự chạy `next lint` một lần và chọn xong cấu hình ("Strict" hoặc "Base"), file `.eslintrc*`/`eslint.config.*` sẽ xuất hiện và `rtk lint` sẽ chạy được ở chế độ không tương tác — khi đó gap này coi như đã đóng, cập nhật `Status: Confirmed`.

### JDG-015 — `rtk next build` exit code không đáng tin để đánh giá build thành/bại; và `safeNumber()` phía client làm điều kiện lỗi "ngân sách âm" không thể kích hoạt được từ UI

- Ngày: 2026-08-10
- Status: Active
- Độ tin cậy: Đã xác nhận từ knowledge (chạy lệnh thật)
- Feature liên quan: US-010
- Bằng chứng: `rtk next build` trả exit code 1 dù stdout in đúng "Next.js Build ... Errors: 0 | Warnings: 0"; chạy `npx next build` trực tiếp (bỏ qua wrapper `rtk`) cho exit code 0 với cùng nội dung "Errors: 0, Warnings: 0". Riêng biệt: `components/BudgetApp.tsx` — `safeNumber()` (dòng ~145-146) áp `Math.max(0, value)` ngay trong `onChange` của ô nhập Ngân sách, trước khi giá trị được gửi lên `commitCategory`/`upsertCategory`; thử gõ "-5000" qua UI thật không tạo ra request nào chứa số âm.
- Lập luận: (1) Với `rtk next build`, exit code của wrapper `rtk` không phải là exit code thật của `next build` — có thể do wrapper cộng thêm bước riêng (vd tính token savings) rồi trả sai exit code, dù đã lọc đúng nội dung "Errors/Warnings" từ output thật. (2) Với `safeNumber()`, đây là một lớp validate phía client đã tồn tại từ trước (không phải do US-010 thêm), khiến điều kiện lỗi phía server "Ngân sách danh mục phải là số không âm" (`UpsertCategoryError` trong `upsert-category.ts`) trở thành một nhánh phòng thủ không bao giờ kích hoạt được qua đường UI thông thường — chỉ còn ý nghĩa nếu có client khác (API trực tiếp, script) gọi `upsertCategory` mà không qua `BudgetApp.tsx`.
- Hệ quả nếu đúng: (1) Khi verify bằng `SSR_CMD_BUILD` (`rtk next build`) mà thấy exit code khác 0, phải đọc nội dung "Errors/Warnings" thật trong output (hoặc chạy lại bằng `npx next build` trực tiếp) trước khi kết luận build fail — không dừng lại ở exit code của wrapper. (2) Khi viết AC hoặc task verification cho các trường liên quan tới số tiền/số lượng có `safeNumber()`-kiểu validate ở client, không cần (và không thể) kiểm chứng đường lỗi âm từ UI — chỉ kiểm chứng bằng đọc code hoặc gọi trực tiếp use-case.
- Cái gì sẽ chứng minh nó sai: Nếu một phiên bản `rtk` sau này sửa lại exit code cho khớp `next build` thật, mục (1) không còn cần kiểm tra riêng. Nếu `safeNumber()` bị đổi/xóa hoặc có đường nhập khác không qua nó, mục (2) cần kiểm chứng lại được đường lỗi âm từ UI.

### JDG-014 — Khi thêm ràng buộc "không trùng", phải kiểm cả các thao tác tạo bản ghi với giá trị mặc định cố định do hệ thống tự đặt, không chỉ giá trị do user tự gõ

- Ngày: 2026-08-10
- Status: Confirmed — nâng thành `DEC-068` (2026-08-10)
- Độ tin cậy: Đã xác nhận từ knowledge (đọc trực tiếp `components/BudgetApp.tsx`)
- Feature liên quan: US-010
- Bằng chứng: `components/BudgetApp.tsx` (`addCategory`, dòng 401-404) — nút "Thêm danh mục" luôn gọi `upsertCategory({ ..., name: "Danh mục mới", ... })`, một chuỗi cố định trong code, không cho Dylan nhập tên trước khi lưu.
- Lập luận: Raw và các quyết định nghiệp vụ (`DEC-020`/`DEC-021`/`DEC-022`) chỉ mô tả ràng buộc ở mức khái niệm ("thêm mới hoặc sửa tên"), ngầm giả định "thêm mới" luôn đi kèm việc user tự gõ tên ngay lúc đó. Trên thực tế, một hành động UI có thể tạo bản ghi với giá trị mặc định lặp lại giống nhau ở mọi lần bấm — nếu chỉ áp ràng buộc trùng cho "tên do user gõ", trường hợp này sẽ lọt qua và để lại đúng vấn đề mà ràng buộc muốn ngăn.
- Hệ quả nếu đúng: Khi phân tích bất kỳ requirement "chặn trùng X" nào khác trong dự án này (hoặc dự án tương tự), phải rà toàn bộ các đường tạo bản ghi mới (không chỉ đường sửa) để tìm giá trị mặc định cố định do hệ thống tự đặt, rồi hỏi rõ user có áp ràng buộc cho cả trường hợp đó không — không tự động miễn trừ.
- Cái gì sẽ chứng minh nó sai: Nếu một requirement tương lai có lý do nghiệp vụ hợp lệ để miễn trừ giá trị mặc định do hệ thống tự đặt khỏi ràng buộc trùng (ví dụ giá trị đó chỉ tồn tại tạm thời, không bao giờ hiển thị cho user), nhận định này cần ghi rõ ngoại lệ theo từng trường hợp, không áp dụng máy móc.

### JDG-011 — Ví dụ nội dung nhập nhanh dùng trong spec phải tự kiểm lại với `quickRules` thật trước khi coi là "không khớp danh mục nào", vì so khớp từ khóa hiện tại là substring, không phải từ nguyên vẹn

- Ngày: 2026-08-06
- Status: Confirmed — tái hiện thật khi kiểm chứng thủ công AC-03 của US-005 trên `next dev`
- Độ tin cậy: Đã xác nhận từ knowledge (thao tác thật, không suy đoán)
- Feature liên quan: US-005 (phát hiện khi kiểm chứng AC-03), áp dụng cho mọi spec tương lai có ví dụ nội dung nhập nhanh
- Bối cảnh: Spec US-005 AC-03 chọn ví dụ "sửa xe máy 200k" làm nội dung "không khớp từ khóa của danh mục nào hiện có". Khi gõ đúng nguyên văn câu này vào ô nhập nhanh thật, hệ thống lại tự nhận diện đúng danh mục "Di chuyển" thay vì để trống.
- Lập luận: `inferredQuickCategory`/`quickRules` (`lib/budget-defaults.ts`, có từ US-001) so khớp bằng `normalized.includes(keyword)` — kiểm tra từ khóa có phải **chuỗi con** của nội dung hay không, không phải khớp từ nguyên vẹn có ranh giới từ. Từ khóa "xe" của danh mục "Di chuyển" là chuỗi con của "xe máy", nên câu ví dụ vô tình khớp dù ý định của người viết spec là chọn một câu không khớp danh mục nào. Đây là hành vi so khớp đã có từ trước US-005, không phải lỗi phát sinh từ thay đổi lần này.
- Hệ quả nếu đúng: Khi `ssr-ba`/`ba-expert` chọn ví dụ nội dung nhập nhanh cho AC yêu cầu "không khớp danh mục nào" (hoặc ngược lại "khớp đúng danh mục X"), phải tự kiểm bằng cách đối chiếu từng từ khóa trong `lib/budget-defaults.ts#quickRules` (so khớp kiểu chuỗi con, không phải từ nguyên vẹn) trước khi đưa vào spec, thay vì suy đoán bằng trực giác ngôn ngữ tự nhiên. Spec US-005 hiện vẫn giữ ví dụ cũ (không sửa trong chu trình này, ghi follow-up ở `docs/features/US-005-rang-buoc-toan-ven-danh-muc/task.md` `TB-12` và DEV wiki mục 8) — AC-03 vẫn coi là đạt vì hành vi cốt lõi (không khớp → dropdown trống → ghi nhận được → vào "Chi tiêu khác") đã kiểm chứng đúng bằng một câu khác.
- Cái gì sẽ chứng minh nó sai: Nếu về sau `quickRules` được đổi sang so khớp từ nguyên vẹn (word-boundary) thay vì chuỗi con, nhận định này không còn áp dụng và ví dụ "sửa xe máy 200k" sẽ hoạt động đúng như spec mô tả.

### JDG-012 — Bug "hai nút cho kết quả giống nhau" ở US-006/US-013 nằm hoàn toàn ở phía gọi (client), không phải ở use-case — server không cần sửa

- Ngày: 2026-08-10
- Status: Confirmed — xác nhận bằng cách đọc trực tiếp `server/budget/application/use-cases/create-month.ts`
- Độ tin cậy: Đã xác nhận từ knowledge (đọc source thật, không suy đoán)
- Feature liên quan: US-006 (đã gộp US-013), áp dụng cho mọi lần khảo sát bug "hai luồng UI cho cùng một kết quả" trong dự án
- Bối cảnh: `components/BudgetApp.tsx#createNewMonth` nhận tham số `cloneCurrent: boolean` nhưng `void cloneCurrent` — bỏ qua hoàn toàn, luôn gọi `createMonthAction({ monthId, sourceMonthId: selectedMonth.id })` bất kể nút nào được bấm. Ban đầu nghi ngờ cần sửa cả use-case `create-month.ts`.
- Lập luận: Đọc `create-month.ts` cho thấy rẽ nhánh `input.sourceMonthId ? sao chép danh mục (loại trừ isFallback) : defaultCategories` đã đúng sẵn — đây chính xác là hành vi mong muốn của "Clone" (có `sourceMonthId`) so với "Tạo tháng" (không có). Bug 100% nằm ở chỗ client luôn truyền `sourceMonthId` bất kể `cloneCurrent`, không phải ở use-case. Sửa đúng gốc chỉ cần đổi client: `cloneCurrent ? { sourceMonthId: selectedMonth.id } : {}`.
- Hệ quả nếu đúng: `plan.md` của US-006 xác định `schemaChangeRequired=false` và "File Sẽ Thay Đổi" chỉ gồm `components/BudgetApp.tsx` + `app/globals.css` — không đụng `server/budget/**`. Bài học chung: khi một use-case đã có rẽ nhánh đúng theo tham số optional, luôn kiểm tra phía gọi (Client Component) trước khi giả định cần sửa domain/application layer.
- Cái gì sẽ chứng minh nó sai: Nếu sau khi implement, kiểm chứng thủ công AC-02/AC-03/AC-07 vẫn cho kết quả giống nhau giữa hai nút dù client đã sửa đúng như trên, thì use-case thực ra có lỗi khác chưa phát hiện (vd `filter isFallback` sai) — cần đọc lại `create-month.ts` kỹ hơn.

### JDG-013 — Nút "Reset dữ liệu" gây lỗi 500 (vi phạm khóa ngoại) khi xóa tháng ngân sách — bug có sẵn, không liên quan US-006

- Ngày: 2026-08-10
- Status: Confirmed — tái hiện thật khi kiểm chứng thủ công US-006 trên `next dev`
- Độ tin cậy: Đã xác nhận từ knowledge (thao tác thật, không suy đoán)
- Feature liên quan: Không có (phát hiện tình cờ trong lúc kiểm chứng US-006, không thuộc phạm vi US-006)
- Bối cảnh: Trong lúc kiểm chứng AC-05 của US-006 (cần dựng lại dữ liệu sạch để test race tạo trùng tháng), bấm nút "Reset dữ liệu" (`resetAll` → `resetAllBudgetData` server action) gây lỗi console `PrismaClientKnownRequestError: Invalid prisma.monthBudget.deleteMany() invocation... Foreign key constraint violated on the foreign key`.
- Lập luận: Nhiều khả năng use-case xóa `MonthBudget` trước khi xóa hết `Category`/`Transaction` tham chiếu tới nó, hoặc cascade rule ở `schema.prisma` chưa đúng cho luồng xóa hàng loạt này. Chưa xác nhận nguyên nhân chính xác — cần đọc `server/budget/application/use-cases/reset-all-budget-data.ts` để kết luận.
- Hệ quả nếu đúng: Đây là defect có sẵn từ trước US-006 (không phải do thay đổi lần này gây ra — `create-month.ts` không bị chạm). Đã tách thành follow-up riêng qua `spawn_task` (title "Fix FK violation in resetAllBudgetData"), không sửa trong phạm vi US-006. Vì bug này, AC-05 của US-006 không dựng lại được kịch bản race 2 tab trực tiếp trong phiên kiểm chứng này — xác nhận thay thế bằng rà soát code (xem `docs/features/US-006-canh-bao-trung-thang/task.md` `TB-03`).
- Cái gì sẽ chứng minh nó sai: Nếu bấm "Reset dữ liệu" trên một bản dữ liệu test khác không lỗi, có thể lỗi chỉ xảy ra với một tổ hợp dữ liệu cụ thể (vd tháng có giao dịch thuộc danh mục fallback) — cần thử lại với dữ liệu tối giản hơn để xác nhận phạm vi chính xác của bug.

### JDG-010 — Sao chép tháng (`createMonth` với `sourceMonthId`) có nguy cơ nhân bản danh mục dự phòng "Chi tiêu khác" nếu không lọc, vi phạm quy tắc "chỉ tự sinh khi cần"

- Ngày: 2026-08-06
- Status: Confirmed — phát hiện bằng đối chiếu code thật, chưa từng xảy ra trong thực tế (field `isFallback` chưa tồn tại trước US-005)
- Độ tin cậy: Đã xác nhận từ knowledge (đối chiếu source thật, không suy đoán)
- Feature liên quan: US-005 (phát hiện khi `ssr-plan` khảo sát `server/budget/application/use-cases/create-month.ts`)
- Bối cảnh: `DEC-026` chốt "Chi tiêu khác" chỉ tự sinh khi thật sự cần (giao dịch không danh mục, hoặc danh mục cha bị xóa), không được có sẵn mặc định. `createMonth` khi tạo tháng mới bằng cách sao chép tháng nguồn (`sourceMonthId`, tính năng "sao chép tháng hiện tại") lấy nguyên `categoryRepository.findByMonth(sourceMonthId)` rồi copy toàn bộ danh mục (tên/loại/ngân sách/`locked`) sang tháng mới — không có bước loại trừ nào.
- Lập luận: Nếu tháng nguồn đã có "Chi tiêu khác" (vì trước đó Dylan từng xóa một danh mục có giao dịch hoặc ghi nhận không chọn danh mục), sao chép tháng đó sẽ tạo ra một bản sao "Chi tiêu khác" mới trong tháng đích — kể cả khi tháng đích chưa hề phát sinh giao dịch không danh mục nào — vi phạm trực tiếp `DEC-026`. Đây là một dạng lỗi "kế thừa gián tiếp" giống tinh thần `JDG-007` (thay đổi ở một chỗ làm lộ ra phụ thuộc ẩn ở chỗ khác), nhưng ở đây là lỗi tiềm ẩn được phát hiện trước khi triển khai, không phải sau khi đã sai.
- Hệ quả nếu đúng: `ssr-plan` của US-005 (`plan.md` mục 8, task `TB-06`) yêu cầu `create-month.ts` lọc bỏ danh mục có `isFallback=true` khỏi `sourceCategories` trước khi tạo `seedCategories`. Các function tương lai nào thêm loại danh mục "đặc biệt, chỉ tự sinh khi cần" khác cũng nên rà lại đường sao chép tháng theo cùng cách.
- Cái gì sẽ chứng minh nó sai: Nếu về sau xác nhận nghiệp vụ thực ra muốn "Chi tiêu khác" được kế thừa nguyên trạng khi sao chép tháng (kể cả khi tháng đích chưa cần) — cần đảo lại quyết định này và cập nhật `DEC-026`.

### JDG-009 — Nguyên nhân thật của JDG-008 là dev server cũ (tiến trình ngoài, không do phiên này khởi động) đã treo/chết, không phải giới hạn công cụ trình duyệt tự động với React 19

- Ngày: 2026-08-06
- Status: Confirmed — tái hiện thành công ngay sau khi khởi động lại dev server
- Độ tin cậy: Đã xác nhận từ knowledge (thử thật, không suy đoán)
- Feature liên quan: US-003 (phát hiện khi kiểm chứng thủ công TB-01 tại `/budget`)
- Bằng chứng: Dev server ở đầu phiên (tiến trình `node.exe` có sẵn trên cổng 3000, không do phiên này khởi động qua `preview_start`) không còn phản hồi (`curl` timeout). Sau khi dừng và khởi động lại đúng bằng `preview_start {"name": "dylan-plan-dev"}`, cùng thao tác `computer.type` gõ "cafe 45k" vào đúng ô nhập nhanh đó hoạt động đúng ngay lần đầu — `input.value` và React state (`quickText`) đồng bộ, hint "Tự nhận diện: 45.000 ₫ → Giải trí / cafe." hiện đúng, nút "Ghi nhận" bật, bấm vào tạo giao dịch thật thành công. Lặp lại thêm 1 lần nữa ("grab 20k") cũng thành công.
- Lập luận: `JDG-008` kết luận sai vì không kiểm tra khả năng dev server đơn giản là không phản hồi (trang có thể vẫn render HTML tĩnh cuối cùng đã cache trong trình duyệt, hoặc React đã hydrate nhưng mọi Server Action treo vô thời hạn, khiến `input.value` set được qua CDP nhưng bất kỳ tương tác nào phụ thuộc phản hồi từ server cũng không hoàn tất) — dễ nhầm với "React không nhận sự kiện tổng hợp". `computer.type` qua CDP hoạt động bình thường với input điều khiển bởi React 19 khi server thật sự chạy.
- Hệ quả nếu đúng: `JDG-008` bị bác bỏ (`Status: Refuted`) — không cần né việc gõ trực tiếp vào ô nhập text điều khiển bởi React trong dự án này nữa. Bài học giữ lại: trước khi kết luận "công cụ không mô phỏng được sự kiện", phải xác nhận dev server còn phản hồi thật (`curl`/gọi lệnh đọc network) trước khi đổ lỗi cho tầng tương tác trình duyệt.
- Cái gì sẽ chứng minh nó sai: Nếu một lần thử sau, với dev server xác nhận đang chạy khỏe mạnh, vẫn tái hiện được lỗi "DOM đổi nhưng React state không nhận" — khi đó cần điều tra lại theo hướng ban đầu của `JDG-008`.

### JDG-008 — Công cụ trình duyệt tự động không mô phỏng được sự kiện nhập liệu cho input điều khiển bởi React 19 (KẾT LUẬN SAI, xem `JDG-009`)

- Ngày: 2026-08-05
- Status: Refuted — xem `JDG-009` (2026-08-06): nguyên nhân thật là dev server cũ đã treo, không phải giới hạn công cụ/React
- Độ tin cậy: Đã xác nhận từ knowledge (thử thật, không suy đoán) — nhưng thiếu một bước kiểm tra quan trọng (xác nhận server còn sống) nên kết luận sai hướng
- Feature liên quan: US-002 (phát hiện khi kiểm chứng thủ công ô "Nhập nhanh chi tiêu" tại `/budget` qua công cụ trình duyệt tự động)
- Bằng chứng: Thử lần lượt (1) `computer.type` gõ nguyên chuỗi, (2) `computer.key` gõ từng ký tự, (3) `form_input`, (4) dispatch sự kiện `input` thủ công qua `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set` kèm `_valueTracker` — cả 4 cách đều khiến DOM `input.value` đổi đúng nhưng React state không đổi. Tại thời điểm đó không kiểm tra dev server có còn phản hồi hay không.
- Lập luận (đã bác bỏ): Từng cho rằng React 19 đổi cách gắn listener cho controlled input khiến kỹ thuật mô phỏng cũ không còn tương thích.
- Hệ quả: Đừng áp dụng hướng xử lý ở bản ghi này (né gõ text, chỉ dùng dropdown/button/link) — xem hướng đúng ở `JDG-009`.
- Cái gì đã chứng minh nó sai: `JDG-009`.

### JDG-007 — Khi tách một khu vực UI ra route riêng, phải rà soát các chỉ số dẫn xuất (derived) bị lồng ghép hiển thị ở màn hình khác trước khi chốt "không còn hiển thị nội dung X ở nơi cũ"

- Ngày: 2026-08-05
- Status: Confirmed — phát hiện thật bằng đối chiếu code, đã chốt hướng xử lý qua dialog (`DEC-052`)
- Độ tin cậy: Đã xác nhận từ knowledge (đối chiếu source thật, không suy đoán)
- Feature liên quan: US-002
- Bối cảnh: Spec US-002 (bản nháp) chốt "Tổng quan không còn hiển thị nội dung Thu chi" (`DEC-050`) dựa trên mô tả cấp cao (khối quản lý Thu chi: bảng danh mục, nhập nhanh...). `ba-expert` đối chiếu `components/DylanPlanApp.tsx` dòng ~504-508/~595 mới phát hiện khối "Tổng quan" (4 thẻ KPI) cũng hiển thị ở cả tab Tổng quan lẫn tab Thu chi, và một trong 4 thẻ ("Còn lại tháng này") tính trực tiếp từ số liệu Thu chi (`totals.remaining`) — một điểm dữ liệu Thu chi "ẩn" mà bản nháp spec ban đầu bỏ sót vì không đối chiếu tới mức chi tiết đó.
- Lập luận: Khi một khu vực nghiệp vụ lớn (Thu chi) được tách khỏi shell chung, các chỉ số tổng hợp/KPI nằm ở khu vực "Tổng quan" (hoặc dashboard chung) thường âm thầm phụ thuộc dữ liệu của khu vực đang tách, vì chúng được viết như một phép tính dùng chung (`totals.remaining`) chứ không phải một bản sao dữ liệu độc lập. Chỉ đọc mô tả nghiệp vụ cấp cao (tên các khối UI) không đủ để phát hiện phụ thuộc này — cần đối chiếu code thật ở mức biến/điều kiện render.
- Hệ quả nếu đúng: Từ nay, khi `ssr-ba`/`ba-expert` viết spec cho một requirement "tách route/module ra riêng", phải chủ động tìm mọi nơi khác trong source hiển thị số liệu tính từ dữ liệu của module đang tách (không chỉ khối nội dung chính), trước khi chốt "không còn hiển thị" — nếu không sẽ để lọt mâu thuẫn giữa quyết định phạm vi và Screen Element/AC thực tế, chỉ phát hiện được ở vòng review sau.
- Cái gì sẽ chứng minh nó sai: Nếu về sau xác nhận các dashboard/overview trong dự án này luôn tính KPI từ bản sao dữ liệu riêng (không share biến tính toán trực tiếp với module nguồn), rủi ro này không còn xảy ra và bước rà soát thêm này có thể bỏ qua cho các US tách-route tương lai.

### JDG-006 — Phát hiện xung đột sửa đồng thời không nhất thiết cần cột `updatedAt`/version — so khớp toàn bộ giá trị hiện có với giá trị client đã tải là đủ khi bảng chưa cần optimistic locking tổng quát

- Ngày: 2026-08-05
- Status: Confirmed — đã kiểm chứng bằng thao tác thật (giả lập một thiết bị khác xóa thẳng bản ghi trong `prisma/dev.db` bằng script Prisma trong lúc form Sửa đang mở trên `next dev`, bấm Lưu → đúng thông báo xung đột, DB không tạo lại bản ghi đã xóa — xem `docs/features/US-004-sua-xoa-tung-giao-dich/task.md` TB-08)
- Độ tin cậy: Đã xác nhận từ knowledge (chạy thật, không suy đoán)
- Feature liên quan: US-004
- Bối cảnh: Spec US-004 (`DEC-048`) yêu cầu chặn lưu và báo lỗi nếu giao dịch đang sửa đã bị đổi/xóa từ tab/thiết bị khác — một dạng optimistic concurrency control. Cách chuẩn thường dùng là thêm cột `updatedAt`/version rồi so sánh, nhưng `Transaction` model (từ US-001) không có cột này, và spec mục 13 đã chốt "Không cần đổi cấu trúc dữ liệu" trước khi `DEC-048` phát sinh.
- Lập luận: Vì client luôn tải đủ `TransactionSnapshot` (toàn bộ trường hiển thị được) trước khi vào chế độ sửa, use-case có thể nhận thêm một object `expected` (chính snapshot đó) trong request, đọc bản ghi hiện tại bằng `findById`, và so khớp **toàn bộ trường** thay vì một cột version riêng. Không tìm thấy bản ghi (đã xóa) hoặc bất kỳ trường nào lệch (đã sửa) đều coi là xung đột. Cách này tương đương optimistic locking về mặt hiệu quả nghiệp vụ mà không cần đổi schema — đánh đổi là chi phí so sánh nhiều trường hơn một cột version, nhưng ở quy mô single-user (DEC-004), không đáng kể.
- Hệ quả nếu đúng: `ssr-plan` của US-004 dùng cách này thay vì đề nghị `ssr-data` thêm cột `updatedAt`. Các function tương lai cần optimistic concurrency trên bảng chưa có version column có thể áp dụng cùng mẫu này thay vì mặc định đòi đổi schema trước.
- Cái gì sẽ chứng minh nó sai: Nếu khi triển khai thật phát hiện so khớp toàn trường bị false-positive (vd lệch định dạng ngày giữa client/server dù nội dung giống nhau), hoặc chi phí so sánh trở thành vấn đề hiệu năng thực sự — khi đó cần quay lại đề xuất thêm cột version qua `ssr-data`.

### JDG-005 — `.ssr-kit.env` của dự án thiếu biến cho cấu trúc BA wiki nested; 10/11 US wiki vẫn ở dạng phẳng, không đúng chuẩn kit hiện tại

- Ngày: 2026-08-05
- Status: Confirmed — hook chặn thật khi thử ghi trực tiếp
- Độ tin cậy: Đã xác nhận từ knowledge (lỗi hook thật, không suy đoán)
- Feature liên quan: US-004 (phát hiện khi `ssr-ingest mode=ingest` chạy cho US-004)
- Bằng chứng: Thử ghi `docs/kb/ba/wiki/US-004-sua-xoa-tung-giao-dich.md` (file phẳng đã tồn tại từ trước, do `ssr-raw` tạo 2026-08-03) trả về lỗi hook `SSR-E010` — "mang mã US-### nhưng nằm ngoài mọi thư mục artifact đã cấu hình". `.ssr-kit.env` chỉ khai `SSR_BA_KB_WIKI=docs/kb/ba/wiki` (phẳng), không có `SSR_BA_WIKI_INGESTION`/`SSR_BA_WIKI_KNOWLEDGE`/`SSR_BA_WIKI_DELIVERY`/`SSR_BA_WIKI_GOVERNANCE`, cũng không có `SSR_BACKLOG` — trong khi kit-level `memory/rules.md` (R3.1, ownership table) và toàn bộ skill `ssr-ingest`/`ssr-ba` mô tả cấu trúc nested bắt buộc (`indexes/`, `knowledge/`, `delivery/`, `ingestion/`, `data/`, `governance/`, `reports/` dưới `SSR_BA_KB_WIKI`). 10 trang wiki phẳng US-001, US-002, US-003, US-005..US-011 (tạo trước khi hook được siết) vẫn tồn tại và hoạt động — US-001/US-003 đã `Delivered` thành công dùng đúng các trang phẳng này.
- Lập luận: Dự án được khởi tạo (hoặc `.ssr-kit.env` được copy) từ một bản kit cũ hơn, dùng mô hình wiki đơn giản (1 file/function). Bản kit hiện cài (2.6.0) đã nâng cấp lên mô hình "LLM Wiki Template Catalog" đa trang liên kết, và hook `guard-artifact-path` đã được cập nhật theo mô hình mới — nhưng `.ssr-kit.env` của dự án đích chưa được đồng bộ theo. Đây là dạng lệch cấu hình giống `DEC-041` (layout `server/`) nhưng ở phía BA thay vì DEV.
- Hệ quả nếu đúng: Với US-004, đã tạo cấu trúc nested tối thiểu cần thiết (feature, feature-summary, pbi rỗng, source-record, 1 epic `EPC-001`, 1 entity `ENT-001`, 5 business-rule `BR-001..005`) suy trực tiếp từ ownership table trong `memory/rules.md`, không đoán tùy ý. 10 US còn lại **chưa** được migrate — vẫn đọc được qua trang phẳng cũ nhưng `ssr-ingest`/`ssr-ba` cho các US đó sẽ gặp lại đúng lỗi này khi tới lượt, trừ khi user cập nhật `.ssr-kit.env` và quyết định có migrate toàn bộ hay không. Không tự ý migrate 10 US còn lại trong lượt này vì ngoài phạm vi được giao (chỉ US-004).
- Cái gì sẽ chứng minh nó sai: Nếu user xác nhận `.ssr-kit.env` cố tình giữ mô hình phẳng cũ (không nâng cấp lên kit 2.6.0 đầy đủ) và hook chặn ở trên là một lỗi cấu hình hook cần nới lỏng lại — khi đó nhận định này cần đảo ngược, và cấu trúc nested vừa tạo cho US-004 nên được gỡ bỏ để quay lại đồng nhất với 10 US kia.

### JDG-004 — So khớp chuỗi tiếng Việt bằng `.includes()`/regex phải chuẩn hóa Unicode NFC trước, nếu không sẽ lặng lẽ sai khi input ở dạng NFD

- Ngày: 2026-08-05
- Status: Confirmed — đã tái hiện bằng script và bằng thao tác thật trên UI
- Độ tin cậy: Đã xác nhận từ knowledge (chạy thật, không suy đoán)
- Feature liên quan: US-001 (và mọi function tương lai có so khớp từ khóa tiếng Việt do người dùng gõ)
- Bằng chứng: `"tiền nhà".normalize("NFD")` cho chuỗi 11 code unit (dùng dấu tổ hợp rời `U+0301`/`U+0300`...) khác hẳn dạng NFC 8 code unit; `("... " + nfd + " 50k").toLowerCase().includes("tiền nhà")` (từ khóa viết trong source, mặc định NFC) trả về `false` dù hai chuỗi hiển thị giống hệt nhau. Tái hiện được lỗi thật: nhập "tiền nhà 50k" ở dạng NFD khiến `inferredQuickCategory` không khớp `quickRules`, giao dịch bị gán nhầm sang danh mục đang chọn trước đó thay vì "Tiền nhà", nên "Chi thực tế" của "Tiền nhà" không tăng — đúng như user report.
- Lập luận: Một số bàn phím/IME/hệ điều hành (đặc biệt phổ biến trên macOS, một số bộ gõ third-party trên Windows) sinh ra chuỗi tiếng Việt ở dạng NFD thay vì NFC. `String.prototype.includes()` và regex JavaScript so khớp theo code unit thô, không tự động chuẩn hóa Unicode, nên hai chuỗi "giống hệt khi hiển thị" có thể không khớp nhau.
- Hệ quả nếu đúng: Mọi chỗ so khớp chuỗi có dấu tiếng Việt do người dùng nhập (không phải hằng số nội bộ) phải gọi `.normalize("NFC")` (hoặc "NFD" nhất quán) trên cả hai vế trước khi so sánh/`.includes()`/regex. Đã sửa 3 điểm trong `components/DylanPlanApp.tsx` (`extractAmount`, `inferredQuickCategory`, `onChange` ô nhập nhanh — xem `docs/features/US-001-luu-tru-chi-tieu-ben-vung/task.md` mục 8, defect D-02). Các function tương lai có input tự do dạng text tiếng Việt (vd tìm kiếm, gợi ý, chặn trùng tên ở US-010) nên áp dụng cùng quy tắc ngay từ đầu.
- Cái gì sẽ chứng minh nó sai: Nếu xác nhận được toàn bộ nguồn nhập liệu thực tế (trình duyệt, hệ điều hành) của Dylan luôn sinh ra text ở dạng NFC (khó xảy ra vì phụ thuộc thiết bị/IME của Dylan, không kiểm soát được từ phía ứng dụng).

### JDG-003 — Prisma 7 trong dự án này dùng `prisma.config.ts`, generator `prisma-client` mới, và `file:` URL resolve theo thư mục làm việc chứ không theo vị trí `schema.prisma`

- Ngày: 2026-08-03
- Status: Confirmed — đã tự kiểm chứng bằng cách chạy thật
- Độ tin cậy: Đã xác nhận từ knowledge (chạy lệnh thật, không suy đoán)
- Feature liên quan: US-001
- Bằng chứng: `npx prisma init --datasource-provider sqlite` (Prisma 7.9.1) sinh `prisma.config.ts` (đọc `DATABASE_URL` qua `dotenv/config`) và `generator client { provider = "prisma-client"; output = "../generated/prisma" }` — khác với `prisma-client-js` mặc định ở các bản Prisma cũ hơn. Chạy `prisma migrate dev` với `DATABASE_URL="file:./dev.db"` (giá trị mặc định `prisma init` sinh ra) tạo `dev.db` tại **gốc dự án**, không phải `prisma/dev.db` như kỳ vọng.
- Lập luận: `prisma.config.ts` truyền `datasource.url` từ biến môi trường một cách tường minh, và Prisma CLI resolve `file:` URL tương đối theo thư mục tiến trình đang chạy (project root khi gọi qua `npm`/`npx`), không còn tương đối theo vị trí file `schema.prisma` như hành vi ở các bản Prisma cũ hơn dùng `datasource db { url = env("DATABASE_URL") }` trực tiếp trong schema.
- Hệ quả nếu đúng: Mọi lần `ssr-data` khởi tạo Prisma lần đầu trong dự án này (hoặc dự án tương tự dùng Prisma 7+) phải tự sửa `DATABASE_URL` trong `.env` thành `file:./prisma/dev.db` (đường dẫn tính từ gốc dự án) sau khi `prisma init`, thay vì tin giá trị mặc định; và import Prisma Client phải trỏ tới `generated/prisma` (theo `output` trong generator), không phải `@prisma/client` trực tiếp.
- Cái gì sẽ chứng minh nó sai: Nếu một bản Prisma 7.x sau này đổi lại hành vi resolve `file:` URL theo vị trí `schema.prisma`, hoặc đổi generator mặc định về `prisma-client-js`, nhận định này cần cập nhật lại theo phiên bản đang cài (`prisma --version`).

### JDG-002 — Dự án chưa cài Prisma và chưa có framework test nào

- Ngày: 2026-08-03
- Status: Active
- Độ tin cậy: Đã xác nhận từ knowledge
- Feature liên quan: US-001
- Bằng chứng: `package.json` — `dependencies` chỉ có `lucide-react`, `next`, `react`, `react-dom`; `devDependencies` không có `prisma`, `@prisma/client`, `vitest`, hay bất kỳ framework test nào, dù `.ssr-kit.env` đã khai `SSR_CMD_TEST=rtk vitest run` và `SSR_CMD_PRISMA_*`.
- Lập luận: Kit giả định Prisma và một bộ lệnh verification đã sẵn sàng; thực tế dự án `DylanPlan` mới chỉ dùng Next.js App Router thuần, chưa từng chạm tới phần lưu trữ dữ liệu hay kiểm thử tự động.
- Hệ quả nếu đúng: Task đầu tiên của US-001 phải cài `prisma` + `@prisma/client` trước khi chạy bất kỳ lệnh `SSR_CMD_PRISMA_*` nào; lệnh `SSR_CMD_TEST` sẽ thất bại "command not found" cho tới khi có task riêng cài đặt framework test — không tự ý cài thêm ngoài phạm vi được giao, ghi nhận là gap đã biết trong `report.md` thay vì che giấu.
- Cái gì sẽ chứng minh nó sai: Nếu một lần chạy `rtk pnpm install` sau đó cho thấy `prisma`/`vitest` đã có sẵn trong `node_modules` (vd do lockfile chưa đồng bộ với `package.json`), nhận định này cần thu hẹp lại.

### JDG-030 — Gap gốc của US-007 (xu hướng chỉ tính trên state trình duyệt) đã tự động được giải quyết bởi US-001, không cần code mới

- Ngày: 2026-08-21
- Status: Confirmed (2026-08-21) — kiểm chứng thật ở `TB-01`/`TB-02`: `curl` thật tới `/budget` trả đúng 9 cột biểu đồ "Xu hướng", khớp 1:1 với 9 dòng `MonthBudget` truy vấn trực tiếp `prisma/dev.db`; không có `.slice(`/`take:`/`LIMIT` nào trong toàn bộ chuỗi entry → persistence
- Độ tin cậy: Đã xác nhận từ knowledge (khảo sát source trực tiếp ở `ssr-plan`)
- Feature liên quan: US-007
- Bằng chứng: `server/budget/infrastructure/repositories/month-budget-prisma-repository.ts` — `findAll()` gọi `prisma.monthBudget.findMany()` không `where`/`take`; `server/budget/domain/services/budget-snapshot-service.ts` gộp toàn bộ tháng vào `BudgetSnapshot` không lọc; `components/BudgetApp.tsx` state `months` khởi tạo trực tiếp từ `initialBudget.months` (prop từ `getBudgetSnapshot()`), biểu đồ "Xu hướng" (dòng ~1116-1134) lặp qua toàn bộ `months` không cắt bớt.
- Lập luận: Raw `US-007` được ghi trước khi `US-001` triển khai, mô tả đúng thực trạng lúc đó (`localStorage`). Sau khi `US-001` chuyển `MonthBudget` sang Prisma/SQLite và `app/budget/page.tsx` (US-002) luôn gọi lại `getBudgetSnapshot()` từ server mỗi lần render (không đọc `localStorage`), toàn bộ chuỗi entry → persistence của biểu đồ "Xu hướng" đã tự động thỏa đúng yêu cầu "toàn bộ lịch sử đã lưu" như một hệ quả kiến trúc, không phải một tính năng cần code riêng.
- Hệ quả nếu đúng: `ssr-breaker`/`ssr-dev` của US-007 chỉ cần một task verification (xác nhận + khóa hành vi bằng bằng chứng), không cần task sửa code nào; các requirement khác có gap tương tự (mô tả hành vi trước `US-001`) nên được `ssr-plan` khảo sát kỹ source hiện tại trước khi giả định cần code mới — không nên máy móc suy ra "có US = có code phải viết".
- Cái gì sẽ chứng minh nó sai: Nếu `ssr-dev`/`ssr-review` phát hiện một đường dẫn khác (vd một bản build/cache tĩnh, một biến môi trường giới hạn số tháng) khiến biểu đồ "Xu hướng" thực tế bị giới hạn dù code không thể hiện điều đó, nhận định này cần thu hẹp lại và bổ sung code sửa.

### JDG-031 — Gap gốc của US-008 (xuất JSON từ state trình duyệt) cũng đã tự động được giải quyết bởi US-001, cùng dạng với US-007

- Ngày: 2026-08-21
- Status: Confirmed (2026-08-21) — kiểm chứng thật ở `TB-01`/`TB-02`: DB có 2 `PurchaseItem` ở tháng khác tháng hiện tại (`2026-09`, `2026-10`); `curl` payload HTML thật từ `/budget` chứa đủ cả 2 id lẫn tên, xác nhận `initialBudget`/state `months` không lọc theo tháng đang xem
- Độ tin cậy: Đã xác nhận từ knowledge (khảo sát source trực tiếp ở `ssr-plan`)
- Feature liên quan: US-008
- Bằng chứng: `components/BudgetApp.tsx` — `exportData()` (dòng 558-566) đóng gói `JSON.stringify({ months, selectedMonthId })`; `type MonthBudget = MonthBudgetSnapshot` (dòng 44) xác nhận state client dùng thẳng type server, không rút gọn field; `months` khởi tạo từ `initialBudget.months` (dòng 251), chính là `BudgetSnapshot.months` từ `getBudgetSnapshot()` — đã xác nhận không giới hạn ở `US-007`/`JDG-030`.
- Lập luận: Cùng nguyên nhân với `JDG-030` — raw `US-008` được ghi trước `US-001`. Sau khi `US-001`/`US-002` triển khai, `exportData()` không có bước đọc `localStorage` nào; nó đọc thẳng state đã DB-backed từ đầu. Vì `MonthBudget = MonthBudgetSnapshot` (không phải type rút gọn riêng cho UI), export tự động bao gồm đủ `categories`/`transactions`/`purchaseItems` cho mọi tháng, không riêng tháng đang xem.
- Hệ quả nếu đúng: `ssr-breaker`/`ssr-dev` của US-008 chỉ cần task verification, không cần task sửa code. Cùng với `JDG-030`, đây là mẫu hình thứ hai xác nhận: nhiều gap trong `docs/kb/ba/backlog.md` được ghi từ trước `US-001` có thể đã tự động được giải quyết — `ssr-plan` của các US còn lại thuộc diện này (đặc biệt US-011) nên khảo sát source kỹ trước khi giả định cần code mới.
- Cái gì sẽ chứng minh nó sai: Nếu `ssr-dev`/`ssr-review` phát hiện `exportData()` thực tế bỏ sót field nào đó (vd `purchaseItems` của tháng khác tháng hiện tại không được đưa vào JSON dù có trong state), nhận định này cần thu hẹp lại.

### JDG-001 — "Chi thực tế" của danh mục là số độc lập, không tự tính lại từ danh sách giao dịch

- Ngày: 2026-07-28
- Status: Confirmed — nâng thành `DEC-007` (2026-07-29): "Chi thực tế" sẽ là số suy ra (derived) từ tổng giao dịch, không lưu tay
- Độ tin cậy: Đã xác nhận từ knowledge
- Feature liên quan: Không (Business Flow, chưa có function)
- Bằng chứng: `components/DylanPlanApp.tsx` — `BudgetCategory.actual` được cộng dồn thủ công trong `addQuickExpense` và có thể bị sửa tay trực tiếp qua ô input trong `BudgetSections` (cột "Chi thực tế"), không có nơi nào tính lại `actual` bằng `sum(transactions.amount)`.
- Lập luận: Vì `actual` và `transactions` là hai state tách rời được cập nhật độc lập, bất kỳ thao tác nào chỉ sửa một bên (sửa tay ô "Chi thực tế", hoặc tương lai là sửa/xóa một giao dịch riêng lẻ) sẽ làm tổng hiển thị lệch với danh sách giao dịch chi tiết.
- Hệ quả nếu đúng: Khi thiết kế data model bền vững (US #1 trong Business Flow mục 7), nên cân nhắc tính `actual` như một giá trị suy ra (derived) từ tổng `Transaction` thay vì lưu trực tiếp trên `Category`, để tránh mang theo lỗi thiết kế này sang hệ thống mới.
- Cái gì sẽ chứng minh nó sai: Nếu `ssr-plan`/`ssr-data` xác nhận có lý do nghiệp vụ hợp lệ để `actual` là số nhập tay độc lập (vd cho phép điều chỉnh thủ công ngoài giao dịch), nhận định này cần được thu hẹp lại và ghi rõ ngoại lệ.
