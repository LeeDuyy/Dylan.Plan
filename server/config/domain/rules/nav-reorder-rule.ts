import { resolveReorderScope } from "@/lib/nav-registry";

export class NavReorderError extends Error {}

// Danh sách sắp xếp phải là một hoán vị đầy đủ của một cấp anh em: hoặc toàn bộ
// nhóm cha, hoặc toàn bộ section con của đúng một nhóm.
export function assertValidNavReorder(orderedIds: string[]): void {
  const ids = orderedIds.map((id) => id.trim());
  if (ids.some((id) => !id)) {
    throw new NavReorderError("Danh sách sắp xếp không được có id rỗng.");
  }

  const scope = resolveReorderScope(ids);
  if (!scope) {
    throw new NavReorderError("Danh sách sắp xếp không thuộc một cấp điều hướng hợp lệ.");
  }

  const idSet = new Set(ids);
  const exactMatch =
    ids.length === scope.expected.length &&
    idSet.size === scope.expected.length &&
    scope.expected.every((id) => idSet.has(id));

  if (!exactMatch) {
    throw new NavReorderError("Danh sách sắp xếp phải khớp đúng các mục cùng cấp.");
  }
}
