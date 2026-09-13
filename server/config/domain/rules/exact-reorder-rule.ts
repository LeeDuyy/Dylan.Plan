export class ExactReorderError extends Error {}

// Danh sách id gửi lên phải là hoán vị ĐẦY ĐỦ của tập id hiện có (không thiếu, không
// thừa, không trùng) — mẫu category-reorder-rule của budget.
export function assertExactIdSet(orderedIds: string[], expectedIds: string[]): void {
  const ids = orderedIds.map((id) => id.trim());
  if (ids.some((id) => !id)) {
    throw new ExactReorderError("Danh sách sắp xếp không được có id rỗng.");
  }
  const idSet = new Set(ids);
  const exact =
    ids.length === expectedIds.length &&
    idSet.size === expectedIds.length &&
    expectedIds.every((id) => idSet.has(id));
  if (!exact) {
    throw new ExactReorderError("Danh sách sắp xếp phải khớp đúng các mục hiện có.");
  }
}
