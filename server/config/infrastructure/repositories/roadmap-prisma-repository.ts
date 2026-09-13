import type { PrismaClient } from "@/generated/prisma/client";
import { prisma as defaultPrisma } from "@/lib/prisma";

import type { RoadmapPhaseEntity } from "../../domain/entities/roadmap";
import type {
  RoadmapPhaseSeed,
  RoadmapRepository,
  UpsertDeliverableInput,
  UpsertPhaseInput
} from "../../domain/repositories/roadmap-repository";

type DeliverableRow = { id: string; title: string; desc: string };
type PhaseRow = {
  id: string;
  dateRange: string;
  label: string;
  title: string;
  desc: string;
  deliverables: DeliverableRow[];
};

function toEntity(row: PhaseRow): RoadmapPhaseEntity {
  return {
    id: row.id,
    dateRange: row.dateRange,
    label: row.label,
    title: row.title,
    desc: row.desc,
    deliverables: row.deliverables.map((deliverable) => ({
      id: deliverable.id,
      title: deliverable.title,
      desc: deliverable.desc
    }))
  };
}

async function nextOrder(count: () => Promise<{ _max: { order: number | null } }>): Promise<number> {
  return ((await count())._max.order ?? -1) + 1;
}

export function createRoadmapPrismaRepository(prisma: PrismaClient = defaultPrisma): RoadmapRepository {
  return {
    async findAll() {
      const rows = await prisma.roadmapPhase.findMany({
        orderBy: { order: "asc" },
        include: { deliverables: { orderBy: { order: "asc" } } }
      });
      return rows.map(toEntity);
    },
    async countPhases() {
      return prisma.roadmapPhase.count();
    },
    async listPhaseIds() {
      const rows = await prisma.roadmapPhase.findMany({ orderBy: { order: "asc" }, select: { id: true } });
      return rows.map((r) => r.id);
    },
    async upsertPhase(data: UpsertPhaseInput) {
      if (data.id) {
        const row = await prisma.roadmapPhase.update({
          where: { id: data.id },
          data: { dateRange: data.dateRange, label: data.label, title: data.title, desc: data.desc },
          include: { deliverables: { orderBy: { order: "asc" } } }
        });
        return toEntity(row);
      }
      const order = await nextOrder(() => prisma.roadmapPhase.aggregate({ _max: { order: true } }));
      const row = await prisma.roadmapPhase.create({
        data: { order, dateRange: data.dateRange, label: data.label, title: data.title, desc: data.desc },
        include: { deliverables: { orderBy: { order: "asc" } } }
      });
      return toEntity(row);
    },
    async deletePhase(id) {
      await prisma.roadmapPhase.delete({ where: { id } });
    },
    async reorderPhases(orderedIds) {
      await prisma.$transaction(
        orderedIds.map((id, index) => prisma.roadmapPhase.update({ where: { id }, data: { order: index } }))
      );
    },
    async upsertDeliverable(data: UpsertDeliverableInput) {
      if (data.id) {
        await prisma.roadmapDeliverable.update({ where: { id: data.id }, data: { title: data.title, desc: data.desc } });
        return;
      }
      const order = await nextOrder(() =>
        prisma.roadmapDeliverable.aggregate({ where: { phaseId: data.phaseId }, _max: { order: true } })
      );
      await prisma.roadmapDeliverable.create({
        data: { phaseId: data.phaseId, order, title: data.title, desc: data.desc }
      });
    },
    async deleteDeliverable(id) {
      await prisma.roadmapDeliverable.delete({ where: { id } });
    },
    async reorderDeliverables(_phaseId, orderedIds) {
      await prisma.$transaction(
        orderedIds.map((id, index) => prisma.roadmapDeliverable.update({ where: { id }, data: { order: index } }))
      );
    },
    async listDeliverableIds(phaseId) {
      const rows = await prisma.roadmapDeliverable.findMany({
        where: { phaseId },
        orderBy: { order: "asc" },
        select: { id: true }
      });
      return rows.map((r) => r.id);
    },
    async deleteAll() {
      await prisma.roadmapPhase.deleteMany();
    },
    async seed(seeds: RoadmapPhaseSeed[]) {
      for (const [phaseIndex, phase] of seeds.entries()) {
        await prisma.roadmapPhase.create({
          data: {
            order: phaseIndex,
            dateRange: phase.dateRange,
            label: phase.label,
            title: phase.title,
            desc: phase.desc,
            deliverables: {
              create: phase.deliverables.map((deliverable, deliverableIndex) => ({
                order: deliverableIndex,
                title: deliverable.title,
                desc: deliverable.desc
              }))
            }
          }
        });
      }
    },
    async createDefaultsIfEmpty(seeds: RoadmapPhaseSeed[]) {
      await prisma.$transaction(async (tx) => {
        const count = await tx.roadmapPhase.count();
        if (count > 0) return;
        for (const [phaseIndex, phase] of seeds.entries()) {
          await tx.roadmapPhase.create({
            data: {
              order: phaseIndex,
              dateRange: phase.dateRange,
              label: phase.label,
              title: phase.title,
              desc: phase.desc,
              deliverables: {
                create: phase.deliverables.map((deliverable, deliverableIndex) => ({
                  order: deliverableIndex,
                  title: deliverable.title,
                  desc: deliverable.desc
                }))
              }
            }
          });
        }
      });
    }
  };
}
