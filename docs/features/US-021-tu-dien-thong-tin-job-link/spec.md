# Tự điền thông tin job từ link tin tuyển dụng

Status: Ready for DEV
Feature: US-021
Created: 2026-08-27
Updated: 2026-08-28
Raw Source: `docs/kb/ba/raw/US-021-tu-dien-thong-tin-job-link.md`
BA Wiki: `docs/kb/ba/wiki/knowledge/feature/US-021-tu-dien-thong-tin-job-link.md`
Owner: ssr-ba

> Viết cho người đọc không phải kỹ sư. Mỗi câu phải hiểu được ngay lần đọc đầu.
> Không dùng thuật ngữ kỹ thuật trong spec — nếu buộc phải nhắc, giải thích ngay tại chỗ bằng ngôn ngữ thường.

## 1. Mục Tiêu Nghiệp Vụ

Dylan theo dõi các job đang quan tâm và tình trạng nộp CV (hồ sơ xin việc) bằng bảng "Theo dõi CV ứng tuyển" trên trang Roadmap. Hiện tại khi thêm một job vào bảng này, Dylan phải gõ tay từng ô: Công ty, Ngày hết hạn, Platform (kênh tuyển dụng), Link — kể cả khi phần lớn thông tin đó đã nằm sẵn trong tin tuyển dụng mà Link trỏ tới. Việc này lặp lại cho mỗi job.

Sau thay đổi này, khi Dylan dán đường dẫn tin tuyển dụng vào ô Link của một dòng job và rời khỏi ô đó, hệ thống tự mở đường dẫn một lần và điền hộ Công ty, Platform và Ngày hết hạn vào các ô đang để trống của dòng job. Dylan chỉ cần xem lại, sửa nếu cần, và chọn Trạng thái.

Giá trị đo được: với một đường dẫn tin tuyển dụng từ kênh cho xem công khai (ví dụ ITViec, VietNamWork), sau khi Dylan dán Link và rời ô, ba ô Công ty / Platform / Ngày hết hạn của dòng job hiển thị giá trị mà không cần Dylan gõ thêm chữ nào vào ba ô đó.

## 2. Ngữ Cảnh Knowledge Base

| File | Nội dung được kế thừa |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-021-tu-dien-thong-tin-job-link.md`](../../kb/ba/wiki/knowledge/feature/US-021-tu-dien-thong-tin-job-link.md) | Mục tiêu, phạm vi, luồng nghiệp vụ, quan hệ với các chức năng US-018 và US-020 (US: viết tắt của "User Story", tiền tố mã chức năng của dự án) |
| [`docs/kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md`](../../kb/ba/wiki/knowledge/feature/US-018-theo-doi-cv-ung-tuyen.md) | Bảng "Theo dõi CV ứng tuyển", các ô của một dòng job, quy tắc bắt buộc nhập, cách sửa ngay tại dòng |
| [`docs/kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md`](../../kb/ba/wiki/knowledge/feature/US-020-lich-su-trang-thai-job.md) | Luật tự chuyển trạng thái "Expired" khi job quá Ngày hết hạn |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-031-tu-dien-job-tu-link.md`](../../kb/ba/wiki/knowledge/business-rule/BR-031-tu-dien-job-tu-link.md) | Rule: tự điền Công ty/Platform/Ngày hết hạn từ Link, chỉ điền ô trống, không chặn khi thiếu |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-032-suy-platform-tu-ten-mien.md`](../../kb/ba/wiki/knowledge/business-rule/BR-032-suy-platform-tu-ten-mien.md) | Rule: xác định Platform bằng tên miền của Link; không khớp thì để trống + báo nhẹ |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md`](../../kb/ba/wiki/knowledge/business-rule/BR-025-het-han-tu-dong-chuyen-expired.md) | Ngày hết hạn sai có thể làm job đang "Interested" bị tự chuyển "Expired" |
| [`docs/kb/ba/wiki/data/entity/ENT-004-job-ung-tuyen.md`](../../kb/ba/wiki/data/entity/ENT-004-job-ung-tuyen.md) | Các trường của một Job ứng tuyển |
| [`docs/kb/ba/wiki/data/entity/ENT-005-platform-tuyen-dung.md`](../../kb/ba/wiki/data/entity/ENT-005-platform-tuyen-dung.md) | Platform là danh sách kênh Dylan tự quản lý, 3 kênh mặc định |

Memory đã đối chiếu: `rules.md`, `language.md`, `decisions.md`, `glossary.md`. Các chức năng khác được nhắc trong spec dùng tiền tố US (viết tắt của "User Story"); các quyết định đã chốt với user mang mã DEC (viết tắt của "Decision"). Các quyết định liên quan: `DEC-004`, `DEC-086`, `DEC-088`, `DEC-089`, `DEC-111`, `DEC-112`, `DEC-113`, `DEC-114`, `DEC-115`, `DEC-116`, `DEC-117`, `DEC-118`, `DEC-119` (Ngày hết hạn của job **không bắt buộc**, chốt cho chức năng US-018 ngày 2026-08-27), `DEC-120`, `DEC-121`, `DEC-122`, `DEC-123`, `DEC-124`, `DEC-125`, `DEC-126`.

## 3. Phạm Vi

