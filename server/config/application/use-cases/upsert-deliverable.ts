import { revalidatePath } from "next/cache";

import type { RoadmapRepository } from "../../domain/repositories/roadmap-repository";

export type UpsertDeliverableInput = {
  id?: string;
  phaseId: string;
  title: string;
  desc: string;
};

export class UpsertDeliverableError extends Error {}

export function createUpsertDeliverableUseCase(repository: RoadmapRepository) {
  return async function upsertDeliverable(input: UpsertDeliverableInput): Promise<void> {
    const title = input.title.trim();
    const desc = input.desc.trim();
    const phaseId = input.phaseId.trim();
    if (!title) {
      throw new UpsertDeliverableError("Tiêu đề đầu ra không được để trống.");
    }
    if (!phaseId) {
      throw new UpsertDeliverableError("Thiếu giai đoạn cho đầu ra.");
    }
    await repository.upsertDeliverable({ id: input.id, phaseId, title, desc });
    revalidatePath("/roadmap/timeline");
    revalidatePath("/");
  };
}
