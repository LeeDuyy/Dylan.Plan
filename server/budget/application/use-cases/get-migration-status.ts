import type { LegacyMigrationEntity } from "../../domain/entities/legacy-migration";
import type { LegacyMigrationRepository } from "../../domain/repositories/legacy-migration-repository";

// CRUD đọc thuần trên 1 entity — gọi thẳng repository, không cần domain service.
export function createGetMigrationStatusUseCase(repository: LegacyMigrationRepository) {
  return async function getMigrationStatus(): Promise<LegacyMigrationEntity> {
    return repository.getStatus();
  };
}
