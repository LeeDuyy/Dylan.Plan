"use server";

// Composition root cho bounded-context "config": nối repository (infrastructure,
// Prisma) -> domain service -> application use-case -> Server Action. Route/Client
// Component chỉ được import các hàm export ở đây, không import thẳng domain/infrastructure.

import { prisma } from "@/lib/prisma";

import { createGetNavConfigUseCase } from "./application/use-cases/get-nav-config";
import { createReorderNavUseCase } from "./application/use-cases/reorder-nav";
import { createResetNavConfigUseCase } from "./application/use-cases/reset-nav-config";
import { createSetNavVisibilityUseCase } from "./application/use-cases/set-nav-visibility";

import { createGetRoadmapConfigUseCase } from "./application/use-cases/get-roadmap-config";
import { createUpsertRoadmapPhaseUseCase } from "./application/use-cases/upsert-roadmap-phase";
import { createDeleteRoadmapPhaseUseCase } from "./application/use-cases/delete-roadmap-phase";
import { createReorderRoadmapPhasesUseCase } from "./application/use-cases/reorder-roadmap-phases";
import { createUpsertDeliverableUseCase } from "./application/use-cases/upsert-deliverable";
import { createDeleteDeliverableUseCase } from "./application/use-cases/delete-deliverable";
import { createReorderDeliverablesUseCase } from "./application/use-cases/reorder-deliverables";
import { createResetRoadmapConfigUseCase } from "./application/use-cases/reset-roadmap-config";

import { createGetTimetableConfigUseCase } from "./application/use-cases/get-timetable-config";
import { createUpsertTimetableRowUseCase } from "./application/use-cases/upsert-timetable-row";
import { createDeleteTimetableRowUseCase } from "./application/use-cases/delete-timetable-row";
import { createReorderTimetableRowsUseCase } from "./application/use-cases/reorder-timetable-rows";
import { createResetTimetableConfigUseCase } from "./application/use-cases/reset-timetable-config";

import { createDefaultNavPrefsService } from "./domain/services/default-nav-prefs-service";
import { createDefaultRoadmapService } from "./domain/services/default-roadmap-service";
import { createDefaultTimetableService } from "./domain/services/default-timetable-service";

import { createNavPrefPrismaRepository } from "./infrastructure/repositories/nav-pref-prisma-repository";
import { createRoadmapPrismaRepository } from "./infrastructure/repositories/roadmap-prisma-repository";
import { createTimetablePrismaRepository } from "./infrastructure/repositories/timetable-prisma-repository";

import type { NavPrefEntity } from "./domain/entities/nav-pref";
import type { RoadmapPhaseEntity } from "./domain/entities/roadmap";
import type { TimetableRowEntity } from "./domain/entities/timetable";
import type { ReorderNavInput } from "./application/use-cases/reorder-nav";
import type { SetNavVisibilityInput } from "./application/use-cases/set-nav-visibility";
import type { UpsertRoadmapPhaseInput } from "./application/use-cases/upsert-roadmap-phase";
import type { ReorderRoadmapPhasesInput } from "./application/use-cases/reorder-roadmap-phases";
import type { UpsertDeliverableInput } from "./application/use-cases/upsert-deliverable";
import type { ReorderDeliverablesInput } from "./application/use-cases/reorder-deliverables";
import type { UpsertTimetableRowInput } from "./application/use-cases/upsert-timetable-row";
import type { ReorderTimetableRowsInput } from "./application/use-cases/reorder-timetable-rows";

const navPrefRepository = createNavPrefPrismaRepository(prisma);
const roadmapRepository = createRoadmapPrismaRepository(prisma);
const timetableRepository = createTimetablePrismaRepository(prisma);

const defaultNavPrefsService = createDefaultNavPrefsService({ navPrefRepository });
const defaultRoadmapService = createDefaultRoadmapService({ roadmapRepository });
const defaultTimetableService = createDefaultTimetableService({ timetableRepository });

const getNavConfigUseCase = createGetNavConfigUseCase({ navPrefRepository, defaultNavPrefsService });
const reorderNavUseCase = createReorderNavUseCase(navPrefRepository);
const setNavVisibilityUseCase = createSetNavVisibilityUseCase(navPrefRepository);
const resetNavConfigUseCase = createResetNavConfigUseCase(defaultNavPrefsService);

