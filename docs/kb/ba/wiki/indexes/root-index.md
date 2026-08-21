---
status: Active
updated: 2026-08-14
owner: ssr-ingest
tags: [kb/ba/wiki/indexes]
---

# Wiki Root Index

> Điểm vào chính của toàn bộ BA wiki. Chỉ điều hướng — không chứa nội dung nghiệp vụ chi tiết.

## 1. Mục Đích Wiki

Wiki phục vụ `ssr-ba` khi tổng hợp spec — nguồn sự thật đa trang, liên kết, dùng lại được xuyên function. Raw là nguồn bất biến; wiki được `ssr-ingest` biên soạn từ raw và cập nhật ngược từ spec đã hoàn chỉnh.

**Trạng thái di trú:** Cấu trúc nested này (`indexes/`, `knowledge/`, `delivery/`, `ingestion/`, `data/`) mới được khởi tạo lần đầu ngày 2026-08-05 khi làm US-004. US-002, US-003, US-004, US-005, US-006, US-010, US-012, US-014, US-015, US-016 và US-017 đã có đủ trang trong cấu trúc này, tất cả `Active`. US-018 đã `sync`, `Active`, spec `Ready for DEV` (11 AC) — độc lập với Business Flow "Hệ Thống Quản Lý Chi Tiêu" (nằm ở trang Roadmap, không thuộc F1-F4; xác nhận qua `DEC-088`, `po-expert` `Aligned`). US-019 đã `sync`, `Active`, spec `Ready for DEV` (10 AC) — gắn `EPC-003` (F3), phục vụ mục tiêu mới `M3` (`DEC-105`, `po-expert` xác nhận `Aligned` sau 2 lượt). US-020 đã `sync`, `Active`, spec `Ready for DEV` (9 AC) — mở rộng trực tiếp `US-018` (Depends on), cùng tiền lệ không gắn epic (`DEC-088`, `po-expert` xác nhận `Aligned`). 5 US còn lại (US-001, US-007, US-008, US-009, US-011) vẫn chỉ tồn tại dạng trang phẳng tại `docs/kb/ba/wiki/US-###-*.md` (chưa migrate) — xem `docs/requirements-index.md` để biết trạng thái từng US.

Raw là nguồn bất biến. Wiki là nguồn sự thật cho phân tích — được `ssr-ingest` biên soạn từ raw và cập nhật ngược từ spec đã hoàn chỉnh.

## 2. Điều Hướng Theo Loại

| Loại trang | Thư mục | Index chi tiết |
| --- | --- | --- |
| Nguồn raw đã ingest | `ingestion/source-record/` | [`raw-index.md`](raw-index.md) |
| Epic | `knowledge/epic/` | [`epic-index.md`](epic-index.md) |
| Feature | `knowledge/feature/` | [`feature-index.md`](feature-index.md) |
| Concept | `knowledge/concept/` | — (chưa có trang nào) |
| Business rule | `knowledge/business-rule/` | — (24 trang, xem `feature-index.md` để tra theo function) |
| Workflow | `knowledge/workflow/` | — (chưa có trang nào) |
| PBI | `delivery/pbi/` | — |
| Entity | `data/entity/` | — (6 trang: `ENT-001-giao-dich`, `ENT-002-danh-muc`, `ENT-003-thang-ngan-sach`, `ENT-004-job-ung-tuyen`, `ENT-005-platform-tuyen-dung`, `ENT-006-item-can-mua`) |
| Conflict | `governance/conflict/` | — (chưa có conflict nào) |
| Báo cáo sức khỏe wiki | `reports/` | [`../reports/wiki-health-report.md`](../reports/wiki-health-report.md) |

## 3. Điều Hướng Theo Epic

| Epic | Tên | Trạng thái | Function |
| --- | --- | --- | --- |
| `EPC-001` | Ghi nhận chi tiêu (F1) | Active | US-001 (legacy, chưa migrate), US-003, US-004, US-012 |
| `EPC-002` | Lập và điều chỉnh ngân sách theo danh mục (F2) | Active | US-005, US-010, US-014, US-016, US-017 (tất cả `Active`) |
| `EPC-003` | Quản lý theo chu kỳ tháng (F3) | Active | US-006 (`Active`, đã gộp `US-013`), US-015 (`Active`), US-019 (`Active`, `DEC-105`) |

## 3b. Function Không Thuộc Business Flow Nào

| Mã | Tên function | Lý do |
| --- | --- | --- |
| `US-018` | Bảng theo dõi CV ứng tuyển tại trang Roadmap | `docs/kb/ba/business-flow.md` chỉ phạm vi "Hệ Thống Quản Lý Chi Tiêu" (F1-F4) — trang Roadmap được chính Business Flow liệt kê là mục **tách biệt** (mục 1, M2). Không gắn epic; cần `ssr-po` mở rộng hoặc lập Business Flow riêng cho mảng Roadmap nếu muốn hoá epic sau này |
| `US-020` | Lịch sử thay đổi trạng thái job ứng tuyển | Mở rộng trực tiếp `US-018` (cùng entity Job ứng tuyển, cùng trang Roadmap) — áp dụng cùng lý do và cùng tiền lệ `DEC-088` |

## 4. Trạng Thái Tổng Quan

| Chỉ số | Giá trị |
| --- | --- |
| Số nguồn raw đã ingest (cấu trúc nested) | 14 (US-002, US-003, US-004, US-005, US-006, US-010, US-012, US-014, US-015, US-016, US-017, US-018, US-019, US-020 — tất cả `Active`) — cộng `US-013` gộp vào `US-006` |
| Số feature (cấu trúc nested) | 14 (US-002, US-003, US-004, US-005, US-006, US-010, US-012, US-014, US-015, US-016, US-017, US-018, US-019, US-020 — tất cả `Active`) |
| Số concept / business rule / workflow / entity | 0 / 27 / 0 / 6 |
| Conflict chưa xử lý | 0 |
