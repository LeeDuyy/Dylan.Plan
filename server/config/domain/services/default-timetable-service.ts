import { DEFAULT_TIMETABLE_ROWS } from "@/lib/timetable-defaults";

import type { TimetableRepository, TimetableRowSeed } from "../repositories/timetable-repository";

function seeds(): TimetableRowSeed[] {
  return DEFAULT_TIMETABLE_ROWS.map((row) => ({
    timeLabel: row.timeLabel,
    mon: row.mon,
    tue: row.tue,
    wed: row.wed,
    thu: row.thu,
    fri: row.fri,
    sat: row.sat,
    sun: row.sun
  }));
}

export type DefaultTimetableServiceDeps = { timetableRepository: TimetableRepository };

export function createDefaultTimetableService(deps: DefaultTimetableServiceDeps) {
  return {
    async ensureDefaultTimetable(): Promise<void> {
      await deps.timetableRepository.createDefaultsIfEmpty(seeds());
    },
    async resetTimetable(): Promise<void> {
      await deps.timetableRepository.deleteAll();
      await deps.timetableRepository.seed(seeds());
    }
  };
}

export type DefaultTimetableService = ReturnType<typeof createDefaultTimetableService>;
