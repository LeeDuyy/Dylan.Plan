// Domain service: BR-009 — danh mục dự phòng "Chi tiêu khác" chỉ tự sinh khi thật
// sự cần (xóa danh mục cha còn giao dịch, hoặc ghi nhận không chọn danh mục), không
// có sẵn mặc định. Dùng chung bởi remove-category và record-quick-transaction (R13.4).

import type { CategoryEntity } from "../entities/category";
import type { CategoryRepository } from "../repositories/category-repository";

const FALLBACK_CATEGORY_NAME = "Chi tiêu khác";
const FALLBACK_CATEGORY_TYPE = "Khác"; // DEC-073 (thay DEC-056)
const FALLBACK_CATEGORY_BUDGET = 0; // DEC-057

export type FallbackCategoryServiceDeps = {
  categoryRepository: CategoryRepository;
};

export function createFallbackCategoryService(deps: FallbackCategoryServiceDeps) {
  return {
    async getOrCreate(monthId: string): Promise<CategoryEntity> {
      const existing = await deps.categoryRepository.findFallbackByMonth(monthId);
      if (existing) return existing;

      return deps.categoryRepository.create({
        monthId,
        name: FALLBACK_CATEGORY_NAME,
        type: FALLBACK_CATEGORY_TYPE,
        budget: FALLBACK_CATEGORY_BUDGET,
        locked: true,
        isFallback: true
      });
    }
  };
}

export type FallbackCategoryService = ReturnType<typeof createFallbackCategoryService>;
