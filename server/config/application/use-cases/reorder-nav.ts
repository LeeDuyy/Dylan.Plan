import { revalidatePath } from "next/cache";

import type { NavPrefRepository } from "../../domain/repositories/nav-pref-repository";
import { assertValidNavReorder, NavReorderError } from "../../domain/rules/nav-reorder-rule";

export type ReorderNavInput = {
  orderedIds: string[];
};

export class ReorderNavError extends Error {}

export function createReorderNavUseCase(repository: NavPrefRepository) {
  return async function reorderNav(input: ReorderNavInput): Promise<void> {
    if (!Array.isArray(input.orderedIds)) {
      throw new ReorderNavError("Danh sách sắp xếp không hợp lệ.");
    }

    const orderedIds = input.orderedIds.map((id) => id.trim());
    try {
      assertValidNavReorder(orderedIds);
    } catch (error) {
      if (error instanceof NavReorderError) {
        throw new ReorderNavError(error.message);
      }
      throw error;
    }

    await repository.reorder(orderedIds);
    revalidatePath("/", "layout");
  };
}
