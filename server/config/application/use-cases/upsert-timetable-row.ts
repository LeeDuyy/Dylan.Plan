import { revalidatePath } from "next/cache";

import type { TimetableRowEntity } from "../../domain/entities/timetable";
import type { TimetableRepository } from "../../domain/repositories/timetable-repository";

export type UpsertTimetableRowInput = {
  id?: string;
  timeLabel: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
};

export class UpsertTimetableRowError extends Error {}

export function createUpsertTimetableRowUseCase(repository: TimetableRepository) {
  return async function upsertTimetableRow(input: UpsertTimetableRowInput): Promise<TimetableRowEntity> {
    const timeLabel = input.timeLabel.trim();
    if (!timeLabel) {
      throw new UpsertTimetableRowError("Khung giờ không được để trống.");
    }

    const row = await repository.upsertRow({
      id: input.id,
      timeLabel,
      mon: input.mon.trim(),
      tue: input.tue.trim(),
      wed: input.wed.trim(),
      thu: input.thu.trim(),
      fri: input.fri.trim(),
      sat: input.sat.trim(),
      sun: input.sun.trim()
    });
    revalidatePath("/timetable");
    return row;
  };
}
