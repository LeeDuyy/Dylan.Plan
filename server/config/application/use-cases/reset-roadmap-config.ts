import { revalidatePath } from "next/cache";

import type { DefaultRoadmapService } from "../../domain/services/default-roadmap-service";

export function createResetRoadmapConfigUseCase(defaultRoadmapService: DefaultRoadmapService) {
  return async function resetRoadmapConfig(): Promise<void> {
    await defaultRoadmapService.resetRoadmap();
    revalidatePath("/roadmap/timeline");
    revalidatePath("/");
  };
}
