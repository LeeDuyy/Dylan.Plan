# rules.md — Luật riêng của dự án

Updated: 2026-07-29
Scope: Dự án `DylanPlan`.
Kế thừa: `${CLAUDE_PLUGIN_ROOT}/memory/rules.md` (kit-level). Luật ở đây **bổ sung**, không được mâu thuẫn với kit-level.

Chỉ ghi luật KHÔNG suy ra được từ code, git history hay knowledge base.

---

## P1. Nghiệp vụ

| ID | Luật | Nguồn | Ngày chốt |
| --- | --- | --- | --- |
| P1.1 | Một giao dịch chi tiêu (F1) chỉ được ghi nhận hoặc sửa với ngày ≤ hôm nay — hệ thống chỉ ghi nhận các giao dịch đã xảy ra từ hiện tại về quá khứ, không cho phép ngày giao dịch ở tương lai dưới bất kỳ hình thức nào (mốc thời gian suy ra từ nội dung nhập nhanh, hoặc sửa trực tiếp trường ngày của giao dịch đã có) | `docs/memory/decisions.md#dec-013`, `docs/memory/decisions.md#dec-017` | 2026-07-29 |

## P2. Dữ liệu

| ID | Luật | Nguồn | Ngày chốt |
| --- | --- | --- | --- |
| P2.1 | <ràng buộc dữ liệu, ví dụ: không xóa cứng bản ghi có lịch sử> | `<bằng chứng>` | <YYYY-MM-DD> |

## P3. Phân quyền

| ID | Luật | Nguồn | Ngày chốt |
| --- | --- | --- | --- |
| P3.1 | <luật phân quyền> | `<bằng chứng>` | <YYYY-MM-DD> |

## P4. Vận hành và triển khai

| ID | Luật | Nguồn | Ngày chốt |
| --- | --- | --- | --- |
| P4.1 | <ví dụ: migration chỉ chạy ngoài giờ làm việc> | `<bằng chứng>` | <YYYY-MM-DD> |

## P5. Ngoại lệ so với kit-level

| Luật kit bị nới | Lý do | Ai duyệt | Ngày |
| --- | --- | --- | --- |
| <R#.#> | <lý do> | <người duyệt> | <YYYY-MM-DD> |
