import type { CategoryEntity } from "../entities/category";

export type CreateCategoryInput = {
  id?: string;
  monthId: string;
  name: string;
  type: string;
  budget: number;
  locked?: boolean;
  isFallback?: boolean;
  order?: number;
};

export type UpdateCategoryInput = Partial<Pick<CategoryEntity, "name" | "type" | "budget" | "locked" | "order">>;

export interface CategoryRepository {
  findAll(): Promise<CategoryEntity[]>;
  findByMonth(monthId: string): Promise<CategoryEntity[]>;
  findById(id: string): Promise<CategoryEntity | null>;
  /** Danh mục dự phòng "Chi tiêu khác" của một tháng, nếu đã tồn tại (BR-009). */
  findFallbackByMonth(monthId: string): Promise<CategoryEntity | null>;
  create(data: CreateCategoryInput): Promise<CategoryEntity>;
  upsert(data: CategoryEntity): Promise<CategoryEntity>;
  update(id: string, patch: UpdateCategoryInput): Promise<CategoryEntity>;
  reorder(monthId: string, orderedIds: string[]): Promise<void>;
  delete(id: string): Promise<void>;
}
