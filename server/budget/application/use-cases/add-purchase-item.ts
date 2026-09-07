import { revalidatePath } from "next/cache";

import type { PurchaseItemEntity } from "../../domain/entities/purchase-item";
import type { PurchaseItemRepository } from "../../domain/repositories/purchase-item-repository";
import { assertMonthNotPast, MonthInPastError } from "../../domain/rules/current-month-rule";
import {
  assertValidPurchaseItemName,
  assertValidPurchaseItemPrice,
  InvalidPurchaseItemInputError
} from "../../domain/rules/purchase-item-rule";

export type AddPurchaseItemInput = {
  monthId: string;
  name: string;
  price?: number | null;
};

export class AddPurchaseItemError extends Error {}

function normalizePrice(price: number | null | undefined): number | null {
  return price == null ? null : Math.round(price);
}

export function createAddPurchaseItemUseCase(repository: PurchaseItemRepository) {
  return async function addPurchaseItem(input: AddPurchaseItemInput): Promise<PurchaseItemEntity> {
    const monthId = input.monthId.trim();
    const name = input.name.trim();
    const price = normalizePrice(input.price);

    try {
      assertMonthNotPast(monthId);
      assertValidPurchaseItemName(name);
      assertValidPurchaseItemPrice(price);
    } catch (error) {
      if (error instanceof MonthInPastError) {
        throw new AddPurchaseItemError("Chỉ được thao tác item cần mua từ tháng hiện tại trở đi.");
      }
      if (error instanceof InvalidPurchaseItemInputError) {
        throw new AddPurchaseItemError(error.message);
      }
      throw error;
    }

    const result = await repository.create({ monthId, name, price, status: "Pending" });
    revalidatePath("/budget");
    return result;
  };
}
