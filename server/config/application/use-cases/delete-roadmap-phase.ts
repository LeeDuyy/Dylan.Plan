import { revalidatePath } from "next/cache";

import type { RoadmapRepository } from "../../domain/repositories/roadmap-repository";

export class DeleteRoadmapPhaseError extends Error {}

export function createDeleteRoadmapPhaseUseCase(repository: RoadmapRepository) {
  return async function deleteRoadmapPhase(id: string): Promise<void> {
    const phaseIds = await repository.listPhaseIds();
    if (phaseIds.length <= 1) {
      throw new DeleteRoadmapPhaseError("Phải giữ ít nhất một giai đoạn roadmap.");
    }
    await repository.deletePhase(id.trim());
    revalidatePath("/roadmap/timeline");
    revalidatePath("/");
  };
}
