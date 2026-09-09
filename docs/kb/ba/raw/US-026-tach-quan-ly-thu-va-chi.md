---
status: Raw
feature: US-026
created: 2026-09-09
source: Chat
requester: Dylan
priority: Trung bình
owner: ssr-raw
tags: [kb/ba/raw]
aliases: ["US-026"]
---

# Raw Requirement — Tách "Ngân sách & nhập nhanh" thành "Quản lý thu" và "Quản lý chi"

## 1. Metadata

| Trường | Giá trị |
| --- | --- |
| Mã function | US-026 |
| Slug | tach-quan-ly-thu-va-chi |
| Workflow mong muốn | Raw → Report |
| Điểm dừng | report |
| Cần report | Có |
| Spec dự kiến | `docs/features/US-026-tach-quan-ly-thu-va-chi/spec.md` |
| BA wiki dự kiến | `docs/kb/ba/wiki/knowledge/feature/US-026-tach-quan-ly-thu-va-chi.md` (do `ssr-ingest` biên soạn, không phải `ssr-raw`) |

## 2. Nội Dung Raw

> Giữ NGUYÊN VĂN lời người yêu cầu. Không dịch, không tóm tắt, không chuẩn hóa.

```text
đổi tên thành "Quản lý thu", menu sẽ quản lý tất cả các nguồn thu và các khoản tiết kiệm và kế hoạch chi tiêu dài hạn. Thêm menu mới là "Quản lý chi" chia màn hình làm 2, bên trái sẽ là quick input, bên phải là các danh mục. Danh sách sách item cần mua hãy đưa vào trong 1 button, sau đó hãy mở drawer từ bên phải để nhập
```

Kèm ảnh chụp màn hình tab "Thu chi · Ngân sách & nhập nhanh" (sidebar trái có nhóm "Thu chi" đang mở với 3 mục con: "Lịch sử thu chi", "Insight tài chính", "Ngân sách & nhập nhanh"; nội dung màn hình gồm khối "Quy tắc kiểm soát" 4 thẻ, bộ chọn "Tháng đang xem", và khối "Nguồn thu").

### Trả lời bổ sung của user qua dialog (2026-09-09)

- Cấu trúc menu: giữ nguyên nhóm cha "Thu chi"; đổi/tách 2 mục con — "Ngân sách & nhập nhanh" tách thành "Quản lý thu" và "Quản lý chi". "Lịch sử thu chi" và "Insight tài chính" giữ nguyên trong nhóm "Thu chi".
- "Quản lý thu": ngoài bảng Nguồn thu hiện có, bổ sung một khu **tổng hợp chỉ-đọc** các danh mục Loại "Tích lũy" của tháng đang xem (khoản tiết kiệm). Không thêm model dữ liệu. Phần "kế hoạch chi tiêu dài hạn" chỉ ghi nhận trong định hướng, chưa dựng UI ở US này.
- Route: bỏ hẳn `/budget/control`. "Quản lý thu" = `/budget/income`, "Quản lý chi" = `/budget/expense`.
- Khối "Quy tắc kiểm soát" (4 thẻ) và toàn bộ nút hành động hiện có ở màn control (Thêm danh mục, Reset chi tháng này, Xuất JSON, Reset dữ liệu) chuyển sang màn "Quản lý chi".
- Nút mở Drawer "item cần mua" ở "Quản lý chi": đặt ở đầu cột phải (trên danh sách danh mục), có badge đếm số item còn trạng thái Pending của tháng đang xem.

## 3. Ngữ Cảnh Đã Biết

