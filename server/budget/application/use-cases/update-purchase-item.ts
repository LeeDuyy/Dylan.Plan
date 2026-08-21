import { revalidatePath } from "next/cache";

import type { PurchaseItemEntity } from "../../domain/entities/purchase-item";
import type { PurchaseItemRepository, UpdatePurchaseItemInput } from "../../domain/repositories/purchase-item-repository";
import { assertMonthIsCurrent, CurrentMonthViolationError } from "../../domain/rules/current-month-rule";
import {
  assertValidPurchaseItemName,
  assertValidPurchaseItemPrice,
  InvalidPurchaseItemInputError
} from "../../domain/rules/purchase-item-rule";

export type UpdatePurchaseItemUseCaseInput = {
  id: string;
  name?: string;
  price?: number | null;
};

export class UpdatePurchaseItemError extends Error {}

function normalizePrice(price: number | null | undefined): number | null | undefined {
  return price == null ? price : Math.round(price);
}

export function createUpdatePurchaseItemUseCase(repository: PurchaseItemRepository) {
  return async function updatePurchaseItem(input: UpdatePurchaseItemUseCaseInput): Promise<PurchaseItemEntity | null> {
    const hasNamePatch = Object.prototype.hasOwnProperty.call(input, "name");
    const hasPricePatch = Object.prototype.hasOwnProperty.call(input, "price");
    if (!hasNamePatch && !hasPricePatch) {
      throw new UpdatePurchaseItemError("Cần có tên sản phẩm hoặc giá để cập nhật.");
    }

    const patch: UpdatePurchaseItemInput = {};
    try {
      if (hasNamePatch) {
        const name = (input.name ?? "").trim();
        assertValidPurchaseItemName(name);
        patch.name = name;
      }
      if (hasPricePatch) {
        const price = normalizePrice(input.price);
        assertValidPurchaseItemPrice(price);
        patch.price = price ?? null;
      }
    } catch (error) {
      if (error instanceof InvalidPurchaseItemInputError) {
        throw new UpdatePurchaseItemError(error.message);
      }
      throw error;
    }

    const current = await repository.findById(input.id);
    if (!current) return null;

    try {
      assertMonthIsCurrent(current.monthId);
    } catch (error) {
      if (error instanceof CurrentMonthViolationError) {
        throw new UpdatePurchaseItemError(error.message);
      }
      throw error;
    }

    const result = await repository.update(input.id, patch);
    revalidatePath("/budget");
    return result;
  };
}
