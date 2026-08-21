import type { CategoryEntity } from "../entities/category";

type CategoryNameSibling = Pick<CategoryEntity, "id" | "name" | "isFallback">;

export class DuplicateCategoryNameError extends Error {}

export function normalizeCategoryName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function formatCategoryNameForMessage(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function assertCategoryNameNotDuplicate(
  name: string,
  siblings: CategoryNameSibling[],
  excludeId?: string
): void {
  const normalizedName = normalizeCategoryName(name);
  const hasDuplicate = siblings.some((sibling) => {
    if (sibling.isFallback) return false;
    if (excludeId && sibling.id === excludeId) return false;
    return normalizeCategoryName(sibling.name) === normalizedName;
  });

  if (hasDuplicate) {
    throw new DuplicateCategoryNameError(
      `Tên danh mục "${formatCategoryNameForMessage(name)}" đã tồn tại trong tháng này. Vui lòng đổi tên khác.`
    );
  }
}
