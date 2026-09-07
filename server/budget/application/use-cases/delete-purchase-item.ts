import { revalidatePath } from "next/cache";

import type { PurchaseItemRepository } from "../../domain/repositories/purchase-item-repository";
import { assertMonthNotPast, MonthInPastError } from "../../domain/rules/current-month-rule";

export class DeletePurchaseItemError extends Error {}

export function createDeletePurchaseItemUseCase(repository: PurchaseItemRepository) {
  return async function deletePurchaseItem(id: string): Promise<void> {
    const current = await repository.findById(id);
    if (!current) return;

    try {
      assertMonthNotPast(current.monthId);
    } catch (error) {
      if (error instanceof MonthInPastError) {
        throw new DeletePurchaseItemError("Chỉ được thao tác item cần mua từ tháng hiện tại trở đi.");
      }
      throw error;
    }

    await repository.delete(id);
    revalidatePath("/budget");
  };
}