| Thông tin | Giá trị | Nguồn | Độ tin cậy |
| --- | --- | --- | --- |
| Màn hiện tại | Một component `BudgetApp` render theo prop `section`: `"monthly"` (Lịch sử thu chi), `"insight"` (Insight tài chính), `"control"` (Ngân sách & nhập nhanh) | `components/BudgetApp.tsx`, `app/(app)/budget/*/page.tsx` | Đã xác nhận |
| Route hiện tại | `/budget` redirect `/budget/monthly`; các trang `/budget/monthly`, `/budget/insight`, `/budget/control` | `app/(app)/budget/`, `components/shared/nav.ts` | Đã xác nhận |
| Nội dung màn `control` hiện tại | 4 khối theo thứ tự: bảng Nguồn thu (thêm/sửa/xóa/kéo-thả), Nhập nhanh chi tiêu + danh sách giao dịch (sửa/xóa inline), bảng Items cần mua (thêm/sửa/xóa/đánh dấu đã mua), bảng Danh mục ngân sách + cụm nút (Thêm danh mục, Reset chi tháng này, Xuất JSON, Reset dữ liệu). Đầu section còn khối "Quy tắc kiểm soát" 4 thẻ | `components/BudgetApp.tsx` (section `control`, dòng ~1498–2077; TargetGrid "Quy tắc kiểm soát" dòng ~1226) | Đã xác nhận |
| Nav data | `navGroups` trong `components/shared/nav.ts` (label/desc/icon/match/children) + `lib/nav-registry.ts` (`NAV_GROUP_IDS`, `NAV_CHILD_HREFS`, seed `NavPref`) là hai nguồn phải cập nhật song song; nhóm `budget` id `budget`, children `["/budget/monthly", "/budget/insight", "/budget/control"]` | `components/shared/nav.ts`, `lib/nav-registry.ts` | Đã xác nhận |
| NavPref | Bảng `NavPref` (US-025, migration `20260909141127_add_nav_pref`) lưu thứ tự + ẩn/hiện theo khóa dạng `group:ID` hoặc `leaf:HREF` (hàm `groupPrefId`/`leafPrefId`); seed từ `defaultNavPrefSeeds()`. Đổi href của mục con kéo theo phải seed/migrate lại `NavPref` liên quan | `lib/nav-registry.ts`, `prisma/migrations/20260909141127_add_nav_pref/`, `server/config/` | Cần xác nhận (chi tiết seed do `ssr-plan`/`ssr-data` chốt) |
| Nguồn thu | Entity `IncomeSource` gắn `MonthBudget`; chỉ thao tác ở tháng hiện tại/tương lai (BR-036, DEC-133); tháng mới bắt đầu không có nguồn thu (DEC-131) | `docs/memory/glossary.md`, `docs/features/US-022-nguon-thu-va-insight-tab-thu-chi/` | Đã xác nhận |
| Loại danh mục "Tích lũy" | Một trong 3 giá trị combobox cố định của `Category.type` (Cố định, Tích lũy, Khác — DEC-073); "Đã phân bổ vào tích lũy" = tổng `Category.actual` của các danh mục Loại "Tích lũy" | `docs/memory/glossary.md`, `docs/memory/language.md` mục 4 | Đã xác nhận |
| Item cần mua | Entity gắn `MonthBudget`, trạng thái `Pending`/`Purchased`, giá tùy chọn không cộng vào Ngân sách/Chi thực tế (DEC-092); tháng khác tháng đang xem chỉ xem (DEC-130) | `docs/memory/glossary.md`, `docs/features/US-019-danh-sach-can-mua/` | Đã xác nhận |
| Business Flow | Hệ Thống Quản Lý Chi Tiêu, mục tiêu M1–M4; F2 (ngân sách + nguồn thu), F3 (chu kỳ tháng), M3 (kế hoạch mua sắm) | `docs/kb/ba/business-flow.md` | Đã xác nhận |
| Design system | App đã chuyển sang `@vn-dylan/ui` (US-024); có sẵn component `Button`, `Card`, `Input`, `Select`, `Tag`, `Progress`. Cần kiểm tra `@vn-dylan/ui` có `Drawer` không | `components/BudgetApp.tsx` import, `git log` US-024 | Cần xác nhận (do `ssr-plan`) |
| Điều hướng | Sidebar trái (US-024, commit `75ef55f`) thay navbar trên cùng | `components/shared/AppShell.tsx`, `git log` | Đã xác nhận |

## 4. Câu Hỏi Mở

