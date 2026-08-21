import { revalidatePath } from "next/cache";

import { DEFAULT_INCOME, defaultCategories } from "@/lib/budget-defaults";

import type { CategoryRepository } from "../../domain/repositories/category-repository";
import type { MonthBudgetRepository } from "../../domain/repositories/month-budget-repository";

// 3 tháng mặc định ban đầu của app (khớp hiệu ứng quan sát được trước đây: luôn có
// 3 tháng, tháng gần nhất được chọn). "Chi thực tế" giờ luôn suy ra từ Transaction
// thật nên không còn mô phỏng tỷ lệ chi tiêu giả cho 2 tháng cũ như bản cũ.
const DEFAULT_MONTH_IDS = ["2026-04", "2026-05", "2026-06"];

function formatMonthLabel(id: string): string {
  const [year, month] = id.split("-");
  const numericMonth = Number(month);
  return Number.isFinite(numericMonth) && year ? `Tháng ${numericMonth}/${year}` : id;
}

export type ResetAllBudgetDataDeps = {
  monthBudgetRepository: MonthBudgetRepository;
  categoryRepository: CategoryRepository;
};

export function createResetAllBudgetDataUseCase(deps: ResetAllBudgetDataDeps) {
  return async function resetAllBudgetData(): Promise<void> {
    await deps.monthBudgetRepository.deleteAll();

    for (const monthId of DEFAULT_MONTH_IDS) {
      await deps.monthBudgetRepository.create({
        id: monthId,
        label: formatMonthLabel(monthId),
        income: DEFAULT_INCOME
      });
      for (const category of defaultCategories) {
        await deps.categoryRepository.create({
          monthId,
          name: category.name,
          type: category.type,
          budget: category.budget,
          locked: Boolean(category.locked)
        });
      }
    }

    revalidatePath("/budget");
  };
}
