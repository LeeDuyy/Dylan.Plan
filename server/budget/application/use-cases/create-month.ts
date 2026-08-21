import { revalidatePath } from "next/cache";

import { DEFAULT_INCOME, defaultCategories } from "@/lib/budget-defaults";

import type { MonthBudgetEntity } from "../../domain/entities/month-budget";
import type { CategoryRepository } from "../../domain/repositories/category-repository";
import type { MonthBudgetRepository } from "../../domain/repositories/month-budget-repository";
import type { PurchaseItemRepository } from "../../domain/repositories/purchase-item-repository";
import { getCurrentMonthId } from "../../domain/rules/current-month-rule";

export type CreateMonthInput = {
  monthId: string;
  /** Tháng nguồn để sao chép danh mục (tên/loại/ngân sách); bỏ trống dùng danh mục mặc định. */
  sourceMonthId?: string;
};

export class CreateMonthError extends Error {}

function formatMonthLabel(id: string): string {
  const [year, month] = id.split("-");
  const numericMonth = Number(month);
  return Number.isFinite(numericMonth) && year ? `Tháng ${numericMonth}/${year}` : id;
}

export type CreateMonthDeps = {
  monthBudgetRepository: MonthBudgetRepository;
  categoryRepository: CategoryRepository;
  purchaseItemRepository: PurchaseItemRepository;
};

export function createCreateMonthUseCase(deps: CreateMonthDeps) {
  return async function createMonth(input: CreateMonthInput): Promise<MonthBudgetEntity> {
    const monthId = input.monthId.trim();
    if (!/^\d{4}-\d{2}$/.test(monthId)) {
      throw new CreateMonthError("Mã tháng phải theo định dạng YYYY-MM.");
    }

    const existing = await deps.monthBudgetRepository.findById(monthId);
    if (existing) {
      throw new CreateMonthError("Tháng này đã tồn tại.");
    }

    const month = await deps.monthBudgetRepository.create({
      id: monthId,
      label: formatMonthLabel(monthId),
      income: DEFAULT_INCOME
    });

    // Không kế thừa "Chi tiêu khác" khi sao chép tháng — chỉ tự sinh khi tháng mới
    // thật sự cần, không phải bản sao từ tháng nguồn (DEC-026, JDG-010).
    const sourceCategories = input.sourceMonthId
      ? (await deps.categoryRepository.findByMonth(input.sourceMonthId)).filter((category) => !category.isFallback)
      : [];

    const seedCategories = sourceCategories.length
      ? sourceCategories.map((category, index) => ({
          name: category.name,
          type: category.type,
          budget: category.budget,
          locked: category.locked,
          order: index
        }))
      : defaultCategories.map((category, index) => ({
          name: category.name,
          type: category.type,
          budget: category.budget,
          locked: Boolean(category.locked),
          order: index
        }));

    for (const category of seedCategories) {
      await deps.categoryRepository.create({ monthId, ...category });
    }

    await deps.purchaseItemRepository.transferPendingToMonth(getCurrentMonthId(), monthId);

    revalidatePath("/budget");
    return month;
  };
}
