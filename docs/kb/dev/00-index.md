# DEV index

Updated: 2026-09-14 (US-027 implemented — nút "Chỉnh sửa trang" cho 12 trang Roadmap/Freelance/Sản phẩm; model mới `PageText`+`PageBlock` (migration `20260913164331_add_page_content`) dùng chung mọi trang, không phải 1 model/trang; bounded context mới `server/pages`; editor form generic `PageContentEditor` suy field theo dữ liệu. Verify qua Chrome DevTools MCP cả 12 route, không lỗi console, round-trip đúng. Không qua pipeline ssr-* — implement trực tiếp trong phiên tương tác)

Updated: 2026-09-13 (US-026 implemented — thuần tầng trình bày, KHÔNG đổi schema; `BudgetApp` `section` `control` tách thành `income`+`expense`, 2 route mới + redirect `/budget/control`, `NavPref` reconcile ở tầng ứng dụng (chèn thiếu + xoá orphan), "Items cần mua" vào `Drawer` với badge đếm Pending. Verify qua Chrome DevTools MCP trên `plan.localhost:3000`, không lỗi console, DB xác nhận reconcile đúng)

Updated: 2026-09-09 (US-025 GĐ1+GĐ2+GĐ3 implemented — đổi schema: model mới `NavPref` (migration `20260909141127_add_nav_pref`) + `RoadmapPhase`/`RoadmapDeliverable`/`TimetableRow` (migration `20260909142811_add_roadmap_timetable_config`), đều thuần CREATE TABLE; bounded context mới `server/config`; `app/(app)/layout.tsx` → dynamic, đọc nav/roadmap/timetable config; `AppShell`/`ConfigDrawer` nhận các config; nút bánh răng → drawer 4 tab (Density localStorage · Menu · Roadmap · Lịch tuần DB); `roadmapPhases`/`weekRows` chuyển từ `PlanViews.tsx` ra `lib/*-defaults.ts`, section components nhận props. Trước đó: US-023 plan Ready for task-breakdown — thuần tầng trình bày, KHÔNG đổi schema)

| Mã | Tên | File |
| --- | --- | --- |
| US-027 | Nút "Chỉnh sửa trang" cho 12 trang Roadmap/Freelance/Sản phẩm (PageText/PageBlock) | `docs/kb/dev/wiki/US-027-chinh-sua-noi-dung-trang.md` |
| US-026 | Tách "Ngân sách & nhập nhanh" thành "Quản lý thu" và "Quản lý chi"; "Items cần mua" vào Drawer | `docs/kb/dev/wiki/US-026-tach-quan-ly-thu-va-chi.md` |
| US-025 | Bảng điều khiển tuỳ biến app (config panel: density · thứ tự/ẩn hiện menu · sửa roadmap · sửa timetable) | `docs/kb/dev/wiki/US-025-bang-dieu-khien-config.md` |
| US-023 | Chuẩn hóa layout toàn app bằng Ant Design, responsive mobile/tablet | `docs/kb/dev/wiki/US-023-layout-antd-responsive-toan-app.md` |
| US-022 | Nguồn thu, sửa insight tiết kiệm, tháng mặc định và bỏ giới hạn tháng cho Item cần mua tại tab Thu chi | `docs/kb/dev/wiki/US-022-nguon-thu-va-insight-tab-thu-chi.md` |
| US-021 | Tự điền thông tin job từ link tin tuyển dụng | `docs/kb/dev/wiki/US-021-tu-dien-thong-tin-job-link.md` |
| US-001 | Lưu trữ chi tiêu bền vững và liên kết giao dịch theo danh mục cố định | `docs/kb/dev/wiki/US-001-luu-tru-chi-tieu-ben-vung.md` |
| US-007 | Phân tích xu hướng trên toàn bộ lịch sử đã lưu | `docs/kb/dev/wiki/US-007-phan-tich-xu-huong-lich-su.md` |
| US-008 | Xuất dữ liệu từ nguồn lưu trữ bền vững | `docs/kb/dev/wiki/US-008-xuat-du-lieu-ben-vung.md` |
| US-010 | Chặn trùng tên danh mục | `docs/kb/dev/wiki/US-010-chan-trung-ten-danh-muc.md` |
| US-002 | Route/module riêng cho Quản lý chi tiêu | `docs/kb/dev/wiki/US-002-route-rieng-quan-ly-chi-tieu.md` |
| US-003 | Liên kết giao dịch theo danh mục bằng ID | `docs/kb/dev/wiki/US-003-lien-ket-giao-dich-theo-id.md` |
| US-004 | Sửa/xóa từng giao dịch tại bảng chi tiết chi tiêu | `docs/kb/dev/wiki/US-004-sua-xoa-tung-giao-dich.md` |
| US-005 | Ràng buộc toàn vẹn danh mục + giao dịch không danh mục | `docs/kb/dev/wiki/US-005-rang-buoc-toan-ven-danh-muc.md` |
| US-006 | Cảnh báo trùng tháng khi tạo tháng mới (đã gộp US-013) | `docs/kb/dev/wiki/US-006-canh-bao-trung-thang.md` |
| US-012 | Sửa lỗi ghi nhận âm thầm thất bại khi tên danh mục bị đổi | `docs/kb/dev/wiki/US-012-sua-loi-nhan-dien-danh-muc.md` |
| US-014 | Cập nhật "Chi tiêu khác" luôn nằm cuối bảng danh mục | `docs/kb/dev/wiki/US-014-chi-tieu-khac-cuoi-bang.md` |
| US-015 | Giới hạn khu vực "Lịch sử thu chi" chỉ hiển thị 3 thẻ tháng quick view | `docs/kb/dev/wiki/US-015-quick-view-thang-lien-ke.md` |
| US-016 | Chuẩn hóa "Loại" chi tiêu (danh mục) thành combobox cố định | `docs/kb/dev/wiki/US-016-loai-chi-tieu-combobox.md` |
| US-017 | Sắp xếp vị trí danh mục bằng kéo thả (drag-and-drop row reordering) | `docs/kb/dev/wiki/US-017-sap-xep-danh-muc-keo-tha.md` |
| US-018 | Bảng theo dõi CV ứng tuyển tại trang Roadmap | `docs/kb/dev/wiki/US-018-theo-doi-cv-ung-tuyen.md` |
| US-020 | Lịch sử thay đổi trạng thái job ứng tuyển tại trang Roadmap | `docs/kb/dev/wiki/US-020-lich-su-trang-thai-job.md` |
| US-019 | Danh sách items cần mua theo tháng tại bảng thu chi | `docs/kb/dev/wiki/US-019-danh-sach-can-mua.md` |