| # | Câu hỏi | Trả lời từ knowledge | Trạng thái |
| --- | --- | --- | --- |
| Q1 | Nhóm menu cha giữ tên gì; "Quản lý thu"/"Quản lý chi" là nhóm cha riêng hay mục con? | Giữ nguyên nhóm cha "Thu chi"; "Quản lý thu" và "Quản lý chi" là 2 mục con thay cho mục con "Ngân sách & nhập nhanh". "Lịch sử thu chi" và "Insight tài chính" giữ nguyên trong nhóm này. (User chọn phương án "Giữ nhóm 'Thu chi', đổi 2 sub-item" trong dialog mở đầu hội thoại) | Đã xác nhận từ knowledge |
| Q2 | "Lịch sử thu chi" và "Insight tài chính" thuộc nhóm nào sau khi tách? | Giữ ở nhóm "Thu chi" (không đổi). (User chọn phương án "Giữ ở nhóm 'Thu chi' riêng" trong dialog mở đầu hội thoại) | Đã xác nhận từ knowledge |
| Q3 | "Các khoản tiết kiệm và kế hoạch chi tiêu dài hạn" trong "Quản lý thu" là gì cụ thể? | Chỉ thêm một khu tổng hợp **chỉ-đọc** các danh mục Loại "Tích lũy" của tháng đang xem (không thêm model). "Kế hoạch chi tiêu dài hạn" chỉ ghi trong định hướng, chưa dựng UI ở US này. (User chọn "Chỉ khu tiết kiệm chỉ-đọc (Gợi ý)") | Đã xác nhận từ knowledge |
| Q4 | Đặt URL route cho hai màn thế nào? | Bỏ hẳn `/budget/control`. "Quản lý thu" = `/budget/income`; "Quản lý chi" = `/budget/expense`. (User chọn "/budget/income + /budget/expense (Gợi ý)") | Đã xác nhận từ knowledge |
| Q5 | Khối "Quy tắc kiểm soát" 4 thẻ và cụm nút (Thêm danh mục, Reset chi tháng này, Xuất JSON, Reset dữ liệu) chuyển đi đâu? | Tất cả chuyển sang màn "Quản lý chi" cùng bảng danh mục. (User chọn "Tất cả về 'Quản lý chi' (Gợi ý)") | Đã xác nhận từ knowledge |
| Q6 | Nút mở Drawer "item cần mua" ở "Quản lý chi" đặt ở đâu, hiển thị gì? | Đặt ở đầu cột phải (trên danh sách danh mục); có badge đếm số item còn Pending của tháng đang xem. Drawer trượt từ bên phải, cho xem/thêm/sửa/xoá/đánh dấu đã mua (giữ nguyên hành vi và ràng buộc tháng của US-019). (User chọn "Đầu cột phải, có badge đếm Pending (Gợi ý)") | Đã xác nhận từ knowledge |
| Q7 | `@vn-dylan/ui` có sẵn component `Drawer` không, hay phải tự dựng? | Chưa xác nhận trong knowledge — `ssr-plan` khảo sát `@vn-dylan/ui`; nếu không có thì dựng overlay + panel trượt bằng CSS trong repo (không thêm thư viện). | Giả định hợp lý |
| Q8 | Đổi href mục con (`/budget/control` bỏ đi, thêm `/budget/income` và `/budget/expense`) thì xử lý dữ liệu `NavPref` cũ thế nào? | Chưa có tiền lệ trong knowledge — `ssr-data`/`ssr-plan` chốt: cập nhật `NAV_CHILD_HREFS`, `defaultNavPrefSeeds()` và seed lại; cân nhắc migration dữ liệu `NavPref` cho khóa `leaf:/budget/control` đã lưu. | Giả định hợp lý |
| Q9 | Truy cập route cũ `/budget/control` sau khi bỏ thì sao? | Chưa nêu trong knowledge — đề xuất `ssr-ba`/`ssr-plan`: `/budget/control` redirect sang `/budget/expense` để không vỡ bookmark/`BUDGET_MONTH_KEY` localStorage. | Giả định hợp lý |

## 5. Ghi Chú BA

- **Phạm vi chính là tái cấu trúc trình bày, không thêm nghiệp vụ mới.** Nguồn thu, Nhập nhanh, Danh mục ngân sách, Item cần mua đều đã có; US này chia lại thành 2 màn + chuyển "Item cần mua" vào Drawer + thêm khu "Tích lũy" chỉ-đọc trong "Quản lý thu". Tương tự tiền lệ US-023/US-024 (cross-cutting UX), nhiều khả năng nằm ngoài neo M1–M4 nhưng `po-expert` cần xác nhận vì có đụng cách trình bày F2/F3 và M3.
- **Business Flow cần soi lại F2/F3:** F2 hiện gộp "ngân sách theo danh mục" + "nguồn thu" vào một luồng; sau US-026 hai phần này ở hai màn khác nhau. `ssr-ba` cân nhắc đề xuất cập nhật mô tả F2 (không đổi bản chất nghiệp vụ).
- **Khu "Tích lũy" chỉ-đọc trong "Quản lý thu":** cần chốt hiển thị gì — danh sách từng danh mục Loại "Tích lũy" kèm `actual`, tổng "Đã phân bổ vào tích lũy", và có ẩn giá trị như ô ở tab Insight không (mắt/EyeOff). `ssr-ba` chốt trong Screen Element.
- **Ràng buộc tháng:** "Quản lý thu" thao tác Nguồn thu chỉ ở tháng hiện tại/tương lai (BR-036); "Quản lý chi" — Nhập nhanh và Item cần mua chỉ ở tháng đang xem theo ràng buộc US-019/US-022 hiện hành. Giữ nguyên, không nới.
- **`monthViewPicker`** đang render ở đầu cả `insight` và `control`; cần có ở cả hai màn mới "Quản lý thu" và "Quản lý chi" (mỗi màn là route riêng nên `BudgetApp` remount, tháng đang xem vẫn đồng bộ qua `localStorage` key `dylan-plan-budget-month`).
- **Nút "Xuất JSON" / "Reset dữ liệu"** là hành động toàn cục (mọi tháng), đặt ở "Quản lý chi" theo yêu cầu user — `ssr-ba` ghi rõ trong Screen Element để không ai hiểu nhầm là chỉ tác động phần chi.
- **`BudgetSection` type** hiện là `"monthly" | "insight" | "control"` — cần đổi `"control"` thành hai giá trị mới (vd `"income" | "expense"`), cập nhật `app/(app)/budget/*/page.tsx` tương ứng. Chi tiết đặt tên do `ssr-plan`.
- Không có mâu thuẫn với `rules.md` (P1.1 về ngày giao dịch không tương lai — US này không đụng).
