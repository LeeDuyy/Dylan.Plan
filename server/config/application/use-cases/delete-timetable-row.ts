import { revalidatePath } from "next/cache";

import type { TimetableRepository } from "../../domain/repositories/timetable-repository";

export class DeleteTimetableRowError extends Error {}

export function createDeleteTimetableRowUseCase(repository: TimetableRepository) {
  return async function deleteTimetableRow(id: string): Promise<void> {
    const rowIds = await repository.listRowIds();
    if (rowIds.length <= 1) {
      throw new DeleteTimetableRowError("Phải giữ ít nhất một dòng lịch.");
    }
    await repository.deleteRow(id.trim());
    revalidatePath("/timetable");
  };
}
