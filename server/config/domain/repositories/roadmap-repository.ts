import type { RoadmapPhaseEntity } from "../entities/roadmap";

export type UpsertPhaseInput = {
  id?: string;
  dateRange: string;
  label: string;
  title: string;
  desc: string;
};

export type UpsertDeliverableInput = {
  id?: string;
  phaseId: string;
  title: string;
  desc: string;
};

export type RoadmapPhaseSeed = {
  dateRange: string;
  label: string;
  title: string;
  desc: string;
  deliverables: { title: string; desc: string }[];
};

export interface RoadmapRepository {
  findAll(): Promise<RoadmapPhaseEntity[]>;
  countPhases(): Promise<number>;

  upsertPhase(data: UpsertPhaseInput): Promise<RoadmapPhaseEntity>;
  deletePhase(id: string): Promise<void>;
  reorderPhases(orderedIds: string[]): Promise<void>;
  listPhaseIds(): Promise<string[]>;

  upsertDeliverable(data: UpsertDeliverableInput): Promise<void>;
  deleteDeliverable(id: string): Promise<void>;
  reorderDeliverables(phaseId: string, orderedIds: string[]): Promise<void>;
  listDeliverableIds(phaseId: string): Promise<string[]>;

  deleteAll(): Promise<void>;
  createDefaultsIfEmpty(seeds: RoadmapPhaseSeed[]): Promise<void>;
  seed(seeds: RoadmapPhaseSeed[]): Promise<void>;
}
