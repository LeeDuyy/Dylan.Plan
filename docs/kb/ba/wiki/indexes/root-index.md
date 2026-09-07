---
status: Active
updated: 2026-09-07
owner: ssr-ingest
tags: [kb/ba/wiki/indexes]
---

# Wiki Root Index

> Điểm vào chính của toàn bộ BA wiki. Chỉ điều hướng — không chứa nội dung nghiệp vụ chi tiết.

## 1. Mục Đích Wiki

Wiki phục vụ `ssr-ba` khi tổng hợp spec — nguồn sự thật đa trang, liên kết, dùng lại được xuyên function. Raw là nguồn bất biến; wiki được `ssr-ingest` biên soạn từ raw và cập nhật ngược từ spec đã hoàn chỉnh.

**Trạng thái di trú:** Cấu trúc nested này (`indexes/`, `knowledge/`, `delivery/`, `ingestion/`, `data/`) mới được khởi tạo lần đầu ngày 2026-08-05 khi làm US-004. US-002, US-003, US-004, US-005, US-006, US-010, US-012, US-014, US-015, US-016 và US-017 đã có đủ trang trong cấu trúc này, tất cả `Active`. US-018 đã `sync`, `Active`, spec `Ready for DEV` (11 AC) — độc lập với Business Flow "Hệ Thống Quản Lý Chi Tiêu" (nằm ở trang Roadmap, không thuộc F1-F4; xác nhận qua `DEC-088`, `po-expert` `Aligned`). US-019 đã `sync`, `Active`, spec `Ready for DEV` (10 AC) — gắn `EPC-003` (F3), phục vụ mục tiêu mới `M3` (`DEC-105`, `po-expert` xác nhận `Aligned` sau 2 lượt). US-020 đã `sync`, `Active`, spec `Ready for DEV` (9 AC) — mở rộng trực tiếp `US-018` (Depends on), cùng tiền lệ không gắn epic (`DEC-088`, `po-expert` xác nhận `Aligned`). US-007 đã `sync`, `Active`, spec `Ready for DEV` (4 AC) — gắn epic mới `EPC-004` (F4, epic đầu tiên cho luồng F4), `po-expert` xác nhận `Aligned` ngay lượt đầu. US-008 đã `sync`, `Active`, spec `Ready for DEV` (4 AC) — cùng gắn `EPC-004`, `po-expert` Aligned ngay lượt đầu. US-009 mới ingest, `Draft`, chưa có spec — gắn `EPC-002` (F2), còn 1 điểm `Cần user xác nhận` (quy tắc kế thừa ngưỡng khi Clone). US-021 đã `sync`, `Active`, spec `Ready for DEV` (8 AC) — mở rộng `US-018` (bảng "Theo dõi CV ứng tuyển"), giữ ngoài Business Flow theo tiền lệ `DEC-088` (`DEC-111`, `po-expert` `Aligned` 2026-08-28); 2 rule mới `BR-031`, `BR-032`; chạy trên nền `DEC-119` (Ngày hết hạn không bắt buộc). US-022 mới ingest, `Draft`, chưa có spec — gắn `EPC-004` (F4), cross-cutting `EPC-002`/`EPC-003`; Impacts `US-019` (nới điều kiện tháng thao tác item cần mua: `BR-024` `Superseded` → `BR-036`); 5 rule mới `BR-033`..`BR-037`, entity mới `ENT-007` (Nguồn thu), `schemaChangeRequired = true`. Raw `US-023` (layout Ant Design + responsive toàn app) chưa ingest. 2 US còn lại (US-001, US-011) vẫn chỉ tồn tại dạng trang phẳng tại `docs/kb/ba/wiki/US-###-*.md` (chưa migrate) — xem `docs/requirements-index.md` để biết trạng thái từng US.

Raw là nguồn bất biến. Wiki là nguồn sự thật cho phân tích — được `ssr-ingest` biên soạn từ raw và cập nhật ngược từ spec đã hoàn chỉnh.

## 2. Điều Hướng Theo Loại