- Khi Dylan nhập xong đường dẫn vào ô Link của một dòng job (lúc thêm job mới hoặc lúc sửa Link của job đã có), rời khỏi ô, và giá trị vừa nhập khác với giá trị đã đọc lần gần nhất cho dòng đó, hệ thống tự mở đường dẫn một lần. Bấm vào ô Link rồi rời đi mà không thay đổi nội dung thì hệ thống không đọc lại (`DEC-125`).
- Trong lúc mở đường dẫn, dòng job hiển thị dấu hiệu "Đang lấy thông tin...".
- Hệ thống xác định Platform bằng tên miền của đường dẫn: nếu tên miền *chứa* tên một kênh đang có trong danh sách (so không phân biệt chữ hoa/thường — ví dụ `careers.itviec.com` và `itviec.com.vn` đều khớp kênh "ITViec") thì tự chọn kênh đó; không khớp kênh nào, hoặc khớp nhiều kênh cùng lúc, thì để trống ô Platform (`DEC-124`).
- Hệ thống đọc phần thông tin công khai của trang: điền Công ty nếu lấy được; điền Ngày hết hạn chỉ khi trang ghi một ngày đầy đủ ngày-tháng-năm, đọc được chắc chắn (ví dụ "30/09/2026", "2026-09-30", "Hạn nộp: 30 tháng 9, 2026"). Không suy Ngày hết hạn từ dạng đếm ngược ("còn 5 ngày"), "tuyển gấp", hay khi trang chỉ có tháng/năm mà thiếu ngày (`DEC-117`, `DEC-124`).
- Hệ thống chỉ điền vào ô đang để trống; ô Dylan đã tự nhập thì giữ nguyên.
- Với mỗi ô trong ba ô (Công ty, Platform, Ngày hết hạn) không điền được, hệ thống hiện một thông báo nhẹ nêu tên ô đó và mời Dylan nhập tay. Việc lưu job không bị chặn.
- Áp dụng cho mọi đường dẫn, kể cả các kênh thường chặn truy cập tự động (ví dụ LinkedIn) — đọc được tới đâu điền tới đó.
- Máy chủ của ứng dụng tự mở và đọc trang; không gửi đường dẫn hay nội dung trang tới bất kỳ dịch vụ bên ngoài nào.

## 4. Ngoài Phạm Vi

- Thêm ô mới cho một dòng job (ví dụ ô "Vị trí ứng tuyển") — chỉ điền vào các ô đã có (`DEC-113`).
- Thay đổi cách lưu trữ dữ liệu Job ứng tuyển hoặc danh sách Platform (`DEC-113`).
- Ghi đè giá trị Dylan đã tự nhập bằng giá trị lấy từ đường dẫn (`DEC-116`).
- Tự thêm một kênh mới vào danh sách Platform, hoặc gộp vào một nhãn chung như "Khác", khi tên miền không khớp kênh nào (`DEC-118`).
- Đổi định dạng hoặc viết lại đường dẫn Dylan đã nhập vào ô Link — ô Link giữ đúng chữ Dylan gõ.
- Đăng nhập vào kênh tuyển dụng, hoặc lấy dữ liệu nằm sau lớp đăng nhập của kênh.
- Gửi đường dẫn hoặc nội dung trang tới một dịch vụ trích xuất bên ngoài (`DEC-121`).
- Ghi lại hoặc hiển thị dấu vết "ô này được điền tự động từ link" cho từng job (`DEC-122`).
- Đưa mảng theo dõi tuyển dụng vào Business Flow "Hệ Thống Quản Lý Chi Tiêu" (`DEC-111`, theo tiền lệ `DEC-088`).

## 5. Người Dùng Và Phân Quyền

| Vai trò | Được làm gì | Không được làm gì | Nguồn quyền |
| --- | --- | --- | --- |
| Dylan | Dán/sửa Link để hệ thống tự điền hộ; xem, sửa, giữ hoặc xóa các giá trị hệ thống vừa điền; lưu job như bình thường | Không có giới hạn mới — tính năng chỉ điền hộ các ô Dylan vốn đã tự sửa được ở US-018 | [`docs/memory/decisions.md#dec-004`](../../memory/decisions.md) |

Hệ thống chỉ phục vụ một mình Dylan — không có vai trò nào khác, không đăng nhập/phân quyền (`DEC-004`).

## 6. Luồng Nghiệp Vụ

1. Dylan bấm "+ Thêm job" để mở một dòng job mới, hoặc bấm vào ô Link của một job đã có để sửa.
2. Dylan dán hoặc gõ đường dẫn tin tuyển dụng vào ô Link rồi rời khỏi ô (bấm ra ngoài hoặc chuyển sang ô khác).
3. Nếu giá trị ô Link vừa thay đổi so với lần đọc gần nhất, dòng job hiển thị dấu hiệu "Đang lấy thông tin..." và hệ thống tự mở đường dẫn một lần. Nếu Dylan chỉ bấm vào ô Link rồi rời đi mà không sửa gì, hệ thống bỏ qua bước này (`DEC-125`).
4. Hệ thống xác định Platform theo tên miền của đường dẫn: nếu tên miền chứa tên một kênh đang có (không phân biệt hoa/thường) thì tự chọn kênh đó vào ô Platform (nếu ô đang trống); nếu không khớp kênh nào hoặc khớp nhiều kênh thì để trống.
5. Hệ thống đọc phần thông tin công khai của trang: điền Công ty vào ô Công ty (nếu ô đang trống và lấy được); điền Ngày hết hạn vào ô Ngày hết hạn (nếu ô đang trống và trang ghi một ngày đầy đủ ngày-tháng-năm, đọc được chắc chắn).
6. Dấu hiệu "Đang lấy thông tin..." biến mất. Với mỗi ô trong ba ô không điền được, hệ thống hiện một thông báo nhẹ nêu tên ô đó ("chưa lấy được Công ty — mời nhập tay", v.v.).
7. Dylan xem lại các ô vừa được điền, sửa nếu cần, bổ sung các ô còn trống, chọn Trạng thái, rồi lưu job như quy trình của US-018.

