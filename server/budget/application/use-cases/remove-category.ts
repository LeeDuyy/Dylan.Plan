import { revalidatePath } from "next/cache";

import type { CategoryRepository } from "../../domain/repositories/category-repository";
import type { TransactionRepository } from "../../domain/repositories/transaction-repository";
import type { FallbackCategoryService } from "../../domain/services/fallback-category-service";

export class RemoveCategoryError extends Error {}

export type RemoveCategoryResult = {
  /** Tên danh mục vừa xóa — dùng để dựng nội dung toast (DEC-054). */
  deletedName: string;
  /** Số giao dịch đã chuyển sang "Chi tiêu khác"; 0 nếu danh mục không có giao dịch nào. */
  movedCount: number;
};

export type RemoveCategoryDeps = {
  categoryRepository: CategoryRepository;
  transactionRepository: TransactionRepository;
  fallbackCategoryService: FallbackCategoryService;
};

export function createRemoveCategoryUseCase(deps: RemoveCategoryDeps) {
  return async function removeCategory(id: string): Promise<RemoveCategoryResult | null> {
    const category = await deps.categoryRepository.findById(id);
    if (!category) return null; // Đã không còn — coi như đã xóa, idempotent (giống deleteTransaction).

    if (category.locked) {
      throw new RemoveCategoryError("Không thể xoá danh mục cố định.");
    }

    const transactionCount = await deps.transactionRepository.countByCategory(id);
    let movedCount = 0;
    if (transactionCount > 0) {
      const fallback = await deps.fallbackCategoryService.getOrCreate(category.monthId);
      movedCount = await deps.transactionRepository.reassignCategory(id, fallback.id);
    }

    await deps.categoryRepository.delete(id);
    revalidatePath("/budget");

    return { deletedName: category.name, movedCount };
  };
}
