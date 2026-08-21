import { revalidatePath } from "next/cache";

import type { CategoryEntity } from "../../domain/entities/category";
import type { CategoryRepository } from "../../domain/repositories/category-repository";
import { assertCategoryNameNotDuplicate } from "../../domain/rules/category-name-rule";
import { assertValidCategoryType, InvalidCategoryTypeError } from "../../domain/rules/category-type-rule";

export type UpsertCategoryInput = {
  /** Có id => cập nhật tên/loại/ngân sách; không có id => tạo mới. */
  id?: string;
  monthId: string;
  name: string;
  type: string;
  budget: number;
};

export class UpsertCategoryError extends Error {}

export function createUpsertCategoryUseCase(repository: CategoryRepository) {
  return async function upsertCategory(input: UpsertCategoryInput): Promise<CategoryEntity> {
    const name = input.name.trim();
    const type = input.type.trim();
    if (!name) {
      throw new UpsertCategoryError("Tên danh mục không được để trống.");
    }
    try {
      assertValidCategoryType(type);
    } catch (error) {
      if (error instanceof InvalidCategoryTypeError) {
        throw new UpsertCategoryError(error.message);
      }
      throw error;
    }
    if (!Number.isFinite(input.budget) || input.budget < 0) {
      throw new UpsertCategoryError("Ngân sách danh mục phải là số không âm.");
    }

    if (input.id) {
      const existing = await repository.findById(input.id);
      if (existing?.isFallback) {
        throw new UpsertCategoryError("Không thể sửa danh mục 'Chi tiêu khác'.");
      }
    }

    const siblings = await repository.findByMonth(input.monthId);
    assertCategoryNameNotDuplicate(name, siblings, input.id);

    const result = input.id
      ? await repository.update(input.id, { name, type, budget: input.budget })
      : await repository.create({ monthId: input.monthId, name, type, budget: input.budget });

    revalidatePath("/budget");
    return result;
  };
}