| Loại trang | Thư mục | Index chi tiết |
| --- | --- | --- |
| Nguồn raw đã ingest | `ingestion/source-record/` | [`raw-index.md`](raw-index.md) |
| Epic | `knowledge/epic/` | [`epic-index.md`](epic-index.md) |
| Feature | `knowledge/feature/` | [`feature-index.md`](feature-index.md) |
| Concept | `knowledge/concept/` | — (chưa có trang nào) |
| Business rule | `knowledge/business-rule/` | — (37 trang; `BR-024` `Superseded` bởi `BR-036`; xem `feature-index.md` để tra theo function) |
| Workflow | `knowledge/workflow/` | — (chưa có trang nào) |
| PBI | `delivery/pbi/` | — |
| Entity | `data/entity/` | — (7 trang: `ENT-001-giao-dich`, `ENT-002-danh-muc`, `ENT-003-thang-ngan-sach`, `ENT-004-job-ung-tuyen`, `ENT-005-platform-tuyen-dung`, `ENT-006-item-can-mua`, `ENT-007-nguon-thu`) |
| Conflict | `governance/conflict/` | — (chưa có conflict nào) |
| Báo cáo sức khỏe wiki | `reports/` | [`../reports/wiki-health-report.md`](../reports/wiki-health-report.md) |

## 3. Điều Hướng Theo Epic

| Epic | Tên | Trạng thái | Function |
| --- | --- | --- | --- |
| `EPC-001` | Ghi nhận chi tiêu (F1) | Active | US-001 (legacy, chưa migrate), US-003, US-004, US-012 |
| `EPC-002` | Lập và điều chỉnh ngân sách theo danh mục (F2) | Active | US-005, US-010, US-014, US-016, US-017 (tất cả `Active`); US-009 (`Draft`, spec chưa viết) |
| `EPC-003` | Quản lý theo chu kỳ tháng (F3) | Active | US-006 (`Active`, đã gộp `US-013`), US-015 (`Active`), US-019 (`Active`, `DEC-105`) |
| `EPC-004` | Phân tích và báo cáo chi tiêu (F4) | Active | US-007 (`Active`, spec `Ready for DEV`), US-008 (`Active`, spec `Ready for DEV`) — US-022 chạm F4 nhưng cross-cutting F2/F3/F4, không gắn 1 epic (xem `epic-index.md` mục 1b) |

## 3b. Function Không Thuộc Business Flow Nào

| Mã | Tên function | Lý do |
| --- | --- | --- |
| `US-018` | Bảng theo dõi CV ứng tuyển tại trang Roadmap | `docs/kb/ba/business-flow.md` chỉ phạm vi "Hệ Thống Quản Lý Chi Tiêu" (F1-F4) — trang Roadmap được chính Business Flow liệt kê là mục **tách biệt** (mục 1, M2). Không gắn epic; cần `ssr-po` mở rộng hoặc lập Business Flow riêng cho mảng Roadmap nếu muốn hoá epic sau này |
| `US-020` | Lịch sử thay đổi trạng thái job ứng tuyển | Mở rộng trực tiếp `US-018` (cùng entity Job ứng tuyển, cùng trang Roadmap) — áp dụng cùng lý do và cùng tiền lệ `DEC-088` |
| `US-021` | Tự điền thông tin job từ link tin tuyển dụng | Mở rộng trực tiếp `US-018` (cùng bảng "Theo dõi CV ứng tuyển") — user xác nhận tường minh giữ ngoài Business Flow theo tiền lệ `DEC-088` (`DEC-111`, `ssr-po mode=review` 2026-08-27) |

## 4. Trạng Thái Tổng Quan

| Chỉ số | Giá trị |
| --- | --- |
| Số nguồn raw đã ingest (cấu trúc nested) | 19 (US-002..US-010, US-012, US-014..US-022; `US-009` + `US-022` còn `Draft`, còn lại `Active`) — cộng `US-013` gộp vào `US-006`. Raw `US-023` chưa ingest |
| Số feature (cấu trúc nested) | 19 (như trên; `US-009` + `US-022` còn `Draft`, còn lại `Active`) |
| Số concept / business rule / workflow / entity | 0 / 37 / 0 / 7 |
| Conflict chưa xử lý | 0 |
