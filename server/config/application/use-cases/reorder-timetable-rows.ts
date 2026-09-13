import { revalidatePath } from "next/cache";

import type { TimetableRepository } from "../../domain/repositories/timetable-repository";
import { assertExactIdSet, ExactReorderError } from "../../domain/rules/exact-reorder-rule";

export type ReorderTimetableRowsInput = { orderedIds: string[] };

export class ReorderTimetableRowsError extends Error {}

export function createReorderTimetableRowsUseCase(repository: TimetableRepository) {
  return async function reorderTimetableRows(input: ReorderTimetableRowsInput): Promise<void> {
    if (!Array.isArray(input.orderedIds)) {
      throw new ReorderTimetableRowsError("Danh sách sắp xếp không hợp lệ.");
    }
    const existing = await repository.listRowIds();
    try {
      assertExactIdSet(input.orderedIds, existing);
    } catch (error) {
      if (error instanceof ExactReorderError) throw new ReorderTimetableRowsError(error.message);
      throw error;
    }
    await repository.reorderRows(input.orderedIds.map((id) => id.trim()));
    revalidatePath("/timetable");
  };
}
