import { revalidatePath } from "next/cache";

import type { RoadmapRepository } from "../../domain/repositories/roadmap-repository";
import { assertExactIdSet, ExactReorderError } from "../../domain/rules/exact-reorder-rule";

export type ReorderRoadmapPhasesInput = { orderedIds: string[] };

export class ReorderRoadmapPhasesError extends Error {}

export function createReorderRoadmapPhasesUseCase(repository: RoadmapRepository) {
  return async function reorderRoadmapPhases(input: ReorderRoadmapPhasesInput): Promise<void> {
    if (!Array.isArray(input.orderedIds)) {
      throw new ReorderRoadmapPhasesError("Danh sách sắp xếp không hợp lệ.");
    }
    const existing = await repository.listPhaseIds();
    try {
      assertExactIdSet(input.orderedIds, existing);
    } catch (error) {
      if (error instanceof ExactReorderError) throw new ReorderRoadmapPhasesError(error.message);
      throw error;
    }
    await repository.reorderPhases(input.orderedIds.map((id) => id.trim()));
    revalidatePath("/roadmap/timeline");
    revalidatePath("/");
  };
}