const getRoadmapConfigUseCase = createGetRoadmapConfigUseCase({ roadmapRepository, defaultRoadmapService });
const upsertRoadmapPhaseUseCase = createUpsertRoadmapPhaseUseCase(roadmapRepository);
const deleteRoadmapPhaseUseCase = createDeleteRoadmapPhaseUseCase(roadmapRepository);
const reorderRoadmapPhasesUseCase = createReorderRoadmapPhasesUseCase(roadmapRepository);
const upsertDeliverableUseCase = createUpsertDeliverableUseCase(roadmapRepository);
const deleteDeliverableUseCase = createDeleteDeliverableUseCase(roadmapRepository);
const reorderDeliverablesUseCase = createReorderDeliverablesUseCase(roadmapRepository);
const resetRoadmapConfigUseCase = createResetRoadmapConfigUseCase(defaultRoadmapService);

const getTimetableConfigUseCase = createGetTimetableConfigUseCase({ timetableRepository, defaultTimetableService });
const upsertTimetableRowUseCase = createUpsertTimetableRowUseCase(timetableRepository);
const deleteTimetableRowUseCase = createDeleteTimetableRowUseCase(timetableRepository);
const reorderTimetableRowsUseCase = createReorderTimetableRowsUseCase(timetableRepository);
const resetTimetableConfigUseCase = createResetTimetableConfigUseCase(defaultTimetableService);

/* ---- Nav (GĐ2) ---- */
export async function getNavConfig(): Promise<NavPrefEntity[]> {
  return getNavConfigUseCase();
}
export async function reorderNav(input: ReorderNavInput): Promise<void> {
  return reorderNavUseCase(input);
}
export async function setNavVisibility(input: SetNavVisibilityInput): Promise<void> {
  return setNavVisibilityUseCase(input);
}
export async function resetNavConfig(): Promise<void> {
  return resetNavConfigUseCase();
}

/* ---- Roadmap (GĐ3) ---- */
export async function getRoadmapConfig(): Promise<RoadmapPhaseEntity[]> {
  return getRoadmapConfigUseCase();
}
export async function upsertRoadmapPhase(input: UpsertRoadmapPhaseInput): Promise<RoadmapPhaseEntity> {
  return upsertRoadmapPhaseUseCase(input);
}
export async function deleteRoadmapPhase(id: string): Promise<void> {
  return deleteRoadmapPhaseUseCase(id);
}
export async function reorderRoadmapPhases(input: ReorderRoadmapPhasesInput): Promise<void> {
  return reorderRoadmapPhasesUseCase(input);
}
export async function upsertDeliverable(input: UpsertDeliverableInput): Promise<void> {
  return upsertDeliverableUseCase(input);
}
export async function deleteDeliverable(id: string): Promise<void> {
  return deleteDeliverableUseCase(id);
}
export async function reorderDeliverables(input: ReorderDeliverablesInput): Promise<void> {
  return reorderDeliverablesUseCase(input);
}
export async function resetRoadmapConfig(): Promise<void> {
  return resetRoadmapConfigUseCase();
}

/* ---- Timetable (GĐ3) ---- */
export async function getTimetableConfig(): Promise<TimetableRowEntity[]> {
  return getTimetableConfigUseCase();
}
export async function upsertTimetableRow(input: UpsertTimetableRowInput): Promise<TimetableRowEntity> {
  return upsertTimetableRowUseCase(input);
}
export async function deleteTimetableRow(id: string): Promise<void> {
  return deleteTimetableRowUseCase(id);
}
export async function reorderTimetableRows(input: ReorderTimetableRowsInput): Promise<void> {
  return reorderTimetableRowsUseCase(input);
}
export async function resetTimetableConfig(): Promise<void> {
  return resetTimetableConfigUseCase();
}

export type { NavPrefEntity } from "./domain/entities/nav-pref";
export type { ReorderNavInput } from "./application/use-cases/reorder-nav";
export type { SetNavVisibilityInput } from "./application/use-cases/set-nav-visibility";
export type { RoadmapPhaseEntity } from "./domain/entities/roadmap";
export type { TimetableRowEntity } from "./domain/entities/timetable";