Trường hợp ngoại lệ:

| Tình huống | Người dùng thấy gì |
| --- | --- |
| Không có dữ liệu | Đường dẫn mở được nhưng trang không có tên công ty hay ngày hết hạn đọc được — ô Công ty và ô Ngày hết hạn để trống, mỗi ô kèm một thông báo nhẹ; ô Platform theo kết quả suy từ tên miền (điền nếu tên miền khớp một kênh, để trống kèm thông báo nhẹ nếu không khớp). Dylan nhập tay phần còn thiếu và vẫn lưu được job |
| Không đủ quyền | Không áp dụng — hệ thống chỉ có một người dùng (`DEC-004`) |
| Dữ liệu trùng | Không áp dụng — không có ràng buộc chặn trùng Công ty; nếu tên miền khớp nhiều kênh Platform cùng lúc thì để trống ô Platform và báo nhẹ như trường hợp không khớp |
| Hệ thống lỗi | Không mở được đường dẫn, hoặc mở quá mười giây chưa xong — hệ thống dừng chờ, dấu hiệu "Đang lấy thông tin..." biến mất. Ô Platform vẫn được suy từ tên miền của đường dẫn (bước này không cần mở trang): điền nếu tên miền khớp một kênh, để trống kèm thông báo nhẹ nếu không khớp. Ô Công ty và ô Ngày hết hạn giữ nguyên trạng thái trước đó, mỗi ô kèm một thông báo nhẹ; Dylan nhập tay phần còn thiếu và vẫn lưu được job |
| Đường dẫn Link sai định dạng | Ô Link không bắt đầu bằng `http://` hoặc `https://` — giữ nguyên hành vi của US-018: thao tác lưu bị chặn, thông báo lỗi định dạng hiện dưới ô Link (`DEC-086`); hệ thống không mở đường dẫn |
| Tên miền không khớp kênh Platform nào, hoặc khớp nhiều kênh cùng lúc | Ô Platform để trống, thông báo nhẹ "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới"; không có kênh mới nào được thêm vào danh sách, không tự chọn kênh nào (`DEC-118`, `DEC-124`) |
| Trang không ghi Ngày hết hạn dưới dạng ngày đầy đủ | Trang chỉ ghi kiểu "còn 5 ngày", "tuyển gấp", chỉ có tháng/năm, hoặc không có mục hạn nộp — ô Ngày hết hạn để trống, thông báo nhẹ "chưa lấy được Ngày hết hạn — mời chọn tay" (`DEC-117`, `DEC-124`) |
| Trang ghi một ngày hết hạn đầy đủ nhưng đã ở quá khứ | Hệ thống vẫn điền đúng ngày đó vào ô Ngày hết hạn; job mới đang "Interested" có thể bị tự chuyển "Expired" ở lần bảng tải lại kế tiếp theo luật `BR-025` (`US-020`). Dylan tự đổi lại trạng thái nếu vẫn muốn theo dõi (`DEC-126`) |
| Ô đã có giá trị Dylan nhập | Ô Công ty / Platform / Ngày hết hạn nào Dylan đã tự nhập thì giữ nguyên, hệ thống không đụng tới kể cả khi đọc ra giá trị khác (`DEC-116`) |

## 7. Tiêu Chí Chấp Nhận

