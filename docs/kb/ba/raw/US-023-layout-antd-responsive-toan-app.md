---
status: Raw
feature: US-023
created: 2026-09-07
source: Chat
requester: Dylan
priority: Cao
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-023"]
---

# Raw Requirement — Chuẩn hóa layout toàn app bằng Ant Design, tận dụng không gian và responsive cho mobile/tablet

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-023 |
| Slug | layout-antd-responsive-toan-app |
| Workflow mong muốn | Raw → Report |
| Điểm dừng | report (chạy trọn pipeline ba → dev → test, rồi commit/push) |
| Cần report | Có |
| Spec dự kiến | `docs/features/US-023-layout-antd-responsive-toan-app/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-023-layout-antd-responsive-toan-app.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
tôi cần bạn lên kế hoạch cho các việc sau, thay đổi layout cho trang plan, hãy tận dụng đầy đủ các khoảng không gian và xử dụng antd để có các component cần thiết. Sau đó hãy làm responsive để cho mobile và tablet. Về phần budget hãy thông kê insight chính xác hên về tiết kiệm và thu nhập (hiện tại đang bị sai), layout chưa được thân thiện, khi vào tab này mặc định show tháng hiện tại, nếu không có thì hãy show tháng gần với hiện tại nhất. Danh mục "Item cần mua" sẽ có thể nhập bất kỳ tháng nào, không nhất thiết phải là tháng hiện tại, và trong tab này mới chỉ có phần chi, chưa có phần thu, hãy cơ cấu cho tôi điều chỉnh các nguồn thu tương ứng. Bạn có thể sử dụng codex --yolo để hỗ trợ bạn implement

Chạy phương án a. Sau khi chạy xong hãy đảm bảo k bug lúc đó hãy commit và push lên main
```

## 3. Ngữ Cảnh Đã Biết

Chỉ ghi điều đã có bằng chứng trong knowledge base, memory hoặc source.

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Các route hiện có | `/` (Tổng quan), `/roadmap`, `/timetable`, `/freelance`, `/product`, `/budget` (Thu chi), `/signin` | `app/**/page.tsx` | Đã xác nhận |
| Khung chung các route (trừ /budget) | `components/shared/AppShell.tsx` — topbar + `nav-tabs` + footer + toggle sáng/tối, thuần CSS class trong `app/globals.css` | `components/shared/AppShell.tsx` | Đã xác nhận |
| /budget có khung riêng | `BudgetApp.tsx` tự dựng `header.topbar` riêng, **không** đi qua `AppShell` | `components/BudgetApp.tsx:576-591` | Đã xác nhận |
| Nội dung các tab Tổng quan/Roadmap/Timetable/Freelance/Sản phẩm | Gom trong `components/PlanViews.tsx` (~860 dòng) + `components/JobTrackerBoard.tsx` (bảng CV ứng tuyển) | `components/PlanViews.tsx`, `components/JobTrackerBoard.tsx` | Đã xác nhận |
| Hệ style hiện tại | Thuần CSS: `app/globals.css` 1784 dòng, token màu qua biến CSS (`--primary`, `--surface`, `--success`...), chế độ tối bằng `body.dark` | `app/globals.css` | Đã xác nhận |
| Giới hạn bề ngang | `.container { width: min(1220px, calc(100% - 32px)) }` — nội dung bị bó ở 1220px kể cả trên màn rộng | `app/globals.css:97-100` | Đã xác nhận |
| Điểm gãy responsive hiện có | Rải rác vài `@media (max-width: 720px | 1000px)` trong `globals.css`; không có hệ breakpoint thống nhất | `app/globals.css` (grep `@media`) | Đã xác nhận |
| Chưa có thư viện UI | `package.json` chỉ có `lucide-react` cho icon; **chưa có antd** | `package.json` | Đã xác nhận |
| Nền tảng | Next.js 15 (App Router), React 19 | `package.json` | Đã xác nhận |
| Toggle sáng/tối | Lặp logic ở `AppShell.tsx` và `BudgetApp.tsx`, cùng key localStorage `dylan-plan-next-dashboard-v2`, chỉ lưu `{ dark }` | `components/shared/AppShell.tsx:31-49`, `components/BudgetApp.tsx:270-289` | Đã xác nhận |
| Component dùng chung | `components/shared/TargetGrid.tsx`, `components/shared/Toast.tsx`, `components/shared/UserMenu.tsx`, `components/shared/UserSessionContext` | `components/shared/**` | Đã xác nhận |
| US-022 song hành | Nghiệp vụ thu/insight/tháng/item của tab Thu chi tách ở raw **US-022**; US-023 chỉ lo tầng trình bày (layout + antd + responsive) | Quyết định phân rã của phiên làm việc 2026-09-07 | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Phạm vi đổi layout: chỉ /budget, /budget + Tổng quan, hay toàn app? | **Toàn bộ app (mọi tab)** — chuẩn hóa khung layout + component antd + responsive cho tất cả route: Tổng quan, Roadmap, Thời gian biểu, Freelance, Sản phẩm, Thu chi. | Đã xác nhận từ knowledge (user chọn qua dialog `AskUserQuestion` ngày 2026-09-07) |
| Q2 | "Tận dụng đầy đủ khoảng không gian" nghĩa là gì về bề ngang? | Bỏ / nới trần 1220px để nội dung dùng phần lớn bề ngang màn hình rộng (đề xuất container ~1440px + padding co giãn, các khu vực bảng/biểu đồ trải rộng). `ssr-ba` chốt con số cụ thể và cách xử lý màn siêu rộng. | Giả định hợp lý (suy từ raw "tận dụng đầy đủ các khoảng không gian" + layout hiện bó 1220px) |
| Q3 | Các breakpoint mobile/tablet/desktop lấy mốc nào? | Theo hệ breakpoint mặc định của antd Grid (`xs <576`, `sm ≥576`, `md ≥768`, `lg ≥992`, `xl ≥1200`, `xxl ≥1600`). Mobile = `xs`, tablet = `sm`–`md`, desktop = `lg`+. `ssr-ba` chốt hành vi từng khu vực ở từng mốc (menu → Drawer, bảng → danh sách thẻ...). | Giả định hợp lý (antd là thư viện đã chọn ở Q4; dùng luôn hệ breakpoint của nó thay vì tự định nghĩa) |
| Q4 | Dùng thư viện UI nào? | **Ant Design (antd) v5.** Với Next 15 App Router + React 19: cần `@ant-design/nextjs-registry` (trích xuất CSS phía server, tránh nháy style) và `@ant-design/v5-patch-for-react-19` (tương thích React 19). Icon có thể chuyển dần sang `@ant-design/icons` hoặc giữ `lucide-react`. | Đã xác nhận từ knowledge (user nêu trực tiếp "xử dụng antd" trong raw) |
| Q5 | Giữ nhận diện màu / chế độ tối hiện tại tới đâu? | Giữ bảng màu hiện có: map biến CSS trong `globals.css` (`--primary #6c55f5`, radius 14, success/warning/danger...) vào `ConfigProvider` theme token của antd; chế độ tối dùng `theme.darkAlgorithm`. Gom logic toggle sáng/tối đang lặp (`AppShell` + `BudgetApp`) về một nơi. | Giả định hợp lý (giữ nhận diện là mặc định an toàn; user không yêu cầu đổi màu) |
| Q6 | Có đổi nội dung / thông tin hiển thị của các tab không, hay chỉ đổi cách trình bày? | Chỉ đổi tầng trình bày (khung, thành phần, responsive). Giữ nguyên nội dung, số liệu, luồng nghiệp vụ và toàn bộ Server Action / logic hiện có của từng tab. Thay đổi nghiệp vụ tab Thu chi thuộc US-022. | Giả định hợp lý (raw chỉ nói "thay đổi layout", "responsive", "dùng antd") |
| Q7 | `/budget` có gộp vào `AppShell` chung không? | Có — đưa `/budget` dùng chung khung `AppShell` (bỏ topbar riêng của `BudgetApp`) để một hệ layout duy nhất cho mọi tab. `ssr-ba` xác nhận. | Giả định hợp lý (raw yêu cầu chuẩn hóa layout toàn app; hiện /budget là ngoại lệ duy nhất) |

