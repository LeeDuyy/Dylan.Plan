import { revalidatePath } from "next/cache";

import type { PurchaseItemEntity } from "../../domain/entities/purchase-item";
import type { PurchaseItemRepository } from "../../domain/repositories/purchase-item-repository";
import { assertMonthIsCurrent, CurrentMonthViolationError } from "../../domain/rules/current-month-rule";

export class MarkPurchaseItemPurchasedError extends Error {}

export function createMarkPurchaseItemPurchasedUseCase(repository: PurchaseItemRepository) {
  return async function markPurchaseItemPurchased(id: string): Promise<PurchaseItemEntity | null> {
    const current = await repository.findById(id);
    if (!current) return null;

    try {
      assertMonthIsCurrent(current.monthId);
    } catch (error) {
      if (error instanceof CurrentMonthViolationError) {
        throw new MarkPurchaseItemPurchasedError(error.message);
      }
      throw error;
    }

    if (current.status === "Purchased") return current;

    const result = await repository.markPurchased(id);
    revalidatePath("/budget");
    return result;
  };
}