| ID | Given (bối cảnh) | When (hành động) | Then (kết quả quan sát được) | Mockup |
| --- | --- | --- | --- | --- |
| AC-01 | Dylan đang thêm một job mới, cả ba ô Công ty, Platform, Ngày hết hạn còn trống; danh sách Platform có kênh "ITViec"; đường dẫn tin tuyển dụng có tên miền chứa "itviec.com" và trang cho xem công khai, ghi tên công ty "Tech Corp" và dòng "Hạn nộp: 30 tháng 9, 2026" | Dylan dán đường dẫn đó vào ô Link rồi bấm ra ngoài ô | Dòng job hiện "Đang lấy thông tin..." rồi tắt; ô Platform hiển thị "ITViec"; ô Công ty hiển thị "Tech Corp"; ô Ngày hết hạn hiển thị "30/09/2026"; không có thông báo nhẹ nào | Xem ASCII Mockup mục 8.1 |
| AC-02 | Dylan đang thêm một job mới, cả ba ô còn trống; danh sách Platform có kênh "LinkedIn"; đường dẫn có tên miền chứa "linkedin.com" nhưng trang chặn truy cập tự động (không đọc được nội dung) | Dylan dán đường dẫn đó vào ô Link rồi bấm ra ngoài ô | Ô Platform hiển thị "LinkedIn"; ô Công ty và ô Ngày hết hạn vẫn trống; hiện đúng hai thông báo nhẹ "chưa lấy được Công ty — mời nhập tay" và "chưa lấy được Ngày hết hạn — mời chọn tay" (không có thông báo nhẹ cho Platform); nút lưu job vẫn bấm được | Xem ASCII Mockup mục 8.1 |
| AC-03 | Dylan đang thêm một job mới, đã tự gõ "Công ty ABC" vào ô Công ty và tự chọn Platform "LinkedIn"; ô Ngày hết hạn còn trống; danh sách Platform cũng có kênh "ITViec"; đường dẫn có tên miền chứa "itviec.com", trang ghi tên công ty "ABC Vietnam JSC" và hạn nộp "15/10/2026" | Dylan dán đường dẫn vào ô Link rồi bấm ra ngoài ô | Ô Công ty vẫn hiển thị "Công ty ABC" đúng như Dylan gõ, không bị đổi thành "ABC Vietnam JSC"; ô Platform vẫn hiển thị "LinkedIn", không bị đổi thành "ITViec"; ô Ngày hết hạn hiển thị "15/10/2026" (được điền vì đang trống); không có thông báo nhẹ nào | Xem ASCII Mockup mục 8.1 |
| AC-04 | Dylan đang thêm một job mới, cả ba ô còn trống; danh sách Platform có kênh "ITViec"; đường dẫn có tên miền chứa "itviec.com", trang ghi tên công ty "Data Co" nhưng phần hạn nộp chỉ ghi "Còn 5 ngày để ứng tuyển" | Dylan dán đường dẫn vào ô Link rồi bấm ra ngoài ô | Ô Công ty hiển thị "Data Co"; ô Platform hiển thị "ITViec"; ô Ngày hết hạn vẫn trống; hiện đúng một thông báo nhẹ "chưa lấy được Ngày hết hạn — mời chọn tay" | Xem ASCII Mockup mục 8.1 |
| AC-05 | Dylan đang thêm một job mới, ô Platform còn trống; danh sách Platform có "ITViec", "LinkedIn", "VietNamWork"; đường dẫn thuộc một trang tuyển dụng riêng của công ty, tên miền không chứa tên kênh nào trong danh sách | Dylan dán đường dẫn vào ô Link rồi bấm ra ngoài ô | Ô Platform vẫn trống; hiện một thông báo nhẹ "chưa nhận ra Platform từ link — mời chọn hoặc thêm mới"; danh sách Platform vẫn đúng ba kênh cũ, không có kênh nào được thêm | Xem ASCII Mockup mục 8.1 |
| AC-06 | Dylan đang thêm một job mới, cả ba ô còn trống; đường dẫn hợp lệ, tên miền không chứa tên kênh Platform nào trong danh sách; máy chủ không mở được trang (trang không phản hồi trong vòng mười giây) | Dylan dán đường dẫn vào ô Link rồi bấm ra ngoài ô, sau đó gõ tên công ty, chọn một kênh Platform, rồi bấm lưu | Dấu hiệu "Đang lấy thông tin..." hiện rồi tắt sau khoảng mười giây; ngay sau đó cả ba ô Công ty, Platform, Ngày hết hạn vẫn trống; hiện ba thông báo nhẹ tương ứng; sau khi Dylan gõ tên công ty và chọn kênh rồi bấm lưu, một dòng job mới xuất hiện trên bảng với Công ty và Platform Dylan vừa nhập, ô Ngày hết hạn để trống | Xem ASCII Mockup mục 8.1 |
| AC-07 | Job "Cũ Corp" đã có trong bảng: ô Công ty và ô Platform đã có giá trị, ô Ngày hết hạn đang trống, ô Link đang là một đường dẫn cũ | Dylan bấm vào ô Link của job "Cũ Corp", xóa đường dẫn cũ, dán một đường dẫn tin tuyển dụng mới cho xem công khai (trang ghi hạn nộp "2026-10-15") rồi bấm ra ngoài ô | Dòng job "Cũ Corp" hiện "Đang lấy thông tin..." rồi tắt; ô Ngày hết hạn của job đó hiển thị "15/10/2026" (được điền vì đang trống); ô Công ty và ô Platform của job đó giữ nguyên giá trị cũ, không bị thay đổi | Xem ASCII Mockup mục 8.1 |
| AC-08 | Dylan đang thêm một job mới | Dylan gõ "itviec.com/jobs/abc" (thiếu `http://` hoặc `https://`) vào ô Link rồi bấm ra ngoài ô hoặc bấm lưu | Hệ thống không mở đường dẫn, không hiện "Đang lấy thông tin..."; giữ nguyên hành vi US-018: thao tác lưu bị chặn, thông báo lỗi định dạng hiện ngay dưới ô Link | Xem ASCII Mockup mục 8.1 |

Quy tắc:

- Given phải nêu vai trò người dùng và dữ liệu có sẵn, không viết "hệ thống hoạt động bình thường".
- Then phải là thứ nhìn thấy hoặc đo được, không viết "hệ thống xử lý đúng".
- Cột Mockup trỏ tới file trong `docs/mockups`. Chưa có mockup thật (ảnh/design) thì tham chiếu khối ASCII Mockup ở mục 8.
- Mỗi element ở mục 8 phải xuất hiện trong ít nhất một AC.

