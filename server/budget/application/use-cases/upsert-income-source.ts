import { revalidatePath } from "next/cache";

import type { IncomeSourceEntity } from "../../domain/entities/income-source";
import type { IncomeSourceRepository } from "../../domain/repositories/income-source-repository";
import { assertMonthNotPast, MonthInPastError } from "../../domain/rules/current-month-rule";
import {
  assertValidIncomeSourceAmount,
  assertValidIncomeSourceName,
  InvalidIncomeSourceInputError
} from "../../domain/rules/income-source-rule";

export type UpsertIncomeSourceInput = {
  id?: string;
  monthId: string;
  name: string;
  amount: number;
};

export class UpsertIncomeSourceError extends Error {}

export function createUpsertIncomeSourceUseCase(repository: IncomeSourceRepository) {
  return async function upsertIncomeSource(input: UpsertIncomeSourceInput): Promise<IncomeSourceEntity> {
    const monthId = input.monthId.trim();
    const id = input.id?.trim();
    const name = input.name.trim();
    if (!/^\d{4}-\d{2}$/.test(monthId)) {
      throw new UpsertIncomeSourceError("Mã tháng phải theo định dạng YYYY-MM.");
    }
    if (input.id != null && !id) {
      throw new UpsertIncomeSourceError("Id nguồn thu không được để trống.");
    }

    try {
      assertValidIncomeSourceName(name);
      assertValidIncomeSourceAmount(input.amount);
      assertMonthNotPast(monthId);
    } catch (error) {
      if (error instanceof InvalidIncomeSourceInputError || error instanceof MonthInPastError) {
        throw new UpsertIncomeSourceError(error.message);
      }
      throw error;
    }

    if (id) {
      const current = await repository.findById(id);
      if (current) {
        try {
          assertMonthNotPast(current.monthId);
        } catch (error) {
          if (error instanceof MonthInPastError) {
            throw new UpsertIncomeSourceError(error.message);
          }
          throw error;
        }
      }
    }

    const result = id
      ? await repository.update(id, { name, amount: input.amount })
      : await repository.create({ monthId, name, amount: input.amount });

    revalidatePath("/budget");
    return result;
  };
}
