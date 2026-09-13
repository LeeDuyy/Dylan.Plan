import type { RoadmapPhaseEntity } from "../../domain/entities/roadmap";
import type { RoadmapRepository } from "../../domain/repositories/roadmap-repository";
import type { DefaultRoadmapService } from "../../domain/services/default-roadmap-service";

export type GetRoadmapConfigDeps = {
  roadmapRepository: RoadmapRepository;
  defaultRoadmapService: DefaultRoadmapService;
};

export function createGetRoadmapConfigUseCase(deps: GetRoadmapConfigDeps) {
  return async function getRoadmapConfig(): Promise<RoadmapPhaseEntity[]> {
    await deps.defaultRoadmapService.ensureDefaultRoadmap();
    return deps.roadmapRepository.findAll();
  };
}
