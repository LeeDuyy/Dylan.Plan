import type { LegacyMigrationEntity } from "../entities/legacy-migration";

export interface LegacyMigrationRepository {
  getStatus(): Promise<LegacyMigrationEntity>;
  /** Compare-and-swap: chỉ chuyển sang InProgress nếu chưa có thiết bị khác đang chạy (DEC-040). */
  claimInProgress(): Promise<boolean>;
  markCompleted(): Promise<void>;
  markFailed(errorMessage: string): Promise<void>;
}
