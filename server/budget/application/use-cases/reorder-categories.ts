import { revalidatePath } from "next/cache";

import type { CategoryRepository } from "../../domain/repositories/category-repository";
import {
  assertReorderableCategories,
  CategoryReorderError
} from "../../domain/rules/category-reorder-rule";

export type ReorderCategoriesInput = {
  monthId: string;
  orderedCategoryIds: string[];
};

export class ReorderCategoriesError extends Error {}

export function createReorderCategoriesUseCase(repository: CategoryRepository) {
  return async function reorderCategories(input: ReorderCategoriesInput): Promise<void> {
    const monthId = input.monthId.trim();
    if (!/^\d{4}-\d{2}$/.test(monthId)) {
      throw new ReorderCategoriesError("Mã tháng phải theo định dạng YYYY-MM.");
    }
    if (!Array.isArray(input.orderedCategoryIds)) {
      throw new ReorderCategoriesError("Danh sách sắp xếp không hợp lệ.");
    }

    const orderedCategoryIds = input.orderedCategoryIds.map((id) => id.trim());
    if (orderedCategoryIds.some((id) => !id)) {
      throw new ReorderCategoriesError("Danh sách sắp xếp không được có id rỗng.");
    }

    const existingCategories = await repository.findByMonth(monthId);
    try {
      assertReorderableCategories(orderedCategoryIds, existingCategories);
    } catch (error) {
      if (error instanceof CategoryReorderError) {
        throw new ReorderCategoriesError(error.message);
      }
      throw error;
    }

    await repository.reorder(monthId, orderedCategoryIds);
    revalidatePath("/budget");
  };
}