## 8. Screen Element

Liệt kê mọi thành phần màn hình mà requirement này chạm tới.

### 8.1. Bảng theo dõi CV ứng tuyển — `Trang Roadmap`

| ID | Element | Loại | Nhãn hiển thị | Nguồn dữ liệu | Ràng buộc / hành vi | Vai trò thấy được | AC | Liên kết PBI/US |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EL-01 | Ô "Link" của một dòng job | Input | "Link" | Link (Job ứng tuyển) | **Đổi hành vi so với US-018**. Vẫn là ô nhập chữ, vẫn bắt buộc và phải bắt đầu bằng `http://` hoặc `https://` (`DEC-086`). Thêm: khi Dylan rời khỏi ô, giá trị là một đường dẫn hợp lệ, **và giá trị đó khác với giá trị đã đọc lần gần nhất cho dòng job này**, hệ thống tự mở đường dẫn một lần để điền hộ Công ty, Platform, Ngày hết hạn (`BR-031`). Bấm vào ô rồi rời đi mà không sửa gì thì không đọc lại, không hiện "Đang lấy thông tin..." (`DEC-125`). Áp dụng cả lúc thêm job mới và lúc sửa Link của job đã có (`DEC-120`). Đường dẫn Dylan gõ được giữ nguyên, không bị viết lại. Sai định dạng thì không mở đường dẫn | Dylan | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-07, AC-08 | [`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) — `EL-05` (cột "Link") |
| EL-02 | Dấu hiệu "Đang lấy thông tin..." | Toast | "Đang lấy thông tin..." | — | **Element mới**. Hiện trên hoặc cạnh dòng job đang được đọc, ngay sau khi Dylan rời ô Link với đường dẫn hợp lệ. Tự biến mất khi việc đọc xong hoặc khi dừng chờ sau khoảng mười giây (`DEC-121`). Không chặn Dylan thao tác tiếp trên dòng job trong lúc hiện | Dylan | AC-01, AC-06, AC-07 | Không |
| EL-03 | Ô "Công ty" của một dòng job | Input | "Công ty" | Công ty (Job ứng tuyển) | **Đổi hành vi so với US-018**. Vẫn là ô nhập chữ, vẫn bắt buộc. Thêm: khi ô đang trống và hệ thống đọc được tên công ty từ đường dẫn ở EL-01, ô được điền giá trị đó. Ô đã có giá trị Dylan nhập thì giữ nguyên (`DEC-116`). Đọc không ra tên công ty thì ô giữ trống và hiện thông báo nhẹ ở EL-06 | Dylan | AC-01, AC-02, AC-03, AC-04, AC-06 | [`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) — `EL-02` (cột "Công ty") |
| EL-04 | Ô "Platform" của một dòng job | Dropdown | "Platform" | Platform (tham chiếu Platform tuyển dụng) | **Đổi hành vi so với US-018**. Vẫn là ô chọn kênh, vẫn bắt buộc, vẫn có mục "+ Thêm platform mới". Thêm: khi ô đang trống, hệ thống so tên miền của đường dẫn ở EL-01 với danh sách kênh đang có — nếu tên miền *chứa* tên đúng một kênh (so không phân biệt hoa/thường) thì tự chọn kênh đó; không khớp kênh nào, hoặc khớp nhiều kênh cùng lúc, thì để trống ô và hiện thông báo nhẹ ở EL-06 (`BR-032`, `DEC-118`, `DEC-124`). Hệ thống không tự thêm kênh mới vào danh sách. Ô đã có kênh Dylan chọn thì giữ nguyên (`DEC-116`). Tập giá trị: các kênh trong danh sách Platform (mặc định "ITViec", "LinkedIn", "VietNamWork"); không có giá trị mặc định khi ô trống | Dylan | AC-01, AC-02, AC-03, AC-05 | [`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) — `EL-04` (cột "Platform") |
| EL-05 | Ô "Ngày hết hạn" của một dòng job | Date picker | "Ngày hết hạn" | Ngày hết hạn (Job ứng tuyển) | **Đổi hành vi so với US-018**. Vẫn chọn qua lịch chọn ngày, hiển thị dạng ngày/tháng/năm. **Không còn bắt buộc** kể từ `DEC-119` (2026-08-27) — job không có Ngày hết hạn vẫn lưu được. Thêm: khi ô đang trống và trang ở đường dẫn EL-01 ghi một ngày đầy đủ ngày-tháng-năm đọc được chắc chắn (ví dụ "30/09/2026", "2026-09-30", "Hạn nộp: 30 tháng 9, 2026"), ô được điền ngày đó. Trang chỉ ghi kiểu tương đối ("còn N ngày"), "tuyển gấp", chỉ có tháng/năm mà thiếu ngày, hoặc không có mục hạn nộp thì ô giữ trống và hiện thông báo nhẹ ở EL-06 (`DEC-117`, `DEC-124`); Dylan có thể để trống luôn. Ô đã có ngày Dylan chọn thì giữ nguyên (`DEC-116`) | Dylan | AC-01, AC-03, AC-04, AC-07 | [`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) — `EL-03` (cột "Ngày hết hạn"); [`docs/features/US-020-lich-su-trang-thai-job/spec.md`](../US-020-lich-su-trang-thai-job/spec.md) — luật tự chuyển "Expired" chỉ chạy khi job có Ngày hết hạn (`DEC-119`) |
| EL-06 | Thông báo nhẹ trường chưa lấy được | Toast | ví dụ "chưa lấy được Công ty — mời nhập tay" | — | **Element mới**. Một thông báo nhẹ cho mỗi ô trong ba ô (Công ty, Platform, Ngày hết hạn) không điền được sau khi đọc xong đường dẫn. Nội dung nêu đúng tên ô và mời Dylan nhập tay. Tự biến mất sau vài giây, không chặn thao tác, không chặn việc lưu job (`DEC-114`). Không hiện thông báo cho ô mà Dylan đã tự nhập giá trị | Dylan | AC-02, AC-04, AC-05, AC-06 | Không |

