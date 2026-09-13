import { revalidatePath } from "next/cache";

import type { RoadmapRepository } from "../../domain/repositories/roadmap-repository";

export function createDeleteDeliverableUseCase(repository: RoadmapRepository) {
  return async function deleteDeliverable(id: string): Promise<void> {
    await repository.deleteDeliverable(id.trim());
    revalidatePath("/roadmap/timeline");
    revalidatePath("/");
  };
}