## 5. Ghi Chú BA

- **Không đụng data model.** US-023 thuần tầng trình bày — không thêm/sửa model Prisma, không migration. Nếu `ssr-plan` phát hiện cần đổi contract Server Action thì đó là dấu hiệu phạm vi đã lấn sang US-022.
- **Khối lượng lớn — cân nhắc chia mốc giao trong spec:** (mốc 1) nền antd (`ConfigProvider`, registry, patch React 19) + `AppShell` chung + tab Thu chi hoàn chỉnh; (mốc 2) quét các tab còn lại (Tổng quan, Roadmap, Timetable, Freelance, Sản phẩm) sang component antd. `ssr-ba` quyết định gói thành một US hay tách US-023a/US-023b để giữ INVEST-Small (spec chạm trần `SSR_INVEST_MAX_AC=8`).
- **Phụ thuộc US-022:** phần layout tab Thu chi (US-023) và phần nghiệp vụ tab Thu chi (US-022) đụng cùng file `components/BudgetApp.tsx`. `ssr-plan` cần chốt thứ tự: nên làm data + nghiệp vụ US-022 trước, rồi US-023 dựng lại giao diện trên contract mới (đã có `incomeSources`, chỉ số insight mới, bộ chọn tháng mặc định). `ssr-ba`/`ssr-plan` ghi rõ ràng buộc thứ tự này.
- **Rủi ro kỹ thuật cần `ssr-plan` khảo sát:** kích thước bundle antd; nháy style SSR (registry xử lý); tương thích React 19 (patch); `globals.css` 1784 dòng — cắt phần bị antd thay thế, giữ token + vài lớp đặc thù (biểu đồ tròn conic, biểu đồ cột). Không xóa ồ ạt trước khi đối chiếu từng tab.
- **Jargon:** spec không được dùng "registry", "algorithm", "breakpoint", "token" dạng kỹ thuật trần trụi trong phần mô tả nghiệp vụ — diễn đạt tường minh ("khung màn hình co theo bề ngang thiết bị", "bảng màu chung"...). Chi tiết kỹ thuật để `ssr-plan`.
- **Verification cuối:** build + lint, và kiểm mắt ở tối thiểu 3 bề ngang (điện thoại ~375px, máy tính bảng ~768px, màn rộng ~1440px) cho mọi tab, cả sáng lẫn tối; rồi commit + push lên `main`.
