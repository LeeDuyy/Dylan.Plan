import { revalidatePath } from "next/cache";

import type { IncomeSourceRepository } from "../../domain/repositories/income-source-repository";
import { assertMonthNotPast, MonthInPastError } from "../../domain/rules/current-month-rule";

export class RemoveIncomeSourceError extends Error {}

export function createRemoveIncomeSourceUseCase(repository: IncomeSourceRepository) {
  return async function removeIncomeSource(id: string): Promise<void> {
    const sourceId = id.trim();
    if (!sourceId) return;

    const current = await repository.findById(sourceId);
    if (!current) return;

    try {
      assertMonthNotPast(current.monthId);
    } catch (error) {
      if (error instanceof MonthInPastError) {
        throw new RemoveIncomeSourceError(error.message);
      }
      throw error;
    }

    await repository.delete(sourceId);
    revalidatePath("/budget");
  };
}
