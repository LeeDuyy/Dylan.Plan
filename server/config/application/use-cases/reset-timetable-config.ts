import { revalidatePath } from "next/cache";

import type { DefaultTimetableService } from "../../domain/services/default-timetable-service";

export function createResetTimetableConfigUseCase(defaultTimetableService: DefaultTimetableService) {
  return async function resetTimetableConfig(): Promise<void> {
    await defaultTimetableService.resetTimetable();
    revalidatePath("/timetable");
  };
}