**ASCII Mockup**

```text
+---------------------------------------------------------------------------------------------------+
| Theo dõi CV ứng tuyển                                                                              |
+---------------------------------------------------------------------------------------------------+
| Công ty      | Ngày hết hạn v| Platform    v | Link                    | Trạng thái  v| Ghi chú  | |
+---------------------------------------------------------------------------------------------------+
| [ABC Vietnam]| [30/09/2026]  | [ITViec    v] | https://itviec.com/j/12 | [Interested v]| -       |X|
|              |               |               |   (Đang lấy thông tin...)                            |
+---------------------------------------------------------------------------------------------------+
|                                                                                    [+ Thêm job]    |
+---------------------------------------------------------------------------------------------------+

Sau khi rời ô Link mà chỉ đọc được một phần:
+---------------------------------------------------------------------------------------------------+
| [ABC Vietnam]| [ (trống) ]   | [LinkedIn  v] | https://linkedin.com/j/9 | [Interested v]| -      |X|
+---------------------------------------------------------------------------------------------------+
   (!) chưa lấy được Ngày hết hạn — mời chọn tay
```

- Ô Link (`EL-01`) là nơi Dylan dán đường dẫn; rời ô kích hoạt việc đọc.
- Dòng chữ trong ngoặc "(Đang lấy thông tin...)" là dấu hiệu `EL-02`, hiện trong lúc đọc.
- Các ô trong ngoặc vuông `[...]` là Công ty (`EL-03`), Ngày hết hạn (`EL-05`), Platform (`EL-04`) — được điền sẵn khi đọc được, để trống khi không.
- Dòng bắt đầu bằng `(!)` là thông báo nhẹ `EL-06` cho ô không lấy được.
- Ký hiệu `v` ở tiêu đề cột và biểu tượng `X` cuối dòng giữ nguyên như US-018.

Quy tắc:

