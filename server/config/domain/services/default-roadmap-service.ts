import { DEFAULT_ROADMAP_PHASES } from "@/lib/roadmap-defaults";

import type { RoadmapPhaseSeed, RoadmapRepository } from "../repositories/roadmap-repository";

function seeds(): RoadmapPhaseSeed[] {
  return DEFAULT_ROADMAP_PHASES.map((phase) => ({
    dateRange: phase.dateRange,
    label: phase.label,
    title: phase.title,
    desc: phase.desc,
    deliverables: phase.deliverables.map((deliverable) => ({ title: deliverable.title, desc: deliverable.desc }))
  }));
}

export type DefaultRoadmapServiceDeps = { roadmapRepository: RoadmapRepository };

export function createDefaultRoadmapService(deps: DefaultRoadmapServiceDeps) {
  return {
    async ensureDefaultRoadmap(): Promise<void> {
      await deps.roadmapRepository.createDefaultsIfEmpty(seeds());
    },
    async resetRoadmap(): Promise<void> {
      await deps.roadmapRepository.deleteAll();
      await deps.roadmapRepository.seed(seeds());
    }
  };
}

export type DefaultRoadmapService = ReturnType<typeof createDefaultRoadmapService>;
