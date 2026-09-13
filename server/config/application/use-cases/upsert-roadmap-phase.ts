import { revalidatePath } from "next/cache";

import type { RoadmapPhaseEntity } from "../../domain/entities/roadmap";
import type { RoadmapRepository } from "../../domain/repositories/roadmap-repository";
import { assertValidDateRange, RoadmapDateRangeError } from "../../domain/rules/roadmap-date-range-rule";

export type UpsertRoadmapPhaseInput = {
  id?: string;
  dateRange: string;
  label: string;
  title: string;
  desc: string;
};

export class UpsertRoadmapPhaseError extends Error {}

export function createUpsertRoadmapPhaseUseCase(repository: RoadmapRepository) {
  return async function upsertRoadmapPhase(input: UpsertRoadmapPhaseInput): Promise<RoadmapPhaseEntity> {
    const dateRange = input.dateRange.trim();
    const label = input.label.trim();
    const title = input.title.trim();
    const desc = input.desc.trim();

    if (!label || !title) {
      throw new UpsertRoadmapPhaseError("Nhãn và tiêu đề giai đoạn không được để trống.");
    }
    try {
      assertValidDateRange(dateRange);
    } catch (error) {
      if (error instanceof RoadmapDateRangeError) throw new UpsertRoadmapPhaseError(error.message);
      throw error;
    }

    const phase = await repository.upsertPhase({ id: input.id, dateRange, label, title, desc });
    revalidatePath("/roadmap/timeline");
    revalidatePath("/");
    return phase;
  };
}
