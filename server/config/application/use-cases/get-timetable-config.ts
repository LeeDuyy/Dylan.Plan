import type { TimetableRowEntity } from "../../domain/entities/timetable";
import type { TimetableRepository } from "../../domain/repositories/timetable-repository";
import type { DefaultTimetableService } from "../../domain/services/default-timetable-service";

export type GetTimetableConfigDeps = {
  timetableRepository: TimetableRepository;
  defaultTimetableService: DefaultTimetableService;
};

export function createGetTimetableConfigUseCase(deps: GetTimetableConfigDeps) {
  return async function getTimetableConfig(): Promise<TimetableRowEntity[]> {
    await deps.defaultTimetableService.ensureDefaultTimetable();
    return deps.timetableRepository.findAll();
  };
}
