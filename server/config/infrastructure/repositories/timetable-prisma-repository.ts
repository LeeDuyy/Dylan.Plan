import type { PrismaClient } from "@/generated/prisma/client";
import { prisma as defaultPrisma } from "@/lib/prisma";

import type { TimetableRowEntity } from "../../domain/entities/timetable";
import type {
  TimetableRepository,
  TimetableRowSeed,
  UpsertTimetableRowInput
} from "../../domain/repositories/timetable-repository";

type TimetableRow = {
  id: string;
  timeLabel: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
};

function toEntity(row: TimetableRow): TimetableRowEntity {
  return {
    id: row.id,
    timeLabel: row.timeLabel,
    mon: row.mon,
    tue: row.tue,
    wed: row.wed,
    thu: row.thu,
    fri: row.fri,
    sat: row.sat,
    sun: row.sun
  };
}

function cells(data: UpsertTimetableRowInput) {
  return {
    timeLabel: data.timeLabel,
    mon: data.mon,
    tue: data.tue,
    wed: data.wed,
    thu: data.thu,
    fri: data.fri,
    sat: data.sat,
    sun: data.sun
  };
}

export function createTimetablePrismaRepository(prisma: PrismaClient = defaultPrisma): TimetableRepository {
  return {
    async findAll() {
      const rows = await prisma.timetableRow.findMany({ orderBy: { order: "asc" } });
      return rows.map(toEntity);
    },
    async countRows() {
      return prisma.timetableRow.count();
    },
    async listRowIds() {
      const rows = await prisma.timetableRow.findMany({ orderBy: { order: "asc" }, select: { id: true } });
      return rows.map((r) => r.id);
    },
    async upsertRow(data: UpsertTimetableRowInput) {
      if (data.id) {
        const row = await prisma.timetableRow.update({ where: { id: data.id }, data: cells(data) });
        return toEntity(row);
      }
      const order = ((await prisma.timetableRow.aggregate({ _max: { order: true } }))._max.order ?? -1) + 1;
      const row = await prisma.timetableRow.create({ data: { order, ...cells(data) } });
      return toEntity(row);
    },
    async deleteRow(id) {
      await prisma.timetableRow.delete({ where: { id } });
    },
    async reorderRows(orderedIds) {
      await prisma.$transaction(
        orderedIds.map((id, index) => prisma.timetableRow.update({ where: { id }, data: { order: index } }))
      );
    },
    async deleteAll() {
      await prisma.timetableRow.deleteMany();
    },
    async seed(seeds: TimetableRowSeed[]) {
      await prisma.timetableRow.createMany({
        data: seeds.map((seed, index) => ({ order: index, ...seed }))
      });
    },
    async createDefaultsIfEmpty(seeds: TimetableRowSeed[]) {
      await prisma.$transaction(async (tx) => {
        const count = await tx.timetableRow.count();
        if (count > 0) return;
        await tx.timetableRow.createMany({ data: seeds.map((seed, index) => ({ order: index, ...seed })) });
      });
    }
  };
}