- Với `Table`: liệt kê từng `Column` thành dòng riêng, kèm thứ tự và cách sắp xếp mặc định. (Bảng "Theo dõi CV ứng tuyển" và các cột của nó đã được mô tả đầy đủ ở [`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) mục 8.1; spec này chỉ mô tả các ô có hành vi mới.)
- Với `Dropdown`: nêu rõ tập giá trị và giá trị mặc định.
- Với `Input`: nêu rõ bắt buộc hay không, định dạng, thông báo lỗi khi nhập sai.
- Cột Liên kết PBI (viết tắt của "Product Backlog Item", đơn vị công việc nhỏ nhất chuyển giao được) và US chỉ điền khi element dùng chung với function khác.
- Element bị **đổi hành vi** so với hiện tại đã ghi rõ ở cột ràng buộc.

## 9. Dữ Liệu, Báo Cáo, Export

| Thực thể / báo cáo | Thay đổi | Bắt buộc | Ghi chú lưu trữ |
| --- | --- | --- | --- |
| Job ứng tuyển | Không đổi | Không | Không thêm/sửa/xóa trường nào; hệ thống chỉ điền sẵn giá trị cho các ô Công ty, Platform, Ngày hết hạn trước khi Dylan lưu (`DEC-113`) |
| Platform tuyển dụng | Không đổi | Không | Chỉ đọc danh sách kênh để so khớp tên miền; không tạo kênh mới tự động (`DEC-118`) |

## 10. Phụ Thuộc

| Đối tượng | Loại | Chặn triển khai | Trạng thái |
| --- | --- | --- | --- |
| [`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) | Giao kèo | Không | Implemented (Delivered With Notes) |
| [`docs/features/US-020-lich-su-trang-thai-job/spec.md`](../US-020-lich-su-trang-thai-job/spec.md) | Quy tắc nghiệp vụ | Không | Implemented (Delivered With Notes) |

US-021 mở rộng bảng và các ô mà US-018 đã tạo và đã triển khai; không có gì trong US-018/US-020 đang ở trạng thái chưa xong để chặn US-021. Đã rà các spec còn lại trong `docs/features/` — không function nào khác dùng chung bảng "Theo dõi CV ứng tuyển" hay các ô của một dòng job.

## 11. Tác Động Tới Spec Khác

| Spec | Mục / AC bị ảnh hưởng | Element bị ảnh hưởng | Phải sửa ngay | Follow-up |
| --- | --- | --- | --- | --- |
| [`docs/features/US-018-theo-doi-cv-ung-tuyen/spec.md`](../US-018-theo-doi-cv-ung-tuyen/spec.md) | Mục 6 (luồng thêm/sửa job), mục 8.1 | `EL-02` (cột "Công ty"), `EL-03` (cột "Ngày hết hạn"), `EL-04` (cột "Platform"), `EL-05` (cột "Link") | Không | US-018 đã Delivered. Khi triển khai US-021, giữ nguyên toàn bộ ràng buộc bắt buộc nhập và validate định dạng Link của US-018; chỉ thêm bước tự điền. Ghi chú tham chiếu US-021 vào mục 11 của spec US-018 khi US-021 đạt `Ready for DEV` |
| [`docs/features/US-020-lich-su-trang-thai-job/spec.md`](../US-020-lich-su-trang-thai-job/spec.md) | Luật tự chuyển "Expired" theo Ngày hết hạn | Ô "Ngày hết hạn" của một dòng job | Không | Ngày hết hạn tự điền trở thành đầu vào của luật tự chuyển "Expired". `DEC-117` (chỉ điền khi trang ghi ngày cụ thể) là biện pháp giảm rủi ro điền sai ngày. Không cần đổi spec US-020 |

## 12. Cập Nhật Knowledge Base

| File | Nội dung cập nhật |
| --- | --- |
| [`docs/kb/ba/wiki/knowledge/feature/US-021-tu-dien-thong-tin-job-link.md`](../../kb/ba/wiki/knowledge/feature/US-021-tu-dien-thong-tin-job-link.md) | Nâng `Status` lên `Active` khi spec đạt `Ready for DEV` (qua `ssr-ingest mode=sync`); cập nhật luồng và ngoại lệ cho khớp mục 6 spec này |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-031-tu-dien-job-tu-link.md`](../../kb/ba/wiki/knowledge/business-rule/BR-031-tu-dien-job-tu-link.md) | Sửa ngoại lệ "job đã lưu": việc đọc lại tự chạy ngay khi Dylan sửa xong ô Link, không cần thao tác chủ động (`DEC-120`); chỉ kích hoạt khi giá trị Link đổi (`DEC-125`); bổ sung thời gian chờ mười giây (`DEC-121`); định nghĩa "ngày hết hạn đầy đủ" (`DEC-124`); ngày quá khứ vẫn điền (`DEC-126`) |
| [`docs/kb/ba/wiki/knowledge/business-rule/BR-032-suy-platform-tu-ten-mien.md`](../../kb/ba/wiki/knowledge/business-rule/BR-032-suy-platform-tu-ten-mien.md) | Chốt cách khớp: tên miền *chứa* tên kênh (không phân biệt hoa/thường); khớp nhiều kênh cùng lúc thì để trống (`DEC-124`) |
| [`docs/kb/ba/wiki/delivery/pbi/US-021-tu-dien-thong-tin-job-link.md`](../../kb/ba/wiki/delivery/pbi/US-021-tu-dien-thong-tin-job-link.md) | Điền đầy đủ User Story và 8 AC từ spec này (qua `ssr-ingest mode=sync`) |

Memory: `DEC-120` (đọc lại tự động cả khi sửa link job đã lưu), `DEC-121` (thời gian chờ mười giây, thử một lần), `DEC-122` (máy chủ ứng dụng tự đọc, không gửi ra dịch vụ ngoài), `DEC-123` (không lưu/hiển thị dấu vết tự điền), `DEC-124` (chi tiết quy tắc khớp tên miền và định nghĩa "ngày đầy đủ"), `DEC-125` (chỉ đọc khi giá trị Link thay đổi), `DEC-126` (ngày hết hạn đã qua vẫn tự điền) — đã ghi vào `docs/memory/decisions.md`. Liên quan: `DEC-119` (Ngày hết hạn của job không bắt buộc, chốt cho US-018 ngày 2026-08-27). Nhận định về giá trị thực của tính năng: `docs/memory/judgement-log.md#jdg-032`.

## 13. Handoff Cho DEV

| Câu hỏi | Trả lời |
| --- | --- |
| Màn hình nào bị chạm | Trang Roadmap — bảng "Theo dõi CV ứng tuyển", các ô Link, Công ty, Platform, Ngày hết hạn của một dòng job (thêm mới và sửa) |
| Thực thể dữ liệu nào bị chạm | Job ứng tuyển (chỉ điền sẵn giá trị, không đổi cấu trúc), Platform tuyển dụng (chỉ đọc danh sách) |
| Cần thay đổi cấu trúc dữ liệu | Không (`DEC-113`) |
| Cần cập nhật sơ đồ dữ liệu (DBML) | Không |
| Có ảnh hưởng báo cáo/export | Không |

## 14. Giả Định Và Câu Hỏi Mở

| # | Nội dung | Loại | Ảnh hưởng nếu sai |
| --- | --- | --- | --- |
| A1 | Việc đọc đường dẫn chạy ngay khi Dylan rời ô Link (không phải sau khi lưu, không cần nút riêng) | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-115`) | Nếu sai, cần đổi thời điểm kích hoạt ở mục 6, AC-01, EL-01, EL-02 |
| A2 | Việc đọc lại tự chạy cả khi Dylan sửa Link của một job đã lưu, giống lúc thêm mới | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-120`) | Nếu sai (Dylan muốn có nút riêng cho job đã lưu), cần đổi AC-07 và ràng buộc ở EL-01 |
| A3 | Hệ thống chỉ điền vào ô đang trống, không ghi đè giá trị Dylan đã nhập, cho cả ba ô | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-116`) | Nếu sai, cần đổi AC-03 và ràng buộc ở EL-03, EL-04, EL-05 |
| A4 | Ngày hết hạn chỉ được điền khi trang ghi rõ một ngày cụ thể; kiểu tương đối hoặc thiếu thì để trống + báo nhẹ | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-117`) | Nếu sai, cần đổi AC-04 và ràng buộc ở EL-05 |
| A5 | Tên miền không khớp kênh Platform nào thì để trống ô Platform + báo nhẹ; không tự thêm kênh, không dùng nhãn "Khác" | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-118`) | Nếu sai, cần đổi AC-05 và ràng buộc ở EL-04 |
| A6 | Thời gian chờ khi mở đường dẫn là khoảng mười giây, thử một lần; quá hạn coi như đọc thất bại | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-121`) | Nếu sai, cần đổi con số ở mục 6 (ngoại lệ hệ thống lỗi), AC-06, EL-02 |
| A7 | Máy chủ của ứng dụng tự mở và đọc trang; không gửi đường dẫn hay nội dung tới dịch vụ bên ngoài nào | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-122`) | Nếu sai (cho phép dùng dịch vụ ngoài), cần bổ sung ghi chú riêng tư ở mục 3, 4 và một câu hỏi cho `ssr-plan` |
| A8 | Không cần ghi lại hay hiển thị dấu vết "ô này được điền tự động từ link" | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-123`) | Nếu sai, cần thêm một element hiển thị dấu vết ở mục 8 và AC tương ứng |
| A9 | Suy Platform khớp lỏng: tên miền của đường dẫn *chứa* tên một kênh (không phân biệt hoa/thường) thì khớp kênh đó; khớp nhiều kênh cùng lúc thì để trống + báo nhẹ | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-124`) | Nếu sai (muốn khớp chặt theo tên miền chính đúng), cần đổi mục 3, 6, AC-01, AC-05, EL-04 |
| A10 | Ngày hết hạn chỉ được tự điền khi trang ghi một ngày đầy đủ ngày-tháng-năm đọc được chắc chắn; không suy từ "còn N ngày", "tuyển gấp", hay chỉ có tháng/năm | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-124`) | Nếu sai (muốn suy cả dạng đếm ngược), cần đổi AC-04, EL-05 và cân nhắc lại rủi ro tự chuyển "Expired" sai (`BR-025`) |
| A11 | Không cần tiêu chí chấp nhận riêng cho trường hợp link LinkedIn đọc được nội dung; AC-02 kiểm chứng LinkedIn ở khía cạnh "đọc thất bại thì báo nhẹ + vẫn suy Platform" | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-124`); nhận định `docs/memory/judgement-log.md#jdg-032` | Nếu sau này LinkedIn đọc được ổn định, chỉ cần thêm một AC cho trường hợp đó — không phải sửa hành vi |
| A12 | Ngày hết hạn của job không bắt buộc (`DEC-119`, chốt cho US-018 ngày 2026-08-27; code đã xong, chưa commit khi spec này viết — user chọn chạy US-021 trên nền đó) — job không có Ngày hết hạn vẫn lưu được; việc tự điền chỉ điền khi lấy được | Đã xác nhận từ knowledge — `docs/memory/decisions.md#dec-119` | Nếu `DEC-119` bị đảo, EL-05 quay lại "bắt buộc" và cần thêm AC cho trường hợp Dylan buộc phải nhập ngày |
| A13 | US-021 giữ ngoài Business Flow "Hệ Thống Quản Lý Chi Tiêu", theo tiền lệ `DEC-088` của US-018 | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-27 (`docs/memory/decisions.md#dec-111`) | Nếu sai, cần một phiên `ssr-po mode=business-flow` chốt mục tiêu cho mảng Roadmap trước khi tiếp tục |
| A14 | Việc đọc đường dẫn chỉ kích hoạt lại khi giá trị ô Link khác với lần đọc gần nhất — bấm vào ô Link rồi rời đi mà không sửa gì thì hệ thống không đọc lại, không hiện "Đang lấy thông tin..." | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-28 (`docs/memory/decisions.md#dec-125`) | Nếu user muốn đọc lại mỗi lần rời ô Link kể cả khi giá trị không đổi, cần đổi mô tả điều kiện kích hoạt ở mục 3, mục 6 và EL-01 |
| A15 | Khi trang tin tuyển dụng ghi một ngày hết hạn đã ở quá khứ nhưng đầy đủ, rõ ràng, hệ thống vẫn tự điền đúng ngày đó vào ô Ngày hết hạn đang trống; job mới đang "Interested" sau đó có thể bị luật `BR-025` (`US-020`) tự chuyển sang "Expired" ở lần bảng tải lại kế tiếp — Dylan tự đổi lại trạng thái nếu vẫn muốn theo dõi | Đã xác nhận từ knowledge — user xác nhận qua dialog ngày 2026-08-28 (`docs/memory/decisions.md#dec-126`) | Nếu user đổi ý và không muốn job vừa thêm tự chuyển "Expired" do ngày đọc từ link, cần thêm quy tắc bỏ qua ngày hết hạn đã qua — kéo theo sửa mục 3, mục 6, EL-05 và thêm một AC |
