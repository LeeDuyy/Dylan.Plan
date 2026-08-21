import type { CategoryEntity } from "../entities/category";

type ReorderableCategory = Pick<CategoryEntity, "id" | "isFallback">;

export class CategoryReorderError extends Error {}

export function assertReorderableCategories(
  orderedIds: string[],
  existingCategories: ReorderableCategory[]
): void {
  const existingById = new Map(existingCategories.map((category) => [category.id, category]));

  for (const id of orderedIds) {
    const category = existingById.get(id);
    if (!category) {
      throw new CategoryReorderError("Danh mục sắp xếp không tồn tại trong tháng này.");
    }
    if (category.isFallback) {
      throw new CategoryReorderError("Không thể kéo thả danh mục 'Chi tiêu khác'.");
    }
  }

  const expectedIds = existingCategories.filter((category) => !category.isFallback).map((category) => category.id);
  const orderedSet = new Set(orderedIds);
  const isExactMatch =
    orderedIds.length === expectedIds.length &&
    orderedSet.size === expectedIds.length &&
    expectedIds.every((id) => orderedSet.has(id));

  if (!isExactMatch) {
    throw new CategoryReorderError("Danh sách sắp xếp phải khớp chính xác các danh mục của tháng này.");
  }
}
