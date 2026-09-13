import { revalidatePath } from "next/cache";

import type { RoadmapRepository } from "../../domain/repositories/roadmap-repository";
import { assertExactIdSet, ExactReorderError } from "../../domain/rules/exact-reorder-rule";

export type ReorderDeliverablesInput = { phaseId: string; orderedIds: string[] };

export class ReorderDeliverablesError extends Error {}

export function createReorderDeliverablesUseCase(repository: RoadmapRepository) {
  return async function reorderDeliverables(input: ReorderDeliverablesInput): Promise<void> {
    const phaseId = input.phaseId.trim();
    if (!phaseId || !Array.isArray(input.orderedIds)) {
      throw new ReorderDeliverablesError("Danh sách sắp xếp không hợp lệ.");
    }
    const existing = await repository.listDeliverableIds(phaseId);
    try {
      assertExactIdSet(input.orderedIds, existing);
    } catch (error) {
      if (error instanceof ExactReorderError) throw new ReorderDeliverablesError(error.message);
      throw error;
    }
    await repository.reorderDeliverables(
      phaseId,
      input.orderedIds.map((id) => id.trim())
    );
    revalidatePath("/roadmap/timeline");
    revalidatePath("/");
  };
}
