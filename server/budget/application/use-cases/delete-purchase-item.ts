import { revalidatePath } from "next/cache";

import type { PurchaseItemRepository } from "../../domain/repositories/purchase-item-repository";
import { assertMonthIsCurrent, CurrentMonthViolationError } from "../../domain/rules/current-month-rule";

export class DeletePurchaseItemError extends Error {}

export function createDeletePurchaseItemUseCase(repository: PurchaseItemRepository) {
  return async function deletePurchaseItem(id: string): Promise<void> {
    const current = await repository.findById(id);
    if (!current) return;

    try {
      assertMonthIsCurrent(current.monthId);
    } catch (error) {
      if (error instanceof CurrentMonthViolationError) {
        throw new DeletePurchaseItemError(error.message);
      }
      throw error;
    }

    await repository.delete(id);
    revalidatePath("/budget");
  };
}
