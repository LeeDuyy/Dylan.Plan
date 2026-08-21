---
status: Active
updated: 2026-08-12
owner: ssr-ingest
tags: [kb/ba/wiki/knowledge/business-rule]
aliases: ["BR-016"]
---

# BR-016 — "Chi tiêu khác" luôn hiển thị ở cuối bảng danh mục

> Trang dùng lại được xuyên function. Một rule chỉ có một trang; function nào áp dụng thì liên kết tới đây thay vì chép lại nội dung.

## 1. Nội Dung Rule

Khi danh mục "Chi tiêu khác" đang hiển thị (đang có ít nhất một giao dịch — `BR-012`), nó luôn nằm ở dòng cuối cùng trong danh sách danh mục, bất kể nó được tạo ra vào lúc nào trong vòng đời của tháng. Các danh mục còn lại giữ nguyên thứ tự tương đối đã có với nhau — chỉ riêng "Chi tiêu khác" (nếu đang hiển thị) bị đưa xuống cuối.

Áp dụng cho mọi nơi hiển thị danh sách danh mục dùng chung một nguồn dữ liệu — không chỉ bảng ngân sách, mà cả nơi khác dùng lại đúng danh sách đó (ví dụ ô chọn danh mục khi ghi nhận nhanh, biểu đồ cơ cấu chi tiêu).

## 2. Áp Dụng Cho Function Nào

| Function | Áp dụng ở đâu |
| --- | --- |
| [`US-014`](../feature/US-014-chi-tieu-khac-cuoi-bang.md) | Danh sách danh mục hiển thị ở trang Thu chi — bảng ngân sách (`EL-01`), ô chọn danh mục khi ghi nhận nhanh (`EL-02`), biểu đồ cơ cấu chi tiêu (`EL-03`) — cả 3 nơi đã chốt qua `DEC-066` |
| [`US-017`](../feature/US-017-sap-xep-danh-muc-keo-tha.md) | Kéo thả sắp xếp lại vị trí danh mục (spec `Ready for DEV`, 8 AC) — "Chi tiêu khác" không tham gia kéo thả, luôn giữ nguyên ở cuối bất kể thao tác kéo thả của các danh mục khác (`DEC-076`, xem thêm [`BR-020`](BR-020-thu-tu-danh-muc-keo-tha.md)) |

## 3. Ngoại Lệ

| Ngoại lệ | Điều kiện | Function bị ảnh hưởng |
| --- | --- | --- |
| Không có | — | Không có |

## 4. Nguồn Bằng Chứng

| Bằng chứng | Path | Độ tin cậy |
| --- | --- | --- |
| Yêu cầu trực tiếp của user | `docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md` mục 2 | Đã xác nhận từ knowledge |
| "Chi tiêu khác" tạo lười biếng, vị trí hiện tại không đảm bảo ở cuối | `docs/kb/ba/raw/US-014-chi-tieu-khac-cuoi-bang.md` mục 3, `docs/memory/decisions.md#dec-026` | Đã xác nhận từ knowledge |
