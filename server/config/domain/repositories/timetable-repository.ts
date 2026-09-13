import type { TimetableRowEntity } from "../entities/timetable";

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

export type TimetableRowSeed = Omit<UpsertTimetableRowInput, "id">;

export interface TimetableRepository {
  findAll(): Promise<TimetableRowEntity[]>;
  countRows(): Promise<number>;
  listRowIds(): Promise<string[]>;

  upsertRow(data: UpsertTimetableRowInput): Promise<TimetableRowEntity>;
  deleteRow(id: string): Promise<void>;
  reorderRows(orderedIds: string[]): Promise<void>;

  deleteAll(): Promise<void>;
  createDefaultsIfEmpty(seeds: TimetableRowSeed[]): Promise<void>;
  seed(seeds: TimetableRowSeed[]): Promise<void>;
}
