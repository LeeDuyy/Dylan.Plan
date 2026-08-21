import { revalidatePath } from "next/cache";

import type {
  LegacyMigrationOutcome,
  LegacyMigrationPayload,
  LegacyMigrationService
} from "../../domain/services/legacy-migration-service";

export function createMigrateLegacyDataUseCase(service: LegacyMigrationService) {
  return async function migrateLegacyData(payload: LegacyMigrationPayload): Promise<LegacyMigrationOutcome> {
    const outcome = await service.migrate(payload);
    // Chỉ revalidate khi thật sự có khả năng đã ghi dữ liệu (không bỏ qua vì đã
    // Completed từ trước hoặc vì thiết bị khác đang giữ InProgress).
    if (!outcome.skipped) {
      revalidatePath("/budget");
    }
    return outcome;
  };
}
